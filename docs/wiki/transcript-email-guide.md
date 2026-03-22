---
title: Transcript Email
description: Let visitors receive a copy of their chat conversation via email
category: chatbot-features
order: 15
---

# Transcript Email

Let visitors receive a copy of their chat conversation via email.

## Overview

The transcript feature allows visitors to get an email copy of their chat conversation. This is useful for support interactions where the visitor may need to reference the conversation later, or for any scenario where having a written record is valuable.

## Enabling Transcripts

1. Go to your chatbot's **Settings** page
2. Scroll to the **Transcript** section
3. Toggle it **on**
4. Choose your email mode and display options
5. Save your changes

Transcripts are disabled by default.

## Email Modes

The transcript feature needs a visitor's email address to send the transcript. There are two ways to obtain it:

| Mode | Behavior |
|------|----------|
| **pre_chat** | Uses the email address collected from the pre-chat form. Requires the pre-chat form to be enabled with an email field. No additional prompt is shown to the visitor. |
| **ask** | Prompts the visitor for their email address when they request a transcript. Works even if the pre-chat form is disabled. This is the default mode. |

## Display Options

Two settings control how visitors discover and access the transcript feature:

| Option | Default | Description |
|--------|---------|-------------|
| **show_header_icon** | `true` | Shows an envelope icon in the chat widget header. Visitors click it to request a transcript at any time during the conversation. |
| **show_chat_prompt** | `false` | Offers a transcript via an in-chat prompt at the end of the conversation. The chatbot asks the visitor if they'd like a copy of the conversation. |

You can enable both, either, or neither (though enabling at least one is recommended when transcripts are turned on).

## Configuration Summary

| Setting | Default | Description |
|---------|---------|-------------|
| **enabled** | `false` | Master toggle for transcript emails |
| **email_mode** | `ask` | How the visitor's email is obtained: `pre_chat` or `ask` |
| **show_header_icon** | `true` | Display envelope icon in the chat header |
| **show_chat_prompt** | `false` | Offer transcript via in-chat message at conversation end |

## How It Works

1. The visitor has a conversation with the chatbot
2. They request a transcript by clicking the header icon or accepting the in-chat prompt
3. If using `ask` mode, the widget prompts for an email address
4. If using `pre_chat` mode, the email from the pre-chat form is used automatically
5. The conversation transcript is sent to the provided email

## Best Practices

- **Use `pre_chat` mode when you already collect emails** — It's a smoother experience since the visitor doesn't have to enter their email twice.
- **Use `ask` mode when the pre-chat form is disabled** — Or when you don't want to require an email upfront.
- **Enable the header icon** — It's unobtrusive and lets visitors request a transcript whenever they want.
- **Enable the chat prompt for support bots** — Proactively offering a transcript at the end of a support conversation is a nice touch that visitors appreciate.
- **Combine with post-chat surveys** — After sending the transcript offer, the post-chat survey can follow for a complete end-of-conversation flow.
