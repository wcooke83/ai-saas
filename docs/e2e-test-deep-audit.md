# E2E Test Deep Audit — Functional Gaps

**Date:** 2026-03-22
**Current tests:** 179 passing across 28 test files
**Gaps found:** 52+ missing functional tests

Most existing tests only verify page loads (no crash) or API status codes (not 500). This audit identifies tests that verify **actual data integrity, user interactions, cross-feature integration, security, and edge cases**.

---

## A) Data Integrity Tests (11 gaps)

| # | Gap | Priority | Status |
|---|-----|----------|--------|
| A1 | Create chatbot → verify it appears in GET list | HIGH | Missing |
| A2 | Update settings → GET returns updated values | HIGH | Missing (only checks PATCH response) |
| A3 | Widget config update → verify in `/api/widget/:id/config` | HIGH | Missing |
| A4 | Delete knowledge source → verify chunks are gone | MEDIUM | Missing |
| A5 | Chat message → verify in conversation history | HIGH | Missing |
| A6 | Lead submission → verify in lead retrieval list | HIGH | Missing |
| A7 | Survey response → verify in analytics count | MEDIUM | Missing |
| A8 | API key with domains → verify domains saved | MEDIUM | Partial |
| A9 | File upload → verify in conversation attachments | MEDIUM | Missing |
| A10 | Chatbot status change → verify chat blocked/allowed | HIGH | Missing |
| A11 | Widget config deep merge (partial update doesn't wipe other fields) | HIGH | Missing |

## B) UI Interaction Tests (8 gaps)

| # | Gap | Priority | Status |
|---|-----|----------|--------|
| B1 | Widget SDK script loads and initializes | HIGH | Missing |
| B2 | Widget chat: type message → send → see response | HIGH | Missing |
| B3 | Widget pre-chat form rendering and submission | HIGH | Missing |
| B4 | Dashboard tab/nav switching without client errors | MEDIUM | Missing |
| B5 | Modal open/close (delete confirmation) | MEDIUM | Missing |
| B6 | Widget post-chat survey UI rendering | MEDIUM | Missing |
| B7 | Widget mobile responsiveness (375px viewport) | MEDIUM | Missing |
| B8 | Form validation error display in UI | MEDIUM | Missing |

## C) Edge Cases (12 gaps)

| # | Gap | Priority | Status |
|---|-----|----------|--------|
| C1 | Chat rate limiting (31 messages/min → 429) | HIGH | Missing |
| C2 | Streaming response chunk format validation | MEDIUM | Missing |
| C3 | Session isolation (different sessions → different conversations) | HIGH | Missing |
| C4 | CORS headers on widget endpoints | HIGH | Missing |
| C5 | Temperature/max_tokens bounds validation | MEDIUM | Missing |
| C6 | Widget config partial update doesn't wipe existing fields | HIGH | Overlap with A11 |
| C7 | Slug auto-generation on name change | MEDIUM | Missing |
| C8 | RAG context actually used in chat response | HIGH | Missing |
| C9 | Live fetch threshold enforcement | MEDIUM | Missing |
| C10 | Conversation memory across sessions | HIGH | Partial |
| C11 | API key domain whitelist enforcement | HIGH | Missing |
| C12 | API key expiration enforcement | MEDIUM | Missing |

## D) Cross-Feature Integration (8 gaps)

| # | Gap | Priority | Status |
|---|-----|----------|--------|
| D1 | Create → knowledge → publish → chat → verify RAG | HIGH | Missing |
| D2 | Update widget config → verify widget config endpoint | HIGH | Missing |
| D3 | Chat → escalation → agent takeover → agent reply | HIGH | Missing |
| D4 | Conversation → sentiment analysis → analytics | MEDIUM | Missing |
| D5 | Create chatbots until plan limit → verify 403 | HIGH | Missing |
| D6 | Memory enabled → chat → logout → chat → verify memory | HIGH | Missing |
| D7 | File upload → chat with attachment → verify in transcript | MEDIUM | Missing |
| D8 | Pre-chat form → lead captured → verify retrieval | MEDIUM | Missing |

## E) Security Tests (6 gaps)

| # | Gap | Priority | Status |
|---|-----|----------|--------|
| E1 | User A cannot access User B's chatbot | HIGH | Missing |
| E2 | Unauthenticated access blocked on all admin routes | HIGH | Partial (only /api/chatbots tested) |
| E3 | SQL injection prevention (special chars in name) | LOW | Missing (ORM mitigates) |
| E4 | RLS policies on knowledge chunks | MEDIUM | Missing |
| E5 | Agent auth required for agent-actions/agent-reply | MEDIUM | Tested |
| E6 | Invalid API key returns 401 not 500 | MEDIUM | Tested |

## F) Untested Endpoints

| Endpoint | Method | Gap |
|----------|--------|-----|
| `/api/widget/:id/agent-events` | POST | Not tested at all |
| `/api/widget/:id/agent-conversations` | GET | Not tested at all |
| `/api/widget/:id/memory/send-otp` | POST | Only validation tested, not actual send |
| `/api/keys/:id` | PATCH | Domain update not verified in retrieval |

---

## Recommended Implementation Order

### Quick Wins (highest value per test):
1. **D1**: End-to-end create → knowledge → publish → chat → RAG verification
2. **A2 + A3**: Settings save → verify GET returns exact values
3. **C3**: Session isolation (different sessions → different conversations)
4. **A5**: Chat message appears in conversation history
5. **A6**: Lead appears in retrieval after submission
6. **C1**: Rate limiting enforcement
7. **E1**: User isolation (User A can't access User B's chatbot)
8. **C4**: CORS headers present on widget endpoints

### Medium effort:
9. **A11**: Widget config deep merge
10. **C5**: Temperature/max_tokens bounds
11. **C7**: Slug regeneration
12. **A10**: Chatbot status change impacts chat
13. **B1**: Widget SDK script loads

### Harder (require real browser widget interaction):
14. **B2**: Widget chat interaction (type → send → see response)
15. **B3**: Pre-chat form in widget
16. **D3**: Full escalation → agent flow
17. **D6**: Memory across sessions
