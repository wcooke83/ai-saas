/**
 * POST /api/billing/credits/checkout
 * Creates a Stripe checkout session for purchasing a credit pack by packId.
 *
 * TODO: Implement by looking up the credit package by packId from `credit_packages`
 * table, then calling createCreditPurchaseCheckout from @/lib/stripe.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: implement — look up credit_packages row by packId, call stripe checkout
  return NextResponse.json(
    { error: { message: 'Credit pack checkout not yet implemented' } },
    { status: 501 }
  );
}
