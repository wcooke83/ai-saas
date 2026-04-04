---
name: Push notification infrastructure plan
description: Agent Console mobile push notification design decisions, schema, and integration points
type: project
---

## Decision: Use Expo Push Notification Service (EPNS), not direct APNs/FCM

No native mobile build infrastructure exists in this repo. Expo abstracts both APNs and FCM with a single HTTP API and handles platform credential management.

**Why:** Direct APNs/FCM requires managing two sets of platform certificates/keys, two separate send implementations, and platform-specific error handling. EPNS wraps both behind one endpoint and one token format (`ExponentPushToken[...]`).

**How to apply:** Tokens stored in the DB are always Expo Push Tokens. The send path calls `https://exp.host/--/api/v2/push/send`. If the product ever moves off Expo (e.g., bare React Native), this is the only decision that changes.

## Status: IMPLEMENTED

All files written as of 2026-04-05:

- `supabase/migrations/20260405100000_add_agent_device_tokens.sql` — table + RLS + updated_at trigger
- `src/lib/push/expo.ts` — EPNS wrapper, batch send, DeviceNotRegistered auto-deactivation
- `src/lib/push/handoff.ts` — `dispatchHandoffPushNotifications()`, quiet hours check, badge count, audit_log on failure
- `src/lib/telegram/handoff.ts` — added fire-and-forget call after webhook emit in `initiateHandoff()`
- `src/app/api/mobile/device-tokens/route.ts` — POST (upsert) + DELETE (soft-disable)
- `src/app/api/mobile/device-tokens/[id]/quiet-hours/route.ts` — PATCH quiet hours

## Table: agent_device_tokens

- `user_id` + `token` unique constraint
- `chatbot_ids text[]` — null = all chatbots this user owns
- `is_active boolean` — soft-disable; never hard-delete tokens
- `quiet_hours jsonb` — `{"enabled": true, "start": "22:00", "end": "07:00", "timezone": "America/New_York"}`
- `last_used_at` — updated on upsert

## Integration point: initiateHandoff()

Fire-and-forget call added after `emitTypedWebhookEvent` in `initiateHandoff()` (src/lib/telegram/handoff.ts). Uses chatbot.name already fetched at top of function — no extra DB query needed.

## Recipient fan-out (v1)

Chatbot owner only. When multi-agent assignment lands, change the query in `src/lib/push/handoff.ts` to join an `agent_assignments` table instead of querying chatbots.user_id.

## Quiet hours

Checked at send time in `isInQuietHours()` (exported from src/lib/push/handoff.ts). Handles overnight ranges (e.g. 22:00→07:00). Skipped tokens are dropped — no delayed queue in v1.

## Badge count

`count(telegram_handoff_sessions) where chatbot_id IN (user's chatbots) AND status = 'pending'`

## Token cleanup

`DeviceNotRegistered` error in EPNS response → set `is_active = false` + write to audit_log with `entity_type: 'push_delivery'`.

## Auth for API routes

Bearer JWT from React Native app. Validated via `supabase.auth.getUser(jwt)` using anon key client (not admin — user-scoped). DB writes go through admin client.
