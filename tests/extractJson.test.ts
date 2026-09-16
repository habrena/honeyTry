import { describe, it, expect, vi } from 'vitest';

/**
 *  Zasto je ovo osjetljivo mjesto: sadrzaj koji se parsira pise model, a
 *  model je procitao sadrzaj koji pise napadac. Ako parsiranje padne, poziv
 *  je placen a rezultat bacen; ako parsiranje uspije nad pogresnim isjeckom,
 *  u bazu ulazi zakljucak koji model nije dao. Oba ishoda su ovdje pokrivena.
 * ============================================================================
 */

//BITNO: sprecava da se pri pokretanju testa pokusa uspostaviti stvarna konekcija s bazom
vi.mock('../src/database/db', () => ({ db: {} }));
vi.mock('openai', () => ({ default: class {} }));

import { extractJson } from '../src/llm/llmClient';

interface Verdict {
  classification: string;
  confidence: number;
}

const VALID = '{"classification":"SQL_INJECTION","confidence":0.95}';

describe('extractJson — ispravan odgovor', () => {
  it('parsira cist JSON objekat', () => {
    const r = extractJson<Verdict>(VALID);

    expect(r).toEqual({ classification: 'SQL_INJECTION', confidence: 0.95 });
  });

  it('podnosi praznine i prelaske u novi red oko objekta', () => {
    const r = extractJson<Verdict>(`\n\n  ${VALID}  \n`);

    expect(r?.classification).toBe('SQL_INJECTION');
  });

  it('parsira ugnijezdene objekte i nizove', () => {
    // Oblik koji vraca batch klasifikacija.
    const raw = '{"events":[{"eventIndex":0,"severity":"high"}],"sessionVerdict":{"threatLevel":"critical"}}';

    const r = extractJson<any>(raw);

    expect(r.events[0].eventIndex).toBe(0);
    expect(r.sessionVerdict.threatLevel).toBe('critical');
  });
});

describe('extractJson — uklanjanje ogradivanja', () => {
  it('uklanja ogradu sa oznakom jezika', () => {
    // llm dodaje ogradu uprkos instrukciji da to ne radi
    const r = extractJson<Verdict>('```json\n' + VALID + '\n```');

    expect(r?.confidence).toBe(0.95);
  });

  it('uklanja ogradu bez oznake jezika', () => {
    const r = extractJson<Verdict>('```\n' + VALID + '\n```');

    expect(r?.confidence).toBe(0.95);
  });
});

describe('extractJson — izvlacenje iz okolnog teksta', () => {
  it('izvlaci objekat kada model doda uvodnu recenicu', () => {
    const r = extractJson<Verdict>(`Evo analize zahtjeva:\n${VALID}`);

    expect(r?.classification).toBe('SQL_INJECTION');
  });

  it('izvlaci objekat kada model doda zakljucnu recenicu', () => {
    const r = extractJson<Verdict>(`${VALID}\nNadam se da pomaze.`);

    expect(r?.classification).toBe('SQL_INJECTION');
  });

  it('izvlaci objekat okruzen tekstom sa obje strane', () => {
    const r = extractJson<Verdict>(`Razmislio sam. ${VALID} To je sve.`);

    expect(r?.confidence).toBe(0.95);
  });

  it('zadrzava viticaste zagrade unutar tekstualnih vrijednosti', () => {
    // Napadacki payload moze sadrzavati zagrade, a model ga prenosi u obrazlozenje
    const raw = 'Analiza: {"classification":"XSS_ATTEMPT","explanation":"payload {{7*7}} u parametru"}';

    const r = extractJson<any>(raw);

    expect(r.explanation).toContain('{{7*7}}');
  });
});

describe('extractJson — neuspjeh parsiranja', () => {
  it.each([
    ['prazan niz znakova', ''],
    ['samo praznine', '   \n  '],
    ['tekst bez zagrada', 'Ne mogu klasifikovati ovaj zahtjev.'],
    ['samo otvorena zagrada', 'Odgovor: {'],
    ['samo zatvorena zagrada', 'Odgovor: }'],
    ['zatvorena prije otvorene', '} nesto {'],
  ])('vraca null za %s', (_naziv, raw) => {
    expect(extractJson(raw)).toBeNull();
  });

  it('vraca null za odsjecen JSON', () => {
    // Do ovoga dolazi kad odgovor udari u granicu izlaznih tokena.
    // callLLM to hvata i ranije, preko finish_reason, ali parser to mora provjeriti
    const r = extractJson('{"events":[{"eventIndex":0,"classi');

    expect(r).toBeNull();
  });

  it('vraca null za sintaksno neispravan JSON', () => {
    expect(extractJson("{'classification': 'SQL_INJECTION',}")).toBeNull();
  });

  it('vraca null kada odgovor sadrzi dva odvojena objekta', () => {
    // Rez ide od prve do posljednje zagrade, pa nastaje neispravan spoj.
    // Ishod: bolje nista nego proizvoljno izabran objekat!!!
    expect(extractJson('{"a":1} {"b":2}')).toBeNull();
  });
});

describe('extractJson — dokumentovana ogranicenja', () => {
  it('OGRANICENJE: niz na najvisem nivou prolazi samo bez okolnog teksta', () => {
    // Direktan parse uspijeva nad nizom, ali rezervni put trazi viticastu
    // zagradu, pa niz okruzen tekstom ostaje neprepoznat. Nasi promptovi
    // traze objekat, pa ovo trenutno nije problem.
    expect(extractJson('[1,2,3]')).toEqual([1, 2, 3]);
    expect(extractJson('Evo niza: [1,2,3]')).toBeNull();
  });

  it('OGRANICENJE: oznaka ograde se uklanja i iz tekstualnih vrijednosti', () => {
    // Zamjena se primjenjuje na cijeli odgovor prije parsiranja. Ako model
    // u obrazlozenju citira niz znakova koji cini ogradu, taj niz nestaje
    // iz upisanog teksta. Sadrzaj se mijenja tiho, bez greske.
    const raw = '{"classification":"UNKNOWN","explanation":"napadac je poslao ```json blok"}';

    const r = extractJson<any>(raw);

    expect(r.explanation).toBe('napadac je poslao  blok');
    expect(r.explanation).not.toContain('json');
  });

  it('OGRANICENJE: vrijednost null se ne razlikuje od neuspjeha', () => {
    // JSON.parse('null') uspijeva i vraca null, sto je ista vrijednost
    // kojom funkcija oznacava neuspjeh. Pozivalac oba slucaja tretira
    // kao pad poziva, pa je posljedica bezopasna.
    expect(extractJson('null')).toBeNull();
  });

  it('OGRANICENJE: prolazi i vrijednosti koje nisu objekat', () => {
    // Provjera oblika odgovora ostavljena je pozivaocu. classifySessionBatch
    // zato provjerava postojanje polja events i sessionVerdict prije upisa.
    expect(extractJson('42')).toBe(42);
    expect(extractJson('"tekst"')).toBe('tekst');
  });
});