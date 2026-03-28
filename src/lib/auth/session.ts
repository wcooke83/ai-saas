/**
 * Session Authentication Utilities
 * For web app authentication via Supabase
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import { validateAPIKey, extractAPIKey, type APIKeyWithUser } from './api-keys';
import { APIError } from '@/lib/api/utils';

// ===================
// TYPES
// ===================

export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: string;
  subscriptionStatus: string;
  authMethod: 'session' | 'api_key';
  apiKey?: APIKeyWithUser;
}

// Tool slug to feature key mapping
const TOOL_FEATURE_MAP: Record<string, string> = {
  'chatbots': 'custom_chatbots',
  'custom-chatbots': 'custom_chatbots',
};

// ===================
// AUTH METHODS
// ===================

/**
 * Authenticate via session (cookies)
 */
export async function authenticateSession(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user's subscription plan and status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subscription } = await (supabase as any)
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .maybeSingle();

  const sub = subscription as { plan: string; status: string } | null;
  const plan = sub?.plan || 'base';
  const subscriptionStatus = sub?.status || 'active';

  return {
    id: user.id,
    email: user.email!,
    plan,
    subscriptionStatus,
    authMethod: 'session',
  };
}

/**
 * Authenticate via API key (header)
 * @param authHeader - Authorization or X-API-Key header
 * @param origin - Origin header for domain restriction validation
 */
export async function authenticateAPIKey(
  authHeader: string | null,
  origin?: string | null
): Promise<AuthenticatedUser | null> {
  const key = extractAPIKey(authHeader);
  if (!key) return null;

  try {
    const apiKeyData = await validateAPIKey(key, origin);
    return {
      id: apiKeyData.user.id,
      email: apiKeyData.user.email,
      plan: apiKeyData.user.plan,
      subscriptionStatus: 'active',
      authMethod: 'api_key',
      apiKey: apiKeyData,
    };
  } catch (error) {
    console.error('API key validation failed:', error);
    return null;
  }
}

/**
 * Authenticate request (tries API key first, then session)
 * If an API key is provided but invalid, falls back to session auth for dashboard users
 */
export async function authenticate(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  // Check for API key header
  const authHeader = req.headers.get('authorization') || req.headers.get('x-api-key');
  const origin = req.headers.get('origin') || req.headers.get('referer');

  // If API key is provided, try to validate it
  if (authHeader && (authHeader.startsWith('Bearer sk_') || authHeader.startsWith('sk_'))) {
    const apiKeyUser = await authenticateAPIKey(authHeader, origin);
    if (apiKeyUser) return apiKeyUser;

    // API key was provided but invalid - check if there's a valid session
    // This allows dashboard users to test tools without valid API keys
    const sessionUser = await authenticateSession();
    if (sessionUser) {
      return sessionUser; // Fall back to session for logged-in users
    }

    // No session either - this is an external request with invalid key
    throw APIError.unauthorized('Invalid API key');
  }

  // Try API key authentication (for other formats)
  const apiKeyUser = await authenticateAPIKey(authHeader, origin);
  if (apiKeyUser) return apiKeyUser;

  // Fall back to session (for web app)
  return authenticateSession();
}

/**
 * Authenticate via API key - strict mode (throws on invalid key)
 */
export async function authenticateAPIKeyStrict(
  authHeader: string | null,
  origin?: string | null
): Promise<AuthenticatedUser> {
  const key = extractAPIKey(authHeader);
  if (!key) {
    throw APIError.unauthorized('API key required');
  }

  // This will throw if key is invalid
  const apiKeyData = await validateAPIKey(key, origin);
  return {
    id: apiKeyData.user.id,
    email: apiKeyData.user.email,
    plan: apiKeyData.user.plan,
    subscriptionStatus: 'active',
    authMethod: 'api_key',
    apiKey: apiKeyData,
  };
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

/**
 * Check if user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    // Use admin client to bypass RLS and ensure consistent access
    const supabase = createAdminClient();

    // Use type assertion since is_admin column may not be in generated types yet
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[isAdmin] Database error:', error);
      return false;
    }

    if (!data) {
      console.warn('[isAdmin] No profile found for user:', userId);
      return false;
    }

    return data.is_admin === true;
  } catch (error) {
    console.error('[isAdmin] Unexpected error:', error);
    return false;
  }
}

/**
 * Require admin access (throws if not admin)
 */
export async function requireAdmin(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(req);

  const adminStatus = await isAdmin(user.id);
  if (!adminStatus) {
    throw APIError.forbidden('Admin access required');
  }

  return user;
}

// ===================
// TOOL ACCESS CONTROL
// ===================

/**
 * Check if a user's plan has access to a specific tool
 * @param userId - The user's ID
 * @param toolSlug - The tool slug (e.g., 'chatbots', 'custom-chatbots')
 * @returns boolean indicating if the user has access
 */
export async function checkToolAccess(userId: string, toolSlug: string): Promise<boolean> {
  const featureKey = TOOL_FEATURE_MAP[toolSlug];
  if (!featureKey) {
    // Unknown tool - allow access by default (fallback for new tools)
    console.warn(`[Tool Access] Unknown tool slug: ${toolSlug}`);
    return true;
  }

  const supabase = createAdminClient();

  // Get user's subscription and plan features
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle();

  const planSlug = subscription?.plan || 'base';

  // Get the plan's features
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('features')
    .eq('slug', planSlug)
    .single();

  if (!plan) {
    // Plan not found - allow access by default (handles migration edge cases)
    console.warn(`[Tool Access] Plan not found: ${planSlug}`);
    return true;
  }

  const features = (plan.features || {}) as Record<string, boolean>;

  // Check if the tool is explicitly disabled (false)
  // Default to true if not specified (backwards compatibility)
  const hasAccess = features[featureKey] !== false;

  return hasAccess;
}

/**
 * Require tool access - throws if user's plan doesn't include the tool
 * @param user - The authenticated user
 * @param toolSlug - The tool slug (e.g., 'chatbots', 'custom-chatbots')
 */
export async function requireToolAccess(
  user: AuthenticatedUser,
  toolSlug: string
): Promise<void> {
  const hasAccess = await checkToolAccess(user.id, toolSlug);

  if (!hasAccess) {
    const featureKey = TOOL_FEATURE_MAP[toolSlug];
    const toolName = featureKey?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || toolSlug;
    throw APIError.forbidden(
      `${toolName} is not included in your current plan. Please upgrade to access this tool.`
    );
  }
}
