import { db } from '../database/db';
import { Prisma } from '../../prisma/generated/client';

interface TriggerDecision {
  shouldAnalyze: boolean;
  reason: string;
}

const HIGH_CONFIDENCE_THRESHOLD = 0.7; // Trigger 1: immediate analysis for high-confidence detections
const BATCH_SIZE = 10;                // Trigger 2: classify after this many unclassified events
const SIGNAL_ACCUMULATION = 3;         // Trigger 3: this many detected events in a session triggers analysis
const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // Trigger 4: 5 minutes of silence = session ended

/**
 * Returns { shouldAnalyze: true/false, reason: "why" }
 */
export async function shouldAnalyzeSession(
  sessionId: string,
  latestDetections: { type: string; confidence: number }[]
): Promise<TriggerDecision> {

  // ------------------------------------------------------------------
  // Trigger 1: Suspicious event — a detector just found something serious
  // ------------------------------------------------------------------
  const highConfidence = latestDetections.find(d => d.confidence >= HIGH_CONFIDENCE_THRESHOLD);
  if (highConfidence) {
    return {
      shouldAnalyze: true,
      reason: `High-confidence detection: ${highConfidence.type} (${highConfidence.confidence})`,
    };
  }

  
  // ------------------------------------------------------------------
  // Trigger 2: Enough unclassified events have accumulated
  // ------------------------------------------------------------------
  //uzima evente te odredjene sesije koje pritom nisu kvalificirane
  const unclassifiedCount = await db.event.count({
    where: {
      sessionId,
      classification: null,
    },
  });

  
  if (unclassifiedCount >= BATCH_SIZE) {
    return {
      shouldAnalyze: true,
      reason: `Batch threshold reached: ${unclassifiedCount} unclassified events`,
    };
  }
    

  // ------------------------------------------------------------------
  // Trigger 3: Attack pattern accumulation — multiple detected events
  // ------------------------------------------------------------------
  // Count how many events in this session have detection metadata (detectors fired)
  const detectedEventCount = await db.event.count({
    where: {
      sessionId,
      metadata: {
        not: Prisma.DbNull, // events where detectors found something -> ALI OVO JE UVIJEK TACNO
      },
      classification: null, // not yet analyzed by LLM
    },
  });

  /*
  if (detectedEventCount >= SIGNAL_ACCUMULATION) {
    return {
      shouldAnalyze: true,
      reason: `Signal accumulation: ${detectedEventCount} events with detection signals`,
    };
  }
    */

  // ------------------------------------------------------------------
  // Trigger 4: Session appears to have ended (gap in activity)
  // ------------------------------------------------------------------
  const session = await db.session.findUnique({
    where: { id: sessionId },
    select: { lastSeen: true },
  });

  if (session) {
    const silenceMs = Date.now() - session.lastSeen.getTime();
    if (silenceMs >= SESSION_TIMEOUT_MS && unclassifiedCount > 0) {
      return {
        shouldAnalyze: true,
        reason: `Session timeout: ${Math.round(silenceMs / 1000)}s of inactivity with ${unclassifiedCount} unclassified events`,
      };
    }
  }

  // ------------------------------------------------------------------
  // No trigger fired — don't call the LLM
  // ------------------------------------------------------------------
  return {
    shouldAnalyze: false,
    reason: `No trigger met (${unclassifiedCount} unclassified, ${detectedEventCount} with signals)`,
  };
}
