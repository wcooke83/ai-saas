import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Sentiment Analysis', () => {
  test('sentiment list endpoint works', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/sentiment`);
    expect(res.status()).toBeLessThan(500);
  });

  test('sentiment analyze endpoint works', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/sentiment/analyze`);
    expect(res.status()).toBeLessThan(500);
  });

  test('sentiment page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/sentiment`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
