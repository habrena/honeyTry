// analysisWorker.ts
import { analysisEmitter } from './analysisEmitter';
import { shouldAnalyzeSession } from './triggerEvaluator';
import { classifySessionBatch } from './classification/classifySessionBatch';

// This runs once when the file is imported — it registers the listener.
// From that point on, every 'event:logged' emission will trigger this callback.
analysisEmitter.on('event:logged', async ({ eventId, sessionId, detections }) => {

  console.log(`[Worker] Received event ${eventId} for session ${sessionId}`);

  // Step 1: ask the trigger evaluator if we should bother with the LLM
  const trigger = await shouldAnalyzeSession(sessionId, detections);

  console.log(`[Worker] Trigger decision: ${trigger.reason}`);

  // Step 2: only if a trigger fired, call the LLM
  if (trigger.shouldAnalyze) {
    console.log(`[Worker] Analyzing session ${sessionId}...`);
    const result = await classifySessionBatch(sessionId);

    if (result) {
      console.log(`[Worker] Classified ${result.eventsAnalyzed} events`);
      console.log(`[Worker] Verdict: ${result.sessionVerdict.primaryAttackType}`);
      console.log(`[Worker] ${result.sessionVerdict.summary}`);
    }
  }
});

console.log('[Worker] Analysis listener registered');