import { db } from '../database/db';
import { callLLM, writeClassification, LLM_MODEL } from '../llm/llmClient';
import { consumeBudget } from '../detection/llmBudget';
import type { LLMClassification } from './LLMClassification';
import { classifySessionByRules } from '../detection/ruleClassifier';

/**
 * ============================================================================
 *  BATCH KLASIFIKACIJA
 * ============================================================================
 *  Struktura je ostala kao u originalu (LLM vraca niz eventa sa eventIndex).
 *  Ispravljeno je sljedece:
 *
 *   1. Cooldown je izbacen odavde — o tome odlucuje iskljucivo triggerEvaluator.
 *      Ranije je postojao na dva mjesta i dva su se pravila sudarala. ->TESTIRATI
 *   2. Svi poslani eventi dobijaju analyzedAt, i oni koje LLM nije vratio.
 *      Bez toga brojac neobradjenih nikad ne pada i trigger puca u krug. ->IMA SMISLA
 *   3. writeClassification koristi upsert (vidi llmClient), pa single i batch
 *      put vise ne mogu proizvesti P2002 na Classification.eventId. -> OKEJ
 *   4. Zaglavlja se salju JEDNOM, na nivou sesije, umjesto uz svaki event.
 *      Kod 30 eventa to je najveca pojedinacna usteda tokena u ovom fajlu. ->ODLICNO
 * ============================================================================
 */

const ANALYSIS_BATCH_SIZE = 30;   // koliko eventa ide u jedan poziv

interface EventClassification extends LLMClassification {
  eventIndex: number;
}

interface BatchLLMResponse {
  events: EventClassification[];
  sessionVerdict: {
    primaryAttackType: string;
    threatLevel: string;
    summary: string;
  };
}

export interface BatchResult {
  classifications: EventClassification[];
  sessionVerdict: BatchLLMResponse['sessionVerdict'];
  eventsAnalyzed: number;
}

const BATCH_PROMPT = `You are a security analyst for a medical appointment system honeypot.
Every request you see is from an unauthorized visitor — there are no legitimate users.

You will receive a JSON object containing:
- "session": metadata about the visitor (IP, user agent, honey token)
- "headerSample": HTTP headers from one representative request in this session
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

export async function classifySessionBatch(sessionId: string): Promise<BatchResult | null> {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    select: { tokenId: true, sourceIp: true, userAgent: true, firstSeen: true },
  });

  if (!session) {
    console.error(`[Batch] Sesija ${sessionId} ne postoji`);
    return null;
  }

  const events = await db.event.findMany({
    where: { sessionId, 
      analyzedAt: null, 
      signalCount: {gt: 0} //u analizu ne ulaze automated scans -> zbog cuvanja tokena
    },
    orderBy: { timestamp: 'asc' },
    take: ANALYSIS_BATCH_SIZE,
    select: {
      id: true, method: true, endpoint: true, queryParams: true, body: true,
      headers: true, statusCode: true, durationMs: true, contentType: true,
      metadata: true, timestamp: true,
    },
  });

    if (events.length === 0) {
    const swept = await classifySessionByRules(sessionId);
    console.log(`[Batch] Nema signalnih eventa za ${sessionId} — ${swept} počišćeno pravilima`);
    return null;
  }

  const payload = {
    session: {
      tokenId: session.tokenId,
      sourceIp: session.sourceIp,
      userAgent: session.userAgent,
      sessionAgeSeconds: Math.round((Date.now() - session.firstSeen.getTime()) / 1000),
      eventCount: events.length,
    },
    headerSample: events.find(e => e.headers)?.headers ?? null,
    events: events.map((event, index) => ({
      eventIndex: index,
      method: event.method,
      path: event.endpoint,
      query: event.queryParams,
      body: event.body,
      statusCode: event.statusCode,
      durationMs: event.durationMs,
      contentType: event.contentType,
      timestamp: event.timestamp,
      detectorSignals: event.metadata ?? null,
    })),
  };

  if (!consumeBudget()) {
    console.warn('[Batch] Globalni budzet potrosen — poziv preskocen');
    return null;
  }

  const response = await callLLM<BatchLLMResponse>(BATCH_PROMPT, payload);

  const now = new Date();

  if (!response || !Array.isArray(response.events) || !response.sessionVerdict) {
    console.error('[Batch] LLM odgovor nema ocekivana polja — prebacujem na pravila');
    await classifySessionByRules(sessionId);
    await db.session.update({
      where: { id: sessionId },
      data: { lastAnalyzedAt: now, analysisCount: { increment: 1 } },
    });
    return null;
  }

  // odbaci indekse koje je model izmislio (van opsega ili duplikate)
  const seen = new Set<number>();
  const valid = response.events.filter(ec => {
    if (!Number.isInteger(ec.eventIndex)) return false;
    if (ec.eventIndex < 0 || ec.eventIndex >= events.length) return false;
    if (seen.has(ec.eventIndex)) return false;
    seen.add(ec.eventIndex);
    return true;
  });

  await db.$transaction(async (tx) => {
    const verdict = await tx.sessionVerdict.create({
      data: {
        sessionId,
        detector: LLM_MODEL,
        mode: 'batch',
        status: 'OK',
        eventsSent: events.length,
        eventsClassified: valid.length,
        windowStart: events[0].timestamp,
        windowEnd: events[events.length - 1].timestamp,
        primaryAttackType: response.sessionVerdict.primaryAttackType,
        threatLevel: response.sessionVerdict.threatLevel,
        summary: response.sessionVerdict.summary,
      },
    });

    for (const ec of valid) {
      await writeClassification(events[ec.eventIndex].id, ec, tx);
    }

    // Svi poslani eventi se oznacavaju kao obradjeni, i oni koje LLM nije vratio.
    await tx.event.updateMany({
      where: { id: { in: events.map(e => e.id) } },
      data: {
      analyzedAt: now,
      analyzeCount: { increment: 1 },
      sessionVerdictId: verdict.id,     
    },
    });

    await tx.session.update({
      where: { id: sessionId },
      data: { lastAnalyzedAt: now, analysisCount: { increment: 1 } },
    });
  });

  console.log(`[Batch] Klasifikovano ${valid.length}/${events.length} evenata`);
  console.log(`[Batch] Zakljucak: ${response.sessionVerdict.primaryAttackType} (${response.sessionVerdict.threatLevel})`);
  console.log(`[Batch] ${response.sessionVerdict.summary}`);

  return {
    classifications: valid,
    sessionVerdict: response.sessionVerdict,
    eventsAnalyzed: events.length,
  };
}