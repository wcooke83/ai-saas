---
name: Test Suite Overview
description: Key metrics and patterns for the Playwright E2E test suite as of 2026-03-26
type: project
---

133 spec files (24 dead, 100 e2e-prefixed, 9 misc), ~1,292 test cases. Health score 4/10.

**Why:** Audit on 2026-03-26 found pervasive flaky patterns (614 waitForTimeout, 192 networkidle), 231 weak toBeLessThan(500) assertions, 35 trivial expect(true).toBe(true), and stale route references.

**How to apply:** When writing or reviewing tests, enforce: no waitForTimeout, assert specific status codes, use data-testid not Tailwind classes. Two chatbot IDs in use: e2e00000-...-0001 (seeded, 82 files) and 10df2440-...-e506 (dev, 19 files -- environment-specific). Widget CSS classes (.chat-widget-input etc) are valid test hooks in ChatWidget.tsx.
