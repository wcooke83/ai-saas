---
title: Setting Up the WhatsApp Integration
description: How to create a Meta App, configure your WhatsApp Business Platform number, and connect your VocUI chatbot to WhatsApp so customers can get AI-powered answers.
category: Integrations
order: 2
---

## Overview

The WhatsApp integration lets your customers message your WhatsApp Business number and receive instant AI-powered replies from your VocUI chatbot. The bot searches your knowledge base and responds in the same conversation thread.

**Requirements:**
- A Pro plan or higher
- A Meta Business account
- A phone number registered with WhatsApp Business Platform (Cloud API)

> Your number must be registered with the **WhatsApp Business Platform** (not just the WhatsApp Business App). Numbers using the free Business App do not have API access.

---

## Step 1 — Create a Meta Business App

1. Go to [developers.facebook.com](https://developers.facebook.com) and sign in.
2. Click **My Apps** → **Create App**.
3. Select **Business** as the app type and click **Next**.
4. Enter an app name (e.g. `VocUI WhatsApp`), your business email, and your Business Account.
5. Click **Create App**.

---

## Step 2 — Add WhatsApp to Your App

1. In your app dashboard, scroll to find the **WhatsApp** product and click **Set up**.
2. Select or create a **WhatsApp Business Account (WABA)**.
3. Add a phone number:
   - Use an existing number (must not be active on the WhatsApp app simultaneously), or
   - Use the free test number Meta provides for development.
4. Complete phone number verification via the SMS or voice call code.

---

## Step 3 — Get Your Credentials

You need two values from the Meta dashboard:

**Phone Number ID**
1. Go to **WhatsApp** → **API Setup** in the left sidebar.
2. Under **Send and receive messages**, copy the **Phone number ID** (a numeric string like `123456789012345`).

**Permanent Access Token**
For production use, generate a permanent system user token:
1. Go to your **Meta Business Suite** → **Settings** → **System Users**.
2. Create a system user (or use an existing one) with **Admin** role.
3. Click **Add Assets** → add your WhatsApp App with **Full Control**.
4. Click **Generate Token** → select your app → enable `whatsapp_business_messaging` and `whatsapp_business_management` permissions.
5. Copy the generated token — you will not be able to view it again.

> For quick testing only, you can use the temporary token from **WhatsApp** → **API Setup**. It expires after 24 hours and is not suitable for production.

---

## Step 4 — Connect from VocUI

1. In your VocUI dashboard, open the chatbot you want to deploy to WhatsApp.
2. Go to **Deploy** → **WhatsApp** tab.
3. Enter your **Phone Number ID** and **Access Token**.
4. Optionally click **Generate** to create a **Verify Token** (or enter your own).
5. Click **Connect to WhatsApp**.

After connecting, the dashboard displays:
- Your **Webhook URL** — paste this into Meta's webhook configuration
- Your **Verify Token** — paste this into Meta's webhook configuration

---

## Step 5 — Configure the Webhook in Meta

1. In your Meta App, go to **WhatsApp** → **Configuration** in the left sidebar.
2. Under **Webhook**, click **Edit**.
3. Set the **Callback URL** to your VocUI webhook URL (copied from the dashboard).
4. Set the **Verify Token** to the value shown in your VocUI dashboard.
5. Click **Verify and Save**.

6. Under **Webhook Fields**, click **Manage** and enable the **messages** field.
7. Click **Done**.

> Meta will send a verification request to your webhook URL immediately. VocUI handles this automatically — if the Verify Token matches, the webhook is confirmed.

---

## Step 6 — Enable AI Responses

After connecting, toggle **AI Responses** on in the WhatsApp section of the deploy page. This controls whether the chatbot automatically replies to incoming messages. You can disable it at any time to pause responses without disconnecting.

---

## Step 7 — Test the Integration

1. Send a WhatsApp message to your registered business phone number from a personal WhatsApp account.
2. The chatbot should reply within a few seconds using your knowledge base.

For the free test number, you must first add yourself as a test contact in **WhatsApp** → **API Setup** → **To**.

---

## Troubleshooting

**"WhatsApp integration requires a Pro or Agency plan"**
Upgrade your VocUI plan before connecting.

**Webhook verification fails**
- Confirm the Callback URL in Meta exactly matches `https://vocui.com/api/whatsapp/webhook/{your-chatbot-id}` (no trailing slash)
- Confirm the Verify Token in Meta exactly matches the value shown in VocUI (case-sensitive)

**Bot doesn't respond to messages**
- Check that **AI Responses** is toggled on in the WhatsApp tab
- Verify the **messages** webhook field is subscribed in Meta's webhook configuration
- Confirm your access token has not expired (temporary tokens expire after 24 hours)
- Check that the chatbot is published (unpublished chatbots do not respond)

**"Sorry, this chatbot has reached its message limit"**
Your chatbot has used its monthly message allocation. Purchase additional credits or wait for the monthly reset.

**Duplicate replies**
VocUI deduplicates incoming webhooks automatically. If you see duplicate replies, check that you have not configured two different webhook endpoints for the same phone number.
