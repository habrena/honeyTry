import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHash } from 'crypto';
import { makeReq, makeRes } from './helpers/http';

/**
 * ============================================================================
 *  sessionLogger — jedinicni testovi SA mockom
 * ============================================================================
 *  Za razliku od stripNul, ova funkcija sama dohvaca podatke (db.session.*)
 *  i sama proizvodi nuspojave (res.cookie). Da bi se testirala grana po grana,
 *  baza mora biti zamijenjena test doubleom ciji odgovor test kontrolise.
 *
 *  stripNul se NE mockira — cista je i jeftina, pa testovi vjerno pokrivaju
 *  i interakciju izmedju ciscenja i skracivanja na 512 znakova.
 * ============================================================================
 */

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    session: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('../src/database/db', () => ({ db: dbMock }));

import { sessionLogger } from '../src/middleware/sessionLogger';

const COOKIE_NAME = 'mngmt_id';

/** Ponavlja racun otiska iz implementacije, da test ne zavisi od hardkodovanog hasha. */
function expectedFingerprint(ip: string, ua: string): string {
  return 'f:' + createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 32);
}

const SESSION_ROW = { id: 'sess-1', cookieId: 'cookie-abc', tokenId: 'HT-001' };

beforeEach(() => {
  vi.clearAllMocks();
  dbMock.session.findUnique.mockResolvedValue(null);
  dbMock.session.findFirst.mockResolvedValue(null);
  dbMock.session.update.mockResolvedValue(SESSION_ROW);
  dbMock.session.upsert.mockResolvedValue(SESSION_ROW);
});

describe('sessionLogger — izvlacenje izvorne IP adrese', () => {
  it('uzima prvu adresu iz x-forwarded-for lanca i uklanja razmake', () => {
    // Iza obrnutog proxyja zaglavlje sadrzi lanac. Prva adresa je klijent,
    // ostale su proxyji. Bez ovoga bi sve sesije dijelile IP proxyja i
    // otisak bi ih spojio u jednu.
    const req = makeReq({
      headers: { 'x-forwarded-for': ' 203.0.113.9 , 10.0.0.1, 10.0.0.2' },
    });

    return sessionLogger(req, makeRes(), vi.fn()).then(() => {
      expect(dbMock.session.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ sourceIp: '203.0.113.9' }),
        }),
      );
    });
  });

  it('pada na req.ip kada je x-forwarded-for niz umjesto stringa', async () => {
    // Express vraca niz ako je zaglavlje poslano vise puta. Napadac to moze
    // izazvati namjerno. Uslov typeof === 'string' ga hvata.
    const req = makeReq({
      headers: { 'x-forwarded-for': ['203.0.113.9', '198.51.100.1'] },
      ip: '198.51.100.7',
    });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ sourceIp: '198.51.100.7' }) }),
    );
  });

  it('uklanja IPv6-mapirani IPv4 prefiks', async () => {
    const req = makeReq({ ip: '::ffff:192.168.1.50', headers: {} });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ sourceIp: '192.168.1.50' }) }),
    );
  });

  it('uklanja prefiks samo sa pocetka, ne iz sredine niza znakova', async () => {
    // Regex je usidren sa ^. Bez sidra bi napadac mogao poslati
    // x-forwarded-for koji sadrzi taj niz i izmijeniti zabiljezenu adresu.
    const req = makeReq({ headers: { 'x-forwarded-for': '10.0.0.1::ffff:1.2.3.4' } });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ sourceIp: '10.0.0.1::ffff:1.2.3.4' }),
      }),
    );
  });
});

describe('sessionLogger — user agent i honey token', () => {
  it('upisuje "unknown" kada zaglavlje user-agent nedostaje', async () => {
    const req = makeReq({ headers: {} });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ userAgent: 'unknown' }) }),
    );
  });

  it('skracuje user agent na 512 znakova', async () => {
    // Prazna zastita: skener moze poslati zaglavlje od nekoliko kilobajta.
    const req = makeReq({ headers: { 'user-agent': 'A'.repeat(5000) } });

    await sessionLogger(req, makeRes(), vi.fn());

    const arg = dbMock.session.upsert.mock.calls[0][0];
    expect(arg.create.userAgent).toHaveLength(512);
  });

  it('cisti NUL bajt iz user agenta prije upisa', async () => {
    const req = makeReq({ headers: { 'user-agent': 'sqlmap\u0000/1.7' } });

    await sessionLogger(req, makeRes(), vi.fn());

    const arg = dbMock.session.upsert.mock.calls[0][0];
    expect(arg.create.userAgent).toBe('sqlmap\\u0000/1.7');
    expect(arg.create.userAgent).not.toContain('\u0000');
  });

  it('uzima honey token iz query parametra ref kada postoji', async () => {
    const req = makeReq({ query: { ref: 'HT-CARDIO-07' } });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ tokenId: 'HT-CARDIO-07' }) }),
    );
  });

  it('pada na zaglavlje x-token-id kada nema query parametra', async () => {
    const req = makeReq({ headers: { 'x-token-id': 'HT-HEADER-02' } });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ tokenId: 'HT-HEADER-02' }) }),
    );
  });

  it('koristi podrazumijevani token kada nema ni jednog izvora', async () => {
    await sessionLogger(makeReq(), makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ tokenId: 'HT-UKNOWN' }) }),
    );
  });

  it('ignorise ref poslan vise puta i pada na podrazumijevanu vrijednost', async () => {
    // ?ref=a&ref=b daje niz. Uslov typeof === 'string' ga odbacuje.
    const req = makeReq({ query: { ref: ['a', 'b'] } });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ tokenId: 'HT-UKNOWN' }) }),
    );
  });
});

describe('sessionLogger — otisak kao kljuc identiteta', () => {
  it('proizvodi isti sessionKey za isti par IP i user agent', async () => {
    const headers = { 'user-agent': 'curl/8.4.0' };

    await sessionLogger(makeReq({ ip: '203.0.113.5', headers }), makeRes(), vi.fn());
    await sessionLogger(makeReq({ ip: '203.0.113.5', headers }), makeRes(), vi.fn());

    const first = dbMock.session.upsert.mock.calls[0][0].where.sessionKey;
    const second = dbMock.session.upsert.mock.calls[1][0].where.sessionKey;

    expect(first).toBe(second);
    expect(first).toBe(expectedFingerprint('203.0.113.5', 'curl/8.4.0'));
  });

  it('proizvodi razlicit sessionKey kada se promijeni user agent', async () => {
    // Posljedica dizajna: napadac koji rotira user agent dobija novu sesiju
    // i time nov budzet za LLM analizu. Test to cini vidljivim.
    await sessionLogger(
      makeReq({ ip: '203.0.113.5', headers: { 'user-agent': 'curl/8.4.0' } }),
      makeRes(), vi.fn(),
    );
    await sessionLogger(
      makeReq({ ip: '203.0.113.5', headers: { 'user-agent': 'curl/8.5.0' } }),
      makeRes(), vi.fn(),
    );

    const first = dbMock.session.upsert.mock.calls[0][0].where.sessionKey;
    const second = dbMock.session.upsert.mock.calls[1][0].where.sessionKey;

    expect(first).not.toBe(second);
  });
});

describe('sessionLogger — grananje po kolacicu', () => {
  it('pronalazi postojecu sesiju preko cookieId i osvjezava lastSeen', async () => {
    dbMock.session.findFirst.mockResolvedValue(SESSION_ROW);
    const req = makeReq({ cookies: { [COOKIE_NAME]: 'cookie-abc' } });
    const res = makeRes();

    await sessionLogger(req, res, vi.fn());

    expect(dbMock.session.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'sess-1' },
        data: expect.objectContaining({ lastSeen: expect.any(Date) }),
      }),
    );
    expect(dbMock.session.upsert).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();     // kolacic se ne postavlja ponovo
    expect(req.session).toEqual(SESSION_ROW);
  });

  it('ne prepisuje honey token postojece sesije novim tokenom', async () => {
    // Prvi token pobjedjuje. Napadac koji kasnije posalje drugi ?ref ne moze
    // zamijeniti trag o tome gdje je token prvobitno pokupljen.
    dbMock.session.findFirst.mockResolvedValue(SESSION_ROW);
    const req = makeReq({
      cookies: { [COOKIE_NAME]: 'cookie-abc' },
      query: { ref: 'HT-DRUGI' },
    });

    await sessionLogger(req, makeRes(), vi.fn());

    const updateData = dbMock.session.update.mock.calls[0][0].data;
    expect(updateData).not.toHaveProperty('tokenId');
  });

  it('postavlja novi kolacic kada zahtjev ne nosi nijedan', async () => {
    const res = makeRes();

    await sessionLogger(makeReq(), res, vi.fn());

    expect(res.cookie).toHaveBeenCalledWith(
      COOKIE_NAME,
      expect.stringMatching(/^[0-9a-f-]{36}$/),      // randomUUID
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
  });

  it('zadrzava vrijednost postojeceg kolacica kada sesija nije pronadjena', async () => {
    // Grana: kolacic postoji, ali sesija iza njega ne — npr. baza je
    // ocisceni test branch. Otisak preuzima ulogu kljuca, a cookieId se
    // prenosi da bi veza sa klijentom ostala.
    const res = makeRes();
    const req = makeReq({ cookies: { [COOKIE_NAME]: 'stari-cookie' } });

    await sessionLogger(req, res, vi.fn());

    expect(dbMock.session.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ cookieId: 'stari-cookie' }) }),
    );
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('NALAZ: pretraga po sessionKey "c:" nikad ne moze pogoditi red', async () => {
    // Nijedna grana u kodu ne kreira sesiju sa sessionKey oblika `c:<cookie>` —
    // create uvijek koristi otisak. Ova pretraga je zato mrtva i kosta jedan
    // upit prema Neonu na svakom zahtjevu koji nosi kolacic.
    const req = makeReq({ cookies: { [COOKIE_NAME]: 'cookie-abc' } });

    await sessionLogger(req, makeRes(), vi.fn());

    expect(dbMock.session.findUnique).toHaveBeenCalledWith({
      where: { sessionKey: 'c:cookie-abc' },
    });
    const created = dbMock.session.upsert.mock.calls[0][0].create;
    expect(created.sessionKey).toMatch(/^f:/);       // nikad 'c:'
  });
});

describe('sessionLogger — ponasanje pri gresci', () => {
  it('poziva next() i kada upis u bazu padne', async () => {
    dbMock.session.upsert.mockRejectedValue(new Error('Neon: connection terminated'));
    const next = vi.fn();
    const req = makeReq();

    await sessionLogger(req, makeRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.session).toBeUndefined();
  });

  it('poziva next() tacno jednom u uspjesnom toku', async () => {
    const next = vi.fn();

    await sessionLogger(makeReq(), makeRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});