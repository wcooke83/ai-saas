/**
 * API Key Authentication
 * For external integrations and embeddable tools
 */

import { createClient } from '@/lib/supabase/admin';
import { createHash, randomBytes } from 'crypto';
import { APIError } from '@/lib/api/utils';

// ===================
// TYPES
// ===================

export interface APIKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;        // First 8 chars for display
  key_hash: string;          // SHA-256 hash of full key
  scopes: string[];          // Permissions: ['read', 'write', 'generate']
  allowed_domains: string[] | null; // Domain restrictions. null = no restriction, [] = blocked
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface APIKeyWithUser extends APIKey {
  user: {
    id: string;
    email: string;
    plan: string;
  };
}

// ===================
// KEY GENERATION
// ===================

/**
 * Generate a new API key
 * Format: prefix_[32 random base64url chars]
 */
export function generateAPIKey(prefix = 'sk_live'): {
  key: string;
  keyPrefix: string;
  keyHash: string;
} {
  const randomPart = randomBytes(24).toString('base64url');
  const key = `${prefix}_${randomPart}`;
  const keyPrefix = key.slice(0, 12);
  const keyHash = hashAPIKey(key);

  return { key, keyPrefix, keyHash };
}

/**
 * Hash API key for storage
 */
export function hashAPIKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

// ===================
// KEY MANAGEMENT
// ===================

/**
 * Create a new API key for user
 */
export async function createAPIKey(
  userId: string,
  options: {
    name: string;
    scopes?: string[];
    allowedDomains?: string[] | null;
    expiresInDays?: number;
  }
): Promise<{ apiKey: APIKey; plainKey: string }> {
  const supabase = createClient();

  const { key, keyPrefix, keyHash } = generateAPIKey();

  const expiresAt = options.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name: options.name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      scopes: options.scopes || ['read', 'write', 'generate'],
      allowed_domains: options.allowedDomains ?? null,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    apiKey: data as APIKey,
    plainKey: key, // Only returned once at creation
  };
}

/**
 * Extract domain from Origin or Referer header
 */
export function extractDomain(origin: string | null): string | null {
  if (!origin) return null;

  try {
    const url = new URL(origin);
    return url.hostname.toLowerCase();
  } catch {
    // If it's just a hostname without protocol, return as-is
    return origin.toLowerCase();
  }
}

/**
 * Check if origin domain is allowed by the API key
 */
export function isDomainAllowed(
  allowedDomains: string[] | null,
  origin: string | null
): boolean {
  // null means no restrictions
  if (allowedDomains === null) return true;

  // Empty array means blocked from all origins
  if (allowedDomains.length === 0) return false;

  const domain = extractDomain(origin);

  // No origin header and domains are restricted = blocked
  if (!domain) return false;

  // Check for exact match or wildcard subdomain match
  return allowedDomains.some((allowed) => {
    const normalizedAllowed = allowed.toLowerCase();

    // Wildcard subdomain: *.example.com matches sub.example.com
    if (normalizedAllowed.startsWith('*.')) {
      const baseDomain = normalizedAllowed.slice(2);
      return domain === baseDomain || domain.endsWith('.' + baseDomain);
    }

    // Exact match
    return domain === normalizedAllowed;
  });
}

/**
 * Validate API key and return user info
 * @param key - The API key to validate
 * @param origin - Origin header from the request (for domain restriction)
 */
export async function validateAPIKey(
  key: string,
  origin?: string | null
): Promise<APIKeyWithUser> {
  const supabase = createClient();
  const keyHash = hashAPIKey(key);

  // Check if admin client is working
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log('[Admin Client Check]', {
    hasServiceKey,
    serviceKeyPrefix: hasServiceKey ? process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20) + '...' : 'MISSING',
  });

  // Debug logging
  console.log('[API Key Validation]', {
    keyPrefix: key.slice(0, 12) + '...',
    keyHashPrefix: keyHash.slice(0, 16) + '...',
    origin,
  });

  // First check if key exists at all (without join)
  const { data: keyOnly, error: keyError } = await supabase
    .from('api_keys')
    .select('id, user_id, key_hash, key_prefix')
    .eq('key_hash', keyHash)
    .single();

  console.log('[API Key Basic Query]', {
    found: !!keyOnly,
    keyData: keyOnly ? { id: keyOnly.id, user_id: keyOnly.user_id, key_prefix: keyOnly.key_prefix } : null,
    error: keyError?.message || null,
    errorCode: keyError?.code || null,
  });

  // If key doesn't exist, list all keys for debugging
  if (!keyOnly) {
    const { data: allKeys, error: listError } = await supabase
      .from('api_keys')
      .select('key_prefix, key_hash');
    console.log('[All API Keys in DB]', {
      count: allKeys?.length ?? 0,
      error: listError?.message || null,
      keys: allKeys?.map(k => ({
        prefix: k.key_prefix,
        hashPrefix: k.key_hash?.slice(0, 16) + '...',
      })),
    });
  }

  // Now get the API key with profile
  const { data, error } = await supabase
    .from('api_keys')
    .select(`
      *,
      profiles!inner(id, email)
    `)
    .eq('key_hash', keyHash)
    .single();

  // Debug logging for query result
  console.log('[API Key Query Result]', {
    found: !!data,
    error: error?.message || null,
    errorCode: error?.code || null,
  });

  if (error || !data) {
    throw APIError.unauthorized('Invalid API key');
  }

  // Check expiration
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw APIError.unauthorized('API key expired');
  }

  // Check domain restriction
  const allowedDomains = (data as { allowed_domains?: string[] | null }).allowed_domains ?? null;
  if (!isDomainAllowed(allowedDomains, origin ?? null)) {
    throw APIError.forbidden('API key not authorized for this domain');
  }

  // Get subscription for the user
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', data.user_id)
    .maybeSingle();

  // Update last used
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  const plan = (subscription as { plan: string } | null)?.plan || 'free';

  // Handle profile type from join
  const profiles = data.profiles as unknown as { id: string; email: string } | null;

  return {
    ...data,
    allowed_domains: allowedDomains,
    user: {
      id: profiles?.id ?? data.user_id,
      email: profiles?.email ?? '',
      plan,
    },
  } as APIKeyWithUser;
}

/**
 * List user's API keys
 */
export async function listAPIKeys(userId: string): Promise<APIKey[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as APIKey[];
}

/**
 * Delete API key
 */
export async function deleteAPIKey(keyId: string, userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Update API key settings (name, allowed_domains)
 */
export async function updateAPIKey(
  keyId: string,
  userId: string,
  updates: {
    name?: string;
    allowed_domains?: string[] | null;
  }
): Promise<APIKey> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('api_keys')
    .update(updates)
    .eq('id', keyId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as APIKey;
}

/**
 * Check if API key has required scope
 */
export function hasScope(apiKey: APIKeyWithUser, scope: string): boolean {
  return apiKey.scopes.includes(scope) || apiKey.scopes.includes('*');
}

// ===================
// MIDDLEWARE HELPERS
// ===================

/**
 * Extract API key from request header
 */
export function extractAPIKey(authHeader: string | null): string | null {
  if (!authHeader) return null;

  // Support both "Bearer sk_live_xxx" and just "sk_live_xxx"
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  if (authHeader.startsWith('sk_')) {
    return authHeader;
  }

  return null;
}
