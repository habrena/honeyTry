export interface DetectionResult {
  type: string;       // "SQL_INJECTION", "XSS_ATTEMPT", etc.
  confidence: number; // 0.0 to 1.0
  signals: string[];  // human-readable reasons: ["SQL comment sequence", "UNION SELECT pattern"]
}
