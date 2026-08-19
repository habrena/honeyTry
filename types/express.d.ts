import { Session } from '../prisma/generated/client';

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

export {}; //govorimo TypeScriptu da ovo tretira kao ekstenziju za modul


//To safely pass the active session from your session middleware 
//to your event logger, tell TypeScript that Express Request 
// can hold a session object.
