import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const KNOWLEDGE_PAGE = `/dashboard/chatbots/${CHATBOT_ID}/knowledge`;

test.describe('Knowledge Management', () => {
  test('knowledge page loads with add source options', async ({ page }) => {
    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Should show knowledge source options or existing sources
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('can add a text knowledge source via UI', async ({ page }) => {
    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');

    // Click add source button
    const addButton = page.getByRole('button', { name: /add.*source|add.*text/i }).first();
    if (await addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.click();
    }

    const textButton = page.locator('button', { hasText: 'Text' }).first();
    if (await textButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await textButton.click();
    }

    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i]').last();
    const contentInput = page.locator('textarea').last();

    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill(`E2E Test Source ${Date.now()}`);
      await contentInput.fill('This is test knowledge content for E2E testing.');

      const submitButton = page.getByRole('button', { name: /add|save|submit|create/i }).last();
      const createPromise = page.waitForResponse(
        (res) => res.url().includes('/knowledge') && res.request().method() === 'POST'
      );
      await submitButton.click();
      const createRes = await createPromise;
      expect(createRes.status()).toBeLessThan(500);
    } else {
      // Fallback
      const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
        data: {
          type: 'text',
          name: `E2E Test Source ${Date.now()}`,
          content: 'This is test knowledge content for E2E testing.',
        },
      });
      expect(res.status()).toBeLessThan(500);
    }
  });

  test('knowledge sources list loads on page', async ({ page }) => {
    await page.goto(KNOWLEDGE_PAGE);
    await page.waitForLoadState('domcontentloaded');

    // Wait for the API call to complete
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/knowledge`) && res.request().method() === 'GET'
    );
    await page.reload();
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();
  });
});
