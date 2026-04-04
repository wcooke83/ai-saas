---
name: Onboarding activation events table and tracker
description: Schema and instrumentation points for the onboarding_activation_events table and trackActivationMilestone utility
type: project
---

The `onboarding_activation_events` table was created in migration `20260404250000_onboarding_activation_events.sql`. Columns: `id uuid PK`, `user_id uuid FK profiles`, `milestone text`, `metadata jsonb`, `occurred_at timestamptz`. RLS: service role writes, users can read own rows.

The `profiles` table also received `onboarding_completed_at timestamptz` and `onboarding_step integer DEFAULT 1` in this same migration (may overlap with parallel work; both use `ADD COLUMN IF NOT EXISTS`).

The tracker utility is at `src/lib/onboarding/activation.ts`. It exports:
- `OnboardingMilestone` — union type of all 8 milestone strings
- `trackActivationMilestone(userId, milestone, metadata?)` — never throws, uses admin client, idempotent for ONCE_MILESTONES

**Why:** Dedicated table (vs JSONB in profiles) enables time-series queries and funnel drop-off analysis across all users.

**How to apply:** All milestone writes must go through `trackActivationMilestone`. Never write directly to the table.

## Instrumentation points

| Milestone | Where fired |
|---|---|
| `onboarding_started` | `POST /api/onboarding/start` after chatbot created |
| `chatbot_created` | `POST /api/onboarding/start` (canonical); also `POST /api/chatbots` when `?onboarding=true` or `x-onboarding: true` |
| `knowledge_added` | `POST /api/chatbots/[id]/knowledge` when `?onboarding=true` or `x-onboarding: true` |
| `first_test_message` | `execute-chat.ts` `firePostGenerationEffects` — fires when `isFirstMessage && profiles.onboarding_completed_at IS NULL` |
| `chatbot_deployed` | `PATCH /api/onboarding/[chatbotId]/step` when `step === 5` |
| `onboarding_completed` | `POST /api/onboarding/complete` with `{ milestone: 'completed' }` |
| `onboarding_skipped` | `POST /api/onboarding/complete` with `{ milestone: 'skipped' }` |
| `onboarding_abandoned` | Not yet instrumented — needs client-side `beforeunload` → server call |

## Status route

`GET /api/onboarding/status` returns `{ step, completedAt, milestones: string[], chatbotId }`. Fetches from profiles + onboarding_activation_events + chatbots in parallel.
