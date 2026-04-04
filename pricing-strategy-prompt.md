# VocUI Pricing & Packaging Strategy Prompt

Using the billing-operations, business-analyst, business-logic-reviewer, and any other relevant agents in parallel where possible:

## Context

VocUI is an AI chatbot platform where users build custom chatbots trained on their own knowledge bases (URLs, PDFs, docs) and deploy via embeddable widgets, Slack, or Telegram. We use Stripe for billing with Supabase for usage tracking.

## Task

Design a complete pricing and packaging strategy covering:

### 1. Tier Structure

Define 3-4 subscription tiers (e.g., Free, Starter, Pro, Enterprise). For each tier, specify:

- Monthly and annual pricing (with annual discount)
- **Monthly credit allocation** (AI message credits, knowledge indexing credits, document export credits) and what each credit maps to in terms of actual usage (e.g., 1 credit = 1 AI response, 5 credits = 1 PDF page indexed)
- Feature gates (number of chatbots, knowledge sources, integrations, branding removal, API access, priority support)
- Hard limits vs. soft limits (what gets blocked vs. what triggers overage/upsell)
- **Credit rollover policy** (do unused credits expire monthly or accumulate?)

### 2. Usage-Based / Credit Top-Up Components

Define:

- **Credit pack pricing** (e.g., buy 500 additional credits for $X)
- Which actions consume credits and their cost weight (e.g., GPT-4o response = 1 credit, Claude Opus response = 3 credits, knowledge re-index = 5 credits)
- **Credit depletion UX** — what happens when a user runs out mid-month (hard block, grace period, auto-purchase option)
- Overage pricing for metered features beyond credit packs

### 3. Marketplace / Lifetime Deal Plans

Design special plans for platforms like AppSumo, StackSocial, and PitchGround:

- Lifetime deal tiers (what's included, what's capped)
- How these map to internal subscription records in Stripe/Supabase
- Guardrails to prevent abuse while honoring the deal
- **Credit allocation for lifetime deals** (monthly credit refresh amount, any caps on accumulation)

### 4. Implementation Considerations

Review our existing `subscriptions`, `usage`, and `profiles` tables and Stripe integration. Flag any schema changes, new Stripe products/prices, or webhook logic needed to support this plan.

### 5. Competitive Positioning

Briefly benchmark against comparable platforms (Chatbase, Botpress, CustomGPT, Dante AI) to validate pricing is competitive.

## Output Requirements

- Deliver a structured recommendation document with **specific numbers**, not just frameworks
- Include a **summary table of all tiers side-by-side**
- Include a **credit cost matrix** showing credit consumption per action type
