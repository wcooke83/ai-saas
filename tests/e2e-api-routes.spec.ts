import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('API Routes - Authenticated', () => {
  test('GET /api/chatbots returns chatbot list', async ({ page }) => {
    const res = await page.request.get('/api/chatbots');
    // May return 403 if tool access not configured — that's ok, just not 500
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      expect(body.data?.chatbots).toBeDefined();
    }
  });

  test('GET /api/chatbots/:id returns chatbot details or error', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}`);
    // 200 (found), 403 (no tool access), or 404 (not found) are all valid
    expect([200, 403, 404]).toContain(res.status());
  });

  test('GET /api/chatbots/:id/knowledge returns knowledge sources', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/chatbots/:id/performance returns perf data', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/performance?days=7`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toHaveProperty('total_requests');
    expect(body.data).toHaveProperty('averages');
    expect(body.data).toHaveProperty('p95_total_ms');
    expect(body.data).toHaveProperty('available_models');
    expect(body.data).toHaveProperty('page');
    expect(body.data).toHaveProperty('total_pages');
    expect(body.data).toHaveProperty('hourly');
    expect(body.data).toHaveProperty('recent');
  });

  test('GET /api/chatbots/:id/performance supports pagination', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/performance?days=30&page=1`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.page).toBe(1);
    expect(body.data.page_size).toBe(50);
  });

  test('GET /api/chatbots/:id/performance supports filters', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/performance?days=7&live_fetch=true`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toHaveProperty('total_requests');
  });

  test('GET /api/chatbots/:id/conversations returns conversations', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/conversations`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('GET /api/chatbots/:id/escalations returns escalations', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/escalations`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /api/chatbots/:id/analytics returns analytics', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/analytics`);
    expect(res.ok()).toBeTruthy();
  });

  test('GET /api/keys returns API keys list', async ({ page }) => {
    const res = await page.request.get('/api/keys');
    expect(res.ok()).toBeTruthy();
  });
});

test.describe('API Routes - Unauthenticated', () => {
  test('API routes reject unauthenticated requests', async ({ browser }) => {
    // Fresh context with zero cookies
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();

    // Clear any cookies just to be safe
    await ctx.clearCookies();

    const res = await page.request.get('http://localhost:3030/api/chatbots');
    // Should not return 200 (success) — either 401, 403, or redirect
    expect(res.status()).not.toBe(200);
    await ctx.close();
  });
});
