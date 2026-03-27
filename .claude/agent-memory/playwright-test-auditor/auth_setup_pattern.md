---
name: Auth Setup Pattern
description: How E2E auth works -- /api/auth/e2e-login with secret, cookie chunking, hardcoded project ref
type: project
---

E2E auth uses tests/e2e-auth.setup.ts which POSTs to /api/auth/e2e-login with the E2E_SECRET env var. Sets Supabase session cookie with a hardcoded PROJECT_REF (check the setup file for current value). Storage state saved to tests/auth/e2e-storage.json. Admin promotion uses /api/auth/e2e-set-admin.

**Why:** All authenticated e2e tests depend on this setup. The hardcoded project ref means Supabase project changes silently break all auth tests.

**How to apply:** Verify e2e-auth.setup.ts runs before investigating auth failures. If switching Supabase project, update PROJECT_REF.
