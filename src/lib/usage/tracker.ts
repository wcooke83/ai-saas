/**
 * Usage Tracking System
 * Track credits, tokens, and feature usage
 */

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import { APIError } from '@/lib/api/utils';

// ===================
// TYPES
// ===================

export interface UsageStats {
  creditsUsed: number;
  creditsLimit: number;
  creditsRemaining: number;
  percentUsed: number;
  periodStart: string;
  periodEnd: string;
  isUnlimited: boolean;
}

export interface UsageEvent {
  userId: string;
  type: string;           // 'generation', 'api_call', etc.
  credits: number;        // Credits consumed
  metadata?: Record<string, unknown>;
}

// ===================
// PLAN LIMITS
// ===================

export const PLAN_LIMITS = {
  free: {
    credits: 10,
    features: {
      generations: 10,
      apiCalls: 100,
      storage: 10 * 1024 * 1024, // 10MB
    },
  },
  pro: {
    credits: -1, // Unlimited
    features: {
      generations: -1,
      apiCalls: -1,
      storage: 1024 * 1024 * 1024, // 1GB
    },
  },
  enterprise: {
    credits: -1,
    features: {
      generations: -1,
      apiCalls: -1,
      storage: -1,
    },
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

// ===================
// USAGE QUERIES
// ===================

/**
 * Get current usage for user
 */
export async function getUsage(userId: string): Promise<UsageStats> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // Create usage record if doesn't exist
    if (error.code === 'PGRST116') {
      const adminClient = createAdminClient();
      await adminClient.from('usage').insert({ user_id: userId } as any);
      return getUsage(userId);
    }
    throw error;
  }

  const usage = data as {
    credits_used: number;
    credits_limit: number;
    period_start: string;
    period_end: string;
  };

  const isUnlimited = usage.credits_limit === -1 || usage.credits_limit >= 999999;

  return {
    creditsUsed: usage.credits_used,
    creditsLimit: usage.credits_limit,
    creditsRemaining: isUnlimited ? Infinity : Math.max(0, usage.credits_limit - usage.credits_used),
    percentUsed: isUnlimited ? 0 : Math.round((usage.credits_used / usage.credits_limit) * 100),
    periodStart: usage.period_start,
    periodEnd: usage.period_end,
    isUnlimited,
  };
}

/**
 * Check if user can use credits
 */
export async function canUseCredits(
  userId: string,
  amount = 1
): Promise<boolean> {
  const usage = await getUsage(userId);

  if (usage.isUnlimited) return true;
  return usage.creditsRemaining >= amount;
}

/**
 * Check usage and throw if limit reached
 */
export async function checkUsageLimit(
  userId: string,
  amount = 1
): Promise<UsageStats> {
  const usage = await getUsage(userId);

  if (!usage.isUnlimited && usage.creditsRemaining < amount) {
    throw APIError.usageLimitReached(
      `Usage limit reached. ${usage.creditsUsed}/${usage.creditsLimit} credits used. Please upgrade your plan.`
    );
  }

  return usage;
}

// ===================
// USAGE MUTATIONS
// ===================

/**
 * Increment usage (after successful operation)
 */
export async function incrementUsage(
  userId: string,
  amount = 1
): Promise<void> {
  const adminClient = createAdminClient();

  const { error } = await adminClient.rpc('increment_usage', {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    // Fallback to direct update if RPC doesn't exist
    const { data } = await adminClient
      .from('usage')
      .select('credits_used')
      .eq('user_id', userId)
      .single();

    if (data) {
      await adminClient
        .from('usage')
        .update({ credits_used: data.credits_used + amount })
        .eq('user_id', userId);
    }
  }
}

/**
 * Log usage event (for detailed tracking)
 * Note: Requires usage_events table to be created
 */
export async function logUsageEvent(event: UsageEvent): Promise<void> {
  const adminClient = createAdminClient();

  // Use 'any' since usage_events is optional table
  await (adminClient as any).from('usage_events').insert({
    user_id: event.userId,
    type: event.type,
    credits: event.credits,
    metadata: event.metadata || {},
    created_at: new Date().toISOString(),
  });
}

/**
 * Update usage limits (for plan changes)
 */
export async function updateUsageLimits(
  userId: string,
  plan: PlanType
): Promise<void> {
  const adminClient = createAdminClient();
  const limits = PLAN_LIMITS[plan];

  await adminClient
    .from('usage')
    .update({
      credits_limit: limits.credits === -1 ? 999999 : limits.credits,
    })
    .eq('user_id', userId);
}

/**
 * Reset usage for new billing period
 */
export async function resetUsage(userId: string): Promise<void> {
  const adminClient = createAdminClient();

  await adminClient
    .from('usage')
    .update({
      credits_used: 0,
      period_start: new Date().toISOString(),
      period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('user_id', userId);
}

// ===================
// CONVENIENCE EXPORT
// ===================

export const trackUsage = {
  get: getUsage,
  check: canUseCredits,
  checkLimit: checkUsageLimit,
  increment: incrementUsage,
  log: logUsageEvent,
  updateLimits: updateUsageLimits,
  reset: resetUsage,
};
