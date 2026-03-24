/**
 * Stripe Webhook Handler
 * Processes Stripe events for subscriptions and payments
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripeClient } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from '@/lib/stripe/webhooks';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('Missing Stripe signature');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret === 'whsec_xxx') {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  try {
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Idempotency check: skip already-processed events
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from('stripe_events')
      .select('id')
      .eq('stripe_event_id', event.id)
      .maybeSingle();

    if (existing) {
      console.log(`Stripe event already processed: ${event.id}`);
      return NextResponse.json({ received: true });
    }

    // Record the event before processing to prevent duplicate handling
    await supabase.from('stripe_events').insert({
      stripe_event_id: event.id,
      event_type: event.type,
    });

    console.log(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        // Log for now, could send email reminder
        console.log(
          `Trial ending soon for subscription: ${event.data.object.id}`
        );
        break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 400 }
    );
  }
}

// Disable body parsing for webhooks (Stripe needs raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};
