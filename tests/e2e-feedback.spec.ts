import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Message Feedback', () => {
  test('reject feedback without message_id', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/feedback`, {
      data: { thumbs_up: true },
    });
    expect(res.status()).toBe(400);
  });

  test('reject feedback without thumbs_up boolean', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/feedback`, {
      data: { message_id: '00000000-0000-0000-0000-000000000000' },
    });
    expect(res.status()).toBe(400);
  });

  test('reject feedback for non-existent message', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/feedback`, {
      data: { message_id: '00000000-0000-0000-0000-000000000000', thumbs_up: true },
    });
    expect(res.status()).toBe(404);
  });
});
