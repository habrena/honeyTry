import { db } from '../database/db';
import { hasBudget } from './llmBudget';

/**
 * ============================================================================
 *  TRIGGER EVALUATOR  —  pojednostavljena verzija
 * ============================================================================
 *  Tri nacina obrade:
 *
 *    'single' — detektor je nasao nesto ozbiljno na jednom zahtjevu
 *               -> classifyEvent(eventId)
 *    'batch'  — sesija je zavrsena i ima detekcija
 *               -> classifySessionBatch(sessionId)
 *    'rule'   — sesija je zavrsena i nema nijedne detekcije
 *               -> classifySessionByRules(sessionId), BEZ LLM-a
 *
 *  Iznad svega stoje dvije kocnice:
 *    cooldown po sesiji (60 s)  — sprjecava da sqlmap sa 500 payloada
 *                                 izazove 500 poziva
 *    budzet (6 po sesiji, 100/h globalno) — tvrd plafon troska
 * ============================================================================
 */

export type AnalysisMode = 'single' | 'batch' | 'rule' | 'none';

export interface TriggerDecision {
  shouldAnalyze: boolean;
  mode: AnalysisMode;
  reason: string;
}

export const TRIGGER_CONFIG = {
  HIGH_CONFIDENCE: 0.85,          // prag ozbiljnosti detekcije
  COOLDOWN_MS: 60 * 1000,         // minimalni razmak izmedju dva LLM poziva iste sesije
  SESSION_IDLE_MS: 90 * 1000,     // toliko tisine = sesija je zavrsena
  HARD_FLUSH: 4000,                // toliko neobradjenih eventa = analiziraj i bez tisine
  MAX_CALLS_PER_SESSION: Number(process.env.LLM_MAX_CALLS_PER_SESSION ?? 6),
};

/** Tipovi detekcija koji opravdavaju trenutnu analizu jednog eventa. */
const URGENT_TYPES = new Set([
  'SQL_INJECTION',
  'XSS_ATTEMPT',
  'DIRECTORY_TRAVERSAL',
  'DETECTOR_FAILURE',
  'UNSERIALIZABLE_BODY',
]);

const none = (reason: string): TriggerDecision =>
  ({ shouldAnalyze: false, mode: 'none', reason });

export async function shouldAnalyzeSession(
  sessionId: string,
  latestDetections: { type: string; confidence: number }[] = [],
): Promise<TriggerDecision> {

  const session = await db.session.findUnique({
    where: { id: sessionId },
    select: { lastSeen: true, lastAnalyzedAt: true, analysisCount: true, suppressed: true },
  });

  if (!session) return none('Sesija ne postoji');

  const unclassified = await db.event.count({
    where: { sessionId, analyzedAt: null },
  });

  if (unclassified === 0) return none('Nema neobradjenih eventa');

  const idleMs = Date.now() - session.lastSeen.getTime();
  const isIdle = idleMs >= TRIGGER_CONFIG.SESSION_IDLE_MS;

  // ── Budzet sesije ───────────────────────────────────────────────────────
  const budgetSpent =
    session.suppressed || session.analysisCount >= TRIGGER_CONFIG.MAX_CALLS_PER_SESSION;

  // Cak i kad je budzet potrosen, repove cistimo pravilima — inace broj
  // neobradjenih eventa raste u beskonacnost.
  if (budgetSpent) {
    return isIdle
      ? { shouldAnalyze: true, mode: 'rule',
          reason: `Budzet potrosen (${session.analysisCount}) — ciscenje pravilima` }
      : none(`Budzet potrosen (${session.analysisCount}/${TRIGGER_CONFIG.MAX_CALLS_PER_SESSION})`);
  }

  // ── Globalni budzet ─────────────────────────────────────────────────────
  if (!hasBudget()) {
    return isIdle
      ? { shouldAnalyze: true, mode: 'rule', reason: 'Globalni budzet potrosen — pravila' }
      : none('Globalni budzet potrosen');
  }

  // ── Cooldown ────────────────────────────────────────────────────────────
  const sinceLast = session.lastAnalyzedAt
    ? Date.now() - session.lastAnalyzedAt.getTime()
    : Number.POSITIVE_INFINITY;

  const cooldownActive = sinceLast < TRIGGER_CONFIG.COOLDOWN_MS;

  // ── Trigger 1: ozbiljna detekcija na svjezem eventu ─────────────────────
  const urgent = latestDetections.find(
    d => d.confidence >= TRIGGER_CONFIG.HIGH_CONFIDENCE && URGENT_TYPES.has(d.type),
  );

  //HMMMMMMMMM?
  if (urgent) {
    if (cooldownActive) {
      return none(`Cooldown ${Math.round(sinceLast / 1000)}s — detekcija ${urgent.type} preskocena`);
    }
    return { shouldAnalyze: true, mode: 'single',
      reason: `Detekcija ${urgent.type} (${urgent.confidence})` };
  }

  //I OVO MI JE HARD HMMMMMMMMMMMM
  // ── Trigger 2: previse neobradjenih eventa (zastita) ────────────────────
  if (unclassified >= TRIGGER_CONFIG.HARD_FLUSH && !cooldownActive) {
    return { shouldAnalyze: true, mode: 'batch',
      reason: `Nagomilano ${unclassified} neobradjenih eventa` };
  }

  // ── Trigger 3 i 4: sesija je zavrsena ───────────────────────────────────
  if (isIdle) {
    const withDetections = await db.event.count({
      where: { sessionId, analyzedAt: null, signalCount: { gt: 0 } },
    });

    if (withDetections === 0) {
      return { shouldAnalyze: true, mode: 'rule',
        reason: `[Trigger 4] Sesija zavrsena (${Math.round(idleMs / 1000)}s), nema detekcija — pravila` };
    }

    if (cooldownActive) return none(`Cooldown ${Math.round(sinceLast / 1000)}s`);

    return { shouldAnalyze: true, mode: 'batch',
      reason: `[Trigger 3] Sesija zavrsena (${Math.round(idleMs / 1000)}s), ${withDetections} eventa sa detekcijama` };
  }

  return none(`Nema triggera (${unclassified} neobradjenih, sesija jos aktivna)`);
}