import type { DetectionResult } from '../DetectionResult';

// Each pattern has a regex, a human-readable signal name, and a weight
const SQL_PATTERNS: { regex: RegExp; signal: string; weight: number }[] = [
  // Boolean-based injection
  { regex: /'\s*(OR|AND)\s+\d+=\d+/i,           signal: 'SQL boolean expression (OR/AND 1=1)', weight: 0.4 },
  { regex: /'\s*(OR|AND)\s+'[^']*'\s*=\s*'[^']*'/i, signal: 'SQL string equality injection',   weight: 0.4 },
  { regex: /'\s*(OR|AND)\s+TRUE/i,               signal: 'SQL boolean TRUE injection',          weight: 0.35 },

  // Comment sequences — used to terminate injected queries
  { regex: /--\s*$/,                              signal: 'SQL comment sequence (--)',            weight: 0.3 },
  { regex: /\/\*.*?\*\//,                         signal: 'SQL block comment (/* */)',            weight: 0.25 },
  { regex: /#\s*$/,                               signal: 'SQL comment sequence (#)',             weight: 0.2 },

  // UNION-based injection
  { regex: /UNION\s+(ALL\s+)?SELECT/i,            signal: 'UNION SELECT pattern',                weight: 0.45 },
  { regex: /UNION\s+(ALL\s+)?SELECT\s+NULL/i,     signal: 'UNION SELECT NULL (column counting)', weight: 0.5 },

  // Stacked queries
  { regex: /;\s*(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE)\s/i, signal: 'Stacked query with destructive keyword', weight: 0.5 },
  { regex: /;\s*SELECT\s/i,                       signal: 'Stacked SELECT query',                weight: 0.35 },

  // Time-based blind injection
  { regex: /SLEEP\s*\(\s*\d+\s*\)/i,             signal: 'SLEEP() time-based injection',        weight: 0.45 },
  { regex: /WAITFOR\s+DELAY/i,                   signal: 'WAITFOR DELAY (MSSQL blind injection)', weight: 0.45 },
  { regex: /BENCHMARK\s*\(/i,                    signal: 'BENCHMARK() time-based injection',    weight: 0.45 },
  { regex: /pg_sleep\s*\(/i,                     signal: 'pg_sleep() PostgreSQL blind injection', weight: 0.45 },

  // Information extraction
  { regex: /information_schema/i,                 signal: 'information_schema access attempt',   weight: 0.5 },
  { regex: /CONCAT\s*\(/i,                       signal: 'CONCAT() data extraction',            weight: 0.2 },
  { regex: /GROUP_CONCAT\s*\(/i,                 signal: 'GROUP_CONCAT() data extraction',      weight: 0.3 },
  { regex: /LOAD_FILE\s*\(/i,                    signal: 'LOAD_FILE() file read attempt',       weight: 0.5 },
  { regex: /INTO\s+(OUT|DUMP)FILE/i,             signal: 'INTO OUTFILE/DUMPFILE write attempt', weight: 0.5 },

  // Common escape attempts
  { regex: /\\x27/i,                              signal: 'Hex-encoded single quote (\\x27)',    weight: 0.3 },
  { regex: /%27/,                                 signal: 'URL-encoded single quote (%27)',      weight: 0.15 },
  { regex: /CHAR\s*\(\s*39\s*\)/i,               signal: 'CHAR(39) single quote bypass',        weight: 0.35 },

  // Dangerous keywords in unexpected places
  { regex: /\bDROP\s+TABLE\b/i,                  signal: 'DROP TABLE attempt',                  weight: 0.5 },
  { regex: /\bDELETE\s+FROM\b/i,                 signal: 'DELETE FROM attempt',                 weight: 0.45 },
  { regex: /\bINSERT\s+INTO\b/i,                 signal: 'INSERT INTO attempt',                 weight: 0.3 },
  { regex: /\bUPDATE\s+\w+\s+SET\b/i,            signal: 'UPDATE SET attempt',                  weight: 0.35 },
];

/**
 * Scans all text content in a request for SQL injection patterns.
 * Returns null if nothing suspicious is found.
 */
export function detectSqlInjection(
  endpoint: string,
  query: Record<string, any> | null,
  body: Record<string, any> | null
): DetectionResult | null {

  // Collect all text values that an attacker could control
  const textValues = extractTextValues(endpoint, query, body);
  if (textValues.length === 0) return null;

  const matchedSignals: string[] = [];
  let totalWeight = 0;

  for (const text of textValues) {
    for (const pattern of SQL_PATTERNS) {
      if (pattern.regex.test(text) && !matchedSignals.includes(pattern.signal)) {
        matchedSignals.push(pattern.signal);
        totalWeight += pattern.weight;
      }
    }
  }

  if (matchedSignals.length === 0) return null;

  // Cap confidence at 0.95 — leave room for the LLM to override
  const confidence = Math.min(totalWeight, 0.95);

  return {
    type: 'SQL_INJECTION',
    confidence: parseFloat(confidence.toFixed(2)),
    signals: matchedSignals,
  };
}

/**
 * Extracts all string values from the endpoint, query params, and body.
 * Handles nested objects recursively.
 */
function extractTextValues(
  endpoint: string,
  query: Record<string, any> | null,
  body: Record<string, any> | null
): string[] {
  const values: string[] = [decodeURIComponent(endpoint)];

  function extract(obj: any) {
    if (typeof obj === 'string') {
      values.push(obj);
      // Also check the decoded version
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
