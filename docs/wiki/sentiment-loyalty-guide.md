---
title: Sentiment & Loyalty Analysis
description: Understand how AI-powered sentiment analysis and visitor loyalty tracking work for your chatbot conversations
category: chatbot-features
order: 6
---

# Sentiment & Loyalty Analysis

Track how your visitors feel about their chatbot interactions and monitor loyalty trends over time.

## Overview

The Sentiment & Loyalty page provides AI-powered analysis of your chatbot conversations. It answers two key questions:

1. **Sentiment** — How did each conversation go? Was the visitor satisfied?
2. **Loyalty** — Are returning visitors becoming more or less engaged over time?

## Sentiment Analysis

### How It Works

Sentiment analysis uses AI to evaluate the tone and outcome of each conversation:

1. A conversation must have **at least 2 messages** to be analyzed
2. Click **Analyze** to process unanalyzed conversations
3. The AI reads the full conversation and assigns:
   - A **score** from 1 to 5 (1 = very negative, 5 = very positive)
   - A **label**: Very Positive, Positive, Neutral, Negative, or Very Negative
   - A **summary** describing the conversation outcome

### Score Thresholds

| Score | Label | Meaning |
|-------|-------|---------|
| 4.5 - 5.0 | Very Positive | Visitor's issue was fully resolved, expressed gratitude |
| 3.5 - 4.4 | Positive | Helpful interaction, visitor seemed satisfied |
| 2.5 - 3.4 | Neutral | Functional exchange, no strong positive or negative signals |
| 1.5 - 2.4 | Negative | Visitor showed frustration or issue wasn't resolved |
| 1.0 - 1.4 | Very Negative | Visitor was clearly unhappy, conversation went poorly |

### Stats Dashboard

The stats cards at the top show:

- **Avg. Sentiment** — Mean score across all analyzed conversations
- **Positive %** — Conversations rated positive or very positive
- **Neutral %** — Conversations with no strong sentiment
- **Negative %** — Conversations rated negative or very negative

## Loyalty Tracking

### How It Works

Loyalty tracking identifies **returning visitors** and measures their engagement over multiple sessions:

- Visitors are tracked by their email (from the pre-chat form) or browser session
- Each visitor's sessions are aggregated to calculate loyalty metrics
- Loyalty is only shown for visitors with **2 or more sessions**

### Loyalty Score

The loyalty score (1-5) is calculated based on:

- **Visit frequency** — How often the visitor returns
- **Average sentiment** — Their typical conversation quality
- **Total sessions** — Overall engagement level

### Loyalty Trend

The trend indicator shows whether a visitor's engagement is:

- **Improving** (green arrow up) — Recent sessions have better sentiment than older ones
- **Declining** (red arrow down) — Recent sessions show worse sentiment
- **Stable** (gray dash) — No significant change in sentiment over time

## Using the Data

### Identifying Issues

- A sudden drop in average sentiment may indicate a knowledge gap or broken feature
- High negative percentage → Review negative conversations to find common complaints
- Declining loyalty → Returning visitors are having worse experiences over time

### Improving Performance

1. **Review negative conversations** — Read the AI summaries to spot patterns
2. **Update knowledge base** — Add content for topics causing frustration
3. **Refine system prompt** — Adjust behavior for common pain points
4. **Add Q&A pairs** — Create precise answers for frequently failed questions

### Exporting Data

Click **Export CSV** to download all sentiment and loyalty data. The export includes:

- Conversation date and visitor ID
- Sentiment score, label, and summary
- Loyalty score, trend, and session count
- Message count per conversation

Use this data for reporting, further analysis, or integration with other tools.

## Running Analysis

- Analysis is **not automatic** — click the **Analyze** button to process new conversations
- Only conversations with 2+ messages and no existing analysis are processed
- Each analysis uses AI credits from your plan
- You can re-run analysis at any time to process newly completed conversations
