/**
 * E2E Test Helper: Void a Stripe invoice created during e2e tests
 *
 * Only works when E2E_TEST_SECRET env var is set and NOT in production.
 *
 * POST /api/e2e/void-stripe-invoice
 * Body: { secret, invoiceId }
 */

import { NextRequest, NextResponse } from 'next/server';

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

  const { invoiceId } = body;
  if (!invoiceId) {
    return NextResponse.json({ error: 'invoiceId required' }, { status: 400 });
  }

  try {
    const { getStripeClient, isStripeConfigured } = await import('@/lib/stripe/client');
    if (!isStripeConfigured()) {
      return NextResponse.json({ skipped: true, reason: 'Stripe not configured' });
    }

    const stripe = getStripeClient();
    await stripe.invoices.voidInvoice(invoiceId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({
      skipped: true,
      reason: err?.message || 'Unknown Stripe error',
    });
  }
}
