---
title: Leads & Conversations
description: Learn how to collect visitor information through pre-chat forms and manage conversation history
category: chatbot-features
order: 7
---

# Leads & Conversations

The Leads & Conversations page is your central hub for viewing visitor data and chat history.

## Leads

### What Is a Lead?

A lead is a visitor who submitted the **pre-chat form** before starting a conversation. The form collects information like name, email, phone number, or any custom fields you configure.

### Enabling Lead Collection

1. Go to your chatbot's **Settings** page
2. Scroll to the **Pre-Chat Form** section
3. Toggle it **on**
4. Configure your form fields:
   - **Name** and **Email** are available by default
   - Add custom fields (text, select, textarea) for additional data
   - Mark fields as required or optional

### Viewing Leads

The Leads tab shows a sortable table with:

- **Lead info** — Name, email, and avatar initials
- **Details** — Additional form field values shown as badges
- **Session** — The chat session ID linked to this lead
- **Submitted** — When the form was filled out

Click any row to open the **Lead Detail** dialog with all form data and a link to view the associated conversation.

### Exporting Leads

Click **Export CSV** to download all leads matching your current date filter. The CSV includes all form fields as columns.

## Conversations

### What Is a Conversation?

A conversation is a complete chat session between a visitor and your chatbot. Every interaction creates a conversation, regardless of whether the visitor filled out the pre-chat form.

### Viewing Conversations

The Conversations tab shows:

- **Session ID** — Unique identifier for the chat session
- **Message count** — Total messages exchanged
- **Channel** — Where the conversation happened (widget, API, etc.)
- **Last Activity** — When the last message was sent

Click any row to open the **Conversation Detail** dialog, which shows the full message history with timestamps.

### Filtering

Use the **date filter** dropdown to narrow results:

| Filter | Shows |
|--------|-------|
| All Time | Every lead/conversation ever recorded |
| Today | Last 24 hours only |
| Last 7 Days | Previous week |
| Last 30 Days | Previous month |

You can also filter conversations by **session ID** using the URL parameter (e.g., from the Sentiment page).

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
- Use the **search bar** in either tab to find specific leads by name, email, or session ID
