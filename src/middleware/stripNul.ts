const NUL = /\u0000/g;

export function stripNul<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(NUL, '\\u0000') as unknown as T;   // preserve as visible text
  }
  if (Array.isArray(value)) {
    return value.map(stripNul) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k.replace(NUL, '\\u0000')] = stripNul(v);
    }
    return out as unknown as T;
  }
  return value;
}