import { analysisEmitter } from './analysisEmitter';
import { shouldAnalyzeSession } from './triggerEvaluator';
import { classifySessionBatch } from '../classification/classifySessionBatch';
import { classifyEvent } from '../classification/classifyEvent';


//koristen je mutex kako bi se sprijecila pojava race-condition
//postoje sanse da vise funkcija poziva na loggiranje iste sesije



//mutex kljuc
const activeAnalyses = new Set<string>();

analysisEmitter.on('event:logged', async ({ eventId, sessionId, detections }) => {
  console.log(`[Worker] Received event ${eventId} for session ${sessionId}`);

  const trigger = await shouldAnalyzeSession(sessionId, detections);
  if (!trigger.shouldAnalyze){
    console.log(`[Worker] No reason for LLM analysis`);
    return;
  }

  console.log(`[Worker] Trigger decision: ${trigger.reason}`);

  //za samo jedan kriticni event
  if (trigger.reason.startsWith('High-confidence detection')) {
    console.log(`[Worker] Single-event analysis for ${eventId}`);
    try {
      const result = await classifyEvent(eventId);
      if (result) {
        console.log(`[Worker] LLM classification: ${result.classification} (${result.confidence})`);
        console.log(`[Worker] LLM explanation: ${result.explanation}`);
        
      }
    } catch (err) {
      console.error(`[Worker] Single-event analysis failed:`, err);
    }
    return;
  }

  // Prevent concurrent batch analyses for the same session
  if (activeAnalyses.has(sessionId)) {
    console.log(`[Worker] Skipping — batch already running for ${sessionId}`);
    return;
  }

  activeAnalyses.add(sessionId);
  try {
    console.log(`[Worker] Batch analysis for session ${sessionId}`);
    const result = await classifySessionBatch(sessionId);
    if (result) {
      console.log(`[Worker] Classified ${result.eventsAnalyzed} events`);
      console.log(`[Worker] Verdict: ${result.sessionVerdict.primaryAttackType}`);
      console.log(`[Worker] ${result.sessionVerdict.summary}`);
    }
  } catch (err) {
    console.error(`[Worker] Batch analysis failed:`, err);
  } finally {
    activeAnalyses.delete(sessionId);
  }
});

console.log('[Worker] Analysis listener registered');