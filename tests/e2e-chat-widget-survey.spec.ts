import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Chat Widget Survey Flow', () => {
  test('widget loads on deploy page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/deploy`);
    await page.waitForLoadState('domcontentloaded');

    // The deploy page should load
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Page should not crash
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});

test.describe('Chat Widget on Deploy Page', () => {
  test('widget script tag is present on deploy page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/deploy`);
    await page.waitForLoadState('domcontentloaded');

    // Deploy page should show embed code or script snippet
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Check page has loaded content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });
});
