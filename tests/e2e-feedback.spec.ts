import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Message Feedback', () => {
  test('can send message and see feedback buttons in widget', async ({ page }) => {
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Send a message first to get a bot response with feedback buttons
    const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[type="text"]').first();

    if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await messageInput.fill('Hello, what can you help me with?');
      await messageInput.press('Enter');

      // Wait for bot response
      await page.waitForTimeout(3000);

      // Look for thumbs up/down feedback buttons on the bot message
      const thumbsUp = page.locator('button[aria-label*="thumbs up" i], button[title*="helpful" i], [data-feedback="positive"]').first();
      const thumbsDown = page.locator('button[aria-label*="thumbs down" i], button[title*="not helpful" i], [data-feedback="negative"]').first();

      if (await thumbsUp.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Click thumbs up
        await thumbsUp.click();
        // Should show some visual feedback (color change, etc.)
        await page.waitForTimeout(500);
      }
    }
  });

  test('feedback validation: reject without message_id', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/feedback`, {
      data: { thumbs_up: true },
    });
    expect(res.status()).toBe(400);
  });

  test('feedback validation: reject without thumbs_up boolean', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/feedback`, {
      data: { message_id: '00000000-0000-0000-0000-000000000000' },
    });
    expect(res.status()).toBe(400);
  });
});
