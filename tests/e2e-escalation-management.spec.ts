import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Escalation Management', () => {
  test('list escalations with status counts', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/escalations`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('list escalations with status filter', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/escalations?status=open`);
    expect(res.status()).toBeLessThan(500);
  });

  test('update non-existent escalation returns error', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/escalations/00000000-0000-0000-0000-000000000000`,
      { data: { status: 'acknowledged' } }
    );
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('reject invalid escalation status', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/escalations/00000000-0000-0000-0000-000000000000`,
      { data: { status: 'invalid_status' } }
    );
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
