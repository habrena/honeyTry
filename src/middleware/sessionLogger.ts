import express, { Request, NextFunction, Response } from 'express';
import { randomUUID } from 'crypto';
import {db} from '../database/db'
import { stripNul } from './stripNul';
import { createHash } from 'crypto';


const COOKIE_NAME = 'mngmt_id'; // TIP: nazvati drugacije, ovisi od lazne namjere cookie
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Session Logging Middleware
export async function sessionLogger(req: Request, res: Response, next: NextFunction) {
  //honey token - trenutno je samo default 
  const rawToken = (typeof req.query.ref === 'string' && req.query.ref) ||
                 (typeof req.headers['x-token-id'] === 'string' && req.headers['x-token-id']) ||
                 'HT-UKNOWN';
  const tokenId = stripNul(String(rawToken)).slice(0, 256);
  

  // Extract real IP, handling comma-separated proxy chains
  const forwardedFor = req.headers['x-forwarded-for'];
  const rawIp = typeof forwardedFor === 'string'
    ? forwardedFor.split(',')[0].trim()
    : req.ip || req.socket.remoteAddress || 'unknown';

  // Strip IPv6-mapped IPv4 prefix (::ffff:127.0.0.1 -> 127.0.0.1)
  const sourceIp = rawIp.replace(/^::ffff:/, '');
  const userAgent = stripNul(String(req.headers['user-agent'] || 'unknown')).slice(0, 512);

  const existingCookie: string | null = req.cookies?.[COOKIE_NAME] ?? null;
  const fingerprint = 'f:' + createHash('sha256')
    .update(`${sourceIp}|${userAgent}`)
    .digest('hex')
    .slice(0, 32);
 
  const now = new Date();
  
  try {
    let session = null;
 
    // 1. Cookie je pointer — ako pokazuje na postojecu sesiju, koristi nju.
    if (existingCookie) {
      session = await db.session.findUnique({ where: { sessionKey: `c:${existingCookie}` } });
      if (!session) {
        // Cookie postoji ali sesija je nastala fingerprint granom.
        session = await db.session.findFirst({ where: { cookieId: existingCookie } });
      }
    }
 
    if (session) {
      session = await db.session.update({
        where: { id: session.id },
        data: { lastSeen: now, sourceIp, userAgent },
      });
    } else {
      // 2. Nema (upotrebljivog) cookieja -> fingerprint je kljuc.
      const cookieId = existingCookie ?? randomUUID();
 
      if (!existingCookie) {
        res.cookie(COOKIE_NAME, cookieId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: COOKIE_MAX_AGE,
        });
      }
 
      session = await db.session.upsert({
        where: { sessionKey: fingerprint },
        update: { lastSeen: now, sourceIp, userAgent, cookieId },
        create: {
          sessionKey: fingerprint,
          cookieId,
          tokenId,
          sourceIp,
          userAgent,
          identMethod: 'fingerprint',
          lastSeen: now,
        },
      });
    }
 
    req.session = session;
  } catch (err) {
    //console.error('[Session Logger] Failed to log session:', err);
    // NAPOMENA: ako ovo padne, eventLogger nece nista upisati.
  }

  next();
}
