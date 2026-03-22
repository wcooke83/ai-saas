import { chromium } from 'playwright';

async function testHamburgerMenu() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // Mobile viewport to show hamburger menu
  });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:3030/--sdk');
  await page.goto('http://localhost:3030/--sdk');
  await page.waitForLoadState('networkidle');

  // Take initial screenshot
  await page.screenshot({ path: 'hamburger-01-initial.png', fullPage: false });
  console.log('Screenshot: hamburger-01-initial.png');

  // 2. Click the hamburger menu button
  console.log('\n2. Looking for hamburger menu button...');

  // Find the menu button by aria-label
  const menuButton = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"]').first();
  await menuButton.waitFor({ state: 'visible', timeout: 5000 });
  await menuButton.click();
  await page.waitForTimeout(500);

  // Get the nav element style
  async function getNavStyles() {
    const navStyles = await page.evaluate(() => {
      // The nav is inside #sdk-nav-menu
      const navMenu = document.getElementById('sdk-nav-menu');
      const nav = navMenu?.querySelector('nav');
      if (!nav) return 'No nav element found in #sdk-nav-menu';
      const computed = window.getComputedStyle(nav);
      return {
        background: computed.background,
        backgroundColor: computed.backgroundColor,
        backdropFilter: computed.backdropFilter,
        webkitBackdropFilter: (computed as any).webkitBackdropFilter,
        className: nav.className,
        inlineStyle: nav.getAttribute('style'),
      };
    });
    return navStyles;
  }

  // Take screenshot with menu open
  await page.screenshot({ path: 'hamburger-02-menu-open.png', fullPage: false });
  console.log('Screenshot: hamburger-02-menu-open.png');

  let styles = await getNavStyles();
  console.log('\nInitial nav styles:', JSON.stringify(styles, null, 2));

  // Close menu
  await menuButton.click();
  await page.waitForTimeout(300);

  // 3. Scroll down to find the "Hamburger Menu" section
  console.log('\n3. Looking for Hamburger Menu section in SDK tabs...');

  // Scroll to the Hamburger Menu section
  await page.locator('h4:has-text("Hamburger Menu")').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'hamburger-03-section-found.png', fullPage: false });
  console.log('Screenshot: hamburger-03-section-found.png');

  // Find all switches on the page
  const allSwitches = await page.locator('button[role="switch"]').all();
  console.log(`\nFound ${allSwitches.length} toggle switches on page`);

  // Get the labels near each switch to understand the structure
  const switchInfo = await page.evaluate(() => {
    const switches = document.querySelectorAll('button[role="switch"]');
    return Array.from(switches).map((sw, idx) => {
      const parent = sw.parentElement;
      const labels = parent?.querySelectorAll('span');
      const labelText = labels ? Array.from(labels).map(l => l.textContent?.trim()).join(', ') : 'no labels';
      return { index: idx, label: labelText, state: sw.getAttribute('data-state') || sw.getAttribute('aria-checked') };
    });
  });
  console.log('Switch info:', JSON.stringify(switchInfo, null, 2));

  // Find the Blur toggle in the Hamburger Menu section
  // It's the one with "Blur" label in the Menu section (not "Blur Effect" in Header section)
  const blurToggle = page.locator('span:text-is("Blur")').locator('xpath=following-sibling::button[@role="switch"]').first();

  // Check current state
  console.log('\n--- Initial States ---');
  const blurState = await blurToggle.getAttribute('aria-checked');
  console.log('Blur toggle aria-checked:', blurState);

  // Test 1: Enable Blur
  console.log('\n--- Test 1: Enable Blur ---');

  if (blurState !== 'true') {
    await blurToggle.click();
    await page.waitForTimeout(500);
    console.log('Clicked Blur toggle');
  }

  // Open hamburger menu to check styles
  await menuButton.click();
  await page.waitForTimeout(500);
  styles = await getNavStyles();
  console.log('Nav styles with Blur ON:', JSON.stringify(styles, null, 2));
  await page.screenshot({ path: 'hamburger-05-blur-on.png', fullPage: false });
  console.log('Screenshot: hamburger-05-blur-on.png');
  await menuButton.click(); // close
  await page.waitForTimeout(300);

  // Test 2: With Blur ON, check Use Colour toggle
  console.log('\n--- Test 2: Blur ON, Use Colour OFF ---');
  await page.locator('h4:has-text("Hamburger Menu")').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Now that Blur is ON, "Use Colour" toggle should be visible
  const useColourToggle = page.locator('span:text-is("Use Colour")').locator('xpath=following-sibling::button[@role="switch"]').first();

  // Check if Use Colour exists now
  const useColourExists = await useColourToggle.count();
  console.log('Use Colour toggle exists:', useColourExists > 0);

  if (useColourExists > 0) {
    const useColourState = await useColourToggle.getAttribute('aria-checked');
    console.log('Use Colour aria-checked:', useColourState);

    // Make sure Use Colour is OFF first
    if (useColourState === 'true') {
      await useColourToggle.click();
      await page.waitForTimeout(300);
      console.log('Turned Use Colour OFF');
    }

    // Open menu and check styles
    await menuButton.click();
    await page.waitForTimeout(500);
    styles = await getNavStyles();
    console.log('Nav styles with Blur ON, Use Colour OFF:', JSON.stringify(styles, null, 2));
    await page.screenshot({ path: 'hamburger-06-blur-on-colour-off.png', fullPage: false });
    console.log('Screenshot: hamburger-06-blur-on-colour-off.png');
    await menuButton.click();
    await page.waitForTimeout(300);

    // Test 3: Blur ON, Use Colour ON
    console.log('\n--- Test 3: Blur ON, Use Colour ON ---');
    await page.locator('h4:has-text("Hamburger Menu")').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Turn Use Colour ON
    const currentColourState = await useColourToggle.getAttribute('aria-checked');
    if (currentColourState !== 'true') {
      await useColourToggle.click();
      await page.waitForTimeout(300);
      console.log('Turned Use Colour ON');
    }

    await menuButton.click();
    await page.waitForTimeout(500);
    styles = await getNavStyles();
    console.log('Nav styles with Blur ON, Use Colour ON:', JSON.stringify(styles, null, 2));
    await page.screenshot({ path: 'hamburger-07-blur-on-colour-on.png', fullPage: false });
    console.log('Screenshot: hamburger-07-blur-on-colour-on.png');
    await menuButton.click();
    await page.waitForTimeout(300);

    // Test 4: Blur ON, Use Colour ON, Gradient ON
    console.log('\n--- Test 4: Blur ON, Use Colour ON, Gradient ON ---');
    await page.locator('h4:has-text("Hamburger Menu")').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Gradient toggle should now be visible (when Use Colour is ON)
    const gradientToggle = page.locator('span:text-is("Gradient")').locator('xpath=following-sibling::button[@role="switch"]').first();
    const gradientExists = await gradientToggle.count();
    console.log('Gradient toggle exists:', gradientExists > 0);

    if (gradientExists > 0) {
      const gradientState = await gradientToggle.getAttribute('aria-checked');
      console.log('Gradient aria-checked:', gradientState);

      if (gradientState !== 'true') {
        await gradientToggle.click();
        await page.waitForTimeout(300);
        console.log('Turned Gradient ON');
      }

      await menuButton.click();
      await page.waitForTimeout(500);
      styles = await getNavStyles();
      console.log('Nav styles with Blur ON, Use Colour ON, Gradient ON:', JSON.stringify(styles, null, 2));
      await page.screenshot({ path: 'hamburger-08-all-on.png', fullPage: false });
      console.log('Screenshot: hamburger-08-all-on.png');
      await menuButton.click();
      await page.waitForTimeout(300);
    }
  }

  // Test 5: Turn Blur OFF
  console.log('\n--- Test 5: Blur OFF ---');
  await page.locator('h4:has-text("Hamburger Menu")').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  await blurToggle.click(); // Turn blur OFF
  await page.waitForTimeout(500);
  console.log('Turned Blur OFF');

  await menuButton.click();
  await page.waitForTimeout(500);
  styles = await getNavStyles();
  console.log('Nav styles with Blur OFF:', JSON.stringify(styles, null, 2));
  await page.screenshot({ path: 'hamburger-09-blur-off.png', fullPage: false });
  console.log('Screenshot: hamburger-09-blur-off.png');

  console.log('\n=== Test Complete ===');

  await browser.close();
}

testHamburgerMenu().catch(console.error);
