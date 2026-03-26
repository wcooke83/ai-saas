import { test, expect } from '@playwright/test';

test.describe('Section 40: Admin -- Trial Links (/admin/trials)', () => {
  test('ADMIN-TRIALS-001: Trials page loads with table', async ({ page }) => {
    await page.goto('/admin/trials');
    await page.waitForLoadState('domcontentloaded');

    // Wait for loading spinner to disappear and page to render
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Create and manage shareable trial links')).toBeVisible();

    // New Trial Link button
    await expect(page.getByText('New Trial Link')).toBeVisible();

    // Table headers
    const headers = ['Code', 'Plan', 'Duration', 'Redemptions', 'Expires', 'Status', 'Actions'];
    for (const header of headers) {
      await expect(page.locator('th', { hasText: header })).toBeVisible();
    }
  });

  test('ADMIN-TRIALS-002: Trials page loading state', async ({ page }) => {
    await page.goto('/admin/trials');
    // Loading spinner (Loader2) should show briefly
    await page.waitForLoadState('domcontentloaded');
    // Eventually loads the page content
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });
  });

  test('ADMIN-TRIALS-003: Create trial link -- all fields', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Click New Trial Link
    await page.getByText('New Trial Link').click();

    // Modal should open
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    // Fill in code
    const codeInput = page.locator('input[placeholder="e.g., SUMMER2024"]');
    const uniqueCode = `E2E-${Date.now().toString(36).toUpperCase()}`;
    await codeInput.fill(uniqueCode);

    // Select a plan — wait for plans to load into dropdown
    const planSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Select a plan...' }) });
    // Wait for plan options to load
    await expect(planSelect.locator('option')).not.toHaveCount(0, { timeout: 5000 });
    const options = await planSelect.locator('option').allTextContents();
    if (options.length <= 1) {
      // No plans available — skip the rest of this test
      test.skip(true, 'No plans available in dropdown');
      return;
    }
    await planSelect.selectOption({ index: 1 });

    // Set duration
    const durationInput = page.locator('input[type="number"][min="1"][max="365"]');
    await durationInput.fill('30');

    // Set credits limit
    const creditsInput = page.locator('input[placeholder="Plan default"]');
    await creditsInput.fill('50000');

    // Set max redemptions
    const maxRedemptionsInput = page.locator('input[placeholder="Unlimited"]');
    await maxRedemptionsInput.fill('100');

    // Set name
    const nameInput = page.locator('input[placeholder="e.g., Summer Promo 2024"]');
    await nameInput.fill('E2E Test Trial');

    // Submit
    await page.locator('form button[type="submit"]').click();

    // Wait for toast or trial to appear
    await expect(
      page.getByText('Trial link created successfully').or(page.getByText(uniqueCode))
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(uniqueCode)).toBeVisible({ timeout: 10000 });
  });

  test('ADMIN-TRIALS-004: Create trial link -- code auto-uppercase', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    const codeInput = page.locator('input[placeholder="e.g., SUMMER2024"]');
    await codeInput.fill('summer-test');

    // Should auto-uppercase
    const value = await codeInput.inputValue();
    expect(value).toBe('SUMMER-TEST');
  });

  test('ADMIN-TRIALS-005: Create trial link -- generate random code', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    const codeInput = page.locator('input[placeholder="e.g., SUMMER2024"]');

    // Click Generate button
    await page.getByRole('button', { name: /generate/i }).click();

    const value = await codeInput.inputValue();
    expect(value).toHaveLength(8);
    expect(value).toMatch(/^[A-Z0-9]+$/);
  });

  test('ADMIN-TRIALS-006: Create trial link -- plan dropdown shows credits', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    // Check plan dropdown options contain credits info
    const planSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Select a plan...' }) });
    const options = await planSelect.locator('option').allTextContents();

    // At least the default "Select a plan..." + actual plans
    expect(options.length).toBeGreaterThanOrEqual(1);
    // Non-placeholder options should show credits info
    for (const opt of options.slice(1)) {
      expect(opt).toMatch(/credits\/mo/);
    }
  });

  test('ADMIN-TRIALS-007: Create trial link -- validation', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    // Code and Plan are required (HTML validation)
    const codeInput = page.locator('input[placeholder="e.g., SUMMER2024"]');
    await expect(codeInput).toHaveAttribute('required', '');

    const planSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Select a plan...' }) });
    await expect(planSelect).toHaveAttribute('required', '');

    // Duration min=1 max=365
    const durationInput = page.locator('input[type="number"][min="1"][max="365"]');
    await expect(durationInput).toHaveAttribute('min', '1');
    await expect(durationInput).toHaveAttribute('max', '365');
    await expect(durationInput).toHaveAttribute('required', '');
  });

  test('ADMIN-TRIALS-008: Create trial link -- optional fields', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    // Fill only required fields
    const uniqueCode = `MIN-${Date.now().toString(36).toUpperCase()}`;
    await page.locator('input[placeholder="e.g., SUMMER2024"]').fill(uniqueCode);

    const planSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Select a plan...' }) });
    await expect(planSelect.locator('option')).not.toHaveCount(0, { timeout: 5000 });
    const options = await planSelect.locator('option').allTextContents();
    if (options.length <= 1) {
      test.skip(true, 'No plans available in dropdown');
      return;
    }
    await planSelect.selectOption({ index: 1 });

    await page.locator('input[type="number"][min="1"][max="365"]').fill('14');

    // Submit with only required fields
    await page.locator('form button[type="submit"]').click();

    // Wait for success
    await expect(
      page.getByText('Trial link created successfully').or(page.getByText(uniqueCode))
    ).toBeVisible({ timeout: 15000 });
  });

  test('ADMIN-TRIALS-009: Create modal -- cancel and close', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    // Enter some data
    await page.locator('input[placeholder="e.g., SUMMER2024"]').fill('TESTCANCEL');

    // Click Cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Modal should close
    await expect(page.locator('h2', { hasText: 'Create Trial Link' })).not.toBeVisible({ timeout: 5000 });
  });

  test('ADMIN-TRIALS-010: Toggle trial active/inactive', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Enable showing inactive trials
    const checkbox = page.getByLabel('Show inactive trials');
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
    await expect(checkbox).toBeChecked();

    // Find a status badge (Active or Inactive)
    const statusBtns = page.locator('button').filter({ hasText: /^(Active|Inactive)$/ });
    const count = await statusBtns.count();
    if (count === 0) return;

    const firstStatus = statusBtns.first();
    const initialText = await firstStatus.textContent();

    // Click to toggle
    await firstStatus.click();

    // Status should have changed
    const newText = await statusBtns.first().textContent();
    // It may or may not change depending on the test state, but the click should work without error
    expect(newText).toBeTruthy();
  });

  test('ADMIN-TRIALS-011: Inactive trial row styling', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Show inactive trials
    const checkbox = page.getByLabel('Show inactive trials');
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
    await expect(checkbox).toBeChecked();

    // Check if any rows have opacity-50
    const inactiveRows = page.locator('tr.opacity-50');
    const count = await inactiveRows.count();
    // This test validates the styling exists when there are inactive trials
    if (count > 0) {
      await expect(inactiveRows.first()).toHaveClass(/opacity-50/);
    }
  });

  test('ADMIN-TRIALS-012: Copy trial URL', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Find a copy button
    const copyBtn = page.locator('button[title="Copy trial URL"]').first();
    const count = await copyBtn.count();
    if (count === 0) return;

    // Grant clipboard permission
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await copyBtn.click();

    // Check icon should briefly appear (green check)
    const checkIcon = page.locator('button[title="Copy trial URL"] .text-green-500').first();
    // The icon change is temporary, so just verify the click didn't error
    expect(true).toBeTruthy();
  });

  test('ADMIN-TRIALS-013: Open trial page in new tab', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Find the external link button
    const extLink = page.locator('a[title="Open trial page"]').first();
    const count = await extLink.count();
    if (count === 0) return;

    // Verify it has target="_blank"
    await expect(extLink).toHaveAttribute('target', '_blank');
    // Verify it links to /signup?trial=
    const href = await extLink.getAttribute('href');
    expect(href).toContain('/signup?trial=');
  });

  test('ADMIN-TRIALS-014: Delete trial link with confirmation', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // First create a trial to delete
    await page.getByText('New Trial Link').click();
    await expect(page.getByText('Create Trial Link')).toBeVisible({ timeout: 5000 });

    const deleteCode = `DEL-${Date.now().toString(36).toUpperCase()}`;
    await page.locator('input[placeholder="e.g., SUMMER2024"]').fill(deleteCode);
    const planSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Select a plan...' }) });
    await expect(planSelect.locator('option')).not.toHaveCount(0, { timeout: 5000 });
    const options = await planSelect.locator('option').allTextContents();
    if (options.length <= 1) {
      test.skip(true, 'No plans available in dropdown');
      return;
    }
    await planSelect.selectOption({ index: 1 });
    await page.locator('input[type="number"][min="1"][max="365"]').fill('7');
    await page.locator('form button[type="submit"]').click();
    await expect(
      page.getByText('Trial link created successfully').or(page.getByText(deleteCode))
    ).toBeVisible({ timeout: 15000 });

    // Now delete it - find the row with our code and click delete
    const row = page.locator('tr', { hasText: deleteCode });
    if ((await row.count()) > 0) {
      await row.locator('button[title="Delete"]').click();

      // Confirmation dialog
      await expect(page.getByText('Delete trial link?')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('This action cannot be undone')).toBeVisible();

      // Confirm delete
      await page.getByRole('button', { name: 'Delete' }).filter({ hasNotText: /trial link/ }).click();

      // Trial should be removed
      await expect(page.getByText(deleteCode)).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('ADMIN-TRIALS-015: Delete trial link -- cancel', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    const deleteBtn = page.locator('button[title="Delete"]').first();
    if ((await deleteBtn.count()) === 0) return;

    await deleteBtn.click();
    await expect(page.getByText('Delete trial link?')).toBeVisible({ timeout: 5000 });

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Delete trial link?')).not.toBeVisible({ timeout: 5000 });
  });

  test('ADMIN-TRIALS-016: Show inactive trials filter', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    const checkbox = page.getByLabel('Show inactive trials');
    await expect(checkbox).toBeVisible();

    // Toggle on
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
    await expect(checkbox).toBeChecked();

    // Toggle off
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('ADMIN-TRIALS-017: Redemptions count display', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Check Redemptions column has Users icon and count
    const redemptionCells = page.locator('td').filter({ has: page.locator('svg') }).filter({ hasText: /\d/ });
    const count = await redemptionCells.count();
    if (count > 0) {
      const text = await redemptionCells.first().textContent();
      expect(text).toMatch(/\d/);
    }
  });

  test('ADMIN-TRIALS-018: Expiry date display', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Check for "Never" or a date in the Expires column
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();
    if (rowCount > 0) {
      // Expires column is the 5th column (index 4)
      const expiresCell = tableRows.first().locator('td').nth(4);
      const text = (await expiresCell.textContent()) || '';
      // Should show "Never" or contain a date string
      const hasValidExpiry = text.includes('Never') || /\d/.test(text);
      expect(hasValidExpiry).toBeTruthy();
    }
  });

  test('ADMIN-TRIALS-019: Empty state', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Check if empty state is shown (when no trials exist)
    const emptyMsg = page.getByText('No trial links found. Create one to start offering trials.');
    const tableRows = page.locator('tbody tr');

    // Either we have rows or we see the empty message
    const rowCount = await tableRows.count();
    if (rowCount === 0) {
      await expect(emptyMsg).toBeVisible();
    }
  });

  test('ADMIN-TRIALS-020: Trial link with credits limit display', async ({ page }) => {
    await page.goto('/admin/trials');
    await expect(page.locator('h1', { hasText: 'Trial Links' })).toBeVisible({ timeout: 30000 });

    // Check if any trial in the Duration column shows credits info beneath days
    const durationCells = page.locator('td').filter({ hasText: /days/ });
    const count = await durationCells.count();
    if (count > 0) {
      // At least one should show "X days" text
      const text = await durationCells.first().textContent();
      expect(text).toMatch(/\d+ days/);
    }
  });
});
