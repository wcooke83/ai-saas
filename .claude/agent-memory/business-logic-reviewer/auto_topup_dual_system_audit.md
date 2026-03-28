---
name: Auto top-up dual system audit
description: Two separate auto-topup systems exist — user-level (billing page) and chatbot-level (credit exhaustion fallback). They operate on different credit pools and have a critical disconnect where the settings page doesn't write auto_topup_package_id.
type: project
---

## Two Auto Top-up Systems

**System 1 (User-level):** AutoTopupSettings on /dashboard/billing. Stored in `user_credits` table. Uses `should_auto_topup` RPC + `createAutoTopupPayment`. Operates on user's global purchased credits via `add_purchased_credits` RPC.

**System 2 (Chatbot-level):** Credit Exhaustion Fallback on per-chatbot settings. Stored in `chatbots.auto_topup_package_id` + `credit_exhaustion_config.purchase_credits`. Uses `attemptAutoTopup` from `src/lib/chatbots/auto-topup.ts`. Operates on chatbot-level `purchased_credits_remaining` via `add_chatbot_purchased_credits` RPC.

**Why:** These are genuinely separate credit pools (user vs chatbot), but the chatbot settings page DOES NOT write `auto_topup_package_id` — only saves inside JSON config. The `auto-topup.ts` reads the column, creating a disconnect.

**How to apply:** When reviewing credit/billing changes, check whether both systems are affected. The column vs JSON mismatch is the highest-priority fix.
