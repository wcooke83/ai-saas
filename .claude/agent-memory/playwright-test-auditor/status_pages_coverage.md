---
name: Status Pages Coverage
description: e2e-status-pages.spec.ts written 2026-04-03 — covers /admin/status and /status; 26 tests, patterns and ISR workaround
type: project
---

New file: `tests/e2e-status-pages.spec.ts` (26 tests, Section 50).

**Coverage:**
- ADMIN-STATUS-001–005: Components tab — 9 seeded components, select-driven status changes, optimistic update, all 4 status values, success toast via sonner
- ADMIN-STATUS-010–015: Incidents tab — create incident via UI modal, Add Update modal, posting updates with status changes, resolving moves to Resolved section
- ADMIN-STATUS-020–023: Maintenance tab — schedule maintenance modal, edit modal with prefilled values, create/edit via UI with datetime-local inputs
- ADMIN-STATUS-030–033: Public /status structural tests — always-safe checks that don't depend on ISR cache
- ADMIN-STATUS-040–042: Public /status reflection — uses `?_t=<timestamp>` cache-bust to get fresh SSR in dev mode; creates/resolves state and checks role="alert" callout and StatusChip aria-labels
- ADMIN-STATUS-050–052: Auth guard — unauthenticated browser context, PATCH and POST return 401

**Key patterns:**
- `waitForAdminStatusLoaded` helper waits for `role="tab" Components` to appear (spinner dismissed)
- `switchTab` helper clicks tab and waits for the correct section heading
- All tests that mutate DB state clean up in `try/finally` blocks or via dedicated `apiDelete*` helpers
- Toast detection: `[data-sonner-toaster] li` filtered by text
- Public page StatusChip selector: `[role="status"][aria-label="${name} is ${label}"]` (from StatusChip component)
- ISR bypass: `?_t=<timestamp>` query param; note this only works in `next dev` (no build cache); these tests are in `test.describe` with a comment warning

**Why:** tables `status_components`, `status_incidents`, `status_incident_updates`, `status_component_history` were freshly migrated with 9 seeded components.
