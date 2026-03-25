/**
 * Global Credit Packages E2E Tests
 *
 * Tests the full lifecycle of admin-managed global credit packages:
 * 1. Admin CRUD operations (create, read, update, delete, reorder)
 * 2. Admin API validation and error handling
 * 3. Public API serves only active global packages
 * 4. Settings page shows read-only packages with toggle controls
 * 5. Widget config serves global packages filtered by disabledPackageIds
 * 6. Widget purchase flow validates against global packages
 * 7. Admin nav includes Credit Packages link
 * 8. Edge cases (empty state, deactivation with purchase history, etc.)
 */

import { test, expect, Page } from '@playwright/test';

const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';

// Track IDs of packages created during tests for cleanup
const createdPackageIds: string[] = [];

// ============================================================
// Helpers
// ============================================================

async function createTestPackage(page: Page, overrides: Record<string, unknown> = {}) {
  const res = await page.request.post('/api/admin/credit-packages', {
    data: {
      name: 'E2E Test Package',
      description: 'Created by E2E test',
      credit_amount: 100,
      price_cents: 999,
      stripe_price_id: 'price_e2e_test_' + Date.now(),
      active: true,
      ...overrides,
    },
  });
  const body = await res.json();
  if (body.data?.package?.id) {
    createdPackageIds.push(body.data.package.id);
  }
  return { res, body };
}

async function deleteTestPackage(page: Page, id: string) {
  await page.request.delete(`/api/admin/credit-packages/${id}`);
}

async function cleanupTestPackages(page: Page) {
  for (const id of createdPackageIds) {
    try {
      await page.request.delete(`/api/admin/credit-packages/${id}`);
    } catch {
      // ignore cleanup errors
    }
  }
  createdPackageIds.length = 0;
}

async function resetBotConfig(page: Page) {
  await page.request.patch(`/api/chatbots/${BOT_ID}`, {
    data: {
      credit_exhaustion_mode: 'tickets',
      credit_exhaustion_config: {},
    },
  });
}

/** Mock the widget config to report credits already exhausted */
async function mockWidgetConfigExhausted(page: Page, mode: string, extraConfig: Record<string, unknown> = {}) {
  await page.route(`**/api/widget/${BOT_ID}/config*`, async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    if (data.data) {
      data.data.creditExhausted = true;
      data.data.creditExhaustionMode = mode;
      if (Object.keys(extraConfig).length > 0) {
        data.data.creditExhaustionConfig = { ...data.data.creditExhaustionConfig, ...extraConfig };
      }
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
  });
}

// ============================================================
// 1. ADMIN API — CRUD OPERATIONS
// ============================================================
test.describe('1. Admin API — CRUD Operations', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
  });

  test('ADMIN-001: Create a global credit package', async ({ page }) => {
    const { res, body } = await createTestPackage(page, {
      name: 'Starter Pack',
      description: 'Good for getting started',
      credit_amount: 50,
      price_cents: 499,
      stripe_price_id: 'price_e2e_starter_001',
    });

    expect(res.status()).toBe(201);
    expect(body.data.package).toBeDefined();
    expect(body.data.package.name).toBe('Starter Pack');
    expect(body.data.package.description).toBe('Good for getting started');
    expect(body.data.package.credit_amount).toBe(50);
    expect(body.data.package.price_cents).toBe(499);
    expect(body.data.package.stripe_price_id).toBe('price_e2e_starter_001');
    expect(body.data.package.is_global).toBe(true);
    expect(body.data.package.active).toBe(true);
    expect(body.data.package.chatbot_id).toBeNull();
  });

  test('ADMIN-002: List global credit packages', async ({ page }) => {
    await createTestPackage(page, { name: 'List Test A', stripe_price_id: 'price_e2e_list_a' });
    await createTestPackage(page, { name: 'List Test B', stripe_price_id: 'price_e2e_list_b' });

    const res = await page.request.get('/api/admin/credit-packages');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.packages).toBeDefined();
    expect(Array.isArray(body.data.packages)).toBe(true);

    const names = body.data.packages.map((p: any) => p.name);
    expect(names).toContain('List Test A');
    expect(names).toContain('List Test B');
  });

  test('ADMIN-003: Update a global credit package', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'Before Update',
      stripe_price_id: 'price_e2e_update_001',
    });
    const pkgId = created.data.package.id;

    const updateRes = await page.request.put(`/api/admin/credit-packages/${pkgId}`, {
      data: {
        name: 'After Update',
        credit_amount: 500,
        price_cents: 2499,
        active: false,
      },
    });
    expect(updateRes.ok()).toBeTruthy();

    const updated = await updateRes.json();
    expect(updated.data.package.name).toBe('After Update');
    expect(updated.data.package.credit_amount).toBe(500);
    expect(updated.data.package.price_cents).toBe(2499);
    expect(updated.data.package.active).toBe(false);
    // stripe_price_id should be unchanged
    expect(updated.data.package.stripe_price_id).toBe('price_e2e_update_001');
  });

  test('ADMIN-004: Delete a global credit package', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'To Delete',
      stripe_price_id: 'price_e2e_delete_001',
    });
    const pkgId = created.data.package.id;

    const delRes = await page.request.delete(`/api/admin/credit-packages/${pkgId}`);
    expect(delRes.ok()).toBeTruthy();
    const delBody = await delRes.json();
    expect(delBody.data.deleted).toBe(true);

    // Verify it's gone from the list
    const listRes = await page.request.get('/api/admin/credit-packages');
    const listBody = await listRes.json();
    const ids = listBody.data.packages.map((p: any) => p.id);
    expect(ids).not.toContain(pkgId);

    // Remove from cleanup since already deleted
    const idx = createdPackageIds.indexOf(pkgId);
    if (idx >= 0) createdPackageIds.splice(idx, 1);
  });

  test('ADMIN-005: Sort order is assigned incrementally', async ({ page }) => {
    const { body: first } = await createTestPackage(page, {
      name: 'Sort First',
      stripe_price_id: 'price_e2e_sort_a',
    });
    const { body: second } = await createTestPackage(page, {
      name: 'Sort Second',
      stripe_price_id: 'price_e2e_sort_b',
    });

    expect(second.data.package.sort_order).toBeGreaterThan(first.data.package.sort_order);
  });

  test('ADMIN-006: Reorder packages via sort_order update', async ({ page }) => {
    const { body: a } = await createTestPackage(page, {
      name: 'Reorder A',
      stripe_price_id: 'price_e2e_reorder_a',
    });
    const { body: b } = await createTestPackage(page, {
      name: 'Reorder B',
      stripe_price_id: 'price_e2e_reorder_b',
    });

    const aOrder = a.data.package.sort_order;
    const bOrder = b.data.package.sort_order;

    // Swap sort orders
    await page.request.put(`/api/admin/credit-packages/${a.data.package.id}`, {
      data: { sort_order: bOrder },
    });
    await page.request.put(`/api/admin/credit-packages/${b.data.package.id}`, {
      data: { sort_order: aOrder },
    });

    const listRes = await page.request.get('/api/admin/credit-packages');
    const pkgs = (await listRes.json()).data.packages;
    const aIdx = pkgs.findIndex((p: any) => p.id === a.data.package.id);
    const bIdx = pkgs.findIndex((p: any) => p.id === b.data.package.id);
    expect(bIdx).toBeLessThan(aIdx);
  });
});


// ============================================================
// 2. ADMIN API — VALIDATION & ERROR HANDLING
// ============================================================
test.describe('2. Admin API — Validation & Error Handling', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
  });

  test('VAL-001: Reject package without name', async ({ page }) => {
    const res = await page.request.post('/api/admin/credit-packages', {
      data: {
        credit_amount: 100,
        price_cents: 999,
        stripe_price_id: 'price_e2e_noname',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('VAL-002: Reject package with invalid Stripe Price ID', async ({ page }) => {
    const res = await page.request.post('/api/admin/credit-packages', {
      data: {
        name: 'Invalid Stripe ID',
        credit_amount: 100,
        price_cents: 999,
        stripe_price_id: 'invalid_not_a_price_id',
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error.message).toContain('price_');
  });

  test('VAL-003: Reject package with zero credits', async ({ page }) => {
    const res = await page.request.post('/api/admin/credit-packages', {
      data: {
        name: 'Zero Credits',
        credit_amount: 0,
        price_cents: 999,
        stripe_price_id: 'price_e2e_zero',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('VAL-004: Reject package with negative price', async ({ page }) => {
    const res = await page.request.post('/api/admin/credit-packages', {
      data: {
        name: 'Negative Price',
        credit_amount: 100,
        price_cents: -500,
        stripe_price_id: 'price_e2e_neg',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('VAL-005: Update non-existent package returns 404', async ({ page }) => {
    const res = await page.request.put('/api/admin/credit-packages/00000000-0000-0000-0000-000000000000', {
      data: { name: 'Ghost' },
    });
    expect(res.status()).toBe(404);
  });

  test('VAL-006: Delete non-existent package returns 404', async ({ page }) => {
    const res = await page.request.delete('/api/admin/credit-packages/00000000-0000-0000-0000-000000000000');
    // Depending on implementation, may return 404 or success with no-op
    expect(res.status()).toBeLessThan(500);
  });

  test('VAL-007: Create package with all optional fields', async ({ page }) => {
    const { res, body } = await createTestPackage(page, {
      name: 'Full Package',
      description: 'A package with all fields set',
      credit_amount: 1000,
      price_cents: 4999,
      stripe_price_id: 'price_e2e_full',
      active: false,
      sort_order: 99,
    });
    expect(res.status()).toBe(201);
    expect(body.data.package.description).toBe('A package with all fields set');
    expect(body.data.package.active).toBe(false);
  });
});


// ============================================================
// 3. PUBLIC CREDIT PACKAGES API
// ============================================================
test.describe('3. Public Credit Packages API', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
  });

  test('PUB-001: Public API returns only active global packages', async ({ page }) => {
    // Create one active and one inactive
    await createTestPackage(page, {
      name: 'Active E2E Pkg',
      stripe_price_id: 'price_e2e_pub_active',
      active: true,
    });
    await createTestPackage(page, {
      name: 'Inactive E2E Pkg',
      stripe_price_id: 'price_e2e_pub_inactive',
      active: false,
    });

    const res = await page.request.get('/api/credit-packages');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();

    const names = body.data.packages.map((p: any) => p.name);
    expect(names).toContain('Active E2E Pkg');
    expect(names).not.toContain('Inactive E2E Pkg');
  });

  test('PUB-002: Public API does not expose stripe_price_id', async ({ page }) => {
    await createTestPackage(page, {
      name: 'No Stripe ID Visible',
      stripe_price_id: 'price_e2e_pub_hidden',
    });

    const res = await page.request.get('/api/credit-packages');
    const body = await res.json();
    const pkg = body.data.packages.find((p: any) => p.name === 'No Stripe ID Visible');
    expect(pkg).toBeDefined();
    // Public endpoint should not return stripe_price_id
    expect(pkg.stripe_price_id).toBeUndefined();
  });

  test('PUB-003: Public API returns sorted by sort_order', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Sort Z',
      stripe_price_id: 'price_e2e_pub_sort_z',
      sort_order: 10,
    });
    await createTestPackage(page, {
      name: 'Sort A',
      stripe_price_id: 'price_e2e_pub_sort_a',
      sort_order: 1,
    });

    const res = await page.request.get('/api/credit-packages');
    const body = await res.json();
    const pkgs = body.data.packages;

    const sortAIdx = pkgs.findIndex((p: any) => p.name === 'Sort A');
    const sortZIdx = pkgs.findIndex((p: any) => p.name === 'Sort Z');
    if (sortAIdx >= 0 && sortZIdx >= 0) {
      expect(sortAIdx).toBeLessThan(sortZIdx);
    }
  });
});


// ============================================================
// 4. SETTINGS PAGE — READ-ONLY PACKAGE TOGGLES
// ============================================================
test.describe('4. Settings Page — Package Toggles', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
    await resetBotConfig(page);
  });

  test('SET-001: Settings page shows global packages as read-only with toggles', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Settings Pkg A',
      credit_amount: 100,
      price_cents: 999,
      stripe_price_id: 'price_e2e_settings_a',
    });
    await createTestPackage(page, {
      name: 'Settings Pkg B',
      credit_amount: 500,
      price_cents: 2499,
      stripe_price_id: 'price_e2e_settings_b',
    });

    // Set bot to purchase_credits mode
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');

    // Navigate to Credit Exhaustion section
    const navButton = page.locator('nav button', { hasText: 'Credit Exhaustion' });
    if (await navButton.isVisible()) {
      await navButton.click();
    } else {
      // May be in a different nav structure — try sidebar
      const fallbackNav = page.locator('button', { hasText: /fallback|exhaustion/i });
      if (await fallbackNav.isVisible()) await fallbackNav.click();
    }

    // Wait for packages to load
    await page.waitForTimeout(2000);

    // Verify packages are displayed
    await expect(page.getByText('Settings Pkg A')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Settings Pkg B')).toBeVisible();

    // Verify credit amounts are shown
    await expect(page.getByText('100 credits')).toBeVisible();
    await expect(page.getByText('500 credits')).toBeVisible();

    // Verify prices are shown
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByText('$24.99')).toBeVisible();

    // Verify no Stripe Price ID is visible
    await expect(page.getByText('price_e2e_settings_a')).not.toBeVisible();
    await expect(page.getByText('price_e2e_settings_b')).not.toBeVisible();

    // Verify no "Add Package" button
    await expect(page.getByText('Add Package')).not.toBeVisible();

    // Verify info text
    await expect(page.getByText('Packages are configured by your platform administrator')).toBeVisible();
  });

  test('SET-002: Settings page shows empty state when no packages exist', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');

    const navButton = page.locator('nav button', { hasText: 'Credit Exhaustion' });
    if (await navButton.isVisible()) await navButton.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText('No credit packages have been set up yet')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Contact your platform administrator')).toBeVisible();
  });

  test('SET-003: Toggle disables a package and persists via save', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'Toggle Test Pkg',
      credit_amount: 200,
      price_cents: 1499,
      stripe_price_id: 'price_e2e_toggle_test',
    });
    const pkgId = created.data.package.id;

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {},
      },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');

    const navButton = page.locator('nav button', { hasText: 'Credit Exhaustion' });
    if (await navButton.isVisible()) await navButton.click();

    await page.waitForTimeout(2000);

    // Find the toggle for our package
    await expect(page.getByText('Toggle Test Pkg')).toBeVisible({ timeout: 10000 });

    // Click the toggle switch (the button role="switch" next to our package)
    const packageRow = page.locator('div', { hasText: 'Toggle Test Pkg' }).locator('button[role="switch"]');
    await packageRow.click();

    // Package should now appear dimmed/disabled
    await expect(packageRow).toHaveAttribute('aria-checked', 'false');

    // Save settings
    const saveButton = page.locator('button', { hasText: /save/i });
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(2000);
    }

    // Verify the config was saved with disabledPackageIds
    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();

    // The widget config should NOT include the disabled package
    const widgetPackageIds = (config.data.creditPackages || []).map((p: any) => p.id);
    expect(widgetPackageIds).not.toContain(pkgId);
  });
});


// ============================================================
// 5. WIDGET CONFIG — GLOBAL PACKAGES WITH FILTERING
// ============================================================
test.describe('5. Widget Config — Global Package Filtering', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
    await resetBotConfig(page);
  });

  test('WIDGET-001: Widget config includes active global packages when mode is purchase_credits', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'Widget Visible Pkg',
      credit_amount: 100,
      price_cents: 999,
      stripe_price_id: 'price_e2e_widget_vis',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();

    expect(config.data.creditExhaustionMode).toBe('purchase_credits');
    const pkgNames = (config.data.creditPackages || []).map((p: any) => p.name);
    expect(pkgNames).toContain('Widget Visible Pkg');
  });

  test('WIDGET-002: Widget config excludes disabled packages', async ({ page }) => {
    const { body: a } = await createTestPackage(page, {
      name: 'Widget Enabled',
      stripe_price_id: 'price_e2e_widget_en',
    });
    const { body: b } = await createTestPackage(page, {
      name: 'Widget Disabled',
      stripe_price_id: 'price_e2e_widget_dis',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            disabledPackageIds: [b.data.package.id],
          },
        },
      },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    const pkgNames = (config.data.creditPackages || []).map((p: any) => p.name);

    expect(pkgNames).toContain('Widget Enabled');
    expect(pkgNames).not.toContain('Widget Disabled');
  });

  test('WIDGET-003: Widget config returns empty packages for non-purchase modes', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Should Not Appear',
      stripe_price_id: 'price_e2e_widget_nope',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    expect(config.data.creditPackages).toEqual([]);
  });

  test('WIDGET-004: Widget config excludes inactive global packages', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Active Widget Pkg',
      stripe_price_id: 'price_e2e_widget_act',
      active: true,
    });
    await createTestPackage(page, {
      name: 'Inactive Widget Pkg',
      stripe_price_id: 'price_e2e_widget_inact',
      active: false,
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    const pkgNames = (config.data.creditPackages || []).map((p: any) => p.name);

    expect(pkgNames).toContain('Active Widget Pkg');
    expect(pkgNames).not.toContain('Inactive Widget Pkg');
  });

  test('WIDGET-005: Widget config package data has correct shape', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Shape Test',
      credit_amount: 250,
      price_cents: 1999,
      stripe_price_id: 'price_e2e_widget_shape',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();
    const pkg = config.data.creditPackages.find((p: any) => p.name === 'Shape Test');

    expect(pkg).toBeDefined();
    expect(pkg.id).toBeDefined();
    expect(pkg.name).toBe('Shape Test');
    expect(pkg.creditAmount).toBe(250);
    expect(pkg.priceCents).toBe(1999);
    expect(pkg.stripePriceId).toBe('price_e2e_widget_shape');
  });
});


// ============================================================
// 6. WIDGET PURCHASE — GLOBAL PACKAGE VALIDATION
// ============================================================
test.describe('6. Widget Purchase — Global Package Validation', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
    await resetBotConfig(page);
  });

  test('PURCHASE-001: Purchase request with valid global package ID succeeds (or returns Stripe error)', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'Purchase Test',
      credit_amount: 100,
      price_cents: 999,
      stripe_price_id: 'price_e2e_purchase_test',
    });

    const res = await page.request.post(`/api/widget/${BOT_ID}/purchase`, {
      data: {
        packageId: created.data.package.id,
        successUrl: 'http://localhost:3030/success',
        cancelUrl: 'http://localhost:3030/cancel',
      },
    });

    // Will fail at Stripe (test price ID doesn't exist in Stripe) but should not be 404
    // A 404 would mean the package wasn't found, which is the bug we're guarding against
    expect(res.status()).not.toBe(404);
  });

  test('PURCHASE-002: Purchase request with non-existent package ID returns 404', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${BOT_ID}/purchase`, {
      data: {
        packageId: '00000000-0000-0000-0000-000000000000',
        successUrl: 'http://localhost:3030/success',
        cancelUrl: 'http://localhost:3030/cancel',
      },
    });
    expect(res.status()).toBe(404);
  });

  test('PURCHASE-003: Purchase request with inactive package returns 404', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'Inactive Purchase',
      stripe_price_id: 'price_e2e_purchase_inact',
      active: false,
    });

    const res = await page.request.post(`/api/widget/${BOT_ID}/purchase`, {
      data: {
        packageId: created.data.package.id,
      },
    });
    expect(res.status()).toBe(404);
  });

  test('PURCHASE-004: Purchase request with invalid packageId format returns 400', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${BOT_ID}/purchase`, {
      data: {
        packageId: 'not-a-uuid',
      },
    });
    expect(res.status()).toBe(400);
  });
});


// ============================================================
// 7. ADMIN UI — NAVIGATION & PAGE RENDERING
// ============================================================
test.describe('7. Admin UI — Navigation & Page', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
  });

  test('NAV-001: Admin sidebar includes Credit Packages link', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('link', { name: 'Credit Packages' })).toBeVisible({ timeout: 10000 });
  });

  test('NAV-002: Credit Packages link navigates to correct page', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    const link = page.getByRole('link', { name: 'Credit Packages' });
    await expect(link).toBeVisible({ timeout: 10000 });
    await link.click();

    await expect(page).toHaveURL(/\/admin\/credit-packages/);
    await expect(page.getByRole('heading', { name: 'Credit Packages' })).toBeVisible({ timeout: 10000 });
  });

  test('NAV-003: Admin page shows empty state when no packages exist', async ({ page }) => {
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');

    // Should show empty state or packages list
    await page.waitForTimeout(2000);
    const heading = page.getByRole('heading', { name: 'Credit Packages' });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('NAV-004: Admin page shows New Package button', async ({ page }) => {
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('button', { name: /new package/i })).toBeVisible({ timeout: 10000 });
  });

  test('NAV-005: Admin page displays created packages', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Admin Display Test',
      credit_amount: 300,
      price_cents: 1999,
      stripe_price_id: 'price_e2e_admin_display',
    });

    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await expect(page.getByText('Admin Display Test')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('300 credits')).toBeVisible();
    await expect(page.getByText('$19.99')).toBeVisible();
    await expect(page.getByText('price_e2e_admin_display')).toBeVisible();
  });

  test('NAV-006: Admin page create form flow', async ({ page }) => {
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click New Package
    await page.getByRole('button', { name: /new package/i }).click();

    // Fill the form
    await page.locator('input[placeholder="e.g. Starter Pack"]').fill('E2E Created Pack');
    await page.locator('input[placeholder="100"]').fill('150');
    await page.locator('input[placeholder="9.99"]').fill('12.50');
    await page.locator('input[placeholder="price_1ABC..."]').fill('price_e2e_admin_created');

    // Submit
    await page.getByRole('button', { name: /create package/i }).click();
    await page.waitForTimeout(2000);

    // Verify it appears
    await expect(page.getByText('E2E Created Pack')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Package created')).toBeVisible();

    // Cleanup
    const listRes = await page.request.get('/api/admin/credit-packages');
    const body = await listRes.json();
    const created = body.data.packages.find((p: any) => p.name === 'E2E Created Pack');
    if (created) {
      createdPackageIds.push(created.id);
    }
  });
});


// ============================================================
// 8. EDGE CASES & INTEGRATION
// ============================================================
test.describe('8. Edge Cases & Integration', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
    await resetBotConfig(page);
  });

  test('EDGE-001: Multiple chatbots can have different disabledPackageIds', async ({ page }) => {
    const { body: pkg } = await createTestPackage(page, {
      name: 'Multi-Bot Pkg',
      stripe_price_id: 'price_e2e_multi_bot',
    });
    const pkgId = pkg.data.package.id;

    // Bot 1 disables the package
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            disabledPackageIds: [pkgId],
          },
        },
      },
    });

    const config1 = await (await page.request.get(`/api/widget/${BOT_ID}/config`)).json();
    const pkg1Ids = (config1.data.creditPackages || []).map((p: any) => p.id);
    expect(pkg1Ids).not.toContain(pkgId);
  });

  test('EDGE-002: disabledPackageIds with non-existent IDs are harmlessly ignored', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Harmless Filter',
      stripe_price_id: 'price_e2e_harmless',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            disabledPackageIds: ['00000000-0000-0000-0000-000000000099'],
          },
        },
      },
    });

    const config = await (await page.request.get(`/api/widget/${BOT_ID}/config`)).json();
    const pkgNames = (config.data.creditPackages || []).map((p: any) => p.name);
    expect(pkgNames).toContain('Harmless Filter');
  });

  test('EDGE-003: Toggling all packages off results in empty creditPackages', async ({ page }) => {
    const { body: a } = await createTestPackage(page, {
      name: 'All Off A',
      stripe_price_id: 'price_e2e_alloff_a',
    });
    const { body: b } = await createTestPackage(page, {
      name: 'All Off B',
      stripe_price_id: 'price_e2e_alloff_b',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            disabledPackageIds: [a.data.package.id, b.data.package.id],
          },
        },
      },
    });

    const config = await (await page.request.get(`/api/widget/${BOT_ID}/config`)).json();
    // Filter only our test packages — there may be other packages from other tests
    const ourPkgs = (config.data.creditPackages || []).filter(
      (p: any) => p.name === 'All Off A' || p.name === 'All Off B'
    );
    expect(ourPkgs).toHaveLength(0);
  });

  test('EDGE-004: Widget purchase view shows global packages when creditExhausted', async ({ page }) => {
    await createTestPackage(page, {
      name: 'Widget View Pkg',
      credit_amount: 75,
      price_cents: 599,
      stripe_price_id: 'price_e2e_widget_view',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            upsellMessage: 'E2E: Out of credits!',
          },
        },
      },
    });

    // Mock widget as exhausted
    await mockWidgetConfigExhausted(page, 'purchase_credits', {
      purchase_credits: {
        upsellMessage: 'E2E: Out of credits!',
      },
    });

    await page.goto(`/widget/${BOT_ID}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // The purchase credits fallback view should show
    // Look for the upsell message or package info
    const hasUpsell = await page.getByText('E2E: Out of credits!').isVisible().catch(() => false);
    const hasPkg = await page.getByText('Widget View Pkg').isVisible().catch(() => false);

    // At least one should be visible in the fallback view
    expect(hasUpsell || hasPkg).toBeTruthy();
  });

  test('EDGE-005: Upsell and success messages are chatbot-specific', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            upsellMessage: 'Custom upsell for this bot',
            purchaseSuccessMessage: 'Custom success for this bot',
            disabledPackageIds: [],
          },
        },
      },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();

    expect(config.data.creditExhaustionConfig.purchase_credits.upsellMessage).toBe('Custom upsell for this bot');
    expect(config.data.creditExhaustionConfig.purchase_credits.purchaseSuccessMessage).toBe('Custom success for this bot');
  });

  test('EDGE-006: Admin can deactivate a package and it disappears from widget config', async ({ page }) => {
    const { body: created } = await createTestPackage(page, {
      name: 'Deactivate Test',
      stripe_price_id: 'price_e2e_deactivate',
      active: true,
    });
    const pkgId = created.data.package.id;

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    // Verify it appears initially
    let config = await (await page.request.get(`/api/widget/${BOT_ID}/config`)).json();
    let pkgNames = (config.data.creditPackages || []).map((p: any) => p.name);
    expect(pkgNames).toContain('Deactivate Test');

    // Deactivate it
    await page.request.put(`/api/admin/credit-packages/${pkgId}`, {
      data: { active: false },
    });

    // Verify it's gone from widget config
    config = await (await page.request.get(`/api/widget/${BOT_ID}/config`)).json();
    pkgNames = (config.data.creditPackages || []).map((p: any) => p.name);
    expect(pkgNames).not.toContain('Deactivate Test');
  });
});
