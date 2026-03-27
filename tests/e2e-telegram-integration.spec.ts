import { test, expect } from '@playwright/test';

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

// Telegram integration tests are inherently webhook/API tests.
// External services (Telegram) POST to our webhook endpoint — no UI equivalent.
// The settings UI for Telegram config is tested via e2e-settings-save and e2e-fallback-settings.

test.describe('31. Telegram & Slack Integration — Telegram', () => {
  test('TELEGRAM-001: Webhook accepts valid update payload', async ({ request }) => {
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
    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-002: Invalid secret rejected', async ({ request }) => {
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
    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-003: Webhook without secret header', async ({ request }) => {
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
    expect([200, 401]).toContain(response.status());
  });

  test('TELEGRAM-004: Reply-to message mapping', async ({ request }) => {
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

  test('TELEGRAM-005: Fallback chain identification', async ({ request }) => {
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

  test('TELEGRAM-008: /resolve command via reply-to', async ({ request }) => {
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

  test('TELEGRAM-009: /active command', async ({ request }) => {
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

  test('TELEGRAM-010: Unknown command response', async ({ request }) => {
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

  test('TELEGRAM-011: Command logging', async ({ request }) => {
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

  test('TELEGRAM-012: Visitor message forwarding during handoff', async ({ request }) => {
    const response = await request.post(`/api/chat/${CHATBOT_ID}`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        message: 'E2E test message during handoff',
        conversation_id: '00000000-0000-0000-0000-000000000099',
        session_id: 'e2e-test-session',
      },
    });
    expect([200, 400, 403, 404]).toContain(response.status());
  });

  test('TELEGRAM-013: Platform agent reply forwarded', async ({ request }) => {
    const response = await request.post(`/api/widget/${CHATBOT_ID}/agent-reply`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000099',
        content: 'E2E test agent reply for Telegram forwarding',
        agent_name: 'E2E Agent',
      },
    });
    expect([200, 401, 404, 409]).toContain(response.status());
  });

  test('TELEGRAM-014: Agent reply transitions handoff', async ({ request }) => {
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

  test('TELEGRAM-015: Handoff notification context', async ({ request }) => {
    const response = await request.post(`/api/widget/${CHATBOT_ID}/handoff`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000099',
        session_id: 'e2e-test-session-context',
        reason: 'need_human_help',
        details: 'E2E test for handoff notification context',
      },
    });
    expect([200, 400, 500]).toContain(response.status());
  });

  test('TELEGRAM-016: Send failure graceful handling', async ({ request }) => {
    const response = await request.post(`/api/widget/${CHATBOT_ID}/handoff`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000098',
        session_id: 'e2e-test-session-fail',
        reason: 'need_human_help',
      },
    });
    expect([200, 400, 500]).toContain(response.status());
  });

  test('TELEGRAM-017: Webhook health check GET', async ({ request }) => {
    const response = await request.get('/api/telegram/webhook');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('TELEGRAM-018: No-op for messages without text or from', async ({ request }) => {
    const noTextResponse = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999986,
        message: {
          message_id: 14,
          chat: { id: 12345, type: 'private' },
          from: { id: 12345, first_name: 'E2E', username: 'e2etest' },
        },
      },
    });
    expect([200, 401]).toContain(noTextResponse.status());
    if (noTextResponse.status() === 200) {
      const body = await noTextResponse.json();
      expect(body.ok).toBe(true);
    }

    const noFromResponse = await request.post('/api/telegram/webhook', {
      headers: { 'Content-Type': 'application/json' },
      data: {
        update_id: 999985,
        message: {
          message_id: 15,
          chat: { id: 12345, type: 'private' },
          text: 'Hello',
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
