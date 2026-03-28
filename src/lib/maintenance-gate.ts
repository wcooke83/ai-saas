/**
 * Maintenance gate utility.
 *
 * Reads environment variables to determine whether the app should redirect
 * visitors to the /maintenance or /coming-soon page.
 *
 * Env vars:
 *   MAINTENANCE_MODE=true   → redirect all non-exempt requests to /maintenance
 *   COMING_SOON_MODE=true   → redirect all non-exempt requests to /coming-soon
 *   BYPASS_IPS=1.2.3.4,5.6.7.8  → comma-separated IPs that skip the gate
 *
 * Bypass methods (checked in order):
 *   1. IP is in BYPASS_IPS
 *   2. Request has `gate_bypass` cookie (set via ?i=true, lasts 24h)
 *   3. Request has ?i=true query param (sets the cookie for future requests)
 *
 * Maintenance takes priority over coming-soon if both are set.
 */

/** Paths that are never redirected by the gate. */
const EXEMPT_PATHS = [
  '/maintenance',
  '/coming-soon',
  '/api/',
  '/auth/',
  '/_next/',
  '/favicon.ico',
];

export const BYPASS_COOKIE_NAME = 'gate_bypass';
export const BYPASS_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export type GateResult =
  | { active: false; setCookie?: boolean }
  | { active: true; destination: '/maintenance' | '/coming-soon' };

/**
 * Determine whether a request should be redirected to a gate page.
 */
export function checkGate(
  pathname: string,
  options?: {
    ip?: string | null;
    hasBypassCookie?: boolean;
    hasBypassParam?: boolean;
  },
): GateResult {
  // Never gate exempt paths
  if (EXEMPT_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return { active: false };
  }

  const isGated =
    process.env.MAINTENANCE_MODE === 'true' ||
    process.env.COMING_SOON_MODE === 'true';

  if (!isGated) {
    return { active: false };
  }

  // Check bypass: IP list
  if (options?.ip) {
    const bypassIps = (process.env.BYPASS_IPS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (bypassIps.includes(options.ip)) {
      return { active: false };
    }
  }

  // Check bypass: cookie or query param
  if (options?.hasBypassCookie) {
    return { active: false };
  }

  if (options?.hasBypassParam) {
    return { active: false, setCookie: true };
  }

  const destination = process.env.MAINTENANCE_MODE === 'true' ? '/maintenance' : '/coming-soon';
  return { active: true, destination };
}
