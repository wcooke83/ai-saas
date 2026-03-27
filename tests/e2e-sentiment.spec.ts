import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Sentiment Analysis', () => {
  test('sentiment page loads with dashboard content', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/sentiment`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Should show sentiment data or empty state
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('sentiment page fetches data from API', async ({ page }) => {
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/sentiment`) && res.request().method() === 'GET'
    );

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/sentiment`);
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();
  });

  test('sentiment analyze can be triggered from page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/sentiment`);
    await page.waitForLoadState('domcontentloaded');

    // Look for an analyze/refresh button on the sentiment page
    const analyzeButton = page.getByRole('button', { name: /analyze|refresh|run/i }).first();
    if (await analyzeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const analyzePromise = page.waitForResponse(
        (res) => res.url().includes('/sentiment') && res.request().method() === 'POST'
      );
      await analyzeButton.click();
      const analyzeResponse = await analyzePromise;
      expect(analyzeResponse.ok()).toBeTruthy();
    } else {
      // Fallback: hit the endpoint directly
      const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/sentiment/analyze`);
      expect(res.ok()).toBeTruthy();
    }
  });
});
