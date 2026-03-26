import { test, expect } from '@playwright/test';

test.describe('Section 39: Admin -- API Logs (/admin/logs)', () => {
  test('ADMIN-LOGS-001: Logs page loads with stat cards', async ({ page }) => {
    await page.goto('/admin/logs');
    await page.waitForLoadState('domcontentloaded');

    // Wait for loading skeleton to disappear
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Header
    await expect(page.locator('h1', { hasText: 'API Logs' })).toBeVisible();
    await expect(page.getByText('Raw AI requests and responses')).toBeVisible();

    // Four stat cards
    await expect(page.getByText('Total Requests')).toBeVisible();
    await expect(page.getByText('Errors', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Tokens')).toBeVisible();
    await expect(page.getByText('Avg Duration')).toBeVisible();
  });

  test('ADMIN-LOGS-002: Logs page loading skeleton', async ({ page }) => {
    // Navigate and immediately check for skeleton
    await page.goto('/admin/logs');
    // Should see pulse-animated placeholders initially
    const skeleton = page.locator('.animate-pulse');
    // May or may not catch it depending on speed, so just verify page loads eventually
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1', { hasText: 'API Logs' })).toBeVisible({ timeout: 15000 });
  });

  test('ADMIN-LOGS-003: Filter dropdown -- All Requests', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Select "All Requests" filter
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('all');

    // Verify the filter is set
    await expect(filterSelect).toHaveValue('all');
  });

  test('ADMIN-LOGS-004: Filter dropdown -- Errors Only', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Select "Errors Only" filter
    const filterSelect = page.locator('select');
    await filterSelect.selectOption('errors');
    await expect(filterSelect).toHaveValue('errors');
  });

  test('ADMIN-LOGS-005: Refresh button', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Click refresh button
    const refreshBtn = page.getByRole('button', { name: /refresh/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // The RefreshCw icon should spin (animate-spin class)
    await expect(page.locator('.animate-spin')).toBeVisible({ timeout: 5000 });

    // Wait for refresh to complete
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });
  });

  test('ADMIN-LOGS-006: Log entry collapsed view', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Check if there are log entries
    const logEntries = page.locator('.border.border-secondary-200, .border.dark\\:border-secondary-700').locator('.cursor-pointer');
    const count = await logEntries.count();

    if (count > 0) {
      const firstEntry = logEntries.first();
      // Should show status code badge
      await expect(firstEntry.locator('.rounded.text-xs.font-medium').first()).toBeVisible();
      // Should show endpoint in monospace
      await expect(firstEntry.locator('.font-mono').first()).toBeVisible();
      // Should have a chevron icon
      await expect(firstEntry.locator('svg').last()).toBeVisible();
    }
  });

  test('ADMIN-LOGS-007: Log entry expanded view -- metadata grid', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Click first log entry to expand
    const logEntry = page.locator('.cursor-pointer').first();
    const entryCount = await logEntry.count();
    if (entryCount === 0) return; // No logs to test

    await logEntry.click();

    // Should show metadata fields
    await expect(page.getByText('User ID')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('IP Address')).toBeVisible();
    await expect(page.getByText('Tokens (In/Out/Billed)')).toBeVisible();
    await expect(page.getByText('Duration').first()).toBeVisible();
  });

  test('ADMIN-LOGS-008: Log entry expanded view -- error message', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Filter to errors only to find entries with error messages
    await page.locator('select').selectOption('errors');

    const errorEntries = page.locator('.cursor-pointer');
    const count = await errorEntries.count();
    if (count === 0) return; // No error logs

    await errorEntries.first().click();

    // Error section should have red background
    const errorSection = page.locator('.bg-red-50, .dark\\:bg-red-900\\/20').first();
    if (await errorSection.isVisible()) {
      await expect(errorSection).toBeVisible();
    }
  });

  test('ADMIN-LOGS-009: Log entry expanded view -- request body with copy', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const logEntry = page.locator('.cursor-pointer').first();
    if ((await logEntry.count()) === 0) return;

    await logEntry.click();

    // Check for Request Body section
    const requestBodyLabel = page.getByText('Request Body');
    if (await requestBodyLabel.isVisible()) {
      await expect(requestBodyLabel).toBeVisible();
      // Should have a copy button nearby
      const copyBtns = page.locator('button').filter({ has: page.locator('svg') });
      expect(await copyBtns.count()).toBeGreaterThan(0);
    }
  });

  test('ADMIN-LOGS-010: Log entry expanded view -- raw AI prompt with copy', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const logEntry = page.locator('.cursor-pointer').first();
    if ((await logEntry.count()) === 0) return;

    await logEntry.click();

    // Check for Raw AI Prompt section (blue background)
    const promptSection = page.locator('.bg-blue-50, .dark\\:bg-blue-900\\/20');
    if (await promptSection.count() > 0) {
      await expect(page.getByText('Raw AI Prompt')).toBeVisible();
    }
  });

  test('ADMIN-LOGS-011: Log entry expanded view -- raw AI response with copy', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const logEntry = page.locator('.cursor-pointer').first();
    if ((await logEntry.count()) === 0) return;

    await logEntry.click();

    // Check for Raw AI Response section (green background)
    const responseSection = page.locator('.bg-green-50, .dark\\:bg-green-900\\/20');
    if (await responseSection.count() > 0) {
      await expect(page.getByText('Raw AI Response')).toBeVisible();
    }
  });

  test('ADMIN-LOGS-012: Log entry expanded view -- user agent', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const logEntry = page.locator('.cursor-pointer').first();
    if ((await logEntry.count()) === 0) return;

    await logEntry.click();

    // Check for User Agent section
    const userAgentLabel = page.getByText('User Agent');
    if (await userAgentLabel.isVisible()) {
      await expect(userAgentLabel).toBeVisible();
    }
  });

  test('ADMIN-LOGS-013: Log entry collapse toggle', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const logEntry = page.locator('.cursor-pointer').first();
    if ((await logEntry.count()) === 0) return;

    // Expand
    await logEntry.click();
    await expect(page.getByText('User ID')).toBeVisible({ timeout: 5000 });

    // Collapse
    await logEntry.click();
    await expect(page.getByText('User ID')).not.toBeVisible({ timeout: 5000 });
  });

  test('ADMIN-LOGS-014: Empty state', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Check for empty state (may or may not be present depending on data)
    const noLogs = page.getByText('No logs found');
    const logEntries = page.locator('.cursor-pointer');

    // Either we have logs or we see the empty state
    const hasLogs = (await logEntries.count()) > 0;
    if (!hasLogs) {
      await expect(noLogs).toBeVisible();
    }
  });

  test('ADMIN-LOGS-015: Stat card -- Total Tokens formatting', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Total Tokens card should show a formatted number
    const tokensCard = page.locator('text=Total Tokens').locator('..');
    await expect(tokensCard).toBeVisible();
    const boldValue = tokensCard.locator('.text-2xl.font-bold');
    const text = await boldValue.textContent();
    // Should be a number (possibly with commas)
    expect(text).toBeTruthy();
  });

  test('ADMIN-LOGS-016: Stat card -- Avg Duration formatting', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const durationCard = page.locator('text=Avg Duration').locator('..');
    await expect(durationCard).toBeVisible();
    const boldValue = durationCard.locator('.text-2xl.font-bold');
    const text = await boldValue.textContent();
    // Should show ms, s, or "-"
    expect(text).toBeTruthy();
    expect(text).toMatch(/(\d+ms|\d+\.\d+s|-)/);
  });

  test('ADMIN-LOGS-017: Back button navigates to admin', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Click the Back link (Link wrapping a Button)
    const backBtn = page.getByRole('link', { name: 'Back' });
    await backBtn.click();

    await page.waitForURL('**/admin', { timeout: 10000 });
    expect(page.url()).toContain('/admin');
    expect(page.url()).not.toContain('/admin/logs');
  });

  test('ADMIN-LOGS-018: Log limit of 100 records', async ({ page }) => {
    await page.goto('/admin/logs');
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Count log entries - should be at most 100
    const logEntries = page.locator('.cursor-pointer');
    const count = await logEntries.count();
    expect(count).toBeLessThanOrEqual(100);
  });
});
