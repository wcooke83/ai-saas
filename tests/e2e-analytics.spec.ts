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

  test('analytics export button triggers download', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/analytics`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for the Export button to appear (it renders after data loads)
    const exportBtn = page.getByRole('button', { name: 'Export' });
    await expect(exportBtn).toBeVisible({ timeout: 15000 });

    // Intercept the export API call triggered by the button click
    const exportPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/analytics/export`) && res.request().method() === 'GET',
      { timeout: 15000 }
    );
    await exportBtn.click();
    const exportRes = await exportPromise;
    expect(exportRes.ok()).toBeTruthy();
  });

  test('sentiment export button is present on sentiment page', async ({ page }) => {
    // The Export CSV button is disabled when there is no analyzed sentiment data,
    // so we cannot click it without seeding real conversation data. We verify the
    // page loads and the button renders in the expected state instead.
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/sentiment`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    const exportBtn = page.getByRole('button', { name: 'Export CSV' });
    await expect(exportBtn).toBeVisible({ timeout: 15000 });

    // If there is data available, also verify the export API responds via UI click
    const isEnabled = await exportBtn.isEnabled();
    if (isEnabled) {
      const exportPromise = page.waitForResponse(
        (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/sentiment/export`) && res.request().method() === 'GET',
        { timeout: 15000 }
      );
      await exportBtn.click();
      const exportRes = await exportPromise;
      expect(exportRes.ok()).toBeTruthy();
    }
  });
});
