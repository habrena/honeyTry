import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * ============================================================================
 *  Priprema okruzenja za integracione testove
 * ============================================================================
 *  Izvrsava se prije svakog test fajla i prije bilo kakvog uvoza aplikacije.
 *  Redoslijed je bitan iz dva razloga.
 *
 *  Prvo, dotenv ne prepisuje vec postavljene varijable. Ako .env.test bude
 *  ucitan prvi, njegov DATABASE_URL ce imati prednost nad onim iz src/.env,
 *  koji kasnije ucitavaju db.ts i app.ts.
 *
 *  Drugo, TRIGGER_CONFIG i granice budzeta citaju se pri ucitavanju modula.
 *  Izmjena poslije uvoza ne bi imala efekta.
 * ============================================================================
 */

config({ path: resolve(process.cwd(), '.env.test'), override: true });

// ── Zastita od pokretanja nad pogresnom bazom ───────────────────────────────
// Integracioni testovi brisu sadrzaj tabela. Marker postoji iskljucivo u
// .env.test, pa se testovi ne mogu slucajno pokrenuti nad radnom bazom.
if (process.env.INTEGRATION_DB !== '1') {
  throw new Error(
    'Integracioni testovi zaustavljeni: nedostaje INTEGRATION_DB=1.\n' +
      'Ocekuje se .env.test sa DATABASE_URL testnog Neon brancha.\n' +
      'Testovi brisu sadrzaj tabela i ne smiju raditi nad radnom bazom.',
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error('Integracioni testovi zaustavljeni: DATABASE_URL nije postavljen.');
}

// ── Neutralizacija poziva modelu ────────────────────────────────────────────
// Grupa A ispituje putanju zahtjeva, ne analizu. Sesijski budzet od nula
// poziva znaci da triggerEvaluator za svaku svjezu sesiju vrati 'none', pa
// analiticki lanac ne radi nista i ne remeti brojanje zapisa.
process.env.LLM_DRY_RUN = '1';
process.env.LLM_MAX_CALLS_PER_SESSION = '0';
process.env.LLM_MAX_CALLS_PER_HOUR = '0';
process.env.NODE_ENV = 'test';