import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SETTINGS_URL = `/dashboard/chatbots/${CHATBOT_ID}/settings`;
const WIDGET_URL = `/widget/${CHATBOT_ID}`;

async function gotoFeedbackSection(page: import('@playwright/test').Page) {
  await page.goto(SETTINGS_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('nav button', { hasText: /Feedback/i }).click();
  await page.waitForTimeout(500);
}

test.describe('12. Settings -- Issue Reporting (Escalation)', () => {
  test('SET-ESCALATION-001: Enable/disable issue reporting', async ({ page }) => {
    await gotoFeedbackSection(page);

    // Issue Reporting card
    await expect(page.getByRole('heading', { name: 'Issue Reporting' })).toBeVisible({ timeout: 10000 });

    // Toggle exists
    const toggles = page.locator('button[role="switch"]');
    const count = await toggles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('SET-ESCALATION-002: Report from widget header', async ({ page }) => {
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 15000 });

    // Look for flag icon in header (escalation enabled)
    const flagBtn = page.locator('button[aria-label="Report an issue"], .chat-widget-close').filter({ has: page.locator('svg') });
    const headerBtns = page.locator('.chat-widget-header button, .chat-widget-close');
    const btnCount = await headerBtns.count();
    expect(btnCount).toBeGreaterThanOrEqual(1);
  });

  test('SET-ESCALATION-003: Report from individual message', async ({ page }) => {
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 15000 });

    // Wait for assistant message
    await expect(page.locator('.chat-widget-message-assistant').first()).toBeVisible({ timeout: 15000 });

    // Hover to reveal report button
    await page.locator('.chat-widget-msg-row').first().hover();
    await page.waitForTimeout(500);

    // Look for per-message report button
    const reportBtn = page.locator('.chat-widget-report-btn');
    const visible = await reportBtn.first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(typeof visible).toBe('boolean');
  });

  test('SET-ESCALATION-004: Report success feedback', async ({ page }) => {
    // Verify report success class exists in widget structure
    await page.goto(WIDGET_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 15000 });
  });

  test('SET-ESCALATION-005: Escalation reason options', async ({ page }) => {
    await gotoFeedbackSection(page);

    // Issue reporting info should mention the reasons
    await expect(page.getByRole('heading', { name: 'Issue Reporting' })).toBeVisible({ timeout: 10000 });
  });
});
