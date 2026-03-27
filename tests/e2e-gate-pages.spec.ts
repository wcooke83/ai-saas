import { test, expect } from '@playwright/test';

/**
 * E2E tests for Coming Soon and Maintenance gate pages.
 *
 * These test that the pages themselves render correctly when visited directly.
 * The middleware redirect logic is covered by unit tests in maintenance-gate.test.ts.
 */

test.describe('Coming Soon page', () => {
  test('renders with correct content', async ({ page }) => {
    await page.goto('/coming-soon');
    await page.waitForLoadState('domcontentloaded');

    // Heading
    await expect(page.locator('h1')).toContainText('coming');

    // "In Development" badge
    await expect(page.getByText('In Development')).toBeVisible();

    // App name
    await expect(page.getByText('VocUI')).toBeVisible();
  });

  test('page loads without errors (no 5xx)', async ({ page }) => {
    const response = await page.goto('/coming-soon');
    expect(response?.status()).toBeLessThan(500);
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/coming-soon');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('In Development')).toBeVisible();
  });

  test('displays rocket, sparkles, and zap icons', async ({ page }) => {
    await page.goto('/coming-soon');
    await page.waitForLoadState('domcontentloaded');

    // Icons are lucide-react SVGs — there should be 3 icon containers
    const iconContainers = page.locator('svg.lucide');
    await expect(iconContainers).toHaveCount(3);
  });
});

test.describe('Maintenance page', () => {
  test('renders with correct content', async ({ page }) => {
    await page.goto('/maintenance');
    await page.waitForLoadState('domcontentloaded');

    // Heading
    await expect(page.locator('h1')).toContainText('back soon');

    // Status indicators
    await expect(page.getByText('Systems upgrading')).toBeVisible();
    await expect(page.getByText('Data is safe')).toBeVisible();

    // Footer
    await expect(page.getByText('Thank you for your patience')).toBeVisible();
  });

  test('page loads without errors (no 5xx)', async ({ page }) => {
    const response = await page.goto('/maintenance');
    expect(response?.status()).toBeLessThan(500);
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/maintenance');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Systems upgrading')).toBeVisible();
    await expect(page.getByText('Data is safe')).toBeVisible();
  });

  test('displays wrench and settings icons', async ({ page }) => {
    await page.goto('/maintenance');
    await page.waitForLoadState('domcontentloaded');

    // Wrench + Settings + HardDrive + ShieldCheck = 4 SVGs
    const icons = page.locator('svg.lucide');
    await expect(icons).toHaveCount(4);
  });
});
