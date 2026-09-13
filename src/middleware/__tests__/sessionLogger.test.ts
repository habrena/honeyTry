import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHash } from 'crypto';

// ─── Mock baze ─────────────────────────────────────────────────────────────
// sessionLogger je jedina jedinica koju testiramo; Prisma se zamjenjuje.
vi.mock('../src/database/db', () => ({
  db: {
    session: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { db } from '../../database/db';
import { sessionLogger } from '../sessionLogger';

// ─── Pomocne funkcije ──────────────────────────────────────────────────────

const COOKIE_NAME = 'mngmt_id';
const DEFAULT_IP = '203.0.113.9';
const DEFAULT_UA = 'Mozilla/5.0';

/** Racuna ocekivani otisak istom formulom kao produkcijski kod. */
function fingerprint(ip: string, ua: string): string {
  return 'f:' + createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 32);
}

function makeReq(over: Record<string, any> = {}): any {
  return {
    query: {},
    headers: { 'user-agent': DEFAULT_UA },
    cookies: {},
    ip: DEFAULT_IP,
    socket: { remoteAddress: DEFAULT_IP },
    ...over,
  };
}

function makeRes(): any {
  return { cookie: vi.fn() };
}

/** Sesija kakvu Prisma vraca. */
const SESSION = {
  id: 'sess-1',
  sessionKey: fingerprint(DEFAULT_IP, DEFAULT_UA),
  cookieId: 'cookie-abc',
  tokenId: 'HT-UKNOWN',
  identMethod: 'fingerprint',
  sourceIp: DEFAULT_IP,
  userAgent: DEFAULT_UA,
};

/** Vraca argumente prvog poziva upserta. */
function upsertArgs() {
  return (db.session.upsert as any).mock.calls[0][0];
}

beforeEach(() => {
  vi.clearAllMocks();
  (db.session.upsert as any).mockResolvedValue(SESSION);
  (db.session.update as any).mockResolvedValue(SESSION);
  (db.session.findUnique as any).mockResolvedValue(null);
  (db.session.findFirst as any).mockResolvedValue(null);
});

// ══════════════════════════════════════════════════════════════════════════
//  PUTANJE KROZ ODLUCIVANJE
// ══════════════════════════════════════════════════════════════════════════

describe('P1 — nema kolacica, nema postojece sesije', () => {
  it('kreira sesiju preko otiska i postavlja kolacic', async () => {
    const req = makeReq();
    const res = makeRes();
    const next = vi.fn();

    await sessionLogger(req, res, next);

    // Nijedan lookup se ne radi kad kolacica nema — to je ustedjen
    // mrezni put po zahtjevu, sto kod udaljene baze nije zanemarivo.
    expect(db.session.findUnique).not.toHaveBeenCalled();
    expect(db.session.findFirst).not.toHaveBeenCalled();

    const args = upsertArgs();
    expect(args.where.sessionKey).toBe(fingerprint(DEFAULT_IP, DEFAULT_UA));
    expect(args.create.identMethod).toBe('fingerprint');
    expect(args.create.sourceIp).toBe(DEFAULT_IP);
    expect(args.create.userAgent).toBe(DEFAULT_UA);

    expect(res.cookie).toHaveBeenCalledOnce();
    expect(res.cookie.mock.calls[0][0]).toBe(COOKIE_NAME);

    expect(req.session).toBe(SESSION);
    expect(next).toHaveBeenCalledOnce();
  });

  it('generise cookieId i upisuje istu vrijednost u kolacic i u bazu', async () => {
    const req = makeReq();
    const res = makeRes();

    await sessionLogger(req, res, vi.fn());

    const cookieValue = res.cookie.mock.calls[0][1];
    expect(cookieValue).toMatch(/^[0-9a-f-]{36}$/);   // UUID v4
    expect(upsertArgs().create.cookieId).toBe(cookieValue);
  });
});

describe('P2 — nema kolacica, sesija sa istim otiskom postoji', () => {
  it('upsert grana update prepisuje cookieId novom vrijednoscu', async () => {
    // Ovo je dokumentovanje stvarnog ponasanja, ne preporuka:
    // klijent bez kolacica (npr. curl) sa istog IP-a i UA-a prepisuje
    // cookieId postojece sesije. Stari kolacic tada vise ne pokazuje ni na sta.
    const req = makeReq();
    const res = makeRes();

    await sessionLogger(req, res, vi.fn());

    const args = upsertArgs();
    const cookieValue = res.cookie.mock.calls[0][1];
    expect(args.update.cookieId).toBe(cookieValue);
    expect(args.update.sourceIp).toBe(DEFAULT_IP);
    expect(args.update.lastSeen).toBeInstanceOf(Date);
  });

  it('update grana ne dira tokenId — token stigao kasnije se gubi', async () => {
    const req = makeReq({ query: { ref: 'HT-EMAIL-01' } });

    await sessionLogger(req, makeRes(), vi.fn());

    const args = upsertArgs();
    expect(args.create.tokenId).toBe('HT-EMAIL-01');   // kod kreiranja se biljezi
    expect(args.update.tokenId).toBeUndefined();       // kod azuriranja ne
  });
});

describe('P3 — kolacic pokazuje na sessionKey c:<kolacic>', () => {
  it('koristi nadjenu sesiju i ne postavlja novi kolacic', async () => {
    (db.session.findUnique as any).mockResolvedValue({ ...SESSION, id: 'sess-c' });

    const req = makeReq({ cookies: { [COOKIE_NAME]: 'cookie-abc' } });
    const res = makeRes();

    await sessionLogger(req, res, vi.fn());

    expect(db.session.findUnique).toHaveBeenCalledWith({
      where: { sessionKey: 'c:cookie-abc' },
    });
    expect(db.session.findFirst).not.toHaveBeenCalled();
    expect(db.session.update).toHaveBeenCalledWith({
      where: { id: 'sess-c' },
      data: { lastSeen: expect.any(Date), sourceIp: DEFAULT_IP, userAgent: DEFAULT_UA },
    });
    expect(db.session.upsert).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('NAPOMENA: ova putanja je nedostizna u produkciji', () => {
    // Nijedna sesija se vise ne kreira sa sessionKey = "c:...";
    // create uvijek koristi otisak. Test P3 prolazi samo zato sto je
    // findUnique mockovan. Ako u bazi nema redova iz stare verzije,
    // ovaj upit uvijek vraca null i predstavlja izgubljen mrezni put.
    expect(true).toBe(true);
  });
});

describe('P4 — kolacic ne pokazuje na sessionKey, ali postoji kao cookieId', () => {
  it('pronalazi sesiju drugim upitom i azurira je', async () => {
    (db.session.findUnique as any).mockResolvedValue(null);
    (db.session.findFirst as any).mockResolvedValue({ ...SESSION, id: 'sess-f' });

    const req = makeReq({ cookies: { [COOKIE_NAME]: 'cookie-abc' } });
    const res = makeRes();

    await sessionLogger(req, res, vi.fn());

    expect(db.session.findFirst).toHaveBeenCalledWith({
      where: { cookieId: 'cookie-abc' },
    });
    expect(db.session.update).toHaveBeenCalledWith({
      where: { id: 'sess-f' },
      data: expect.objectContaining({ sourceIp: DEFAULT_IP }),
    });
    expect(db.session.upsert).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('spasava sesiju kad se otisak promijenio (drugi IP, isti kolacic)', async () => {
    // Ovo je razlog zasto kolacic uopste postoji: napadac je presao na VPN,
    // otisak je drugaciji, ali sesija ostaje ista.
    (db.session.findFirst as any).mockResolvedValue({ ...SESSION, id: 'sess-f' });

    const req = makeReq({
      cookies: { [COOKIE_NAME]: 'cookie-abc' },
      ip: '198.51.100.7',
      headers: { 'user-agent': DEFAULT_UA },
    });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(db.session.upsert).not.toHaveBeenCalled();
    expect(db.session.update).toHaveBeenCalledWith({
      where: { id: 'sess-f' },
      data: expect.objectContaining({ sourceIp: '198.51.100.7' }),
    });
  });
});

describe('P5 — kolacic postoji ali nijedan lookup ne uspije', () => {
  it('ponovno koristi postojeci kolacic i ne postavlja novi', async () => {
    const req = makeReq({ cookies: { [COOKIE_NAME]: 'stari-kolacic' } });
    const res = makeRes();

    await sessionLogger(req, res, vi.fn());

    expect(db.session.findUnique).toHaveBeenCalledOnce();
    expect(db.session.findFirst).toHaveBeenCalledOnce();

    const args = upsertArgs();
    expect(args.create.cookieId).toBe('stari-kolacic');
    expect(args.update.cookieId).toBe('stari-kolacic');

    // Klijent kolacic vec ima — nema potrebe ponovo ga slati.
    expect(res.cookie).not.toHaveBeenCalled();
  });
});

describe('P6 — baza nije dostupna', () => {
  let spy: any;

  beforeEach(() => { spy = vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { spy.mockRestore(); });

  it('ne baca gresku, ostavlja req.session nedefinisan i zove next()', async () => {
    (db.session.upsert as any).mockRejectedValue(new Error('Connection terminated'));

    const req = makeReq();
    const next = vi.fn();

    await expect(sessionLogger(req, makeRes(), next)).resolves.toBeUndefined();

    expect(req.session).toBeUndefined();
    expect(spy).toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it('greska u prvom lookupu se takodjer hvata', async () => {
    (db.session.findUnique as any).mockRejectedValue(new Error('timeout'));

    const req = makeReq({ cookies: { [COOKIE_NAME]: 'x' } });
    const next = vi.fn();

    await sessionLogger(req, makeRes(), next);

    expect(req.session).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  HONEY TOKEN
// ══════════════════════════════════════════════════════════════════════════

describe('tokenId', () => {
  it('cita iz query parametra ref', async () => {
    await sessionLogger(makeReq({ query: { ref: 'HT-EMAIL-01' } }), makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toBe('HT-EMAIL-01');
  });

  it('cita iz zaglavlja x-token-id kad ref ne postoji', async () => {
    const req = makeReq({ headers: { 'user-agent': DEFAULT_UA, 'x-token-id': 'HT-PASTEBIN-02' } });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toBe('HT-PASTEBIN-02');
  });

  it('query parametar ima prioritet nad zaglavljem', async () => {
    const req = makeReq({
      query: { ref: 'HT-QUERY' },
      headers: { 'user-agent': DEFAULT_UA, 'x-token-id': 'HT-HEADER' },
    });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toBe('HT-QUERY');
  });

  it('vraca HT-UKNOWN kad nema ni jednog izvora', async () => {
    await sessionLogger(makeReq(), makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toBe('HT-UKNOWN');
  });

  it('prazan ref pada na podrazumijevanu vrijednost', async () => {
    await sessionLogger(makeReq({ query: { ref: '' } }), makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toBe('HT-UKNOWN');
  });

  it('ref kao niz (?ref=a&ref=b) ne prolazi provjeru tipa', async () => {
    await sessionLogger(makeReq({ query: { ref: ['a', 'b'] } }), makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toBe('HT-UKNOWN');
  });

  it('reze token na 256 znakova', async () => {
    const dug = 'A'.repeat(1000);
    await sessionLogger(makeReq({ query: { ref: dug } }), makeRes(), vi.fn());
    expect(upsertArgs().create.tokenId).toHaveLength(256);
  });

  it('neutralise nulti bajt u tokenu', async () => {
    await sessionLogger(makeReq({ query: { ref: 'HT-\u0000-01' } }), makeRes(), vi.fn());
    const token = upsertArgs().create.tokenId;
    expect(token).not.toContain('\u0000');
    expect(token).toContain('\\u0000');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  IZVORISNA IP ADRESA
// ══════════════════════════════════════════════════════════════════════════

describe('sourceIp', () => {
  it('koristi x-forwarded-for kad postoji', async () => {
    const req = makeReq({
      headers: { 'user-agent': DEFAULT_UA, 'x-forwarded-for': '198.51.100.7' },
    });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('198.51.100.7');
  });

  it('iz lanca posrednika uzima prvu adresu i uklanja praznine', async () => {
    const req = makeReq({
      headers: { 'user-agent': DEFAULT_UA, 'x-forwarded-for': ' 198.51.100.7 , 10.0.0.1, 172.16.0.1' },
    });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('198.51.100.7');
  });

  it('NALAZ: prazno x-forwarded-for daje prazan sourceIp', async () => {
    // typeof '' === 'string', pa se grana uzima i rezultat je prazan string.
    // Napadac time moze zamagliti svoju adresu. Popravka: provjeriti i da
    // rezultat nije prazan prije nego se prihvati.
    const req = makeReq({
      headers: { 'user-agent': DEFAULT_UA, 'x-forwarded-for': '' },
    });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('');
  });

  it('pada na req.ip kad zaglavlja nema', async () => {
    await sessionLogger(makeReq(), makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe(DEFAULT_IP);
  });

  it('pada na socket.remoteAddress kad req.ip nije postavljen', async () => {
    const req = makeReq({ ip: undefined, socket: { remoteAddress: '192.0.2.5' } });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('192.0.2.5');
  });

  it('vraca "unknown" kad nijedan izvor ne postoji', async () => {
    const req = makeReq({ ip: undefined, socket: {} });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('unknown');
  });

  it('uklanja prefiks ::ffff: kod IPv4 adresa mapiranih u IPv6', async () => {
    const req = makeReq({ ip: '::ffff:127.0.0.1' });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('127.0.0.1');
  });

  it('ne dira prave IPv6 adrese', async () => {
    const req = makeReq({ ip: '2001:db8::1' });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.sourceIp).toBe('2001:db8::1');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  USER AGENT
// ══════════════════════════════════════════════════════════════════════════

describe('userAgent', () => {
  it('vraca "unknown" kad zaglavlja nema', async () => {
    await sessionLogger(makeReq({ headers: {} }), makeRes(), vi.fn());
    expect(upsertArgs().create.userAgent).toBe('unknown');
  });

  it('reze na 512 znakova', async () => {
    const req = makeReq({ headers: { 'user-agent': 'B'.repeat(2000) } });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().create.userAgent).toHaveLength(512);
  });

  it('neutralise nulti bajt', async () => {
    const req = makeReq({ headers: { 'user-agent': 'curl/\u00008.5' } });
    await sessionLogger(req, makeRes(), vi.fn());
    const ua = upsertArgs().create.userAgent;
    expect(ua).not.toContain('\u0000');
    expect(ua).toContain('\\u0000');
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  OTISAK
// ══════════════════════════════════════════════════════════════════════════

describe('otisak (fingerprint)', () => {
  it('isti IP i UA daju isti sessionKey', async () => {
    await sessionLogger(makeReq(), makeRes(), vi.fn());
    const prvi = upsertArgs().where.sessionKey;

    vi.clearAllMocks();
    (db.session.upsert as any).mockResolvedValue(SESSION);
    (db.session.findUnique as any).mockResolvedValue(null);
    (db.session.findFirst as any).mockResolvedValue(null);

    await sessionLogger(makeReq(), makeRes(), vi.fn());
    expect(upsertArgs().where.sessionKey).toBe(prvi);
  });

  it('razlicit UA daje razlicit sessionKey', async () => {
    const a = fingerprint(DEFAULT_IP, 'Mozilla/5.0');
    const b = fingerprint(DEFAULT_IP, 'curl/8.5.0');
    expect(a).not.toBe(b);

    const req = makeReq({ headers: { 'user-agent': 'curl/8.5.0' } });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().where.sessionKey).toBe(b);
  });

  it('ima prefiks f: i duzinu 34 znaka', async () => {
    await sessionLogger(makeReq(), makeRes(), vi.fn());
    const key = upsertArgs().where.sessionKey;
    expect(key).toMatch(/^f:[0-9a-f]{32}$/);
  });

  it('racuna se nad ociscenim vrijednostima, ne nad sirovim zaglavljem', async () => {
    // Nulti bajt se uklanja PRIJE racunanja otiska, pa isti klijent
    // sa i bez nultog bajta u UA ne dobija dvije sesije.
    const req = makeReq({ headers: { 'user-agent': 'curl/\u00008.5' } });
    await sessionLogger(req, makeRes(), vi.fn());
    expect(upsertArgs().where.sessionKey).toBe(fingerprint(DEFAULT_IP, 'curl/\\u00008.5'));
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  POSTAVKE KOLACICA
// ══════════════════════════════════════════════════════════════════════════

describe('opcije kolacica', () => {
  const origEnv = process.env.NODE_ENV;
  afterEach(() => { process.env.NODE_ENV = origEnv; });

  it('postavlja httpOnly, sameSite lax i rok od 7 dana', async () => {
    const res = makeRes();
    await sessionLogger(makeReq(), res, vi.fn());

    const opts = res.cookie.mock.calls[0][2];
    expect(opts.httpOnly).toBe(true);
    expect(opts.sameSite).toBe('lax');
    expect(opts.maxAge).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('secure je false izvan produkcije', async () => {
    process.env.NODE_ENV = 'development';
    const res = makeRes();
    await sessionLogger(makeReq(), res, vi.fn());
    expect(res.cookie.mock.calls[0][2].secure).toBe(false);
  });

  it('secure je true u produkciji', async () => {
    process.env.NODE_ENV = 'production';
    const res = makeRes();
    await sessionLogger(makeReq(), res, vi.fn());
    expect(res.cookie.mock.calls[0][2].secure).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  INVARIJANTE
// ══════════════════════════════════════════════════════════════════════════

describe('invarijante', () => {
  it('next() se zove u svakoj putanji', async () => {
    const scenariji = [
      { naziv: 'P1/P2', setup: () => {} },
      { naziv: 'P3', setup: () => (db.session.findUnique as any).mockResolvedValue(SESSION) },
      { naziv: 'P4', setup: () => (db.session.findFirst as any).mockResolvedValue(SESSION) },
      { naziv: 'P6', setup: () => (db.session.upsert as any).mockRejectedValue(new Error('x')) },
    ];

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    for (const s of scenariji) {
      vi.clearAllMocks();
      (db.session.upsert as any).mockResolvedValue(SESSION);
      (db.session.update as any).mockResolvedValue(SESSION);
      (db.session.findUnique as any).mockResolvedValue(null);
      (db.session.findFirst as any).mockResolvedValue(null);
      s.setup();

      const next = vi.fn();
      await sessionLogger(makeReq({ cookies: { [COOKIE_NAME]: 'c' } }), makeRes(), next);
      expect(next, `next() nije pozvan u scenariju ${s.naziv}`).toHaveBeenCalledOnce();
    }

    spy.mockRestore();
  });

  it('nikad ne kreira sesiju sa sessionKey koji pocinje sa c:', async () => {
    // Ovo je test regresije za bug koji je cijepao sesije:
    // create sa sessionKey = "c:<kolacic>" je uz cookieId @unique bacao P2002.
    await sessionLogger(makeReq({ cookies: { [COOKIE_NAME]: 'abc' } }), makeRes(), vi.fn());
    expect(upsertArgs().create.sessionKey).not.toMatch(/^c:/);
    expect(upsertArgs().create.sessionKey).toMatch(/^f:/);
  });

  it('identMethod je uvijek fingerprint — kolona ne nosi informaciju', async () => {
    await sessionLogger(makeReq({ cookies: { [COOKIE_NAME]: 'abc' } }), makeRes(), vi.fn());
    expect(upsertArgs().create.identMethod).toBe('fingerprint');
  });

  it('lastSeen se postavlja eksplicitno u svakoj grani', async () => {
    // Kolona nema @updatedAt, pa mora biti postavljena rucno — inace
    // sweeper nikad ne prepozna da je sesija zavrsena.
    await sessionLogger(makeReq(), makeRes(), vi.fn());
    const args = upsertArgs();
    expect(args.create.lastSeen).toBeInstanceOf(Date);
    expect(args.update.lastSeen).toBeInstanceOf(Date);
  });
});