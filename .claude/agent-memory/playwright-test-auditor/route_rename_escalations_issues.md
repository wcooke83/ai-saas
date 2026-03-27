---
name: Route Rename Issue
description: App routes /escalations were renamed to /issues but 3 test files still reference the old name
type: project
---

The app renamed escalation routes: dashboard page is /issues, API is /api/chatbots/[id]/issues. Three test files still use /escalations: e2e-chatbot-pages.spec.ts:16, e2e-security.spec.ts:31+69, e2e-api-validation.spec.ts:272+282. These tests pass silently because they use weak toBeLessThan(500) assertions that accept 404.

**Why:** Route rename happened without updating all test references. Weak assertions masked the breakage.

**How to apply:** When fixing test issues, update /escalations to /issues in these three files. This is a pattern to watch for -- any route rename should grep tests/ too.
