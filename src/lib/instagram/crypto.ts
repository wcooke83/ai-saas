import { encryptToken, decryptToken } from '@/lib/telegram/crypto';

const ENCRYPTED_PREFIX = 'enc:';

export function encryptInstagramConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.access_token || typeof config.access_token !== 'string') return config;
  if ((config.access_token as string).startsWith(ENCRYPTED_PREFIX)) return config;
  return { ...config, access_token: encryptToken(config.access_token as string) };
}

export function decryptInstagramConfig<T extends Record<string, unknown>>(config: T): T {
  if (!config.access_token || typeof config.access_token !== 'string') return config;
  return { ...config, access_token: decryptToken(config.access_token as string) };
}
