//dodatak koji je zasluzan za sprecavanje DoS napade na honeypot
//ogranicenja MAX_... su kljucna

//funkcija koja sprecava napade poput %ZZ koji bi vratili error iz decodeURIComponent
export function safeDecode(s: string): string {
  try { return decodeURIComponent(s); } catch { return s; }
}

const MAX_VALUES=50 //broj sa kojim se prekida usposatvljanje napada
const MAX_LENGTH=2048 //niti jedan string ne smije biti duzi od 2048 karaktera
const MAX_DEPTH=6 //koliko duboko ugnijezden json smijemo citati {a{a{a{...}}}}

export function extractTextValues(
  endpoint: string,
  query: Record<string, any> | null,
  body: Record<string, any> | null,
  opts = { maxValues: MAX_VALUES, maxLen: MAX_LENGTH, maxDepth: MAX_DEPTH }
): string[] {
  const seen = new Set<string>();

  function push(s: string) {
    if (seen.size >= opts.maxValues) return;
    const v = s.length > opts.maxLen ? s.slice(0, opts.maxLen) : s; //reze string da bude na maks 2048 karaktera
    seen.add(v);
    const d = safeDecode(v);
    if (d !== v) seen.add(d);   // only when decoding actually changes something
  }

  push(endpoint);

  function walk(obj: any, depth: number) {
    if (depth > opts.maxDepth || seen.size >= opts.maxValues) return;
    if (typeof obj === 'string') push(obj);
    else if (typeof obj === 'number' || typeof obj === 'boolean') push(String(obj));
    else if (Array.isArray(obj)) for (const v of obj) walk(v, depth + 1);
    else if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) { push(k); walk(v, depth + 1); }
    }
  }

  if (query) walk(query, 0);
  if (body) walk(body, 0);

  return [...seen];
}