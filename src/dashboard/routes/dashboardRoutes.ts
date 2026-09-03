import { Router } from 'express';
import { db } from '../../database/db';

const router = Router();

// All active sessions with event counts
router.get('/sessions', async (_req, res) => {
  const sessions = await db.session.findMany({
    orderBy: { lastSeen: 'desc' },
    include: {
      _count: { select: { events: true } },
    },
  });
  res.json(sessions);
});

// Events for a specific session
router.get('/sessions/:id/events', async (req, res) => {
  const events = await db.event.findMany({
    where: { sessionId: req.params.id },
    orderBy: { timestamp: 'asc' },
    include: { classification: true },
  });
  res.json(events);
});

// LLM classifications summary
router.get('/classifications', async (_req, res) => {
  const classifications = await db.classification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      event: {
        select: { method: true, endpoint: true, sessionId: true },
      },
    },
  });
  res.json(classifications);
});

//nove rute
router.get('/events', async (_req, res) => {
  const events = await db.event.findMany({
    orderBy: { timestamp: 'desc' },
    take: 200,
    include: { classification: true },
  });
  res.json(events);
});

//kljucne metrike za overview kartice dashboarda

router.get('/insights', async (_req, res) => {
  const now = new Date();
  const h24ago = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const h1ago = new Date(now.getTime() - 60 * 60 * 1000);
 
  // Total requests in last 24h
  const totalRequests24h = await db.event.count({
    where: { timestamp: { gte: h24ago } },
  });
 
  // Distinct IPs in last 24h — get sessions active in that window
  const recentSessions = await db.session.findMany({
    where: { lastSeen: { gte: h24ago } },
    select: { sourceIp: true },
  });
  const distinctIps24h = new Set(recentSessions.map(s => s.sourceIp)).size;
 
  // Active sessions (activity in last hour)
  const activeSessions = await db.session.count({
    where: { lastSeen: { gte: h1ago } },
  });
 
  // High severity classifications
  const highSeverityEvents = await db.classification.count({
    where: {
      severity: { in: ['high', 'critical'] },
    },
  });
 
  // Total LLM analyses
  const llmAnalyses = await db.classification.count();
 
  // Top attack type
  const attackTypes = await db.classification.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } },
    take: 1,
  });
  const topAttackType = attackTypes[0]?.category || '';
 
  res.json({
    totalRequests24h,
    distinctIps24h,
    activeSessions,
    highSeverityEvents,
    llmAnalyses,
    topAttackType,
  });
});

router.get('/top-paths', async (_req, res) => {
  // Group events by endpoint
  const groups = await db.event.groupBy({
    by: ['endpoint'],
    _count: { endpoint: true },
    orderBy: { _count: { endpoint: 'desc' } },
    take: 20,
  });
 
  // For each path, get unique IPs and top severity
  const results = await Promise.all(
    groups.map(async (g) => {
      // Unique IPs for this path
      const sessions = await db.event.findMany({
        where: { endpoint: g.endpoint },
        select: { session: { select: { sourceIp: true } } },
        distinct: ['sessionId'],
      });
      const uniqueIps = new Set(sessions.map(s => s.session.sourceIp)).size;
 
      // Highest severity classification for events at this path
      const classification = await db.classification.findFirst({
        where: {
          event: { endpoint: g.endpoint },
          severity: { in: ['critical', 'high', 'medium', 'low'] },
        },
        orderBy: {
          // Sort by severity — critical first
          // Since Prisma can't sort by custom order, we'll check manually
          createdAt: 'desc',
        },
      });
 
      return {
        path: g.endpoint,
        count: g._count.endpoint,
        uniqueIps,
        topSeverity: classification?.severity || '',
      };
    })
  );
 
  res.json(results);
});

router.get('/top-ips', async (_req, res) => {
  const sessions = await db.session.findMany({
    include: { _count: { select: { events: true } } },
    orderBy: { lastSeen: 'desc' },
  });
 
  // Group by IP (one IP can have multiple sessions via different cookies)
  const ipMap = new Map<string, { requestCount: number; sessionCount: number; lastSeen: Date }>();
 
  for (const s of sessions) {
    const existing = ipMap.get(s.sourceIp);
    if (existing) {
      existing.requestCount += s._count.events;
      existing.sessionCount += 1;
      if (new Date(s.lastSeen) > existing.lastSeen) {
        existing.lastSeen = new Date(s.lastSeen);
      }
    } else {
      ipMap.set(s.sourceIp, {
        requestCount: s._count.events,
        sessionCount: 1,
        lastSeen: new Date(s.lastSeen),
      });
    }
  }
 
  const results = Array.from(ipMap.entries())
    .map(([ip, data]) => ({ ip, ...data }))
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, 20);
 
  res.json(results);
});

//GET /api/dashboard/request-chart?range=24h|month|year

router.get('/request-chart', async (req, res) => {
  const range = (req.query.range as string) || '24h';
  const now = new Date();
 
  let since: Date;
  let bucketMs: number;
  let formatKey: (d: Date) => string;
 
  switch (range) {
    case 'month':
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      bucketMs = 24 * 60 * 60 * 1000; // 1 day
      formatKey = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
      break;
    case 'year':
      since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      bucketMs = 30 * 24 * 60 * 60 * 1000; // ~1 month
      formatKey = (d) => d.toLocaleString('default', { month: 'short' });
      break;
    default: // 24h
      since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      bucketMs = 60 * 60 * 1000; // 1 hour
      formatKey = (d) => `${d.getHours()}:00`;
  }
 
  const events = await db.event.findMany({
    where: { timestamp: { gte: since } },
    select: { timestamp: true },
    orderBy: { timestamp: 'asc' },
  });
 
  //TIP: pregledati ovo detaljnije
  // Build buckets
  const buckets = new Map<string, number>();
  let cursor = new Date(since.getTime());
  while (cursor <= now) {
    buckets.set(formatKey(cursor), 0);
    cursor = new Date(cursor.getTime() + bucketMs);
  }
 
  // Fill buckets
  for (const ev of events) {
    const t = new Date(ev.timestamp);
    // Find which bucket this event falls into
    const bucketStart = new Date(since.getTime() + 
      Math.floor((t.getTime() - since.getTime()) / bucketMs) * bucketMs);
    const key = formatKey(bucketStart);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
  }
 
  const result = Array.from(buckets.entries()).map(([key, value]) => ({ key, value }));
  res.json(result);
});

export default router;