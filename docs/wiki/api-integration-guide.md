---
title: API Integration Guide
description: Learn how to integrate with the VocUI API programmatically for custom implementations and server-side integrations
category: api-integration
order: 1
---

# API Integration Guide

Use the API to build custom integrations, server-side chatbots, and programmatic workflows.

## Overview

The API provides endpoints for:

- **Chat Completions** — Send messages and receive AI responses
- **Chatbot Management** — Create, update, and configure chatbots
- **Knowledge Base** — Add and manage knowledge sources
- **Conversations** — Retrieve conversation history and messages
- **Analytics** — Access chatbot performance data
- **Leads** — Retrieve collected lead data
- **Sentiment** — Access sentiment analysis results
- **Escalations** — Manage escalation reports

## Authentication

All API requests require authentication via a session cookie (browser) or an API key.

### API Keys

API keys are scoped per-chatbot and created from the **Deploy** page:

1. Go to **Dashboard > Chatbots > [Your Chatbot] > Deploy**
2. Scroll to the **API Keys** section
3. Click **Create API Key**
4. Give it a name and copy the key (shown only once)

### Using Your API Key

```bash
curl https://your-domain.com/api/chat/CHATBOT_ID \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

**Security:**
- Never expose API keys in client-side code
- Use environment variables on your server
- Each key is tied to a specific chatbot

## Chat API

### Send a Message

**Endpoint:** `POST /api/chat/{chatbotId}`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The visitor's message (1–10,000 chars) |
| `stream` | boolean | No | Enable streaming response (default: `false`) |
| `session_id` | string | No | Session identifier (max 100 chars) |
| `visitor_id` | string | No | Visitor identifier for memory (max 100 chars) |
| `welcome_message` | string | No | Override the welcome message for this session |
| `proactive_message` | string | No | Proactive message that triggered this conversation |
| `user_data` | Record\<string, string\> | No | Authenticated user profile data (string values only) |
| `user_context` | Record\<string, unknown\> | No | Account-specific context data (orders, billing, etc.) |
| `attachments` | array | No | File attachments (see below) |

**Attachment Schema:**

```json
{
  "url": "https://...",
  "file_name": "document.pdf",
  "file_type": "application/pdf",
  "file_size": 12345
}
```

**Example Request:**

```json
{
  "message": "What are your business hours?",
  "session_id": "session_abc123",
  "visitor_id": "visitor_xyz789",
  "stream": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "We're open Monday-Friday, 9am-5pm EST.",
  "conversation_id": "conv_123",
  "message_id": "msg_456"
}
```

### Streaming Responses

Set `stream: true` to receive a streaming SSE response:

```javascript
const response = await fetch('/api/chat/CHATBOT_ID', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Tell me about your products',
    session_id: 'session_abc123',
    stream: true,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      process.stdout.write(data.content);
    }
  }
}
```

### With User Data

Pass authenticated user data for personalized responses:

```json
{
  "message": "What's my order status?",
  "session_id": "session_abc123",
  "visitor_id": "user_123",
  "user_data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "plan": "Pro"
  },
  "user_context": {
    "recent_orders": [
      {
        "id": "ORD-001",
        "status": "shipped",
        "tracking": "TRK123456"
      }
    ]
  }
}
```

> **Note:** `user_data` values must be strings. Use `user_context` for complex/nested data structures.

See [Passing User Data to Chatbot](passing-user-data-to-chatbot) for detailed examples.

### Rate Limiting

The Chat API is rate limited to **30 requests per minute** per IP address per chatbot. Requests exceeding this limit receive a `429 Too Many Requests` response.

## Chatbot Management API

All management endpoints require session authentication (browser cookie).

### List Chatbots

**Endpoint:** `GET /api/chatbots`

**Response:**

```json
{
  "success": true,
  "data": {
    "chatbots": [
      {
        "id": "chatbot_123",
        "name": "Support Bot",
        "status": "active",
        "is_published": true,
        "total_conversations": 150,
        "total_messages": 1200,
        "created_at": "2026-03-01T10:00:00Z"
      }
    ]
  }
}
```

### Create Chatbot

**Endpoint:** `POST /api/chatbots`

**Request:**

```json
{
  "name": "Sales Bot",
  "description": "Helps customers find products",
  "system_prompt": "You are a sales assistant helping customers find the right product.",
  "model": "balanced",
  "temperature": 0.7,
  "language": "en",
  "memory_enabled": true,
  "memory_days": 30,
  "welcome_message": "Hi! How can I help you today?"
}
```

**Notes:**
- `model` is a tier string: `fast`, `balanced`, or `powerful` — not a raw model name
- `temperature` ranges from 0 to 2
- `max_tokens` ranges from 100 to 4096

### Get Chatbot

**Endpoint:** `GET /api/chatbots/{id}`

### Update Chatbot

**Endpoint:** `PATCH /api/chatbots/{id}`

All fields are optional. Only include the fields you want to change:

```json
{
  "system_prompt": "Updated prompt...",
  "temperature": 0.8,
  "memory_enabled": false,
  "widget_config": {
    "primaryColor": "#7c3aed",
    "fontFamily": "Poppins, system-ui, sans-serif"
  }
}
```

Widget config is merged with existing values — you only need to send the fields you want to change.

### Delete Chatbot

**Endpoint:** `DELETE /api/chatbots/{id}`

Permanently deletes the chatbot and all related data (knowledge sources, conversations, messages, etc.).

### Publish / Unpublish

**Endpoint:** `POST /api/chatbots/{id}/publish`

Toggles the chatbot's published state. Only published chatbots respond to widget and API chat requests.

## Knowledge Base API

### List Knowledge Sources

**Endpoint:** `GET /api/chatbots/{id}/knowledge`

**Response:**

```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "id": "src_789",
        "type": "url",
        "name": "FAQ Page",
        "status": "completed",
        "chunks_count": 42,
        "url": "https://example.com/faq",
        "created_at": "2026-03-15T10:00:00Z"
      }
    ]
  }
}
```

### Add Knowledge Source

**Endpoint:** `POST /api/chatbots/{id}/knowledge`

**Source Types:**

#### URL Source

```json
{
  "type": "url",
  "name": "FAQ Page",
  "url": "https://example.com/faq",
  "crawl": false,
  "maxPages": 25
}
```

Set `crawl: true` to follow links and import multiple pages. `maxPages` limits crawl depth (1–100, default 25).

#### Text Source

```json
{
  "type": "text",
  "name": "Company Policies",
  "content": "Our return policy allows returns within 30 days..."
}
```

Content max: 50,000 characters.

#### Q&A Pair

```json
{
  "type": "qa_pair",
  "name": "Business Hours",
  "question": "What are your business hours?",
  "answer": "We're open Monday-Friday, 9am-5pm EST."
}
```

### Get Knowledge Source

**Endpoint:** `GET /api/chatbots/{id}/knowledge/{sourceId}`

### Delete Knowledge Source

**Endpoint:** `DELETE /api/chatbots/{id}/knowledge/{sourceId}`

Permanently removes the source and all its embedded chunks.

## Conversations API

### List Conversations

**Endpoint:** `GET /api/chatbots/{id}/conversations`

**Query Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | 50 | Number of conversations to return |
| `offset` | 0 | Pagination offset |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "conv_123",
      "session_id": "session_abc",
      "visitor_id": "visitor_xyz",
      "channel": "widget",
      "message_count": 8,
      "status": "active",
      "created_at": "2026-03-15T09:00:00Z",
      "last_message_at": "2026-03-15T09:15:00Z"
    }
  ]
}
```

### Get Conversation with Messages

**Endpoint:** `GET /api/chatbots/{id}/conversations?conversationId={conversationId}`

Pass `conversationId` as a query parameter to get a specific conversation and all its messages:

```json
{
  "success": true,
  "data": {
    "conversation": { ... },
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "What are your business hours?",
        "created_at": "2026-03-15T09:00:00Z"
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "We're open Monday-Friday, 9am-5pm EST.",
        "created_at": "2026-03-15T09:00:05Z"
      }
    ]
  }
}
```

## Other API Endpoints

### Leads

**Endpoint:** `GET /api/chatbots/{id}/leads`

Returns pre-chat form submissions with visitor name, email, and custom fields.

### Escalations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/chatbots/{id}/escalations` | GET | List all escalation reports |
| `PATCH /api/chatbots/{id}/escalations/{escalationId}` | PATCH | Update escalation status |

### Sentiment

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/chatbots/{id}/sentiment` | GET | Get sentiment analysis results |
| `POST /api/chatbots/{id}/sentiment/analyze` | POST | Run sentiment analysis on unanalyzed conversations |
| `GET /api/chatbots/{id}/sentiment/export` | GET | Export sentiment data as CSV |

### Surveys

**Endpoint:** `GET /api/chatbots/{id}/surveys`

Returns post-chat survey responses with ratings and answers.

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/chatbots/{id}/analytics` | GET | Get analytics summary |
| `GET /api/chatbots/{id}/analytics/export` | GET | Export analytics as CSV |

### Performance

**Endpoint:** `GET /api/chatbots/{id}/performance`

Returns response latency data with pipeline stage breakdowns.

## Widget Endpoints (Public)

These endpoints are called by the chat widget and don't require session auth (they use the chatbot ID for identification):

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/widget/{chatbotId}/config` | GET | Get widget configuration |
| `/api/widget/{chatbotId}/history` | GET | Get chat history for a session |
| `/api/widget/{chatbotId}/upload` | POST | Upload a file attachment |
| `/api/widget/{chatbotId}/handoff` | GET/POST | Check/initiate live handoff |
| `/api/widget/{chatbotId}/feedback` | POST | Submit thumbs up/down feedback |

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Invalid chatbot ID",
  "code": "CHATBOT_NOT_FOUND"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions or plan limit reached |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests (30/min for chat) |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Retry Logic

```javascript
async function apiRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429) {
        const waitMs = Math.min(1000 * Math.pow(2, i), 30000);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Example: Custom Chat Integration

```javascript
// Server-side Node.js example
const CHATBOT_ID = 'your-chatbot-id';
const API_KEY = 'your-api-key';
const BASE_URL = 'https://your-domain.com';

async function sendMessage(message, sessionId, visitorId) {
  const response = await fetch(`${BASE_URL}/api/chat/${CHATBOT_ID}`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      visitor_id: visitorId,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.message;
}

// Usage
const reply = await sendMessage('What are your hours?', 'session_1', 'user_123');
console.log(reply);
```

## Example: Streaming Chat

```javascript
async function streamMessage(message, sessionId) {
  const response = await fetch(`${BASE_URL}/api/chat/${CHATBOT_ID}`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      stream: true,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          fullResponse += data.content || '';
          process.stdout.write(data.content || '');
        } catch {}
      }
    }
  }

  return fullResponse;
}
```

## Best Practices

### Session Management

- Use consistent session IDs for related messages within a conversation
- Include visitor IDs to enable conversation memory and personalization
- Sessions expire based on the chatbot's `session_ttl_hours` setting

### Security

- Never expose API keys in client-side code
- Use the Chat API from your server for custom integrations
- The widget endpoints are designed for browser use and have CORS restrictions

### Performance

- Use streaming (`stream: true`) for better perceived latency
- Reuse session IDs to maintain conversation context
- Monitor your chatbot's Performance dashboard for latency insights

## Next Steps

- [Passing User Data to Chatbot](passing-user-data-to-chatbot) — Personalize API responses
- [Chatbot Memory & Identity Verification](chatbot-memory-verification) — Enable memory in API calls
- [Deploying Your Chatbot](deploying-your-chatbot) — Widget and iframe deployment options
