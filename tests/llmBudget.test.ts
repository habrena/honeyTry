import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * ============================================================================
 *  llmBudget — jedinicni testovi sa laznim tajmerom
 * ============================================================================
 *  Modul ne pristupa bazi ni mrezi, pa mu nije potrebna zamjena zavisnosti.
 *  Ipak nije cista funkcija: drzi niz vremenskih oznaka na nivou modula i
 *  cita granicu iz okruzenja pri ucitavanju. Iz toga slijede dva zahtjeva.
 *
 *  Prvo, vrijeme mora biti fiksirano, jer se citav mehanizam svodi na
 *  poredjenje sa kliznim prozorom od jednog sata. Drugo, modul se mora
 *  ucitati iznova pred svaki test, inace bi se potroseno stanje prenosilo
 *  izmedju testova i rezultat bi zavisio od redoslijeda izvrsavanja.
 *
 *  Namjerno se ne testira trajnost budzeta izmedju pokretanja procesa —
 *  prozor je u memoriji svjesnom odlukom, sto je za honeypot prihvatljivo.
 * ============================================================================
 */

const T0 = new Date('2026-01-01T12:00:00.000Z');
const HOUR_MS = 60 * 60 * 1000;

/** Pomjera fiksirano vrijeme za zadani broj milisekundi od pocetka. */
const at = (ms: number) => vi.setSystemTime(new Date(T0.getTime() + ms));

type Budget = typeof import('../src/detection/llmBudget');
let budget: Budget;

/** Ucitava modul iznova, sa opcionalnom izmjenom granice u okruzenju. */
async function loadBudget(maxPerHour?: string): Promise<Budget> {
  vi.resetModules();
  if (maxPerHour === undefined) {
    delete process.env.LLM_MAX_CALLS_PER_HOUR;
  } else {
    process.env.LLM_MAX_CALLS_PER_HOUR = maxPerHour;
  }
  return import('../src/detection/llmBudget');
}

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(T0);
  budget = await loadBudget('5');      // mala granica, citljiviji testovi
});

afterEach(() => {
  vi.useRealTimers();
  delete process.env.LLM_MAX_CALLS_PER_HOUR;
});

describe('llmBudget — pocetno stanje', () => {
  it('pocinje sa nepotrosenim budzetom', () => {
    expect(budget.hasBudget()).toBe(true);
    expect(budget.budgetStatus()).toEqual({ used: 0, max: 5 });
  });

  it('cita granicu iz okruzenja', async () => {
    budget = await loadBudget('42');

    expect(budget.budgetStatus().max).toBe(42);
  });

  it('koristi podrazumijevanu granicu kada varijabla nije postavljena', async () => {
    budget = await loadBudget();

    expect(budget.budgetStatus().max).toBe(100);
  });
});

describe('llmBudget — trosenje', () => {
  it('propusta pozive dok ima mjesta i broji ih', () => {
    expect(budget.consumeBudget()).toBe(true);
    expect(budget.consumeBudget()).toBe(true);

    expect(budget.budgetStatus()).toEqual({ used: 2, max: 5 });
  });

  it('odbija poziv nakon sto je granica dosegnuta', () => {
    for (let i = 0; i < 5; i++) expect(budget.consumeBudget()).toBe(true);

    expect(budget.consumeBudget()).toBe(false);
    expect(budget.consumeBudget()).toBe(false);
  });

  it('GRANICA: posljednji dozvoljeni poziv prolazi, sljedeci ne', () => {
    // Poredjenje je >=, pa je peti poziv posljednji koji se propusta.
    for (let i = 0; i < 4; i++) budget.consumeBudget();

    expect(budget.hasBudget()).toBe(true);
    expect(budget.consumeBudget()).toBe(true);
    expect(budget.hasBudget()).toBe(false);
  });

  it('ne uvecava brojac kada je poziv odbijen', () => {
    for (let i = 0; i < 5; i++) budget.consumeBudget();
    budget.consumeBudget();
    budget.consumeBudget();

    expect(budget.budgetStatus().used).toBe(5);
  });

  it('hasBudget samo provjerava i ne trosi', () => {
    // Razdvajanje postoji da bi triggerEvaluator mogao citati stanje bez
    // posljedica, dok stvarni trosak biljezi tek klasifikator.
    budget.hasBudget();
    budget.hasBudget();
    budget.hasBudget();

    expect(budget.budgetStatus().used).toBe(0);
  });

  it('budgetStatus ne mijenja stanje', () => {
    budget.consumeBudget();

    expect(budget.budgetStatus().used).toBe(1);
    expect(budget.budgetStatus().used).toBe(1);
  });
});

describe('llmBudget — klizni prozor', () => {
  it('oslobadja mjesto nakon sto oznake izadju iz prozora', () => {
    for (let i = 0; i < 5; i++) budget.consumeBudget();
    expect(budget.hasBudget()).toBe(false);

    at(HOUR_MS + 1000);

    expect(budget.hasBudget()).toBe(true);
    expect(budget.budgetStatus().used).toBe(0);
  });

  it('oslobadja samo istekle oznake, ne cijeli prozor', () => {
    // Ovo je razlika izmedju kliznog i fiksnog prozora: tri stara poziva
    // isteknu, dva novija ostaju, pa je oslobodjeno tacno tri mjesta.
    at(0);
    budget.consumeBudget();
    budget.consumeBudget();
    budget.consumeBudget();

    at(30 * 60 * 1000);                 // pola sata kasnije
    budget.consumeBudget();
    budget.consumeBudget();
    expect(budget.budgetStatus().used).toBe(5);

    at(HOUR_MS + 1000);                 // prva tri su istekla

    expect(budget.budgetStatus().used).toBe(2);
    expect(budget.consumeBudget()).toBe(true);
  });

  it('GRANICA: oznaka stara tacno jedan sat jos se racuna', () => {
    // Uslov zadrzavanja je t >= cutoff, pa je granica ukljucena i prozor
    // traje sat vremena i jednu milisekundu.
    budget.consumeBudget();

    at(HOUR_MS);
    expect(budget.budgetStatus().used).toBe(1);

    at(HOUR_MS + 1);
    expect(budget.budgetStatus().used).toBe(0);
  });

  it('ne oslobadja nista dok je najstarija oznaka unutar prozora', () => {
    for (let i = 0; i < 5; i++) budget.consumeBudget();

    at(HOUR_MS - 1);

    expect(budget.hasBudget()).toBe(false);
    expect(budget.budgetStatus().used).toBe(5);
  });

  it('podnosi neprekidno trosenje kroz vise uzastopnih prozora', () => {
    // Skener koji radi satima ne smije trajno zakljucati budzet.
    for (let sat = 0; sat < 3; sat++) {
      at(sat * (HOUR_MS + 1000));
      for (let i = 0; i < 5; i++) expect(budget.consumeBudget()).toBe(true);
      expect(budget.consumeBudget()).toBe(false);
    }
  });
});

describe('llmBudget — dokumentovana ogranicenja', () => {
  it('OGRANICENJE: granica se cita jednom, pri ucitavanju modula', () => {
    // Izmjena varijable tokom rada nema efekta. Za promjenu plafona
    // potreban je restart procesa.
    process.env.LLM_MAX_CALLS_PER_HOUR = '999';

    expect(budget.budgetStatus().max).toBe(5);
  });

  it('OGRANICENJE: potroseno mjesto se ne vraca kada poziv modelu padne', () => {
    // consumeBudget se poziva prije slanja zahtjeva, pa neuspjeh modela
    // svejedno kosta jedno mjesto. Odluka je namjerno konzervativna, ali
    // znaci da niz neuspjelih poziva moze iscrpiti satni plafon.
    budget.consumeBudget();

    expect(budget.budgetStatus().used).toBe(1);   // nema nacina da se oslobodi
  });

  it('OGRANICENJE: stanje se gubi pri ponovnom ucitavanju modula', async () => {
    // Odgovara restartu procesa. Prozor je u memoriji svjesnom odlukom,
    // jer trajno cuvanje budzeta ne opravdava dodatni upis u bazu.
    for (let i = 0; i < 5; i++) budget.consumeBudget();
    expect(budget.hasBudget()).toBe(false);

    budget = await loadBudget('5');

    expect(budget.hasBudget()).toBe(true);
  });
});