import { db } from '../database/db';
import OpenAI from 'openai';
import type {LLMClassification} from '../classification/LLMClassification'; //importujem type a ne runtime value??????

const LLM_model = 'deepseek-v4-pro';

const NUMBER_OF_LAST_EVENTS = 10; //TIP: ovo se moze unaprijediti da bude dinamicki - kasnije

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const CLASSIFICATION_PROMPT = `You are a security analyst for a medical appointment system honeypot.
Every request you see is from an unauthorized visitor — there are no legitimate users.

Classify this event. Respond ONLY with valid JSON, no markdown, no explanation outside the JSON.

{
  "classification": "one of: RECONNAISSANCE, SQL_INJECTION, CREDENTIAL_ATTACK, DATA_EXFILTRATION, DIRECTORY_TRAVERSAL, XSS_ATTEMPT, BENIGN_PROBE, AUTOMATED_SCAN, UNKNOWN",
  "confidence": 0.0 to 1.0,
  "severity": "low | medium | high | critical",
  "explanation": "one sentence why"
}`;

export async function classifyEvent(eventId: string): Promise<LLMClassification | null> {
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { session: true },
  });

  if (!event) return null;

  // Pull previous events WITH their classifications through the relation
  const previousEvents = await db.event.findMany({
    where: {
      sessionId: event.sessionId,
      timestamp: { lt: event.timestamp },
    },
    orderBy: { timestamp: 'desc' }, //uzima zadnjih n zahtjeva
    take: NUMBER_OF_LAST_EVENTS,
    select: {
      eventType: true,
      method: true,
      endpoint: true,
      queryParams: true,
      statusCode: true,
      timestamp: true,
      classification: {          // this pulls from the Classification table
        select: {
          category: true,
        },
      },
    },
  });

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
      requestCount: previousEvents.length + 1,
      previousEvents: previousEvents.map(e => ({
        type: e.eventType,
        method: e.method,
        path: e.endpoint,
        query: e.queryParams,
        statusCode: e.statusCode,
        timestamp: e.timestamp,
        classification: e.classification || null,
      })),
    },
  };

  try {
    const completion = await deepseek.chat.completions.create({
      model: LLM_model,
      messages: [
        { role: 'system', content: CLASSIFICATION_PROMPT },
        { role: 'user', content: JSON.stringify(payload, null, 2) },
      ],
    });

    const raw = completion.choices[0]?.message?.content || '';

    let classification: LLMClassification;
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      classification = JSON.parse(cleaned);
    } catch {
      console.error('LLM returned unparseable response:', raw);
      return null;
    }

    // Create a new row in the Classification table instead of updating Event
    await db.classification.create({
      data: {
        eventId: eventId,
        detector: LLM_model,
        category: classification.classification,
        confidence: classification.confidence,
        severity: classification.severity,
        explanation: classification.explanation,
      },
    });

    return classification;

  } catch (err) {
    console.error('DeepSeek API call failed:', err);
    return null;
  }
}