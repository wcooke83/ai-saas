---
title: Proactive Messages
description: Learn how to configure automated messages that trigger based on visitor behavior like time on page, scroll depth, or exit intent
category: chatbot-features
order: 11
---

# Proactive Messages

Automatically engage visitors with targeted messages triggered by their behavior on your site.

## Overview

Proactive messages let your chatbot reach out to visitors before they start a conversation. Instead of waiting for someone to click the chat widget, you can show a message bubble or open the widget based on triggers like time on page, scroll depth, or exit intent.

Each proactive message is defined as a **rule** with a trigger, display mode, and styling options. You can create multiple rules with different triggers and priorities.

## Trigger Types

| Trigger | Description | Example Config |
|---------|-------------|----------------|
| **page_url** | Fires when the visitor is on a specific URL or URL pattern | `{ "pattern": "/pricing" }` |
| **time_on_page** | Fires after the visitor has been on the current page for N seconds | `{ "seconds": 30 }` |
| **time_on_site** | Fires after the visitor has been on the site for N seconds (across pages) | `{ "seconds": 120 }` |
| **scroll_depth** | Fires when the visitor scrolls past a percentage of the page | `{ "percent": 50 }` |
| **exit_intent** | Fires when the visitor's mouse moves toward the browser close/back button | No config needed |
| **page_view_count** | Fires after the visitor has viewed N pages in the session | `{ "count": 3 }` |
| **idle_timeout** | Fires after the visitor has been idle (no mouse/keyboard activity) for N seconds | `{ "seconds": 60 }` |
| **custom_event** | Fires when your site pushes a named event to the widget | `{ "event_name": "added_to_cart" }` |

## Display Modes

When a rule triggers, the message can appear in one of two ways:

| Mode | Behavior |
|------|----------|
| **bubble** | Shows a floating text bubble near the chat widget button. The visitor can click it to open the widget or dismiss it. |
| **open_widget** | Opens the chat widget directly and sends the proactive message as the first bot message. |

## Bubble Positions

When using `bubble` display mode, you can position the bubble in 8 locations:

| Position | Placement |
|----------|-----------|
| `top-left` | Top-left corner of the viewport |
| `top-middle` | Top-center of the viewport |
| `top-right` | Top-right corner of the viewport |
| `middle-left` | Vertically centered, left edge |
| `middle-right` | Vertically centered, right edge |
| `bottom-left` | Bottom-left, near a left-positioned widget |
| `bottom-middle` | Bottom-center of the viewport |
| `bottom-right` | Bottom-right, near a right-positioned widget (default) |

## Bubble Styling

Customize how the proactive bubble looks via the `bubbleStyle` object:

| Property | Default | Description |
|----------|---------|-------------|
| `bgColor` | `#ffffff` | Background color (light mode) |
| `textColor` | `#0f172a` | Text color (light mode) |
| `borderColor` | `#e2e8f0` | Border color (light mode) |
| `darkBgColor` | `#0f172a` | Background color (dark mode) |
| `darkTextColor` | `#f8fafc` | Text color (dark mode) |
| `darkBorderColor` | `#334155` | Border color (dark mode) |
| `borderWidth` | `1` | Border width in pixels |
| `borderRadius` | `12` | Corner rounding in pixels |
| `shadow` | `md` | Drop shadow: `none`, `sm`, `md`, or `lg` |
| `fontSize` | `14` | Font size in pixels |
| `maxWidth` | `280` | Maximum bubble width in pixels |

These styles are shared across all rules for a given chatbot.

## Rule Options

Each proactive message rule has these settings:

| Option | Description |
|--------|-------------|
| **name** | Internal label for the rule (not shown to visitors) |
| **message** | The text displayed to the visitor |
| **enabled** | Toggle the rule on/off without deleting it |
| **delay** | Milliseconds to wait after the trigger fires before showing the message |
| **maxShowCount** | Maximum times this message is shown per visitor session. `0` means unlimited |
| **priority** | Lower number = higher priority. When multiple rules trigger simultaneously, the highest-priority rule wins |
| **closeOnNavigate** | Whether the bubble auto-dismisses when the visitor navigates to a different page (default: `true`) |

## Configuration

1. Go to your chatbot's **Settings** page
2. Scroll to the **Proactive Messages** section
3. Toggle the feature **on**
4. Click **Add Rule** to create a new proactive message
5. Choose a trigger type and configure its parameters
6. Set the display mode, position, delay, and priority
7. Save your changes

Proactive messages are disabled by default. The global toggle must be on, and individual rules must also be enabled, for messages to appear.

## Best Practices

- **Start with one rule** and measure its impact before adding more. Too many proactive messages can feel intrusive.
- **Use time_on_page for high-value pages** like pricing or product pages where visitors may have questions.
- **Set exit_intent for retention** — catch visitors who are about to leave with a helpful prompt.
- **Keep messages short and specific** — "Have questions about our pricing?" works better than a generic "Need help?"
- **Use priority to prevent conflicts** — if a visitor could trigger multiple rules, the lowest priority number wins.
- **Set maxShowCount to 1** for most rules to avoid annoying repeat visitors.
- **Use delay** to give visitors time to orient before the message appears. A 2-3 second delay after the trigger feels natural.
