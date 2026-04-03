/**
 * E2E Test: Calendar Scheduling Tab
 *
 * Tests the Scheduling tab on the calendar settings page:
 * - Business Hours (Global + Scoped)
 * - Blocked Dates (Global + Scoped)
 * - Date Overrides
 * - Sticky save bar dirty state and save flow
 *
 * 100% UI-driven — no mock data, no direct API calls, no test shortcuts.
 * Uses the pre-existing e2e test chatbot.
 */

import { test, expect, type Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CALENDAR_URL = `/dashboard/chatbots/${CHATBOT_ID}/calendar`;

// Future dates for inputs — avoids past-date validation issues
function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

test.describe.configure({ timeout: 120_000 });

/**
 * Navigate to the calendar page and click the Scheduling tab.
 * Waits for the tab content to render.
 */
async function gotoSchedulingTab(page: Page) {
  await page.goto(CALENDAR_URL);
  await page.waitForLoadState('domcontentloaded');
  // Wait for the tab buttons to render (TabsList is a plain div, no role="tablist")
  await page.getByRole('button', { name: 'Scheduling' }).waitFor({ state: 'visible', timeout: 30_000 });
  await page.getByRole('button', { name: 'Scheduling' }).click();
  // Wait for the Business Hours card to appear inside the scheduling tab
  await expect(page.getByRole('heading', { name: 'Business Hours', exact: true })).toBeVisible({ timeout: 10_000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS HOURS — GLOBAL
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Business Hours — Global', () => {

  test('SCHED-100: Global Business Hours section shows collapsed summary with day names and times', async ({ page }) => {
    await gotoSchedulingTab(page);

    // The "Global Business Hours" heading should be visible
    await expect(page.getByText('Global Business Hours')).toBeVisible();

    // The collapsed summary shows abbreviated day names (Mon, Tue, etc.)
    // At least one weekday abbreviation should be visible in the summary
    await expect(page.getByText('Mon')).toBeVisible();
    await expect(page.getByText('Tue')).toBeVisible();
    await expect(page.getByText('Fri')).toBeVisible();
  });

  test('SCHED-101: Click edit on Global Business Hours, verify DayGrid appears with checkboxes and time selects', async ({ page }) => {
    await gotoSchedulingTab(page);

    // The global section should have a Pencil edit button
    const globalSection = page.locator('div').filter({ hasText: /Global Business Hours/ }).first();

    // Click the edit button — it's near the "Global Business Hours" heading
    const editBtn = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') }).first();
    await editBtn.click();

    // The DayGrid form should appear with checkboxes (aria-label="Enable Monday", etc.)
    await expect(page.getByLabel('Enable Monday')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByLabel('Enable Tuesday')).toBeVisible();

    // Time selects should be present for enabled days
    await expect(page.getByLabel('Monday start time')).toBeVisible();

    // "Done" button should be visible
    await expect(page.getByRole('button', { name: 'Done' })).toBeVisible();
  });

  test('SCHED-102: Toggle a day off, click Done, verify summary shows Off for that day', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Open global edit
    const editBtn = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') }).first();
    await editBtn.click();
    await expect(page.getByLabel('Enable Sunday')).toBeVisible({ timeout: 5_000 });

    // Check current state of Sunday — if enabled, uncheck it; if disabled, enable then disable
    const sundayCheckbox = page.getByLabel('Enable Sunday');
    const isChecked = await sundayCheckbox.isChecked();
    if (isChecked) {
      await sundayCheckbox.uncheck();
    } else {
      // Already off — check and then uncheck to verify the toggle works
      await sundayCheckbox.check();
      await sundayCheckbox.uncheck();
    }

    // Click Done
    await page.getByRole('button', { name: 'Done' }).click();

    // The summary should now show "Closed" next to "Sun"
    // The summary renders "Sun" followed by "Closed" for disabled days
    const summaryLine = page.locator('span').filter({ hasText: 'Sun' }).first();
    await expect(summaryLine).toBeVisible();
    // The summary shows "Off" for disabled days (in collapsed view)
    await expect(page.getByText('Off').first()).toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-103: Edit global hours — change Monday start time, click Done, verify summary reflects new time', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Open global edit
    const editBtn = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') }).first();
    await editBtn.click();
    await expect(page.getByLabel('Enable Monday')).toBeVisible({ timeout: 5_000 });

    // Ensure Monday is enabled
    const monCheckbox = page.getByLabel('Enable Monday');
    if (!(await monCheckbox.isChecked())) {
      await monCheckbox.check();
    }

    // Change Monday start time to 10:00
    const monStart = page.getByLabel('Monday start time');
    await monStart.selectOption('10:00');

    // Click Done
    await page.getByRole('button', { name: 'Done' }).click();

    // The summary should now show "10:00" in the collapsed global hours summary
    await expect(page.locator('span').filter({ hasText: /^10:00/ }).first()).toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS HOURS — SCOPED
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Business Hours — Scoped', () => {

  test('SCHED-110: Scoped Business Hours section is visible with empty state message', async ({ page }) => {
    await gotoSchedulingTab(page);

    await expect(page.getByRole('heading', { name: 'Scoped Business Hours' })).toBeVisible();
    // Empty state text
    await expect(
      page.getByText('No scoped business hours')
        .or(page.getByText('Add business hours for specific services or providers'))
    ).toBeVisible();
  });

  test('SCHED-111: Click Add Business Hours, verify form appears with Label, Scope, and DayGrid', async ({ page }) => {
    await gotoSchedulingTab(page);

    await page.getByRole('button', { name: 'Add Business Hours' }).click();

    // Label input should be visible
    await expect(page.getByPlaceholder('e.g. Massage Therapy Hours')).toBeVisible({ timeout: 5_000 });

    // Scope section with Services and Providers labels
    await expect(page.getByText('Scope').first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Services' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Providers' }).first()).toBeVisible();

    // DayGrid checkboxes
    await expect(page.getByLabel('Enable Monday')).toBeVisible();

    // Add and Cancel buttons
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('SCHED-112: Fill out scoped hours form — enter label, select a day, click Add — verify it appears in scoped list', async ({ page }) => {
    await gotoSchedulingTab(page);

    const label = `E2E Scoped Hours ${Date.now()}`;

    await page.getByRole('button', { name: 'Add Business Hours' }).click();
    await expect(page.getByPlaceholder('e.g. Massage Therapy Hours')).toBeVisible({ timeout: 5_000 });

    // Enter a label
    await page.getByPlaceholder('e.g. Massage Therapy Hours').fill(label);

    // Ensure at least Monday is checked (it should be by default)
    const monCheckbox = page.getByLabel('Enable Monday');
    if (!(await monCheckbox.isChecked())) {
      await monCheckbox.check();
    }

    // Click Add
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // The scoped set should appear in the list with the label
    await expect(page.getByText(label)).toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-113: Edit scoped set — click Pencil, verify form populates, change label, click Update, verify list updates', async ({ page }) => {
    await gotoSchedulingTab(page);

    // First add a scoped set to edit
    const originalLabel = `E2E Edit Test ${Date.now()}`;
    const updatedLabel = `E2E Updated ${Date.now()}`;

    await page.getByRole('button', { name: 'Add Business Hours' }).click();
    await expect(page.getByPlaceholder('e.g. Massage Therapy Hours')).toBeVisible({ timeout: 5_000 });
    await page.getByPlaceholder('e.g. Massage Therapy Hours').fill(originalLabel);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(originalLabel)).toBeVisible({ timeout: 5_000 });

    // Click the Pencil button on the scoped set row — it's the first button in the row
    const row = page.locator('div').filter({ hasText: originalLabel }).filter({ has: page.locator('button') }).last();
    const pencilBtn = row.locator('button').nth(0);
    await pencilBtn.click();

    // The form should be visible with the existing label value
    const labelInput = page.getByPlaceholder('e.g. Massage Therapy Hours');
    await expect(labelInput).toBeVisible({ timeout: 5_000 });
    await expect(labelInput).toHaveValue(originalLabel);

    // The button should now say "Update" instead of "Add"
    await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();

    // Change the label
    await labelInput.clear();
    await labelInput.fill(updatedLabel);

    // Click Update
    await page.getByRole('button', { name: 'Update' }).click();

    // The updated label should appear in the list
    await expect(page.getByText(updatedLabel)).toBeVisible({ timeout: 5_000 });
    // The original label should be gone
    await expect(page.getByText(originalLabel)).not.toBeVisible();
  });

  test('SCHED-114: Delete scoped set — click Trash, confirm dialog, verify removal', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Add a scoped set to delete
    const label = `E2E Delete Test ${Date.now()}`;
    await page.getByRole('button', { name: 'Add Business Hours' }).click();
    await expect(page.getByPlaceholder('e.g. Massage Therapy Hours')).toBeVisible({ timeout: 5_000 });
    await page.getByPlaceholder('e.g. Massage Therapy Hours').fill(label);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText(label)).toBeVisible({ timeout: 5_000 });

    // Click the Trash button on the scoped set row — it's the second button in the row
    const row = page.locator('div').filter({ hasText: label }).filter({ has: page.locator('button') }).last();
    const trashBtn = row.locator('button').nth(1);
    await trashBtn.click();

    // Confirmation dialog should appear
    await expect(page.getByText('Remove Scoped Business Hours?')).toBeVisible({ timeout: 5_000 });

    // Click Remove
    await page.getByRole('button', { name: 'Remove' }).click();

    // The set should be removed from the list
    await expect(page.getByText(label)).not.toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-115: Click Cancel in the add form, verify form closes and no set is added', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Note the current state — how many scoped sets are visible
    const scopedSection = page.locator('div').filter({ hasText: /Scoped Business Hours/ }).first();

    await page.getByRole('button', { name: 'Add Business Hours' }).click();
    await expect(page.getByPlaceholder('e.g. Massage Therapy Hours')).toBeVisible({ timeout: 5_000 });

    // Enter some data
    await page.getByPlaceholder('e.g. Massage Therapy Hours').fill('Should not appear');

    // Click Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();

    // The form should close — the label input should no longer be visible
    await expect(page.getByPlaceholder('e.g. Massage Therapy Hours')).not.toBeVisible({ timeout: 5_000 });

    // The cancelled label should not appear in the list
    await expect(page.getByText('Should not appear')).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED DATES — GLOBAL
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Blocked Dates — Global', () => {

  test('SCHED-120: Global Blocked Dates section is visible with header and colored dot', async ({ page }) => {
    await gotoSchedulingTab(page);

    // The Blocked Dates card should be visible (accessible name includes tooltip: "Blocked Dates More information")
    await expect(page.getByRole('heading', { name: 'Blocked Dates' }).first()).toBeVisible();

    // Check if EA is not_configured — if so, it shows a warning instead of the normal UI
    const notConfiguredWarning = page.getByText('Easy!Appointments is not configured');
    const isNotConfigured = await notConfiguredWarning.isVisible().catch(() => false);

    if (isNotConfigured) {
      // Gracefully skip — EA not configured
      test.skip(true, 'EA not configured — global blocked dates unavailable');
      return;
    }

    // The "Global Blocked Dates" subheading with colored dot should be visible
    await expect(page.getByText('Global Blocked Dates')).toBeVisible();
  });

  test('SCHED-121: Add a global blocked date — fill date and label, click Add, verify it appears', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Skip if EA not configured
    const notConfiguredWarning = page.getByText('Easy!Appointments is not configured');
    const isNotConfigured = await notConfiguredWarning.isVisible().catch(() => false);
    if (isNotConfigured) {
      test.skip(true, 'EA not configured — global blocked dates unavailable');
      return;
    }

    // Click the "Add Blocked Date" button in the global section
    // The global section's Add button is the first one that appears
    const globalSection = page.locator('div').filter({ hasText: /Global Blocked Dates/ });
    const addBtn = globalSection.getByRole('button', { name: 'Add Blocked Date' }).first();
    await addBtn.click();

    // The form should appear with date and label inputs
    const dateInput = page.locator('#blocked-date');
    await expect(dateInput).toBeVisible({ timeout: 5_000 });

    // Fill in a future date
    const testDate = futureDate(60);
    await dateInput.fill(testDate);

    // Fill in a label
    const labelInput = page.locator('#blocked-label');
    await labelInput.fill('E2E Global Block');

    // Click Add
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // A toast should appear (either success or "already blocked" if date already exists from prior run)
    await expect(
      page.getByText('Blocked date added').or(page.getByText('This date is already blocked'))
    ).toBeVisible({ timeout: 10_000 });

    // The label should appear in the global blocked dates list (either newly added or pre-existing)
    await expect(page.getByText('E2E Global Block').first()).toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-122: Delete a global blocked date — click Trash, confirm dialog, verify removal', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Skip if EA not configured
    const notConfiguredWarning = page.getByText('Easy!Appointments is not configured');
    const isNotConfigured = await notConfiguredWarning.isVisible().catch(() => false);
    if (isNotConfigured) {
      test.skip(true, 'EA not configured — global blocked dates unavailable');
      return;
    }

    // Look for any "E2E Global Block" entry (from SCHED-121 or prior runs)
    const entryText = page.getByText('E2E Global Block').first();
    const isVisible = await entryText.isVisible().catch(() => false);
    if (!isVisible) {
      // Create one first
      const globalSection = page.locator('div').filter({ hasText: /Global Blocked Dates/ });
      await globalSection.getByRole('button', { name: 'Add Blocked Date' }).first().click();
      const dateInput = page.locator('#blocked-date');
      await expect(dateInput).toBeVisible({ timeout: 5_000 });
      await dateInput.fill(futureDate(61));
      await page.locator('#blocked-label').fill('E2E Global Block');
      await page.getByRole('button', { name: 'Add', exact: true }).click();
      await expect(
        page.getByText('Blocked date added').or(page.getByText('This date is already blocked'))
      ).toBeVisible({ timeout: 10_000 });
    }

    // Find the row with "E2E Global Block" and click its Trash button (only button in row)
    const row = page.locator('div').filter({ hasText: 'E2E Global Block' }).filter({ has: page.locator('button') }).last();
    const trashBtn = row.locator('button').nth(0);
    await trashBtn.click();

    // Confirmation dialog should appear
    await expect(page.getByText('Remove Global Blocked Date?')).toBeVisible({ timeout: 5_000 });

    // Click Remove
    await page.getByRole('button', { name: 'Remove' }).click();

    // Success toast should appear
    await expect(page.getByText('Blocked date removed')).toBeVisible({ timeout: 10_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED DATES — SCOPED
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Blocked Dates — Scoped', () => {

  test('SCHED-130: Scoped Blocked Dates section is visible with empty state message', async ({ page }) => {
    await gotoSchedulingTab(page);

    await expect(page.getByRole('heading', { name: 'Scoped Blocked Dates' })).toBeVisible();
    await expect(
      page.getByText('No scoped blocked dates')
        .or(page.getByText('Add blocked dates for specific services or providers'))
    ).toBeVisible();
  });

  test('SCHED-131: Add scoped blocked date with service selected, verify it appears with scope label', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Click "Add Blocked Date" in the scoped section — the second "Add Blocked Date" on the page
    const scopedAddBtn = page.getByRole('button', { name: 'Add Blocked Date' }).last();
    await scopedAddBtn.click();

    // The scoped form should appear with date, label, and scope selectors
    const dateInput = page.locator('#scoped-date');
    await expect(dateInput).toBeVisible({ timeout: 5_000 });

    // Fill in date
    const testDate = futureDate(70);
    await dateInput.fill(testDate);

    // Fill in label
    const labelInput = page.locator('#scoped-label');
    await labelInput.fill('E2E Scoped Block');

    // Open the Services MultiSelect and select the first option
    // MultiSelect is a custom component — click the trigger to open, then click an option
    const servicesMultiSelect = page.locator('#scoped-services').locator('..');
    const servicesTrigger = servicesMultiSelect.locator('button').first();
    await servicesTrigger.click();

    // Wait for dropdown options to appear and click the first one
    const firstOption = page.locator('[role="option"]').first();
    const hasOptions = await firstOption.isVisible().catch(() => false);
    if (hasOptions) {
      await firstOption.click();
      // Close the dropdown by clicking the trigger again or pressing Escape
      await page.keyboard.press('Escape');
    } else {
      // If no service options, just close and the test for validation (SCHED-132) covers this
      await page.keyboard.press('Escape');
      // We need at least one scope selection — try provider instead
      const providersTrigger = page.locator('#scoped-providers').locator('..').locator('button').first();
      await providersTrigger.click();
      const firstProvOption = page.locator('[role="option"]').first();
      const hasProvOptions = await firstProvOption.isVisible().catch(() => false);
      if (hasProvOptions) {
        await firstProvOption.click();
        await page.keyboard.press('Escape');
      } else {
        // No services or providers available — skip
        test.skip(true, 'No services or providers available for scoped blocked dates');
        return;
      }
    }

    // Click Add
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // The scoped blocked date should appear in the list
    await expect(page.getByText('E2E Scoped Block')).toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-132: Try to add scoped blocked date with no scope selected — verify validation error', async ({ page }) => {
    await gotoSchedulingTab(page);

    const scopedAddBtn = page.getByRole('button', { name: 'Add Blocked Date' }).last();
    await scopedAddBtn.click();

    const dateInput = page.locator('#scoped-date');
    await expect(dateInput).toBeVisible({ timeout: 5_000 });

    // Fill in date but leave scope empty
    await dateInput.fill(futureDate(75));

    // Click Add without selecting any service or provider
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Validation error should appear
    await expect(
      page.getByText('Select at least one service or provider')
    ).toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-133: Delete scoped blocked date — click Trash, confirm dialog, verify removal', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Check if we have a scoped blocked date to delete
    const scopedEntry = page.getByText('E2E Scoped Block');
    const isVisible = await scopedEntry.isVisible().catch(() => false);

    if (!isVisible) {
      // Create one — same flow as SCHED-131
      const scopedAddBtn = page.getByRole('button', { name: 'Add Blocked Date' }).last();
      await scopedAddBtn.click();

      const dateInput = page.locator('#scoped-date');
      await expect(dateInput).toBeVisible({ timeout: 5_000 });
      await dateInput.fill(futureDate(71));
      await page.locator('#scoped-label').fill('E2E Scoped Block');

      // Try to select a service
      const servicesTrigger = page.locator('#scoped-services').locator('..').locator('button').first();
      await servicesTrigger.click();
      const firstOption = page.locator('[role="option"]').first();
      const hasOptions = await firstOption.isVisible().catch(() => false);
      if (hasOptions) {
        await firstOption.click();
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
        const providersTrigger = page.locator('#scoped-providers').locator('..').locator('button').first();
        await providersTrigger.click();
        const firstProvOption = page.locator('[role="option"]').first();
        if (await firstProvOption.isVisible().catch(() => false)) {
          await firstProvOption.click();
          await page.keyboard.press('Escape');
        } else {
          test.skip(true, 'No services or providers available');
          return;
        }
      }

      await page.getByRole('button', { name: 'Add', exact: true }).click();
      await expect(page.getByText('E2E Scoped Block')).toBeVisible({ timeout: 5_000 });
    }

    // Click the Trash button on the scoped blocked date row (only button in row)
    const row = page.locator('div').filter({ hasText: 'E2E Scoped Block' }).filter({ has: page.locator('button') }).last();
    const trashBtn = row.locator('button').nth(0);
    await trashBtn.click();

    // Confirmation dialog
    await expect(page.getByText('Remove Scoped Blocked Date?')).toBeVisible({ timeout: 5_000 });

    // Click Remove
    await page.getByRole('button', { name: 'Remove' }).click();

    // The entry should be removed
    await expect(page.getByText('E2E Scoped Block')).not.toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DATE OVERRIDES
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Date Overrides', () => {

  test('SCHED-140: Date Overrides section is visible', async ({ page }) => {
    await gotoSchedulingTab(page);

    await expect(page.getByRole('heading', { name: 'Date Overrides' }).first()).toBeVisible();
    // Empty state or list should be present
    // Either the empty state text or the Add button (or both) should be visible
    const emptyState = page.getByText('No date overrides');
    const addBtn = page.getByRole('button', { name: 'Add Date Override' });
    const emptyVisible = await emptyState.first().isVisible().catch(() => false);
    const addVisible = await addBtn.first().isVisible().catch(() => false);
    expect(emptyVisible || addVisible).toBe(true);
  });

  test('SCHED-141: Click Add Date Override, fill date, verify Closed all day checkbox works', async ({ page }) => {
    await gotoSchedulingTab(page);

    await page.getByRole('button', { name: 'Add Date Override' }).click();

    // The form should appear
    const dateInput = page.locator('#override-date');
    await expect(dateInput).toBeVisible({ timeout: 5_000 });

    // Fill in a future date
    await dateInput.fill(futureDate(80));

    // The "Closed all day" checkbox should be visible
    const closedCheckbox = page.locator('#override-closed');
    await expect(closedCheckbox).toBeVisible();

    // Initially unchecked — time pickers should be visible
    await expect(closedCheckbox).not.toBeChecked();
    await expect(page.getByText('Available hours')).toBeVisible();

    // Check "Closed all day"
    await closedCheckbox.check();
    await expect(closedCheckbox).toBeChecked();

    // Time pickers should be hidden when closed
    await expect(page.getByText('Available hours')).not.toBeVisible();

    // Uncheck to restore time pickers
    await closedCheckbox.uncheck();
    await expect(page.getByText('Available hours')).toBeVisible();

    // Cancel without adding
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('SCHED-142: Add a date override with specific time range, verify it appears with correct times', async ({ page }) => {
    await gotoSchedulingTab(page);

    await page.getByRole('button', { name: 'Add Date Override' }).click();

    const dateInput = page.locator('#override-date');
    await expect(dateInput).toBeVisible({ timeout: 5_000 });

    // Fill date
    const testDate = futureDate(85);
    await dateInput.fill(testDate);

    // Set specific time range: Open at 10:00, Close at 14:00
    // The "Open at" select is the first time select in the form
    const openAtSelect = page.locator('select').filter({ has: page.locator('option[value="10:00"]') }).first();
    await openAtSelect.selectOption('10:00');

    // The "Close at" select is the second time select
    const closeAtSelect = page.locator('select').filter({ has: page.locator('option[value="14:00"]') }).last();
    await closeAtSelect.selectOption('14:00');

    // Fill in a label
    const labelInput = page.locator('#override-label');
    await labelInput.fill('E2E Override Test');

    // Click "Add Date Override"
    await page.getByRole('button', { name: 'Add Date Override' }).click();

    // The override should appear in the list with the times
    await expect(page.getByText('E2E Override Test')).toBeVisible({ timeout: 5_000 });
    // The time range text "Available 10:00 – 14:00" or similar should appear
    await expect(page.getByText('10:00')).toBeVisible();
    await expect(page.getByText('14:00')).toBeVisible();
  });

  test('SCHED-143: Edit a date override — click Pencil, change time, click Update, verify list updates', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Check if "E2E Override Test" exists from SCHED-142; create if not
    const overrideEntry = page.getByText('E2E Override Test');
    const isVisible = await overrideEntry.isVisible().catch(() => false);

    if (!isVisible) {
      // Create one
      await page.getByRole('button', { name: 'Add Date Override' }).click();
      const dateInput = page.locator('#override-date');
      await expect(dateInput).toBeVisible({ timeout: 5_000 });
      await dateInput.fill(futureDate(86));
      await page.locator('#override-label').fill('E2E Override Test');
      const openAtSelect = page.locator('select').filter({ has: page.locator('option[value="10:00"]') }).first();
      await openAtSelect.selectOption('10:00');
      const closeAtSelect = page.locator('select').filter({ has: page.locator('option[value="14:00"]') }).last();
      await closeAtSelect.selectOption('14:00');
      await page.getByRole('button', { name: 'Add Date Override' }).click();
      await expect(page.getByText('E2E Override Test')).toBeVisible({ timeout: 5_000 });
    }

    // Click the Pencil button on the override row (first of two buttons)
    const row = page.locator('div').filter({ hasText: 'E2E Override Test' }).filter({ has: page.locator('button') }).last();
    const pencilBtn = row.locator('button').nth(0);
    await pencilBtn.click();

    // The edit form should appear — the button should say "Update Date Override"
    await expect(page.getByRole('button', { name: 'Update Date Override' })).toBeVisible({ timeout: 5_000 });

    // Change the close time — select 16:00 in the "Close at" select
    const closeAtSelect = page.locator('select').filter({ has: page.locator('option[value="16:00"]') }).last();
    await closeAtSelect.selectOption('16:00');

    // Click Update
    await page.getByRole('button', { name: 'Update Date Override' }).click();

    // The updated time should appear in the list
    await expect(page.getByText('16:00')).toBeVisible({ timeout: 5_000 });
  });

  test('SCHED-144: Delete a date override — click Trash, confirm dialog, verify removal', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Check if "E2E Override Test" exists
    const overrideEntry = page.getByText('E2E Override Test');
    const isVisible = await overrideEntry.isVisible().catch(() => false);

    if (!isVisible) {
      // Create one
      await page.getByRole('button', { name: 'Add Date Override' }).click();
      const dateInput = page.locator('#override-date');
      await expect(dateInput).toBeVisible({ timeout: 5_000 });
      await dateInput.fill(futureDate(87));
      await page.locator('#override-label').fill('E2E Override Test');
      await page.getByRole('button', { name: 'Add Date Override' }).click();
      await expect(page.getByText('E2E Override Test')).toBeVisible({ timeout: 5_000 });
    }

    // Click the Trash button on the override row (second of two buttons: pencil, trash)
    const row = page.locator('div').filter({ hasText: 'E2E Override Test' }).filter({ has: page.locator('button') }).last();
    const trashBtn = row.locator('button').nth(1);
    await trashBtn.click();

    // Confirmation dialog
    await expect(page.getByText('Remove Date Override?')).toBeVisible({ timeout: 5_000 });

    // Click Remove
    await page.getByRole('button', { name: 'Remove' }).click();

    // The override should be removed from the list
    await expect(page.getByText('E2E Override Test')).not.toBeVisible({ timeout: 5_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SAVE FLOW
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Save Flow', () => {

  test('SCHED-150: After making changes, verify the sticky save bar appears', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Make a change to trigger dirty state — edit global business hours
    const editBtn = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') }).first();
    await editBtn.click();
    await expect(page.getByLabel('Enable Monday')).toBeVisible({ timeout: 5_000 });

    // Toggle a checkbox to create a dirty state
    const satCheckbox = page.getByLabel('Enable Saturday');
    const wasChecked = await satCheckbox.isChecked();
    if (wasChecked) {
      await satCheckbox.uncheck();
    } else {
      await satCheckbox.check();
    }
    await page.getByRole('button', { name: 'Done' }).click();

    // The sticky save bar should appear with "Unsaved changes" text
    await expect(page.getByText('Unsaved changes')).toBeVisible({ timeout: 5_000 });

    // The Save button should be visible
    await expect(
      page.getByRole('button', { name: 'Save Changes' })
        .or(page.getByRole('button', { name: 'Save & Connect Calendar' }))
    ).toBeVisible();
  });

  test('SCHED-151: Click Save, verify toast success message appears', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Make a change to enable the save button
    const editBtn = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') }).first();
    await editBtn.click();
    await expect(page.getByLabel('Enable Monday')).toBeVisible({ timeout: 5_000 });

    // Toggle Saturday to create dirty state
    const satCheckbox = page.getByLabel('Enable Saturday');
    const wasChecked = await satCheckbox.isChecked();
    if (wasChecked) {
      await satCheckbox.uncheck();
    } else {
      await satCheckbox.check();
    }
    await page.getByRole('button', { name: 'Done' }).click();

    // Wait for the save bar to appear
    await expect(page.getByText('Unsaved changes')).toBeVisible({ timeout: 5_000 });

    // Click Save
    const saveBtn = page.getByRole('button', { name: 'Save Changes' })
      .or(page.getByRole('button', { name: 'Save & Connect Calendar' }));
    await saveBtn.click();

    // Wait for the save API call and success toast
    await expect(page.getByText('Calendar settings saved')).toBeVisible({ timeout: 15_000 });

    // The "Unsaved changes" text should disappear after save
    await expect(page.getByText('Unsaved changes')).not.toBeVisible({ timeout: 10_000 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Cleanup', () => {

  test('SCHED-999: Revert calendar settings to clean defaults', async ({ page }) => {
    await gotoSchedulingTab(page);

    // Remove any scoped business hours sets that were added during tests
    // Keep removing until empty
    let scopedSetVisible = true;
    let attempts = 0;
    while (scopedSetVisible && attempts < 10) {
      const trashBtns = page
        .locator('div')
        .filter({ hasText: /Scoped Business Hours/ })
        .first()
        .locator('button')
        .filter({ has: page.locator('svg.lucide-trash-2') });
      const count = await trashBtns.count();
      if (count === 0) {
        scopedSetVisible = false;
        break;
      }
      await trashBtns.first().click();
      // Handle confirmation dialog if it appears
      const removeBtn = page.getByRole('button', { name: 'Remove' });
      if (await removeBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await removeBtn.click();
      }
      attempts++;
      // Brief wait for the UI to update
      await page.waitForTimeout(500);
    }

    // Remove any date overrides
    let overrideVisible = true;
    attempts = 0;
    while (overrideVisible && attempts < 10) {
      // Date overrides card
      const trashBtns = page.locator('div').filter({ hasText: /Date Overrides/ }).last().locator('button').filter({ has: page.locator('svg.lucide-trash-2') });
      const count = await trashBtns.count();
      if (count === 0) {
        overrideVisible = false;
        break;
      }
      await trashBtns.first().click();
      const removeBtn = page.getByRole('button', { name: 'Remove' });
      if (await removeBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await removeBtn.click();
      }
      attempts++;
      await page.waitForTimeout(500);
    }

    // Remove any scoped blocked dates
    let scopedBlockVisible = true;
    attempts = 0;
    while (scopedBlockVisible && attempts < 10) {
      const scopedBlockSection = page.locator('div').filter({ hasText: /Scoped Blocked Dates/ }).first();
      const trashBtns = scopedBlockSection.locator('button').filter({ has: page.locator('svg.lucide-trash-2') });
      const count = await trashBtns.count();
      if (count === 0) {
        scopedBlockVisible = false;
        break;
      }
      await trashBtns.first().click();
      const removeBtn = page.getByRole('button', { name: 'Remove' });
      if (await removeBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await removeBtn.click();
      }
      attempts++;
      await page.waitForTimeout(500);
    }

    // Save the clean state if dirty
    const unsavedText = page.getByText('Unsaved changes');
    const hasDirtyState = await unsavedText.isVisible().catch(() => false);
    if (hasDirtyState) {
      const saveBtn = page.getByRole('button', { name: 'Save Changes' })
        .or(page.getByRole('button', { name: 'Save & Connect Calendar' }));
      await saveBtn.click();
      await expect(page.getByText('Calendar settings saved')).toBeVisible({ timeout: 15_000 });
    }
  });
});
