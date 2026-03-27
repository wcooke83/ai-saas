import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Analytics & Export', () => {
  test('analytics page loads with dashboard content', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/analytics`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Should show analytics content (charts, stats, or empty state)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('analytics page fetches data from API', async ({ page }) => {
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/analytics`) && res.request().method() === 'GET'
    );

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/analytics`);
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();
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
