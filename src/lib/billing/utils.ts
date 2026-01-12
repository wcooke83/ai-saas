/**
 * Billing utility functions
 */

import type { SubscriptionPlan } from '@/types/billing';

/**
 * Check if a plan has custom/enterprise pricing
 * Custom pricing plans have $0 price and unlimited (-1) credits
 */
export function isCustomPricingPlan(plan: SubscriptionPlan): boolean {
  return plan.price_monthly_cents === 0 && plan.credits_monthly === -1;
}

/**
 * Format price in cents to display string
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Format credits for display
 */
export function formatCredits(credits: number): string {
  if (credits === -1) return 'Unlimited';
  return credits.toLocaleString();
}

/**
 * Format API keys limit for display
 */
export function formatApiKeysLimit(limit: number): string {
  if (limit === -1) return 'Unlimited';
  return limit.toString();
}

/**
 * Sort plans by display_order
 */
export function sortPlansByDisplayOrder(plans: SubscriptionPlan[]): SubscriptionPlan[] {
  return [...plans].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}
