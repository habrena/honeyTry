import './env.chain';                       // MORA ostati prvi uvoz

import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/database/db';
import { queueStatus } from '../../src/detection/analysisQueue';
import {
  sweep,
  startSessionSweeper,
  stopSessionSweeper,
} from '../../src/detection/sessionSweeper';
import { TRIGGER_CONFIG } from '../../src/detection/triggerEvaluator';
import { LLM_MODEL } from '../../src/llm/llmClient';
import { setFakeLLM, resetFakeLLM, fakeLLMCallCount } from '../../src/llm/llmFake';
import { resetDb, closeDb, waitFor, settle } from './db';

/**
 * ============================================================================
 *  GRUPA D — periodicno pretrazivanje zaostalih sesija
 * ============================================================================
 *  Zavrsetak sesije nije dogadjaj. Ne postoji zahtjev koji znaci "vise me
 *  nece biti", pa se odsustvo zahtjeva ne moze detektovati iz zahtjeva. Zato
 *  postoji mehanizam koji se sam budi, pretrazuje bazu i trazi sesije koje su
 *  utihnule a imaju neobradjene zapise.
 *
 *  Grupa je izdvojena zbog odnosa prema vremenu. Sve ostale grupe reaguju na
 *  zahtjev koji test salje; ovdje test mora proizvesti stanje koje nastaje
 *  tek protokom vremena. Buduci da lanac prolazi kroz stvarnu bazu, vrijeme
 *  se ne moze simulirati, pa se stanje tisine postize pomjeranjem vremenskih
 *  oznaka unazad.
 *
 *  Ispituje se dvoje: koga mehanizam bira, i sta se sa izabranim desava.
 *  Druga tacka je bitna jer mehanizam namjerno ne odlucuje nista sam —
 *  odluku i dalje donosi evaluator okidaca unutar reda.
 * ============================================================================
 */

const IDLE_MS = TRIGGER_CONFIG.SESSION_IDLE_MS;
const MAX_PER_SWEEP = 20;

const ENUM_PATH = '/api/patient/search?q=a&limit=9999';
const SQLI_PATH =
  "/api/patient/search?q=1' UNION SELECT null,username,password FROM users--";

const batchResponse = {
  events: [
    {
      eventIndex: 0,
      classification: 'DATA_EXFILTRATION',
      confidence: 0.8,
      severity: 'high',
      explanation: 'Pokusaj masovnog dohvata podataka.',
    },
  ],
  sessionVerdict: {
    primaryAttackType: 'DATA_EXFILTRATION',
    threatLevel: 'high',
    summary: 'Posjetilac sistematski pokusava dohvatiti tabelu pacijenata.',
  },
};

/**
 * Stvara sesiju kroz stvaran zahtjev, pa je pomjera unazad u vremenu.
 * Sesija se namjerno ne kreira direktno u bazi, da bi imala sva polja koja
 * joj aplikacija inace dodjeljuje.
 */
async function seedSession(opts: {
  ua: string;
  path?: string;
  idleMs?: number;
}) {
  const before = await db.session.count();
  await request(app).get(opts.path ?? '/api/health').set('user-agent', opts.ua);

  await waitFor(async () => ((await db.session.count()) > before ? true : null), {
    label: `sesija ${opts.ua}`,
  });

  const session = await db.session.findFirstOrThrow({
    where: { userAgent: opts.ua },
  });

  if (opts.idleMs !== undefined) {
    await db.session.update({
      where: { id: session.id },
      data: { lastSeen: new Date(Date.now() - opts.idleMs) },
    });
  }

  return session;
}

/** Ceka da red zavrsi sve poslove nastale iz zahtjeva ili prolaza. */
async function waitForQueueIdle(timeoutMs = 20_000) {
  return waitFor(
    async () => {
      const { pending, running } = queueStatus();
      return pending === 0 && running === 0 ? true : null;
    },
    { label: 'red prazan', timeoutMs },
  );
}
/** Ceka da nijedna sesija vise nema neobradjenih zapisa. */
async function waitForBacklogEmpty(timeoutMs = 20_000) {
  return waitFor(
    async () => ((await sessionsWithBacklog()) === 0 ? true : null),
    { label: 'zaostatak ocisten', timeoutMs },
  );
}

/** Broj sesija koje jos imaju neobradjene zapise. */
async function sessionsWithBacklog(): Promise<number> {
  return db.session.count({ where: { events: { some: { analyzedAt: null } } } });
}

beforeEach(async () => {
  stopSessionSweeper();
  await waitForQueueIdle();
  await resetDb();
  resetFakeLLM();
});

afterEach(() => {
  stopSessionSweeper();
});

afterAll(async () => {
  stopSessionSweeper();
  resetFakeLLM();
  await closeDb();
});

describe('Grupa D — izbor sesija za obradu', () => {
  it('pronalazi utihnulu sesiju sa neobradjenim zapisima', async () => {
    await seedSession({ ua: 'sweep-osnovni', idleMs: IDLE_MS + 30_000 });

    await sweep();
    await waitForQueueIdle();

    expect(await sessionsWithBacklog()).toBe(0);
    expect(await db.classification.count()).toBe(1);
  });

  it('ne dira sesiju koja je jos aktivna', async () => {
    // Sesija koja i dalje salje zahtjeve nije zavrsena, pa je preuranjena
    // analiza i nepotpuna i skupa.
    await seedSession({ ua: 'sweep-aktivna', idleMs: 5_000 });

    await sweep();
    await settle(800);

    expect(await db.classification.count()).toBe(0);
    expect(await sessionsWithBacklog()).toBe(1);
  });

  it('ne dira utihnulu sesiju ciji su svi zapisi vec obradjeni', async () => {
    // Uslov o postojanju neobradjenog zapisa sprjecava da mehanizam u
    // svakom prolazu ponovo dodaje iste sesije u red.
    const session = await seedSession({ ua: 'sweep-gotova', idleMs: IDLE_MS + 30_000 });
    await db.event.updateMany({
      where: { sessionId: session.id },
      data: { analyzedAt: new Date() },
    });

    await sweep();
    await settle(800);

    expect(queueStatus()).toEqual({ pending: 0, running: 0 });
    expect(await db.classification.count()).toBe(0);
  });

  it('GRANICA: ne uzima sesiju koja je utihnula krace od praga', async () => {
    await seedSession({ ua: 'sweep-ispod', idleMs: IDLE_MS - 5_000 });

    await sweep();
    await settle(800);

    expect(await sessionsWithBacklog()).toBe(1);
  });

  it('GRANICA: uzima sesiju koja je utihnula duze od praga', async () => {
    await seedSession({ ua: 'sweep-iznad', idleMs: IDLE_MS + 5_000 });

    await sweep();
    await waitForQueueIdle();

    expect(await sessionsWithBacklog()).toBe(0);
  });

  it(
    'ogranicava broj sesija po jednom prolazu',
    async () => {
      // Postepeno praznjenje zaostatka. Bez ogranicenja bi jedan prolaz nakon
      // duzeg prekida rada dodao u red nekoliko hiljada sesija odjednom.
      const ukupno = MAX_PER_SWEEP + 3;

      for (let i = 0; i < ukupno; i++) {
        await seedSession({ ua: `sweep-masa-${i}`, idleMs: IDLE_MS + (ukupno - i) * 1000 });
      }
      expect(await sessionsWithBacklog()).toBe(ukupno);

      await sweep();
      await waitForQueueIdle(40_000);

      expect(await sessionsWithBacklog()).toBe(ukupno - MAX_PER_SWEEP);
    },
    90_000,
  );

  it(
    'obradjuje najstarije sesije prvo',
    async () => {
      // Poredak po vremenu posljednjeg zahtjeva sprjecava da sesija u
      // zaostatku ostane neobradjena dok pristizu novije.
      const ukupno = MAX_PER_SWEEP + 3;

      for (let i = 0; i < ukupno; i++) {
        // Sto je veci indeks, to je sesija novija.
        await seedSession({ ua: `sweep-red-${i}`, idleMs: IDLE_MS + (ukupno - i) * 1000 });
      }

      await sweep();
      await waitForQueueIdle(40_000);

      const preostale = await db.session.findMany({
        where: { events: { some: { analyzedAt: null } } },
        orderBy: { lastSeen: 'asc' },
        select: { userAgent: true },
      });

      // Neobradjene smiju ostati samo tri najnovije.
      expect(preostale.map((s) => s.userAgent)).toEqual([
        `sweep-red-${ukupno - 3}`,
        `sweep-red-${ukupno - 2}`,
        `sweep-red-${ukupno - 1}`,
      ]);
    },
    90_000,
  );
});

describe('Grupa D — sprega sa redom i evaluatorom', () => {
  it('sesija bez signala zavrsava klasifikacijom pravilima', async () => {
    await seedSession({ ua: 'nikto/2.5', idleMs: IDLE_MS + 30_000 });

    await sweep();
    await waitForQueueIdle();

    const c = await db.classification.findFirstOrThrow();

    expect(c.detector).toBe('rule');
    expect(fakeLLMCallCount()).toBe(0);
  });

  it('sesija sa signalima zavrsava grupnom analizom', async () => {
    setFakeLLM((_p, payload: any) =>
      Array.isArray(payload?.events) ? batchResponse : null,
    );
    await seedSession({
      ua: 'sweep-signal',
      path: ENUM_PATH,
      idleMs: IDLE_MS + 30_000,
    });

    await sweep();
    await waitForQueueIdle();

    const c = await db.classification.findFirstOrThrow();

    expect(c.detector).toBe(LLM_MODEL);
    expect(await db.sessionVerdict.count()).toBe(1);
  });

  it('NALAZ: prolaz nikad ne pokrece pojedinacnu analizu', async () => {
    // Mehanizam u red salje praznu listu detekcija, jer nema pojedinacni
    // zapis nego samo sesiju. Evaluator zato nikad ne prepoznaje hitnu
    // detekciju, pa i najozbiljniji napad zavrsava grupnom analizom.
    // Posljedica je da zakasnjela analiza uvijek ide sporijom putanjom.
    setFakeLLM((_p, payload: any) =>
      Array.isArray(payload?.events) ? batchResponse : null,
    );
    const session = await seedSession({ ua: 'sweep-hitno', path: SQLI_PATH });

    // Ponistavamo tragove pojedinacne analize koju je izazvao sam zahtjev.
    await db.classification.deleteMany();
    await db.event.updateMany({
      where: { sessionId: session.id },
      data: { analyzedAt: null, analyzeCount: 0 },
    });
    await db.session.update({
      where: { id: session.id },
      data: {
        lastSeen: new Date(Date.now() - IDLE_MS - 30_000),
        lastAnalyzedAt: null,
        analysisCount: 0,
      },
    });

    await sweep();
    await waitForQueueIdle();

    expect(await db.sessionVerdict.count()).toBe(1);   // grupna, ne pojedinacna
  });

  it('uzastopni prolaz ne obradjuje vec ocriscenu sesiju', async () => {
    await seedSession({ ua: 'sweep-dvaput', idleMs: IDLE_MS + 30_000 });

    await sweep();
    await waitForQueueIdle();
    const posliJednog = await db.classification.count();

    await sweep();
    await settle(800);

    expect(await db.classification.count()).toBe(posliJednog);
    expect(await sessionsWithBacklog()).toBe(0);
  });

  it('prolaz nad praznom bazom ne baca i ne dodaje nista u red', async () => {
    await expect(sweep()).resolves.toBeUndefined();

    expect(queueStatus()).toEqual({ pending: 0, running: 0 });
  });
});

describe('Grupa D — pokretanje i zaustavljanje', () => {
  it('pokretanje odmah izvrsava prvi prolaz', async () => {
  await seedSession({ ua: 'sweep-start', idleMs: IDLE_MS + 30_000 });

  startSessionSweeper();
  await waitForBacklogEmpty();

  expect(await db.classification.count()).toBe(1);
});

it('zaustavljanje i ponovno pokretanje rade ispravno', async () => {
  await seedSession({ ua: 'sweep-restart-1', idleMs: IDLE_MS + 30_000 });

  startSessionSweeper();
  await waitForBacklogEmpty();
  stopSessionSweeper();

  await seedSession({ ua: 'sweep-restart-2', idleMs: IDLE_MS + 30_000 });
  startSessionSweeper();
  await waitForBacklogEmpty();

  expect(await db.classification.count()).toBe(2);
});
});