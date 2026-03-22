import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Agent Actions', () => {
  test('agent actions requires authentication', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    await ctx.clearCookies();
    const page = await ctx.newPage();

    const res = await page.request.post(`http://localhost:3030/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000000',
        action: 'take_over',
      },
    });
    expect(res.status()).toBe(401);
    await ctx.close();
  });

  test('agent reply requires authentication', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    await ctx.clearCookies();
    const page = await ctx.newPage();

    const res = await page.request.post(`http://localhost:3030/api/widget/${CHATBOT_ID}/agent-reply`, {
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000000',
        content: 'Test reply',
      },
    });
    expect(res.status()).toBe(401);
    await ctx.close();
  });

  test('agent actions validates required fields', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('agent actions validates action type', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/agent-actions`, {
      data: {
        conversation_id: '00000000-0000-0000-0000-000000000000',
        action: 'invalid_action',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('agent reply validates required fields', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/agent-reply`, {
      data: {},
    });
    expect(res.status()).toBe(400);
  });
});
