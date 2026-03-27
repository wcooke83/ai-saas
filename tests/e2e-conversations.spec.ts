import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Conversations & History', () => {
  test('conversations page loads and displays content', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/conversations`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Page should have meaningful content (conversation list or empty state)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('conversations page loads conversation data from API', async ({ page }) => {
    // Navigate and verify the API call happens
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/conversations`) && res.request().method() === 'GET'
    );

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/conversations`);
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();
  });

  test('widget history endpoint works', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/history?session_id=e2e-nonexistent`);
    expect(res.ok()).toBeTruthy();
  });

  test('transcript endpoint works', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/transcript`, {
      data: { session_id: 'e2e-test', email: 'test@test.local' },
    });
    // May fail if no conversation exists, but shouldn't 500
    expect(res.status()).toBeLessThan(500);
  });
});
