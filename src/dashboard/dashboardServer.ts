import express from 'express';
import path from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), 'src', '.env') });

import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const PORT = 3002;

app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);

// Serve the built React app
app.use(express.static(path.join(process.cwd(), 'dashboard-dist')));

// Catch-all for React Router
app.get('{*splat}', (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dashboard-dist', 'index.html'));
});

//BITNO!
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[Dashboard] Running on http://127.0.0.1:${PORT}`);
  console.log(`[Dashboard] Only accessible from this machine`);
});