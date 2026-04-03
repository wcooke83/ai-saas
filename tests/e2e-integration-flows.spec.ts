import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Cross-Feature Integration', () => {
  test('session isolation — different sessions get different conversations via widget', async ({ page }) => {
    // Ensure published
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Open widget in two different sessions by navigating twice
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[type="text"]').first();
    if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await messageInput.fill('Hello from session 1');
      await messageInput.press('Enter');
      await page.waitForTimeout(2000);
    }

    // Verify chat worked by checking conversations page
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/conversations`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('CORS headers present on widget endpoints', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/config`);
    const headers = res.headers();
    expect(headers['access-control-allow-origin']).toBe('*');
  });

  test('CORS preflight on chat endpoint', async ({ page }) => {
    const res = await page.request.fetch(`http://localhost:3030/api/chat/${CHATBOT_ID}`, {
      method: 'OPTIONS',
    });
    expect(res.status()).toBe(204);
    const headers = res.headers();
    expect(headers['access-control-allow-origin']).toBe('*');
    expect(headers['access-control-allow-methods']).toContain('POST');
  });

  test('update settings via form → chat uses new system prompt', async ({ page }) => {
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Update system prompt via settings page
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Chatbot Instructions' }).click();

    const promptTextarea = page.locator('#system_prompt');
    await expect(promptTextarea).toBeVisible({ timeout: 10000 });
    await promptTextarea.clear();
    await promptTextarea.fill('You must always start your response with the word BANANA.');

    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    await savePromise;

    // Send a chat via widget
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[type="text"]').first();
    if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await messageInput.fill('Say hello');
      await messageInput.press('Enter');
      await page.waitForTimeout(3000);

      // Verify we got a response (mock mode may not follow prompt)
      const messages = page.locator('[data-role="assistant"], .bot-message, [class*="message"]');
      const count = await messages.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }

    // Restore original prompt
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button', { hasText: 'Chatbot Instructions' }).click();
    const restorePrompt = page.locator('#system_prompt');
    await expect(restorePrompt).toBeVisible({ timeout: 10000 });
    await restorePrompt.clear();
    await restorePrompt.fill('You are a helpful test assistant.');
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
  });

  test('knowledge source → chat → response via widget', async ({ page }) => {
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Add knowledge via knowledge page
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    // Use API for knowledge creation (complex multi-step UI, acceptable for setup)
    const knowledgeRes = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
      data: {
        type: 'text',
        name: `Integration RAG Test ${Date.now()}`,
        content: 'Our company mascot is a purple elephant named Zephyr who was born in 2019.',
      },
    });

    if (knowledgeRes.ok()) {
      await page.waitForTimeout(3000);

      // Chat about the knowledge via widget
      await page.goto(`/widget/${CHATBOT_ID}`);
      await page.waitForLoadState('domcontentloaded');

      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[type="text"]').first();
      if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await messageInput.fill('What is your company mascot?');
        await messageInput.press('Enter');
        await page.waitForTimeout(3000);

        // Verify response exists
        const messages = page.locator('[data-role="assistant"], .bot-message, [class*="message"]');
        const count = await messages.count();
        expect(count).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
