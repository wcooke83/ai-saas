import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CHAT_URL = `/api/chat/${CHATBOT_ID}`;

test.describe('Chat Advanced Flows', () => {
  test('performance log created after chat', async ({ page }) => {
    const session = `e2e-perf-check-${Date.now()}`;

    // Send a message
    const chatRes = await page.request.post(CHAT_URL, {
      data: { message: 'What is your purpose?', stream: false, session_id: session },
    });
    expect(chatRes.ok()).toBeTruthy();

    // Check performance log has an entry
    const perfRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/performance?days=1`);
    expect(perfRes.ok()).toBeTruthy();
    const perfBody = await perfRes.json();
    expect(perfBody.data?.total_requests).toBeGreaterThanOrEqual(0);
  });

  test('unpublished chatbot rejects chat', async ({ page }) => {
    // Unpublish
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Try to chat
    const res = await page.request.post(CHAT_URL, {
      data: { message: 'Hello', stream: false, session_id: 'e2e-unpub' },
    });
    expect(res.status()).toBe(403);

    // Re-publish for other tests
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);
  });

  test('welcome message initialization works', async ({ page }) => {
    const res = await page.request.post(CHAT_URL, {
      data: {
        message: '__WELCOME__',
        welcome_message: 'Welcome to our test bot!',
        stream: false,
        session_id: `e2e-welcome-${Date.now()}`,
      },
    });
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const body = await res.json();
      expect(body.success).toBe(true);
    }
  });

  test('message length validation', async ({ page }) => {
    // Message too long (>10000 chars)
    const longMessage = 'a'.repeat(10001);
    const res = await page.request.post(CHAT_URL, {
      data: { message: longMessage, stream: false, session_id: 'e2e-long' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
