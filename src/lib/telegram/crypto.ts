/**
 * Telegram Bot Token Encryption
 * AES-256-GCM encryption for bot tokens stored in chatbots.telegram_config.
 * Uses SUPABASE_SERVICE_ROLE_KEY as the key base, derived via SHA-256.
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16;
/** Prefix to identify encrypted values (base64 won't start with this) */
const ENCRYPTED_PREFIX = 'enc:';

/**
 * Derive a 32-byte encryption key from SUPABASE_SERVICE_ROLE_KEY via SHA-256.
 */
function getEncryptionKey(): Buffer {
  const keyBase = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!keyBase) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for token encryption');
  }
  return crypto.createHash('sha256').update(keyBase).digest();
}

/**
 * Encrypt a plaintext token.
 * Returns: "enc:<base64(iv + authTag + ciphertext)>"
 */
export function encryptToken(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack: IV (12) + AuthTag (16) + Ciphertext
  const packed = Buffer.concat([iv, authTag, encrypted]);
  return `${ENCRYPTED_PREFIX}${packed.toString('base64')}`;
}

/**
 * Decrypt an encrypted token.
 * If the value doesn't have the encrypted prefix, returns it as-is
 * (backwards compatibility with existing plaintext tokens).
 */
export function decryptToken(value: string): string {
  if (!value.startsWith(ENCRYPTED_PREFIX)) {
    // Plaintext (legacy) - return as-is
    return value;
  }

  const key = getEncryptionKey();
  const packed = Buffer.from(value.slice(ENCRYPTED_PREFIX.length), 'base64');

  if (packed.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error('Invalid encrypted token: too short');
  }

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Encrypt the bot_token field within a TelegramConfig object (if present).
 * Returns a new config object; does not mutate the input.
 */
export function encryptTelegramConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.bot_token || typeof config.bot_token !== 'string') return config;
  // Don't double-encrypt
  if ((config.bot_token as string).startsWith(ENCRYPTED_PREFIX)) return config;
  return { ...config, bot_token: encryptToken(config.bot_token as string) };
}

/**
 * Decrypt the bot_token field within a TelegramConfig object (if present).
 * Returns a new config object; does not mutate the input.
 */
export function decryptTelegramConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.bot_token || typeof config.bot_token !== 'string') return config;
  return { ...config, bot_token: decryptToken(config.bot_token as string) };
}
