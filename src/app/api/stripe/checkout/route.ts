/**
 * Stripe Checkout API
 * Creates checkout sessions for subscriptions and credit purchases
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, parseBody, APIError } from '@/lib/api/utils';
import {
  createSubscriptionCheckout,
  createCreditPurchaseCheckout,
  isStripeConfigured,
} from '@/lib/stripe';

const subscriptionSchema = z.object({
  type: z.literal('subscription'),
  planId: z.string().uuid(),
  billingInterval: z.enum(['monthly', 'yearly']).default('monthly'),
  trialLinkCode: z.string().optional(),
});

const creditSchema = z.object({
  type: z.literal('credits'),
  creditAmount: z.number().min(100).max(100000),
});

const checkoutSchema = z.discriminatedUnion('type', [
  subscriptionSchema,
  creditSchema,
]);

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      throw APIError.internal('Stripe is not configured');
    }

    // Require authentication
    const user = await requireAuth(req);

    // Parse and validate request body
    const input = await parseBody(req, checkoutSchema);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3030';

    if (input.type === 'subscription') {
      const url = await createSubscriptionCheckout({
        userId: user.id,
        email: user.email,
        planId: input.planId,
        billingInterval: input.billingInterval || 'monthly',
        trialLinkCode: input.trialLinkCode,
        successUrl: `${baseUrl}/dashboard/billing?checkout=success&type=subscription`,
        cancelUrl: `${baseUrl}/dashboard/billing?checkout=canceled`,
      });

      return successResponse({ url });
    } else {
      const url = await createCreditPurchaseCheckout({
        userId: user.id,
        email: user.email,
        creditAmount: input.creditAmount,
        successUrl: `${baseUrl}/dashboard/billing?checkout=success&type=credits&amount=${input.creditAmount}`,
        cancelUrl: `${baseUrl}/dashboard/billing?checkout=canceled`,
      });

      return successResponse({ url });
    }
  } catch (error) {
    return errorResponse(error);
  }
}
