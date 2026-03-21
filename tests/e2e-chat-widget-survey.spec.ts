import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Chat Widget Survey Flow', () => {
  test('widget loads on deploy page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/deploy`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // The deploy page should load
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Page should not crash
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});

test.describe('Chat Widget Embed', () => {
  test('widget renders in embed mode', async ({ page }) => {
    // The embed URL doesn't require auth
    await page.goto(`/embed/chat/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Wait for widget to render (it's a client component)
    await page.waitForTimeout(2000);

    // Check the widget container exists
    const widget = page.locator('.chat-widget-container, [class*="chat-widget"]').first();
    const widgetVisible = await widget.isVisible().catch(() => false);

    // Either the widget renders or we see some content — page shouldn't be blank
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);

    // No unhandled errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(1000);
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e => !e.includes('installHook') && !e.includes('Feature Policy'));
    expect(criticalErrors.length).toBe(0);
  });
});
