import { test, expect } from '@playwright/test';

test('Hamburger Menu Blur - Test UI Toggle Updates', async ({ page }) => {
  // Clear any existing settings
  await page.goto('/--sdk');
  await page.evaluate(() => localStorage.removeItem('ai-saas-ui-settings'));
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Step 1: Scroll to Hamburger Menu section
  await page.evaluate(() => {
    const sections = document.querySelectorAll('span, p, h3, h4');
    for (const el of sections) {
      if (el.textContent === 'Hamburger Menu') {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        break;
      }
    }
  });
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'blur-ui-01-initial.png' });

  // Step 2: Find the correct blur toggle for Hamburger Menu
  // Get switch 4 which was identified as the Hamburger Menu blur toggle
  const switches = await page.locator('button[role="switch"]').all();
  console.log(`Found ${switches.length} switches`);

  // Identify each switch
  for (let i = 0; i < switches.length; i++) {
    const parentText = await switches[i].evaluate((el) => {
      return el.parentElement?.textContent?.trim().slice(0, 30) || '';
    });
    console.log(`Switch ${i}: "${parentText}"`);
  }

  // The Hamburger Menu Blur toggle should be at index 4 (based on previous test)
  const menuBlurToggle = switches[4];
  const menuBlurToggleState = await menuBlurToggle.getAttribute('data-state');
  console.log(`\nMenu Blur toggle initial state: ${menuBlurToggleState}`);

  // Click to enable blur
  await menuBlurToggle.click();
  await page.waitForTimeout(300);

  // Check localStorage after clicking
  const settingsAfterClick = await page.evaluate(() => {
    const stored = localStorage.getItem('ai-saas-ui-settings');
    return stored ? JSON.parse(stored) : null;
  });
  console.log('\nSettings after clicking blur toggle:', settingsAfterClick);

  await page.screenshot({ path: 'blur-ui-02-blur-enabled.png' });

  // Step 3: Now open the hamburger menu and check if blur is applied
  const menuButton = page.locator('button[aria-label="Open menu"]');
  await menuButton.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'blur-ui-03-menu-open.png' });

  // Check the nav element
  const navState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    if (!nav) return null;
    const computed = window.getComputedStyle(nav);
    return {
      classList: Array.from(nav.classList).join(' '),
      backdropFilter: computed.backdropFilter,
      backgroundColor: computed.backgroundColor,
    };
  });

  console.log('\nNav state after UI toggle:');
  console.log('  classList:', navState?.classList);
  console.log('  backdropFilter:', navState?.backdropFilter);
  console.log('  backgroundColor:', navState?.backgroundColor);

  // Close menu
  await page.locator('button[aria-label="Close menu"]').click();
  await page.waitForTimeout(300);

  // Step 4: Enable "Use Colour" if available
  const updatedSwitches = await page.locator('button[role="switch"]').all();

  // Find "Use Colour" toggle
  const useColourIndex = await page.evaluate(() => {
    const switches = document.querySelectorAll('button[role="switch"]');
    for (let i = 0; i < switches.length; i++) {
      const parent = switches[i].parentElement;
      if (parent?.textContent?.includes('Use Colour')) {
        return i;
      }
    }
    return -1;
  });

  console.log(`\nUse Colour toggle index: ${useColourIndex}`);

  if (useColourIndex >= 0 && updatedSwitches[useColourIndex]) {
    await updatedSwitches[useColourIndex].click();
    await page.waitForTimeout(300);
    console.log('Clicked Use Colour toggle');
  }

  // Set blur intensity to 'lg'
  const lgButton = page.locator('button:has-text("lg")').first();
  if (await lgButton.isVisible()) {
    await lgButton.click();
    await page.waitForTimeout(200);
    console.log('Set blur intensity to lg');
  }

  // Set opacity slider to 50%
  const slider = page.locator('input[type="range"]').first();
  if (await slider.isVisible()) {
    await slider.evaluate((el: HTMLInputElement) => {
      el.value = '50';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    console.log('Set opacity to 50%');
  }

  await page.screenshot({ path: 'blur-ui-04-configured.png' });

  // Final settings check
  const finalSettings = await page.evaluate(() => {
    const stored = localStorage.getItem('ai-saas-ui-settings');
    return stored ? JSON.parse(stored) : null;
  });
  console.log('\nFinal settings in localStorage:', finalSettings);

  // Open menu again to see final result
  await page.locator('button[aria-label="Open menu"]').click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'blur-ui-05-final.png' });

  // Final nav check
  const finalNavState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    if (!nav) return null;
    const computed = window.getComputedStyle(nav);
    return {
      classList: Array.from(nav.classList).join(' '),
      backdropFilter: computed.backdropFilter,
      backgroundColor: computed.backgroundColor,
      inlineStyle: nav.getAttribute('style'),
    };
  });

  console.log('\nFinal nav state:');
  console.log('  classList:', finalNavState?.classList);
  console.log('  backdropFilter:', finalNavState?.backdropFilter);
  console.log('  backgroundColor:', finalNavState?.backgroundColor);
  console.log('  inlineStyle:', finalNavState?.inlineStyle);

  // ISSUE CHECK
  console.log('\n====== ANALYSIS ======');
  if (finalNavState?.backdropFilter === 'none' || !finalNavState?.backdropFilter) {
    console.log('ISSUE: backdrop-filter is still not being applied after UI toggle');
    console.log('Possible cause: React state might not be updating the Header component');
  } else if (finalNavState?.backdropFilter.includes('blur')) {
    console.log('SUCCESS: Blur is being applied correctly!');
  }
});
