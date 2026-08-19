import type { DetectionResult } from './DetectionResult';
import { detectSqlInjection } from './detectors/sqlInjectionDetector';
import { detectXss } from './detectors/xssDetector';
import { detectTraversal } from './detectors/traversalDetector';
import { detectScanner } from './detectors/scannerDetector';
import { detectEnumeration } from './detectors/enumerationDetector';

/**
 * Runs all detectors against a single event.
 * Returns an array of all detection results — could be empty (nothing found),
 * could have one result, could have multiple (e.g. a request that's both
 * SQL injection AND from a known scanner tool).
 */
export function runDetectors(event: {
  endpoint: string;
  method: string;
  queryParams: Record<string, any> | null;
  body: Record<string, any> | null;
  userAgent: string | null;
  headers: Record<string, any> | null;
}): DetectionResult[] {

  const results: DetectionResult[] = [];

  // Run each detector — order doesn't matter since they're independent
  const sqli = detectSqlInjection(event.endpoint, event.queryParams, event.body);
  if (sqli) results.push(sqli);

  const xss = detectXss(event.endpoint, event.queryParams, event.body);
  if (xss) results.push(xss);

  const traversal = detectTraversal(event.endpoint, event.queryParams, event.body);
  if (traversal) results.push(traversal);

  const scanner = detectScanner(event.endpoint, event.userAgent, event.headers);
  if (scanner) results.push(scanner);

  const enumeration = detectEnumeration(event.endpoint, event.method, event.queryParams);
  if (enumeration) results.push(enumeration);

  return results;
}

/**
 * Returns the single highest-confidence detection, or null if no detectors fired.
 * Useful when you need one primary classification for an event.
 */
export function getPrimaryDetection(results: DetectionResult[]): DetectionResult | null {
  if (results.length === 0) return null;
  return results.reduce((best, current) =>
    current.confidence > best.confidence ? current : best
  );
}
