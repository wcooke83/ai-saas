# Wiki Documentation Audit Report

**Date:** 2026-03-22
**Scope:** 19 wiki .md files vs actual codebase implementation
**Wiki Index:** `docs/wiki/index.json` (22 entries; 19 .md files found)

---

## SECTION 1: Features With NO Wiki Documentation

These are significant features that exist in the application but have no corresponding wiki page.

### 1.1 Email Sequence Builder -- HIGH PRIORITY

**What exists:**
- Public tool page: `src/app/(public)/tools/email-sequence/page.tsx`
- API route: `src/app/api/tools/email-sequence/route.ts`
- Component: `src/components/tools/EmailSequenceBuilder`
- Full implementation with 8 sequence types (cold-outreach, follow-up, onboarding, re-engagement, sales-nurture, event-promotion, product-launch, feedback-request), 5 tones, 3/5/7 email count options
- Referenced in Settings page tool config as "Email Sequence Builder"

**Impact:** This is a complete, shipped AI tool with no wiki documentation at all. Every other AI tool has a dedicated wiki page. This is the most obvious gap.

### 1.2 Agent Console (In-Dashboard) -- HIGH PRIORITY

**What exists:**
- Dashboard page: `src/app/(authenticated)/dashboard/chatbots/[id]/conversations/page.tsx`
- Navigation label: "Agent Console" in the ChatbotSubNav
- Full implementation: `src/components/agent-console/AgentConsoleLayout`, `useAgentConsole.ts`
- Features: Real-time conversation management via Supabase Realtime, visitor presence tracking, typing indicators, conversation filtering by status (pending/active/resolved), message history

**Current doc coverage:** The deployment guide documents the *embeddable* Agent Console (SDK/iframe), but the in-dashboard Agent Console itself has no dedicated wiki page explaining how agents use it -- conversation list, replying, resolving, presence indicators, etc.

### 1.3 Performance / Latency Dashboard -- MEDIUM PRIORITY

**What exists:**
- Dashboard page: `src/app/(authenticated)/dashboard/chatbots/[id]/performance/page.tsx`
- Navigation label: "Performance" in ChatbotSubNav
- Detailed pipeline waterfall visualization (chatbot load, conversation ready, RAG embedding, similarity search, live fetch, prompt building, TTFT, stream complete)
- Filtering by model, date range, pagination
- P95 metrics, hourly charts

**Impact:** This is a distinctive, technically sophisticated feature with no documentation. Users who want to debug chatbot response times have no guide.

### 1.4 Chatbot Analytics Dashboard -- MEDIUM PRIORITY

**What exists:**
- Dashboard page: `src/app/(authenticated)/dashboard/chatbots/[id]/analytics/page.tsx`
- Navigation label: "Analytics" in ChatbotSubNav
- Metrics: total conversations, total messages, unique visitors, avg messages per conversation, satisfaction rate, daily bar charts
- Date range filtering (7d/30d/90d)
- Export functionality

**Impact:** No documentation on what analytics data is available and how to interpret it.

### 1.5 File Upload in Chat -- MEDIUM PRIORITY

**What exists:**
- Type definitions: `FileUploadConfig`, `FileUploadAllowedTypes` in `src/lib/chatbots/types.ts`
- Settings form field: `fileUploadConfig` in the Settings page
- Widget support: `Paperclip`, `FileIcon`, `Download` imports in `ChatWidget.tsx`
- API route: `src/app/api/widget/[chatbotId]/upload/route.ts`
- Config: allowed types (images, documents, spreadsheets, archives), max file size, max files per message

**Impact:** Users can enable file uploads in chat but there is no wiki page explaining the feature or configuration.

### 1.6 Proactive Messages -- MEDIUM PRIORITY

**What exists:**
- Type definitions: `ProactiveMessagesConfig`, `ProactiveMessageRule`, `ProactiveTriggerType` in types.ts
- Settings form field: `proactiveConfig` in the Settings page
- 8 trigger types: `page_url`, `time_on_page`, `time_on_site`, `scroll_depth`, `exit_intent`, `page_view_count`, `idle_timeout`, `custom_event`
- Display modes: `bubble` or `open_widget`
- 9 bubble positions, customizable bubble styling (colors, border, shadow, font size, max width)
- Delay, max show count, priority per rule

**Impact:** This is a feature-rich proactive messaging system with zero documentation.

### 1.7 Transcript Email Feature -- MEDIUM PRIORITY

**What exists:**
- Type definitions: `TranscriptConfig` in types.ts
- Settings form field: `transcriptConfig` in the Settings page
- API route: `src/app/api/widget/[chatbotId]/transcript/route.ts`
- Config: enabled, email_mode (pre_chat or ask), show_header_icon, show_chat_prompt

**Impact:** Users can enable email transcripts of conversations but have no guide.

### 1.8 Feedback Follow-Up (Thumbs Down Reasons) -- LOW PRIORITY

**What exists:**
- Type definitions: `FeedbackConfig`, `FeedbackReason` in types.ts
- Settings form field: `feedbackConfig` in the Settings page
- API route: `src/app/api/widget/[chatbotId]/feedback/route.ts`
- Feedback reasons: incorrect, not_relevant, too_vague, other
- Widget support: ThumbsUp/ThumbsDown in ChatWidget.tsx

**Impact:** The thumbs up/down per-message feedback and the follow-up "why" prompt have no documentation.

### 1.9 Onboarding Checklist -- LOW PRIORITY

**What exists:**
- Component: `src/components/chatbots/OnboardingChecklist.tsx`
- Steps: Add Knowledge Sources, Customize Widget, Publish, Deploy
- Dismissable per-chatbot via localStorage

**Impact:** Not critical since it is an in-app guide, but mentioning it in the Getting Started wiki page would be helpful.

### 1.10 Allowed Origins (CORS) Setting -- LOW PRIORITY

**What exists:**
- Settings form field: `allowedOrigins` in the Settings page
- Chatbot API field: `allowed_origins` in the PATCH schema
- CORS enforcement in `src/lib/api/cors.ts` and the chat API route

**Impact:** Security-relevant feature that restricts which domains can access the chatbot widget. Not mentioned in any docs.

### 1.11 Dashboard Settings Page Features -- LOW PRIORITY

**What exists in `/dashboard/settings`:**
- Profile management (name, email)
- Password change
- Two-factor authentication (TOTP/MFA) with QR code enrollment
- Model preference selector (per-user default model)
- Subscription plan details and per-tool access visibility

**Impact:** Account security features like 2FA have no wiki documentation.

### 1.12 Billing / Auto Top-Up -- LOW PRIORITY

**What exists:**
- Component: `src/components/dashboard/AutoTopupSettings.tsx`
- API route: `src/app/api/billing/auto-topup/route.ts`
- Dashboard billing page: `src/app/(authenticated)/dashboard/billing/page.tsx`

**Impact:** Credits guide mentions plan limits but not auto top-up.

---

## SECTION 2: Documentation Accuracy Issues

### 2.1 Customizing Widget Appearance -- MAJOR ISSUES

**Problem: Docs describe SDK options that do not exist in the codebase.**

The wiki page `customizing-widget-appearance.md` documents an extensive SDK API via `ChatWidget.init()` that does not match the actual implementation. The actual `WidgetConfig` type in `src/lib/chatbots/types.ts` defines the real options. Discrepancies:

| Documented SDK Option | Actual Status |
|---|---|
| `backgroundColor`, `textColor` | EXISTS in WidgetConfig |
| `primaryColor` | EXISTS |
| `position` (4 corners) | EXISTS |
| `width`, `height` | EXISTS |
| `bubbleIcon`, `bubbleColor` | NOT in WidgetConfig -- no `bubbleIcon` or `bubbleColor` fields exist. The actual field is `buttonSize` (number) |
| `bubbleSize` | The actual field is `buttonSize`, not `bubbleSize` |
| `autoOpen`, `autoOpenDelay` | EXISTS |
| `showBranding` | EXISTS |
| `soundEnabled` | EXISTS but docs call it `enableSounds` |
| `showOnMobile`, `showOnDesktop` | DO NOT EXIST in WidgetConfig |
| `enableAnimations`, `animationDuration` | DO NOT EXIST |
| `brandingText`, `brandingLink`, `brandingPosition` | DO NOT EXIST |
| `skipPreChat`, `preChatFields` | DO NOT EXIST as SDK options -- pre-chat is configured via the separate `PreChatFormConfig` in settings |
| `customCSS` | EXISTS as `customCss` (lowercase 'ss') |
| `darkMode`, `darkModeColors` | DO NOT EXIST |
| `offset: { bottom, right }` | Actual fields are `offsetX` and `offsetY` (numbers) |
| `mobileWidth`, `mobileHeight`, `mobilePosition` | DO NOT EXIST |
| `breakpoints`, `responsive` | DO NOT EXIST |
| `headerLogo`, `headerLogoSize`, `headerLogoPosition` | DO NOT EXIST -- logo is configured via `logoUrl` in the chatbot settings (not widget config) |
| `botAvatar`, `userAvatar`, `showAvatars`, `avatarSize` | DO NOT EXIST |
| `customStylesheet` | DOES NOT EXIST |
| `entranceAnimation`, `exitAnimation`, `animationEasing` | DO NOT EXIST |
| `messageAnimation`, `typingIndicator`, `typingSpeed` | DO NOT EXIST |
| `preChatForm: { enabled, title, fields, submitText }` | Pre-chat config IS real but lives in `PreChatFormConfig`, not as SDK init options |

**Actual WidgetConfig options NOT documented:**
- `secondaryColor` -- used for backgrounds
- `userBubbleColor`, `userBubbleTextColor`, `botBubbleColor`, `botBubbleTextColor` -- granular bubble colors
- `headerTextColor`
- `inputBackgroundColor`, `inputTextColor`, `inputPlaceholderColor`
- `sendButtonColor`, `sendButtonIconColor`
- `formBackgroundColor`, `formTitleColor`, `formDescriptionColor`, `formBorderColor`, `formLabelColor`, `formSubmitButtonTextColor`, `formPlaceholderColor`, `formInputBackgroundColor`, `formInputTextColor` -- pre-chat/survey form colors
- `secondaryButtonColor`, `secondaryButtonTextColor`, `secondaryButtonBorderColor`
- `containerBorderRadius`, `inputBorderRadius`, `buttonBorderRadius` -- border radius controls
- `fontSize` (number)
- `fontFamily` -- with 24 Google Font options
- `headerText` -- the header title text
- `reportBackgroundColor`, `reportTextColor`, etc. -- escalation report colors
- `feedbackBackgroundColor`, `feedbackTextColor`, etc. -- feedback colors

**Severity:** HIGH. The wiki heavily documents a fictional SDK API. Someone following these docs would get errors or nonfunctional widgets.

### 2.2 API Integration Guide -- MULTIPLE INACCURACIES

**a) Chat API request schema does not match docs.**

Documented request body:
```json
{
  "message": "...",
  "session_id": "...",
  "visitor_id": "...",
  "stream": false
}
```

Actual schema from `chatSchema` in the route:
```
message: string (required, 1-10000 chars)
stream: boolean (optional, defaults to false)
session_id: string (optional, max 100)
visitor_id: string (optional, max 100)
welcome_message: string (optional)
proactive_message: string (optional)
user_data: Record<string, string> (optional)
user_context: Record<string, unknown> (optional)
attachments: array of { url, file_name, file_type, file_size } (optional)
```

Missing from docs: `welcome_message`, `proactive_message`, `attachments` fields.
Docs show `user_data` values as objects but actual type is `Record<string, string>` (string values only).

**b) Knowledge Base API endpoints are wrong.**

Documented: `POST /api/chatbots/{chatbotId}/documents` with multipart form upload
Actual: `POST /api/chatbots/{id}/knowledge` -- no `/documents` endpoint exists at all. The knowledge system uses `knowledge_sources` and `knowledge_chunks`, not "documents."

Documented: `GET /api/chatbots/{chatbotId}/documents`
Actual: `GET /api/chatbots/{id}/knowledge` and `GET /api/chatbots/{id}/knowledge/{sourceId}`

Documented: `DELETE /api/chatbots/{chatbotId}/documents/{documentId}`
Actual: `DELETE /api/chatbots/{id}/knowledge/{sourceId}`

**c) Conversation History endpoints are wrong.**

Documented: `GET /api/conversations/{conversationId}/messages`
Actual: This endpoint does not exist. Conversations are accessed via `GET /api/chatbots/{id}/conversations`.

**d) Usage API does not exist.**

Documented: `GET /api/usage` with `start_date`, `end_date`, `group_by` parameters.
Actual: There is only `GET /api/usage/export` for CSV export. No `GET /api/usage` JSON API exists.

**e) Webhooks section is entirely fabricated.**

Documented: Dashboard > Settings > Webhooks UI, webhook events (conversation.created, conversation.message, etc.), webhook signing, payload format.
Actual: No webhooks configuration exists in the dashboard settings page. No user-facing webhook system exists. The only webhooks in the codebase are for Stripe (`/api/stripe/webhook`), Telegram (`/api/telegram/webhook`), and Slack (`/api/webhooks/slack`) -- all internal integrations, not user-configurable webhooks.

**f) SDK Libraries do not exist.**

Documented: `npm install @ai-saas/sdk` and `pip install ai-saas-sdk` with full code examples.
Actual: No npm or PyPI packages exist. These are aspirational documentation.

**g) Rate limit values are unverified.**

Documented: Tiered rate limits by plan (Free: 10/min, Starter: 60/min, etc.) with `X-RateLimit-*` headers.
Actual: Chat API has a hardcoded rate limit of 30 requests per minute per IP+chatbot. No per-plan differentiation. No `X-RateLimit-*` response headers are set.

**Severity:** HIGH. Multiple API endpoints documented do not exist or have wrong paths.

### 2.3 Getting Started Guide -- MINOR ISSUES

**a) Step 3 "Configure Settings" navigation path is slightly wrong.**

Docs say: Navigate to "Settings" to fine-tune.
Actual: The chatbot has a dedicated sub-navigation with "Settings" as a tab (at `/dashboard/chatbots/[id]/settings`). The docs could more clearly explain the chatbot-level settings vs the account-level settings at `/dashboard/settings`.

**b) Missing settings from the table.**

The settings table in getting-started.md lists: Welcome Message, Pre-Chat Form, Post-Chat Survey, Memory, Model Tier, Prompt Protection.

Actually available in the settings page but not mentioned:
- Temperature (0-2 slider)
- Max Tokens (100-4096)
- Live Fetch Threshold (0.5-0.95)
- Session TTL Hours
- File Upload configuration
- Proactive Messages configuration
- Transcript configuration
- Escalation configuration
- Feedback configuration
- Live Handoff configuration
- Telegram configuration
- Allowed Origins
- Logo upload
- Language (20+ languages)
- System Prompt Templates

**Severity:** LOW. The guide is a quick-start, so listing every setting is not required, but pointing to the settings page for "more options" would help.

### 2.4 Knowledge Base Guide -- MINOR ISSUES

**a) Missing source types.**

Docs list: URL, Text, Q&A
Actual: The knowledge system also processes PDF and DOCX files. The URL docs mention "PDF and DOCX files linked on the page will also be processed" but there is no mention of direct PDF/DOCX upload.

**b) Chunk size described as "~500 tokens" may be inaccurate.**

The actual chunker in `src/lib/chatbots/knowledge/chunker.ts` may use different parameters. The docs should reference the actual chunk size from the code.

**Severity:** LOW.

### 2.5 Deploying Your Chatbot -- MINOR ISSUES

**a) Agent Console SDK path.**

Docs reference: `https://your-domain.com/agent-console/sdk.js`
Actual deploy page generates: `src="${baseUrl}/agent-console/sdk.js"` -- this matches. However there is no actual `agent-console/sdk.js` static file in the public directory. The deploy page generates the code blocks but the actual agent console implementation uses the in-app `AgentConsoleLayout` component, not a standalone SDK. Need to verify whether the external SDK actually exists as a served file.

**b) The `ChatWidget.init()` and `ChatWidget.destroy()` API for SPAs.**

Docs show: `window.ChatWidget?.destroy()` and `window.ChatWidget?.init()`.
The actual widget is a Next.js page component (`src/app/widget/[chatbotId]/page.tsx`) that renders `ChatWidget`. The SDK script (`widget/sdk.js`) would need to expose these global methods. This should be verified.

**Severity:** LOW-MEDIUM.

### 2.6 Credits & Usage Guide -- MINOR ISSUES

**a) No mention of Auto Top-Up.**

The `AutoTopupSettings` component and `/api/billing/auto-topup` endpoint exist but are not documented.

**b) "Check Dashboard > Settings to view your current plan" is misleading.**

Plan details are visible on the Billing page and the Dashboard page, not just Settings.

**Severity:** LOW.

### 2.7 Chatbot Memory & Verification -- ACCURATE

This wiki page is well-aligned with the actual implementation:
- Memory enable/disable and retention days match the settings form
- OTP flow matches the API routes (`/memory/check`, `/memory/send-otp`, `/memory/verify-otp`)
- Rate limiting description is consistent with the code
- Database table descriptions are reasonable

**One minor issue:** The docs list memory retention options as specific values (7d, 14d, 30d, 60d, 90d, 180d, 1y, Unlimited). The actual settings form uses `memoryDays` as a number (0-365). The UI may constrain to these specific values via a dropdown, but the underlying type allows any number 0-365.

**Severity:** LOW.

### 2.8 Leads & Conversations Guide -- MINOR ISSUE

The docs describe the page as having "Leads" and "Conversations" tabs.
The actual chatbot sub-navigation shows "Leads" as a separate page (`/leads`) and "Agent Console" (not "Conversations") at `/conversations`.

The `/leads` page at `src/app/(authenticated)/dashboard/chatbots/[id]/leads/page.tsx` handles leads.
The `/conversations` page is actually the Agent Console, not a simple conversations viewer.

**Severity:** MEDIUM. The page described in the wiki may not match what users see.

---

## SECTION 3: Inconsistencies

### 3.1 Navigation Labels vs Wiki Terminology

| Wiki Calls It | Actual Sub-Nav Label |
|---|---|
| "Leads & Conversations" | "Leads" (separate page) + "Agent Console" (at /conversations) |
| "Escalations & Reporting" | "Reports" |
| "Customize Widget" | "Customize" |
| "Knowledge Base" | "Knowledge" |

### 3.2 Settings Page Path

The wiki frequently says "Dashboard > Chatbots > [Your Chatbot] > Settings > Appearance" for widget customization. But widget customization has its own dedicated "Customize" page in the sub-navigation -- it is NOT a section within Settings.

Affected wiki pages: `customizing-widget-appearance.md` (opening paragraph says "Navigate to Dashboard > Chatbots > [Your Chatbot] > Settings > Appearance")

### 3.3 Pre-Chat Form Field Types

Wiki (`customizing-widget-appearance.md`) documents pre-chat form fields as:
```
{ name, label, type: 'text' | 'email' | 'select', required, placeholder, options }
```

Actual `PreChatFormField` type:
```
{ id, type: 'name' | 'email' | 'phone' | 'company' | 'custom', label, placeholder?, required, options? }
```

The field types in the code are semantic (`name`, `email`, `phone`, `company`, `custom`) not HTML input types (`text`, `email`, `select`).

### 3.4 Survey Question Types

Wiki (`surveys-guide.md`) documents: Rating, Text, Select, Multi-select
Actual `SurveyQuestionType`: `rating`, `text`, `single_choice`, `multi_choice`

The naming matches conceptually but the actual type identifiers differ from what the docs imply.

### 3.5 Chatbot PATCH API vs Documented "Create Chatbot" Schema

The API guide documents `model: "gpt-4"` in the create chatbot request.
The actual system uses `model` as a tier string (`fast`, `balanced`, `powerful`) that maps to provider-specific models internally, not raw model names.

---

## SECTION 4: Recommendations

### New Wiki Pages to Create

| Page | Priority | Reason |
|---|---|---|
| `email-sequence-guide.md` | HIGH | Only AI tool with no wiki page. Full feature exists. |
| `agent-console-guide.md` | HIGH | Critical feature for live support workflows. Only embeddable version partially covered. |
| `file-upload-guide.md` | MEDIUM | Configurable feature in settings with no documentation. |
| `proactive-messages-guide.md` | MEDIUM | Rich feature (8 trigger types, bubble positioning, display modes) with zero docs. |
| `performance-dashboard-guide.md` | MEDIUM | Unique feature with complex pipeline visualization. |
| `analytics-guide.md` | MEDIUM | Dashboard feature with metrics users need explained. |
| `transcript-email-guide.md` | LOW | Small feature but users need to know it exists. |
| `account-security-guide.md` | LOW | 2FA setup, password change, model preferences. |

### Existing Pages to Update

| Page | Priority | What to Fix |
|---|---|---|
| `customizing-widget-appearance.md` | **CRITICAL** | Remove fictional SDK options. Document actual WidgetConfig properties. Fix navigation path (Customize page, not Settings > Appearance). Document the 24 font options, granular color controls, border radius settings, and custom CSS field. |
| `api-integration-guide.md` | **CRITICAL** | Fix knowledge base endpoints (knowledge, not documents). Remove nonexistent webhooks section. Remove nonexistent SDK libraries. Fix usage API. Correct rate limit details. Update chat API schema with actual fields. |
| `leads-conversations-guide.md` | HIGH | Clarify that /conversations is now the Agent Console, not a conversations list. Update navigation terminology. |
| `getting-started.md` | MEDIUM | Mention more settings available beyond the 6 listed. Reference the Onboarding Checklist. Update settings navigation. |
| `credits-usage-guide.md` | MEDIUM | Add auto top-up mention. Correct plan settings location. |
| `deploying-your-chatbot.md` | MEDIUM | Verify agent console SDK actually exists as a served file. Add note about allowed origins CORS setting. |
| `escalations-guide.md` | LOW | Update to match "Reports" navigation label. |
| `knowledge-base-guide.md` | LOW | Mention PDF/DOCX direct upload if supported. |
| `chatbot-memory-verification.md` | LOW | Clarify memory_days accepts 0-365, not just the listed presets. |

### Index File Update

The `docs/wiki/index.json` lists 22 page entries but only 19 .md files exist. The 3 missing files need investigation (they may be listed but never created, or may have been deleted). All new pages above should be added to the index under appropriate categories.

---

## Summary of Severity Counts

| Severity | Count |
|---|---|
| CRITICAL (inaccurate docs that will cause failures) | 2 pages |
| HIGH (missing docs for important features) | 3 features + 1 page update |
| MEDIUM (missing or incomplete docs) | 6 features + 3 page updates |
| LOW (nice-to-have improvements) | 4 features + 4 page updates |

**Top 3 actions by impact:**
1. Rewrite `customizing-widget-appearance.md` to match actual WidgetConfig
2. Rewrite API sections of `api-integration-guide.md` to match actual endpoints
3. Create `email-sequence-guide.md` for the undocumented AI tool
