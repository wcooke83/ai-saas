# Chatbot Settings Audit

**Date**: 2026-03-21 (updated)
**Original audit**: 2026-03-19
**Scope**: Full trace of every setting from UI to database to runtime usage

---

## Executive Summary

Most issues from the original audit have been resolved. Of the 13 original recommendations, **9 are fixed**, **1 is partially fixed**, and **3 remain open**.

| Category | Fixed | Partial | Open |
|----------|-------|---------|------|
| Type Safety | 1/3 | 0 | 2 |
| Missing UI | 3/3 | 0 | 0 |
| Security | 3/4 | 1 | 0 |
| UX | 2/3 | 0 | 1 |

**Remaining issues:**
1. Generated TypeScript types (`database.ts`) still out of sync — `SupabaseAny = any` used everywhere
2. Widget config DB default missing report/escalation color fields (runtime merge covers it)
3. No logo upload UI
4. Sentiment analysis still manual-only
5. Session ID uses `Math.random()` instead of `crypto.randomUUID()`

---

## Settings Inventory

| Setting | DB Column | Settings UI | Customize UI | Chat API | Widget | Status |
|---|---|---|---|---|---|---|
| **name** | `name` (varchar) | General | -- | -- | -- | OK |
| **description** | `description` (text) | General | -- | -- | -- | OK |
| **welcome_message** | `welcome_message` (text) | General | Preview | Stored as first msg | Displayed | OK |
| **placeholder_text** | `placeholder_text` (varchar) | General | Preview | -- | Displayed | OK |
| **language** | `language` (text) | General | -- | System prompt lang | Widget UI lang | OK |
| **system_prompt** | `system_prompt` (text) | Prompt section | -- | Injected as system | -- | OK |
| **enable_prompt_protection** | `enable_prompt_protection` (bool) | Prompt section | -- | Appended to prompt | -- | OK |
| **model** | `model` (varchar) | AI Model section | -- | Maps to ModelTier | -- | **FIXED** |
| **temperature** | `temperature` (numeric) | AI Model section | -- | Passed to AI call | -- | **FIXED** |
| **max_tokens** | `max_tokens` (int) | AI Model section | -- | Passed to AI call | -- | **FIXED** |
| **live_fetch_threshold** | `live_fetch_threshold` (real) | AI Model section | -- | RAG confidence gate | -- | **FIXED** |
| **memory_enabled** | `memory_enabled` (bool) | Memory section | -- | Memory extraction | Memory verify flow | OK |
| **memory_days** | `memory_days` (int) | Memory section | -- | Passed to getUserMemory | -- | OK |
| **session_ttl_hours** | `session_ttl_hours` (int) | Memory section | -- | -- | Session expiry | OK |
| **pre_chat_form_config** | `pre_chat_form_config` (jsonb) | Pre-Chat section | Preview | Lead data in prompt | Pre-chat form render | OK |
| **post_chat_survey_config** | `post_chat_survey_config` (jsonb) | Post-Chat section | Preview | -- | Survey render | OK |
| **file_upload_config** | `file_upload_config` (jsonb) | File Uploads section | -- | Upload validation | Upload UI | OK |
| **proactive_messages_config** | `proactive_messages_config` (jsonb) | Proactive section | -- | Proactive msg stored | Trigger engine | OK |
| **transcript_config** | `transcript_config` (jsonb) | Transcripts section | -- | -- | Transcript flow | OK |
| **escalation_config** | `escalation_config` (jsonb) | Reporting section | -- | -- | Report flow | OK |
| **live_handoff_config** | `live_handoff_config` (jsonb) | Live Handoff section | -- | Handoff routing | Handoff UI | OK |
| **telegram_config** | `telegram_config` (jsonb) | Live Handoff section | -- | Telegram forwarding | -- | OK |
| **widget_config** | `widget_config` (jsonb) | -- | Full editor | -- | All visual rendering | OK |
| **logo_url** | `logo_url` (text) | Shown in header | -- | -- | Header display | **NO UPLOAD UI** |
| **status** | `status` (varchar) | Shown as badge | -- | Checked (must be active) | -- | OK |
| **is_published** | `is_published` (bool) | Overview toggle | -- | Checked (must be true) | -- | OK |
| **slug** | `slug` (varchar) | Auto-generated | -- | -- | -- | OK |
| **monthly_message_limit** | `monthly_message_limit` (int) | -- | -- | Enforced in chat API | -- | Plan-managed |
| **messages_this_month** | `messages_this_month` (int) | -- | -- | Checked in chat API | -- | Counter only |

---

## Pages & Controls

### Settings Page (11 sidebar sections)

1. **General** — Name, description, welcome message, placeholder, language (with confirm dialog + translation review modal)
2. **System Prompt** — Textarea + prompt protection toggle
3. **AI Model** — Model tier dropdown (Fast/Balanced/Powerful), temperature slider (0-2), max tokens slider (100-4096), live fetch threshold slider (0.50-0.95)
4. **Memory** — Enable/disable toggle, retention days dropdown (7d to unlimited), session TTL dropdown (1hr to 30 days)
5. **Pre-Chat Form** — Enable/disable, title, description, submit text, drag-reorder fields, field types (name, email, phone, company, custom), required toggle. Link: "View collected leads"
6. **Post-Chat Survey** — Enable/disable, title, description, question types (rating, text, multiple_choice, yes_no). Link: "View survey results"
7. **File Uploads** — Enable/disable, allowed types (images, docs, spreadsheets, archives), max file size (2-50MB), max files (1-10)
8. **Proactive Messages** — Full editor component
9. **Transcripts** — Enable/disable, header icon toggle, in-chat prompt toggle, email collection method
10. **Reporting (Escalations)** — Enable/disable toggle
11. **Live Handoff** — Enable/disable, timeout, require agent online toggle, Agent Console card, Telegram config (bot token, chat ID, webhook setup)

### Customize Page

**Colors** — 36 color pickers organized by section (General, Header, Messages, Input, Send Button, Secondary Button, Form, Report). Contextually shown based on preview tab, with "Show all" checkbox.

**Typography** — Font family (25+ fonts), font size slider (12-18px), header text input

**Layout** — Position (4 options: all corners), width (300-500px), height (400-700px), container/input/button border radius sliders, show branding checkbox

**Behavior** — Auto-open toggle + delay slider (500-10000ms), sound toggle, button size slider (40-80px), X/Y offset sliders (0-100px)

**Custom CSS** — Textarea with sanitization applied at render time

**Live Preview** — 6 modes: Chat, Pre-Chat, Verify, Survey, Report, Handoff

### Knowledge Page

- Add sources: URL (with crawl + max pages), Text, Q&A Pair
- File upload (PDF, DOCX) via drag-and-drop
- Priority/pin toggle per source
- Delete per source with confirmation
- Status badges (pending, processing, completed, failed) with error messages
- Chunk count per source
- Realtime updates via Supabase subscription
- **No re-process button** for failed/completed sources
- **No edit** for existing text/QA sources
- **No bulk operations**

### Deploy Page

9 embed variants: SDK one-liner, Next.js/React, Manual init, iFrame, Authenticated users, Agent Console (one-liner, manual, iFrame), REST API (cURL + JS)

- Live preview with position awareness
- Copy to clipboard per block
- Unpublished warning banner
- **iFrame embed hardcoded to 400x600** (doesn't use chatbot's configured width/height)

### Performance Page

Full pipeline waterfall visualization with 17 named stages, parallel group shading, averages, hourly breakdowns, per-request details. Shows model, RAG chunks, confidence, live fetch status.

### Sentiment Page

Manual-only analysis ("Analyze N Sessions" button). Stats grid (avg score, positive/neutral/negative %), data table with sentiment badges, loyalty scores/trends, CSV export.

### Agent Console

Full live agent console at `/dashboard/chatbots/[id]/conversations/` and standalone at `/agent-console/[chatbotId]/`. Supports real-time conversation management and handoff responses.

---

## Original Findings — Current Status

### FIXED

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 2 | PreChatFieldType mismatch | **FIXED** | `types.ts:155` now defines `'name' \| 'email' \| 'phone' \| 'company' \| 'custom'` matching the UI |
| 3 | No model/temperature/max_tokens UI | **FIXED** | Settings page has full AI Model section with dropdown + sliders |
| 4 | File upload migration missing `max_files_per_message` | **FIXED** | Migration `20260315110000` includes `"max_files_per_message": 3` |
| 6 | Custom CSS injection risk | **FIXED** | `ChatWidget.tsx:100-114` — `sanitizeCSS()` strips `@import`, `url()`, `expression()`, `-moz-binding`, `javascript:`, `behavior:` |
| 7 | No rate limiting on chat endpoint | **FIXED** | `route.ts:127-160` — 30 req/min/IP sliding window, 429 response with Retry-After |
| 8c | File upload not validated server-side | **FIXED** | Upload route validates size, MIME type, file count, and sanitizes filenames |
| 10 | No autoOpen/delay/sound/buttonSize/offset controls | **FIXED** | Customize page has all controls with sliders and toggles |
| 11 | No cross-links between settings and data | **FIXED** | "View collected leads" and "View survey results" links in settings |
| 13 | Widget config DB default stale | **PARTIALLY FIXED** | Migration `20260319120000` added most fields. Still missing 11 report/escalation color fields, but runtime merge covers it |

### STILL OPEN

| # | Finding | Status | Details |
|---|---------|--------|---------|
| 1 | Generated TypeScript types out of sync | **OPEN** | `database.ts` still missing chatbot columns. `SupabaseAny = any` used 35+ times in `api.ts`. Fix: run `npm run db:gen-types` |
| 5 | Widget config DB default incomplete | **OPEN (minor)** | Missing report color fields from migration default. No functional impact due to runtime merge pattern |
| 8a | CORS wildcard on chat API | **OPEN (by design)** | `Access-Control-Allow-Origin: *` is intentional for embeddable widget. Any origin can hit the endpoint |
| 8b | Prompt injection via user_data/user_context | **PARTIALLY FIXED** | `sanitizeContextValue()` covers common patterns + prompt protection rules when enabled. Still regex-based and bypassable by sophisticated attacks |
| 8d | Session ID predictability | **OPEN** | Uses `Date.now()` + `Math.random()` — should use `crypto.randomUUID()` |
| 9 | No logo upload UI | **OPEN** | Logo displayed when URL exists but no upload mechanism in settings |
| 12 | No automatic sentiment analysis | **OPEN** | Still manual-only via dashboard button |

---

## Remaining Recommendations

### Priority 1 (Type Safety)

1. **Regenerate database types**: Run `npm run db:gen-types` to sync `database.ts` with the actual schema. This eliminates the need for `SupabaseAny = any` casts throughout `api.ts`.

### Priority 2 (Quick Fixes)

2. **Fix session ID generation**: Replace `Math.random()` with `crypto.randomUUID()` in `ChatWidget.tsx` for session and visitor IDs.

3. **Add logo upload**: Add a file upload input to the General settings section for `logo_url`.

### Priority 3 (Enhancements)

4. **Auto-sentiment analysis**: Add an option to automatically analyze sentiment after each conversation ends, instead of requiring manual triggers.

5. **Knowledge source re-process**: Add a re-process button for completed/failed sources to re-embed with the current embedding model.

6. **iFrame embed dimensions**: Use the chatbot's configured `width`/`height` from `widget_config` in the deploy page's iFrame code snippet.

### Priority 4 (Low Impact)

7. **Widget config migration**: Add missing report/escalation color fields to the DB default. No functional impact but keeps schema clean.

8. **Strengthen prompt injection protection**: The regex-based `sanitizeContextValue()` is a first layer. Consider adding structured context separation or token-level filtering for higher-security deployments.
