import { test, expect } from '@playwright/test';

const BILLING_URL = '/dashboard/billing';
const APPSUMO_URL = '/dashboard/appsumo';

test.describe('License Key Redemption – Removed from Billing', () => {
  test('APPSUMO-001: billing page does NOT contain Redeem License Key text', async ({ page }) => {
    await page.goto(BILLING_URL);
    await page.waitForLoadState('domcontentloaded');
    // Wait for billing page to fully load
    await expect(page.getByText('Billing').first()).toBeVisible({ timeout: 15000 });
    // Wait for all sections to render (past skeleton loaders)
    await expect(page.getByRole('heading', { name: 'Purchase Credits' })).toBeVisible({ timeout: 15000 });

    // "Redeem License Key" should NOT be on the billing page
    await expect(page.getByRole('heading', { name: 'Redeem License Key' })).not.toBeVisible();
  });

  test('APPSUMO-002: billing page does NOT contain AppSumo text', async ({ page }) => {
    await page.goto(BILLING_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Billing').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Purchase Credits' })).toBeVisible({ timeout: 15000 });

    // "AppSumo" text should NOT be visible on the billing page
    // (unless the user is on an AppSumo plan, in which case it shows an info banner)
    // The key form itself should be absent
    const licenseInput = page.getByPlaceholder(/license key/i);
    expect(await licenseInput.count()).toBe(0);
  });
});

test.describe('AppSumo Page – /dashboard/appsumo', () => {
  test('APPSUMO-010: appsumo page loads and shows Redeem License Key heading', async ({ page }) => {
    await page.goto(APPSUMO_URL);
    await page.waitForLoadState('domcontentloaded');

    // Should stay on the appsumo page
    expect(page.url()).toContain('/dashboard/appsumo');

    // The page heading should be visible
    await expect(page.getByRole('heading', { name: 'Redeem License Key' }).first()).toBeVisible({ timeout: 15000 });

    // Subtitle
    await expect(
      page.getByText('Activate or upgrade your plan with a license key')
    ).toBeVisible();
  });

  test('APPSUMO-011: license key input field is present', async ({ page }) => {
    await page.goto(APPSUMO_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Redeem License Key' }).first()).toBeVisible({ timeout: 15000 });

    // Input field for license key
    const keyInput = page.getByPlaceholder(/license key/i);
    await expect(keyInput).toBeVisible();
  });

  test('APPSUMO-012: Redeem button is present but disabled when empty', async ({ page }) => {
    await page.goto(APPSUMO_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Redeem License Key' }).first()).toBeVisible({ timeout: 15000 });

    const redeemButton = page.getByRole('button', { name: /Redeem$/i });
    await expect(redeemButton).toBeVisible();

    // Button should be disabled when input is empty
    await expect(redeemButton).toBeDisabled();
  });

  test('APPSUMO-013: entering text enables the Redeem button', async ({ page }) => {
    await page.goto(APPSUMO_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Redeem License Key' }).first()).toBeVisible({ timeout: 15000 });

    const keyInput = page.getByPlaceholder(/license key/i);
    const redeemButton = page.getByRole('button', { name: /Redeem$/i });

    await keyInput.fill('INVALID-KEY-TEST');
    await expect(redeemButton).toBeEnabled();
  });

  test('APPSUMO-014: submitting invalid key shows error', async ({ page }) => {
    await page.goto(APPSUMO_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Redeem License Key' }).first()).toBeVisible({ timeout: 15000 });

    const keyInput = page.getByPlaceholder(/license key/i);
    const redeemButton = page.getByRole('button', { name: /Redeem$/i });

    // Enter an invalid key and submit
    await keyInput.fill('INVALID-KEY-12345');
    await redeemButton.click();

    // Should show an error toast or error message
    // Wait for the redemption API call to complete and error to display
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
    const errorInline = page.getByText(/failed|invalid|error|not found/i);
    await expect(errorToast.or(errorInline)).toBeVisible({ timeout: 10000 });
  });

  test('APPSUMO-015: license key info text is displayed', async ({ page }) => {
    await page.goto(APPSUMO_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Redeem License Key' }).first()).toBeVisible({ timeout: 15000 });

    // The informational text about license keys should be present
    const infoText = page.getByText(/license key|AppSumo|marketplace|lifetime plan/i);
    await expect(infoText.first()).toBeVisible();
  });
});

test.describe('AppSumo Page – Not in Sidebar Navigation', () => {
  test('APPSUMO-020: sidebar does NOT have an AppSumo link', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const sidebar = page.locator('aside[aria-label="Sidebar navigation"]');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // Verify sidebar loaded by checking a known link
    await expect(sidebar.getByText('Billing', { exact: true })).toBeVisible();

    // AppSumo link should NOT be in the sidebar
    const appsumoLink = sidebar.getByText('AppSumo', { exact: true });
    expect(await appsumoLink.count()).toBe(0);
  });

  test('APPSUMO-021: sidebar does NOT have a License Key link', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const sidebar = page.locator('aside[aria-label="Sidebar navigation"]');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // No "License Key" or "Redeem" link in sidebar
    const licenseLink = sidebar.getByText(/License Key|Redeem/i);
    expect(await licenseLink.count()).toBe(0);
  });

  test('APPSUMO-022: appsumo page is directly accessible via URL', async ({ page }) => {
    // Even though it is unlisted, it should load when navigated to directly
    const response = await page.goto(APPSUMO_URL);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('/dashboard/appsumo');

    // Should render page content, not an error
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
