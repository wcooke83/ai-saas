import { test, expect } from '@playwright/test';

test('Hamburger Menu Blur Settings Diagnosis', async ({ page }) => {
  // Step 1: Navigate to SDK page
  await page.goto('/--sdk');
  await page.waitForLoadState('networkidle');

  // Step 2: Take screenshot of initial page state
  await page.screenshot({ path: 'hamburger-test-01-initial.png', fullPage: false });
  console.log('Screenshot 1: Initial page state saved');

  // Step 3: Find and open the Theme Color Variables accordion
  // First, scroll down to find the hamburger menu section
  const themeColorSection = page.locator('text=Theme Color Variables').first();
  if (await themeColorSection.isVisible()) {
    await themeColorSection.click();
    await page.waitForTimeout(500);
  }

  // Look for the Hamburger Menu section
  const hamburgerSection = page.locator('text=Hamburger Menu').first();
  await hamburgerSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Click to expand the hamburger menu section if it's collapsible
  const hamburgerHeader = page.locator('[data-testid="hamburger-section"]').or(
    page.locator('text=Hamburger Menu').first()
  );

  // Step 4 & 5: Enable Blur and Use Colour toggles
  // Find the Blur toggle
  const blurToggle = page.locator('label:has-text("Blur") >> input[type="checkbox"]').or(
    page.locator('button[role="switch"]:near(:text("Blur"))').first()
  );

  // Try to find toggles in the hamburger menu settings area
  const settingsArea = page.locator('div:has-text("Hamburger Menu")').last();
  await settingsArea.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'hamburger-test-02-settings-area.png' });
  console.log('Screenshot 2: Settings area');

  // Find all switch/toggle buttons
  const switches = page.locator('button[role="switch"]');
  const switchCount = await switches.count();
  console.log(`Found ${switchCount} switch buttons on page`);

  // List all switches with their labels
  for (let i = 0; i < Math.min(switchCount, 20); i++) {
    const switchEl = switches.nth(i);
    const ariaLabel = await switchEl.getAttribute('aria-label');
    const checked = await switchEl.getAttribute('data-state');
    const id = await switchEl.getAttribute('id');
    console.log(`Switch ${i}: id=${id}, aria-label=${ariaLabel}, state=${checked}`);
  }

  // Step 6: Look for Blur Intensity buttons
  const blurIntensityButtons = page.locator('button:has-text("lg")');
  const lgButtonCount = await blurIntensityButtons.count();
  console.log(`Found ${lgButtonCount} 'lg' buttons`);

  // Step 7: Look for Background Opacity slider
  const sliders = page.locator('input[type="range"]');
  const sliderCount = await sliders.count();
  console.log(`Found ${sliderCount} range sliders`);

  // Take screenshot of current state
  await page.screenshot({ path: 'hamburger-test-03-controls.png', fullPage: true });
  console.log('Screenshot 3: Full page with controls');

  // Step 9: Click the hamburger menu icon in the header
  const hamburgerButton = page.locator('button[aria-label*="menu" i]').or(
    page.locator('header button:has(svg)').first()
  ).or(
    page.locator('nav button:has(svg)').first()
  );

  // Try to find the hamburger menu button by looking for the common SVG pattern
  const menuButtons = page.locator('button').filter({ has: page.locator('svg') });
  const menuButtonCount = await menuButtons.count();
  console.log(`Found ${menuButtonCount} buttons with SVG icons`);

  // Look for a button that opens a mobile menu
  const navButtons = page.locator('header button, nav button');
  const navButtonCount = await navButtons.count();
  console.log(`Found ${navButtonCount} nav/header buttons`);

  for (let i = 0; i < navButtonCount; i++) {
    const btn = navButtons.nth(i);
    const ariaLabel = await btn.getAttribute('aria-label');
    const ariaExpanded = await btn.getAttribute('aria-expanded');
    const className = await btn.getAttribute('class');
    console.log(`Nav button ${i}: aria-label=${ariaLabel}, aria-expanded=${ariaExpanded}, class=${className?.slice(0, 50)}`);
  }

  // Try clicking the first button in header that looks like a hamburger
  const headerButton = page.locator('header button').first();
  if (await headerButton.isVisible()) {
    await headerButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'hamburger-test-04-menu-clicked.png' });
    console.log('Screenshot 4: After clicking header button');
  }

  // Step 11: Inspect the nav element's computed styles
  const navElement = page.locator('nav').first();
  const navStyles = await navElement.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      backdropFilter: computed.backdropFilter,
      webkitBackdropFilter: (computed as unknown as Record<string, string>)['webkitBackdropFilter'] ?? '',
      backgroundColor: computed.backgroundColor,
      background: computed.background,
      isolation: computed.isolation,
      contain: computed.contain,
      opacity: computed.opacity,
      willChange: computed.willChange,
      transform: computed.transform,
      display: computed.display,
      position: computed.position,
      zIndex: computed.zIndex,
    };
  });

  console.log('\n=== NAV ELEMENT COMPUTED STYLES ===');
  console.log(JSON.stringify(navStyles, null, 2));

  // Look for any element with backdrop-filter
  const elementsWithBackdrop = await page.evaluate(() => {
    const elements: string[] = [];
    const all = document.querySelectorAll('*');
    all.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.backdropFilter && style.backdropFilter !== 'none') {
        elements.push(`${el.tagName}.${el.className?.split(' ').slice(0, 3).join('.')}: ${style.backdropFilter}`);
      }
    });
    return elements;
  });

  console.log('\n=== ELEMENTS WITH BACKDROP-FILTER ===');
  console.log(elementsWithBackdrop.length > 0 ? elementsWithBackdrop.join('\n') : 'No elements with backdrop-filter found');

  // Check for mobile menu overlay or panel
  const mobileMenus = page.locator('[data-state="open"], [aria-hidden="false"], .mobile-menu, .menu-open');
  const mobileMenuCount = await mobileMenus.count();
  console.log(`\nFound ${mobileMenuCount} potentially open menu elements`);

  // Final screenshot
  await page.screenshot({ path: 'hamburger-test-05-final.png', fullPage: true });
  console.log('Screenshot 5: Final state');

  // Report findings
  console.log('\n=== DIAGNOSIS REPORT ===');
  console.log('1. Check if backdrop-filter is applied:', navStyles.backdropFilter);
  console.log('2. WebKit backdrop-filter:', navStyles.webkitBackdropFilter);
  console.log('3. Background color (if fully opaque, blocks blur):', navStyles.backgroundColor);
  console.log('4. Isolation property:', navStyles.isolation);
  console.log('5. Contain property:', navStyles.contain);
});
