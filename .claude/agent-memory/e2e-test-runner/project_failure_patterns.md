---
name: Common E2E Failure Patterns
description: Recurring failure root causes across the 121-file suite with fix safety notes
type: project
---

## Pattern 1: `.chat-widget-container` 15s timeout (largest group)
**Affected files:** e2e-settings-escalation (3 fails), e2e-settings-feedback (1), e2e-settings-handoff (3), e2e-settings-prechat (6), e2e-settings-uploads (3), e2e-widget-core (23), e2e-widget-advanced (1)
**Root cause:** Tests navigate to `/widget/<chatbot-id>` and wait 15s for `.chat-widget-container` to be visible, but it never appears. The widget full-page route likely changed structure or the container class was renamed.
**Safe fix?** Needs investigation — could be a class rename (safe) or a functional regression (not safe).

## Pattern 2: Strict mode violation — duplicate headings
**Affected files:** e2e-webhooks (6 fails)
**Root cause:** `getByRole('heading', { name: 'Webhooks' })` resolves to both `<h1>` and `<h3>` elements on the webhooks page. Tests need `.first()` or `.locator('h1')` to disambiguate.
**Safe fix?** Yes — adding `.first()` or scoping to `h1` is a test-only change.

## Pattern 3: Settings nav tab renamed
**Affected files:** e2e-settings-system-prompt (5 fails)
**Root cause:** `nav button` with text `'System Prompt'` not found. Tab was likely renamed to `'Chatbot Instructions'` (consistent with row 48 fix note for deploy-publish-flow).
**Safe fix?** Yes — update the nav button text selector in the test.

## Pattern 4: Widget API endpoint returning 404
**Affected files:** e2e-ticketing-system (1 fail + 39 not run)
**Root cause:** TKT-001 calls ticket creation API, gets 404 instead of 201. The `/api/widget/[chatbotId]/tickets` route may not exist yet or path changed.
**Safe fix?** No — the endpoint appears missing/broken, which is a real issue.

## Pattern 5: Server crash / build artifact corruption
**Observed:** Row 93 (e2e-settings-editors) — server went down mid-run. `.next/routes-manifest.json` missing.
**Recovery:** `npm run build` to rebuild .next artifacts, then restart dev server.
**How to apply:** Check server health before each test. If non-403/200, stop and rebuild.

## Pattern 6: Chatbot settings general form input not visible
**Affected files:** e2e-settings-general (3 fails)
**Root cause:** `input#name, input[name="name"]` not visible within 45s on settings page. Suggests form rendering or navigation changed.

**Why:** Documented so future runs can quickly identify root causes without re-investigating.
**How to apply:** When a test fails, cross-reference this list before investigating further.
