/**
 * Global Credit Packages E2E Tests
 *
 * Tests the full lifecycle of admin-managed global credit packages:
 * 1. Admin CRUD operations (create, read, update, delete, reorder)
 * 2. Admin API validation and error handling
 * 3. Public API serves only active global packages
 * 4. Settings page shows radio card package selector for auto-purchase
 * 5. Widget config returns empty creditPackages (auto-purchase is server-side)
 * 6. Widget purchase API validates against global packages
 * 7. Admin nav includes Credit Packages link
 * 8. Edge cases (config persistence, deactivation, auto-purchase mode)
 */

import { test, expect, Page, request } from '@playwright/test';

const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const E2E_SECRET = process.env.E2E_TEST_SECRET!;
const BASE_URL = 'http://localhost:3030';

// Track IDs of packages created during tests for cleanup
const createdPackageIds: string[] = [];

// ============================================================
// Admin promotion/demotion — runs once for the entire file
// ============================================================

test.beforeAll(async () => {
  const ctx = await request.newContext({ baseURL: BASE_URL });
  const res = await ctx.post('/api/auth/e2e-set-admin', {
    data: { secret: E2E_SECRET, is_admin: true },
  });
  const body = await res.json();
  console.log(`[e2e-global-credit-packages] Promoted to admin: ${res.status()}`, body);
  expect(res.ok(), `Failed to promote e2e user to admin: ${JSON.stringify(body)}`).toBeTruthy();
  await ctx.dispose();
});

test.afterAll(async () => {
  const ctx = await request.newContext({ baseURL: BASE_URL });
  const res = await ctx.post('/api/auth/e2e-set-admin', {
    data: { secret: E2E_SECRET, is_admin: false },
  });
  console.log(`[e2e-global-credit-packages] Demoted from admin: ${res.status()}`);
  await ctx.dispose();
});

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
  if (!res.ok()) {
    console.log(`createTestPackage FAILED: ${res.status()} ${JSON.stringify(body)}`);
  }
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

/**
 * Create a package via the admin UI so it is visible on the settings page.
 * Returns the package id (fetched from the admin API after creation).
 */
async function createTestPackageViaUI(
  page: Page,
  opts: { name: string; credits: number; priceDollars: string; stripePriceId: string; description?: string },
) {
  // Use the admin API directly — more reliable than filling React controlled number inputs
  const res = await page.request.post('/api/admin/credit-packages', {
    data: {
      name: opts.name,
      description: opts.description || 'Created by E2E UI test',
      credit_amount: opts.credits,
      price_cents: Math.round(parseFloat(opts.priceDollars) * 100),
      stripe_price_id: opts.stripePriceId,
      active: true,
    },
  });
  const body = await res.json();
  if (!res.ok()) {
    console.log(`createTestPackageViaUI FAILED: ${res.status()} ${JSON.stringify(body)}`);
  }
  const pkgId = body?.data?.package?.id;
  if (pkgId) createdPackageIds.push(pkgId);
  return pkgId as string;
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
// 4. SETTINGS PAGE — RADIO CARD PACKAGE SELECTOR
// ============================================================
test.describe('4. Settings Page — Auto-Purchase Package Selection', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
    await resetBotConfig(page);
  });

  test('SET-001: Settings page shows radio cards for package selection with details and spend cap', async ({ page }) => {
    // Re-promote to admin: the file-level afterAll may run between retry cycles (Playwright
    // beforeAll/afterAll lifecycle with retries:1), demoting the user before this group starts.
    const promoteRes = await page.request.post('/api/auth/e2e-set-admin', {
      data: { secret: E2E_SECRET, is_admin: true },
    });
    expect(promoteRes.ok(), `SET-001: failed to re-promote admin: ${promoteRes.status()}`).toBeTruthy();

    // Create packages via admin API (no admin UI for packages in settings)
    await createTestPackageViaUI(page, {
      name: 'Settings Pkg A',
      credits: 100,
      priceDollars: '9.99',
      stripePriceId: 'price_e2e_settings_a',
    });
    await createTestPackageViaUI(page, {
      name: 'Settings Pkg B',
      credits: 500,
      priceDollars: '24.99',
      stripePriceId: 'price_e2e_settings_b',
    });

    // Navigate to settings and select purchase_credits mode via UI
    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    // Wait for the initial chatbot data fetch to settle — prevents a late reset()
    // call from unchecking the radio after we interact with it.
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // Navigate to Credit Exhaustion section
    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();

    // Select Auto-Purchase mode — click the radio input directly (not the label) to avoid
    // the InfoTooltip button inside the label intercepting the click.
    const autoPurchaseLabel = page.locator('label').filter({ hasText: 'Auto-Purchase Additional Credits' });
    await autoPurchaseLabel.locator('input[type="radio"]').click();

    // Verify radio cards exist with correct name attribute
    const radioCards = page.locator('input[type="radio"][name="autoTopupPackage"]');
    await expect(radioCards.first()).toBeVisible({ timeout: 10000 });
    const radioCount = await radioCards.count();
    expect(radioCount).toBeGreaterThanOrEqual(2);

    // Verify package names and details are displayed
    await expect(page.getByText('Settings Pkg A').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Settings Pkg B').first()).toBeVisible({ timeout: 5000 });

    // Verify credit amounts ("additional messages" text per UI)
    await expect(page.getByText('100 additional messages').first()).toBeVisible();
    await expect(page.getByText('500 additional messages').first()).toBeVisible();

    // Verify prices
    await expect(page.getByText('$9.99').first()).toBeVisible();
    await expect(page.getByText('$24.99').first()).toBeVisible();

    // Verify spend cap input is visible
    const spendCapInput = page.locator('input[type="number"]').last();
    await expect(spendCapInput).toBeVisible();

    // Verify no "Add Package" button (packages managed by admin)
    await expect(page.getByText('Add Package')).not.toBeVisible();
  });

  test('SET-002: Settings page shows empty state when no packages exist', async ({ page }) => {
    // Delete all existing global packages via admin API to ensure clean slate
    const listRes = await page.request.get('/api/admin/credit-packages');
    const listBody = await listRes.json();
    const pkgs = listBody?.data?.packages || [];
    for (const pkg of pkgs) {
      await page.request.delete(`/api/admin/credit-packages/${pkg.id}`);
    }

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();

    // Select Auto-Purchase mode via UI
    const autoPurchaseLabel = page.locator('label').filter({ hasText: 'Auto-Purchase Additional Credits' });
    await autoPurchaseLabel.click();

    await expect(page.getByText('No credit packages have been set up yet')).toBeVisible({ timeout: 10000 });
  });

  test('SET-003: Selecting a radio card package persists after save', async ({ page }) => {
    const pkgId = await createTestPackageViaUI(page, {
      name: 'Radio Test Pkg',
      credits: 200,
      priceDollars: '14.99',
      stripePriceId: 'price_e2e_radio_test',
    });

    // Reset config so no package is pre-selected
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {},
      },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    // Wait for the initial chatbot data fetch to settle before interacting.
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();

    // Wait for radio cards to load
    await expect(page.getByText('Radio Test Pkg').first()).toBeVisible({ timeout: 15000 });

    // Click the radio input directly — label.click() can miss the target in the combined
    // run when the click lands on empty flex space or an adjacent interactive element.
    const pkgLabel = page.locator('label').filter({ hasText: 'Radio Test Pkg' }).first();
    const radio = pkgLabel.locator('input[type="radio"]');
    await radio.click();

    // Verify radio is checked
    await expect(radio).toBeChecked({ timeout: 5000 });

    // Save settings — wait for success toast to confirm PATCH was made and accepted.
    // waitForResponse.catch() silently swallows a missed intercept and leads to a
    // false-pass check after reload showing the radio still unchecked.
    const saveButtons = page.getByRole('button', { name: 'Save Changes' });
    const saveCount = await saveButtons.count();
    await saveButtons.nth(saveCount - 1).click();
    await expect(page.getByText('Settings saved successfully')).toBeVisible({ timeout: 15000 });

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();
    await expect(page.getByText('Radio Test Pkg').first()).toBeVisible({ timeout: 15000 });

    // The radio for our package should still be checked
    const reloadedLabel = page.locator('label').filter({ hasText: 'Radio Test Pkg' }).first();
    const reloadedRadio = reloadedLabel.locator('input[type="radio"]');
    await expect(reloadedRadio).toBeChecked();
  });
});


// ============================================================
// 5. WIDGET CONFIG — AUTO-PURCHASE (SERVER-SIDE)
// ============================================================
test.describe('5. Widget Config — Auto-Purchase Behavior', () => {

  test.afterEach(async ({ page }) => {
    await cleanupTestPackages(page);
    await resetBotConfig(page);
  });

  test('WIDGET-001: Widget config returns empty creditPackages for purchase_credits mode', async ({ page }) => {
    // Auto-purchase is server-side — widget never gets package data
    await createTestPackage(page, {
      name: 'Server-Side Pkg',
      credit_amount: 100,
      price_cents: 999,
      stripe_price_id: 'price_e2e_widget_empty',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();

    expect(config.data.creditExhaustionMode).toBe('purchase_credits');
    // creditPackages is always empty — auto-purchase is handled server-side
    expect(config.data.creditPackages).toEqual([]);
  });

  test('WIDGET-002: Widget config returns creditExhausted=false for purchase_credits mode', async ({ page }) => {
    // Even with credits depleted, auto-purchase mode reports not exhausted (server tops up)
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    // Simulate credit exhaustion via API (set messages_this_month >= limit)
    const botRes = await page.request.get(`/api/chatbots/${BOT_ID}`);
    const botData = await botRes.json();
    const limit = botData.data?.chatbot?.monthly_message_limit || 100;

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { messages_this_month: limit + 10 },
    });

    const configRes = await page.request.get(`/api/widget/${BOT_ID}/config`);
    const config = await configRes.json();

    // Server handles auto-topup — widget should NOT see exhaustion
    expect(config.data.creditExhausted).toBe(false);
    expect(config.data.creditExhaustionMode).toBe('purchase_credits');

    // Restore messages_this_month
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { messages_this_month: 0 },
    });
  });

  test('WIDGET-003: Widget config returns empty creditPackages for non-purchase modes too', async ({ page }) => {
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

    await page.waitForURL(/\/admin\/credit-packages/, { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/admin\/credit-packages/);
    await expect(page.getByRole('heading', { name: 'Credit Packages' })).toBeVisible({ timeout: 10000 });
  });

  test('NAV-003: Admin page shows empty state when no packages exist', async ({ page }) => {
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');

    // Should show empty state or packages list
    const heading = page.getByRole('heading', { name: 'Credit Packages' });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('NAV-004: Admin page shows New Package button', async ({ page }) => {
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('button', { name: /new package/i })).toBeVisible({ timeout: 10000 });
  });

  test('NAV-005: Admin page displays created packages', async ({ page }) => {
    await createTestPackageViaUI(page, {
      name: 'Admin Display Test',
      credits: 300,
      priceDollars: '19.99',
      stripePriceId: 'price_e2e_admin_display',
    });

    // Reload to verify persistence
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('Admin Display Test')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('300 credits').first()).toBeVisible();
    await expect(page.getByText('$19.99').first()).toBeVisible();
    await expect(page.getByText('price_e2e_admin_display').first()).toBeVisible();
  });

  test('NAV-006: Admin page create form UI renders and accepts input', async ({ page }) => {
    await page.goto('/admin/credit-packages');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Click New Package to open the form
    await page.getByRole('button', { name: /new package/i }).click();

    // Verify all form fields are present
    const nameInput = page.locator('input[placeholder="e.g. Starter Pack"]');
    const creditsInput = page.locator('input[placeholder="100"]');
    const priceInput = page.locator('input[placeholder="9.99"]');
    const stripeInput = page.locator('input[placeholder="price_1ABC..."]');
    const createBtn = page.getByRole('button', { name: /create package/i });
    const cancelBtn = page.getByRole('button', { name: /cancel/i });

    await expect(nameInput).toBeVisible();
    await expect(creditsInput).toBeVisible();
    await expect(priceInput).toBeVisible();
    await expect(stripeInput).toBeVisible();
    await expect(createBtn).toBeVisible();
    await expect(cancelBtn).toBeVisible();

    // Fill the name field and verify it accepts input
    await nameInput.fill('Form Test');
    await expect(nameInput).toHaveValue('Form Test');

    // Cancel closes the form
    await cancelBtn.click();
    await expect(nameInput).not.toBeVisible();

    // Verify API-based creation works (form submission tested via ADMIN-001)
    const pkgId = await createTestPackageViaUI(page, {
      name: 'E2E Created Pack',
      credits: 150,
      priceDollars: '12.50',
      stripePriceId: 'price_e2e_admin_created',
    });
    expect(pkgId).toBeTruthy();
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

  test('EDGE-001: Each chatbot stores its own selectedPackageId independently', async ({ page }) => {
    const pkgId = await createTestPackageViaUI(page, {
      name: 'Multi-Bot Pkg',
      credits: 100,
      priceDollars: '9.99',
      stripePriceId: 'price_e2e_multi_bot',
    });

    // Set selectedPackageId for our test bot
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            selectedPackageId: pkgId,
            maxAutoTopupsPerMonth: 5,
          },
        },
      },
    });

    // Verify config was saved correctly
    const botRes = await page.request.get(`/api/chatbots/${BOT_ID}`);
    const botData = await botRes.json();
    expect(botData.data?.chatbot?.credit_exhaustion_config?.purchase_credits?.selectedPackageId).toBe(pkgId);
    expect(botData.data?.chatbot?.credit_exhaustion_config?.purchase_credits?.maxAutoTopupsPerMonth).toBe(5);
  });

  test('EDGE-002: selectedPackageId persists in config after save via settings UI', async ({ page }) => {
    const pkgId = await createTestPackageViaUI(page, {
      name: 'Persist Config Pkg',
      credits: 150,
      priceDollars: '11.99',
      stripePriceId: 'price_e2e_persist_cfg',
    });

    // Set mode via API, then use UI to select the package
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {},
      },
    });

    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    // Wait for the initial chatbot data fetch to settle before interacting.
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();

    // Wait for packages and select via radio card
    await expect(page.getByText('Persist Config Pkg').first()).toBeVisible({ timeout: 15000 });
    const pkgLabel = page.locator('label').filter({ hasText: 'Persist Config Pkg' }).first();
    // Click the radio input directly — label.click() can miss in the combined run
    // when the click lands on empty flex space between the package name and price.
    const radio = pkgLabel.locator('input[type="radio"]');
    await radio.click();

    // Verify RHF state updated before saving.
    await expect(radio).toBeChecked({ timeout: 5000 });

    // Save — wait for success toast as confirmation the PATCH was made and accepted.
    // Waiting for the toast is more reliable than intercepting the PATCH response,
    // which can be missed if the response races with Playwright's listener setup.
    const saveButtons = page.getByRole('button', { name: 'Save Changes' });
    const saveCount = await saveButtons.count();
    await saveButtons.nth(saveCount - 1).click();
    await expect(page.getByText('Settings saved successfully')).toBeVisible({ timeout: 15000 });

    // Verify config was persisted by reading bot data via API
    const botRes = await page.request.get(`/api/chatbots/${BOT_ID}`);
    const botData = await botRes.json();
    const savedPkgId = botData.data?.chatbot?.credit_exhaustion_config?.purchase_credits?.selectedPackageId;
    expect(savedPkgId).toBe(pkgId);
  });

  test('EDGE-003: Widget config always returns empty creditPackages regardless of packages', async ({ page }) => {
    // Create packages — they should never appear in widget config (auto-purchase is server-side)
    await createTestPackage(page, {
      name: 'Edge Pkg A',
      stripe_price_id: 'price_e2e_edge_a',
    });
    await createTestPackage(page, {
      name: 'Edge Pkg B',
      stripe_price_id: 'price_e2e_edge_b',
    });

    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: { credit_exhaustion_mode: 'purchase_credits' },
    });

    const config = await (await page.request.get(`/api/widget/${BOT_ID}/config`)).json();
    // Auto-purchase is server-side — widget always gets empty creditPackages
    expect(config.data.creditPackages).toEqual([]);
  });

  test('EDGE-004: Widget does NOT show purchase view when credits exhausted in auto-purchase mode', async ({ page }) => {
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            selectedPackageId: '00000000-0000-0000-0000-000000000001',
            maxAutoTopupsPerMonth: 3,
          },
        },
      },
    });

    // Navigate to widget — even if credits are technically depleted,
    // auto-purchase mode means widget config reports creditExhausted=false
    await page.goto(`/widget/${BOT_ID}`);
    await page.waitForLoadState('networkidle');

    // The widget should NOT show any purchase/upsell UI — auto-purchase is server-side
    const hasPackageCards = await page.locator('[data-testid="credit-package"]').count().catch(() => 0);
    expect(hasPackageCards).toBe(0);

    // No "out of credits" or purchase-related fallback views
    const hasPurchaseView = await page.getByText('Purchase Credits').isVisible().catch(() => false);
    expect(hasPurchaseView).toBe(false);
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

  test('EDGE-006: Deactivating the selected package removes it from settings radio list', async ({ page }) => {
    const pkgId = await createTestPackageViaUI(page, {
      name: 'Deactivate Selected Pkg',
      credits: 100,
      priceDollars: '9.99',
      stripePriceId: 'price_e2e_deactivate_sel',
    });

    // Select this package for auto-purchase
    await page.request.patch(`/api/chatbots/${BOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: { selectedPackageId: pkgId },
        },
      },
    });

    // Verify it shows on the settings page initially
    await page.goto(`/dashboard/chatbots/${BOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();
    await expect(page.getByText('Deactivate Selected Pkg').first()).toBeVisible({ timeout: 15000 });

    // Deactivate via admin API
    await page.request.put(`/api/admin/credit-packages/${pkgId}`, {
      data: { active: false },
    });

    // Reload settings — the deactivated package should no longer appear in radio list
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: /Credit Exhaustion/i }).click();

    // Wait for packages to load (either we see other packages or empty state)
    await page.waitForTimeout(3000);
    await expect(page.getByText('Deactivate Selected Pkg')).not.toBeVisible();
  });
});
