---
name: Billing System State
description: Current state of VocUI billing infrastructure — tables, plans, Stripe IDs, RPCs, dual credit systems, and webhook handlers
type: project
---

## Stripe Product & Price IDs (current — set 2026-04-04)

### Subscription Plans
| Plan | Product ID | Monthly Price ID | Yearly Price ID | Monthly $ | Yearly $ |
|------|-----------|-----------------|----------------|-----------|---------|
| base | `prod_UH3ao4xxJTywSM` | `price_1TIVTpKBacEv0jAiiy9kXr4K` | `price_1TIVTqKBacEv0jAil8xvWcGk` | $29 | $290 |
| pro | `prod_UH3aekMMVUvS9T` | `price_1TIVTrKBacEv0jAiVW4yU3VD` | `price_1TIVTrKBacEv0jAi0docU0Zd` | $79 | $790 |
| enterprise | `prod_UH3aT8xi0O7u3a` | `price_1TIVTsKBacEv0jAi3JCJvLm3` | `price_1TIVTtKBacEv0jAiFgwkzPqO` | $249 | $2490 |

### LTD Plans (stored in subscription_plans with is_ltd=true, price in price_lifetime_cents)
| Plan slug | Product ID | Price ID (one-time) | Price |
|-----------|-----------|---------------------|-------|
| lifetime_tier1 | `prod_UH3aDImwxidAbR` | `price_1TIVTyKBacEv0jAidhNv2qZL` | $59 |
| lifetime_tier2 | `prod_UH3aGK35nHA9Cj` | `price_1TIVTyKBacEv0jAiYWMWXtva` | $149 |
| lifetime_tier3 | `prod_UH3aIbNJLBjWr6` | `price_1TIVTzKBacEv0jAi9UDtcy09` | $299 |

### Credit Top-Up Packs (stored in credit_packages, matched by name — no slug column)
| Name | Credits | Product ID | Price ID | Price |
|------|---------|-----------|---------|-------|
| Starter Pack | 100 | `prod_UH3asIpeeBvMVs` | `price_1TIVTuKBacEv0jAimEHGFOxV` | $5 |
| Growth Pack | 500 | `prod_UH3aB9rPqfMW5m` | `price_1TIVTvKBacEv0jAi2wK8a7vr` | $20 |
| Scale Pack | 2000 | `prod_UH3a69eF1gZBj9` | `price_1TIVTwKBacEv0jAiZwnpejVl` | $60 |
| Agency Pack | 10000 | `prod_UH3aA2oR3BLz0x` | `price_1TIVTwKBacEv0jAifPe50GY0` | $200 |

Note: Old packs (Small/Medium/Large) still exist in credit_packages with old prices. New packs inserted alongside them.

**How to apply:** Use these IDs when creating Checkout Sessions, updating webhook handlers, or referencing plan limits.

## Subscription Tiers (DB: subscription_plans)

Active tiers: `free`, `base`, `pro`, `enterprise`, `lifetime_tier1`, `lifetime_tier2`, `lifetime_tier3`
- Free: $0, `credits_monthly` = 500000 (per PLAN_LIMITS in tracker.ts)
- Base: $29/mo, $290/yr, `credits_monthly` = 250
- Pro: $79/mo, $790/yr, `credits_monthly` = 1500
- Enterprise: $249/mo, $2490/yr, `credits_monthly` = -1 (unlimited)
- LTD Tier 1: $59 one-time, 100 credits/mo, 2 chatbots
- LTD Tier 2: $149 one-time, 500 credits/mo, 5 chatbots
- LTD Tier 3: $299 one-time, 1500 credits/mo, 10 chatbots

All plans support: `price_lifetime_cents` (nullable), `stripe_price_id_monthly`, `stripe_price_id_yearly`, `trial_days`, `trial_credits`, `features` (JSONB), `rate_limit_tokens`, `rate_limit_period_seconds`, `rate_limit_is_hard_cap`, `api_keys_limit`, `credits_rollover`.

## Dual Credit Systems (CRITICAL)

### System 1: User-level credits (subscription tracker)
- **Tables:** `usage` (credits_used, credits_limit, period_start, period_end), `user_credits` (purchased_credits, bonus_credits, auto_topup_*, default_payment_method_id, stripe_customer_id), `credit_transactions` (ledger)
- **RPCs:** `get_credit_balance`, `deduct_credits`, `add_purchased_credits`, `add_bonus_credits`, `should_auto_topup`, `increment_usage`
- **Purpose:** Tracks AI generation usage for dashboard tools (not chatbot widget)
- **Credit unit:** 1 credit = $0.01 = ~1000 tokens (varies by model multiplier)
- Credit deduction priority: plan allocation → purchased → bonus

### System 2: Chatbot-level message quota
- **Columns on chatbots:** `monthly_message_limit`, `messages_this_month`, `purchased_credits_remaining`
- **RPC:** `increment_chatbot_messages` (atomically consumes monthly first, then purchased)
- **Reset:** `reset_monthly_message_counts` (cron job, resets only `messages_this_month`, never `purchased_credits_remaining`)
- **Tables:** `credit_packages` (global platform packages, `is_global=true`), `credit_purchases` (per-chatbot purchase records)
- **Purpose:** Controls the chatbot widget conversation quota
- **CHATBOT_PLAN_LIMITS (code constant, NOT DB):** free=100/mo, pro=10000/mo, agency=unlimited (0 sentinel)
- Auto-topup via `auto-topup.ts`: charges saved payment method off-session when chatbot credits exhausted and `credit_exhaustion_mode='purchase_credits'`

## Webhook Events Handled

Route: `/api/stripe/webhook`
Idempotency: `stripe_events` table (stripe_event_id unique check before processing)

- `checkout.session.completed` → routes to subscription checkout OR user credit purchase OR chatbot credit purchase (by mode + metadata.type)
- `customer.subscription.created` / `customer.subscription.updated` → `handleSubscriptionUpdated` (syncs status, detects plan changes via metadata, resets usage)
- `customer.subscription.deleted` → `handleSubscriptionDeleted` (downgrades to base plan)
- `invoice.paid` → `handleInvoicePaid` (resets usage.credits_used, clears grace period)
- `invoice.payment_failed` → `handleInvoicePaymentFailed` (sets past_due, 7-day grace period)
- `customer.subscription.trial_will_end` → logged only (no handler yet)

NOT HANDLED: `payment_intent.succeeded`, `payment_intent.payment_failed` (off-session auto-topup failures), `charge.dispute.*`, `customer.updated`

## Subscription Flow

- **New subscription:** Stripe Checkout Session → webhook `checkout.session.completed` → updates `subscriptions` table + resets `usage`
- **Upgrade:** `changeSubscription()` → `stripe.subscriptions.update()` with `proration_behavior: 'create_prorations'` → triggers `customer.subscription.updated` webhook
- **Downgrade:** Uses Subscription Schedules to defer to period end
- **Cancellation:** `cancel_at_period_end: true` (default) or immediate
- **Plan changes tracked in:** `subscription_changes` table (pending → completed)

## Key Structural Issues

1. `subscriptions.user_id` has `isOneToOne: true` — one subscription per user
2. `user_credits.user_id` has `isOneToOne: true` — one user_credits row per user
3. `usage` table has NO unique constraint on user_id — allows multiple rows, code uses `ORDER BY created_at DESC LIMIT 1`
4. `stripe_customer_id` stored in BOTH `subscriptions` AND `user_credits` — duplicated, synced manually
5. Grace period logic partially implemented (7-day window set, but `checkSubscriptionStatus` currently allows `past_due` users)
6. `usage.credits_used` was not being incremented by chat API until migration 20260331300000

## Chatbot Auto-Topup

- User must have `credit_exhaustion_mode = 'purchase_credits'` on chatbot
- Spend cap: `auto_topup_max_per_month` (default 3 topups/mo)
- Uses `credit_purchases` table as idempotency guard (pending row = lock)
- Idempotency key pattern: `auto-topup:{chatbotId}:{YYYY-MM}:{count}`
- Payment: off-session PaymentIntent via `stripe.paymentIntents.create({ off_session: true, confirm: true })`

## Supabase Database Functions (RPCs)

Complete list of billing-related RPCs:
- `get_credit_balance(p_user_id)` → plan_allocation, plan_used, plan_remaining, purchased_credits, bonus_credits, total_available
- `deduct_credits(p_user_id, p_amount, p_description?, p_related_model_id?, p_related_usage_id?)` → success, deducted_from, remaining_total
- `add_purchased_credits(p_user_id, p_amount, p_type?, p_payment_intent_id?, p_description?)`
- `add_bonus_credits(p_user_id, p_amount, p_description?)`
- `add_chatbot_purchased_credits(p_chatbot_id, p_amount)`
- `should_auto_topup(p_user_id)` → should_trigger, amount, reason
- `increment_usage(p_user_id, p_amount)`
- `increment_chatbot_messages(p_chatbot_id, p_amount?)` → JSONB with allowed, monthly_remaining, purchased_remaining, source
- `reset_monthly_message_counts()` → resets messages_this_month only
- `count_auto_topups_this_month(p_chatbot_id)`
- `check_rate_limit(p_user_id, p_tokens_requested, p_window_seconds, p_token_limit)`
- `get_rate_limit_status(p_user_id)`
- `reset_plan_credits(p_user_id)`
- `get_effective_plan(p_user_id)` → billing_status, credits_monthly, features, is_trial, plan_id, plan_name, plan_slug, rate limit config
- `change_subscription_plan(p_user_id, p_new_plan_id, p_billing_interval?)`
- `check_subscription_status(p_user_id)` → days_remaining, grace_period_ends_at, grace_period_expired, is_active, is_in_grace_period, is_past_due
- `redeem_license_key(p_key, p_user_id)` → supports LTD key redemption
- `start_subscription_trial(p_user_id, p_plan_id, p_trial_days, p_trial_link_id?)`
