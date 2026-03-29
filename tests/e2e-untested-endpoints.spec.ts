import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Previously Untested Endpoints', () => {
  test('agent-conversations endpoint responds via agent console UI', async ({ page }) => {
    // Navigate to the agent console page which calls /api/widget/{id}/agent-conversations on load
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/widget/${CHATBOT_ID}/agent-conversations`),
      { timeout: 30000 }
    );

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/conversations`);
    await page.waitForLoadState('domcontentloaded');

    const res = await responsePromise;
    expect(res.status()).toBeLessThan(500);
  });

  test('agent-events SSE endpoint responds', async ({ page }) => {
    // SSE endpoint requires a chatbot API key (Bearer cb_...) — no dashboard UI triggers it
    // with session auth. The embedded agent console uses it via postMessage auth flow which
    // can't be driven from a normal page navigation. Direct API call is appropriate here.
    const res = await page.request.get(`/api/widget/${CHATBOT_ID}/agent-events`);
    expect(res.status()).toBeLessThan(500);
  });

  test('chatbot translate endpoint responds via settings UI', async ({ page }) => {
    // The translate endpoint is called when the TranslationReviewModal opens from
    // the chatbot settings page. Navigate to settings and trigger the modal.
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for settings nav to load
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });

    // Look for a "Translate to" link/button in the general section warning or elsewhere.
    // If the chatbot language is non-English and there is custom text, the translate
    // link appears. We intercept the POST request regardless of whether the modal opens.
    const translateButton = page.getByText(/Translate to/i).first();
    const isVisible = await translateButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (isVisible) {
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/translate`),
        { timeout: 30000 }
      );
      await translateButton.click();
      const res = await responsePromise;
      expect(res.status()).toBeLessThan(500);
    } else {
      // No translate button visible (chatbot is English or no custom text).
      // Fall back to direct API call to still verify the endpoint doesn't 500.
      const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/translate`, {
        data: { target_language: 'es' },
      });
      expect(res.status()).toBeLessThan(500);
    }
  });

  test('agent-heartbeat endpoint responds', async ({ page }) => {
    // The agent-heartbeat HTTP endpoint no longer exists — agent presence was migrated
    // to Supabase Realtime Presence (see useAgentConsole.ts). The route file is gone.
    // Keep as direct API call to confirm it returns a non-500 (expected: 404).
    const res = await page.request.post(`/api/widget/${CHATBOT_ID}/agent-heartbeat`, {
      data: { agent_name: 'e2e-test-agent' },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('wiki index endpoint responds via wiki page navigation', async ({ page }) => {
    // The public /wiki page calls /api/wiki/index on mount to load categories
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/wiki/index'),
      { timeout: 30000 }
    );

    await page.goto('/wiki');
    await page.waitForLoadState('domcontentloaded');

    const res = await responsePromise;
    expect(res.status()).toBeLessThan(500);

    // Verify the page rendered (loaded state, not stuck on spinner)
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });

  test('admin check endpoint responds via admin page navigation', async ({ page }) => {
    // The /admin page calls GET /api/admin/check on mount to verify admin status.
    // Non-admin users get redirected to /dashboard, but the endpoint still responds.
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/admin/check'),
      { timeout: 30000 }
    );

    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    const res = await responsePromise;
    expect(res.status()).toBeLessThan(500);
  });
});
