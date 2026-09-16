import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { EventEmitter } from 'events';

/**
 * ============================================================================
 *  analysisWorker — jedinicni testovi SA mockom
 * ============================================================================
 *  Worker je namjerno tanak: prima obavjestenje da je event upisan i
 *  prosljedjuje ga u red. Sve odluke donosi triggerEvaluator, pa ovdje
 *  postoje samo tri osobine vrijedne provjere — da obavjestenje uopste
 *  stize do reda, da nedostajuce detekcije postaju prazan niz i da pad
 *  reda ne rusi slusaoca.
 *
 *  Red se ovdje zamjenjuje, za razliku od analysisQueue.test.ts gdje je
 *  stvaran. Time se provjerava sta worker salje, bez ponavljanja testova o
 *  ponasanju samog reda.
 *
 *  Slusalac se registruje pri ucitavanju modula, pa se i modul i emitter
 *  ucitavaju iznova pred svaki test. Bez toga bi se slusaoci nagomilavali
 *  i jedno obavjestenje bi se brojalo vise puta.
 * ============================================================================
 */

const { enqueueMock } = vi.hoisted(() => ({ enqueueMock: vi.fn() }));

vi.mock('../src/detection/analysisQueue', () => ({
  enqueue: enqueueMock,
  queueStatus: vi.fn(() => ({ pending: 0, running: 0 })),
}));

let emitter: EventEmitter;

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});

  // Redoslijed je bitan: emitter se ucitava prvi da bi worker, koji ga
  // uvozi, dobio tacno ovu instancu iz osvjezenog registra modula.
  ({ analysisEmitter: emitter } = await import('../src/detection/analysisEmitter'));
  await import('../src/detection/analysisWorker');
});

describe('analysisWorker', () => {
  it('registruje tacno jednog slusaoca na obavjestenje o upisanom eventu', () => {
    expect(emitter.listenerCount('event:logged')).toBe(1);
  });

  it('prosljedjuje sesiju, event i detekcije u red', () => {
    const detections = [{ type: 'SQL_INJECTION', confidence: 0.95 }];

    emitter.emit('event:logged', { eventId: 'e1', sessionId: 'A', detections });

    expect(enqueueMock).toHaveBeenCalledWith({
      sessionId: 'A',
      eventId: 'e1',
      detections,
    });
  });

  it('pretvara nedostajuce detekcije u prazan niz', () => {
    // triggerEvaluator poziva find nad tim poljem. Vrijednost undefined bi
    // tamo srusila evaluaciju, pa se normalizacija radi ovdje.
    emitter.emit('event:logged', { eventId: 'e1', sessionId: 'A' });

    expect(enqueueMock).toHaveBeenCalledWith(
      expect.objectContaining({ detections: [] }),
    );
  });

  it('ne ceka zavrsetak obrade — princip posalji i zaboravi', () => {
    // Slusalac je sinhron i vraca se odmah. Da ceka, res.on('finish') u
    // eventLoggeru bi drzao odgovor otvorenim dok traje analiza.
    enqueueMock.mockImplementation(() => new Promise(() => {}));

    expect(() =>
      emitter.emit('event:logged', { eventId: 'e1', sessionId: 'A', detections: [] }),
    ).not.toThrow();
  });

  it('hvata gresku iz reda i ne rusi emitovanje', () => {
    // Neuhvacena greska u slusaocu EventEmittera se propagira pozivaocu,
    // dakle nazad u eventLogger. Zato try/catch mora stajati ovdje.
    enqueueMock.mockImplementation(() => {
      throw new Error('red je pukao');
    });

    expect(() =>
      emitter.emit('event:logged', { eventId: 'e1', sessionId: 'A', detections: [] }),
    ).not.toThrow();
  });

  it('nastavlja da prima obavjestenja nakon greske', () => {
    enqueueMock.mockImplementationOnce(() => {
      throw new Error('red je pukao');
    });

    emitter.emit('event:logged', { eventId: 'e1', sessionId: 'A', detections: [] });
    emitter.emit('event:logged', { eventId: 'e2', sessionId: 'B', detections: [] });

    expect(enqueueMock).toHaveBeenCalledTimes(2);
    expect(enqueueMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ sessionId: 'B' }),
    );
  });

  it('ignorise obavjestenja drugog tipa', () => {
    emitter.emit('event:something-else', { sessionId: 'A' });

    expect(enqueueMock).not.toHaveBeenCalled();
  });
});