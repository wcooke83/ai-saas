import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Handoff & Escalation Flow', () => {
  test('escalations page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/issues`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Page should have content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('conversations page loads with conversation list', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/conversations`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Verify API is called
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes('/conversations') && res.request().method() === 'GET'
    );
    await page.reload();
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();
  });

  test('check handoff status requires conversation_id', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/handoff`);
    expect(res.status()).toBe(400);
  });

  test('check handoff status with invalid conversation returns empty', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/handoff?conversation_id=00000000-0000-0000-0000-000000000000`);
    expect(res.ok()).toBeTruthy();
  });
});
