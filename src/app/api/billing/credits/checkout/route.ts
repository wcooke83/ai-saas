/**
 * Credit Pack Checkout API
 * POST /api/billing/credits/checkout
 * Creates a Stripe Checkout Session for a credit pack purchase.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripeClient, isStripeConfigured, getOrCreateCustomer } from '@/lib/stripe';

const bodySchema = z.object({
  packId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      throw APIError.internal('Stripe is not configured');
    }

    const user = await requireAuth(req);
    const { packId } = await parseBody(req, bodySchema);

    const supabase = createAdminClient();

    // Fetch the pack
    const { data: pack, error: packError } = await supabase
      .from('credit_packages')
      .select('id, name, credit_amount, price_cents, stripe_price_id')
      .eq('id', packId)
      .eq('is_global', true)
      .eq('active', true)
      .single();

    if (packError || !pack) {
      throw APIError.notFound('Credit pack not found or inactive');
    }

    if (!pack.stripe_price_id) {
      throw APIError.internal('Credit pack has no Stripe price configured');
    }

    // Insert pending purchase record (chatbot_id is NULL for global top-ups)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: purchase, error: insertError } = await (supabase as any)
      .from('credit_purchases')
      .insert({
        user_id: user.id,
        package_id: packId,
        credit_amount: pack.credit_amount,
        amount_paid_cents: pack.price_cents,
        status: 'pending',
        purchase_type: 'manual',
      })
      .select('id')
      .single();

    if (insertError || !purchase) {
      console.error('Failed to insert credit purchase:', insertError);
      throw APIError.internal('Failed to record purchase');
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(user.id, user.email);

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3030';
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [{ price: pack.stripe_price_id, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?credits=success`,
      cancel_url: `${origin}/dashboard/billing?credits=cancelled`,
      metadata: {
        type: 'credit_top_up',
        pack_id: packId,
        user_id: user.id,
        purchase_id: purchase.id,
      },
      payment_intent_data: {
        metadata: {
          type: 'credit_top_up',
          pack_id: packId,
          user_id: user.id,
          purchase_id: purchase.id,
        },
      },
    });

    if (!session.url) {
      throw APIError.internal('Failed to create checkout session');
    }

    // Store session and payment intent IDs on the purchase record
    await supabase
      .from('credit_purchases')
      .update({
        stripe_session_id: session.id,
        ...(session.payment_intent
          ? { stripe_payment_intent_id: session.payment_intent as string }
          : {}),
      })
      .eq('id', purchase.id);

    return successResponse({ url: session.url });
  } catch (error) {
    return errorResponse(error);
  }
}
