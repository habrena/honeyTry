import { db } from '../database/db';
import { callLLM, writeClassification } from '../llm/llmClient';
import type { LLMClassification } from '../classification/LLMClassification';
import type { DetectionResult } from '../detection/DetectionResult';

const NUMBER_OF_LAST_EVENTS = 10;

const SINGLE_EVENT_PROMPT = `You are a security analyst for a medical appointment system honeypot.
Every request you see is from an unauthorized visitor — there are no legitimate users.

Classify this event. Respond ONLY with valid JSON, no markdown, no explanation outside the JSON.

{
  "classification": "one of: RECONNAISSANCE, SQL_INJECTION, CREDENTIAL_ATTACK, DATA_EXFILTRATION, DIRECTORY_TRAVERSAL, XSS_ATTEMPT, BENIGN_PROBE, AUTOMATED_SCAN, UNKNOWN",
  "confidence": 0.0 to 1.0,
  "severity": "low | medium | high | critical",
  "explanation": "one sentence why"
}`;

/**
 * koristi se za samo jedan event
 */
export async function classifyEvent(eventId: string): Promise<LLMClassification | null> {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { session: true },
  });

  if (!event) return null;
  //ako odlucim da stavim opciju koristenja konteksta
  /*
  const previousEvents = await db.event.findMany({
    where: {
      sessionId: event.sessionId,
      timestamp: { lt: event.timestamp },
    },
    orderBy: { timestamp: 'desc' },
    take: NUMBER_OF_LAST_EVENTS,
    select: {
      eventType: true,
      method: true,
      endpoint: true,
      queryParams: true,
      statusCode: true,
      timestamp: true,
      classification: {
        select: { category: true },
      },
    },
  });
  */

  const detections = Array.isArray(event.metadata) ? (event.metadata as unknown as DetectionResult[]) : [];
  const failed = detections.some(d => d.type === 'DETECTOR_FAILURE');


  //gather data (specific to single-event) 
  //ne koristi context za analiziranje jednog eventa
  const payload = {
  event: {
    method: event.method,
    path: event.endpoint,
    query: event.queryParams,
    body: event.body,
    headers: event.headers,
    statusCode: event.statusCode,
  },
  session: {
    tokenId: event.session.tokenId,
    sourceIp: event.session.sourceIp,
    userAgent: event.session.userAgent,
  },
  detectors: failed
    ? { status: 'FAILED', note: 'Pattern-matching failed on this input — it likely contains malformed encoding, null bytes, or unusual structure. No regex verdict is available. Classify from the raw request alone, and treat the malformed input itself as a potential signal.' }
    : detections.length > 0
      ? { status: 'MATCHED', results: detections }
      : { status: 'CLEAN', note: 'No pattern matched. Absence of a match is weak evidence — patterns cover known attack shapes only.' },

};

  // call LLM (shared) 
  const classification = await callLLM<LLMClassification>(SINGLE_EVENT_PROMPT, payload);
  if (!classification){
    console.error('[Single Event Classification] LLM response failed');
    return null;
  }

  // write to database (shared)
  await writeClassification(eventId, classification);

  return classification;
}