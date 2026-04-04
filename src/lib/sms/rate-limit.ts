/**
 * SMS Rate Limiter
 * In-memory sliding window rate limiter keyed on chatbotId:phoneNumber.
 * Limits: 10 messages per 60-second window per user.
 * Also provides message deduplication using Twilio's MessageSid with 5-min TTL.
 */

const MAX_MESSAGES = 10;
const WINDOW_MS = 60_000; // 1 minute

/** Map of "chatbotId:phone" -> sorted array of timestamps */
const windows = new Map<string, number[]>();

// ---------------------------------------------------------------------------
// Message deduplication
// Twilio may deliver the same webhook event multiple times on retry.
// We track recently-seen MessageSid values with a 5-minute TTL.
// ---------------------------------------------------------------------------

const DEDUP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const seenMessages = new Map<string, number>(); // MessageSid -> timestamp first seen

/**
 * Returns true if this MessageSid has already been processed (duplicate).
 * Registers the MessageSid on first call.
 */
export function isSmsMessageDuplicate(messageSid: string): boolean {
  const now = Date.now();
  const seenAt = seenMessages.get(messageSid);

  if (seenAt !== undefined && now - seenAt < DEDUP_TTL_MS) {
    return true;
  }

  seenMessages.set(messageSid, now);

  // Prune expired entries every 200 calls to avoid unbounded growth
  if (seenMessages.size % 200 === 0) {
    const cutoff = now - DEDUP_TTL_MS;
    for (const [id, ts] of seenMessages) {
      if (ts < cutoff) seenMessages.delete(id);
    }
  }

  return false;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * Check whether an SMS user is within the rate limit.
 */
export function checkSmsRateLimit(
  chatbotId: string,
  phone: string
): RateLimitResult {
  const key = `${chatbotId}:${phone}`;
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
    // Earliest timestamp still in window — retry after it expires
    const retryAfterMs = timestamps[0] - cutoff;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    windows.set(key, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  windows.set(key, timestamps);
  return { allowed: true };
}
