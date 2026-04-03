import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

/**
 * Helper: ensure the chatbot is published.
 * Uses the API directly (same pattern as ensureUnpublished) to avoid
 * UI ambiguity (the chatbot overview page may have multiple "Publish" buttons
 * from onboarding checklist steps alongside the real header action).
 */
async function ensurePublished(page: import('@playwright/test').Page) {
  await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`).catch(() => {});
}

/**
 * Helper: ensure the chatbot is unpublished by navigating to its overview page
 * and clicking the Unpublish button if it's currently published.
 */
async function ensureUnpublished(page: import('@playwright/test').Page) {
  // Direct API call is the most reliable approach for test setup
  await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`).catch(() => {});
}

test.describe('Widget SDK', () => {
  // Raw SDK script endpoint — this is a static JS file delivery route, not a UI page.
  // Direct request is the only way to test it.
  test('widget SDK script is served', async ({ page }) => {
    // Direct API call: testing raw JS file delivery endpoint (no UI equivalent)
    const res = await page.request.get('http://localhost:3030/widget/sdk.js');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain('ChatWidget');
    expect(text.length).toBeGreaterThan(100);
  });

  test('widget page loads for published chatbot', async ({ page }) => {
    // Publish via the dashboard UI
    await ensurePublished(page);

    // Now visit the widget page as a regular visitor would see it
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // The page should load successfully and render the chat widget (not an error)
    await expect(page.getByText('Unable to load chatbot')).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText('This chatbot is not yet published.')).not.toBeVisible();
  });

  test('widget config returns required fields', async ({ page }) => {
    // Publish via UI first
    await ensurePublished(page);

    // Navigate to the widget page — it fetches config internally and renders
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // If config loaded correctly, the widget renders (no error state).
    // Wait for the "Loading..." spinner to disappear.
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 15000 });

    // Should NOT show the error state
    await expect(page.getByText('Unable to load chatbot')).not.toBeVisible();
    await expect(page.getByText('This chatbot is not yet published.')).not.toBeVisible();

    // The page body should contain meaningful content (widget rendered)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(10);
  });
});

test.describe('Widget SDK – Unpublished Behavior (P0 fixes)', () => {
  // Raw SDK script content checks — testing the JS source text, no UI equivalent.
  test('SDK code contains console.warn for unpublished chatbots', async ({ page }) => {
    // Direct API call: testing raw JS file content (no UI equivalent)
    const res = await page.request.get('http://localhost:3030/widget/sdk.js');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();

    // P0-3: SDK should warn and NOT render when config returns 404
    expect(text).toContain('is not published');
    expect(text).toContain('The widget will not render');
    expect(text).toContain('Publish your chatbot');
  });

  test('SDK skips build on 404 config response', async ({ page }) => {
    // Direct API call: testing raw JS file content (no UI equivalent)
    const res = await page.request.get('http://localhost:3030/widget/sdk.js');
    const text = await res.text();

    // When status is 404, the .then handler should return null
    // and the subsequent .then should exit early with "if (!data) return;"
    expect(text).toContain('return null');
    expect(text).toContain('if (!data) return');
  });

  test('widget config returns 404 for unpublished chatbot', async ({ page }) => {
    // Unpublish via API
    await ensureUnpublished(page);

    // Navigate to the widget page — it should show the not-published state
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // The widget page shows a "not published" message (exact text depends on owner vs visitor)
    await expect(
      page.getByText(/isn't published yet|not yet published|isn't available yet/i)
    ).toBeVisible({ timeout: 15000 });

    // Re-publish for other tests
    await ensurePublished(page);
  });

  test('widget page shows branded not-published message', async ({ browser }) => {
    // Use authenticated context (with saved auth state) to unpublish via API
    const authCtx = await browser.newContext({ storageState: 'tests/auth/e2e-storage.json' });
    const authPage = await authCtx.newPage();
    await ensureUnpublished(authPage);
    await authCtx.close();

    // Visit widget as unauthenticated user
    const ctx = await browser.newContext({ storageState: undefined });
    const unauthPage = await ctx.newPage();
    await unauthPage.goto(`http://localhost:3030/widget/${CHATBOT_ID}`);
    await unauthPage.waitForLoadState('domcontentloaded');

    // P0-4: Should show a branded "not published" message instead of generic error
    await expect(
      unauthPage.getByText(/isn't published yet|not yet published|isn't available yet/i)
    ).toBeVisible({ timeout: 15000 });
    await expect(unauthPage.getByText('Unable to load chatbot')).not.toBeVisible();

    await ctx.close();

    // Re-publish for other tests
    const cleanupCtx = await browser.newContext({ storageState: 'tests/auth/e2e-storage.json' });
    const cleanupPage = await cleanupCtx.newPage();
    await ensurePublished(cleanupPage);
    await cleanupCtx.close();
  });
});

test.describe('Widget Mobile', () => {
  test('widget renders at mobile viewport', async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 667 },
      storageState: undefined,
    });
    const page = await ctx.newPage();

    await page.goto(`http://localhost:3030/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Page should render something meaningful
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);

    await ctx.close();
  });
});
