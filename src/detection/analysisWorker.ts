import { analysisEmitter } from './analysisEmitter';
import { enqueue } from './analysisQueue';

/**
 * Worker je tanak: prima obavjestenje da je event upisan i prosljedjuje ga u red.
 * Sve odluke donosi triggerEvaluator, unutar reda.
 */
interface LoggedEvent {
  eventId: string;
  sessionId: string;
  detections?: { type: string; confidence: number }[];
}

analysisEmitter.on('event:logged', ({ eventId, sessionId, detections }: LoggedEvent) => {
  try {
    enqueue({ sessionId, eventId, detections: detections ?? [] });
  } catch (err) {
    console.error('[Worker] Neuspjelo dodavanje u red:', err);
  }
});

console.log('[Worker] Analysis listener registrovan');