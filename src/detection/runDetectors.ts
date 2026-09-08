import type { DetectionResult } from './DetectionResult';
import { detectSqlInjection } from './detectors/sqlInjectionDetector';
import { detectXss } from './detectors/xssDetector';
import { detectTraversal } from './detectors/traversalDetector';
import { detectScanner } from './detectors/scannerDetector';
import { detectEnumeration } from './detectors/enumerationDetector';
import { extractTextValues } from './detectors/extractValues';
import { safeDecode } from './detectors/extractValues';


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

  /*
  const safe = {
    endpoint:    clamp(event.endpoint, 2048),
    method:      clamp(event.method, 16),
    queryParams: clampRecord(event.queryParams),
    body:        clampRecord(event.body, MAX_BODY),
    userAgent:   clamp(event.userAgent, 512),
    headers:     clampRecord(event.headers, 1024),
  };
  */


  const results: DetectionResult[] = [];

  const decodedEndpoint = safeDecode(event.endpoint);
  const values = extractTextValues(event.endpoint, event.queryParams, event.body);

  const sqli      = detectSqlInjection(values);
  const xss       = detectXss(values);
  const traversal = detectTraversal(values);
  
  // Run each detector
  /*
  const sqli = detectSqlInjection(safe.endpoint, safe.queryParams, safe.body);
  if (sqli) results.push(sqli);

  const xss = detectXss(safe.endpoint, safe.queryParams, safe.body);
  if (xss) results.push(xss);

  const traversal = detectTraversal(safe.endpoint, safe.queryParams, safe.body);
  if (traversal) results.push(traversal);

  const scanner = detectScanner(safe.endpoint, safe.userAgent, safe.headers);
  if (scanner) results.push(scanner);

  const enumeration = detectEnumeration(safe.endpoint, safe.method, safe.queryParams);
  if (enumeration) results.push(enumeration);
  */



  // Ovi detektori koriste specifične dijelove requesta, pa im šaljemo ono što traže
  const scanner   = detectScanner(decodedEndpoint, event.userAgent, event.headers);
  const enumeration = detectEnumeration(decodedEndpoint, event.method, event.queryParams);

  if (sqli) results.push(sqli);
  if (xss) results.push(xss);
  if (traversal) results.push(traversal);
  if (scanner) results.push(scanner);
  if (enumeration) results.push(enumeration);
  return results;
}

/*
  Returns the single highest-confidence detection, or null if no detectors fired
 */
export function getPrimaryDetection(results: DetectionResult[]): DetectionResult | null {
  if (results.length === 0) return null;
  return results.reduce((best, current) =>
    current.confidence > best.confidence ? current : best
  );
}
