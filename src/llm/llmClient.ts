import { db } from '../database/db';
import OpenAI from 'openai';

export const LLM_MODEL = 'deepseek-v4-pro';

/*
export const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});
*/

//TIP: zasto ova funkcija postoji?
//prilikom startupa, zadnji fajlovi u import lancu se prvi startaju
//posto je llmClient medju zadnjim u lancu i samim tim i OpenAi klijent,
//on ne dobiva na vrijeme API kljuc
//takodjer jedan od razloga je i pozicija dotenv/config fajla u tom lancu 
// (on je zasluzan za koristenje env kljuca)
//sa ovom funkcijom kreiramo klijenta sa prvim pozivom LLM a ne pri samom startu honeypota


//OpenAi klijent je HTTP client- objekat koji komunicira sa LLMom
//potreban je jer je DeepSeek API HTTP servis
//nas zahtjev je HTTP POST request sa svim zaglavljima
//The client wraps all of that so instead of manually constructing HTTP requests
let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return _client;
}

/**
 * Sends a prompt + payload to DeepSeek and returns the parsed JSON.
 * This is the raw LLM call — no database reads or writes.
 *
 * Returns null if the API call fails or the response isn't valid JSON.
 * 
 * VEOMA BITNO:
 * The generic type T lets each caller define their own response shape.
 */
export async function callLLM<T>(systemPrompt: string, payload: object): Promise<T | null> {
  try {
    const completion = await getClient().chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(payload, null, 2) },
      ],
    });

    const raw = completion.choices[0]?.message?.content || '';

    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned) as T; //TIP: ovo provjeriti da li je uopste validno
    } catch {
      console.error('[LLM] Unparseable response:', raw);
      return null;
    }

  } catch (err) {
    console.error('[LLM] API call failed:', err);
    return null;
  }
}

/**
 * Writes a single classification row to the database.
 * Used by both single-event and batch classifiers.
 */
export async function writeClassification(
  eventId: string,
  classification: {
    classification: string;
    confidence: number;
    severity: string;
    explanation: string;
  }
) {
  return db.classification.create({
    data: {
      eventId,
      createdAt: new Date(),
      detector: LLM_MODEL,
      category: classification.classification,
      confidence: classification.confidence,
      severity: classification.severity, //ovo je string
      explanation: classification.explanation,
    },
  });
}