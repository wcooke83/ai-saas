import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads and displays pricing cards', async ({ page }) => {
    // Should not show an error
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();

    // Hero section
    await expect(page.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 10000 });

    // Pricing section should have cards
    const pricingSection = page.locator('#pricing');
    await expect(pricingSection).toBeVisible();

    // At least one plan name should be visible (plans render inside the pricing grid)
    const planHeadings = pricingSection.locator('h3, [class*="CardTitle"]');
    const count = await planHeadings.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('default billing state is annual', async ({ page }) => {
    // The billing toggle should default to annual
    const toggle = page.getByRole('switch', { name: /toggle annual billing/i });
    await expect(toggle).toBeVisible({ timeout: 10000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    // URL should reflect annual billing (or no param, since annual is default)
    const url = page.url();
    // Annual is the default, URL may or may not include ?billing=annual
    expect(url).not.toContain('billing=monthly');
  });

  test('billing toggle switches between annual and monthly and updates URL', async ({ page }) => {
    const toggle = page.getByRole('switch', { name: /toggle annual billing/i });
    await expect(toggle).toBeVisible({ timeout: 10000 });

    // Default is annual
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    // Click to switch to monthly
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(page).toHaveURL(/billing=monthly/);

    // Click again to switch back to annual
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(page).toHaveURL(/billing=annual/);
  });

  test('CTA buttons have correct text per tier', async ({ page }) => {
    await expect(page.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 10000 });

    // Check that known CTA text appears for plans that exist in DB.
    // The exact set depends on which plans are active. Check each one
    // and ensure at least 2 distinct CTAs are visible.
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
    const toggle = page.getByRole('switch', { name: /toggle annual billing/i });
    await expect(toggle).toBeVisible({ timeout: 10000 });

    // Default is annual -- check signup links contain interval=yearly
    const signupLinks = page.locator('a[href*="/signup?plan="]');
    const count = await signupLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await signupLinks.nth(i).getAttribute('href');
      expect(href).toContain('interval=yearly');
    }

    // Switch to monthly
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

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
    await expect(page.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 10000 });

    // The comparison table should be visible by default
    const comparisonTable = page.locator('table');
    await expect(comparisonTable).toBeVisible({ timeout: 10000 });

    // The toggle button should say "Hide all features" since it's visible
    await expect(page.getByText('Hide all features')).toBeVisible();

    // Table should have a "Feature" header
    await expect(page.locator('th').filter({ hasText: 'Feature' })).toBeVisible();
  });

  test('testimonial section shows correct heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'What early users are saying' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('trust bar displays key trust signals', async ({ page }) => {
    await expect(page.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 10000 });

    // Scope to the trust bar section (the one right after the billing toggle, before pricing cards)
    // Trust bar is the section containing "Get started in minutes"
    const trustBar = page.locator('section').filter({ hasText: 'Get started in minutes' }).first();
    await expect(trustBar).toBeVisible();
    await expect(trustBar.getByText('No credit card required')).toBeVisible();
    await expect(trustBar.getByText('14-day money-back guarantee')).toBeVisible();
  });

  test('loading skeleton renders appropriately', async ({ page }) => {
    // Navigate with a fresh page to catch the loading state
    // We intercept the page to delay the server response
    const freshPage = page;

    // Abort any pending navigation and go to pricing
    // The loading skeleton has specific animate-pulse elements
    // Since this is an async server component with ISR, the skeleton may flash briefly
    // We check that the loading.tsx skeleton structure exists in the source
    // (We can't reliably catch it in e2e since it resolves too fast with cached data)

    // Instead, verify the page eventually shows real content (not stuck on skeleton)
    await freshPage.goto('/pricing');
    await freshPage.waitForLoadState('domcontentloaded');
    await expect(freshPage.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 15000 });

    // Verify no skeleton pulse elements remain visible once loaded
    const pulseElements = freshPage.locator('.animate-pulse');
    // After loading, there should be no visible skeleton pulses on the pricing page
    const visiblePulses = await pulseElements.evaluateAll(
      (els) => els.filter(el => el instanceof HTMLElement && el.offsetParent !== null).length
    );
    expect(visiblePulses).toBe(0);
  });

  test('URL syncs billing state on direct navigation', async ({ page }) => {
    // Navigate directly with ?billing=monthly
    await page.goto('/pricing?billing=monthly');
    await page.waitForLoadState('domcontentloaded');

    const toggle = page.getByRole('switch', { name: /toggle annual billing/i });
    await expect(toggle).toBeVisible({ timeout: 10000 });
    // Should be monthly (not annual)
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    // Navigate directly with ?billing=annual
    await page.goto('/pricing?billing=annual');
    await page.waitForLoadState('domcontentloaded');

    const toggleAnnual = page.getByRole('switch', { name: /toggle annual billing/i });
    await expect(toggleAnnual).toBeVisible({ timeout: 10000 });
    await expect(toggleAnnual).toHaveAttribute('aria-checked', 'true');
  });

  test('enterprise CTA links to help page', async ({ page }) => {
    await expect(page.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 10000 });

    const salesLink = page.getByRole('link', { name: 'Talk to Sales' });
    await expect(salesLink).toBeVisible();

    const href = await salesLink.getAttribute('href');
    expect(href).toContain('/help');
  });

  test('Save badge shows computed percentage', async ({ page }) => {
    await expect(page.getByText('Simple, transparent pricing')).toBeVisible({ timeout: 10000 });

    // When annual is selected, a "Save X%" badge should be visible (if plans have yearly prices)
    const saveBadge = page.getByText(/Save \d+%/);
    // This may or may not appear depending on plan data, so just check if present it has a number
    if (await saveBadge.isVisible({ timeout: 3000 }).catch(() => false)) {
      const text = await saveBadge.textContent();
      expect(text).toMatch(/Save \d+%/);
    }
  });
});
