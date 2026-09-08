import { runDetectors } from './runDetectors';

const cases = {
  benign: {
    endpoint: '/api/appointments?doctorId=42&date=2026-09-10',
    method: 'GET',
    queryParams: { doctorId: '42', date: '2026-09-10' },
    body: null,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    headers: { accept: 'application/json', referer: 'https://example.com/book' },
  },
  sqli: {
    endpoint: "/api/appointments?id=1' UNION SELECT null,username,password FROM users--",
    method: 'GET',
    queryParams: { id: "1' UNION SELECT null,username,password FROM users--" },
    body: null,
    userAgent: 'sqlmap/1.7.2#stable',
    headers: {},
  },
  bigBody: {
    endpoint: '/api/appointments',
    method: 'POST',
    queryParams: null,
    body: { notes: 'A'.repeat(4000), name: "<script>alert(1)</script>" },
    userAgent: 'curl/8.4.0',
    headers: { 'content-type': 'application/json' },
  },
};

const N = 10_000;

for (const [name, sample] of Object.entries(cases)) {
  for (let i = 0; i < 1000; i++) runDetectors(sample as any);  // warm up JIT

  const t0 = process.hrtime.bigint();
  for (let i = 0; i < N; i++) runDetectors(sample as any);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;

  console.log(
    `${name.padEnd(10)} ${ms.toFixed(1)}ms / ${N}  ` +
    `→ ${(ms / N * 1000).toFixed(1)}µs each  ` +
    `→ ~${Math.round(N / (ms / 1000)).toLocaleString()} req/s per core`
  );
}