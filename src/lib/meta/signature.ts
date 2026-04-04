import crypto from 'crypto';

/**
 * Verify Meta's X-Hub-Signature-256 HMAC header.
 * Shared across Messenger and Instagram webhook handlers.
 */
export function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string,
  appSecret: string
): boolean {
  const expected = `sha256=${crypto
    .createHmac('sha256', appSecret)
    .update(rawBody, 'utf8')
    .digest('hex')}`;
  if (signatureHeader.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader, 'utf8'),
    Buffer.from(expected, 'utf8')
  );
}
