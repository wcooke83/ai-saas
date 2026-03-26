import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Tooltip Component', () => {
  test('tooltips appear on hover without crashing the page', async ({ page }) => {
    await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/performance`);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1', { hasText: 'Performance' })).toBeVisible({ timeout: 10000 });

    // Check no errors on the page
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Find an element with a tooltip (the info icons next to summary cards)
    const infoIcon = page.locator('.cursor-help').first();
    const isVisible = await infoIcon.isVisible().catch(() => false);

    if (isVisible) {
      // Hover to trigger tooltip
      await infoIcon.hover();

      // Tooltip should appear (role="tooltip" in the portal)
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });

      // Tooltip should NOT be at position 0,0 (the old bug)
      const box = await tooltip.boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThan(10);
        expect(box.y).toBeGreaterThan(10);
      }

      // Move mouse away — tooltip should disappear
      await page.mouse.move(0, 0);
      await expect(tooltip).not.toBeVisible({ timeout: 5000 });
    }

    // Page should still be intact
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
  });
});
