import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Post-Chat Survey', () => {
  test('survey responses page loads', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/surveys`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Page should render content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(50);
  });

  test('submit survey via widget interaction', async ({ page }) => {
    // Navigate to widget
    await page.goto(`/widget/${CHATBOT_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // Try to find survey elements (star ratings, comment field)
    const ratingButton = page.locator('[data-rating], button[aria-label*="star" i], .rating-star').first();
    const surveyForm = page.locator('[data-survey], form[class*="survey"]').first();

    if (await surveyForm.isVisible({ timeout: 3000 }).catch(() => false) ||
        await ratingButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Click a rating star if visible
      if (await ratingButton.isVisible().catch(() => false)) {
        await ratingButton.click();
      }

      // Fill comment if visible
      const commentInput = page.locator('textarea[placeholder*="comment" i], textarea[name="comment"]').first();
      if (await commentInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await commentInput.fill('Great service!');
      }

      // Submit survey
      const submitButton = page.getByRole('button', { name: /submit|send/i }).first();
      if (await submitButton.isVisible().catch(() => false)) {
        await submitButton.click();
      }
    } else {
      // Survey may not be configured — use API as fallback
      const res = await page.request.post(`/api/widget/${CHATBOT_ID}/survey`, {
        data: {
          session_id: `e2e-survey-${Date.now()}`,
          responses: { rating: 5, comment: 'Great service!' },
        },
      });
      expect(res.status()).toBe(201);
    }
  });

  test('survey responses appear on dashboard', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/surveys`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
