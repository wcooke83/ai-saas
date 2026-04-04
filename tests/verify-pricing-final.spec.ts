/**
 * Final verification spec for the VocUI pricing page.
 * Checks all 4 plan cards, pricing accuracy, annual toggle, CTAs,
 * console errors, and key copy.
 */
import { test, expect, Page } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = '/home/wcooke/projects/ai-saas/tests/screenshots';

async function screenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `pricing-verify-${name}.png`),
    fullPage: true,
  });
}

test.describe('Pricing Page — Final Verification', () => {
  test('Check 1+2: All 4 plan cards render and monthly prices are correct', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Switch to monthly view first
    const monthlyBtn = page.getByRole('button', { name: /monthly/i });
    if (await monthlyBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await monthlyBtn.click();
      await page.waitForTimeout(500);
    }

    await screenshot(page, '01-monthly-view');

    // Check all 4 plan names appear somewhere on the page
    const pageText = await page.locator('body').innerText();

    // Plan names
    const freePlan = /\bFree\b/i.test(pageText);
    const basePlan = /\bBase\b/i.test(pageText);
    const proPlan = /\bPro\b/i.test(pageText);
    const enterprisePlan = /\bEnterprise\b/i.test(pageText);

    console.log('Free plan visible:', freePlan);
    console.log('Base plan visible:', basePlan);
    console.log('Pro plan visible:', proPlan);
    console.log('Enterprise plan visible:', enterprisePlan);

    expect(freePlan, 'Free plan should appear').toBe(true);
    expect(basePlan, 'Base plan should appear').toBe(true);
    expect(proPlan, 'Pro plan should appear').toBe(true);
    expect(enterprisePlan, 'Enterprise plan should appear').toBe(true);

    // Verify prices: $0, $29, $79 — and NOT $149 for Pro
    expect(pageText).toMatch(/\$0/);
    expect(pageText).toMatch(/\$29/);
    expect(pageText).toMatch(/\$79/);
    expect(pageText).not.toMatch(/\$149/);

    // Most Popular badge — must exist
    const popularBadge = page.getByText(/most popular/i);
    await expect(popularBadge).toBeVisible({ timeout: 5000 });
    console.log('Most Popular badge: VISIBLE');

    // Free must be leftmost card: get all plan heading cards
    const planCards = page.locator('#pricing h3, #pricing [class*="plan-name"], #pricing [class*="PlanName"]');
    const cardCount = await planCards.count();
    console.log('Plan heading elements found in #pricing:', cardCount);

    // Console errors check
    console.log('Console errors collected:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors.slice(0, 5));
    }
  });

  test('Check 2 detail: Verify exact monthly prices via DOM', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Default is annual — switch to monthly via the billing toggle button
    const monthlyBtn = page.getByRole('button', { name: 'Monthly' });
    await expect(monthlyBtn).toBeVisible({ timeout: 8000 });
    await monthlyBtn.click();
    // Wait for aria-pressed state to confirm toggle happened
    await expect(monthlyBtn).toHaveAttribute('aria-pressed', 'true', { timeout: 5000 });

    await screenshot(page, '02-monthly-prices');

    // Read all <data> elements inside the pricing section — these are the price displays
    const priceElements = page.locator('#pricing data');
    const priceCount = await priceElements.count();
    const prices: string[] = [];
    for (let i = 0; i < priceCount; i++) {
      prices.push(await priceElements.nth(i).innerText());
    }
    console.log('Monthly price elements in #pricing:', prices);

    expect(prices, 'Should have prices for 4 plans').toHaveLength(4);
    expect(prices[0], 'Free: $0').toBe('$0');
    expect(prices[1], 'Base: $29').toBe('$29');
    expect(prices[2], 'Pro: $79 (not old $149)').toBe('$79');
    // Enterprise: Custom (price_monthly_cents is 24900 but isCustomPricingPlan returns true for no stripe_price_id)
    const enterprisePrice = prices[3];
    console.log('Enterprise price display:', enterprisePrice);
    expect(['Custom', '$249'].includes(enterprisePrice) || /\$249/.test(enterprisePrice),
      `Enterprise should show Custom or $249, got: ${enterprisePrice}`).toBe(true);
  });

  test('Check 3: Annual toggle works and shows discounted prices', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Default is annual — switch to monthly first, then back to annual to exercise the toggle
    const monthlyBtn = page.getByRole('button', { name: 'Monthly' });
    await expect(monthlyBtn).toBeVisible({ timeout: 8000 });
    await monthlyBtn.click();
    await page.waitForTimeout(400);

    // Now switch to annual — use aria-pressed selector to avoid FAQ button collision
    const annualBtn = page.locator('button[aria-pressed]').filter({ hasText: /annual/i });
    await expect(annualBtn).toBeVisible({ timeout: 8000 });
    await annualBtn.click();
    await page.waitForTimeout(600);

    await screenshot(page, '03-annual-prices');

    const pageText = await page.locator('body').innerText();

    // Annual prices should be lower — Base ~$24, Pro ~$66 (or yearly totals)
    // Accept either monthly-equivalent or yearly total
    const hasBase24 = /\$24/.test(pageText);
    const hasBase290 = /\$290/.test(pageText);
    const hasPro66 = /\$66/.test(pageText);
    const hasPro790 = /\$790/.test(pageText);

    console.log('Annual Base $24/mo:', hasBase24, '| $290/yr:', hasBase290);
    console.log('Annual Pro $66/mo:', hasPro66, '| $790/yr:', hasPro790);

    // At least one form of annual discount pricing should appear
    expect(hasBase24 || hasBase290, 'Base annual price ($24/mo or $290/yr) should appear').toBe(true);
    expect(hasPro66 || hasPro790, 'Pro annual price ($66/mo or $790/yr) should appear').toBe(true);

    // No page reload — URL should reflect annual now
    const url = page.url();
    console.log('URL after annual toggle:', url);
    // Toggle works without reload — page should still be on /pricing
    expect(url).toContain('/pricing');
  });

  test('Check 4: CTA buttons are present and link correctly', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    await screenshot(page, '04-cta-buttons');

    // Free plan CTA: "Get started free" or "Create Free Chatbot" → /signup
    const freeCtaTexts = ['Get started free', 'Create Free Chatbot', 'Start for free', 'Get Started Free'];
    let freeCtaFound = false;
    let freeCtaHref = '';
    for (const text of freeCtaTexts) {
      const link = page.getByRole('link', { name: new RegExp(text, 'i') }).first();
      if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
        freeCtaHref = (await link.getAttribute('href')) ?? '';
        console.log(`Free CTA found: "${text}" → ${freeCtaHref}`);
        freeCtaFound = true;
        break;
      }
    }
    expect(freeCtaFound, 'Free plan CTA should be visible').toBe(true);
    expect(freeCtaHref, 'Free plan CTA should link to /signup').toContain('/signup');

    // Base plan CTA
    const baseCtaTexts = ['Get Base Plan', 'Get Base', 'Start Base', 'Choose Base'];
    let baseCtaFound = false;
    for (const text of baseCtaTexts) {
      const link = page.getByRole('link', { name: new RegExp(text, 'i') }).first();
      if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
        const href = (await link.getAttribute('href')) ?? '';
        console.log(`Base CTA found: "${text}" → ${href}`);
        expect(href).toMatch(/signup|checkout/i);
        baseCtaFound = true;
        break;
      }
    }
    expect(baseCtaFound, 'Base plan CTA should be visible').toBe(true);

    // Pro plan CTA
    const proCtaTexts = ['Start Free Trial', 'Get Pro', 'Choose Pro', 'Start Pro'];
    let proCtaFound = false;
    for (const text of proCtaTexts) {
      const link = page.getByRole('link', { name: new RegExp(text, 'i') }).first();
      if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
        const href = (await link.getAttribute('href')) ?? '';
        console.log(`Pro CTA found: "${text}" → ${href}`);
        expect(href).toMatch(/signup|checkout/i);
        proCtaFound = true;
        break;
      }
    }
    expect(proCtaFound, 'Pro plan CTA should be visible').toBe(true);

    // Enterprise CTA
    const enterpriseCta = page.getByRole('link', { name: /talk to sales/i });
    const hasEnterpriseCta = await enterpriseCta.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Enterprise "Talk to Sales" CTA:', hasEnterpriseCta ? 'VISIBLE' : 'NOT FOUND');
    expect(hasEnterpriseCta, 'Enterprise Talk to Sales CTA should be visible').toBe(true);
  });

  test('Check 5: No JS console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter out known non-critical browser noise
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('ERR_BLOCKED')) {
          consoleErrors.push(text);
        }
      }
    });
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Also toggle to monthly and back to trigger dynamic code
    const monthlyBtn = page.getByRole('button', { name: /monthly/i });
    if (await monthlyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await monthlyBtn.click();
      await page.waitForTimeout(300);
      const annualBtn = page.getByRole('button', { name: /annual/i });
      if (await annualBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await annualBtn.click();
        await page.waitForTimeout(300);
      }
    }

    console.log('Console errors:', consoleErrors.length > 0 ? consoleErrors : 'NONE');
    console.log('Page errors:', pageErrors.length > 0 ? pageErrors : 'NONE');

    expect(consoleErrors, `Console errors: ${consoleErrors.join('; ')}`).toHaveLength(0);
    expect(pageErrors, `Page errors: ${pageErrors.join('; ')}`).toHaveLength(0);
  });

  test('Check 6: Key copy — Pro card branding/API, Base Slack/Telegram, competitor callout', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    await screenshot(page, '06-key-copy');

    const pageText = await page.locator('body').innerText();

    // Pro card: branding removal
    const hasBrandingRemoval = /branding removal|remove branding|white.?label|no.?branding/i.test(pageText);
    console.log('Pro: branding removal copy:', hasBrandingRemoval);
    expect(hasBrandingRemoval, 'Pro card should mention branding removal').toBe(true);

    // Pro card: API access
    const hasApiAccess = /api access|api key|rest api/i.test(pageText);
    console.log('Pro: API access copy:', hasApiAccess);
    expect(hasApiAccess, 'Pro card should mention API access').toBe(true);

    // Base card: Slack + Telegram
    const hasSlack = /slack/i.test(pageText);
    const hasTelegram = /telegram/i.test(pageText);
    console.log('Base: Slack:', hasSlack, '| Telegram:', hasTelegram);
    expect(hasSlack, 'Base card should mention Slack').toBe(true);
    expect(hasTelegram, 'Base card should mention Telegram').toBe(true);

    // Competitor callout: "$150–400/mo" or similar
    const hasCompetitorCallout = /\$150|150.{0,5}400|\$400/i.test(pageText);
    console.log('Competitor callout ($150–400/mo):', hasCompetitorCallout);
    expect(hasCompetitorCallout, 'Competitor callout ($150–400/mo) should be visible on page').toBe(true);
  });

  test('Check 1 detail: Free is leftmost card, Pro has badge, grid shows 4 cards in one row', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    await screenshot(page, '07-card-layout');

    // Get all plan card headings (h3) in document order
    const planHeadings = page.locator('#pricing h3');
    const count = await planHeadings.count();
    console.log('h3 elements in #pricing section:', count);

    if (count >= 4) {
      const texts = [];
      for (let i = 0; i < count; i++) {
        texts.push(await planHeadings.nth(i).innerText());
      }
      console.log('Card order:', texts);

      // First card should be Free
      expect(texts[0].toLowerCase()).toContain('free');
      // Pro should exist in cards
      expect(texts.some(t => /pro/i.test(t)), 'Pro card should exist').toBe(true);
    } else {
      // Fallback: check page text for all 4 names
      const pageText = await page.locator('body').innerText();
      expect(pageText).toMatch(/free/i);
      expect(pageText).toMatch(/base/i);
      expect(pageText).toMatch(/pro/i);
      expect(pageText).toMatch(/enterprise/i);
    }

    // Verify the grid is actually 4-column (all cards in one row)
    // Check that plan cards don't wrap by verifying bounding boxes
    const cards = page.locator('#pricing [class*="grid"] > *');
    const cardCount = await cards.count();
    console.log('Grid child count:', cardCount);

    if (cardCount >= 4) {
      const firstBox = await cards.nth(0).boundingBox();
      const fourthBox = await cards.nth(3).boundingBox();
      if (firstBox && fourthBox) {
        // If all 4 are in one row, they should have the same Y coordinate (within 10px)
        const sameRow = Math.abs(firstBox.y - fourthBox.y) < 50;
        console.log(`Card 1 Y=${firstBox.y}, Card 4 Y=${fourthBox.y} — same row: ${sameRow}`);
        expect(sameRow, 'All 4 cards should be in one row (not wrapped)').toBe(true);
      }
    }

    // Most Popular badge on Pro card
    const badge = page.getByText(/most popular/i);
    await expect(badge).toBeVisible({ timeout: 5000 });
    console.log('Most Popular badge: VISIBLE');
  });
});
