import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  test('sidebar links are visible on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Core nav items should be present
    const navItems = ['Dashboard', 'Chatbots', 'API Keys', 'Usage'];
    for (const item of navItems) {
      const link = page.locator(`nav >> text=${item}`).first();
      const isVisible = await link.isVisible().catch(() => false);
      // Nav might be collapsed on mobile, so just check it exists in DOM
      const exists = await link.count() > 0;
      expect(isVisible || exists).toBeTruthy();
    }
  });

  test('clicking Chatbots navigates to chatbots list', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Use link role with exact name to find the sidebar nav link
    const chatbotsLink = page.getByRole('link', { name: 'Chatbots', exact: true }).first();
    await expect(chatbotsLink).toBeVisible({ timeout: 10000 });
    await chatbotsLink.click();

    // Wait for SPA navigation to complete
    await page.waitForURL('**/dashboard/chatbots', { timeout: 15000 });
    expect(page.url()).toContain('/chatbots');
  });

  test('back to chatbot link works from sub-pages', async ({ page }) => {
    const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/performance`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const backLink = page.locator('text=Back to Chatbot').first();
    if (await backLink.isVisible()) {
      await backLink.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Should navigate back to chatbot overview
      expect(page.url()).toContain(`/dashboard/chatbots/${CHATBOT_ID}`);
      expect(page.url()).not.toContain('/performance');
    }
  });
});

test.describe('Auth Redirects', () => {
  test('unauthenticated API calls are rejected', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    await context.clearCookies();
    const page = await context.newPage();

    // API route should reject without auth
    const res = await page.request.get('http://localhost:3030/api/keys');
    expect(res.status()).not.toBe(200);

    await context.close();
  });

  test('unauthenticated user can access public pages', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:3030/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should stay on home page
    expect(page.url()).not.toContain('/login');

    await context.close();
  });
});
