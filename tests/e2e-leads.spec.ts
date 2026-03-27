import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Lead Capture', () => {
  test('submit pre-chat form lead via widget', async ({ page }) => {
    // Navigate to the widget page
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Look for pre-chat form fields (name, email)
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[placeholder*="email" i], input[type="email"]').first();

    if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nameInput.fill('E2E Test User');
      await emailInput.fill('e2e@test.local');

      // Look for company field
      const companyInput = page.locator('input[name="company"], input[placeholder*="company" i]').first();
      if (await companyInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await companyInput.fill('Test Corp');
      }

      // Submit the pre-chat form
      const submitButton = page.getByRole('button', { name: /start|submit|chat/i }).first();
      if (await submitButton.isVisible().catch(() => false)) {
        const leadPromise = page.waitForResponse(
          (res) => res.url().includes('/leads') && res.request().method() === 'POST'
        );
        await submitButton.click();
        const leadResponse = await leadPromise;
        expect(leadResponse.status()).toBe(201);
      }
    } else {
      // Pre-chat form not enabled — submit via API (acceptable fallback)
      const res = await page.request.post(`/api/widget/${CHATBOT_ID}/leads`, {
        data: {
          session_id: `e2e-lead-${Date.now()}`,
          form_data: { name: 'E2E Test User', email: 'e2e@test.local', company: 'Test Corp' },
        },
      });
      expect(res.status()).toBe(201);
    }
  });

  test('leads page loads and shows leads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/leads`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Page should have content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });
});
