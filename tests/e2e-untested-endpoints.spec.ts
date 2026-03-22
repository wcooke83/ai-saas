import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Previously Untested Endpoints', () => {
  test('agent-conversations endpoint responds', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/agent-conversations`);
    // May need auth — just verify no 500
    expect(res.status()).toBeLessThan(500);
  });

  test('agent-events endpoint responds', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/agent-events`);
    // SSE endpoint — may timeout or return empty, just verify no crash
    expect(res.status()).toBeLessThan(500);
  });

  test('chatbot translate endpoint responds', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/translate`, {
      data: { target_language: 'es' },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('agent-heartbeat endpoint responds', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/agent-heartbeat`, {
      data: { agent_name: 'e2e-test-agent' },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('wiki index endpoint responds', async ({ page }) => {
    const res = await page.request.get('/api/wiki/index');
    expect(res.status()).toBeLessThan(500);
  });

  test('admin check endpoint responds', async ({ page }) => {
    const res = await page.request.post('/api/admin/check');
    expect(res.status()).toBeLessThan(500);
  });
});
