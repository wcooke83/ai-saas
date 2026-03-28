import { test, expect } from '@playwright/test';

test.describe('Profile Page Removed', () => {
  test('PROFILE-001: /dashboard/profile returns 404 or redirects away', async ({ page }) => {
    const response = await page.goto('/dashboard/profile');
    // Should either 404 or redirect to dashboard
    const status = response?.status();
    const url = page.url();
    const is404 = status === 404;
    const redirectedAway = !url.includes('/dashboard/profile');
    expect(is404 || redirectedAway).toBeTruthy();
  });

  test('PROFILE-002: sidebar navigation does not contain a Profile link', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Wait for sidebar to render
    const sidebar = page.locator('aside[aria-label="Sidebar navigation"]');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // Verify core nav items exist to confirm sidebar loaded properly
    await expect(sidebar.getByText('Dashboard', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('Billing', { exact: true })).toBeVisible();

    // Profile link should NOT exist in the sidebar
    const profileLink = sidebar.getByRole('link', { name: /^Profile$/i });
    await expect(profileLink).not.toBeVisible();
    expect(await profileLink.count()).toBe(0);
  });

  test('PROFILE-003: sidebar nav items match expected set (no Profile)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const sidebar = page.locator('aside[aria-label="Sidebar navigation"]');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    const expectedItems = ['Dashboard', 'Chatbots', 'API Keys', 'Usage', 'Billing', 'Settings', 'Wiki'];
    for (const item of expectedItems) {
      const link = sidebar.getByText(item, { exact: true }).first();
      // Nav items should exist (may be collapsed on mobile but present in DOM)
      expect(await link.count()).toBeGreaterThan(0);
    }

    // Profile should not be in the list
    const profileText = sidebar.getByText('Profile', { exact: true });
    expect(await profileText.count()).toBe(0);
  });
});

test.describe('Dashboard Pages List Verification', () => {
  const dashboardPages = [
    { path: '/dashboard', label: 'dashboard home' },
    { path: '/dashboard/chatbots', label: 'chatbots list' },
    { path: '/dashboard/api-keys', label: 'API keys' },
    { path: '/dashboard/usage', label: 'usage' },
    { path: '/dashboard/billing', label: 'billing' },
    { path: '/dashboard/settings', label: 'settings' },
  ];

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

  test('profile page is NOT in the loadable dashboard pages', async ({ page }) => {
    const response = await page.goto('/dashboard/profile');
    // Should NOT successfully render as a dashboard page
    const url = page.url();
    const status = response?.status();
    // Either 404 or redirected
    expect(status === 404 || !url.includes('/dashboard/profile')).toBeTruthy();
  });
});
