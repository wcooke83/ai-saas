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
    // Verify the agent-conversations API endpoint responds successfully using the authenticated session
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/agent-conversations?limit=50`);
    expect(res.ok()).toBeTruthy();
  });

  test('widget history endpoint works', async ({ page }) => {
    // The history endpoint requires visitor_id (not session_id); with a nonexistent visitor it returns empty success
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/history?visitor_id=e2e-nonexistent`);
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
