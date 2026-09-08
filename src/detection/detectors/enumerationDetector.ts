import type { DetectionResult } from '../DetectionResult';
import { safeDecode } from './extractValues';

// Patterns that suggest the attacker is trying to enumerate or extract data systematically
const ENUMERATION_PATTERNS: { regex: RegExp; signal: string; weight: number }[] = [
  // Bulk data access — requesting everything at once
  { regex: /[?&]limit=(999|1000|9999|10000|99999)\b/i,   signal: 'Extremely large limit parameter',     weight: 0.45 },
  { regex: /[?&]limit=0\b/i,                              signal: 'Limit=0 (attempt to bypass pagination)', weight: 0.3 },
  { regex: /[?&]per_page=(999|1000|9999)\b/i,             signal: 'Extremely large per_page parameter',  weight: 0.4 },
  { regex: /[?&]page_size=(999|1000|9999)\b/i,            signal: 'Extremely large page_size parameter', weight: 0.4 },
  { regex: /[?&]count=all\b/i,                            signal: 'count=all parameter',                 weight: 0.3 },

  // Wildcard and empty searches — attempting to return all records
  { regex: /[?&]q=\*\s*$/,                                signal: 'Wildcard search query (q=*)',          weight: 0.35 },
  { regex: /[?&]q=\s*$/,                                  signal: 'Empty search query',                   weight: 0.2 },
  { regex: /[?&]search=%25/,                               signal: 'URL-encoded wildcard search (%)',     weight: 0.3 },
  { regex: /[?&]q=%25/,                                   signal: 'URL-encoded wildcard in q param',     weight: 0.3 },

  // Export/dump attempts
  { regex: /[?&]format=(csv|json|xml|xlsx)\b/i,           signal: 'Data export format parameter',         weight: 0.3 },
  { regex: /[?&]export=true\b/i,                          signal: 'Export=true parameter',                weight: 0.35 },
  { regex: /[?&]download=true\b/i,                        signal: 'Download=true parameter',              weight: 0.3 },
  { regex: /\/export\b/i,                                 signal: '/export endpoint access',              weight: 0.35 },
  { regex: /\/download\b/i,                               signal: '/download endpoint access',            weight: 0.3 },
];

export function detectEnumeration(
  endpoint: string,
  method: string,
  query: Record<string, any> | null
): DetectionResult | null {

  const matchedSignals: string[] = [];
  let totalWeight = 0;

  // Reconstruct the full URL for pattern matching
  const fullUrl = query
    ? `${endpoint}?${new URLSearchParams(query as Record<string, string>).toString()}`
    : endpoint;

  const decodedUrl = safeDecode(fullUrl);

  // Run regex patterns against the full URL
  for (const pattern of ENUMERATION_PATTERNS) {
    if (pattern.regex.test(decodedUrl) && !matchedSignals.includes(pattern.signal)) {
      matchedSignals.push(pattern.signal);
      totalWeight += pattern.weight;
    }
  }

  // Check for sequential ID probing in the URL path
  // Matches: /api/patients/1, /api/patients/2, etc.
  const idMatch = endpoint.match(/\/(\d+)\s*$/);
  if (idMatch) {
    const id = parseInt(idMatch[1], 10);
    // Very low IDs suggest sequential probing from the start
    if (id <= 10) {
      matchedSignals.push(`Sequential ID probe (id=${id})`);
      totalWeight += 0.2;
    }
  }

  // Check query params directly for large numeric values
  if (query) {
    const limit = parseInt(query.limit || query.per_page || query.pageSize, 10);
    if (!isNaN(limit) && limit > 100) {
      if (!matchedSignals.some(s => s.includes('limit') || s.includes('per_page') || s.includes('page_size'))) {
        matchedSignals.push(`Large pagination value: ${limit}`);
        totalWeight += 0.3;
      }
    }

    const offset = parseInt(query.offset || query.skip, 10);
    if (!isNaN(offset) && offset === 0 && !isNaN(limit) && limit > 100) {
      matchedSignals.push('offset=0 with large limit (full table dump attempt)');
      totalWeight += 0.2;
    }
  }

  if (matchedSignals.length === 0) return null;

  const confidence = Math.min(totalWeight, 0.95);

  return {
    type: 'DATA_ENUMERATION',
    confidence: parseFloat(confidence.toFixed(2)),
    signals: matchedSignals,
  };
}
