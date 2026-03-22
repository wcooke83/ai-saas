# Chatbot System Full Audit — 2026-03-22

Comprehensive audit covering technical issues, UX/UI problems, and recommendations.
Conducted by AI Chatbot Expert and UX Designer agents.

---

## Part 1: Technical Audit

### 1. Bugs Found

**BUG-1: Inconsistent `live_fetch_threshold` in performance log vs RAG pipeline**
- `src/app/api/chat/[chatbotId]/route.ts` (lines 772, 883) — perf log uses hardcoded `0.80` fallback
- `src/lib/chatbots/rag.ts` (line 245) — RAG pipeline uses `DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.55`
- Result: perf log records `live_fetch_triggered: false` when the RAG pipeline actually triggered a live fetch (e.g., confidence 0.60 triggers against 0.55 but perf log says false against 0.80). Corrupts analytics.

**BUG-2: `live_fetch_threshold` accessed via `as any` cast everywhere**
- `rag.ts` line 245, `route.ts` lines 772, 883 — all use `(chatbot as any).live_fetch_threshold`
- The `Chatbot` type in `types.ts` does NOT include this field. Migration `20260321600000` adds the column but TypeScript types were never updated. No type safety.

**BUG-3: URL extractor race condition does not actually race**
- `src/lib/chatbots/knowledge/extractors/url.ts` (lines 50-81)
- `extractURLRaced()` calls `Promise.all([jinaPromise, directPromise])` — waits for BOTH. The `directPromise` has a 3s delay. Even if Jina completes first, it waits for direct fetch to finish/timeout. Should use `Promise.any()` or `Promise.race()`.

**BUG-4: Fire-and-forget promises unhandled in `createMessage`**
- `src/lib/chatbots/api.ts` (lines 435-442)
- `Promise.all([...])` called without `await` or `.catch()`. If both RPCs fail, rejections are swallowed but could trigger unhandled promise rejection warnings.

**BUG-5: Embedding dimension mismatch not fully handled**
- `rag.ts` line 170: `dimensions: 1536` hardcoded. If Gemini embeddings return non-1536 vectors, `match_knowledge_chunks` RPC expects `vector(1536)`, causing silent dimension mismatch.

**BUG-6: BFS crawler adds URLs to queue without dedup check**
- `src/lib/chatbots/knowledge/crawler.ts` (lines 327-331)
- Queue grows unbounded for large sites. `addPageIfValid` deduplicates pages but the queue itself doesn't check `seen`.

### 2. Performance Issues

**PERF-1: Performance API fetches ALL rows for aggregate computation**
- `src/app/api/chatbots/[id]/performance/route.ts` (lines 61-69)
- Fetches every performance log row to compute averages/p95 client-side. Should use SQL aggregation (`AVG()`, `percentile_cont()`).

**PERF-2: N+1 query in `getChatbotsWithStats`**
- `src/lib/chatbots/api.ts` (lines 76-95)
- For each chatbot, two separate count queries run. 10 chatbots = 20 queries. Should use a single aggregate query.

**PERF-3: `match_knowledge_chunks` RPC function migration unclear**
- Only `match_priority_knowledge_chunks` has a visible migration. Original RPC may not have HNSW-optimized index awareness.

**PERF-4: Embedding cache is process-local**
- `src/lib/chatbots/knowledge/embeddings.ts` (lines 19-45)
- In serverless (Vercel), each invocation is a new process. The 200-entry LRU cache has near-zero hit rate.

**PERF-5: Chunker uses rough 4-char-per-token estimate**
- `src/lib/chatbots/knowledge/chunker.ts` (line 20)
- `Math.ceil(text.length / 4)` diverges significantly for non-Latin scripts (CJK, Arabic).

### 3. Missing Features

**MISS-1: No retry/backoff for embedding API calls**
- Direct `fetch()` to OpenAI with no retry logic. Rate limits cause immediate failure of entire knowledge processing job.

**MISS-2: No chunking for Q&A pairs with very long answers**
- `processor.ts` line 106: Q&A metadata (question/answer pairing) lost after chunking.

**MISS-3: No message count validation on streaming path**
- `monthly_message_limit` check (line 291) only runs on initial request. Concurrent requests can exceed limit.

**MISS-4: No input sanitization on `user_context` in system prompt**
- `sanitizeContextValue()` is regex-based and catches only a few patterns. Can be bypassed.

**MISS-5: No knowledge source content validation before chunking**
- Only check is `!content.trim()`. URL returning cookie consent banner or 403 page gets chunked as "knowledge."

**MISS-6: No deduplication of knowledge chunks across sources**
- Same URL added twice or crawled overlap creates duplicate chunks, wasting context tokens.

### 4. Code Quality Issues

**QUAL-1: 35 occurrences of `createAdminClient() as any` across 19 files**
- Admin client type doesn't include chatbot tables. Fix: run `npm run db:gen-types` and update generics.

**QUAL-2: Dead exported functions**
- `chunkByCharacters()` in `chunker.ts` — never imported
- `extractDOCXAsMarkdown()` in `extractors/docx.ts` — never imported
- `cosineSimilarity()` in `embeddings.ts` — never imported
- `getEmbeddingDimensions()` in `embeddings.ts` — never imported

**QUAL-3: Duplicate `Message` type definitions**
- Defined in both `types.ts` (line 805) and `ChatWidget.tsx` (line 144) with different shapes. Widget version has extra fields (`checkInActions`, `clickedAction`, `attachments`, `metadata`).

**QUAL-4: Duplicate `StageSpan` interface**
- Identical definition in `rag.ts` (line 14) and `route.ts` (line 48). Should be shared.

**QUAL-5: Inconsistent model tier mapping**
- `route.ts` lines 657-661: Hardcoded model map with specific IDs. Will break when new models are added.

### 5. Security Concerns

**SEC-1: `Access-Control-Allow-Origin: *` on all chat/widget endpoints**
- Any website can make requests. Attacker sites can spam messages or probe configurations.

**SEC-2: Rate limiter is in-memory and per-instance**
- `route.ts` lines 132-149: `rateLimitMap` is process-local. Multi-instance deployments have separate rate limit state.

**SEC-3: Widget config endpoint exposes internal configuration**
- `/api/widget/[chatbotId]/config` returns full widget config including escalation/handoff config. Reveals integration presence.

**SEC-4: No CSRF protection on widget endpoints**
- Widget endpoints accept POST from any origin with no CSRF token.

**SEC-5: Prompt injection surface in `userContext`**
- `sanitizeContextValue()` is an allowlist of a few regexes, easily bypassed.

**SEC-6: Chatbot API key validation uses wrong client context**
- `src/lib/chatbots/api.ts` line 528: `validateChatbotAPIKey` uses server client with RLS, but called from public route using admin client.

---

## Part 2: UX/UI Audit

### 1. Chat Widget

#### Usability Issues

**CRITICAL: Silent file upload failure (lines 393-397)**
When a file exceeds the size limit or has a disallowed MIME type, `validFiles` becomes empty and the function returns silently. User gets zero feedback.

**CRITICAL: Generic error message on send failure (lines 1052-1062)**
Failed messages show only a generic translated string. No retry button, no detail, no recovery path. The failed message remains as if it succeeded.

**MAJOR: `onKeyPress` is deprecated (line 2635)**
Should be `onKeyDown`. May not fire correctly in all browsers.

**MAJOR: No character count or limit indicator on chat input**
No visible limit. Extremely long messages could cause issues.

**MAJOR: `confirm()` used for destructive actions (knowledge page lines 169, 191)**
Native dialogs are jarring, not accessible, and break the visual language.

**MINOR: ThumbsUp/ThumbsDown icons imported but never rendered**
Line 4 imports from lucide-react but never used. Missed feedback mechanism opportunity.

#### Accessibility Problems

**CRITICAL: `dangerouslySetInnerHTML` without ARIA (lines 2331-2334, 2367-2373)**
Message containers have no `role="log"` or `aria-live="polite"`. Screen readers won't announce new messages.

**CRITICAL: Header buttons lack descriptive text**
Escalation button (line 2070) and handoff button (line 2093) rely on inline SVGs without accessible text.

**MAJOR: Messages container lacks `role="log"` and `aria-live` (line 2310)**

**MAJOR: Header buttons have tiny touch targets (~24x26px)**
Padding is 4px with 16-18px icons. Below WCAG 2.1 minimum of 44x44px.

**MAJOR: Pre-chat form inputs lack `aria-required` and `aria-invalid` (lines 2173-2183)**
Only a visual asterisk when required. No programmatic association.

**MINOR: Typing indicator dots have no accessible text (lines 2467-2471)**
Three empty `<span>` elements. Add `aria-label="Bot is typing"`.

#### Visual Design Issues

**MAJOR: Inline styles mixed with CSS class styles**
Mix of generated CSS classes and inline `style={{}}`. Unpredictable when configs change.

**MINOR: Agent typing indicator doesn't match AI typing indicator style**

#### Missing UX Patterns

**MAJOR: No message retry mechanism**
Failed messages can't be retried. User must retype.

**MAJOR: No explicit file upload success feedback**
No toast, animation, or confirmation text per file.

**MINOR: No "scroll to bottom" button**
Users in long conversations may miss new messages.

**MINOR: No copy-message feature**
Standard expectation in chat, especially for code/links.

#### Mobile/Responsive

**GOOD: Mobile responsive behavior is well handled**
Fullscreen on mobile with proper iframe/SDK communication.

**MINOR: Report/survey forms may be cramped with virtual keyboard**

### 2. Chatbot Dashboard Pages

#### Settings Page

**CRITICAL: Unsaved changes lost without warning**
No dirty state tracking, no `beforeunload` handler. Navigating away silently discards all changes.

**MAJOR: Save button only at page top (line 349)**
Long page with 11 sections. No sticky/floating save button.

**MAJOR: Mobile section nav overflows (lines 360-381)**
11 sections in horizontal pills with no scroll indicator or fade affordance.

**MAJOR: 30+ individual `useState` calls (lines 111-136)**
No form-level dirty detection, undo/reset, or change confirmation.

**MINOR: Temperature slider goes to 2.0 (line 749)**
2.0 produces incoherent output. Should cap at 1.0 or warn above 1.0.

#### Knowledge Page

**GOOD: Realtime updates via Supabase subscription**
**GOOD: Optimistic updates for priority toggle and reprocessing**

**MAJOR: No drag-and-drop for file uploads**
Despite having URL, text, and Q&A sources, no drag-and-drop zone for PDF/DOCX.

**MINOR: Error messages truncated to 50 chars (line 483)**
`title` doesn't work on mobile. Need click-to-expand.

**MINOR: "chunks" count has no explanation (line 478)**
New users won't understand "12 chunks". Needs tooltip.

#### Performance Page

**GOOD: Waterfall visualization is excellent**
**GOOD: Anomaly detection with red border/warning icon**

**MAJOR: Dark theme inconsistency**
Performance page uses dark backgrounds while rest of dashboard follows light/dark toggle.

**MINOR: Fixed 180px label width breaks mobile (line 349)**
**MINOR: Message Preview defaults to collapsed (lines 57-58)**

#### Deploy Page

**GOOD: Progressive disclosure with Quick Start one-liner**
**GOOD: Contextual copy feedback**

**MAJOR: Copy button only visible on hover (line 41: `opacity-0 group-hover:opacity-100`)**
Touch devices can't discover it.

**MAJOR: "Chatbot not published" warning has no action button (lines 258-268)**
Tells user to go elsewhere but provides no link.

**MINOR: Live Preview loads actual widget (triggers API calls, may error if unpublished)**

### 3. Chatbot Builder Flow

**GOOD: Clean 3-step wizard with progress indicator**
**GOOD: "What happens next?" section**

**MAJOR: No knowledge step in wizard**
After creation, user is redirected to overview. No prompt to add knowledge sources immediately.

**MAJOR: No system prompt preview or test**
No way to see how the bot would respond during setup.

**MINOR: Progress connector lines fixed width `w-24` — overflows on narrow screens**
**MINOR: Minimal step validation — single character name is valid**

### 4. Cross-Cutting Concerns

#### Error Handling
- No React error boundaries — component crashes show white screen
- Generic "Failed to fetch chatbot" messages don't distinguish network/auth/404 errors
- Widget swallows several errors with `console.warn` and no user feedback

#### Onboarding Gaps
1. No guided tour or first-time experience
2. No empty state CTA for first-time users on chatbot list
3. No "test your chatbot" step in the flow

#### Navigation
- 11+ sub-pages with no persistent sidebar or breadcrumbs
- Going from Settings to Knowledge requires 2 clicks (back to overview, then to Knowledge)

---

## Prioritized Recommendations

### P0 — Critical Bugs

| # | Issue | Reference |
|---|-------|-----------|
| 1 | Fix `live_fetch_threshold` mismatch between perf log and RAG pipeline | BUG-1 |
| 2 | Add `live_fetch_threshold` to `Chatbot` type, remove `as any` casts | BUG-2 |
| 3 | Replace `Promise.all` with `Promise.any` in `extractURLRaced` | BUG-3 |
| 4 | Add `.catch()` to fire-and-forget `Promise.all` in `createMessage` | BUG-4 |
| 5 | Add unsaved-changes detection to Settings page | UX-CRITICAL |

### P1 — Quick Wins (Low effort, high impact)

| # | Issue | Reference |
|---|-------|-----------|
| 6 | Add `role="log"` and `aria-live="polite"` to chat messages container | A11Y |
| 7 | Show file upload error feedback (toast or inline message) | UX |
| 8 | Make code block copy buttons always visible (remove hover-only) | UX |
| 9 | Add "Publish" button/link to unpublished warning on Deploy page | UX |
| 10 | Replace `onKeyPress` with `onKeyDown` on chat input | BUG |
| 11 | Add `aria-required` and `aria-invalid` to pre-chat form fields | A11Y |
| 12 | Increase header button touch targets to 44x44px minimum | A11Y |

### P2 — Performance

| # | Issue | Reference |
|---|-------|-----------|
| 13 | Move performance log aggregation to SQL (`AVG`, `percentile_cont`) | PERF-1 |
| 14 | Replace N+1 queries in `getChatbotsWithStats` with single aggregate | PERF-2 |
| 15 | Consider Redis or external cache for embeddings in serverless | PERF-4 |

### P3 — Medium UX Improvements

| # | Issue | Reference |
|---|-------|-----------|
| 16 | Add sticky/floating save button on Settings page | UX |
| 17 | Add "Test Chat" button to chatbot overview page | UX |
| 18 | Replace native `confirm()` dialogs with styled modals | UX |
| 19 | Add message retry mechanism in widget | UX |
| 20 | Add persistent sub-navigation (sidebar/tabs) for chatbot sub-pages | NAV |
| 21 | Add "scroll to bottom" indicator in chat widget | UX |
| 22 | Redirect new chatbot wizard to Knowledge page after creation | ONBOARD |

### P4 — Type Safety & Code Quality

| # | Issue | Reference |
|---|-------|-----------|
| 23 | Run `db:gen-types` and fix all 35 `as any` casts across 19 files | QUAL-1 |
| 24 | Remove dead exports: `chunkByCharacters`, `extractDOCXAsMarkdown`, `cosineSimilarity`, `getEmbeddingDimensions` | QUAL-2 |
| 25 | Unify duplicate `Message` and `StageSpan` type definitions | QUAL-3/4 |

### P5 — Security Hardening

| # | Issue | Reference |
|---|-------|-----------|
| 26 | Replace wildcard CORS with configurable allowed-origins per chatbot | SEC-1 |
| 27 | Move rate limiting to shared store (Redis/Supabase) | SEC-2 |
| 28 | Strengthen prompt injection defenses for `userContext` | SEC-5 |
| 29 | Add content quality validation after URL extraction | MISS-5 |
| 30 | Add chunk deduplication (content hash) | MISS-6 |

### P6 — Major UX Transformations

| # | Issue | Reference |
|---|-------|-----------|
| 31 | Implement guided onboarding flow (Add Knowledge -> Customize -> Test -> Deploy) | ONBOARD |
| 32 | Unify Settings form with react-hook-form (dirty detection, validation, undo) | UX |
| 33 | Add message-level feedback (thumbs up/down) — icons already imported | UX |
| 34 | Resolve Performance page dark/light theme inconsistency | VISUAL |
| 35 | Add retry/backoff for embedding API calls | MISS-1 |
