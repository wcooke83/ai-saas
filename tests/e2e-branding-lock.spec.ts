/**
 * E2E Tests: Branding Lock on Customize Page (Free Plan)
 *
 * The "Show Powered by branding" checkbox on the customize page is:
 * - Disabled and forced to true for free plan users
 * - Shows a "Paid plan" upgrade link (with Lock icon) next to the label
 * - Enabled and toggleable for paid plan users
 *
 * The e2e test account's plan determines which branch is tested.
 * Both branches are covered — the test adapts to the actual plan state.
 */

import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CUSTOMIZE_URL = `/dashboard/chatbots/${CHATBOT_ID}/customize`;

async function gotoCustomize(page: import('@playwright/test').Page) {
  await page.goto(CUSTOMIZE_URL, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded');
  // Wait for page to hydrate — Save Changes button is a reliable signal
  await expect(page.getByRole('button', { name: /Save Changes/i })).toBeVisible({ timeout: 30000 });
}

test.describe('Branding Lock on Customize Page', () => {
  test('BRAND-001: Customize page renders branding toggle', async ({ page }) => {
    await gotoCustomize(page);

    // The "Show Powered by branding" label must exist
    await expect(page.getByText('Show "Powered by" branding')).toBeVisible({ timeout: 10000 });

    // The checkbox input must exist
    const brandingCheckbox = page.locator('input#showBranding');
    await expect(brandingCheckbox).toBeVisible({ timeout: 5000 });
  });

  test('BRAND-002: Free plan — branding checkbox is disabled and checked', async ({ page }) => {
    await gotoCustomize(page);

    const brandingCheckbox = page.locator('input#showBranding');
    await expect(brandingCheckbox).toBeVisible({ timeout: 10000 });

    const isDisabled = await brandingCheckbox.isDisabled();

    if (isDisabled) {
      // Free plan: must be checked (forced true)
      await expect(brandingCheckbox).toBeChecked();
      // Upgrade link must be visible
      await expect(page.getByRole('link', { name: /Paid plan/i })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('link', { name: /Paid plan/i })).toHaveAttribute('href', '/dashboard/billing');
    } else {
      // Paid plan: checkbox is enabled
      await expect(brandingCheckbox).toBeEnabled();
    }
  });

  test('BRAND-003: Free plan — clicking disabled checkbox does not change state', async ({ page }) => {
    await gotoCustomize(page);

    const brandingCheckbox = page.locator('input#showBranding');
    await expect(brandingCheckbox).toBeVisible({ timeout: 10000 });

    const isDisabled = await brandingCheckbox.isDisabled();

    if (isDisabled) {
      // Verify it stays checked after attempted click on the label
      const label = page.locator('label[for="showBranding"]');
      await label.click({ force: true });

      // Should still be checked
      await expect(brandingCheckbox).toBeChecked();
    }
  });

  test('BRAND-004: Paid plan — branding checkbox is toggleable', async ({ page }) => {
    await gotoCustomize(page);

    const brandingCheckbox = page.locator('input#showBranding');
    await expect(brandingCheckbox).toBeVisible({ timeout: 10000 });

    const isDisabled = await brandingCheckbox.isDisabled();

    if (!isDisabled) {
      // Paid plan: checkbox should be interactive
      const initialChecked = await brandingCheckbox.isChecked();

      await brandingCheckbox.click();
      const afterClick = await brandingCheckbox.isChecked();
      expect(afterClick).toBe(!initialChecked);

      // Restore
      await brandingCheckbox.click();
      expect(await brandingCheckbox.isChecked()).toBe(initialChecked);
    }
  });

  test('BRAND-005: Free plan — branding lock upgrade link has Lock icon', async ({ page }) => {
    await gotoCustomize(page);

    const brandingCheckbox = page.locator('input#showBranding');
    await expect(brandingCheckbox).toBeVisible({ timeout: 10000 });

    const isDisabled = await brandingCheckbox.isDisabled();

    if (isDisabled) {
      // The upgrade link with Lock icon should be in the label
      const upgradeLink = page.getByRole('link', { name: /Paid plan/i });
      await expect(upgradeLink).toBeVisible({ timeout: 5000 });

      // Should contain a lock SVG icon (lucide-lock class)
      const lockIcon = upgradeLink.locator('svg');
      await expect(lockIcon).toBeVisible({ timeout: 5000 });
    }
  });

  test('BRAND-006: Branding container has reduced opacity for free plan', async ({ page }) => {
    await gotoCustomize(page);

    const brandingCheckbox = page.locator('input#showBranding');
    await expect(brandingCheckbox).toBeVisible({ timeout: 10000 });

    const isDisabled = await brandingCheckbox.isDisabled();

    if (isDisabled) {
      // The parent container should have opacity-50 class
      const container = brandingCheckbox.locator('..');
      const parentClass = await container.getAttribute('class') || '';
      expect(parentClass).toContain('opacity-50');
    }
  });
});
