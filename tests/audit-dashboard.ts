import { chromium } from 'playwright';

interface PageAudit {
  url: string;
  name: string;
  screenshot: string;
  wasRedirected: boolean;
  redirectedTo?: string;
  loadTime: number;
  elements: Record<string, boolean | number | string>;
  issues: string[];
  darkModeSupport: boolean;
}

async function auditDashboard() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const screenshotDir = '/home/wcooke/projects/ai-saas/tests/screenshots/audit/dashboard';
  const results: PageAudit[] = [];

  const dashboardPages = [
    { path: '/dashboard', name: 'Dashboard Main' },
    { path: '/dashboard/usage', name: 'Dashboard Usage' },
    { path: '/dashboard/profile', name: 'Dashboard Profile' },
    { path: '/dashboard/settings', name: 'Dashboard Settings' },
    { path: '/dashboard/api-keys', name: 'Dashboard API Keys' },
  ];

  for (const { path, name } of dashboardPages) {
    console.log(`\n========== Auditing: ${name} (${path}) ==========`);
    const audit: PageAudit = {
      url: `http://localhost:3030${path}`,
      name,
      screenshot: '',
      wasRedirected: false,
      loadTime: 0,
      elements: {},
      issues: [],
      darkModeSupport: false
    };

    const startTime = Date.now();

    try {
      const response = await page.goto(`http://localhost:3030${path}`, {
        waitUntil: 'networkidle',
        timeout: 15000
      });

      audit.loadTime = Date.now() - startTime;

      // Check if redirected
      const currentUrl = page.url();
      if (!currentUrl.includes(path)) {
        audit.wasRedirected = true;
        audit.redirectedTo = currentUrl;
        console.log(`  REDIRECTED to: ${currentUrl}`);
      }

      // Wait a bit for any animations
      await page.waitForTimeout(500);

      // Take light mode screenshot
      const screenshotName = name.toLowerCase().replace(/\s+/g, '-');
      const lightScreenshot = `${screenshotDir}/${screenshotName}-light.png`;
      await page.screenshot({ path: lightScreenshot, fullPage: true });
      audit.screenshot = lightScreenshot;
      console.log(`  Screenshot saved: ${lightScreenshot}`);

      // Check for dark mode toggle and test dark mode
      const darkModeToggle = await page.locator('[data-testid="theme-toggle"], button:has-text("Dark"), .theme-toggle, [aria-label*="theme"], [aria-label*="dark"]').first();
      if (await darkModeToggle.isVisible().catch(() => false)) {
        await darkModeToggle.click();
        await page.waitForTimeout(300);
        const darkScreenshot = `${screenshotDir}/${screenshotName}-dark.png`;
        await page.screenshot({ path: darkScreenshot, fullPage: true });
        console.log(`  Dark mode screenshot saved: ${darkScreenshot}`);
        audit.darkModeSupport = true;
        // Toggle back
        await darkModeToggle.click();
        await page.waitForTimeout(300);
      } else {
        // Check if page has dark class on html/body
        const hasDarkClass = await page.evaluate(() => {
          return document.documentElement.classList.contains('dark') ||
                 document.body.classList.contains('dark');
        });
        audit.darkModeSupport = hasDarkClass;
      }

      // Page-specific checks
      if (path === '/dashboard') {
        // Check for stats cards
        const statsCards = await page.locator('.stat-card, [class*="stat"], [class*="card"]').count();
        audit.elements['statsCards'] = statsCards;
        console.log(`  Stats cards found: ${statsCards}`);

        // Check for recent activity
        const activitySection = await page.locator('[class*="activity"], [class*="recent"], table, [role="list"]').count();
        audit.elements['activitySections'] = activitySection;
        console.log(`  Activity sections found: ${activitySection}`);

        // Check for welcome message
        const welcomeText = await page.locator('h1, h2').first().textContent().catch(() => '');
        audit.elements['headerText'] = welcomeText || 'None found';

      } else if (path === '/dashboard/usage') {
        // Check for usage stats
        const progressBars = await page.locator('progress, [role="progressbar"], [class*="progress"]').count();
        audit.elements['progressBars'] = progressBars;
        console.log(`  Progress bars found: ${progressBars}`);

        // Check for charts
        const charts = await page.locator('canvas, svg[class*="chart"], [class*="chart"]').count();
        audit.elements['charts'] = charts;
        console.log(`  Charts found: ${charts}`);

        // Check for usage numbers
        const usageNumbers = await page.locator('[class*="usage"], [class*="stat"]').count();
        audit.elements['usageStats'] = usageNumbers;

      } else if (path === '/dashboard/profile') {
        // Check for profile form
        const formInputs = await page.locator('input[type="text"], input[type="email"]').count();
        audit.elements['formInputs'] = formInputs;
        console.log(`  Form inputs found: ${formInputs}`);

        // Check for avatar upload
        const avatarUpload = await page.locator('input[type="file"], [class*="avatar"], [class*="upload"]').count();
        audit.elements['avatarUpload'] = avatarUpload > 0;
        console.log(`  Avatar upload area: ${avatarUpload > 0}`);

        // Check for save button
        const saveButton = await page.locator('button:has-text("Save"), button:has-text("Update"), button[type="submit"]').count();
        audit.elements['saveButton'] = saveButton > 0;

      } else if (path === '/dashboard/settings') {
        // Check for toggle switches
        const toggles = await page.locator('input[type="checkbox"], [role="switch"], [class*="toggle"], [class*="switch"]').count();
        audit.elements['toggles'] = toggles;
        console.log(`  Toggle switches found: ${toggles}`);

        // Check for settings sections
        const settingsSections = await page.locator('section, [class*="section"], fieldset').count();
        audit.elements['settingsSections'] = settingsSections;
        console.log(`  Settings sections found: ${settingsSections}`);

      } else if (path === '/dashboard/api-keys') {
        // Check for API key list
        const keyItems = await page.locator('[class*="key"], tr, [role="row"]').count();
        audit.elements['keyItems'] = keyItems;
        console.log(`  Key items found: ${keyItems}`);

        // Check for create button
        const createButton = await page.locator('button:has-text("Create"), button:has-text("Generate"), button:has-text("New")').count();
        audit.elements['createButton'] = createButton > 0;
        console.log(`  Create button: ${createButton > 0}`);

        // Check for delete buttons
        const deleteButtons = await page.locator('button:has-text("Delete"), button:has-text("Revoke"), [aria-label*="delete"]').count();
        audit.elements['deleteButtons'] = deleteButtons;
        console.log(`  Delete buttons found: ${deleteButtons}`);
      }

      // Check for loading states
      const loadingIndicators = await page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"]').count();
      if (loadingIndicators > 0) {
        audit.elements['hasLoadingStates'] = true;
        console.log(`  Loading indicators: ${loadingIndicators}`);
      }

      // Check for common UI issues
      // Overflow issues
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (hasHorizontalScroll) {
        audit.issues.push('Horizontal scroll detected - possible overflow issue');
      }

      // Check for empty states
      const emptyText = await page.locator(':text("No data"), :text("Empty"), :text("Nothing")').count();
      if (emptyText > 0) {
        audit.elements['hasEmptyState'] = true;
      }

      // Check for error messages
      const errorMessages = await page.locator('[class*="error"], [role="alert"]').count();
      if (errorMessages > 0) {
        audit.issues.push(`${errorMessages} error messages visible`);
      }

    } catch (error) {
      audit.issues.push(`Error loading page: ${error}`);
      console.log(`  ERROR: ${error}`);

      // Try to take screenshot anyway
      try {
        const screenshotName = name.toLowerCase().replace(/\s+/g, '-');
        await page.screenshot({ path: `${screenshotDir}/${screenshotName}-error.png`, fullPage: true });
      } catch {}
    }

    results.push(audit);
  }

  await browser.close();

  // Print summary
  console.log('\n\n========================================');
  console.log('           AUDIT SUMMARY');
  console.log('========================================\n');

  for (const result of results) {
    console.log(`\n${result.name} (${result.url})`);
    console.log('-'.repeat(50));
    console.log(`  Load time: ${result.loadTime}ms`);
    console.log(`  Redirected: ${result.wasRedirected ? `Yes -> ${result.redirectedTo}` : 'No'}`);
    console.log(`  Dark mode support: ${result.darkModeSupport ? 'Yes' : 'Not detected'}`);
    console.log(`  Screenshot: ${result.screenshot}`);

    if (Object.keys(result.elements).length > 0) {
      console.log('  Elements:');
      for (const [key, value] of Object.entries(result.elements)) {
        console.log(`    - ${key}: ${value}`);
      }
    }

    if (result.issues.length > 0) {
      console.log('  Issues:');
      for (const issue of result.issues) {
        console.log(`    ! ${issue}`);
      }
    }
  }

  return results;
}

auditDashboard().catch(console.error);
