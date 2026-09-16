import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ============================================================================
 *  ruleClassifier — jedinicni testovi SA mockom
 * ============================================================================
 *  Modul sadrzi dvije funkcije razlicite prirode. ruleVerdict je cista:
 *  prima statusni kod i metapodatke, vraca zakljucak, ne dodiruje nista
 *  izvana. classifySessionByRules cita iz baze i pise u nju kroz transakciju.
 *
 *  Baza se ipak zamjenjuje i za testove ciste funkcije, jer se obje nalaze u
 *  istom modulu. Uvoz modula povlaci uvoz Prisma klijenta, koji se pri
 *  ucitavanju povezuje na bazu. Cistoca funkcije ne pomaze ako je modul u
 *  kojem zivi necist — to je i argument za izdvajanje takvih funkcija u
 *  zasebne module bez vanjskih zavisnosti.
 *
 *  Transakcija se zamjenjuje tako da odmah izvrsi proslijedjenu funkciju nad
 *  laznim klijentom. Time se provjerava sta bi bilo upisano i kojim
 *  redoslijedom, bez stvarnog otvaranja transakcije.
 * ============================================================================
 */

const { dbMock, txMock } = vi.hoisted(() => {
  const txMock = {
    classification: { upsert: vi.fn() },
    event: { updateMany: vi.fn() },
  };
  return {
    txMock,
    dbMock: {
      event: { findMany: vi.fn() },
      $transaction: vi.fn(),
    },
  };
});

vi.mock('../src/database/db', () => ({ db: dbMock }));

import { ruleVerdict, classifySessionByRules } from '../src/detection/ruleClassifier';

const SID = 'sess-1';

const scan = (confidence = 0.99, signals = ['sqlmap user agent', 'nema referera']) => [
  { type: 'AUTOMATED_SCAN', confidence, signals },
];

beforeEach(() => {
  vi.clearAllMocks();
  dbMock.$transaction.mockImplementation(async (fn: any) => fn(txMock));
});

describe('ruleVerdict — prepoznat alat za skeniranje', () => {
  it('vraca AUTOMATED_SCAN i preuzima pouzdanost detektora', () => {
    // Pouzdanost se ne izmislja nego preuzima od detektora koji je alat
    // prepoznao, pa zakljucak pravila ostaje uporediv sa ostalima.
    const v = ruleVerdict({ statusCode: 200, metadata: scan(0.97) });

    expect(v).toMatchObject({ category: 'AUTOMATED_SCAN', confidence: 0.97, severity: 'low' });
  });

  it('ukljucuje najvise dva signala u obrazlozenje', () => {
    const v = ruleVerdict({
      statusCode: 404,
      metadata: scan(0.99, ['prvi', 'drugi', 'treci', 'cetvrti']),
    });

    expect(v.explanation).toContain('prvi; drugi');
    expect(v.explanation).not.toContain('treci');
  });

  it('podnosi detekciju sa jednim signalom', () => {
    const v = ruleVerdict({ statusCode: 404, metadata: scan(0.99, ['jedini']) });

    expect(v.explanation).toContain('jedini');
  });

  it('ima prednost nad statusnim kodom', () => {
    // Skener koji je izazvao gresku servera i dalje je prije svega skener.
    const v = ruleVerdict({ statusCode: 500, metadata: scan() });

    expect(v.category).toBe('AUTOMATED_SCAN');
  });
});

describe('ruleVerdict — zakljucak po statusnom kodu', () => {
  it.each([
    [400, 'RECONNAISSANCE'],
    [404, 'RECONNAISSANCE'],
    [499, 'RECONNAISSANCE'],
  ])('status %i svrstava u %s', (status, category) => {
    // Zahtjev za nepostojecom putanjom bez napadackog obrasca je
    // izvidjanje, ne napad.
    expect(ruleVerdict({ statusCode: status, metadata: null }).category).toBe(category);
  });

  it.each([
    [200, 'BENIGN_PROBE'],
    [302, 'BENIGN_PROBE'],
    [399, 'BENIGN_PROBE'],
  ])('status %i svrstava u %s', (status, category) => {
    expect(ruleVerdict({ statusCode: status, metadata: null }).category).toBe(category);
  });

  it('dodjeljuje vise pouzdanosti izvidjanju nego bezopasnom zahtjevu', () => {
    // Odsustvo putanje je jaci signal od njenog postojanja.
    const recon = ruleVerdict({ statusCode: 404, metadata: null });
    const benign = ruleVerdict({ statusCode: 200, metadata: null });

    expect(recon.confidence).toBeGreaterThan(benign.confidence);
  });

  it('svrstava nedostajuci statusni kod u UNKNOWN', () => {
    const v = ruleVerdict({ statusCode: null, metadata: null });

    expect(v).toMatchObject({ category: 'UNKNOWN', confidence: 0.3 });
  });

  it('svaki zakljucak nosi nisku ozbiljnost', () => {
    // Pravila nikad ne eskaliraju. Sve iznad niske ozbiljnosti mora doci
    // od modela, inace bi statistika po ozbiljnosti izgubila smisao.
    for (const status of [200, 404, 500, null]) {
      expect(ruleVerdict({ statusCode: status, metadata: null }).severity).toBe('low');
    }
  });
});

describe('ruleVerdict — obrada metapodataka', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['prazan niz', []],
    ['objekat umjesto niza', { type: 'AUTOMATED_SCAN' }],
    ['tekst', 'AUTOMATED_SCAN'],
  ])('podnosi metapodatke oblika %s bez pada', (_naziv, metadata) => {
    // Polje je u bazi tipa Json i moze sadrzavati bilo sta. Provjera
    // Array.isArray je jedina zastita, pa mora drzati sve oblike.
    expect(() => ruleVerdict({ statusCode: 404, metadata })).not.toThrow();
  });

  it('ignorise detekcije koje nisu skener', () => {
    const v = ruleVerdict({
      statusCode: 404,
      metadata: [{ type: 'XSS_ATTEMPT', confidence: 0.9, signals: ['<script>'] }],
    });

    expect(v.category).toBe('RECONNAISSANCE');
  });
});

describe('ruleVerdict — dokumentovana ogranicenja', () => {
  it('NALAZ: zakljucak detektora o napadu se odbacuje', () => {
    // Do pravila se dolazi i kad je budzet potrosen. Event sa potvrdjenom
    // SQL injekcijom tada dobija kategoriju po statusnom kodu, a detekcija
    // ostaje samo u polju metadata. U statistici po kategorijama takav
    // napad se nece pojaviti kao napad.
    const v = ruleVerdict({
      statusCode: 200,
      metadata: [{ type: 'SQL_INJECTION', confidence: 0.95, signals: ['UNION SELECT'] }],
    });

    expect(v.category).toBe('BENIGN_PROBE');
    expect(v.category).not.toBe('SQL_INJECTION');
  });

  it('NALAZ: greska servera se svrstava u UNKNOWN sa najnizom pouzdanoscu', () => {
    // Status 500 znaci da je posjetilac uspio srusiti obradu — dogadjaj
    // zanimljiviji od prosjecnog. Pravila ga ipak svrstavaju u najslabiju
    // kategoriju i ne eskaliraju ga.
    const v = ruleVerdict({ statusCode: 500, metadata: null });

    expect(v).toMatchObject({ category: 'UNKNOWN', confidence: 0.3 });
  });
});

describe('classifySessionByRules — prazan slucaj', () => {
  it('vraca nulu i ne otvara transakciju kada nema neobradjenih eventa', async () => {
    dbMock.event.findMany.mockResolvedValue([]);

    const n = await classifySessionByRules(SID);

    expect(n).toBe(0);
    expect(dbMock.$transaction).not.toHaveBeenCalled();
  });
});

describe('classifySessionByRules — upis zakljucaka', () => {
  const EVENTS = [
    { id: 'e1', statusCode: 404, metadata: null },
    { id: 'e2', statusCode: 200, metadata: scan() },
  ];

  beforeEach(() => {
    dbMock.event.findMany.mockResolvedValue(EVENTS);
  });

  it('bira samo neobradjene evente sesije, poredane po vremenu', async () => {
    await classifySessionByRules(SID);

    expect(dbMock.event.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { sessionId: SID, analyzedAt: null },
        orderBy: { timestamp: 'asc' },
        take: 1000,
      }),
    );
  });

  it('postuje zadano ogranicenje broja eventa', async () => {
    await classifySessionByRules(SID, 50);

    expect(dbMock.event.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }));
  });

  it('upisuje po jedan zakljucak za svaki event i vraca njihov broj', async () => {
    const n = await classifySessionByRules(SID);

    expect(n).toBe(2);
    expect(txMock.classification.upsert).toHaveBeenCalledTimes(2);
  });

  it('oznacava zakljucke izvorom rule, ne imenom modela', async () => {
    // Bez ovog polja se u statistici ne bi moglo razdvojiti sta je rekao
    // model, a sta pravila.
    await classifySessionByRules(SID);

    for (const call of txMock.classification.upsert.mock.calls) {
      expect(call[0].create.detector).toBe('rule');
    }
  });

  it('primjenjuje ruleVerdict na svaki event pojedinacno', async () => {
    await classifySessionByRules(SID);

    const [prvi, drugi] = txMock.classification.upsert.mock.calls;
    expect(prvi[0].create.category).toBe('RECONNAISSANCE');    // 404, bez detekcija
    expect(drugi[0].create.category).toBe('AUTOMATED_SCAN');   // prepoznat alat
  });

  it('NE prepisuje postojecu klasifikaciju modela', async () => {
    // Prazan objekat u polju update je sustina: ako je event vec
    // klasifikovan modelom, pravila ga ostavljaju netaknutim. Bez toga bi
    // ciscenje repova obezvrijedilo vec placenu analizu.
    await classifySessionByRules(SID);

    for (const call of txMock.classification.upsert.mock.calls) {
      expect(call[0].update).toEqual({});
    }
  });

  it('oznacava sve obradjene evente i uvecava brojac analiza', async () => {
    await classifySessionByRules(SID);

    expect(txMock.event.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['e1', 'e2'] } },
      data: { analyzedAt: expect.any(Date), analyzeCount: { increment: 1 } },
    });
  });

  it('izvrsava upise i oznacavanje unutar jedne transakcije', async () => {
    // Djelimican upis bi ostavio evente sa klasifikacijom ali bez oznake
    // obrade, pa bi se vracali u svaki sljedeci prolaz.
    await classifySessionByRules(SID);

    expect(dbMock.$transaction).toHaveBeenCalledTimes(1);
    expect(txMock.classification.upsert).toHaveBeenCalled();
    expect(txMock.event.updateMany).toHaveBeenCalled();
  });

  it('ne dira stanje sesije', async () => {
    // Pravila ne trose ni budzet ni cooldown, pa lastAnalyzedAt i
    // analysisCount ostaju nepromijenjeni. triggerEvaluator se zato oslanja
    // na pad broja neobradjenih eventa, a ne na brojac analiza.
    await classifySessionByRules(SID);

    expect(txMock).not.toHaveProperty('session');
    expect(Object.keys(dbMock)).not.toContain('session');
  });
});