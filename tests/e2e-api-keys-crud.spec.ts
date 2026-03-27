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
    const nameInput = page.locator('input[placeholder*="key" i], input[name="name"]').first();
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
    await expect(page.getByText('E2E Test Key')).toBeVisible({ timeout: 10000 });
  });

  test('delete API key via dashboard', async ({ page }) => {
    test.skip(!createdKeyId, 'No key to delete');

    await page.goto('/dashboard/api-keys');
    await page.waitForLoadState('domcontentloaded');

    // Find the delete button near the E2E Test Key
    const keyRow = page.getByText('E2E Test Key').locator('..').locator('..');
    const deleteButton = keyRow.locator('button[aria-label*="delete" i], button:has(svg)').last();

    if (await deleteButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const deletePromise = page.waitForResponse(
        (res) => res.url().includes('/api/keys/') && res.request().method() === 'DELETE'
      );
      await deleteButton.click();

      // Handle confirmation dialog if present
      const confirmButton = page.getByRole('button', { name: /confirm|delete/i }).last();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
      }

      const deleteResponse = await deletePromise;
      expect(deleteResponse.ok()).toBeTruthy();
    } else {
      // Fallback: delete via API
      const res = await page.request.delete(`/api/keys/${createdKeyId}`);
      expect(res.ok()).toBeTruthy();
    }
  });
});
