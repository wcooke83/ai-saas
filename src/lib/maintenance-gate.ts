/**
 * Maintenance gate utility.
 *
 * Reads environment variables to determine whether the app should redirect
 * visitors to the /maintenance or /coming-soon page.
 *
 * Env vars:
 *   MAINTENANCE_MODE=true   → redirect all non-exempt requests to /maintenance
 *   COMING_SOON_MODE=true   → redirect all non-exempt requests to /coming-soon
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

export type GateResult =
  | { active: false }
  | { active: true; destination: '/maintenance' | '/coming-soon' };

/**
 * Determine whether a request should be redirected to a gate page.
 */
export function checkGate(pathname: string): GateResult {
  // Never gate exempt paths
  if (EXEMPT_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return { active: false };
  }

  if (process.env.MAINTENANCE_MODE === 'true') {
    return { active: true, destination: '/maintenance' };
  }

  if (process.env.COMING_SOON_MODE === 'true') {
    return { active: true, destination: '/coming-soon' };
  }

  return { active: false };
}
