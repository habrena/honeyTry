import { shouldAnalyzeSession } from './triggerEvaluator';  //Uvozi logiku koja odlučuje da li sesija uopšte zahtijeva analizu i u kom režimu (rule, single, batch)
import { classifySessionBatch } from '../classification/classifySessionBatch'; //Uvozi funkciju za batch analizu skupa događaja unutar sesije.
import { classifyEvent } from '../classification/classifyEvent';
import { classifySessionByRules } from './ruleClassifier';
import { db } from '../database/db';

/**
 * ============================================================================
 *  ANALYSIS QUEUE
 * ============================================================================
 *  Bez reda bi skener sa 300 zahtjeva u sekundi pokrenuo 300 paralelnih
 *  evaluacija. Red radi dvije stvari:
 *    1. deduplikacija po sessionId — ista sesija ne moze biti dva puta u redu
 *    2. ogranicena konkurentnost — najvise 2 analize istovremeno
 * ============================================================================
 */

interface Job {
  sessionId: string;
  eventId?: string;                               // samo za 'single' rezim
  detections: { type: string; confidence: number }[];
}

const MAX_CONCURRENT = 2;

const pending: Job[] = []; //FIFO princip
const queued = new Set<string>(); //skup sessionIds koji cekaju
const running = new Set<string>(); //skup sessionIds koji su trenutno u obradi


//basically dodaj
export function enqueue(job: Job): void {
  if (queued.has(job.sessionId) || running.has(job.sessionId)) return; //deduplikacija -> provjera duplih podataka
  queued.add(job.sessionId);
  pending.push(job);
  void drain(); //Asinhrono pokreće pražnjenje reda bez blokiranja pozivaoca.
}

async function drain(): Promise<void> {
  while (running.size < MAX_CONCURRENT && pending.length > 0) {
    const job = pending.shift()!;
    queued.delete(job.sessionId);
    running.add(job.sessionId);

    void processJob(job)
      .catch(err => console.error(`[Queue] Sesija ${job.sessionId} — greska:`, err))
      .finally(() => {
        running.delete(job.sessionId);
        void drain();
      });
  }
}

async function processJob(job: Job): Promise<void> {
  const decision = await shouldAnalyzeSession(job.sessionId, job.detections);

  if (!decision.shouldAnalyze) {
    console.log(`[Queue] ${job.sessionId}: ${decision.reason}`);
    return;
  }

  console.log(`[Queue] ${job.sessionId}: ${decision.mode.toUpperCase()} — ${decision.reason}`);

  switch (decision.mode) {
    case 'rule':
      await classifySessionByRules(job.sessionId);
      break;

    case 'single': {
      let eventId = job.eventId;
      if (!eventId) {
        const e = await db.event.findFirst({
          where: { sessionId: job.sessionId, analyzedAt: null },
          orderBy: { timestamp: 'asc' },
          select: { id: true },
        });
        if (!e) return;
        eventId = e.id;
      }

      const result = await classifyEvent(eventId);
      if (result) {
        console.log(`[Queue] Single: ${result.classification} (${result.confidence}) — ${result.explanation}`);
      }
      break;
    }

    case 'batch': {
      //napraviti polje u bazi za session verdicts
      const result = await classifySessionBatch(job.sessionId);
      if (result) {
        console.log(`[Queue] Batch: ${result.eventsAnalyzed} eventa, zakljucak ${result.sessionVerdict.primaryAttackType}`);
      }
      break;
    }

    default:
      console.warn(`[Queue] Nepoznat modalitet analize: ${decision.mode}`);
      break;
  }
}

export function queueStatus() {
  return { pending: pending.length, running: running.size };
}