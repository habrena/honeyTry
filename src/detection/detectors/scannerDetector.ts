import type { DetectionResult } from '../DetectionResult';
import { safeDecode } from './extractValues';

// Known scanner/tool user agent signatures
const SCANNER_USER_AGENTS: { pattern: RegExp; tool: string }[] = [
  { pattern: /sqlmap/i,              tool: 'sqlmap' },
  { pattern: /nikto/i,              tool: 'Nikto' },
  { pattern: /nmap/i,               tool: 'Nmap' },
  { pattern: /masscan/i,            tool: 'Masscan' },
  { pattern: /burp/i,               tool: 'Burp Suite' },
  { pattern: /owasp/i,              tool: 'OWASP ZAP' },
  { pattern: /zap/i,                tool: 'OWASP ZAP' },
  { pattern: /dirbuster/i,          tool: 'DirBuster' },
  { pattern: /gobuster/i,           tool: 'Gobuster' },
  { pattern: /ffuf/i,               tool: 'ffuf' },
  { pattern: /wfuzz/i,              tool: 'Wfuzz' },
  { pattern: /feroxbuster/i,        tool: 'Feroxbuster' },
  { pattern: /nuclei/i,             tool: 'Nuclei' },
  { pattern: /whatweb/i,            tool: 'WhatWeb' },
  { pattern: /w3af/i,               tool: 'w3af' },
  { pattern: /acunetix/i,           tool: 'Acunetix' },
  { pattern: /nessus/i,             tool: 'Nessus' },
  { pattern: /openvas/i,            tool: 'OpenVAS' },
  { pattern: /arachni/i,            tool: 'Arachni' },
  { pattern: /skipfish/i,           tool: 'Skipfish' },
  { pattern: /htttrack/i,           tool: 'HTTrack' },
  { pattern: /wget/i,              tool: 'Wget' },
  { pattern: /python-requests/i,   tool: 'Python Requests' },
  { pattern: /python-urllib/i,      tool: 'Python urllib' },
  { pattern: /go-http-client/i,     tool: 'Go HTTP Client' },
  { pattern: /libwww-perl/i,        tool: 'Perl LWP' },
  { pattern: /curl\//i,             tool: 'cURL' },
  { pattern: /httpie/i,             tool: 'HTTPie' },
];

// Paths that scanners probe but real users never visit
const SCANNER_PROBE_PATHS: { pattern: RegExp; signal: string }[] = [
  { pattern: /\/robots\.txt$/i,                    signal: 'robots.txt probe' },
  { pattern: /\/sitemap\.xml$/i,                   signal: 'sitemap.xml probe' },
  { pattern: /\/\.env/i,                           signal: '.env file probe' },
  { pattern: /\/\.git\//i,                         signal: '.git directory probe' },
  { pattern: /\/\.git\/config/i,                   signal: '.git/config probe' },
  { pattern: /\/\.git\/HEAD/i,                     signal: '.git/HEAD probe' },
  { pattern: /\/\.svn\//i,                         signal: '.svn directory probe' },
  { pattern: /\/\.DS_Store/i,                      signal: '.DS_Store probe' },
  { pattern: /\/wp-admin/i,                        signal: 'WordPress admin probe' },
  { pattern: /\/wp-login/i,                        signal: 'WordPress login probe' },
  { pattern: /\/wp-content/i,                      signal: 'WordPress content probe' },
  { pattern: /\/wp-includes/i,                     signal: 'WordPress includes probe' },
  { pattern: /\/administrator/i,                   signal: 'Joomla admin probe' },
  { pattern: /\/phpmyadmin/i,                      signal: 'phpMyAdmin probe' },
  { pattern: /\/phpinfo/i,                         signal: 'phpinfo probe' },
  { pattern: /\/server-status/i,                   signal: 'Apache server-status probe' },
  { pattern: /\/server-info/i,                     signal: 'Apache server-info probe' },
  { pattern: /\/actuator/i,                        signal: 'Spring Boot actuator probe' },
  { pattern: /\/debug/i,                           signal: 'Debug endpoint probe' },
  { pattern: /\/console/i,                         signal: 'Console endpoint probe' },
  { pattern: /\/swagger/i,                         signal: 'Swagger UI probe' },
  { pattern: /\/api-docs/i,                        signal: 'API docs probe' },
  { pattern: /\/graphql/i,                         signal: 'GraphQL endpoint probe' },
  { pattern: /\/elmah\.axd/i,                      signal: 'ELMAH error log probe' },
  { pattern: /\/trace\.axd/i,                      signal: 'ASP.NET trace probe' },
  { pattern: /\/backup/i,                          signal: 'Backup directory probe' },
  { pattern: /\/dump/i,                            signal: 'Database dump probe' },
  { pattern: /\/config\.(php|yml|json|xml)/i,      signal: 'Config file probe' },
];

export function detectScanner(
  endpoint: string,
  userAgent: string | null,
  headers: Record<string, any> | null
): DetectionResult | null {

  const matchedSignals: string[] = [];
  let totalWeight = 0;

  // Check user agent against known scanner signatures
  if (userAgent) {
    for (const scanner of SCANNER_USER_AGENTS) {
      if (scanner.pattern.test(userAgent)) {
        matchedSignals.push(`Known scanner user agent: ${scanner.tool}`);
        totalWeight += 0.7;  // high weight — this is a strong signal
        break;  // one match is enough
      }
    }
  }

  // Check if the endpoint is a known scanner probe target
  const decodedEndpoint = safeDecode(endpoint);
  for (const probe of SCANNER_PROBE_PATHS) {
    if (probe.pattern.test(decodedEndpoint)) {
      matchedSignals.push(probe.signal);
      totalWeight += 0.35;
    }
  }

  // Check for missing browser headers — real browsers always send these
  if (headers) {
    if (!headers['accept-language']) {
      matchedSignals.push('Missing Accept-Language header');
      totalWeight += 0.15;
    }
    if (!headers['accept-encoding']) {
      matchedSignals.push('Missing Accept-Encoding header');
      totalWeight += 0.1;
    }
    if (!headers['accept'] || headers['accept'] === '*/*') {
      matchedSignals.push('Generic or missing Accept header');
      totalWeight += 0.1;
    }
    // Empty or missing user agent
    if (!userAgent || userAgent === 'unknown') {
      matchedSignals.push('Missing User-Agent header');
      totalWeight += 0.3;
    }
  }

  if (matchedSignals.length === 0) return null;

  const confidence = Math.min(totalWeight, 0.95);

  return {
    type: 'AUTOMATED_SCAN',
    confidence: parseFloat(confidence.toFixed(2)),
    signals: matchedSignals,
  };
}
