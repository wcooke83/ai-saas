import { test, expect } from '@playwright/test';

test('pricing page dark mode analysis', async ({ page }) => {
  // Navigate to pricing page
  await page.goto('http://localhost:3030/pricing');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Enable dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });

  // Wait for styles to apply
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({
    path: 'tests/screenshots/pricing-dark-mode.png',
    fullPage: true
  });

  console.log('Screenshot saved to tests/screenshots/pricing-dark-mode.png');
});
