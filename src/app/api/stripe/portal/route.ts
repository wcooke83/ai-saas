/**
 * Stripe Customer Portal API
 * Redirects users to Stripe's customer portal for subscription management
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createPortalSession, isStripeConfigured } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      throw APIError.internal('Stripe is not configured');
    }

    // Require authentication
    const user = await requireAuth(req);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3030';
    const returnUrl = `${baseUrl}/dashboard/billing`;

    const url = await createPortalSession({
      userId: user.id,
      email: user.email,
      returnUrl,
    });

    return successResponse({ url });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  // Also support POST for form submissions
  return GET(req);
}
