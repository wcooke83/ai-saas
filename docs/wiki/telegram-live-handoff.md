---
title: Telegram Live Handoff
description: Connect your chatbot to Telegram so visitors can be handed off to human agents in real-time
category: chatbot-features
order: 4
---

# Telegram Live Handoff

Hand off chat conversations to human agents via Telegram. When a visitor requests help or the AI can't resolve their issue, the conversation is forwarded to a Telegram group where your team can respond directly.

## How It Works

| Step | What Happens | Where |
|------|-------------|-------|
| 1 | Visitor clicks the **flag icon** in the chat header | Chat Widget |
| 2 | The widget switches to a **full-screen report view** with options | Chat Widget |
| 3 | Visitor clicks **"Connect to support"** (or another reason) | Chat Widget |
| 4 | System creates a handoff session and forwards conversation context | Server |
| 5 | Agent receives the message with visitor info and recent chat history | Telegram Group |
| 6 | Agent replies by responding to the Telegram thread | Telegram Group |
| 7 | Visitor is returned to chat and sees agent replies in real-time | Chat Widget |
| 8 | Agent runs `/resolve` when done — visitor returns to AI chat | Telegram Group |

## Setup

### 1. Create a Telegram Bot

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts to name your bot
3. Copy the **Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Create a Support Group

1. Create a new Telegram group for your support team
2. Add your bot to the group as an **administrator**
3. Get the group's **Chat ID**:
   - Add [@userinfobot](https://t.me/userinfobot) to the group temporarily
   - It will print the chat ID (a negative number like `-1001234567890`)
   - Remove @userinfobot after

### 3. Configure in Dashboard

1. Go to **Dashboard > Chatbots > [Your Chatbot] > Settings**
2. Scroll to **Live Handoff** (under the Escalations section)
3. Toggle it on
4. Enter your **Bot Token** and **Support Group Chat ID**
5. Click **Save Changes**
6. Click **Setup Webhook** — this tells Telegram where to send agent replies

### 4. Enable Escalation Reporting

Live Handoff works alongside the Escalation Reporting feature. Make sure it's also enabled:

1. In Settings, scroll to **Escalation Reporting** and toggle it on
2. This adds the **flag icon** to the chat widget header

### 5. Customize Appearance (Optional)

The escalation report UI has its own set of colors that can be customized:

1. Go to **Dashboard > Chatbots > [Your Chatbot] > Customize**
2. Under **Colors > Escalation Report**, configure:
   - Background, text, and input colors
   - Reason button colors (default and selected states)
   - Submit button colors
3. Use the **Escalation** tab in the Live Preview to see changes in real-time

## Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Bot Token** | Your Telegram bot's API token from @BotFather | Required |
| **Chat ID** | The Telegram group ID where handoffs are sent | Required |
| **Webhook Secret** | Optional secret for verifying webhook authenticity | Empty |
| **Auto-handoff on escalation** | Automatically start handoff when visitor selects "I need human help" | On |

## Telegram Bot Commands

Agents can use these commands in the Telegram group:

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/active` | List all active handoff sessions |
| `/resolve <conversation_id>` | Close a handoff and return visitor to AI |

To respond to a visitor, simply **reply to the handoff message thread** in Telegram. The reply is delivered to the visitor's chat widget in real-time.

## What the Agent Sees

When a handoff is triggered, the Telegram group receives a message like:

```
🆘 Live Handoff Request
🤖 Chatbot: My Support Bot
👤 Visitor: Jane Smith
📋 Conversation: abc12345-...
❓ Reason: Needs human assistance
📧 Email: jane@example.com

━━━━━━━━━━━━━━━━

💬 Recent conversation:
🤖 Hi! How can I help you today?
👤 I need to change my shipping address
🤖 I can help with that. What's your order number?
👤 I don't have it, can I talk to someone?

💡 Reply to this message to respond to the visitor.
```

## What the Visitor Sees

### The Report View

When the visitor clicks the flag icon, the chat is replaced by a full-screen report panel with:

- **3 report reasons** in a grid: "Wrong answer", "Offensive content", "Other"
- A separate **"Connect to support"** button (with person icon) — visually distinct because it triggers a live handoff rather than just filing a report
- A **contextual textarea** — the placeholder changes based on the selected reason (e.g., "What was incorrect?" for wrong answers, "Briefly describe what you need help with..." for human help)
- A **dynamic submit button** — the label changes per reason (e.g., "Report wrong answer", "Connect to support")

Visitors can also flag **individual messages** using the small flag icon next to each AI response. This opens an inline report form below that specific message, keeping the flagged message visible for context.

### During Active Handoff

- The widget **returns to the chat view** immediately after handoff is initiated
- A system message confirms: **"Connected! An agent will respond shortly."**
- The header shows **"Connecting to agent..."** then the agent's name once they reply
- Agent messages appear with a **green dot badge** and the agent's name
- The visitor can continue typing — messages are forwarded to the Telegram thread
- When the agent resolves the handoff, the visitor sees: **"You're back with the AI assistant"**

## How Handoff is Triggered

Handoff can be triggered in three ways:

### 1. "Connect to support" button (recommended)

When Telegram handoff is enabled, the report view shows a dedicated **"Connect to support"** button separated from the report reasons. Clicking it and submitting immediately initiates the handoff.

### 2. Automatic (via Escalation)

When **Auto-handoff on escalation** is enabled (default), selecting "I need human help" or "Other" in the escalation report automatically initiates the Telegram handoff. This works for both the full-screen report view and per-message inline reports.

### 2. Manual (via API)

You can trigger a handoff programmatically:

```javascript
// POST /api/widget/{chatbotId}/handoff
fetch(`/api/widget/${chatbotId}/handoff`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    conversation_id: 'conv-uuid',
    session_id: 'session-id',
    reason: 'need_human_help',
    details: 'Customer wants to discuss refund',
    visitor_name: 'Jane Smith',
    visitor_email: 'jane@example.com',
  }),
});
```

## Checking Handoff Status

Query the handoff status for a conversation:

```javascript
// GET /api/widget/{chatbotId}/handoff?conversation_id={id}
const res = await fetch(
  `/api/widget/${chatbotId}/handoff?conversation_id=${conversationId}`
);
const data = await res.json();
// data.data = {
//   handoff_active: true,
//   handoff_status: 'active', // 'pending' | 'active' | 'resolved'
//   agent_name: 'Sarah',
//   telegram_enabled: true,
// }
```

## Polling for Agent Messages

During an active handoff, the widget polls for new agent messages using the `since` parameter:

```javascript
// GET /api/widget/{chatbotId}/handoff?conversation_id={id}&since={timestamp}
// Returns new_messages[] with agent replies since the given timestamp
```

The widget polls every 3 seconds automatically.

## Architecture

### Database Tables

| Table | Purpose |
|-------|---------|
| `telegram_handoff_sessions` | Tracks active handoff state per conversation |
| `telegram_message_mappings` | Maps conversations to Telegram message threads |
| `telegram_command_log` | Audit log for bot commands |

The `conversations` table also has a `handoff_active` boolean flag that's automatically synced via database triggers.

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/telegram/webhook` | POST | Receives agent replies from Telegram |
| `/api/telegram/setup` | POST/DELETE/GET | Manage webhook configuration |
| `/api/widget/{id}/handoff` | GET | Check handoff status + poll messages |
| `/api/widget/{id}/handoff` | POST | Initiate a handoff |
| `/api/widget/{id}/report` | POST | Escalation report (auto-triggers handoff) |

### Message Flow

```
[Visitor sends message]
       |
  Chat API checks for active handoff
       |
  ┌────┴────┐
  │ Active? │
  └────┬────┘
   No  │  Yes
   │   │
   │   └──> Forward to Telegram thread
   │        (no AI response)
   │
   └──> Normal AI response via RAG
```

```
[Agent replies in Telegram]
       |
  Webhook receives update
       |
  Look up conversation from message mapping
       |
  Save agent reply as chat_message
  (metadata: is_human_agent=true)
       |
  Widget picks up via polling
```

## Widget UX Design

The escalation and handoff UI follows these design principles:

### Full-View vs Inline Reports

- **Conversation-level reports** (header flag icon) use **full-view replacement** — the chat is hidden and the report panel takes over the entire widget. This avoids visual clutter in a 380px-wide widget and matches the pattern used by pre-chat forms and post-chat surveys.
- **Per-message reports** (flag icon next to each AI message) stay **inline** below the flagged message. The message remains visible so the visitor can reference what they're reporting. The form auto-scrolls into view.

### "Connect to support" is Separated

The "Connect to support" option is visually distinct from the report reasons (Wrong answer, Offensive content, Other). It uses a dashed-border button with a person icon because it has a fundamentally different intent — requesting live assistance rather than filing a complaint.

When Telegram handoff is not enabled, "Need human help" falls back to a regular grid button.

### Contextual Labels

The textarea placeholder and submit button label change based on the selected reason:

| Reason | Placeholder | Submit Label |
|--------|------------|--------------|
| Wrong answer | "What was incorrect?" | "Report wrong answer" |
| Offensive content | "What was offensive?" | "Report offensive content" |
| Need human help | "Briefly describe what you need help with..." | "Connect to support" |
| Other | "Tell us more (optional)..." | "Submit report" |

### Internationalization

All escalation UI strings are translated into 20 languages. The contextual placeholders and submit labels are included in the translation system.

## Multi-Tenant Design

Each chatbot has its own Telegram bot configuration stored in `telegram_config` on the chatbots table. This means:

- Different chatbots can use different Telegram bots and groups
- Bot tokens are stored per-chatbot, not as environment variables
- The webhook endpoint (`/api/telegram/webhook`) identifies the chatbot by looking up the message mapping or matching the chat ID

## Troubleshooting

### Webhook not receiving messages
- Ensure the bot is added as an **admin** in the group
- Click "Setup Webhook" again after saving settings
- Check that your app URL is publicly accessible (not localhost)

### Agent replies not appearing in widget
- Make sure the agent is **replying to the handoff message thread** (not sending a new message)
- Check the browser console for polling errors

### Bot token invalid
- Regenerate the token via @BotFather with `/token`
- Make sure there are no extra spaces in the token field

### Chat ID not working
- Group chat IDs are negative numbers (e.g., `-1001234567890`)
- Supergroups have IDs starting with `-100`
