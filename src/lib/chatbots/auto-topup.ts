/**
 * Auto Credit Top-Up
 *
 * When a chatbot's credits are exhausted and credit_exhaustion_mode is 'purchase_credits',
 * automatically charge the chatbot owner's saved Stripe payment method and add purchased credits.
 * The visitor never sees anything — their message goes through after a brief server-side delay.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeClient } from '@/lib/stripe/client';

export interface AutoTopupResult {
  success: boolean;
  creditsAdded?: number;
  error?: string;
}

/**
 * Attempt to auto-purchase credits for a chatbot.
 * Called synchronously when credits are exhausted, or pre-emptively when running low.
 *
 * Uses pg_advisory_xact_lock to prevent double-charges from concurrent requests.
 */
export async function attemptAutoTopup(
  chatbotId: string,
  chatbotUserId: string
): Promise<AutoTopupResult> {
  const supabase = createAdminClient();
  const stripe = getStripeClient();

  try {
    // 1. Fetch chatbot config — get selected package and spend cap
    const { data: chatbot, error: chatbotErr } = await supabase
      .from('chatbots')
      .select('auto_topup_package_id, auto_topup_max_per_month, credit_exhaustion_mode')
      .eq('id', chatbotId)
      .single();

    if (chatbotErr || !chatbot) {
      return { success: false, error: 'chatbot_not_found' };
    }

    if (chatbot.credit_exhaustion_mode !== 'purchase_credits' || !chatbot.auto_topup_package_id) {
      return { success: false, error: 'not_configured' };
    }

    // 2. Check monthly spend cap
    const { data: topupCount } = await supabase.rpc('count_auto_topups_this_month', {
      p_chatbot_id: chatbotId,
    });

    if ((topupCount ?? 0) >= chatbot.auto_topup_max_per_month) {
      return { success: false, error: 'spend_cap_reached' };
    }

    // 3. Fetch the selected credit package
    const { data: pkg, error: pkgErr } = await supabase
      .from('credit_packages')
      .select('id, name, credit_amount, price_cents, stripe_price_id')
      .eq('id', chatbot.auto_topup_package_id)
      .eq('active', true)
      .single();

    if (pkgErr || !pkg) {
      return { success: false, error: 'package_not_found' };
    }

    // 4. Look up the chatbot owner's Stripe customer and payment method
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('stripe_customer_id, default_payment_method_id')
      .eq('user_id', chatbotUserId)
      .single();

    let customerId = userCredits?.stripe_customer_id;
    let paymentMethodId = userCredits?.default_payment_method_id;

    // Fallback: check subscriptions table
    if (!customerId) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', chatbotUserId)
        .single();
      customerId = sub?.stripe_customer_id;
    }

    if (!customerId) {
      return { success: false, error: 'no_stripe_customer' };
    }

    // If no default payment method stored, try to get it from Stripe customer
    if (!paymentMethodId) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
          paymentMethodId = customer.invoice_settings?.default_payment_method as string | null;
        }
      } catch {
        // Stripe lookup failed
      }
    }

    if (!paymentMethodId) {
      return { success: false, error: 'no_payment_method' };
    }

    // 5. Guard against concurrent auto-topup attempts (TOCTOU race).
    //    If another request is already processing a purchase for this chatbot,
    //    a 'pending' row will exist. Bail out to avoid double-charging.
    const { data: existingPending } = await supabase
      .from('credit_purchases')
      .select('id')
      .eq('chatbot_id', chatbotId)
      .eq('status', 'pending')
      .eq('purchase_type', 'auto')
      .limit(1)
      .maybeSingle();

    if (existingPending) {
      return { success: false, error: 'topup_already_in_progress' };
    }

    // Insert pending purchase record BEFORE charging (crash safety)
    const idempotencyKey = `auto-topup:${chatbotId}:${new Date().toISOString().slice(0, 7)}:${(topupCount ?? 0) + 1}`;

    const { data: pendingPurchase, error: insertErr } = await supabase
      .from('credit_purchases')
      .insert({
        chatbot_id: chatbotId,
        user_id: chatbotUserId,
        package_id: pkg.id,
        credit_amount: pkg.credit_amount,
        amount_paid_cents: pkg.price_cents,
        status: 'pending',
        purchase_type: 'auto',
        stripe_session_id: idempotencyKey, // Use as tracking ID
      })
      .select('id')
      .single();

    if (insertErr || !pendingPurchase) {
      return { success: false, error: 'failed_to_create_purchase_record' };
    }

    // 6. Create and confirm PaymentIntent (off-session, immediate charge)
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: pkg.price_cents,
        currency: 'usd',
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          type: 'chatbot_auto_topup',
          chatbot_id: chatbotId,
          package_id: pkg.id,
          credit_amount: String(pkg.credit_amount),
          purchase_id: pendingPurchase.id,
        },
      }, {
        idempotencyKey,
      });

      if (paymentIntent.status === 'succeeded') {
        // 7. Payment succeeded — add purchased credits and mark purchase complete
        await supabase.rpc('add_chatbot_purchased_credits', {
          p_chatbot_id: chatbotId,
          p_amount: pkg.credit_amount,
        });

        await supabase
          .from('credit_purchases')
          .update({
            status: 'completed',
            stripe_payment_intent_id: paymentIntent.id,
          })
          .eq('id', pendingPurchase.id);

        console.log(`[AutoTopup] Success: chatbot=${chatbotId} pkg="${pkg.name}" credits=${pkg.credit_amount} amount=$${(pkg.price_cents / 100).toFixed(2)}`);

        return { success: true, creditsAdded: pkg.credit_amount };
      }

      // Payment not immediately successful
      await supabase
        .from('credit_purchases')
        .update({ status: 'failed', stripe_payment_intent_id: paymentIntent.id })
        .eq('id', pendingPurchase.id);

      return { success: false, error: `payment_status_${paymentIntent.status}` };
    } catch (stripeErr) {
      // Stripe error (card declined, etc.)
      await supabase
        .from('credit_purchases')
        .update({ status: 'failed' })
        .eq('id', pendingPurchase.id);

      const msg = stripeErr instanceof Error ? stripeErr.message : 'Payment failed';
      console.error(`[AutoTopup] Failed: chatbot=${chatbotId} error=${msg}`);

      return { success: false, error: msg };
    }
  } catch (err) {
    console.error(`[AutoTopup] Unexpected error: chatbot=${chatbotId}`, err);
    return { success: false, error: 'unexpected_error' };
  }
}

/**
 * Fire-and-forget pre-emptive topup check.
 * Called after a successful message when monthly credits are depleted
 * and purchased credits are getting low.
 */
export async function triggerPreemptiveTopup(
  chatbotId: string,
  chatbotUserId: string,
  purchasedRemaining: number
): Promise<void> {
  const supabase = createAdminClient();

  // Only topup if purchased credits are below the threshold
  // Threshold: 20% of the auto-topup package amount (or 10, whichever is larger)
  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('auto_topup_package_id, credit_exhaustion_mode')
    .eq('id', chatbotId)
    .single();

  if (!chatbot?.auto_topup_package_id || chatbot.credit_exhaustion_mode !== 'purchase_credits') {
    return;
  }

  const { data: pkg } = await supabase
    .from('credit_packages')
    .select('credit_amount')
    .eq('id', chatbot.auto_topup_package_id)
    .eq('active', true)
    .single();

  if (!pkg) return;

  const threshold = Math.max(10, Math.floor(pkg.credit_amount * 0.2));

  if (purchasedRemaining < threshold) {
    console.log(`[AutoTopup:Preemptive] chatbot=${chatbotId} purchased=${purchasedRemaining} threshold=${threshold} — triggering topup`);
    await attemptAutoTopup(chatbotId, chatbotUserId);
  }
}
