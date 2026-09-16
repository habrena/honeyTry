import { db } from '../database/db';
import OpenAI from 'openai';
import type { Prisma } from '../../prisma/generated/client';
import { isFakeLLM, runFakeLLM } from './llmFake';

// Model se cita iz .env da se ne mijenja kod pri promjeni modela.
// Flash je 3x jeftiniji od Pro varijante i za klasifikaciju je sasvim dovoljan.
export const LLM_MODEL = process.env.LLM_MODEL ?? 'deepseek-v4-flash';
 
// Koliko izlaznih tokena model smije potrositi.
// VAZNO: batch od 30 eventa trazi 30 JSON objekata + verdikt sesije.
// Ako se odgovor odsijece na pola, JSON.parse pada, callLLM vraca null,
// i cijeli poziv je placen a bacen. Bolje previse nego premalo.
const MAX_OUTPUT_TOKENS = Number(process.env.LLM_MAX_OUTPUT_TOKENS ?? 4000);


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
    if (!process.env.DEEPSEEK_API_KEY) {
      console.warn('[LLM] DEEPSEEK_API_KEY nije postavljen — pozivi ce padati');
    }
    _client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
      // Bez timeouta zaglavljen poziv trajno drzi jedno mjesto u analysisQueue
      // (MAX_CONCURRENT je 2, pa dva zaglavljena poziva zaustave cijelu analizu).
      timeout: 60 * 1000,
      maxRetries: 1,
    });
  }
  return _client;
}

/**
 * Izvlaci JSON iz odgovora modela.
 *
 * Prvo se pokusava direktan parse. Ako model ipak doda tekst oko JSON-a
 * (sto se desava i pored eksplicitne instrukcije), uzima se sadrzaj izmedju
 * prve otvorene i zadnje zatvorene viticaste zagrade.
 */
export function extractJson<T>(raw: string): T | null {
  const cleaned = raw.replace(/```json|```/g, '').trim();
 
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

function dumpLLM(kind: 'request' | 'response', systemPrompt: string, data: unknown) {
  if (process.env.LLM_DEBUG_DUMP !== '1') return;
  try {
    const dir = resolve(process.cwd(), 'llm-dumps');
    mkdirSync(dir, { recursive: true });
    const json = JSON.stringify(data, null, 2);
    const file = resolve(dir, `${Date.now()}-${kind}.json`);
    writeFileSync(file, JSON.stringify({
      at: new Date().toISOString(),
      kind,
      model: LLM_MODEL,
      chars: json.length,
      approxTokens: Math.round(json.length / 4),
      systemPrompt: kind === 'request' ? systemPrompt : undefined,
      data,
    }, null, 2));
    console.log(`[DUMP] ${kind} → ${file}  (~${Math.round(json.length / 4)} tokena)`);
  } catch (e) {
    console.error('[DUMP] neuspjelo:', e);
  }
}

/**
 * Salje prompt + payload modelu i vraca parsirani JSON.
 * Ovo je sirovi poziv — bez citanja i pisanja u bazu.
 *
 * Vraca null ako poziv padne ili odgovor nije validan JSON.
 *
 * VEOMA BITNO:
 * Genericki tip T dozvoljava svakom pozivaocu da definise vlastiti oblik odgovora.
 *
 * SIGURNOSNA NAPOMENA (za rad):
 * Sadrzaj payloada pise NAPADAC. Zato ide iskljucivo u 'user' poruku, nikad
 * u 'system'. Instrukcije i podaci ostaju razdvojeni, sto smanjuje rizik od
 * prompt injectiona. Izlaz se dodatno validira kod pozivaoca (provjera
 * eventIndex opsega u classifySessionBatch), pa ni "uspjesna" injekcija ne
 * moze upisati proizvoljne podatke u bazu.
 */

export async function callLLM<T>(systemPrompt: string, payload: object): Promise<T | null> {
  try {

    //samo za debugiranje
    dumpLLM('request', systemPrompt, payload);

    // Test dvojnik. Grana je aktivna samo kad je LLM_FAKE postavljen,
    // sto se desava iskljucivo u integracionim testovima.
    if (isFakeLLM()) {
      const fake = runFakeLLM(systemPrompt, payload);
      if (!fake) {
        console.log('[LLM] FAKE — dvojnik nije postavio odgovor');
        return null;
      }
      return fake as T;
    }

    if (process.env.LLM_DRY_RUN === '1') {
      console.log('[LLM] DRY RUN — poziv preskocen');
      return null;
    }


    const completion = await getClient().chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(payload, null, 2) },
      ],
      // Model garantuje sintaksno ispravan JSON. Uslov je da rijec "json"
      // postoji u promptu — kod nas postoji u oba prompta.
      response_format: { type: 'json_object' },
      // Klasifikacija treba biti deterministicna. Za rad je ovo bitno:
      // isti ulaz mora dati isti izlaz da bi rezultati bili ponovljivi.
      temperature: 0,
      max_tokens: MAX_OUTPUT_TOKENS,
    });
 
    const choice = completion.choices[0];
    const raw = choice?.message?.content || '';
 
    // Ako je odgovor odsjecen zbog limita, JSON je nepotpun — nema smisla parsirati.
    if (choice?.finish_reason === 'length') {
      console.error(`[LLM] Odgovor odsjecen na ${MAX_OUTPUT_TOKENS} tokena — smanji batch ili povecaj limit`);
      return null;
    }
 
    const parsed = extractJson<T>(raw);
    if (!parsed) {
      console.error('[LLM] Odgovor se ne moze parsirati:', raw.slice(0, 300));
      return null;
    }
 
    if (completion.usage) {
      console.log(`[LLM] Tokeni — ulaz: ${completion.usage.prompt_tokens}, izlaz: ${completion.usage.completion_tokens}`);
    }
 
    dumpLLM('response', '', { parsed, usage: completion.usage });
    return parsed;
 
  } catch (err) {
    console.error('[LLM] Poziv API-ja neuspjesan:', err);
    return null;
  }
}





type DbClient = typeof db | Prisma.TransactionClient;
/**
 * Upisuje jedan red klasifikacije u bazu.
 * Koristi je i single i batch klasifikator.
 *
 * IZMJENA U ODNOSU NA RANIJE: create -> upsert.
 * Classification.eventId je @unique. Ako je event vec klasifikovan single
 * putem, pa ga batch pokupi ponovo, create baca P2002 i rusi cijelu
 * transakciju — nijedan event iz batcha se onda ne upise.
 *
 * Funkcija sada i oznacava event kao obradjen. Bez toga event ostaje
 * analyzedAt: null i vraca se u sljedeci batch iako je vec placen.
 */
 
export async function writeClassification(
  eventId: string,
  classification: {
    classification: string;
    confidence: number;
    severity: string;
    explanation: string;
  },
  client: DbClient = db,
) {
  const data = {
    detector: LLM_MODEL,
    //createdAt: nije potrebno jer Prisma to radi pri kreaciji zapisa
    category: classification.classification,
    confidence: classification.confidence,
    severity: classification.severity,
    explanation: classification.explanation,
  };
 
  await client.classification.upsert({
    where: { eventId },
    update: data,
    create: { eventId, ...data },
  });
 
  await client.event.update({
    where: { id: eventId },
    data: { analyzedAt: new Date(), analyzeCount: { increment: 1 } },
  });
}