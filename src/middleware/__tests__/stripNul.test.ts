import { describe, it, expect } from 'vitest';
import { stripNul } from '../stripNul';

describe('stripNul — osnovna zamjena', () => {

  it('zamjenjuje nul bajt vidljivim tekstom', () => {
    expect(stripNul('abc\u0000def')).toBe('abc\\u0000def');
  });

  it('zamjenjuje sve pojave, ne samo prvu', () => {
    expect(stripNul('\u0000a\u0000b\u0000')).toBe('\\u0000a\\u0000b\\u0000');
  });

  it('ne mijenja string bez nul bajta', () => {
    const s = '/api/pacijenti/search?q=test';
    expect(stripNul(s)).toBe(s);
  });

  it('prazan string ostaje prazan', () => {
    expect(stripNul('')).toBe('');
  });
});

describe('stripNul — rekurzija kroz strukture', () => {

  it('obrađuje vrijednosti u objektu', () => {
    expect(stripNul({ q: 'a\u0000b', r: 'ok' }))
      .toEqual({ q: 'a\\u0000b', r: 'ok' });
  });

  it('obrađuje elemente niza', () => {
    expect(stripNul(['a\u0000', 'b'])).toEqual(['a\\u0000', 'b']);
  });

  it('ulazi u ugniježđene strukture', () => {
    const input = { level1: { level2: [{ level3: 'x\u0000y' }] } };
    expect(stripNul(input)).toEqual({ level1: { level2: [{ level3: 'x\\u0000y' }] } });
  });

  it('čisti i ključeve, ne samo vrijednosti', () => {
    const result = stripNul({ 'bad\u0000key': 'value' }) as Record<string, string>;
    expect(Object.keys(result)).toEqual(['bad\\u0000key']);
  });
});

describe('stripNul — tipovi koji nisu string', () => {

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['broj', 42],
    ['nula', 0],
    ['boolean', false],
  ])('%s prolazi nepromijenjen', (_label, value) => {
    expect(stripNul(value)).toBe(value);
  });
});

describe('stripNul — sigurnosni rubni slučajevi', () => {

  it('BUG: __proto__ kao ključ zagađuje prototip', () => {
    const malicious = JSON.parse('{"__proto__": {"polluted": true}}');
    const result = stripNul(malicious);

    expect(({} as any).polluted).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it('BUG: nespareni surrogate prolazi i ruši Postgres', () => {
    const lone = 'a\uD800b';
    expect(stripNul(lone)).not.toContain('\uD800');
  });

  it('BUG: duboko ugniježđen objekat prelijeva stack', () => {
    let deep: any = 'x\u0000';
    for (let i = 0; i < 20_000; i++) deep = { nested: deep };
    expect(() => stripNul(deep)).not.toThrow();
  });
});

describe('stripNul — imutabilnost', () => {

  it('ne mijenja originalni objekat', () => {
    const original = { q: 'a\u0000b' };
    stripNul(original);
    expect(original.q).toBe('a\u0000b');
  });

  it('vraća novu referencu za objekte', () => {
    const original = { q: 'clean' };
    expect(stripNul(original)).not.toBe(original);
  });
});