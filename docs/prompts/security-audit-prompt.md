Perform a complete security and architecture audit of this Next.js AI SaaS application. Read every relevant source file — do not speculate. Output the full audit report to `docs/security-audit-2026-03-24.md`.

## Scope — audit ALL of the following domains:

### 1. Supabase RLS & Authentication
- Read all files in `src/lib/supabase/` — verify the admin client (service role) is never imported in client-accessible code
- Read `src/middleware.ts` — check session refresh, redirect logic, unprotected routes, CORS config
- Query Supabase for RLS policies on ALL tables: profiles, subscriptions, usage, generations, api_keys, tools, webhooks, audit_log, chatbots, knowledge_sources, knowledge_chunks, chat_sessions, chat_messages, and any new tables (calendar, tickets, articles, contact_submissions, issues)
- Verify every RLS policy has proper `auth.uid()` checks
- Check for any API routes or server actions that use the admin client when they should use the user-scoped client

### 2. API Route Security
- Read EVERY route in `src/app/api/` recursively — check each for:
  - Missing or inadequate input validation
  - Raw user input passed into Supabase `.eq()`, `.filter()`, `.rpc()` without sanitization
  - Missing authentication checks
  - Missing rate limiting on AI generation and auth endpoints
  - CORS misconfiguration
- Pay special attention to new routes: `api/calendar/`, `api/chatbots/[id]/articles/`, `api/chatbots/[id]/contact-submissions/`, `api/chatbots/[id]/issues/`, `api/chatbots/[id]/tickets/`, `api/widget/[chatbotId]/articles/`, `api/widget/[chatbotId]/contact/`, `api/widget/[chatbotId]/purchase/`, `api/widget/[chatbotId]/tickets/`, `api/e2e/`
- Check if the `api/e2e/` route is properly gated to non-production environments

### 3. Stripe Integration
- Find all Stripe webhook handlers — verify `stripe.webhooks.constructEvent()` usage with webhook secret
- Check subscription state consistency: can users access paid features after cancellation?
- Look for tier escalation attacks via parameter manipulation
- Check webhook idempotency handling
- Review the upgrade flow in `src/app/(authenticated)/dashboard/upgrade/page.tsx`

### 4. API Key Management
- Check how API keys in the `api_keys` table are stored — hashed or plaintext?
- Review key scope enforcement and validation
- Check if keys are ever exposed in client-side code or API responses
- Review `src/app/(authenticated)/dashboard/api-keys/page.tsx` and its backing API routes

### 5. Next.js App Router Security Patterns
- Check for server/client component boundary violations — secrets or server-only imports in 'use client' files
- Verify all `src/app/(authenticated)/dashboard/` pages gate on auth before rendering
- Check for data fetching waterfalls in server components
- Review error boundaries: `src/app/error.tsx` and `src/app/(authenticated)/dashboard/error.tsx`

### 6. RAG Pipeline & Prompt Injection
- Read all files in `src/lib/chatbots/` — trace the full RAG flow from knowledge ingestion to chat response
- Check if knowledge source content (URLs, PDFs, DOCX) can inject instructions into system prompts
- Check if chat messages are sanitized before inclusion in LLM context
- Review `src/lib/chatbots/tools/` for any tool-use security issues
- Check `src/app/api/chat/[chatbotId]/route.ts` for injection vectors
- Review `src/components/widget/ChatWidget.tsx` for XSS in rendered AI responses
- Check the new fallback views in `src/components/widget/fallback-views.tsx`

### 7. AI Provider System
- Read `src/lib/ai/provider.ts` and all files in `src/lib/ai/providers/`
- Check if `AI_MOCK_MODE` can leak to production (must be gated on `NODE_ENV`)
- Verify error handling in the Claude → OpenAI fallback chain
- Check token/cost tracking accuracy
- Review prompt templates in `src/lib/ai/prompts/` for injection risks

### 8. Data Integrity & Database
- Read migration files in `supabase/migrations/` and `src/types/database.ts`
- Check for missing indexes on foreign keys and frequently queried columns
- Check cascading deletes: deleting a chatbot must cascade to knowledge_sources, chunks, sessions, messages
- Look for race conditions on usage limit checks (read-then-write without transactions)
- Review new migrations: calendar booking, credit exhaustion fallback, business hours, article extraction

### 9. Error Handling, Performance & Reliability
- Find unhandled promise rejections (async without try/catch)
- Check for missing React error boundaries
- Identify N+1 query patterns and unbounded `.select()` without `.limit()`
- Look for large payload responses that should be paginated or streamed
- Check the email integration (`src/lib/email/`) for error handling

### 10. Widget & Embed Security
- Review `src/app/widget/[chatbotId]/page.tsx` and `src/app/api/widget/` routes
- Check for XSS vectors where user or AI content is rendered
- Verify widget config endpoint doesn't leak sensitive chatbot data
- Check CORS and origin validation for widget/embed endpoints

### 11. Sensitive Data Exposure
- Search for hardcoded secrets, API keys, or credentials in source files
- Check `.gitignore` for adequate coverage
- Verify environment variables are not exposed to the client (no `NEXT_PUBLIC_` prefix on secrets)
- Check if error responses leak stack traces or internal details

## Output Format

Write the report to `docs/security-audit-2026-03-24.md` with this structure:

```markdown
# Security & Architecture Audit Report
**Date**: 2026-03-24
**Scope**: Full application audit

## Executive Summary
[2-3 paragraph overview of overall security posture, critical risks, and top recommendations]

## Findings by Severity

### Critical
[Findings that need immediate attention — active exploits, data exposure, auth bypass]

### High
[Significant vulnerabilities that should be fixed before next release]

### Medium
[Issues that increase risk but aren't immediately exploitable]

### Low
[Minor issues, hardening opportunities]

### Informational
[Best practice suggestions, architectural notes]

## Detailed Findings by Domain

### 1. Supabase RLS & Authentication
[All findings with severity, location (file:line), issue, detail, fix]

### 2. API Route Security
[...]

### 3. Stripe Integration
[...]

### 4. API Key Management
[...]

### 5. Next.js App Router Patterns
[...]

### 6. RAG Pipeline & Prompt Injection
[...]

### 7. AI Provider System
[...]

### 8. Data Integrity & Database
[...]

### 9. Error Handling & Performance
[...]

### 10. Widget & Embed Security
[...]

### 11. Sensitive Data Exposure
[...]

## Summary Statistics
- Total findings: X
- Critical: X | High: X | Medium: X | Low: X | Info: X

## Recommended Remediation Priority
[Ordered list of what to fix first]
```

For each finding use this format:
- **Severity**: Critical / High / Medium / Low / Info
- **Location**: `file/path.ts:LINE`
- **Issue**: One-line description
- **Detail**: 2-3 sentence explanation
- **Fix**: Concrete code snippet or approach

Read every file. Do not skip domains. If a domain has no issues after thorough review, state that explicitly. Do not fabricate findings.
