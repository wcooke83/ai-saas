import { test, expect } from '@playwright/test';

let createdKeyId: string | null = null;

test.describe('API Key CRUD', () => {
  test('create API key via dashboard', async ({ page }) => {
    await page.goto('/dashboard/api-keys');
    await page.waitForLoadState('domcontentloaded');

    // Click "Create New Key" button
    const createButton = page.getByRole('button', { name: /create.*key/i }).first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();

    // Fill in the key name
    const nameInput = page.getByRole('textbox', { name: /key name/i });
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill('E2E Test Key');

    // Submit the form
    const submitButton = page.getByRole('button', { name: /create.*key/i }).last();
    const createPromise = page.waitForResponse(
      (res) => res.url().includes('/api/keys') && res.request().method() === 'POST'
    );
    await submitButton.click();
    const createResponse = await createPromise;

    expect(createResponse.ok()).toBeTruthy();
    const body = await createResponse.json();
    expect(body.plainKey).toBeTruthy();
    expect(body.name).toBe('E2E Test Key');
    createdKeyId = body.id;
  });

  test('created key appears in list', async ({ page }) => {
    await page.goto('/dashboard/api-keys');
    await page.waitForLoadState('domcontentloaded');

    // The key name should appear on the page
    await expect(page.getByText('E2E Test Key').first()).toBeVisible({ timeout: 10000 });
  });

  test('delete API key via dashboard', async ({ page }) => {
    test.skip(!createdKeyId, 'No key to delete');

    await page.goto('/dashboard/api-keys');
    await page.waitForLoadState('domcontentloaded');

    // Find the row containing the E2E Test Key by its key ID link
    const keyRow = page.locator('div.group', { has: page.getByText('E2E Test Key') }).first();
    await expect(keyRow).toBeVisible({ timeout: 10000 });

    // Hover to reveal the action buttons (they use opacity-0 group-hover:opacity-100)
    await keyRow.hover();

    // The Delete button uses window.confirm() — auto-accept it before clicking
    page.on('dialog', dialog => dialog.accept());

    const deletePromise = page.waitForResponse(
      (res) => res.url().includes('/api/keys/') && res.request().method() === 'DELETE'
    );
    await keyRow.getByRole('button', { name: 'Delete' }).click();
    const deleteResponse = await deletePromise;
    expect(deleteResponse.ok()).toBeTruthy();

    // Key should no longer appear in the list
    await expect(page.getByText('E2E Test Key')).not.toBeVisible({ timeout: 10000 });
  });
});
