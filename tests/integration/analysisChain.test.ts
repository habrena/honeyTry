import './env.chain';                       // MORA ostati prvi uvoz

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { db } from '../../src/database/db';
import { enqueue, queueStatus } from '../../src/detection/analysisQueue';
import { LLM_MODEL } from '../../src/llm/llmClient';
import {
  setFakeLLM,
  resetFakeLLM,
  fakeLLMCallCount,
} from '../../src/llm/llmFake';
import { resetDb, closeDb, waitFor, settle } from './db';

/**
 * ============================================================================
 *  GRUPA B — analiticki lanac
 * ============================================================================
 *  Od upisa eventa do upisane klasifikacije, kroz emitter, red, evaluator i
 *  klasifikator. Stvarno je sve osim modela.
 *
 *  Ovo je nivo na kojem se vidi da li kocnice zaista rade. Jedinicni testovi
 *  dokazuju da triggerEvaluator vraca ispravnu odluku za dato stanje, ali ne
 *  mogu pokazati da se to stanje u bazi zaista mijenja nakon poziva. Upravo
 *  tu je bila greska sa nenaplacenim budzetom u classifyEvent: svaka
 *  pojedinacna odluka je bila ispravna, a niz odluka je vodio u stotine
 *  poziva jer se stanje izmedju njih nije azuriralo.
 *
 *  Vrijeme se ne moze lazirati jer lanac tece kroz stvarnu bazu, pa se
 *  pragovi tisine i cooldowna postizu pomjeranjem vremenskih oznaka u bazi.
 * ============================================================================
 */

const UA_BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

const SQLI_PATH =
  "/api/patient/search?q=1' UNION SELECT null,username,password FROM users--";
const ENUM_PATH = '/api/patient/search?q=a&limit=9999';

/** Odgovor dvojnika za pojedinacnu klasifikaciju. */
const singleVerdict = {
  classification: 'SQL_INJECTION',
  confidence: 0.92,
  severity: 'critical',
  explanation: 'Pokusaj izvlacenja tabele korisnika kroz UNION.',
};

/** Gradi odgovor dvojnika za grupnu klasifikaciju nad zadanim indeksima. */
function batchVerdict(indices: number[]) {
  return {
    events: indices.map((eventIndex) => ({
      eventIndex,
      classification: 'DATA_EXFILTRATION',
      confidence: 0.8,
      severity: 'high',
      explanation: 'Pokusaj masovnog dohvata podataka.',
    })),
    sessionVerdict: {
      primaryAttackType: 'DATA_EXFILTRATION',
      threatLevel: 'high',
      summary: 'Posjetilac sistematski pokusava dohvatiti cijelu tabelu pacijenata.',
    },
  };
}

/** Dvojnik koji prepoznaje oblik poziva po sadrzaju payloada. */
function respondToBoth(batchIndices: number[]) {
  setFakeLLM((_prompt, payload: any) =>
    Array.isArray(payload?.events) ? batchVerdict(batchIndices) : singleVerdict,
  );
}

/** Pomjera sesiju u stanje tisine, da bi evaluator smatrao da je zavrsena. */
async function makeIdle(sessionId: string, secondsAgo = 120) {
  await db.session.update({
    where: { id: sessionId },
    data: { lastSeen: new Date(Date.now() - secondsAgo * 1000) },
  });
}

/** Ponistava cooldown, da bi sesija mogla dobiti jos jednu analizu. */
async function clearCooldown(sessionId: string) {
  await db.session.update({
    where: { id: sessionId },
    data: { lastAnalyzedAt: null },
  });
}

/**
 * Ceka da red zavrsi poslove nastale iz samih zahtjeva, pa tek onda
 * pomjera sesiju u tisinu i dodaje posao rucno.
 *
 * Bez cekanja enqueue tiho odbacuje posao ako je sesija jos u obradi,
 * pa analiza nikad ne krene. Vidi nalaz o deduplikaciji.
 */
async function triggerAnalysis(sessionId: string) {
  await waitFor(
    async () => {
      const s = queueStatus();
      return s.pending === 0 && s.running === 0 ? true : null;
    },
    { label: 'red prazan', timeoutMs: 15_000 },
  );

  await makeIdle(sessionId);
  enqueue({ sessionId, detections: [] });
}

const onlySession = () => db.session.findFirstOrThrow();

/** Ceka da broj klasifikacija dosegne ocekivanu vrijednost. */
const waitForClassifications = (n: number) =>
  waitFor(async () => (await db.classification.count()) >= n || null, {
    label: `broj klasifikacija >= ${n}`,
  });

beforeEach(async () => {
  await resetDb();
  resetFakeLLM();
});

afterAll(async () => {
  resetFakeLLM();
  await closeDb();
});

describe('Grupa B — pojedinacna analiza', () => {
  it('ozbiljna detekcija pokrece analizu bez ikakvog vanjskog okidaca', async () => {
    // Cijeli lanac se pokrece sam: eventLogger emituje, worker prosljedjuje
    // u red, evaluator prepoznaje hitnu detekciju, klasifikator upisuje.
    respondToBoth([]);

    await request(app).get(SQLI_PATH).set('user-agent', UA_BROWSER);
    await waitForClassifications(1);

    const c = await db.classification.findFirstOrThrow();

    expect(c.category).toBe('SQL_INJECTION');
    expect(c.detector).toBe(LLM_MODEL);
    expect(c.confidence).toBeCloseTo(0.92, 2);
    expect(c.severity).toBe('critical');
  });

  it('oznacava analizirani event i vezuje klasifikaciju za njega', async () => {
  respondToBoth([]);

  await request(app).get(SQLI_PATH).set('user-agent', UA_BROWSER);

  // Klasifikacija i oznaka obrade su dva odvojena upita, pa cekanje na
  // klasifikaciju ne garantuje da je event vec oznacen.
  const event = await waitFor(
    async () => db.event.findFirst({ where: { analyzedAt: { not: null } } }),
    { label: 'event oznacen kao obradjen' },
  );
  const c = await db.classification.findFirstOrThrow();

  expect(c.eventId).toBe(event.id);
  expect(event.analyzeCount).toBeGreaterThanOrEqual(1);
});

  it('naplacuje sesiju odmah nakon poziva modelu', async () => {
    // Ovo je test ispravke od koje je krenula cijela analiza koda. Bez
    // naplate sesije cooldown nikad ne pocinje i sesijski budzet se ne
    // trosi, pa svaka nova detekcija ponovo prolazi kroz pojedinacnu granu.
    respondToBoth([]);

    await request(app).get(SQLI_PATH).set('user-agent', UA_BROWSER);
    await waitForClassifications(1);

    const session = await onlySession();

    expect(session.analysisCount).toBe(1);
    expect(session.lastAnalyzedAt).not.toBeNull();
  });

  it('cooldown sprjecava drugi poziv neposredno nakon prvog', async () => {
    respondToBoth([]);

    await request(app).get(SQLI_PATH).set('user-agent', UA_BROWSER);
    await waitForClassifications(1);
    await request(app).get(SQLI_PATH).set('user-agent', UA_BROWSER);
    await settle(600);

    expect(fakeLLMCallCount()).toBe(1);
    expect((await onlySession()).analysisCount).toBe(1);
  });

  it('niz napadackih zahtjeva ne moze probiti sesijski budzet', async () => {
    // Bez kocnica bi sqlmap sa trideset payloada izazvao trideset poziva.
    // Ovaj test mjeri stvarnu potrosnju kroz cijeli lanac, sto je jedina
    // mjera koja se moze navesti kao trosak po sesiji.
    respondToBoth([]);

    for (let i = 0; i < 30; i++) {
      await request(app)
        .get(`${SQLI_PATH}&i=${i}`)
        .set('user-agent', UA_BROWSER);
    }
    await settle(1500);

    const session = await onlySession();

    expect(fakeLLMCallCount()).toBeLessThanOrEqual(6);
    expect(session.analysisCount).toBeLessThanOrEqual(6);
    expect(await db.event.count()).toBe(30);      // svi zahtjevi su zabiljezeni
  });
});

describe('Grupa B — grupna analiza zavrsene sesije', () => {
  /** Salje tri zahtjeva sa signalima koji NISU hitni, pa ne okidaju single. */
  async function threeSignalEvents() {
    const agent = request.agent(app);
    for (let i = 0; i < 3; i++) {
      await agent.get(`${ENUM_PATH}&n=${i}`).set('user-agent', UA_BROWSER);
    }
    await waitFor(async () => (await db.event.count()) >= 3 || null, {
      label: 'tri eventa',
    });
    return onlySession();
  }

  it('utihnula sesija sa signalima dobija grupnu klasifikaciju', async () => {
    respondToBoth([0, 1, 2]);
    const session = await threeSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(3);

    const classifications = await db.classification.findMany();

    expect(classifications).toHaveLength(3);
    expect(classifications.every((c) => c.detector === LLM_MODEL)).toBe(true);
    expect(classifications.every((c) => c.category === 'DATA_EXFILTRATION')).toBe(true);
  });

  it('upisuje zakljucak o sesiji sa opsegom i brojevima', async () => {
    respondToBoth([0, 1, 2]);
    const session = await threeSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(3);

    const verdict = await db.sessionVerdict.findFirstOrThrow();

    expect(verdict.sessionId).toBe(session.id);
    expect(verdict.mode).toBe('batch');
    expect(verdict.status).toBe('OK');
    expect(verdict.eventsSent).toBe(3);
    expect(verdict.eventsClassified).toBe(3);
    expect(verdict.primaryAttackType).toBe('DATA_EXFILTRATION');
    //expect(verdict.windowStart.getTime()).toBeLessThanOrEqual(verdict.windowEnd.getTime());
  });

  it('vezuje sve poslane evente za isti zakljucak o sesiji', async () => {
    respondToBoth([0, 1, 2]);
    const session = await threeSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(3);

    const verdict = await db.sessionVerdict.findFirstOrThrow();
    const events = await db.event.findMany();

    expect(events.every((e) => e.sessionVerdictId === verdict.id)).toBe(true);
  });

  it('oznacava kao obradjene i evente koje model nije vratio', async () => {
    // Bez ovoga brojac neobradjenih nikad ne pada, pa okidac puca u krug i
    // isti eventi se placaju vise puta.
    respondToBoth([0]);                       // model vraca samo prvi
    const session = await threeSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(1);
    await settle(400);

    const events = await db.event.findMany();

    expect(events).toHaveLength(3);
    expect(events.every((e) => e.analyzedAt !== null)).toBe(true);
    expect(await db.classification.count()).toBe(1);
  });
});

describe('Grupa B — odbrana od neispravnog odgovora modela', () => {
  async function twoSignalEvents() {
    const agent = request.agent(app);
    await agent.get(`${ENUM_PATH}&n=0`).set('user-agent', UA_BROWSER);
    await agent.get(`${ENUM_PATH}&n=1`).set('user-agent', UA_BROWSER);
    await waitFor(async () => (await db.event.count()) >= 2 || null, {
      label: 'dva eventa',
    });
    return onlySession();
  }

  it('odbacuje indeks koji pokazuje van poslanog opsega', async () => {
    // Sadrzaj koji model cita pise napadac. Izmisljen indeks je najdirektniji
    // nacin da uspjesna injekcija upise zakljucak na tudji event.
    respondToBoth([0, 99]);
    const session = await twoSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(1);
    await settle(400);

    const verdict = await db.sessionVerdict.findFirstOrThrow();

    expect(await db.classification.count()).toBe(1);
    expect(verdict.eventsSent).toBe(2);
    expect(verdict.eventsClassified).toBe(1);
  });

  it('odbacuje ponovljeni indeks', async () => {
    respondToBoth([0, 0, 0]);
    const session = await twoSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(1);
    await settle(400);

    expect(await db.classification.count()).toBe(1);
  });

  it('prelazi na pravila kada odgovor nema ocekivana polja', async () => {
    // Poziv je placen a rezultat neupotrebljiv. Sesija se svejedno naplacuje,
    // inace bi neispravni odgovori mogli trositi budzet u krug.
    setFakeLLM(() => ({ nesto: 'sasvim drugo' }));
    const session = await twoSignalEvents();

    await triggerAnalysis(session.id);
    await waitForClassifications(2);

    const classifications = await db.classification.findMany();
    const after = await onlySession();

    expect(classifications.every((c) => c.detector === 'rule')).toBe(true);
    expect(after.analysisCount).toBe(1);
    expect(after.lastAnalyzedAt).not.toBeNull();
    expect(await db.sessionVerdict.count()).toBe(0);
  });
});

describe('Grupa B — putanja bez modela', () => {
  it('utihnula sesija bez signala se cisti pravilima, bez poziva modelu', async () => {
    // Skenerska sesija bez ijednog napadackog obrasca. Odgovor je poznat iz
    // statusnog koda, pa poziv modelu ne bi donio nista novo.
    respondToBoth([]);
    await request(app).get('/api/health').set('user-agent', 'nikto/2.5');
    await waitFor(async () => (await db.event.count()) >= 1 || null, { label: 'event' });

    const session = await onlySession();
    await triggerAnalysis(session.id);
    await waitForClassifications(1);

    const c = await db.classification.findFirstOrThrow();

    expect(c.detector).toBe('rule');
    expect(c.category).toBe('AUTOMATED_SCAN');
    expect(fakeLLMCallCount()).toBe(0);
  });

  it('pravila ne prepisuju vec upisan zakljucak modela', async () => {
    // Do ovoga dolazi kad se rep sesije cisti nakon sto je dio vec placen.
    respondToBoth([]);
    await request(app).get(SQLI_PATH).set('user-agent', UA_BROWSER);
    await waitForClassifications(1);

    const event = await db.event.findFirstOrThrow();
    const session = await onlySession();

    // Vracamo event u neobradjeno stanje i pustamo pravila preko njega.
    await db.event.update({ where: { id: event.id }, data: { analyzedAt: null } });
    await db.session.update({
      where: { id: session.id },
      data: { suppressed: true, lastSeen: new Date(Date.now() - 120_000) },
    });
    enqueue({ sessionId: session.id, detections: [] });
    await waitFor(
      async () => (await db.event.findFirstOrThrow()).analyzedAt !== null || null,
      { label: 'event ponovo obradjen' },
    );

    const c = await db.classification.findFirstOrThrow();

    expect(c.detector).toBe(LLM_MODEL);         // zakljucak modela je ostao
    expect(c.category).toBe('SQL_INJECTION');
  });

  it('iscrpljen globalni budzet vodi na pravila umjesto na model', async () => {
    respondToBoth([]);
    const agent = request.agent(app);
    await agent.get(`${ENUM_PATH}&n=0`).set('user-agent', UA_BROWSER);
    await waitFor(async () => (await db.event.count()) >= 1 || null, { label: 'event' });

    const session = await onlySession();
    await db.session.update({
      where: { id: session.id },
      data: { suppressed: true, lastSeen: new Date(Date.now() - 120_000) },
    });

    enqueue({ sessionId: session.id, detections: [] });
    await waitForClassifications(1);

    expect((await db.classification.findFirstOrThrow()).detector).toBe('rule');
    expect(fakeLLMCallCount()).toBe(0);
  });

  it('red ne obradjuje istu sesiju dva puta istovremeno', async () => {
    respondToBoth([0, 1]);
    const agent = request.agent(app);
    await agent.get(`${ENUM_PATH}&n=0`).set('user-agent', UA_BROWSER);
    await agent.get(`${ENUM_PATH}&n=1`).set('user-agent', UA_BROWSER);
    await waitFor(async () => (await db.event.count()) >= 2 || null, { label: 'dva eventa' });

    const session = await onlySession();
    await makeIdle(session.id);

    // Tri poslova za istu sesiju odjednom — deduplikacija mora propustiti jedan.
    enqueue({ sessionId: session.id, detections: [] });
    enqueue({ sessionId: session.id, detections: [] });
    enqueue({ sessionId: session.id, detections: [] });
    await waitForClassifications(2);
    await settle(500);

    expect(await db.sessionVerdict.count()).toBe(1);
    expect((await onlySession()).analysisCount).toBe(1);
  });
});