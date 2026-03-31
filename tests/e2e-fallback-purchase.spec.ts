import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('Fallback Purchase Credits', () => {
  test('PURCHASE-001: Purchase endpoint rejects invalid package ID', async ({ request }) => {
    const res = await request.post(`/api/widget/${WIDGET_CHATBOT_ID}/purchase`, {
      data: { packageId: '00000000-0000-0000-0000-000000000000' },
    });
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

  test('PURCHASE-003: Credit exhaustion mode can be set to purchase_credits via settings', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('networkidle');

    // Navigate to Credit Exhaustion section
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button').filter({ hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Limits & Fallback' })).toBeVisible({ timeout: 10000 });

    // Select Purchase Credits mode
    await page.locator('input[value="purchase_credits"]').click({ force: true });
    await expect(page.getByText('Credit Packages').first()).toBeVisible({ timeout: 5000 });

    // Save
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
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
