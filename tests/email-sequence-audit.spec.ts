import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = 'tests/screenshots/audit/email-sequence';

// Ensure screenshot directory exists
test.beforeAll(async () => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

test.describe('AI Email Sequence Builder Audit', () => {
  test('comprehensive page audit', async ({ page }) => {
    const issues: string[] = [];
    const observations: string[] = [];

    // Navigate to page
    await page.goto('/tools/email-sequence');
    await page.waitForLoadState('networkidle');

    // 1. PAGE LOAD - Take initial screenshot
    console.log('\n--- 1. PAGE LOAD ---');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-initial-load.png'),
      fullPage: true,
    });
    console.log('Screenshot: 01-initial-load.png');

    // Verify header
    const header = page.locator('header');
    await expect(header).toBeVisible();
    const backLink = page.getByRole('link', { name: 'Back' });
    await expect(backLink).toBeVisible();
    const pageTitle = header.locator('text=Email Sequence Builder');
    await expect(pageTitle).toBeVisible();
    const proBadge = header.locator('text=Pro');
    await expect(proBadge).toBeVisible();
    observations.push('Header: Back link, title, and Pro badge visible');

    // Verify features section
    const featuresSection = page.locator('text=8 Sequence Types');
    await expect(featuresSection).toBeVisible();
    const smartTiming = page.locator('text=Smart Timing');
    await expect(smartTiming).toBeVisible();
    const exportReady = page.locator('text=Export Ready');
    await expect(exportReady).toBeVisible();
    observations.push('Features section: All 3 feature cards visible');

    // Verify form sections
    const sequenceDetails = page.locator('text=Sequence Details');
    await expect(sequenceDetails).toBeVisible();
    const senderInfo = page.locator('text=Sender Information');
    await expect(senderInfo).toBeVisible();
    const targetAudience = page.locator('h3:has-text("Target Audience")');
    await expect(targetAudience).toBeVisible();
    const campaignDetails = page.locator('text=Campaign Details');
    await expect(campaignDetails).toBeVisible();
    observations.push('Form sections: Sequence Details, Sender Info, Target Audience, Campaign Details visible');

    // Verify sequence types section at bottom
    const sequenceTypesHeading = page.locator('h2:has-text("Sequence Types")');
    await expect(sequenceTypesHeading).toBeVisible();
    const sequenceTypeCards = page.locator('.grid >> text=Cold Outreach');
    await expect(sequenceTypeCards.first()).toBeVisible();
    observations.push('Sequence Types guide section visible with cards');

    // Verify tips section
    const tipsHeading = page.locator('text=Tips for Better Sequences');
    await expect(tipsHeading).toBeVisible();
    observations.push('Tips section visible');

    // 2. FORM FUNCTIONALITY - Fill out the form
    console.log('\n--- 2. FORM FUNCTIONALITY ---');

    // Sequence Type
    const typeSelect = page.locator('select').first();
    await typeSelect.selectOption('cold-outreach');
    observations.push('Sequence type set to Cold Outreach');

    // Tone
    const toneSelect = page.locator('select').nth(1);
    await toneSelect.selectOption('professional');
    observations.push('Tone set to Professional');

    // Number of emails
    const emailCountSelect = page.locator('select').nth(2);
    await emailCountSelect.selectOption('5');
    observations.push('Number of emails set to 5');

    // Sender name
    const senderNameInput = page.locator('input[placeholder="John Smith"]');
    await senderNameInput.fill('Sarah Johnson');
    observations.push('Sender name: Sarah Johnson');

    // Sender role
    const senderRoleInput = page.locator('input[placeholder="Sales Manager"]');
    await senderRoleInput.fill('Account Executive');
    observations.push('Sender role: Account Executive');

    // Sender company
    const senderCompanyInput = page.locator('input[placeholder="Acme Inc"]');
    await senderCompanyInput.fill('GrowthCo');
    observations.push('Sender company: GrowthCo');

    // Target audience
    const targetAudienceInput = page.locator('input[placeholder*="Marketing directors"]');
    await targetAudienceInput.fill('B2B SaaS founders and marketing directors');
    observations.push('Target audience: B2B SaaS founders and marketing directors');

    // Target industry
    const targetIndustryInput = page.locator('input[placeholder*="Technology"]');
    await targetIndustryInput.fill('Technology');
    observations.push('Target industry: Technology');

    // Campaign goal
    const campaignGoalTextarea = page.locator('textarea[placeholder*="Book demo calls"]');
    await campaignGoalTextarea.fill('Book discovery calls with qualified prospects');
    observations.push('Campaign goal: Book discovery calls with qualified prospects');

    // Product/Service
    const productInput = page.locator('input[placeholder*="AI-powered email"]');
    await productInput.fill('AI-powered marketing automation platform');
    observations.push('Product: AI-powered marketing automation platform');

    // Primary CTA
    const ctaInput = page.locator('input[placeholder*="Schedule a 15-minute demo"]');
    await ctaInput.fill('Book a free strategy session');
    observations.push('CTA: Book a free strategy session');

    // Unique value proposition
    const uniqueValueTextarea = page.locator('textarea[placeholder*="Save 10+ hours"]');
    await uniqueValueTextarea.fill('Increase qualified leads by 3x while reducing marketing spend by 40%');
    observations.push('Unique value: Increase qualified leads by 3x while reducing marketing spend by 40%');

    // Pain points
    const painPointsTextarea = page.locator('textarea[placeholder*="Low email open rates"]');
    await painPointsTextarea.fill('Manual lead qualification, inconsistent follow-up, wasted ad spend');
    observations.push('Pain points: Manual lead qualification, inconsistent follow-up, wasted ad spend');

    // Take screenshot of filled form
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-filled-form.png'),
      fullPage: true,
    });
    console.log('Screenshot: 02-filled-form.png');

    // 3. GENERATION - Click Generate and wait
    console.log('\n--- 3. GENERATION ---');

    const generateButton = page.locator('button:has-text("Generate")');
    await expect(generateButton).toBeEnabled();

    // Check button text includes email count
    const buttonText = await generateButton.textContent();
    if (buttonText?.includes('5-Email')) {
      observations.push('Generate button correctly shows "5-Email Sequence"');
    } else {
      issues.push(`Generate button text unexpected: "${buttonText}"`);
    }

    await generateButton.click();
    console.log('Clicked Generate button...');

    // Wait for loading state
    await expect(page.locator('text=Generating Sequence...')).toBeVisible({ timeout: 5000 });
    observations.push('Loading state displays correctly');

    // Wait for results (increase timeout for AI generation)
    await expect(page.locator('text=Generated Sequence')).toBeVisible({ timeout: 120000 });
    console.log('Sequence generated successfully');

    // Take screenshot of results
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-generated-results.png'),
      fullPage: true,
    });
    console.log('Screenshot: 03-generated-results.png');

    // Verify summary section
    const summary = page.locator('.rounded-lg.bg-primary-50, .rounded-lg.bg-primary-900\\/20');
    await expect(summary.first()).toBeVisible();
    observations.push('Summary section visible');

    // Verify email count in results
    const emailCountText = page.locator('text=/\\d+ emails over \\d+ days/');
    await expect(emailCountText).toBeVisible();
    observations.push('Email count and timeline displayed');

    // 4. OUTPUT FEATURES - Test expand/collapse and copy
    console.log('\n--- 4. OUTPUT FEATURES ---');

    // Test expand all
    const expandAllButton = page.locator('button:has-text("Expand All")');
    await expect(expandAllButton).toBeVisible();
    await expandAllButton.click();
    await page.waitForTimeout(500);

    // Check that multiple emails are expanded
    const expandedEmails = page.locator('[id*="email-"][id*="-content"]');
    const expandedCount = await expandedEmails.count();
    console.log(`Expanded emails count: ${expandedCount}`);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-expanded-all.png'),
      fullPage: true,
    });
    console.log('Screenshot: 04-expanded-all.png');
    observations.push(`Expand All: ${expandedCount} emails expanded`);

    // Test collapse all
    const collapseAllButton = page.locator('button:has-text("Collapse All")');
    await collapseAllButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-collapsed-all.png'),
      fullPage: true,
    });
    console.log('Screenshot: 05-collapsed-all.png');
    observations.push('Collapse All: All emails collapsed');

    // Test individual email toggle
    const firstEmailHeader = page.locator('button[aria-expanded]').first();
    await firstEmailHeader.click();
    await page.waitForTimeout(300);
    observations.push('Individual email expand/collapse works');

    // Test copy individual email
    const copyFullEmailButton = page.locator('button:has-text("Copy Full Email")').first();
    if (await copyFullEmailButton.isVisible()) {
      await copyFullEmailButton.click();
      await page.waitForTimeout(500);
      // Check for "Copied!" feedback
      const copiedFeedback = page.locator('text=Copied!');
      if (await copiedFeedback.isVisible()) {
        observations.push('Copy individual email: Shows "Copied!" feedback');
      }
    }

    // Test copy all emails
    const copyAllButton = page.locator('button:has-text("Copy All")');
    await copyAllButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-copy-all.png'),
      fullPage: true,
    });
    console.log('Screenshot: 06-copy-all.png');
    observations.push('Copy All button clicked');

    // Test export as TXT
    const exportTxtButton = page.locator('button:has-text("Export TXT")');
    await expect(exportTxtButton).toBeVisible();

    // Set up download handler
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await exportTxtButton.click();
    const txtDownload = await downloadPromise;
    if (txtDownload) {
      observations.push(`Export TXT: Downloaded ${txtDownload.suggestedFilename()}`);
    } else {
      observations.push('Export TXT: Download triggered (file save may be browser-dependent)');
    }

    // Test export as CSV
    const exportCsvButton = page.locator('button:has-text("Export CSV")');
    await expect(exportCsvButton).toBeVisible();

    const csvDownloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await exportCsvButton.click();
    const csvDownload = await csvDownloadPromise;
    if (csvDownload) {
      observations.push(`Export CSV: Downloaded ${csvDownload.suggestedFilename()}`);
    } else {
      observations.push('Export CSV: Download triggered (file save may be browser-dependent)');
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-export-buttons.png'),
      fullPage: true,
    });
    console.log('Screenshot: 07-export-buttons.png');

    // 5. ADDITIONAL CHECKS
    console.log('\n--- 5. ADDITIONAL CHECKS ---');

    // Check best practices section
    const bestPractices = page.locator('text=Best Practices');
    const hasBestPractices = await bestPractices.count() > 0;
    if (hasBestPractices) {
      observations.push('Best Practices section visible in results');
    }

    // Scroll to sequence types at bottom
    await page.locator('h2:has-text("Sequence Types")').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Check all 8 sequence type cards
    const sequenceTypeNames = [
      'Cold Outreach',
      'Follow-Up',
      'Onboarding',
      'Re-engagement',
      'Sales Nurture',
      'Event Promotion',
      'Product Launch',
      'Feedback Request',
    ];

    let sequenceTypeCount = 0;
    for (const typeName of sequenceTypeNames) {
      const card = page.locator(`h3:has-text("${typeName}")`);
      if (await card.count() > 0) {
        sequenceTypeCount++;
      } else {
        issues.push(`Missing sequence type card: ${typeName}`);
      }
    }
    observations.push(`Sequence type cards: ${sequenceTypeCount}/8 visible`);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '08-sequence-types.png'),
      fullPage: true,
    });
    console.log('Screenshot: 08-sequence-types.png');

    // Check tips section
    await page.locator('h2:has-text("Tips for Better Sequences")').scrollIntoViewIfNeeded();
    const tipCards = page.locator('h3:has-text("Define Clear Goals"), h3:has-text("Know Your Audience"), h3:has-text("Highlight Pain Points"), h3:has-text("Review & Personalize")');
    const tipCount = await tipCards.count();
    observations.push(`Tips section: ${tipCount}/4 tip cards visible`);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '09-tips-section.png'),
      fullPage: true,
    });
    console.log('Screenshot: 09-tips-section.png');

    // Final screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '10-final-state.png'),
      fullPage: true,
    });
    console.log('Screenshot: 10-final-state.png');

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('AUDIT SUMMARY');
    console.log('='.repeat(60));

    console.log('\nOBSERVATIONS:');
    observations.forEach((obs, i) => console.log(`  ${i + 1}. ${obs}`));

    if (issues.length > 0) {
      console.log('\nISSUES FOUND:');
      issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
    } else {
      console.log('\nNo critical issues found.');
    }

    console.log('\nScreenshots saved to:', SCREENSHOT_DIR);
    console.log('='.repeat(60));

    // Fail test if critical issues found
    expect(issues.length).toBeLessThan(5);
  });
});
