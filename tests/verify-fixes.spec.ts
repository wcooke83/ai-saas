import { test, expect } from '@playwright/test';

test.describe('Bug Fix Verification', () => {

  test('1. Signup page fix - verify form fields', async ({ page }) => {
    // Note: /signup redirects to /login?mode=signup
    await page.goto('http://localhost:3030/signup');
    await page.waitForLoadState('networkidle');

    // Verify title shows "Create an account" (signup mode)
    const title = page.getByRole('heading', { name: /create an account/i });
    await expect(title).toBeVisible();

    // Verify Full Name field exists
    const fullNameLabel = page.getByText('Full Name');
    await expect(fullNameLabel).toBeVisible();

    const fullNameInput = page.getByLabel(/full name/i);
    await expect(fullNameInput).toBeVisible();

    // Verify the submit button says "Sign Up" (not just a link)
    const signUpButton = page.getByRole('button', { name: /^sign up$/i });
    await expect(signUpButton).toBeVisible();

    await page.screenshot({
      path: 'tests/screenshots/fixes/1-signup-page-fix.png',
      fullPage: true
    });

    console.log('PASS: Signup page shows correct title, Full Name field, and Sign Up button');
  });

  test('2. Email Sequence Expand All fix', async ({ page }) => {
    await page.goto('http://localhost:3030/tools/email-sequence');
    await page.waitForLoadState('networkidle');

    // Fill out the required fields with more detailed content to encourage multiple emails
    // Sender name (required)
    await page.getByLabel(/your name/i).fill('John Smith');

    // Sender role
    await page.getByLabel(/your role/i).fill('Sales Director');

    // Sender company
    await page.getByLabel(/your company/i).fill('TechCorp Solutions');

    // Target audience (required, min 5 chars)
    await page.getByLabel(/who are you targeting/i).fill('CTOs and VP of Engineering at mid-size B2B SaaS companies with 50-500 employees');

    // Industry
    await page.getByLabel(/industry/i).fill('Technology and Software');

    // Campaign goal (required, min 10 chars)
    await page.getByLabel(/campaign goal/i).fill('Book discovery calls to discuss their current challenges with software development productivity and introduce our AI-powered code review platform');

    // Product/Service (required, min 3 chars)
    await page.getByLabel(/product\/service/i).fill('AI-Powered Code Review Platform');

    // Primary CTA
    await page.getByLabel(/primary cta/i).fill('Schedule a 30-minute demo');

    // Unique Value Proposition (required, min 10 chars)
    await page.getByLabel(/unique value proposition/i).fill('Reduce code review time by 60% while catching 3x more bugs with our AI that learns your codebase patterns and coding standards');

    // Pain points
    await page.getByLabel(/pain points/i).fill('Slow code reviews blocking deployments, inconsistent feedback quality, senior developers spending too much time on reviews');

    // Generate sequence
    const generateButton = page.getByRole('button', { name: /generate.*sequence/i });
    await generateButton.click();

    // Wait for sequence to generate (may take time due to AI)
    await page.waitForSelector('text=Generated Sequence', { timeout: 90000 });

    // Wait a moment for all content to render
    await page.waitForTimeout(1000);

    // Take screenshot before expand
    await page.screenshot({
      path: 'tests/screenshots/fixes/2a-email-sequence-before-expand.png',
      fullPage: true
    });

    // Look specifically for email card headers (they have the #N badge and aria-expanded)
    // These are within the Generated Sequence section
    const emailCardHeaders = page.locator('.rounded-lg.border button[aria-expanded]');
    const totalEmailCount = await emailCardHeaders.count();
    console.log(`Total email cards found: ${totalEmailCount}`);

    // Get how many are currently expanded
    const initialExpandedCount = await page.locator('.rounded-lg.border button[aria-expanded="true"]').count();
    console.log(`Initially expanded: ${initialExpandedCount}`);

    // Click Expand All
    const expandAllButton = page.getByRole('button', { name: /^expand all$/i });
    await expect(expandAllButton).toBeVisible();
    await expandAllButton.click();
    await page.waitForTimeout(1000);

    // Count expanded emails after clicking Expand All
    const expandedEmails = page.locator('.rounded-lg.border button[aria-expanded="true"]');
    const expandedCount = await expandedEmails.count();

    console.log(`After Expand All: ${expandedCount} of ${totalEmailCount} emails expanded`);

    await page.screenshot({
      path: 'tests/screenshots/fixes/2-email-sequence-expand-all.png',
      fullPage: true
    });

    // The fix is verified if:
    // 1. All emails are expanded (expandedCount === totalEmailCount), OR
    // 2. More emails are expanded than initially (proves Expand All does something)
    if (totalEmailCount > 1) {
      expect(expandedCount).toBe(totalEmailCount);
      console.log(`PASS: Expand All correctly expanded all ${totalEmailCount} emails`);
    } else {
      // If only 1 email was generated, verify it's expanded
      expect(expandedCount).toBeGreaterThanOrEqual(1);
      console.log(`NOTE: Only ${totalEmailCount} email(s) generated. Expand All button present and email is expanded.`);
    }
  });

  test('3. Dark mode fix - text visibility', async ({ page }) => {
    // Emulate dark color scheme at browser level
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('http://localhost:3030/tools/email-writer');
    await page.waitForLoadState('networkidle');

    // Also add dark class to html element
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      // Also set the data-theme attribute if used
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);

    // Fill textarea fields
    const purposeTextarea = page.getByLabel(/purpose/i);
    if (await purposeTextarea.isVisible()) {
      await purposeTextarea.fill('This is a test purpose to verify dark mode text visibility');
    }

    const keyPointsTextarea = page.getByLabel(/key points/i);
    if (await keyPointsTextarea.isVisible()) {
      await keyPointsTextarea.fill('Test key point 1\nTest key point 2\nTest key point 3');
    }

    // Also try generic textareas
    const textareas = page.locator('textarea');
    const count = await textareas.count();
    for (let i = 0; i < count; i++) {
      const textarea = textareas.nth(i);
      const value = await textarea.inputValue();
      if (!value) {
        await textarea.fill('Test content for dark mode visibility check');
      }
    }

    await page.waitForTimeout(500);

    // Verify text is visible by checking computed styles
    const textareaElements = await page.locator('textarea').all();
    let visibilityResults = [];

    for (const textarea of textareaElements) {
      const styles = await textarea.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        const color = computed.color;
        const backgroundColor = computed.backgroundColor;

        // Parse colors to check contrast
        const parseColor = (c: string) => {
          const match = c.match(/rgb\((\d+), (\d+), (\d+)\)/);
          if (match) {
            return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
          }
          return null;
        };

        const textColor = parseColor(color);
        const bgColor = parseColor(backgroundColor);

        // Calculate luminance
        const luminance = (c: {r: number, g: number, b: number}) => {
          return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
        };

        let hasContrast = true;
        if (textColor && bgColor) {
          const textLum = luminance(textColor);
          const bgLum = luminance(bgColor);
          // Check if there's reasonable contrast
          hasContrast = Math.abs(textLum - bgLum) > 0.2;
        }

        return {
          color,
          backgroundColor,
          opacity: computed.opacity,
          hasContrast,
          isDarkMode: document.documentElement.classList.contains('dark')
        };
      });
      visibilityResults.push(styles);
    }

    await page.screenshot({
      path: 'tests/screenshots/fixes/3-dark-mode-text-visibility.png',
      fullPage: true
    });

    console.log('Dark mode textarea styles:', JSON.stringify(visibilityResults, null, 2));

    // All textareas should have adequate contrast
    const allHaveContrast = visibilityResults.every(r => r.hasContrast);
    expect(allHaveContrast).toBe(true);
    console.log('PASS: All textareas have adequate text contrast for visibility');
  });
});
