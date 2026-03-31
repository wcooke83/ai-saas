/**
 * WhatsApp Access Token Encryption
 * Reuses the same AES-256-GCM pattern from Telegram crypto.
 * Encrypts/decrypts the access_token field within WhatsAppConfig.
 */

import { encryptToken, decryptToken } from '@/lib/telegram/crypto';

const ENCRYPTED_PREFIX = 'enc:';

/**
 * Encrypt the access_token field within a WhatsAppConfig object (if present).
 * Returns a new config object; does not mutate the input.
 */
export function encryptWhatsAppConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.access_token || typeof config.access_token !== 'string') return config;
  // Don't double-encrypt
  if ((config.access_token as string).startsWith(ENCRYPTED_PREFIX)) return config;
  return { ...config, access_token: encryptToken(config.access_token as string) };
}

/**
 * Decrypt the access_token field within a WhatsAppConfig object (if present).
 * Returns a new config object; does not mutate the input.
 */
export function decryptWhatsAppConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.access_token || typeof config.access_token !== 'string') return config;
  return { ...config, access_token: decryptToken(config.access_token as string) };
}
