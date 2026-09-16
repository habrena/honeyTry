import { app } from './app';
import { startSessionSweeper } from './detection/sessionSweeper';


const PORT = process.env.PORT || 3001;

console.log('DB URL loaded:', !!process.env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  startSessionSweeper();
});