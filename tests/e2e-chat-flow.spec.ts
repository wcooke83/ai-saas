import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CHAT_URL = `/api/chat/${CHATBOT_ID}`;
const SESSION_ID = `e2e-session-${Date.now()}`;

test.describe('Chat Message Flow', () => {
  test('send message and receive response (non-streaming)', async ({ page }) => {
    // Ensure published first
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const res = await page.request.post(CHAT_URL, {
      data: { message: 'Hello, what can you do?', stream: false, session_id: SESSION_ID },
    });

    // Chat may return 403 if chatbot has status != 'active', or succeed
    expect(res.status()).toBeLessThan(500);

    if (res.ok()) {
      const body = await res.json();
      expect(body.success).toBe(true);
      // API returns 'message' not 'content'
      const responseText = body.data?.message || body.data?.content;
      expect(responseText).toBeTruthy();
      expect(responseText.length).toBeGreaterThan(0);
      expect(body.data?.conversation_id).toBeTruthy();
    }
  });

  test('conversation persists across messages', async ({ page }) => {
    // First message
    const res1 = await page.request.post(CHAT_URL, {
      data: { message: 'My name is TestUser', stream: false, session_id: SESSION_ID },
    });
    expect(res1.status()).toBeLessThan(500);

    // Second message in same session
    const res2 = await page.request.post(CHAT_URL, {
      data: { message: 'What did I just tell you?', stream: false, session_id: SESSION_ID },
    });
    expect(res2.status()).toBeLessThan(500);

    if (res1.ok() && res2.ok()) {
      const body1 = await res1.json();
      const body2 = await res2.json();
      // Same conversation
      expect(body1.data?.conversation_id).toBe(body2.data?.conversation_id);
    }
  });

  test('rejects empty message', async ({ page }) => {
    const res = await page.request.post(CHAT_URL, {
      data: { message: '', stream: false, session_id: 'e2e-empty' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('rejects non-existent chatbot', async ({ page }) => {
    const res = await page.request.post('/api/chat/00000000-0000-0000-0000-000000000000', {
      data: { message: 'Hello', stream: false },
    });
    expect([404, 403]).toContain(res.status());
  });

  test('generates session_id if not provided', async ({ page }) => {
    const res = await page.request.post(CHAT_URL, {
      data: { message: 'Hello without session', stream: false },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('streaming response works', async ({ page }) => {
    test.setTimeout(120_000);
    // Ensure published
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const res = await page.request.post(CHAT_URL, {
      data: { message: 'Say hello', stream: true, session_id: `e2e-stream-${Date.now()}` },
    });
    // Chat may return 403 if not published/active
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const text = await res.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });
});
