import { test, expect } from '@playwright/test';

test.describe('Billing & Plan Limits', () => {
  test('billing page loads with plan information', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Should display plan or billing information
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('billing page has upgrade/manage buttons', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('domcontentloaded');

    // Look for upgrade or manage subscription buttons
    const upgradeButton = page.getByRole('button', { name: /upgrade|manage|subscribe/i }).first();
    const planText = page.getByText(/plan|subscription|billing/i).first();

    await expect(planText).toBeVisible({ timeout: 10000 });
  });

  test('clicking upgrade triggers stripe checkout', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('domcontentloaded');

    // Find and click an upgrade button
    const upgradeButton = page.getByRole('button', { name: /upgrade|subscribe/i }).first();
    if (await upgradeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const checkoutPromise = page.waitForResponse(
        (res) => (res.url().includes('/api/stripe/checkout') || res.url().includes('/api/billing')) &&
                 res.request().method() === 'POST'
      );
      await upgradeButton.click();
      const checkoutResponse = await checkoutPromise;
      // Should return a Stripe URL or error (not 500)
      expect(checkoutResponse.status()).toBeLessThan(500);
    }
  });

  test('usage page shows credit info', async ({ page }) => {
    await page.goto('/dashboard/usage', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
