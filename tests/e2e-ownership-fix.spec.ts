/**
 * E2E Tests: Ownership check fix (403 → 404)
 *
 * Verifies that accessing a chatbot you don't own returns 404 (not 403),
 * and accessing your own chatbot works normally.
 *
 * Context: The chatbots RLS "Public can read published chatbots" policy
 * caused getChatbot() to return published chatbots owned by other users,
 * which then failed the ownership check with 403. Fixed to return 404.
 */

import { test, expect } from '@playwright/test';

// E2E test user owns this chatbot
const OWN_CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
// This chatbot is owned by a different user (wcooke83@gmail.com) and is published
const OTHER_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';
// Non-existent chatbot
const FAKE_CHATBOT_ID = '00000000-0000-0000-0000-000000000000';

test.describe('Ownership Check Fix (403 → 404)', () => {

  // ── Own chatbot: should succeed ──

  test('OWN-001: GET own chatbot returns 200', async ({ request }) => {
    const res = await request.get(`/api/chatbots/${OWN_CHATBOT_ID}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data?.chatbot?.id).toBe(OWN_CHATBOT_ID);
  });

  test('OWN-002: GET own chatbot calendar integrations returns 200', async ({ request }) => {
    const res = await request.get(`/api/calendar/integrations?chatbotId=${OWN_CHATBOT_ID}`);
    expect(res.ok()).toBeTruthy();
  });

  test('OWN-003: GET own chatbot calendar setup returns 200', async ({ request }) => {
    const res = await request.get(`/api/calendar/setup?chatbotId=${OWN_CHATBOT_ID}`);
    expect(res.ok()).toBeTruthy();
  });

  // ── Other user's chatbot: should return 404 (not 403) ──

  test('OWN-010: GET other user chatbot returns 404 not 403', async ({ request }) => {
    const res = await request.get(`/api/chatbots/${OTHER_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
    // Must NOT be 403
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

  test('OWN-015: GET other user booking returns 404 not 403', async ({ request }) => {
    // Use a fake booking ID — the ownership check should still not leak 403
    const res = await request.get(`/api/calendar/bookings/${FAKE_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
    expect(res.status()).not.toBe(403);
  });

  // ── Non-existent chatbot: should also return 404 ──

  test('OWN-020: GET non-existent chatbot returns 404', async ({ request }) => {
    const res = await request.get(`/api/chatbots/${FAKE_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
  });

  test('OWN-021: GET non-existent chatbot calendar returns 404', async ({ request }) => {
    const res = await request.get(`/api/calendar/integrations?chatbotId=${FAKE_CHATBOT_ID}`);
    expect(res.status()).toBe(404);
  });

  // ── Dashboard pages: own chatbot loads without console errors ──

  test('OWN-030: Dashboard chatbot page loads for own chatbot', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${OWN_CHATBOT_ID}`);
    await page.waitForLoadState('networkidle');

    // Should not have any 403 responses
    const responses: number[] = [];
    page.on('response', (res) => {
      if (res.url().includes(`/api/chatbots/${OWN_CHATBOT_ID}`)) {
        responses.push(res.status());
      }
    });

    // Reload to capture responses
    await page.reload();
    await page.waitForLoadState('networkidle');

    // No 403s should have occurred
    const forbidden = responses.filter(s => s === 403);
    expect(forbidden.length).toBe(0);
  });

  test('OWN-031: Calendar page loads for own chatbot', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];
    page.on('response', (res) => {
      if (res.url().includes('/api/calendar') || res.url().includes('/api/chatbots')) {
        responses.push({ url: res.url(), status: res.status() });
      }
    });

    await page.goto(`/dashboard/chatbots/${OWN_CHATBOT_ID}/calendar`);
    await page.waitForLoadState('networkidle');

    // No 403s on any API calls
    const forbidden = responses.filter(r => r.status === 403);
    if (forbidden.length > 0) {
      console.log('[OWN-031] 403 responses:', forbidden);
    }
    expect(forbidden.length).toBe(0);

    // Log all captured responses for debugging
    console.log(`[OWN-031] API responses: ${responses.map(r => `${r.status} ${r.url.split('/api/')[1]?.slice(0, 50)}`).join(', ')}`);
  });
});
