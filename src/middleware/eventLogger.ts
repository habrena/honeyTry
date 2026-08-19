import { Request, Response, NextFunction } from 'express';
import { db } from '../database/db';
import { classifyEvent} from '../classification/eventClassificator';
import { runDetectors } from '../detection/runDetectors';
import { shouldAnalyzeSession } from '../detection/triggerEvaluator';

//nije potrebno da ova vanjska funkcija bude async
export function eventLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  const bodySnapshot = req.body && Object.keys(req.body).length > 0
    ? JSON.parse(JSON.stringify(req.body))
    : null;

  // Listen for when the response finishes sending to the client
  //ovo mora biti async
  res.on('finish', async () => {
    console.log('[DEBUG 1] finish event fired');
    console.log('[DEBUG 2] req.session:', req.session);
    if (!req.session){
      console.log('[DEBUG 3] No session — skipping');
      return;
     } // Skip if no session was attached

    const durationMs = Date.now() - start;
    //KOMENTAR:
    // We need to capture request data before handlers run, 
    // but response data after they finish.
    try {
      const event=await db.event.create({
        data: {
          sessionId: req.session.id,
          eventType: 'REQUEST_RECEIVED',
          timestamp: new Date(),

          // What they requested
          method: req.method,
          endpoint: req.originalUrl,
          queryParams: Object.keys(req.query).length > 0 ? req.query : undefined,
          body: bodySnapshot,

          // What the server returned
          statusCode: res.statusCode,
          durationMs: Date.now() - start,

          // Context that reveals tooling and intent
          headers: sanitizeHeaders(req.headers),
          contentType: req.headers['content-type'] || null,
          referer: req.headers['referer'] || null,
          origin: req.headers['origin'] || null,
        },
      });
      /*
      // Classify and log the result so you can see it
      //TIP: kasnije uraditi fire and forget
      console.log('[DEBUG 4] Event created:', event.id);
      const result = await classifyEvent(event.id);
       console.log('[DEBUG 5] Classification result:', result);
      if (result) {
        console.log(`[CLASSIFIED] ${req.method} ${req.originalUrl}`);
        console.log(`  Category:    ${result.classification}`);
        console.log(`  Confidence:  ${result.confidence}`);
        console.log(`  Severity:    ${result.severity}`);
        console.log(`  Explanation: ${result.explanation}`);
      }
        */

      // Step 2: lightweight pattern matching
      const detections = runDetectors({
        endpoint: req.originalUrl,
        method: req.method,
        queryParams: Object.keys(req.query).length > 0 ? req.query : null,
        body: bodySnapshot,
        userAgent: req.headers['user-agent'] || null,
        headers: sanitizeHeaders(req.headers),
      });
      // Step 3: persist detection signals on the event
      if (detections.length > 0) {
        await db.event.update({
          where: { id: event.id },
          data: { metadata: detections },
        });
      }
      // Step 4: should we spend money on the LLM?
      const trigger = await shouldAnalyzeSession(
        req.session.id,
        detections
      );



    } catch (err) {
      console.error('[DEBUG 6] Error:', err);
    }
  });
  //moguce je staviti i res.on('close', loggiranje);
  //vidjeti da li je ovo toliko bitno
  //navodno ovo rade scanneri jer ne cekaju full responses i samo bacaju requests - sto ima donekle smisla

  next();
}

// Store headers but strip the cookie *value* — you already track via cookieId
function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const cleaned = { ...headers };
  if (cleaned.cookie) {
    // Keep cookie names but redact values
    cleaned.cookie = cleaned.cookie
      .split(';')
      .map((c: string) => c.split('=')[0].trim() + '=***')
      .join('; ');
  }
  return cleaned;
}