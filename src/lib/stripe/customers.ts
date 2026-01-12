/**
 * Stripe Customer Management
 */

import { getStripeClient } from './client';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string
): Promise<string> {
  const stripe = getStripeClient();
  const supabase = createAdminClient();

  // Check if customer already exists in user_credits table
  const { data: credits } = await supabase
    .from('user_credits')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (credits?.stripe_customer_id) {
    // Verify customer still exists in Stripe
    try {
      await stripe.customers.retrieve(credits.stripe_customer_id);
      return credits.stripe_customer_id;
    } catch {
      // Customer was deleted from Stripe, create new one
    }
  }

  // Also check subscriptions table for legacy customers
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (subscription?.stripe_customer_id) {
    try {
      await stripe.customers.retrieve(subscription.stripe_customer_id);
      // Sync to user_credits table
      await supabase
        .from('user_credits')
        .update({ stripe_customer_id: subscription.stripe_customer_id })
        .eq('user_id', userId);
      return subscription.stripe_customer_id;
    } catch {
      // Customer was deleted from Stripe, create new one
    }
  }

  // Get user profile for name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: profile?.full_name || undefined,
    metadata: {
      user_id: userId,
      source: 'ai-saas-tools',
    },
  });

  // Save customer ID to both tables
  await Promise.all([
    supabase
      .from('user_credits')
      .update({ stripe_customer_id: customer.id })
      .eq('user_id', userId),
    supabase
      .from('subscriptions')
      .update({ stripe_customer_id: customer.id })
      .eq('user_id', userId),
  ]);

  return customer.id;
}

/**
 * Get Stripe customer by ID
 */
export async function getCustomer(customerId: string) {
  const stripe = getStripeClient();
  return stripe.customers.retrieve(customerId);
}

/**
 * Update customer's default payment method
 */
export async function updateCustomerPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<void> {
  const stripe = getStripeClient();
  const supabase = createAdminClient();

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  // Set as default for invoices
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Update in database
  await supabase
    .from('user_credits')
    .update({ default_payment_method_id: paymentMethodId })
    .eq('stripe_customer_id', customerId);
}

/**
 * Get customer's payment methods
 */
export async function getCustomerPaymentMethods(customerId: string) {
  const stripe = getStripeClient();

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(paymentMethodId: string) {
  const stripe = getStripeClient();
  return stripe.paymentMethods.detach(paymentMethodId);
}
