/**
 * Subscription Upgrade Calculation API
 * POST - Calculate prorated credit for upgrading to a new plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { Database } from '@/types/database';

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionPlanRow = Database['public']['Tables']['subscription_plans']['Row'];

const calculateSchema = z.object({
  targetPlanId: z.string().uuid(),
  billingInterval: z.enum(['monthly', 'yearly']).default('monthly'),
});

export interface UpgradeCalculationResponse {
  currentPlan: {
    id: string;
    name: string;
    slug: string;
    priceMonthlyCents: number;
    priceYearlyCents: number | null;
  } | null;
  targetPlan: {
    id: string;
    name: string;
    slug: string;
    priceMonthlyCents: number;
    priceYearlyCents: number | null;
  };
  currentSubscription: {
    id: string;
    stripeSubscriptionId: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    billingInterval: 'monthly' | 'yearly';
  } | null;
  calculation: {
    daysRemaining: number;
    totalDaysInPeriod: number;
    unusedAmountCents: number;
    newPlanPriceCents: number;
    creditAppliedCents: number;
    amountDueCents: number;
    isUpgrade: boolean;
    changeType: 'upgrade' | 'downgrade' | 'interval_change' | 'new_subscription';
  };
}

export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json();
    const { targetPlanId, billingInterval } = calculateSchema.parse(body);

    // Get user's current subscription
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const subscription = subscriptionData as SubscriptionRow | null;

    // Get current plan details
    let currentPlan: SubscriptionPlanRow | null = null;
    if (subscription?.plan_id) {
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', subscription.plan_id)
        .single();
      currentPlan = planData as SubscriptionPlanRow | null;
    }

    // Get target plan details
    const { data: targetPlanData, error: targetPlanError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', targetPlanId)
      .single();

    if (targetPlanError || !targetPlanData) {
      return NextResponse.json(
        { error: 'Target plan not found' },
        { status: 404 }
      );
    }
    const targetPlan = targetPlanData as SubscriptionPlanRow;

    // Calculate pricing
    const now = new Date();
    let calculation: UpgradeCalculationResponse['calculation'];

    if (!subscription || subscription.status !== 'active') {
      // New subscription - no credit
      const newPlanPrice = billingInterval === 'yearly' 
        ? (targetPlan.price_yearly_cents || targetPlan.price_monthly_cents * 12)
        : targetPlan.price_monthly_cents;

      calculation = {
        daysRemaining: 0,
        totalDaysInPeriod: billingInterval === 'yearly' ? 365 : 30,
        unusedAmountCents: 0,
        newPlanPriceCents: newPlanPrice,
        creditAppliedCents: 0,
        amountDueCents: newPlanPrice,
        isUpgrade: true,
        changeType: 'new_subscription',
      };
    } else {
      // Existing subscription - calculate proration
      const periodStart = subscription.current_period_start 
        ? new Date(subscription.current_period_start) 
        : now;
      const periodEnd = subscription.current_period_end 
        ? new Date(subscription.current_period_end) 
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const totalDaysInPeriod = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Current plan pricing
      const currentPrice = subscription.billing_interval === 'yearly' && currentPlan?.price_yearly_cents
        ? currentPlan.price_yearly_cents
        : (currentPlan?.price_monthly_cents || 0);
      
      // Calculate unused amount (daily rate * days remaining)
      const dailyRate = totalDaysInPeriod > 0 ? currentPrice / totalDaysInPeriod : 0;
      const unusedAmount = Math.round(dailyRate * daysRemaining);

      // New plan pricing
      const newPlanPrice = billingInterval === 'yearly' 
        ? (targetPlan.price_yearly_cents || targetPlan.price_monthly_cents * 12)
        : targetPlan.price_monthly_cents;

      // Determine if this is upgrade or downgrade
      const currentMonthly = currentPlan?.price_monthly_cents || 0;
      const targetMonthly = targetPlan.price_monthly_cents;
      const isUpgrade = targetMonthly > currentMonthly;
      const isIntervalChange = targetMonthly === currentMonthly && subscription.billing_interval !== billingInterval;

      // Calculate amount due (ensure minimum $1 charge for upgrades)
      let amountDue = newPlanPrice - unusedAmount;
      if (isUpgrade && amountDue < 100) {
        amountDue = 100; // Minimum $1 charge
      }

      calculation = {
        daysRemaining,
        totalDaysInPeriod,
        unusedAmountCents: unusedAmount,
        newPlanPriceCents: newPlanPrice,
        creditAppliedCents: unusedAmount,
        amountDueCents: Math.max(0, amountDue),
        isUpgrade,
        changeType: isIntervalChange ? 'interval_change' : isUpgrade ? 'upgrade' : 'downgrade',
      };
    }

    const response: UpgradeCalculationResponse = {
      currentPlan: currentPlan ? {
        id: currentPlan.id,
        name: currentPlan.name,
        slug: currentPlan.slug,
        priceMonthlyCents: currentPlan.price_monthly_cents,
        priceYearlyCents: currentPlan.price_yearly_cents,
      } : null,
      targetPlan: {
        id: targetPlan.id,
        name: targetPlan.name,
        slug: targetPlan.slug,
        priceMonthlyCents: targetPlan.price_monthly_cents,
        priceYearlyCents: targetPlan.price_yearly_cents,
      },
      currentSubscription: subscription ? {
        id: subscription.id,
        stripeSubscriptionId: subscription.stripe_subscription_id,
        currentPeriodStart: new Date(subscription.current_period_start || now),
        currentPeriodEnd: new Date(subscription.current_period_end || now),
        billingInterval: (subscription.billing_interval as 'monthly' | 'yearly') || 'monthly',
      } : null,
      calculation,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in upgrade calculation:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
