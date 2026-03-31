import { describe, it, expect } from 'vitest';
import { splitDiscordMessage, verifyDiscordSignature } from './client';
import crypto from 'crypto';

// ── splitDiscordMessage ───────────────────────────────────────────

describe('splitDiscordMessage', () => {
  it('returns single-element array for short messages', () => {
    const result = splitDiscordMessage('Hello world');
    expect(result).toEqual(['Hello world']);
  });

  it('returns single-element array for exactly maxLength chars', () => {
    const text = 'a'.repeat(2000);
    const result = splitDiscordMessage(text);
    expect(result).toEqual([text]);
  });

  it('returns empty string as single-element array', () => {
    const result = splitDiscordMessage('');
    expect(result).toEqual(['']);
  });

  it('splits at nearest newline boundary', () => {
    const firstPart = 'a'.repeat(1990);
    const secondPart = 'b'.repeat(100);
    const text = `${firstPart}\n${secondPart}`;

    const result = splitDiscordMessage(text);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(firstPart);
    expect(result[1]).toBe(secondPart);
  });

  it('splits at nearest space when no newline found', () => {
    const firstPart = 'a'.repeat(1990);
    const secondPart = 'b'.repeat(100);
    const text = `${firstPart} ${secondPart}`;

    const result = splitDiscordMessage(text);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(firstPart);
    expect(result[1]).toBe(secondPart);
  });

  it('hard-splits when no whitespace found', () => {
    const text = 'a'.repeat(3000);
    const result = splitDiscordMessage(text);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('a'.repeat(2000));
    expect(result[1]).toBe('a'.repeat(1000));
  });

  it('handles multiple splits for very long messages', () => {
    const text = 'a'.repeat(6000);
    const result = splitDiscordMessage(text);
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('a'.repeat(2000));
    expect(result[1]).toBe('a'.repeat(2000));
    expect(result[2]).toBe('a'.repeat(2000));
  });

  it('respects custom maxLength parameter', () => {
    const text = 'a'.repeat(200);
    const result = splitDiscordMessage(text, 100);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('a'.repeat(100));
    expect(result[1]).toBe('a'.repeat(100));
  });

  it('trims leading whitespace from subsequent chunks', () => {
    const firstPart = 'a'.repeat(1990);
    const secondPart = 'b'.repeat(50);
    const text = `${firstPart}   ${secondPart}`;

    const result = splitDiscordMessage(text);
    expect(result).toHaveLength(2);
    expect(result[1]).toBe(secondPart);
  });

  it('uses 2000 as default limit (Discord max)', () => {
    expect(splitDiscordMessage('a'.repeat(2000))).toHaveLength(1);
    expect(splitDiscordMessage('a'.repeat(2001))).toHaveLength(2);
  });
});

// ── verifyDiscordSignature ────────────────────────────────────────

describe('verifyDiscordSignature', () => {
  // Generate a real Ed25519 keypair for testing
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

  // Extract raw public key bytes and convert to hex
  const pubKeyDer = publicKey.export({ type: 'spki', format: 'der' });
  // Ed25519 SPKI DER: 12-byte header + 32-byte key
  const rawPubKey = pubKeyDer.subarray(pubKeyDer.length - 32);
  const pubKeyHex = rawPubKey.toString('hex');

  function signMessage(timestamp: string, body: string): string {
    const message = Buffer.from(timestamp + body);
    const sig = crypto.sign(null, message, privateKey);
    return sig.toString('hex');
  }

  it('returns true for a valid signature', () => {
    const timestamp = '1700000000';
    const body = '{"type":1}';
    const signature = signMessage(timestamp, body);

    const result = verifyDiscordSignature(pubKeyHex, signature, timestamp, body);
    expect(result).toBe(true);
  });

  it('returns false for a tampered body', () => {
    const timestamp = '1700000000';
    const body = '{"type":1}';
    const signature = signMessage(timestamp, body);

    const result = verifyDiscordSignature(pubKeyHex, signature, timestamp, '{"type":2}');
    expect(result).toBe(false);
  });

  it('returns false for a tampered timestamp', () => {
    const timestamp = '1700000000';
    const body = '{"type":1}';
    const signature = signMessage(timestamp, body);

    const result = verifyDiscordSignature(pubKeyHex, signature, '1700000001', body);
    expect(result).toBe(false);
  });

  it('returns false for a tampered signature', () => {
    const timestamp = '1700000000';
    const body = '{"type":1}';
    const signature = signMessage(timestamp, body);

    // Flip a byte in the signature
    const tampered = 'ff' + signature.slice(2);
    const result = verifyDiscordSignature(pubKeyHex, tampered, timestamp, body);
    expect(result).toBe(false);
  });

  it('returns false for an invalid hex signature', () => {
    const result = verifyDiscordSignature(pubKeyHex, 'not-hex', '1700000000', '{}');
    expect(result).toBe(false);
  });

  it('returns false for an invalid public key', () => {
    const timestamp = '1700000000';
    const body = '{"type":1}';
    const signature = signMessage(timestamp, body);

    const result = verifyDiscordSignature('bad-key', signature, timestamp, body);
    expect(result).toBe(false);
  });

  it('returns false for empty signature', () => {
    const result = verifyDiscordSignature(pubKeyHex, '', '1700000000', '{}');
    expect(result).toBe(false);
  });
});
