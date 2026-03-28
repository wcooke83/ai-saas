import { test, expect } from '@playwright/test';

const dashboardPages = [
  { path: '/dashboard', label: 'dashboard home' },
  { path: '/dashboard/chatbots', label: 'chatbots list' },
  { path: '/dashboard/api-keys', label: 'API keys' },
  { path: '/dashboard/usage', label: 'usage' },
  { path: '/dashboard/billing', label: 'billing' },
  { path: '/dashboard/settings', label: 'settings' },
  { path: '/dashboard/integrations', label: 'integrations' },
  // Wiki page may not exist for all users
  // { path: '/dashboard/wiki', label: 'wiki' },
];

test.describe('Dashboard Pages Load', () => {
  for (const { path, label } of dashboardPages) {
    test(`${label} page loads without errors`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      // Should stay on dashboard (not redirected to login)
      expect(page.url()).toContain('/dashboard');

      // No error boundary
      await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

      // Page has meaningful content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(50);
    });
  }
});
