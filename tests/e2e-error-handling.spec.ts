import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const FAKE_ID = '00000000-0000-0000-0000-000000000000';

test.describe('Error Handling & Edge Cases', () => {
  test('invalid chatbot ID returns 404 on API', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${FAKE_ID}`);
    expect([404, 403]).toContain(res.status());
  });

  test('invalid chatbot ID on knowledge returns error', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${FAKE_ID}/knowledge`);
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('invalid chatbot ID on performance returns error', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${FAKE_ID}/performance`);
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('malformed JSON body returns 400', async ({ page }) => {
    const res = await page.request.post(`/api/chat/${CHATBOT_ID}`, {
      headers: { 'Content-Type': 'application/json' },
      data: 'not-json{{{',
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('non-existent page returns 404', async ({ page }) => {
    const response = await page.goto('/dashboard/nonexistent-page');
    expect(response?.status()).toBe(404);
  });

  test('report message endpoint works', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/report`, {
      data: {
        message_id: FAKE_ID,
        reason: 'test_report',
        session_id: 'e2e-report',
      },
    });
    // May be 404 (message not found) or 201 — just not 500
    expect(res.status()).toBeLessThan(500);
  });
});
