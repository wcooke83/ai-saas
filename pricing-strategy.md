# VocUI Pricing & Packaging Strategy

**Date:** April 4, 2026  
**Status:** Recommended (not yet implemented)

---

## Executive Summary

VocUI competes in the AI knowledge-base chatbot market against Chatbase, Dante AI, CustomGPT, and Botpress. The recommended positioning is **good-value mid-market**: undercut Chatbase/Dante at the entry tier, and dramatically undercut at the Pro tier by including features (branding removal, API access, multi-channel) that competitors gate behind $150–$400/mo plans.

The key strategic move: **price Pro at $79/mo** — delivering feature parity with Chatbase's effective $189/mo (plan + branding add-on) and Dante's $400/mo API tier. Multi-channel deployment (Slack + Telegram + widget) on all paid plans is VocUI's strongest packaging differentiator.

---

## 1. Tier Structure

### Summary Table

| | **Free** | **Base** | **Pro** ⭐ | **Enterprise** |
|---|---|---|---|---|
| **Monthly price** | $0 | $29/mo | $79/mo | $249/mo |
| **Annual price** | — | $24/mo ($290/yr) | $66/mo ($790/yr) | $207/mo ($2,490/yr) |
| **Annual discount** | — | 17% | 17% | 17% |
| **Chatbot messages/mo** | 50 | 1,000 | 5,000 | 25,000 |
| **Dashboard credits/mo** | 25 | 250 | 1,500 | Unlimited |
| **Chatbots** | 1 | 3 | 10 | Unlimited |
| **Knowledge sources** | 3 | 10 | Unlimited | Unlimited |
| **Max pages per source** | 25 | 250 | 2,500 | Unlimited |
| **File size limit** | 5 MB | 10 MB | 25 MB | 100 MB |
| **Deploy: Widget** | ✅ | ✅ | ✅ | ✅ |
| **Deploy: Slack** | ❌ | ✅ | ✅ | ✅ |
| **Deploy: Telegram** | ❌ | ✅ | ✅ | ✅ |
| **Deploy: WhatsApp / Discord / Teams** | ❌ | ❌ | ✅ | ✅ |
| **Branding removal** | ❌ | ❌ | ✅ | ✅ |
| **API access** | ❌ | ❌ | ✅ | ✅ |
| **Zapier integration** | ❌ | ❌ | ✅ | ✅ |
| **Custom webhooks** | ❌ | ✅ (3) | ✅ (20) | Unlimited |
| **Analytics** | Basic | Standard | Full + export | Full + export |
| **Article generation** | ❌ | ❌ | ✅ | ✅ |
| **Translation** | ❌ | ❌ | ✅ | ✅ |
| **Lead capture forms** | ✅ | ✅ | ✅ | ✅ |
| **Human handoff** | ❌ | ❌ | ✅ | ✅ |
| **Team seats** | 1 | 2 | 5 | 15 |
| **Priority support** | ❌ | ❌ | ❌ | ✅ |
| **SLA** | — | — | — | 99.9% uptime |
| **Credit rollover** | No | No | Yes (up to 1 month) | Yes (up to 3 months) |
| **Auto top-up** | ❌ | ✅ | ✅ | ✅ |

---

### Tier Rationale

**Free** — Discovery tier, not a usable product. The hard chatbot message limit (50/mo) and single chatbot will push serious evaluators to convert. No Slack/Telegram so there's a clear reason to upgrade beyond vanity. The 25-credit dashboard budget is enough to try article generation once (costs 5 credits) but not build a workflow.

**Base ($29)** — Undercuts Chatbase ($40) and Dante ($40) while offering 3 chatbots vs their 1–2. Multi-channel (Slack + Telegram) is the decisive purchase trigger at this tier — no competitor at $29 offers this. This is the SMB / solo operator tier.

**Pro ($79)** — The flagship tier. Branding removal + API access + all channels + article generation at $79 undercuts:
- Chatbase: $150/mo plan + $39/mo branding add-on = **$189 effective**
- Dante AI: API access requires **$400/mo**
- CustomGPT: $499/mo for comparable storage and API access
This tier wins on ROI for marketing agencies, SaaS tools, and multi-brand operators. Annual plan ($790/yr) should be prominently featured.

**Enterprise ($249)** — Positioned vs Chatbase Pro ($500), Dante Pro ($400), and Botpress Team ($495). Unlimited chatbots + 25,000 messages makes this viable for high-volume support deployments. Custom pricing negotiation available above 50,000 messages/mo.

---

### Hard vs. Soft Limits

| Limit Type | Behavior |
|---|---|
| **Chatbot messages (monthly quota exhausted)** | Hard block. Chatbot enters fallback mode (configurable: contact form, ticket, purchase more). No silent fail. |
| **Dashboard credits exhausted** | Hard block on generation. Auto top-up fires if configured. Otherwise 402 with purchase prompt. |
| **Chatbot count exceeded** | Hard block at creation. Existing chatbots continue working. |
| **Knowledge source count exceeded** | Hard block at creation. Existing sources continue. |
| **File size exceeded** | Hard block at upload with clear error. |
| **Grace period (payment failed)** | 7-day soft access. All features work. Warning banner shown. After 7 days → Free tier limits enforced. |
| **Trial expiry** | Hard downgrade to Free. |

---

### Credit Rollover Policy

| Tier | Plan Credits | Purchased Credits |
|---|---|---|
| Free | Expire monthly (no rollover) | N/A (can't purchase) |
| Base | Expire monthly (no rollover) | Roll over indefinitely |
| Pro | Roll over up to 1× monthly allocation (1,500 max banked) | Roll over indefinitely |
| Enterprise | Roll over up to 3× monthly allocation (4,500 max banked) | Roll over indefinitely |
| Lifetime Deals | Roll over up to 2× monthly allocation | Roll over indefinitely |

Rollover for plan credits is processed at `invoice.paid` (monthly renewal): unused plan credits are converted to purchased credits up to the cap, then the new allocation is granted fresh.

---

## 2. Usage-Based / Credit Top-Up Components

### What Is a "Credit"?

**Dashboard credits** govern AI-powered tool usage in the dashboard (article generation, translations, AI responses via API keys, document exports). 1 credit ≈ $0.01 of AI compute. This is separate from chatbot message quotas.

**Chatbot messages** govern widget/Slack/Telegram conversations. 1 message = 1 full conversation turn (user message + AI response). Modeled independently because chatbot volume is far higher than dashboard tool usage.

### Credit Cost Matrix

#### Dashboard Credit Costs

| Action | Credit Cost | Notes |
|---|---|---|
| **AI response (standard model — Haiku / GPT-3.5)** | 1 credit | Default for most tool generations |
| **AI response (balanced model — Sonnet / GPT-4o)** | 2 credits | Longer or more complex outputs |
| **AI response (premium model — Opus / GPT-4)** | 5 credits | High-quality rewrites, analysis |
| **Article generation (per article)** | 5 credits | Uses balanced model by default |
| **Article generation from URL (per article)** | 3 credits | Pre-retrieved context, cheaper |
| **Translation (per language, per form)** | 3 credits | Translates all strings in a chatbot form |
| **Knowledge indexing — URL (per 10 pages crawled)** | 1 credit | Covers embedding + chunking |
| **Knowledge indexing — document (per 10 pages)** | 1 credit | PDF/DOCX extraction + embedding |
| **Knowledge re-index (full chatbot)** | 5 credits + 1 per 10 pages | Rebuilds all chunks and embeddings |
| **Document export — PDF** | 2 credits | Via react-pdf renderer |
| **Document export — DOCX** | 2 credits | Via docx library |
| **Sentiment analysis** | 0 credits | Bundled, runs passively every 5th message |
| **Memory extraction** | 0 credits | Bundled, runs post-conversation |
| **API key request (per authenticated call)** | Same as action type | Inherits cost of underlying operation |

#### Chatbot Message Quota (System 2 — separate)

| Tier | Messages/mo | Overage behavior |
|---|---|---|
| Free | 50 total | Hard block. Chatbot enters fallback mode. |
| Base | 1,000 total across chatbots | Hard block → purchase credits prompt |
| Pro | 5,000 total across chatbots | Hard block → auto top-up if configured |
| Enterprise | 25,000 total across chatbots | Hard block → auto top-up |

Chatbot messages can also be topped up per-chatbot using **Chatbot Credit Packs** (the existing System 2 mechanism). These are independent of dashboard credits.

---

### Credit Pack Pricing (Dashboard Credits)

| Pack | Credits | Price | Effective CPM | Bonus |
|---|---|---|---|---|
| **Starter** | 100 credits | $5.00 | $50/1k credits | — |
| **Growth** | 500 credits | $20.00 | $40/1k credits | +10% (550 total) |
| **Scale** | 2,000 credits | $60.00 | $30/1k credits | +20% (2,400 total) |
| **Agency** | 10,000 credits | $200.00 | $20/1k credits | +25% (12,500 total) |

Bonus credits are granted immediately on purchase, roll over indefinitely (never expire), and are consumed after plan credits are exhausted.

**Chatbot Message Pack Pricing** (for widget conversations):

| Pack | Messages | Price |
|---|---|---|
| 200 messages | 200 | $5.00 |
| 1,000 messages | 1,000 | $20.00 |
| 5,000 messages | 5,000 | $75.00 |

---

### Auto Top-Up

Available on Base, Pro, and Enterprise plans. Users configure:
- **Trigger threshold:** When remaining credits drop below N (default: 20% of monthly allocation)
- **Pack to purchase:** One of the 4 credit packs above
- **Monthly spend cap:** Maximum auto top-up spend per month (default: $60)

Auto top-up fires atomically during a failed credit deduction. If the Stripe off-session payment fails (card declined, 3DS required), the user is notified by email and the operation is blocked with a 402 response showing a payment update link.

---

### Credit Depletion UX

When credits are exhausted mid-operation:

1. **API returns HTTP 402** with structured body:
   ```json
   {
     "error": "insufficient_credits",
     "available": 0,
     "needed": 2,
     "auto_topup_configured": false,
     "topup_packs": [{ "id": "...", "credits": 100, "price_cents": 500 }]
   }
   ```

2. **In the dashboard:** A modal appears with credit balance, top-up options, and a one-click purchase flow. No redirect — inline Stripe Checkout (payment element).

3. **Chatbot widget:** On message quota exhaustion, the widget switches to the configured fallback mode (`credit_exhaustion_mode`): show contact form, create support ticket, display purchase link, or show a knowledge-base article. The fallback mode is configured per-chatbot.

4. **Warning banners** (threshold-based, not blocking):
   - 75% of plan credits used → in-app banner
   - 90% of plan credits used → in-app banner + email notification
   - 100% exhausted → blocking modal in dashboard

---

## 3. Marketplace / Lifetime Deal Plans

### Recommended LTD Tiers (for AppSumo / PitchGround / StackSocial)

| | **LTD Tier 1** | **LTD Tier 2** | **LTD Tier 3** |
|---|---|---|---|
| **One-time price** | $59 | $149 | $299 |
| **Equivalent to** | Between Free and Base | Base | Pro |
| **Chatbot messages/mo** | 500 | 2,000 | 5,000 |
| **Dashboard credits/mo** | 100 | 500 | 1,500 |
| **Chatbots** | 2 | 5 | 10 |
| **Knowledge sources** | 5 | 25 | Unlimited |
| **Max pages per source** | 100 | 500 | 2,500 |
| **Deploy: Widget + Slack** | ✅ | ✅ | ✅ |
| **Deploy: Telegram** | ❌ | ✅ | ✅ |
| **Deploy: WhatsApp/Discord/Teams** | ❌ | ❌ | ✅ |
| **Branding removal** | ❌ | ❌ | ✅ |
| **API access** | ❌ | ❌ | ✅ |
| **Article generation** | ❌ | ❌ | ✅ |
| **Team seats** | 1 | 2 | 5 |
| **Credit rollover** | Up to 2× monthly | Up to 2× monthly | Up to 2× monthly |
| **Max redemptions** | 500 | 350 | 200 |

**AppSumo benchmarks for context:** Chatbase LTD (expired 2023): $29–$159. Comparable tools (Tiny Talk, Answerly, Noem.ai) run $49–$79 for Tier 1. VocUI's $59 Tier 1 is appropriately priced given multi-channel deployment.

---

### How LTDs Map to Internal Records

LTD purchases create a **one-time Stripe payment** (not a recurring subscription):

```
Stripe Product: prod_ltd_tier1 (one-time, mode: 'payment')
  metadata: { type: 'ltd', ltd_slug: 'ltd_tier1', credits_monthly: '100' }
```

In the database, a redeemed LTD sets:
- `subscriptions.status = 'active'`
- `subscriptions.purchase_source = 'ltd'` (or 'appsumo')
- `subscriptions.stripe_subscription_id = NULL` (no recurring subscription)
- `subscriptions.ltd_id` → links to `ltds` table row
- `subscriptions.current_period_end = NULL` (never expires)

Monthly credits are allocated by a **cron job** (not Stripe `invoice.paid`), because LTDs have no invoices. The cron queries all rows where `purchase_source IN ('ltd', 'appsumo')` and `status = 'active'` and allocates credits if not yet allocated for the current calendar month.

**AppSumo / marketplace redemptions** that don't go through Stripe use a license key redemption flow:
1. User enters their AppSumo license key on `/dashboard/billing/redeem`
2. Server validates against an external order ID list seeded from the marketplace's webhook
3. Calls `process_ltd_redemption(userId, ltdId, null, externalOrderId)` RPC
4. `subscriptions.purchase_source = 'appsumo'`

---

### Guardrails Against Abuse

| Abuse Vector | Guardrail |
|---|---|
| Creating multiple accounts to stack LTDs | One LTD redemption per `(user_id, ltd_id)` unique constraint. Email domain deduplication check on redemption. |
| Exceeding the deal's feature scope | `is_ltd = true` plan records have hard-coded chatbot/knowledge limits that are NOT overridable by admin. |
| Treating LTD as unlimited compute | LTD monthly credits cap is enforced identically to paid plans. No exceptions. |
| Downgrade-proof abuse (expecting unlimited after marketplace pulls deal) | `subscriptions.purchase_source` field preserved. `handleSubscriptionDeleted` webhook skips LTD records (no Stripe subscription to cancel). Revocation requires admin action: set `ltd_redemptions.status = 'revoked'` → triggers cron to downgrade to Free. |
| Accumulating unlimited banked credits | LTD rollover cap: 2× monthly allocation. Excess is discarded at month start (not purchased credits — those persist). |

---

### Strategic Recommendation on Running LTDs

Run a **one-time AppSumo launch** (ideally 60-day window, capped at 1,000 total redemptions) for:
- User acquisition for social proof and early reviews
- SEO signal from AppSumo backlinks
- Beta feedback cohort

**Do not** run recurring LTDs as a revenue strategy. LTD users generate no MRR and create disproportionate support load. After the launch window, close redemptions and migrate to standard plans only.

---

## 4. Implementation Considerations

### Current State — Critical Gaps

From the codebase audit, the following enforcement gaps exist in the current system before implementing a new pricing structure:

| Gap | Risk | Priority |
|---|---|---|
| **Branding removal (`showBranding`) not enforced server-side** | Free users can send a PATCH request to disable branding without a paid plan | CRITICAL |
| **API key creation limit not enforced** | Any user can create unlimited API keys regardless of plan | CRITICAL |
| **`checkSubscriptionStatus()` is never called** | Canceled/unpaid users retain full access indefinitely | CRITICAL |
| **Grace period recorded but never enforced** | `grace_period_ends_at` is set on payment failure but never compared against current time | HIGH |
| **WhatsApp setup plan gate missing** | Free users can configure WhatsApp integration | HIGH |
| **Sentiment analysis, memory extraction, article generation, translation, embedding generation are unmetered** | Direct AI cost with no usage attribution | HIGH |
| **Trial expiration not enforced** | Expired trials retain paid-tier access | MEDIUM |
| **`usage` table has no UNIQUE constraint on `user_id`** | Multiple rows can accumulate per user; queries use `LIMIT 1` which is fragile | MEDIUM |
| **`CHATBOT_PLAN_LIMITS` TypeScript constant not driven by DB** | Plan limits exist in two places that can diverge | MEDIUM |

---

### Schema Changes Required

#### New Tables

| Table | Purpose |
|---|---|
| `credit_top_up_packs` | Catalog of purchasable dashboard credit packs with Stripe price IDs |
| `ltds` | Lifetime deal definitions (credits, price, channel scope) |
| `ltd_redemptions` | Per-user LTD redemption records with external order ID dedup |
| `user_credit_top_ups` | Ledger of all dashboard credit purchases with idempotency on PI ID |
| `processed_payment_intents` | Lightweight dedup table for off-session auto-topup payments |

#### Modifications to Existing Tables

| Table | Changes |
|---|---|
| `subscription_plans` | Add: `chatbots_limit int`, `knowledge_sources_limit int`, `is_ltd bool`, `stripe_product_id text`, `auto_topup_allowed bool`, `credits_per_dollar numeric` |
| `subscriptions` | Add: `ltd_id uuid → ltds.id`, `credits_banked int DEFAULT 0` |
| `usage` | Add: `UNIQUE(user_id)` constraint, `purchased_credits_snapshot int`, `total_available_snapshot int` |
| `user_credits` | Add: `auto_topup_pack_id uuid → credit_top_up_packs.id`, `lifetime_credits int DEFAULT 0` |

#### New RPCs / Database Functions

| Function | Purpose |
|---|---|
| `deduct_user_credits_atomic(user_id, amount, description, metadata)` | Single atomic deduction from plan → purchased → bonus credits in priority order. Returns success/failure with auto-topup signal. |
| `allocate_monthly_credits(user_id)` | Monthly credit reset + rollover logic. Called by `invoice.paid` webhook and LTD cron. |
| `apply_top_up_credits(user_id, credits, bonus, top_up_id, payment_intent_id)` | Apply purchased credits after confirmed payment. |
| `get_full_credit_status(user_id)` | Single-query credit meter data for UI (plan remaining, purchased, bonus, auto-topup config, alert thresholds). |
| `process_ltd_redemption(user_id, ltd_id, payment_intent_id, external_order_id)` | Atomic LTD setup: subscription record, initial credit allocation, ltd_redemptions insert. |

---

### Stripe Products / Prices to Create

#### Subscription Plans (recurring)

| Plan | Monthly Price ID | Annual Price ID | Product metadata |
|---|---|---|---|
| Base | `price_base_monthly` ($29) | `price_base_annual` ($290) | `plan_slug: base, type: subscription` |
| Pro | `price_pro_monthly` ($79) | `price_pro_annual` ($790) | `plan_slug: pro, type: subscription` |
| Enterprise | `price_enterprise_monthly` ($249) | `price_enterprise_annual` ($2,490) | `plan_slug: enterprise, type: subscription` |

Note: Current Pro pricing in the DB is $149/mo. Repricing to $79 requires creating new Stripe Prices (can't modify existing). Existing subscribers on $149 plan should be grandfathered or offered a one-click migration.

#### Credit Top-Up Packs (one-time)

| Pack | Stripe Price ID | Amount |
|---|---|---|
| Starter 100 | `price_credits_starter` | $5.00 |
| Growth 500 | `price_credits_growth` | $20.00 |
| Scale 2,000 | `price_credits_scale` | $60.00 |
| Agency 10,000 | `price_credits_agency` | $200.00 |

Use `mode: 'payment'` in Checkout Session. Store `pack_id` in payment intent metadata for webhook routing.

#### Lifetime Deal (one-time)

| LTD | Stripe Price ID | Amount |
|---|---|---|
| LTD Tier 1 | `price_ltd_tier1` | $59.00 |
| LTD Tier 2 | `price_ltd_tier2` | $149.00 |
| LTD Tier 3 | `price_ltd_tier3` | $299.00 |

Use `mode: 'payment'`. No recurring subscription created in Stripe.

---

### Webhook Logic Changes

#### New Events to Handle

| Event | Action |
|---|---|
| `payment_intent.succeeded` | Route by `metadata.type`: credit top-up → apply credits; auto-topup → apply credits; LTD → process redemption |
| `payment_intent.payment_failed` | Mark `user_credit_top_ups` as failed; notify user if auto-topup |
| `checkout.session.expired` | Clean up pending `user_credit_top_ups` rows |
| `invoice.payment_action_required` | Set `past_due`, send 3DS action email |
| `customer.subscription.trial_will_end` | Send trial expiry email (currently only logged) |

#### Existing Handlers to Update

| Handler | Change |
|---|---|
| `handleCheckoutCompleted` | Add `type === 'ltd'` branch. Standardize metadata routing via `metadata.type` convention. |
| `handleCreditPurchase` | Look up `user_credit_top_ups` by payment intent ID → use DB pack's credits + bonus (not metadata). |
| `handleSubscriptionDeleted` | Guard LTD subscribers (no Stripe sub). Downgrade to `free` not `base`. |
| `handleInvoicePaid` | Call `allocate_monthly_credits` RPC. Use `subscription.current_period_end` for period boundary (not hardcoded 30 days). |

---

### Migration Strategy

**Phase 1 — Additive schema changes (zero-downtime)**
Deploy all new tables and column additions. No code changes. No user impact.

**Phase 2 — Stripe product setup**
Create new products/prices in Stripe dashboard or via admin script. Populate `credit_top_up_packs` and `ltds` tables. Store `stripe_product_id` in `subscription_plans`.

**Phase 3 — Code deploy**
Ship webhook changes, credit deduction changes, and server-side enforcement fixes as a single deploy. The most critical enforcement fixes (branding, API keys, subscription status) should ship here regardless of credit system completion.

**Phase 4 — Data migration**
- Fix `usage` uniqueness (delete duplicates → add UNIQUE constraint)
- Backfill `subscription_plans.chatbots_limit` and `knowledge_sources_limit` from `CHATBOT_PLAN_LIMITS`
- Migrate LTD subscribers to new `ltds` / `ltd_redemptions` tables
- Migrate `user_credits.auto_topup_amount` → `auto_topup_pack_id`

**Phase 5 — Repricing**
If repricing Pro from $149 → $79:
- Create new Stripe Prices at $79
- Communicate change to existing subscribers with ≥30 days notice
- Offer: stay on $149 grandfathered plan OR migrate to new $79 plan (higher credit allocation in return)
- Update `subscription_plans` price columns and Stripe price IDs

**Phase 6 — Retire legacy paths** (after 4-week stabilization)
Remove `CHATBOT_PLAN_LIMITS` constant (read from DB). Remove duplicate `stripe_customer_id` from `subscriptions`. Retire unused `PLAN_LIMITS` constant from `tracker.ts`.

---

## 5. Competitive Positioning

### Side-by-Side Comparison

| | Chatbase | Botpress | CustomGPT | Dante AI | Botsonic | **VocUI (new)** |
|---|---|---|---|---|---|---|
| **Entry paid price** | $40/mo | $89/mo | $99/mo | $40/mo | $19/mo | **$29/mo** |
| **Mid-tier price** | $150/mo + $39 branding = $189 effective | $495/mo | $499/mo | $100/mo (no API) | $49/mo | **$79/mo** |
| **API access gate** | $150/mo | All tiers | All tiers | $400/mo | Advanced | **$79/mo** ✅ |
| **Branding removal gate** | $189/mo effective | $89/mo | $499/mo | $100/mo | Advanced | **$79/mo** ✅ |
| **Slack deployment** | ❌ | ❌ | ❌ | ❌ | ❌ | **$29/mo** ✅ |
| **Telegram deployment** | ❌ | ❌ | ❌ | ❌ | ❌ | **$29/mo** ✅ |
| **WhatsApp deployment** | ❌ | Add-on | ❌ | Add-on | ❌ | **$79/mo** ✅ |
| **Credit model transparency** | Opaque (20x burn for GPT-4) | Hidden AI compute | Flat + expensive add-ons | Good (1:6.5 ratio) | Flat | **1:1 transparent** |
| **LTD / AppSumo** | Expired 2023 | None | None | None | None | **$59–$299** |
| **Free tier** | 50 msg | 500 msg | No (trial only) | 100 credits | Limited | **50 msg** |

### Key Differentiators to Lead With

1. **Multi-channel at $29** — No other platform in this set offers Slack + Telegram at the entry paid tier. This is VocUI's clearest packaging advantage and should be the primary marketing message.

2. **Branding removal + API at $79** — At 2–5× less than competitors for the same feature gates. Lead with "Why pay $150–400/mo for features that should cost $79?"

3. **Transparent 1:1 credit model** — Unlike Chatbase (where GPT-4 burns 20× credits) or Botpress (hidden AI compute billed separately), VocUI's credit model is predictable. Position this explicitly in pricing page copy.

4. **RAG with multiple source types** — URLs, PDFs, DOCX, plain text, Q&A pairs in a unified pipeline. Many competitors support 1–2 source types at entry tiers.

5. **Conversation intelligence** — Sentiment analysis, memory extraction, and analytics are bundled. Competitors charge for these or don't offer them.

---

## Appendix A: Annual Discount Benchmarks

| Competitor | Discount |
|---|---|
| Chatbase | 20% |
| Botpress | 10–17% |
| CustomGPT | 10% |
| Dante AI | 17% |
| Tidio | 17% |
| Botsonic | 16% |
| **Industry average (2026)** | 16–17% |
| **VocUI recommendation** | **17% ("2 months free")** |

Frame as "Pay annually, get 2 months free" — this converts better than showing a percentage.

---

## Appendix B: Feature Gate Implementation Checklist

Before launching new pricing, these server-side gates must be implemented (currently missing):

- [ ] Enforce `showBranding: false` requires Pro plan in `/api/chatbots/[id]` PATCH handler
- [ ] Enforce API key creation limit from `subscription_plans.api_keys_limit`
- [ ] Call `checkSubscriptionStatus()` before AI generation and knowledge processing routes
- [ ] Enforce `grace_period_ends_at` — compare against `now()` in enforcement check
- [ ] Add WhatsApp setup plan gate to `/api/whatsapp/setup`
- [ ] Enforce file size limits per plan in knowledge source upload route
- [ ] Add trial expiration cron / middleware check
- [ ] Fix `usage.user_id` UNIQUE constraint
- [ ] Meter: article generation, translation, and knowledge re-index as credit-consuming actions
- [ ] Implement `/api/credit-alerts/check` route (directory exists, route missing)
