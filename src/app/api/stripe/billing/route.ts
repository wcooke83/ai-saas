/**
 * Stripe Billing API
 * Returns invoices, upcoming invoice, and payment methods for the authenticated user
 */

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { isStripeConfigured } from '@/lib/stripe';
import { getCustomerInvoices, getUpcomingInvoice } from '@/lib/stripe/portal';
import { getCustomerPaymentMethods } from '@/lib/stripe/customers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      throw APIError.internal('Stripe is not configured');
    }

    const user = await requireAuth(req);
    const supabase = createAdminClient();

    // Get stripe_customer_id from user_credits (authoritative source)
    const { data: credits } = await supabase
      .from('user_credits')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    const customerId = credits?.stripe_customer_id;

    if (!customerId) {
      // No Stripe customer yet — return empty data
      return successResponse({
        invoices: [],
        upcomingInvoice: null,
        paymentMethods: [],
      });
    }

    // Fetch all billing data in parallel
    const [invoices, upcomingInvoice, paymentMethods] = await Promise.all([
      getCustomerInvoices(customerId, 24),
      getUpcomingInvoice(customerId),
      getCustomerPaymentMethods(customerId),
    ]);

    // Format payment methods for frontend
    const formattedPaymentMethods = paymentMethods.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || 'unknown',
      last4: pm.card?.last4 || '****',
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: false,
    }));

    return successResponse({
      invoices,
      upcomingInvoice,
      paymentMethods: formattedPaymentMethods,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
