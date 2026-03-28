/**
 * Subscription Upgrade/Downgrade Preview API
 * POST - Uses Stripe's upcoming invoice to get accurate proration amounts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeClient } from '@/lib/stripe/client';
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
  calculation: {
    newPlanPriceCents: number;
    proratedAmountDueCents: number;
    isUpgrade: boolean;
    changeType: 'upgrade' | 'downgrade' | 'new_subscription';
  };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const newPriceId =
      billingInterval === 'yearly'
        ? targetPlan.stripe_price_id_yearly
        : targetPlan.stripe_price_id_monthly;

    const newPlanPriceCents =
      billingInterval === 'yearly'
        ? (targetPlan.price_yearly_cents || targetPlan.price_monthly_cents * 12)
        : targetPlan.price_monthly_cents;

    // Determine change type
    const currentMonthly = currentPlan?.price_monthly_cents || 0;
    const targetMonthly = targetPlan.price_monthly_cents;
    const isUpgrade = targetMonthly > currentMonthly;
    const changeType: 'upgrade' | 'downgrade' | 'new_subscription' =
      !subscription || subscription.status !== 'active'
        ? 'new_subscription'
        : isUpgrade
          ? 'upgrade'
          : 'downgrade';

    // For existing subscriptions with a Stripe subscription, use Stripe's upcoming invoice
    let proratedAmountDueCents = newPlanPriceCents;

    if (
      subscription?.stripe_subscription_id &&
      subscription.status === 'active' &&
      newPriceId &&
      changeType === 'upgrade'
    ) {
      try {
        const stripe = getStripeClient();

        // Retrieve the current subscription to get the item ID
        const stripeSub = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id
        );
        const itemId = stripeSub.items.data[0]?.id;

        if (itemId) {
          // Ask Stripe what the upcoming invoice would look like with the new price
          const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
            customer: subscription.stripe_customer_id!,
            subscription: subscription.stripe_subscription_id,
            subscription_items: [{ id: itemId, price: newPriceId }],
            subscription_proration_behavior: 'create_prorations',
          });

          // amount_due includes proration credits/debits calculated by Stripe
          proratedAmountDueCents = upcomingInvoice.amount_due;
        }
      } catch (err) {
        // If Stripe preview fails, fall back to the full plan price
        console.error('Failed to retrieve upcoming invoice from Stripe:', err);
      }
    }

    // For downgrades, no amount is due now (change happens at period end)
    if (changeType === 'downgrade') {
      proratedAmountDueCents = 0;
    }

    const response: UpgradeCalculationResponse = {
      currentPlan: currentPlan
        ? {
            id: currentPlan.id,
            name: currentPlan.name,
            slug: currentPlan.slug,
            priceMonthlyCents: currentPlan.price_monthly_cents,
            priceYearlyCents: currentPlan.price_yearly_cents,
          }
        : null,
      targetPlan: {
        id: targetPlan.id,
        name: targetPlan.name,
        slug: targetPlan.slug,
        priceMonthlyCents: targetPlan.price_monthly_cents,
        priceYearlyCents: targetPlan.price_yearly_cents,
      },
      calculation: {
        newPlanPriceCents,
        proratedAmountDueCents,
        isUpgrade,
        changeType,
      },
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
