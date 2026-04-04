/**
 * SMS Auth Token Encryption
 * Reuses the same AES-256-GCM pattern from Telegram crypto.
 * Encrypts/decrypts the auth_token field within SmsConfig.
 */

import { encryptToken, decryptToken } from '@/lib/telegram/crypto';

const ENCRYPTED_PREFIX = 'enc:';

/**
 * Encrypt the auth_token field within an SmsConfig object (if present).
 * Returns a new config object; does not mutate the input.
 */
export function encryptSmsConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.auth_token || typeof config.auth_token !== 'string') return config;
  // Don't double-encrypt
  if ((config.auth_token as string).startsWith(ENCRYPTED_PREFIX)) return config;
  return { ...config, auth_token: encryptToken(config.auth_token as string) };
}

/**
 * Decrypt the auth_token field within an SmsConfig object (if present).
 * Returns a new config object; does not mutate the input.
 */
export function decryptSmsConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.auth_token || typeof config.auth_token !== 'string') return config;
  return { ...config, auth_token: decryptToken(config.auth_token as string) };
}
