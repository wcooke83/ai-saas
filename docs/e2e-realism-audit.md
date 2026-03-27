# E2E Test Realism Audit

**Date**: 2026-03-27
**Scope**: All Playwright test files in `tests/`
**Metric**: 746 direct API calls across 69 test files

---

## Executive Summary

The E2E test suite is heavily API-driven. Most test files bypass the UI entirely, using `page.request.*` calls to create, update, and delete resources that have corresponding UI flows. Additionally, several files use direct Supabase REST calls with the service role key (bypassing RLS), and many widget tests mock network responses via `route.fulfill()`.

**By the numbers:**
- **69 files** make direct API calls (746 total)
- **5 files** make direct Supabase REST calls with service role key
- **~20 files** use `page.route()` + `route.fulfill()` to mock API responses
- **~30 files** use `page.evaluate()` (mostly legitimate DOM checks)

---

## 1. HIGH Severity: Core User Flows Bypassed via API

These tests exercise flows that users perform through the UI (create chatbot, update settings, manage knowledge, etc.) but skip the UI entirely.

| File | Lines | API Call | What It Does | UI Alternative |
|------|-------|----------|--------------|----------------|
| `e2e-chatbot-crud.spec.ts` | 28, 67, 82 | `POST /api/chatbots`, `PUT /api/chatbots/:id`, `DELETE /api/chatbots/:id` | Creates, updates, deletes chatbot | Chatbot wizard at `/dashboard/chatbots/new`, settings page, delete button |
| `e2e-data-integrity.spec.ts` | 10, 19, 30, 36, 45, 52, 72, 75, 81, 98, 107, 117, 122, 127 | Full CRUD + chat + leads | Creates chatbot, updates settings, sends chat, captures leads, verifies persistence | All available through dashboard UI |
| `e2e-integration-flows.spec.ts` | 7, 12-16, 28-36, 62-79 | `POST /api/chatbots/:id/publish`, `POST /api/chat/:id`, `PATCH /api/chatbots/:id` | Publishes chatbot, sends chat messages, updates system prompt | Publish button, widget chat, settings page |
| `e2e-article-generation.spec.ts` | 32, 46, 57, 63, 68, 76+ | Full extraction prompts CRUD, article generation | Manages extraction prompts, generates articles, queries | Article management UI exists in dashboard |
| `e2e-settings-save.spec.ts` | all | `PATCH /api/chatbots/:id` | Saves chatbot settings | Settings page form + save button |
| `e2e-knowledge-lifecycle.spec.ts` | all | Knowledge CRUD | Adds/removes knowledge sources | Knowledge management page |
| `e2e-knowledge-advanced.spec.ts` | all | Knowledge operations | Advanced knowledge operations | Knowledge page |
| `e2e-knowledge-management.spec.ts` | all | `GET /api/chatbots/:id/knowledge` | Lists knowledge sources | Knowledge page |
| `e2e-leads.spec.ts` | 9, 23, 30 | `POST /api/widget/:id/leads`, `GET /api/chatbots/:id/leads` | Submits and retrieves leads | Widget pre-chat form, leads dashboard |
| `e2e-survey.spec.ts` | 9, 25, 35, 47 | `POST /api/widget/:id/survey` | Submits survey responses | Widget survey UI |
| `e2e-feedback.spec.ts` | 7, 14 | `POST /api/widget/:id/feedback` | Submits thumbs up/down | Widget feedback buttons |
| `e2e-publish.spec.ts` | all | `POST /api/chatbots/:id/publish`, `DELETE /api/chatbots/:id/publish` | Publishes/unpublishes chatbot | Publish toggle in deploy page |
| `e2e-chat-advanced.spec.ts` | 11, 17, 25, 28, 34, 38, 56 | `POST /api/chat/:id`, `GET /api/chatbots/:id/performance` | Sends chat messages, checks perf | Widget chat, performance dashboard |
| `e2e-ownership-fix.spec.ts` | all | Various chatbot API calls | Tests ownership operations | Dashboard UI |
| `e2e-escalation-management.spec.ts` | all | Escalation API calls | Creates/manages escalations | Agent console UI |
| `e2e-handoff.spec.ts` | all | Handoff API calls | Tests agent handoff | Widget + agent console |
| `e2e-conversations.spec.ts` | all | Conversation API calls | Tests conversation listing | Conversations page |
| `e2e-analytics.spec.ts` | all | Analytics API calls | Gets analytics data | Analytics dashboard |
| `e2e-sentiment.spec.ts` | all | Sentiment API | Tests sentiment analysis | Dashboard sentiment page |
| `e2e-widget-config.spec.ts` | all | Widget config API | Gets/updates widget config | Customize page |
| `e2e-api-keys-crud.spec.ts` | all | `POST/GET/DELETE /api/keys` | Creates, lists, deletes API keys | API keys settings page |
| `e2e-slack-integration.spec.ts` | all | Slack integration API | Tests Slack setup | Integration settings page |
| `e2e-telegram-integration.spec.ts` | all | Telegram integration API | Tests Telegram setup | Integration settings page |
| `e2e-billing.spec.ts` | all | Billing API | Tests billing operations | Billing page |
| `e2e-plan-limits.spec.ts` | all | Plan limit API calls | Tests plan enforcement | Dashboard |
| `e2e-fallback-articles.spec.ts` | all | Fallback articles API | Tests fallback article serving | Widget |
| `e2e-fallback-contact.spec.ts` | all | Fallback contact API | Tests fallback contact form | Widget |
| `e2e-fallback-purchase.spec.ts` | all | Fallback purchase API | Tests credit purchase flow | Widget |
| `e2e-fallback-tickets.spec.ts` | all | Fallback tickets API | Tests ticket creation | Widget |
| `e2e-fallback-settings.spec.ts` | all | Fallback settings API | Tests fallback config | Settings page |

---

## 2. HIGH Severity: Direct Supabase/Database Bypass

These files use the Supabase REST API with the **service role key**, completely bypassing Row Level Security and all application logic.

| File | Lines | What It Does | Why This Is Problematic |
|------|-------|--------------|------------------------|
| `e2e-agent-console-core.spec.ts` | 24, 42 | `supabaseInsert()` / `supabaseDelete()` with service role key to seed conversations and messages | Seeds test data directly into DB, bypassing all validation and business logic. Conversations created this way may not match what the app actually produces. |
| `e2e-agent-console-advanced.spec.ts` | 21, 38 | Same `supabaseInsert()` / `supabaseDelete()` pattern | Same issue — direct DB writes for conversation seeding |
| `e2e-calendar-booking.spec.ts` | 81, 96, 108 | `supabaseInsert()` / `supabaseDelete()` for calendar integrations and bookings | Creates calendar integration records directly, bypasses setup wizard |
| `e2e-calendar-booking.spec.ts` | 47 | Direct `fetch()` to Easy!Appointments API | Calls external API directly instead of through app endpoints |

---

## 3. HIGH Severity: API-Only Test Files (No UI Testing At All)

These entire files are pure API tests masquerading as E2E tests. They never navigate to a page or interact with UI elements.

| File | API Calls | Description |
|------|-----------|-------------|
| `e2e-api-routes.spec.ts` | 10 | Tests GET endpoints for chatbots, knowledge, performance, conversations, analytics, API keys — all have corresponding dashboard pages |
| `e2e-api-validation.spec.ts` | 43 | Tests API input validation — legitimate for API testing but should be separate from E2E suite |
| `e2e-edge-cases.spec.ts` | 12 | Tests edge case responses from APIs |
| `e2e-error-handling.spec.ts` | 5 | Tests error responses |
| `e2e-help-articles-knowledge-rag.spec.ts` | 35 | Full RAG pipeline testing via API |
| `e2e-data-flow-verification.spec.ts` | 4 | Data flow verification via API |
| `e2e-settings-validation.spec.ts` | 4 | Settings validation via API |
| `e2e-auto-credit-topup.spec.ts` | 18 | Auto credit top-up testing via API |

---

## 4. MEDIUM Severity: Setup/Teardown via API

These files use API calls primarily for test setup/teardown, with actual test assertions done through UI. This is more acceptable but still reduces confidence.

| File | Pattern | Notes |
|------|---------|-------|
| `e2e-cross-feature-integration.spec.ts` | `setCreditState()` / `resetCredits()` via `PATCH /api/chatbots/:id` | Sets credit limits before testing widget credit exhaustion UI. The credit state setup has no UI equivalent (admin would do it differently). **Acceptable for setup.** |
| `e2e-credit-exhaustion-ux-fixes.spec.ts` | `setFallbackConfig()` via `PATCH /api/chatbots/:id` | Configures fallback mode before testing widget behavior. **Acceptable for setup.** |
| `e2e-analytics-comprehensive.spec.ts` | `POST /api/chat/:id` to generate data, then tests dashboard UI | Generates chat data via API before verifying analytics dashboard. **Acceptable — generating chat data via widget would be very slow.** |
| `e2e-global-credit-packages.spec.ts` | `beforeAll` promotes user to admin via `/api/auth/e2e-set-admin` | Admin role promotion for testing admin features. **Acceptable — no UI for this.** |
| `e2e-reembed-detection.spec.ts` | API calls to create knowledge sources with mismatched providers | Creates specific DB state to test UI indicators. **Acceptable — testing error states.** |

---

## 5. MEDIUM Severity: Network Interception / Route Mocking

These files use `page.route()` + `route.fulfill()` to mock API responses, which means the tests never hit the real backend.

| File | Mocked Endpoints | Purpose | Concern |
|------|------------------|---------|---------|
| `e2e-credit-exhaustion-ux-fixes.spec.ts` | Chat API (403), widget config (credit exhausted), articles, purchase, tickets, contact | Tests credit exhaustion UX states | **High concern** — mocks 6+ endpoints; the full purchase flow is never tested against real Stripe |
| `e2e-credit-exhaustion-comprehensive.spec.ts` | Chat API (403), tickets, contact, purchase, articles | Tests credit exhaustion fallbacks | Same concern as above |
| `e2e-cross-feature-integration.spec.ts` | Widget config (packages), purchase API, chat API | Tests purchase flow with mock packages | Purchase flow never hits real payment |
| `e2e-widget-advanced.spec.ts` | Widget config, chat API | Tests widget with controlled responses | Chat never hits real AI |
| `e2e-widget-core.spec.ts` | Chat API (abort), chat API (fulfill) | Tests error handling and offline states | **Acceptable** — testing error states requires mocking |
| `e2e-debug-widget.spec.ts` | Widget config | Tests debug widget rendering | **Acceptable** — controlled config for visual testing |
| `test-widget-mock.spec.ts` | Widget config | Full mock widget test | **Expected** — file name declares it's a mock test |
| `agent-console-feedback.spec.ts` | Chatbot API, conversations, agent-conversations, agent-actions, auth, realtime | Mocks entire agent console backend | **High concern** — all data is fabricated, testing only rendering |
| `e2e-global-credit-packages.spec.ts` | Widget config | Mocks package data in widget config | Tests widget rendering of packages |
| `e2e-contact-submissions.spec.ts` | Contact submissions endpoint | Mocks submission data | Tests rendering of contact data |

---

## 6. LOW Severity: `page.evaluate()` Usage

Most `page.evaluate()` calls are legitimate DOM/localStorage checks. Flagged items:

| File | Line | What It Does | Concern |
|------|------|--------------|---------|
| `e2e-navigation-onboarding.spec.ts` | 65, 87, 104, 130, 221 | `localStorage.removeItem()` to reset onboarding state | **Acceptable** — clearing persisted UI state for test isolation |
| `e2e-widget-core.spec.ts` | 158, 186, 365 | `localStorage` manipulation for visitor ID and session | **Low** — testing persistence behavior |
| `e2e-widget-advanced.spec.ts` | 461, 494, 506, 519, 555 | `localStorage` manipulation and `dispatchEvent` | **Low** — tests offline/online events and storage |
| `e2e-rag-memory-edge-cases.spec.ts` | 160 | `localStorage` manipulation | **Low** — testing memory edge cases |
| `chatbot-widget-recursion.spec.ts` | 52, 99, 112, 187 | DOM inspection for script/theme counts and init testing | **Acceptable** — testing technical behavior |

---

## 7. Hardcoded Credentials in Test Files

| File | Issue |
|------|-------|
| `e2e-contact-submissions.spec.ts` | Hardcoded SMTP credentials: `support@vocui.com` / `Bt6uKm9cL3jH7nZx` and `test@vocui.com` / `wJO7yxmEQdO00F9T` |
| `e2e-ticketing-system.spec.ts` | Hardcoded IMAP credentials: `test@vocui.com` / `wJO7yxmEQdO00F9T` |
| `e2e-global-credit-packages.spec.ts` | Hardcoded e2e secret: `e2e-playwright-secret-2026` |
| `e2e-auth.setup.ts` | Hardcoded e2e secret and Supabase project ref |

---

## Recommendations

### Immediate (High Priority)

1. **Convert `e2e-chatbot-crud.spec.ts` to use UI**: The create/update/delete chatbot flow is a core user journey. Tests should use the wizard at `/dashboard/chatbots/new`, the settings form, and the delete button.

2. **Convert `e2e-data-integrity.spec.ts` to use UI**: Every operation in this file has a UI counterpart. Creating a chatbot, updating settings, sending chat messages, and capturing leads should all go through the actual interface.

3. **Convert `e2e-settings-save.spec.ts` to use UI**: Settings are saved through a form with a save button. Tests should fill the form and click save, not PATCH the API directly.

4. **Convert `e2e-leads.spec.ts` and `e2e-survey.spec.ts` to use widget UI**: Lead capture and survey submission happen through the chat widget. Tests should open the widget, trigger the form, and fill it out.

5. **Convert `e2e-feedback.spec.ts` to use widget UI**: Thumbs up/down buttons are visible in the widget after AI responses.

6. **Convert `e2e-publish.spec.ts` to use UI**: The publish toggle exists in the deploy page.

7. **Move credentials to environment variables**: All hardcoded passwords and secrets should come from `.env` or Playwright config.

### Medium Priority

8. **Separate API tests from E2E tests**: Files like `e2e-api-routes.spec.ts`, `e2e-api-validation.spec.ts`, and `e2e-edge-cases.spec.ts` are legitimate API tests but should be in a separate `tests/api/` directory with a different Playwright project config. They are not E2E tests.

9. **Reduce route mocking in credit exhaustion tests**: The credit exhaustion files mock 6+ endpoints. At minimum, one test should exercise the full real flow: exhaust credits via real chat messages, then verify the fallback UI appears.

10. **Replace direct Supabase inserts with API calls or UI**: `e2e-agent-console-core.spec.ts` and `e2e-agent-console-advanced.spec.ts` seed conversations via direct DB writes with service role key. These should create conversations through the chat widget or at minimum through the app's API.

### Low Priority

11. **Document acceptable API usage**: Create a convention doc stating when API setup is acceptable (e.g., promoting to admin, generating bulk chat data for analytics tests) vs. when UI interaction is required (any core user flow).

12. **Add a lint rule**: Consider a custom ESLint rule or Playwright config check that flags `page.request.*` in files not in `tests/api/`.

---

## Summary Statistics

| Category | Count | % of Test Files |
|----------|-------|-----------------|
| Pure API tests (no UI) | 8 files | 7% |
| Core flows bypassed via API (HIGH) | 29 files | 26% |
| Setup/teardown via API (MEDIUM) | 5 files | 4% |
| Network mocking (MEDIUM) | 10 files | 9% |
| Direct Supabase DB bypass | 3 files | 3% |
| UI-first tests (GOOD) | ~55 files | 50% |
| Hardcoded credentials | 4 files | 4% |
