/**
 * Instagram Rate Limiter
 * In-memory sliding window rate limiter keyed on chatbotId:igUserId.
 * Limits: 10 messages per 60-second window per user.
 */

const MAX_MESSAGES = 10;
const WINDOW_MS = 60_000; // 1 minute

/** Map of "chatbotId:igUserId" -> sorted array of timestamps */
const windows = new Map<string, number[]>();

/** Map of "mid" -> true for dedup */
const seenMids = new Map<string, number>();
const MID_TTL_MS = 60_000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkInstagramRateLimit(
  chatbotId: string,
  igUserId: string
): RateLimitResult {
  const key = `${chatbotId}:${igUserId}`;
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let timestamps = windows.get(key);
  if (timestamps) {
    timestamps = timestamps.filter((t) => t > cutoff);
  } else {
    timestamps = [];
  }

  if (timestamps.length >= MAX_MESSAGES) {
    const retryAfterMs = timestamps[0] - cutoff;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    windows.set(key, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  windows.set(key, timestamps);
  return { allowed: true };
}

export function isInstagramMessageDuplicate(mid: string): boolean {
  const now = Date.now();
  for (const [key, ts] of seenMids.entries()) {
    if (now - ts > MID_TTL_MS) seenMids.delete(key);
  }
  if (seenMids.has(mid)) return true;
  seenMids.set(mid, now);
  return false;
}
