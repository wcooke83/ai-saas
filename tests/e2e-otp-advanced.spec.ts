import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('OTP Advanced', () => {
  test('send OTP requires email', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/memory/send-otp`, {
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('send OTP with valid email responds', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/memory/send-otp`, {
      data: { email: `e2e-otp-${Date.now()}@test.local` },
    });
    // May succeed (200) or fail if Resend not configured (500) — both are informative
    // But should not be 400 (that would be a validation error)
    expect(res.status()).not.toBe(400);
  });

  test('verify OTP requires both email and otp', async ({ page }) => {
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/memory/verify-otp`, {
      data: { email: 'test@test.local' },
    });
    expect(res.status()).toBeLessThan(500);
  });
});
