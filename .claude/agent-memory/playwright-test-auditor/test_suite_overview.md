---
name: Test Suite Overview
description: Key metrics and patterns for the Playwright E2E test suite as of 2026-03-26
type: project
---

~141 spec files, ~1,368 test cases. Health score 4/10.

**Why:** Audit on 2026-03-26 found pervasive flaky patterns (614 waitForTimeout, 192 networkidle), 231 weak toBeLessThan(500) assertions, 35 trivial expect(true).toBe(true), and stale route references.

**How to apply:** When writing or reviewing tests, enforce: no waitForTimeout, assert specific status codes, use data-testid not Tailwind classes. Two chatbot IDs in use: e2e00000-...-0001 (seeded, 82 files) and 10df2440-...-e506 (dev, 19 files -- environment-specific). Widget CSS classes (.chat-widget-input etc) are valid test hooks in ChatWidget.tsx.

**Business audit additions (2026-03-30):** 8 new spec files added covering: webhooks CRUD + API (e2e-webhooks.spec.ts), credit meter + alert banner (e2e-credit-meter-alerts.spec.ts), zero-state dashboard (e2e-zero-state-dashboard.spec.ts), notification preferences UI + API (e2e-notification-preferences.spec.ts), branding lock on customize page (e2e-branding-lock.spec.ts), ChatbotSubNav restructure (e2e-chatbot-subnav-updates.spec.ts), activation/onboarding API routes (e2e-activation-onboarding-api.spec.ts), chatbot-booking landing page (e2e-chatbot-booking-page.spec.ts). Modified: e2e-navigation.spec.ts (added Webhooks nav item), e2e-navigation-onboarding.spec.ts (Agent Console → Live Conversations, Analytics promoted to primary nav).

**Key nav change:** ChatbotSubNav — "Analytics" and "Live Conversations" (was "Agent Console") are now in PRIMARY nav. Secondary nav ("More" dropdown) has: Performance, Leads, Surveys, Sentiment, Issues, Tickets, Contact, Articles. "Agent Console" label still exists in deploy page tabs and settings live handoff section.
