/**
 * Email Rate Limiter
 * Sliding window rate limiter keyed on chatbotId:senderEmail.
 * Limits: 20 emails per 10-minute window.
 * Also blocks known disposable email domains.
 */

const MAX_MESSAGES = 20;
const WINDOW_MS = 10 * 60_000; // 10 minutes

/** Map of "chatbotId:senderEmail" -> sorted array of timestamps */
const windows = new Map<string, number[]>();

const BLOCKED_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'throwam.com',
  'sharklasers.com',
  'yopmail.com',
]);

export interface EmailRateLimitResult {
  allowed: boolean;
  reason?: 'rate_limit' | 'blocked_domain';
  retryAfterSeconds?: number;
}

function getDomain(email: string): string {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1).toLowerCase() : '';
}

export function checkEmailRateLimit(
  chatbotId: string,
  senderEmail: string
): EmailRateLimitResult {
  const domain = getDomain(senderEmail);
  if (BLOCKED_DOMAINS.has(domain)) {
    return { allowed: false, reason: 'blocked_domain' };
  }

  const key = `${chatbotId}:${senderEmail.toLowerCase()}`;
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
    return { allowed: false, reason: 'rate_limit', retryAfterSeconds };
  }

  timestamps.push(now);
  windows.set(key, timestamps);
  return { allowed: true };
}
