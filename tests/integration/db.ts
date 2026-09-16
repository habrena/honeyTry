import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import { db } from './../../src/database/db';

/**
 * Brise sadrzaj tabela redoslijedom koji postuje strane kljuceve:
 * prvo zapisi koji pokazuju na event, pa eventi, pa sesije.
 */
export async function resetDb(): Promise<void> {
  await db.classification.deleteMany();
  await db.sessionVerdict.deleteMany();
  await db.event.deleteMany();
  await db.session.deleteMany();
}

export async function closeDb(): Promise<void> {
  await db.$disconnect();
}

/**
 * Ceka da uslov u bazi bude ispunjen.
 *
 * Analiticki lanac je namjerno asinhron — odgovor klijentu ne ceka upis
 * eventa, a upis eventa ne ceka klasifikaciju. Fiksno cekanje bi testove
 * ucinilo sporim i nepouzdanim istovremeno: predugo na brzoj masini,
 * prekratko na opterecenoj. Anketiranje rjesava oboje.
 */
export async function waitFor<T>(
  fn: () => Promise<T | null | undefined | false>,
  { timeoutMs = 10_000, intervalMs = 50, label = 'uslov' } = {},
): Promise<T> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const result = await fn();
    if (result) return result as T;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`waitFor: ${label} nije ispunjen u ${timeoutMs} ms`);
}

/** Ceka da broj eventa u bazi dosegne ocekivanu vrijednost. */
export async function waitForEventCount(expected: number, label = 'broj eventa') {
  return waitFor(
    async () => (await db.event.count()) >= expected || null,
    { label: `${label} >= ${expected}` },
  );
}

/**
 * Prazni red mikro i makro zadataka i daje asinhronom lancu priliku da se
 * dovrsi. Koristi se kad se dokazuje da se nesto NIJE desilo, jer se
 * odsustvo zapisa ne moze cekati anketiranjem.
 */
export async function settle(ms = 300): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

// ── Fixture za staticki sadrzaj ─────────────────────────────────────────────
// Ponasanje express.static zavisi od toga da li dist folder postoji. Bez
// kontrole nad tim, isti test bi prolazio lokalno a padao na serveru.

const DIST = resolve(process.cwd(), 'dist');
const INDEX = resolve(DIST, 'index.html');
const ASSET = resolve(DIST, 'integration-fixture.txt');

let createdDist = false;
let createdIndex = false;

export function ensureDist(): void {
  if (!existsSync(DIST)) {
    mkdirSync(DIST, { recursive: true });
    createdDist = true;
  }
  if (!existsSync(INDEX)) {
    writeFileSync(INDEX, '<!doctype html><html><body>honeypot</body></html>');
    createdIndex = true;
  }
  writeFileSync(ASSET, 'staticki sadrzaj za test');
}

export function cleanupDist(): void {
  try {
    rmSync(ASSET, { force: true });
    if (createdIndex) rmSync(INDEX, { force: true });
    if (createdDist) rmSync(DIST, { recursive: true, force: true });
  } catch {
    /* fixture, ne rusi test */
  }
}

export const FIXTURE_ASSET_PATH = '/integration-fixture.txt';