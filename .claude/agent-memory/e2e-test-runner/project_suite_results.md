---
name: Full Suite Run Results (2026-04-01)
description: Complete 121-file E2E suite run results — pass/fail counts and key failure categories
type: project
---

**Run date:** 2026-04-01
**Total files:** 121
**Results file:** `/home/wcooke/projects/vocui/e2e-results.md`

## Final Totals
- Passed: 59
- Passed (fixed): 10
- Failed: 52
- Failed (noted): 0

## Key Passing Groups (rows 94-121 additions)
- e2e-settings-memory: 6 passed
- e2e-settings-proactive: 6 passed
- e2e-settings-save: 7 passed
- e2e-settings-survey: 7 passed
- e2e-settings-transcripts: 7 passed
- e2e-slack-integration: 11 passed
- e2e-survey: 4 passed
- e2e-telegram-integration: 19 passed
- e2e-tooltip: 2 passed
- e2e-untested-endpoints: 7 passed
- e2e-upgrade-page: 16 passed (1 flaky)
- e2e-widget-config: 4 passed
- e2e-widget-customization: 12 passed
- e2e-widget-sdk: 8 passed (1 flaky)
- e2e-zapier: 19 passed
- e2e-zero-state-dashboard: 6 passed
- e2e-zz-widget-chat-interaction: 2 passed

## Key Failing Groups (rows 94-121 additions)
- e2e-settings-escalation: 3 failed (.chat-widget-container)
- e2e-settings-feedback: 1 failed (.chat-widget-container)
- e2e-settings-general: 3 failed (form input not visible)
- e2e-settings-handoff: 3 failed (.chat-widget-container)
- e2e-settings-prechat: 6 failed (.chat-widget-container)
- e2e-settings-system-prompt: 5 failed (nav tab renamed)
- e2e-settings-uploads: 3 failed (.chat-widget-container)
- e2e-ticketing-system: 1 failed + 39 not run (API 404)
- e2e-webhooks: 6 failed (strict mode duplicate headings)
- e2e-widget-advanced: 1 failed (aria-disabled banner)
- e2e-widget-core: 23 failed (.chat-widget-container, 19min runtime)

**Why:** Snapshot of completed suite for baseline comparison on next run.
**How to apply:** Compare against this to identify regressions or improvements.
