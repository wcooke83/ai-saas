---
title: Setting Up the Slack Integration
description: How to create a Slack App, configure OAuth and event subscriptions, and connect your VocUI chatbot to a Slack workspace.
category: Integrations
order: 1
---

## Overview

The Slack integration lets your team query a VocUI chatbot directly from Slack — via @mentions in channels or direct messages. The bot searches your chatbot's knowledge base and replies in-thread.

**Requirements:** A Pro plan or higher. Free plan users will see an upgrade prompt when attempting to connect.

---

## Step 1 — Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and sign in with your Slack account.
2. Click **Create New App** → select **From scratch**.
3. Give the app a name (e.g. `VocUI Bot`) and select the workspace you want to test with.
4. Click **Create App**.

---

## Step 2 — Configure OAuth & Permissions

1. In your app's settings, go to **OAuth & Permissions** in the left sidebar.
2. Under **Redirect URLs**, click **Add New Redirect URL** and add:
   - For local development: `http://localhost:3030/api/chatbots`
   - For production: `https://vocui.com/api/chatbots`

   > Slack uses subdirectory matching — registering the base path covers all chatbot-specific callback URLs like `/api/chatbots/abc123/integrations/slack/callback`.

3. Click **Save URLs**.

4. Under **Bot Token Scopes**, add the following scopes:

   | Scope | Purpose |
   |---|---|
   | `app_mentions:read` | Receive @mention events |
   | `channels:history` | Read messages in public channels |
   | `channels:read` | List channels |
   | `chat:write` | Send messages as the bot |
   | `im:history` | Read direct messages |
   | `im:read` | Access DM channel info |
   | `im:write` | Send direct messages |
   | `users:read` | Look up user info |

---

## Step 3 — Enable Event Subscriptions

1. Go to **Event Subscriptions** in the left sidebar and toggle **Enable Events** on.
2. Set the **Request URL** to your app's webhook endpoint:
   - For local development (requires a tunnel like ngrok): `https://your-tunnel.ngrok.io/api/webhooks/slack`
   - For production: `https://vocui.com/api/webhooks/slack`

   > Slack will send a challenge request to verify the URL. VocUI's webhook handler responds to this automatically.

3. Under **Subscribe to bot events**, add:
   - `app_mention` — triggers when the bot is @mentioned in a channel
   - `message.im` — triggers when a user DMs the bot

4. Click **Save Changes**.

---

## Step 4 — Copy Your Credentials

1. Go to **Basic Information** in the left sidebar.
2. Under **App Credentials**, copy:
   - **Client ID**
   - **Client Secret**
   - **Signing Secret**

3. Add these to your `.env.local` file:

```bash
SLACK_CLIENT_ID=your_client_id_here
SLACK_CLIENT_SECRET=your_client_secret_here
SLACK_SIGNING_SECRET=your_signing_secret_here
```

Restart your dev server after adding these.

---

## Step 5 — Connect from VocUI

1. In your VocUI dashboard, open the chatbot you want to deploy to Slack.
2. Go to **Deploy** → **Slack** tab.
3. Click **Connect to Slack**.
4. You'll be redirected to Slack's OAuth page — authorise the app for your workspace.
5. After authorising, you'll be redirected back and see a **Connected** status with your workspace name.

---

## Step 6 — Test the Bot

1. Install the app to your workspace if you haven't already (**OAuth & Permissions** → **Install to Workspace**).
2. Invite the bot to a channel: `/invite @YourBotName`
3. @mention the bot with a question: `@YourBotName what is our refund policy?`
4. The bot will reply in-thread using your chatbot's knowledge base.

You can also DM the bot directly without needing to @mention it.

---

## Troubleshooting

**"Slack integration requires a Pro plan or higher"**
Upgrade your VocUI plan to Pro or higher before connecting.

**"Sorry, this chatbot has reached its message limit."**
Your chatbot has used its monthly message allocation. Purchase additional credits or wait for the monthly reset.

**Bot doesn't respond to messages**
- Check that the bot is invited to the channel (`/invite @BotName`)
- Verify the **Request URL** in Event Subscriptions is reachable and shows a green tick
- For local dev, ensure your ngrok tunnel is running and pointing to port 3030

**OAuth error after authorising**
- Check that `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET` are set correctly in your environment
- Verify the redirect URL in your Slack App settings includes `http://localhost:3030/api/chatbots` (or your production domain)
