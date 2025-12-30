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
 * Validate API key and return user info
 */
export async function validateAPIKey(key: string): Promise<APIKeyWithUser> {
  const supabase = createClient();
  const keyHash = hashAPIKey(key);

  // First get the API key with profile
  const { data, error } = await supabase
    .from('api_keys')
    .select(`
      *,
      profiles!inner(id, email)
    `)
    .eq('key_hash', keyHash)
    .single();

  if (error || !data) {
    throw APIError.unauthorized('Invalid API key');
  }

  // Check expiration
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw APIError.unauthorized('API key expired');
  }

  // Get subscription for the user
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', data.user_id)
    .single();

  // Update last used
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  const plan = (subscription as { plan: string } | null)?.plan || 'free';

  return {
    ...data,
    user: {
      id: (data.profiles as { id: string }).id,
      email: (data.profiles as { email: string }).email,
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
