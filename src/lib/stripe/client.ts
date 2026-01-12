/**
 * Stripe Client
 * Singleton instance for server-side Stripe API access
 */

import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

/**
 * Get the Stripe client instance
 * @throws Error if STRIPE_SECRET_KEY is not configured
 */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey || secretKey === 'sk_test_xxx') {
      throw new Error(
        'STRIPE_SECRET_KEY is not configured. Please set up your Stripe keys in .env.local'
      );
    }

    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }

  return stripeClient;
}

/**
 * Check if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return !!secretKey && secretKey !== 'sk_test_xxx';
}

/**
 * Get the publishable key for client-side usage
 */
export function getPublishableKey(): string | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return key && key !== 'pk_test_xxx' ? key : null;
}
