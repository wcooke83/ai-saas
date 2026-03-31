/**
 * Teams Rate Limiter
 * In-memory sliding window rate limiter keyed on chatbotId:teamsUserId.
 * Limits: 10 messages per 60-second window per user.
 */

const MAX_MESSAGES = 10;
const WINDOW_MS = 60_000; // 1 minute

/** Map of "chatbotId:userId" -> sorted array of timestamps */
const windows = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * Check whether a Teams user is within the rate limit.
 */
export function checkTeamsRateLimit(
  chatbotId: string,
  userId: string
): RateLimitResult {
  const key = `${chatbotId}:${userId}`;
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  // Get existing timestamps and prune expired ones
  let timestamps = windows.get(key);
  if (timestamps) {
    timestamps = timestamps.filter((t) => t > cutoff);
  } else {
    timestamps = [];
  }

  if (timestamps.length >= MAX_MESSAGES) {
    // Earliest timestamp still in window -- retry after it expires
    const retryAfterMs = timestamps[0] - cutoff;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    windows.set(key, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  windows.set(key, timestamps);
  return { allowed: true };
}
