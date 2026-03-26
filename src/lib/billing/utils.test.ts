import { describe, it, expect } from 'vitest';
import {
  isCustomPricingPlan,
  formatPrice,
  formatCredits,
  formatApiKeysLimit,
  sortPlansByDisplayOrder,
} from './utils';
import type { SubscriptionPlan } from '@/types/billing';

function makePlan(overrides: Partial<SubscriptionPlan> = {}): SubscriptionPlan {
  return {
    id: 'plan-1',
    slug: 'test-plan',
    name: 'Test Plan',
    description: null,
    usage_description: null,
    price_monthly_cents: 1999,
    price_yearly_cents: null,
    price_lifetime_cents: null,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    credits_monthly: 1000,
    credits_rollover: false,
    rate_limit_tokens: null,
    rate_limit_period_seconds: null,
    rate_limit_is_hard_cap: false,
    features: {},
    api_keys_limit: 3,
    trial_days: 0,
    trial_credits: null,
    is_active: true,
    is_featured: false,
    is_hidden: false,
    display_order: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    ...overrides,
  };
}

describe('isCustomPricingPlan', () => {
  it('returns true for $0 price and unlimited credits', () => {
    expect(isCustomPricingPlan(makePlan({ price_monthly_cents: 0, credits_monthly: -1 }))).toBe(true);
  });

  it('returns false for $0 price but limited credits', () => {
    expect(isCustomPricingPlan(makePlan({ price_monthly_cents: 0, credits_monthly: 100 }))).toBe(false);
  });

  it('returns false for priced plan with unlimited credits', () => {
    expect(isCustomPricingPlan(makePlan({ price_monthly_cents: 999, credits_monthly: -1 }))).toBe(false);
  });

  it('returns false for regular paid plan', () => {
    expect(isCustomPricingPlan(makePlan())).toBe(false);
  });
});

describe('formatPrice', () => {
  it('formats 0 cents', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats 100 cents as $1.00', () => {
    expect(formatPrice(100)).toBe('$1.00');
  });

  it('formats 1999 cents as $19.99', () => {
    expect(formatPrice(1999)).toBe('$19.99');
  });

  it('formats 50 cents', () => {
    expect(formatPrice(50)).toBe('$0.50');
  });

  it('formats large amounts', () => {
    expect(formatPrice(99900)).toBe('$999.00');
  });
});

describe('formatCredits', () => {
  it('returns "Unlimited" for -1', () => {
    expect(formatCredits(-1)).toBe('Unlimited');
  });

  it('formats normal numbers', () => {
    expect(formatCredits(1000)).toBe('1,000');
  });

  it('formats zero', () => {
    expect(formatCredits(0)).toBe('0');
  });

  it('formats large numbers with locale formatting', () => {
    expect(formatCredits(1000000)).toBe('1,000,000');
  });
});

describe('formatApiKeysLimit', () => {
  it('returns "Unlimited" for -1', () => {
    expect(formatApiKeysLimit(-1)).toBe('Unlimited');
  });

  it('returns string number for normal values', () => {
    expect(formatApiKeysLimit(5)).toBe('5');
  });

  it('handles zero', () => {
    expect(formatApiKeysLimit(0)).toBe('0');
  });
});

describe('sortPlansByDisplayOrder', () => {
  it('sorts by display_order ascending', () => {
    const plans = [
      makePlan({ name: 'C', display_order: 3 }),
      makePlan({ name: 'A', display_order: 1 }),
      makePlan({ name: 'B', display_order: 2 }),
    ];
    const sorted = sortPlansByDisplayOrder(plans);
    expect(sorted.map((p) => p.name)).toEqual(['A', 'B', 'C']);
  });

  it('does not mutate original array', () => {
    const plans = [
      makePlan({ name: 'B', display_order: 2 }),
      makePlan({ name: 'A', display_order: 1 }),
    ];
    sortPlansByDisplayOrder(plans);
    expect(plans[0].name).toBe('B');
  });

  it('treats null display_order as 0', () => {
    const plans = [
      makePlan({ name: 'B', display_order: 1 }),
      makePlan({ name: 'A', display_order: undefined as unknown as number }),
    ];
    const sorted = sortPlansByDisplayOrder(plans);
    expect(sorted[0].name).toBe('A');
  });
});
