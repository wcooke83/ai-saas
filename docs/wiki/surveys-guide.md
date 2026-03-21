---
title: Post-Chat Surveys
description: Learn how to configure post-chat surveys, collect visitor feedback, and analyze rating data
category: chatbot-features
order: 8
---

# Post-Chat Surveys

Collect structured feedback from visitors after their chatbot conversation ends.

## Overview

Post-chat surveys appear automatically when a conversation ends. Visitors can rate their experience, answer custom questions, or provide freeform feedback — giving you actionable data to improve your chatbot.

## Setting Up a Survey

1. Go to your chatbot's **Settings** page
2. Scroll to the **Post-Chat Survey** section
3. Toggle it **on**
4. Configure your questions

### Question Types

| Type | Description | Example |
|------|-------------|---------|
| **Rating** | 1-5 star rating | "How would you rate your experience?" |
| **Text** | Open-ended text input | "Any additional feedback?" |
| **Select** | Single choice from options | "What brought you here today?" |
| **Multi-select** | Multiple choices | "Which topics were discussed?" |

### Configuration Options

- **Title** — Header text shown above the survey (e.g., "How did we do?")
- **Description** — Subtext explaining the survey purpose
- **Required** — Whether the visitor must complete the survey or can skip it
- **Questions** — Add, reorder, and configure individual questions

## Viewing Results

Navigate to the **Surveys** page from your chatbot's dashboard.

### Stats Cards

- **Total Responses** — Number of completed survey submissions
- **Average Rating** — Mean star rating across all responses (1-5 scale)
- **Recent (7 days)** — Responses collected in the past week
- **Survey Status** — Whether the survey is currently active or disabled

### Rating Distribution

When survey responses include a rating question, a bar chart shows how many visitors gave each star rating (1-5). This helps you quickly see:

- Whether ratings skew positive or negative
- If there's a common "default" rating
- How the distribution changes over time (use the date filter)

### Responses Table

The table shows individual responses with:

- **Date** — When the survey was submitted
- **Session** — Linked chat session ID
- **Rating** — Star rating if a rating question was included
- **Responses** — Preview of answer text

Click any row to see the full response details in a dialog.

### Date Range Filter

Use the date range buttons to filter responses:

- **7d** — Last 7 days
- **30d** — Last 30 days
- **90d** — Last 90 days
- **All** — All time

### Exporting

Click **Export** to download responses as a CSV file. The export includes:

- Submission date
- Session ID
- All question responses as separate columns

## Best Practices

### Keep It Short

- 1-2 questions is ideal — long surveys get skipped
- Always include a rating question for trackable metrics
- Make text questions optional to reduce friction

### Act on Feedback

- Check the **Rating Distribution** regularly for trends
- Read low-rated responses to identify common complaints
- Use feedback to update your knowledge base and system prompt
- Compare ratings before and after making chatbot improvements

### When Surveys Appear

The survey is shown when:
- The visitor explicitly ends the conversation
- The conversation times out after inactivity
- The visitor closes and reopens the widget (if configured)

Visitors can **skip** the survey unless you've marked all questions as required.
