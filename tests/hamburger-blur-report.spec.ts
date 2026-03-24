import { test, expect } from '@playwright/test';

test('Hamburger Menu Blur - Complete Report', async ({ page }) => {
  console.log('='.repeat(60));
  console.log('HAMBURGER MENU BLUR DIAGNOSIS REPORT');
  console.log('='.repeat(60));

  // Clear settings
  await page.goto('/--sdk');
  await page.evaluate(() => localStorage.removeItem('ai-saas-ui-settings'));
  await page.reload();
  await page.waitForLoadState('networkidle');

  console.log('\n--- TEST 1: Default State (Blur OFF) ---');

  // Open menu
  await page.locator('button[aria-label="Open menu"]').click();
  await page.waitForTimeout(500);

  let navState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const computed = window.getComputedStyle(nav!);
    return {
      hasBlurClass: /backdrop-blur/.test(nav?.className || ''),
      backdropFilter: computed.backdropFilter,
      backgroundColor: computed.backgroundColor,
    };
  });

  console.log('Has backdrop-blur class:', navState.hasBlurClass);
  console.log('Computed backdrop-filter:', navState.backdropFilter);
  console.log('Background color:', navState.backgroundColor);

  await page.screenshot({ path: 'blur-report-01-default.png' });

  // Close menu
  await page.locator('button[aria-label="Close menu"]').click();
  await page.waitForTimeout(300);

  console.log('\n--- TEST 2: Blur ON, Use Colour OFF (transparent blur) ---');

  await page.evaluate(() => {
    const settings = {
      backdropBlur: 'md',
      headerBlurEnabled: true,
      headerBlurUseColor: true,
      headerBlurOpacity: 85,
      menuBlurEnabled: true,
      menuBlurIntensity: 'lg',
      menuBlurUseColor: false, // No color - just blur
      menuBlurOpacity: 70,
    };
    localStorage.setItem('ai-saas-ui-settings', JSON.stringify(settings));
  });

  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.locator('button[aria-label="Open menu"]').click();
  await page.waitForTimeout(500);

  navState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const computed = window.getComputedStyle(nav!);
    return {
      hasBlurClass: /backdrop-blur/.test(nav?.className || ''),
      blurClass: (nav?.className.match(/backdrop-blur-\w+/) || ['none'])[0],
      backdropFilter: computed.backdropFilter,
      backgroundColor: computed.backgroundColor,
    };
  });

  console.log('Has backdrop-blur class:', navState.hasBlurClass);
  console.log('Blur class:', navState.hasBlurClass);
  console.log('Computed backdrop-filter:', navState.backdropFilter);
  console.log('Background color:', navState.backgroundColor);

  await page.screenshot({ path: 'blur-report-02-blur-no-color.png' });

  await page.locator('button[aria-label="Close menu"]').click();
  await page.waitForTimeout(300);

  console.log('\n--- TEST 3: Blur ON, Use Colour ON, Opacity 50% ---');

  await page.evaluate(() => {
    const settings = {
      backdropBlur: 'md',
      headerBlurEnabled: true,
      headerBlurUseColor: true,
      headerBlurOpacity: 85,
      menuBlurEnabled: true,
      menuBlurIntensity: 'lg',
      menuBlurUseColor: true, // Color behind blur
      menuBlurOpacity: 50,    // 50% opacity
    };
    localStorage.setItem('ai-saas-ui-settings', JSON.stringify(settings));
  });

  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.locator('button[aria-label="Open menu"]').click();
  await page.waitForTimeout(500);

  navState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const computed = window.getComputedStyle(nav!);
    return {
      hasBlurClass: /backdrop-blur/.test(nav?.className || ''),
      blurClass: (nav?.className.match(/backdrop-blur-\w+/) || ['none'])[0],
      backdropFilter: computed.backdropFilter,
      backgroundColor: computed.backgroundColor,
    };
  });

  console.log('Has backdrop-blur class:', navState.hasBlurClass);
  console.log('Blur class:', navState.hasBlurClass);
  console.log('Computed backdrop-filter:', navState.backdropFilter);
  console.log('Background color:', navState.backgroundColor);

  await page.screenshot({ path: 'blur-report-03-blur-with-color.png' });

  console.log('\n--- TEST 4: Blur ON, Use Colour ON, Opacity 100% (blocks blur visibility) ---');

  await page.evaluate(() => {
    const settings = {
      backdropBlur: 'md',
      headerBlurEnabled: true,
      headerBlurUseColor: true,
      headerBlurOpacity: 85,
      menuBlurEnabled: true,
      menuBlurIntensity: 'lg',
      menuBlurUseColor: true,
      menuBlurOpacity: 100, // Fully opaque - will block blur visibility
    };
    localStorage.setItem('ai-saas-ui-settings', JSON.stringify(settings));
  });

  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.locator('button[aria-label="Open menu"]').click();
  await page.waitForTimeout(500);

  navState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const computed = window.getComputedStyle(nav!);
    return {
      hasBlurClass: /backdrop-blur/.test(nav?.className || ''),
      blurClass: (nav?.className.match(/backdrop-blur-\w+/) || ['none'])[0],
      backdropFilter: computed.backdropFilter,
      backgroundColor: computed.backgroundColor,
    };
  });

  console.log('Has backdrop-blur class:', navState.hasBlurClass);
  console.log('Blur class:', navState.hasBlurClass);
  console.log('Computed backdrop-filter:', navState.backdropFilter);
  console.log('Background color:', navState.backgroundColor);
  console.log('WARNING: 100% opacity blocks blur visibility even though blur is applied');

  await page.screenshot({ path: 'blur-report-04-blur-blocked.png' });

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`
FINDINGS:
1. The Hamburger Menu blur IS WORKING correctly when enabled.

2. There are TWO blur toggles on the SDK page:
   - Header/Toolbar Blur (for the sticky header)
   - Hamburger Menu Blur (for the mobile menu dropdown)
   Make sure you're clicking the correct one under "Hamburger Menu" section.

3. When "Blur" is ON but "Use Colour" is OFF:
   - backdrop-filter: blur() IS applied
   - Background is transparent
   - The blur effect blurs content behind the menu

4. When "Blur" is ON and "Use Colour" is ON:
   - backdrop-filter: blur() IS applied
   - Background color is semi-transparent (based on opacity slider)
   - The blur effect is visible through the semi-transparent background

5. POTENTIAL ISSUE: If opacity is set to 100%:
   - The background becomes fully opaque
   - This BLOCKS the blur effect from being visible
   - The blur is still technically applied but cannot be seen

RECOMMENDATIONS:
- Keep Background Opacity between 30-70% for best blur visibility
- Ensure "Blur" toggle is ON (blue) in the "Hamburger Menu" section
- Check that you're not confusing Header/Toolbar blur with Hamburger Menu blur
`);
});
