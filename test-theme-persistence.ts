import { chromium } from 'playwright';

async function testThemePersistence() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  const getColors = async () => {
    return await page.evaluate(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      const htmlClass = document.documentElement.className;
      return {
        htmlClass,
        accordionBorder: computedStyle.getPropertyValue('--accordion-border').trim(),
        accordionHeaderBg: computedStyle.getPropertyValue('--accordion-header-bg').trim(),
        accordionTitle: computedStyle.getPropertyValue('--accordion-title').trim(),
        primary500: computedStyle.getPropertyValue('--primary-500').trim(),
        primary600: computedStyle.getPropertyValue('--primary-600').trim(),
        secondary700: computedStyle.getPropertyValue('--secondary-700').trim(),
        pageBg: computedStyle.getPropertyValue('--page-bg').trim(),
        cardBg: computedStyle.getPropertyValue('--card-bg').trim(),
      };
    });
  };

  // Step 1: Navigate and capture initial state
  console.log('Step 1: Navigating to http://localhost:3030/--sdk');
  await page.goto('http://localhost:3030/--sdk', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'theme-test-01-initial.png', fullPage: false });
  console.log('Screenshot saved: theme-test-01-initial.png');

  const initialColors = await getColors();
  console.log('\n=== INITIAL STATE (before loading theme) ===');
  console.log('HTML class: ' + initialColors.htmlClass);
  console.log(JSON.stringify(initialColors, null, 2));

  // Step 2: Load the theme file
  console.log('\nStep 2: Loading forest-grove-theme.json...');
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles('/home/wcooke/projects/ai-saas/docs/themes/forest-grove-theme.json');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'theme-test-02-theme-loaded.png', fullPage: false });
  console.log('Screenshot saved: theme-test-02-theme-loaded.png');

  const afterLoadColors = await getColors();
  console.log('\n=== AFTER LOADING THEME (in light mode) ===');
  console.log('HTML class: ' + afterLoadColors.htmlClass);
  console.log(JSON.stringify(afterLoadColors, null, 2));

  // Step 3: Click the "Dark mode" button in the header
  console.log('\nStep 3: Clicking Dark mode button in header...');
  const darkModeBtn = page.getByRole('banner').getByRole('button', { name: 'Dark mode' });
  if (await darkModeBtn.count() > 0) {
    await darkModeBtn.click();
    await page.waitForTimeout(1000);
    console.log('Clicked Dark mode button');
  } else {
    console.log('Dark mode button not found!');
  }

  await page.screenshot({ path: 'theme-test-03-dark-mode.png', fullPage: false });
  const darkModeColors = await getColors();
  console.log('\n=== DARK MODE (after clicking Dark mode button) ===');
  console.log('HTML class: ' + darkModeColors.htmlClass);
  console.log(JSON.stringify(darkModeColors, null, 2));

  // Step 4: Click the "Light mode" button
  console.log('\nStep 4: Clicking Light mode button...');
  const lightModeBtn = page.getByRole('banner').getByRole('button', { name: 'Light mode' });
  if (await lightModeBtn.count() > 0) {
    await lightModeBtn.click();
    await page.waitForTimeout(1000);
    console.log('Clicked Light mode button');
  } else {
    console.log('Light mode button not found!');
  }

  await page.screenshot({ path: 'theme-test-04-light-mode.png', fullPage: false });
  const lightModeColors = await getColors();
  console.log('\n=== LIGHT MODE (after clicking Light mode button) ===');
  console.log('HTML class: ' + lightModeColors.htmlClass);
  console.log(JSON.stringify(lightModeColors, null, 2));

  // Step 5: Switch back to Dark mode
  console.log('\nStep 5: Switching back to Dark mode...');
  const darkModeBtn2 = page.getByRole('banner').getByRole('button', { name: 'Dark mode' });
  if (await darkModeBtn2.count() > 0) {
    await darkModeBtn2.click();
    await page.waitForTimeout(1000);
    console.log('Clicked Dark mode button again');
  }

  await page.screenshot({ path: 'theme-test-05-dark-final.png', fullPage: false });
  const darkModeFinalColors = await getColors();
  console.log('\n=== DARK MODE FINAL (after toggling back) ===');
  console.log('HTML class: ' + darkModeFinalColors.htmlClass);
  console.log(JSON.stringify(darkModeFinalColors, null, 2));

  // Analysis
  console.log('\n' + '='.repeat(60));
  console.log('ANALYSIS: Theme Color Persistence');
  console.log('='.repeat(60));

  // Forest theme expected colors - from the theme file
  const forestLightExpected = {
    accordionTitle: '22 101 52',
    primary500: '34 197 94',
    pageBg: '250 253 249'
  };
  const forestDarkExpected = {
    accordionTitle: '187 247 208',
    primary500: '34 197 94',
    pageBg: '14 12 10'
  };

  // Default theme colors
  const defaultLight = {
    accordionTitle: '51 65 85',
    primary500: '14 165 233'
  };
  const defaultDark = {
    accordionTitle: '203 213 225',  // typical slate color
    primary500: '14 165 233'
  };

  console.log('\nExpected Forest Theme - LIGHT mode:');
  console.log('  accordion-title: ' + forestLightExpected.accordionTitle + ' (dark green)');
  console.log('  primary-500: ' + forestLightExpected.primary500 + ' (emerald)');
  console.log('  page-bg: ' + forestLightExpected.pageBg);

  console.log('\nExpected Forest Theme - DARK mode:');
  console.log('  accordion-title: ' + forestDarkExpected.accordionTitle + ' (light green)');
  console.log('  primary-500: ' + forestDarkExpected.primary500 + ' (emerald)');
  console.log('  page-bg: ' + forestDarkExpected.pageBg);

  console.log('\nActual Colors in LIGHT mode:');
  console.log('  accordion-title: ' + lightModeColors.accordionTitle);
  console.log('  primary-500: ' + lightModeColors.primary500);
  console.log('  page-bg: ' + lightModeColors.pageBg);

  console.log('\nActual Colors in DARK mode (final):');
  console.log('  accordion-title: ' + darkModeFinalColors.accordionTitle);
  console.log('  primary-500: ' + darkModeFinalColors.primary500);
  console.log('  page-bg: ' + darkModeFinalColors.pageBg);

  // Check if mode actually changed
  console.log('\n' + '-'.repeat(60));
  console.log('Mode change verification:');
  console.log('  Light mode HTML class: ' + lightModeColors.htmlClass);
  console.log('  Dark mode HTML class: ' + darkModeFinalColors.htmlClass);

  const modeChangedCorrectly = lightModeColors.htmlClass === 'light' && darkModeFinalColors.htmlClass === 'dark';
  console.log('  Mode toggle working: ' + (modeChangedCorrectly ? 'YES' : 'NO'));

  if (!modeChangedCorrectly) {
    console.log('\nWARNING: The mode toggle may not be working correctly.');
    console.log('Light mode class: ' + lightModeColors.htmlClass + ' (expected: light)');
    console.log('Dark mode class: ' + darkModeFinalColors.htmlClass + ' (expected: dark)');
  }

  const lightMatch = lightModeColors.accordionTitle === forestLightExpected.accordionTitle &&
                     lightModeColors.primary500 === forestLightExpected.primary500;
  const darkMatch = darkModeFinalColors.accordionTitle === forestDarkExpected.accordionTitle &&
                    darkModeFinalColors.primary500 === forestDarkExpected.primary500;

  console.log('\n' + '-'.repeat(60));
  console.log('Forest theme color persistence:');
  console.log('  Light mode colors match Forest theme: ' + (lightMatch ? 'YES' : 'NO'));
  console.log('  Dark mode colors match Forest theme: ' + (darkMatch ? 'YES' : 'NO'));

  // Check if colors reverted to defaults
  const lightRevertedToDefault = lightModeColors.primary500 === defaultLight.primary500;
  const darkRevertedToDefault = darkModeFinalColors.primary500 === defaultLight.primary500 ||
                                darkModeFinalColors.primary500 === defaultDark.primary500;

  if (lightRevertedToDefault) {
    console.log('\n  ISSUE: Light mode colors reverted to defaults (sky blue primary)');
  }
  if (darkRevertedToDefault) {
    console.log('\n  ISSUE: Dark mode colors reverted to defaults (sky blue primary)');
  }

  console.log('\n' + '='.repeat(60));
  if (lightMatch && darkMatch && modeChangedCorrectly) {
    console.log('RESULT: SUCCESS - Theme colors persist correctly in both modes');
    console.log('The Forest Grove theme remains applied when toggling between light and dark.');
  } else if (lightMatch && !darkMatch && modeChangedCorrectly) {
    console.log('RESULT: ISSUE - Dark mode colors do not match expected Forest theme');
    console.log('Possible causes:');
    console.log('  - Dark mode colors may be reverting to defaults');
    console.log('  - The theme may not be properly loading dark mode overrides');
  } else if (!lightMatch && darkMatch && modeChangedCorrectly) {
    console.log('RESULT: ISSUE - Light mode colors do not match expected Forest theme');
  } else if (!modeChangedCorrectly) {
    console.log('RESULT: ISSUE - Mode toggle not working correctly');
    console.log('Cannot properly test theme persistence without working mode toggle.');
  } else {
    console.log('RESULT: ISSUE - Theme colors do not persist correctly');
  }
  console.log('='.repeat(60));

  await browser.close();
}

testThemePersistence().catch(console.error);
