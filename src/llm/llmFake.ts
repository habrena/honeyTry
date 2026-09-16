/**
 * ============================================================================
 *  TEST DVOJNIK ZA MODEL
 * ============================================================================
 *  Integracioni testovi moraju biti deterministicki i ne smiju zavisiti od
 *  dostupnosti DeepSeek API-ja ni trositi tokene. Dvojnik presrece poziv u
 *  callLLM i vraca odgovor koji test unaprijed postavi.
 *
 *  Zasto ovo nije obican mock: analiticki lanac tece kroz emitter i red, u
 *  istom procesu ali van dosega testa. Zamjena modula ne bi pomogla jer test
 *  ne poziva callLLM — poziva ga red, mnogo kasnije. Postavka na nivou
 *  modula je jedini nacin da se odgovor kontrolise iz testa.
 *
 *  Dvojnik radi iskljucivo kada je LLM_FAKE postavljen. U stvarnom radu
 *  varijabla ne postoji, pa je ova grana mrtva.
 * ============================================================================
 */

export type FakeLLMHandler = (systemPrompt: string, payload: any) => unknown | null;

let handler: FakeLLMHandler | null = null;
let callCount = 0;

/** Test postavlja odgovor koji ce dvojnik vratiti na sljedece pozive. */
export function setFakeLLM(h: FakeLLMHandler | null): void {
  handler = h;
}

/** Broj poziva od posljednjeg resetovanja — mjera stvarne potrosnje. */
export function fakeLLMCallCount(): number {
  return callCount;
}

export function resetFakeLLM(): void {
  handler = null;
  callCount = 0;
}

export function isFakeLLM(): boolean {
  return process.env.LLM_FAKE === '1';
}

/** Poziva se iz callLLM. Broji poziv i vraca pripremljen odgovor. */
export function runFakeLLM(systemPrompt: string, payload: unknown): unknown | null {
  callCount++;
  if (!handler) return null;
  return handler(systemPrompt, payload);
}