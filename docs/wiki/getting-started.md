---
title: Getting Started
description: A quick-start guide to setting up your first chatbot, connecting a knowledge base, and deploying it on your website
category: getting-started
order: 1
---

# Getting Started

This guide walks you through creating your first chatbot, training it with your content, and embedding it on your website.

## 1. Create a Chatbot

1. Navigate to **Dashboard > Chatbots** and click **New Chatbot**.
2. Give it a name and optional description.
3. Write a **system prompt** — this tells the chatbot how to behave. For example:

```
You are a friendly customer support agent for Acme Corp.
Answer questions about our products, pricing, and shipping policies.
If you don't know the answer, politely direct the user to email support@acme.com.
```

4. Choose a **language** for the widget UI text (English, Spanish, French, etc.).
5. Click **Create**.

## 2. Add Knowledge Sources

Your chatbot can only answer questions about content it has been trained on.

1. Go to the **Knowledge** page from your chatbot's dashboard.
2. Click **Add Source** and choose a method:
   - **URL** — Paste a webpage URL. Enable **Crawl** to follow links and import multiple pages.
   - **Text** — Paste raw text content directly.
   - **Q&A** — Add specific question-and-answer pairs for precise responses.
3. Click **Process** to chunk and embed the content.
4. Wait for the status to change to **Success**.

> **Tip:** Add your FAQ page, product docs, and pricing page for the best coverage.

## 3. Configure Settings

Go to **Settings** to fine-tune your chatbot:

| Setting | What It Does |
|---------|-------------|
| **Welcome Message** | The first message visitors see when they open the chat |
| **Pre-Chat Form** | Collect visitor name and email before the conversation starts |
| **Post-Chat Survey** | Gather feedback after the conversation ends |
| **Memory** | Remember returning visitors across sessions |
| **Model Tier** | Choose between Fast, Balanced, or Powerful AI models |
| **Prompt Protection** | Block attempts to override the system prompt |
| **File Uploads** | Let visitors upload images, documents, and other files |
| **Proactive Messages** | Trigger automated messages based on visitor behavior |
| **Transcript Email** | Let visitors receive a copy of the conversation via email |
| **Escalation Reporting** | Enable the report button for visitors to flag issues |
| **Live Handoff** | Connect to Telegram for real-time human agent support |

> **Tip:** The Settings page has many more options including temperature, max tokens, session TTL, allowed origins, and more. Explore each section to fine-tune your chatbot.

## 4. Customize the Widget

Go to the **Customize** page to match your brand:

- Set your **brand colors** for the header, buttons, and message bubbles
- Choose a **font family** from 25+ options
- Adjust the **widget position** (any corner of the screen)
- Configure **auto-open** behavior and sound notifications

The live preview updates in real-time as you make changes.

## 5. Test Your Chatbot

Before deploying, test your chatbot:

1. Click **Publish** on your chatbot's dashboard to make it live.
2. Go to the **Deploy** page for a preview link you can open in a new tab.
3. Try asking questions that your knowledge base should be able to answer.
4. Check that the welcome message, colors, and form all look correct.

## 6. Deploy to Your Website

Go to **Deploy** and copy the embed code:

```html
<script
  src="https://your-domain.com/widget/sdk.js"
  data-chatbot-id="your-chatbot-id"
  async
></script>
```

Paste this snippet before the closing `</body>` tag on any page where you want the chatbot to appear.

## Next Steps

- [Pass user data to your chatbot](passing-user-data-to-chatbot) for personalized conversations
- [Set up conversation memory](chatbot-memory-verification) to remember returning visitors
- [Customize the widget appearance](customizing-widget-appearance) in detail
- [Connect Telegram for live handoff](telegram-live-handoff) to human agents
- [Set up proactive messages](proactive-messages-guide) to engage visitors automatically
- [Enable file uploads](file-upload-guide) so visitors can share files in chat
