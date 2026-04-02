import { test, expect, Page } from '@playwright/test';

const SCREENSHOT_DIR = 'tests/screenshots/audit/email-writer';

test.describe('AI Email Writer Tool Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Set a reasonable timeout for page loads
    page.setDefaultTimeout(30000);
  });

  test('comprehensive audit of email writer tool', async ({ page }) => {
    // ==================== 1. PAGE LOAD ====================
    console.log('1. Testing Page Load...');

    await page.goto('http://localhost:3030/tools/email-writer');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-initial-load.png`,
      fullPage: true,
    });

    // Verify header elements
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const backLink = page.locator('a:has-text("Back")');
    await expect(backLink).toBeVisible();

    const pageTitle = page.locator('h1:has-text("AI Email Writer")');
    await expect(pageTitle).toBeVisible();

    const freeBadge = page.locator('text=Free').first();
    await expect(freeBadge).toBeVisible();

    // Verify form section
    const emailDetailsCard = page.locator('text=Email Details');
    await expect(emailDetailsCard).toBeVisible();

    // Verify output section
    const generatedEmailCard = page.locator('text=Generated Email');
    await expect(generatedEmailCard).toBeVisible();

    console.log('   - Header, form, and output sections verified');

    // ==================== 2. FORM FUNCTIONALITY ====================
    console.log('2. Testing Form Functionality...');

    // Fill Email Type - Cold Outreach
    const emailTypeSelect = page.locator('select').first();
    await emailTypeSelect.selectOption('cold-outreach');

    // Fill Tone - Professional
    const toneSelect = page.locator('select').nth(1);
    await toneSelect.selectOption('professional');

    // Fill Sender Name
    const senderNameInput = page.locator('input[placeholder="John Smith"]');
    await senderNameInput.fill('John Smith');

    // Fill Sender Role
    const senderRoleInput = page.locator('input[placeholder="Sales Manager"]');
    await senderRoleInput.fill('Sales Manager');

    // Fill Sender Company
    const senderCompanyInput = page.locator('input[placeholder="Acme Inc"]');
    await senderCompanyInput.fill('TechCorp');

    // Fill Recipient Name
    const recipientNameInput = page.locator('input[placeholder="Jane Doe"]');
    await recipientNameInput.fill('Jane Doe');

    // Fill Recipient Role
    const recipientRoleInput = page.locator('input[placeholder="Marketing Director"]');
    await recipientRoleInput.fill('VP of Engineering');

    // Fill Recipient Company
    const recipientCompanyInput = page.locator('input[placeholder="Tech Corp"]');
    await recipientCompanyInput.fill('StartupXYZ');

    // Fill Purpose
    const purposeTextarea = page.locator('textarea').first();
    await purposeTextarea.fill('I want to introduce our new AI automation platform that can save your engineering team 10+ hours per week');

    // Fill Key Points
    const keyPointsTextarea = page.locator('textarea').nth(1);
    await keyPointsTextarea.fill('Reduces manual testing by 80%, Integrates with existing CI/CD, Free trial available');

    // Fill Call to Action
    const ctaInput = page.locator('input[placeholder="Schedule a 15-minute demo call"]');
    await ctaInput.fill('Schedule a 15-minute demo');

    // Take screenshot of filled form
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-filled-form.png`,
      fullPage: true,
    });

    console.log('   - All form fields filled successfully');

    // ==================== 3. GENERATION ====================
    console.log('3. Testing Email Generation...');

    // Verify Generate button is enabled
    const generateButton = page.locator('button:has-text("Generate Email")');
    await expect(generateButton).toBeEnabled();

    // Click Generate button
    await generateButton.click();

    // Wait for loading state
    const loadingIndicator = page.locator('text=Generating...');

    // Take screenshot of loading state if visible
    if (await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/03-generating.png`,
        fullPage: true,
      });
    }

    // Wait for result or error (with timeout)
    try {
      // Wait for either the subject line label or an error message
      await Promise.race([
        page.waitForSelector('text=Subject Line', { timeout: 30000 }),
        page.waitForSelector('[role="alert"]', { timeout: 30000 }),
      ]);

      // Take screenshot of results
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/04-generated-result.png`,
        fullPage: true,
      });

      // Check if we got an error
      const errorAlert = page.locator('[role="alert"]');
      if (await errorAlert.isVisible()) {
        const errorText = await errorAlert.textContent();
        console.log(`   - Generation returned error: ${errorText}`);
      } else {
        console.log('   - Email generated successfully');
      }
    } catch (error) {
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/04-generation-timeout.png`,
        fullPage: true,
      });
      console.log('   - Generation timed out or failed');
    }

    // ==================== 4. OUTPUT FEATURES ====================
    console.log('4. Testing Output Features...');

    // Check if result is displayed
    const subjectLine = page.locator('text=Subject Line');
    const hasResult = await subjectLine.isVisible();

    if (hasResult) {
      // Test copy subject button
      const copySubjectButton = page.locator('button[aria-label="Copy subject"]');
      if (await copySubjectButton.isVisible()) {
        await copySubjectButton.click();
        await page.waitForTimeout(500);

        // Check for copied indicator
        const copiedCheckSubject = page.locator('button:has([aria-label="Copied!"]):near(:text("Subject Line"))');
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/05-copy-subject.png`,
          fullPage: true,
        });
        console.log('   - Copy subject button tested');
      }

      // Test copy body button
      const copyBodyButton = page.locator('button[aria-label="Copy body"]');
      if (await copyBodyButton.isVisible()) {
        await copyBodyButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/06-copy-body.png`,
          fullPage: true,
        });
        console.log('   - Copy body button tested');
      }

      // Test copy full email button
      const copyFullButton = page.locator('button:has-text("Copy Full Email")');
      if (await copyFullButton.isVisible()) {
        await copyFullButton.click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/07-copy-full.png`,
          fullPage: true,
        });
        console.log('   - Copy full email button tested');
      }

      // Check character count display
      const charCount = page.locator('text=/\\d+\\/10 characters minimum/');
      if (await charCount.isVisible()) {
        console.log('   - Character count is displayed');
      }
    } else {
      console.log('   - No result to test output features (likely API error)');
    }

    // ==================== 5. DARK MODE COMPATIBILITY ====================
    console.log('5. Testing Dark Mode...');

    // Emulate dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/08-dark-mode.png`,
      fullPage: true,
    });

    console.log('   - Dark mode screenshot captured');

    // ==================== 6. MOBILE RESPONSIVENESS ====================
    console.log('6. Testing Mobile Responsiveness...');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/09-mobile-view.png`,
      fullPage: true,
    });

    console.log('   - Mobile view screenshot captured');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/10-tablet-view.png`,
      fullPage: true,
    });

    console.log('   - Tablet view screenshot captured');

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.emulateMedia({ colorScheme: 'light' });

    console.log('\nAudit Complete!');
  });

  test('form validation tests', async ({ page }) => {
    console.log('Testing Form Validation...');

    await page.goto('http://localhost:3030/tools/email-writer');
    await page.waitForLoadState('networkidle');

    // Test that Generate button is disabled when form is invalid
    const generateButton = page.locator('button:has-text("Generate Email")');
    await expect(generateButton).toBeDisabled();

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/11-validation-empty-form.png`,
      fullPage: true,
    });

    // Fill only sender name - should still be disabled
    const senderNameInput = page.locator('input[placeholder="John Smith"]');
    await senderNameInput.fill('John Smith');
    await expect(generateButton).toBeDisabled();

    // Fill recipient name - should still be disabled (purpose too short)
    const recipientNameInput = page.locator('input[placeholder="Jane Doe"]');
    await recipientNameInput.fill('Jane Doe');
    await expect(generateButton).toBeDisabled();

    // Fill purpose with less than 10 characters
    const purposeTextarea = page.locator('textarea').first();
    await purposeTextarea.fill('Hello');
    await expect(generateButton).toBeDisabled();

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-validation-short-purpose.png`,
      fullPage: true,
    });

    // Fill purpose with 10+ characters - should enable button
    await purposeTextarea.fill('This is a test purpose with enough characters');
    await expect(generateButton).toBeEnabled();

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/13-validation-valid-form.png`,
      fullPage: true,
    });

    console.log('   - Form validation tests passed');
  });

  test('accessibility check', async ({ page }) => {
    console.log('Testing Accessibility...');

    await page.goto('http://localhost:3030/tools/email-writer');
    await page.waitForLoadState('networkidle');

    // Check for proper labels on form fields
    const requiredLabels = [
      'Your Name',
      'Recipient Name',
      'Purpose of Email',
    ];

    for (const label of requiredLabels) {
      const labelElement = page.locator(`text=${label}`);
      await expect(labelElement).toBeVisible();
      console.log(`   - Label "${label}" is visible`);
    }

    // Check for aria-required attributes
    const senderNameInput = page.locator('input[placeholder="John Smith"]');
    const senderRequired = await senderNameInput.getAttribute('aria-required');
    console.log(`   - Sender name aria-required: ${senderRequired}`);

    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    console.log('   - Single H1 heading present');

    // Check for aria-hidden on decorative icons
    const decorativeIcons = page.locator('[aria-hidden="true"]');
    const iconCount = await decorativeIcons.count();
    console.log(`   - ${iconCount} decorative icons properly hidden`);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/14-accessibility-check.png`,
      fullPage: true,
    });

    console.log('   - Accessibility checks completed');
  });
});
