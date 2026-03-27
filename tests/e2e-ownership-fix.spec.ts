/**
 * E2E Tests: Ownership check fix (403 -> 404)
 *
 * Verifies that accessing a chatbot you don't own returns 404 (not 403),
 * and accessing your own chatbot works normally via dashboard UI.
 */

import { test, expect } from '@playwright/test';

const OWN_CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const OTHER_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';
const FAKE_CHATBOT_ID = '00000000-0000-0000-0000-000000000000';

test.describe('Ownership Check Fix (403 -> 404)', () => {

  // -- Own chatbot: should load via dashboard --

  test('OWN-001: Own chatbot overview page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${OWN_CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
    // Should show the chatbot name
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('OWN-002: Own chatbot calendar page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${OWN_CHATBOT_ID}/calendar`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });

  // -- Other user's chatbot: API should return 404 (not 403) --

  test('OWN-010: GET other user chatbot returns 404 not 403', async ({ request }) => {
    const res = await request.get(`/api/chatbots/${OTHER_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
    expect(res.status()).not.toBe(403);
  });

  test('OWN-011: GET other user calendar integrations returns 404 not 403', async ({ request }) => {
    const res = await request.get(`/api/calendar/integrations?chatbotId=${OTHER_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
    expect(res.status()).not.toBe(403);
  });

  test('OWN-012: GET other user calendar setup returns 404 not 403', async ({ request }) => {
    const res = await request.get(`/api/calendar/setup?chatbotId=${OTHER_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
    expect(res.status()).not.toBe(403);
  });

  test('OWN-013: PATCH other user chatbot returns 404 not 403', async ({ request }) => {
    const res = await request.patch(`/api/chatbots/${OTHER_CHATBOT_ID}`, {
      data: { name: 'hacked' },
    });
    expect(res.status()).toBe(404);
    expect(res.status()).not.toBe(403);
  });

  test('OWN-014: DELETE other user chatbot returns 404 not 403', async ({ request }) => {
    const res = await request.delete(`/api/chatbots/${OTHER_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
    expect(res.status()).not.toBe(403);
  });

  // -- Non-existent chatbot: should also return 404 --

  test('OWN-020: GET non-existent chatbot returns 404', async ({ request }) => {
    const res = await request.get(`/api/chatbots/${FAKE_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
  });

  // -- Dashboard pages: own chatbot loads without 403 errors --

  test('OWN-030: Dashboard chatbot page loads without 403s', async ({ page }) => {
    const responses: number[] = [];
    page.on('response', (res) => {
      if (res.url().includes(`/api/chatbots/${OWN_CHATBOT_ID}`)) {
        responses.push(res.status());
      }
    });

    await page.goto(`/dashboard/chatbots/${OWN_CHATBOT_ID}`);
    await page.waitForLoadState('networkidle');

    const forbidden = responses.filter(s => s === 403);
    expect(forbidden.length).toBe(0);
  });

  test('OWN-031: Calendar page loads without 403s', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];
    page.on('response', (res) => {
      if (res.url().includes('/api/calendar') || res.url().includes('/api/chatbots')) {
        responses.push({ url: res.url(), status: res.status() });
      }
    });

    await page.goto(`/dashboard/chatbots/${OWN_CHATBOT_ID}/calendar`);
    await page.waitForLoadState('networkidle');

    const forbidden = responses.filter(r => r.status === 403);
    expect(forbidden.length).toBe(0);
  });
});
