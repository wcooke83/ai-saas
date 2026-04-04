---
title: Setting Up the SMS Integration (Twilio)
description: How to connect your Twilio phone number to VocUI so customers can text it and receive AI-powered replies.
category: Integrations
order: 6
---

## Overview

The SMS integration connects your Twilio phone number to your VocUI chatbot. Customers send a text message to your number and the AI automatically replies using your knowledge base.

**Requirements:**
- A Pro plan or higher
- A Twilio account with a phone number that supports SMS

> **US-only requirement**: If you plan to send SMS to US phone numbers, your Twilio number must be registered for **A2P 10DLC** (Application-to-Person 10-Digit Long Code). Unregistered numbers face delivery failures. Complete brand + campaign registration in your Twilio Console before going live.

---

## Step 1 — Get a Twilio Account and Phone Number

1. Sign up at [twilio.com](https://www.twilio.com).
2. From the Twilio Console, purchase a phone number that supports SMS in your region.
3. Note your **Account SID** and **Auth Token** from the Console home page.

---

## Step 2 — Connect from VocUI

1. In your VocUI dashboard, open the chatbot you want to deploy via SMS.
2. Go to **Deploy** → **SMS** tab.
3. Enter:
   - **Account SID** — starts with `AC` (e.g. `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** — your Twilio Auth Token (stored encrypted)
   - **Phone Number** — your Twilio number in E.164 format (e.g. `+14155551234`)
4. Click **Connect SMS**.

After connecting, the dashboard displays your **Webhook URL** in the format:

```
https://vocui.com/api/sms/webhook/<chatbot-id>
```

---

## Step 3 — Configure the Webhook in Twilio

1. In the Twilio Console, go to **Phone Numbers** → **Manage** → **Active Numbers**.
2. Click on your phone number.
3. Under **Messaging Configuration**, set the **A message comes in** webhook to your VocUI webhook URL.
4. Set the HTTP method to **POST**.
5. Click **Save**.

---

## Step 4 — Test the Integration

1. Send an SMS to your Twilio phone number from a mobile phone.
2. The chatbot should reply within a few seconds using your knowledge base.

---

## Response Length

SMS replies are limited to 320 characters by default (2 SMS segments). The AI is instructed to keep responses concise to stay within this limit.

---

## Troubleshooting

**"SMS integration requires a Pro or Agency plan"**
Upgrade your VocUI plan before connecting.

**Bot doesn't respond to messages**
- Check that **AI Responses** is toggled on in the SMS tab
- Verify the webhook URL in Twilio matches exactly (no trailing slash)
- Confirm your Twilio number is active and has messaging capability

**US messages not being delivered**
Your Twilio number must complete A2P 10DLC registration for US messaging. Log in to your Twilio Console and complete the brand and campaign registration.

**"Authentication Error" in Twilio logs**
This indicates the webhook signature verification failed. Ensure `NEXT_PUBLIC_APP_URL` is set correctly in your VocUI environment — the URL must exactly match the one Twilio uses when sending requests (including `https://`).

**Duplicate replies**
VocUI deduplicates incoming webhooks automatically using the Twilio `MessageSid`.
