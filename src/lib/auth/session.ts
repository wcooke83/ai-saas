/**
 * Session Authentication Utilities
 * For web app authentication via Supabase
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateAPIKey, extractAPIKey, type APIKeyWithUser } from './api-keys';
import { APIError } from '@/lib/api/utils';

// ===================
// TYPES
// ===================

export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: string;
  authMethod: 'session' | 'api_key';
  apiKey?: APIKeyWithUser;
}

// ===================
// AUTH METHODS
// ===================

/**
 * Authenticate via session (cookies)
 */
export async function authenticateSession(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  // Get user's subscription plan
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', session.user.id)
    .single();

  const plan = (subscription as { plan: string } | null)?.plan || 'free';

  return {
    id: session.user.id,
    email: session.user.email!,
    plan,
    authMethod: 'session',
  };
}

/**
 * Authenticate via API key (header)
 */
export async function authenticateAPIKey(
  authHeader: string | null
): Promise<AuthenticatedUser | null> {
  const key = extractAPIKey(authHeader);
  if (!key) return null;

  try {
    const apiKeyData = await validateAPIKey(key);
    return {
      id: apiKeyData.user.id,
      email: apiKeyData.user.email,
      plan: apiKeyData.user.plan,
      authMethod: 'api_key',
      apiKey: apiKeyData,
    };
  } catch {
    return null;
  }
}

/**
 * Authenticate request (tries session first, then API key)
 */
export async function authenticate(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  // Try API key first (for external integrations)
  const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
  const apiKeyUser = await authenticateAPIKey(authHeader);
  if (apiKeyUser) return apiKeyUser;

  // Fall back to session (for web app)
  return authenticateSession();
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await authenticate(req);

  if (!user) {
    throw APIError.unauthorized('Authentication required');
  }

  return user;
}

/**
 * Require specific plan level
 */
export function requirePlan(
  user: AuthenticatedUser,
  requiredPlans: string[]
): void {
  if (!requiredPlans.includes(user.plan)) {
    throw APIError.forbidden(
      `This feature requires a ${requiredPlans.join(' or ')} plan`
    );
  }
}

/**
 * Require API key with specific scope
 */
export function requireScope(user: AuthenticatedUser, scope: string): void {
  if (user.authMethod !== 'api_key') {
    return; // Session users have all scopes
  }

  if (!user.apiKey?.scopes.includes(scope) && !user.apiKey?.scopes.includes('*')) {
    throw APIError.forbidden(`API key missing required scope: ${scope}`);
  }
}
