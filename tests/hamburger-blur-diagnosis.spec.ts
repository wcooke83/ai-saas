import { test, expect } from '@playwright/test';

test('Hamburger Menu Blur - Full Diagnosis', async ({ page }) => {
  await page.goto('/--sdk');
  await page.waitForLoadState('networkidle');

  // Step 1: Initial screenshot
  await page.screenshot({ path: 'blur-diag-01-initial.png' });
  console.log('Screenshot 1: Initial state');

  // Step 2: Scroll to and find the Hamburger Menu section
  await page.evaluate(() => {
    const sections = document.querySelectorAll('h3, h4, span, p');
    for (const el of sections) {
      if (el.textContent === 'Hamburger Menu') {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        break;
      }
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'blur-diag-02-hamburger-section.png' });
  console.log('Screenshot 2: Hamburger Menu section');

  // Step 3: Find and click the Blur toggle for Hamburger Menu
  // There are multiple Blur toggles - one for Header/Toolbar and one for Hamburger Menu
  // We need to find the one in the Hamburger Menu section

  const hamburgerMenuSection = await page.evaluate(() => {
    const sections = document.querySelectorAll('h3, h4, span, p');
    for (const el of sections) {
      if (el.textContent === 'Hamburger Menu') {
        // Find the parent container
        let parent = el.parentElement;
        while (parent && !parent.classList.contains('space-y-6')) {
          parent = parent.parentElement;
        }
        return parent ? parent.getBoundingClientRect() : null;
      }
    }
    return null;
  });

  console.log('Hamburger Menu section bounds:', hamburgerMenuSection);

  // Click the blur toggle that comes right after "Hamburger Menu" text
  // The structure is: heading -> flex container with switches
  const blurToggles = await page.locator('button[role="switch"]').all();
  console.log(`Found ${blurToggles.length} total switches`);

  // Identify each switch and its context
  for (let i = 0; i < blurToggles.length; i++) {
    const toggle = blurToggles[i];
    const parentText = await toggle.evaluate((el) => {
      const parent = el.parentElement;
      return parent?.textContent?.trim().slice(0, 30) || '';
    });
    const sectionTitle = await toggle.evaluate((el) => {
      // Look up the DOM tree to find section title
      let current = el.parentElement;
      for (let j = 0; j < 10; j++) {
        if (!current) break;
        const heading = current.querySelector('h3, h4');
        if (heading && heading.textContent?.includes('Menu')) {
          return heading.textContent;
        }
        current = current.parentElement;
      }
      return 'unknown';
    });
    console.log(`Switch ${i}: parent="${parentText}", section="${sectionTitle}"`);
  }

  // Find the Blur switch specifically in the Hamburger Menu section
  const menuBlurToggle = await page.evaluate(() => {
    const sections = document.querySelectorAll('h3, h4, span, p');
    for (const el of sections) {
      if (el.textContent === 'Hamburger Menu') {
        // Find the flex container with toggles
        const parent = el.closest('.space-y-6') || el.parentElement;
        if (parent) {
          // Look for the blur toggle in this section
          const toggles = parent.querySelectorAll('button[role="switch"]');
          for (const toggle of toggles) {
            const label = toggle.previousElementSibling || toggle.parentElement?.querySelector('span');
            if (label?.textContent?.includes('Blur') && !label.textContent.includes('Intensity')) {
              return {
                found: true,
                index: Array.from(document.querySelectorAll('button[role="switch"]')).indexOf(toggle as HTMLButtonElement)
              };
            }
          }
        }
      }
    }
    return { found: false, index: -1 };
  });

  console.log('Menu blur toggle:', menuBlurToggle);

  // Click the correct blur toggle
  if (menuBlurToggle.found && menuBlurToggle.index >= 0) {
    await blurToggles[menuBlurToggle.index].click();
    await page.waitForTimeout(300);
    console.log('Clicked menu blur toggle');
  }

  await page.screenshot({ path: 'blur-diag-03-blur-enabled.png' });
  console.log('Screenshot 3: After enabling blur');

  // Step 4: Check if Blur Intensity section appeared
  const blurIntensityVisible = await page.locator('text=Blur Intensity').isVisible();
  console.log(`Blur Intensity section visible: ${blurIntensityVisible}`);

  if (blurIntensityVisible) {
    // Click 'lg' button for blur intensity
    await page.locator('button:has-text("lg")').first().click();
    await page.waitForTimeout(200);
    console.log('Set blur intensity to lg');

    // Enable "Use Colour" toggle
    const useColourToggle = await page.evaluate(() => {
      const labels = document.querySelectorAll('span');
      for (const label of labels) {
        if (label.textContent === 'Use Colour') {
          const toggle = label.nextElementSibling as HTMLButtonElement;
          if (toggle && toggle.role === 'switch') {
            return Array.from(document.querySelectorAll('button[role="switch"]')).indexOf(toggle);
          }
        }
      }
      return -1;
    });

    if (useColourToggle >= 0) {
      await blurToggles[useColourToggle]?.click();
      await page.waitForTimeout(200);
      console.log('Enabled Use Colour');
    }

    await page.screenshot({ path: 'blur-diag-04-intensity-set.png' });
    console.log('Screenshot 4: Blur intensity and colour configured');

    // Set opacity slider to 70%
    const slider = page.locator('input[type="range"]').first();
    if (await slider.isVisible()) {
      await slider.evaluate((el: HTMLInputElement) => {
        el.value = '70';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      console.log('Set opacity to 70%');
    }
  }

  await page.screenshot({ path: 'blur-diag-05-settings-complete.png' });
  console.log('Screenshot 5: All settings configured');

  // Step 5: Click hamburger menu to open it
  const menuButton = page.locator('button[aria-label="Open menu"]');
  await menuButton.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'blur-diag-06-menu-open.png' });
  console.log('Screenshot 6: Menu opened');

  // Step 6: Deep inspection of the menu nav element
  const menuDiagnosis = await page.evaluate(() => {
    // Find all nav elements
    const navs = document.querySelectorAll('nav');
    const results: {
      tag: string;
      className: string;
      computed: Record<string, string>;
      inline: Record<string, string>;
      issues: string[];
    }[] = [];

    navs.forEach((nav) => {
      const computed = window.getComputedStyle(nav);
      const rect = nav.getBoundingClientRect();

      // Only inspect visible navs
      if (rect.width > 0 && rect.height > 0) {
        const issues: string[] = [];

        // Check backdrop-filter
        const backdropFilter = computed.backdropFilter;
        const webkitBackdropFilter = (computed as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter;

        if (backdropFilter === 'none' && !webkitBackdropFilter) {
          issues.push('backdrop-filter is "none" - blur is not being applied');
        }

        // Check background color opacity
        const bgColor = computed.backgroundColor;
        const bgMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (bgMatch) {
          const alpha = bgMatch[4] !== undefined ? parseFloat(bgMatch[4]) : 1;
          if (alpha === 1) {
            issues.push(`Background is fully opaque (${bgColor}) - this BLOCKS the blur effect from being visible`);
          } else if (alpha > 0.9) {
            issues.push(`Background alpha (${alpha}) is very high - blur will be barely visible`);
          }
        }

        // Check if there's content behind to blur
        const parent = nav.parentElement;
        const parentBg = parent ? window.getComputedStyle(parent).backgroundColor : 'none';

        results.push({
          tag: nav.tagName,
          className: String(nav.className).slice(0, 200),
          computed: {
            backdropFilter: String(backdropFilter),
            webkitBackdropFilter: String(webkitBackdropFilter || 'undefined'),
            backgroundColor: bgColor,
            background: computed.background.slice(0, 100),
            position: computed.position,
            zIndex: computed.zIndex,
            overflow: computed.overflow,
            isolation: computed.isolation,
            contain: computed.contain,
          },
          inline: {
            style: nav.getAttribute('style') || 'none',
          },
          issues,
        });
      }
    });

    return results;
  });

  console.log('\n====== MENU ELEMENT DIAGNOSIS ======');
  menuDiagnosis.forEach((nav, i) => {
    console.log(`\n--- NAV ${i} ---`);
    console.log(`Class: ${nav.className}`);
    console.log(`Inline style: ${nav.inline.style}`);
    console.log('Computed styles:');
    Object.entries(nav.computed).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    if (nav.issues.length > 0) {
      console.log('ISSUES:');
      nav.issues.forEach((issue) => console.log(`  - ${issue}`));
    }
  });

  // Check if backdrop-blur-lg class is present
  const hasBlurClass = await page.evaluate(() => {
    const navs = document.querySelectorAll('nav');
    return Array.from(navs).map((nav) => ({
      className: nav.className,
      hasBackdropBlur: /backdrop-blur-(sm|md|lg|xl|2xl|3xl)/.test(nav.className),
    }));
  });

  console.log('\n====== BLUR CLASS CHECK ======');
  hasBlurClass.forEach((item, i) => {
    console.log(`Nav ${i}: hasBackdropBlur=${item.hasBackdropBlur}`);
    console.log(`  Classes: ${item.className.slice(0, 200)}`);
  });

  // Check Tailwind's generated CSS for backdrop-blur-lg
  const tailwindBlurCSS = await page.evaluate(() => {
    const results: string[] = [];
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const rules = sheet.cssRules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j] as CSSStyleRule;
          if (rule.cssText?.includes('backdrop-blur-lg')) {
            results.push(rule.cssText.slice(0, 200));
          }
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    }
    return results;
  });

  console.log('\n====== TAILWIND BLUR CSS RULES ======');
  if (tailwindBlurCSS.length === 0) {
    console.log('WARNING: No backdrop-blur-lg CSS rule found! Tailwind may not be generating it.');
  } else {
    tailwindBlurCSS.forEach((rule) => console.log(rule));
  }

  // Final screenshot
  await page.screenshot({ path: 'blur-diag-07-final.png', fullPage: true });
  console.log('\nScreenshot 7: Final state (full page)');

  console.log('\n====== SUMMARY ======');
  console.log('Check the screenshots and console output above to identify:');
  console.log('1. Whether backdrop-filter CSS is being applied to the nav');
  console.log('2. Whether background-color is blocking the blur effect');
  console.log('3. Whether Tailwind is generating the backdrop-blur classes');
});
