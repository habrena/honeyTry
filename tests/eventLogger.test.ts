import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeReq, makeRes, flush } from './helpers/http';

/**
 * ============================================================================
 *  eventLogger — jedinicni testovi SA mockom
 * ============================================================================
 *  Tri zavisnosti se zamjenjuju: baza (nuspojava), detektori (pravi detektori
 *  imaju vlastite testove, ovdje se testira samo kako eventLogger postupa sa
 *  onim sto mu vrate) i emitter (provjerava se da je obavjestenje poslano,
 *  ne sta se dalje sa njim desava).
 *
 *  Sustinska tesko?a ovog fajla: logiranje se ne desava u tijelu middlewarea
 *  nego u async slusaocu na 'finish'. Testovi zato moraju razdvojiti trenutak
 *  ulaska zahtjeva od trenutka zavrsetka odgovora — bas to razdvajanje je i
 *  razlog postojanja bodySnapshota.
 * ============================================================================
 */

const { dbMock, runDetectorsMock } = vi.hoisted(() => ({
  dbMock: { event: { create: vi.fn() } },
  runDetectorsMock: vi.fn(),
}));

vi.mock('../src/database/db', () => ({ db: dbMock }));
vi.mock('../src/detection/runDetectors', () => ({ runDetectors: runDetectorsMock }));

import { eventLogger, sanitizeHeaders } from '../src/middleware/eventLogger';
import { analysisEmitter } from '../src/detection/analysisEmitter';

const SESSION = { id: 'sess-1' };

/** Vraca `data` objekat prvog poziva db.event.create. */
function createdData(call = 0) {
  return dbMock.event.create.mock.calls[call][0].data;
}

beforeEach(() => {
  vi.clearAllMocks();
  runDetectorsMock.mockReturnValue([]);
  dbMock.event.create.mockResolvedValue({ id: 'evt-1' });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('eventLogger — ugradnja u lanac middlewarea', () => {
  it('poziva next() odmah i ne ceka zavrsetak odgovora', () => {
    const next = vi.fn();
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.listenerCount('finish')).toBe(1);
    expect(dbMock.event.create).not.toHaveBeenCalled();   // jos nista nije upisano
  });

  it('ne upisuje nista kada sessionLogger nije zakacio sesiju', async () => {
    // Do ovoga dolazi kada sessionLogger padne na bazi. Zahtjev tada prolazi
    // kroz aplikaciju, ali ostaje nezabiljezen — tiha praznina u podacima.
    const res = makeRes();

    eventLogger(makeReq({ session: undefined }), res, vi.fn());
    await res.finish();

    expect(dbMock.event.create).not.toHaveBeenCalled();
  });

  it('mjeri trajanje od ulaska zahtjeva do zavrsetka odgovora', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    vi.setSystemTime(new Date('2026-01-01T00:00:00.250Z'));
    await res.finish();

    expect(createdData().durationMs).toBe(250);
  });

  it('biljezi statusni kod koji je postavljen tek u trenutku zavrsetka', async () => {
    const res = makeRes(200);

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    res.statusCode = 404;                 // ruter je u medjuvremenu odlucio
    await res.finish();

    expect(createdData().statusCode).toBe(404);
  });
});

describe('eventLogger — snimak tijela zahtjeva', () => {
  it('cuva tijelo iz trenutka ulaska, a ne iz trenutka zavrsetka', async () => {
    // Ovo je jedini razlog zbog kojeg bodySnapshot uopste postoji. Express
    // handleri smiju mijenjati req.body; bez snimka bi u bazi zavrsio
    // izmijenjen sadrzaj umjesto onoga sto je napadac poslao.
    const req = makeReq({ session: SESSION, body: { payload: "1' OR 1=1--" } });
    const res = makeRes();

    eventLogger(req, res, vi.fn());
    req.body.payload = 'sanitizovano od strane handlera';
    await res.finish();

    expect(createdData().body).toEqual({ payload: "1' OR 1=1--" });
  });

  it('upisuje null kada je tijelo prazno', async () => {
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION, body: {} }), res, vi.fn());
    await res.finish();

    expect(createdData().body).toBeNull();
  });

  it('dodaje UNSERIALIZABLE_BODY kada tijelo sadrzi kruznu referencu', async () => {
    const circular: any = { name: 'x' };
    circular.self = circular;
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION, body: circular }), res, vi.fn());
    await res.finish();

    const data = createdData();
    expect(data.body._snapshotFailed).toBe(true);
    expect(data.metadata).toContainEqual(
      expect.objectContaining({ type: 'UNSERIALIZABLE_BODY', confidence: 0.6 }),
    );
    expect(data.signalCount).toBe(1);
  });

  it('dodaje UNSERIALIZABLE_BODY i kada tijelo sadrzi BigInt', async () => {
    // JSON.stringify baca TypeError na BigInt. Napadac to moze izazvati
    // namjerno da bi srusio logiranje — zato je i sam neuspjeh signal.
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION, body: { id: BigInt(9) } }), res, vi.fn());
    await res.finish();

    expect(createdData().metadata).toContainEqual(
      expect.objectContaining({ type: 'UNSERIALIZABLE_BODY' }),
    );
  });
});

describe('eventLogger — obrada rezultata detektora', () => {
  it('prosljedjuje ociscene vrijednosti detektorima', async () => {
    const req = makeReq({
      session: SESSION,
      originalUrl: '/admin\u0000.php',
      headers: { 'user-agent': 'nikto/2.5' },
      query: { id: '1' },
    });
    const res = makeRes();

    eventLogger(req, res, vi.fn());
    await res.finish();

    const arg = runDetectorsMock.mock.calls[0][0];
    expect(arg.endpoint).toBe('/admin\\u0000.php');
    expect(arg.endpoint).not.toContain('\u0000');
    expect(arg.userAgent).toBe('nikto/2.5');
  });

  it('pretvara pad detektora u DETECTOR_FAILURE umjesto da izgubi zahtjev', async () => {
    // Zahtjev koji rusi detektor je zanimljiviji od prosjecnog. Confidence
    // 0.9 je iznad HIGH_CONFIDENCE praga, pa ga triggerEvaluator eskalira.
    runDetectorsMock.mockImplementation(() => {
      throw new RangeError('Maximum call stack size exceeded');
    });
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    const data = createdData();
    expect(data.metadata[0]).toMatchObject({ type: 'DETECTOR_FAILURE', confidence: 0.9 });
    expect(data.metadata[0].signals[0]).toContain('RangeError');
    expect(dbMock.event.create).toHaveBeenCalledTimes(1);   // glavna putanja, ne rezervna
  });

  it('upisuje undefined u metadata kada nijedan detektor nije reagovao', async () => {
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    const data = createdData();
    expect(data.metadata).toBeUndefined();
    expect(data.detectionCount).toBe(0);
    expect(data.signalCount).toBe(0);
  });
});

describe('eventLogger — detectionCount i signalCount', () => {
  it('broji sve detekcije u detectionCount', async () => {
    runDetectorsMock.mockReturnValue([
      { type: 'SQL_INJECTION', confidence: 0.95, signals: ['UNION SELECT'] },
      { type: 'AUTOMATED_SCAN', confidence: 0.99, signals: ['sqlmap user agent'] },
    ]);
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    expect(createdData().detectionCount).toBe(2);
  });

  it('iskljucuje AUTOMATED_SCAN iz signalCount', async () => {
    // signalCount je polje po kojem classifySessionBatch bira evente za LLM.
    // Prepoznat alat sam po sebi ne opravdava trosak poziva — to rjesava
    // ruleClassifier. Ovaj test cuva tu ustedu od regresije.
    runDetectorsMock.mockReturnValue([
      { type: 'SQL_INJECTION', confidence: 0.95, signals: ['UNION SELECT'] },
      { type: 'AUTOMATED_SCAN', confidence: 0.99, signals: ['sqlmap user agent'] },
    ]);
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    expect(createdData().signalCount).toBe(1);
  });

  it('daje signalCount 0 kada je prepoznat samo skener', async () => {
    runDetectorsMock.mockReturnValue([
      { type: 'AUTOMATED_SCAN', confidence: 0.99, signals: ['nikto user agent'] },
    ]);
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    const data = createdData();
    expect(data.detectionCount).toBe(1);
    expect(data.signalCount).toBe(0);
  });
});

describe('eventLogger — obavjestenje analitickom lancu', () => {
  it('emituje event:logged sa identifikatorima i detekcijama', async () => {
    const detections = [{ type: 'XSS_ATTEMPT', confidence: 0.9, signals: ['<script>'] }];
    runDetectorsMock.mockReturnValue(detections);
    const spy = vi.spyOn(analysisEmitter, 'emit');
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    expect(spy).toHaveBeenCalledWith('event:logged', {
      eventId: 'evt-1',
      sessionId: 'sess-1',
      detections,
    });
  });

  it('emituje tek nakon uspjesnog upisa, da ne bi poslao nepostojeci eventId', async () => {
    const spy = vi.spyOn(analysisEmitter, 'emit');
    let resolveCreate: (v: any) => void;
    dbMock.event.create.mockReturnValue(new Promise((r) => { resolveCreate = r; }));
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    res.emit('finish');
    await flush();

    expect(spy).not.toHaveBeenCalled();             // upis jos traje
    resolveCreate!({ id: 'evt-9' });
    await flush();

    expect(spy).toHaveBeenCalledWith('event:logged', expect.objectContaining({ eventId: 'evt-9' }));
  });
});

describe('eventLogger — rezervna putanja pri padu upisa', () => {
  it('upisuje minimalan zapis sa oznakom [UNSTORABLE] kada glavni upis padne', async () => {
    dbMock.event.create
      .mockRejectedValueOnce(new Error('invalid byte sequence for encoding UTF8'))
      .mockResolvedValueOnce({ id: 'evt-fallback' });
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    expect(dbMock.event.create).toHaveBeenCalledTimes(2);
    const fallback = createdData(1);
    expect(fallback.endpoint).toBe('[UNSTORABLE]');
    expect(fallback.metadata[0]).toMatchObject({ type: 'STORAGE_FAILURE', confidence: 0.8 });
  });

  it('ne rusi proces kada i rezervni upis padne', async () => {
    // Slusalac na 'finish' je async. Neuhvacena greska bi postala
    // unhandled rejection i, zavisno od konfiguracije Node-a, srusila proces.
    dbMock.event.create.mockRejectedValue(new Error('Neon: too many connections'));
    const rejections: unknown[] = [];
    const onRejection = (e: unknown) => rejections.push(e);
    process.on('unhandledRejection', onRejection);
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();
    process.off('unhandledRejection', onRejection);

    expect(rejections).toHaveLength(0);
  });

  it('NALAZ: rezervna putanja ne emituje event:logged', async () => {
    // Zapis ostaje sa analyzedAt: null i ceka sessionSweeper, umjesto da
    // udje u red odmah. Kasnjenje je do 90 s + interval sweepera.
    dbMock.event.create
      .mockRejectedValueOnce(new Error('pad'))
      .mockResolvedValueOnce({ id: 'evt-fallback' });
    const spy = vi.spyOn(analysisEmitter, 'emit');
    const res = makeRes();

    eventLogger(makeReq({ session: SESSION }), res, vi.fn());
    await res.finish();

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('sanitizeHeaders', () => {
  it('zadrzava imena kolacica a redaktuje njihove vrijednosti', () => {
    // Imena otkrivaju koje kolacice napadac nosi i da li je pokupio mamac;
    // vrijednosti nisu potrebne jer se sesija prati preko cookieId.
    const result = sanitizeHeaders({ cookie: 'mngmt_id=abc123; theme=dark' });

    expect(result.cookie).toBe('mngmt_id=***; theme=***');
    expect(result.cookie).not.toContain('abc123');
  });

  it('ne mijenja objekat koji mu je proslijedjen', () => {
    const original = { cookie: 'a=1' };

    sanitizeHeaders(original);

    expect(original.cookie).toBe('a=1');
  });

  it('propusta zaglavlja bez kolacica nepromijenjeno', () => {
    const headers = { 'user-agent': 'curl/8.4.0', accept: '*/*' };

    expect(sanitizeHeaders(headers)).toEqual(headers);
  });

  it('podnosi kolacic bez znaka jednakosti', () => {
    expect(sanitizeHeaders({ cookie: 'samoime' }).cookie).toBe('samoime=***');
  });

  it('NALAZ: zaglavlje authorization se ne redaktuje', () => {
    // Redaktuje se samo cookie. Basic i Bearer kredencijali koje napadac
    // posalje zavrse u bazi u citljivom obliku. Za honeypot to moze biti
    // pozeljno (dokaz o pokusaju), ali mora biti svjesna odluka.
    const result = sanitizeHeaders({ authorization: 'Basic YWRtaW46YWRtaW4=' });

    expect(result.authorization).toBe('Basic YWRtaW46YWRtaW4=');
  });
});