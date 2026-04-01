# E2E Test Results

**Run started:** 2026-04-01 09:46
**Status:** In Progress (suite still running in background, ~37/121 files completed)

| # | Test | Status | Result | Fix Notes | Timestamp |
|---|------|--------|--------|-----------|-----------|
| 1 | e2e-activation-onboarding-api | ✅ Passed | 7 passed | — | 2026-04-01 |
| 2 | e2e-admin-auth | ✅ Passed | 4 passed | — | 2026-04-01 |
| 3 | e2e-admin-credits | ❌ Failed | 25 passed, 1 failed | ADMIN-CREDITS-019: Submit adjustment -- Credit Back success (31.6s timeout) | 2026-04-01 |
| 4 | e2e-admin-dataflow | ✅ Passed | 20 passed | — | 2026-04-01 |
| 5 | e2e-admin-logs | ✅ Passed | 18 passed | — | 2026-04-01 |
| 6 | e2e-admin-navigation | ✅ Passed | 4 passed | — | 2026-04-01 |
| 7 | e2e-admin-trials | ✅ Passed | 20 passed | — | 2026-04-01 |
| 8 | e2e-agent-actions | ✅ Passed | 5 passed | — | 2026-04-01 |
| 9 | e2e-agent-console-advanced | ❌ Failed | 5 passed, 6 failed, 6 skipped | Realtime/presence tests timeout (3m); beforeAll state failures cascade. Test infra issues. | 2026-04-01 |
| 10 | e2e-agent-console-core | ❌ Failed | 0 passed, 1 failed, 18 skipped | AGENT-001 layout fails (1ms), all others skipped due to dependency on beforeAll. | 2026-04-01 |
| 11 | e2e-analytics-comprehensive | ✅ Passed | 30 passed | — | 2026-04-01 |
| 12 | e2e-analytics | ❌ Failed | 2 passed, 2 failed | Export button and sentiment export selectors not found. | 2026-04-01 |
| 13 | e2e-api-key-auth | ✅ Passed | 4 passed | — | 2026-04-01 |
| 14 | e2e-api-keys-crud | ❌ Failed | 2 passed, 1 failed | Delete API key test fails. | 2026-04-01 |
| 15 | e2e-appsumo-license | ❌ Failed | 9 passed, 2 failed | Billing page contains Redeem License Key text (expected removed). | 2026-04-01 |
| 16 | e2e-article-generation | ❌ Failed | 28 passed, 4 failed | AG-062 extraction prompts, AG-066 schedule persistence, AG-067 URL distinction, AG-100 badge/helper. | 2026-04-01 |
| 17 | e2e-auto-topup | ❌ Failed | 8 passed, 4 failed, 2 skipped | Save flow tests fail (TOPUP-040/041); toggle tests skipped. | 2026-04-01 |
| 18 | e2e-billing | ❌ Failed | 3 passed, 1 failed | 1 billing page assertion failure. | 2026-04-01 |
| 19 | e2e-branding-lock | ✅ Passed | 6 passed | — | 2026-04-01 |
| 20 | e2e-calendar-booking | ❌ Failed | 16 passed, 15 failed, 16 skipped | Mixed results: live EA tests pass, some UI/DB tests fail. Widget booking tests flaky. | 2026-04-01 |
| 21 | e2e-calendar-scheduling | ❌ Failed | 0 passed, 25 failed | All tests timeout (~33s). Calendar scheduling UI likely not rendering expected selectors. | 2026-04-01 |
| 22 | e2e-chat-advanced | ❌ Failed | 3 passed, 1 failed | 1 test failure. | 2026-04-01 |
| 23 | e2e-chat-flow | ❌ Failed | 0 passed, 1 failed, 5 skipped | beforeAll fails, all others skipped. | 2026-04-01 |
| 24 | e2e-chat-widget-survey | ❌ Failed | 1 passed, 1 failed | 1 widget survey test fails. | 2026-04-01 |
| 25 | e2e-chatbot-booking-page | ❌ Failed | 5 passed, 1 failed | 1 booking page test fails. | 2026-04-01 |
| 26 | e2e-chatbot-creation | ❌ Failed | 9 passed, 8 failed | Multi-step wizard creation tests failing. | 2026-04-01 |
| 27 | e2e-chatbot-crud | ❌ Failed | 1 passed, 1 failed, 3 skipped | CRUD operations partially failing. | 2026-04-01 |
| 28 | e2e-chatbot-pages | ✅ Passed | 12 passed | — | 2026-04-01 |
| 29 | e2e-chatbot-subnav-updates | ✅ Passed | 8 passed | — | 2026-04-01 |
| 30 | e2e-chatbot-widget-deploy-page | ❌ Failed | 12 passed, 14 failed | Deploy page widget tests: selectors/iframe issues. | 2026-04-01 |
| 31 | e2e-contact-submissions | ❌ Failed | 38 passed, 1 failed, 1 skipped | CS-039: Thread chronological order fails. | 2026-04-01 |
| 32 | e2e-conversations | ❌ Failed | 2 passed, 2 failed | 2 conversation tests fail. | 2026-04-01 |
| 33 | e2e-credit-exhaustion-comprehensive | ❌ Failed | 56 passed, 8 failed | Widget fallback transitions and admin ticket lifecycle tests fail. | 2026-04-01 |
| 34 | e2e-credit-exhaustion-ux-fixes | ❌ Failed | 11 passed, 33 failed | Most widget interaction tests timeout (1m). Widget iframe not loading fallback views. | 2026-04-01 |
| 35 | e2e-credit-meter-alerts | ✅ Passed | 11 passed | — | 2026-04-01 |
| 36 | e2e-credit-purchase | ❌ Failed | 3 passed, 3 failed, 4 skipped | Custom amount purchase UI tests fail. | 2026-04-01 |
| 37 | e2e-cross-feature-integration | 🔄 Running | — | Re-running (was interrupted) | 2026-04-01 |
| 38 | e2e-dashboard-analytics | ⏳ Queued | — | — | — |
| 39 | e2e-dashboard-escalations | ⏳ Queued | — | — | — |
| 40 | e2e-dashboard-leads | ⏳ Queued | — | — | — |
| 41 | e2e-dashboard-pages | ⏳ Queued | — | — | — |
| 42 | e2e-dashboard-performance | ⏳ Queued | — | — | — |
| 43 | e2e-dashboard-sentiment | ⏳ Queued | — | — | — |
| 44 | e2e-dashboard-smoke | ⏳ Queued | — | — | — |
| 45 | e2e-dashboard-surveys | ⏳ Queued | — | — | — |
| 46 | e2e-data-integrity | ⏳ Queued | — | — | — |
| 47 | e2e-debug-widget | ⏳ Queued | — | — | — |
| 48 | e2e-deploy-publish-flow | ⏳ Queued | — | — | — |
| 49 | e2e-deployment-page | ⏳ Queued | — | — | — |
| 50 | e2e-escalation-management | ⏳ Queued | — | — | — |
| 51 | e2e-fallback-articles | ⏳ Queued | — | — | — |
| 52 | e2e-fallback-contact | ⏳ Queued | — | — | — |
| 53 | e2e-fallback-purchase | ⏳ Queued | — | — | — |
| 54 | e2e-fallback-settings | ⏳ Queued | — | — | — |
| 55 | e2e-fallback-tickets | ⏳ Queued | — | — | — |
| 56 | e2e-feedback | ⏳ Queued | — | — | — |
| 57 | e2e-file-upload | ⏳ Queued | — | — | — |
| 58 | e2e-gate-pages | ⏳ Queued | — | — | — |
| 59 | e2e-global-credit-packages | ⏳ Queued | — | — | — |
| 60 | e2e-handoff | ⏳ Queued | — | — | — |
| 61 | e2e-help-articles-knowledge-rag | ⏳ Queued | — | — | — |
| 62 | e2e-integration-flows | ⏳ Queued | — | — | — |
| 63 | e2e-invoice-history | ⏳ Queued | — | — | — |
| 64 | e2e-knowledge-advanced | ⏳ Queued | — | — | — |
| 65 | e2e-knowledge-base | ⏳ Queued | — | — | — |
| 66 | e2e-knowledge-lifecycle | ⏳ Queued | — | — | — |
| 67 | e2e-knowledge-management | ⏳ Queued | — | — | — |
| 68 | e2e-leads | ⏳ Queued | — | — | — |
| 69 | e2e-memory-otp | ⏳ Queued | — | — | — |
| 70 | e2e-middleware-infra | ⏳ Queued | — | — | — |
| 71 | e2e-model-selection-removal | ⏳ Queued | — | — | — |
| 72 | e2e-navigation-onboarding | ⏳ Queued | — | — | — |
| 73 | e2e-navigation | ⏳ Queued | — | — | — |
| 74 | e2e-notification-preferences | ⏳ Queued | — | — | — |
| 75 | e2e-onboarding-checklist | ⏳ Queued | — | — | — |
| 76 | e2e-onboarding-wizard | ⏳ Queued | — | — | — |
| 77 | e2e-otp-advanced | ⏳ Queued | — | — | — |
| 78 | e2e-overview-page | ⏳ Queued | — | — | — |
| 79 | e2e-ownership-fix | ⏳ Queued | — | — | — |
| 80 | e2e-performance-page | ⏳ Queued | — | — | — |
| 81 | e2e-plan-limits | ⏳ Queued | — | — | — |
| 82 | e2e-pricing | ⏳ Queued | — | — | — |
| 83 | e2e-profile-removed | ⏳ Queued | — | — | — |
| 84 | e2e-public-pages | ⏳ Queued | — | — | — |
| 85 | e2e-publish | ⏳ Queued | — | — | — |
| 86 | e2e-quick-templates | ⏳ Queued | — | — | — |
| 87 | e2e-rag-memory-edge-cases | ⏳ Queued | — | — | — |
| 88 | e2e-recover-stuck-sources | ⏳ Queued | — | — | — |
| 89 | e2e-reembed-detection | ⏳ Queued | — | — | — |
| 90 | e2e-security | ⏳ Queued | — | — | — |
| 91 | e2e-sentiment | ⏳ Queued | — | — | — |
| 92 | e2e-settings-ai-model | ⏳ Queued | — | — | — |
| 93 | e2e-settings-editors | ⏳ Queued | — | — | — |
| 94 | e2e-settings-escalation | ⏳ Queued | — | — | — |
| 95 | e2e-settings-feedback | ⏳ Queued | — | — | — |
| 96 | e2e-settings-general | ⏳ Queued | — | — | — |
| 97 | e2e-settings-handoff | ⏳ Queued | — | — | — |
| 98 | e2e-settings-memory | ⏳ Queued | — | — | — |
| 99 | e2e-settings-prechat | ⏳ Queued | — | — | — |
| 100 | e2e-settings-proactive | ⏳ Queued | — | — | — |
| 101 | e2e-settings-save | ⏳ Queued | — | — | — |
| 102 | e2e-settings-survey | ⏳ Queued | — | — | — |
| 103 | e2e-settings-system-prompt | ⏳ Queued | — | — | — |
| 104 | e2e-settings-transcripts | ⏳ Queued | — | — | — |
| 105 | e2e-settings-uploads | ⏳ Queued | — | — | — |
| 106 | e2e-slack-integration | ⏳ Queued | — | — | — |
| 107 | e2e-survey | ⏳ Queued | — | — | — |
| 108 | e2e-telegram-integration | ⏳ Queued | — | — | — |
| 109 | e2e-ticketing-system | ⏳ Queued | — | — | — |
| 110 | e2e-tooltip | ⏳ Queued | — | — | — |
| 111 | e2e-untested-endpoints | ⏳ Queued | — | — | — |
| 112 | e2e-upgrade-page | ⏳ Queued | — | — | — |
| 113 | e2e-webhooks | ⏳ Queued | — | — | — |
| 114 | e2e-widget-advanced | ⏳ Queued | — | — | — |
| 115 | e2e-widget-config | ⏳ Queued | — | — | — |
| 116 | e2e-widget-core | ⏳ Queued | — | — | — |
| 117 | e2e-widget-customization | ⏳ Queued | — | — | — |
| 118 | e2e-widget-sdk | ⏳ Queued | — | — | — |
| 119 | e2e-zapier | ⏳ Queued | — | — | — |
| 120 | e2e-zero-state-dashboard | ⏳ Queued | — | — | — |
| 121 | e2e-zz-widget-chat-interaction | ⏳ Queued | — | — | — |

## Partial Summary (37/121 files completed)
- Total files completed: 37
- Passed: 12
- Failed: 24
- Running: 1
- Queued: 84

### Individual test counts (completed files):
- Total tests run: ~600
- Passed: ~460
- Failed: ~140
- Skipped: ~61

## Failure Categories

### Category 1: Widget iframe interaction timeouts (largest group, ~80+ failures)
**Files:** e2e-credit-exhaustion-ux-fixes (33 fails), e2e-chatbot-widget-deploy-page (14 fails), e2e-calendar-booking (15 fails), e2e-cross-feature-integration (4+ fails)
**Root cause:** Widget iframe tests timing out waiting for fallback views, credit exhaustion states, or widget elements to render. Likely the widget embed page changed structure or the iframe load timing is different.
**Safe fix?** No -- would need to investigate whether widget rendering behavior changed (possible UX change).

### Category 2: Calendar scheduling UI not rendering (25 failures)
**File:** e2e-calendar-scheduling (25/25 fail)
**Root cause:** All tests timeout at ~33s waiting for calendar scheduling page UI elements. The page structure likely changed.
**Safe fix?** No -- would need to inspect the actual page to determine if selectors need updating or if the feature is broken.

### Category 3: Agent console beforeAll cascade (19+ failures)
**Files:** e2e-agent-console-core (1 fail + 18 skipped), e2e-agent-console-advanced (6 fail + 6 skipped)
**Root cause:** AGENT-001 layout test fails immediately, cascading to skip all dependent tests. Realtime/presence tests timeout (3m) due to Supabase Realtime not available.
**Safe fix?** No -- the layout render failure needs investigation.

### Category 4: Chatbot creation wizard (8 failures)
**File:** e2e-chatbot-creation (8/17 fail)
**Root cause:** Multi-step creation wizard tests failing. Likely step navigation or form selector changes.
**Safe fix?** Potentially -- if only selectors changed.

### Category 5: Miscellaneous (scattered 1-2 failures per file)
Various small failures across admin-credits, analytics, api-keys-crud, appsumo-license, article-generation, auto-topup, billing, etc. Each needs individual investigation.
