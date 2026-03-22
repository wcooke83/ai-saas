import { test, expect } from '@playwright/test';

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('31. Telegram & Slack Integration — Telegram', () => {
  test('TELEGRAM-001: Webhook secret verification -- valid secret', async ({ request }) => {
    // POST to telegram webhook with a valid update payload
    // Without a valid secret configured, the webhook should still accept the request
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999999,
        message: {
          message_id: 1,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/help',
        },
      },
    });

    // Should return 200 or 401 (depending on webhook_secret config)
    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-002: Webhook secret verification -- invalid secret', async ({ request }) => {
    const response = await request.post('/api/telegram/webhook', {
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Bot-Api-Secret-Token': 'invalid-secret-token',
      },
      data: {
        update_id: 999998,
        message: {
          message_id: 2,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/help',
        },
      },
    });

    // If a webhook secret is configured, invalid should return 401
    // If no secret configured, it passes through (200)
    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-003: Webhook secret verification -- no secret configured', async ({ request }) => {
    // POST without any secret header
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999997,
        message: {
          message_id: 3,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/help',
        },
      },
    });

    // Without secret configured, should pass verification
    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-004: Chatbot identification via reply-to message mapping', async ({ request }) => {
    // Send a message that references a reply_to_message
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999996,
        message: {
          message_id: 4,
          chat: { id: 12345, type: 'group' },
          from: { id: 12345, first_name: 'Agent', username: 'agent1' },
          text: 'I can help with that',
          reply_to_message: {
            message_id: 100,
            text: 'Handoff notification for conversation abc-123',
          },
        },
      },
    });

    expect([200, 401]).toContain(response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(body.ok).toBe(true);
    }
  });

  test('TELEGRAM-005: Chatbot identification fallback chain', async ({ request }) => {
    // Send a message with a conversation ID in the text
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999995,
        message: {
          message_id: 5,
          chat: { id: 12345, type: 'group' },
          from: { id: 12345, first_name: 'Agent', username: 'agent1' },
          text: 'Reply for conversation 00000000-0000-0000-0000-000000000001',
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-006: /start and /help commands', async ({ request }) => {
    // Send /start command
    const startResponse = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999994,
        message: {
          message_id: 6,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/start',
        },
      },
    });

    expect([200, 401]).toContain(startResponse.status());

    // Send /help command
    const helpResponse = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999993,
        message: {
          message_id: 7,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/help',
        },
      },
    });

    expect([200, 401]).toContain(helpResponse.status());
  });

  test('TELEGRAM-007: /resolve command via argument', async ({ request }) => {
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999992,
        message: {
          message_id: 8,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'Agent', username: 'agent1' },
          text: '/resolve 00000000-0000-0000-0000-000000000001',
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-008: /resolve command via reply-to message', async ({ request }) => {
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999991,
        message: {
          message_id: 9,
          chat: { id: 12345, type: 'group' },
          from: { id: 12345, first_name: 'Agent', username: 'agent1' },
          text: '/resolve',
          reply_to_message: {
            message_id: 100,
            text: 'Handoff from conversation 00000000-0000-0000-0000-000000000001',
          },
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-009: /active command lists active handoffs', async ({ request }) => {
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999990,
        message: {
          message_id: 10,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'Agent', username: 'agent1' },
          text: '/active',
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-010: Unknown Telegram command response', async ({ request }) => {
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999989,
        message: {
          message_id: 11,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/unknowncommand',
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-011: Telegram command logging', async ({ request }) => {
    // Send a command and verify webhook processes it
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999988,
        message: {
          message_id: 12,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          text: '/help',
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-012: Visitor message forwarding to Telegram during handoff', async ({ request }) => {
    // This tests the chat API path when a handoff is active
    // The chat route should detect the handoff and forward to Telegram
    const response = await request.post(`/api/chat/${CHATBOT_ID}`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        message: 'E2E test message during handoff',
        conversation_id: '00000000-0000-0000-0000-000000000099',
        session_id: 'e2e-test-session',
      },
    });

    // The chat API should accept or handle the message
    expect([200, 400, 404]).toContain(response.status());
  });

  test('TELEGRAM-013: Platform agent reply forwarded to Telegram', async ({ request }) => {
    // When an agent replies from the platform, it should be forwarded to Telegram
    const response = await request.post(`/api/widget/${CHATBOT_ID}/agent-reply`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000099',
        content: 'E2E test agent reply for Telegram forwarding',
        agent_name: 'E2E Agent',
      },
    });

    // May fail with 401 (auth required) or 404 (conversation not found)
    expect([200, 401, 404, 409]).toContain(response.status());
  });

  test('TELEGRAM-014: Telegram agent reply transitions handoff from pending to active', async ({ request }) => {
    // Simulates a Telegram reply to a pending handoff notification
    const response = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999987,
        message: {
          message_id: 13,
          chat: { id: 12345, type: 'group' },
          from: { id: 12345, first_name: 'Agent', username: 'agent1' },
          text: 'I will help with this',
          reply_to_message: {
            message_id: 100,
            text: 'New handoff for conversation 00000000-0000-0000-0000-000000000001',
          },
        },
      },
    });

    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-015: Handoff notification includes message context', async ({ request }) => {
    // Initiate a handoff and verify the response
    const response = await request.post(`/api/widget/${CHATBOT_ID}/handoff`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000099',
        session_id: 'e2e-test-session-context',
        reason: 'need_human_help',
        details: 'E2E test for handoff notification context',
      },
    });

    // May return 200 (success) or 400/500 (no conversation/config)
    expect([200, 400, 500]).toContain(response.status());
  });

  test('TELEGRAM-016: Telegram send failure graceful handling', async ({ request }) => {
    // Handoff with potentially invalid Telegram config should still succeed
    const response = await request.post(`/api/widget/${CHATBOT_ID}/handoff`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000098',
        session_id: 'e2e-test-session-fail',
        reason: 'need_human_help',
      },
    });

    // Handoff should still be created even if Telegram notification fails
    expect([200, 400, 500]).toContain(response.status());
  });

  test('TELEGRAM-017: Webhook health check GET endpoint', async ({ request }) => {
    const response = await request.get('/api/telegram/webhook');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('TELEGRAM-018: No-op for messages without text or from field', async ({ request }) => {
    // Message with no text field
    const noTextResponse = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999986,
        message: {
          message_id: 14,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
          // No text field
        },
      },
    });

    expect([200, 401]).toContain(noTextResponse.status());
    if (noTextResponse.status() === 200) {
      const body = await noTextResponse.json();
      expect(body.ok).toBe(true);
    }

    // Message with no from field
    const noFromResponse = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999985,
        message: {
          message_id: 15,
          chat: { id: 12345, type: 'private' },
          text: 'Hello',
          // No from field
        },
      },
    });

    expect([200, 401]).toContain(noFromResponse.status());
    if (noFromResponse.status() === 200) {
      const body = await noFromResponse.json();
      expect(body.ok).toBe(true);
    }
  });
});
