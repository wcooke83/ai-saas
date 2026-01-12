/**
 * Stripe Customer Portal Management
 */

import { getStripeClient } from './client';
import { getOrCreateCustomer } from './customers';

interface CreatePortalSessionParams {
  userId: string;
  email: string;
  returnUrl: string;
}

/**
 * Create a Stripe Customer Portal session
 * Allows users to manage their subscription and payment methods
 */
export async function createPortalSession(
  params: CreatePortalSessionParams
): Promise<string> {
  const stripe = getStripeClient();

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer(params.userId, params.email);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: params.returnUrl,
  });

  return session.url;
}

/**
 * Get subscription details from Stripe
 */
export async function getSubscriptionFromStripe(subscriptionId: string) {
  const stripe = getStripeClient();

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'latest_invoice'],
    });

    return subscription;
  } catch {
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
) {
  const stripe = getStripeClient();

  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  // Cancel at period end
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a subscription that was set to cancel
 */
export async function resumeSubscription(subscriptionId: string) {
  const stripe = getStripeClient();

  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Get customer invoices
 */
export async function getCustomerInvoices(
  customerId: string,
  limit = 10
) {
  const stripe = getStripeClient();

  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
    expand: ['data.subscription'],
  });

  return invoices.data.map((invoice) => ({
    id: invoice.id,
    number: invoice.number,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status,
    created: new Date(invoice.created * 1000),
    periodStart: invoice.period_start
      ? new Date(invoice.period_start * 1000)
      : null,
    periodEnd: invoice.period_end
      ? new Date(invoice.period_end * 1000)
      : null,
    pdfUrl: invoice.invoice_pdf,
    hostedUrl: invoice.hosted_invoice_url,
  }));
}

/**
 * Get upcoming invoice preview
 */
export async function getUpcomingInvoice(customerId: string) {
  const stripe = getStripeClient();

  try {
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: customerId,
    });

    return {
      amount: invoice.amount_due,
      currency: invoice.currency,
      periodStart: invoice.period_start
        ? new Date(invoice.period_start * 1000)
        : null,
      periodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000)
        : null,
      lineItems: invoice.lines.data.map((line) => ({
        description: line.description,
        amount: line.amount,
        quantity: line.quantity,
      })),
    };
  } catch {
    return null;
  }
}
