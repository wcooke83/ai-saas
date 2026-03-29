# Tooltip Audit — Dashboard (All Pages Except Settings)

**Date:** 2026-03-30
**Method:** Playwright browser automation + full source code review
**Pages audited:** 20 pages/sections across the dashboard
**Scope:** All pages except `/dashboard/chatbots/[id]/settings` (audited separately in `tooltip-audit.md`)

Screenshots stored in `/home/wcooke/projects/vocui/tooltip-audit-dashboard-screenshots/`.

---

## Tooltip Implementation Notes

The dashboard uses a custom portal-based `Tooltip` component (`src/components/ui/tooltip.tsx`) with an `InfoTooltip` shorthand. Triggers are wrapped in a `<span>` — not a `<button>` — which means they are not keyboard-accessible on their own. The `InfoTooltip` variant renders a visually styled info-circle icon button inside the span wrapper. All tooltips use `role="tooltip"` and render via `createPortal` to `document.body`.

---

## 1. Dashboard Overview

**Path:** `/dashboard`  
**Screenshot:** `overview.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Credits Remaining | "Credits remaining this billing period. Credits are used when your chatbot answers questions and processes knowledge sources." | Good |
| API Keys | "Number of active API keys. Use these to integrate VocUI into your own applications." | Good |
| Total Generations | "Total chatbot responses and content generated since you created your account." | Good |
| Current Plan card | None | Good — self-explanatory |
| Quick Actions section | None | Good — self-explanatory |
| Recent Activity section | None | Good — self-explanatory |

**Notes:**

- The three stat cards that have tooltips are well chosen. The "Current Plan" card has no tooltip and needs none — the label is unambiguous.
- "Total Generations" tooltip uses "chatbot responses and content generated." The word "content" is slightly vague since AI tools have been removed from the product. Recommend: "Total chatbot responses generated since your account was created."
- "Credits Remaining" tooltip is accurate and complete.
- "API Keys" tooltip is accurate and complete.

**Missing tooltips:**

None required.

---

## 2. Chatbots List

**Path:** `/dashboard/chatbots`  
**Screenshot:** `chatbots-list.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Published/Unpublished badge | None | Good — self-explanatory |
| Agent count indicator | None | Missing — see below |
| Re-processing warning icon | `title="Knowledge base needs re-processing — click to fix"` | Good — adequate via `title` attribute |
| Card action menu (three-dot) | None | Good — standard pattern |

**Missing tooltips:**

- **Agent count indicator**: The chatbot card shows a count of active agents. Users may not know what "agents" refers to here. A tooltip on this counter would help: "Number of human agents currently viewing live conversations for this chatbot." Alternatively, if this is an "online agents" count, clarify it's a realtime presence indicator.

---

## 3. Chatbot Overview

**Path:** `/dashboard/chatbots/[id]`  
**Screenshot:** `chatbot-overview.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Conversations stat | "Total unique chat sessions started by visitors on this chatbot." | Good |
| Messages stat | "Total messages exchanged, including both visitor and bot messages." | Good |
| Satisfaction stat | "Percentage of positive post-chat survey ratings from visitors." | Needs improvement |
| This Month stat | "Total messages sent and received during the current calendar month." | Good |
| Onboarding checklist items | None — checklist items have text descriptions | Good |

**Issues:**

- **Satisfaction**: The tooltip says "Percentage of positive post-chat survey ratings" but the metric only shows data when the post-chat survey is enabled. Users may see 0% or N/A and be confused. Suggest: "Positive survey rating rate. Requires the post-chat survey to be enabled in Settings." This surfaces the dependency.

---

## 4. Chatbot Knowledge

**Path:** `/dashboard/chatbots/[id]/knowledge`  
**Screenshots:** `chatbot-knowledge.png`, `chatbot-knowledge-s1.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| "Re-process All" button | `title="Re-process all sources with the current embedding model so similarity search is consistent"` | Good — descriptive `title` is sufficient for an action button |
| Source error indicator | `title={source.error_message}` | Good — shows actual error message |
| Pin/Unpin button | `title="Pin — your chatbot will always reference this source when answering"` / `title="Unpin…"` | Good — the two states are clearly described |
| Re-process source button | `title="Re-process this source so your chatbot can search it accurately"` | Good |
| Knowledge source type icons (URL, Text, Q&A) | None | Missing — see below |
| Source status indicators (pending, processing, completed, failed) | None | Missing — see below |
| "Generate from Knowledge" button (Articles section) | None | Missing |
| "Auto-Regenerate Schedule" toggle | None | Missing — see below |
| "Extraction Prompt" field | None | Missing — see below |

**Missing tooltips:**

- **Status indicators**: The colored status badges (pending, processing, completed, failed) have no tooltip. Users encountering "pending" for the first time won't know what it means or how long it takes. Suggest a tooltip on each status badge: e.g., "Processing — embedding your content now, typically takes under 30 seconds."
- **Auto-Regenerate Schedule**: This toggle enables automatic regeneration on a schedule. The label alone is insufficient. Suggest tooltip: "Automatically re-scrapes and re-indexes URL sources on a set schedule so your chatbot stays current."
- **Extraction Prompt**: Advanced field. Needs a tooltip explaining when to use it. Suggest: "Override the default extraction prompt for URL scraping. Only change this if the default is producing poor results for specific sites."

---

## 5. Chatbot Analytics

**Path:** `/dashboard/chatbots/[id]/analytics`  
**Screenshots:** `chatbot-analytics.png`, `chatbot-analytics-s1.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Total Conversations card | None | Missing |
| Total Messages card | None | Missing |
| Unique Visitors card | None | Missing |
| Satisfaction Rate card | None | Missing |
| Bar chart bars (Conversations Over Time) | `title="{date}: {value}"` on bar elements | Good — data-point tooltip is appropriate |
| Bar chart bars (Messages Over Time) | `title="{date}: {value}"` on bar elements | Good |
| "Insights" section (Avg Messages/Conv, Daily Avg, etc.) | None | Missing |
| Date range selector (7/30/90 days) | None | Good — self-explanatory |
| Export button | None | Good — self-explanatory |

**Missing tooltips:**

- **Stat cards**: Unlike the chatbot Overview page, the Analytics page stat cards have no tooltips. The same metrics appear on both pages but only the Overview cards have info icons. This is inconsistent. The Analytics page should match — add info icons with the same tooltip text as the Overview page for Conversations, Messages, and Satisfaction Rate.
- **Unique Visitors**: This metric doesn't appear on the Overview page, so it has no tooltip definition anywhere. It needs one: "Number of distinct visitors identified by session cookies during the selected period. The same person on a different device or browser counts as a new visitor."
- **Avg Messages/Conv**: In the Insights section, this metric should have a tooltip: "Average number of messages per conversation during the selected period. Higher values may indicate users are engaging deeply or struggling to get answers."
- **Daily Average**: Tooltip: "Average conversations per day during the selected period."
- **Message Growth**: Tooltip: "Percentage change in messages compared to the previous equivalent period."

---

## 6. Chatbot Live Conversations (Agent Console)

**Path:** `/dashboard/chatbots/[id]/conversations`  
**Screenshot:** `chatbot-conversations.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Conversation list items | None | Good — names/timestamps are self-explanatory |
| Status indicators (active, resolved, etc.) | None | Missing — see below |
| "Check for replies" button | None | Good — label is sufficient |
| Filter/search controls | None | Good |

**Missing tooltips:**

- **Status indicators**: If conversations have status badges (active, waiting, resolved), those need tooltips. Not visible in the screenshot due to loading state, but worth auditing when data is present.

---

## 7. Chatbot Leads

**Path:** `/dashboard/chatbots/[id]/leads`  
**Screenshots:** `chatbot-leads.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Total Leads | "Visitors who submitted the pre-chat form before starting a conversation." | Good |
| Total Conversations | "All chat sessions, including those from visitors who skipped the pre-chat form." | Good |
| Today's Activity | "Combined total of leads and conversations from the last 24 hours." | Needs improvement |
| Conversion Rate | "Percentage of conversations where the visitor also submitted the pre-chat form." | Good |

**Issues:**

- **Today's Activity**: The tooltip says "last 24 hours" but the label says "Today's Activity". These don't align perfectly — "Today's Activity" implies a calendar day (midnight to now), while "last 24 hours" is a rolling window. Clarify which it is: "Leads and conversations since midnight today (your local timezone)." or "Leads and conversations in the last 24 hours." — then match the label to the implementation.

---

## 8. Chatbot Deploy

**Path:** `/dashboard/chatbots/[id]/deploy`  
**Screenshots:** `chatbot-deploy.png`, `chatbot-deploy-s1.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Embed code snippet | None — uses an Info-banner callout above the code | Good — callout text is informative |
| "API Key Required" banner | None — uses inline warning text | Good — self-explanatory inline warning |
| Copy button | None | Good — standard pattern |
| Chatbot Preview iframe | None | Good — labeled clearly |
| Tab navigation (Widget / REST API / Slack / Telegram) | None | Good — self-explanatory |

**Notes:**

The deploy page uses informational banners (amber `Info` icon + text) rather than tooltip triggers. This is appropriate for persistent contextual guidance that users need to read before acting. These are not hover tooltips and are audited as inline callouts.

No tooltip issues found. The inline callout about "API Key Required" for the REST API tab is well-placed and complete.

---

## 9. Chatbot Calendar

**Path:** `/dashboard/chatbots/[id]/calendar`  
**Screenshots:** `chatbot-calendar.png`, `chatbot-calendar-s1.png`, `chatbot-calendar-s2.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Active booking count badge | "Number of confirmed and pending bookings" | Good |
| "Test Connection" button | "Test the connection to Easy!Appointments" | Good |
| "Retry" button | "Retry connecting to Easy!Appointments" | Good |
| Active/inactive toggle | "Calendar is accepting bookings" / "Calendar is not accepting bookings" | Good |
| "Remove connection" button | "Remove the calendar connection. Existing bookings are not affected." | Good |
| "Verify Connection" button | "Verify the connection to Easy!Appointments before saving" | Good |
| "Save" button | "Save settings and connect to Easy!Appointments" / "Save all calendar settings" | Good |
| "Apply to Mon-Fri" button | "Apply this day's hours to Monday through Friday" | Good |
| Day toggle (enable/disable) | "Toggle whether bookings are available on this day" | Good |
| "Edit global business hours" | "Edit global business hours" | Redundant — tooltip repeats the button label exactly |
| "Add scoped business hours" | "Add business hours for specific services or providers" | Good |
| "Edit business hours" (row) | "Edit these business hours" | Redundant — too generic |
| "Remove business hours" (row) | "Remove these business hours" | Redundant — too generic |
| "Add blocked date (global)" | "Add a blocked date for all services and providers" | Good |
| "Remove blocked date" | "Remove this blocked date" | Redundant — the button's destructive intent is already visually communicated |
| "Add scoped blocked date" | "Add a blocked date for specific services or providers" | Good |
| "Add date override" | "Add a date override" | Redundant — same as label |
| "Edit date override" | "Edit this date override" | Redundant |
| "Remove date override" | "Remove this date override" | Redundant |
| Service duration badge | "Appointment duration" | Good |
| Service price badge | "Default price for this service" | Good |
| "Edit service" | "Edit service" | Redundant |
| "Delete service" | "Delete service" | Redundant |
| "Add service" | "Add a new bookable service" | Good — adds value over just "Add" |
| "Add provider" | "Add a new staff member who can accept bookings" | Good |
| "Edit provider" | "Edit provider" | Redundant |
| "Delete provider" | "Delete provider" | Redundant |
| Booking history search | "Search bookings by customer name or email address" | Good — clarifies searchable fields |

**Issues:**

- **Redundant tooltips on CRUD buttons**: 8+ tooltips simply repeat the button label ("Edit service", "Delete provider", etc.). These add no value and create tooltip fatigue. Icons with meaningful action tooltips should explain the *consequence* or *context*, not just re-state the label. Remove or improve these.
  - "Edit service" → remove (label + edit icon is sufficient)
  - "Delete service" → change to "Permanently delete this service. Existing bookings are not affected." (adds consequence)
  - "Edit provider" → remove
  - "Delete provider" → change to "Remove this staff member from the booking calendar."
  - "Edit global business hours" → remove
  - "Edit these business hours" → remove
  - "Remove these business hours" → change to "Remove this business hours rule. The global schedule applies instead."
  - "Edit this date override" → remove  
  - "Remove this date override" → remove
  - "Add date override" → change to "Set custom hours for a specific date, overriding regular business hours."

**Missing tooltips:**

- **Service list in form dropdowns**: When selecting a service or provider scope for business hours or blocked dates, users may not understand what "scoped" means. A brief tooltip on the scope dropdown label: "Apply these hours/dates only to the selected service or provider. Leave empty to apply globally."

---

## 10. Chatbot Contact Submissions

**Path:** `/dashboard/chatbots/[id]/contact`  
**Screenshot:** `chatbot-contact.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| All fields visible | None | None required |
| "Check for replies" button | None | Good — self-explanatory |

**Notes:**

No tooltips present. The page shows contact form submissions. Column headers (Name, Email, Message, Date) are self-explanatory. No tooltip issues.

---

## 11. Chatbot Customize

**Path:** `/dashboard/chatbots/[id]/customize`  
**Screenshot:** `chatbot-customize.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Font Family | "Google Fonts are loaded automatically. System fonts load instantly with no network request." | Good |
| Container Border Radius | "Rounds the corners of the entire chat widget container." | Good |
| Button Border Radius | "Controls how round the send button appears. 50% creates a perfect circle." | Good |
| Show "Powered by" branding | "Displays a small 'Powered by VocUI' link at the bottom of the widget." | Needs improvement |
| Custom CSS | "Override any widget style with CSS. Use .chat-widget-container as the root selector." | Good |
| Auto Open | "Automatically opens the chat widget after the specified delay. Only triggers once per visitor session." | Good |
| Sound Notifications | "Plays an audio chime when the bot sends a new message. Requires browser audio permission." | Good |
| Button Size | "The size of the floating chat button that visitors click to open the widget." | Good |
| Offset X | "Horizontal distance from the edge of the screen to the widget button." | Good |
| Offset Y | "Vertical distance from the edge of the screen to the widget button." | Good |
| Color picker fields (primary, text, background) | None | Missing — see below |
| Avatar/logo upload | None | Good — self-explanatory |
| Chatbot Name (in customize) | None | Good — same as general settings |

**Issues:**

- **"Powered by" branding tooltip**: The tooltip describes *what* the feature does but omits the key UX detail: this option is disabled on free plans. The tooltip should say: "Displays a 'Powered by VocUI' link at the bottom of the widget. Only removable on paid plans." This prevents confusion when the toggle is grayed out.

**Missing tooltips:**

- **Color fields**: Primary color, text color, and background color pickers have no tooltips. New users may not know which element each color controls in the rendered widget. Tooltips like "The main accent color used for the chat bubble and send button" and "Background color of the chat window" would help.
- **Theme presets (if present)**: If theme preset buttons exist without labels, they need tooltip labels.

---

## 12. Chatbot Sentiment

**Path:** `/dashboard/chatbots/[id]/sentiment`  
**Screenshot:** `chatbot-sentiment.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Average Sentiment Score | "Average sentiment score from 1 (very negative) to 5 (very positive), calculated by AI analysis of each conversation." | Good |
| Positive % | "Percentage of conversations rated as positive or very positive sentiment." | Good |
| Neutral % | "Percentage of conversations with neither clearly positive nor negative sentiment." | Good |
| Negative % | "Percentage of conversations rated as negative or very negative sentiment." | Good |
| Sentiment column (in table) | "AI-analyzed sentiment score (1-5) and label for each conversation." | Good |
| Loyalty Score column | "Loyalty score (1-5) based on repeat visits and overall satisfaction across sessions." | Good |
| Trend column | "Visitor's sentiment direction over time: improving, declining, or stable." | Good |

**Notes:**

Well-tooltipped page. All numeric metrics and abstract scores have clear explanations. The loyalty score tooltip is particularly good as it clarifies the 1–5 scale.

**Missing tooltips:**

- **"AI analysis" callout / Analyze button**: If there's a button to trigger AI analysis, it should have a tooltip explaining the process: "Analyzes all unprocessed conversations using AI. Uses credits proportional to conversation count." This surfaces the credit cost implication.

---

## 13. Chatbot Surveys

**Path:** `/dashboard/chatbots/[id]/surveys`  
**Screenshot:** `chatbot-surveys.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Total Responses | "Number of completed post-chat survey submissions from visitors." | Good |
| Average Rating | "Mean star rating (1-5) across all survey responses that include a rating question." | Good |
| Recent (7 days) | "Survey responses received in the last 7 days, regardless of the date filter above." | Good |
| Survey Status | "Whether the post-chat survey is currently enabled in your chatbot settings." | Good |
| Rating distribution chart | "Shows how many visitors gave each star rating. Taller bars indicate more common ratings." | Good |

**Notes:**

All metric cards on the surveys page are well-tooltipped. The chart description is helpful for users unfamiliar with bar charts in this context.

**Missing tooltips:**

- **Date range filter**: The date filter selector has no tooltip. Minor: "Filter responses by when they were submitted." Not strictly needed but consistent with other pages.

---

## 14. Chatbot Issues

**Path:** `/dashboard/chatbots/[id]/issues`  
**Screenshot:** `chatbot-issues.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| All visible fields | None found | N/A — page loaded in loading state |

Source code analysis:

```
grep result: no Tooltip or InfoTooltip usage in issues/page.tsx
```

**Notes:**

No tooltips in source. The Issues page appears to be a list of flagged conversations or escalations. Column headers (if present) may benefit from tooltips depending on complexity. Since the page loaded in a loading state and has no tooltip code, there are likely no tooltip triggers here. Full audit pending a loaded screenshot.

**Missing tooltips (assumed):**

- **Issue severity/priority levels**: If the page shows severity indicators, those need tooltips explaining the scale.
- **Resolution status**: Any status badge beyond simple "Open/Closed" should be explained.

---

## 15. Chatbot Tickets

**Path:** `/dashboard/chatbots/[id]/tickets`  
**Screenshot:** `chatbot-tickets.png`

Same situation as Issues — page loaded in loading state, no tooltip code in source.

---

## 16. Chatbot Articles

**Path:** `/dashboard/chatbots/[id]/articles`  
**Screenshot:** `chatbot-articles.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Publish/Unpublish toggle | `title={article.published ? 'Unpublish' : 'Publish'}` | Redundant — the button already shows the action state visually |
| All other fields | None | N/A |

**Missing tooltips:**

- **"What are articles?"**: This page has no explanation of the relationship between help articles and the chatbot's knowledge. A page-level info tooltip or callout would help first-time users understand that articles are both displayed as browsable content AND added to the chatbot's knowledge base. Suggest: "Help articles are added to your chatbot's knowledge base automatically. Visitors can also browse them directly from the widget."

---

## 17. API Keys

**Path:** `/dashboard/api-keys`  
**Screenshot:** `api-keys.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| "Your API Keys" section | None | Good — section heading is clear |
| "Using Your API Key" collapsible | None — expands to show documentation | Good |
| Key prefix (sk-...) | None | Missing — see below |
| Revoke button | None | Missing — see below |

**Missing tooltips:**

- **API key prefix display**: When a key is created, only the prefix is shown (e.g., `sk-abc...`). A tooltip on the truncated key value would clarify: "Only the first few characters are shown for security. Copy the full key when creating it — it cannot be retrieved later." This is a critical information gap.
- **Revoke button**: Should have a tooltip: "Permanently invalidates this key. Any application using it will immediately lose access." The word "revoke" may not be immediately clear to all users.

---

## 18. Billing

**Path:** `/dashboard/billing`  
**Screenshots:** `billing.png`, `billing-s1.png`, `billing-s2.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| All visible fields | None (tooltips from AutoTopupSettings/CreditPurchase components also had none in source) | N/A |
| Invoice "View invoice" link | `title="View invoice"` | Redundant |
| Invoice "Download PDF" link | `title="Download PDF"` | Redundant |
| AppSumo Info banner | None — uses inline Info icon + banner text | Good |

**Missing tooltips:**

- **"Auto top-up" toggle**: The auto top-up feature (in `AutoTopupSettings.tsx`) has no tooltip explaining when it triggers. Suggest adding to the toggle: "Automatically purchases credits when your balance falls below the threshold, so your chatbot never goes offline due to insufficient credits."
- **"Threshold" field (in auto top-up)**: Needs a tooltip: "Your balance must fall below this level to trigger an automatic top-up. Set it high enough to avoid gaps in service."
- **"Top-up amount" field**: "The number of credits purchased each time auto top-up triggers."
- **Credit cost per message**: On the credit purchase cards, there's no tooltip explaining how many credits are used per message. This is important context for purchase decisions. Suggest adding: "Each chatbot response typically uses 1-3 credits depending on response length and model."

---

## 19. Account Settings

**Path:** `/dashboard/settings`  
**Screenshot:** `account-settings.png`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Email field | "Your email is used for login and notifications. Contact support to change it." | Good |
| Credits/month (in plan feature list) | "Credits are consumed per AI message. Usage varies by model and response length." | Good |
| API keys limit (in plan feature list) | "API keys allow external applications to access your chatbots programmatically." | Good |
| Two-Factor Authentication | "Requires a 6-digit code from an authenticator app each time you sign in." | Good |
| Product updates notification | "Release notes, new features, and platform changes — typically 1-2 emails per month." | Good |
| Usage alerts notification | "You'll receive alerts at 80% and 95% of your monthly credit limit, plus when credits are fully exhausted." | Good |
| Marketing emails notification | "Tips, best practices, and occasional promotional offers. You can unsubscribe at any time." | Good |
| Delete Account | "This permanently removes all your chatbots, knowledge sources, conversations, and billing data. This cannot be undone." | Good |
| Display Name field | None | Good — self-explanatory |
| Password change | None | Good — self-explanatory |

**Notes:**

Account settings has excellent tooltip coverage. The notification preference tooltips are particularly well done, giving concrete details (frequency, trigger thresholds) rather than vague descriptions.

**Missing tooltips:**

- **"Avatar/Profile Picture"**: If there's a profile picture upload, no tooltip explains where it's used. Minor: "Displayed in the dashboard sidebar and agent console."

---

## 20. Usage

**Path:** `/dashboard/usage`  
**Screenshot:** `usage.png`

No tooltips found in source code for this page.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Credits Used stat | None | Missing |
| Credits Remaining stat | None | Missing (inconsistent with dashboard Overview) |
| API Requests stat | None | Missing |
| Tokens Used stat | None | Missing |
| Usage chart | None | Missing |
| Generation log entries | None | Good — individual entries are self-explanatory |
| API logs tab | None | Good |
| Export button | None | Good — self-explanatory |

**Missing tooltips:**

- **Credits Used / Credits Remaining**: These same metrics have tooltips on the dashboard Overview. The Usage page shows the same data with no tooltips — inconsistency. Add the same info-icon tooltips here.
- **Tokens Used**: This is an advanced metric. Needs a tooltip: "Total number of tokens processed by AI models in your account. Tokens are units of text — roughly 1 token per word. Credit usage is based on tokens."
- **"API Requests"**: Tooltip: "Total API calls made using your API keys. Does not include widget chat traffic."
- **Usage chart period selector**: No tooltip needed — "7 days / 14 days / 30 days" is clear.
- **"Last Month" comparison**: If shown, tooltip: "Comparison to the equivalent period last month."

---

## 21. New Chatbot (Create)

**Path:** `/dashboard/chatbots/new`

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Template cards | Tooltip shows prompt preview on hover | Good — shows full prompt text so users can make an informed choice |
| Chatbot Name field | None | Missing |
| Chatbot Instructions field | None (only character count) | Missing — same issue noted in settings audit |
| "Get Started" info callout | Inline Info icon + explanatory text | Good |

**Missing tooltips:**

- **Chatbot Name**: Same as flagged in settings audit — no explanation of where the name appears. Suggest: "Used as the chatbot's display name in the widget header and your dashboard."

---

## Summary and Patterns

### Overall Coverage Score: 6/10

The dashboard has inconsistent tooltip coverage across its pages.

### What Works Well

1. **Chatbot-level stat cards** (Overview, Leads): All numeric/metric cards have info icon tooltips with accurate, one-sentence explanations.
2. **Account Settings**: Comprehensive coverage with especially strong notification preference tooltips.
3. **Calendar page**: Most interactive controls have meaningful tooltips explaining purpose and consequences.
4. **Sentiment and Surveys**: All data columns and metrics are well-explained.
5. **Customize page**: Good coverage of non-obvious settings like offsets and border-radius percentages.

### Recurring Problems

**1. Metric inconsistency across pages**
The same metric (Credits Remaining, Conversations, Satisfaction Rate) has a tooltip on one page but not on others. Usage page has zero tooltips despite showing the same credits data as the dashboard Overview. Fix: ensure any metric that has a tooltip on one page has the same tooltip everywhere it appears.

**2. Redundant action tooltips on the Calendar page**
8+ buttons have tooltips that simply restate the button label ("Edit service" → tooltip: "Edit service"). These contribute noise and desensitize users to useful tooltips. Tooltips on action buttons should explain consequence or add context — not re-state the label. Remove or rewrite all label-repeating tooltips.

**3. Missing tooltips on destructive actions**
Revoke (API Keys) and Delete (Calendar providers/services) have no tooltips or inadequate ones. Destructive actions always benefit from a tooltip that explains the consequence: "This cannot be undone" or "Existing bookings are not affected."

**4. Analytics page has no stat card tooltips**
The chatbot Analytics page shows Total Conversations, Total Messages, Unique Visitors, and Satisfaction Rate but has no info icons on any of these. The chatbot Overview page has info icons on the same metrics. This inconsistency is confusing and should be resolved by adding the same tooltips to both pages.

**5. Billing page has critical missing context**
Auto top-up threshold and trigger conditions have no tooltips. Users setting up auto top-up don't know when it fires or how much it will charge. This is the page where tooltip gaps have real financial consequences.

**6. Accessibility gap in tooltip trigger mechanism**
The `Tooltip` component wraps its trigger in a `<span>` that responds to `onMouseEnter`/`onFocus`. The `InfoTooltip` variant renders a `<button>` inside this span. However, tooltips triggered by the outer `<span>` (when wrapped around `<Info>` icons rather than `InfoTooltip`) are not keyboard-accessible — the icon is not focusable. Use `InfoTooltip` consistently everywhere an info icon triggers a tooltip, or ensure the trigger element is always a focusable element.

### Recommended Priority Fixes

**High priority:**
1. Add tooltips to Analytics page stat cards (consistency with Overview page)
2. Fix auto top-up tooltip gaps on Billing page (financial consequences)
3. Add tooltip to API key revoke button (destructive action)
4. Remove or rewrite 8+ redundant "Edit X" / "Delete X" calendar tooltips

**Medium priority:**
5. Add Unique Visitors tooltip to Analytics page
6. Add credit-per-message context to Billing purchase cards
7. Clarify "Today's Activity" tooltip on Leads page (24-hour vs. calendar day)
8. Add "Powered by" branding tooltip with plan restriction note on Customize page
9. Add color field tooltips on Customize page
10. Fix "Total Generations" tooltip to remove reference to "content" (tools removed from product)

**Low priority:**
11. Add tooltips to Usage page stat cards
12. Add tooltip explaining the articles-to-knowledge relationship on Articles page
13. Add status badge tooltips to Knowledge source items
14. Add Chatbot Name tooltip on New Chatbot page

