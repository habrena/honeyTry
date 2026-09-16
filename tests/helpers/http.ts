import { EventEmitter } from 'events';
import { vi } from 'vitest';

/**
 * Lazni Express Request. Namjerno je minimalan — middleware koristi samo
 * nekoliko polja, pa nema potrebe simulirati cijeli Express objekat.
 */
export function makeReq(overrides: Record<string, any> = {}): any {
  return {
    method: 'GET',
    originalUrl: '/api/appointments',
    url: '/api/appointments',
    query: {},
    body: {},
    headers: {},
    cookies: {},
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  };
}

/**
 * Lazni Express Response zasnovan na pravom EventEmitteru, jer eventLogger
 * registruje slusaoca na 'finish'. Bez pravog emittera test ne bi mogao
 * reprodukovati trenutak u kojem se logiranje zaista desava.
 */
export function makeRes(statusCode = 200): any {
  const res: any = new EventEmitter();
  res.statusCode = statusCode;
  res.cookie = vi.fn();
  res.finish = async () => {
    res.emit('finish');
    await flush();
  };
  return res;
}

/**
 * Slusalac na 'finish' je async, a EventEmitter ga ne ceka. Ovim se
 * mikro i makro zadaci isprazne prije nego sto test provjeri ocekivanja.
 */
export async function flush(times = 8): Promise<void> {
  for (let i = 0; i < times; i++) {
    await new Promise((r) => setImmediate(r));
  }
}