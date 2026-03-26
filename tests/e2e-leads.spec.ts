import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SESSION_ID = `e2e-lead-${Date.now()}`;

test.describe('Lead Capture', () => {
  test('submit pre-chat form lead', async ({ page }) => {
    // Widget lead endpoint is public (no auth)
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/leads`, {
      data: {
        session_id: SESSION_ID,
        form_data: { name: 'E2E Test User', email: 'e2e@test.local', company: 'Test Corp' },
      },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data?.lead_id).toBeTruthy();
  });

  test('reject lead without form_data', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/leads`, {
      data: { session_id: 'no-form' },
    });
    expect(res.status()).toBe(400);
  });

  test('retrieve leads via authenticated API', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/leads`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const body = await res.json();
      expect(body.data).toBeDefined();
    }
  });
});
