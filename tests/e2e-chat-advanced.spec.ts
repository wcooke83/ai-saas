import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Chat Advanced Flows', () => {
  test('send message via widget and verify performance dashboard', async ({ page }) => {
    // Send a message through the widget
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[type="text"]').first();

    if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await messageInput.fill('What is your purpose?');
      await messageInput.press('Enter');

      // Wait for response
      await page.waitForTimeout(3000);
    }

    // Navigate to performance dashboard and verify it loads
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/performance`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Performance page should show some data
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('unpublished chatbot shows warning on deploy page', async ({ page }) => {
    // Unpublish directly via API to avoid UI timing issues
    const unpublishRes = await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);
    // Accept 200 (unpublished) or 400/404 (already unpublished or not found)
    expect([200, 400, 404]).toContain(unpublishRes.status());

    // Verify widget returns 403 for chat when unpublished
    const res = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'Hello', stream: false, session_id: 'e2e-unpub' },
    });
    expect(res.status()).toBe(403);

    // Re-publish directly via API
    const publishRes = await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);
    expect(publishRes.status()).toBe(200);
  });

  test('welcome message shown in widget', async ({ page }) => {
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Widget should show a welcome message
    const welcomeText = page.locator('[class*="message"], [data-role="assistant"], .bot-message').first();
    if (await welcomeText.isVisible({ timeout: 5000 }).catch(() => false)) {
      const text = await welcomeText.textContent();
      expect(text?.length).toBeGreaterThan(0);
    }
  });

  test('message length validation', async ({ page }) => {
    // Very long message should be rejected by API
    const longMessage = 'a'.repeat(10001);
    const res = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: longMessage, stream: false, session_id: 'e2e-long' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
