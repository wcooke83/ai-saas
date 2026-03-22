---
title: Analytics Dashboard
description: Track chatbot usage with conversation counts, visitor metrics, satisfaction rates, and daily trends
category: chatbot-features
order: 14
---

# Analytics Dashboard

Track your chatbot's usage and engagement over time.

## Overview

The Analytics dashboard gives you a high-level view of how your chatbot is performing: how many conversations are happening, how many visitors are engaging, and how satisfied they are. Use it to spot trends and measure the impact of changes to your chatbot.

Navigate to the **Analytics** tab from your chatbot's dashboard.

## Stats Cards

Four summary cards appear at the top of the page:

| Metric | Description |
|--------|-------------|
| **Total Conversations** | Number of distinct chat sessions in the selected date range |
| **Total Messages** | Combined count of user and bot messages |
| **Unique Visitors** | Number of distinct visitors who started a conversation |
| **Satisfaction Rate** | Percentage of positive ratings (thumbs up) out of all rated messages |

## Daily Charts

Below the stats cards, two bar charts show daily trends:

- **Conversations Over Time** — Number of new conversations started each day
- **Messages Over Time** — Total messages exchanged each day

Days with no activity show as empty bars. The charts fill in missing days automatically so the timeline is continuous.

## Insights Panel

The insights section provides additional context:

| Insight | Description |
|---------|-------------|
| **Avg. Messages/Conv** | Average number of messages per conversation. Higher values may indicate engaged users or a chatbot that takes many turns to resolve questions. |
| **Daily Average** | Average conversations per day across the selected range |
| **Message Growth** | Activity status indicator |
| **Engagement Trend** | Trend direction indicator |

## Date Range Filter

Use the segmented control in the top-right to switch between time ranges:

| Range | Period |
|-------|--------|
| **7d** | Last 7 days |
| **30d** | Last 30 days (default) |
| **90d** | Last 90 days |

Changing the range reloads all stats, charts, and insights for the new period.

## Exporting Data

Click the **Export** button to download analytics as a CSV file. The export covers the currently selected date range and includes daily breakdowns of conversations and messages.

The downloaded file is named `chatbot-analytics-{id}-{days}days.csv`.

## Best Practices

### Track Trends, Not Snapshots

- Check analytics weekly to spot trends in conversation volume and satisfaction
- A sudden spike in conversations may indicate a new traffic source or a problem driving users to seek help
- Declining satisfaction rates are an early warning to review recent chatbot changes

### Use Date Ranges Strategically

- **7d** for checking the impact of recent changes (new knowledge sources, prompt updates)
- **30d** for a monthly review of chatbot health
- **90d** for quarterly planning and identifying long-term trends

### Improve Satisfaction Rate

- Review conversations with low ratings in the **Conversations** tab
- Check the **Escalations** page for patterns in reported issues
- Update your knowledge base to address common questions that the chatbot struggles with
- Refine the system prompt based on feedback patterns
