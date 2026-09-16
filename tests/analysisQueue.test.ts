import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ============================================================================
 *  analysisQueue — jedinicni testovi SA mockom
 * ============================================================================
 *  Red nije puka veza medju komponentama nego algoritam sa vlastitim
 *  stanjem: tri strukture (niz na cekanju, skup u redu, skup u obradi) koje
 *  moraju ostati saglasne kroz asinhrone prelaze. Greske u takvom kodu se ne
 *  vide pregledom — izostavljen delete u finally trajno zaglavi red, a
 *  pogresan redoslijed brisanja rusi deduplikaciju.
 *
 *  Tehnika: poslovi se drze otvorenim tako sto shouldAnalyzeSession vraca
 *  promise koji test razrjesava rucno. Time se stanje reda moze ocitati u
 *  tacno odredjenom trenutku, umjesto da se pogadja kroz cekanje.
 *
 *  Modul drzi stanje na svom nivou, pa se ucitava iznova pred svaki test.
 *  Bez toga bi poslovi iz jednog testa ostajali u redu sljedeceg.
 * ============================================================================
 */

const { shouldAnalyzeMock, batchMock, singleMock, ruleMock, dbMock } = vi.hoisted(() => ({
  shouldAnalyzeMock: vi.fn(),
  batchMock: vi.fn(),
  singleMock: vi.fn(),
  ruleMock: vi.fn(),
  dbMock: { event: { findFirst: vi.fn() } },
}));

vi.mock('../src/detection/triggerEvaluator', () => ({
  shouldAnalyzeSession: shouldAnalyzeMock,
  TRIGGER_CONFIG: { SESSION_IDLE_MS: 90_000 },
}));
vi.mock('../src/classification/classifySessionBatch', () => ({ classifySessionBatch: batchMock }));
vi.mock('../src/classification/classifyEvent', () => ({ classifyEvent: singleMock }));
vi.mock('../src/detection/ruleClassifier', () => ({ classifySessionByRules: ruleMock }));
vi.mock('../src/database/db', () => ({ db: dbMock }));

type Queue = typeof import('../src/detection/analysisQueue');
let queue: Queue;

const NONE = { shouldAnalyze: false, mode: 'none', reason: 'test' };
const decision = (mode: string) => ({ shouldAnalyze: true, mode, reason: 'test' });

/** Promise koji test razrjesava kad zeli, da bi posao ostao otvoren. */
function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

/** Prazni mikro i makro zadatke da bi se lanac .finally -> drain dovrsio. */
async function flush(times = 6) {
  for (let i = 0; i < times; i++) await new Promise((r) => setImmediate(r));
}

const gates = new Map<string, ReturnType<typeof deferred<any>>>();

/**
 * Prebacuje shouldAnalyzeSession u rezim u kojem svaki posao visi dok ga
 * test ne pusti. Obavezno za sve testove o konkurentnosti.
 */
function useGates() {
  shouldAnalyzeMock.mockImplementation((sid: string) => {
    if (!gates.has(sid)) gates.set(sid, deferred<any>());
    return gates.get(sid)!.promise;
  });
}

const release = (sid: string, d: unknown = NONE) => gates.get(sid)!.resolve(d);
const fail = (sid: string, e: unknown) => gates.get(sid)!.reject(e);

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  gates.clear();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  shouldAnalyzeMock.mockResolvedValue(NONE);
  queue = await import('../src/detection/analysisQueue');
});

describe('analysisQueue — osnovni tok', () => {
  it('pocinje praznog reda', () => {
    expect(queue.queueStatus()).toEqual({ pending: 0, running: 0 });
  });

  it('prosljedjuje sesiju i njene detekcije evaluatoru', async () => {
    const detections = [{ type: 'SQL_INJECTION', confidence: 0.95 }];

    queue.enqueue({ sessionId: 'A', eventId: 'e1', detections });
    await flush();

    expect(shouldAnalyzeMock).toHaveBeenCalledWith('A', detections);
  });

  it('prazni red do kraja kada su svi poslovi odbijeni', async () => {
    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(queue.queueStatus()).toEqual({ pending: 0, running: 0 });
  });

  it('ne poziva nijedan klasifikator kada evaluator odbije sesiju', async () => {
    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(ruleMock).not.toHaveBeenCalled();
    expect(singleMock).not.toHaveBeenCalled();
    expect(batchMock).not.toHaveBeenCalled();
  });
});

describe('analysisQueue — usmjeravanje po rezimu', () => {
  it('rezim rule poziva klasifikaciju pravilima', async () => {
    shouldAnalyzeMock.mockResolvedValue(decision('rule'));

    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(ruleMock).toHaveBeenCalledWith('A');
    expect(batchMock).not.toHaveBeenCalled();
  });

  it('rezim batch poziva grupnu klasifikaciju', async () => {
    shouldAnalyzeMock.mockResolvedValue(decision('batch'));
    batchMock.mockResolvedValue(null);

    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(batchMock).toHaveBeenCalledWith('A');
  });

  it('rezim single koristi proslijedjeni eventId bez upita u bazu', async () => {
    shouldAnalyzeMock.mockResolvedValue(decision('single'));
    singleMock.mockResolvedValue(null);

    queue.enqueue({ sessionId: 'A', eventId: 'e1', detections: [] });
    await flush();

    expect(singleMock).toHaveBeenCalledWith('e1');
    expect(dbMock.event.findFirst).not.toHaveBeenCalled();
  });

  it('rezim single bez eventId dohvata najstariji neobradjen event', async () => {
    // Do ovoga dolazi kad posao stigne od sweepera, koji nema pojedinacni
    // event nego samo sesiju.
    shouldAnalyzeMock.mockResolvedValue(decision('single'));
    dbMock.event.findFirst.mockResolvedValue({ id: 'e-najstariji' });
    singleMock.mockResolvedValue(null);

    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(dbMock.event.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { sessionId: 'A', analyzedAt: null },
        orderBy: { timestamp: 'asc' },
      }),
    );
    expect(singleMock).toHaveBeenCalledWith('e-najstariji');
  });

  it('rezim single odustaje kada u bazi nema neobradjenog eventa', async () => {
    shouldAnalyzeMock.mockResolvedValue(decision('single'));
    dbMock.event.findFirst.mockResolvedValue(null);

    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(singleMock).not.toHaveBeenCalled();
    expect(queue.queueStatus().running).toBe(0);   // mjesto je oslobodjeno
  });

  it('nepoznat rezim ne pokrece nijedan klasifikator', async () => {
    shouldAnalyzeMock.mockResolvedValue(decision('izmisljeno'));

    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(ruleMock).not.toHaveBeenCalled();
    expect(singleMock).not.toHaveBeenCalled();
    expect(batchMock).not.toHaveBeenCalled();
  });
});

describe('analysisQueue — deduplikacija po sesiji', () => {
  it('odbija sesiju koja je vec u obradi', async () => {
    // Skener salje stotine zahtjeva u sekundi; bez ovoga bi svaki pokrenuo
    // vlastitu evaluaciju iste sesije.
    useGates();

    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(shouldAnalyzeMock).toHaveBeenCalledTimes(1);
    expect(queue.queueStatus()).toEqual({ pending: 0, running: 1 });
  });

  it('odbija sesiju koja vec ceka u redu', async () => {
    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'B', detections: [] });

    queue.enqueue({ sessionId: 'C', detections: [] });
    queue.enqueue({ sessionId: 'C', detections: [] });

    expect(queue.queueStatus()).toEqual({ pending: 1, running: 2 });
  });

  it('ne deduplikuje razlicite sesije', async () => {
    useGates();

    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'B', detections: [] });
    await flush();

    expect(shouldAnalyzeMock).toHaveBeenCalledTimes(2);
  });

  it('prima istu sesiju ponovo nakon sto je obrada zavrsena', async () => {
    // Deduplikacija je privremena, ne trajna: sesija koja nastavi slati
    // zahtjeve mora moci ponovo uci u red.
    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });
    release('A');
    await flush();

    gates.clear();
    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(shouldAnalyzeMock).toHaveBeenCalledTimes(2);
  });
});

describe('analysisQueue — ogranicena konkurentnost', () => {
  it('pokrece najvise dva posla istovremeno', async () => {
    useGates();

    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'B', detections: [] });
    queue.enqueue({ sessionId: 'C', detections: [] });
    queue.enqueue({ sessionId: 'D', detections: [] });
    await flush();

    expect(queue.queueStatus()).toEqual({ pending: 2, running: 2 });
    expect(shouldAnalyzeMock).toHaveBeenCalledTimes(2);
  });

  it('pokrece sljedeci posao cim se jedno mjesto oslobodi', async () => {
    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'B', detections: [] });
    queue.enqueue({ sessionId: 'C', detections: [] });

    release('A');
    await flush();

    expect(queue.queueStatus()).toEqual({ pending: 0, running: 2 });
    expect(shouldAnalyzeMock).toHaveBeenCalledWith('C', []);
  });

  it('postuje redoslijed dolaska', async () => {
    // Niz na cekanju radi po principu prvi dosao, prvi obradjen. Bez toga
    // bi sesija mogla ostati u redu neograniceno dugo.
    useGates();
    for (const sid of ['A', 'B', 'C', 'D']) {
      queue.enqueue({ sessionId: sid, detections: [] });
    }

    release('A');
    await flush();
    expect(shouldAnalyzeMock).toHaveBeenLastCalledWith('C', []);

    release('B');
    await flush();
    expect(shouldAnalyzeMock).toHaveBeenLastCalledWith('D', []);
  });

  it('prazni cijeli zaostatak kada se svi poslovi razrijese', async () => {
    useGates();
    for (const sid of ['A', 'B', 'C', 'D', 'E']) {
      queue.enqueue({ sessionId: sid, detections: [] });
    }

    for (const sid of ['A', 'B', 'C', 'D', 'E']) {
      release(sid);
      await flush();
    }

    expect(queue.queueStatus()).toEqual({ pending: 0, running: 0 });
    expect(shouldAnalyzeMock).toHaveBeenCalledTimes(5);
  });
});

describe('analysisQueue — izolacija gresaka', () => {
  it('oslobadja mjesto i kada posao padne', async () => {
    // Brisanje iz skupa u obradi stoji u finally. Da stoji u then, jedan
    // pad bi trajno zauzeo jedno od dva mjesta.
    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });

    fail('A', new Error('evaluator pukao'));
    await flush();

    expect(queue.queueStatus()).toEqual({ pending: 0, running: 0 });
  });

  it('nastavlja sa sljedecim poslom nakon pada prethodnog', async () => {
    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'B', detections: [] });
    queue.enqueue({ sessionId: 'C', detections: [] });

    fail('A', new Error('pad'));
    await flush();

    expect(shouldAnalyzeMock).toHaveBeenCalledWith('C', []);
    expect(queue.queueStatus().running).toBe(2);
  });

  it('ne stvara neuhvacenu gresku kada posao padne', async () => {
    // Red pokrece poslove sa void, pa bi neuhvacena greska zavrsila kao
    // unhandled rejection i, zavisno od konfiguracije, srusila proces.
    const rejections: unknown[] = [];
    const onRejection = (e: unknown) => rejections.push(e);
    process.on('unhandledRejection', onRejection);

    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });
    fail('A', new Error('pad'));
    await flush();
    process.off('unhandledRejection', onRejection);

    expect(rejections).toHaveLength(0);
  });

  it('podnosi pad klasifikatora jednako kao pad evaluatora', async () => {
    shouldAnalyzeMock.mockResolvedValue(decision('batch'));
    batchMock.mockRejectedValue(new Error('LLM nedostupan'));

    queue.enqueue({ sessionId: 'A', detections: [] });
    await flush();

    expect(queue.queueStatus()).toEqual({ pending: 0, running: 0 });
  });

  it('pad jedne sesije ne utice na drugu koja tece paralelno', async () => {
    useGates();
    queue.enqueue({ sessionId: 'A', detections: [] });
    queue.enqueue({ sessionId: 'B', detections: [] });

    fail('A', new Error('pad'));
    await flush();
    expect(queue.queueStatus().running).toBe(1);

    release('B', decision('rule'));
    await flush();

    expect(ruleMock).toHaveBeenCalledWith('B');
    expect(queue.queueStatus().running).toBe(0);
  });
});