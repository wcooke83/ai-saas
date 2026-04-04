---
title: Setting Up the Facebook Messenger Integration
description: How to create a Meta App, configure your Facebook Page, and connect your VocUI chatbot to Messenger so customers can get AI-powered answers.
category: Integrations
order: 3
---

## Overview

The Messenger integration lets your customers message your Facebook Page and receive instant AI-powered replies from your VocUI chatbot. The bot searches your knowledge base and responds in the same conversation thread.

**Requirements:**
- A Pro plan or higher
- A Meta Business account
- A Facebook Page (Business or Creator)

---

## Step 1 — Create a Meta Business App

1. Go to [developers.facebook.com](https://developers.facebook.com) and sign in.
2. Click **My Apps** → **Create App**.
3. Select **Business** as the app type and click **Next**.
4. Enter an app name (e.g. `VocUI Messenger`), your business email, and your Business Account.
5. Click **Create App**.

---

## Step 2 — Add Messenger to Your App

1. In your app dashboard, scroll to find the **Messenger** product and click **Set up**.
2. Under **Access Tokens**, select or connect your Facebook Page.
3. Generate a page access token — this is used later.

---

## Step 3 — Get Your Credentials

You need two values from the Meta dashboard:

**Page ID**
1. Go to your Facebook Page.
2. Click **About** or open **Page settings** → **Page Info**.
3. Scroll down to find your **Page ID** (a numeric string).

Alternatively:
1. In your Meta App, go to **Messenger** → **API Setup**.
2. Under **Access Tokens**, the Page ID is shown next to your page.

**Permanent Access Token**
For production use, generate a permanent system user token:
1. Go to your **Meta Business Suite** → **Settings** → **System Users**.
2. Create a system user (or use an existing one) with **Admin** role.
3. Click **Add Assets** → add your Messenger App and Facebook Page with **Full Control**.
4. Click **Generate Token** → select your app → enable `pages_messaging` and `pages_read_engagement` permissions.
5. Copy the generated token — you will not be able to view it again.

> For quick testing only, you can use the temporary token from **Messenger** → **API Setup**. It expires and is not suitable for production.

---

## Step 4 — Connect from VocUI

1. In your VocUI dashboard, open the chatbot you want to deploy to Messenger.
2. Go to **Deploy** → **Messenger** tab.
3. Enter your **Page ID** and **Access Token**.
4. Optionally enter a **Page Name** for display purposes.
5. Click **Connect to Messenger**.

After connecting, the dashboard displays your **Webhook URL**.

---

## Step 5 — Configure the Webhook in Meta

VocUI uses a single app-level webhook for all Messenger integrations:

1. In your Meta App, go to **Messenger** → **Settings** (or **Webhooks**) in the left sidebar.
2. Under **Webhooks**, click **Add Callback URL**.
3. Set the **Callback URL** to: `https://vocui.com/api/messenger/webhook`
4. Set the **Verify Token** to the value of your `META_MESSENGER_VERIFY_TOKEN` environment variable (set by your VocUI administrator).
5. Click **Verify and Save**.
6. Under **Webhook Fields**, enable the **messages** field.
7. Subscribe the webhook to your Facebook Page.

> Meta will send a verification request to the webhook URL immediately. VocUI handles this automatically.

---

## Step 6 — Enable AI Responses

After connecting, toggle **AI Responses** on in the Messenger section of the deploy page. This controls whether the chatbot automatically replies to incoming messages.

---

## Step 7 — Test the Integration

1. Send a message to your Facebook Page via Messenger from a personal Facebook account.
2. The chatbot should reply within a few seconds using your knowledge base.

---

## Troubleshooting

**"Messenger integration requires a Pro or Agency plan"**
Upgrade your VocUI plan before connecting.

**Webhook verification fails**
- Confirm the Callback URL is exactly `https://vocui.com/api/messenger/webhook` (no trailing slash)
- Confirm the Verify Token matches the `META_MESSENGER_VERIFY_TOKEN` environment variable

**Bot doesn't respond to messages**
- Check that **AI Responses** is toggled on in the Messenger tab
- Verify the **messages** webhook field is subscribed and the webhook is linked to your Page
- Confirm your access token has not expired
- Ensure your Page has Messenger enabled (not restricted to followers only)

**Duplicate replies**
VocUI deduplicates incoming webhooks automatically using the message ID.
