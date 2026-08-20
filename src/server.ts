import express, { Request, NextFunction, Response } from 'express';
import 'dotenv/config';
import {sessionLogger} from './middleware/sessionLogger'
import {eventLogger} from './middleware/eventLogger'
import cookieParser from 'cookie-parser';
import 'src\detection\analysisWorker.ts';



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
app.use(sessionLogger);
app.use(eventLogger);

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


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});