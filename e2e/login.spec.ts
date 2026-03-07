import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login with credentials and handle MFA', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3030/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'e2e/screenshots/login-initial.png', fullPage: true });
    
    // Check if login form is visible
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Login form is visible');
    
    // Fill in credentials
    await emailInput.fill('wcooke83@gmail.com');
    await passwordInput.fill('Qq8gqJ_sVjIfs7D-');
    
    console.log('✓ Credentials filled');
    
    // Take screenshot before submit
    await page.screenshot({ path: 'e2e/screenshots/login-filled.png', fullPage: true });
    
    // Click sign in button
    const signInButton = page.locator('button[type="submit"]', { hasText: 'Sign In' });
    await signInButton.click();
    
    console.log('✓ Sign in button clicked');
    
    // Wait for either MFA prompt or redirect
    await page.waitForTimeout(3000);
    
    // Take screenshot after submit
    await page.screenshot({ path: 'e2e/screenshots/login-after-submit.png', fullPage: true });
    
    // Check if MFA is required
    const mfaInput = page.locator('input#mfaCode');
    const isMfaVisible = await mfaInput.isVisible().catch(() => false);
    
    if (isMfaVisible) {
      console.log('✓ MFA prompt displayed - test paused for manual code entry');
      console.log('  Please enter MFA code in the browser window...');
      
      // Wait for manual MFA code entry (60 seconds)
      await page.waitForTimeout(60000);
      
      // Take screenshot after MFA
      await page.screenshot({ path: 'e2e/screenshots/login-after-mfa.png', fullPage: true });
    }
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if redirected to dashboard
    if (currentUrl.includes('/dashboard')) {
      console.log('✓ Successfully logged in and redirected to dashboard');
    } else {
      console.log('⚠ Not redirected to dashboard');
      console.log('Current page title:', await page.title());
      
      // Check for any error messages
      const errorMessages = await page.locator('[role="alert"], .error, .text-red-500').allTextContents();
      if (errorMessages.length > 0) {
        console.log('Error messages found:', errorMessages);
      }
    }
  });
});
