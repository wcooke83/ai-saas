import { test } from '@playwright/test';

test('screenshot pricing dark mode', async ({ page }) => {
  await page.goto('http://localhost:3030/pricing');
  
  // Force dark mode more aggressively
  await page.evaluate(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
  
  // Wait for styles to apply
  await page.waitForTimeout(1000);
  
  // Verify dark mode is active
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('Dark mode active:', isDark);
  
  await page.screenshot({ path: 'tests/screenshots/pricing-dark-verification.png', fullPage: true });
  console.log('Screenshot saved');
});
