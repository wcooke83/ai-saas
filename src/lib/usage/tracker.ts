/**
 * Usage Tracking System
 * Track credits, tokens, and feature usage
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { APIError } from '@/lib/api/utils';
import { getMultiplierForProvider, getModelById, isUserAffiliate, type AIProvider } from '@/lib/settings';
import { calculateTokenCost, type ModelBillingResult } from '@/types/ai-models';
import type { CreditBalance, RateLimitStatus } from '@/types/billing';
import type { ModelTier } from '@/lib/ai/provider';

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
  base: {
    credits: 500000,
    features: {
      generations: 500000,
      apiCalls: 500000,
      storage: 100 * 1024 * 1024, // 100MB
    },
  },
  free: {
    credits: 500000,
    features: {
      generations: 500000,
      apiCalls: 500000,
      storage: 100 * 1024 * 1024, // 100MB
    },
  },
  pro: {
    credits: 3000000,
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
  console.log('[getUsage] Starting for user:', userId);

  // Use admin client to avoid session/cookie issues with API key auth
  const supabase = createAdminClient();
  console.log('[getUsage] Admin client created');

  const { data, error } = await supabase
    .from('usage')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  console.log('[getUsage] Query complete:', { hasData: !!data, error: error?.message, code: error?.code });

  // Handle errors
  if (error) {
    console.error('[getUsage] Query error:', error);
    throw error;
  }

  // If no usage record exists, create one
  if (!data) {
      console.log('[getUsage] No usage record found, creating one...');

      // Insert new usage record
      const { error: insertError } = await supabase
        .from('usage')
        .insert({
          user_id: userId,
          credits_used: 0,
          credits_limit: PLAN_LIMITS.base.credits,
          period_start: new Date().toISOString(),
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        } as any);

      console.log('[getUsage] Insert result:', { error: insertError?.message });

      if (insertError) {
        console.error('Failed to create usage record:', insertError);
        // Return default usage stats instead of retrying
        return {
          creditsUsed: 0,
          creditsLimit: PLAN_LIMITS.base.credits,
          creditsRemaining: PLAN_LIMITS.base.credits,
          percentUsed: 0,
          periodStart: new Date().toISOString(),
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isUnlimited: false,
        };
      }

      // Fetch the newly created record
      const { data: newData, error: fetchError } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError || !newData) {
        console.error('Failed to fetch new usage record:', fetchError);
        return {
          creditsUsed: 0,
          creditsLimit: PLAN_LIMITS.base.credits,
          creditsRemaining: PLAN_LIMITS.base.credits,
          percentUsed: 0,
          periodStart: new Date().toISOString(),
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isUnlimited: false,
        };
      }

      const newUsage = newData as {
        credits_used: number;
        credits_limit: number;
        period_start: string;
        period_end: string;
      };

      return {
        creditsUsed: newUsage.credits_used,
        creditsLimit: newUsage.credits_limit,
        creditsRemaining: Math.max(0, newUsage.credits_limit - newUsage.credits_used),
        percentUsed: Math.round((newUsage.credits_used / newUsage.credits_limit) * 100),
        periodStart: newUsage.period_start,
        periodEnd: newUsage.period_end,
        isUnlimited: newUsage.credits_limit === -1 || newUsage.credits_limit >= 999999,
      };
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
 * Check if user's subscription is in good standing
 * Enforces grace period expiry and trial expiry.
 */
export async function checkSubscriptionStatus(userId: string): Promise<void> {
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subscription } = await (supabase as any)
    .from('subscriptions')
    .select('status, grace_period_ends_at, trial_ends_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (!subscription) return; // No subscription = free tier, allow

  const sub = subscription as {
    status: string;
    grace_period_ends_at: string | null;
    trial_ends_at: string | null;
  };

  const now = new Date();

  // Trial expiry (Gap 7): trialing subscription with an expired trial_ends_at
  if (sub.status === 'trialing' && sub.trial_ends_at) {
    if (new Date(sub.trial_ends_at) < now) {
      throw new APIError(
        'Your free trial has expired. Please subscribe to continue using the service.',
        402,
        'TRIAL_EXPIRED'
      );
    }
  }

  // Canceled or unpaid — hard block
  if (sub.status === 'canceled' || sub.status === 'unpaid') {
    throw new APIError(
      'Your subscription is not active. Please update your subscription to continue using the service.',
      402,
      'SUBSCRIPTION_INACTIVE'
    );
  }

  // Past due — allow during grace period, block after expiry (Gap 4)
  if (sub.status === 'past_due') {
    if (sub.grace_period_ends_at && new Date(sub.grace_period_ends_at) < now) {
      throw new APIError(
        'Your subscription payment is overdue and the grace period has expired. Please update your payment method to continue.',
        402,
        'GRACE_PERIOD_EXPIRED'
      );
    }
    // Still within grace period — allow but do not throw
  }
}

/**
 * Check usage and throw if limit reached
 */
export async function checkUsageLimit(
  userId: string,
  amount = 1
): Promise<UsageStats> {
  // Check subscription status first (grace period enforcement)
  await checkSubscriptionStatus(userId);

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
  try {
    const supabase = createAdminClient();

    const { error } = await (supabase as any).rpc('increment_usage', {
      p_user_id: userId,
      p_amount: amount,
    });

    if (error) {
      // Fallback to direct update if RPC doesn't exist
      const { data } = await (supabase as any)
        .from('usage')
        .select('credits_used')
        .eq('user_id', userId)
        .single();

      if (data) {
        await (supabase as any)
          .from('usage')
          .update({ credits_used: data.credits_used + amount })
          .eq('user_id', userId);
      }
    }
  } catch (error) {
    console.error('Failed to increment usage:', error);
  }
}

/**
 * Increment usage based on token count with provider-specific multiplier applied
 */
export async function incrementTokenUsage(
  userId: string,
  tokensInput: number,
  tokensOutput: number,
  provider: AIProvider = 'claude'
): Promise<{ rawTokens: number; billedTokens: number; multiplier: number }> {
  const multiplier = await getMultiplierForProvider(provider);

  const rawTokens = tokensInput + tokensOutput;
  const billedTokens = Math.ceil(rawTokens * multiplier);

  // Convert tokens to credits (e.g., 1000 tokens = 1 credit)
  const credits = Math.ceil(billedTokens / 1000);

  if (credits > 0) {
    await incrementUsage(userId, credits);
  }

  return { rawTokens, billedTokens, multiplier };
}

/**
 * Increment usage based on model-specific pricing
 * Uses the three-tier pricing system (cost/wholesale/retail)
 */
export async function incrementModelUsage(
  userId: string,
  modelId: string,
  tokensInput: number,
  tokensOutput: number
): Promise<ModelBillingResult> {
  // Get model details
  const model = await getModelById(modelId);

  if (!model) {
    // Fallback to legacy provider-based billing
    console.warn(`Model ${modelId} not found, falling back to legacy billing`);
    const result = await incrementTokenUsage(userId, tokensInput, tokensOutput, 'claude');
    return {
      model_id: modelId,
      model_name: 'Unknown',
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      cost_usd: 0,
      billed_usd: 0,
      profit_usd: 0,
    };
  }

  // Determine user pricing tier
  const isAffiliate = await isUserAffiliate(userId);

  // Calculate costs
  const costUsd = calculateTokenCost(
    tokensInput,
    tokensOutput,
    model.cost_input_per_mtok,
    model.cost_output_per_mtok
  );

  const billedUsd = isAffiliate
    ? calculateTokenCost(
        tokensInput,
        tokensOutput,
        model.wholesale_input_per_mtok,
        model.wholesale_output_per_mtok
      )
    : calculateTokenCost(
        tokensInput,
        tokensOutput,
        model.retail_input_per_mtok,
        model.retail_output_per_mtok
      );

  const profitUsd = billedUsd - costUsd;

  // Convert USD to credits (1 credit = $0.01 = 1 cent)
  const credits = Math.ceil(billedUsd * 100);

  if (credits > 0) {
    await incrementUsage(userId, credits);
  }

  return {
    model_id: modelId,
    model_name: model.name,
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    cost_usd: costUsd,
    billed_usd: billedUsd,
    profit_usd: profitUsd,
  };
}

/**
 * Log usage event (for detailed tracking)
 * Note: Requires usage_events table to be created
 */
export async function logUsageEvent(event: UsageEvent): Promise<void> {
  try {
    const supabase = createAdminClient();

    // Use 'any' since usage_events is optional table
    const { error } = await (supabase as any).from('usage_events').insert({
      user_id: event.userId,
      type: event.type,
      credits: event.credits,
      metadata: event.metadata || {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      // Try admin client as fallback
      const adminClient = createAdminClient();
      await (adminClient as any).from('usage_events').insert({
        user_id: event.userId,
        type: event.type,
        credits: event.credits,
        metadata: event.metadata || {},
        created_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to log usage event:', error);
  }
}

/**
 * Update usage limits (for plan changes)
 */
export async function updateUsageLimits(
  userId: string,
  plan: PlanType
): Promise<void> {
  try {
    const limits = PLAN_LIMITS[plan];
    const supabase = createAdminClient();

    const { error } = await (supabase as any)
      .from('usage')
      .update({
        credits_limit: limits.credits === -1 ? 999999 : limits.credits,
      })
      .eq('user_id', userId);

    if (error) {
      // Try admin client as fallback
      const adminClient = createAdminClient();
      await adminClient
        .from('usage')
        .update({
          credits_limit: limits.credits === -1 ? 999999 : limits.credits,
        })
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Failed to update usage limits:', error);
  }
}

/**
 * Reset usage for new billing period
 */
export async function resetUsage(userId: string): Promise<void> {
  try {
    const supabase = createAdminClient();

    const { error } = await (supabase as any)
      .from('usage')
      .update({
        credits_used: 0,
        period_start: new Date().toISOString(),
        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      // Try admin client as fallback
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
  } catch (error) {
    console.error('Failed to reset usage:', error);
  }
}

// ===================
// GENERATION LOGGING
// ===================

export interface GenerationLogInput {
  userId: string;
  toolId: string;
  type: string;
  prompt: string;
  output?: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  durationMs?: number;
  status?: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log a generation to the generations table
 */
export async function logGeneration(input: GenerationLogInput): Promise<void> {
  try {
    const adminClient = createAdminClient();

    const { error } = await (adminClient as any).from('generations').insert({
      user_id: input.userId,
      tool_id: input.toolId,
      type: input.type,
      prompt: input.prompt.slice(0, 5000), // Limit prompt size
      output: input.output?.slice(0, 50000) || null, // Limit output size
      model: input.model,
      tokens_input: input.tokensInput,
      tokens_output: input.tokensOutput,
      duration_ms: input.durationMs || null,
      status: input.status || 'completed',
      error_message: input.errorMessage || null,
      metadata: input.metadata || {},
    });

    if (error) {
      console.error('Failed to log generation:', error);
    }
  } catch (error) {
    console.error('Failed to log generation:', error);
  }
}

// ===================
// CREDIT BALANCE SYSTEM
// ===================

/**
 * Get complete credit balance (plan + purchased + bonus)
 */
export async function getCreditBalance(userId: string): Promise<CreditBalance> {
  const supabase = createAdminClient();

  // Use the database function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('get_credit_balance', {
    p_user_id: userId,
  }) as { data: Array<{
    plan_allocation: number;
    plan_used: number;
    plan_remaining: number;
    purchased_credits: number;
    bonus_credits: number;
    total_available: number;
  }> | null; error: unknown };

  if (error || !data?.[0]) {
    console.error('Failed to get credit balance:', error);
    // Return default balance
    return {
      planAllocation: 100,
      planUsed: 0,
      planRemaining: 100,
      purchasedCredits: 0,
      bonusCredits: 0,
      totalAvailable: 100,
      isUnlimited: false,
    };
  }

  const row = data[0];
  const isUnlimited = row.plan_allocation === -1;

  return {
    planAllocation: row.plan_allocation,
    planUsed: row.plan_used,
    planRemaining: isUnlimited ? -1 : row.plan_remaining,
    purchasedCredits: row.purchased_credits,
    bonusCredits: row.bonus_credits,
    totalAvailable: isUnlimited ? -1 : row.total_available,
    isUnlimited,
  };
}

/**
 * Credit cost per action type based on model tier.
 */
export function getCreditCost(tier: ModelTier): number {
  switch (tier) {
    case 'fast': return 1;
    case 'balanced': return 2;
    case 'powerful': return 5;
    default: return 2;
  }
}

/**
 * Deduct credits atomically using deduct_user_credits_atomic RPC.
 * Priority: plan allocation → purchased credits → bonus credits.
 * Throws a 402-like APIError on insufficient credits.
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; remaining: number }> {
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('deduct_user_credits_atomic', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description ?? null,
    p_metadata: metadata ?? null,
  }) as { data: { success: boolean; needs_topup: boolean; topup_pack_id: string | null; remaining_total: number } | null; error: unknown };

  if (error) {
    console.error('Failed to deduct credits:', error);
    throw APIError.internal('Failed to process credit deduction');
  }

  if (!data?.success) {
    if (data?.needs_topup) {
      throw new APIError(
        'Insufficient credits. Auto top-up will be triggered.',
        402,
        'INSUFFICIENT_CREDITS',
        {
          needs_topup: true,
          topup_pack_id: data.topup_pack_id,
          upgrade_url: '/dashboard/billing',
        }
      );
    }
    throw new APIError(
      'Insufficient credits.',
      402,
      'INSUFFICIENT_CREDITS',
      { upgrade_url: '/dashboard/billing' }
    );
  }

  return {
    success: true,
    remaining: data.remaining_total,
  };
}

/**
 * Check and trigger auto top-up if needed
 */
export async function triggerAutoTopupIfNeeded(
  userId: string,
  requiredCredits: number
): Promise<{ success: boolean; amount?: number; error?: string }> {
  const supabase = createAdminClient();

  // Check if auto top-up should trigger
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('should_auto_topup', {
    p_user_id: userId,
  }) as { data: Array<{ should_trigger: boolean; reason?: string; amount: number }> | null; error: unknown };

  if (error || !data?.[0]?.should_trigger) {
    return {
      success: false,
      error: data?.[0]?.reason || 'Auto top-up not triggered',
    };
  }

  const topupAmount = data[0].amount;

  // Trigger the payment (dynamic import to avoid circular dependency)
  try {
    const { createAutoTopupPayment } = await import('@/lib/stripe/checkout');
    const result = await createAutoTopupPayment(userId, topupAmount);

    if (result.success) {
      return { success: true, amount: topupAmount };
    }

    return { success: false, error: result.error };
  } catch (err) {
    console.error('Auto top-up failed:', err);
    return { success: false, error: 'Payment processing failed' };
  }
}

// ===================
// RATE LIMITING (Claude-style)
// ===================

/**
 * Check rate limit and optionally consume tokens
 * Uses the database function for Claude-style windowed rate limiting
 */
export async function checkRateLimit(
  userId: string,
  tokensRequested: number
): Promise<{
  allowed: boolean;
  tokensRemaining: number;
  tokensUsed: number;
  resetAt: Date;
  isOverage: boolean;
}> {
  const supabase = createAdminClient();

  // Get user's plan rate limit config
  const { data: planData } = await supabase
    .from('subscriptions')
    .select(`
      subscription_plans (
        rate_limit_tokens,
        rate_limit_period_seconds,
        rate_limit_is_hard_cap
      )
    `)
    .eq('user_id', userId)
    .single();

  const config = planData?.subscription_plans as unknown as {
    rate_limit_tokens: number | null;
    rate_limit_period_seconds: number | null;
    rate_limit_is_hard_cap: boolean;
  } | null;

  // No rate limit configured - allow
  if (!config?.rate_limit_tokens || !config?.rate_limit_period_seconds) {
    return {
      allowed: true,
      tokensRemaining: -1,
      tokensUsed: 0,
      resetAt: new Date(),
      isOverage: false,
    };
  }

  // Use database function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('check_rate_limit', {
    p_user_id: userId,
    p_tokens_requested: tokensRequested,
    p_window_seconds: config.rate_limit_period_seconds,
    p_token_limit: config.rate_limit_tokens,
  }) as { data: Array<{
    allowed: boolean;
    tokens_remaining: number;
    tokens_used: number;
    reset_at: string;
    is_soft_cap: boolean;
  }> | null; error: unknown };

  if (error) {
    console.error('Rate limit check failed:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      tokensRemaining: -1,
      tokensUsed: 0,
      resetAt: new Date(),
      isOverage: false,
    };
  }

  const result = data?.[0];

  return {
    allowed: result?.allowed ?? true,
    tokensRemaining: result?.tokens_remaining ?? -1,
    tokensUsed: result?.tokens_used ?? 0,
    resetAt: new Date(result?.reset_at || Date.now()),
    isOverage: result?.is_soft_cap ?? false,
  };
}

/**
 * Get current rate limit status without consuming tokens
 */
export async function getRateLimitStatus(userId: string): Promise<RateLimitStatus> {
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('get_rate_limit_status', {
    p_user_id: userId,
  }) as { data: Array<{
    tokens_limit: number;
    tokens_used: number;
    tokens_remaining: number;
    window_seconds: number;
    reset_at: string;
    is_hard_cap: boolean;
  }> | null; error: unknown };

  if (error || !data?.[0]) {
    return {
      tokensLimit: -1,
      tokensUsed: 0,
      tokensRemaining: -1,
      windowSeconds: 0,
      resetAt: new Date(),
      isHardCap: true,
      isUnlimited: true,
    };
  }

  const row = data[0];

  return {
    tokensLimit: row.tokens_limit,
    tokensUsed: row.tokens_used,
    tokensRemaining: row.tokens_remaining,
    windowSeconds: row.window_seconds,
    resetAt: new Date(row.reset_at),
    isHardCap: row.is_hard_cap,
    isUnlimited: row.tokens_limit === -1,
  };
}

/**
 * Combined usage check: credits + rate limit
 * Use this before expensive operations
 */
export async function checkUsageAndRateLimit(
  userId: string,
  creditsNeeded: number,
  tokensEstimate: number
): Promise<{
  allowed: boolean;
  reason?: string;
  creditBalance: CreditBalance;
  rateLimit: RateLimitStatus;
}> {
  // Check credits first
  const balance = await getCreditBalance(userId);

  if (!balance.isUnlimited && balance.totalAvailable < creditsNeeded) {
    return {
      allowed: false,
      reason: `Insufficient credits. Need ${creditsNeeded}, have ${balance.totalAvailable}.`,
      creditBalance: balance,
      rateLimit: await getRateLimitStatus(userId),
    };
  }

  // Check rate limit
  const rateCheck = await checkRateLimit(userId, tokensEstimate);

  if (!rateCheck.allowed) {
    const resetIn = Math.ceil(
      (rateCheck.resetAt.getTime() - Date.now()) / 1000 / 60
    );
    return {
      allowed: false,
      reason: `Rate limit exceeded. Resets in ${resetIn} minutes.`,
      creditBalance: balance,
      rateLimit: await getRateLimitStatus(userId),
    };
  }

  return {
    allowed: true,
    creditBalance: balance,
    rateLimit: await getRateLimitStatus(userId),
  };
}

// ===================
// CONVENIENCE EXPORT
// ===================

export const trackUsage = {
  get: getUsage,
  check: canUseCredits,
  checkLimit: checkUsageLimit,
  checkSubscriptionStatus,
  increment: incrementUsage,
  log: logUsageEvent,
  logGeneration,
  updateLimits: updateUsageLimits,
  reset: resetUsage,
  // Credit system
  getCreditBalance,
  deductCredits,
  getCreditCost,
  checkRateLimit,
  getRateLimitStatus,
  checkUsageAndRateLimit,
  triggerAutoTopup: triggerAutoTopupIfNeeded,
};
