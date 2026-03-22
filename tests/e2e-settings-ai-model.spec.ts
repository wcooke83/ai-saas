import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const SETTINGS_URL = `/dashboard/chatbots/${CHATBOT_ID}/settings`;

async function gotoModelSection(page: import('@playwright/test').Page) {
  await page.goto(SETTINGS_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('nav button').first().waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('nav button', { hasText: 'AI Model' }).click();
  await page.waitForTimeout(500);
}

test.describe('4. Settings -- AI Model', () => {
  test('SET-MODEL-001: Temperature slider', async ({ page }) => {
    await gotoModelSection(page);

    // Find temperature slider
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible({ timeout: 10000 });

    // Verify range attributes
    const min = await slider.getAttribute('min');
    const max = await slider.getAttribute('max');
    expect(min).toBe('0');
    expect(max).toBe('2');

    // Value display should show a decimal
    const valueDisplay = page.locator('text=/\\d\\.\\d/').first();
    await expect(valueDisplay).toBeVisible({ timeout: 5000 });
  });

  test('SET-MODEL-002: Max tokens slider', async ({ page }) => {
    await gotoModelSection(page);

    // Find the max tokens slider (second range input typically)
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Second slider should be max tokens
    const tokensSlider = sliders.nth(1);
    const min = await tokensSlider.getAttribute('min');
    const max = await tokensSlider.getAttribute('max');
    expect(min).toBe('100');
    expect(max).toBe('4096');
  });

  test('SET-MODEL-003: Live fetch threshold slider', async ({ page }) => {
    await gotoModelSection(page);

    // Third slider for live fetch threshold
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const thresholdSlider = sliders.nth(2);
    const min = await thresholdSlider.getAttribute('min');
    const max = await thresholdSlider.getAttribute('max');
    expect(min).toBe('0.5');
    expect(max).toBe('0.95');

    // Value display should show two decimal places
    const valueDisplay = page.locator('text=/0\\.\\d{2}/').first();
    await expect(valueDisplay).toBeVisible({ timeout: 5000 });
  });
});
