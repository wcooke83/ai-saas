import { test, expect } from '@playwright/test';

test.describe('Dashboard Smoke Tests', () => {
  test('dashboard loads for authenticated user', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Should not redirect to login (we're authenticated)
    expect(page.url()).toContain('/dashboard');

    // Should show some dashboard content
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('chatbots list page loads', async ({ page }) => {
    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    expect(page.url()).toContain('/dashboard');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
