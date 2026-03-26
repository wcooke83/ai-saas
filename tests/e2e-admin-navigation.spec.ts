import { test, expect } from '@playwright/test';

test.describe('Section 43: Admin -- Layout & Navigation', () => {
  test('ADMIN-NAV-001: Admin sidebar shows all navigation items', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Set viewport to desktop so sidebar is visible
    await page.setViewportSize({ width: 1280, height: 800 });

    // Admin sub-menu items
    const adminItems = [
      { label: 'Overview', href: '/admin' },
      { label: 'AI Config', href: '/admin/ai-config' },
      { label: 'Plans', href: '/admin/plans' },
      { label: 'Credits', href: '/admin/credits' },
      { label: 'Trial Links', href: '/admin/trials' },
      { label: 'Logs', href: '/admin/logs' },
    ];

    for (const item of adminItems) {
      const link = page.locator(`a[href="${item.href}"]`).filter({ hasText: item.label });
      await expect(link).toBeVisible({ timeout: 5000 });
    }
  });

  test('ADMIN-NAV-002: Admin menu auto-expanded on admin routes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/admin/credits');
    await page.waitForLoadState('domcontentloaded');

    // The admin sub-menu should be expanded (child items visible)
    const creditsLink = page.locator('a[href="/admin/credits"]').filter({ hasText: 'Credits' });
    await expect(creditsLink).toBeVisible({ timeout: 5000 });

    // Credits link should be highlighted as active
    await expect(creditsLink).toHaveClass(/bg-primary/);
  });

  test('ADMIN-NAV-003: Sidebar collapse with localStorage persistence', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Find the collapse button
    const collapseBtn = page.locator('button[aria-label="Collapse sidebar"]');
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click({ force: true });

      // Sidebar should be collapsed (w-16 instead of w-64)
      const sidebar = page.locator('aside');
      await expect(sidebar).toHaveClass(/w-16/);

      // Check localStorage
      const savedState = await page.evaluate(() => localStorage.getItem('sidebar-collapsed'));
      expect(savedState).toBe('true');

      // Reload and verify persistence
      await page.reload();
      await page.waitForLoadState('domcontentloaded');

      const sidebarAfterReload = page.locator('aside');
      await expect(sidebarAfterReload).toHaveClass(/w-16/);

      // Expand back
      const expandBtn = page.locator('button[aria-label="Expand sidebar"]');
      if (await expandBtn.isVisible()) {
        await expandBtn.click({ force: true });
      }
    }
  });

  test('ADMIN-NAV-004: Mobile hamburger menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Hamburger button should be visible
    const hamburgerBtn = page.locator('button[aria-label="Open sidebar"]');
    await expect(hamburgerBtn).toBeVisible({ timeout: 5000 });

    // Click to open
    await hamburgerBtn.click();

    // Sidebar should be visible (overlay)
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveClass(/translate-x-0/);

    // Navigation items should be visible
    await expect(page.locator('a', { hasText: 'Dashboard' }).first()).toBeVisible();

    // Close button should be visible
    const closeBtn = page.locator('button[aria-label="Close sidebar"]');
    await expect(closeBtn).toBeVisible();

    // Click close
    await closeBtn.click();

    // Sidebar should be hidden again
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});
