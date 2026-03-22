# AI Chatbot System Audit: Latency, Quality, Robustness, and Bugs

**Date**: 2026-03-22
**Scope**: Full audit of the AI chatbot pipeline from widget to AI response
**Auditor**: Claude (AI Performance Engineer)

---

## Executive Summary

The chatbot system is architecturally sound, with good parallelization in the chat route, RAG prework overlapping, greeting short-circuiting, embedding caching, and multi-layer TTL caches for live fetch. However, there are several concrete issues impacting latency, quality, and robustness:

**Critical bugs**: Operator precedence bug in token estimation produces incorrect counts for OpenAI/DeepSeek streaming. Missing streaming headers will cause proxy buffering on Nginx/Cloudflare/Vercel, adding seconds of latency. System prompt is bloated with ~2,000 tokens of mandatory rules appended to every request.

**Key latency findings**: The live-fetch pipeline adds 3-7 seconds to tail-latency requests. The widget re-renders the entire message list on every streamed token. No edge runtime is configured for streaming routes. The system prompt "MANDATORY Response Rules" section alone is ~600 tokens, costing ~15-30ms TTFT per request.

**Top 5 actions by impact-to-effort ratio**:
1. Fix the operator precedence bug (5 min, correctness fix)
2. Add `X-Accel-Buffering: no` to streaming response headers (5 min, can save 1-5s in production)
3. Batch widget streaming updates with `requestAnimationFrame` (30 min, eliminates render thrashing)
4. Compress the mandatory response rules in `buildSystemPrompt` (30 min, saves ~300 tokens per request)
5. Add edge runtime to the chat streaming route (10 min, saves ~50-100ms cold start)

---

## File-by-File Findings

### 1. `src/lib/ai/provider.ts` (Unified AI Interface)

#### BUG [Critical]: Operator Precedence in Token Estimation (Lines 824, 860)

```typescript
// CURRENT (buggy)
tokensInput = Math.ceil((systemPrompt?.length || 0 + prompt.length) / 4);
```

Due to operator precedence, `||` binds looser than `+`. When `systemPrompt` is truthy (which it always is in the chatbot pipeline), this evaluates as:
```
systemPrompt.length / 4
```
The `prompt.length` is completely ignored. When `systemPrompt` is falsy:
```
(0 + prompt.length) / 4
```
which works correctly only by accident.

**Fix**:
```typescript
tokensInput = Math.ceil(((systemPrompt?.length ?? 0) + prompt.length) / 4);
```

This bug appears on **two lines**: 824 (OpenAI streaming) and 860 (DeepSeek streaming).

#### Latency [Medium]: Verbose Debug Logging on Every Request (Lines 444-454)

The `generate()` function logs a multi-field object on every call:
```typescript
console.log('[AI Provider generate()] Model selection:', {
  hasSpecificModel: !!specificModel,
  specificModelName: specificModel?.name,
  // ... 7 more fields
});
```

This is useful for debugging but generates significant log volume in production. Each `JSON.stringify` for the console output adds ~0.5ms.

**Recommendation**: Gate behind `process.env.NODE_ENV === 'development'` or a debug flag.

#### Latency [Low]: Model Cache TTL at 120 Seconds (Line 22)

The active model is cached for 2 minutes. For most deployments the model doesn't change at all during a session. Consider increasing to 5-10 minutes or using a cache-invalidation-on-write pattern via `clearActiveModelCache()`.

#### Robustness [Medium]: `getAvailableProvider()` Ignores Database Config (Lines 371-376)

The synchronous `getAvailableProvider()` only checks env var-based provider availability and ignores the database AI config entirely. Any caller using this instead of `getAvailableProviderAsync()` will bypass the admin's model selection.

#### Robustness [Low]: No Timeout on Provider API Calls (Lines 528-546)

The `anthropic.messages.create()` and `openai.chat.completions.create()` calls have no explicit timeout. If the upstream provider hangs, the request will block until the Vercel function timeout (30s per `vercel.json`). Consider adding `AbortSignal.timeout()`.

#### Quality [Low]: `createStreamingResponse()` Uses SSE Format but Chat Route Uses NDJSON (Lines 915-962 vs route.ts Lines 660-674)

The helper `createStreamingResponse()` outputs `data: {...}\n\n` (SSE format) but the actual chat route emits `{...}\n` (NDJSON). The helper appears unused by the chatbot pipeline. This isn't a bug but is confusing and could cause issues if someone uses the helper for chatbot responses.

#### Latency [Medium]: OpenAI/DeepSeek Streaming Token Count Is Per-Chunk, Not Per-Token (Lines 818-819)

```typescript
tokensOutput++;  // Increments once per chunk, not per token
```

A streaming chunk from OpenAI may contain multiple tokens. The count is therefore an undercount. The Anthropic path correctly reads from `event.usage.output_tokens`.

---

### 2. `src/lib/chatbots/rag.ts` (RAG System)

#### Quality [High]: System Prompt Bloat in `buildSystemPrompt()` (Lines 516-537)

The "MANDATORY Response Rules" section appended to every system prompt is **~600 tokens** of instructions. Combined with the prompt injection protection (~250 tokens), language instructions (~80 tokens), and user context, the total system prompt can easily reach 1,500-2,500 tokens.

**Token cost per request**: At typical rates, this adds ~15-50ms to TTFT depending on provider.

**Recommendation**: Compress the 16 rules into 6-8 tighter rules. Many are redundant:
- Rules 1 and 2 overlap (both say "don't mention internal workings")
- Rules 6 and 8 overlap (both say "be natural/warm")
- Rule 9 ("never repeat greeting") could be a single sentence
- Rule 15 ("don't dump personal details") is covered by rule 6 ("speak naturally")

Estimated savings: **200-300 tokens** (~5-15ms TTFT).

#### Latency [Medium]: Conversation History Sent Twice (Lines 350-363 via `buildRAGPrompt`)

`buildRAGPrompt()` includes the last 10 messages as a `## Conversation History` section in the user prompt. But the chat route (line 548) also fetches messages and builds conversation context. If the model is Claude and messages are sent as proper `messages[]` array, this duplicates context.

Looking at the chat route, however, the messages are concatenated into `userPrompt` and sent as a single user turn. This means conversation history is embedded in the user prompt text rather than structured as message turns. This is functional but suboptimal:
- It costs extra tokens (history appears in both system context and user prompt format)
- It degrades model performance vs proper multi-turn formatting

#### Quality [Medium]: `sanitizeContextValue()` Over-Strips (Line 376)

```typescript
.replace(/##\s+/g, '')  // Removes ALL markdown headers
```

This strips legitimate markdown formatting from user context data (e.g., product descriptions that use headers). Only the injection patterns should be filtered, not general markdown.

#### Latency [Low]: `formatUserContext()` Recursive Without Depth Tracking Cost (Lines 385-418)

The function caps at `maxDepth=3` and `8KB`, which is fine. But it processes the entire context before checking the 8KB limit, meaning deeply nested contexts do unnecessary work.

#### Quality [Good]: Greeting Short-Circuit (Lines 28-37)

Well-implemented. Saves the entire RAG pipeline (embedding + similarity search + live fetch) for simple greetings. The 4-word limit and regex pattern are reasonable.

#### Quality [Good]: RAG Prework Overlap (Lines 54-79)

The `startRAGPrework()` pattern is well-designed -- overlapping embedding config resolution and priority source queries with conversation setup saves ~200-400ms.

---

### 3. `src/lib/chatbots/knowledge/embeddings.ts`

#### Robustness [Medium]: No Retry on Embedding API Failure (Lines 196-213)

`generateEmbeddings()` catches errors but only rethrows. A transient network error during a chat query will fail the entire RAG pipeline. The chat route's `generate()` has retry logic but the embedding call does not.

**Recommendation**: Add a single retry with 500ms backoff for the query embedding path (not the batch ingestion path, which has its own rate-limit spacing).

#### Robustness [Low]: LRU Cache Eviction Is O(1) But Has No Memory Bound (Lines 38-44)

The cache stores embedding vectors (~6KB each). At `EMBEDDING_CACHE_MAX_SIZE=200`, max memory is ~1.2MB, which is fine for serverless. However, in a long-running server process (local dev), this never shrinks. Not a production issue.

#### Quality [Good]: Embedding Config Caching (Lines 61-84)

The 60-second TTL cache for `resolveEmbeddingConfig()` avoids repeated DB calls. Well-implemented.

#### Quality [Good]: Query Embedding Cache (Lines 22-45, 286-302)

The LRU cache with normalized keys (lowercase, collapsed whitespace) is well-implemented. Handles the common case of repeated queries effectively.

---

### 4. `src/lib/chatbots/knowledge/extractors/url.ts` (URL Extraction)

#### Latency [Medium]: Jina Reader 3-Second Head Start Is Too Long (Line 51)

```typescript
const JINA_HEAD_START = 3000;
```

In the racing mode (live fetch), the direct fetch doesn't start until 3 seconds after Jina. If Jina is slow or the target site doesn't need JS rendering, this wastes 3 seconds. Most business/content sites don't require JS rendering.

**Recommendation**: Reduce to 1000-1500ms, or start both immediately and let Jina's higher-quality result win ties.

#### Robustness [Low]: `extractLinksFromUrl` Dynamic Import of Cheerio (Line 345)

```typescript
const cheerio = await import('cheerio');
```

This function dynamically imports cheerio even though it's already imported at the top of the file (line 7). The top-level import should be used directly. The dynamic import adds ~5-10ms per call (module resolution cache notwithstanding).

#### Quality [Good]: Racing Strategy (Lines 50-77)

The `Promise.any` approach for live fetch is sound. First good result wins, failures are swallowed gracefully.

---

### 5. `src/lib/chatbots/knowledge/live-fetch.ts` (Live Fetch Pipeline)

#### Latency [High]: AI Link Picker Adds 1-3 Seconds (Lines 220-257)

The AI link picker calls `generate()` with the full link list. Even with `maxTokens: 300` and `temperature: 0`, this is a full LLM round trip adding 1-3 seconds to the critical path for low-confidence queries.

The `SKIP_AI_THRESHOLD = 5` optimization is good (skips AI for small link sets), but for larger sites the AI call is unavoidable.

**Recommendation**: Consider a simpler heuristic first -- fuzzy match query keywords against link text, pick top 2. Only fall back to AI picker if no keywords match. This would eliminate the AI round trip in ~80% of cases.

#### Latency [Medium]: Content Fetching Is Sequential Per URL (Lines 164-165)

```typescript
aiPickedUrls.slice(0, 2).map((url) => getCachedContent(url))
```

This is wrapped in `Promise.all`, so it's parallel -- which is correct. But the `extractURL()` call inside `getCachedContent()` uses the racing strategy with a 3-second head start for Jina. Two parallel URL fetches each with a 3-second head start means the direct fallback doesn't kick in until 3 seconds in.

#### Quality [Good]: Three-Layer TTL Cache (Lines 86-88)

Separate caches for links (10min), content (30min), and AI picks (5min) with appropriate TTLs. Well-designed.

#### Quality [Good]: `MAX_CONTENT_CHARS = 40000` Cap (Line 17)

Good token budget management -- prevents live fetch from blowing up the context window.

---

### 6. `src/lib/chatbots/types.ts`

No latency, quality, or robustness issues. This is a pure type/constant file with well-structured interfaces and sensible defaults.

---

### 7. `src/lib/chatbots/api.ts`

#### Latency [Low]: `getConversationWithMessages()` Makes Two Sequential Queries (Lines 352-378)

Fetches conversation, then messages. These could be parallelized with `Promise.all`.

#### Robustness [Good]: Fire-and-Forget Counter Increments (Lines 431-439)

The `createMessage()` function correctly makes counter increments non-blocking with fire-and-forget `Promise.all`. Good pattern.

#### Robustness [Low]: `validateChatbotAPIKey()` Updates `last_used_at` on Every Request (Lines 541-545)

This is a write operation on every authenticated API call. For high-traffic chatbots, this creates unnecessary DB write load. Consider batching (update every Nth call) or using a cache with periodic flush.

---

### 8. `src/app/api/chat/[chatbotId]/route.ts` (Chat API Route)

#### Latency [Critical]: Missing Streaming Headers (Lines 767-774)

```typescript
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  },
});
```

**Missing headers that will cause proxy buffering**:
- `X-Accel-Buffering: no` -- Required for Nginx-based proxies (including Vercel's infrastructure) to disable response buffering
- `Transfer-Encoding: chunked` -- Signals to intermediaries that the response is chunked

Without these, reverse proxies (Nginx, Cloudflare, AWS ALB) may buffer the entire response before forwarding, defeating the purpose of streaming. This can add **1-10 seconds** of perceived latency where the user sees nothing, then the full response appears at once.

**Fix**:
```typescript
headers: {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no',
  'Access-Control-Allow-Origin': '*',
},
```

Note: The `agent-events` route (line 139 of `agent-events/route.ts`) correctly includes `X-Accel-Buffering: no`. The chat route does not.

#### Latency [Medium]: No Edge Runtime for Streaming Route

The chat route runs on the default Node.js runtime. For streaming responses, edge runtime provides:
- Lower cold-start latency (~50-100ms faster)
- Faster TTFT due to closer-to-user deployment
- Native streaming support without buffering concerns

**Recommendation**: Add `export const runtime = 'edge';` if all dependencies are edge-compatible. If not (due to `pdf-parse`, `mammoth` imports), consider splitting the streaming path into a separate edge-compatible route.

#### Latency [Good]: Parallel Mega-Group (Lines 548-570)

The parallel execution of history fetch, message save, handoff check, lead lookup, memory fetch, attachment processing, and RAG context is well-designed. The short-message vs long-message branching for RAG is particularly clever.

#### Latency [Good]: RAG Prework Overlap (Lines 258-259)

Starting `startRAGPrework()` immediately after chatbot load and awaiting it later is a good optimization that saves ~200-400ms.

#### Robustness [Medium]: Stream Error Handling May Leave Client Hanging (Lines 754-763)

```typescript
} catch (error) {
  try {
    controller.enqueue(encoder.encode(
      JSON.stringify({ type: 'error', message: 'Failed to generate response' }) + '\n'
    ));
  } catch { /* controller may already be closed */ }
  controller.error(error);
}
```

If `controller.enqueue` succeeds but `controller.error` also fires, the stream enters an error state after already writing data. The client may not see the error event. Consider only using `controller.error()` if the enqueue fails, and using `controller.close()` after a successful error event enqueue.

#### Robustness [Low]: Sentiment Analysis on Every 4+ Message Conversation (Lines 702-720, 815-833)

`analyzeConversationSentiment()` is called fire-and-forget on every message after the 4th. This means a 20-message conversation triggers 17 sentiment analysis calls. Consider running sentiment analysis only every Nth message (e.g., every 5th) or only at conversation end.

#### Quality [Low]: `chatbot.model` Used for `savePerfLog` Instead of Actual Model (Lines 685, 799)

The perf log records `model: chatbot.model` which is the chatbot's configured model string (e.g., `'claude-3-5-sonnet-20241022'`), not the actual model used for generation (which may be overridden by `userPreferredModel`). For streaming responses, the actual model isn't captured in the result object since it's returned at the end of the generator.

---

### 9. `src/app/api/widget/[chatbotId]/agent-reply/route.ts`

#### Robustness [Low]: Sequential Auth Checks (Lines 23-61)

`authenticateAgent()` tries API key auth, then Supabase session auth, then ownership check, then profile lookup -- all sequentially. The ownership + profile lookups could be parallelized.

#### Quality [Good]: CORS Headers (Line 13)

Correctly defined and applied to all response paths including error cases.

---

### 10. `src/app/api/widget/[chatbotId]/config/route.ts`

#### Latency [Good]: Cache Headers (Line 137)

```typescript
'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
```

Good caching strategy -- serves stale for up to 5 minutes while revalidating. This means repeated widget loads don't hit the server.

#### Quality [Good]: Only Fetches Published/Active Chatbots (Lines 49-50)

Correctly filters by `is_published=true` and `status=active` at the DB level.

---

### 11. `src/components/widget/ChatWidget.tsx`

#### Latency [High]: Re-Render on Every Streamed Token (Line 1046)

```typescript
setMessages((prev) => prev.map((m) =>
  m.id === assistantId ? { ...m, content: streamedContent } : m
));
```

This calls `setMessages` on every token chunk received from the stream. For a typical response of ~200 tokens, this triggers ~200 React re-renders. Each re-render iterates the entire message list (potentially hundreds of messages with history), runs `renderMarkdown()`, and diffs the DOM.

**Recommendation**: Batch updates using `requestAnimationFrame`:
```typescript
let pendingContent = '';
let rafScheduled = false;

// In the stream loop:
pendingContent += event.content;
if (!rafScheduled) {
  rafScheduled = true;
  requestAnimationFrame(() => {
    setMessages((prev) => prev.map((m) =>
      m.id === assistantId ? { ...m, content: pendingContent } : m
    ));
    rafScheduled = false;
  });
}
```

This reduces renders from ~200 to ~12-15 (one per frame at 60fps over ~250ms of streaming).

#### Latency [Medium]: `renderMarkdown()` Called on Every Message on Every Render (Lines 162-231)

The markdown renderer runs on every message in the list on every re-render. Combined with the per-token re-rendering above, this means `renderMarkdown()` is called ~200 * N times during a single response stream (where N is the message count).

**Recommendation**: Memoize the rendered HTML per message content string, or use `React.memo` on individual message components.

#### Robustness [Medium]: No Abort Controller for In-Flight Requests (Lines 967-980)

If the user sends a new message while the previous stream is still active, there's no cancellation of the old stream. Both streams will write to different message IDs, so there's no data corruption, but:
- Two concurrent streams consume double the API quota
- The UI shows two "thinking" indicators
- Network resources are wasted

**Recommendation**: Use an `AbortController` ref, abort the previous request on new send.

#### Robustness [Low]: `sendMessage` Dependency Array is Very Large (Line 1084)

```typescript
}, [input, isLoading, chatbotId, sessionId, visitorId, userData, userContext, t, activeLanguage,
    endOfChatState, messages, pendingAttachments, handoffActive, resetInactivityTimer]);
```

Including `messages` as a dependency means `sendMessage` is recreated on every message change (including streaming tokens). This causes unnecessary closures. Since `setMessages` is used with functional updates, `messages` can likely be removed from the dependency array.

#### Quality [Good]: NDJSON Stream Parsing with Buffer (Lines 1020-1068)

The buffered NDJSON parsing correctly handles partial JSON across chunk boundaries. Well-implemented.

#### Quality [Good]: Session Persistence (Lines 27-66)

Session restoration with TTL and inactivity checks is well-implemented.

---

### 12. `src/middleware.ts`

#### Latency [Good]: Widget/Chat Routes Skip Session Refresh (Lines 33-39)

```typescript
if (pathname.startsWith('/api/widget/') || pathname.startsWith('/api/chat/')) {
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

Correctly skips the Supabase session refresh (~30-80ms) for public endpoints. Good optimization.

#### Quality [Good]: CORS Preflight Caching (Line 28)

```typescript
'Access-Control-Max-Age': '86400',
```

24-hour preflight cache reduces OPTIONS requests from the widget.

---

### 13. `src/lib/ai/providers/anthropic.ts` and `openai.ts`

#### Robustness [Low]: No Connection Pooling or Keep-Alive Configuration

The SDK clients are instantiated with default settings. For high-throughput scenarios, configuring connection pooling (`maxRetries`, `timeout`) on the SDK clients would improve reliability.

The Anthropic SDK's default timeout is 10 minutes, which is excessive for a chatbot response. Consider setting `timeout: 30000` (30s) to match the Vercel function timeout.

---

## Issue Summary by Severity

### Critical (Fix Immediately)

| # | File | Issue | Impact |
|---|------|-------|--------|
| 1 | `provider.ts:824,860` | Operator precedence bug in token estimation | Incorrect token counts for all OpenAI/DeepSeek streaming responses |
| 2 | `route.ts:767-774` | Missing `X-Accel-Buffering: no` header on streaming response | Proxy buffering can add 1-10s perceived latency |

### High (Fix This Sprint)

| # | File | Issue | Impact |
|---|------|-------|--------|
| 3 | `ChatWidget.tsx:1046` | `setMessages` called on every streamed token | ~200 unnecessary re-renders per response, UI jank |
| 4 | `rag.ts:516-537` | System prompt "MANDATORY Response Rules" is ~600 tokens | 15-50ms TTFT overhead per request, ~$0.001-0.003 per request |
| 5 | `live-fetch.ts:220-257` | AI link picker adds 1-3s to tail-latency requests | Significant TTFT increase for low-confidence queries |

### Medium (Fix Next Sprint)

| # | File | Issue | Impact |
|---|------|-------|--------|
| 6 | `provider.ts:818-819` | OpenAI/DeepSeek streaming `tokensOutput` is per-chunk, not per-token | Undercount in usage tracking and billing |
| 7 | `ChatWidget.tsx:162-231` | `renderMarkdown()` not memoized, runs on every render for every message | Wasted CPU during streaming |
| 8 | `url.ts:51` | Jina Reader 3s head start is too long for live fetch | Direct fetch delayed unnecessarily |
| 9 | `embeddings.ts:196-213` | No retry on embedding API failure for query path | Single transient error kills RAG for that request |
| 10 | `ChatWidget.tsx:967-980` | No AbortController for in-flight requests | Double API consumption on rapid sends |
| 11 | `route.ts:702-720` | Sentiment analysis fires on every message after the 4th | Excessive AI API calls for background analysis |
| 12 | `rag.ts:376` | `sanitizeContextValue` strips all markdown headers, not just injection patterns | Legitimate formatting removed from user context |
| 13 | `provider.ts:444-454` | Verbose debug logging on every generate() call | Log noise and minor CPU overhead in production |

### Low (Backlog)

| # | File | Issue | Impact |
|---|------|-------|--------|
| 14 | `provider.ts:22` | Model cache TTL at 120s could be longer | Unnecessary DB queries every 2 min |
| 15 | `provider.ts:371-376` | `getAvailableProvider()` sync version ignores DB config | Potential model routing bypass |
| 16 | `api.ts:352-378` | `getConversationWithMessages()` sequential queries | ~50ms wasted on sequential DB calls |
| 17 | `api.ts:541-545` | `last_used_at` write on every API key validation | Unnecessary DB write load |
| 18 | `url.ts:345` | Redundant dynamic import of cheerio | ~5-10ms unnecessary overhead |
| 19 | `route.ts:685,799` | Perf log records chatbot model, not actual model used | Inaccurate performance tracking |
| 20 | Chat route | No edge runtime configured for streaming | ~50-100ms additional cold start latency |

---

## Prioritized Action Plan

### Phase 1: Quick Wins — COMPLETED

1. ~~**Fix operator precedence bug** (`provider.ts:824,860`)~~ DONE
2. ~~**Add streaming headers** (`route.ts:767-774`)~~ DONE
3. ~~**Gate debug logging** (`provider.ts:444-454`)~~ DONE

### Phase 2: High-Impact Optimizations — COMPLETED

4. ~~**Batch widget streaming renders** (`ChatWidget.tsx`)~~ DONE — `requestAnimationFrame` batching
5. ~~**Compress system prompt rules** (`rag.ts`)~~ DONE — 16 rules → 8 rules (~300 tokens saved)
6. ~~**Reduce Jina head start** (`url.ts`)~~ DONE — 3000ms → 1000ms
7. ~~**Add AbortController to widget** (`ChatWidget.tsx`)~~ DONE

### Phase 3: Architecture Improvements — COMPLETED

8. ~~**Keyword heuristic for AI link picker** (`live-fetch.ts`)~~ DONE — `matchLinksByKeywords()` fast path
9. ~~**Add retry to query embedding** (`embeddings.ts`)~~ DONE — single retry with 500ms backoff
10. ~~**Throttle sentiment analysis** (`route.ts`)~~ DONE — every 5th message
11. ~~**Fix sanitizeContextValue** (`rag.ts`)~~ DONE — removed `##` stripping
12. ~~**Fix stream error handling** (`route.ts`)~~ DONE — proper close vs error
13. ~~**Memoize renderMarkdown** (`ChatWidget.tsx`)~~ DONE — Map cache with LRU eviction
14. ~~**OpenAI/DeepSeek token counting** (`provider.ts`)~~ DONE — estimate from content length
15. ~~**Provider SDK timeouts** (`provider.ts`)~~ DONE — 30s timeout on all providers
16. ~~**Multi-turn conversation format** (`provider.ts`, `rag.ts`, `route.ts`)~~ DONE — proper `messages[]` turns
17. ~~**Remove `messages` from sendMessage deps** (`ChatWidget.tsx`)~~ DONE

### Remaining (Backlog)

18. Batch `last_used_at` writes for API key validation
19. Parallelize `getConversationWithMessages()` sequential queries
