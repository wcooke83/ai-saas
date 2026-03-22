import { test, expect } from '@playwright/test';

test('Hamburger Menu Blur Settings - Detailed Diagnosis', async ({ page }) => {
  await page.goto('/--sdk');
  await page.waitForLoadState('networkidle');

  // Scroll to find the Hamburger Menu section
  await page.evaluate(() => {
    const elements = document.querySelectorAll('h3, h4, span');
    for (const el of elements) {
      if (el.textContent?.includes('Hamburger Menu')) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        break;
      }
    }
  });
  await page.waitForTimeout(500);

  // Take screenshot of the hamburger menu section before enabling blur
  await page.screenshot({ path: 'blur-test-01-before.png' });
  console.log('Screenshot 1: Before enabling blur');

  // Find and click the Blur toggle
  // The toggle is near "Blur" text
  const blurToggle = page.locator('button[role="switch"]').filter({
    has: page.locator('xpath=preceding-sibling::*[contains(text(), "Blur")] | following-sibling::*[contains(text(), "Blur")]')
  }).first();

  // Alternative: find all switches and check which one is near "Blur"
  const allSwitches = await page.locator('button[role="switch"]').all();
  console.log(`Found ${allSwitches.length} switches`);

  // Find the blur toggle by looking at parent structure
  const blurSection = page.locator('div:has(> span:text("Blur"))').or(
    page.locator('div:has(> label:text("Blur"))')
  );

  // Click the first switch that's in the Hamburger Menu section
  // The hamburger menu section has "Blur" and "Gradient" toggles
  const hamburgerSection = page.locator('text=Hamburger Menu').locator('xpath=ancestor::div[contains(@class, "space-y")]').first();

  // Find toggles within or near the Hamburger Menu heading
  const blurLabel = page.locator('text=Blur').first();
  const blurToggleNearLabel = blurLabel.locator('xpath=following-sibling::button[@role="switch"] | preceding-sibling::button[@role="switch"] | ../button[@role="switch"]').first();

  // Try a simpler approach - get all switches and their nearby text
  for (let i = 0; i < allSwitches.length; i++) {
    const switchEl = allSwitches[i];
    const parent = switchEl.locator('xpath=..');
    const parentText = await parent.textContent();
    const switchState = await switchEl.getAttribute('data-state');
    console.log(`Switch ${i}: parent text="${parentText?.slice(0, 50)}", state=${switchState}`);
  }

  // Get the specific toggle near "Blur" text by evaluating in page context
  const blurToggleHandle = await page.evaluateHandle(() => {
    const allText = document.body.innerText;
    const elements = document.querySelectorAll('button[role="switch"]');
    for (const el of elements) {
      const parent = el.parentElement;
      if (parent?.textContent?.includes('Blur') && !parent?.textContent?.includes('Blur Intensity')) {
        return el;
      }
    }
    return null;
  });

  if (blurToggleHandle) {
    const blurToggleEl = blurToggleHandle.asElement();
    if (blurToggleEl) {
      console.log('Found blur toggle via JS');
      await blurToggleEl.click();
      await page.waitForTimeout(300);
    }
  }

  await page.screenshot({ path: 'blur-test-02-blur-enabled.png' });
  console.log('Screenshot 2: After enabling blur');

  // Now check for Blur Intensity controls that should appear
  const blurIntensitySection = page.locator('text=Blur Intensity');
  const isIntensityVisible = await blurIntensitySection.isVisible().catch(() => false);
  console.log(`Blur Intensity section visible: ${isIntensityVisible}`);

  if (isIntensityVisible) {
    // Click the 'lg' button
    const lgButton = page.locator('button:has-text("lg")').first();
    if (await lgButton.isVisible()) {
      await lgButton.click();
      console.log('Clicked lg blur intensity');
    }
  }

  // Look for Background Opacity slider
  const opacitySlider = page.locator('input[type="range"]').first();
  if (await opacitySlider.isVisible()) {
    // Set to 70%
    await opacitySlider.fill('70');
    console.log('Set opacity slider to 70');
  }

  await page.screenshot({ path: 'blur-test-03-settings-configured.png' });
  console.log('Screenshot 3: Settings configured');

  // Now click the hamburger menu to open it
  const menuButton = page.locator('button[aria-label="Open menu"]');
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await page.waitForTimeout(500);
    console.log('Clicked hamburger menu button');
  }

  await page.screenshot({ path: 'blur-test-04-menu-open.png' });
  console.log('Screenshot 4: Menu open');

  // Inspect all nav elements for backdrop-filter
  const navStyles = await page.evaluate(() => {
    const results: { selector: string; styles: Record<string, string> }[] = [];

    // Check nav elements
    document.querySelectorAll('nav').forEach((nav, i) => {
      const style = window.getComputedStyle(nav);
      results.push({
        selector: `nav[${i}] class="${nav.className?.slice(0, 100)}"`,
        styles: {
          backdropFilter: style.backdropFilter,
          backgroundColor: style.backgroundColor,
          opacity: style.opacity,
        }
      });
    });

    // Check any element that might be the mobile menu
    document.querySelectorAll('[class*="menu"], [class*="mobile"], [class*="nav"]').forEach((el, i) => {
      const style = window.getComputedStyle(el);
      if (style.backdropFilter !== 'none' || style.backgroundColor.includes('rgba')) {
        results.push({
          selector: `${el.tagName}[${i}] class="${el.className?.slice(0, 80)}"`,
          styles: {
            backdropFilter: style.backdropFilter,
            backgroundColor: style.backgroundColor,
          }
        });
      }
    });

    return results;
  });

  console.log('\n=== ELEMENT STYLES AFTER MENU OPEN ===');
  navStyles.forEach(item => {
    console.log(`\n${item.selector}`);
    console.log(JSON.stringify(item.styles, null, 2));
  });

  // Check for CSS custom properties related to blur
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const vars: Record<string, string> = {};

    // Check for menu-related CSS variables
    const varNames = [
      '--menu-bg', '--menu-blur', '--menu-opacity', '--blur-intensity',
      '--backdrop-blur', '--nav-blur', '--mobile-menu-bg'
    ];

    varNames.forEach(name => {
      const value = style.getPropertyValue(name);
      if (value) vars[name] = value;
    });

    // Also get all CSS variables
    const allVars: Record<string, string> = {};
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const rules = document.styleSheets[i].cssRules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j] as CSSStyleRule;
          if (rule.selectorText === ':root' || rule.selectorText === ':root, :host') {
            const style = rule.style;
            for (let k = 0; k < style.length; k++) {
              const prop = style[k];
              if (prop.startsWith('--') && (prop.includes('menu') || prop.includes('blur'))) {
                allVars[prop] = style.getPropertyValue(prop);
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    }

    return { computed: vars, fromRules: allVars };
  });

  console.log('\n=== CSS VARIABLES ===');
  console.log(JSON.stringify(cssVars, null, 2));

  // Final diagnosis
  console.log('\n=== FINAL DIAGNOSIS ===');

  // Check the actual mobile menu element specifically
  const mobileMenuDiagnosis = await page.evaluate(() => {
    // Find elements that look like mobile menus
    const candidates = [
      ...document.querySelectorAll('nav'),
      ...document.querySelectorAll('[class*="mobile"]'),
      ...document.querySelectorAll('[class*="Menu"]'),
      ...document.querySelectorAll('[data-state="open"]'),
    ];

    const diagnosis: string[] = [];

    candidates.forEach((el, i) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Only check visible elements
      if (rect.width > 0 && rect.height > 0) {
        const info = [
          `Element: ${el.tagName}.${el.className?.split(' ').slice(0, 3).join('.')}`,
          `  Position: ${style.position}`,
          `  Background: ${style.backgroundColor}`,
          `  Backdrop-filter: ${style.backdropFilter}`,
          `  -webkit-backdrop-filter: ${style.webkitBackdropFilter}`,
        ];

        // Check if background is fully opaque (which would block blur)
        const bgMatch = style.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (bgMatch) {
          const alpha = bgMatch[4] ? parseFloat(bgMatch[4]) : 1;
          if (alpha === 1) {
            info.push('  WARNING: Background is fully opaque - will block blur!');
          } else {
            info.push(`  Background alpha: ${alpha}`);
          }
        }

        diagnosis.push(info.join('\n'));
      }
    });

    return diagnosis;
  });

  console.log(mobileMenuDiagnosis.join('\n\n'));

  await page.screenshot({ path: 'blur-test-05-final.png', fullPage: true });
});
