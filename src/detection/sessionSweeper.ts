import { db } from '../database/db';
import { enqueue } from './analysisQueue';
import { TRIGGER_CONFIG } from './triggerEvaluator';

/**
 * ============================================================================
 *  SESSION SWEEPER
 * ============================================================================
 *  "Sesija je zavrsena" nije dogadjaj — ne postoji HTTP zahtjev koji znaci
 *  "vise me nece biti". Odsustvo zahtjeva se ne moze detektovati iz zahtjeva.
 *
 *  Zato sweeper periodicno sam pretrazuje bazu i trazi sesije koje su utihnule
 *  a imaju neobradjene evente. Sam ne odlucuje nista — odluku i dalje donosi
 *  triggerEvaluator unutar reda.
 * ============================================================================
 */

const SWEEP_INTERVAL_MS = 30 * 1000;   // kraci od SESSION_IDLE_MS, da kasnjenje bude malo
const MAX_PER_SWEEP = 20;              // postepeno praznjenje zaostatka

let timer: NodeJS.Timeout | null = null;

export async function sweep(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - TRIGGER_CONFIG.SESSION_IDLE_MS);

    const stale = await db.session.findMany({
      where: {
        lastSeen: { lt: cutoff },
        events: { some: { analyzedAt: null } },
      },
      orderBy: { lastSeen: 'asc' },
      take: MAX_PER_SWEEP,
      select: { id: true },
    });

    if (stale.length === 0) return;

    //console.log(`[Sweeper] ${stale.length} zavrsenih sesija sa neobradjenim eventima`);
    for (const s of stale) enqueue({ sessionId: s.id, detections: [] });
  } catch (err) {
    //console.error('[Sweeper] Greska:', err);
  }
}

export function startSessionSweeper(): void {
  if (timer) return;
  void sweep();                        // prvi prolaz odmah — pokupi zaostalo od proslog pokretanja
  timer = setInterval(() => void sweep(), SWEEP_INTERVAL_MS);
  timer.unref?.();
  //console.log(`[Sweeper] Pokrenut (svakih ${SWEEP_INTERVAL_MS / 1000}s, prag tisine ${TRIGGER_CONFIG.SESSION_IDLE_MS / 1000}s)`);
}

export function stopSessionSweeper(): void {
  if (timer) { clearInterval(timer); timer = null; }
}