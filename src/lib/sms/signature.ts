/**
 * Twilio Webhook Signature Verification
 *
 * Twilio uses HMAC-SHA1 (NOT SHA256 like Meta/WhatsApp).
 * Algorithm:
 * 1. Start with the full webhook URL
 * 2. Sort all POST params alphabetically by key
 * 3. Append each key+value (no separator) to the URL string
 * 4. HMAC-SHA1 with authToken, base64 encode
 * 5. Compare with X-Twilio-Signature header (timing-safe)
 */

import crypto from 'crypto';

/**
 * Verify the X-Twilio-Signature header against the raw POST params.
 */
export function verifyTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const sortedKeys = Object.keys(params).sort();
  const signedStr = sortedKeys.reduce((acc, key) => acc + key + (params[key] ?? ''), url);
  const expected = crypto.createHmac('sha1', authToken).update(signedStr, 'utf8').digest('base64');

  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));
}
