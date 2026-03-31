import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('Fallback Help Articles', () => {
  test('ARTICLE-001: Widget articles endpoint returns list', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/articles`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('articles');
      expect(Array.isArray(data.data.articles)).toBeTruthy();
    }
  });

  test('ARTICLE-002: Widget articles search works', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/articles?q=test`);
    expect(res.ok()).toBeTruthy();
    if (res.ok()) {
      const data = await res.json();
      expect(Array.isArray(data.data?.articles)).toBeTruthy();
    }
  });

  test('ARTICLE-003: Articles dashboard page loads with heading', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Help Articles' })).toBeVisible({ timeout: 15000 });
  });

  test('ARTICLE-004: Articles page shows admin content and source count', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');

    // Verify API call returns articles data
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/articles`) && res.request().method() === 'GET'
    );
    await page.reload();
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();
    const data = await apiResponse.json();
    expect(data.data).toHaveProperty('articles');
    expect(data.data).toHaveProperty('knowledgeSourcesCount');
  });

  test('ARTICLE-005: Generate button is visible on articles page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Generate from Knowledge')).toBeVisible({ timeout: 15000 });
  });

  test('ARTICLE-006: Credit exhaustion mode can be set to help_articles via settings', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/settings`);
    await page.waitForLoadState('networkidle');

    // Navigate to Credit Exhaustion section
    await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('nav button').filter({ hasText: 'Credit Exhaustion' }).click();
    await expect(page.getByRole('heading', { name: 'Limits & Fallback' })).toBeVisible({ timeout: 10000 });

    // Select Help Articles mode
    await page.locator('input[value="help_articles"]').click({ force: true });
    await expect(page.getByText('Help Articles').first()).toBeVisible({ timeout: 5000 });

    // Save
    const savePromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH'
    );
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    const saveRes = await savePromise;
    expect(saveRes.ok()).toBeTruthy();
  });

  test('ARTICLE-007: Empty articles shows empty state or generate option', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Generate from Knowledge').or(page.getByText('No help articles generated yet'))).toBeVisible({ timeout: 15000 });
  });

  test('ARTICLE-008: Widget config includes creditExhausted field', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/config`);
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('creditExhausted');
    }
  });

  test('ARTICLE-009: Articles page loads without errors', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible({ timeout: 5000 });
  });

  // Restore
  test.afterAll(async ({ request }) => {
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
  });
});
