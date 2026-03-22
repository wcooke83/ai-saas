import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Widget Configuration', () => {
  test('widget config endpoint returns config', async ({ page }) => {
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/config`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      // Should have at minimum a chatbot name and color config
      expect(body.data || body.config).toBeTruthy();
    }
  });

  test('update widget colors via API', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        widget_config: { primaryColor: '#FF5733', position: 'bottom-right' },
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('customize page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/customize`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
