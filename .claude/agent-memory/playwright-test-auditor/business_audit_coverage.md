---
name: Business Audit Coverage Map
description: What was added/changed in the 2026-03-30 business audit and which tests cover each area
type: project
---

Business audit implemented 2026-03-30. Tests added same day.

**Why:** Large feature drop — webhooks, credit alerts, nav restructure, notification prefs, zero-state dashboard, branding lock, onboarding DB routes, booking landing page.

**How to apply:** When auditing test gaps, consult this map before writing new tests.

## Coverage Map

| Feature | Test File | Status |
|---|---|---|
| Sidebar: Webhooks nav item | e2e-navigation.spec.ts | Updated |
| ChatbotSubNav: Analytics in primary, Live Conversations | e2e-chatbot-subnav-updates.spec.ts | New |
| ChatbotSubNav: Agent Console → Live Conversations rename | e2e-navigation-onboarding.spec.ts | Updated |
| Webhooks dashboard page (CRUD UI) | e2e-webhooks.spec.ts | New |
| /api/webhooks GET/POST | e2e-webhooks.spec.ts | New |
| /api/webhooks/[id] PATCH/DELETE | e2e-webhooks.spec.ts | New |
| CreditMeter (sidebar) | e2e-credit-meter-alerts.spec.ts | New |
| CreditAlertBanner (amber 75%, red 90%) | e2e-credit-meter-alerts.spec.ts | New |
| /api/credit-alerts/check POST | e2e-credit-meter-alerts.spec.ts | New |
| Zero-state dashboard (NewUserWelcome) | e2e-zero-state-dashboard.spec.ts | New |
| Notification preferences UI toggles | e2e-notification-preferences.spec.ts | New |
| /api/notifications/preferences GET/PATCH | e2e-notification-preferences.spec.ts | New |
| Branding lock on customize page (free plan) | e2e-branding-lock.spec.ts | New |
| /api/chatbots/[id]/widget-reviewed POST | e2e-activation-onboarding-api.spec.ts | New |
| /api/activation/first-conversation POST | e2e-activation-onboarding-api.spec.ts | New |
| /chatbot-booking landing page | e2e-chatbot-booking-page.spec.ts | New |
| Header "Appointment Booking" link | e2e-chatbot-booking-page.spec.ts | New |
| Homepage rewrite (copy) | e2e-public-pages.spec.ts | Existing (status-only) |
| Pricing page (testimonials fix) | e2e-public-pages.spec.ts | Existing (status-only) |
| FAQ data (credits FAQ) | — | Gap (low priority) |

## Not Covered (Low Priority)
- `/api/activation/first-conversation` with a real owned chatbot (can't get user ID without extra API)
- Email sending verification (requires Resend sandbox integration)
- PlanCard "Remove VocUI branding" feature list entry (visual)
- Webhook event emission (`emitWebhookEvent`) integration test
