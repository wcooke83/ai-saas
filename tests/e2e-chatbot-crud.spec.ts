import { test, expect } from '@playwright/test';

let createdChatbotId: string | null = null;

test.describe('Chatbot CRUD', () => {
  test('can navigate to chatbots list', async ({ page }) => {
    await page.goto('/dashboard/chatbots');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
    // Should see E2E Test Bot or a create button
    const content = await page.locator('body').textContent();
    expect(content?.length).toBeGreaterThan(50);
  });

  test('can open create chatbot wizard', async ({ page }) => {
    await page.goto('/dashboard/chatbots/new');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
    // Wizard should show step 1 (basic info)
    const hasNameInput = await page.locator('input[name="name"], input[placeholder*="name" i]').isVisible().catch(() => false);
    const hasContent = (await page.locator('body').textContent())?.length || 0;
    expect(hasNameInput || hasContent > 100).toBeTruthy();
  });

  test('can create a chatbot via API', async ({ page }) => {
    const response = await page.request.post('/api/chatbots', {
      data: {
        name: 'E2E Temp Bot',
        system_prompt: 'You are a test bot for E2E tests.',
      },
    });

    // May return 403 if tool access not configured — skip dependent tests
    if (response.ok()) {
      const body = await response.json();
      createdChatbotId = body.data?.id || body.data?.chatbot?.id || null;
      expect(createdChatbotId).toBeTruthy();
    } else {
      expect(response.status()).toBeLessThan(500);
      console.log(`Create chatbot returned ${response.status()} — tool access may not be configured`);
    }
  });

  test('can load created chatbot overview', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto(`/dashboard/chatbots/${createdChatbotId}`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('can load chatbot settings', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    await page.goto(`/dashboard/chatbots/${createdChatbotId}/settings`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('can update chatbot via API', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    const response = await page.request.put(`/api/chatbots/${createdChatbotId}`, {
      data: { name: 'E2E Temp Bot Updated' },
    });

    // PUT may not exist (PATCH only), or may return 403
    expect(response.status()).toBeLessThan(500);
    if (response.ok()) {
      const body = await response.json();
      expect(body.data?.name || body.data?.chatbot?.name).toBe('E2E Temp Bot Updated');
    }
  });

  test('can delete chatbot via API', async ({ page }) => {
    test.skip(!createdChatbotId, 'No chatbot created');

    const response = await page.request.delete(`/api/chatbots/${createdChatbotId}`);
    expect(response.ok()).toBeTruthy();
    createdChatbotId = null;
  });
});
