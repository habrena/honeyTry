import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * ============================================================================
 *  triggerEvaluator — jedinicni testovi SA mockom
 * ============================================================================
 *  Funkcija odlucuje da li se sesija uopste analizira i na koji nacin. Odluka
 *  zavisi od pet velicina koje funkcija sama dohvaca (stanje sesije, broj
 *  neobradjenih eventa, broj eventa sa signalima, globalni budzet i trenutno
 *  vrijeme), pa se nijedna grana ne moze izolovati bez zamjene tih izvora.
 *
 *  Vrijeme je fiksirano laznim tajmerom nad objektom Date. Bez toga se pragovi
 *  tisine (90 s) i cooldowna (60 s) ne mogu pogoditi na granici, a upravo su
 *  granice mjesta na kojima se greske u poredjenju najcesce kriju.
 *
 *  Pokriveno je i ono sto funkcija NE radi: koji upit izostaje, koja provjera
 *  se preskace i koja detekcija se odbacuje. Redoslijed provjera je ovdje
 *  jednako vazan kao i sami pragovi.
 * ============================================================================
 */

const { dbMock, hasBudgetMock } = vi.hoisted(() => ({
  dbMock: {
    session: { findUnique: vi.fn() },
    event: { count: vi.fn() },
  },
  hasBudgetMock: vi.fn(),
}));

vi.mock('../src/database/db', () => ({ db: dbMock }));
vi.mock('../src/detection/llmBudget', () => ({
  hasBudget: hasBudgetMock,
  consumeBudget: vi.fn(() => true),
  budgetStatus: vi.fn(() => ({ used: 0, max: 100 })),
}));

import { shouldAnalyzeSession, TRIGGER_CONFIG } from '../src/detection/triggerEvaluator';

const SID = 'sess-1';
const NOW = new Date('2026-01-01T12:00:00.000Z');

/** Trenutak koliko sekundi prije fiksiranog sada. */
const secAgo = (s: number) => new Date(NOW.getTime() - s * 1000);
/** Trenutak koliko milisekundi prije fiksiranog sada. */
const msAgo = (ms: number) => new Date(NOW.getTime() - ms);

/** Postavlja stanje sesije; podrazumijevano je aktivna, bez potrosenog budzeta. */
function setSession(over: Record<string, unknown> = {}) {
  dbMock.session.findUnique.mockResolvedValue({
    lastSeen: secAgo(1),          // aktivna
    lastAnalyzedAt: null,         // nikad analizirana -> nema cooldowna
    analysisCount: 0,
    suppressed: false,
    ...over,
  });
}

/**
 * Oba brojanja idu kroz isti db.event.count, pa se razlikuju po uslovu:
 * upit sa signalCount broji evente sa detekcijama, onaj bez njega sve
 * neobradjene. Razdvajanje po argumentu je pouzdanije od nizanja
 * mockResolvedValueOnce, koje bi zavisilo od redoslijeda poziva.
 */
function setCounts(unclassified: number, withSignals = unclassified) {
  dbMock.event.count.mockImplementation(({ where }: any) =>
    Promise.resolve(where.signalCount ? withSignals : unclassified),
  );
}

const SQLI = { type: 'SQL_INJECTION', confidence: 0.95 };

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  hasBudgetMock.mockReturnValue(true);
  setSession();
  setCounts(5);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('triggerEvaluator — rani izlazi', () => {
  it('odbija nepostojecu sesiju i ne broji evente', async () => {
    dbMock.session.findUnique.mockResolvedValue(null);

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d).toEqual({ shouldAnalyze: false, mode: 'none', reason: 'Sesija ne postoji' });
    expect(dbMock.event.count).not.toHaveBeenCalled();   // nema suvisnog upita
  });

  it('odbija sesiju bez neobradjenih eventa', async () => {
    // Najcesci ishod u normalnom radu: sweeper prodje kroz sesiju koju je
    // prethodni prolaz vec ocistio.
    setCounts(0);

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.shouldAnalyze).toBe(false);
    expect(d.reason).toContain('Nema neobradjenih');
  });
});

describe('triggerEvaluator — sesijski budzet', () => {
  it('prelazi na pravila kada je budzet potrosen a sesija utihnula', async () => {
    // Bez ove grane broj neobradjenih eventa rastao bi neograniceno, jer
    // sesija koja je potrosila budzet nikad ne bi bila ocisceni.
    setSession({
      analysisCount: TRIGGER_CONFIG.MAX_CALLS_PER_SESSION,
      lastSeen: secAgo(120),
    });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'rule' });
    expect(d.reason).toContain('Budzet potrosen');
  });

  it('ne radi nista kada je budzet potrosen a sesija jos aktivna', async () => {
    setSession({ analysisCount: TRIGGER_CONFIG.MAX_CALLS_PER_SESSION, lastSeen: secAgo(1) });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.shouldAnalyze).toBe(false);
    expect(d.mode).toBe('none');
  });

  it('GRANICA: jedan poziv ispod limita jos nije potrosen budzet', async () => {
    // Poredjenje je >=, pa je posljednji dozvoljeni poziv onaj sa
    // analysisCount = MAX - 1.
    setSession({ analysisCount: TRIGGER_CONFIG.MAX_CALLS_PER_SESSION - 1 });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'single' });
  });

  it('tretira potisnutu sesiju kao potrosen budzet', async () => {
    // suppressed je rucni prekidac; ponasa se isto kao iscrpljen budzet,
    // ukljucujuci i ciscenje pravilima kad sesija utihne.
    setSession({ suppressed: true, analysisCount: 0, lastSeen: secAgo(120) });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'rule' });
  });

  it('NALAZ: grana potrosenog budzeta ne provjerava cooldown', async () => {
    // Cooldown se racuna tek nakon obje provjere budzeta. Sesija sa
    // potrosenim budzetom se zato cisti pravilima i unutar cooldowna.
    // Posljedica je bezopasna jer pravila ne kostaju nista i jer se
    // neobradjeni eventi njima iscrpe, ali redoslijed nije ocigledan.
    setSession({
      analysisCount: TRIGGER_CONFIG.MAX_CALLS_PER_SESSION,
      lastSeen: secAgo(120),
      lastAnalyzedAt: secAgo(5),      // cooldown je aktivan
    });

    const d = await shouldAnalyzeSession(SID, []);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'rule' });
  });
});

describe('triggerEvaluator — globalni budzet', () => {
  it('prelazi na pravila kada je globalni budzet iscrpljen a sesija utihnula', async () => {
    hasBudgetMock.mockReturnValue(false);
    setSession({ lastSeen: secAgo(120) });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'rule' });
    expect(d.reason).toContain('Globalni budzet');
  });

  it('ne radi nista kada je globalni budzet iscrpljen a sesija aktivna', async () => {
    hasBudgetMock.mockReturnValue(false);

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.shouldAnalyze).toBe(false);
  });

  it('ne provjerava globalni budzet ako je sesijski vec potrosen', async () => {
    // Redoslijed je namjeran: sesijski budzet je uza kocnica, pa se globalno
    // stanje ne cita bez potrebe.
    setSession({ analysisCount: TRIGGER_CONFIG.MAX_CALLS_PER_SESSION });

    await shouldAnalyzeSession(SID, [SQLI]);

    expect(hasBudgetMock).not.toHaveBeenCalled();
  });

  it('cita globalni budzet bez trosenja', async () => {
    // hasBudget samo provjerava; consumeBudget zove tek klasifikator,
    // neposredno prije stvarnog poziva modelu.
    await shouldAnalyzeSession(SID, [SQLI]);

    expect(hasBudgetMock).toHaveBeenCalledTimes(1);
  });
});

describe('triggerEvaluator — hitna detekcija i rezim single', () => {
  it('eskalira ozbiljnu detekciju na pojedinacnu analizu', async () => {
    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'single' });
    expect(d.reason).toContain('SQL_INJECTION');
  });

  it('GRANICA: pouzdanost tacno na pragu se racuna kao hitna', async () => {
    // Poredjenje je >=, pa je 0.85 ukljuceno.
    const d = await shouldAnalyzeSession(SID, [
      { type: 'XSS_ATTEMPT', confidence: TRIGGER_CONFIG.HIGH_CONFIDENCE },
    ]);

    expect(d.mode).toBe('single');
  });

  it('GRANICA: pouzdanost neposredno ispod praga se ne eskalira', async () => {
    const d = await shouldAnalyzeSession(SID, [
      { type: 'XSS_ATTEMPT', confidence: TRIGGER_CONFIG.HIGH_CONFIDENCE - 0.01 },
    ]);

    expect(d.mode).not.toBe('single');
  });

  it('ne eskalira prepoznat skener ma koliko pouzdan bio', async () => {
    // AUTOMATED_SCAN nije u skupu hitnih tipova. Nikto sa pouzdanoscu 0.99
    // ne smije potrositi poziv modelu — to je posao pravila.
    const d = await shouldAnalyzeSession(SID, [{ type: 'AUTOMATED_SCAN', confidence: 0.99 }]);

    expect(d.mode).not.toBe('single');
  });

  it('eskalira i pad detektora, ne samo prepoznat napad', async () => {
    // Zahtjev koji rusi detektor je sam po sebi sumnjiv, pa DETECTOR_FAILURE
    // stoji u istom skupu kao i prepoznate tehnike napada.
    const d = await shouldAnalyzeSession(SID, [{ type: 'DETECTOR_FAILURE', confidence: 0.9 }]);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'single' });
  });

  it('nikad ne bira single kada detekcije nisu proslijedjene', async () => {
    // Sweeper poziva bez detekcija. Time je rezim single rezervisan
    // iskljucivo za svjeze evente koji dolaze kroz red.
    setSession({ lastSeen: secAgo(120) });
    setCounts(5, 5);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d.mode).toBe('batch');
  });

  it('NALAZ: hitna detekcija unutar cooldowna se odbacuje bez zamjene', async () => {
    // Funkcija ne prelazi na drugi rezim nego vraca none. Event ostaje
    // neobradjen i ceka sweeper, pa se najozbiljnija detekcija u sesiji
    // moze analizirati sa zakasnjenjem od najmanje 90 sekundi.
    setSession({ lastAnalyzedAt: secAgo(30) });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.shouldAnalyze).toBe(false);
    expect(d.reason).toContain('preskocena');
  });

  it('GRANICA: cooldown tacno na pragu vise nije aktivan', async () => {
    // Poredjenje je <, pa razmak od tacno 60 s propusta poziv.
    setSession({ lastAnalyzedAt: msAgo(TRIGGER_CONFIG.COOLDOWN_MS) });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.mode).toBe('single');
  });

  it('GRANICA: milisekunda prije praga cooldown jos traje', async () => {
    setSession({ lastAnalyzedAt: msAgo(TRIGGER_CONFIG.COOLDOWN_MS - 1) });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.shouldAnalyze).toBe(false);
  });

  it('nikad ne aktivira cooldown za sesiju koja jos nije analizirana', async () => {
    // lastAnalyzedAt je null -> razmak je beskonacan.
    setSession({ lastAnalyzedAt: null });

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.mode).toBe('single');
  });
});

describe('triggerEvaluator — zastita od nagomilavanja', () => {
  it('okida batch kada broj neobradjenih eventa dosegne prag', async () => {
    setCounts(TRIGGER_CONFIG.HARD_FLUSH);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'batch' });
    expect(d.reason).toContain('Nagomilano');
  });

  it('GRANICA: jedan event ispod praga ne okida zastitu', async () => {
    setCounts(TRIGGER_CONFIG.HARD_FLUSH - 1);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d.shouldAnalyze).toBe(false);
  });

  it('cooldown zaustavlja i zastitu od nagomilavanja', async () => {
    setSession({ lastAnalyzedAt: secAgo(30) });
    setCounts(TRIGGER_CONFIG.HARD_FLUSH);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d.shouldAnalyze).toBe(false);
  });
});

describe('triggerEvaluator — zavrsena sesija', () => {
  it('bira batch kada utihnula sesija ima evente sa signalima', async () => {
    setSession({ lastSeen: secAgo(120) });
    setCounts(10, 4);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'batch' });
    expect(d.reason).toContain('Trigger 3');
  });

  it('bira pravila kada utihnula sesija nema nijedan signal', async () => {
    // Cista skenerska sesija. Odgovor je poznat iz statusnog koda i odsustva
    // detekcija, pa poziv modelu ne bi donio nista novo.
    setSession({ lastSeen: secAgo(120) });
    setCounts(10, 0);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d).toMatchObject({ shouldAnalyze: true, mode: 'rule' });
    expect(d.reason).toContain('Trigger 4');
  });

  it('NALAZ: pravila se izvrsavaju i unutar cooldowna, batch ne', async () => {
    // Provjera cooldowna stoji izmedju dvije grane. Posljedica je namjerna:
    // pravila ne trose ni budzet ni tokene, pa ih nema smisla odgadjati.
    setSession({ lastSeen: secAgo(120), lastAnalyzedAt: secAgo(30) });
    setCounts(10, 0);

    const bezSignala = await shouldAnalyzeSession(SID, []);
    expect(bezSignala.mode).toBe('rule');

    setCounts(10, 4);
    const saSignalima = await shouldAnalyzeSession(SID, []);
    expect(saSignalima.shouldAnalyze).toBe(false);
  });

  it('GRANICA: tisina tacno na pragu racuna se kao zavrsena sesija', async () => {
    // Poredjenje je >=.
    setSession({ lastSeen: msAgo(TRIGGER_CONFIG.SESSION_IDLE_MS) });
    setCounts(10, 4);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d.mode).toBe('batch');
  });

  it('GRANICA: milisekunda prije praga sesija je jos aktivna', async () => {
    setSession({ lastSeen: msAgo(TRIGGER_CONFIG.SESSION_IDLE_MS - 1) });
    setCounts(10, 4);

    const d = await shouldAnalyzeSession(SID, []);

    expect(d.shouldAnalyze).toBe(false);
    expect(d.reason).toContain('jos aktivna');
  });
});

describe('triggerEvaluator — redoslijed prioriteta i cijena upita', () => {
  it('hitna detekcija ima prednost nad batchem na utihnuloj sesiji', async () => {
    // Provjera hitnosti stoji prije provjere tisine, pa svjeza ozbiljna
    // detekcija dobija brzu pojedinacnu analizu umjesto da ceka batch.
    setSession({ lastSeen: secAgo(120) });
    setCounts(10, 4);

    const d = await shouldAnalyzeSession(SID, [SQLI]);

    expect(d.mode).toBe('single');
  });

  it('ne broji evente sa signalima dok je sesija aktivna', async () => {
    // Drugi upit stoji unutar grane za utihnulu sesiju. Aktivna sesija ga
    // ne placa, sto je bitno jer se evaluator pokrece na svaki zahtjev.
    await shouldAnalyzeSession(SID, []);

    expect(dbMock.event.count).toHaveBeenCalledTimes(1);
  });

  it('broji evente sa signalima tek kada sesija utihne', async () => {
    setSession({ lastSeen: secAgo(120) });
    setCounts(10, 4);

    await shouldAnalyzeSession(SID, []);

    expect(dbMock.event.count).toHaveBeenCalledTimes(2);
    expect(dbMock.event.count).toHaveBeenLastCalledWith({
      where: { sessionId: SID, analyzedAt: null, signalCount: { gt: 0 } },
    });
  });

  it('ne predlaze analizu za aktivnu sesiju bez detekcija i bez nagomilavanja', async () => {
    // Najcesci ishod tokom normalnog pregledavanja.
    const d = await shouldAnalyzeSession(SID, []);

    expect(d).toMatchObject({ shouldAnalyze: false, mode: 'none' });
    expect(d.reason).toContain('Nema triggera');
  });
});