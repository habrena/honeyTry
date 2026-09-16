import express, { Request, Response } from 'express';
import path from 'path';
import { config } from 'dotenv';

// Ucitavanje okruzenja ostaje ovdje, jer app mora biti upotrebljiv i bez
// server.ts. dotenv po pravilu NE prepisuje vec postavljene varijable, pa
// integracioni testovi mogu postaviti svoj DATABASE_URL prije uvoza ovog
// modula i on ce imati prednost nad sadrzajem src/.env.
config({ path: path.resolve(process.cwd(), 'src', '.env') });

import { sessionLogger } from './middleware/sessionLogger';
import { eventLogger } from './middleware/eventLogger';
import cookieParser from 'cookie-parser';
import './detection/analysisWorker';
import vlasnikRoutes from './front/vlasnikRoutes';

const FAKE_PATIENTS = [
  { id: 'P-0324', name: 'Mico Micovic' },
  { id: 'P-0727', name: 'Cico Ciovic' },
  { id: 'P-0478', name: 'Tico Tici' },
  { id: 'P-0311', name: 'Emin Semic' },
];

export const app = express();

app.set('trust proxy', true);

// NAPOMENA: redoslijed ispod je namjerno ostavljen nepromijenjen. Tri
// posljedice tog redoslijeda su predmet integracionih testova u grupi A.
app.use(express.json());
app.use(cookieParser());


app.use('/api/vlasnik', vlasnikRoutes);

app.use(sessionLogger);
app.use(eventLogger);

app.use(express.static(path.join(process.cwd(), 'dist')));

app.get('/', (_req: Request, res: Response) => {
  res.json({ response: 'Aplikacija je pokrenuta', status: 200 });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'pokusao si' });
});

app.get('/api/patient/search', (_req: Request, res: Response) => {
  const query = ((_req.query.q as string) || '').trim().toLowerCase();

  if (!query) {
    return res.json({ results: [] });
  }

  const results = FAKE_PATIENTS.filter((pacijent) =>
    pacijent.name.toLowerCase().includes(query),
  );

  return res.json({ results });
});

app.get('{*splat}', (req, res) => {
  const status = req.path.startsWith('/api') ? 404 : 200;
  res.status(status).sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});