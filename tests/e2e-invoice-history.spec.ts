import { test, expect } from '@playwright/test';

const BILLING_URL = '/dashboard/billing';

async function gotoBilling(page: import('@playwright/test').Page) {
  await page.goto(BILLING_URL);
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByText('Billing').first()).toBeVisible({ timeout: 15000 });
}

test.describe('Invoice History Section', () => {
  test('INVOICE-001: Invoice History card is visible on billing page', async ({ page }) => {
    await gotoBilling(page);

    // The Invoice History title should be present
    await expect(page.getByText('Invoice History')).toBeVisible({ timeout: 15000 });

    // Description text
    await expect(
      page.getByText('Your past invoices and payment records')
    ).toBeVisible();
  });

  test('INVOICE-002: Full History button is visible', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Invoice History')).toBeVisible({ timeout: 15000 });

    const fullHistoryButton = page.getByRole('button', { name: /Full History/i });
    await expect(fullHistoryButton).toBeVisible();
  });

  test('INVOICE-003: invoice table or empty state renders', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Invoice History')).toBeVisible({ timeout: 15000 });

    // Wait for billing data to load (past skeleton state)
    // Either the table headers appear or the empty state
    const tableHeader = page.locator('th').getByText('Invoice');
    const emptyState = page.getByText('No invoices yet');

    await expect(tableHeader.or(emptyState)).toBeVisible({ timeout: 15000 });
  });

  test('INVOICE-004: if invoices exist, table has correct column headers', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Invoice History')).toBeVisible({ timeout: 15000 });

    const tableHeader = page.locator('th').getByText('Invoice');
    const hasInvoices = await tableHeader.isVisible({ timeout: 15000 }).catch(() => false);

    if (hasInvoices) {
      // Verify all column headers
      await expect(page.locator('th').getByText('Invoice')).toBeVisible();
      await expect(page.locator('th').getByText('Date')).toBeVisible();
      await expect(page.locator('th').getByText('Period')).toBeVisible();
      await expect(page.locator('th').getByText('Amount')).toBeVisible();
      await expect(page.locator('th').getByText('Status')).toBeVisible();
      await expect(page.locator('th').getByText('Actions')).toBeVisible();
    } else {
      // Empty state — verify messaging
      await expect(page.getByText('No invoices yet')).toBeVisible();
      await expect(
        page.getByText('Invoices will appear here once you have an active subscription')
      ).toBeVisible();
    }
  });

  test('INVOICE-005: if invoices exist, at least one row is rendered', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Invoice History')).toBeVisible({ timeout: 15000 });

    const tableHeader = page.locator('th').getByText('Invoice');
    const hasInvoices = await tableHeader.isVisible({ timeout: 15000 }).catch(() => false);

    if (hasInvoices) {
      // At least one table row in tbody
      const rows = page.locator('tbody tr');
      expect(await rows.count()).toBeGreaterThan(0);

      // First row should have a status badge (Paid, Open, Draft, etc.)
      const firstRow = rows.first();
      const statusBadge = firstRow.getByText(/Paid|Open|Draft|Void|Uncollectible/);
      await expect(statusBadge).toBeVisible();
    } else {
      test.skip(true, 'No invoices to verify — empty state already tested');
    }
  });
});

test.describe('Billing Page – Overall Section Order', () => {
  test('INVOICE-010: billing page contains all expected sections', async ({ page }) => {
    await gotoBilling(page);

    // Wait for full page load
    await expect(page.getByRole('heading', { name: 'Purchase Credits' })).toBeVisible({ timeout: 15000 });

    // Expected sections on the billing page
    await expect(page.getByRole('heading', { name: 'Current Plan' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Payment Method' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invoice History' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Purchase Credits' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Auto Top-up' })).toBeVisible();
    await expect(page.getByText('Need More?').first()).toBeVisible();
  });

  test('INVOICE-011: View All Plans link goes to upgrade page', async ({ page }) => {
    await gotoBilling(page);

    // Wait for full page load
    await expect(page.getByText('Need More?')).toBeVisible({ timeout: 15000 });

    const viewPlansLink = page.getByRole('link', { name: /View All Plans/i });
    await expect(viewPlansLink).toBeVisible();
    await expect(viewPlansLink).toHaveAttribute('href', '/dashboard/upgrade');
  });

  test('INVOICE-012: Current Plan section shows plan name and status', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Current Plan')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Your subscription details')).toBeVisible();

    // Should show "X Plan" text
    await expect(page.getByText(/Plan$/).first()).toBeVisible();

    // Should show a status badge (Active, Trial, etc.)
    const statusBadge = page.getByText(/Active|Trial|Past Due|Canceled|Unpaid/).first();
    await expect(statusBadge).toBeVisible();
  });

  test('INVOICE-013: Upgrade/Change/Manage buttons present based on plan', async ({ page }) => {
    await gotoBilling(page);

    await expect(page.getByText('Current Plan')).toBeVisible({ timeout: 15000 });

    // One of these should be visible depending on the plan
    const upgradeLink = page.getByRole('link', { name: /Upgrade Plan|Change Plan|View Plans/i });
    const manageButton = page.getByRole('button', { name: /Manage Subscription/i });

    const hasUpgrade = await upgradeLink.first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasManage = await manageButton.isVisible({ timeout: 3000 }).catch(() => false);

    // At least one plan action should be visible
    expect(hasUpgrade || hasManage).toBeTruthy();
  });
});
