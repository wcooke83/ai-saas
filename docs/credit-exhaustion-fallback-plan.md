# Chatbot Fallback System — Ticketing, Contact Form, Ad-Hoc Credits, and Help Articles

You are building a fallback system for a chatbot SaaS app. When a chatbot's AI usage credits are exhausted, the chat widget must gracefully degrade into one of four configurable modes. The chatbot admin selects their preferred fallback in the Settings page.

## Context

- **Stack**: Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase (auth, DB, pgvector), Stripe, @react-pdf/renderer
- **Existing chatbot widget**: `src/components/widget/ChatWidget.tsx` (~4700 lines). It already handles views like `pre-chat-form`, `chat`, `survey`, `report`. The widget loads config from `GET /api/widget/{chatbotId}/config` and sends messages via `POST /api/chat/{chatbotId}` which already returns `403` with `limit_reached` when credits are exhausted.
- **Existing settings page**: `src/app/(authenticated)/dashboard/chatbots/[id]/settings/page.tsx`. It uses `react-hook-form`, has a sidebar with sections (General, System Prompt, AI Model, Memory, Pre-Chat Form, etc.), and saves via `PATCH /api/chatbots/{id}`.
- **Existing types**: `src/lib/chatbots/types.ts` contains `Chatbot`, `WidgetConfig`, `PreChatFormConfig`, `EscalationConfig`, `FeedbackConfig`, `LiveHandoffConfig`, etc.
- **Existing knowledge system**: `src/lib/chatbots/rag.ts` does similarity search via `match_knowledge_chunks` RPC against pgvector embeddings in Supabase. Knowledge sources are URLs, PDFs, and DOCX files chunked and embedded via OpenAI.
- **Existing Stripe integration**: `src/app/api/webhooks/stripe/route.ts` handles subscription webhooks. Tables: `subscriptions`, `usage`, `profiles`.
- **Existing email patterns**: The app sends emails via a utility (check `src/lib/email` or similar). If none exists, use Resend or nodemailer with a simple utility.
- **Settings chatbot ID for E2E**: authenticated settings tests use `e2e00000-0000-0000-0000-000000000001` (pre-seeded bot owned by e2e test user). Widget tests use `10df2440-6aac-441a-855d-715c0ea8e506` (published bot, public access).

## Requirements

### 1. New Settings Section: "Credit Exhaustion Fallback"

Add a new section to the settings sidebar (icon: `AlertCircle` or `LifeBuoy`). The admin configures what happens when credits run out.

**Four mutually exclusive modes (radio buttons):**

#### Mode 1: "Open Tickets"
When selected, show these config fields:
- **Ticket form title** (text input, default: "We'll get back to you")
- **Ticket form description** (text input, default: "Our AI assistant is currently unavailable. Submit a ticket and we'll respond via email.")
- **Required fields toggle**: Name, Email (always required), Phone (optional), Subject (optional), Priority dropdown (optional: Low/Medium/High/Urgent)
- **Custom fields editor** (same pattern as pre-chat form field editor -- reuse the component)
- **Auto-reply email template** (textarea with placeholders: `{{name}}`, `{{ticketId}}`, `{{subject}}`)
- **Admin notification email** (text input -- where to send new ticket alerts)
- **Ticket reference format** (prefix + auto-increment, default: "TKT-")

#### Mode 2: "Simple Contact Form"
When selected, show:
- **Form title** (text input)
- **Form description** (text input)
- **Fields**: Name, Email, Message (all required)
- **Admin notification email** (text input)
- **Auto-reply toggle** (on/off) with customizable reply text

#### Mode 3: "Purchase Additional Quota"
When selected, show:
- **Ad-hoc credit packages** editor (add/remove rows):
  - Package name (e.g., "100 Credits")
  - Credit amount (number)
  - Price in cents (number)
  - Stripe Price ID (text -- admin creates the price in Stripe, pastes ID here)
- **Upsell message** (text shown in widget when credits exhausted, e.g., "You've used all your credits this month. Purchase more to continue chatting.")
- **Purchase success message** (text shown after successful purchase)

#### Mode 4: "Help Articles"
When selected, show:
- **Info text**: "When credits are exhausted, the widget will display searchable help articles generated from your knowledge sources. Articles are pre-generated while AI credits are available."
- **Generate Articles button**: Triggers a background job that uses the existing knowledge chunks to generate structured help articles (title, summary, body) via AI. Store these in a new `help_articles` table.
- **Article count display**: "X articles generated from Y knowledge sources"
- **Regenerate button** (to refresh articles when knowledge sources change)
- **Search placeholder** (text input for the widget search bar)
- **Empty state message** (text shown if no articles exist)

### 2. Database Schema

Create Supabase migrations for:

```sql
-- Tickets table
tickets: id (uuid), chatbot_id (uuid FK), visitor_name, visitor_email, visitor_phone?,
  subject?, message (text), priority ('low'|'medium'|'high'|'urgent'), status ('open'|'in_progress'|'resolved'|'closed'),
  reference (text unique, e.g. "TKT-0001"), custom_fields (jsonb),
  created_at, updated_at, resolved_at?, admin_notes?

-- Contact form submissions
contact_submissions: id (uuid), chatbot_id (uuid FK), visitor_name, visitor_email,
  message (text), status ('new'|'read'|'replied'), created_at

-- Ad-hoc credit packages (configured per chatbot)
credit_packages: id (uuid), chatbot_id (uuid FK), name, credit_amount (int),
  price_cents (int), stripe_price_id (text), active (bool), sort_order (int),
  created_at

-- Ad-hoc credit purchases
credit_purchases: id (uuid), chatbot_id (uuid FK), user_id (uuid FK),
  package_id (uuid FK), stripe_session_id (text), stripe_payment_intent_id (text),
  credit_amount (int), amount_paid_cents (int), status ('pending'|'completed'|'failed'),
  created_at

-- Help articles (pre-generated from knowledge sources)
help_articles: id (uuid), chatbot_id (uuid FK), title (text), summary (text),
  body (text), source_chunk_ids (uuid[]), search_vector (tsvector),
  sort_order (int), published (bool), created_at, updated_at

-- Add to chatbots table
ALTER TABLE chatbots ADD COLUMN credit_exhaustion_mode ('tickets'|'contact_form'|'purchase_credits'|'help_articles') DEFAULT 'tickets';
ALTER TABLE chatbots ADD COLUMN credit_exhaustion_config (jsonb) DEFAULT '{}';
```

Add RLS policies: tickets/contact_submissions readable by chatbot owner. Help articles readable by anyone (public widget). Credit purchases tied to user_id.

### 3. Widget Changes

In `ChatWidget.tsx`, when the chat API returns `403` with `limit_reached`:

- Read `config.creditExhaustionMode` from the widget config endpoint
- Transition to the appropriate fallback view:

**Tickets view** (`currentView = 'ticket-form'`):
- Render a form matching the ticket config (title, description, required/optional fields, custom fields)
- On submit: `POST /api/widget/{chatbotId}/tickets` -> creates ticket, sends auto-reply email to visitor, sends notification email to admin
- Show success state with ticket reference number
- CSS classes: `.chat-widget-ticket-form`, `.chat-widget-ticket-field`, `.chat-widget-ticket-submit`, `.chat-widget-ticket-success`

**Contact form view** (`currentView = 'contact-form'`):
- Simple Name/Email/Message form
- On submit: `POST /api/widget/{chatbotId}/contact` -> saves submission, sends emails
- CSS classes: `.chat-widget-contact-form`, `.chat-widget-contact-submit`

**Purchase credits view** (`currentView = 'purchase-credits'`):
- Show upsell message and credit package cards
- Each card: package name, price, "Buy" button
- Buy button -> `POST /api/widget/{chatbotId}/purchase` -> creates Stripe Checkout session -> redirect
- On return from Stripe success URL -> show success message, reload widget config (credits now available)
- CSS classes: `.chat-widget-purchase-view`, `.chat-widget-package-card`, `.chat-widget-package-buy`

**Help articles view** (`currentView = 'help-articles'`):
- Search bar at top
- Scrollable list of article cards (title + summary)
- Click article -> expand to full body (rendered markdown)
- Back button to return to list
- Full-text search via `GET /api/widget/{chatbotId}/articles?q=...`
- CSS classes: `.chat-widget-articles-view`, `.chat-widget-article-card`, `.chat-widget-article-detail`, `.chat-widget-articles-search`

### 4. API Routes

Create these new routes:

- `POST /api/widget/{chatbotId}/tickets` -- Create ticket (public, rate limited)
- `GET /api/chatbots/{id}/tickets` -- List tickets for admin (authenticated)
- `PATCH /api/chatbots/{id}/tickets/{ticketId}` -- Update ticket status/notes (authenticated)
- `POST /api/widget/{chatbotId}/contact` -- Submit contact form (public, rate limited)
- `GET /api/chatbots/{id}/contact-submissions` -- List submissions for admin (authenticated)
- `POST /api/widget/{chatbotId}/purchase` -- Create Stripe checkout session (public)
- `POST /api/webhooks/stripe` -- Extend existing handler for `checkout.session.completed` on ad-hoc purchases
- `GET /api/widget/{chatbotId}/articles` -- Search/list help articles (public)
- `POST /api/chatbots/{id}/articles/generate` -- Trigger article generation from knowledge sources (authenticated)
- `GET /api/chatbots/{id}/articles` -- List articles for admin (authenticated)
- `DELETE /api/chatbots/{id}/articles/{articleId}` -- Delete article (authenticated)

### 5. Email System

Create an email utility at `src/lib/email/send.ts` (if not exists) that:
- Uses Resend (or check if the app already has an email provider)
- Supports HTML templates with variable interpolation
- Has these template functions:
  - `sendTicketConfirmation(to, { name, ticketId, subject, autoReplyText })`
  - `sendTicketAdminNotification(to, { ticketId, visitorName, visitorEmail, subject, message, priority, chatbotName })`
  - `sendContactConfirmation(to, { name, message })`
  - `sendContactAdminNotification(to, { visitorName, visitorEmail, message, chatbotName })`
  - `sendCreditPurchaseConfirmation(to, { name, creditAmount, amountPaid })`

### 6. Help Article Generation

Create `src/lib/chatbots/articles.ts`:
- `generateHelpArticles(chatbotId)`:
  1. Fetch all knowledge chunks for the chatbot
  2. Group chunks by source
  3. For each source group, call the AI provider to generate a structured help article:
     - Title (concise, descriptive)
     - Summary (1-2 sentences)
     - Body (markdown, comprehensive)
  4. Generate tsvector for full-text search
  5. Upsert into `help_articles` table
- This uses existing `src/lib/ai/provider.ts` `generate()` function
- Should be idempotent (regenerating replaces existing articles for that chatbot)

### 7. Admin Dashboard Pages

Create these new pages under the chatbot dashboard:

**Tickets page** (`/dashboard/chatbots/{id}/tickets`):
- Table with columns: Reference, Subject, Visitor, Priority, Status, Created
- Click row -> detail view with full message, admin notes textarea, status dropdown
- Pagination, status filter tabs (All, Open, In Progress, Resolved, Closed)

**Contact Submissions page** (`/dashboard/chatbots/{id}/contact`):
- Simple table: Name, Email, Message preview, Status, Date
- Click -> full message view
- Mark as read/replied

**Help Articles page** (`/dashboard/chatbots/{id}/articles`):
- Article list with edit/delete/reorder
- "Generate from Knowledge Sources" button
- Toggle published/unpublished per article
- Edit article inline (title, summary, body with markdown preview)

### 8. Extend Widget Config API

Update `GET /api/widget/{chatbotId}/config` to include:
```json
{
  "creditExhausted": true|false,
  "creditExhaustionMode": "tickets"|"contact_form"|"purchase_credits"|"help_articles",
  "creditExhaustionConfig": { ... mode-specific config ... },
  "creditPackages": [ ... if mode is purchase_credits ... ],
  "helpArticleCount": 5
}
```

Update `PATCH /api/chatbots/{id}` to accept `credit_exhaustion_mode` and `credit_exhaustion_config`.

### 9. Comprehensive E2E Tests

After all functionality is built, create E2E test files following the existing patterns in the codebase:
- All filenames MUST start with `e2e-` (required by `playwright.config.ts`)
- Use `test.describe()` blocks with section names
- Include test IDs in test names for traceability
- Tests should be independent (no shared state)
- Settings tests use chatbot ID: `e2e00000-0000-0000-0000-000000000001`
- Widget tests use chatbot ID: `10df2440-6aac-441a-855d-715c0ea8e506`
- Use `nav button` selectors for settings sidebar navigation (not `.first()`)
- Wait for content with `await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 })` after settings page goto
- Handle disabled/enabled toggle states (features may be off by default)
- Use `page.getByRole('heading', { name: '...' })` for section headings to avoid strict mode violations

**Test files to create:**

`tests/e2e-fallback-settings.spec.ts`:
- FALLBACK-001: Settings section renders with four radio options
- FALLBACK-002: Switching between modes shows/hides relevant config fields
- FALLBACK-003: Ticket form config fields save and persist
- FALLBACK-004: Contact form config fields save and persist
- FALLBACK-005: Credit packages CRUD (add, edit, remove packages)
- FALLBACK-006: Help articles section shows generate button and article count
- FALLBACK-007: Admin notification email validation
- FALLBACK-008: Auto-reply template with placeholders
- FALLBACK-009: Ticket reference format configuration
- FALLBACK-010: Purchase credits upsell message customization

`tests/e2e-fallback-tickets.spec.ts`:
- TICKET-001: Widget shows ticket form when credits exhausted (mock 403 response)
- TICKET-002: Ticket form validation (required fields)
- TICKET-003: Successful ticket submission shows reference number
- TICKET-004: Ticket appears in admin dashboard
- TICKET-005: Admin can change ticket status
- TICKET-006: Admin can add notes to ticket
- TICKET-007: Ticket list pagination and filtering
- TICKET-008: Priority badge colors render correctly

`tests/e2e-fallback-contact.spec.ts`:
- CONTACT-001: Widget shows contact form when credits exhausted
- CONTACT-002: Contact form validation
- CONTACT-003: Successful submission shows confirmation
- CONTACT-004: Submission appears in admin dashboard
- CONTACT-005: Admin can mark as read/replied

`tests/e2e-fallback-purchase.spec.ts`:
- PURCHASE-001: Widget shows credit packages when credits exhausted
- PURCHASE-002: Package cards display name, price, and buy button
- PURCHASE-003: Buy button initiates Stripe checkout (mock or intercept)
- PURCHASE-004: After purchase, widget reloads with credits available
- PURCHASE-005: Empty state when no packages configured

`tests/e2e-fallback-articles.spec.ts`:
- ARTICLE-001: Widget shows help articles when credits exhausted
- ARTICLE-002: Article search filters results
- ARTICLE-003: Click article expands to full detail view
- ARTICLE-004: Back button returns to article list
- ARTICLE-005: Admin can generate articles from knowledge sources
- ARTICLE-006: Admin can edit article title/summary/body
- ARTICLE-007: Admin can toggle article published state
- ARTICLE-008: Admin can delete articles
- ARTICLE-009: Empty state when no articles generated

**After writing each test file, immediately run it:**
```bash
npx playwright test tests/e2e-{filename}.spec.ts --project=e2e --no-deps --retries=0
```
Fix failures and re-run. If a test fails 3 times with the same error, skip it with `test.skip()` and a `// TODO` comment.

### 10. Implementation Order

1. Database migrations
2. Email utility
3. Types and config schema
4. API routes (tickets, contact, purchase, articles)
5. Help article generation
6. Widget fallback views
7. Settings section
8. Admin dashboard pages
9. E2E tests

### Constraints

- Do NOT create documentation files unless explicitly asked
- Keep changes minimal -- don't refactor existing code unless necessary
- Use existing patterns (look at how pre-chat form, escalation, and handoff are implemented for reference)
- All new CSS classes must use the `chat-widget-` prefix in the widget
- Rate limit all public widget endpoints (use existing rate limiting pattern from `POST /api/chat/{chatbotId}`)
- Validate all inputs server-side with Zod
- Use existing Supabase admin client for service-role operations
- Use existing AI provider for article generation
