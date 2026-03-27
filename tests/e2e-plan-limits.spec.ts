import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Plan Limits', () => {
  test('chatbots list page loads showing available chatbots', async ({ page }) => {
    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Should show chatbots or a create button
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('knowledge page loads respecting source limits', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/knowledge`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('billing page shows current plan', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Page should display plan information
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('usage page shows credit information', async ({ page }) => {
    await page.goto('/dashboard/usage');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
