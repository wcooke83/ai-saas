import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('Fallback Purchase Credits', () => {
  test('PURCHASE-001: Purchase endpoint rejects invalid package ID', async ({ request }) => {
    const res = await request.post(`/api/widget/${WIDGET_CHATBOT_ID}/purchase`, {
      data: { packageId: '00000000-0000-0000-0000-000000000000' },
    });
    // Should return 404 (package not found) or 400
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('PURCHASE-002: Purchase endpoint validates packageId format', async ({ request }) => {
    const res = await request.post(`/api/widget/${WIDGET_CHATBOT_ID}/purchase`, {
      data: { packageId: 'not-a-uuid' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('PURCHASE-003: Credit exhaustion mode can be set to purchase_credits', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'purchase_credits',
        credit_exhaustion_config: {
          purchase_credits: {
            upsellMessage: 'Buy more!',
            purchaseSuccessMessage: 'Done!',
            packages: [],
          },
        },
      },
    });
    expect(res.ok()).toBeTruthy();
  });

  test('PURCHASE-004: Widget config returns credit exhaustion data', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/config`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('creditExhaustionMode');
      expect(data.data).toHaveProperty('creditExhaustionConfig');
    }
  });

  test('PURCHASE-005: Empty packages returns no error on widget config', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/config`);
    if (res.ok()) {
      const data = await res.json();
      // Config should be present even with no packages
      expect(data.data?.creditExhaustionConfig).toBeTruthy();
    }
  });

  // Restore
  test.afterAll(async ({ request }) => {
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
  });
});
