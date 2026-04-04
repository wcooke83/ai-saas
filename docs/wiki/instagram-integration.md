---
title: Setting Up the Instagram DM Integration
description: How to create a Meta App, configure your Instagram Professional account, and connect your VocUI chatbot to Instagram Direct Messages.
category: Integrations
order: 4
---

## Overview

The Instagram integration lets your customers send Direct Messages to your Instagram Professional account and receive instant AI-powered replies from your VocUI chatbot.

**Requirements:**
- A Pro plan or higher
- A Meta Business account
- An Instagram Professional account (Business or Creator) linked to a Facebook Page

> Personal Instagram accounts do not have API access. Your account must be a **Professional account** connected to a Facebook Page.

---

## Step 1 — Create a Meta Business App

1. Go to [developers.facebook.com](https://developers.facebook.com) and sign in.
2. Click **My Apps** → **Create App**.
3. Select **Business** as the app type and click **Next**.
4. Enter an app name (e.g. `VocUI Instagram`), your business email, and your Business Account.
5. Click **Create App**.

---

## Step 2 — Add Instagram to Your App

1. In your app dashboard, scroll to find the **Instagram** product and click **Set up**.
2. Under **API setup with Instagram login**, connect your Instagram Professional account.
3. Alternatively, use **API setup with a Facebook Login** if your Instagram account is linked to a Facebook Page.

---

## Step 3 — Get Your Credentials

**Instagram Account ID**
1. Go to **Instagram** → **API Setup** in the left sidebar of your Meta App.
2. Copy the **Instagram Business Account ID** (a numeric string like `123456789012345`).

Alternatively:
- Visit your Instagram profile on the web, open the page source, and search for `"accountId"`.

**Permanent Access Token**
For production use, generate a permanent system user token:
1. Go to your **Meta Business Suite** → **Settings** → **System Users**.
2. Create a system user (or use an existing one) with **Admin** role.
3. Click **Add Assets** → add your Instagram App with **Full Control**.
4. Click **Generate Token** → select your app → enable `instagram_basic`, `instagram_manage_messages`, and `pages_messaging` permissions.
5. Copy the generated token — you will not be able to view it again.

---

## Step 4 — Connect from VocUI

1. In your VocUI dashboard, open the chatbot you want to deploy to Instagram.
2. Go to **Deploy** → **Instagram** tab.
3. Enter your **Instagram Account ID** and **Access Token**.
4. Optionally enter your **Username** for display purposes.
5. Click **Connect to Instagram**.

After connecting, the dashboard displays your **Webhook URL**.

---

## Step 5 — Configure the Webhook in Meta

VocUI uses a single app-level webhook for all Instagram integrations:

1. In your Meta App, go to **Instagram** → **Settings** (or **Webhooks**) in the left sidebar.
2. Under **Webhooks**, click **Add Callback URL**.
3. Set the **Callback URL** to: `https://vocui.com/api/instagram/webhook`
4. Set the **Verify Token** to the value of your `META_INSTAGRAM_VERIFY_TOKEN` environment variable (set by your VocUI administrator).
5. Click **Verify and Save**.
6. Under **Webhook Fields**, enable the **messages** field.
7. Subscribe the webhook to your Instagram account.

---

## Step 6 — Enable AI Responses

After connecting, toggle **AI Responses** on in the Instagram section of the deploy page.

---

## Step 7 — Test the Integration

1. Send a Direct Message to your Instagram account from a personal account.
2. The chatbot should reply within a few seconds using your knowledge base.

> Note: Story replies and story mentions are separate event types and are not handled by the current integration (text DMs only).

---

## Troubleshooting

**"Instagram integration requires a Pro or Agency plan"**
Upgrade your VocUI plan before connecting.

**Webhook verification fails**
- Confirm the Callback URL is exactly `https://vocui.com/api/instagram/webhook` (no trailing slash)
- Confirm the Verify Token matches the `META_INSTAGRAM_VERIFY_TOKEN` environment variable

**Bot doesn't respond to DMs**
- Check that **AI Responses** is toggled on in the Instagram tab
- Verify the **messages** webhook field is subscribed
- Confirm your account is a Professional account connected to a Facebook Page
- Confirm the access token has `instagram_manage_messages` permission

**Duplicate replies**
VocUI deduplicates incoming webhooks automatically using the message ID.
