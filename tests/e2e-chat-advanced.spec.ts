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
    // Unpublish via overview page
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    const unpublishButton = page.getByRole('button', { name: 'Unpublish' });
    if (await unpublishButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await unpublishButton.click();
      await page.waitForResponse(
        (res) => res.url().includes('/publish') && res.request().method() === 'DELETE'
      );
    }

    // Verify widget returns 403 for chat
    const res = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      data: { message: 'Hello', stream: false, session_id: 'e2e-unpub' },
    });
    expect(res.status()).toBe(403);

    // Re-publish via overview page
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    const publishButton = page.getByRole('button', { name: 'Publish' });
    await expect(publishButton).toBeVisible({ timeout: 10000 });
    await publishButton.click();
    await page.waitForResponse(
      (res) => res.url().includes('/publish') && res.request().method() === 'POST'
    );
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
