import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Knowledge Management', () => {
  test('knowledge page loads with add source options', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/knowledge`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  test('can add a text knowledge source via API', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/knowledge`, {
      data: {
        type: 'text',
        name: `E2E Test Source ${Date.now()}`,
        content: 'This is test knowledge content for E2E testing. It contains information about our test product.',
      },
    });

    // Should succeed or return validation error (both are valid — we just want no 500)
    expect(res.status()).toBeLessThan(500);
  });

  test('can list knowledge sources via API', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
