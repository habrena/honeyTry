import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';

vi.mock('../../database/db', () => ({
  db: { event: { create: vi.fn() } },
}));
vi.mock('../../detection/runDetectors', () => ({
  runDetectors: vi.fn(() => []),
}));
vi.mock('../../detection/analysisEmitter', () => ({
  analysisEmitter: { emit: vi.fn() },
}));

import { eventLogger } from '../eventLogger';
import { db } from '../../database/db';
import { runDetectors } from '../../detection/runDetectors';
import { analysisEmitter } from '../../detection/analysisEmitter';

const SESSION = { id: 'sess-1', tokenId: 'HT-1', cookieId: 'c-1' };

// eventLogger čita samo: req.method, req.originalUrl, req.query,
// req.body, req.headers, req.session, res.statusCode, res.on('finish')
function makeReq(o: any = {}) {
  return {
    method: 'GET',
    originalUrl: '/api/test',
    query: {},
    body: undefined,
    headers: {},
    session: SESSION,
    ...o,
  };
}

function makeRes(statusCode = 200) {
  const res: any = new EventEmitter();
  res.statusCode = statusCode;
  return res;
}

// napravi req/res, pusti middleware, okini finish, sačekaj mikrotaskove
async function run(reqOptions: any = {}) {
  const req = makeReq(reqOptions);
  const res = makeRes();

  eventLogger(req as any, res as any, vi.fn());
  res.emit('finish');
  await new Promise(r => setImmediate(r));

  return { req, res };
}

beforeEach(() => {
  vi.clearAllMocks();
  (db.event.create as any).mockResolvedValue({ id: 'evt-1' });
  (runDetectors as any).mockReturnValue([]);
});

describe('sanity — mockovi su aktivni', () => {

  it('db.event.create je mock funkcija', () => {
    expect(vi.isMockFunction(db.event.create)).toBe(true);
  });

  it('analysisEmitter.emit je mock funkcija', () => {
    expect(vi.isMockFunction(analysisEmitter.emit)).toBe(true);
  });

  it('finish handler je registrovan i izvršava se', async () => {
    const req = makeReq();
    const res = makeRes();

    eventLogger(req as any, res as any, vi.fn());
    expect(res.listenerCount('finish')).toBe(1);

    res.emit('finish');
    await new Promise(r => setImmediate(r));

    expect(db.event.create).toHaveBeenCalled();
  });
});

describe('bodySnapshot — kada je null', () => {

  it('req.body je undefined → null', async () => {
    await run({ body: undefined });
    expect((db.event.create as any).mock.calls[0][0].data.body).toBeNull();
  });

  it('prazan objekat → null', async () => {
    await run({ body: {} });
    expect((db.event.create as any).mock.calls[0][0].data.body).toBeNull();
  });

  it('neprazno tijelo se čuva', async () => {
    await run({ method: 'POST', body: { q: "' OR 1=1--" } });
    expect((db.event.create as any).mock.calls[0][0].data.body).toEqual({ q: "' OR 1=1--" });
  });
});

describe('bodySnapshot — izolacija od mutacija', () => {

  it('brisanje polja u ruteru ne utiče na snapshot', async () => {
    const req = makeReq({ method: 'POST', originalUrl: '/x', body: { password: 'tajna', q: 'a' } });
    const res = makeRes();

    eventLogger(req as any, res as any, vi.fn());

    delete (req.body as any).password;      // ruter "sanitizuje"

    res.emit('finish');
    await new Promise(r => setImmediate(r));

    const stored = (db.event.create as any).mock.calls[0][0].data.body;
    expect(stored.password).toBe('tajna');
  });

  it('mutacija ugniježđenog objekta ne utiče na snapshot', async () => {
    const req = makeReq({ method: 'POST', originalUrl: '/x', body: { pacijent: { ime: 'Ana' } } });
    const res = makeRes();

    eventLogger(req as any, res as any, vi.fn());

    (req.body as any).pacijent.ime = 'IZMIJENJENO';

    res.emit('finish');
    await new Promise(r => setImmediate(r));

    expect((db.event.create as any).mock.calls[0][0].data.body.pacijent.ime).toBe('Ana');
  });
});

describe('bodySnapshot — BUG: neserijalizabilno tijelo ruši middleware', () => {

  it('cirkularna referenca ne smije rušiti middleware', () => {
    const body: any = { a: 1 };
    body.self = body;

    const req = makeReq({ method: 'POST', originalUrl: '/x', body });
    const res = makeRes();

    expect(() => eventLogger(req as any, res as any, vi.fn())).not.toThrow();
  });

  it('BigInt u tijelu ne smije rušiti middleware', () => {
    const req = makeReq({ method: 'POST', originalUrl: '/x', body: { n: BigInt(1) } });
    const res = makeRes();

    expect(() => eventLogger(req as any, res as any, vi.fn())).not.toThrow();
  });
});

describe('otpornost — pad detektora', () => {

  it('DETECTOR_FAILURE u metadata kad detektor baci', async () => {
    (runDetectors as any).mockImplementation(() => { throw new URIError('URI malformed'); });

    await run();

    const meta = (db.event.create as any).mock.calls[0][0].data.metadata;
    expect(meta[0].type).toBe('DETECTOR_FAILURE');
    expect(meta[0].confidence).toBeGreaterThanOrEqual(0.7);
    expect(meta[0].signals[0]).toContain('URIError');
  });

  it('event se svejedno upisuje kad detektor padne', async () => {
    (runDetectors as any).mockImplementation(() => { throw new Error('boom'); });

    await run({ originalUrl: '/api/x%zz' });

    expect(db.event.create).toHaveBeenCalledTimes(1);
    expect((db.event.create as any).mock.calls[0][0].data.endpoint).toContain('/api/x');
  });

  it('confidence prelazi prag pa okida Trigger 1', async () => {
    (runDetectors as any).mockImplementation(() => { throw new Error('x'); });
    await run();
    expect((db.event.create as any).mock.calls[0][0].data.metadata[0].confidence).toBe(0.75);
  });
});

describe('otpornost — pad upisa u bazu', () => {

  it('fallback red kad glavni create padne', async () => {
    (db.event.create as any)
      .mockRejectedValueOnce(new Error('22P05 unsupported Unicode escape'))
      .mockResolvedValueOnce({ id: 'evt-fallback' });

    await run();

    expect(db.event.create).toHaveBeenCalledTimes(2);
    const fb = (db.event.create as any).mock.calls[1][0].data;
    expect(fb.endpoint).toBe('[UNSTORABLE]');
    expect(fb.metadata[0].type).toBe('STORAGE_FAILURE');
    expect(fb.sessionId).toBe('sess-1');
  });

  it('fallback čuva razlog greške', async () => {
    (db.event.create as any)
      .mockRejectedValueOnce(new Error('22P05 unsupported Unicode escape'))
      .mockResolvedValueOnce({ id: 'evt-fallback' });

    await run();

    expect((db.event.create as any).mock.calls[1][0].data.metadata[0].signals[0])
      .toContain('22P05');
  });

  it('i pad fallbacka ne ruši proces', async () => {
    (db.event.create as any).mockRejectedValue(new Error('baza mrtva'));

    await expect(run()).resolves.toBeDefined();
    expect(db.event.create).toHaveBeenCalledTimes(2);
  });

  it('pad detektora I pad upisa → fallback tačno jednom', async () => {
    (runDetectors as any).mockImplementation(() => { throw new Error('detektor'); });
    (db.event.create as any)
      .mockRejectedValueOnce(new Error('baza'))
      .mockResolvedValueOnce({ id: 'evt-fb' });

    await run();

    expect(db.event.create).toHaveBeenCalledTimes(2);
    expect((db.event.create as any).mock.calls[1][0].data.endpoint).toBe('[UNSTORABLE]');
  });
});

describe('otpornost — emitter', () => {

  it('emit se ne poziva kad glavni upis padne', async () => {
    (db.event.create as any)
      .mockRejectedValueOnce(new Error('pad'))
      .mockResolvedValueOnce({ id: 'evt-fb' });

    await run();

    expect(analysisEmitter.emit).not.toHaveBeenCalled();
  });

  it('emit dobija ispravan payload', async () => {
    (runDetectors as any).mockReturnValue([{ type: 'SQL_INJECTION', confidence: 0.9, signals: ['UNION'] }]);

    await run();

    expect(analysisEmitter.emit).toHaveBeenCalledWith('event:logged', {
      eventId: 'evt-1',
      sessionId: 'sess-1',
      detections: [{ type: 'SQL_INJECTION', confidence: 0.9, signals: ['UNION'] }],
    });
  });

    it('emituje se tačno jednom po zahtjevu', async () => {
    await run();
    expect(analysisEmitter.emit).toHaveBeenCalledTimes(1);
  });

  it('naziv eventa je "event:logged"', async () => {
    await run();
    expect((analysisEmitter.emit as any).mock.calls[0][0]).toBe('event:logged');
  });

  it('eventId dolazi iz odgovora baze, ne izmišljen', async () => {
    (db.event.create as any).mockResolvedValue({ id: 'evt-iz-baze-123' });
    await run();
    expect((analysisEmitter.emit as any).mock.calls[0][1].eventId).toBe('evt-iz-baze-123');
  });

  it('prazan niz detekcija se i dalje emituje', async () => {
    (runDetectors as any).mockReturnValue([]);
    await run();
    expect((analysisEmitter.emit as any).mock.calls[0][1].detections).toEqual([]);
  });

  it('DETECTOR_FAILURE stiže do emittera', async () => {
    (runDetectors as any).mockImplementation(() => { throw new URIError('URI malformed'); });
    await run();
    const payload = (analysisEmitter.emit as any).mock.calls[0][1];
    expect(payload.detections[0].type).toBe('DETECTOR_FAILURE');
  });

  it('BUG: sinhroni izuzetak u slušaocu ruši handler', async () => {
    (analysisEmitter.emit as any).mockImplementation(() => { throw new Error('slušalac pukao'); });
    await run();
    // fallback se poziva jer emit je unutar glavnog try bloka
    expect(db.event.create).toHaveBeenCalledTimes(2);
    expect((db.event.create as any).mock.calls[1][0].data.endpoint).toBe('[UNSTORABLE]');
  });
});

describe('osnovni tok — polja eventa', () => {

  it('bez sesije nema upisa', async () => {
    const req = makeReq({ session: undefined });
    const res = makeRes();
    eventLogger(req as any, res as any, vi.fn());
    res.emit('finish');
    await new Promise(r => setImmediate(r));
    expect(db.event.create).not.toHaveBeenCalled();
  });

  it('next() se poziva sinhrono, prije finish-a', () => {
    const next = vi.fn();
    eventLogger(makeReq() as any, makeRes() as any, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('sessionId se preuzima iz req.session', async () => {
    await run();
    expect((db.event.create as any).mock.calls[0][0].data.sessionId).toBe('sess-1');
  });

  it('metoda i endpoint se prenose', async () => {
    await run({ method: 'POST', originalUrl: '/api/pacijenti/search?q=1' });
    const d = (db.event.create as any).mock.calls[0][0].data;
    expect(d.method).toBe('POST');
    expect(d.endpoint).toBe('/api/pacijenti/search?q=1');
  });

  it('statusCode dolazi iz odgovora, ne iz zahtjeva', async () => {
    const req = makeReq();
    const res = makeRes(404);
    eventLogger(req as any, res as any, vi.fn());
    res.emit('finish');
    await new Promise(r => setImmediate(r));
    expect((db.event.create as any).mock.calls[0][0].data.statusCode).toBe(404);
  });

  it('eventType je REQUEST_RECEIVED', async () => {
    await run();
    expect((db.event.create as any).mock.calls[0][0].data.eventType).toBe('REQUEST_RECEIVED');
  });
});

describe('osnovni tok — queryParams i metadata', () => {

  it('prazan query → undefined (Prisma izostavlja polje)', async () => {
    await run({ query: {} });
    expect((db.event.create as any).mock.calls[0][0].data.queryParams).toBeUndefined();
  });

  it('neprazan query se čuva', async () => {
    await run({ query: { q: "' OR 1=1--", limit: '500' } });
    expect((db.event.create as any).mock.calls[0][0].data.queryParams)
      .toEqual({ q: "' OR 1=1--", limit: '500' });
  });

  it('bez detekcija metadata je undefined', async () => {
    (runDetectors as any).mockReturnValue([]);
    await run();
    expect((db.event.create as any).mock.calls[0][0].data.metadata).toBeUndefined();
  });

  it('sa detekcijama metadata je niz', async () => {
    (runDetectors as any).mockReturnValue([
      { type: 'SQL_INJECTION', confidence: 0.9, signals: ['UNION SELECT'] },
      { type: 'AUTOMATED_SCAN', confidence: 0.4, signals: ['sqlmap UA'] },
    ]);
    await run();
    const meta = (db.event.create as any).mock.calls[0][0].data.metadata;
    expect(meta).toHaveLength(2);
    expect(meta[0].type).toBe('SQL_INJECTION');
  });
});

describe('osnovni tok — sanitizacija ulaza', () => {

  it('detektori dobijaju sanitizovan URL', async () => {
    await run({ originalUrl: '/api/x?q=a\u0000b' });
    expect((runDetectors as any).mock.calls[0][0].endpoint).toContain('\\u0000');
  });

  it('detektori i baza vide isti sadržaj', async () => {
    await run({ originalUrl: '/api/x?q=a\u0000b' });
    const zaDetektore = (runDetectors as any).mock.calls[0][0].endpoint;
    const uBazu = (db.event.create as any).mock.calls[0][0].data.endpoint;
    expect(zaDetektore).toBe(uBazu);
  });

  it('vrijednost kolačića je redigovana u bazi', async () => {
    await run({ headers: { cookie: 'appt_sid=tajna123' } });
    const h = (db.event.create as any).mock.calls[0][0].data.headers;
    expect(JSON.stringify(h)).not.toContain('tajna123');
  });
});

