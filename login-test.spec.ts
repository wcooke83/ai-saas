import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login with credentials and handle MFA', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3030/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'login-initial.png', fullPage: true });
    
    // Check if login form is visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    
    // Fill in credentials
    await emailInput.fill('wcooke83@gmail.com');
    await passwordInput.fill('Qq8gqJ_sVjIfs7D-');
    
    // Take screenshot before submit
    await page.screenshot({ path: 'login-filled.png', fullPage: true });
    
    // Click sign in button
    const signInButton = page.locator('button[type="submit"]', { hasText: 'Sign In' });
    await signInButton.click();
    
    // Wait for either MFA prompt or redirect
    await page.waitForTimeout(2000);
    
    // Take screenshot after submit
    await page.screenshot({ path: 'login-after-submit.png', fullPage: true });
    
    // Check if MFA is required
    const mfaInput = page.locator('input#mfaCode');
    const isMfaVisible = await mfaInput.isVisible().catch(() => false);
    
    if (isMfaVisible) {
      console.log('MFA is required - waiting for code input');
      
      // Wait for manual MFA code entry (60 seconds)
      console.log('Please enter MFA code in the browser...');
      await page.waitForTimeout(60000);
      
      // Take screenshot after MFA
      await page.screenshot({ path: 'login-after-mfa.png', fullPage: true });
    }
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if redirected to dashboard
    if (currentUrl.includes('/dashboard')) {
      console.log('✓ Successfully logged in and redirected to dashboard');
    } else {
      console.log('Current page content:');
      const bodyText = await page.locator('body').textContent();
      console.log(bodyText?.substring(0, 500));
    }
  });
});
