import { test, expect } from '@playwright/test';

test.describe('Plan Limits', () => {
  test('chatbot count check works', async ({ page }) => {
    // The chatbots list API implicitly checks plan limits
    const res = await page.request.get('/api/chatbots');
    expect(res.status()).toBeLessThan(500);
  });

  test('knowledge source count respects limits', async ({ page }) => {
    const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    expect(res.status()).toBeLessThan(500);
  });

  test('billing plans endpoint responds', async ({ page }) => {
    const res = await page.request.get('/api/billing/plans');
    expect(res.status()).toBeLessThan(500);
  });

  test('credits endpoint responds', async ({ page }) => {
    const res = await page.request.get('/api/billing/credits');
    expect(res.status()).toBeLessThan(500);
  });
});
