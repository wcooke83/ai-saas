import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Chatbot Publish/Unpublish', () => {
  test('publish chatbot via overview page button', async ({ page }) => {
    // First ensure unpublished state via API (setup)
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    // Wait for React hydration (same pattern as test 3 which passes)
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    // Click the Publish button on the overview page
    const publishButton = page.getByRole('button', { name: 'Publish' });
    await expect(publishButton).toBeVisible({ timeout: 10000 });

    const publishPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/publish`) && res.request().method() === 'POST'
    );
    await publishButton.click();
    const publishResponse = await publishPromise;
    expect(publishResponse.ok()).toBeTruthy();

    // Verify Published badge appears (exact: true avoids matching the toast notification)
    await expect(page.getByText('Published', { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('post-publish toast has Go to Deploy action button (P2 fix)', async ({ page }) => {
    // Ensure unpublished first
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    const publishButton = page.getByRole('button', { name: 'Publish' });
    await expect(publishButton).toBeVisible({ timeout: 10000 });

    const publishPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/publish`) && res.request().method() === 'POST'
    );
    await publishButton.click();
    await publishPromise;

    // P2: toast message should mention embed codes and deploy page
    await expect(
      page.getByText('Get your embed codes on the deploy page').or(
        page.getByText('Chatbot published')
      )
    ).toBeVisible({ timeout: 10000 });

    // P2: toast should have a "Go to Deploy" action button
    const deployAction = page.getByRole('button', { name: /Go to Deploy/i });
    await expect(deployAction).toBeVisible({ timeout: 5000 });
  });

  test('publish only sets is_published, status stays unchanged for active bots (P2 fix)', async ({ page }) => {
    // Ensure published first (so status is active)
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Now unpublish
    await page.request.delete(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Navigate to overview to check the status badge
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 30000 });

    // P2: unpublish should only set is_published=false, NOT change status to 'paused'
    // Status should remain 'active' (not 'paused')
    const statusBadge = page.getByText(/^(active|draft|paused|archived)$/i).first();
    await expect(statusBadge).toBeVisible({ timeout: 10000 });
    const statusText = (await statusBadge.textContent())?.toLowerCase();
    // Status should NOT be 'paused' after unpublish (P2 fix decouples publish from status)
    expect(statusText).not.toBe('paused');

    // "Published" badge should NOT be visible
    // Use a more specific selector to avoid matching partial text
    const publishedBadges = page.locator('.bg-green-100, .bg-green-900\\/50').filter({ hasText: 'Published' });
    await expect(publishedBadges).not.toBeVisible({ timeout: 5000 });

    // Re-publish — status should still be 'active', not changed by publish
    const publishButton = page.getByRole('button', { name: 'Publish' });
    await expect(publishButton).toBeVisible({ timeout: 10000 });

    const publishPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/publish`) && res.request().method() === 'POST'
    );
    await publishButton.click();
    const publishResponse = await publishPromise;
    expect(publishResponse.ok()).toBeTruthy();

    // Verify both Published badge and active status are shown (exact: true avoids matching toast)
    await expect(page.getByText('Published', { exact: true })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('active', { exact: true }).or(page.getByText('Active', { exact: true }))).toBeVisible({ timeout: 5000 });
  });

  test('published chatbot widget config is accessible', async ({ page }) => {
    // Ensure published before navigating (don't depend on prior test state)
    await page.request.post(`/api/chatbots/${CHATBOT_ID}/publish`);

    // Navigate to deploy page and verify widget preview is accessible
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/deploy`);
    await page.waitForLoadState('domcontentloaded');
    // Wait for React hydration — deploy page heading
    await expect(page.getByRole('heading', { name: /Deploy/i })).toBeVisible({ timeout: 20000 });

    // The deploy page should NOT show the "Chatbot not published" banner
    await expect(page.getByText('Chatbot not published')).not.toBeVisible();

    // Widget embed tab should be visible with embed codes
    await expect(page.getByText('Widget Embed')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Script Tag')).toBeVisible({ timeout: 5000 });
  });

  test('unpublish chatbot via overview page button', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Click the Unpublish button
    const unpublishButton = page.getByRole('button', { name: 'Unpublish' });
    await expect(unpublishButton).toBeVisible({ timeout: 10000 });

    const unpublishPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/publish`) && res.request().method() === 'DELETE'
    );
    await unpublishButton.click();
    const unpublishResponse = await unpublishPromise;
    expect(unpublishResponse.ok()).toBeTruthy();

    // Verify Published badge is no longer visible
    await expect(page.getByText('Published', { exact: true })).not.toBeVisible({ timeout: 5000 });
  });

  test('deploy page shows unpublished warning', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/deploy`);
    await page.waitForLoadState('domcontentloaded');

    // Should show the unpublished warning banner
    await expect(page.getByText('Chatbot not published')).toBeVisible({ timeout: 10000 });
    // "Publish now" should be a button, not a link
    await expect(page.getByRole('button', { name: /Publish now/i })).toBeVisible();
  });

  test('re-publish for other tests', async ({ page, request }) => {
    // Ensure unpublished first so we can always click Publish
    await request.delete(`/api/chatbots/${CHATBOT_ID}/publish`).catch(() => {});

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    const publishButton = page.getByRole('button', { name: 'Publish' });
    await expect(publishButton).toBeVisible({ timeout: 10000 });

    const publishPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/publish`) && res.request().method() === 'POST'
    );
    await publishButton.click();
    const publishResponse = await publishPromise;
    expect(publishResponse.ok()).toBeTruthy();
  });
});
