---
title: Performance Dashboard
description: Monitor chatbot response times with pipeline waterfall visualization and latency metrics
category: chatbot-features
order: 13
---

# Performance Dashboard

Monitor your chatbot's response latency with detailed pipeline breakdowns.

## Overview

The Performance dashboard shows how long each stage of the response pipeline takes, from loading the chatbot configuration to completing the AI response stream. Use it to identify bottlenecks and optimize response times.

Navigate to the **Performance** tab from your chatbot's dashboard to access it.

## Pipeline Stages

Every chatbot response passes through a series of stages. The dashboard tracks timing for each:

| Stage | Description |
|-------|-------------|
| **Load Chatbot** | Fetch chatbot config, system prompt, and knowledge source metadata from the database |
| **Validate & Parse** | Validate the incoming request and parse parameters |
| **Get Conversation** | Find or create the conversation record and load visitor session context |
| **Pipeline Setup** | Initialize the response pipeline |
| **Get History** | Load recent message history (runs in parallel) |
| **Save Message** | Persist the incoming user message (runs in parallel) |
| **Check Handoff** | Check live agent handoff status (runs in parallel) |
| **Process Attachments** | Handle any file attachments on the message |
| **RAG: Embedding** | Generate a vector embedding of the user's message via the OpenAI embeddings API |
| **RAG: Similarity Search** | Query pgvector for the most relevant knowledge chunks using cosine similarity |
| **RAG: Live Fetch** | Fetch live content from URLs when knowledge chunks have low confidence (only triggered when similarity scores are below threshold) |
| **RAG: Formatting** | Format retrieved chunks into context for the prompt |
| **Lead Lookup** | Look up visitor/lead information (runs in parallel with RAG) |
| **Memory Fetch** | Fetch conversation memory for returning visitors (runs in parallel with RAG) |
| **Build Prompts** | Assemble the system prompt, inject knowledge context, memory, and message history |
| **First Token (TTFT)** | Time from sending the request to the AI model until the first response token arrives |
| **Stream Complete** | Time from first token until the full response finishes streaming |

Some stages run in parallel. The dashboard groups them visually:

- **Group 1**: Get History + Save Message + Check Handoff
- **Group 2**: RAG stages + Lead Lookup + Memory Fetch

## Waterfall Visualization

Each request in the recent requests list can be expanded to show a **pipeline waterfall** — a horizontal bar chart similar to browser network waterfalls. Each stage is a colored bar positioned on a timeline:

- **Bar position** shows when the stage started and ended relative to request start
- **Bar length** shows the stage duration
- **Parallel stages** overlap horizontally, making it clear which work happens concurrently
- **Indented rows** indicate stages running inside a parallel group

Hover over any bar to see the exact duration in milliseconds.

## Metrics

### Averages Card

Shows the mean duration for each pipeline stage across all requests in the selected time range.

### P95 Total

The 95th-percentile total response time. This tells you the worst-case latency that 95% of your requests fall within — more useful than averages for understanding real user experience.

### Per-Request Details

Each row in the recent requests table shows:

- **Timestamp** — When the request was processed
- **Model** — Which AI model handled the request
- **Total time** — End-to-end response time in milliseconds
- **RAG chunks** — Number of knowledge chunks retrieved
- **RAG confidence** — Similarity score of retrieved chunks
- **Live fetch** — Whether a live URL fetch was triggered
- **Message/response length** — Character counts for input and output
- **Streaming** — Whether the response was streamed

Click a row to expand the waterfall view and see the message/response preview.

## Filtering

Use the filter bar at the top to narrow results:

| Filter | Options |
|--------|---------|
| **Date range** | Select a start date, or use preset day ranges |
| **Model** | Filter by specific AI model (populated from your actual usage) |
| **Live fetch** | Show only requests where live fetch was triggered |

## Pagination

Results are paginated at 50 rows per page. Use the pagination controls at the bottom to navigate.

## Best Practices

### Identify Bottlenecks

- If **RAG: Embedding** is slow, your embedding API calls may be throttled. Check your OpenAI rate limits.
- If **RAG: Similarity Search** is slow, consider tuning your pgvector index or reducing the number of chunks searched.
- If **RAG: Live Fetch** appears frequently, your knowledge base may have gaps. Add more knowledge sources to avoid low-confidence fallbacks.
- If **First Token (TTFT)** is high, try switching to a faster model tier or reducing the prompt size.

### Monitor P95

Average response times can hide outliers. The P95 metric shows what your slowest 5% of responses look like. Aim to keep P95 under an acceptable threshold for your use case.

### Reduce Live Fetch Triggers

Live fetch is the most variable and often slowest stage. Reduce how often it triggers by:

- Adding more comprehensive knowledge sources
- Adjusting the `live_fetch_threshold` on your chatbot settings
- Ensuring knowledge chunks have good coverage of common questions
