---
name: VocUI Pricing & Monetization Model
description: Credit-based hybrid subscription model, plan structure, and billing infrastructure details
type: project
---

**Model:** Hybrid subscription + usage (credits). Plans define monthly credit allocations; credits are consumed per chatbot response and knowledge source processing. Top-up packages available as one-time purchases.

**Plan tiers (as of March 2026):** Free, Base, Pro (featured, 14-day trial available), Enterprise (custom/talk-to-sales). Annual billing at 20% discount. Lifetime plans (lifetime_tier1/2/3) exist for AppSumo distribution.

**Plan system is fully runtime-configurable** — no hardcoded prices. Plans live in subscription_plans DB table; admin panel allows CRUD + reorder without code deploys. This is an operational advantage.

**Credit conversion stated in product:** "1-3 credits per typical conversation"; ~50 conversations per 100 credits, ~500 per 1,000 credits.

**Auto-topup** is configurable — user sets a threshold and top-up amount. System also does preemptive topup before exhaustion. This is the most important retention mechanism in the model.

**AppSumo distribution** provides early cash + user base at cost of margin. AppSumo cohort is price-sensitive and has different behavioral profile than recurring subscribers.

**Key pricing weaknesses identified:**
- Credit abstraction is confusing without in-session credit visibility
- No persistent credit counter in sidebar; no usage alerts at 75%/90% thresholds
- Pricing page credit-to-conversations math requires mental work from buyer
- Custom branding removal gated at Enterprise (should be Base+)
- No chatbot count limits clearly communicated on pricing page

**Why:** Pricing is core to conversion and retention strategy. Credit opacity is the most actionable churn risk.

**How to apply:** When advising on pricing changes or credit-related UX, reference the full monetization stack. Auto-topup is underutilized as a retention pitch — surface earlier.
