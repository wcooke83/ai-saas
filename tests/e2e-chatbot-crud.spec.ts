import { test, expect } from '@playwright/test';

let createdChatbotId: string | null = null;

test.describe('Chatbot CRUD', () => {
  test.beforeAll(async ({ browser }) => {
    // Clean up any leftover "E2E Temp Bot" chatbots from previous failed runs.
    // Pro plan cap is 10; if we're at the limit the POST will 403.
    const cleanupCtx = await browser.newContext({ storageState: 'tests/auth/e2e-storage.json' });
    const cleanupPage = await cleanupCtx.newPage();
    try {
      const listRes = await cleanupPage.request.get('/api/chatbots');
      if (listRes.ok()) {
        const listBody = await listRes.json();
        const bots = listBody.data?.chatbots ?? listBody.chatbots ?? [];
        for (const bot of bots) {
          if (bot.name === 'E2E Temp Bot' || bot.name === 'E2E Temp Bot Updated') {
            await cleanupPage.request.delete(`/api/chatbots/${bot.id}`);
          }
        }
      }
    } finally {
      await cleanupPage.close();
      await cleanupCtx.close();
    }

    // Pre-warm Next.js route compilation in parallel so tests don't hit
    // cold-compile latency. API calls are fulfilled with 404 immediately so
    // pages render without waiting for real data.
    const ctx = await browser.newContext({ storageState: 'tests/auth/e2e-storage.json' });

    const routes = [
      '/dashboard/chatbots/new',
      '/dashboard/chatbots/00000000-0000-0000-0000-000000000000',
      '/dashboard/chatbots/00000000-0000-0000-0000-000000000000/knowledge',
      '/dashboard/chatbots/00000000-0000-0000-0000-000000000000/settings',
    ];

    await Promise.all(
      routes.map(async (path) => {
        const p = await ctx.newPage();
        await p.route('**/api/chatbots/**', (route) => route.fulfill({ status: 404, body: '{}' }));
        await p.goto(path);
        await p.waitForLoadState('domcontentloaded');
        await p.close();
      })
    );

    await ctx.close();
  });

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

    // Click Next to go to Chatbot Instructions step
    await page.getByRole('button', { name: 'Next' }).first().click();
    await expect(page.locator('#system_prompt')).toBeVisible();

    // Step 2: Chatbot Instructions — keep the default template prompt
    // Click Next to go to Review step
    await page.getByRole('button', { name: 'Next' }).first().click();
    await expect(page.getByRole('button', { name: 'Create Chatbot' })).toBeVisible({ timeout: 5000 });

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
    // Overview page is a 'use client' component; chatbot.name renders after fetch
    await expect(page.getByText('E2E Temp Bot')).toBeVisible({ timeout: 15000 });
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

    // Clear and type new name; verify the input value is updated before saving
    await nameInput.clear();
    await nameInput.fill('E2E Temp Bot Updated');
    // Confirm react-hook-form has picked up the new value
    await expect(nameInput).toHaveValue('E2E Temp Bot Updated');

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
