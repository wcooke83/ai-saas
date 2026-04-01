---
name: Test Framework & Infrastructure
description: Playwright config, test runner setup, auth state, server health check, and known slow tests
type: project
---

**Test framework:** Playwright with config at `playwright.config.ts`

**Auth state:** `tests/auth/e2e-storage.json` — loaded via storageState in config

**Test files location:** `tests/e2e-*.spec.ts`

**Run command:** `npx playwright test tests/<filename>.spec.ts --config=playwright.config.ts --timeout=60000`

**Server health check before each test file:**
```
curl -s -o /dev/null -w "%{http_code}" http://localhost:3030/api/auth/e2e-login -X POST -H "Content-Type: application/json" -d '{"secret":"test"}' 2>/dev/null
```
Expected: 403 (unauthenticated) or 200 (if test secret matches). Anything else = server down.

**Dev server log:** `server.log` in project root. Use `tail -n 200 server.log` on failure.

**Server crash pattern:** `.next/routes-manifest.json` missing = build artifact corruption = server returns 500 on all routes. Fix: `npm run build`.

**Slow test files (>5 min runtime):**
- `e2e-widget-core.spec.ts` — 26 tests, 19 min; most fail on `.chat-widget-container` 15s timeout
- `e2e-settings-system-prompt.spec.ts` — 6 tests, 10.5 min
- `e2e-settings-general.spec.ts` — 16 tests, 8.7 min
- `e2e-widget-advanced.spec.ts` — 36 tests, 5.9 min

**E2E test chatbot ID:** `e2e00000-0000-0000-0000-000000000001`
**E2E test user:** `e2e-test@test.local`

**Why:** Needed to restart the suite multiple times after server crashes; this info prevents re-discovery each time.
**How to apply:** Use this when starting or resuming a test run session.
