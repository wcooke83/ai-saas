# Credit Exhaustion Fallback System -- UX Audit Report

**Date:** 2026-03-24
**Auditor:** UX Audit (automated)
**Scope:** All touchpoints of the Credit Exhaustion Fallback system: admin settings, widget fallback views, admin management pages, and subnav integration.

---

## Executive Summary

The Credit Exhaustion Fallback system provides a solid functional foundation: four clearly distinct fallback modes, a well-structured settings panel, and usable admin management screens. The architecture is sound and the intent behind each mode is communicated effectively.

However, the audit identified **7 critical issues**, **12 major issues**, and **16 minor issues** across the system. The most significant problems fall into three categories:

1. **Accessibility gaps** -- Forms in the widget lack label-input associations (`htmlFor`/`id`), there are no ARIA live regions for error announcements, no `role="alert"` on error messages, and article cards use click-only divs with no keyboard support. These issues would fail WCAG 2.1 AA.

2. **Silent failures and missing feedback** -- The purchase credits flow swallows errors to `console.error` with no user-visible feedback. The `creditExhausted` prop is declared but never used, so the widget cannot show the fallback immediately on mount when credits are already exhausted. The `onSuccess` callbacks are no-ops.

3. **Security concern** -- The help articles view uses `dangerouslySetInnerHTML` on article bodies processed through a minimal markdown parser, creating an XSS vector if article content is ever user-influenced or scraped from external sources.

Top priority fixes: address the XSS vector, wire up `creditExhausted` for immediate fallback on load, surface purchase errors to users, and add basic accessibility attributes to widget forms.

---

## Touchpoint 1: Settings UI (Admin Configures Fallback Mode)

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/settings/page.tsx`, lines 1816-2209

### 1.1 Mode Selection Radio Cards

**What works well:**
- Radio card pattern with highlighted borders on selection is clear and consistent with modern UI patterns.
- Each mode has a label and a short description -- good progressive disclosure.
- The descriptions are concise and use plain language.

**Finding 1.1a -- Price input uses cents, not dollars**
- Severity: **Major**
- The "Price (cents)" field requires admins to enter values in cents (e.g., 999 for $9.99). This is a developer-centric data model leaking into the UI. While there is a helpful conversion preview below the field (`$9.99`), the input itself creates cognitive friction and error-prone entry.
- Recommendation: Change the input to accept dollars (e.g., `$9.99`) and convert to cents on save. Alternatively, use a masked currency input. The cents preview is a good interim measure but insufficient for the primary interaction.

**Finding 1.1b -- No validation on Stripe Price ID format**
- Severity: **Minor**
- The Stripe Price ID field accepts any string. A simple prefix check (`price_`) with inline validation feedback would prevent save-then-fail cycles.
- Recommendation: Add client-side pattern validation with a helpful error message like "Must start with price_".

**Finding 1.1c -- Credit package deletion has no confirmation**
- Severity: **Major**
- Clicking the trash icon on a credit package removes it immediately from the local state with no confirmation dialog. If the admin has not yet saved, this is recoverable, but the lack of any friction for a destructive action is risky -- especially if the admin mentally models "I see it disappear, it's gone."
- Recommendation: Add either a confirmation step or an undo toast (preferred for lower friction).

**Finding 1.1d -- Checkbox layout may collapse on narrow sidebar**
- Severity: **Minor**
- The ticket form checkboxes (Phone, Subject, Priority) are in a horizontal `flex gap-4` layout. On narrow viewports or when the sidebar settings panel is constrained, these could wrap awkwardly.
- Recommendation: Use `flex-wrap` or stack vertically below a breakpoint.

**Finding 1.1e -- Auto-Reply Template lacks preview**
- Severity: **Enhancement**
- The auto-reply email template field shows available placeholders (`{{name}}`, `{{ticketId}}`, `{{subject}}`), which is good. A live preview showing the template rendered with sample data would significantly improve confidence.
- Recommendation: Add a small preview panel below the textarea showing the rendered template with placeholder values like "John Doe," "TKT-001234," etc.

**Finding 1.1f -- "Generate Articles from Knowledge Sources" button has no loading state indicator**
- Severity: **Minor**
- The button in the help_articles config section triggers an async operation and shows a toast, but the button itself does not show a spinner or disabled state while the generation is in progress. The admin could click it multiple times.
- Recommendation: Add `disabled` state and a spinner while the generation request is in flight.

**Finding 1.1g -- Config update pattern is verbose and fragile**
- Severity: **Enhancement**
- Each config field uses a repetitive pattern of spreading the config object, mutating a nested key, and calling `setValue`. This is not a UX issue visible to users, but it creates maintainability risk that could lead to bugs visible to users (e.g., lost state from shallow spreads).
- Recommendation: Abstract the nested config update into a helper function.

---

## Touchpoint 2: Widget Fallback Views (Visitor-Facing)

**File:** `src/components/widget/fallback-views.tsx`

### 2.1 FallbackTicketForm

**Finding 2.1a -- Labels are not associated with inputs**
- Severity: **Critical (Accessibility)**
- All `<label>` elements use inline text but have no `htmlFor` attribute, and inputs have no `id`. Screen readers will not associate labels with their form controls. This is a WCAG 2.1 AA failure (Success Criterion 1.3.1, 4.1.2).
- Recommendation: Add matching `htmlFor`/`id` pairs to every label-input pair. Example: `<label htmlFor="ticket-name">Name *</label>` with `<input id="ticket-name" ... />`.

**Finding 2.1b -- Error messages are not announced to screen readers**
- Severity: **Critical (Accessibility)**
- The error `<p>` element has no `role="alert"` or `aria-live="assertive"`. When validation fails, screen reader users receive no notification.
- Recommendation: Add `role="alert"` to the error paragraph. Also add `aria-invalid="true"` to the specific fields that failed validation, and `aria-describedby` linking to the error message.

**Finding 2.1c -- Client-side validation is minimal**
- Severity: **Major**
- Validation only checks for non-empty trimmed values. Email format is validated by the `type="email"` attribute on the input (browser-level), but there is no visual inline validation feedback per field. The error message "Name, email, and message are required" is generic -- it does not indicate which specific field is missing.
- Recommendation: Highlight individual fields with error state (red border, field-level error message). Show which specific fields need attention.

**Finding 2.1d -- No email format validation feedback**
- Severity: **Minor**
- The email input has `type="email"` which provides browser validation on submit, but since the form uses `e.preventDefault()` and custom validation in `handleSubmit`, the browser validation never fires. Invalid email formats like "not-an-email" will pass the custom validation (which only checks `trim()`).
- Recommendation: Add email format regex validation in `handleSubmit`.

**Finding 2.1e -- Success state has no next action**
- Severity: **Major**
- After ticket submission, the success screen shows a checkmark, "Ticket submitted!", and a reference number. There is no way for the visitor to go back to the chat, submit another ticket, or do anything else. They are stuck on this screen.
- The `onSuccess` callback passed from ChatWidget is `() => {}` (a no-op).
- Recommendation: Add a "Back to chat" or "Submit another" button. Wire up `onSuccess` to provide meaningful navigation (even if chat is disabled, returning to the chat view with the disabled input and the conversation history gives context).

**Finding 2.1f -- Textarea resize can escape widget bounds**
- Severity: **Minor**
- The textarea has `resize: 'vertical'` but no `maxHeight`. In a constrained widget viewport, an aggressive resize could push the submit button off-screen.
- Recommendation: Add `maxHeight: '200px'` or similar constraint appropriate to the widget dimensions.

### 2.2 FallbackContactForm

**Finding 2.2a -- Same accessibility issues as ticket form**
- Severity: **Critical (Accessibility)**
- Identical label/input association and error announcement problems as described in 2.1a and 2.1b.
- Recommendation: Same fixes as ticket form.

**Finding 2.2b -- Success state is a dead end**
- Severity: **Major**
- Same issue as 2.1e. "Message sent!" with "We'll get back to you soon." and no further actions.
- Recommendation: Same as 2.1e.

**Finding 2.2c -- Form className is on the `<form>` element but named "contact-submit"**
- Severity: **Minor**
- `className="chat-widget-contact-submit"` is applied to the entire form element. The class name suggests it is the submit button. Minor naming confusion that could cause styling issues if someone targets this class.
- Recommendation: Rename to `chat-widget-contact-form`.

### 2.3 FallbackPurchaseCredits

**Finding 2.3a -- Purchase errors are silently swallowed**
- Severity: **Critical**
- When `handleBuy` catches an error, it only calls `console.error('Purchase error:', err)`. The visitor sees no error message at all. If the API call fails, the payment cannot be completed, and the loading state simply clears with no feedback.
- Recommendation: Add an error state and display a user-visible error message like "Unable to start checkout. Please try again." This is especially important for a payment flow where user trust is paramount.

**Finding 2.3b -- Buy button loading state shows "..." instead of a spinner**
- Severity: **Minor**
- The loading indicator is the text `...` which is visually ambiguous. It could look like an ellipsis price. Other parts of the app use spinner icons.
- Recommendation: Use a small CSS spinner or the text "Loading..." to be unambiguous.

**Finding 2.3c -- `window.open` for Stripe checkout may be blocked by popup blockers**
- Severity: **Major**
- The checkout URL is opened with `window.open(url, '_blank')`. Many browsers block popups not directly triggered by user clicks. Since the `window.open` call happens inside an `async` function after a `fetch`, it is no longer in the synchronous click handler callstack, and popup blockers will likely suppress it.
- Recommendation: Use `window.location.href = url` to navigate in the same tab (with a way to return), or open a blank window synchronously before the fetch and then set its location after the fetch resolves. The same-tab redirect is the more reliable and standard Stripe Checkout pattern.

**Finding 2.3d -- No indication of what "credits" mean to the visitor**
- Severity: **Major**
- The package cards show "100 credits" but a first-time visitor has no context for what a credit represents. The upsell message from the config helps ("You've used all your credits. Purchase more to continue chatting.") but the card itself does not explain the value proposition.
- Recommendation: Either add a subtitle like "100 more chat messages" or allow the admin to configure a description per package. At minimum, the upsell message should be more specific about the credit-to-message ratio.

**Finding 2.3e -- Package card buy buttons have no focus outline**
- Severity: **Minor (Accessibility)**
- The buy buttons use inline styles with no `:focus` or `outline` definition. Keyboard users tabbing through packages will not see which button is focused.
- Recommendation: Add a focus style -- either via CSS class or by adding `outline` to the style when focused.

### 2.4 FallbackHelpArticles

**Finding 2.4a -- XSS vulnerability via dangerouslySetInnerHTML**
- Severity: **Critical (Security)**
- The article detail view renders `dangerouslySetInnerHTML={{ __html: simpleMarkdown(selectedArticle.body) }}`. The `simpleMarkdown` function does escape `&`, `<`, `>` before applying markdown transformations, which provides basic XSS protection. However, the `<li>` replacement uses the captured group directly after the escaping step, and the heading replacements inject raw inline styles. If the escaping is ever bypassed or if the regex transformations introduce edge cases (e.g., nested markdown patterns that produce valid HTML after transformation), this becomes exploitable. Additionally, articles may come from scraped URLs (`source_url` field exists on articles), making untrusted content a realistic input.
- Recommendation: Use a proper markdown sanitization library (e.g., DOMPurify on the output of simpleMarkdown, or use a safe markdown renderer like `marked` + DOMPurify). The current hand-rolled regex approach is fragile for security-critical rendering.

**Finding 2.4b -- Article cards are not keyboard accessible**
- Severity: **Critical (Accessibility)**
- Article list items use `<div onClick={...}>` with no `role="button"`, `tabIndex={0}`, or `onKeyDown` handler. Keyboard users cannot navigate to or select articles. This is a WCAG 2.1 AA failure (Success Criterion 2.1.1).
- Recommendation: Either use a `<button>` element styled as a card, or add `role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedArticle(article) }}`.

**Finding 2.4c -- Articles load on every render via anti-pattern**
- Severity: **Major (Performance)**
- The `loadArticles` function is called conditionally inside the render body: `if (!loaded) { loadArticles(); }`. This is not inside a `useEffect`, meaning it fires during rendering. While the `loaded` flag prevents infinite loops, this is a React anti-pattern that can cause issues with strict mode (double-invocation) and makes the component harder to reason about.
- Recommendation: Move the initial load into a `useEffect(() => { loadArticles(); }, [])`.

**Finding 2.4d -- Search has no debounce and requires explicit button click or Enter**
- Severity: **Minor**
- The search requires the user to either click "Search" or press Enter. There is no debounced live search. This is acceptable for a widget with limited viewport, but the Enter key handler does not provide feedback that the search is in progress (the loading state is a simple text string "Loading...").
- Recommendation: Consider adding a small spinner in the search button during search. The current approach of explicit search submission is fine for this context.

**Finding 2.4e -- Back button in article detail is not a real button**
- Severity: **Minor (Accessibility)**
- The back button is a `<button>` element, which is correct. However, it has `padding: 0` and no minimum touch target size. On mobile, this 13px-font text link is difficult to tap.
- Recommendation: Add at least `min-height: 44px` and `padding: 8px 0` for adequate touch target size per WCAG 2.5.5.

**Finding 2.4f -- No loading skeleton or progressive loading**
- Severity: **Minor**
- The loading state is a plain "Loading..." text string. This feels disconnected from the rest of the app, which uses the Loader2 spinner component in admin pages.
- Recommendation: Use a spinner or skeleton cards for consistency with the overall app feel, even within the widget.

---

## Touchpoint 3: Widget Integration (Fallback Trigger)

**File:** `src/components/widget/ChatWidget.tsx`, lines 1050-1071, 3401-3444

**Finding 3.1 -- `creditExhausted` prop is declared but never used**
- Severity: **Critical**
- The `creditExhausted` boolean prop is accepted by `ChatWidget` but never referenced in the component body. This means if the server determines credits are already exhausted before any message is sent (e.g., on page load), the widget opens to the normal chat view, the visitor types a message, sends it, gets a 403, and only then transitions to the fallback. The visitor wastes time composing a message that can never be processed.
- Recommendation: Use `creditExhausted` in a `useEffect` on mount to immediately set `chatDisabled('message_limit')` and transition to the appropriate fallback view. The visitor should never see the normal chat input if credits are already gone.

**Finding 3.2 -- 1500ms delay before fallback transition feels arbitrary**
- Severity: **Minor**
- After receiving a 403, the code does `setTimeout(() => setCurrentView(fallbackView), 1500)`. During this 1500ms, the user sees the error message in the chat. This delay is meant to let the user read the error before the view changes, which is reasonable. However, the transition happens abruptly with no animation.
- Recommendation: The delay duration is acceptable. Consider adding a brief message like "Switching to [fallback mode]..." in the chat to set expectations, or adding a fade transition.

**Finding 3.3 -- No way to return to chat history from fallback views**
- Severity: **Major**
- Once the fallback view renders, the chat conversation history disappears. There is no "Back to chat" button on any fallback view (unlike the survey-thanks view which has one). The visitor loses access to their conversation.
- Recommendation: Add a link or button at the top of each fallback view to return to the chat view (in read-only mode). Even though chat input is disabled, the conversation history is valuable.

**Finding 3.4 -- Fallback view has no heading announcing the context change**
- Severity: **Minor (Accessibility)**
- When the view switches from chat to a fallback form, there is no screen reader announcement that the context has changed. Sighted users see the visual change; screen reader users may not realize the chat has been replaced.
- Recommendation: Add an `aria-live="polite"` region or use focus management to move focus to the fallback view's heading on transition.

**Finding 3.5 -- `onSuccess` callbacks are no-ops**
- Severity: **Major**
- Both `FallbackTicketForm` and `FallbackContactForm` receive `onSuccess={() => {}}`. After successful form submission, the parent component does nothing -- no state update, no analytics event, no view transition. The visitor is stranded on the success screen.
- Recommendation: Wire `onSuccess` to at minimum re-enable a "Back to chat" option, or show a contextual next step.

---

## Touchpoint 4: Admin Dashboard Pages

### 4.1 Tickets Page

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/tickets/page.tsx`

**What works well:**
- Stats cards at the top give a good overview.
- Status filter tabs are well-implemented with a segmented control pattern.
- Ticket detail view with conversation thread, visitor info sidebar, status management, and internal notes is comprehensive.
- The reply form has Ctrl+Enter shortcut with a visible hint.
- Priority and status badges use color coding consistently.

**Finding 4.1a -- Table is not responsive**
- Severity: **Major**
- The ticket list uses an HTML `<table>` with 7 columns. On mobile viewports, this will either overflow horizontally (if the parent has `overflow-x: auto`, which it does not appear to) or cause layout breakage.
- Recommendation: Either add `overflow-x-auto` on the table wrapper, or switch to a card-based layout on mobile using responsive utilities. A common pattern is to hide less critical columns (Reference, Created date) on small screens.

**Finding 4.1b -- Table rows lack keyboard accessibility**
- Severity: **Major (Accessibility)**
- Table rows use `onClick` to select a ticket but have no `tabIndex`, `role`, or keyboard handler. Keyboard users cannot navigate the ticket list.
- Recommendation: Add `tabIndex={0}` and `onKeyDown` for Enter/Space to each row. Alternatively, make the reference number a link-styled button that handles the selection.

**Finding 4.1c -- Stats fetching makes 5 separate API calls**
- Severity: **Minor (Performance)**
- `fetchStats` makes one API call per status plus one for total, resulting in 5 parallel requests. This is not a UX issue per se, but it could cause a visible stagger in stats rendering.
- Recommendation: Consider a single `/api/chatbots/{id}/tickets/stats` endpoint that returns all counts. This is a backend optimization with UX implications.

**Finding 4.1d -- Status buttons in detail view have no confirmation for "closed"**
- Severity: **Minor**
- Closing a ticket is a significant action (it hides the reply form). There is no confirmation step.
- Recommendation: Either add a confirmation for "closed" specifically, or make it easy to reopen (which it is, since the status buttons are always visible -- this mitigates the issue).

**Finding 4.1e -- "Ctrl+Enter to send" hint is Mac-unfriendly**
- Severity: **Minor**
- The hint says "Ctrl+Enter to send" but the actual handler checks for `e.metaKey || e.ctrlKey`. On Mac, the standard modifier is Cmd. The hint should be context-aware.
- Recommendation: Detect the platform and show "Cmd+Enter" on Mac, "Ctrl+Enter" on Windows/Linux.

### 4.2 Contact Submissions Page

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/contact/page.tsx`

**What works well:**
- Clean list-detail pattern.
- "Check for replies" button is a good manual sync mechanism.
- Reply thread with sender type badges is clear.

**Finding 4.2a -- No status filter tabs (unlike Tickets page)**
- Severity: **Minor (Consistency)**
- The tickets page has status filter tabs (all, open, in_progress, resolved, closed). The contact page has no filtering at all. Contact submissions have statuses (new, read, replied) but no way to filter by them in the list view.
- Recommendation: Add status filter tabs consistent with the tickets page pattern.

**Finding 4.2b -- Table is not responsive (same as tickets)**
- Severity: **Major**
- Same table responsiveness issue as 4.1a.
- Recommendation: Same as 4.1a.

**Finding 4.2c -- Table rows lack keyboard accessibility (same as tickets)**
- Severity: **Major (Accessibility)**
- Same issue as 4.1b.
- Recommendation: Same as 4.1b.

**Finding 4.2d -- No empty state icon (inconsistent with Tickets)**
- Severity: **Minor (Consistency)**
- The tickets empty state has an icon in a rounded background with descriptive text. The contact empty state is a plain text string: "No contact submissions". This feels less polished.
- Recommendation: Match the tickets page empty state pattern with an icon and descriptive text.

**Finding 4.2e -- Detail view back button style inconsistent with Tickets**
- Severity: **Minor (Consistency)**
- Tickets: `<button className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 ...">` with an ArrowLeft icon.
- Contact: `<button className="text-sm text-primary-600 hover:underline">` with an HTML entity arrow.
- Recommendation: Use the same ArrowLeft icon + text pattern from the tickets page.

### 4.3 Articles Page

**File:** `src/app/(authenticated)/dashboard/chatbots/[id]/articles/page.tsx`

**What works well:**
- Clean article list with edit/publish/delete actions.
- Inline editing with a dedicated edit view.
- "Publish All" batch action is convenient.
- Source URL badge and source count in the header provide good context.
- Empty state is well-designed with an icon and helpful guidance text.

**Finding 4.3a -- Delete has no confirmation dialog**
- Severity: **Major**
- Clicking the trash icon immediately deletes the article with no confirmation. This is a destructive action that cannot be undone.
- Recommendation: Add `window.confirm()` at minimum, or preferably a modal confirmation with the article title. An undo toast pattern would also work.

**Finding 4.3b -- Edit view textarea has no focus styles or accessibility labels**
- Severity: **Minor (Accessibility)**
- The body textarea in the edit view has no `focus:outline-none focus:ring-2 focus:ring-primary-500` (inconsistent with textareas in other pages). Labels use `<Label className="text-xs">` but are not associated with inputs via `htmlFor`.
- Recommendation: Add focus styles and label associations.

**Finding 4.3c -- Markdown body editor has no preview**
- Severity: **Enhancement**
- The article body editor is a plain textarea labeled "(Markdown)". There is no side-by-side preview of what the markdown will look like in the widget. Since the `simpleMarkdown` renderer is limited (no tables, code blocks, links), the admin may write markdown that does not render as expected.
- Recommendation: Add a preview tab or split pane showing the rendered output.

**Finding 4.3d -- Article reordering is not possible**
- Severity: **Minor**
- Articles have a `sort_order` field but there is no drag-and-drop or up/down reordering UI. The sort order appears to be set automatically on creation.
- Recommendation: Consider adding reorder controls if the display order matters to admins.

---

## Touchpoint 5: Subnav Integration

**File:** `src/components/chatbots/ChatbotSubNav.tsx`

**What works well:**
- The "More" dropdown pattern keeps the nav clean while exposing many sub-pages.
- Active state detection works correctly for nested paths.
- Dropdown closes on outside click and route change.
- `aria-expanded` and `aria-haspopup` on the dropdown trigger are good accessibility additions.

**Finding 5.1 -- Tickets, Contact, Articles are buried in "More" dropdown**
- Severity: **Minor**
- These three new pages are in the secondary nav (the "More" dropdown), which also contains 7 other items (Agent Console, Analytics, Performance, Leads, Surveys, Sentiment, Issues). This is a 10-item dropdown. Discoverability of the new fallback-related pages depends on the admin knowing to look in "More."
- Recommendation: This is an information architecture consideration. If the fallback system is a key feature, consider grouping Tickets/Contact/Articles under a "Fallback" sub-header within the dropdown, or adding a visual separator between the existing items and the fallback-related items. Alternatively, the settings page's Credit Exhaustion section could include direct links to the relevant management page (e.g., "Manage tickets >>" link next to the tickets mode selector).

**Finding 5.2 -- Dropdown items have no visual grouping**
- Severity: **Minor**
- The 10 items in the secondary nav dropdown are a flat list with no separators or group headers. Items range from analytics features to operational tools to content management. The lack of grouping makes it harder to scan.
- Recommendation: Add `<div>` separators or lightweight section headers to group related items (e.g., "Analytics" group, "Operations" group, "Content" group).

**Finding 5.3 -- Dropdown has no keyboard navigation**
- Severity: **Minor (Accessibility)**
- The dropdown opens/closes via button click and links are focusable, but there is no arrow-key navigation between items (standard for ARIA menu patterns). Tab navigation works since items are links, but the dropdown does not trap focus or close on Escape.
- Recommendation: Add `onKeyDown` handler for Escape to close, and optionally arrow-key navigation for a polished menu experience.

---

## Cross-Cutting Concerns

### CC-1: Inconsistent styling approach between widget and admin

- The widget components use inline styles exclusively (necessary since they render in an iframe/embed context).
- The admin pages use Tailwind CSS classes.
- This is architecturally correct, but the inline style objects in `fallback-views.tsx` are verbose and difficult to maintain. Consider extracting common style objects into a shared constants file.

### CC-2: No loading skeletons in admin pages

- All three admin pages (tickets, contact, articles) show a centered spinner during initial load. This causes layout shift when content appears. Skeleton screens would provide a more polished perceived performance.

### CC-3: No dark mode handling in widget fallback views

- The widget forms use hardcoded light-mode defaults (white backgrounds, dark text). They do respect `widgetConfig` overrides for colors, but the defaults assume a light theme. If the widget is configured with a dark background but specific form colors are not set, the default white inputs on a dark background would look broken.
- Recommendation: Detect the widget background color and apply appropriate defaults, or ensure the customize page forces explicit form color selection.

### CC-4: Pagination is identical across pages but not abstracted

- Both tickets and contact pages have the same pagination UI (Previous / Page X of Y / Next). This should be a shared component to ensure consistency and reduce maintenance.

---

## Prioritized Improvements

### Priority 1 -- Must Fix (Critical)

| # | Issue | Touchpoint | Effort |
|---|-------|-----------|--------|
| 1 | Wire up `creditExhausted` prop for immediate fallback on load | Widget Integration (3.1) | Low |
| 2 | Add `role="alert"` and `aria-live` to error messages in forms | Widget Forms (2.1b, 2.2a) | Low |
| 3 | Add `htmlFor`/`id` label-input associations in widget forms | Widget Forms (2.1a, 2.2a) | Low |
| 4 | Surface purchase errors to the user (not just console.error) | Purchase Credits (2.3a) | Low |
| 5 | Add keyboard support to article cards (`role`, `tabIndex`, `onKeyDown`) | Help Articles (2.4b) | Low |
| 6 | Switch `dangerouslySetInnerHTML` to use DOMPurify sanitization | Help Articles (2.4a) | Medium |
| 7 | Fix popup blocker issue on Stripe checkout (`window.open` in async) | Purchase Credits (2.3c) | Low |

### Priority 2 -- Should Fix (Major)

| # | Issue | Touchpoint | Effort |
|---|-------|-----------|--------|
| 8 | Add "Back to chat" navigation from all fallback success states | Widget Forms (2.1e, 2.2b), Integration (3.3, 3.5) | Medium |
| 9 | Add responsive table handling (overflow or card layout) | Tickets (4.1a), Contact (4.2b) | Medium |
| 10 | Add keyboard accessibility to table rows in admin pages | Tickets (4.1b), Contact (4.2c) | Medium |
| 11 | Change price input from cents to dollars | Settings (1.1a) | Low |
| 12 | Add delete confirmation for articles | Articles (4.3a) | Low |
| 13 | Add delete confirmation or undo for credit packages | Settings (1.1c) | Low |
| 14 | Add per-field validation highlighting in widget forms | Widget Forms (2.1c) | Medium |
| 15 | Add email format validation in custom submit handler | Widget Forms (2.1d) | Low |
| 16 | Move article loading into useEffect | Help Articles (2.4c) | Low |
| 17 | Add explanation of credit value to visitors | Purchase Credits (2.3d) | Low |

### Priority 3 -- Nice to Have (Minor / Enhancement)

| # | Issue | Touchpoint | Effort |
|---|-------|-----------|--------|
| 18 | Add status filter tabs to contact page | Contact (4.2a) | Medium |
| 19 | Standardize empty states across admin pages | Contact (4.2d) | Low |
| 20 | Standardize back button pattern across admin pages | Contact (4.2e) | Low |
| 21 | Add Stripe Price ID format validation | Settings (1.1b) | Low |
| 22 | Add flex-wrap to checkbox layout | Settings (1.1d) | Low |
| 23 | Add loading state to "Generate Articles" button | Settings (1.1f) | Low |
| 24 | Add platform-aware keyboard shortcut hints | Tickets (4.1e) | Low |
| 25 | Add visual grouping to subnav dropdown | Subnav (5.2) | Low |
| 26 | Add Escape key handler to subnav dropdown | Subnav (5.3) | Low |
| 27 | Add dark mode defaults for widget forms | Cross-cutting (CC-3) | Medium |
| 28 | Extract shared pagination component | Cross-cutting (CC-4) | Low |
| 29 | Add auto-reply template preview | Settings (1.1e) | Medium |
| 30 | Add markdown preview to article editor | Articles (4.3c) | Medium |
| 31 | Add screen reader announcement on fallback view transition | Integration (3.4) | Low |
| 32 | Improve buy button loading indicator | Purchase Credits (2.3b) | Low |
| 33 | Constrain textarea max-height in widget | Widget Forms (2.1f) | Low |
| 34 | Add link from settings to management pages | Subnav (5.1) | Low |

---

## Summary of Severity Counts

| Severity | Count |
|----------|-------|
| Critical | 7 |
| Major | 12 |
| Minor | 16 |
| Enhancement | 4 |
| **Total** | **39** |

The system is functionally complete and usable for sighted mouse-users on desktop. The most urgent work is in accessibility (labels, keyboard, screen reader support), the security review of the HTML rendering in articles, and wiring up the `creditExhausted` prop so the widget does not mislead visitors who have already exhausted their credits.
