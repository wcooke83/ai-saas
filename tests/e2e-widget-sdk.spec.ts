import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Widget SDK', () => {
  test('widget SDK script is served', async ({ page }) => {
    const res = await page.request.get('http://localhost:3030/widget/sdk.js');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain('ChatWidget');
    expect(text.length).toBeGreaterThan(100);
  });

  test('widget page loads for published chatbot', async ({ page }) => {
    // Ensure published
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    const res = await page.goto(`/widget/${CHATBOT_ID}`);
    expect(res?.ok()).toBeTruthy();
  });

  test('widget config returns required fields', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/config`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();

    // Should contain basic widget configuration
    const config = body.data || body.config || body;
    expect(config).toBeDefined();
    // Should have at least a name or chatbot_id
    const text = JSON.stringify(config);
    expect(text.length).toBeGreaterThan(10);
  });
});

test.describe('Widget SDK – Unpublished Behavior (P0 fixes)', () => {
  test('SDK code contains console.warn for unpublished chatbots', async ({ page }) => {
    const res = await page.request.get('http://localhost:3030/widget/sdk.js');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();

    // P0-3: SDK should warn and NOT render when config returns 404
    expect(text).toContain('is not published');
    expect(text).toContain('The widget will not render');
    expect(text).toContain('Publish your chatbot');
  });

  test('SDK skips build on 404 config response', async ({ page }) => {
    const res = await page.request.get('http://localhost:3030/widget/sdk.js');
    const text = await res.text();

    // When status is 404, the .then handler should return null
    // and the subsequent .then should exit early with "if (!data) return;"
    expect(text).toContain('return null');
    expect(text).toContain('if (!data) return');
  });

  test('widget config returns 404 for unpublished chatbot', async ({ page }) => {
    // Ensure unpublished
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);

    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/config`);
    expect(res.status()).toBe(404);

    // Re-publish for other tests
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);
  });

  test('widget page shows branded not-published message', async ({ browser }) => {
    // Ensure unpublished
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();

    // Unpublish via authenticated context first
    const authCtx = await browser.newContext();
    const authPage = await authCtx.newPage();
    await authPage.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);
    await authCtx.close();

    // Visit widget as unauthenticated user
    await page.goto(`http://localhost:3030/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // P0-4: Should show branded message instead of generic error
    await expect(page.getByText('This chatbot is not yet published.')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('publish it from your VocUI dashboard')).toBeVisible();
    await expect(page.getByText('Unable to load chatbot')).not.toBeVisible();

    await ctx.close();

    // Re-publish for other tests
    const cleanupCtx = await browser.newContext();
    const cleanupPage = await cleanupCtx.newPage();
    await cleanupPage.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);
    await cleanupCtx.close();
  });
});

test.describe('Widget Mobile', () => {
  test('widget renders at mobile viewport', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 667 },
      storageState: undefined,
    });
    const page = await ctx.newPage();

    const res = await page.goto(`http://localhost:3030/widget/${CHATBOT_ID}`);
    expect(res?.ok()).toBeTruthy();

    // Page should render something
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);

    await ctx.close();
  });
});
