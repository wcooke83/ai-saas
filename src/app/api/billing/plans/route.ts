/**
 * Billing Plans API
 * GET - Returns all active plans + user's current subscription
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';
import type { SubscriptionPlan, SubscriptionDetails, EffectivePlan } from '@/types/billing';

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionPlanRow = Database['public']['Tables']['subscription_plans']['Row'];

export interface PlansResponse {
  plans: SubscriptionPlan[];
  currentPlanId: string | null;
  currentPlanSlug: string | null;
  effectivePlan: EffectivePlan | null;
  subscription: SubscriptionDetails | null;
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's current subscription first to know their plan
    const { data: rawSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const subscriptionData = rawSubscription as SubscriptionRow | null;
    const userPlanId = subscriptionData?.plan_id;

    // Fetch all active, non-hidden plans ordered by display_order
    const { data: rawPlans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    if (plansError) {
      console.error('Error fetching plans:', plansError);
      return NextResponse.json(
        { error: 'Failed to fetch plans' },
        { status: 500 }
      );
    }

    // Cast to proper type
    let plans = (rawPlans || []) as SubscriptionPlanRow[];

    // If user is subscribed to a hidden plan, fetch and include it
    if (userPlanId && !plans.some(p => p.id === userPlanId)) {
      const { data: userPlan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', userPlanId)
        .single();

      if (userPlan) {
        plans = [...plans, userPlan as SubscriptionPlanRow];
      }
    }

    let subscription: SubscriptionDetails | null = null;
    let currentPlanId: string | null = null;
    let currentPlanSlug: string | null = null;

    if (subscriptionData) {
      currentPlanId = subscriptionData.plan_id;
      currentPlanSlug = subscriptionData.plan;

      // Find the matching plan from our plans list
      const matchingPlan = plans?.find(p => p.id === subscriptionData.plan_id) || null;

      subscription = {
        id: subscriptionData.id,
        userId: subscriptionData.user_id,
        planId: subscriptionData.plan_id,
        plan: matchingPlan as SubscriptionPlan | null,
        status: subscriptionData.status || 'active',
        billingInterval: (subscriptionData.billing_interval as 'monthly' | 'yearly') || 'monthly',
        currentPeriodStart: subscriptionData.current_period_start
          ? new Date(subscriptionData.current_period_start)
          : null,
        currentPeriodEnd: subscriptionData.current_period_end
          ? new Date(subscriptionData.current_period_end)
          : null,
        cancelAtPeriodEnd: subscriptionData.cancel_at_period_end || false,
        trialEndsAt: subscriptionData.trial_ends_at
          ? new Date(subscriptionData.trial_ends_at)
          : null,
        stripeCustomerId: subscriptionData.stripe_customer_id,
        stripeSubscriptionId: subscriptionData.stripe_subscription_id,
      };
    }

    // Get effective plan (considering trials)
    let effectivePlan: EffectivePlan | null = null;

    // Try to get effective plan from database function if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: effectiveData } = await (supabase.rpc as any)('get_effective_plan', {
      p_user_id: user.id,
    });

    if (effectiveData) {
      effectivePlan = {
        planId: effectiveData.plan_id,
        planSlug: effectiveData.plan_slug,
        planName: effectiveData.plan_name,
        creditsMonthly: effectiveData.credits_monthly,
        rateLimitTokens: effectiveData.rate_limit_tokens,
        rateLimitPeriodSeconds: effectiveData.rate_limit_period_seconds,
        rateLimitIsHardCap: effectiveData.rate_limit_is_hard_cap,
        features: effectiveData.features || {},
        isTrial: effectiveData.is_trial || false,
        trialExpiresAt: effectiveData.trial_expires_at
          ? new Date(effectiveData.trial_expires_at)
          : null,
        billingStatus: effectiveData.billing_status || 'active',
      };
    }

    const response: PlansResponse = {
      plans: (plans as unknown as SubscriptionPlan[]) || [],
      currentPlanId,
      currentPlanSlug,
      effectivePlan,
      subscription,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in plans API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
