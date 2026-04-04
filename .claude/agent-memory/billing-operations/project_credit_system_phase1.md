---
name: Credit System Phase 1 Migration Status
description: Status and key decisions for the credit-based billing schema migrations (Phase 1, additive only)
type: project
---

Phase 1 credit-based billing schema migrations written on 2026-04-04. Files are SQL-only (no code changes).

New tables created: `credit_top_up_packs`, `ltds`, `ltd_redemptions`, `user_credit_top_ups`, `processed_payment_intents`.

New columns added:
- `subscription_plans`: `chatbots_limit`, `knowledge_sources_limit`, `is_ltd`, `stripe_product_id`, `auto_topup_allowed`
- `subscriptions`: `credits_banked`, `ltd_id` (FK to `ltds`)
- `usage`: unique constraint on `user_id`, `purchased_credits_snapshot`, `total_available_snapshot`
- `user_credits`: `lifetime_credits`, `auto_topup_pack_id` (FK to `credit_top_up_packs`)

New RPCs: `get_full_credit_status`, `allocate_monthly_credits`, `process_ltd_redemption`.

Key decisions:
- `usage` dedup logic runs inside a DO $$ block guarded by IF NOT EXISTS on the constraint name.
- `allocate_monthly_credits` reads LTD `credits_monthly` directly from `ltds` table when `subscriptions.ltd_id IS NOT NULL`, overriding the plan value.
- Rollover cap: LTD = 2× monthly, Pro/other rollover-enabled = 1× monthly.
- `process_ltd_redemption` is idempotent via `ON CONFLICT` on `ltd_redemptions(user_id, ltd_id)`.
- Migrations NOT applied to live DB — files only.

**Why:** Laying groundwork for credit-based pricing; code changes to follow in Phase 2.
**How to apply:** When Phase 2 begins, run `npm run db:migrate` to apply these migrations before touching application code.
