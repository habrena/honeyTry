import './env.chain';                       // MORA ostati prvi uvoz

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/database/db';
import { enqueue, queueStatus } from '../../src/detection/analysisQueue';
import { LLM_MODEL, writeClassification } from '../../src/llm/llmClient';
import { budgetStatus } from '../../src/detection/llmBudget';
import { setFakeLLM, resetFakeLLM, fakeLLMCallCount } from '../../src/llm/llmFake';
import { resetDb, closeDb, waitFor, settle } from './db';

/**
 * ============================================================================
 *  GRUPA C — transakcije i ogranicenja baze
 * ============================================================================
 *  Ovo je jedina grupa cije se tvrdnje ne mogu provjeriti ni na jednom drugom
 *  nivou. Zamijenjena transakcija u jedinicnom testu uvijek uspije, pa
 *  ponistavanje, sudar jedinstvenih kljuceva i odbijanje nevalidnih nizova
 *  znakova ostaju nedokazani dok se ne izvrse nad stvarnim sistemom za
 *  upravljanje bazom.
 *
 *  Prva cjelina provjerava ogranicenja koja postoje iskljucivo u bazi, dakle
 *  pretpostavke na kojima pocivaju odluke u kodu. Najvaznija medju njima je
 *  ta da PostgreSQL odbija nulti bajt u tekstualnom polju — bez tog
 *  ogranicenja funkcija koja ga uklanja ne bi imala svrhu.
 *
 *  Druga cjelina provjerava da li grupna analiza zaista pise sve ili nista.
 *  Neuspjeh se izaziva odgovorom dvojnika koji prolazi provjeru indeksa ali
 *  sadrzi vrijednost pogresnog tipa, pa upis pukne tek nakon sto je dio
 *  transakcije vec izvrsen.
 *
 *  Treca cjelina provjerava brojace analiza, gdje je pronadjena nesaglasnost
 *  izmedju dvije putanje koje pisu u iste tabele.
 * ============================================================================
 */

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
const ENUM_PATH = '/api/patient/search?q=a&limit=9999';

/** Zaglavlja pravog preglednika — bez njih detektor prijavi automatizovan alat. */
const browserHeaders = (r: request.Test) =>
  r
    .set('user-agent', UA)
    .set('accept', 'application/json, text/plain, */*')
    .set('accept-language', 'bs-BA,bs;q=0.9,en;q=0.8')
    .set('accept-encoding', 'gzip, deflate, br');

const validVerdict = (eventIndex: number) => ({
  eventIndex,
  classification: 'DATA_EXFILTRATION',
  confidence: 0.8,
  severity: 'high',
  explanation: 'Pokusaj masovnog dohvata podataka.',
});

const sessionVerdict = {
  primaryAttackType: 'DATA_EXFILTRATION',
  threatLevel: 'high',
  summary: 'Posjetilac sistematski pokusava dohvatiti cijelu tabelu pacijenata.',
};

/** Salje jedan cist zahtjev i vraca nastalu sesiju. */
async function seedSession() {
  await browserHeaders(request(app).get('/api/health'));
  return waitFor(async () => db.session.findFirst(), { label: 'sesija' });
}

/** Salje n zahtjeva sa signalima koji nisu hitni, pa ne okidaju pojedinacnu analizu. */
async function seedSignalEvents(n: number) {
  const agent = request.agent(app);
  for (let i = 0; i < n; i++) {
    await browserHeaders(agent.get(`${ENUM_PATH}&n=${i}`) as request.Test);
  }
  await waitFor(async () => (await db.event.count()) >= n || null, {
    label: `${n} eventa`,
  });
  return db.session.findFirstOrThrow();
}

/**
 * Pokrece analizu i osigurava da je posao zaista prihvacen. Funkcija za
 * dodavanje u red tiho odbacuje zahtjev za sesiju koja je jos u obradi.
 */
async function triggerAnalysis(sessionId: string) {
  await waitFor(
    async () => {
      const { pending, running } = queueStatus();
      return pending === 0 && running === 0 ? true : null;
    },
    { label: 'red prazan', timeoutMs: 15_000 },
  );

  await db.session.update({
    where: { id: sessionId },
    data: { lastSeen: new Date(Date.now() - 120_000) },
  });

  await waitFor(
    async () => {
      const before = queueStatus();
      if (before.pending > 0 || before.running > 0) return null;
      enqueue({ sessionId, detections: [] });
      const after = queueStatus();
      return after.pending > 0 || after.running > 0 ? true : null;
    },
    { label: 'posao prihvacen u red', timeoutMs: 15_000, intervalMs: 100 },
  );
}

beforeEach(async () => {
  await resetDb();
  resetFakeLLM();
});

afterAll(async () => {
  resetFakeLLM();
  await closeDb();
});

describe('Grupa C — ogranicenja sistema za upravljanje bazom', () => {
  it('baza odbija nulti bajt u tekstualnom polju', async () => {
  // Ovo je pretpostavka na kojoj pociva cijela funkcija za uklanjanje
  // kontrolnih bajtova. Ako bi baza takav niz prihvatila, funkcija ne bi
  // imala svrhu. Jedinicni test to ne moze dokazati jer provjerava samo
  // transformaciju niza znakova, ne i njegovo prihvatanje.
  const session = await seedSession();
  const before = await db.event.count();     // zahtjev iz seedSession je vec upisan

  await expect(
    db.event.create({
      data: {
        sessionId: session!.id,
        eventType: 'REQUEST_RECEIVED',
        timestamp: new Date(),
        method: 'GET',
        endpoint: '/admin\u0000.php',
        statusCode: 200,
      },
    }),
  ).rejects.toThrow();

  expect(await db.event.count()).toBe(before);   // odbijeni upis nije ostavio trag
});

  it('baza prihvata zamjenu koju proizvodi funkcija za uklanjanje', async () => {
    const session = await seedSession();

    const event = await db.event.create({
      data: {
        sessionId: session!.id,
        eventType: 'REQUEST_RECEIVED',
        timestamp: new Date(),
        method: 'GET',
        endpoint: '/admin\\u0000.php',      // escapovan oblik
        statusCode: 200,
      },
    });

    expect(event.endpoint).toBe('/admin\\u0000.php');
  });

  it('jedan event ne moze imati dvije klasifikacije', async () => {
    // Jedinstvenost je razlog zbog kojeg upis koristi upsert umjesto create.
    const session = await seedSession();
    const event = await db.event.create({
      data: {
        sessionId: session!.id,
        eventType: 'REQUEST_RECEIVED',
        timestamp: new Date(),
        method: 'GET',
        endpoint: '/test',
        statusCode: 200,
      },
    });

    const row = {
      eventId: event.id,
      detector: 'rule',
      category: 'BENIGN_PROBE',
      confidence: 0.5,
      severity: 'low',
      explanation: 'prvi upis',
    };

    await db.classification.create({ data: row });

    await expect(
      db.classification.create({ data: { ...row, explanation: 'drugi upis' } }),
    ).rejects.toThrow();
  });

  it('dvostruki upis kroz writeClassification ne baca nego azurira postojeci red', async () => {
    // Do ovoga dolazi kad je event vec klasifikovan pojedinacno, pa ga
    // grupna analiza pokupi ponovo. Sa create umjesto upsert cijela
    // transakcija bi pukla i nijedan event iz grupe ne bi bio upisan.
    const session = await seedSession();
    const event = await db.event.create({
      data: {
        sessionId: session!.id,
        eventType: 'REQUEST_RECEIVED',
        timestamp: new Date(),
        method: 'GET',
        endpoint: '/test',
        statusCode: 200,
      },
    });

    await writeClassification(event.id, {
      classification: 'RECONNAISSANCE',
      confidence: 0.6,
      severity: 'low',
      explanation: 'prvi',
    });

    await writeClassification(event.id, {
      classification: 'SQL_INJECTION',
      confidence: 0.95,
      severity: 'critical',
      explanation: 'drugi',
    });

    const rows = await db.classification.findMany();

    expect(rows).toHaveLength(1);
    expect(rows[0].category).toBe('SQL_INJECTION');
    expect(rows[0].explanation).toBe('drugi');
  });

  it('event ne moze postojati bez sesije', async () => {
    // Strani kljuc je jedina garancija da zapis o zahtjevu uvijek ima
    // kontekst posjetioca. Bez njega bi rezervna putanja pri padu upisa
    // mogla proizvesti zapis bez sesije.
    await expect(
      db.event.create({
        data: {
          sessionId: randomUUID(),            // ne postoji
          eventType: 'REQUEST_RECEIVED',
          timestamp: new Date(),
          method: 'GET',
          endpoint: '/test',
          statusCode: 200,
        },
      }),
    ).rejects.toThrow();
  });

  it('dvije sesije ne mogu dijeliti isti kljuc otiska', async () => {
    // Jedinstvenost kljuca je razlog zbog kojeg sessionLogger koristi
    // upsert. Bez nje bi isti posjetilac dobijao novu sesiju pri svakom
    // zahtjevu bez kolacica.
    const session = await seedSession();

    await expect(
      db.session.create({
        data: {
          sessionKey: session!.sessionKey,
          cookieId: randomUUID(),
          tokenId: session!.tokenId,
          sourceIp: session!.sourceIp,
          userAgent: session!.userAgent,
          identMethod: 'fingerprint',
          lastSeen: new Date(),
        },
      }),
    ).rejects.toThrow();

    expect(await db.session.count()).toBe(1);
  });
});

describe('Grupa C — atomicnost grupne analize', () => {
  /**
   * Neuspjeh se izaziva odgovorom koji prolazi provjeru indeksa — cijeli
   * broj, u opsegu, bez ponavljanja — ali sadrzi vrijednost pogresnog tipa
   * u polju pouzdanosti. Upis prvog zapisa uspijeva, drugi pukne, pa se
   * transakcija mora ponistiti u cijelosti.
   */
  function poisonedResponse() {
    setFakeLLM((_p, payload: any) =>
      Array.isArray(payload?.events)
        ? {
            events: [
              validVerdict(0),
              { ...validVerdict(1), confidence: 'nije broj' },
            ],
            sessionVerdict,
          }
        : null,
    );
  }

  it('neuspjeh usred transakcije ne ostavlja djelimican upis', async () => {
    poisonedResponse();
    const session = await seedSignalEvents(2);

    await triggerAnalysis(session.id);
    await settle(2500);

    expect(await db.sessionVerdict.count()).toBe(0);
    expect(await db.classification.count()).toBe(0);
  });

  it('eventi ostaju neobradjeni nakon ponistene transakcije', async () => {
    // Ovo je zeljeno ponasanje: neuspjeli pokusaj ne smije potrositi
    // evente, jer bi inace ostali bez klasifikacije zauvijek.
    poisonedResponse();
    const session = await seedSignalEvents(2);

    await triggerAnalysis(session.id);
    await settle(2500);

    const events = await db.event.findMany();

    expect(events).toHaveLength(2);
    expect(events.every((e) => e.analyzedAt === null)).toBe(true);
    expect(events.every((e) => e.sessionVerdictId === null)).toBe(true);
  });

  it('NALAZ: globalni budzet ostaje potrosen iako je sesijski ponisten', async () => {
    // Globalni brojac se uvecava prije poziva i zivi u memoriji, pa ga
    // ponistavanje transakcije ne dodiruje. Sesijski brojac je unutar
    // transakcije i vraca se na staro. Posljedica: odgovor koji dosljedno
    // pukne moze iscrpiti satni plafon a da se sesijski nikad ne uveca.
    const before = budgetStatus().used;
    poisonedResponse();
    const session = await seedSignalEvents(2);

    await triggerAnalysis(session.id);
    await settle(2500);

    const after = await db.session.findUniqueOrThrow({ where: { id: session.id } });

    expect(budgetStatus().used).toBeGreaterThan(before);   // globalno potroseno
    expect(after.analysisCount).toBe(0);                   // sesijski ponisten
    expect(after.lastAnalyzedAt).toBeNull();               // cooldown nije poceo
  });

  it('red nastavlja rad nakon neuspjele transakcije', async () => {
    // Greska se propagira iz klasifikatora u red. Ako ne bi bila uhvacena,
    // jedno od dva mjesta u redu ostalo bi trajno zauzeto.
    poisonedResponse();
    const session = await seedSignalEvents(2);

    await triggerAnalysis(session.id);
    await settle(2500);

    expect(queueStatus()).toEqual({ pending: 0, running: 0 });
  });
});

describe('Grupa C — brojaci analiza', () => {
  it('NALAZ: grupna putanja uvecava brojac dva puta za isti event', async () => {
    // writeClassification uvecava brojac za svaki klasifikovan event, a
    // odmah zatim updateMany u istoj transakciji uvecava ga za sve poslane.
    // Klasifikovani eventi time dobijaju dva, a neklasifikovani jedan.
    // Brojac vise ne odgovara broju stvarno izvrsenih analiza.
    setFakeLLM((_p, payload: any) =>
      Array.isArray(payload?.events)
        ? { events: [validVerdict(0)], sessionVerdict }     // vracen samo prvi
        : null,
    );
    const session = await seedSignalEvents(2);

    await triggerAnalysis(session.id);
    await waitFor(async () => (await db.classification.count()) >= 1 || null, {
      label: 'klasifikacija upisana',
    });
    await settle(600);

    const events = await db.event.findMany({ orderBy: { timestamp: 'asc' } });

    expect(events[0].analyzeCount).toBe(2);    // klasifikovan: dva uvecanja
    expect(events[1].analyzeCount).toBe(1);    // poslan ali nije vracen
  });

  it('pojedinacna putanja uvecava brojac tacno jednom', async () => {
    setFakeLLM((_p, payload: any) =>
      Array.isArray(payload?.events)
        ? null
        : {
            classification: 'SQL_INJECTION',
            confidence: 0.92,
            severity: 'critical',
            explanation: 'Pokusaj izvlacenja tabele korisnika.',
          },
    );

    await request(app)
      .get("/api/patient/search?q=1' UNION SELECT null,username,password FROM users--")
      .set('user-agent', UA);

    const event = await waitFor(
      async () => db.event.findFirst({ where: { analyzedAt: { not: null } } }),
      { label: 'event oznacen kao obradjen' },
    );

    expect(event.analyzeCount).toBe(1);
  });

  it('ponovna analiza ne stvara drugi red klasifikacije', async () => {
    // Event se moze vratiti u obradu kroz rezervne putanje. Jedinstvenost
    // kljuca i upsert zajedno garantuju da broj redova ostaje jedan.
    setFakeLLM((_p, payload: any) =>
      Array.isArray(payload?.events)
        ? { events: [validVerdict(0)], sessionVerdict }
        : null,
    );
    const session = await seedSignalEvents(1);

    await triggerAnalysis(session.id);
    await waitFor(async () => (await db.classification.count()) >= 1 || null, {
      label: 'prva klasifikacija',
    });

    const event = await db.event.findFirstOrThrow();
    await db.event.update({ where: { id: event.id }, data: { analyzedAt: null } });
    await db.session.update({
      where: { id: session.id },
      data: { lastAnalyzedAt: null, analysisCount: 0 },
    });

    await triggerAnalysis(session.id);
    await settle(2500);

    expect(await db.classification.count()).toBe(1);
  });

  it('pravila uvecavaju brojac ali ne prepisuju zakljucak modela', async () => {
    // Ciscenje repova ne smije obezvrijediti vec placenu analizu. Prazan
    // objekat u polju za azuriranje je ono sto to garantuje.
    const session = await seedSession();
    const event = await db.event.create({
      data: {
        sessionId: session!.id,
        eventType: 'REQUEST_RECEIVED',
        timestamp: new Date(),
        method: 'GET',
        endpoint: '/test',
        statusCode: 404,
      },
    });

    await writeClassification(event.id, {
      classification: 'SQL_INJECTION',
      confidence: 0.95,
      severity: 'critical',
      explanation: 'zakljucak modela',
    });

    await db.event.update({ where: { id: event.id }, data: { analyzedAt: null } });

    const { classifySessionByRules } = await import('../../src/detection/ruleClassifier');
    await classifySessionByRules(session!.id);

    const c = await db.classification.findFirstOrThrow();
    const after = await db.event.findUniqueOrThrow({ where: { id: event.id } });

    expect(c.detector).toBe(LLM_MODEL);
    expect(c.category).toBe('SQL_INJECTION');
    expect(after.analyzeCount).toBe(2);        // brojac raste iako zakljucak stoji
    expect(after.analyzedAt).not.toBeNull();
  });
});