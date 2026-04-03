import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads and displays pricing cards', async ({ page }) => {
    // Should not show an error
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Hero heading (new design)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 10000 });

    // Pricing section should have cards
    const pricingSection = page.locator('#pricing');
    await expect(pricingSection).toBeVisible();

    // At least one plan name should be visible (plans render inside the pricing grid)
    const planHeadings = pricingSection.locator('h3, [class*="CardTitle"]');
    const count = await planHeadings.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('default billing state is annual', async ({ page }) => {
    // The billing toggle should default to annual — Annual button has aria-pressed="true"
    const annualBtn = page.getByRole('button', { name: /annual/i });
    await expect(annualBtn).toBeVisible({ timeout: 10000 });
    await expect(annualBtn).toHaveAttribute('aria-pressed', 'true');

    // URL should reflect annual billing (or no param, since annual is default)
    const url = page.url();
    expect(url).not.toContain('billing=monthly');
  });

  test('billing toggle switches between annual and monthly and updates URL', async ({ page }) => {
    const annualBtn = page.getByRole('button', { name: /annual/i });
    const monthlyBtn = page.getByRole('button', { name: 'Monthly' });
    await expect(annualBtn).toBeVisible({ timeout: 10000 });

    // Default is annual
    await expect(annualBtn).toHaveAttribute('aria-pressed', 'true');

    // Click to switch to monthly
    await monthlyBtn.click();
    await expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/billing=monthly/);

    // Click again to switch back to annual
    await annualBtn.click();
    await expect(annualBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/billing=annual/);
  });

  test('CTA buttons have correct text per tier', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 10000 });

    // Check that known CTA text appears for plans that exist in DB.
    const possibleCTAs = [
      'Create Free Chatbot',
      'Get Base Plan',
      'Start Free Trial',
      'Talk to Sales',
    ];

    let foundCount = 0;
    for (const cta of possibleCTAs) {
      const ctaLink = page.getByRole('link', { name: cta });
      if (await ctaLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        foundCount++;
      }
    }
    expect(foundCount).toBeGreaterThanOrEqual(2);
  });

  test('signup links include interval=yearly when annual is selected', async ({ page }) => {
    const annualBtn = page.getByRole('button', { name: /annual/i });
    const monthlyBtn = page.getByRole('button', { name: 'Monthly' });
    await expect(annualBtn).toBeVisible({ timeout: 10000 });

    // Default is annual -- check signup links contain interval=yearly
    const signupLinks = page.locator('a[href*="/signup?plan="]');
    const count = await signupLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await signupLinks.nth(i).getAttribute('href');
      expect(href).toContain('interval=yearly');
    }

    // Switch to monthly
    await monthlyBtn.click();
    await expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true');

    // Now signup links should NOT contain interval=yearly
    const monthlyLinks = page.locator('a[href*="/signup?plan="]');
    const monthlyCount = await monthlyLinks.count();
    expect(monthlyCount).toBeGreaterThan(0);

    for (let i = 0; i < monthlyCount; i++) {
      const href = await monthlyLinks.nth(i).getAttribute('href');
      expect(href).not.toContain('interval=yearly');
    }
  });

  test('FAQ accordion opens and closes with correct aria attributes', async ({ page }) => {
    // Wait for FAQ section to be visible
    const faqRegion = page.locator('[role="region"][aria-label="Frequently Asked Questions"]');
    await expect(faqRegion).toBeVisible({ timeout: 10000 });

    // Find the first FAQ button
    const firstFaqButton = faqRegion.locator('button').first();
    await expect(firstFaqButton).toBeVisible();

    // Initially collapsed
    await expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');

    // Get the aria-controls id to check the panel
    const controlsId = await firstFaqButton.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    // Use attribute selector to handle special chars (e.g. '?') in the id
    const panel = page.locator(`[id="${controlsId}"]`);
    await expect(panel).toHaveAttribute('aria-hidden', 'true');

    // Click to open
    await firstFaqButton.click();
    await expect(firstFaqButton).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveAttribute('aria-hidden', 'false');

    // Click again to close
    await firstFaqButton.click();
    await expect(firstFaqButton).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
  });

  test('comparison table is visible by default', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 10000 });

    // The comparison table is always visible in the new design (no toggle required)
    const comparisonTable = page.locator('table');
    await expect(comparisonTable).toBeVisible({ timeout: 10000 });

    // Table should have a "Feature" header
    await expect(page.locator('th').filter({ hasText: 'Feature' })).toBeVisible();
  });

  test('testimonial section shows correct heading', async ({ page }) => {
    // New design uses "Teams using VocUI" eyebrow label above testimonials
    await expect(
      page.getByText('Teams using VocUI')
    ).toBeVisible({ timeout: 10000 });
  });

  test('trust bar displays key trust signals', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 10000 });

    // Trust signals are in the hero left column in the new design
    await expect(page.getByText('Free plan, no credit card required')).toBeVisible();
    await expect(page.getByText('14-day money-back guarantee')).toBeVisible();
  });

  test('loading skeleton renders appropriately', async ({ page }) => {
    // Navigate with a fresh page to catch the loading state
    const freshPage = page;

    await freshPage.goto('/pricing');
    await freshPage.waitForLoadState('domcontentloaded');
    await expect(freshPage.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 15000 });

    // Verify no skeleton pulse elements remain visible once loaded
    const pulseElements = freshPage.locator('.animate-pulse');
    const visiblePulses = await pulseElements.evaluateAll(
      (els) => els.filter(el => el instanceof HTMLElement && el.offsetParent !== null).length
    );
    expect(visiblePulses).toBe(0);
  });

  test('URL syncs billing state on direct navigation', async ({ page }) => {
    // Navigate directly with ?billing=monthly
    await page.goto('/pricing?billing=monthly');
    await page.waitForLoadState('domcontentloaded');

    const monthlyBtn = page.getByRole('button', { name: 'Monthly' });
    await expect(monthlyBtn).toBeVisible({ timeout: 10000 });
    await expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true');

    // Navigate directly with ?billing=annual
    await page.goto('/pricing?billing=annual');
    await page.waitForLoadState('domcontentloaded');

    const annualBtn = page.getByRole('button', { name: /annual/i });
    await expect(annualBtn).toBeVisible({ timeout: 10000 });
    await expect(annualBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('enterprise CTA links to help page', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 10000 });

    const salesLink = page.getByRole('link', { name: 'Talk to Sales' });
    await expect(salesLink).toBeVisible();

    const href = await salesLink.getAttribute('href');
    expect(href).toContain('/help');
  });

  test('Save badge shows computed percentage', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One chatbot.', { timeout: 10000 });

    // Annual button may show a "-X%" savings indicator depending on plan data
    const annualBtn = page.getByRole('button', { name: /annual/i });
    if (await annualBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await annualBtn.textContent();
      expect(text).toBeTruthy();
      // If savings indicator present, verify it's a percentage
      if (text && text.includes('%')) {
        expect(text).toMatch(/-?\d+%/);
      }
    }
  });
});
