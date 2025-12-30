/**
 * Supabase Admin Client
 * For server-side operations that bypass RLS (webhooks, cron jobs, admin tasks)
 *
 * WARNING: This client has full database access. Only use in secure server contexts.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials');
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ===================
// ADMIN HELPERS
// ===================

/**
 * Get user by ID (admin only)
 */
export async function getUser(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*, subscriptions(*), usage(*)')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user subscription (for webhooks)
 */
export async function updateSubscription(
  userId: string,
  subscription: Partial<Database['public']['Tables']['subscriptions']['Update']>
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('subscriptions')
    .update(subscription)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Update user usage limits (for plan changes)
 */
export async function updateUsageLimits(
  userId: string,
  limits: { credits_limit?: number }
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('usage')
    .update(limits)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Reset usage for billing period
 */
export async function resetUsage(userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('usage')
    .update({
      credits_used: 0,
      period_start: new Date().toISOString(),
      period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Log audit event (admin context)
 */
export async function logAuditEvent(event: {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  const supabase = createClient();
  const { error } = await supabase.from('audit_log').insert(event as any);

  if (error) {
    console.error('Audit log error:', error);
  }
}
