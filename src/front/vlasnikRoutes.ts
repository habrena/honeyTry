/**
 * vlasnikRoutes.ts
 * -------------------------------------------------------------------------
 * Honeypot routes that back the copied "Menadžment Panel" frontend.
 * Paths and response field names mirror the real management panel EXACTLY,
 * so the copied React screen renders unchanged. Data is read from the decoy
 * tables in Neon (seed with seed-decoy.ts).
 *
 * Routes:
 *   GET  /api/vlasnik/korisnici-po-ulogama   -> [{ uloga, broj }]
 *   GET  /api/vlasnik/termini-stats          -> { slobodni, zakazaniPoDoktoru: [...] }
 *   GET  /api/vlasnik/export-csv             -> CSV blob (bulk-dump bait)
 *   POST /api/vlasnik/termini                -> fake booking (write-surface bait)
 *
 * Honeypot behavior:
 *   - NO auth validation. The Authorization header is logged by eventLogger,
 *     never verified. Every visitor is treated as unauthorized (by design).
 *   - Malicious input is NOT sanitized. We want the detectors to fire.
 *   - Non-primary verbs are handled explicitly (405 / fake success) so
 *     verb-flipping is logged instead of silently 404ing.
 *
 * Mount AFTER sessionLogger + eventLogger:
 *     app.use('/api/vlasnik', vlasnikRoutes);
 */

import { Router, Request, Response } from 'express';
import { db } from '../database/db'; 

const router = Router();

function methodNotAllowed(req: Request, res: Response, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ error: 'Method Not Allowed', method: req.method, allowed });
}

/* ========================================================================== */
/*  GET /api/vlasnik/korisnici-po-ulogama                                      */
/*  Returns registered-user counts per role. Shape: [{ uloga, broj }]         */
/* ========================================================================== */
router.get('/korisnici-po-ulogama', async (_req: Request, res: Response) => {
  const rows = await db.uloga.findMany({
    select: { uloga: true, broj: true },
  });
  return res.status(200).json(rows);
});

/* ========================================================================== */
/*  GET /api/vlasnik/termini-stats                                             */
/*  Returns { slobodni, zakazaniPoDoktoru: [{ doktorId, ime, prezime, odjel,  */
/*  ukupno, brojZakazanih, brojSlobodnih }] }                                  */
/* ========================================================================== */
router.get('/termini-stats', async (_req: Request, res: Response) => {
  const doktori = await db.doktor.findMany({ orderBy: { id: 'asc' } });

  const zakazaniPoDoktoru = doktori.map((d) => ({
    doktorId: d.id,
    ime: d.ime,
    prezime: d.prezime,
    odjel: d.odjel,
    ukupno: d.ukupno,
    brojZakazanih: d.brojZakazanih,
    brojSlobodnih: d.brojSlobodnih,
  }));

  // Top-level "slobodni" is the sum of per-doctor free slots — kept consistent
  // with the table so an attacker doing the math sees no discrepancy.
  const slobodni = doktori.reduce((s, d) => s + d.brojSlobodnih, 0);

  return res.status(200).json({ slobodni, zakazaniPoDoktoru });
});

/* ========================================================================== */
/*  GET /api/vlasnik/export-csv?period=custom&datumOd=&datumDo=                */
/*  Bulk data-dump bait. Anyone hitting this — especially with wide or         */
/*  manipulated date ranges — signals exfiltration intent. We do NOT validate  */
/*  or sanitize datumOd/datumDo; SQLi/traversal attempts in those params are   */
/*  exactly what we want the detectors to catch.                               */
/* ========================================================================== */
router.get('/export-csv', async (req: Request, res: Response) => {
  const datumOd = String(req.query.datumOd ?? '');
  const datumDo = String(req.query.datumDo ?? '');

  const doktori = await db.doktor.findMany({ orderBy: { id: 'asc' } });

  // Build a CSV that echoes the (unsanitized) date range in a comment line —
  // gives injection payloads somewhere to appear in the output.
  const header = 'doktorId,ime,prezime,odjel,ukupno,zakazanih,slobodnih';
  const lines = doktori.map(
    (d) => `${d.id},${d.ime},${d.prezime},${d.odjel},${d.ukupno},${d.brojZakazanih},${d.brojSlobodnih}`,
  );
  const csv = [`# period ${datumOd} .. ${datumDo}`, header, ...lines].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="statistika_${datumOd}_${datumDo}.csv"`);
  return res.status(200).send(csv);
});

/* ========================================================================== */
/*  POST /api/vlasnik/termini                                                  */
/*  The ONE write route. Not linked from the (read-only) frontend — an         */
/*  attacker only reaches it by guessing/verb-flipping. Returns a tempting     */
/*  fake success so they believe they can create records, and records what     */
/*  they tried into DecoyAppointment. Nothing real is affected.                */
/*  Expected-ish body: { doktorId, pacijentId?, datum, razlog? }               */
/* ========================================================================== */
router.post('/termini', async (req: Request, res: Response) => {
  const body = req.body ?? {};

  // Store the attempt verbatim (no validation) so you can study injected
  // payloads in the body later. eventLogger also logs the raw event.
  let createdId: number | null = null;
  try {
    const row = await db.termin.create({
      data: {
        doktorId: Number(body.doktorId) || 0,
        pacijentId: body.pacijentId != null ? Number(body.pacijentId) || null : null,
        datum: String(body.datum ?? ''),
        razlog: body.razlog != null ? String(body.razlog) : null,
      },
    });
    createdId = row.id;
  } catch {
    // Even if the write fails, return a plausible success — the point is the
    // attacker's belief that writes work, and the logged attempt.
  }

  return res.status(201).json({
    success: true,
    message: 'Termin uspješno zakazan.',
    terminId: createdId ?? Math.floor(1000 + Math.random() * 9000),
  });
});

/* -------------------------------------------------------------------------- */
/*  Verb-flipping handlers: log attempts against the GET routes.              */
/*  405s tell the attacker "resource exists, wrong verb" -> invites probing.  */
/* -------------------------------------------------------------------------- */
router.post('/korisnici-po-ulogama', (req, res) => methodNotAllowed(req, res, ['GET']));
router.post('/termini-stats', (req, res) => methodNotAllowed(req, res, ['GET']));

router.put('/termini', (req, res) => methodNotAllowed(req, res, ['POST']));
router.delete('/termini', (req, res) => methodNotAllowed(req, res, ['POST']));

export default router;