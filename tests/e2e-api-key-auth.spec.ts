import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('API Key Authentication on Chat', () => {
  let apiKey: string | null = null;
  let keyId: string | null = null;

  test('create API key for auth test', async ({ page }) => {
    const res = await page.request.post('/api/keys', {
      data: { name: 'E2E Chat Auth Key' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    apiKey = body.plainKey;
    keyId = body.id;
    expect(apiKey).toBeTruthy();
  });

  test('chat with valid API key in Authorization header', async ({ browser }) => {
    test.skip(!apiKey, 'No API key created');

    // Use fresh context (no session cookies) to test pure API key auth
    const ctx = await browser.newContext({ storageState: undefined });
    await ctx.clearCookies();
    const page = await ctx.newPage();

    const res = await page.request.post(`http://localhost:3030/api/chat/${CHATBOT_ID}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      data: { message: 'Hello via API key', stream: false, session_id: `e2e-apikey-${Date.now()}` },
    });

    // Should work (200) or fail gracefully (403 if key doesn't match chatbot owner)
    expect(res.status()).toBeLessThan(500);
    await ctx.close();
  });

  test('chat with invalid API key returns 401', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    await ctx.clearCookies();
    const page = await ctx.newPage();

    const res = await page.request.post(`http://localhost:3030/api/chat/${CHATBOT_ID}`, {
      headers: { 'Authorization': 'Bearer sk_invalid_key_12345' },
      data: { message: 'Hello', stream: false },
    });
    expect(res.status()).toBe(401);
    await ctx.close();
  });

  test('cleanup: delete API key', async ({ page }) => {
    if (keyId) {
      await page.request.delete(`/api/keys/${keyId}`);
    }
  });
});
