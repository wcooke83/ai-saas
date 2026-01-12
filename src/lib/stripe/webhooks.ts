/**
 * Stripe Webhook Event Handlers
 */

import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = createAdminClient();
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in checkout session metadata');
    return;
  }

  if (session.mode === 'subscription') {
    await handleSubscriptionCheckout(session, userId);
  } else if (session.mode === 'payment') {
    await handleCreditPurchase(session, userId);
  }
}

/**
 * Handle subscription checkout completion
 */
async function handleSubscriptionCheckout(
  session: Stripe.Checkout.Session,
  userId: string
): Promise<void> {
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

  // Update subscription in database
  await supabase
    .from('subscriptions')
    .update({
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan_id: planId,
      plan: planSlug,
      status: 'active',
      billing_interval: billingInterval,
      trial_link_id: trialLinkId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

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

  console.log(`Subscription activated for user ${userId}, plan: ${planSlug}`);
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
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createAdminClient();
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    // Try to find user by subscription ID
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!sub) {
      console.error('Could not find user for subscription:', subscription.id);
      return;
    }
  }

  const targetUserId = userId || (await getUserIdFromSubscription(subscription.id));
  if (!targetUserId) return;

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription ${subscription.id} updated, status: ${subscription.status}`);
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createAdminClient();

  // Get free plan ID
  const { data: freePlan } = await supabase
    .from('subscription_plans')
    .select('id, credits_monthly')
    .eq('slug', 'free')
    .single();

  // Downgrade user to free plan
  const { data: updated } = await supabase
    .from('subscriptions')
    .update({
      status: 'free',
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

  // Reset usage for new billing period
  await supabase
    .from('usage')
    .update({
      credits_used: 0,
      credits_limit: plan?.credits_monthly || 100,
      period_start: new Date().toISOString(),
      period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', sub.user_id);

  // Log the reset
  await supabase.from('credit_transactions').insert({
    user_id: sub.user_id,
    type: 'plan_allocation',
    amount: 0,
    description: 'Monthly billing cycle reset',
  });

  console.log(`Usage reset for user ${sub.user_id} (invoice paid)`);
}

/**
 * Handle invoice.payment_failed event
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

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  console.log(`Payment failed for subscription ${subscriptionId}`);
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
