/**
 * Pricing Page & Checkout Flow Audit
 * Tests: rendering, toggle, CTAs, checkout redirect, console errors
 */
import { test, expect } from '@playwright/test';

const SS = 'tests/screenshots';

test.describe('Pricing Page Audit', () => {

  test('1. Page rendering — all 4 tiers and key content visible', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // No crash
    await expect(page.locator('text=Dashboard Error')).not.toBeVisible();
    await expect(page.locator('text=Application error')).not.toBeVisible();

    // H1 present
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible({ timeout: 15000 });
    const h1Text = await h1.textContent();
    console.log('H1:', h1Text?.trim());

    // Page text snapshot for price/tier analysis
    const bodyText = await page.locator('body').textContent() ?? '';

    // 4 plan CTA buttons verify 4 plans exist
    const freeCTA   = page.getByRole('link', { name: 'Create Free Chatbot' });
    const baseCTA   = page.getByRole('link', { name: 'Get Base Plan' });
    const proCTA    = page.getByRole('link', { name: 'Start Free Trial' });
    const entCTA    = page.getByRole('link', { name: 'Talk to Sales' });

    const freeVisible = await freeCTA.isVisible({ timeout: 5000 }).catch(() => false);
    const baseVisible = await baseCTA.isVisible({ timeout: 5000 }).catch(() => false);
    const proVisible  = await proCTA.isVisible({ timeout: 5000 }).catch(() => false);
    const entVisible  = await entCTA.isVisible({ timeout: 5000 }).catch(() => false);

    console.log('Free CTA (Create Free Chatbot):', freeVisible);
    console.log('Base CTA (Get Base Plan):', baseVisible);
    console.log('Pro  CTA (Start Free Trial):', proVisible);
    console.log('Ent  CTA (Talk to Sales):', entVisible);

    // All 4 plan CTAs should be present
    expect(freeVisible, 'Free plan CTA').toBe(true);
    expect(baseVisible, 'Base plan CTA').toBe(true);
    expect(proVisible,  'Pro plan CTA').toBe(true);
    expect(entVisible,  'Enterprise CTA').toBe(true);

    // Price checks — default is annual, so we see annual prices
    // Annual: Base ~$24, Pro ~$66, Enterprise ~$207  (or monthly: $29/$79/$249)
    const has29  = bodyText.includes('29');
    const has79  = bodyText.includes('79');
    const has249 = bodyText.includes('249');
    const has0   = bodyText.includes('$0');
    console.log('Prices in page — $0:', has0, '$29 (or annual equiv):', has29, '$79 (or equiv):', has79, '$249 (or equiv):', has249);

    // "Most Popular" badge on Pro
    const mostPopular = page.getByText('Most Popular');
    const hasMostPopular = await mostPopular.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('"Most Popular" badge on Pro:', hasMostPopular);
    expect(hasMostPopular, 'Pro plan Most Popular badge').toBe(true);

    // Annual toggle
    const annualBtn = page.getByRole('button', { name: /^Annual/i }).first();
    const hasAnnualToggle = await annualBtn.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Annual billing toggle:', hasAnnualToggle);
    expect(hasAnnualToggle, 'Annual toggle').toBe(true);

    // "Save 17% · 2 months free" badge on the Annual button
    const saveBadge = page.getByText(/save 17%/i);
    const hasSave = await saveBadge.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('"Save 17%" badge:', hasSave);

    // Competitor callout text on Pro card ($150–400/mo)
    const competitorText = page.getByText(/\$150–400\/mo|150.400/i);
    const hasCompetitor = await competitorText.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Competitor callout ($150–400/mo):', hasCompetitor);
    expect(hasCompetitor, 'Pro competitor callout').toBe(true);

    // "Slack + Telegram included" in Base bullets
    const slackTelegram = page.getByText('Slack + Telegram included');
    const hasSlackTelegram = await slackTelegram.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('"Slack + Telegram included" on Base:', hasSlackTelegram);
    expect(hasSlackTelegram, 'Slack+Telegram on Base').toBe(true);

    // "Branding removal + API access" on Pro bullets
    const brandingApi = page.getByText('Branding removal + API access');
    const hasBrandingApi = await brandingApi.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('"Branding removal + API access" on Pro:', hasBrandingApi);
    expect(hasBrandingApi, 'Branding+API on Pro').toBe(true);

    // Full-page screenshot
    await page.screenshot({ path: `${SS}/pricing-01-full-page.png`, fullPage: true });
    console.log('Screenshot: pricing-01-full-page.png');

    if (consoleErrors.length) {
      console.log('Console errors on load:', consoleErrors);
    } else {
      console.log('No console errors on initial load');
    }
  });

  test('2. Monthly/Annual toggle — prices update correctly', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Use first() to avoid strict-mode violation from FAQ button matching /annual/i
    const annualBtn  = page.getByRole('button', { name: /^Annual/i }).first();
    const monthlyBtn = page.getByRole('button', { name: /^Monthly$/i }).first();

    await expect(annualBtn).toBeVisible({ timeout: 15000 });

    // Default state should be annual (aria-pressed="true" on annual button)
    const annualPressed = await annualBtn.getAttribute('aria-pressed');
    console.log('Default — Annual aria-pressed:', annualPressed);
    expect(annualPressed).toBe('true');

    // Annual state: prices per card
    // Annual monthly-equivalent: Base ~$24, Pro ~$66, Ent ~$207
    let bodyText = await page.locator('body').textContent() ?? '';
    const annualBase = bodyText.includes('24');
    const annualPro  = bodyText.includes('66');
    const annualEnt  = bodyText.includes('207');
    console.log('Annual prices — Base($24):', annualBase, '| Pro($66):', annualPro, '| Ent($207):', annualEnt);

    // Viewport screenshot showing toggle + cards
    await page.screenshot({ path: `${SS}/pricing-02a-annual-default.png`, fullPage: false });
    console.log('Screenshot: pricing-02a-annual-default.png');

    // Switch to monthly
    await monthlyBtn.click();
    await page.waitForTimeout(600);

    const monthlyPressed = await monthlyBtn.getAttribute('aria-pressed');
    console.log('After click — Monthly aria-pressed:', monthlyPressed);
    expect(monthlyPressed).toBe('true');

    // URL should update
    expect(page.url()).toContain('billing=monthly');

    // Monthly prices: $29, $79, $249
    bodyText = await page.locator('body').textContent() ?? '';
    const monthly29  = bodyText.includes('29');
    const monthly79  = bodyText.includes('79');
    const monthly249 = bodyText.includes('249');
    console.log('Monthly prices — $29:', monthly29, '| $79:', monthly79, '| $249:', monthly249);
    expect(monthly29,  'Base $29/mo').toBe(true);
    expect(monthly79,  'Pro $79/mo').toBe(true);
    expect(monthly249, 'Ent $249/mo').toBe(true);

    await page.screenshot({ path: `${SS}/pricing-02b-monthly-switched.png`, fullPage: false });
    console.log('Screenshot: pricing-02b-monthly-switched.png');

    // Switch back to annual
    await annualBtn.click();
    await page.waitForTimeout(600);

    const backToAnnual = await annualBtn.getAttribute('aria-pressed');
    console.log('After toggle back — Annual aria-pressed:', backToAnnual);
    expect(backToAnnual).toBe('true');
    expect(page.url()).toContain('billing=annual');

    await page.screenshot({ path: `${SS}/pricing-02c-annual-restored.png`, fullPage: false });
    console.log('Screenshot: pricing-02c-annual-restored.png');
  });

  test('3. CTA buttons — correct text, Free CTA redirects to signup', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });

    // Verify all expected CTAs
    const ctaChecks = [
      { name: 'Create Free Chatbot', expectHref: /signup/ },
      { name: 'Get Base Plan',       expectHref: /signup\?plan=base/ },
      { name: 'Start Free Trial',    expectHref: /signup\?plan=pro/ },
      { name: 'Talk to Sales',       expectHref: /help/ },
    ];

    for (const { name, expectHref } of ctaChecks) {
      const link = page.getByRole('link', { name }).first();
      const isVis = await link.isVisible({ timeout: 5000 }).catch(() => false);
      const href  = isVis ? (await link.getAttribute('href') ?? '') : '';
      const hrefOk = expectHref.test(href);
      console.log(`CTA "${name}": visible=${isVis}, href="${href}", href matches=${hrefOk}`);
      expect(isVis, `"${name}" visible`).toBe(true);
      expect(hrefOk, `"${name}" href matches ${expectHref}`).toBe(true);
    }

    // Annual default — interval=yearly in signup links
    const signupLinks = page.locator('a[href*="/signup?plan="]');
    const linkCount = await signupLinks.count();
    console.log(`Signup plan links found: ${linkCount}`);
    for (let i = 0; i < linkCount; i++) {
      const href = await signupLinks.nth(i).getAttribute('href') ?? '';
      console.log(`  Link ${i + 1}: ${href}`);
      expect(href).toContain('interval=yearly');
    }

    // Click "Create Free Chatbot" → expect /login?mode=signup or /signup or /dashboard
    const freeCTA = page.getByRole('link', { name: 'Create Free Chatbot' }).first();
    await freeCTA.click();
    await page.waitForLoadState('domcontentloaded');
    const afterFreeUrl = page.url();
    console.log('After "Create Free Chatbot" click:', afterFreeUrl);
    expect(afterFreeUrl).toMatch(/signup|login|dashboard/i);

    await page.screenshot({ path: `${SS}/pricing-03-after-free-cta.png`, fullPage: false });
    console.log('Screenshot: pricing-03-after-free-cta.png');
  });

  test('4. Checkout flow — Base plan CTA (monthly $29)', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });

    // Switch to monthly first so the Base card shows $29/mo
    const monthlyBtn = page.getByRole('button', { name: /^Monthly$/i }).first();
    const annualBtn  = page.getByRole('button', { name: /^Annual/i }).first();
    const isAnnual = (await annualBtn.getAttribute('aria-pressed')) === 'true';
    if (isAnnual) {
      await monthlyBtn.click();
      await page.waitForTimeout(600);
    }

    // Read the Base plan CTA href
    const baseCTA = page.getByRole('link', { name: 'Get Base Plan' }).first();
    const baseHref = await baseCTA.getAttribute('href') ?? '';
    console.log('Base plan CTA href (monthly):', baseHref);
    expect(baseHref).toContain('plan=base');
    // Monthly — should NOT have interval=yearly
    expect(baseHref).not.toContain('interval=yearly');

    // Click it
    await baseCTA.click();
    await page.waitForLoadState('domcontentloaded');
    const afterBaseUrl = page.url();
    console.log('After "Get Base Plan" click:', afterBaseUrl);

    const isSignup   = /signup|login/i.test(afterBaseUrl);
    const isStripe   = /checkout\.stripe\.com|stripe/i.test(afterBaseUrl);
    const isDashboard = /dashboard/i.test(afterBaseUrl);

    console.log('  → signup/login:', isSignup);
    console.log('  → Stripe checkout:', isStripe);
    console.log('  → dashboard:', isDashboard);

    if (isStripe) {
      const stripeBody = await page.locator('body').textContent() ?? '';
      const showsPrice = stripeBody.includes('29') || stripeBody.includes('$29');
      console.log('Stripe checkout shows $29:', showsPrice);
      expect(showsPrice).toBe(true);
    } else {
      // Not logged in — expected to land on signup/login
      expect(isSignup || isDashboard, 'Redirected to signup/login or dashboard').toBe(true);
    }

    await page.screenshot({ path: `${SS}/pricing-04-checkout-redirect.png`, fullPage: false });
    console.log('Screenshot: pricing-04-checkout-redirect.png');
  });

  test('5. Console errors — no JS page errors on pricing page', async ({ page }) => {
    const consoleErrors: string[] = [];
    const jsErrors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => jsErrors.push(err.message));
    page.on('response', res => {
      if (res.status() >= 500) {
        networkErrors.push(`${res.status()} ${res.url()}`);
      }
    });

    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log(`JS page errors (${jsErrors.length}):`,     jsErrors);
    console.log(`Console errors (${consoleErrors.length}):`, consoleErrors);
    console.log(`5xx responses  (${networkErrors.length}):`, networkErrors);

    // Hard fail on JS runtime errors
    expect(jsErrors, 'No JS runtime errors').toHaveLength(0);

    if (networkErrors.length) {
      console.log('WARNING: 5xx responses detected (may affect pricing card data)');
    }
  });

});
