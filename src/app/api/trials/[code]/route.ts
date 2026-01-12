/**
 * Public Trial Link API
 * Validate and redeem trial links
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteContext {
  params: Promise<{ code: string }>;
}

/**
 * GET /api/trials/[code]
 * Validate a trial link (public - no auth required)
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params;
    const supabase = createAdminClient();

    const { data: trial, error } = await supabase
      .from('trial_links')
      .select(`
        id,
        code,
        duration_days,
        credits_limit,
        max_redemptions,
        redemptions_count,
        expires_at,
        is_active,
        plan:subscription_plans (
          id,
          slug,
          name,
          description,
          credits_monthly,
          features
        )
      `)
      .ilike('code', code)
      .eq('is_active', true)
      .single();

    if (error || !trial) {
      throw APIError.notFound('Invalid trial code');
    }

    // Check expiration
    if (trial.expires_at && new Date(trial.expires_at) < new Date()) {
      throw APIError.badRequest('This trial code has expired');
    }

    // Check max redemptions
    const redemptionsCount = trial.redemptions_count ?? 0;
    if (trial.max_redemptions && redemptionsCount >= trial.max_redemptions) {
      throw APIError.badRequest('This trial code has reached its redemption limit');
    }

    // Handle plan type from join
    const plan = trial.plan as unknown as { id: string; slug: string; name: string; description: string | null; credits_monthly: number; features: Record<string, unknown> } | null;

    return successResponse({
      valid: true,
      code: trial.code,
      durationDays: trial.duration_days,
      creditsLimit: trial.credits_limit || plan?.credits_monthly,
      plan: plan,
      remainingRedemptions: trial.max_redemptions
        ? trial.max_redemptions - redemptionsCount
        : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/trials/[code]
 * Redeem a trial link (requires auth)
 */
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth(req);
    const { code } = await context.params;
    const supabase = createAdminClient();

    // Check if user already has an active paid subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', user.id)
      .single();

    if (subscription?.status === 'active' && subscription?.plan !== 'free') {
      throw APIError.badRequest(
        'You already have an active subscription. Cancel it first to use a trial.'
      );
    }

    // Use the database function to redeem
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result, error } = await (supabase.rpc as any)('redeem_trial_link', {
      p_code: code.toUpperCase(),
      p_user_id: user.id,
    }) as { data: Array<{ success: boolean; message?: string; expires_at?: string; trial_id?: string }> | null; error: unknown };

    if (error) {
      throw APIError.internal('Failed to redeem trial');
    }

    const redemptionResult = result?.[0];

    if (!redemptionResult?.success) {
      throw APIError.badRequest(redemptionResult?.message || 'Failed to redeem trial');
    }

    // Get trial details for response
    const { data: trial } = await supabase
      .from('trial_links')
      .select(`
        plan_id,
        credits_limit,
        plan:subscription_plans (
          id,
          slug,
          name,
          credits_monthly
        )
      `)
      .ilike('code', code)
      .single();

    // Start the trial in subscriptions
    if (trial?.plan_id && redemptionResult.expires_at) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.rpc as any)('start_subscription_trial', {
        p_user_id: user.id,
        p_plan_id: trial.plan_id,
        p_trial_days:
          (new Date(redemptionResult.expires_at).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
        p_trial_link_id: redemptionResult.trial_id,
      });
    }

    // Handle plan type from join
    const trialPlan = trial?.plan as unknown as { id: string; slug: string; name: string; credits_monthly: number } | null;

    return successResponse({
      success: true,
      message: 'Trial activated successfully!',
      expiresAt: redemptionResult.expires_at,
      plan: trialPlan,
      credits: trial?.credits_limit || trialPlan?.credits_monthly,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
