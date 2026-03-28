import { test, expect } from '@playwright/test';

/**
 * Tests verifying that user-level AI model selection has been removed.
 * AI model configuration is now admin-only via /admin/ai-config.
 */

test.describe('User Settings — AI Model Section Removed', () => {
  test('SETTINGS-001: Settings page loads without AI Model card', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('domcontentloaded');

    // Page should load successfully
    await expect(page.locator('h1', { hasText: 'Settings' })).toBeVisible({ timeout: 15000 });

    // Should show Profile, Subscription, and Security section headings
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Security' })).toBeVisible();

    // AI Model card must NOT be present
    await expect(page.locator('text=Choose your preferred AI model')).not.toBeVisible();
    await expect(page.locator('[data-testid="model-selector"]')).not.toBeVisible();
  });

  test('SETTINGS-002: No Brain icon AI Model heading on settings page', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1', { hasText: 'Settings' })).toBeVisible({ timeout: 15000 });

    // The CardTitle "AI Model" should not exist on this page
    // (distinct from chatbot-level "AI Model" settings tab)
    const aiModelHeadings = page.locator('[class*="CardTitle"]', { hasText: 'AI Model' });
    await expect(aiModelHeadings).toHaveCount(0);
  });
});

test.describe('Removed API Routes Return 404', () => {
  test('API-001: PUT /api/user/settings/model returns 404', async ({ request }) => {
    const response = await request.put('/api/user/settings/model', {
      data: { model_id: '00000000-0000-0000-0000-000000000000' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(404);
  });

  test('API-002: DELETE /api/user/settings/model returns 404', async ({ request }) => {
    const response = await request.delete('/api/user/settings/model');
    expect(response.status()).toBe(404);
  });

  test('API-003: GET /api/user/models returns 404', async ({ request }) => {
    const response = await request.get('/api/user/models');
    expect(response.status()).toBe(404);
  });
});

test.describe('Admin AI Config — Non-admin redirect', () => {
  test('ADMIN-001: Non-admin user is redirected away from AI Config', async ({ page }) => {
    await page.goto('/admin/ai-config');
    await page.waitForLoadState('domcontentloaded');

    // Non-admin e2e user should be redirected to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');
  });
});
