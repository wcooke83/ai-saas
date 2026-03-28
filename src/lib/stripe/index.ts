/**
 * Stripe Integration Library
 *
 * Provides a complete Stripe integration for:
 * - Subscription management
 * - One-time credit purchases
 * - Customer portal
 * - Webhook handling
 */

export { getStripeClient, isStripeConfigured, getPublishableKey } from './client';
export {
  getOrCreateCustomer,
  getCustomer,
  updateCustomerPaymentMethod,
  getCustomerPaymentMethods,
  deletePaymentMethod,
} from './customers';
export {
  createSubscriptionCheckout,
  changeSubscription,
  createCreditPurchaseCheckout,
  createAutoTopupPayment,
} from './checkout';
export type { SubscriptionChangeResult } from './checkout';
export {
  createPortalSession,
  getSubscriptionFromStripe,
  cancelSubscription,
  resumeSubscription,
  getCustomerInvoices,
  getUpcomingInvoice,
} from './portal';
export {
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from './webhooks';
