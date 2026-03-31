import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { encryptToken, decryptToken, encryptTelegramConfig, decryptTelegramConfig } from './crypto';

const FAKE_SERVICE_KEY = 'test-service-role-key-for-encryption-testing';

beforeEach(() => {
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', FAKE_SERVICE_KEY);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('encryptToken / decryptToken', () => {
  it('round-trips: encrypt then decrypt returns original', () => {
    const token = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
    const encrypted = encryptToken(token);
    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(token);
  });

  it('encrypted value starts with enc: prefix', () => {
    const encrypted = encryptToken('some-token');
    expect(encrypted).toMatch(/^enc:/);
  });

  it('decrypting plaintext (no enc: prefix) returns it unchanged', () => {
    const plaintext = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11';
    expect(decryptToken(plaintext)).toBe(plaintext);
  });

  it('different tokens produce different ciphertexts', () => {
    const enc1 = encryptToken('token-one');
    const enc2 = encryptToken('token-two');
    expect(enc1).not.toBe(enc2);
  });

  it('same token encrypted twice produces different ciphertexts (random IV)', () => {
    const enc1 = encryptToken('same-token');
    const enc2 = encryptToken('same-token');
    expect(enc1).not.toBe(enc2);
    // But both decrypt to same value
    expect(decryptToken(enc1)).toBe('same-token');
    expect(decryptToken(enc2)).toBe('same-token');
  });

  it('throws when SUPABASE_SERVICE_ROLE_KEY is missing', () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    expect(() => encryptToken('token')).toThrow('SUPABASE_SERVICE_ROLE_KEY is required');
  });

  it('throws when encrypted data is tampered with', () => {
    const encrypted = encryptToken('my-token');
    // Flip a character in the base64 payload
    const tampered = encrypted.slice(0, -2) + 'XX';
    expect(() => decryptToken(tampered)).toThrow();
  });
});

describe('encryptTelegramConfig / decryptTelegramConfig', () => {
  it('encrypts the bot_token field and round-trips', () => {
    const config = { bot_token: 'my-bot-token', chat_id: '12345' };
    const encrypted = encryptTelegramConfig(config);

    expect(encrypted.bot_token).toMatch(/^enc:/);
    expect(encrypted.chat_id).toBe('12345');

    const decrypted = decryptTelegramConfig(encrypted);
    expect(decrypted.bot_token).toBe('my-bot-token');
    expect(decrypted.chat_id).toBe('12345');
  });

  it('does not double-encrypt already encrypted tokens', () => {
    const config = { bot_token: 'my-bot-token', chat_id: '12345' };
    const encrypted = encryptTelegramConfig(config);
    const doubleEncrypted = encryptTelegramConfig(encrypted);

    expect(doubleEncrypted.bot_token).toBe(encrypted.bot_token);
  });

  it('returns config unchanged when bot_token is missing', () => {
    const config = { chat_id: '12345' };
    const result = encryptTelegramConfig(config);
    expect(result).toEqual(config);
  });

  it('returns config unchanged when bot_token is not a string', () => {
    const config = { bot_token: 123, chat_id: '12345' };
    const result = encryptTelegramConfig(config as any);
    expect(result).toEqual(config);
  });
});
