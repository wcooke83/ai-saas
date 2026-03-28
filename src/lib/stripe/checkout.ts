/**
 * Stripe Checkout Session Management
 */

import type Stripe from 'stripe';
import { getStripeClient } from './client';
import { getOrCreateCustomer } from './customers';
import { createAdminClient } from '@/lib/supabase/admin';

interface CreateSubscriptionCheckoutParams {
  userId: string;
  email: string;
  planId: string;
  billingInterval: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
  trialLinkCode?: string;
}

interface SubscriptionChangeParams {
  userId: string;
  planId: string;
  billingInterval: 'monthly' | 'yearly';
  changeType: 'upgrade' | 'downgrade';
}

export interface SubscriptionChangeResult {
  success: boolean;
  changeType: 'upgrade' | 'downgrade';
  effectiveAt: 'immediately' | 'period_end';
}

/**
 * Create a checkout session for a NEW subscription purchase.
 * For upgrades/downgrades of existing subscriptions, use changeSubscription() instead.
 */
export async function createSubscriptionCheckout(
  params: CreateSubscriptionCheckoutParams
): Promise<string> {
  const stripe = getStripeClient();
  const supabase = createAdminClient();

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', params.planId)
    .single();

  if (planError || !plan) {
    throw new Error('Plan not found');
  }

  // Get the appropriate Stripe price ID
  const priceId =
    params.billingInterval === 'yearly'
      ? plan.stripe_price_id_yearly
      : plan.stripe_price_id_monthly;

  if (!priceId) {
    throw new Error(
      `Stripe price not configured for ${plan.name} (${params.billingInterval})`
    );
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer(params.userId, params.email);

  // Check if there's a trial link to apply
  let trialDays = plan.trial_days || 0;
  let trialLinkId: string | null = null;

  if (params.trialLinkCode) {
    const { data: trialLink } = await supabase
      .from('trial_links')
      .select('*')
      .eq('code', params.trialLinkCode)
      .eq('is_active', true)
      .single();

    if (trialLink) {
      const isExpired =
        trialLink.expires_at && new Date(trialLink.expires_at) < new Date();
      const isMaxedOut =
        trialLink.max_redemptions &&
        (trialLink.redemptions_count ?? 0) >= trialLink.max_redemptions;

      if (!isExpired && !isMaxedOut) {
        trialDays = trialLink.duration_days;
        trialLinkId = trialLink.id;
      }
    }
  }

  // Build checkout session params
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
    metadata: {
      user_id: params.userId,
      plan_id: params.planId,
      plan_slug: plan.slug,
      billing_interval: params.billingInterval,
      trial_link_code: params.trialLinkCode || '',
      trial_link_id: trialLinkId || '',
    },
    subscription_data: {
      metadata: {
        user_id: params.userId,
        plan_id: params.planId,
        plan_slug: plan.slug,
      },
    },
  };

  // Apply trial if available
  if (trialDays > 0) {
    sessionParams.subscription_data!.trial_period_days = trialDays;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return session.url;
}

/**
 * Change an existing subscription's plan (upgrade or downgrade).
 * Uses stripe.subscriptions.update() so Stripe handles proration natively.
 * - Upgrades: take effect immediately with Stripe-calculated proration.
 * - Downgrades: deferred to end of current billing period (no proration).
 */
export async function changeSubscription(
  params: SubscriptionChangeParams
): Promise<SubscriptionChangeResult> {
  const stripe = getStripeClient();
  const supabase = createAdminClient();

  // Look up the user's current subscription
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, plan_id')
    .eq('user_id', params.userId)
    .single();

  if (subError || !subscription?.stripe_subscription_id) {
    throw new Error('No active subscription found for this user');
  }

  // Get the target plan's Stripe price ID
  const { data: targetPlan, error: planError } = await supabase
    .from('subscription_plans')
    .select('stripe_price_id_monthly, stripe_price_id_yearly, slug')
    .eq('id', params.planId)
    .single();

  if (planError || !targetPlan) {
    throw new Error('Target plan not found');
  }

  const newPriceId =
    params.billingInterval === 'yearly'
      ? targetPlan.stripe_price_id_yearly
      : targetPlan.stripe_price_id_monthly;

  if (!newPriceId) {
    throw new Error(
      `Stripe price not configured for target plan (${params.billingInterval})`
    );
  }

  // Retrieve the current Stripe subscription to get the item ID
  const stripeSub = await stripe.subscriptions.retrieve(
    subscription.stripe_subscription_id
  );
  const itemId = stripeSub.items.data[0]?.id;

  if (!itemId) {
    throw new Error('Could not find subscription item on Stripe subscription');
  }

  // Record the subscription change as pending
  await supabase.from('subscription_changes').insert({
    user_id: params.userId,
    old_plan_id: subscription.plan_id,
    new_plan_id: params.planId,
    old_stripe_subscription_id: subscription.stripe_subscription_id,
    change_type: params.changeType,
    status: 'pending',
  });

  if (params.changeType === 'upgrade') {
    // Upgrade: apply immediately, Stripe creates proration invoice items
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
      metadata: {
        user_id: params.userId,
        plan_id: params.planId,
        plan_slug: targetPlan.slug,
      },
    });

    return {
      success: true,
      changeType: 'upgrade',
      effectiveAt: 'immediately',
    };
  } else {
    // Downgrade: schedule price change at end of current billing period
    // Using subscription schedules so the old plan stays active until renewal
    let schedule = stripeSub.schedule
      ? await stripe.subscriptionSchedules.retrieve(
          stripeSub.schedule as string
        )
      : await stripe.subscriptionSchedules.create({
          from_subscription: subscription.stripe_subscription_id,
        });

    await stripe.subscriptionSchedules.update(schedule.id, {
      phases: [
        {
          items: [{ price: stripeSub.items.data[0].price.id as string, quantity: 1 }],
          start_date: schedule.phases[0]?.start_date ?? stripeSub.current_period_start,
          end_date: stripeSub.current_period_end,
        },
        {
          items: [{ price: newPriceId, quantity: 1 }],
          start_date: stripeSub.current_period_end,
          metadata: {
            user_id: params.userId,
            plan_id: params.planId,
            plan_slug: targetPlan.slug,
          },
        },
      ],
    });

    return {
      success: true,
      changeType: 'downgrade',
      effectiveAt: 'period_end',
    };
  }
}

interface CreateCreditPurchaseParams {
  userId: string;
  email: string;
  creditAmount: number;
  successUrl: string;
  cancelUrl: string;
  isAutoTopup?: boolean;
}

/**
 * Create a checkout session for one-time credit purchase
 */
export async function createCreditPurchaseCheckout(
  params: CreateCreditPurchaseParams
): Promise<string> {
  const stripe = getStripeClient();

  // Validate credit amount
  if (params.creditAmount < 1) {
    throw new Error('Credit amount must be at least 1');
  }

  if (params.creditAmount > 100000) {
    throw new Error('Maximum credit purchase is 100,000 credits');
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer(params.userId, params.email);

  // Credit pricing: 1 credit = $0.01 (1 cent)
  const priceInCents = params.creditAmount;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    invoice_creation: { enabled: true },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${params.creditAmount.toLocaleString()} Credits`,
            description: 'AI generation credits for your account',
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    payment_intent_data: {
      metadata: {
        user_id: params.userId,
        credit_amount: params.creditAmount.toString(),
        type: params.isAutoTopup ? 'auto_topup' : 'purchase',
      },
    },
    metadata: {
      user_id: params.userId,
      credit_amount: params.creditAmount.toString(),
      type: params.isAutoTopup ? 'auto_topup' : 'purchase',
    },
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return session.url;
}

/**
 * Create a payment intent for auto top-up (without redirect)
 * Uses saved payment method
 */
export async function createAutoTopupPayment(
  userId: string,
  creditAmount: number
): Promise<{ success: boolean; error?: string }> {
  const stripe = getStripeClient();
  const supabase = createAdminClient();

  // Get user's credit settings
  const { data: credits } = await supabase
    .from('user_credits')
    .select('stripe_customer_id, default_payment_method_id')
    .eq('user_id', userId)
    .single();

  if (!credits?.stripe_customer_id) {
    return {
      success: false,
      error: 'No payment method configured for auto top-up',
    };
  }

  // Use cached payment method, or fall back to Stripe customer's payment methods
  let paymentMethodId = credits.default_payment_method_id;

  if (!paymentMethodId) {
    const methods = await stripe.customers.listPaymentMethods(credits.stripe_customer_id, { limit: 1 });
    if (methods.data.length > 0) {
      paymentMethodId = methods.data[0].id;
      // Backfill cache
      await supabase
        .from('user_credits')
        .update({ default_payment_method_id: paymentMethodId })
        .eq('user_id', userId);
    }
  }

  if (!paymentMethodId) {
    return {
      success: false,
      error: 'No payment method configured for auto top-up',
    };
  }

  try {
    // Create and confirm payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: creditAmount, // 1 credit = 1 cent
      currency: 'usd',
      customer: credits.stripe_customer_id,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        user_id: userId,
        credit_amount: creditAmount.toString(),
        type: 'auto_topup',
      },
    });

    if (paymentIntent.status === 'succeeded') {
      // Add credits
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.rpc as any)('add_purchased_credits', {
        p_user_id: userId,
        p_amount: creditAmount,
        p_type: 'auto_topup',
        p_payment_intent_id: paymentIntent.id,
        p_description: 'Auto top-up',
      });

      return { success: true };
    }

    return { success: false, error: `Payment status: ${paymentIntent.status}` };
  } catch (error) {
    const stripeError = error as Error;
    return {
      success: false,
      error: stripeError.message || 'Payment failed',
    };
  }
}
