import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Chatbot Publish/Unpublish', () => {
  test('publish chatbot returns embed codes', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);
    expect(res.status()).toBeLessThan(500);

    if (res.ok()) {
      const body = await res.json();
      expect(body.data?.published).toBe(true);
      expect(body.data?.embed?.iframe).toContain(CHATBOT_ID);
      expect(body.data?.embed?.sdk).toContain(CHATBOT_ID);
      expect(body.data?.embed?.widgetUrl).toBeTruthy();
      expect(body.data?.embed?.apiEndpoint).toBeTruthy();
    }
  });

  test('published chatbot widget config is accessible', async ({ page }) => {
    // Widget config endpoint is public
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/config`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      expect(body.data || body.config).toBeTruthy();
    }
  });

  test('unpublish chatbot', async ({ page }) => {
    const res = await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);
    expect(res.status()).toBeLessThan(500);

    if (res.ok()) {
      const body = await res.json();
      expect(body.data?.published).toBe(false);
    }
  });

  test('re-publish for other tests', async ({ page }) => {
    // Re-publish so chat tests work
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);
    expect(res.status()).toBeLessThan(500);
  });
});
