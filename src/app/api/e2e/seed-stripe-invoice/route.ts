/**
 * E2E Test Helper: Seed a Stripe invoice for the e2e test user
 *
 * Creates a finalized invoice so billing/invoice-history tests can verify
 * that at least one invoice row renders.
 * Only works when E2E_TEST_SECRET env var is set and NOT in production.
 *
 * POST /api/e2e/seed-stripe-invoice
 * Body: { secret }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const E2E_SECRET = process.env.E2E_TEST_SECRET;

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  if (!E2E_SECRET) {
    return NextResponse.json({ error: 'E2E testing not enabled' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.secret !== E2E_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Look up the e2e user
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id')
      .eq('email', 'e2e-test@test.local')
      .single();

    if (!profile?.id) {
      return NextResponse.json({ skipped: true, reason: 'E2E test user not found' });
    }

    // 2. Get stripe_customer_id from user_credits
    const { data: credits } = await (supabase as any)
      .from('user_credits')
      .select('stripe_customer_id')
      .eq('user_id', profile.id)
      .single();

    if (!credits?.stripe_customer_id) {
      return NextResponse.json({ skipped: true, reason: 'No Stripe customer ID for e2e user' });
    }

    const customerId = credits.stripe_customer_id;

    // 3. Check Stripe config
    const { getStripeClient, isStripeConfigured } = await import('@/lib/stripe/client');
    if (!isStripeConfigured()) {
      return NextResponse.json({ skipped: true, reason: 'Stripe not configured' });
    }

    const stripe = getStripeClient();

    // 4. Create invoice item
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: 499,
      currency: 'usd',
      description: 'E2E Test: 50 credits purchase',
    });

    // 5. Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: false,
      metadata: { e2e_test: 'true' },
    });

    // 6. Finalize invoice
    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);

    // 7. Try to pay (non-fatal if it fails — finalized open invoice still shows in list)
    let paidInvoice = finalized;
    try {
      paidInvoice = await stripe.invoices.pay(invoice.id);
    } catch {
      // Payment failure is fine — the invoice still exists in the list
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      status: paidInvoice.status,
    });
  } catch (err: any) {
    return NextResponse.json({
      skipped: true,
      reason: err?.message || 'Unknown Stripe error',
    });
  }
}
