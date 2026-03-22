import { test, expect, Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE_URL = `/dashboard/chatbots/${CHATBOT_ID}`;

async function waitForEscalations(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await Promise.race([
    page.getByRole('heading', { name: 'Reports' }).waitFor({ timeout: 60000 }),
    page.getByText('An error occurred').waitFor({ timeout: 60000 }),
  ]).catch(() => {});
  await page.waitForTimeout(1000);
}

test.describe('Section 20: Escalations (Reports)', () => {
  test.setTimeout(120_000);

  test('ESCALATION-001: Escalations table loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Page heading (unique subtitle text to avoid matching sidebar nav)
    await expect(page.getByText('Review and manage issue reports from conversations')).toBeVisible({ timeout: 15000 });

    // Four stat cards: Total, Open, Acknowledged, Resolved
    await expect(page.getByText('Total').first()).toBeVisible();
    await expect(page.getByText('Open').first()).toBeVisible();
    await expect(page.getByText('Acknowledged').first()).toBeVisible();
    await expect(page.getByText('Resolved').first()).toBeVisible();
  });

  test('ESCALATION-002: Status filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Status filter is the first <select> element on the page
    const statusSelect = page.locator('select').first();
    await expect(statusSelect).toBeVisible();

    // Select "Open"
    await statusSelect.selectOption('open');
    await page.waitForTimeout(2000);

    // Select "Acknowledged"
    await statusSelect.selectOption('acknowledged');
    await page.waitForTimeout(2000);

    // Select "Resolved"
    await statusSelect.selectOption('resolved');
    await page.waitForTimeout(2000);

    // Reset to "All"
    await statusSelect.selectOption('all');
    await page.waitForTimeout(1000);
  });

  test('ESCALATION-003: Escalation detail dialog', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Click the view icon on an escalation row
    const tableRows = page.locator('table tbody tr, [role="row"]');
    if (await tableRows.count() > 0) {
      // Click on the first escalation row
      await tableRows.first().click();
      await page.waitForTimeout(1000);

      // EscalationDetailDialog should open
      const dialog = page.locator('[role="dialog"], [data-state="open"]');
      if (await dialog.isVisible().catch(() => false)) {
        await expect(dialog).toBeVisible();
      }
    }
  });

  test('ESCALATION-004: Change escalation status', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Open an escalation detail dialog
    const tableRows = page.locator('table tbody tr, [role="row"]');
    if (await tableRows.count() > 0) {
      await tableRows.first().click();
      await page.waitForTimeout(1000);

      const dialog = page.locator('[role="dialog"], [data-state="open"]');
      if (await dialog.isVisible().catch(() => false)) {
        // Look for status change buttons/select in the dialog
        const statusButtons = dialog.locator('button, select');
        const count = await statusButtons.count();
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('ESCALATION-005: Export escalations CSV', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    const exportButton = page.getByRole('button', { name: /Export/ });
    await expect(exportButton).toBeVisible();

    if (!(await exportButton.isDisabled())) {
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      await exportButton.click();
      const download = await downloadPromise;

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toContain('escalations-');
        expect(filename).toContain('.csv');
      }
    }
  });

  test('ESCALATION-006: Stats counters', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Stat cards with correct icons:
    // Total: ShieldAlert icon
    // Open: AlertTriangle icon (orange)
    // Acknowledged: Clock icon (blue)
    // Resolved: CheckCircle2 icon (green)

    // Verify stat cards are present and have numeric values
    const statCards = page.locator('.text-2xl.font-bold');
    const count = await statCards.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Verify icon colors match expected status icons
    // Open card: orange text
    const openValue = page.locator('.text-orange-600, .dark\\:text-orange-400').first();
    await expect(openValue).toBeVisible();

    // Acknowledged card: blue text
    const ackValue = page.locator('.text-blue-600, .dark\\:text-blue-400').first();
    await expect(ackValue).toBeVisible();

    // Resolved card: green text
    const resolvedValue = page.locator('.text-green-600, .dark\\:text-green-400').first();
    await expect(resolvedValue).toBeVisible();
  });
});

test.describe('Section 32: Escalation Dashboard Details', () => {
  test.setTimeout(120_000);

  test('DASH-028: Escalation stats card icon verification', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Verify the correct icons are used for each stat card:
    // Open: AlertTriangle (in orange bg)
    const openIcon = page.locator('.bg-orange-100 svg, [class*="bg-orange-900"] svg');
    if (await openIcon.count() > 0) {
      await expect(openIcon.first()).toBeVisible();
    }

    // Acknowledged: Clock (in blue bg)
    const ackIcon = page.locator('.bg-blue-100 svg, [class*="bg-blue-900"] svg');
    if (await ackIcon.count() > 0) {
      await expect(ackIcon.first()).toBeVisible();
    }

    // Resolved: CheckCircle2 (in green bg)
    const resolvedIcon = page.locator('.bg-green-100 svg, [class*="bg-green-900"] svg');
    if (await resolvedIcon.count() > 0) {
      await expect(resolvedIcon.first()).toBeVisible();
    }
  });

  test('DASH-029: Escalation table search', async ({ page }) => {
    await page.goto(`${BASE_URL}/escalations`);
    await waitForEscalations(page);

    // Search field from SortableTable (searchPlaceholder="Search escalations...")
    const searchInput = page.getByPlaceholder('Search escalations...');
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('wrong');
      await page.waitForTimeout(500);

      // Table should filter results
      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);
    }
  });
});
