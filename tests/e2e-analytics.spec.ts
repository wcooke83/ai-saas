import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Analytics & Export', () => {
  test('analytics endpoint returns data', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/analytics`);
    expect(res.ok()).toBeTruthy();
  });

  test('analytics page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/analytics`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('analytics export endpoint responds', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/analytics/export`, {
      data: { days: 30 },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('sentiment export endpoint responds', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/sentiment/export`);
    expect(res.ok()).toBeTruthy();
  });
});
