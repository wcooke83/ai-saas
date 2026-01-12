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

/**
 * Create a checkout session for subscription purchase
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
      // Check if trial link is valid
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
  if (params.creditAmount < 100) {
    throw new Error('Minimum credit purchase is 100 credits');
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

  if (!credits?.stripe_customer_id || !credits?.default_payment_method_id) {
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
      payment_method: credits.default_payment_method_id,
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
