---
name: Billing architecture and subscription flow locations
description: Maps key billing/subscription files, the upgrade/downgrade flow, and audit findings from 2026-03-29
type: project
---

## Key billing files

- `src/lib/stripe/checkout.ts` — `createSubscriptionCheckout()` for new subs, `changeSubscription()` for upgrade/downgrade via `stripe.subscriptions.update()`
- `src/lib/stripe/webhooks.ts` — handles all Stripe webhook events (checkout.completed, subscription.updated/deleted, invoice.paid/failed)
- `src/lib/stripe/portal.ts` — Stripe customer portal, cancel/resume subscription, invoices
- `src/lib/stripe/customers.ts` — Stripe customer CRUD, payment method management
- `src/app/api/stripe/webhook/route.ts` — webhook route with signature verification + idempotency via stripe_events table
- `src/app/api/stripe/checkout/route.ts` — checkout API route, routes upgrade/downgrade to changeSubscription()
- `src/app/api/billing/upgrade/route.ts` — proration preview using `stripe.invoices.retrieveUpcoming()`
- `src/app/(authenticated)/dashboard/upgrade/page.tsx` — upgrade UI

## Subscription tiers

Plans stored in `subscription_plans` table. Known slugs: base, pro, enterprise, lifetime_tier1/2/3. Base = free tier.

## Critical fix applied 2026-03-29

Replaced broken Checkout Session-based upgrade flow (which created duplicate subscriptions) with `stripe.subscriptions.update()`. This fixed the double-billing bug.

**Why:** The old flow created a NEW Stripe subscription via Checkout but never canceled the old one, causing double-billing.

## Remaining issues found in 2026-03-29 audit

1. **CRITICAL: Downgrade is immediate, not deferred.** `proration_behavior: 'none'` with `billing_cycle_anchor: 'unchanged'` changes the price immediately -- it just skips proration. The return value claims `effectiveAt: 'period_end'` but that's incorrect. Needs Stripe Subscription Schedules or local scheduling for true deferral.

2. **CRITICAL: Webhook usage reset triggers on every subscription update.** `handleSubscriptionUpdated` checks `subscription.metadata.plan_id` to detect plan changes, but this metadata persists after being set. Any subsequent subscription.updated event (payment method change, etc.) re-triggers usage reset (`credits_used: 0`). Must compare metadata plan_id against DB plan_id before acting.

3. **WARNING: No subscription status check before changing.** `changeSubscription()` doesn't verify the subscription is active before calling `stripe.subscriptions.update()`.

4. **WARNING: Orphaned pending subscription_changes records.** The insert happens before the Stripe API call; if Stripe throws, the record stays pending forever.

**How to apply:** These issues must be fixed before the upgrade/downgrade flow is production-safe. The two critical issues compound -- fixing them together likely requires deferral logic plus smarter plan-change detection in the webhook.
