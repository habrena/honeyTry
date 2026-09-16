/**
 * Okruzenje za testove analitickog lanca.
 *
 * MORA biti prvi uvoz u test fajlu. Moduli citaju granice budzeta pri
 * ucitavanju, pa izmjena poslije uvoza aplikacije ne bi imala efekta.
 * U ESM-u se uvozi izvrsavaju redom kojim su napisani, sto ovo omogucava.
 *
 * Postavke iz tests/integration/setup.ts se ovdje ponistavaju: Grupa A
 * onesposobljava analizu da bi mjerila samo putanju zahtjeva, dok je ovdje
 * analiza predmet mjerenja.
 */

delete process.env.LLM_DRY_RUN;

process.env.LLM_FAKE = '1';
process.env.LLM_MAX_CALLS_PER_SESSION = '6';
process.env.LLM_MAX_CALLS_PER_HOUR = '100';