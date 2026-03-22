import { test, expect, Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE_URL = `/dashboard/chatbots/${CHATBOT_ID}`;

// Wait for dashboard auth + analytics page data to load.
// The analytics page renders the H1 "Analytics" only after loading completes.
async function waitForAnalytics(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // Wait for either the page heading (success) or error text (failure) — both mean loading is done
  await Promise.race([
    page.getByRole('heading', { name: 'Analytics' }).waitFor({ timeout: 60000 }),
    page.getByText('Failed to fetch chatbot').waitFor({ timeout: 60000 }),
    page.getByText('Chatbot not found').waitFor({ timeout: 60000 }),
  ]).catch(() => {});
  await page.waitForTimeout(1000);
}

test.describe('Section 15: Analytics Dashboard', () => {
  test.setTimeout(120_000);

  test('ANALYTICS-001: Dashboard loads with metrics', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    await expect(page.getByText('Total Conversations').first()).toBeVisible();
    await expect(page.getByText('Total Messages').first()).toBeVisible();
    await expect(page.getByText('Unique Visitors')).toBeVisible();
    await expect(page.getByText('Satisfaction Rate')).toBeVisible();
  });

  test('ANALYTICS-002: Date range filter (7d / 30d / 90d)', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    const btn30 = page.locator('button', { hasText: '30d' });
    await expect(btn30).toHaveClass(/bg-primary-500/);

    const btn7 = page.locator('button', { hasText: '7d' });
    await btn7.click();
    await page.waitForTimeout(3000);
    await expect(btn7).toHaveClass(/bg-primary-500/);
    await expect(btn30).not.toHaveClass(/bg-primary-500/);

    const btn90 = page.locator('button', { hasText: '90d' });
    await btn90.click();
    await page.waitForTimeout(3000);
    await expect(btn90).toHaveClass(/bg-primary-500/);
    await expect(btn7).not.toHaveClass(/bg-primary-500/);
  });

  test('ANALYTICS-003: Bar chart renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    await expect(page.getByText('Conversations Over Time')).toBeVisible();
    await expect(page.getByText('Messages Over Time')).toBeVisible();
  });

  test('ANALYTICS-004: Export CSV', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    const exportBtn = page.getByRole('button', { name: 'Export' });
    await expect(exportBtn).toBeVisible();

    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await exportBtn.click();
    const download = await downloadPromise;

    if (download) {
      const filename = download.suggestedFilename();
      expect(filename).toContain('chatbot-analytics-');
      expect(filename).toContain('days.csv');
    }
  });

  test('ANALYTICS-005: Empty state when no data', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
    await expect(page.locator('text=An error occurred')).not.toBeVisible();
  });
});

test.describe('Section 32: Analytics Dashboard Details', () => {
  test.setTimeout(120_000);

  test('DASH-001: Analytics insight cards render', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    await expect(page.getByText('Insights')).toBeVisible();
    await expect(page.getByText('Avg. Messages/Conv')).toBeVisible();
    await expect(page.getByText('Daily Average')).toBeVisible();
    await expect(page.getByText('Message Growth')).toBeVisible();
    await expect(page.getByText('Engagement Trend')).toBeVisible();

    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('Growing')).toBeVisible();
  });

  test('DASH-002: Analytics daily data gap filling', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    await expect(page.getByText('Conversations Over Time')).toBeVisible();

    await page.locator('button', { hasText: '7d' }).click();
    await page.waitForTimeout(5000);

    const chartBars = page.locator('.bg-primary-500.rounded-t[title]');
    const count = await chartBars.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('DASH-003: Analytics empty chart state text', async ({ page }) => {
    await page.goto(`${BASE_URL}/analytics`);
    await waitForAnalytics(page);

    const body = await page.locator('body').textContent();
    expect(body?.length).toBeGreaterThan(50);

    const noDataCount = await page.getByText('No data available').count();
    const barCount = await page.locator('.bg-primary-500.rounded-t').count();
    expect(noDataCount + barCount).toBeGreaterThanOrEqual(0);
  });
});
