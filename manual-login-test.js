const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[Browser ${type}]:`, msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log('[Page Error]:', error.message);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log('[Request Failed]:', request.url(), request.failure()?.errorText);
  });

  // Capture responses
  page.on('response', async response => {
    const url = response.url();
    const status = response.status();
    if (status >= 400) {
      console.log(`[Response Error] ${status}:`, url);
      if (url.includes('auth') || url.includes('mfa')) {
        try {
          const body = await response.text();
          console.log('[Response Body]:', body);
        } catch (e) {
          // Ignore
        }
      }
    }
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3030/login');
    
    console.log('Waiting for page to load...');
    await page.waitForLoadState('networkidle');
    
    console.log('Taking initial screenshot...');
    try {
      await page.screenshot({ path: 'login-initial.png', fullPage: true });
    } catch (e) {
      console.log('Screenshot skipped (display issue):', e.message);
    }
    
    console.log('Checking for login form...');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    const emailVisible = await emailInput.isVisible({ timeout: 10000 }).catch(() => false);
    const passwordVisible = await passwordInput.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (!emailVisible || !passwordVisible) {
      console.error('❌ Login form not visible!');
      console.log('Page URL:', page.url());
      console.log('Page title:', await page.title());
      
      const bodyText = await page.locator('body').textContent();
      console.log('Page content (first 500 chars):', bodyText?.substring(0, 500));
      
      try {
        await page.screenshot({ path: 'login-error.png', fullPage: true });
      } catch (e) {
        console.log('Screenshot skipped (display issue):', e.message);
      }
      return;
    }
    
    console.log('✓ Login form is visible');
    
    console.log('Filling credentials...');
    await emailInput.fill('wcooke83@gmail.com');
    await passwordInput.fill('Qq8gqJ_sVjIfs7D-');
    
    console.log('✓ Credentials filled');
    try {
      await page.screenshot({ path: 'login-filled.png', fullPage: true });
    } catch (e) {
      console.log('Screenshot skipped (display issue):', e.message);
    }
    
    console.log('Clicking sign in button...');
    const signInButton = page.locator('button[type="submit"]').filter({ hasText: 'Sign In' });
    await signInButton.click();
    
    console.log('✓ Sign in button clicked, waiting for response...');
    await page.waitForTimeout(3000);
    
    try {
      await page.screenshot({ path: 'login-after-submit.png', fullPage: true });
    } catch (e) {
      console.log('Screenshot skipped (display issue):', e.message);
    }
    
    // Check for MFA
    const mfaInput = page.locator('input#mfaCode');
    const isMfaVisible = await mfaInput.isVisible().catch(() => false);
    
    if (isMfaVisible) {
      console.log('\n✓ MFA prompt displayed!');
      console.log('Entering MFA code: 034942\n');
      
      await mfaInput.fill('034942');
      
      // Click verify button
      const verifyButton = page.locator('button[type="submit"]').filter({ hasText: 'Verify' });
      await verifyButton.click();
      
      console.log('✓ MFA code submitted, waiting for verification...');
      
      // Wait for navigation or timeout
      try {
        await page.waitForURL('**/dashboard**', { timeout: 10000 });
        console.log('✓ Redirected to dashboard!');
      } catch (e) {
        console.log('No redirect detected after 10 seconds');
      }
      
      try {
        await page.screenshot({ path: 'login-after-mfa.png', fullPage: true });
      } catch (e) {
        console.log('Screenshot skipped (display issue):', e.message);
      }
    }
    
    const currentUrl = page.url();
    console.log('\nCurrent URL:', currentUrl);
    
    // Check for toast notifications (sonner)
    const toastMessages = await page.locator('[data-sonner-toast], [role="status"], .sonner-toast').allTextContents();
    if (toastMessages.length > 0) {
      console.log('Toast messages:', toastMessages);
    }
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully logged in and redirected to dashboard!');
    } else {
      console.log('⚠️  Not redirected to dashboard yet');
      
      const errorElements = await page.locator('[role="alert"], .error, .text-red-500, .text-red-600, .text-red-700').allTextContents();
      if (errorElements.length > 0) {
        console.log('Error messages:', errorElements);
      }
      
      // Check page HTML for debugging
      const pageTitle = await page.title();
      console.log('Page title:', pageTitle);
    }
    
    console.log('\nTest complete. Press Ctrl+C to close browser.');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('Error during test:', error.message);
    try {
      await page.screenshot({ path: 'login-exception.png', fullPage: true });
    } catch (e) {
      console.log('Screenshot skipped (display issue):', e.message);
    }
  } finally {
    await browser.close();
  }
})();
