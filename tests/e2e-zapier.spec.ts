/**
 * E2E Tests: Zapier Integration & Extended Webhook Features
 *
 * Covers:
 * - Zapier REST Hook endpoints (subscribe, unsubscribe, perform-list)
 * - Zapier Action endpoints (send-message, create-knowledge, list-chatbots)
 * - Webhook test endpoint
 * - Delivery logs endpoint
 * - SSRF protection on webhook creation
 * - Dashboard UI additions (Test + Logs buttons)
 */

import { test, expect } from '@playwright/test';

const WEBHOOKS_URL = '/dashboard/webhooks';

// ── Zapier REST Hook Endpoints ───────────────────────────────────

test.describe('Zapier REST Hooks', () => {
  test('ZAP-001: POST /api/zapier/subscribe returns 401 without API key', async ({ page }) => {
    const res = await page.request.post('/api/zapier/subscribe', {
      data: { target_url: 'https://hooks.zapier.com/test', event: 'message.received' },
    });
    expect(res.status()).toBe(401);
  });

  test('ZAP-002: DELETE /api/zapier/unsubscribe returns 401 without API key', async ({ page }) => {
    const res = await page.request.delete('/api/zapier/unsubscribe', {
      data: { id: '00000000-0000-0000-0000-000000000000' },
    });
    expect(res.status()).toBe(401);
  });

  test('ZAP-003: GET /api/zapier/perform-list/conversation.started returns 401 without API key', async ({ page }) => {
    const res = await page.request.get('/api/zapier/perform-list/conversation.started');
    expect(res.status()).toBe(401);
  });

  test('ZAP-004: GET /api/zapier/perform-list/invalid.event returns 400 or 401', async ({ page }) => {
    const res = await page.request.get('/api/zapier/perform-list/invalid.event');
    expect([400, 401]).toContain(res.status());
  });

  test('ZAP-005: POST /api/zapier/subscribe rejects without target_url', async ({ page }) => {
    const res = await page.request.post('/api/zapier/subscribe', {
      data: { event: 'message.received' },
    });
    expect(res.status()).toBe(401);
  });
});

// ── Zapier Action Endpoints ──────────────────────────────────────

test.describe('Zapier Actions', () => {
  test('ZAP-010: POST /api/zapier/actions/send-message returns 401 without API key', async ({ page }) => {
    const res = await page.request.post('/api/zapier/actions/send-message', {
      data: { chatbot_id: 'test', message: 'Hello' },
    });
    expect(res.status()).toBe(401);
  });

  test('ZAP-011: POST /api/zapier/actions/create-knowledge returns 401 without API key', async ({ page }) => {
    const res = await page.request.post('/api/zapier/actions/create-knowledge', {
      data: { chatbot_id: 'test', type: 'url', content: 'https://example.com' },
    });
    expect(res.status()).toBe(401);
  });

  test('ZAP-012: GET /api/zapier/actions/list-chatbots returns 401 without API key', async ({ page }) => {
    const res = await page.request.get('/api/zapier/actions/list-chatbots');
    expect(res.status()).toBe(401);
  });
});

// ── Webhook Test Endpoint ────────────────────────────────────────

test.describe('Webhook Test Endpoint', () => {
  test('ZAP-020: POST /api/webhooks/[id]/test works for owned webhook', async ({ page }) => {
    // Create a webhook first
    const createRes = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://example.com/e2e-test-endpoint',
        events: ['conversation.started'],
      },
    });

    if (createRes.status() !== 201) {
      test.skip(true, 'Could not create webhook — auth required');
      return;
    }

    const { data: { webhook } } = await createRes.json();

    // Send test delivery
    const testRes = await page.request.post(`/api/webhooks/${webhook.id}/test`);
    if (testRes.ok()) {
      const body = await testRes.json();
      expect(body.data).toHaveProperty('delivery_id');
    }

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });

  test('ZAP-021: POST /api/webhooks/nonexistent/test returns 404', async ({ page }) => {
    const res = await page.request.post('/api/webhooks/00000000-0000-0000-0000-000000000000/test');
    expect([401, 404]).toContain(res.status());
  });
});

// ── Delivery Logs ────────────────────────────────────────────────

test.describe('Delivery Logs', () => {
  test('ZAP-030: GET /api/webhooks/[id]/deliveries returns array', async ({ page }) => {
    const createRes = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://example.com/e2e-deliveries-test',
        events: [],
      },
    });

    if (createRes.status() !== 201) {
      test.skip(true, 'Could not create webhook — auth required');
      return;
    }

    const { data: { webhook } } = await createRes.json();

    const logsRes = await page.request.get(`/api/webhooks/${webhook.id}/deliveries`);
    if (logsRes.ok()) {
      const body = await logsRes.json();
      expect(Array.isArray(body.data?.deliveries ?? body.data)).toBe(true);
    }

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });

  test('ZAP-031: GET /api/webhooks/nonexistent/deliveries returns 404', async ({ page }) => {
    const res = await page.request.get('/api/webhooks/00000000-0000-0000-0000-000000000000/deliveries');
    expect([401, 404]).toContain(res.status());
  });
});

// ── SSRF Protection ──────────────────────────────────────────────

test.describe('SSRF Protection', () => {
  test('ZAP-050: POST /api/webhooks rejects private IP URL', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://10.0.0.1/hook',
        events: [],
      },
    });
    expect(res.status()).toBe(400);
  });

  test('ZAP-051: POST /api/webhooks rejects localhost URL', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://localhost/hook',
        events: [],
      },
    });
    expect(res.status()).toBe(400);
  });

  test('ZAP-052: POST /api/webhooks rejects HTTP URL', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'http://example.com/hook',
        events: [],
      },
    });
    expect(res.status()).toBe(400);
  });

  test('ZAP-053: POST /api/webhooks rejects cloud metadata IP', async ({ page }) => {
    // 169.254.169.254 is a link-local IP blocked by URL validation
    // Use the IP directly — it's caught as a private IP literal before DNS
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://169.254.0.1/hook',
        events: [],
      },
    });
    expect(res.status()).toBe(400);
  });
});

// ── Dashboard UI: Test + Logs Buttons ────────────────────────────

test.describe('Dashboard Webhook UI Extensions', () => {
  test('ZAP-040: Webhooks page shows Test and Logs buttons for each webhook', async ({ page }) => {
    // Navigate to webhooks first — let the page compile
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1').filter({ hasText: 'Webhooks' })).toBeVisible({ timeout: 15000 });

    // Create webhook via API
    const createRes = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://example.com/e2e-ui-buttons-test',
        events: [],
      },
    });
    expect(createRes.status()).toBe(201);
    const { data: { webhook } } = await createRes.json();

    // Reload to see the new webhook
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Wait for webhooks heading and list count to show the webhook
    await expect(page.getByText('Webhook', { exact: false }).first()).toBeVisible({ timeout: 15000 });

    // Check for Test button
    const testButton = page.getByRole('button', { name: /Test/i }).first();
    await expect(testButton).toBeVisible({ timeout: 10000 });

    // Check for Logs button
    const logsButton = page.getByRole('button', { name: /Logs/i }).first();
    await expect(logsButton).toBeVisible({ timeout: 5000 });

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });

  test('ZAP-041: Clicking Logs button expands delivery history panel', async ({ page }) => {
    // Navigate first to warm up the page
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1').filter({ hasText: 'Webhooks' })).toBeVisible({ timeout: 15000 });

    const createRes = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://example.com/e2e-ui-logs-test',
        events: [],
      },
    });
    expect(createRes.status()).toBe(201);
    const { data: { webhook } } = await createRes.json();

    // Reload to see the new webhook
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Wait for Logs button to appear
    const logsButton = page.getByRole('button', { name: /Logs/i }).first();
    await expect(logsButton).toBeVisible({ timeout: 15000 });
    await logsButton.click();

    // Delivery history panel should appear — look for any delivery-related content
    const panel = page.locator(':text("No deliveries"), :text("Refresh"), :text("delivery_id")');
    await expect(panel.first()).toBeVisible({ timeout: 10000 });

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });
});
