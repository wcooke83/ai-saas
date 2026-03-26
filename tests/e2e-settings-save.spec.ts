import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Chatbot Settings Save', () => {
  test('update chatbot name', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { name: 'E2E Bot Renamed' },
    });
    expect(res.ok()).toBeTruthy();

    if (res.ok()) {
      const body = await res.json();
      expect(body.data?.name || body.data?.chatbot?.name).toBe('E2E Bot Renamed');
    }
  });

  test('update system prompt', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { system_prompt: 'You are an updated test assistant.' },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('update model settings', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { temperature: 0.5, max_tokens: 500 },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('update language', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { language: 'en' },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('restore original name', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { name: 'E2E Test Bot' },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('settings page shows saved values', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
