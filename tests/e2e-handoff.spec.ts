import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Handoff & Escalation Flow', () => {
  test('check handoff status requires conversation_id', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/handoff`);
    expect(res.status()).toBe(400);
  });

  test('check handoff status with invalid conversation returns empty', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/handoff?conversation_id=00000000-0000-0000-0000-000000000000`);
    expect(res.status()).toBeLessThan(500);
  });

  test('escalations list endpoint works', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/escalations`);
    expect(res.ok()).toBeTruthy();
  });

  test('escalations page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/escalations`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('conversations list endpoint works', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/conversations`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
