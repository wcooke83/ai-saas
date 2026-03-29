# Tooltip Audit — Chatbot Settings Page

**Date:** 2026-03-29  
**Page:** `/dashboard/chatbots/[id]/settings`  
**Method:** Playwright automation + source code review across all 12 tabs  

Screenshots are stored in `/home/wcooke/projects/vocui/tooltip-audit-screenshots/`.

---

## Tab 1 — General

**Screenshot:** `01-general.png`

No tooltip triggers found on this tab.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Chatbot Name | None | Missing |
| Language | None (has helper text below: "Controls both the widget UI text and the language the AI responds in") | Good — helper text is sufficient |
| Description | None | Good — self-explanatory |
| Logo | None | Good — self-explanatory |
| Welcome Message | None (has helper text: "The first message visitors see when they open the chat. Use {{name}}, {{email}}, or {{company_name}} to personalise.") | Good — helper text is sufficient |
| Input Placeholder Text | None (has helper text: "Placeholder text shown in the message input field") | Redundant helper text — see below |
| Allowed Origins | None (has helper text) | Missing |

**Missing tooltips:**

- **Chatbot Name**: No explanation of how the name is used (it appears in the browser tab, widget header, and dashboard). A tooltip like "Displayed in the chat widget header and used to identify this chatbot in your dashboard" would help.
- **Allowed Origins**: The helper text says "Comma-separated list of origins allowed to use the chat widget. Leave empty to allow all origins." This is good information but should be a tooltip on the label, not just hint text. Additionally the security implication (leaving empty is permissive) deserves surfacing. Suggested: "Restricts which websites can embed this chatbot. Enter comma-separated origins, e.g. https://yoursite.com. Leave empty to allow any website — not recommended for production."
- **Input Placeholder Text**: The helper text says "Placeholder text shown in the message input field" which is purely redundant with the label. This helper text should be removed or replaced with something useful.

---

## Tab 2 — Chatbot Instructions

**Screenshot:** `02-prompt.png`

No tooltip triggers found on this tab.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Quick Templates | None — templates have hover previews showing the raw prompt | Good — hover previews are effective |
| Chatbot Instructions (textarea) | None (has char count + "Be specific about tone, capabilities, and limitations.") | Missing |
| Enable Prompt Injection Protection | None (has description text below the checkbox) | Good — description is sufficient |

**Missing tooltips:**

- **Chatbot Instructions**: A tooltip on the label would help new users understand what this field does and why it matters. The label is "Chatbot Instructions *" but there is no tooltip icon — only a character count and a generic hint at the bottom. Suggested: "The system prompt defines your chatbot's persona, knowledge boundaries, and response style. It is never shown to visitors. Be specific — vague instructions lead to inconsistent responses."

---

## Tab 3 — AI Model

**Screenshot:** `03-ai-model.png`

Three tooltips found, all on slider controls.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Temperature | "Controls randomness in AI responses. Use low values (0-0.3) for factual Q&A, medium (0.5-0.7) for general chat, and high (1.0+) for creative or brainstorming use cases." | Good |
| Max Response Length | "Caps how long each AI reply can be. 1 token is roughly 1 word. Short limits (100-500) keep replies concise; longer limits (2000+) allow detailed explanations. Does not affect quality, only length." | Good |
| Live Fetch Threshold | "Sets how closely a question must match your saved content before the chatbot skips fetching live URL data. Lower = fewer live fetches, faster responses. Higher = more live fetches, potentially fresher answers." | Needs improvement |

**Notes:**

- **Temperature**: Accurate and well-structured. The use cases help users make practical decisions. Length is appropriate.
- **Max Response Length**: Accurate. The clarification "Does not affect quality, only length" is valuable and prevents misunderstanding.
- **Live Fetch Threshold**: The label "Live Fetch Threshold" is jargon that users unfamiliar with the RAG architecture will not understand. The tooltip explains what the slider does but does not explain what "live fetch" means — it assumes the user understands that knowledge sources can include URLs that are fetched in real time. Suggested rewrite: "When a visitor's question closely matches saved knowledge, the chatbot uses that directly. When the match is weak, it may fetch the live URL to get fresher content. A higher threshold means the bot is less likely to use the cached version and more likely to re-fetch — useful if your source URLs update frequently."
- **Missing**: The AI Model info box ("The AI model is configured globally...") has no tooltip, but it's already an explanatory callout, so no tooltip is needed there.

---

## Tab 4 — Memory

**Screenshot:** `04-memory.png`

One tooltip found, on the Session Duration dropdown. The memory toggle itself has no tooltip.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Conversation Memory toggle | None (has card description: "Remember returning visitors and personalise conversations based on past interactions") | Good — description is adequate |
| Memory Retention (days slider) | None (has helper text: "Visitor context is remembered for X days") | Missing |
| Session Duration | "How long a chat session stays active. When a session expires, the visitor starts a new conversation. Previous conversations still appear as history if memory is enabled." | Good |

**Missing tooltips:**

- **Memory Retention (days)**: This slider is visible only when memory is enabled. The helper text dynamically shows the current value but does not explain the implications. Users may not understand the relationship between memory retention and session duration, or what "memory" actually stores. Suggested: "How long the chatbot remembers facts about a returning visitor, such as their name, preferences, or past issues. After this period, the visitor starts fresh. Requires memory to be enabled."
- **Session Duration**: The existing tooltip is accurate and helpful. However, it's placed in an always-visible section even when memory is disabled — the note "Previous conversations still appear as history if memory is enabled" is conditional information that may confuse users who have memory turned off. Consider simplifying to: "How long a conversation window stays open. When it expires, a new session begins. Does not delete conversation history."

---

## Tab 5 — Pre-Chat Form

**Screenshot:** `05-pre-chat.png`

Seven tooltip triggers found (three fields rendered with tooltips, repeated for each form field row).

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Pre-Chat Form toggle | None | Good — self-explanatory |
| Form Title | None | Good — self-explanatory |
| Form Description | "Subtext displayed below the title. Explain why you're collecting this information to improve completion rates." | Needs improvement |
| Field Type (per field) | "Text: single line input. Email: validated email field. Phone: phone number. Select: dropdown with predefined options. Textarea: multi-line free text." | Good |
| Label (per field) | None | Good — self-explanatory |
| Placeholder (per field) | None | Good — self-explanatory |
| Required (per field) | "When checked, the visitor cannot start chatting without filling in this field." | Redundant |
| Submit Button Text | None | Good — self-explanatory |

**Notes:**

- **Form Description tooltip**: The current text mixes instruction ("Subtext displayed below the title") with a persuasive tip ("Explain why you're collecting this information..."). The second part is genuinely useful but feels like a marketing hint rather than a clarification. Suggested: "Optional subtext shown below the form title. Use it to explain why you're collecting this information — visitors are more likely to complete forms when they understand the purpose."
- **Required checkbox tooltip**: "When checked, the visitor cannot start chatting without filling in this field" restates what the "Required" label and checkbox already communicate. This is a textbook redundant tooltip. Remove it or replace with something that isn't obvious: "Required fields must be completed before the visitor can open the chat. Use sparingly — too many required fields reduce form completion rates."
- **Missing**: There is no tooltip on the Form Title field, but that is fine since it's self-explanatory. There is also no explanation for how form data is used by the AI — the "How it works" callout covers this adequately.

---

## Tab 6 — Post-Chat Survey

**Screenshot:** `06-post-chat.png`

No tooltip triggers found.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Post-Chat Survey toggle | None | Good |
| Survey Title | None | Good — self-explanatory |
| Survey Description | None | Missing |
| Questions > Question Type | None | Missing |
| Questions > Required checkbox | None | Missing |
| Questions > Min/Max Rating | None | Missing |

**Missing tooltips:**

- **Survey Description**: The Pre-Chat Form tab has a tooltip for its Form Description field, but the Post-Chat Survey's Survey Description field does not. These should be consistent. Suggested: "Optional subtext shown below the survey title. Use it to encourage participation, e.g. 'This takes less than 30 seconds.'"
- **Question Type**: The Pre-Chat Form has a tooltip explaining each field type, but the Post-Chat Survey's question type selector has none. Suggested: "Star Rating: 1–5 (or custom range) star selector. Text: open-ended text input. Single Choice: one answer from a list. Multiple Choice: multiple answers from a list."
- **Required checkbox on survey questions**: Inconsistent with the Pre-Chat Form which has a tooltip here (albeit a redundant one). For parity, add a note about how required survey questions affect the experience.
- **Min/Max Rating**: These number inputs for star rating range have no labels that explain their purpose. A tooltip on Min Rating would help: "The lowest star value the visitor can select. Usually 1." Similarly for Max Rating.

The absence of any tooltips on this tab is a noticeable gap, especially since the Pre-Chat Form tab (a similar editor) has several.

---

## Tab 7 — File Uploads

**Screenshot:** `07-file-uploads.png`

No tooltip triggers found.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| File Uploads toggle | None | Good |
| Allowed File Types (checkboxes) | None | Good — each type shows extension list below |
| Maximum File Size | None (has helper text: "Files larger than X MB will be rejected") | Good |
| Files Per Message | None (has helper text: "Visitors can attach up to X file(s) per message") | Good |

**Notes:**

This tab is self-explanatory and the helper text covers the necessary context. No tooltips are strictly needed, but a tooltip on the "Allowed File Types" section header could note that images are AI-analysed (vision capability) while other file types are stored as downloadable links. The "How it works" callout already covers this, so it is acceptable as-is.

No significant issues.

---

## Tab 8 — Proactive

**Screenshot:** `08-proactive.png`

Four tooltip triggers found (all within an expanded rule row).

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Proactive Messages toggle | None | Good |
| Trigger Type selector | None | Missing |
| Display Mode selector | None | Missing |
| Bubble Position | "Where the bubble preview appears relative to the chat button" | Needs improvement |
| Close on navigation checkbox | None (has description below) | Good |
| Trigger config fields (seconds, percent, etc.) | None | Missing |
| Delay (ms) | "Wait this many milliseconds after the trigger fires before showing the message." | Good |
| Max Shows | "Maximum times this rule can fire per visitor session. 0 = unlimited." | Good |
| Priority | "Lower number = higher priority. When multiple rules fire, higher-priority rules are evaluated first." | Good |

**Missing and needs-improvement tooltips:**

- **Trigger Type**: The dropdown shows labels like "Page URL", "Time on Page", "Scroll Depth" etc. Each has a short description below the dropdown via the `TRIGGER_TYPE_OPTIONS` array, but this description is only visible once the type is already selected. A tooltip on the "Trigger Type" label would help users understand the options before selecting: "Determines what visitor behaviour triggers this message. Each type exposes different configuration fields below."
- **Display Mode**: No tooltip. The two options ("Bubble preview" and "Auto-open widget") are not obvious. Suggested: "Bubble preview: shows a speech bubble next to the chat button without opening the widget. Auto-open widget: opens the full chat widget automatically."
- **Bubble Position**: The current tooltip "Where the bubble preview appears relative to the chat button" is accurate but minimal. Users may not know what "relative to the chat button" means spatially without a visual. Suggested: "Controls which corner of the chat button the speech bubble appears next to. 'Bottom Left' is the most common choice for a button in the bottom-right corner of the screen."
- **Trigger config fields** (Seconds on page, Scroll depth %, etc.): None of the trigger-specific input fields have tooltips. For fields like "Seconds on page" this is fine since it's self-explanatory, but "Number of page views" could use clarification: does it count views in the current session, or ever? The label alone does not tell users this.

---

## Tab 9 — Transcripts

**Screenshot:** `09-transcripts.png`

No tooltip triggers found.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Email Transcripts toggle | None | Good |
| Header icon toggle | None (has description below) | Good |
| In-chat prompt toggle | None (has description below) | Good |
| Email Collection Method (radio) | None (each option has description) | Good |

**Notes:**

This tab has strong inline descriptions for every option. No tooltips are needed, but the "In-chat prompt" description mentions it appears "after 2 minutes of inactivity once the visitor has sent at least 2 messages" — this is detailed enough that a tooltip is not needed.

No issues.

---

## Tab 10 — Feedback & Reports

**Screenshot:** `10-feedback.png`

No tooltip triggers found.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Feedback Follow-Up toggle | None | Good — card description explains it |
| Issue Reporting toggle | None | Good — card description explains it |

**Notes:**

Both cards on this tab have comprehensive `CardDescription` elements and, when enabled, informational callouts that explain how the feature works. No tooltips are needed.

No issues.

---

## Tab 11 — Live Handoff

**Screenshot:** `11-handoff.png`

Four tooltips found, all on the Telegram configuration sub-section.

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Live Handoff toggle | None | Good — card description explains it |
| Handoff Inactivity Timeout | "If the visitor goes quiet after requesting a handoff, the handoff closes and the AI takes over again. Set to 0 to keep handoffs open until an agent resolves them." | Good |
| Require Agent Online toggle | None (has description below) | Good |
| Agent Console row | None | Good — self-explanatory |
| Telegram Notifications toggle | None | Good — description explains it |
| Telegram: Bot Token | "The API token for your Telegram bot. Create one by messaging @BotFather on Telegram and using the /newbot command. It looks like 123456:ABC-DEF..." | Good |
| Telegram: Support Group Chat ID | "The numeric ID of the Telegram group where handoff notifications are sent. To find it: add @userinfobot to your group and it will reply with the chat ID. Group IDs usually start with -100." | Good |
| Telegram: Webhook Secret | "An optional secret token used to verify that incoming webhook requests genuinely come from Telegram. If set, Telegram includes it in a header that the server validates. Recommended for production." | Needs improvement |

**Notes:**

- **Handoff Inactivity Timeout**: Well-written. The edge case (set to 0 to keep open indefinitely) is called out explicitly.
- **Bot Token**: Includes a concrete format example ("123456:ABC-DEF...") which is helpful for users who don't know what a bot token looks like.
- **Support Group Chat ID**: The negative number detail ("-100") is genuinely useful and prevents a common error.
- **Webhook Secret**: The tooltip is technically correct but uses developer jargon ("a header that the server validates"). For a non-technical user this is unclear. The instruction "Recommended for production" is vague — it doesn't explain how to generate a secret or what length/format is expected. Suggested: "An optional string you choose that Telegram includes in every webhook request. Your server checks it to confirm the message came from Telegram, not an attacker. Use any random string — at least 20 characters is recommended."

---

## Tab 12 — Credit Exhaustion

**Screenshot:** `12-fallback.png`

Twelve tooltip triggers found — the most of any tab. All are `InfoTooltip` components (small circular info buttons next to field labels).

### Fallback Mode Selection (4 tooltips)

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Open Tickets | "Visitors can submit a support ticket with their name, email, and message. You receive a notification and can follow up manually." | Good |
| Simple Contact Form | "A lightweight contact form — no ticket tracking, just a direct message to your notification email." | Good |
| Auto-Purchase Additional Credits | "When credits hit zero, a credit package is charged automatically to your saved payment method so conversations continue without interruption." | Good |
| Help Articles | "Visitors can browse and search content from your knowledge base. No AI processing is needed, so it works even with zero credits." | Good |

### Ticket Form Settings (8 tooltips)

| Field | Current Tooltip | Verdict |
|-------|----------------|---------|
| Form Title | "The heading shown at the top of the ticket form. Defaults to something like 'Submit a Support Request'." | Needs improvement |
| Form Description | "Optional subtext shown below the form title. Use it to set expectations, e.g. 'We'll get back to you within 24 hours.'" | Good |
| Phone Field toggle | "Adds an optional phone number field to the ticket form." | Redundant |
| Subject Field toggle | "Adds a short subject line field, useful if you want to triage tickets by topic." | Good |
| Priority Dropdown toggle | "Lets visitors self-select a priority level (Low, Medium, High). Included in the notification email." | Good |
| Notification Email | "Where ticket submission emails are sent. Defaults to your account email — changing this only affects where notifications go, not your account itself." | Good |
| Ticket Reference Prefix | "A short prefix prepended to each ticket ID, e.g. 'TKT-1042'. Useful if you manage tickets across multiple chatbots." | Good |
| Auto Reply Email Template | "Sent to the visitor immediately after they submit a ticket. Use {{name}}, {{ticketId}}, and {{subject}} to personalise the message." | Good |

**Notes:**

- **Open Tickets / Contact Form**: These two mode tooltips are accurate but near-identical in structure. The distinction between them (ticket tracking vs. no tracking) is clear.
- **Form Title tooltip**: "Defaults to something like 'Submit a Support Request'" is vague. Saying "something like" implies uncertainty. Suggested: "The heading shown at the top of the ticket form. If left blank, defaults to 'Submit a Support Request'."
- **Phone Field toggle**: "Adds an optional phone number field to the ticket form" states only what is obvious from the checkbox label "Phone Field". There is zero additional information. This is a redundant tooltip. Remove it or add context about what happens with the phone number: "Adds a phone number field to the ticket form. The number is included in the notification email but is not required unless you mark it as required."
- **Notification Email**: Well-written. The clarification that changing this email "only affects where notifications go, not your account itself" prevents a very common user worry.
- **Auto Reply Email Template**: The `{{name}}`, `{{ticketId}}`, `{{subject}}` variables are listed but the tooltip does not mention which are required vs. optional. Fine as-is since the template textarea itself can show a pre-filled example.

---

## Summary: Overall Patterns and Recommendations

### What is working well

1. **AI Model tab** is the strongest — all three slider controls have tooltips that explain the behaviour, give practical ranges, and correct common misconceptions (e.g. max tokens does not affect quality).
2. **Live Handoff / Telegram** tooltips are genuinely helpful — they give step-by-step setup hints and format examples that would otherwise require documentation.
3. **Credit Exhaustion** tab has thorough InfoTooltip coverage across all configurable fields. The mode-selection tooltips make it easy to compare options without clicking each one.
4. **Transcripts and Feedback** tabs rely entirely on inline descriptions rather than tooltips, and that works — the descriptions are clear and contextual enough that separate tooltip icons would add visual noise.

### Patterns that need addressing

1. **Inconsistency between similar editors**: The Pre-Chat Form has tooltips on Field Type and Required. The Post-Chat Survey has an identical question editor with no tooltips at all. Users who switch between tabs will notice the inconsistency.

2. **Redundant tooltips**: Two tooltips restate what the label already says and offer no additional value:
   - Pre-Chat Form: "Required" field tooltip ("When checked, the visitor cannot start chatting without filling in this field")
   - Credit Exhaustion: "Phone Field" toggle tooltip ("Adds an optional phone number field to the ticket form")

3. **Missing tooltips on important but non-obvious fields**:
   - **Chatbot Instructions textarea** (Prompt tab): The most consequential field in the entire settings page has no tooltip.
   - **Memory Retention** (Memory tab): Users don't understand what is remembered or for how long without explanation.
   - **Live Fetch Threshold** (AI Model tab): The label uses internal jargon. The tooltip explains the slider but not what "live fetch" means.
   - **Allowed Origins** (General tab): Security-sensitive field with no tooltip.

4. **Proactive Messages rule fields** are under-documented. The Trigger Type and Display Mode selectors have no tooltips. These are complex concepts that first-time users will not understand from labels alone.

5. **Tone inconsistency**: Most tooltips use a neutral, functional tone ("Controls X", "Specifies Y"). The Pre-Chat Form Description tooltip adds a conversion-rate tip ("to improve completion rates") which has a different register. Either all tooltips should include such tips or none should.

### Prioritised action list

| Priority | Location | Action |
|----------|----------|--------|
| High | Prompt tab | Add tooltip to Chatbot Instructions label |
| High | Post-Chat Survey | Add tooltips matching Pre-Chat Form parity (description, question type, required) |
| High | Proactive | Add tooltips to Trigger Type and Display Mode selectors |
| Medium | General | Add tooltip to Allowed Origins (security context) |
| Medium | Memory | Add tooltip to Memory Retention days slider |
| Medium | AI Model | Rewrite Live Fetch Threshold tooltip to explain what "live fetch" means |
| Medium | Live Handoff | Rewrite Webhook Secret tooltip to remove jargon |
| Medium | Fallback | Fix Form Title tooltip ("something like" → "defaults to") |
| Low | Pre-Chat Form | Remove or improve the redundant "Required" tooltip |
| Low | Fallback | Remove or improve the redundant "Phone Field" tooltip |
| Low | General | Remove the "Placeholder text shown in the message input field" helper text (pure restatement of the label) |
