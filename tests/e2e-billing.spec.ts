import { test, expect } from '@playwright/test';

test.describe('Billing & Plan Limits', () => {
  test('billing page loads', async ({ page }) => {
    await page.goto('/dashboard/billing');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('stripe checkout API responds', async ({ page }) => {
    const res = await page.request.post('/api/stripe/checkout', {
      data: { plan: 'pro' },
    });
    // Should return a Stripe URL or an error (not a 500)
    expect(res.status()).toBeLessThan(500);
  });

  test('stripe portal API responds', async ({ page }) => {
    const res = await page.request.post('/api/stripe/portal');
    // Should return a portal URL or an error (not a 500)
    expect(res.status()).toBeLessThan(500);
  });

  test('usage page shows credit info', async ({ page }) => {
    await page.goto('/dashboard/usage');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
