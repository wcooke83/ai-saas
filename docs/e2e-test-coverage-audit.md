# E2E Test Coverage Audit

**Date:** 2026-03-22
**Current tests:** 78 passing (11 test files)
**Coverage focus:** Functional gaps — data mutations, user flows, error handling, business logic

---

## Current Coverage Summary

| Test File | Tests | Scope |
|---|---|---|
| e2e-auth.setup | 1 | Auth bypass + cookie setup |
| e2e-dashboard-smoke | 2 | Dashboard home, chatbots list |
| e2e-dashboard-pages | 8 | Profile, billing, usage, settings, API keys, integrations (page load) |
| e2e-chatbot-pages | 12 | All 12 chatbot sub-pages (page load) |
| e2e-chatbot-crud | 7 | Create, read, update, delete chatbot via API |
| e2e-performance-page | 9 | Filters, pagination, time presets, custom date picker, toggles |
| e2e-api-routes | 12 | Authenticated + unauthenticated API endpoint tests |
| e2e-knowledge-management | 3 | Knowledge page load, add text source, list sources |
| e2e-navigation | 5 | Sidebar nav, back links, auth checks |
| e2e-chat-widget-survey | 2 | Deploy page, widget script presence |
| e2e-tooltip | 1 | Tooltip positioning |
| e2e-public-pages | 10 | Home, login, pricing, 7 tool pages (page load) |

**What's well covered:** Page loads, basic API status codes, performance page interactions, auth flow.
**What's not covered:** Any actual user interaction flows, data mutations beyond basic CRUD, streaming chat, billing, widget interactions.

---

## PHASE 1 — Critical Gaps (HIGH priority)

### 1. Chat Message Flow
**Risk if untested:** Core product broken without detection
**Routes:** `POST /api/chat/[chatbotId]`
**What to test:**
- Send a message and receive an AI response (non-streaming for testability)
- Conversation is created and message is persisted in DB
- Conversation history is loaded on subsequent messages
- Performance metrics are logged to `chat_performance_log`
- Message with RAG context (knowledge chunks returned when relevant)
- Greeting/short-circuit detection (e.g. "hello" bypasses RAG)
- Error handling: invalid chatbot ID, unpublished chatbot, empty message

### 2. Knowledge Source Lifecycle
**Risk if untested:** RAG quality silently degrades, ingestion breaks without notice
**Routes:** `POST/GET/DELETE /api/chatbots/[id]/knowledge`, `DELETE /api/chatbots/[id]/knowledge/[sourceId]`
**What to test:**
- Add URL source with `crawl: true` and `maxPages` → processing starts
- Add text source → chunks created → embeddings generated
- Toggle source as priority → `is_priority` updated
- Delete source → knowledge chunks cascade deleted
- Reprocess source → status transitions (processing → ready or error)
- Error handling: invalid URL, empty content, exceeding plan limits

### 3. Stripe Billing Flow
**Risk if untested:** Revenue loss, subscription state corruption
**Routes:** `POST /api/stripe/checkout`, `POST /api/stripe/portal`, `POST /api/stripe/webhook`, `POST /api/billing/credits`
**What to test:**
- Initiate checkout → returns Stripe redirect URL
- Billing portal → returns Stripe portal URL
- Credit balance check → returns current usage
- Plan limits enforced (chatbot count, knowledge source count)
- Auto-topup configuration save/load

### 4. Pre-Chat Form & Lead Capture
**Risk if untested:** Lead generation silently broken
**Routes:** `POST /api/widget/[chatbotId]/leads`, `GET /api/chatbots/[id]/leads`
**What to test:**
- Submit pre-chat form with valid data → lead saved with session_id
- Retrieve leads via API → pagination works, data matches
- Form validation rejects invalid email
- Duplicate session_id updates existing lead (not duplicate)

---

## PHASE 2 — High Priority Gaps

### 5. Handoff & Agent Console
**Risk if untested:** Human escalation workflow broken
**Routes:** `POST/GET /api/widget/[chatbotId]/handoff`, `POST /api/widget/[chatbotId]/agent-reply`, `POST /api/widget/[chatbotId]/agent-actions`
**What to test:**
- Visitor requests handoff → escalation created
- Agent claims conversation → locked to agent
- Agent sends reply → message appears in conversation
- Agent resolves conversation → escalation marked closed
- Handoff status check returns correct state

### 6. Post-Chat Survey
**Risk if untested:** Feedback collection broken silently
**Routes:** `POST /api/widget/[chatbotId]/survey`, `GET /api/chatbots/[id]/surveys`
**What to test:**
- Submit survey response with rating + text → saved to DB
- Retrieve survey responses with pagination
- Survey linked to correct conversation/session

### 7. Email Memory & OTP Verification
**Risk if untested:** Cross-session continuity broken, OTP abuse possible
**Routes:** `POST /api/widget/[chatbotId]/memory/send-otp`, `POST /api/widget/[chatbotId]/memory/verify-otp`, `GET /api/widget/[chatbotId]/memory/check`
**What to test:**
- Request OTP → returns success (email sent)
- Rate limiting: 4th request in 15min blocked
- Verify correct OTP → returns visitor_id
- Verify wrong OTP → rejected
- Check email existence → returns boolean

### 8. Sentiment Analysis
**Risk if untested:** Analytics dashboard shows stale/wrong data
**Routes:** `POST /api/chatbots/[id]/sentiment/analyze`, `GET /api/chatbots/[id]/sentiment`, `POST /api/chatbots/[id]/sentiment/export`
**What to test:**
- Trigger sentiment analysis → conversations get scores
- List sentiment with filters → pagination works
- Export sentiment → returns downloadable data

### 9. File Upload in Chat
**Risk if untested:** Attachment flow silently broken
**Routes:** `POST /api/widget/[chatbotId]/upload`
**What to test:**
- Upload allowed file type (image, PDF) → presigned URL returned
- Upload disallowed file type → rejected
- Exceed max file size → rejected
- Chat message with attachment reference works

---

## PHASE 3 — Medium Priority Gaps

### 10. API Key CRUD
**Risk if untested:** Integration authentication broken
**Routes:** `POST/GET /api/keys`, `DELETE/PATCH /api/keys/[id]`
**What to test:**
- Create API key → returns plaintext key (only shown once)
- List keys → shows prefix, not full key
- Update key name and allowed_domains
- Delete key → subsequent auth with that key fails
- API key authentication on chat endpoint works

### 11. Chatbot Publish/Unpublish
**Risk if untested:** Chatbots go live/offline unexpectedly
**Routes:** `POST/DELETE /api/chatbots/[id]/publish`
**What to test:**
- Publish chatbot → `is_published` set, embed codes returned
- Unpublished chatbot rejects public chat requests
- Published chatbot accessible via widget config endpoint

### 12. Widget Customization
**Risk if untested:** Branding changes silently lost
**Routes:** `PATCH /api/chatbots/[id]` (widget_config fields)
**What to test:**
- Update widget colors → persisted
- Update position, font, button text → reflected in widget config API
- Widget config endpoint returns latest customization

### 13. Settings Form Save
**Risk if untested:** Configuration changes silently lost
**Routes:** `PATCH /api/chatbots/[id]`
**What to test:**
- Update name, description, system prompt → persisted
- Update model, temperature, max_tokens → persisted
- Toggle memory, escalation, proactive messages → persisted
- Change language → custom text timestamps updated
- Invalid values rejected (empty name, invalid model)

### 14. Conversation History & Transcripts
**Risk if untested:** Chat history export broken
**Routes:** `GET /api/chatbots/[id]/conversations`, `POST /api/widget/[chatbotId]/history`, `POST /api/widget/[chatbotId]/transcript`
**What to test:**
- List conversations with pagination
- Get specific conversation → messages in chronological order
- Export transcript → returns formatted data
- Widget history endpoint returns session's messages

### 15. Message Feedback (Thumbs Up/Down)
**Risk if untested:** Quality signal collection broken
**Routes:** `POST /api/widget/[chatbotId]/feedback`
**What to test:**
- Submit thumbs up on message → stored
- Submit thumbs down on message → stored
- Feedback visible when retrieving conversation

### 16. Escalation Management
**Risk if untested:** Support workflow incomplete
**Routes:** `GET/PATCH /api/chatbots/[id]/escalations/[escalationId]`
**What to test:**
- Update escalation status (open → acknowledged → resolved)
- Filter escalations by status
- Pagination through escalations

---

## PHASE 4 — Lower Priority

### 17. Webhook Integrations
- Slack setup + OAuth callback
- Telegram webhook validation
- Message forwarding to external channels

### 18. User Auth Flows
- Signup with email → confirmation → login
- Password reset flow
- Profile update (name, bio, avatar upload)

### 19. Error Handling & Edge Cases
- Invalid chatbot ID returns 404 (not 500)
- Expired/invalid session returns 401 (not 500)
- Rate limiting on public endpoints
- Empty knowledge base returns graceful empty context
- Concurrent agent replies on same conversation

### 20. Analytics Export
- Export conversation analytics as CSV
- Export sentiment analysis data
- Date range filtering on exports

---

## Estimated Effort

| Phase | Tests | Priority | Effort |
|---|---|---|---|
| Phase 1 | ~25 | Critical | 1-2 sessions |
| Phase 2 | ~30 | High | 2-3 sessions |
| Phase 3 | ~25 | Medium | 2-3 sessions |
| Phase 4 | ~15 | Low | 1-2 sessions |
| **Total** | **~95** | | |

Combined with existing 78 tests, this would bring total coverage to ~173 tests.

---

## Notes

- Chat message tests will need `AI_MOCK_MODE=true` or a mock AI provider to avoid API costs
- Stripe tests should use Stripe test mode keys and test card numbers
- File upload tests need a test file fixture (small PNG/PDF)
- OTP tests can verify the API response without actually checking email delivery
- Some widget endpoint tests can run without auth (public endpoints use session_id)
