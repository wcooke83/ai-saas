---
title: API Integration Guide
description: Learn how to integrate with the AI SaaS API programmatically for custom implementations and server-side integrations
category: api-integration
order: 1
---

# API Integration Guide

Use the AI SaaS API to build custom integrations, server-side chatbots, and programmatic workflows.

## Overview

The API provides endpoints for:

- **Chat Completions** — Send messages and receive AI responses
- **Chatbot Management** — Create, update, and configure chatbots
- **Knowledge Base** — Upload and manage documents
- **Conversation History** — Retrieve past conversations
- **Usage Tracking** — Monitor API usage and costs

## Authentication

All API requests require an API key in the `Authorization` header.

### Getting Your API Key

1. Go to **Dashboard → API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "Production Server")
4. Copy the key (shown only once)
5. Store it securely

### Using Your API Key

```bash
curl https://your-domain.com/api/chat/chatbot_123 \
  -H "Authorization: Bearer sk_live_abc123..." \
  -H "Content-Type: application/json"
```

**Security:**
- ⚠️ Never expose API keys in client-side code
- ✅ Use environment variables
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/staging/production

## Chat API

### Send a Message

**Endpoint:** `POST /api/chat/{chatbotId}`

**Request:**
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

For real-time streaming responses:

```javascript
const response = await fetch('/api/chat/chatbot_123', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_abc123...',
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
      console.log(data.content); // Stream content
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

## Chatbot Management API

### List Chatbots

**Endpoint:** `GET /api/chatbots`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "chatbot_123",
      "name": "Support Bot",
      "system_prompt": "You are a helpful support assistant...",
      "language": "en",
      "memory_enabled": true,
      "created_at": "2026-03-01T10:00:00Z"
    }
  ]
}
```

### Create Chatbot

**Endpoint:** `POST /api/chatbots`

**Request:**
```json
{
  "name": "Sales Bot",
  "system_prompt": "You are a sales assistant helping customers find the right product.",
  "language": "en",
  "model": "gpt-4",
  "temperature": 0.7,
  "memory_enabled": true,
  "memory_days": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chatbot_456",
    "name": "Sales Bot",
    "created_at": "2026-03-15T14:30:00Z"
  }
}
```

### Update Chatbot

**Endpoint:** `PATCH /api/chatbots/{chatbotId}`

**Request:**
```json
{
  "system_prompt": "Updated prompt...",
  "temperature": 0.8,
  "memory_enabled": false
}
```

### Delete Chatbot

**Endpoint:** `DELETE /api/chatbots/{chatbotId}`

**Response:**
```json
{
  "success": true,
  "message": "Chatbot deleted successfully"
}
```

## Knowledge Base API

### Upload Document

**Endpoint:** `POST /api/chatbots/{chatbotId}/documents`

**Request (multipart/form-data):**
```bash
curl -X POST https://your-domain.com/api/chatbots/chatbot_123/documents \
  -H "Authorization: Bearer sk_live_abc123..." \
  -F "file=@product-guide.pdf" \
  -F "title=Product Guide" \
  -F "description=Complete product documentation"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc_789",
    "title": "Product Guide",
    "status": "processing",
    "chunks": 0
  }
}
```

### List Documents

**Endpoint:** `GET /api/chatbots/{chatbotId}/documents`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc_789",
      "title": "Product Guide",
      "status": "ready",
      "chunks": 42,
      "created_at": "2026-03-15T10:00:00Z"
    }
  ]
}
```

### Delete Document

**Endpoint:** `DELETE /api/chatbots/{chatbotId}/documents/{documentId}`

## Conversation History API

### List Conversations

**Endpoint:** `GET /api/chatbots/{chatbotId}/conversations`

**Query Parameters:**
- `limit` — Number of conversations (default: 50, max: 100)
- `offset` — Pagination offset
- `status` — Filter by status: `active`, `archived`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv_123",
      "visitor_id": "visitor_xyz789",
      "message_count": 8,
      "status": "active",
      "created_at": "2026-03-15T09:00:00Z",
      "last_message_at": "2026-03-15T09:15:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

### Get Conversation Messages

**Endpoint:** `GET /api/conversations/{conversationId}/messages`

**Response:**
```json
{
  "success": true,
  "data": [
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
```

## Usage Tracking API

### Get Usage Stats

**Endpoint:** `GET /api/usage`

**Query Parameters:**
- `start_date` — Start date (ISO 8601)
- `end_date` — End date (ISO 8601)
- `group_by` — Group by: `day`, `week`, `month`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_messages": 1250,
    "total_tokens": 45000,
    "total_cost": 2.35,
    "breakdown": [
      {
        "date": "2026-03-15",
        "messages": 150,
        "tokens": 5400,
        "cost": 0.28
      }
    ]
  }
}
```

## Webhooks

Subscribe to events via webhooks.

### Available Events

- `conversation.created` — New conversation started
- `conversation.message` — New message in conversation
- `conversation.ended` — Conversation marked as ended
- `document.processed` — Document finished processing
- `document.failed` — Document processing failed

### Setting Up Webhooks

1. Go to **Dashboard → Settings → Webhooks**
2. Click **Add Webhook**
3. Enter your endpoint URL
4. Select events to subscribe to
5. Save and copy the signing secret

### Webhook Payload

```json
{
  "event": "conversation.message",
  "timestamp": "2026-03-15T10:00:00Z",
  "data": {
    "conversation_id": "conv_123",
    "message_id": "msg_456",
    "role": "user",
    "content": "Hello!",
    "visitor_id": "visitor_xyz789"
  }
}
```

### Verifying Webhooks

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Express.js example
app.post('/webhooks/chatbot', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = verifyWebhook(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  const { event, data } = req.body;
  console.log(`Received ${event}:`, data);
  
  res.json({ received: true });
});
```

## Rate Limits

API requests are rate-limited based on your plan:

| Plan | Requests/min | Requests/day |
|------|--------------|--------------|
| Free | 10 | 1,000 |
| Starter | 60 | 10,000 |
| Pro | 300 | 100,000 |
| Enterprise | Custom | Custom |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1710504000
```

**429 Response:**
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 30
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Invalid chatbot ID",
  "code": "CHATBOT_NOT_FOUND",
  "details": {
    "chatbot_id": "invalid_id"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Retry Logic

```javascript
async function apiRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 30;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
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

## SDK Libraries

### Node.js

```bash
npm install @ai-saas/sdk
```

```javascript
const { AISaasClient } = require('@ai-saas/sdk');

const client = new AISaasClient({
  apiKey: process.env.AI_SAAS_API_KEY,
});

// Send a message
const response = await client.chat.send({
  chatbotId: 'chatbot_123',
  message: 'Hello!',
  sessionId: 'session_abc',
});

console.log(response.message);

// Stream a response
const stream = await client.chat.stream({
  chatbotId: 'chatbot_123',
  message: 'Tell me a story',
  sessionId: 'session_abc',
});

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}
```

### Python

```bash
pip install ai-saas-sdk
```

```python
from ai_saas import Client

client = Client(api_key=os.environ['AI_SAAS_API_KEY'])

# Send a message
response = client.chat.send(
    chatbot_id='chatbot_123',
    message='Hello!',
    session_id='session_abc'
)

print(response.message)

# Stream a response
stream = client.chat.stream(
    chatbot_id='chatbot_123',
    message='Tell me a story',
    session_id='session_abc'
)

for chunk in stream:
    print(chunk.content, end='', flush=True)
```

## Example Integrations

### Slack Bot

```javascript
const { App } = require('@slack/bolt');
const { AISaasClient } = require('@ai-saas/sdk');

const slack = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const aiClient = new AISaasClient({
  apiKey: process.env.AI_SAAS_API_KEY,
});

slack.message(async ({ message, say }) => {
  const response = await aiClient.chat.send({
    chatbotId: 'chatbot_123',
    message: message.text,
    sessionId: message.user,
    visitorId: message.user,
  });
  
  await say(response.message);
});

slack.start(3000);
```

### Discord Bot

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const { AISaasClient } = require('@ai-saas/sdk');

const discord = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const aiClient = new AISaasClient({
  apiKey: process.env.AI_SAAS_API_KEY,
});

discord.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const response = await aiClient.chat.send({
    chatbotId: 'chatbot_123',
    message: message.content,
    sessionId: message.author.id,
    visitorId: message.author.id,
  });
  
  message.reply(response.message);
});

discord.login(process.env.DISCORD_TOKEN);
```

### WhatsApp Integration

```javascript
const { AISaasClient } = require('@ai-saas/sdk');
const twilio = require('twilio');

const aiClient = new AISaasClient({
  apiKey: process.env.AI_SAAS_API_KEY,
});

app.post('/whatsapp/webhook', async (req, res) => {
  const { From, Body } = req.body;
  
  const response = await aiClient.chat.send({
    chatbotId: 'chatbot_123',
    message: Body,
    sessionId: From,
    visitorId: From,
  });
  
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response.message);
  
  res.type('text/xml').send(twiml.toString());
});
```

## Best Practices

### Session Management

✅ **Use consistent session IDs** — Same session for related messages
✅ **Include visitor IDs** — Enable memory and personalization
✅ **Set reasonable timeouts** — End sessions after inactivity
✅ **Clean up old sessions** — Archive or delete inactive conversations

### Performance

✅ **Use streaming for long responses** — Better UX
✅ **Implement caching** — Cache frequent queries
✅ **Batch requests** — Combine when possible
✅ **Monitor usage** — Track costs and optimize

### Security

✅ **Validate input** — Sanitize user messages
✅ **Use HTTPS** — Always encrypt API calls
✅ **Rotate API keys** — Regular key rotation
✅ **Implement rate limiting** — Prevent abuse

### Error Handling

✅ **Implement retries** — Handle transient failures
✅ **Log errors** — Monitor for patterns
✅ **Graceful degradation** — Fallback responses
✅ **User feedback** — Inform users of issues

## Next Steps

- [Passing User Data to Chatbot](passing-user-data-to-chatbot) — Personalize API responses
- [Chatbot Memory & Identity Verification](chatbot-memory-verification) — Enable memory in API calls
- [Customizing Widget Appearance](customizing-widget-appearance) — Widget integration

## Need Help?

- **API Reference:** Full endpoint documentation at `/docs/api`
- **Support:** Contact support for integration assistance
- **Community:** Join our Discord for developer discussions

## Changelog

### v1.2.0 (2026-03-15)
- Added user context support
- Streaming improvements
- New webhook events

### v1.1.0 (2026-02-01)
- Memory API endpoints
- Conversation export
- Usage analytics

### v1.0.0 (2026-01-01)
- Initial API release
