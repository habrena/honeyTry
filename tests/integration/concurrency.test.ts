import './env.chain';                       // MORA ostati prvi uvoz

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/database/db';
import { queueStatus } from '../../src/detection/analysisQueue';
import { writeClassification } from '../../src/llm/llmClient';
import { classifySessionByRules } from '../../src/detection/ruleClassifier';
import { setFakeLLM, resetFakeLLM } from '../../src/llm/llmFake';
import { resetDb, closeDb, waitFor, settle } from './db';

/**
 * ============================================================================
 *  GRUPA E — istovremenost
 * ============================================================================
 *  Sve prethodne grupe salju jedan zahtjev i cekaju ishod. Ovdje se salje
 *  vise zahtjeva odjednom, cime se ispituje ono sto se ne moze izazvati na
 *  zahtjev nego samo uciniti vjerovatnim: dva izvrsavanja koja istovremeno
 *  pisu u isti red, dva posla koja istovremeno traze isto mjesto u redu, i
 *  upis koji se izvrsi dok drugi jos traje.
 *
 *  Honeypot je na ovo osjetljiviji od obicne aplikacije. Automatizovani alat
 *  salje stotine zahtjeva u sekundi sa iste adrese i sa istim nizom za
 *  identifikaciju klijenta, dakle sa istim otiskom. Svi ti zahtjevi ciljaju
 *  isti red u tabeli sesija, sto je najgori moguci obrazac opterecenja.
 *
 *  Metodoloska napomena: testovi ove vrste ne dokazuju odsustvo utrkivanja
 *  nego samo da se ono nije pojavilo pod ispitanim opterecenjem. Zbog toga
 *  se tvrdnje odnose na nepromjenljive osobine sistema — broj redova, broj
 *  izgubljenih zapisa — a ne na redoslijed izvrsavanja.
 * ============================================================================
 */

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
const SQLI_PATH =
  "/api/patient/search?q=1' UNION SELECT null,username,password FROM users--";

const PARALELNIH = 20;

const singleVerdict = {
  classification: 'SQL_INJECTION',
  confidence: 0.92,
  severity: 'critical',
  explanation: 'Pokusaj izvlacenja tabele korisnika.',
};

/** Prati najveci broj istovremenih obrada tokom izvrsavanja. */
function pratiRed() {
  let max = 0;
  const t = setInterval(() => {
    const { running } = queueStatus();
    if (running > max) max = running;
  }, 10);
  return {
    stop(): number {
      clearInterval(t);
      return max;
    },
  };
}

async function waitForQueueIdle(timeoutMs = 30_000) {
  return waitFor(
    async () => {
      const { pending, running } = queueStatus();
      return pending === 0 && running === 0 ? true : null;
    },
    { label: 'red prazan', timeoutMs },
  );
}

/** Stvara sesiju sa jednim zapisom, spremnim za klasifikaciju. */
async function seedEvent(endpoint = '/test') {
  await request(app).get('/api/health').set('user-agent', UA);
  const session = await waitFor(async () => db.session.findFirst(), {
    label: 'sesija',
  });

  return db.event.create({
    data: {
      sessionId: session!.id,
      eventType: 'REQUEST_RECEIVED',
      timestamp: new Date(),
      method: 'GET',
      endpoint,
      statusCode: 404,
    },
  });
}

beforeEach(async () => {
  await waitForQueueIdle();
  await resetDb();
  resetFakeLLM();
});

afterAll(async () => {
  resetFakeLLM();
  await closeDb();
});

describe('Grupa E — identifikacija posjetioca pod paralelnim opterecenjem', () => {
  it(
    'istovremeni zahtjevi istog posjetioca bez kolacica daju jednu sesiju',
    async () => {
      // Najgori obrazac za sistem identifikacije. Nijedan zahtjev ne nosi
      // kolacic, svi racunaju isti otisak i svi istovremeno ciljaju isti red.
      // Ako spojena operacija umetanja i azuriranja nije atomicna, dio
      // zahtjeva zavrsava greskom jedinstvenosti.
      await Promise.all(
        Array.from({ length: PARALELNIH }, () =>
          request(app).get('/api/health').set('user-agent', UA),
        ),
      );

      await waitFor(
        async () => ((await db.event.count()) >= PARALELNIH ? true : null),
        { label: `${PARALELNIH} zapisa`, timeoutMs: 30_000 },
      );

      expect(await db.session.count()).toBe(1);
    },
    60_000,
  );

  it(
    'nijedan istovremeni zahtjev ne ostaje nezabiljezen',
    async () => {
      // Ako identifikacija sesije pukne, zapis se tiho preskace. Broj
      // zapisa je zato jedina pouzdana mjera gubitka podataka.
      await Promise.all(
        Array.from({ length: PARALELNIH }, (_, i) =>
          request(app).get(`/api/health?n=${i}`).set('user-agent', UA),
        ),
      );

      await waitFor(
        async () => ((await db.event.count()) >= PARALELNIH ? true : null),
        { label: `${PARALELNIH} zapisa`, timeoutMs: 30_000 },
      );

      expect(await db.event.count()).toBe(PARALELNIH);
    },
    60_000,
  );

  it(
    'istovremeni zahtjevi razlicitih posjetilaca daju odvojene sesije',
    async () => {
      const broj = 10;

      await Promise.all(
        Array.from({ length: broj }, (_, i) =>
          request(app).get('/api/health').set('user-agent', `paralelni-agent-${i}`),
        ),
      );

      await waitFor(async () => ((await db.event.count()) >= broj ? true : null), {
        label: `${broj} zapisa`,
        timeoutMs: 30_000,
      });

      expect(await db.session.count()).toBe(broj);
      expect(await db.event.count()).toBe(broj);
    },
    60_000,
  );

  it(
    'istovremeni zahtjevi sa istim kolacicem koriste istu sesiju',
    async () => {
      // Grana sa kolacicem je odvojena od grane sa otiskom i koristi
      // obicno azuriranje umjesto spojene operacije, pa je vrijedi
      // ispitati posebno.
      const agent = request.agent(app);
      await agent.get('/api/health').set('user-agent', UA);   // preuzima kolacic

      await Promise.all(
        Array.from({ length: PARALELNIH }, (_, i) =>
          agent.get(`/api/health?n=${i}`).set('user-agent', UA),
        ),
      );

      await waitFor(
        async () => ((await db.event.count()) >= PARALELNIH + 1 ? true : null),
        { label: 'svi zapisi', timeoutMs: 30_000 },
      );

      expect(await db.session.count()).toBe(1);
    },
    60_000,
  );
});

describe('Grupa E — red za obradu pod opterecenjem', () => {
  it(
    'broj istovremenih obrada nikad ne prelazi dozvoljeni',
    async () => {
      // Ogranicenje postoji da skener sa stotinama zahtjeva ne bi pokrenuo
      // stotine paralelnih evaluacija i iscrpio veze prema bazi.
      const broj = 12;
      const mjerac = pratiRed();

      await Promise.all(
        Array.from({ length: broj }, (_, i) =>
          request(app).get('/api/health').set('user-agent', `opterecenje-${i}`),
        ),
      );
      await waitForQueueIdle();

      expect(mjerac.stop()).toBeLessThanOrEqual(2);
    },
    60_000,
  );

  it(
    'nalet zahtjeva iste sesije ne umnozava analize',
    async () => {
      // Deduplikacija i vremenski razmak zajedno ogranicavaju broj analiza
      // bez obzira na to koliko zahtjeva stigne odjednom.
      setFakeLLM((_p, payload: any) =>
        Array.isArray(payload?.events) ? null : singleVerdict,
      );

      await Promise.all(
        Array.from({ length: 30 }, (_, i) =>
          request(app).get(`${SQLI_PATH}&n=${i}`).set('user-agent', UA),
        ),
      );
      await waitForQueueIdle();
      await settle(800);

      const session = await db.session.findFirstOrThrow();

      expect(await db.event.count()).toBe(30);
      expect(session.analysisCount).toBeLessThanOrEqual(6);
      expect(await db.sessionVerdict.count()).toBeLessThanOrEqual(6);
    },
    60_000,
  );

  it(
    'sve sesije iz naleta budu obradjene, nijedna ne ostane u redu',
    async () => {
      // Mjesto u redu se oslobadja u zavrsnoj grani, koja se izvrsava i pri
      // gresci. Da to izostane, red bi se postepeno zagusio i analiza bi
      // tiho prestala.
      const broj = 10;

      await Promise.all(
        Array.from({ length: broj }, (_, i) =>
          request(app).get('/api/health').set('user-agent', `nalet-${i}`),
        ),
      );
      await waitForQueueIdle();

      expect(queueStatus()).toEqual({ pending: 0, running: 0 });
    },
    60_000,
  );
});

describe('Grupa E — istovremeni upisi u iste tabele', () => {
  it('istovremeni upis zakljucka za isti zapis ne stvara dva reda', async () => {
    // Do ovoga dolazi kad pojedinacna i grupna analiza istovremeno pokriju
    // isti zapis. Jedinstvenost kljuca i spojena operacija zajedno moraju
    // garantovati jedan red, bez obzira na redoslijed izvrsavanja.
    const event = await seedEvent();

    await Promise.allSettled([
      writeClassification(event.id, { ...singleVerdict, explanation: 'prvi' }),
      writeClassification(event.id, { ...singleVerdict, explanation: 'drugi' }),
      writeClassification(event.id, { ...singleVerdict, explanation: 'treci' }),
    ]);

    expect(await db.classification.count()).toBe(1);
  });

  it('istovremeni upisi za razlicite zapise svi prolaze', async () => {
    const session = await waitFor(
      async () => {
        await request(app).get('/api/health').set('user-agent', UA);
        return db.session.findFirst();
      },
      { label: 'sesija' },
    );

    const events = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        db.event.create({
          data: {
            sessionId: session!.id,
            eventType: 'REQUEST_RECEIVED',
            timestamp: new Date(),
            method: 'GET',
            endpoint: `/test-${i}`,
            statusCode: 404,
          },
        }),
      ),
    );

    await Promise.all(
      events.map((e) =>
        writeClassification(e.id, { ...singleVerdict, explanation: e.endpoint }),
      ),
    );

    expect(await db.classification.count()).toBe(8);
  });

  it('istovremena klasifikacija pravilima iste sesije ne duplira zakljucke', async () => {
  // Do ovoga moze doci kad mehanizam pretrazivanja i red istovremeno
  // pokrenu ciscenje iste sesije. Transakcija i spojena operacija moraju
  // dati isti broj redova kao i jedan poziv.
  const event = await seedEvent();

  // Sesija sadrzi i zapis nastao iz zahtjeva kojim je stvorena, pa se
  // ocekivani broj mjeri umjesto da se pretpostavlja.
  const ocekivano = await db.event.count({
    where: { sessionId: event.sessionId, analyzedAt: null },
  });

  await Promise.allSettled([
    classifySessionByRules(event.sessionId),
    classifySessionByRules(event.sessionId),
    classifySessionByRules(event.sessionId),
  ]);

  const rows = await db.classification.findMany();

  expect(rows).toHaveLength(ocekivano);
  expect(rows.every((r) => r.detector === 'rule')).toBe(true);
});
});