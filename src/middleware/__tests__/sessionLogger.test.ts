import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';

vi.mock('../../database/db', () => ({
  db: { session: { upsert: vi.fn() } },
}));

import { sessionLogger } from '../sessionLogger';
import { db } from '../../database/db';

function makeReq(o: any = {}) {
  return {
    method: 'GET',
    query: {},
    headers: {},
    cookies: {},
    ip: '127.0.0.1',
    socket: { remoteAddress: '127.0.0.1' },
    ...o,
  };
}

function makeRes() {
  const res: any = new EventEmitter();
  res.cookie = vi.fn();
  return res;
}

async function run(reqOptions: any = {}) {
  const req = makeReq(reqOptions);
  const res = makeRes();
  const next = vi.fn();
  await sessionLogger(req as any, res as any, next);
  return { req, res, next };
}

beforeEach(() => {
  vi.clearAllMocks();
  (db.session.upsert as any).mockResolvedValue({ id: 'sess-1', tokenId: 'HT-1' });
});

describe('honey token — izvor tokena', () => {

  it('token iz query parametra ref', async () => {
    await run({ query: { ref: 'HT-000001' } });
    expect((db.session.upsert as any).mock.calls[0][0].create.tokenId).toBe('HT-000001');
  });

  it('token iz x-token-id headera', async () => {
    await run({ headers: { 'x-token-id': 'HT-HEADER' } });
    expect((db.session.upsert as any).mock.calls[0][0].create.tokenId).toBe('HT-HEADER');
  });

  it('query ima prioritet nad headerom', async () => {
    await run({ query: { ref: 'HT-QUERY' }, headers: { 'x-token-id': 'HT-HEADER' } });
    expect((db.session.upsert as any).mock.calls[0][0].create.tokenId).toBe('HT-QUERY');
  });

  it('bez tokena -> HT-UKNOWN', async () => {
    await run();
    expect((db.session.upsert as any).mock.calls[0][0].create.tokenId).toBe('HT-UKNOWN');
  });
});

describe('honey token — deformisan ulaz', () => {

  it('ref kao niz daje objekat umjesto stringa', async () => {
    await run({ query: { ref: ['HT-1', 'HT-2'] } });
    const tokenId = (db.session.upsert as any).mock.calls[0][0].create.tokenId;
    expect(typeof tokenId).toBe('string');
  });

  it('nul bajt u ref ruši upsert', async () => {
    await run({ query: { ref: 'HT-\u0000001' } });
    const tokenId = (db.session.upsert as any).mock.calls[0][0].create.tokenId;
    expect(tokenId).not.toContain('\u0000');
  });

  it('predugačak ref se ne skraćuje', async () => {
    await run({ query: { ref: 'A'.repeat(10_000) } });
    const tokenId = (db.session.upsert as any).mock.calls[0][0].create.tokenId;
    expect(tokenId.length).toBeLessThanOrEqual(256);
  });

  it('prazan ref pada na sljedeći izvor', async () => {
    await run({ query: { ref: '' }, headers: { 'x-token-id': 'HT-HEADER' } });
    expect((db.session.upsert as any).mock.calls[0][0].create.tokenId).toBe('HT-HEADER');
  });
});

describe('sessionLogger — kolačić i tok', () => {

  it('bez kolačića se generiše novi', async () => {
    const { res } = await run({ cookies: {} });
    expect(res.cookie).toHaveBeenCalledTimes(1);
    const [name, value] = (res.cookie as any).mock.calls[0];
    expect(name).toBe('appt_sid');
    expect(value).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('sa postojećim kolačićem se ne postavlja novi', async () => {
    const { res } = await run({ cookies: { appt_sid: 'postojeci-uuid' } });
    expect(res.cookie).not.toHaveBeenCalled();
    expect((db.session.upsert as any).mock.calls[0][0].where.cookieId).toBe('postojeci-uuid');
  });

  it('x-forwarded-for: uzima prvi IP iz lanca', async () => {
    await run({ headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } });
    expect((db.session.upsert as any).mock.calls[0][0].create.sourceIp).toBe('1.2.3.4');
  });

  it('IPv6-mapirani IPv4 prefiks se uklanja', async () => {
    await run({ ip: '::ffff:192.168.1.1' });
    expect((db.session.upsert as any).mock.calls[0][0].create.sourceIp).toBe('192.168.1.1');
  });

  it('next() se poziva i kad upsert padne', async () => {
    (db.session.upsert as any).mockRejectedValue(new Error('baza mrtva'));
    const { req, next } = await run();
    expect(next).toHaveBeenCalledTimes(1);
    expect((req as any).session).toBeUndefined();
  });
});