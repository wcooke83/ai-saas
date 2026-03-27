import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const PERF_URL = `/dashboard/chatbots/${CHATBOT_ID}/performance`;

test.describe('Performance Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PERF_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 20000 });
  });

  test('loads without errors', async ({ page }) => {
    // Should show the Performance heading (may take time for first load + data fetch)
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 20000 });
    // Should not show a dashboard error boundary
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('filter bar is visible with time presets', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    // Time preset buttons should be visible
    await expect(page.getByRole('button', { name: '24h' })).toBeVisible();
    await expect(page.getByRole('button', { name: '7d' })).toBeVisible();
    await expect(page.getByRole('button', { name: '30d' })).toBeVisible();
    await expect(page.getByRole('button', { name: '90d' })).toBeVisible();

    // 24h should be active by default (blue background)
    const btn24h = page.getByRole('button', { name: '24h' });
    await expect(btn24h).toHaveClass(/bg-blue-600/);
  });

  test('switching time range updates URL params', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    // Click 7d and wait for URL update
    await page.getByRole('button', { name: '7d' }).click();
    await page.waitForURL(/days=7/, { timeout: 10000 });

    // Click 30d
    await page.getByRole('button', { name: '30d' }).click();
    await page.waitForURL(/days=30/, { timeout: 10000 });
  });

  test('custom date range picker opens and closes', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    // Click Custom button
    await page.getByRole('button', { name: 'Custom' }).click();

    // Date inputs should appear
    await expect(page.locator('input[type="datetime-local"]').first()).toBeVisible();

    // Click Apply
    await page.getByRole('button', { name: 'Apply' }).click();

    // Popover should close
    await expect(page.locator('input[type="datetime-local"]').first()).not.toBeVisible();
  });

  test('filter toggles work', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    // Click Live Fetch Only
    const liveFetchBtn = page.getByRole('button', { name: 'Live Fetch Only' });
    await liveFetchBtn.click();

    // Should update URL
    await page.waitForURL(/live_fetch=true/, { timeout: 10000 });

    // Click again to deactivate
    await liveFetchBtn.click();
    await expect(async () => {
      expect(page.url()).not.toContain('live_fetch=true');
    }).toPass({ timeout: 10000 });
  });

  test('slow only filter toggles', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    const slowBtn = page.getByRole('button', { name: 'Slow Only' });
    await slowBtn.click();

    await expect(slowBtn).toHaveClass(/bg-blue-600/);
    expect(page.url()).toContain('slow=true');
  });

  test('refresh button exists and is clickable', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    // The Refresh button lives in the PerformanceFilterBar which only renders
    // after the initial data fetch completes (loading skeleton disappears).
    // Wait for it with a generous timeout.
    const refreshBtn = page.getByRole('button', { name: 'Refresh' });
    await expect(refreshBtn).toBeVisible({ timeout: 15000 });
    await refreshBtn.click();
    // Should not crash — heading should remain visible after refresh triggers a new fetch
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });
  });

  test('shows empty state or data cards', async ({ page }) => {
    // beforeEach already navigated; wait for data fetch to complete
    await Promise.race([
      page.getByText('No performance data yet').waitFor({ timeout: 15000 }),
      page.getByText('Total Requests').first().waitFor({ timeout: 15000 }),
    ]).catch(() => {});

    // Either we see the empty state heading or the summary stat cards
    const hasEmpty = await page.getByText('No performance data yet').isVisible().catch(() => false);
    const hasData = await page.getByText('Total Requests').first().isVisible().catch(() => false);
    // Also check for stat numbers (e.g. waterfall chart or numeric values)
    const hasNumericStats = await page.locator('.grid >> text=/^\\d+$/').first().isVisible().catch(() => false);

    expect(hasEmpty || hasData || hasNumericStats).toBeTruthy();
  });
});
