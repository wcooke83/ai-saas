/**
 * E2E Tests: Notification Preferences
 *
 * Covers:
 * - Settings page renders Notifications section with 5 toggles
 * - Toggling a preference calls PATCH /api/notifications/preferences
 * - GET /api/notifications/preferences returns the 5 keys
 * - PATCH /api/notifications/preferences updates a preference
 * - PATCH rejects empty/invalid body with 400
 * - Unauthenticated requests return 401
 */

import { test, expect } from '@playwright/test';

const SETTINGS_URL = '/dashboard/settings';

test.describe('Notification Preferences UI', () => {
  test('NOTIF-001: Settings page shows Notifications section', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');

    // Wait for page to load (it uses a loading state before rendering)
    await expect(
      page.getByRole('heading', { name: 'Settings' })
    ).toBeVisible({ timeout: 20000 });

    // Notifications card heading
    await expect(page.getByText('Notifications').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Manage your notification preferences')).toBeVisible({ timeout: 10000 });
  });

  test('NOTIF-002: All 5 notification toggles are visible', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Notifications').first()).toBeVisible({ timeout: 20000 });

    const labels = [
      'New ticket',
      'New escalation',
      'Product updates',
      'Usage alerts',
      'Marketing emails',
    ];

    for (const label of labels) {
      await expect(page.getByText(label, { exact: true })).toBeVisible({ timeout: 10000 });
    }
  });

  test('NOTIF-003: Toggling notification preference calls PATCH endpoint', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Notifications').first()).toBeVisible({ timeout: 20000 });

    // Find the "Marketing emails" toggle (default: false, safest to toggle)
    const marketingRow = page.locator('div').filter({ hasText: /^Marketing emails$/ }).locator('..');
    const toggle = marketingRow.locator('button[role="switch"]').or(
      marketingRow.locator('input[type="checkbox"]')
    ).first();

    await expect(toggle).toBeVisible({ timeout: 10000 });

    // Watch for the PATCH call
    const patchPromise = page.waitForResponse(
      (res) => res.url().includes('/api/notifications/preferences') && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    await toggle.click();
    const patchRes = await patchPromise;
    expect(patchRes.ok()).toBeTruthy();

    const body = await patchRes.json();
    expect(body.preferences).toBeDefined();
    expect(typeof body.preferences.notify_marketing).toBe('boolean');

    // Toggle back to restore original state
    const patchPromise2 = page.waitForResponse(
      (res) => res.url().includes('/api/notifications/preferences') && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );
    await toggle.click();
    await patchPromise2;
  });

  test('NOTIF-004: Notification preferences persist after page reload', async ({ page }) => {
    await page.goto(SETTINGS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Notifications').first()).toBeVisible({ timeout: 20000 });

    // Read the initial state of "Product updates" toggle
    const productUpdatesRow = page.locator('div').filter({ hasText: /^Product updates$/ }).locator('..');
    const toggle = productUpdatesRow.locator('button[role="switch"]').or(
      productUpdatesRow.locator('input[type="checkbox"]')
    ).first();

    await expect(toggle).toBeVisible({ timeout: 10000 });

    const initialChecked = await toggle.isChecked().catch(() => null);
    const initialAriaChecked = await toggle.getAttribute('aria-checked');
    const wasOn = initialChecked !== null ? initialChecked : initialAriaChecked === 'true';

    // Toggle it
    const patchPromise = page.waitForResponse(
      (res) => res.url().includes('/api/notifications/preferences') && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );
    await toggle.click();
    await patchPromise;

    // Reload and verify persistence
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Notifications').first()).toBeVisible({ timeout: 20000 });

    const toggleAfter = productUpdatesRow.locator('button[role="switch"]').or(
      productUpdatesRow.locator('input[type="checkbox"]')
    ).first();

    const checkedAfter = await toggleAfter.isChecked().catch(() => null);
    const ariaCheckedAfter = await toggleAfter.getAttribute('aria-checked');
    const isOnAfter = checkedAfter !== null ? checkedAfter : ariaCheckedAfter === 'true';

    // Should have flipped
    expect(isOnAfter).toBe(!wasOn);

    // Restore original state
    const patchPromise2 = page.waitForResponse(
      (res) => res.url().includes('/api/notifications/preferences') && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );
    await toggleAfter.click();
    await patchPromise2;
  });
});

test.describe('/api/notifications/preferences', () => {
  test('NOTIF-API-001: GET returns 200 with all 5 preference keys', async ({ page }) => {
    const res = await page.request.get('/api/notifications/preferences');
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.preferences).toBeDefined();

    const keys = [
      'notify_new_ticket',
      'notify_new_escalation',
      'notify_product_updates',
      'notify_usage_alerts',
      'notify_marketing',
    ];

    for (const key of keys) {
      expect(typeof body.preferences[key]).toBe('boolean');
    }
  });

  test('NOTIF-API-002: PATCH updates a single preference', async ({ page }) => {
    // Get current state
    const getRes = await page.request.get('/api/notifications/preferences');
    const { preferences } = await getRes.json();
    const currentMarketing = preferences.notify_marketing;

    // Flip it
    const patchRes = await page.request.patch('/api/notifications/preferences', {
      data: { notify_marketing: !currentMarketing },
    });
    expect(patchRes.ok()).toBeTruthy();

    const patchBody = await patchRes.json();
    expect(patchBody.preferences.notify_marketing).toBe(!currentMarketing);

    // Restore
    await page.request.patch('/api/notifications/preferences', {
      data: { notify_marketing: currentMarketing },
    });
  });

  test('NOTIF-API-003: PATCH returns 400 for empty body', async ({ page }) => {
    const res = await page.request.patch('/api/notifications/preferences', {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('NOTIF-API-004: PATCH ignores non-boolean values for allowed keys', async ({ page }) => {
    // String value for a boolean key — should be ignored (not updated)
    const res = await page.request.patch('/api/notifications/preferences', {
      data: { notify_marketing: 'yes' },
    });
    // Should return 400 since no valid keys were found after whitelist filtering
    expect(res.status()).toBe(400);
  });

  test('NOTIF-API-005: PATCH ignores unknown keys', async ({ page }) => {
    const res = await page.request.patch('/api/notifications/preferences', {
      data: { unknown_key: true },
    });
    expect(res.status()).toBe(400);
  });

  test('NOTIF-API-006: Unauthenticated GET returns 401', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    await context.clearCookies();
    const anonPage = await context.newPage();

    const res = await anonPage.request.get('http://localhost:3030/api/notifications/preferences');
    expect(res.status()).toBe(401);

    await context.close();
  });

  test('NOTIF-API-007: Unauthenticated PATCH returns 401', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    await context.clearCookies();
    const anonPage = await context.newPage();

    const res = await anonPage.request.patch('http://localhost:3030/api/notifications/preferences', {
      data: { notify_marketing: true },
    });
    expect(res.status()).toBe(401);

    await context.close();
  });
});
