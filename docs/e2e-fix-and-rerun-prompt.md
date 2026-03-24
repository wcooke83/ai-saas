# E2E Test Fix & Re-run Prompt

Copy everything below the line and paste it into a new Claude Code session.

---

You are an E2E test fixer. Your job is to take each failed or skipped test from the previous test run, attempt to fix the root cause, re-run the test, and iterate until all tests pass or I explicitly approve skipping them.

## Input

Read `docs/e2e-test-results.md` for the previous run results. Extract every test that was **failed** or **skipped** (any row where Skipped > 0, or any test listed under "Skipped Tests (3-strike rule)"). These are your targets.

## Results File — Live Updates

Write results to `docs/e2e-test-results-1.md` and **update it after every single test action** (not at the end). I will be watching this file in real-time. Use this format:

```markdown
# E2E Test Fix & Re-run Results — {date}

## Progress
- Total target tests: {N}
- Fixed & passing: {N}
- Awaiting my input: {N}
- Still processing: {N}

## Test Status

| # | Test ID | File | Line | Status | Attempts | Current State |
|---|---------|------|------|--------|----------|---------------|
| 1 | CUSTOMIZE-001 | e2e-widget-customization.spec.ts | 15 | FIXING | 0/3 | Analyzing root cause... |
| 2 | ... | ... | ... | QUEUED | 0/3 | |

Status values: QUEUED, FIXING, RUNNING, PASSED, WAITING_FOR_USER, SKIPPED_BY_USER

## Fix Log
### CUSTOMIZE-001 — `getByText('Colors')` strict mode violation
**Root cause:** ...
**Attempt 1:** ...
**Result:** ...
**Attempt 2:** ...
...
```

Update the table row status and append to the Fix Log after each step.

## Processing Rules — For Each Target Test

### Step 1: Analyze the failure
- Read the test file and the source code it tests
- Read the error message from `docs/e2e-test-results.md`
- Identify the root cause category:
  - **Test locator issue** (strict mode, wrong selector, stale element)
  - **Test assertion mismatch** (expected value differs from actual)
  - **Test timing issue** (timeout too short, missing waitFor, race condition)
  - **Source code bug** (the application code actually has a defect)
  - **Data/infrastructure issue** (missing seed data, API credits, config)
  - **Environment issue** (clipboard API, headless browser limitation)

### Step 2: Fix the root cause
Apply the appropriate fix:
- **Test locator issue:** Fix the locator to be more specific (use `getByRole`, `getByTestId`, `.first()`, `{ exact: true }`, etc.)
- **Test assertion mismatch:** Fix the assertion to match the actual application behavior, OR fix the source code if the behavior is wrong
- **Test timing issue:** Add appropriate `waitFor`, increase timeout, add retry pattern
- **Source code bug:** Fix the source code, not the test
- **Data/infrastructure issue:** Add seed data via Supabase REST API in `beforeAll`, reset credits, enable config flags
- **Environment issue:** Add browser context grants (e.g., clipboard permissions), or restructure the test to avoid the limitation

**Important:** You MAY modify both test files AND source code. Prefer fixing source code when the test expectation is correct but the app behavior is wrong. Prefer fixing the test when the app behavior is correct but the test expectation is wrong.

### Step 3: Run the test
```bash
npx playwright test tests/{file}.spec.ts --project=e2e --reporter=line --grep "{test name pattern}"
```
If `--grep` is unreliable, run the entire spec file.

### Step 4: Evaluate result
- **PASS:** Update results file, mark as PASSED, move to next test.
- **FAIL (attempt < 3):** Analyze the NEW error output. The error may have changed. Apply a different fix. Increment attempt counter. Go to Step 2.
- **FAIL (attempt = 3):** Stop. Update results file status to `WAITING_FOR_USER`. Present me with:

```
## WAITING FOR INPUT: {Test ID}

**Test:** {full test name}
**File:** {file}:{line}
**Failed 3 times.** Here's what I tried:

1. {description of fix 1} → {result}
2. {description of fix 2} → {result}
3. {description of fix 3} → {result}

**Latest error:**
{error message}

**My proposed fix:**
{detailed description of what I would try next, with code snippets}

**Options:**
- Reply "try it" — I'll apply the proposed fix and continue
- Reply "skip" — I'll mark this test as SKIPPED_BY_USER and move on
- Reply with your own instructions — I'll follow them
```

### Step 5: After user responds
- If "try it": Apply the proposed fix, run the test. If it fails again, propose another solution (loop back to the WAITING_FOR_USER prompt). Keep looping until it passes or user says "skip".
- If "skip": Mark as SKIPPED_BY_USER in results, move to next test.
- If custom instructions: Follow them, run the test, evaluate.

## Execution Order

Process tests in this order:
1. Tests where the fix is likely a simple locator/assertion change (fast wins)
2. Tests where source code changes may be needed
3. Tests with environment/infrastructure issues (hardest)

## Environment Info

- Dev server runs on `http://localhost:3030` (confirm it's running before starting)
- Run tests with: `npx playwright test tests/{file}.spec.ts --project=e2e --reporter=line`
- Supabase credentials are in `.env.local`
- E2E test user: `e2e-test@test.local`
- E2E chatbot ID: `e2e00000-0000-0000-0000-000000000001`
- Widget chatbot ID: `10df2440-6aac-441a-855d-715c0ea8e506`
- Auth storage: `tests/auth/e2e-storage.json`

## Constraints

- Do NOT skip a test without my approval
- Do NOT modify tests that are currently passing (check git diff before committing)
- Before each test run, ensure `messages_this_month` is reset to 0 for the widget chatbot: `curl -s -X PATCH "${SUPABASE_URL}/rest/v1/chatbots?id=eq.10df2440-6aac-441a-855d-715c0ea8e506" -H "apikey: ${SERVICE_KEY}" -H "Authorization: Bearer ${SERVICE_KEY}" -H "Content-Type: application/json" -d '{"messages_this_month": 0}'`
- Commit working fixes in batches (every 3-5 fixed tests) with message: "Fix E2E: {brief list of what was fixed}"
- Always update `docs/e2e-test-results-1.md` BEFORE and AFTER each test run so I can watch progress

## Start

Begin now. Read `docs/e2e-test-results.md`, extract all failed/skipped tests, initialize `docs/e2e-test-results-1.md` with the QUEUED table, then start processing test #1.
