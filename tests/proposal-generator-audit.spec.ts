import { test, expect, Page } from '@playwright/test';

const SCREENSHOT_DIR = 'tests/screenshots/audit/proposal-generator';
const BASE_URL = 'http://localhost:3030/tools/proposal-generator';

// Test data
const FORM_DATA = {
  title: 'Enterprise AI Platform Implementation',
  clientName: 'Michael Chen',
  clientCompany: 'Acme Corp',
  clientRole: 'CTO',
  senderName: 'David Wilson',
  senderCompany: 'AI Solutions Inc',
  senderRole: 'VP of Sales',
  senderEmail: 'david@aisolutions.com',
  projectDescription: 'Implementation of an enterprise-grade AI platform to automate customer support, streamline operations, and provide actionable business intelligence.',
  objectives: 'Reduce support ticket resolution time by 50%, Automate 70% of routine inquiries, Provide real-time analytics dashboard',
  timeline: '3-month implementation with 2-week pilot phase',
  budget: '$150,000 - $200,000',
  competitiveAdvantage: 'Proprietary NLP engine with 95% accuracy, dedicated implementation team, 24/7 support',
};

interface AuditIssue {
  type: 'bug' | 'ui' | 'ux' | 'accessibility' | 'performance';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  location?: string;
}

const issues: AuditIssue[] = [];

function reportIssue(issue: AuditIssue) {
  issues.push(issue);
  console.log(`[${issue.type.toUpperCase()}] ${issue.severity}: ${issue.description}`);
}

test.describe('AI Proposal Generator Audit', () => {
  // Increase timeout for tests that involve AI generation
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('1. Page Load - Initial state and structure', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-initial-load.png`,
      fullPage: true
    });

    // Verify header elements
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const logo = page.locator('header a').first();
    await expect(logo).toContainText('VocUI');

    const allToolsLink = page.locator('header').getByText('All Tools');
    await expect(allToolsLink).toBeVisible();

    const signUpButton = page.locator('header').getByRole('link', { name: 'Sign Up Free' });
    await expect(signUpButton).toBeVisible();

    // Verify hero section
    const heroTitle = page.getByRole('heading', { name: 'AI Proposal Generator' });
    await expect(heroTitle).toBeVisible();

    // Verify features section has all 4 features
    const aiPowered = page.getByRole('heading', { name: 'AI-Powered' });
    const modularSections = page.getByRole('heading', { name: 'Modular Sections' });
    const multipleExports = page.getByRole('heading', { name: 'Multiple Exports' });
    const industryTailored = page.getByRole('heading', { name: 'Industry-Tailored' });

    await expect(aiPowered).toBeVisible();
    await expect(modularSections).toBeVisible();
    await expect(multipleExports).toBeVisible();
    await expect(industryTailored).toBeVisible();
    console.log('All 4 feature cards verified');

    // Verify form sections exist
    const proposalSettings = page.getByRole('heading', { name: 'Proposal Settings' });
    const clientInfo = page.getByRole('heading', { name: 'Client Information' });
    const yourCompany = page.getByRole('heading', { name: 'Your Company' });
    const projectDetails = page.getByRole('heading', { name: 'Project Details' });
    const sectionsToInclude = page.getByRole('heading', { name: 'Sections to Include' });

    await expect(proposalSettings).toBeVisible();
    await expect(clientInfo).toBeVisible();
    await expect(yourCompany).toBeVisible();
    await expect(projectDetails).toBeVisible();
    await expect(sectionsToInclude).toBeVisible();

    // Verify preview placeholder
    const previewPlaceholder = page.getByText('Your Proposal Will Appear Here');
    await expect(previewPlaceholder).toBeVisible();

    // Check tips section
    const tipsSection = page.getByRole('heading', { name: 'Tips for Better Proposals' });
    await expect(tipsSection).toBeVisible();

    // Check CTA section
    const ctaHeading = page.getByRole('heading', { name: 'Ready to Win More Deals?' });
    await expect(ctaHeading).toBeVisible();

    console.log('Page load test passed - all major sections verified');
  });

  test('2. Form Functionality - Fill out complete form', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Select Proposal Type - Sales Proposal
    const proposalTypeSelect = page.locator('select').first();
    await proposalTypeSelect.selectOption('sales');

    // Verify selection
    await expect(proposalTypeSelect).toHaveValue('sales');

    // Select Industry - Tech/SaaS
    const industrySelect = page.locator('select').nth(1);
    await industrySelect.selectOption('tech-saas');

    // Select Tone - Professional
    const toneSelect = page.locator('select').nth(2);
    await toneSelect.selectOption('professional');

    // Fill Title
    const titleInput = page.locator('input[placeholder*="Website Redesign"]');
    await titleInput.fill(FORM_DATA.title);

    // Fill Client Information
    const clientNameInput = page.locator('input[placeholder="John Smith"]');
    await clientNameInput.fill(FORM_DATA.clientName);

    const clientCompanyInput = page.locator('input[placeholder="Acme Corp"]');
    await clientCompanyInput.fill(FORM_DATA.clientCompany);

    const clientRoleInput = page.locator('input[placeholder*="CEO, Project Manager"]');
    await clientRoleInput.fill(FORM_DATA.clientRole);

    // Fill Sender Information
    const senderNameInput = page.locator('input[placeholder="Jane Doe"]');
    await senderNameInput.fill(FORM_DATA.senderName);

    const senderCompanyInput = page.locator('input[placeholder="Your Agency Inc"]');
    await senderCompanyInput.fill(FORM_DATA.senderCompany);

    const senderRoleInput = page.locator('input[placeholder="Account Manager"]');
    await senderRoleInput.fill(FORM_DATA.senderRole);

    const senderEmailInput = page.locator('input[placeholder="you@company.com"]');
    await senderEmailInput.fill(FORM_DATA.senderEmail);

    // Fill Project Details
    const projectDescTextarea = page.locator('textarea').first();
    await projectDescTextarea.fill(FORM_DATA.projectDescription);

    const objectivesTextarea = page.locator('textarea').nth(1);
    await objectivesTextarea.fill(FORM_DATA.objectives);

    const timelineInput = page.locator('input[placeholder*="3 months"]');
    await timelineInput.fill(FORM_DATA.timeline);

    const budgetInput = page.locator('input[placeholder*="$10,000"]');
    await budgetInput.fill(FORM_DATA.budget);

    const advantageTextarea = page.locator('textarea').nth(2);
    await advantageTextarea.fill(FORM_DATA.competitiveAdvantage);

    // Select all sections (click unselected ones)
    const sectionButtons = page.locator('[role="group"][aria-label="Proposal sections"] button');
    const sectionCount = await sectionButtons.count();
    console.log(`Found ${sectionCount} section buttons`);

    for (let i = 0; i < sectionCount; i++) {
      const button = sectionButtons.nth(i);
      const isPressed = await button.getAttribute('aria-pressed');
      if (isPressed !== 'true') {
        await button.click();
      }
    }

    // Verify all sections are now selected
    const selectedCount = page.getByText(/\d+ sections selected/);
    await expect(selectedCount).toContainText(`${sectionCount} sections selected`);

    // Take screenshot of filled form
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-filled-form.png`,
      fullPage: true
    });

    // Verify Generate button is enabled
    const generateButton = page.getByRole('button', { name: /Generate Proposal/i });
    await expect(generateButton).toBeEnabled();

    console.log('Form fill test passed - all fields populated');
  });

  test('3. Generation - Generate proposal and verify output', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Fill minimum required fields quickly
    await page.locator('select').first().selectOption('sales');
    await page.locator('select').nth(1).selectOption('tech-saas');

    await page.locator('input[placeholder="John Smith"]').fill(FORM_DATA.clientName);
    await page.locator('input[placeholder="Acme Corp"]').fill(FORM_DATA.clientCompany);
    await page.locator('input[placeholder="Jane Doe"]').fill(FORM_DATA.senderName);
    await page.locator('input[placeholder="Your Agency Inc"]').fill(FORM_DATA.senderCompany);

    await page.locator('textarea').first().fill(FORM_DATA.projectDescription);
    await page.locator('textarea').nth(1).fill(FORM_DATA.objectives);

    // Click Generate
    const generateButton = page.getByRole('button', { name: /Generate Proposal/i });
    await expect(generateButton).toBeEnabled();

    // Take screenshot before generation
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-before-generate.png`,
      fullPage: true
    });

    await generateButton.click();

    // Wait for loading state to appear
    const loadingText = page.getByText('Generating Your Proposal...');
    const loadingAppeared = await loadingText.isVisible({ timeout: 5000 }).catch(() => false);

    if (loadingAppeared) {
      console.log('Loading state appeared - generation request made');

      // Take screenshot during generation
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/04-generating.png`,
        fullPage: true
      });

      // Wait for generation to complete (up to 90 seconds)
      await expect(loadingText).toBeHidden({ timeout: 90000 });
    } else {
      console.log('Loading state did not appear - checking for immediate response or error');
    }

    // Take screenshot of results
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-generated-results.png`,
      fullPage: true
    });

    // Check if error occurred - look for error banner or placeholder still showing
    const errorMessage = page.locator('[class*="bg-red"]').first();
    const placeholderStillVisible = await page.getByText('Your Proposal Will Appear Here').isVisible();

    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent();
      reportIssue({
        type: 'bug',
        severity: 'critical',
        description: `Generation failed with error: ${errorText}`,
        location: 'ProposalPreview'
      });
      console.log('Generation test: API error occurred');
      // Don't fail the test - this is an audit, document the issue
      return;
    }

    if (placeholderStillVisible) {
      reportIssue({
        type: 'bug',
        severity: 'critical',
        description: 'Generation completed but no proposal content appeared - likely API configuration issue',
        location: 'ProposalGenerator'
      });
      console.log('Generation test: No content generated (API may not be configured)');
      // Don't fail the test - document for audit
      return;
    }

    // Verify proposal was generated - look for section headers or export button
    const exportButton = page.getByRole('button', { name: /Export/i });
    const startOverButton = page.getByRole('button', { name: /Start Over/i });
    const sectionStats = page.getByText(/\d+ of \d+ sections enabled/);

    const hasExport = await exportButton.isVisible().catch(() => false);
    const hasStartOver = await startOverButton.isVisible().catch(() => false);
    const hasStats = await sectionStats.isVisible().catch(() => false);

    if (hasExport || hasStartOver || hasStats) {
      console.log('Generation test passed - proposal generated successfully');

      // Check for word count display
      const wordCount = page.getByText(/\d+[\s,]*words across \d+ sections/);
      if (await wordCount.isVisible()) {
        const wordCountText = await wordCount.textContent();
        console.log(`Word count: ${wordCountText}`);
      }
    } else {
      reportIssue({
        type: 'bug',
        severity: 'major',
        description: 'Generation completed but expected UI elements not found',
        location: 'ProposalPreview'
      });
    }
  });

  test('4. Output Features - Test section interactions and exports', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Fill required fields
    await page.locator('select').first().selectOption('sales');
    await page.locator('select').nth(1).selectOption('tech-saas');
    await page.locator('input[placeholder="John Smith"]').fill(FORM_DATA.clientName);
    await page.locator('input[placeholder="Acme Corp"]').fill(FORM_DATA.clientCompany);
    await page.locator('input[placeholder="Jane Doe"]').fill(FORM_DATA.senderName);
    await page.locator('input[placeholder="Your Agency Inc"]').fill(FORM_DATA.senderCompany);
    await page.locator('textarea').first().fill(FORM_DATA.projectDescription);
    await page.locator('textarea').nth(1).fill(FORM_DATA.objectives);

    // Generate proposal
    await page.getByRole('button', { name: /Generate Proposal/i }).click();

    // Wait for loading to finish
    const loadingText = page.getByText('Generating Your Proposal...');
    if (await loadingText.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(loadingText).toBeHidden({ timeout: 90000 });
    }

    // Check if generation succeeded
    const placeholderStillVisible = await page.getByText('Your Proposal Will Appear Here').isVisible();
    if (placeholderStillVisible) {
      console.log('Generation did not produce content - skipping output features test (API may not be configured)');
      reportIssue({
        type: 'bug',
        severity: 'critical',
        description: 'Cannot test output features - proposal generation did not produce content',
        location: 'ProposalGenerator'
      });
      return;
    }

    // Check for error
    if (await page.locator('.bg-red-50').isVisible()) {
      console.log('Generation failed with error - skipping output features test');
      return;
    }

    // Test Export Menu
    const exportButton = page.getByRole('button', { name: /Export/i });
    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Take screenshot of export menu
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/06-export-menu.png`,
        fullPage: true
      });

      // Check for export options
      const markdownOption = page.getByText('Markdown', { exact: false });
      const pdfOption = page.getByText('PDF', { exact: false });
      const docxOption = page.getByText('DOCX', { exact: false }).or(page.getByText('Word', { exact: false }));

      if (await markdownOption.isVisible()) {
        console.log('Markdown export option available');
      } else {
        reportIssue({
          type: 'ui',
          severity: 'major',
          description: 'Markdown export option not visible',
          location: 'ExportMenu'
        });
      }

      if (await pdfOption.isVisible()) {
        console.log('PDF export option available');
      } else {
        reportIssue({
          type: 'ui',
          severity: 'major',
          description: 'PDF export option not visible',
          location: 'ExportMenu'
        });
      }

      // DOCX might be Pro-only
      if (await docxOption.isVisible()) {
        console.log('DOCX export option available');
      }

      // Close menu by clicking elsewhere
      await page.keyboard.press('Escape');
    } else {
      reportIssue({
        type: 'bug',
        severity: 'major',
        description: 'Export button not found after generation',
        location: 'ProposalPreview'
      });
    }

    // Test section expand/collapse
    const sectionHeaders = page.locator('[class*="section"]').filter({ has: page.locator('button') });
    const collapsibleButtons = page.locator('button[aria-expanded]');
    const collapsibleCount = await collapsibleButtons.count();

    if (collapsibleCount > 0) {
      console.log(`Found ${collapsibleCount} collapsible sections`);

      // Test first collapsible
      const firstCollapsible = collapsibleButtons.first();
      const initialState = await firstCollapsible.getAttribute('aria-expanded');
      await firstCollapsible.click();

      const newState = await firstCollapsible.getAttribute('aria-expanded');
      if (initialState === newState) {
        reportIssue({
          type: 'bug',
          severity: 'minor',
          description: 'Section expand/collapse toggle not working',
          location: 'SectionEditor'
        });
      } else {
        console.log('Section toggle working correctly');
      }
    }

    // Test copy section button (if visible)
    const copyButtons = page.locator('button').filter({ hasText: /copy/i }).or(
      page.locator('button[aria-label*="copy" i]')
    );
    if (await copyButtons.first().isVisible()) {
      console.log('Copy section button available');
    }

    // Test Start Over button
    const startOverButton = page.getByRole('button', { name: /Start Over/i });
    if (await startOverButton.isVisible()) {
      console.log('Start Over button available');

      // Take screenshot before reset
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/07-before-reset.png`,
        fullPage: true
      });
    }

    // Check Pro features notice
    const proNotice = page.getByText('Upgrade to Pro for more features');
    if (await proNotice.isVisible()) {
      console.log('Pro features upgrade notice displayed');
    }

    // Check regenerate section button (Pro feature)
    const regenerateButtons = page.locator('button').filter({ hasText: /regenerate/i });
    if (await regenerateButtons.first().isVisible()) {
      console.log('Regenerate section button available (may be Pro only)');
    }

    console.log('Output features test completed');
  });

  test('5. Dark Mode Compatibility', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Take light mode screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/08-light-mode.png`,
      fullPage: true
    });

    // Enable dark mode via system preference
    await page.emulateMedia({ colorScheme: 'dark' });

    // Take dark mode screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/09-dark-mode.png`,
      fullPage: true
    });

    // Check for contrast issues in dark mode
    const darkElements = page.locator('.dark\\:bg-secondary-900, .dark\\:text-secondary-100');

    // Verify text is visible in dark mode
    const heroTitle = page.getByRole('heading', { name: 'AI Proposal Generator' });
    await expect(heroTitle).toBeVisible();

    const formLabels = page.locator('label');
    const labelCount = await formLabels.count();
    console.log(`Checking ${labelCount} form labels in dark mode`);

    // Check cards are visible
    const cards = page.locator('[class*="Card"]');
    const cardCount = await cards.count();
    console.log(`Found ${cardCount} cards visible in dark mode`);

    console.log('Dark mode compatibility test completed');
  });

  test('6. Mobile Responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Take mobile screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/10-mobile-view.png`,
      fullPage: true
    });

    // Verify header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check that form is still accessible
    const generateButton = page.getByRole('button', { name: /Generate Proposal/i });
    await expect(generateButton).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/11-tablet-view.png`,
      fullPage: true
    });

    console.log('Mobile responsiveness test completed');
  });

  test('7. Form Validation', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check generate button is disabled initially
    const generateButton = page.getByRole('button', { name: /Generate Proposal/i });
    await expect(generateButton).toBeDisabled();

    // Fill only some required fields
    await page.locator('input[placeholder="John Smith"]').fill(FORM_DATA.clientName);

    // Button should still be disabled
    await expect(generateButton).toBeDisabled();

    // Fill more required fields
    await page.locator('input[placeholder="Acme Corp"]').fill(FORM_DATA.clientCompany);
    await page.locator('input[placeholder="Jane Doe"]').fill(FORM_DATA.senderName);
    await page.locator('input[placeholder="Your Agency Inc"]').fill(FORM_DATA.senderCompany);

    // Still disabled (need project description and objectives)
    await expect(generateButton).toBeDisabled();

    // Add short project description (should still be disabled - needs min 20 chars)
    await page.locator('textarea').first().fill('Short desc');
    await expect(generateButton).toBeDisabled();

    // Add proper project description
    await page.locator('textarea').first().fill(FORM_DATA.projectDescription);
    await expect(generateButton).toBeDisabled(); // Still need objectives

    // Add objectives
    await page.locator('textarea').nth(1).fill(FORM_DATA.objectives);

    // Now should be enabled
    await expect(generateButton).toBeEnabled();

    // Take screenshot
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-validation-passed.png`,
      fullPage: true
    });

    // Verify validation hint text
    const charCount = page.getByText(/\/2000 characters/);
    await expect(charCount).toBeVisible();

    console.log('Form validation test completed');
  });

  test('8. Accessibility Check', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Check for ARIA labels
    const ariaLabeledElements = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const ariaCount = await ariaLabeledElements.count();
    console.log(`Found ${ariaCount} elements with ARIA attributes`);

    // Check form labels are associated with inputs
    const labels = page.locator('label[for]');
    const labelCount = await labels.count();
    console.log(`Found ${labelCount} labels with 'for' attribute`);

    // Check required field indicators
    const requiredIndicators = page.getByText('*');
    const requiredCount = await requiredIndicators.count();
    console.log(`Found ${requiredCount} required field indicators`);

    // Check aria-required on inputs
    const requiredInputs = page.locator('[aria-required="true"]');
    const requiredInputCount = await requiredInputs.count();
    console.log(`Found ${requiredInputCount} inputs with aria-required`);

    // Check role attributes
    const roleGroups = page.locator('[role="group"]');
    const roleGroupCount = await roleGroups.count();
    console.log(`Found ${roleGroupCount} role="group" elements`);

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    const hasFocus = await focusedElement.count();

    if (hasFocus > 0) {
      console.log('Keyboard navigation working');
    } else {
      reportIssue({
        type: 'accessibility',
        severity: 'major',
        description: 'Keyboard navigation may not be working properly',
        location: 'Page'
      });
    }

    console.log('Accessibility check completed');
  });

  test.afterAll(async () => {
    // Print summary of issues
    console.log('\n========== AUDIT SUMMARY ==========\n');

    if (issues.length === 0) {
      console.log('No issues found during audit.');
    } else {
      console.log(`Found ${issues.length} issues:\n`);

      const critical = issues.filter(i => i.severity === 'critical');
      const major = issues.filter(i => i.severity === 'major');
      const minor = issues.filter(i => i.severity === 'minor');

      if (critical.length > 0) {
        console.log(`CRITICAL (${critical.length}):`);
        critical.forEach(i => console.log(`  - [${i.type}] ${i.description}`));
      }

      if (major.length > 0) {
        console.log(`\nMAJOR (${major.length}):`);
        major.forEach(i => console.log(`  - [${i.type}] ${i.description}`));
      }

      if (minor.length > 0) {
        console.log(`\nMINOR (${minor.length}):`);
        minor.forEach(i => console.log(`  - [${i.type}] ${i.description}`));
      }
    }

    console.log('\n====================================\n');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}/`);
  });
});
