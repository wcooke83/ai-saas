---
title: Setting Up the Email Inbound Integration
description: How to enable email inbound so customers can email your chatbot and receive AI-powered replies via Postmark.
category: Integrations
order: 5
---

## Overview

The Email Inbound integration gives each chatbot a dedicated email address. Customers email that address (or you forward your support inbox to it) and the AI automatically replies using your knowledge base. Replies thread correctly so customers can continue the conversation via email.

**Requirements:**
- A Pro plan or higher

No external API account is required from your side — VocUI handles the Postmark configuration.

---

## Step 1 — Enable Email Integration

1. In your VocUI dashboard, open the chatbot you want to deploy via email.
2. Go to **Deploy** → **Email** tab.
3. Optionally enter a **Sender name** — this appears in the `From:` field of outgoing replies (defaults to your chatbot name).
4. Click **Enable Email Integration**.

After enabling, the dashboard shows your dedicated **inbound email address** in the format:

```
<chatbot-id>@inbound.vocui.com
```

---

## Step 2 — Route Emails to Your Chatbot

You have two options:

**Option A — Email forwarding (easiest)**
In your email provider (Gmail, Outlook, etc.), set up an automatic forward from your support address (e.g. `support@yourdomain.com`) to the inbound address shown in the dashboard.

**Option B — MX record (recommended for production)**
Point a subdomain's MX record directly to `inbound.vocui.com`:

1. In your DNS settings, create a new MX record for a subdomain (e.g. `support.yourdomain.com`).
2. Set the mail server to `inbound.vocui.com` with priority `10`.
3. Customers can then email `anything@support.yourdomain.com` and it will arrive at your chatbot.

---

## How It Works

1. A customer sends an email to your inbound address.
2. VocUI receives the email via Postmark inbound processing.
3. The AI searches your knowledge base and composes a reply.
4. The reply is sent from VocUI's sending address, with `In-Reply-To` and `References` headers set so it threads correctly in email clients.
5. If the customer replies to the AI's response, the thread continues in the same chat session — maintaining conversation context.

---

## Reply Settings

In the **Email** → **Reply Settings** section:

- **Sender name**: The name shown in the `From:` field. Defaults to your chatbot name.
- **AI Responses**: Toggle to enable or disable automatic replies. When disabled, incoming emails are received but no reply is sent.

---

## Troubleshooting

**"Email integration requires a Pro or Agency plan"**
Upgrade your VocUI plan before enabling.

**AI isn't replying to emails**
- Check that **AI Responses** is toggled on in the Email tab
- Verify the chatbot is published (unpublished chatbots do not respond)
- Check that the email is arriving at the correct inbound address

**Replies aren't threading correctly**
Ensure you're replying to the AI's email rather than composing a new message. Threading uses standard `In-Reply-To` / `References` headers and requires the customer to use the Reply function in their email client.

**Only plain text is supported**
The integration processes the plain text body of incoming emails. HTML-only emails without a text part are ignored.
