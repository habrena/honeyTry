import express, { Request, NextFunction, Response } from 'express';
import { randomUUID } from 'crypto';
import {db} from '../database/db'
import { stripNul } from './stripNul';


const COOKIE_NAME = 'appt_sid'; // TIP: nazvati drugacije, ovisi od lazne namjere cookie
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Session Logging Middleware
export async function sessionLogger(req: Request, res: Response, next: NextFunction) {
  //honey token - trenutno je samo default 
  const rawToken = (typeof req.query.ref === 'string' && req.query.ref) ||
                 (typeof req.headers['x-token-id'] === 'string' && req.headers['x-token-id']) ||
                 'HT-UKNOWN';
  const tokenId = stripNul(String(rawToken)).slice(0, 256);
  
  let cookieId = req.cookies?.[COOKIE_NAME];
  if (!cookieId) {
    cookieId = randomUUID();
    res.cookie(COOKIE_NAME, cookieId, {
      httpOnly: true,//means client-side JavaScript can't read the cookie via document.cookie, ALI ne znaci da se ne moze uociti preko Set-Cookie
      secure: true, //poslano samo preko HTTPs
      sameSite: 'strict', //prevents the cookie from being sent in cross-site requests???
      maxAge: COOKIE_MAX_AGE,
    });
  }

  // Extract real IP, handling comma-separated proxy chains
  const forwardedFor = req.headers['x-forwarded-for'];
  const rawIp = typeof forwardedFor === 'string'
    ? forwardedFor.split(',')[0].trim()
    : req.ip || req.socket.remoteAddress || 'unknown';

  // Strip IPv6-mapped IPv4 prefix (::ffff:127.0.0.1 -> 127.0.0.1)
  const sourceIp = rawIp.replace(/^::ffff:/, '');
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  try {
    // Upsert updates 'lastSeen' if the session exists, or creates it if new
    const session = await db.session.upsert({
      where: { cookieId },
      update: {
        lastSeen: new Date(),
        sourceIp,  //azurirati u slucaju da mijenjaju mreze/VPNs?????? zar je ostaje isti cookie?
        userAgent
      },
      create: {
        tokenId,
        cookieId,
        sourceIp,
        userAgent
      }
    });

    //povezujemo novokreirani session objekat sa request session objektom
    //bitno za dodavanje kasnijih event logova
    req.session=session;

  } catch (err) {
    //TIP: ovo kasnije skloniti
    console.error('Failed to log session:', err);
  }

  next();
}
