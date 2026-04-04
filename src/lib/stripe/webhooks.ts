/**
 * Stripe Webhook Event Handlers
 */

import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeClient } from './client';

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = createAdminClient();
  const userId = session.metadata?.user_id;

  // Chatbot ad-hoc credit purchase (from widget) — no user_id needed
  if (session.mode === 'payment' && session.metadata?.type === 'credit_purchase') {
    await handleChatbotCreditPurchase(session);
    return;
  }

  if (!userId) {
    console.error('Missing user_id in checkout session metadata');
    return;
  }

  if (session.mode === 'subscription') {
    await handleSubscriptionCheckout(session, userId);
  } else if (session.mode === 'payment') {
    if (session.metadata?.type === 'credit_top_up') {
      await handleCreditTopUpCheckout(session);
    } else if (session.metadata?.type === 'ltd') {
      await handleLTDCheckout(session);
    } else {
      await handleCreditPurchase(session, userId);
    }
  }

  // Save the payment method from checkout for future auto top-up use
  if (session.customer) {
    try {
      const stripe = getStripeClient();
      let pmId: string | null = null;

      if (session.payment_intent) {
        // Credit purchases (mode: 'payment') have a payment_intent
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        pmId = pi.payment_method
          ? (typeof pi.payment_method === 'string' ? pi.payment_method : pi.payment_method.id)
          : null;
      } else if (session.subscription) {
        // Subscription checkouts — get payment method from the subscription
        const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
          expand: ['default_payment_method'],
        });
        const defaultPm = sub.default_payment_method;
        pmId = defaultPm
          ? (typeof defaultPm === 'string' ? defaultPm : defaultPm.id)
          : null;
      }

      if (pmId) {
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
        // Upsert to handle users without an existing user_credits row
        await supabase
          .from('user_credits')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: customerId,
              default_payment_method_id: pmId,
            },
            { onConflict: 'user_id' }
          );
      }
    } catch (err) {
      console.error('Failed to save payment method from checkout:', err);
    }
  }
}

/**
 * Handle subscription checkout completion
 */
async function handleSubscriptionCheckout(
  session: Stripe.Checkout.Session,
  userId: string
): Promise<void> {
  const stripe = getStripeClient();
  const supabase = createAdminClient();
  const planId = session.metadata?.plan_id;
  const planSlug = session.metadata?.plan_slug;
  const billingInterval = session.metadata?.billing_interval || 'monthly';
  const trialLinkId = session.metadata?.trial_link_id;

  // Get plan details
  const { data: plan } = planId ? await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single() : { data: null };

  // Get subscription details from Stripe to get period dates
  let currentPeriodStart: string | null = null;
  let currentPeriodEnd: string | null = null;
  
  if (session.subscription) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(session.subscription as string);
      currentPeriodStart = new Date(stripeSub.current_period_start * 1000).toISOString();
      currentPeriodEnd = new Date(stripeSub.current_period_end * 1000).toISOString();
    } catch (err) {
      console.error('Failed to fetch subscription from Stripe:', err);
    }
  }

  // Update subscription in database
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan_id: planId,
      plan: planSlug,
      status: 'active',
      billing_interval: billingInterval,
      trial_link_id: trialLinkId || null,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Failed to update subscription:', updateError);
    throw new Error(`Failed to update subscription: ${updateError.message}`);
  }

  // Update usage limits based on plan
  if (plan) {
    await supabase
      .from('usage')
      .update({
        credits_limit: plan.credits_monthly,
        credits_used: 0,
        period_start: new Date().toISOString(),
        period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  }

  // If trial link was used, record the redemption
  if (trialLinkId) {
    // Increment redemptions count
    const { data: trialLink } = await supabase
      .from('trial_links')
      .select('redemptions_count')
      .eq('id', trialLinkId)
      .single();

    await supabase
      .from('trial_links')
      .update({
        redemptions_count: (trialLink?.redemptions_count ?? 0) + 1,
      })
      .eq('id', trialLinkId);
  }

  console.log(`Subscription activated for user ${userId}, plan: ${planSlug}, subscription: ${session.subscription}`);
}

/**
 * Handle credit purchase completion
 */
async function handleCreditPurchase(
  session: Stripe.Checkout.Session,
  userId: string
): Promise<void> {
  const supabase = createAdminClient();
  const creditAmount = parseInt(session.metadata?.credit_amount || '0');
  const type = session.metadata?.type === 'auto_topup' ? 'auto_topup' : 'purchase';

  if (creditAmount <= 0) {
    console.error('Invalid credit amount in checkout session');
    return;
  }

  // Add credits to user's balance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)('add_purchased_credits', {
    p_user_id: userId,
    p_amount: creditAmount,
    p_type: type,
    p_payment_intent_id: session.payment_intent as string,
    p_description: type === 'auto_topup' ? 'Auto top-up' : 'Credit purchase',
  });

  console.log(`Added ${creditAmount} credits for user ${userId} (${type})`);
}

/**
 * Handle chatbot ad-hoc credit purchase (from widget fallback)
 * Increases monthly_message_limit to expand the chatbot's quota
 */
async function handleChatbotCreditPurchase(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = createAdminClient();
  const chatbotId = session.metadata?.chatbot_id;
  const packageId = session.metadata?.package_id;
  const creditAmount = parseInt(session.metadata?.credit_amount || '0');

  if (!chatbotId || creditAmount <= 0) {
    console.error('[CreditPurchase] Missing chatbot_id or invalid credit_amount in metadata');
    return;
  }

  // Mark the credit_purchases record as completed
  if (session.id) {
    await supabase
      .from('credit_purchases')
      .update({
        status: 'completed',
        stripe_payment_intent_id: session.payment_intent as string || null,
      })
      .eq('stripe_session_id', session.id);
  }

  // Add to purchased credits pool (never expires, carries over)
  const { data: newBalance } = await supabase.rpc('add_chatbot_purchased_credits', {
    p_chatbot_id: chatbotId,
    p_amount: creditAmount,
  });

  console.log(`[CreditPurchase] Chatbot ${chatbotId}: added ${creditAmount} purchased credits (new balance: ${newBalance})`);
}

/**
 * Handle customer.subscription.updated event.
 * Syncs status/period dates AND detects plan changes from upgrade/downgrade.
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createAdminClient();

  const targetUserId =
    subscription.metadata?.user_id ||
    (await getUserIdFromSubscription(subscription.id));

  if (!targetUserId) {
    console.error('Could not find user for subscription:', subscription.id);
    return;
  }

  // Detect plan change from metadata set by changeSubscription()
  const newPlanId = subscription.metadata?.plan_id || null;
  const newPlanSlug = subscription.metadata?.plan_slug || null;

  // Build the base update payload (always sync these fields)
  const updatePayload: Record<string, unknown> = {
    status: subscription.status,
    current_period_start: new Date(
      subscription.current_period_start * 1000
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };

  // Check if the plan actually changed by comparing metadata against current DB state
  let planActuallyChanged = false;

  if (newPlanId) {
    const { data: currentSub } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (currentSub && currentSub.plan_id !== newPlanId) {
      planActuallyChanged = true;
      updatePayload.plan_id = newPlanId;
      updatePayload.plan = newPlanSlug;
    }
  }

  await supabase
    .from('subscriptions')
    .update(updatePayload)
    .eq('stripe_subscription_id', subscription.id);

  // Only reset usage and complete tracking if the plan actually changed
  if (planActuallyChanged && newPlanId) {
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('credits_monthly')
      .eq('id', newPlanId)
      .single();

    if (plan) {
      await supabase
        .from('usage')
        .update({
          credits_limit: plan.credits_monthly,
          credits_used: 0,
          period_start: new Date().toISOString(),
          period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', targetUserId);
    }

    // Complete pending subscription_changes record
    await supabase
      .from('subscription_changes')
      .update({
        new_stripe_subscription_id: subscription.id,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', targetUserId)
      .eq('new_plan_id', newPlanId)
      .eq('status', 'pending');

    // Clear the one-shot metadata so future events don't re-trigger plan change logic
    const stripe = getStripeClient();
    await stripe.subscriptions.update(subscription.id, {
      metadata: { plan_id: '', plan_slug: '' },
    });
  }

  console.log(
    `Subscription ${subscription.id} updated, status: ${subscription.status}` +
      (newPlanSlug ? `, plan changed to: ${newPlanSlug}` : '')
  );
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createAdminClient();

  // Skip LTD subscribers — they have no Stripe subscription to delete
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('purchase_source')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (existingSub?.purchase_source === 'ltd') {
    console.log(`Skipping subscription.deleted for LTD subscriber (${subscription.id})`);
    return;
  }

  // Get free plan ID (lowest tier)
  const { data: freePlan } = await supabase
    .from('subscription_plans')
    .select('id, credits_monthly')
    .eq('slug', 'free')
    .single();

  // Downgrade user to free plan
  const { data: updated } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      plan: 'free',
      plan_id: freePlan?.id,
      stripe_subscription_id: null,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .select('user_id')
    .single();

  if (updated?.user_id && freePlan) {
    // Reset usage limits to free plan
    await supabase
      .from('usage')
      .update({
        credits_limit: freePlan.credits_monthly,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', updated.user_id);
  }

  console.log(`Subscription ${subscription.id} deleted, user downgraded to free`);
}

/**
 * Handle invoice.paid event
 * Reset usage credits for new billing period
 */
export async function handleInvoicePaid(
  invoice: Stripe.Invoice
): Promise<void> {
  const supabase = createAdminClient();

  // Skip if not a subscription invoice
  if (!invoice.subscription) {
    return;
  }

  // Find user by subscription
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id, plan_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!sub?.user_id) {
    console.error('Could not find user for invoice subscription');
    return;
  }

  // Get plan details
  const { data: plan } = sub.plan_id ? await supabase
    .from('subscription_plans')
    .select('credits_monthly')
    .eq('id', sub.plan_id)
    .single() : { data: null };

  // Clear any payment failure / grace period since payment succeeded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('subscriptions')
    .update({
      status: 'active',
      payment_failed_at: null,
      grace_period_ends_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  // Reset usage for new billing period using the allocate_monthly_credits RPC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: allocateError } = await (supabase.rpc as any)('allocate_monthly_credits', {
    p_user_id: sub.user_id,
  });

  if (allocateError) {
    console.error(`Failed to allocate monthly credits for user ${sub.user_id}:`, allocateError);
  }

  console.log(`Usage reset for user ${sub.user_id} (invoice paid, grace period cleared)`);
}

/**
 * Handle invoice.payment_failed event
 * Sets subscription to past_due and starts 7-day grace period
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const supabase = createAdminClient();

  if (!invoice.subscription) {
    return;
  }

  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  const GRACE_PERIOD_DAYS = 7;
  const now = new Date();
  const gracePeriodEnd = new Date(now.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  // Update subscription status with grace period
  // Use COALESCE logic: only set payment_failed_at and grace_period_ends_at
  // if they aren't already set (first failure in this cycle)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('subscriptions')
    .update({
      status: 'past_due',
      payment_failed_at: now.toISOString(),
      grace_period_ends_at: gracePeriodEnd.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId)
    .is('payment_failed_at', null); // Only set if not already in a failure cycle

  // Fallback: if payment_failed_at was already set, just update status
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: now.toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  console.log(`Payment failed for subscription ${subscriptionId}, grace period ends: ${gracePeriodEnd.toISOString()}`);
}

/**
 * Handle credit top-up checkout completion
 */
export async function handleCreditTopUpCheckout(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = createAdminClient();
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('[CreditTopUp] Missing user_id in session metadata');
    return;
  }

  const paymentIntentId = session.payment_intent as string;

  // Look up existing user_credit_top_ups row by payment intent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingTopUp } = await (supabase as any)
    .from('user_credit_top_ups')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .maybeSingle();

  let topUpId: string;
  let creditsPurchased: number;
  let bonusCredits: number;

  if (!existingTopUp) {
    // Row wasn't pre-created — create it from session metadata
    const packId = session.metadata?.pack_id;
    creditsPurchased = parseInt(session.metadata?.credits_purchased || '0');
    bonusCredits = parseInt(session.metadata?.bonus_credits || '0');
    const pricePaidCents = session.amount_total ?? 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newTopUp, error: insertError } = await (supabase as any)
      .from('user_credit_top_ups')
      .insert({
        user_id: userId,
        pack_id: packId || null,
        credits_purchased: creditsPurchased,
        bonus_credits: bonusCredits,
        price_paid_cents: pricePaidCents,
        stripe_payment_intent_id: paymentIntentId,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError || !newTopUp) {
      console.error('[CreditTopUp] Failed to create top-up record:', insertError);
      return;
    }

    topUpId = newTopUp.id;
  } else {
    topUpId = existingTopUp.id;
    creditsPurchased = existingTopUp.credits_purchased;
    bonusCredits = existingTopUp.bonus_credits ?? 0;
  }

  // Apply credits via RPC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: applyError } = await (supabase.rpc as any)('apply_top_up_credits', {
    p_user_id: userId,
    p_credits: creditsPurchased,
    p_bonus_credits: bonusCredits,
    p_top_up_id: topUpId,
    p_payment_intent_id: paymentIntentId,
  });

  if (applyError) {
    console.error('[CreditTopUp] Failed to apply credits:', applyError);
    return;
  }

  // Mark top-up as completed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('user_credit_top_ups')
    .update({ status: 'completed' })
    .eq('id', topUpId);

  console.log(`[CreditTopUp] Applied ${creditsPurchased} credits (+${bonusCredits} bonus) for user ${userId}`);
}

/**
 * Handle LTD (Lifetime Deal) checkout completion
 */
export async function handleLTDCheckout(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = createAdminClient();
  const userId = session.metadata?.user_id;
  const ltdId = session.metadata?.ltd_id;

  if (!userId || !ltdId) {
    console.error('[LTD] Missing user_id or ltd_id in session metadata');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('process_ltd_redemption', {
    p_user_id: userId,
    p_ltd_id: ltdId,
    p_payment_intent_id: session.payment_intent as string,
    p_external_order_id: null,
  });

  if (error) {
    console.error('[LTD] Failed to process LTD redemption:', error);
    return;
  }

  console.log(`[LTD] Lifetime deal redeemed for user ${userId}, ltd_id: ${ltdId}`);
}

/**
 * Handle payment_intent.succeeded for direct credit top-up payments
 */
export async function handleCreditTopUpPaymentIntent(
  pi: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createAdminClient>
): Promise<void> {
  const userId = pi.metadata?.user_id;

  if (!userId) {
    console.error('[CreditTopUpPI] Missing user_id in payment intent metadata');
    return;
  }

  // Deduplicate via processed_payment_intents table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dedupError } = await (supabase as any)
    .from('processed_payment_intents')
    .insert({ payment_intent_id: pi.id, processed_at: new Date().toISOString() });

  if (dedupError) {
    // Unique constraint violation — already processed
    console.log(`[CreditTopUpPI] Already processed payment intent: ${pi.id}`);
    return;
  }

  // Look up existing top-up row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingTopUp } = await (supabase as any)
    .from('user_credit_top_ups')
    .select('*')
    .eq('stripe_payment_intent_id', pi.id)
    .maybeSingle();

  let topUpId: string;
  let creditsPurchased: number;
  let bonusCredits: number;

  if (!existingTopUp) {
    const packId = pi.metadata?.pack_id;
    creditsPurchased = parseInt(pi.metadata?.credits_purchased || '0');
    bonusCredits = parseInt(pi.metadata?.bonus_credits || '0');
    const pricePaidCents = pi.amount;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newTopUp, error: insertError } = await (supabase as any)
      .from('user_credit_top_ups')
      .insert({
        user_id: userId,
        pack_id: packId || null,
        credits_purchased: creditsPurchased,
        bonus_credits: bonusCredits,
        price_paid_cents: pricePaidCents,
        stripe_payment_intent_id: pi.id,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError || !newTopUp) {
      console.error('[CreditTopUpPI] Failed to create top-up record:', insertError);
      return;
    }

    topUpId = newTopUp.id;
  } else {
    topUpId = existingTopUp.id;
    creditsPurchased = existingTopUp.credits_purchased;
    bonusCredits = existingTopUp.bonus_credits ?? 0;
  }

  // Apply credits via RPC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: applyError } = await (supabase.rpc as any)('apply_top_up_credits', {
    p_user_id: userId,
    p_credits: creditsPurchased,
    p_bonus_credits: bonusCredits,
    p_top_up_id: topUpId,
    p_payment_intent_id: pi.id,
  });

  if (applyError) {
    console.error('[CreditTopUpPI] Failed to apply credits:', applyError);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('user_credit_top_ups')
    .update({ status: 'completed' })
    .eq('id', topUpId);

  console.log(`[CreditTopUpPI] Applied ${creditsPurchased} credits (+${bonusCredits} bonus) for user ${userId}`);
}

/**
 * Handle payment_intent.succeeded for auto top-up payments
 */
export async function handleAutoTopupPaymentIntent(
  pi: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createAdminClient>
): Promise<void> {
  const userId = pi.metadata?.user_id;

  if (!userId) {
    console.error('[AutoTopup] Missing user_id in payment intent metadata');
    return;
  }

  // Deduplicate via processed_payment_intents table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dedupError } = await (supabase as any)
    .from('processed_payment_intents')
    .insert({ payment_intent_id: pi.id, processed_at: new Date().toISOString() });

  if (dedupError) {
    console.log(`[AutoTopup] Already processed payment intent: ${pi.id}`);
    return;
  }

  const creditAmount = parseInt(pi.metadata?.credit_amount || '0');

  if (creditAmount <= 0) {
    console.error('[AutoTopup] Invalid credit_amount in payment intent metadata');
    return;
  }

  // Use existing add_purchased_credits RPC for auto top-ups
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)('add_purchased_credits', {
    p_user_id: userId,
    p_amount: creditAmount,
    p_type: 'auto_topup',
    p_payment_intent_id: pi.id,
    p_description: 'Auto top-up',
  });

  console.log(`[AutoTopup] Applied ${creditAmount} credits for user ${userId}`);
}

/**
 * Helper to get user ID from subscription ID
 */
async function getUserIdFromSubscription(
  subscriptionId: string
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  return data?.user_id || null;
}
