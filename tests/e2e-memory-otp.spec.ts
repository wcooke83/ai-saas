import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Email Memory & OTP', () => {
  test('check email existence returns result', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/memory/check`, {
      data: { email: 'nonexistent@test.local' },
    });
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      expect(typeof body.exists === 'boolean' || body.success !== undefined).toBeTruthy();
    }
  });

  test('verify OTP with wrong code fails', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/memory/verify-otp`, {
      data: { email: 'test@test.local', otp: '000000' },
    });
    // Should reject — either 400 or 401 or specific error
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      expect(body.success).toBe(false);
    }
  });
});
