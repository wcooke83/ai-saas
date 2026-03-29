---
name: Notification system implementation
description: What was built, schema decisions, and wiring for VocUI notification preferences and email alerts
type: project
---

## Email notification stack: Resend

All transactional email goes through Resend via `src/lib/email/resend.ts`. Functions use inline HTML (no React components). FROM address is `VocUI <noreply@vocui.com>`. There is also a separate `src/lib/email/smtp.ts` used by the widget ticket/contact routes for their own admin notifications — do not conflate the two.

**Why:** Resend was already in place. The smtp module is used only for widget-facing ticket and contact form emails.

**How to apply:** New notification functions belong in `resend.ts`. Widget auto-reply and admin-configured notification emails stay in `smtp.ts`.

## Notification preferences: columns on profiles table

Preferences are stored as 5 boolean columns on the `profiles` table (not a separate table or JSONB):
- `notify_new_ticket` DEFAULT true
- `notify_new_escalation` DEFAULT true
- `notify_product_updates` DEFAULT true
- `notify_usage_alerts` DEFAULT true
- `notify_marketing` DEFAULT false

Migration: `supabase/migrations/20260330000002_add_notification_preferences.sql`

**Why:** Simple; avoids a join for the common case of checking a single flag before sending.

## Preferences API

`GET /api/notifications/preferences` — returns all 5 columns for authenticated user.
`PATCH /api/notifications/preferences` — updates any subset; whitelists the 5 keys, ignores unknown keys.

Route at `src/app/api/notifications/preferences/route.ts`, uses `createClient` (server.ts).

## Settings page wiring

`src/app/(authenticated)/dashboard/settings/page.tsx`:
- Preferences fetched via `GET /api/notifications/preferences` inside `loadData` useEffect, non-blocking (failures leave defaults).
- Each toggle calls `PATCH /api/notifications/preferences` on change via `handleNotificationToggle`.
- Silent success, `toast.error` on failure only.
- Toggles are now controlled (`checked=` not `defaultChecked`).
- 5 toggles total: new ticket, new escalation, product updates, usage alerts, marketing.

## Email alerts wiring

**Ticket route** (`src/app/api/widget/[chatbotId]/tickets/route.ts`):
After creating the ticket and sending the configured admin email (`sendNewTicketAdminEmail` to `config.adminNotificationEmail`), the route also checks `profiles.notify_new_ticket` for the chatbot owner and calls `sendNewTicketNotification` if true. Fire-and-forget via `.then(...).catch(() => {})`.

**Escalation route** (`src/app/api/widget/[chatbotId]/report/route.ts`):
After saving the escalation, checks `profiles.notify_new_escalation` for the chatbot owner and calls `sendNewEscalationNotification` if true. Same fire-and-forget pattern.

**Key distinction:** `sendNewTicketAdminEmail` (smtp.ts) notifies the chatbot-settings-configured admin email. `sendNewTicketNotification` (resend.ts) notifies the chatbot owner's account email based on preferences. These are separate and non-duplicating.
