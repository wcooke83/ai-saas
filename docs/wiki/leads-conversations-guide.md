---
title: Leads & Conversations
description: Learn how to collect visitor information through pre-chat forms and manage conversation history
category: chatbot-features
order: 7
---

# Leads & Conversations

The **Leads** page is your hub for viewing visitor data collected through pre-chat forms. For real-time conversation management, see the [Agent Console](agent-console-guide).

## How to Access

Navigate to **Dashboard > Chatbots > [Your Chatbot] > Leads**

## Leads

### What Is a Lead?

A lead is a visitor who submitted the **pre-chat form** before starting a conversation. The form collects information like name, email, phone number, or any custom fields you configure.

### Enabling Lead Collection

1. Go to your chatbot's **Settings** page
2. Scroll to the **Pre-Chat Form** section
3. Toggle it **on**
4. Configure your form fields:
   - **Name** and **Email** are available by default
   - Add custom fields with types: `name`, `email`, `phone`, `company`, or `custom`
   - Mark fields as required or optional

### Viewing Leads

The Leads page shows a sortable table with:

- **Lead info** — Name, email, and avatar initials
- **Details** — Additional form field values shown as badges
- **Session** — The chat session ID linked to this lead
- **Submitted** — When the form was filled out

Click any row to open the **Lead Detail** dialog with all form data and a link to view the associated conversation.

### Exporting Leads

Click **Export CSV** to download all leads matching your current date filter. The CSV includes all form fields as columns.

## Conversations

Conversation history is accessible in two places:

1. **Agent Console** (at **Dashboard > Chatbots > [Your Chatbot] > Agent Console**) — For real-time conversation management, replying to visitors, and handling handoffs
2. **Lead Detail dialog** — Click any lead to see their associated conversation

### What Is a Conversation?

A conversation is a complete chat session between a visitor and your chatbot. Every interaction creates a conversation, regardless of whether the visitor filled out the pre-chat form.

### Filtering

Use the **date filter** dropdown to narrow results:

| Filter | Shows |
|--------|-------|
| All Time | Every lead ever recorded |
| Today | Last 24 hours only |
| Last 7 Days | Previous week |
| Last 30 Days | Previous month |

## Stats Cards

The stats cards at the top provide a quick overview:

- **Total Leads** — All-time count of pre-chat form submissions
- **Total Conversations** — All-time count of chat sessions
- **Today's Activity** — Leads + conversations from the last 24 hours
- **Conversion Rate** — Percentage of conversations that also captured a lead (higher = more visitors are filling out the form)

## Tips

- **Low conversion rate?** Simplify your pre-chat form — fewer required fields means more submissions
- **No leads?** Make sure the pre-chat form is enabled in Settings
- **Missing conversations?** Conversations only appear after at least one message is sent
- Use the **search bar** to find specific leads by name, email, or session ID

## Related

- [Agent Console](agent-console-guide) — Real-time conversation management and live handoff
- [Sentiment & Loyalty Analysis](sentiment-loyalty-guide) — Analyze conversation quality trends
- [Post-Chat Surveys](surveys-guide) — Collect feedback after conversations
