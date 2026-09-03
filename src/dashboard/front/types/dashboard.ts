export interface Session {
  id: string;
  tokenId: string;
  cookieId: string;
  sourceIp: string;
  userAgent: string;
  firstSeen: string;
  lastSeen: string;
  lastAnalyzedAt: string | null;
  _count: { events: number };
}

export interface EventRow {
  id: string;
  sessionId: string;
  method: string;
  endpoint: string;
  statusCode: number;
  timestamp: string;
  durationMs: number;
  classifications: Classification[];
}

export interface Classification {
  id: string;
  category: string;
  confidence: number;
  severity: string;
  explanation: string;
  createdAt: string;
}

export interface PathStat {
  path: string;
  count: number;
  uniqueIps: number;
  topSeverity: string;
}

export interface IpStat {
  ip: string;
  requestCount: number;
  sessionCount: number;
  lastSeen: string;
}

export interface InsightData {
  totalRequests24h: number;
  distinctIps24h: number;
  activeSessions: number;
  highSeverityEvents: number;
  llmAnalyses: number;
  topAttackType: string;
}

export type Tab = "overview" | "sessions" | "requests" | "session-detail";
export type TimeRange = "24h" | "month" | "year";

export interface ChartPoint {
  key: string;
  value: number;
}