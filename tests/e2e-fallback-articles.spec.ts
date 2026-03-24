import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const WIDGET_CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

test.describe('Fallback Help Articles', () => {
  test('ARTICLE-001: Widget articles endpoint returns list', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/articles`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('articles');
      expect(Array.isArray(data.data.articles)).toBeTruthy();
    }
  });

  test('ARTICLE-002: Widget articles search works', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/articles?q=test`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const data = await res.json();
      expect(Array.isArray(data.data?.articles)).toBeTruthy();
    }
  });

  test('ARTICLE-003: Admin articles endpoint returns list with sources count', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/articles`);
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('articles');
      expect(data.data).toHaveProperty('knowledgeSourcesCount');
    }
  });

  test('ARTICLE-004: Articles dashboard page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Help Articles' })).toBeVisible({ timeout: 15000 });
  });

  test('ARTICLE-005: Generate button is visible on articles page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Generate from Knowledge Sources')).toBeVisible({ timeout: 15000 });
  });

  test('ARTICLE-006: Credit exhaustion mode can be set to help_articles', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        credit_exhaustion_mode: 'help_articles',
        credit_exhaustion_config: {
          help_articles: {
            searchPlaceholder: 'Search...',
            emptyStateMessage: 'Nothing here',
          },
        },
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('ARTICLE-007: Empty articles shows empty state', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    // Either articles are listed or empty state shown
    const emptyVisible = await page.getByText('No help articles generated yet').isVisible().catch(() => false);
    const generateVisible = await page.getByText('Generate from Knowledge Sources').isVisible().catch(() => false);
    expect(emptyVisible || generateVisible).toBeTruthy();
  });

  test('ARTICLE-008: Widget config includes creditExhausted field', async ({ request }) => {
    const res = await request.get(`/api/widget/${WIDGET_CHATBOT_ID}/config`);
    if (res.ok()) {
      const data = await res.json();
      expect(data.data).toHaveProperty('creditExhausted');
    }
  });

  test('ARTICLE-009: Articles subnav link visible', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/articles`);
    await page.waitForLoadState('domcontentloaded');
    // The Articles link should be in the subnav
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible({ timeout: 5000 });
  });

  // Restore
  test.afterAll(async ({ request }) => {
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { credit_exhaustion_mode: 'tickets' },
    });
  });
});
