import express, { Request, NextFunction, Response } from 'express';
//import 'dotenv/config';
import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(process.cwd(), 'src', '.env') });

import {sessionLogger} from './middleware/sessionLogger'
import {eventLogger} from './middleware/eventLogger'
import cookieParser from 'cookie-parser';
import './detection/analysisWorker';
import { startSessionSweeper } from './detection/sessionSweeper';
import vlasnikRoutes from './front/vlasnikRoutes'

console.log('DB URL loaded:', !!process.env.DATABASE_URL);

const app = express();
app.set('trust proxy', true); //tell Express to trust incoming proxy headers (such as X-Forwarded-For) so it can read client IPs correctly behind reverse proxies (Nginx, Cloudflare, AWS, etc.)

const PORT = process.env.PORT || 3001;

const FAKE_PATIENTS=[
    {id: 'P-0324', name: 'Mico Micovic'},
    {id: 'P-0727', name: 'Cico Ciovic'},
    {id: 'P-0478', name: 'Tico Tici'},
    {id: 'P-0311', name: 'Emin Semic'},
];

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), 'dist')));


app.use(sessionLogger);
app.use(eventLogger);
app.use('/api/vlasnik', vlasnikRoutes);

//app.use(express.static(path.join(__dirname, '..', 'dist')));

// Catch-all: any request that doesn't match an API route gets index.html.
// This is necessary for React Router — if someone navigates directly to
// /staff-portal, Express needs to serve index.html so React can handle
// the routing client-side.
/*app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});*/


app.get('/', (_req: Request, res:Response)=>{
    res.json({response: 'Aplikacija je pokrenuta', status: 200});
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'pokusao si' });
});

app.get('/api/patient/search', (_req: Request, res:Response)=>{
    const query=(_req.query.q as string || '').trim().toLowerCase();

    if(!query){
        return res.json({results: []})
    }
    const results = FAKE_PATIENTS.filter(pacijent=>
        pacijent.name.toLowerCase().includes(query)
    );
   
    return res.json({results});
});

app.get('{*splat}', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  startSessionSweeper();
});