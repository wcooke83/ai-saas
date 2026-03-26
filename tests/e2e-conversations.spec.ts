import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Conversations & History', () => {
  test('list conversations', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/conversations`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('conversations page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/conversations`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('widget history endpoint works', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/history?session_id=e2e-nonexistent`);
    expect(res.ok()).toBeTruthy();
  });

  test('transcript endpoint works', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/transcript`, {
      data: { session_id: 'e2e-test', email: 'test@test.local' },
    });
    // May fail if no conversation exists, but shouldn't 500
    expect(res.status()).toBeLessThan(500);
  });
});
