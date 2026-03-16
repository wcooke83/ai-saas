/**
 * Billing System Types
 */

// Subscription Plan (from database)
export interface SubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  usage_description: string | null;
  price_monthly_cents: number;
  price_yearly_cents: number | null;
  price_lifetime_cents: number | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  credits_monthly: number;
  credits_rollover: boolean;
  rate_limit_tokens: number | null;
  rate_limit_period_seconds: number | null;
  rate_limit_is_hard_cap: boolean;
  features: Record<string, boolean | string>;
  api_keys_limit: number;
  trial_days: number;
  trial_credits: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_hidden: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Trial Link
export interface TrialLink {
  id: string;
  code: string;
  plan_id: string;
  duration_days: number;
  credits_limit: number | null;
  features_override: Record<string, boolean | string> | null;
  max_redemptions: number | null;
  redemptions_count: number;
  expires_at: string | null;
  is_active: boolean;
  name: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Trial Link with Plan details
export interface TrialLinkWithPlan extends TrialLink {
  plan: SubscriptionPlan | null;
}

// Trial Redemption
export interface TrialRedemption {
  id: string;
  trial_link_id: string;
  user_id: string;
  redeemed_at: string;
  expires_at: string;
  status: 'active' | 'converted' | 'expired' | 'cancelled';
  converted_at: string | null;
}

// User Credits
export interface UserCredits {
  id: string;
  user_id: string;
  purchased_credits: number;
  bonus_credits: number;
  auto_topup_enabled: boolean;
  auto_topup_threshold: number;
  auto_topup_amount: number;
  auto_topup_max_monthly: number | null;
  auto_topup_this_month: number;
  auto_topup_month_start: string | null;
  stripe_customer_id: string | null;
  default_payment_method_id: string | null;
  created_at: string;
  updated_at: string;
}

// Credit Transaction
export interface CreditTransaction {
  id: string;
  user_id: string;
  type:
    | 'plan_allocation'
    | 'purchase'
    | 'auto_topup'
    | 'usage'
    | 'refund'
    | 'bonus'
    | 'expiry'
    | 'adjustment';
  amount: number;
  balance_after: number | null;
  credit_source: 'plan' | 'purchased' | 'bonus' | null;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  related_usage_id: string | null;
  related_model_id: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Credit Balance (computed)
export interface CreditBalance {
  planAllocation: number;
  planUsed: number;
  planRemaining: number;
  purchasedCredits: number;
  bonusCredits: number;
  totalAvailable: number;
  isUnlimited: boolean;
}

// Rate Limit Status
export interface RateLimitStatus {
  tokensLimit: number;
  tokensUsed: number;
  tokensRemaining: number;
  windowSeconds: number;
  resetAt: Date;
  isHardCap: boolean;
  isUnlimited: boolean;
}

// Effective Plan (considering trials)
export interface EffectivePlan {
  planId: string;
  planSlug: string;
  planName: string;
  creditsMonthly: number;
  rateLimitTokens: number | null;
  rateLimitPeriodSeconds: number | null;
  rateLimitIsHardCap: boolean;
  features: Record<string, boolean | string>;
  isTrial: boolean;
  trialExpiresAt: Date | null;
  billingStatus: string;
}

// Auto Top-up Settings
export interface AutoTopupSettings {
  enabled: boolean;
  threshold: number;
  amount: number;
  maxMonthly: number | null;
  thisMonth: number;
  hasPaymentMethod: boolean;
}

// Stripe-related types
export interface CheckoutSessionParams {
  type: 'subscription' | 'credits';
  planId?: string;
  billingInterval?: 'monthly' | 'yearly';
  trialLinkCode?: string;
  creditAmount?: number;
}

export interface SubscriptionDetails {
  id: string;
  userId: string;
  planId: string | null;
  plan: SubscriptionPlan | null;
  status: string;
  billingInterval: 'monthly' | 'yearly';
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

// Billing page data
export interface BillingPageData {
  subscription: SubscriptionDetails;
  credits: CreditBalance;
  autoTopup: AutoTopupSettings;
  rateLimit: RateLimitStatus;
  effectivePlan: EffectivePlan;
  recentTransactions: CreditTransaction[];
}

// Plan comparison for pricing page
export interface PlanComparison {
  plans: SubscriptionPlan[];
  features: {
    key: string;
    label: string;
    values: Record<string, boolean | string>;
  }[];
}

// Input types for mutations
export interface CreateTrialLinkInput {
  code: string;
  planId: string;
  durationDays: number;
  creditsLimit?: number;
  featuresOverride?: Record<string, boolean | string>;
  maxRedemptions?: number;
  expiresAt?: string;
  name?: string;
  description?: string;
}

export interface UpdatePlanInput {
  slug?: string;
  name?: string;
  description?: string;
  usageDescription?: string;
  priceMonthly?: number;
  priceYearly?: number;
  priceLifetime?: number;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  creditsMonthly?: number;
  creditsRollover?: boolean;
  rateLimitTokens?: number;
  rateLimitPeriodSeconds?: number;
  rateLimitIsHardCap?: boolean;
  features?: Record<string, boolean | string>;
  apiKeysLimit?: number;
  trialDays?: number;
  trialCredits?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isHidden?: boolean;
  displayOrder?: number;
}

export interface PurchaseCreditsInput {
  amount: number;
  successUrl?: string;
  cancelUrl?: string;
}

export interface UpdateAutoTopupInput {
  enabled?: boolean;
  threshold?: number;
  amount?: number;
  maxMonthly?: number | null;
}

// License Key (for AppSumo / marketplace redemption)
export interface LicenseKey {
  id: string;
  key: string;
  source: string;
  plan_slug: string;
  max_redemptions: number;
  redemptions_count: number;
  tier: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// License Key Redemption
export interface LicenseKeyRedemption {
  id: string;
  license_key_id: string;
  user_id: string;
  redeemed_at: string;
  previous_plan_slug: string | null;
  new_plan_slug: string;
  stacked_tier: number;
}

// Redeem License Key Response
export interface RedeemLicenseKeyResponse {
  planSlug: string;
  planName: string;
  tier: number;
  message: string;
}
