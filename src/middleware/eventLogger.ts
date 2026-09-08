import { Request, Response, NextFunction } from 'express';
import { db } from '../database/db';
import { runDetectors } from '../detection/runDetectors';
import { analysisEmitter } from '../detection/analysisEmitter';
import type { DetectionResult } from '../detection/DetectionResult';
import { stripNul } from './stripNul';

//nije potrebno da ova vanjska funkcija bude async
export function eventLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  //promjena kod bodySnapshota
  //potreban try/catch blok zbog cirkularnih referenci i BigInt
  //errori koji se bacaju iz funkcije JSON.stringify
  let bodySnapshot: any = null;
  try {
    bodySnapshot = req.body && Object.keys(req.body).length > 0
      ? JSON.parse(JSON.stringify(req.body))
      : null;
  } catch (err) {
    console.error('[Event Logger] body snapshot failed:', err);
    bodySnapshot = {
      _snapshotFailed: true,
      _reason: err instanceof Error ? err.message.slice(0, 200) : 'unknown',
    };
  }

  // Listen for when the response finishes sending to the client
  //ovo mora biti async
  res.on('finish', async () => {
    console.log('[EVENT 1] finish event fired');
    console.log('[EVENT 2] req.session:', req.session);
    if (!req.session){
      console.log('[EVENT 3] No session — skipping');
      return;
     } // Skip if no session was attached

    const durationMs = Date.now() - start;
    //KOMENTAR:
    // We need to capture request data before handlers run, 
    // but response data after they finish.
    try {
      // Lightweight pattern matching-regex detektori
      //stavljeno prije kreiranja eventa -> sprecava ponovni pristup bazi
      
      //uklanjanje nevidljivih karaktera
      const safeUrl     = stripNul(req.originalUrl);
      const safeQuery   = Object.keys(req.query).length > 0 ? stripNul(req.query) : null;
      const safeBody    = stripNul(bodySnapshot);
      const safeHeaders = stripNul(sanitizeHeaders(req.headers));
      const safeUa      = stripNul(req.headers['user-agent'] ?? null);

      let detections: DetectionResult[] = [];

      try{
        //detektori prije upisa u bazu-> kako ne bi dva puta upisivai u bazu
          detections = runDetectors({
            endpoint: safeUrl, 
            method: req.method,
            queryParams: safeQuery, 
            body: safeBody,
            userAgent: safeUa, 
            headers: safeHeaders,
          });
      }catch(err){
        console.error('[Event Logger] detector failure:', err);
        detections = [{
          type: 'DETECTOR_FAILURE',
          confidence: 0.75,                       // above HIGH_CONFIDENCE_THRESHOLD
          signals: [
            `Detector threw: ${err instanceof Error ? err.name : 'unknown'}`,
            err instanceof Error ? err.message.slice(0, 200) : 'unknown',
          ],
        }];
      }
      //u slucaju pada bodySnapshota
      //ovo je jos jedan pokusaj napada koji je vrijedan zabiljezja
      //razlog zbog kojeg postoji ovaj if
      //inace bi u bazi bilo prazno
      if (bodySnapshot?._snapshotFailed) {
        detections.push({
          type: 'UNSERIALIZABLE_BODY',
          confidence: 0.6,
          signals: [bodySnapshot._reason],
        });
      }


      const event=await db.event.create({
        data: {
          sessionId: req.session.id,
          eventType: 'REQUEST_RECEIVED',
          timestamp: new Date(),

          // What they requested
          method: req.method,
          endpoint: safeUrl,
          queryParams: safeQuery ?? undefined,
          body: safeBody,

          // What the server returned
          statusCode: res.statusCode,
          durationMs: durationMs,

          // Context that reveals tooling and intent
          headers: safeHeaders,
          contentType: stripNul(req.headers['content-type'] ?? null),
          referer: stripNul(req.headers['referer'] || null),
          origin: stripNul(req.headers['origin'] || null),

          //odgovor detektora
          metadata: detections.length > 0 ? JSON.parse(JSON.stringify(detections)) : undefined,
        },
      });
      //da se funkcija ne bi zakomplikovala koristim emitter prenos odgovornosti LLM detektoru/analizator
      //koristi fire-and-forget princip
      analysisEmitter.emit('event:logged', {
        eventId: event.id,
        sessionId: req.session.id,
        detections,
      });

    } catch (err) {
      console.error('[EVENT LOGGER] Error:', err);
      //svejedno upisi request iako se ne moze parsirati
      //zadnja opcija
      try {
        await db.event.create({
            data: {
              sessionId: req.session.id,
              eventType: 'REQUEST_RECEIVED',
              timestamp: new Date(),
              method: req.method,
              endpoint: '[UNSTORABLE]',
              statusCode: res.statusCode,
              metadata: [{ type: 'STORAGE_FAILURE', confidence: 0.8,
                signals: [String(err).slice(0, 200)] }],
            },
          });
        } catch { /* give up*/ }
      }
  });
  //moguce je staviti i res.on('close', loggiranje);
  //vidjeti da li je ovo toliko bitno
  //navodno ovo rade scanneri jer ne cekaju full responses i samo bacaju requests - sto ima donekle smisla

  //res.on('')
  next();
}

// Store headers but strip the cookie *value* — you already track via cookieId
export function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
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