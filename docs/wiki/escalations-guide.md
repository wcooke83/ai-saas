---
title: Escalations & Reporting
description: Learn how conversation escalations work, including visitor-reported issues and live agent handoff
category: chatbot-features
order: 9
---

# Escalations & Reporting

Escalations let visitors flag issues, report problems, or request human assistance during a chatbot conversation.

## Overview

When a visitor encounters a problem with the chatbot, they can:

1. **Report an issue** — Flag a wrong answer, offensive content, or other problems
2. **Request human help** — Ask to be connected to a live support agent

These escalations are tracked on the **Escalations** page, giving you visibility into where the chatbot falls short.

## How Visitors Escalate

The chatbot widget includes a report button (flag icon) that visitors can click at any time. This opens the escalation overlay with options:

### Report Reasons

| Reason | When to Use |
|--------|-------------|
| **Wrong Answer** | The chatbot provided incorrect information |
| **Offensive Content** | The response contained inappropriate content |
| **Other** | Any other issue not covered above |
| **Connect to Support** | Visitor wants to talk to a human agent |

Visitors can also add a **text description** explaining the issue in detail.

## Viewing Escalations

Navigate to the **Escalations** page from your chatbot's dashboard to see:

- A list of all reported issues with timestamps
- The reason category for each escalation
- Visitor details and the message that triggered the report
- Status of each escalation (open, reviewed, resolved)

## Configuring Escalations

In your chatbot's **Settings**, the Escalation section lets you configure:

- **Enable/disable** the report button on the widget
- **Notification email** — Receive email alerts when escalations are submitted
- **Auto-responses** — Customize the message shown to visitors after they submit a report

## Live Agent Handoff

When a visitor clicks "Connect to Support," the system can:

1. **Create an escalation** — Logged for later review
2. **Notify via Telegram** — If Telegram handoff is configured, the conversation is forwarded to a Telegram group where human agents can respond in real-time
3. **Show a message** — Display a custom message to the visitor (e.g., "A support agent will be with you shortly")

See the [Telegram Live Handoff](./telegram-live-handoff) guide for setup instructions.

## Customizing the Escalation UI

The escalation overlay colors can be customized in the **Customize Widget** page under the **Escalation Report** color section:

- Background, text, and button colors
- Reason button colors (default and selected states)
- Submit button and input field styling

Switch to the **Escalation** preview tab to see your changes in real-time.

## Best Practices

### Reducing Escalations

- **Improve your knowledge base** — Most "wrong answer" reports indicate missing or outdated content
- **Refine the system prompt** — Address common complaint patterns
- **Add Q&A pairs** — Create precise answers for frequently escalated questions
- **Enable prompt protection** — Prevents visitors from manipulating the chatbot's behavior

### Monitoring Escalations

- Check escalations regularly — they're your best signal for chatbot quality
- Look for patterns in report reasons to prioritize improvements
- Track escalation rate over time to measure improvement
- Respond to human help requests promptly if you have live agents available

### When Escalations Are Not Enough

If you're getting a high volume of "Connect to Support" requests, consider:

- Setting up the **Agent Console** for real-time conversation management
- Configuring **Telegram handoff** for team-based support
- Adding more detailed content to reduce the need for human intervention
