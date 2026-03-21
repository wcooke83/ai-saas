import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests', () => {
  test('dashboard loads for authenticated user', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should not redirect to login (we're authenticated)
    expect(page.url()).toContain('/dashboard');

    // Should show some dashboard content
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('chatbots list page loads', async ({ page }) => {
    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should show chatbots heading or create button
    expect(page.url()).toContain('/dashboard');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('chatbot detail page loads', async ({ page }) => {
    const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('chatbot settings page loads', async ({ page }) => {
    const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('chatbot knowledge page loads', async ({ page }) => {
    const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/knowledge`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('chatbot deploy page loads', async ({ page }) => {
    const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/deploy`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
