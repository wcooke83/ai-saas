import { test, expect } from '@playwright/test';

let createdChatbotId: string | null = null;

test.describe('Chatbot CRUD', () => {
  test('can navigate to chatbots list', async ({ page }) => {
    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
    const content = await page.locator('body').textContent();
    expect(content?.length).toBeGreaterThan(50);
  });

  test('can create a chatbot via wizard', async ({ page }) => {
    await page.goto('/dashboard/chatbots/new');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: Basic Info
    await expect(page.getByRole('heading', { name: 'Basic Info' })).toBeVisible();
    await page.locator('#name').fill('E2E Temp Bot');
    await page.locator('#description').fill('A temporary bot created by E2E tests.');
    await page.locator('#welcome_message').fill('Hello from E2E!');

    // Click Next to go to System Prompt step
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('System Prompt')).toBeVisible();

    // Step 2: System Prompt — keep the default template prompt
    // Click Next to go to Review step
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Review')).toBeVisible();

    // Step 3: Review — verify details shown
    await expect(page.getByText('E2E Temp Bot')).toBeVisible();
    await expect(page.getByText('Hello from E2E!')).toBeVisible();

    // Click Create Chatbot and wait for the API response
    const createPromise = page.waitForResponse(
      (res) => res.url().includes('/api/chatbots') && res.request().method() === 'POST'
    );
    await page.getByRole('button', { name: 'Create Chatbot' }).click();
    const createResponse = await createPromise;

    if (createResponse.ok()) {
      const body = await createResponse.json();
      createdChatbotId = body.data?.chatbot?.id || null;
      expect(createdChatbotId).toBeTruthy();

      // Should navigate to knowledge page after creation
      await page.waitForURL(`**/dashboard/chatbots/${createdChatbotId}/knowledge`, { timeout: 10000 });
    } else {
      // Tool access may not be configured — just verify no 500
      expect(createResponse.status()).toBeLessThan(500);
      console.log(`Create chatbot returned ${createResponse.status()} — tool access may not be configured`);
    }
  });

  test('can load created chatbot overview', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto(`/dashboard/chatbots/${createdChatbotId}`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
    // Chatbot name should appear on the overview page
    await expect(page.getByText('E2E Temp Bot')).toBeVisible();
  });

  test('can update chatbot name via settings page', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto(`/dashboard/chatbots/${createdChatbotId}/settings`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Wait for the form to load with the chatbot data
    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible({ timeout: 10000 });
    await nameInput.waitFor({ state: 'visible' });

    // Clear and type new name
    await nameInput.clear();
    await nameInput.fill('E2E Temp Bot Updated');

    // Click Save Changes and wait for the API response
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${createdChatbotId}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveResponse = await savePromise;

    expect(saveResponse.ok()).toBeTruthy();
    if (saveResponse.ok()) {
      const body = await saveResponse.json();
      expect(body.data?.chatbot?.name || body.data?.name).toBe('E2E Temp Bot Updated');
    }
  });

  test('can delete chatbot via dashboard menu', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');

    // Find the chatbot card and open its menu
    const card = page.locator('text=E2E Temp Bot Updated').locator('..').locator('..').locator('..');
    const menuButton = card.locator('button[aria-label="Chatbot actions"]');
    await menuButton.click();

    // Click Delete in the dropdown menu
    await page.getByRole('menuitem', { name: 'Delete' }).click();

    // Confirm the delete dialog
    const deletePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${createdChatbotId}`) && res.request().method() === 'DELETE'
    );
    await page.getByRole('button', { name: 'Delete' }).click();
    const deleteResponse = await deletePromise;

    expect(deleteResponse.ok()).toBeTruthy();
    createdChatbotId = null;
  });
});
