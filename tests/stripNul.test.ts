import { describe, it, expect } from 'vitest';
import { stripNul } from '../src/middleware/stripNul';

/**
 *  Svrha funkcije: PostgreSQL odbija NUL bajt (U+0000) u text i jsonb poljima.
 *  Napadac ga moze poslati u putanji, zaglavlju ili tijelu zahtjeva. Ako
 *  prodje do Prisme, upis eventa pada i zahtjev ostaje nezabiljezen, sto je
 *  tacno ono sto napadac zeli. Funkcija ga zato pretvara u vidljiv tekst.
 * ============================================================================
 */

const NUL = '\u0000';          // stvarni NUL bajt
const ESC = '\\u0000';         // sest vidljivih znakova: \ u 0 0 0 0

describe('stripNul — osnovno ponasanje nad tekstom', () => {
  it('ne mijenja tekst koji ne sadrzi NUL bajt', () => {
    const input = '/api/appointments?doctorId=42';
    expect(stripNul(input)).toBe(input);
  });

  it('pretvara NUL bajt u vidljiv escape niz umjesto da ga brise', () => {
    // Naziv funkcije kaze "strip", ali ponasanje je "escape". To je namjerno:
    // brisanje bi unistilo dokaz o pokusaju napada, escape ga cuva.
    const result = stripNul(`admin${NUL}.php`);

    expect(result).toBe(`admin${ESC}.php`);
    expect(result).not.toContain(NUL);
    expect(result.length).toBeGreaterThan(`admin.php`.length);
  });

  it('zamjenjuje SVE pojave NUL bajta, ne samo prvu', () => {
    // Regex je deklarisan sa /g zastavicom na nivou modula. Ovaj test cuva
    // od regresije u kojoj bi neko uklonio /g i propustio ostale bajtove.
    const result = stripNul(`${NUL}a${NUL}b${NUL}`);

    expect(result).toBe(`${ESC}a${ESC}b${ESC}`);
    expect(result).not.toContain(NUL);
  });

  it('daje isti rezultat pri uzastopnim pozivima sa istim ulazom', () => {
    // NUL regex je modulska konstanta sa /g zastavicom. String.replace resetuje
    // lastIndex, ali .test() i .exec() ne bi. Ovaj test hvata regresiju ako
    // neko zamijeni replace nekom od te dvije metode.
    const input = `x${NUL}y`;

    expect(stripNul(input)).toBe(stripNul(input));
    expect(stripNul(input)).toBe(`x${ESC}y`);
  });
});

describe('stripNul — rekurzija kroz strukture', () => {
  it('cisti i kljuceve i vrijednosti objekta', () => {
    const input = { [`user${NUL}`]: `value${NUL}` };
    const result = stripNul(input) as Record<string, string>;

    expect(Object.keys(result)).toEqual([`user${ESC}`]);
    expect(result[`user${ESC}`]).toBe(`value${ESC}`);
  });

  it('prolazi kroz ugnijezdene objekte do pune dubine', () => {
    const input = {
      level1: { level2: { level3: `deep${NUL}payload` } },
    };
    const result = stripNul(input) as any;

    expect(result.level1.level2.level3).toBe(`deep${ESC}payload`);
  });

  it('cisti elemente niza i cuva njihov redoslijed', () => {
    const input = [`a${NUL}`, 'b', `c${NUL}`];
    const result = stripNul(input) as string[];

    expect(result).toEqual([`a${ESC}`, 'b', `c${ESC}`]);
  });

  it('obradjuje nizove objekata unutar objekta', () => {
    // Oblik koji stvarno stize iz tijela zahtjeva.
    const input = { items: [{ note: `x${NUL}` }, { note: 'y' }] };
    const result = stripNul(input) as any;

    expect(result.items[0].note).toBe(`x${ESC}`);
    expect(result.items[1].note).toBe('y');
  });

  it('vraca novu strukturu i ne mijenja original', () => {
    const input = { path: `a${NUL}b` };
    const result = stripNul(input) as any;

    expect(input.path).toBe(`a${NUL}b`);   // original netaknut
    expect(result).not.toBe(input);        // nova referenca
  });
});

describe('stripNul — vrijednosti koje se propustaju nepromijenjene', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['broj', 42],
    ['nula', 0],
    ['boolean true', true],
    ['boolean false', false],
  ])('vraca %s nepromijenjeno', (_naziv, value) => {
    expect(stripNul(value)).toBe(value);
  });

  it('vraca prazan objekat i prazan niz nepromijenjenog oblika', () => {
    expect(stripNul({})).toEqual({});
    expect(stripNul([])).toEqual([]);
  });

  it('ne pada na null vrijednosti unutar objekta', () => {
    // `value && typeof value === 'object'` — null je falsy, pa pada u
    // zadnji return. Test cuva od regresije u kojoj bi neko obrnuo uslov.
    const result = stripNul({ body: null, query: undefined }) as any;

    expect(result.body).toBeNull();
    expect(result.query).toBeUndefined();
  });
});

describe('stripNul — dokumentovana ogranicenja', () => {
  /**
   * Testovi ispod NE opisuju zeljeno ponasanje. Oni fiksiraju poznata
   * ogranicenja da bi bila vidljiva i da bi se primijetila promjena.
   * U radu pripadaju sekciji o granicnim slucajevima, ne o greskama.
   */

  it('OGRANICENJE: Date objekat se svodi na prazan objekat', () => {
    // Date je typeof 'object' i nije niz, pa ide u granu sa Object.entries,
    // koja za Date vraca prazan niz. U trenutnoj upotrebi ovo nije problem
    // jer bodySnapshot prolazi kroz JSON.parse(JSON.stringify(...)) prije
    // stripNul, sto Date vec pretvori u string. Postaje problem ako neko
    // ikad pozove stripNul nad objektom koji nije prosao kroz JSON.
    const result = stripNul({ createdAt: new Date('2026-01-01') }) as any;

    expect(result.createdAt).toEqual({});
  });

  it('OGRANICENJE: dva razlicita kljuca mogu se sudariti nakon escapea', () => {
    // Kljuc `a` + stvarni NUL postaje tekst "a\u0000".
    // Kljuc koji je vec bio tekst "a\u0000" ostaje isti.
    // Oba zavrsavaju kao isti kljuc — jedan tiho prepisuje drugi.
    // Napadac time moze ukloniti jedan parametar iz zabiljezenog zahtjeva.
    const input = { [`a${NUL}`]: 'prvi', [`a${ESC}`]: 'drugi' };
    const result = stripNul(input) as Record<string, string>;

    expect(Object.keys(result)).toHaveLength(1);
    expect(result[`a${ESC}`]).toBe('drugi');
  });

  it('OGRANICENJE: usamljeni surogat se ne uklanja', () => {
    // PostgreSQL odbija i nevalidne UTF-8 sekvence, ne samo NUL bajt.
    // stripNul pokriva samo U+0000, pa ovaj ulaz i dalje moze srusiti upis.
    const loneSurrogate = '\uD800';
    const result = stripNul(`x${loneSurrogate}y`);

    expect(result).toContain(loneSurrogate);
  });

  it('OGRANICENJE: escape povecava duzinu, sto se sudara sa kasnijim slice', () => {
  // sessionLogger radi stripNul(...).slice(0, 512). Jedan NUL bajt postaje
  // sest znakova, pa rez moze pasti usred escape niza i ostaviti krnji
  // fragment. Ovaj test fiksira tu posljedicu.
  const LIMIT = 512;
  const input = 'a'.repeat(LIMIT - 2) + NUL + 'b';
  const result = stripNul(input);
  const cut = result.slice(0, LIMIT);

  expect(result.length).toBe(LIMIT - 2 + 6 + 1);   // escape je sest znakova
  expect(cut).toHaveLength(LIMIT);
  expect(cut.endsWith(ESC)).toBe(false);           // escape nije cjelovit
  expect(cut).toMatch(/\\u$/);                     // rez je pao nakon dva znaka
});
});