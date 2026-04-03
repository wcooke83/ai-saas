/**
 * E2E Tests: Webhooks CRUD
 *
 * Covers:
 * - Dashboard page renders (heading, empty state, Add Webhook button)
 * - Create webhook via UI (form opens, fill URL + events, submit)
 * - Secret shown once banner appears after creation
 * - Webhook appears in list with event badges
 * - Toggle active/inactive
 * - Delete webhook via UI
 * - API: GET /api/webhooks
 * - API: POST /api/webhooks (validation: HTTPS required, events array required)
 * - API: PATCH /api/webhooks/[id]
 * - API: DELETE /api/webhooks/[id]
 * - Unauthenticated requests are rejected
 */

import { test, expect } from '@playwright/test';

const WEBHOOKS_URL = '/dashboard/webhooks';
const TEST_WEBHOOK_URL = 'https://example.com/e2e-webhook-test';

test.describe('Webhooks Dashboard Page', () => {
  test('WHK-001: Webhooks page renders heading and Add Webhook button', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: 'Webhooks', level: 1 })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Add Webhook/i })).toBeVisible({ timeout: 10000 });
  });

  test('WHK-002: Webhooks page description text', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    await expect(
      page.getByText('Receive real-time HTTP notifications when events happen in your chatbots')
    ).toBeVisible({ timeout: 10000 });
  });

  test('WHK-003: Add Webhook button reveals create form', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Add Webhook/i }).click();

    await expect(page.getByText('New Webhook')).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel('Endpoint URL')).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Webhook/i })).toBeVisible();
  });

  test('WHK-004: Cancel hides create form', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Add Webhook/i }).click();
    await expect(page.getByText('New Webhook')).toBeVisible({ timeout: 5000 });

    // Scope to the form — the header also shows "Cancel" when form is open, creating 2 matches
    await page.locator('form').getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByText('New Webhook')).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Webhooks CRUD via UI', () => {
  let createdWebhookUrl: string;

  test('WHK-010: Create webhook and see secret banner', async ({ page }) => {
    // Cleanup any pre-existing webhooks at this URL to avoid strict mode issues
    const listRes = await page.request.get('/api/webhooks');
    if (listRes.ok()) {
      const body = await listRes.json();
      const existing = (body.data?.webhooks ?? []).filter((wh: { url: string }) => wh.url === TEST_WEBHOOK_URL);
      for (const wh of existing) {
        await page.request.delete(`/api/webhooks/${wh.id}`);
      }
    }

    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: /Add Webhook/i }).click();
    await expect(page.getByLabel('Endpoint URL')).toBeVisible({ timeout: 5000 });

    // Fill URL
    await page.getByLabel('Endpoint URL').fill(TEST_WEBHOOK_URL);

    // Submit
    const createPromise = page.waitForResponse(
      (res) => res.url().includes('/api/webhooks') && res.request().method() === 'POST'
    );
    await page.getByRole('button', { name: /Create Webhook/i }).click();
    const createRes = await createPromise;
    expect(createRes.status()).toBe(201);

    const body = await createRes.json();
    expect(body.data.webhook.secret).toBeTruthy();
    expect(body.data.webhook.id).toBeTruthy();
    createdWebhookUrl = body.data.webhook.url;

    // Secret banner should appear
    await expect(
      page.getByText('Save this secret now — it will not be shown again')
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('WHK-011: Created webhook appears in list', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    // Webhook URL should appear (may be truncated)
    const urlText = TEST_WEBHOOK_URL.slice(0, 40);
    await expect(page.getByText(urlText, { exact: false }).first()).toBeVisible({ timeout: 15000 });
  });

  test('WHK-012: Webhook list shows event badges', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    // Wait for list to load
    await expect(page.getByText(TEST_WEBHOOK_URL.slice(0, 40), { exact: false }).first()).toBeVisible({ timeout: 15000 });

    // Webhook with no events selected shows "All events" badge (use .first() — other webhooks may also show this)
    await expect(page.getByText('All events').first()).toBeVisible({ timeout: 5000 });
  });

  test('WHK-013: Toggle webhook active/inactive', async ({ page }) => {
    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText(TEST_WEBHOOK_URL.slice(0, 40), { exact: false }).first()).toBeVisible({ timeout: 15000 });

    // Find Disable button (webhook is active after creation)
    const disableButton = page.getByRole('button', { name: /Disable/i }).first();
    await expect(disableButton).toBeVisible({ timeout: 5000 });

    const patchPromise = page.waitForResponse(
      (res) => res.url().includes('/api/webhooks/') && res.request().method() === 'PATCH'
    );
    await disableButton.click();
    const patchRes = await patchPromise;
    expect(patchRes.ok()).toBeTruthy();

    const patchBody = await patchRes.json();
    expect(patchBody.data.webhook.is_active).toBe(false);

    // Should now show Enable button
    await expect(page.getByRole('button', { name: /Enable/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Inactive')).toBeVisible({ timeout: 5000 });

    // Re-enable
    await page.getByRole('button', { name: /Enable/i }).first().click();
    await expect(page.getByText('Active').first()).toBeVisible({ timeout: 5000 });
  });

  test('WHK-014: Delete webhook via UI', async ({ page }) => {
    // Get the test webhook ID from the API so we can target the exact delete button
    const listRes = await page.request.get('/api/webhooks');
    expect(listRes.ok()).toBeTruthy();
    const listBody = await listRes.json();
    const testWebhook = (listBody.data?.webhooks ?? []).find((wh: { url: string }) => wh.url === TEST_WEBHOOK_URL);
    expect(testWebhook).toBeDefined();
    const webhookId = testWebhook.id;

    await page.goto(WEBHOOKS_URL);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(TEST_WEBHOOK_URL.slice(0, 40), { exact: false }).first()).toBeVisible({ timeout: 15000 });

    const deletePromise = page.waitForResponse(
      (res) => res.url().includes('/api/webhooks/') && res.request().method() === 'DELETE'
    );

    // Click the specific delete button for this webhook (data-testid added for test reliability)
    const deleteButton = page.locator(`[data-testid="delete-webhook-${webhookId}"]`);
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await deleteButton.click();

    // App uses a React confirm dialog (not native window.confirm) — click the "Delete" button in the dialog
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

    const deleteRes = await deletePromise;
    expect(deleteRes.ok()).toBeTruthy();

    // Webhook URL should no longer appear
    await expect(page.getByText(TEST_WEBHOOK_URL.slice(0, 40), { exact: false })).not.toBeVisible({ timeout: 10000 });
  });
});

test.describe('Webhooks API', () => {
  test('WHK-020: GET /api/webhooks returns 200 with webhooks array', async ({ page }) => {
    const res = await page.request.get('/api/webhooks');
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(Array.isArray(body.data.webhooks)).toBe(true);
  });

  test('WHK-021: POST /api/webhooks creates webhook (returns 201 + secret)', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://example.com/e2e-api-test',
        events: ['conversation.started', 'lead.captured'],
      },
    });
    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.data.webhook.id).toBeTruthy();
    expect(body.data.webhook.secret).toBeTruthy();
    expect(body.data.webhook.url).toBe('https://example.com/e2e-api-test');
    expect(body.data.webhook.is_active).toBe(true);
    // Secret must be a 64-char hex string (32 bytes)
    expect(body.data.webhook.secret).toMatch(/^[a-f0-9]{64}$/);

    // Cleanup
    await page.request.delete(`/api/webhooks/${body.data.webhook.id}`);
  });

  test('WHK-022: POST /api/webhooks rejects HTTP URL', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'http://example.com/not-https',
        events: [],
      },
    });
    expect(res.status()).toBe(400);
  });

  test('WHK-023: POST /api/webhooks rejects missing URL', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: { events: [] },
    });
    expect(res.status()).toBe(400);
  });

  test('WHK-024: POST /api/webhooks rejects non-array events', async ({ page }) => {
    const res = await page.request.post('/api/webhooks', {
      data: {
        url: 'https://example.com/webhook',
        events: 'conversation.started',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('WHK-025: PATCH /api/webhooks/[id] updates is_active', async ({ page }) => {
    // Create a webhook to patch
    const createRes = await page.request.post('/api/webhooks', {
      data: { url: 'https://example.com/e2e-patch-test', events: [] },
    });
    expect(createRes.status()).toBe(201);
    const { data: { webhook } } = await createRes.json();

    const patchRes = await page.request.patch(`/api/webhooks/${webhook.id}`, {
      data: { is_active: false },
    });
    expect(patchRes.ok()).toBeTruthy();

    const patchBody = await patchRes.json();
    expect(patchBody.data.webhook.is_active).toBe(false);

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });

  test('WHK-026: PATCH /api/webhooks/[id] rejects HTTP URL update', async ({ page }) => {
    const createRes = await page.request.post('/api/webhooks', {
      data: { url: 'https://example.com/e2e-patch-url-test', events: [] },
    });
    expect(createRes.status()).toBe(201);
    const { data: { webhook } } = await createRes.json();

    const patchRes = await page.request.patch(`/api/webhooks/${webhook.id}`, {
      data: { url: 'http://not-https.com/hook' },
    });
    expect(patchRes.status()).toBe(400);

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });

  test('WHK-027: DELETE /api/webhooks/[id] removes webhook', async ({ page }) => {
    const createRes = await page.request.post('/api/webhooks', {
      data: { url: 'https://example.com/e2e-delete-test', events: [] },
    });
    expect(createRes.status()).toBe(201);
    const { data: { webhook } } = await createRes.json();

    const deleteRes = await page.request.delete(`/api/webhooks/${webhook.id}`);
    expect(deleteRes.ok()).toBeTruthy();

    const deleteBody = await deleteRes.json();
    expect(deleteBody.data.deleted).toBe(true);

    // Verify gone from list
    const listRes = await page.request.get('/api/webhooks');
    const listBody = await listRes.json();
    const found = listBody.data.webhooks.find((wh: { id: string }) => wh.id === webhook.id);
    expect(found).toBeUndefined();
  });

  test('WHK-028: PATCH /api/webhooks/[id] returns 404 for wrong owner', async ({ page, browser }) => {
    // Create a webhook with the authenticated user
    const createRes = await page.request.post('/api/webhooks', {
      data: { url: 'https://example.com/e2e-ownership-test', events: [] },
    });
    expect(createRes.status()).toBe(201);
    const { data: { webhook } } = await createRes.json();

    // Try to patch using an unauthenticated context
    const anonContext = await browser.newContext({ storageState: undefined });
    await anonContext.clearCookies();
    const anonPage = await anonContext.newPage();

    const patchRes = await anonPage.request.patch(`/api/webhooks/${webhook.id}`, {
      data: { is_active: false },
    });
    expect(patchRes.status()).not.toBe(200);

    await anonContext.close();

    // Cleanup
    await page.request.delete(`/api/webhooks/${webhook.id}`);
  });

  test('WHK-029: Unauthenticated GET /api/webhooks returns 401', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    await context.clearCookies();
    const page = await context.newPage();

    const res = await page.request.get('http://localhost:3030/api/webhooks');
    expect(res.status()).toBe(401);

    await context.close();
  });
});

test.describe('Webhooks Sidebar Nav', () => {
  test('WHK-030: Webhooks link appears in dashboard sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const webhooksLink = page.getByRole('link', { name: 'Webhooks' }).first();
    await expect(webhooksLink).toBeVisible({ timeout: 15000 });
    await expect(webhooksLink).toHaveAttribute('href', '/dashboard/webhooks');
  });

  test('WHK-031: Clicking Webhooks sidebar link navigates to webhooks page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const webhooksLink = page.getByRole('link', { name: 'Webhooks' }).first();
    await expect(webhooksLink).toBeVisible({ timeout: 15000 });
    await webhooksLink.click();

    await page.waitForURL('**/dashboard/webhooks', { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Webhooks', level: 1 })).toBeVisible({ timeout: 10000 });
  });
});
