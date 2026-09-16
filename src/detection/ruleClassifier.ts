import { db } from '../database/db';
import type { DetectionResult } from './DetectionResult';

/**
 * ============================================================================
 *  RULE CLASSIFIER — klasifikacija BEZ LLM-a
 * ============================================================================
 *  Sesija koja je zavrsila a nijedan detektor nije nista nasao ne treba LLM.
 *  Odgovor je poznat iz statusnog koda i odsustva detekcija.
 *
 *  Rezultat ide u istu Classification tabelu, ali sa detector = 'rule', pa se
 *  u statistici uvijek moze razdvojiti sta je rekao model, a sta pravila.
 * ============================================================================
 */

function parseDetections(metadata: unknown): DetectionResult[] {
  return Array.isArray(metadata) ? (metadata as unknown as DetectionResult[]) : [];
}

export function ruleVerdict(e: { statusCode: number | null; metadata: unknown }) {
  const dets = parseDetections(e.metadata);
  const scan = dets.find(d => d.type === 'AUTOMATED_SCAN');
  const status = e.statusCode ?? 0;

  if (scan) {
    return {
      category: 'AUTOMATED_SCAN',
      confidence: scan.confidence,
      severity: 'low',
      explanation: `Pravilo: prepoznat alat za skeniranje (${scan.signals.slice(0, 2).join('; ')}).`,
    };
  }

  if (status >= 400 && status < 500) {
    return {
      category: 'RECONNAISSANCE',
      confidence: 0.6,
      severity: 'low',
      explanation: 'Pravilo: zahtjev za nepostojecom putanjom bez napadackog obrasca.',
    };
  }

  if (status >= 200 && status < 400) {
    return {
      category: 'BENIGN_PROBE',
      confidence: 0.5,
      severity: 'low',
      explanation: 'Pravilo: uobicajen zahtjev za javnom rutom, bez signala detektora.',
    };
  }

  return {
    category: 'UNKNOWN',
    confidence: 0.3,
    severity: 'low',
    explanation: 'Pravilo: nijedno pravilo se nije poklopilo; nije eskalirano na LLM.',
  };
}

/** Klasifikuje sve neobradjene evente sesije pravilima. Vraca broj eventa. */
export async function classifySessionByRules(sessionId: string, limit = 1000): Promise<number> {
  const events = await db.event.findMany({
    where: { sessionId, analyzedAt: null },
    orderBy: { timestamp: 'asc' },
    take: limit,
    select: { id: true, statusCode: true, metadata: true },
  });

  if (events.length === 0) return 0;

  await db.$transaction(async (tx) => {
    for (const e of events) {
      const v = ruleVerdict(e);
      await tx.classification.upsert({
        where: { eventId: e.id },
        update: {},                      // ne prepisuj postojecu LLM klasifikaciju
        create: {
          eventId: e.id,
          detector: 'rule',
          category: v.category,
          confidence: v.confidence,
          severity: v.severity,
          explanation: v.explanation,
        },
      });
    }

    await tx.event.updateMany({
      where: { id: { in: events.map(e => e.id) } },
      data: { analyzedAt: new Date(), analyzeCount: { increment: 1 } },
    });
  });

  //console.log(`[Rule] Klasifikovano ${events.length} eventa bez LLM-a (sesija ${sessionId})`);
  return events.length;
}