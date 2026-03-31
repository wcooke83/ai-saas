import { test, expect } from '@playwright/test';

const BILLING_URL = '/dashboard/billing';

async function gotoBilling(page: import('@playwright/test').Page) {
  await page.goto(BILLING_URL);
  await page.waitForLoadState('domcontentloaded');
  // Wait for the billing page to finish loading (past the skeleton)
  await expect(page.getByText('Billing').first()).toBeVisible({ timeout: 15000 });
}

test.describe('Credit Packs – Database-Driven Packages', () => {
  test('CREDIT-001: credit packs section loads and displays packages', async ({ page }) => {
    await gotoBilling(page);

    // Wait for the Purchase Credits card to appear
    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    // The Credit Packs heading should be visible if packages exist
    const creditPacksHeading = page.getByText('Credit Packs');
    const hasPacks = await creditPacksHeading.isVisible({ timeout: 10000 }).catch(() => false);

    if (hasPacks) {
      // At least one pack button should be visible with a credit amount and price
      // Packages render as buttons with credit amount and dollar price
      const packButtons = page.locator('button').filter({ hasText: /^\d/ });
      const count = await packButtons.count();
      expect(count).toBeGreaterThan(0);

      // Each pack should display a dollar price (e.g. $5.00)
      const firstPack = packButtons.first();
      await expect(firstPack).toBeVisible();
      // The parent button area should contain a price with $
      const packArea = firstPack.locator('..');
      await expect(packArea.getByText(/\$/)).toBeVisible();
    } else {
      // No packages configured in admin — just verify the section doesn't error
      test.skip(true, 'No credit packages configured in database');
    }
  });

  test('CREDIT-002: clicking a credit pack opens confirmation dialog', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    const creditPacksHeading = page.getByText('Credit Packs');
    const hasPacks = await creditPacksHeading.isVisible({ timeout: 10000 }).catch(() => false);

    if (!hasPacks) {
      test.skip(true, 'No credit packages configured');
      return;
    }

    // Click the first credit pack button
    // Credit pack buttons are the ones inside the Credit Packs section
    const creditPackSection = page.locator('div').filter({ hasText: /^Credit Packs$/ }).first().locator('..');
    const packButton = creditPackSection.locator('button').first();
    await expect(packButton).toBeVisible({ timeout: 5000 });
    await packButton.click();

    // Confirmation dialog should appear
    await expect(page.getByText('Confirm Credit Purchase')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('You are about to purchase additional credits')).toBeVisible();

    // Dialog should show the credit amount
    const creditsDisplay = page.getByText(/^\d{1,3}(,\d{3})*$/);
    await expect(creditsDisplay.first()).toBeVisible();

    // Dialog should show a dollar total
    await expect(page.locator('[role="dialog"]').getByText(/\$\d+\.\d{2}/)).toBeVisible();

    // Should have Purchase and Cancel buttons
    await expect(page.getByRole('button', { name: /Cancel/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Purchase for \$/i })).toBeVisible();
  });

  test('CREDIT-003: confirmation dialog Cancel button closes it', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    const creditPacksHeading = page.getByText('Credit Packs');
    const hasPacks = await creditPacksHeading.isVisible({ timeout: 10000 }).catch(() => false);

    if (!hasPacks) {
      test.skip(true, 'No credit packages configured');
      return;
    }

    // Open dialog
    const creditPackSection = page.locator('div').filter({ hasText: /^Credit Packs$/ }).first().locator('..');
    const packButton = creditPackSection.locator('button').first();
    await packButton.click();

    await expect(page.getByText('Confirm Credit Purchase')).toBeVisible({ timeout: 5000 });

    // Click Cancel
    await page.getByRole('button', { name: /Cancel/i }).click();

    // Dialog should close
    await expect(page.getByText('Confirm Credit Purchase')).not.toBeVisible({ timeout: 5000 });
  });

  test('CREDIT-004: dialog shows correct info bullets', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    const creditPacksHeading = page.getByText('Credit Packs');
    const hasPacks = await creditPacksHeading.isVisible({ timeout: 10000 }).catch(() => false);

    if (!hasPacks) {
      test.skip(true, 'No credit packages configured');
      return;
    }

    const creditPackSection = page.locator('div').filter({ hasText: /^Credit Packs$/ }).first().locator('..');
    await creditPackSection.locator('button').first().click();

    await expect(page.getByText('Confirm Credit Purchase')).toBeVisible({ timeout: 5000 });

    // Verify the info bullets in the dialog
    await expect(page.getByText('Credits are added instantly after payment')).toBeVisible();
    await expect(page.getByText('Purchased credits never expire')).toBeVisible();
    await expect(page.getByText('Used only after plan credits are depleted')).toBeVisible();
  });
});

test.describe('Credit Purchase – Custom Amount', () => {
  test('CREDIT-010: custom amount input and Buy button are visible', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    // Custom Amount section
    await expect(page.getByText('Custom Amount')).toBeVisible();
    const customInput = page.getByPlaceholder('Enter credit amount (min 100)');
    await expect(customInput).toBeVisible();

    // Buy button
    const buyButton = page.getByRole('button', { name: /Buy/i });
    await expect(buyButton).toBeVisible();
    // Should be disabled when input is empty
    await expect(buyButton).toBeDisabled();
  });

  test('CREDIT-011: Buy button enables when valid amount entered', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    const customInput = page.getByPlaceholder('Enter credit amount (min 100)');
    const buyButton = page.getByRole('button', { name: /Buy/i });

    // Enter a valid amount
    await customInput.fill('500');
    await expect(buyButton).toBeEnabled();
  });

  test('CREDIT-012: Buy button stays disabled for amounts below 100', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    const customInput = page.getByPlaceholder('Enter credit amount (min 100)');
    const buyButton = page.getByRole('button', { name: /Buy/i });

    // Enter an amount below minimum
    await customInput.fill('50');
    await expect(buyButton).toBeDisabled();
  });

  test('CREDIT-013: clicking Buy with valid amount opens confirmation dialog', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    const customInput = page.getByPlaceholder('Enter credit amount (min 100)');
    await customInput.fill('500');

    const buyButton = page.getByRole('button', { name: /Buy/i });
    await buyButton.click();

    // Confirmation dialog
    await expect(page.getByText('Confirm Credit Purchase')).toBeVisible({ timeout: 5000 });
    // Should show 500 credits
    await expect(page.getByText('500')).toBeVisible();
    // Should show dollar amount ($5.00 for 500 credits at $0.01 each)
    await expect(page.locator('[role="dialog"]').getByText('$5.00')).toBeVisible();
  });

  test('CREDIT-014: pricing info text is displayed', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    // Pricing info line
    await expect(
      page.getByText('1 credit = $0.01 USD. Min 100, max 100,000 credits per purchase.')
    ).toBeVisible();
  });

  test('CREDIT-015: current balance section shows plan, purchased, and bonus credits', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Purchase Credits').first()).toBeVisible({ timeout: 15000 });

    // Balance grid labels
    await expect(page.getByText('Plan Credits')).toBeVisible();
    await expect(page.getByText('Purchased')).toBeVisible();
    await expect(page.getByText('Bonus')).toBeVisible();
  });
});
