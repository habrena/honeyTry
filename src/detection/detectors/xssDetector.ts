import type { DetectionResult } from '../DetectionResult';

const XSS_PATTERNS: { regex: RegExp; signal: string; weight: number }[] = [
  // Script tags
  { regex: /<script[\s>]/i,                       signal: '<script> tag injection',              weight: 0.5 },
  { regex: /<\/script>/i,                         signal: '</script> closing tag',               weight: 0.3 },

  // Event handler attributes
  { regex: /\bon\w+\s*=\s*['"]/i,                 signal: 'Event handler attribute (on*=)',      weight: 0.45 },
  { regex: /\bonerror\s*=/i,                      signal: 'onerror event handler',               weight: 0.45 },
  { regex: /\bonload\s*=/i,                       signal: 'onload event handler',                weight: 0.4 },
  { regex: /\bonmouseover\s*=/i,                  signal: 'onmouseover event handler',           weight: 0.4 },
  { regex: /\bonfocus\s*=/i,                      signal: 'onfocus event handler',               weight: 0.35 },

  // JavaScript URIs
  { regex: /javascript\s*:/i,                     signal: 'javascript: URI scheme',              weight: 0.5 },
  { regex: /vbscript\s*:/i,                       signal: 'vbscript: URI scheme',                weight: 0.45 },
  { regex: /data\s*:\s*text\/html/i,              signal: 'data:text/html URI',                  weight: 0.4 },

  // Common XSS payloads
  { regex: /alert\s*\(/i,                         signal: 'alert() call',                        weight: 0.3 },
  { regex: /prompt\s*\(/i,                        signal: 'prompt() call',                       weight: 0.3 },
  { regex: /confirm\s*\(/i,                       signal: 'confirm() call',                      weight: 0.25 },
  { regex: /document\.cookie/i,                   signal: 'document.cookie access',              weight: 0.45 },
  { regex: /document\.write/i,                    signal: 'document.write() call',               weight: 0.35 },
  { regex: /\.innerHTML\s*=/i,                    signal: 'innerHTML assignment',                weight: 0.3 },
  { regex: /eval\s*\(/i,                          signal: 'eval() call',                         weight: 0.4 },
  { regex: /Function\s*\(/i,                      signal: 'Function() constructor',              weight: 0.35 },

  // HTML injection via other tags
  { regex: /<iframe[\s>]/i,                       signal: '<iframe> injection',                  weight: 0.45 },
  { regex: /<embed[\s>]/i,                        signal: '<embed> injection',                   weight: 0.4 },
  { regex: /<object[\s>]/i,                       signal: '<object> injection',                  weight: 0.4 },
  { regex: /<svg[\s>].*?on\w+\s*=/i,              signal: 'SVG with event handler',              weight: 0.5 },
  { regex: /<img[^>]+onerror/i,                   signal: '<img onerror> pattern',               weight: 0.5 },

  // Encoding evasion
  { regex: /&#x?[0-9a-f]+;/i,                    signal: 'HTML entity encoding evasion',        weight: 0.2 },
  { regex: /\\u00[0-9a-f]{2}/i,                   signal: 'Unicode escape evasion',              weight: 0.2 },
];

export function detectXss(
  endpoint: string,
  query: Record<string, any> | null,
  body: Record<string, any> | null
): DetectionResult | null {

  const textValues = extractTextValues(endpoint, query, body);
  if (textValues.length === 0) return null;

  const matchedSignals: string[] = [];
  let totalWeight = 0;

  for (const text of textValues) {
    for (const pattern of XSS_PATTERNS) {
      if (pattern.regex.test(text) && !matchedSignals.includes(pattern.signal)) {
        matchedSignals.push(pattern.signal);
        totalWeight += pattern.weight;
      }
    }
  }

  if (matchedSignals.length === 0) return null;

  const confidence = Math.min(totalWeight, 0.95);

  return {
    type: 'XSS_ATTEMPT',
    confidence: parseFloat(confidence.toFixed(2)),
    signals: matchedSignals,
  };
}

function extractTextValues(
  endpoint: string,
  query: Record<string, any> | null,
  body: Record<string, any> | null
): string[] {
  const values: string[] = [decodeURIComponent(endpoint)];

  function extract(obj: any) {
    if (typeof obj === 'string') {
      values.push(obj);
      try { values.push(decodeURIComponent(obj)); } catch { /* invalid encoding */ }
    } else if (Array.isArray(obj)) {
      obj.forEach(extract);
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(extract);
    }
  }

  if (query) extract(query);
  if (body) extract(body);

  return values;
}
