/**
 * Globalni osigurac. Sesijski budzet (MAX_CALLS_PER_SESSION) stiti od jednog
 * napadaca; ovo stiti od 10.000 sesija odjednom (distribuirani skan, botnet).
 *
 * Klizni prozor u memoriji — namjerno nije u bazi. Ako se proces restartuje,
 * budzet se resetuje, sto je prihvatljivo za honeypot.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_CALLS_PER_HOUR = Number(process.env.LLM_MAX_CALLS_PER_HOUR ?? 100);

let timestamps: number[] = [];

function prune() {
  const cutoff = Date.now() - WINDOW_MS;
  if (timestamps.length && timestamps[0] < cutoff) {
    timestamps = timestamps.filter(t => t >= cutoff);
  }
}

/** Ima li jos mjesta u budzetu? Ne trosi ga. */
export function hasBudget(): boolean {
  prune();
  return timestamps.length < MAX_CALLS_PER_HOUR;
}

/** Pozovi neposredno prije stvarnog LLM poziva. */
export function consumeBudget(): boolean {
  prune();
  if (timestamps.length >= MAX_CALLS_PER_HOUR) return false;
  timestamps.push(Date.now());
  return true;
}

export function budgetStatus() {
  prune();
  return { used: timestamps.length, max: MAX_CALLS_PER_HOUR };
}