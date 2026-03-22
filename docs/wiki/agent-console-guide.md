---
title: Agent Console
description: Learn how to manage live conversations, respond to visitors in real-time, and handle handoff sessions from the dashboard
category: chatbot-features
order: 10
---

# Agent Console

The Agent Console is a real-time conversation management interface built into the dashboard. It lets your support team handle live handoff sessions, reply to visitors, and monitor active conversations -- all without leaving the browser.

## Accessing the Agent Console

1. Go to **Dashboard > Chatbots > [Your Chatbot]**
2. Click **More** in the sub-navigation bar
3. Select **Agent Console**

The console opens as a split-pane layout: a conversation list on the left and a chat panel on the right.

## Conversation List

The left sidebar displays all handoff sessions for the current chatbot, sorted by most recent activity. Each entry shows:

- Visitor name or email (or "Anonymous Visitor")
- Last message preview
- Status badge (pending, active, resolved)
- Time since last activity
- Message count
- Escalation reason (for pending conversations)

### Filtering

Use the filter tabs at the top of the list to narrow by status:

| Filter | What It Shows |
|--------|---------------|
| **All** | Every handoff session |
| **Pending** | Waiting for an agent to take over (pulsing indicator when count > 0) |
| **Active** | Currently being handled by an agent |
| **Resolved** | Completed sessions |

The count badge on each filter updates in real-time as sessions change status.

## Chat Panel

Click a conversation to open it in the right panel. The panel shows:

- **Header** -- Visitor name, email, status badge, and escalation reason if present
- **Message thread** -- Full conversation history with timestamps, showing messages from the visitor, the AI, and human agents
- **Reply input** -- Text area for sending responses (Enter to send, Shift+Enter for newline)

### Message Types

Messages are visually differentiated:

| Sender | Appearance |
|--------|-----------|
| Visitor | Left-aligned, gray bubble |
| AI assistant | Right-aligned, blue bubble with bot icon |
| Human agent | Right-aligned, primary-colored bubble with headphones icon |
| System | Centered pill (e.g., "Connected! An agent will respond shortly.") |

## Conversation Actions

The available actions depend on the current handoff status:

| Status | Available Actions | What Happens |
|--------|-------------------|--------------|
| **Pending** | **Take Over** | Claims the conversation -- you become the assigned agent and can start replying |
| **Active** | **Return to AI** | Hands the conversation back to the AI chatbot |
| **Active** | **Resolve** | Closes the handoff session; visitor returns to AI chat |
| **Resolved** | None | Read-only -- you can review the transcript but cannot reply |

You must **Take Over** a pending conversation before you can send replies. The input field is disabled until you do.

## Visitor Presence

When you select a conversation, the header shows whether the visitor is currently online:

- **Green dot + "Online"** -- Visitor has the chat widget open. The page they're viewing (title and URL) is shown next to the indicator.
- **Gray dot + "Offline"** -- Visitor has closed the widget or navigated away.

Presence is tracked automatically via Supabase Realtime. When a visitor closes their browser tab, their presence is removed -- no polling required.

### Typing Indicators

- When the visitor is typing, a "Visitor is typing..." indicator with animated dots appears below the messages.
- Your typing state is also broadcast to the visitor's widget.

## Real-Time Updates

The Agent Console uses Supabase Realtime for live updates:

- **New handoff requests** appear in the conversation list immediately, with an audio notification and a browser title flash (e.g., "(3) New handoff request!")
- **New messages** from visitors appear in the chat panel without refreshing
- **Status changes** (take over, resolve, return to AI) are reflected instantly across all open consoles

## Relationship to Telegram Handoff

The Agent Console and [Telegram handoff](./telegram-live-handoff) serve the same underlying handoff sessions. They are complementary, not exclusive:

| Scenario | What Happens |
|----------|-------------|
| Visitor requests handoff, agent responds via **Agent Console** | Works standalone -- no Telegram setup needed |
| Visitor requests handoff, agent responds via **Telegram** | Agent reply appears in the console and the widget |
| Both channels active | Either channel can take over, reply, or resolve -- changes sync in real-time |

If you have Telegram configured, agents can respond from whichever channel is convenient. The conversation thread stays unified.

## Tips for Support Teams

- **Keep the console open in a browser tab** -- the audio notification and title flash will alert you to new handoff requests even if the tab is in the background.
- **Triage with filters** -- Use the Pending filter to see conversations waiting for a human. The pulsing orange dot makes them easy to spot.
- **Take over before replying** -- Pending conversations have the reply input disabled. Click "Take Over" first so the visitor knows an agent has joined.
- **Use "Return to AI" for simple follow-ups** -- If the visitor's issue is resolved but they have a routine question, hand them back to the AI instead of staying in the conversation.
- **Check presence before typing a long reply** -- If the visitor shows as offline, they may have left. Your reply will still be delivered when they return, but you may want to prioritize online visitors first.
- **Review escalation reasons** -- The orange escalation badge on pending conversations tells you *why* the visitor was handed off (wrong answer, needs help, offensive content). This helps you prioritize and prepare your response.
