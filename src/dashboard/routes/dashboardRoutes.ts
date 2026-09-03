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

export default router;