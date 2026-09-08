import { describe, it, expect } from 'vitest';
import { sanitizeHeaders } from '../eventLogger';

describe('sanitizeHeaders — redakcija kolačića', () => {

  it('zadržava imena, sakriva vrijednosti', () => {
    const result = sanitizeHeaders({ cookie: 'appt_sid=abc123; theme=dark' });
    expect(result.cookie).toBe('appt_sid=***; theme=***');
  });

  it('uklanja višak razmaka oko imena', () => {
    const result = sanitizeHeaders({ cookie: '  a=1;   b=2  ' });
    expect(result.cookie).toBe('a=***; b=***');
  });

  it('jedan kolačić bez tačke-zareza', () => {
    expect(sanitizeHeaders({ cookie: 'sid=xyz' }).cookie).toBe('sid=***');
  });

  it('ostale headere ne dira', () => {
    const result = sanitizeHeaders({ 'user-agent': 'sqlmap/1.7', accept: '*/*' });
    expect(result['user-agent']).toBe('sqlmap/1.7');
    expect(result.accept).toBe('*/*');
  });

  it('radi kad nema cookie headera', () => {
    expect(() => sanitizeHeaders({ accept: '*/*' })).not.toThrow();
  });

  it('ne mijenja originalni objekat', () => {
    const original = { cookie: 'sid=secret' };
    sanitizeHeaders(original);
    expect(original.cookie).toBe('sid=secret');
  });
});

describe('sanitizeHeaders — deformisan ulaz', () => {

  it('kolačić bez znaka jednakosti', () => {
    expect(() => sanitizeHeaders({ cookie: 'samoime' })).not.toThrow();
  });

  it('prazan kolačić', () => {
    expect(() => sanitizeHeaders({ cookie: '' })).not.toThrow();
  });

  it('samo tačke-zarezi', () => {
    expect(() => sanitizeHeaders({ cookie: ';;;' })).not.toThrow();
  });

  it('BUG: cookie kao niz ruši funkciju', () => {
    expect(() => sanitizeHeaders({ cookie: ['a=1', 'b=2'] })).not.toThrow();
  });
});

describe('sanitizeHeaders — nedostajuća redakcija', () => {

  it('BUG: authorization se čuva u čistom tekstu', () => {
    const result = sanitizeHeaders({ authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.secret' });
    expect(result.authorization).not.toContain('secret');
  });

  it('BUG: x-api-key se čuva u čistom tekstu', () => {
    const result = sanitizeHeaders({ 'x-api-key': 'sk-live-abc123' });
    expect(result['x-api-key']).not.toContain('abc123');
  });
});