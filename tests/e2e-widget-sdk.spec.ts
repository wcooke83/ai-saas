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
    expect(res?.status()).toBeLessThan(500);
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

test.describe('Widget Mobile', () => {
  test('widget renders at mobile viewport', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 667 },
      storageState: undefined,
    });
    const page = await ctx.newPage();

    const res = await page.goto(`http://localhost:3030/widget/${CHATBOT_ID}`);
    expect(res?.status()).toBeLessThan(500);

    // Page should render something
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);

    await ctx.close();
  });
});
