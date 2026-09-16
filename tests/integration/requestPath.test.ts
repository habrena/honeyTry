import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from './../../src/app';
import { db } from '../../src/database/db';
import {
  resetDb,
  closeDb,
  waitForEventCount,
  settle,
  ensureDist,
  cleanupDist,
  FIXTURE_ASSET_PATH,
} from './db';

/**
 * ============================================================================
 *  GRUPA A — putanja zahtjeva
 * ============================================================================
 *  Sve je stvarno osim modela: Express, oba middlewarea, detektori i baza.
 *  Ispituje se sta se zaista upise kad zahtjev prodje kroz cijeli lanac.
 *
 *  Ovo je nivo na kojem se vide greske koje jedinicni testovi po definiciji
 *  ne mogu vidjeti. Sezdeset pet jedinicnih testova nad eventLoggerom i
 *  sessionLoggerom prolazi, a nijedan ne moze otkriti da middleware u
 *  odredjenim slucajevima uopste ne biva pozvan. Greska nije u funkciji nego
 *  u njenom polozaju u lancu, a polozaj se vidi tek kad se lanac sastavi.
 *
 *  Analiza je neutralizovana kroz setup (sesijski budzet nula), pa brojanje
 *  zapisa mjeri iskljucivo putanju zahtjeva.
 * ============================================================================
 */

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

beforeAll(() => {
  ensureDist();
});

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  cleanupDist();
  await closeDb();
});

describe('Grupa A — osnovni upis sesije i eventa', () => {
  it('jedan zahtjev proizvodi tacno jednu sesiju i jedan event', async () => {
    await request(app).get('/api/health').set('user-agent', UA).expect(200);
    await waitForEventCount(1);

    expect(await db.session.count()).toBe(1);
    expect(await db.event.count()).toBe(1);
  });

  it('upisuje polja zahtjeva i odgovora u isti zapis', async () => {
    // Podaci zahtjeva se citaju rano, podaci odgovora tek na zavrsetku.
    // Jedinicni test to dokazuje nad laznim objektima; ovdje se vidi da
    // spoj zaista zavrsi u jednom redu baze.
    await request(app).get('/api/health').set('user-agent', UA).expect(200);
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();

    expect(event.method).toBe('GET');
    expect(event.endpoint).toBe('/api/health');
    expect(event.statusCode).toBe(200);
    expect(event.eventType).toBe('REQUEST_RECEIVED');
    expect(event.durationMs).toBeGreaterThanOrEqual(0);
    expect(event.analyzedAt).toBeNull();
  });

  it('vezuje event za sesiju stranim kljucem', async () => {
    await request(app).get('/api/health').set('user-agent', UA);
    await waitForEventCount(1);

    const session = await db.session.findFirstOrThrow();
    const event = await db.event.findFirstOrThrow();

    expect(event.sessionId).toBe(session.id);
  });

  it('biljezi query parametre', async () => {
    await request(app)
      .get('/api/patient/search?q=mico&limit=5')
      .set('user-agent', UA)
      .expect(200);
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();

    expect(event.queryParams).toMatchObject({ q: 'mico', limit: '5' });
  });

  it('biljezi tijelo POST zahtjeva', async () => {
    await request(app)
      .post('/api/appointments')
      .set('user-agent', UA)
      .send({ doctorId: 42, notes: 'test' });
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();

    expect(event.body).toMatchObject({ doctorId: 42, notes: 'test' });
  });

  it('biljezi zahtjev koji nije pogodio nijednu rutu', async () => {
    // POST ne hvata catch-all, koji je registrovan samo za GET, pa Express
    // vraca vlastiti 404. Zahtjev svejedno mora biti zabiljezen.
    await request(app).post('/api/nepostojece').set('user-agent', UA).send({}).expect(404);
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();

    expect(event.statusCode).toBe(404);
    expect(event.endpoint).toBe('/api/nepostojece');
  });
});

describe('Grupa A — identifikacija sesije kroz vise zahtjeva', () => {
  it('postavlja kolacic na prvi zahtjev', async () => {
    const res = await request(app).get('/api/health').set('user-agent', UA);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(String(cookies)).toContain('mngmt_id=');
    expect(String(cookies)).toContain('HttpOnly');
  });

  it('spaja uzastopne zahtjeve istog posjetioca u jednu sesiju', async () => {
    const agent = request.agent(app);        // cuva kolacic izmedju zahtjeva

    await agent.get('/api/health').set('user-agent', UA);
    await agent.get('/api/patient/search?q=a').set('user-agent', UA);
    await agent.get('/api/health').set('user-agent', UA);
    await waitForEventCount(3);

    expect(await db.session.count()).toBe(1);
    expect(await db.event.count()).toBe(3);
  });

  it('spaja zahtjeve bez kolacica preko otiska izvora', async () => {
    // Skener ne cuva kolacice. Bez otiska bi svaki njegov zahtjev bio
    // zasebna sesija, sto bi obesmislilo grupnu analizu.
    await request(app).get('/api/health').set('user-agent', 'curl/8.4.0');
    await request(app).get('/api/health').set('user-agent', 'curl/8.4.0');
    await waitForEventCount(2);

    expect(await db.session.count()).toBe(1);
  });

  it('razdvaja posjetioce koji se razlikuju po user agentu', async () => {
    await request(app).get('/api/health').set('user-agent', 'curl/8.4.0');
    await request(app).get('/api/health').set('user-agent', 'curl/8.5.0');
    await waitForEventCount(2);

    expect(await db.session.count()).toBe(2);
  });

  it('koristi prvu adresu iz x-forwarded-for kao izvor', async () => {
    await request(app)
      .get('/api/health')
      .set('user-agent', UA)
      .set('x-forwarded-for', '203.0.113.9, 10.0.0.1');
    await waitForEventCount(1);

    const session = await db.session.findFirstOrThrow();

    expect(session.sourceIp).toBe('203.0.113.9');
  });

  it('biljezi honey token iz query parametra', async () => {
    await request(app).get('/api/health?ref=HT-CARDIO-07').set('user-agent', UA);
    await waitForEventCount(1);

    const session = await db.session.findFirstOrThrow();

    expect(session.tokenId).toBe('HT-CARDIO-07');
  });
});

describe('Grupa A — detektori u stvarnom lancu', () => {
  it('prepoznaje SQL injekciju u query parametru', async () => {
    await request(app)
      .get("/api/patient/search?q=1' UNION SELECT null,username,password FROM users--")
      .set('user-agent', UA);
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();
    const detections = event.metadata as any[];

    expect(detections.some((d) => d.type === 'SQL_INJECTION')).toBe(true);
    expect(event.detectionCount).toBeGreaterThan(0);
    expect(event.signalCount).toBeGreaterThan(0);
  });

  it('prepoznaje alat za skeniranje i ne racuna ga kao signal', async () => {
    // signalCount je polje po kojem batch bira evente za model. Prepoznat
    // alat sam po sebi ne opravdava trosak poziva.
    await request(app).get('/api/health').set('user-agent', 'sqlmap/1.7.2#stable');
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();
    const detections = event.metadata as any[];

    expect(detections.some((d) => d.type === 'AUTOMATED_SCAN')).toBe(true);
    expect(event.signalCount).toBe(0);
  });

  it('ostavlja cist zahtjev bez detekcija', async () => {
  // Zaglavlja moraju odgovarati pravom pregledniku. scannerDetector
  // dodjeljuje tezinu za svako nedostajuce, pa zahtjev bez njih biva
  // oznacen kao automatizovan iako nijedan napadacki obrazac ne postoji.
  await request(app)
    .get('/api/patient/search?q=mico')
    .set('user-agent', UA)
    .set('accept', 'application/json, text/plain, */*')
    .set('accept-language', 'bs-BA,bs;q=0.9,en;q=0.8')
    .set('accept-encoding', 'gzip, deflate, br')
    .set('referer', 'https://example.com/book');
  await waitForEventCount(1);

  const event = await db.event.findFirstOrThrow();

  expect(event.detectionCount).toBe(0);
  expect(event.signalCount).toBe(0);
});

  it('BUG: procentno kodiran NUL bajt u putanji ne prolazi kroz stripNul', async () => {
  // originalUrl je sirov, procentno kodiran. stripNul trazi stvarni bajt
  // U+0000, pa niz %00 prolazi netaknut. Zastita nad putanjom je time
  // neefikasna; stvarni bajtovi mogu stici samo kroz tijelo i zaglavlja.
  await request(app).get('/admin%00.php').set('user-agent', UA);
  await waitForEventCount(1);

  const event = await db.event.findFirstOrThrow();

  expect(event.endpoint).toBe('/admin%00.php');
  expect(event.endpoint).not.toContain('\u0000');
});

  it('redaktuje vrijednosti kolacica u zabiljezenim zaglavljima', async () => {
    await request(app)
      .get('/api/health')
      .set('user-agent', UA)
      .set('cookie', 'mngmt_id=tajna-vrijednost; theme=dark');
    await waitForEventCount(1);

    const event = await db.event.findFirstOrThrow();
    const headers = event.headers as Record<string, string>;

    expect(headers.cookie).not.toContain('tajna-vrijednost');
    expect(headers.cookie).toContain('mngmt_id=***');
  });
});

describe('Grupa A — nalazi o redoslijedu middlewarea', () => {
  /**
   * Testovi ispod fiksiraju ZATECENO ponasanje, ne zeljeno. Sva tri su
   * posljedica pozicije logera u lancu, pa ih nijedan jedinicni test ne
   * moze otkriti. Nakon ispravke redoslijeda ocekivanja se obrcu i to je
   * mjerenje prije i poslije.
   */

  it('NALAZ: staticki sadrzaj se ne biljezi', async () => {
    // express.static salje fajl i ne poziva next(), pa loger nikad ne
    // sazna za zahtjev. Posljedica je i da dolazak na naslovnu stranicu
    // ostaje nezabiljezen, jer se ona takodjer poslužuje staticki.
    await request(app).get(FIXTURE_ASSET_PATH).set('user-agent', UA).expect(200);
    await settle();

    expect(await db.event.count()).toBe(0);
    expect(await db.session.count()).toBe(0);
  });

  it('NALAZ: zahtjev sa neispravnim JSON tijelom se ne biljezi', async () => {
    // express.json baca gresku prije nego sto loger stigne registrovati
    // slusaoca. Posjetilac dobija 400, a trag ne postoji — iako je
    // namjerno neispravno tijelo klasicna tehnika ispitivanja.
    await request(app)
      .post('/api/appointments')
      .set('user-agent', UA)
      .set('content-type', 'application/json')
      .send('{ ovo nije validan json')
      .expect(400);
    await settle();

    expect(await db.event.count()).toBe(0);
  });
});