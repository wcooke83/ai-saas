# Playwright E2E Test Audit Report

**Date**: 2026-03-26
**Total spec files**: 133
**Total test cases**: ~1,292
**Auth setup file**: `tests/e2e-auth.setup.ts`

---

## 1. Executive Summary

**Health Score: 4/10 (Poor)**

The test suite has extensive breadth (133 files, ~1,292 tests) but suffers from fundamental quality issues that undermine its value as a safety net:

- **24 dead/stale files** (debug sessions, screenshot captures, visual audits) that are not real tests
- **614 `waitForTimeout()` calls** across 98 files -- pervasive flaky pattern
- **231 weak `toBeLessThan(500)` assertions** that pass on any non-server-error (including 404, 403)
- **35 trivial `expect(true).toBe(true)` assertions** -- tests that always pass
- **Stale route references**: tests hit `/escalations` but the app uses `/issues`; tests hit `/agent-heartbeat` which doesn't exist
- **Inconsistent chatbot IDs**: split between `e2e00000-...0001` (seeded) and `10df2440-...e506` (presumably real/dev data) with no clear rationale
- **7 test files with cross-test state sharing** via `let createdId = null` -- order-dependent
- **192 uses of `networkidle`** -- deprecated/unreliable wait strategy
- **Zero tests for embed routes** (`/embed/*`), profile page, upgrade page, wiki, FAQ, help, signup, or tools API endpoints

---

## 2. Test Inventory

### Dead/Stale Files (24 files -- DELETE these)

| File | Category | Issue |
|------|----------|-------|
| `debug-hamburger-blur.spec.ts` | Debug | Screenshot debugging session |
| `debug-hamburger-blur-v2.spec.ts` | Debug | Screenshot debugging session |
| `debug-hamburger-blur-v3.spec.ts` | Debug | Screenshot debugging session |
| `debug-hamburger-blur-v4.spec.ts` | Debug | Screenshot debugging session |
| `debug-hamburger-blur-v5.spec.ts` | Debug | Screenshot debugging session |
| `debug-hamburger-blur-correct.spec.ts` | Debug | Screenshot debugging session |
| `debug-hamburger-blur-final.spec.ts` | Debug | Screenshot debugging session |
| `hamburger-blur-diagnosis.spec.ts` | Debug | Screenshot/DOM debugging |
| `hamburger-blur-detailed.spec.ts` | Debug | Screenshot/DOM debugging |
| `hamburger-blur-final.spec.ts` | Debug | Screenshot/DOM debugging |
| `hamburger-blur-report.spec.ts` | Debug | Console.log report generation |
| `hamburger-blur-test.spec.ts` | Debug | Screenshot/DOM debugging |
| `hamburger-blur-ui-test.spec.ts` | Debug | Screenshot/DOM debugging |
| `audit.spec.ts` | Audit | Screenshot capture, not test |
| `audit-email-writer.spec.ts` | Audit | Screenshot capture, not test |
| `audit-pricing-dark.spec.ts` | Audit | Screenshot capture, not test |
| `audit-social-post.spec.ts` | Audit | Screenshot capture, not test |
| `dark-mode-contrast.spec.ts` | Audit | Contrast ratio analysis tool |
| `dark-mode-pricing.spec.ts` | Audit | Screenshot capture |
| `verify-dark-mode.spec.ts` | Verify | One-off bug verification |
| `verify-fixes.spec.ts` | Verify | One-off bug verification |
| `verify-pricing-fix.spec.ts` | Verify | One-off bug verification |
| `capture-pricing-dark.spec.ts` | Screenshot | Screenshot capture only |
| `screenshot-pricing.spec.ts` | Screenshot | Screenshot capture only |

### Miscellaneous Non-E2E Tests (9 files -- REVIEW)

| File | Tests | Issue |
|------|-------|-------|
| `chatbot-widget.spec.ts` | 21 | Uses hardcoded chatbot ID `10df2440...`, duplicates `e2e-widget-core.spec.ts` |
| `chatbot-widget-recursion.spec.ts` | 15 | Uses hardcoded chatbot ID, useful but should be e2e-prefixed |
| `chatbot-widget-deploy-page.spec.ts` | 26 | Uses hardcoded chatbot ID, duplicates `e2e-deployment-page.spec.ts` |
| `social-post-generator.spec.ts` | 4 | Tool UI test, 120s timeout, likely hits real AI |
| `email-sequence-audit.spec.ts` | 6 | Screenshot audit, not proper test |
| `proposal-generator-audit.spec.ts` | 6 | Screenshot audit, not proper test |
| `test-leads-page.spec.ts` | 1 | One-off debugging test |
| `test-widget-mock.spec.ts` | 1 | One-off debugging test |
| `agent-console-feedback.spec.ts` | 13 | Proper test but not e2e-prefixed, won't use auth setup |

### E2E Test Files (100 files -- Core test suite)

| File | Tests | Feature Area | Status |
|------|-------|-------------|--------|
| `e2e-dashboard-smoke.spec.ts` | 2 | Dashboard load | WARNING: weak assertions |
| `e2e-dashboard-pages.spec.ts` | 8 | Dashboard pages | WARNING: weak assertions |
| `e2e-chatbot-pages.spec.ts` | 12 | Chatbot sub-pages | CRITICAL: references `/escalations` route (should be `/issues`) |
| `e2e-chatbot-crud.spec.ts` | 6 | Chatbot CRUD | WARNING: cross-test state, PUT method may not exist |
| `e2e-billing.spec.ts` | 4 | Stripe billing | WARNING: weak assertions, no actual checkout flow test |
| `e2e-public-pages.spec.ts` | 10 | Public pages | WARNING: only checks status < 500 |
| `e2e-navigation.spec.ts` | 5 | Sidebar nav | OK |
| `e2e-security.spec.ts` | 10 | Auth/security | CRITICAL: tests `/escalations` endpoint which is now `/issues` |
| `e2e-settings-save.spec.ts` | 6 | Settings PATCH | OK |
| `e2e-settings-general.spec.ts` | 15 | Settings UI | OK: good form validation tests |
| `e2e-settings-escalation.spec.ts` | 5 | Escalation settings | OK |
| `e2e-settings-feedback.spec.ts` | 4 | Feedback settings | WARNING: `expect(true).toBe(true)` |
| `e2e-settings-handoff.spec.ts` | 13 | Handoff settings | WARNING: 7 tests just navigate + check heading |
| `e2e-settings-memory.spec.ts` | -- | Memory settings | OK |
| `e2e-settings-prechat.spec.ts` | 12 | Pre-chat form | OK |
| `e2e-settings-survey.spec.ts` | -- | Survey settings | OK |
| `e2e-settings-system-prompt.spec.ts` | -- | System prompt | OK |
| `e2e-settings-transcripts.spec.ts` | -- | Transcript settings | OK |
| `e2e-settings-uploads.spec.ts` | -- | Upload settings | OK |
| `e2e-settings-editors.spec.ts` | 22 | Editor settings | CRITICAL: 17 `expect(true).toBe(true)` |
| `e2e-settings-ai-model.spec.ts` | -- | AI model settings | OK |
| `e2e-settings-proactive.spec.ts` | -- | Proactive settings | OK |
| `e2e-settings-validation.spec.ts` | -- | Settings validation | OK |
| `e2e-widget-core.spec.ts` | 26 | Widget core | OK: good functional tests, uses CSS class selectors |
| `e2e-widget-advanced.spec.ts` | 35 | Widget advanced | OK |
| `e2e-widget-config.spec.ts` | 3 | Widget config | OK |
| `e2e-widget-customization.spec.ts` | 11 | Widget customization | OK |
| `e2e-widget-sdk.spec.ts` | -- | Widget SDK | OK |
| `e2e-analytics.spec.ts` | 4 | Analytics | OK: API tests |
| `e2e-analytics-comprehensive.spec.ts` | 30 | Analytics | OK but duplicates analytics.spec.ts |
| `e2e-knowledge-lifecycle.spec.ts` | 5 | Knowledge CRUD | WARNING: cross-test state |
| `e2e-knowledge-management.spec.ts` | -- | Knowledge management | OK |
| `e2e-knowledge-advanced.spec.ts` | -- | Knowledge advanced | OK |
| `e2e-knowledge-base.spec.ts` | 22 | Knowledge UI | OK |
| `e2e-leads.spec.ts` | 3 | Lead capture | OK |
| `e2e-dashboard-leads.spec.ts` | 19 | Leads dashboard | OK |
| `e2e-feedback.spec.ts` | 3 | Feedback API | OK |
| `e2e-sentiment.spec.ts` | 3 | Sentiment | OK |
| `e2e-dashboard-sentiment.spec.ts` | 12 | Sentiment dashboard | OK |
| `e2e-conversations.spec.ts` | 4 | Conversations | OK |
| `e2e-survey.spec.ts` | 4 | Survey API | WARNING: cross-test state |
| `e2e-dashboard-surveys.spec.ts` | 13 | Surveys dashboard | OK |
| `e2e-memory-otp.spec.ts` | 2 | OTP/memory | OK |
| `e2e-otp-advanced.spec.ts` | -- | OTP advanced | OK |
| `e2e-publish.spec.ts` | 4 | Publish/unpublish | OK |
| `e2e-api-keys-crud.spec.ts` | 5 | API key CRUD | WARNING: cross-test state |
| `e2e-api-key-auth.spec.ts` | -- | API key auth | WARNING: cross-test state |
| `e2e-error-handling.spec.ts` | 6 | Error handling | OK |
| `e2e-edge-cases.spec.ts` | 7 | Edge cases | OK |
| `e2e-data-integrity.spec.ts` | 6 | Data integrity | WARNING: cross-test state |
| `e2e-integration-flows.spec.ts` | 7 | Integration | OK |
| `e2e-untested-endpoints.spec.ts` | 6 | Misc endpoints | CRITICAL: tests `/agent-heartbeat` which doesn't exist; tests admin/check as POST but it's GET |
| `e2e-admin-auth.spec.ts` | 4 | Admin auth | WARNING: 10s waitForTimeout |
| `e2e-admin-navigation.spec.ts` | 4 | Admin nav | WARNING: Tailwind class selectors |
| `e2e-admin-credits.spec.ts` | 26 | Admin credits | OK |
| `e2e-admin-logs.spec.ts` | 18 | Admin logs | OK |
| `e2e-admin-trials.spec.ts` | 21 | Admin trials | OK |
| `e2e-admin-dataflow.spec.ts` | 20 | Admin data flow | OK |
| `e2e-escalation-management.spec.ts` | 4 | Escalation API | OK: correctly uses `/issues` |
| `e2e-dashboard-escalations.spec.ts` | ~10 | Escalation UI | OK: correctly uses `/issues` |
| `e2e-dashboard-performance.spec.ts` | ~8 | Performance dash | OK |
| `e2e-dashboard-analytics.spec.ts` | -- | Analytics dash | OK |
| `e2e-handoff.spec.ts` | 5 | Handoff API | OK |
| `e2e-agent-actions.spec.ts` | -- | Agent actions | OK |
| `e2e-agent-console-core.spec.ts` | 19 | Agent console | OK: uses direct Supabase seeding |
| `e2e-agent-console-advanced.spec.ts` | 17 | Agent console advanced | OK |
| `e2e-slack-integration.spec.ts` | -- | Slack | OK |
| `e2e-telegram-integration.spec.ts` | 18 | Telegram | OK |
| `e2e-middleware-infra.spec.ts` | -- | Middleware | OK |
| `e2e-global-credit-packages.spec.ts` | 40 | Credit packages | OK: has proper setup/teardown |
| `e2e-calendar-booking.spec.ts` | 47 | Calendar | OK: has cleanup |
| `e2e-api-validation.spec.ts` | 32 | API validation | CRITICAL: tests `/escalations` API which is now `/issues` |
| `e2e-api-routes.spec.ts` | 11 | API routes | OK |
| `e2e-overview-page.spec.ts` | -- | Overview | OK |
| `e2e-deployment-page.spec.ts` | 18 | Deploy page | OK |
| `e2e-performance-page.spec.ts` | -- | Performance page | OK |
| `e2e-chat-flow.spec.ts` | -- | Chat flow | OK |
| `e2e-chat-advanced.spec.ts` | -- | Chat advanced | OK |
| `e2e-chat-widget-survey.spec.ts` | -- | Chat survey | OK |
| `e2e-file-upload.spec.ts` | -- | File upload | OK |
| `e2e-plan-limits.spec.ts` | -- | Plan limits | OK |
| `e2e-tooltip.spec.ts` | -- | Tooltips | OK |
| `e2e-data-flow-verification.spec.ts` | 20 | Data flow | OK |
| `e2e-navigation-onboarding.spec.ts` | 12 | Nav/onboarding | OK |
| `e2e-cross-feature-integration.spec.ts` | 24 | Cross-feature | OK |
| `e2e-debug-widget.spec.ts` | 1 | Debug | WARNING: debugging test |
| `e2e-zz-widget-chat-interaction.spec.ts` | -- | Widget chat | WARNING: zz-prefix suggests order dependency |
| `e2e-article-generation.spec.ts` | 27 | Articles | OK |
| `e2e-ticketing-system.spec.ts` | 40 | Tickets | OK |
| `e2e-contact-submissions.spec.ts` | 40 | Contacts | OK |
| `e2e-credit-exhaustion-comprehensive.spec.ts` | 64 | Credit exhaustion | WARNING: cross-test state |
| `e2e-credit-exhaustion-ux-fixes.spec.ts` | 44 | Credit UX | OK |
| `e2e-fallback-articles.spec.ts` | -- | Fallback articles | OK |
| `e2e-fallback-tickets.spec.ts` | -- | Fallback tickets | OK |
| `e2e-fallback-contact.spec.ts` | -- | Fallback contact | OK |
| `e2e-fallback-purchase.spec.ts` | -- | Fallback purchase | OK |
| `e2e-fallback-settings.spec.ts` | -- | Fallback settings | OK |
| `e2e-ownership-fix.spec.ts` | 13 | Ownership | OK |
| `e2e-reembed-detection.spec.ts` | 12 | Re-embed | OK |
| `e2e-rag-memory-edge-cases.spec.ts` | 16 | RAG/memory | OK |

---

## 3. Dead/Stale Tests

### CRITICAL: Stale Route References

| File | Issue | Fix |
|------|-------|-----|
| `e2e-chatbot-pages.spec.ts:16` | Tests `/dashboard/chatbots/{id}/escalations` -- route is `/issues` | Change path to `/issues`, label to `issues` |
| `e2e-security.spec.ts:31,69` | Tests `/api/chatbots/{id}/escalations` -- route is `/api/chatbots/{id}/issues` | Update to `/issues` |
| `e2e-api-validation.spec.ts:272,282` | Tests `/api/chatbots/{id}/escalations` -- route is `/issues` | Update to `/issues` |
| `e2e-untested-endpoints.spec.ts:25-29` | Tests `/api/widget/{id}/agent-heartbeat` -- route does not exist | Remove test or create route |
| `e2e-untested-endpoints.spec.ts:37-39` | Tests admin/check as POST but handler is GET only | Change to `page.request.get()` |

### Dead Debug/Audit Files (24 files)

All 24 files listed in Section 2 "Dead/Stale Files" should be deleted. They are debugging artifacts (screenshot captures, DOM inspection scripts, console.log reporters) left over from development. They run in the `chromium` project (non-e2e) and waste CI time. Total: **~3,500 lines of dead test code**.

---

## 4. Flaky Test Patterns

### `waitForTimeout()` -- 614 occurrences in 98 files

The most pervasive anti-pattern. Nearly every test file uses hard-coded delays instead of waiting for specific conditions.

**Worst offenders:**

| File | Count | Typical wait |
|------|-------|-------------|
| `e2e-admin-credits.spec.ts` | 37 | `waitForTimeout(500-2000)` between every action |
| `e2e-cross-feature-integration.spec.ts` | 31 | `waitForTimeout(3000)` after every goto |
| `chatbot-widget-deploy-page.spec.ts` | 30 | `waitForTimeout(1000-3000)` for tab switches |
| `e2e-widget-advanced.spec.ts` | 29 | `waitForTimeout(500-3000)` for widget loads |
| `e2e-agent-console-core.spec.ts` | 24 | `waitForTimeout(2000-5000)` for data loads |
| `e2e-widget-core.spec.ts` | 11 | `waitForTimeout(1000-3000)` for session persistence |

**Fix**: Replace with `expect().toBeVisible()`, `page.waitForSelector()`, `page.waitForURL()`, or `page.waitForResponse()`.

### `waitForLoadState('networkidle')` -- 192 occurrences

`networkidle` waits for no network activity for 500ms, which is unreliable with SSE connections, polling, and analytics. Tests using this will flake when background network activity continues.

**Fix**: Use `domcontentloaded` or wait for specific UI elements.

### Auth setup has hardcoded wait

`e2e-auth.setup.ts:67` uses `waitForTimeout(3000)` to verify auth. If the server is slow, this may not be enough. If fast, it wastes 3s per run.

---

## 5. Selector Mismatches

### Tailwind CSS Class Selectors (Fragile)

| File | Selector | Risk |
|------|----------|------|
| `e2e-admin-navigation.spec.ts:40` | `.toHaveClass(/bg-primary/)` | Tailwind class changes with theme/build |
| `e2e-admin-navigation.spec.ts:57` | `.toHaveClass(/w-16/)` | Width class may change |
| `e2e-admin-navigation.spec.ts:96` | `.toHaveClass(/translate-x-0/)` | Transform class may change |
| `e2e-admin-navigation.spec.ts:110` | `.toHaveClass(/-translate-x-full/)` | Transform class may change |
| `e2e-admin-credits.spec.ts:37` | `.locator('.absolute.z-10')` | Fragile compound class selector |

**Fix**: Use `data-testid` attributes or ARIA roles instead of Tailwind classes.

### Widget CSS Class Selectors (Acceptable)

The widget tests use custom CSS classes like `.chat-widget-input`, `.chat-widget-send`, `.chat-widget-message-assistant`. These are **verified present** in `src/components/widget/ChatWidget.tsx` -- they appear to be intentional test hooks styled as CSS classes. This is acceptable though `data-testid` would be cleaner.

---

## 6. Weak Assertions

### `toBeLessThan(500)` -- 231 occurrences

Tests asserting `status < 500` pass on 404, 403, 400. They verify "server didn't crash" but not correct behavior.

**Files with 10+ weak assertions:**
- `e2e-cross-feature-integration.spec.ts`
- `e2e-calendar-booking.spec.ts`
- `e2e-data-flow-verification.spec.ts`
- `e2e-credit-exhaustion-comprehensive.spec.ts`
- `e2e-admin-credits.spec.ts`
- `e2e-ticketing-system.spec.ts`

**Fix**: Assert specific status codes. Use `toBe(200)` or `toBeGreaterThanOrEqual(200)` and `toBeLessThan(300)` for success paths.

### `expect(true).toBe(true)` -- 35 occurrences

Tests that always pass regardless of what happens. Concentrated in:
- `e2e-settings-editors.spec.ts` (17 occurrences) -- almost every test is a no-op
- `e2e-settings-feedback.spec.ts` (2)
- `e2e-settings-general.spec.ts` (1)
- `e2e-settings-handoff.spec.ts` (4)
- `e2e-contact-submissions.spec.ts` (1)

### No-Op Test Bodies

Multiple tests in `e2e-settings-handoff.spec.ts` (tests 007-013) only navigate to the settings page and check the heading. They test nothing about the specific feature named in the test title.

---

## 7. Coverage Gaps

### Routes With No Test Coverage

| Route | Type | Priority |
|-------|------|----------|
| `/embed/ad-copy` | Embed page | Medium |
| `/embed/blog-writer` | Embed page | Medium |
| `/embed/email-writer` | Embed page | Medium |
| `/embed/meeting-notes` | Embed page | Medium |
| `/embed/proposal-generator` | Embed page | Medium |
| `/embed/social-post` | Embed page | Medium |
| `/dashboard/profile` | Dashboard page | High |
| `/dashboard/upgrade` | Dashboard page | High |
| `/dashboard/wiki` | Dashboard page | Low |
| `/dashboard/wiki/[slug]` | Dashboard page | Low |
| `/dashboard/integrations/[tool]` | Dashboard page | Medium |
| `/dashboard/chatbots/[id]/articles` | Dashboard page | Partial (API only) |
| `/dashboard/chatbots/[id]/calendar` | Dashboard page | Partial (API only) |
| `/dashboard/chatbots/[id]/contact` | Dashboard page | Partial (API only) |
| `/signup` | Public page | High |
| `/faq` | Public page | Medium |
| `/help` | Public page | Medium |
| `/privacy` | Public page | Low |
| `/terms` | Public page | Low |
| `/design-system` | Public page | Low |
| `/wiki` (public) | Public page | Low |
| `/sdk` | Public page | Low |

### API Endpoints With No Test Coverage

| Endpoint | Method | Priority |
|----------|--------|----------|
| `/api/auth/signup` | POST | **Critical** |
| `/api/billing/auto-topup` | POST/GET | High |
| `/api/billing/credits` | POST/GET | High |
| `/api/billing/plans` | GET | High |
| `/api/billing/redeem` | POST | High |
| `/api/billing/upgrade` | POST | High |
| `/api/stripe/webhook` | POST | **Critical** |
| `/api/calendar/availability` | GET | Medium |
| `/api/calendar/book` | POST | Medium |
| `/api/calendar/bookings/[id]` | GET/PATCH/DELETE | Medium |
| `/api/calendar/integrations` | GET | Medium |
| `/api/calendar/setup` | POST | Medium |
| `/api/calendar/webhook/[provider]` | POST | Medium |
| `/api/chatbots/[id]/articles/generate` | POST | Medium |
| `/api/chatbots/[id]/articles/generate-from-url` | POST | Medium |
| `/api/chatbots/[id]/articles/prompts` | GET/POST | Low |
| `/api/chatbots/[id]/articles/schedule` | POST | Low |
| `/api/chatbots/[id]/articles/publish-all` | POST | Low |
| `/api/chatbots/[id]/credit-packages` | GET | Medium |
| `/api/admin/models` | GET/POST | Low |
| `/api/admin/providers` | GET/POST | Low |
| `/api/admin/settings` | GET/POST | Medium |
| `/api/cron/regenerate-articles` | POST | Low |
| `/api/usage/export` | GET | Medium |
| `/api/user/models` | GET | Low |
| `/api/user/settings/model` | POST | Low |
| `/api/webhooks/slack` | POST | Medium |
| `/api/widget/[id]/purchase` | POST | Medium |

### Missing Critical Test Scenarios

| Scenario | Priority |
|----------|----------|
| Stripe webhook handling (subscription created/updated/canceled) | **Critical** |
| User signup flow end-to-end | **Critical** |
| Authenticated user redirect from `/login` | High |
| Dashboard upgrade page with Stripe checkout | High |
| Profile page view and update | High |
| Billing page subscription management | High |
| AI mock mode verification (tests could hit real APIs) | High |
| Cross-user data isolation (user A can't see user B's chatbots) | **Critical** |

---

## 8. Duplicate/Overlapping Tests

| File A | File B | Overlap |
|--------|--------|---------|
| `e2e-analytics.spec.ts` (4 tests) | `e2e-analytics-comprehensive.spec.ts` (30 tests) | Analytics API + page load tested in both |
| `e2e-dashboard-pages.spec.ts` | `e2e-chatbot-pages.spec.ts` | Both test page-loads with same weak pattern |
| `e2e-chatbot-crud.spec.ts` | `e2e-data-integrity.spec.ts` | Both test chatbot create/update/delete |
| `chatbot-widget.spec.ts` | `e2e-widget-core.spec.ts` | Extensive widget test overlap |
| `chatbot-widget-deploy-page.spec.ts` | `e2e-deployment-page.spec.ts` | Deploy page tested in both |
| `e2e-handoff.spec.ts` | `e2e-escalation-management.spec.ts` | Both test issues/escalation API |
| `e2e-settings-save.spec.ts` | `e2e-settings-general.spec.ts` | Both test chatbot settings update |
| `e2e-knowledge-lifecycle.spec.ts` | `e2e-knowledge-management.spec.ts` | Both test knowledge CRUD |
| `test-leads-page.spec.ts` | `e2e-dashboard-leads.spec.ts` | Both test leads page |

---

## 9. Quality Issues

### Cross-Test State Sharing

These files use `let id = null` at module scope, making later tests depend on earlier ones:

1. `e2e-chatbot-crud.spec.ts` -- `createdChatbotId`
2. `e2e-api-keys-crud.spec.ts` -- `createdKeyId`
3. `e2e-api-key-auth.spec.ts` -- `apiKey`, `keyId`
4. `e2e-knowledge-lifecycle.spec.ts` -- `createdSourceId`
5. `e2e-data-integrity.spec.ts` -- `tempChatbotId`
6. `e2e-survey.spec.ts` -- `responseId`
7. `e2e-credit-exhaustion-comprehensive.spec.ts` -- multiple IDs

**Risk**: If an early test fails, all subsequent tests in the file are skipped or fail with misleading errors. With `retries: 1` in playwright config and `fullyParallel: false`, a retry re-runs the file from the beginning, so this is somewhat mitigated -- but it still masks the real failure point.

### Two Different Chatbot IDs

- **E2E seeded ID**: `e2e00000-0000-0000-0000-000000000001` -- used by 82 e2e-*.spec.ts files
- **Dev/production ID**: `10df2440-6aac-441a-855d-715c0ea8e506` -- used by 19 files

Tests using the dev ID will fail in any environment that doesn't have that specific chatbot. The `e2e-widget-core.spec.ts` (26 tests) uses the dev ID exclusively, making the entire widget core test suite environment-specific.

### Auth Setup Leaks

`e2e-auth.setup.ts` hardcodes `PROJECT_REF = 'oxiekhzthqmpuyoibunn'` for cookie naming. If the Supabase project changes, all authenticated tests break silently.

### Missing AI Mock Mode Verification

No test verifies that `AI_MOCK_MODE=true` is set or that the AI provider is using mock responses. The `social-post-generator.spec.ts` and `email-sequence-audit.spec.ts` files (in the `chromium` project, no auth) appear to hit real tool endpoints that could call actual AI APIs.

### `e2e-untested-endpoints.spec.ts` Tests Non-Existent Route

The test at line 25 POSTs to `/api/widget/{id}/agent-heartbeat` -- this route handler does not exist in `src/app/api/`. The test passes because `toBeLessThan(500)` accepts a 404.

---

## 10. Prioritized Recommendations

### Rank 1: Delete 24 dead test files
**Impact**: Reduces CI time, eliminates false signal. ~3,500 lines.
**Files**: All `debug-hamburger-blur-*`, `hamburger-blur-*`, `audit-*`, `dark-mode-*`, `verify-*`, `capture-*`, `screenshot-*` spec files.

### Rank 2: Fix stale `/escalations` references to `/issues`
**Impact**: 3 files with tests hitting 404 that pass due to weak assertions.
**Files**: `e2e-chatbot-pages.spec.ts`, `e2e-security.spec.ts`, `e2e-api-validation.spec.ts`

### Rank 3: Replace `waitForTimeout()` with proper waits
**Impact**: Eliminates primary flake source across 98 files.
**Priority files**: `e2e-dashboard-smoke.spec.ts`, `e2e-auth.setup.ts`, `e2e-admin-auth.spec.ts` (10s wait)

### Rank 4: Strengthen `toBeLessThan(500)` assertions
**Impact**: 231 assertions currently pass on 404/403. Replace with `toBe(200)` or appropriate specific codes.
**Priority**: Start with `e2e-public-pages.spec.ts`, `e2e-billing.spec.ts`, `e2e-untested-endpoints.spec.ts`

### Rank 5: Consolidate duplicate test files
**Impact**: Remove 9 non-e2e test files that duplicate e2e coverage.
**Files**: `chatbot-widget.spec.ts`, `chatbot-widget-deploy-page.spec.ts`, `test-leads-page.spec.ts`, `test-widget-mock.spec.ts`

### Rank 6: Fix non-existent endpoint tests
**Impact**: `e2e-untested-endpoints.spec.ts` tests agent-heartbeat (doesn't exist) and admin/check as POST (should be GET).

### Rank 7: Standardize on one chatbot ID
**Impact**: 19 files use `10df2440...` which is environment-specific. Either seed this ID in test setup or migrate to `e2e00000...`.

### Rank 8: Remove `expect(true).toBe(true)` assertions
**Impact**: 35 tests that give false confidence. Either write real assertions or remove the tests.
**Priority file**: `e2e-settings-editors.spec.ts` (17 occurrences)

### Rank 9: Add coverage for critical untested paths
**Priority**:
1. Stripe webhook handler (`/api/stripe/webhook`)
2. User signup flow (`/api/auth/signup`)
3. Cross-user data isolation
4. `/embed/*` routes (6 pages, 0 tests)
5. `/dashboard/profile` and `/dashboard/upgrade`

### Rank 10: Replace Tailwind class selectors with data-testid
**Impact**: 5 selectors in `e2e-admin-navigation.spec.ts` will break on theme/Tailwind changes.
