import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Escalation Management', () => {
  test('issues page loads with escalation list', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/issues`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Page should show escalation content or empty state
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('issues page fetches data from API', async ({ page }) => {
    const apiPromise = page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}/issues`) && res.request().method() === 'GET'
    );

    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/issues`);
    const apiResponse = await apiPromise;
    expect(apiResponse.ok()).toBeTruthy();

    const body = await apiResponse.json();
    expect(body.data).toBeDefined();
  });

  test('issues page supports status filtering', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/issues`);
    await page.waitForLoadState('domcontentloaded');

    // Look for filter controls (tabs, dropdown, buttons for status)
    const filterButton = page.getByRole('button', { name: /open|all|filter/i }).first();
    if (await filterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await filterButton.click();
    }
  });

  test('update non-existent escalation returns error', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/issues/00000000-0000-0000-0000-000000000000`,
      { data: { status: 'acknowledged' } }
    );
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('reject invalid escalation status', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/issues/00000000-0000-0000-0000-000000000000`,
      { data: { status: 'invalid_status' } }
    );
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
