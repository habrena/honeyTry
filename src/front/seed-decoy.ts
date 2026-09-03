/**
 * seed-decoy.ts
 * -------------------------------------------------------------------------
 * Populates the decoy tables in Neon with fake-but-plausible medical data.
 * Run once:   npx tsx seed-decoy.ts
 *
 * Design notes:
 *  - Names are invented but regionally plausible (Bosnian), so the table
 *    doesn't read as a generic English-name honeypot.
 *  - Appointment counts are internally consistent:
 *        ukupno = brojZakazanih + brojSlobodnih
 *    because the frontend computes a % from them; inconsistent rows are a
 *    tell that this is fake.
 *  - Role counts have believable magnitudes (many patients, few owners).
 *  - Everything is invented. No real person or record is represented here.
 */

import './load-env';
import { db } from '../database/db';

//za pokretanje koristiti ovo
//npx tsx src/front/seed-decoy.ts

// Invented Bosnian names — NOT real staff.
const IMENA = ['Amina', 'Emir', 'Lejla', 'Tarik', 'Amra', 'Kenan', 'Selma', 'Haris', 'Ajla', 'Vedad', 'Emin', 'Hana', 'Džejla'];
const PREZIMENA = ['Hodžić', 'Begić', 'Delić', 'Bajramovic', 'Softić', 'Mujić', 'Hadžić', 'Osmanović', 'Zukić', 'Alispahić'];
const ODJELI = ['Kardiologija', 'Pedijatrija', 'Neurologija', 'Ortopedija', 'Dermatologija', 'Interna medicina'];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

async function main() {
  // Clear any previous decoy data so re-running is idempotent.
  await db.doktor.deleteMany();
  await db.uloga.deleteMany();

  //doktori
  const doktori = Array.from({ length: 8 }, (_, i) => {
    const ukupno = 20 + ((i * 7) % 25);              // 20..44, deterministic
    const brojZakazanih = Math.floor(ukupno * (0.4 + (i % 5) * 0.1)); // 40-80% booked
    const brojSlobodnih = ukupno - brojZakazanih;     // guaranteed consistent
    return {
      ime: pick(IMENA, i),
      prezime: pick(PREZIMENA, i),
      odjel: pick(ODJELI, i),
      ukupno,
      brojZakazanih,
      brojSlobodnih,
    };
  });
  await db.doktor.createMany({ data: doktori });

  //uloge
  await db.uloga.createMany({
    data: [
      { uloga: 'PACIJENT', broj: 1284 },
      { uloga: 'DOKTOR', broj: 23 },
      { uloga: 'MEDICINSKO_OSOBLJE', broj: 41 },
      { uloga: 'ADMINISTRATOR', broj: 4 },
      { uloga: 'VLASNIK', broj: 2 },
    ],
  });

  const total = doktori.reduce((s, d) => s + d.brojSlobodnih, 0);
  console.log(`Seeded ${doktori.length} doctors, ${total} free slots total, 5 role rows.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());

