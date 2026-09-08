import type { DetectionResult } from '../DetectionResult';

const TRAVERSAL_PATTERNS: { regex: RegExp; signal: string; weight: number }[] = [
  // Basic traversal sequences
  { regex: /\.\.\//,                              signal: '../ path traversal',                  weight: 0.4 },
  { regex: /\.\.\\/,                              signal: '..\ path traversal (Windows)',        weight: 0.4 },
  { regex: /\.\.%2[fF]/,                          signal: 'URL-encoded ../ (%2f)',               weight: 0.45 },
  { regex: /%2[eE]%2[eE]%2[fF]/,                 signal: 'Double URL-encoded ../ (%2e%2e%2f)',  weight: 0.5 },
  { regex: /\.\.%5[cC]/,                          signal: 'URL-encoded ..\\ (%5c)',              weight: 0.45 },
  { regex: /%252e%252e%252f/i,                    signal: 'Double-encoded traversal',            weight: 0.5 },

  // Null byte injection — used to bypass extension checks
  { regex: /%00/,                                 signal: 'Null byte injection (%00)',           weight: 0.45 },

  // Linux system files
  { regex: /\/etc\/passwd/i,                      signal: '/etc/passwd access attempt',          weight: 0.5 },
  { regex: /\/etc\/shadow/i,                      signal: '/etc/shadow access attempt',          weight: 0.5 },
  { regex: /\/etc\/hosts/i,                       signal: '/etc/hosts access attempt',           weight: 0.4 },
  { regex: /\/proc\/self/i,                       signal: '/proc/self access attempt',           weight: 0.45 },
  { regex: /\/proc\/\d+\/cmdline/i,               signal: '/proc/*/cmdline access attempt',     weight: 0.5 },
  { regex: /\/var\/log/i,                         signal: '/var/log access attempt',             weight: 0.35 },

  // Windows system files
  { regex: /win\.ini/i,                           signal: 'win.ini access attempt',              weight: 0.45 },
  { regex: /boot\.ini/i,                          signal: 'boot.ini access attempt',             weight: 0.45 },
  { regex: /system32/i,                           signal: 'system32 directory access',           weight: 0.4 },
  { regex: /\\windows\\/i,                        signal: 'Windows directory traversal',         weight: 0.4 },

  // Web server config files
  { regex: /web\.config/i,                        signal: 'web.config access attempt',           weight: 0.4 },
  { regex: /\.htaccess/i,                         signal: '.htaccess access attempt',            weight: 0.35 },
  { regex: /httpd\.conf/i,                        signal: 'httpd.conf access attempt',           weight: 0.4 },
  { regex: /nginx\.conf/i,                        signal: 'nginx.conf access attempt',           weight: 0.4 },

  // Application secrets
  { regex: /\.env/,                               signal: '.env file access attempt',            weight: 0.45 },
  { regex: /\.git\//,                             signal: '.git directory access attempt',       weight: 0.45 },
  { regex: /\.ssh\//,                             signal: '.ssh directory access attempt',       weight: 0.5 },
  { regex: /id_rsa/i,                             signal: 'SSH private key access attempt',     weight: 0.5 },
];

export function detectTraversal(textValues: string[]): DetectionResult | null {

  if (textValues.length === 0) return null;

  const matchedSignals: string[] = [];
  let totalWeight = 0;

  for (const text of textValues) {
    for (const pattern of TRAVERSAL_PATTERNS) {
      if (pattern.regex.test(text) && !matchedSignals.includes(pattern.signal)) {
        matchedSignals.push(pattern.signal);
        totalWeight += pattern.weight;
      }
    }
  }

  if (matchedSignals.length === 0) return null;

  const confidence = Math.min(totalWeight, 0.95);

  return {
    type: 'DIRECTORY_TRAVERSAL',
    confidence: parseFloat(confidence.toFixed(2)),
    signals: matchedSignals,
  };
}
