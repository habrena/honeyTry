import { db } from '../database/db';
import { callLLM, writeClassification } from '../llm/llmClient';
import type { LLMClassification } from '../classification/LLMClassification';

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
 * Classifies a single event using the LLM.
 *
    TIP: koristiti za trigger 1!!!!!
 */
export async function classifyEvent(eventId: string): Promise<LLMClassification | null> {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { session: true },
  });

  if (!event) return null;

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
};

  // call LLM (shared) 
  const classification = await callLLM<LLMClassification>(SINGLE_EVENT_PROMPT, payload);
  if (!classification) return null;

  // write to database (shared)
  await writeClassification(eventId, classification);

  return classification;
}