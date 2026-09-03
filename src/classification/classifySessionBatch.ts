import { db } from '../database/db';
import { callLLM, writeClassification, LLM_MODEL } from '../llm/llmClient';
import type { LLMClassification } from '../classification/LLMClassification';


const BATCH_SIZE = 10;             // max events per LLM call
const COOLDOWN_MS = 30 * 1000;    // don't re-analyze within 30 seconds

// ─── Types ─────────────────────────────────────────────────────────────

// What the LLM returns for each event in the batch
interface EventClassification extends LLMClassification {
  eventIndex: number;
}

// The full shape of the LLM's JSON response
interface BatchLLMResponse {
  events: EventClassification[];
  sessionVerdict: {
    primaryAttackType: string;
    threatLevel: string;
    summary: string;
  };
}

// What this function returns to the caller
export interface BatchResult {
  classifications: EventClassification[];
  sessionVerdict: BatchLLMResponse['sessionVerdict'];
  eventsAnalyzed: number;
}

// ─── Prompt ────────────────────────────────────────────────────────────

const BATCH_PROMPT = `You are a security analyst for a medical appointment system honeypot.
Every request you see is from an unauthorized visitor — there are no legitimate users.

You will receive a JSON object containing:
- "session": metadata about the visitor (IP, user agent, honey token)
- "events": an array of HTTP events, each with an "eventIndex" field

Classify EACH event individually AND provide an overall session assessment.
Respond ONLY with valid JSON, no markdown, no explanation outside the JSON.

{
  "events": [
    {
      "eventIndex": 0,
      "classification": "one of: RECONNAISSANCE, SQL_INJECTION, CREDENTIAL_ATTACK, DATA_EXFILTRATION, DIRECTORY_TRAVERSAL, XSS_ATTEMPT, BENIGN_PROBE, AUTOMATED_SCAN, UNKNOWN",
      "confidence": 0.0 to 1.0,
      "severity": "low | medium | high | critical",
      "explanation": "one sentence why"
    }
  ],
  "sessionVerdict": {
    "primaryAttackType": "the dominant attack category across all events",
    "threatLevel": "low | medium | high | critical",
    "summary": "2-3 sentence narrative of what the attacker is doing"
  }
}`;

// ─── Main function ─────────────────────────────────────────────────────

/**
 * Classifies up to BATCH_SIZE unclassified events for a session
 * in a single LLM call.
 *
 * Call this when a trigger fires (batch threshold, signal accumulation,
 * or session timeout). If there are more unclassified events than
 * BATCH_SIZE, the oldest N are classified now — the next trigger
 * will pick up the rest.
 *
 * Returns null if:
 * - the session doesn't exist
 * - cooldown hasn't elapsed since the last analysis
 * - there are no unclassified events
 * - the LLM call fails
 */
export async function classifySessionBatch(sessionId: string): Promise<BatchResult | null> {

  // ── Cooldown check ─────────────────────────────────────────────────
  const session = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    console.error(`[Batch] Session ${sessionId} not found`);
    return null;
  }

  /*
  //ovo ukloniti ako bude potrebe
  if (session.lastAnalyzedAt) {
    const elapsed = Date.now() - session.lastAnalyzedAt.getTime();
    if (elapsed < COOLDOWN_MS) {
      console.log(`[Batch] Cooldown active — last analyzed ${Math.round(elapsed / 1000)}s ago`);
      return null;
    }
  }
    */

  // ── Job 1: gather data (specific to batch) ─────────────────────────
  // Pull the oldest unclassified events, capped at BATCH_SIZE.
  // Oldest first so we classify in chronological order.
  const unclassifiedEvents = await db.event.findMany({
    where: {
      sessionId,
      classification: null,
    },
    orderBy: { timestamp: 'asc' },
    take: BATCH_SIZE,
    select: {
      id: true,
      method: true,
      endpoint: true,
      queryParams: true,
      body: true,
      headers: true,
      statusCode: true,
      durationMs: true,
      contentType: true,
      metadata: true,   // detector signals from runDetectors
      timestamp: true,
    },
  });

  if (unclassifiedEvents.length === 0) {
    console.log(`[Batch] No unclassified events for session ${sessionId}`);
    return null;
  }

  const payload = {
    session: {
      tokenId: session.tokenId,
      sourceIp: session.sourceIp,
      userAgent: session.userAgent,
    },
    events: unclassifiedEvents.map((event, index) => ({
      eventIndex: index,
      method: event.method,
      path: event.endpoint,
      query: event.queryParams,
      body: event.body,
      headers: event.headers,
      statusCode: event.statusCode,
      durationMs: event.durationMs,
      contentType: event.contentType,
      timestamp: event.timestamp,
      detectorSignals: event.metadata || null,
    })),
  };

  // ── Job 2: call LLM (shared) ──────────────────────────────────────
  const response = await callLLM<BatchLLMResponse>(BATCH_PROMPT, payload);

  //validacija u slucaju da LLM nije vratio pozeljan odgovor
  //moguce je uraditi retake ovog odgovora
  if (!response || !Array.isArray(response.events) || !response.sessionVerdict) {
    console.error('[Batch] LLM response missing expected fields');
    return null;
  }

  // ── Job 3: write to database (shared) ─────────────────────────────
  // Filter out any eventIndex values the LLM hallucinated (out of range)
  //u slucaju da LLM vrati vise od dozvoljenog
  //moguce je ovo i ukloniti kako bi se ustedjelo na vremenu
  const validClassifications = response.events.filter(
    ec => ec.eventIndex >= 0 && ec.eventIndex < unclassifiedEvents.length
  );

  // Build all writes + cooldown update, execute as a single transaction
  //ovo napisati kako funkcionise
 /* const writes = validClassifications.map(ec =>
    writeClassification(unclassifiedEvents[ec.eventIndex].id, ec)
  );

  const cooldownUpdate = db.session.update({
    where: { id: sessionId },
    data: { lastAnalyzedAt: new Date() },
  });

  */
  //najbitniji korak
  //objasniti ovaj dio
  //await db.$transaction([...writes, cooldownUpdate]);

  //moze se staviti i upsert da ne bi imali vise klasifikacija
  //za svaki event koji se registruje
  //nije pozeljno ali je jedan od nacina za debuggiranje
  await db.$transaction(async (tx) => {
  for (const ec of validClassifications) {
    await tx.classification.create({
      data: {
        eventId: unclassifiedEvents[ec.eventIndex].id,
        detector: LLM_MODEL,
        category: ec.classification,
        confidence: ec.confidence,
        severity: ec.severity,
        explanation: ec.explanation,
      },
    });
  }

  await tx.session.update({
    where: { id: sessionId },
    data: { lastAnalyzedAt: new Date() },
  });
});

  // ── Log results ───────────────────────────────────────────────────
  console.log(`[Batch] Classified ${validClassifications.length}/${unclassifiedEvents.length} events`);
  console.log(`[Batch] Verdict: ${response.sessionVerdict.primaryAttackType} (${response.sessionVerdict.threatLevel})`);
  console.log(`[Batch] ${response.sessionVerdict.summary}`);

  return {
    classifications: validClassifications,
    sessionVerdict: response.sessionVerdict,
    eventsAnalyzed: unclassifiedEvents.length,
  };
}