import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3030';
const SCREENSHOT_DIR = 'tests/screenshots/audit';

test.describe('AI SaaS Tools Website Audit', () => {

  test.describe('Homepage (/)', () => {
    test('should load and display all sections', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Take full page screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/homepage-full.png`,
        fullPage: true
      });

      // Check hero section
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Check navigation
      const nav = page.locator('nav, header');
      await expect(nav.first()).toBeVisible();

      // Check CTA buttons
      const ctaButtons = page.locator('a[href*="/tools"], a[href*="/signup"], button').filter({ hasText: /get started|try|start/i });
      const ctaCount = await ctaButtons.count();
      console.log(`Found ${ctaCount} CTA buttons`);

      // Check features section
      const featuresSection = page.locator('section:has-text("feature"), [class*="feature"]');

      // Check footer
      const footer = page.locator('footer');
      if (await footer.count() > 0) {
        await expect(footer).toBeVisible();

        // Check footer links
        const footerLinks = footer.locator('a');
        const footerLinkCount = await footerLinks.count();
        console.log(`Found ${footerLinkCount} footer links`);
      }

      // Check dark/light mode toggle
      const themeToggle = page.locator('[class*="theme"], [aria-label*="theme"], [aria-label*="dark"], [aria-label*="light"], button:has-text("dark"), button:has-text("light")');
      const hasThemeToggle = await themeToggle.count() > 0;
      console.log(`Theme toggle present: ${hasThemeToggle}`);

      // Take viewport screenshot
      await page.screenshot({ path: `${SCREENSHOT_DIR}/homepage-viewport.png` });
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Get all navigation links
      const navLinks = page.locator('nav a, header a');
      const linkCount = await navLinks.count();
      console.log(`Found ${linkCount} navigation links`);

      const brokenLinks: string[] = [];

      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();

        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('http')) {
          console.log(`Nav link: "${text?.trim()}" -> ${href}`);
        }
      }
    });
  });

  test.describe('Tools Page (/tools)', () => {
    test('should display all tool cards', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools`);
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/tools-page-full.png`,
        fullPage: true
      });

      // Check tool cards
      const toolCards = page.locator('[class*="card"], article, [role="article"]');
      const cardCount = await toolCards.count();
      console.log(`Found ${cardCount} tool cards`);

      // Check category filters
      const filters = page.locator('button:has-text("all"), button:has-text("category"), [role="tablist"], [class*="filter"]');
      const filterCount = await filters.count();
      console.log(`Found ${filterCount} filter elements`);

      // Check "Try Now" buttons
      const tryButtons = page.locator('a:has-text("try"), a:has-text("use"), button:has-text("try")');
      const tryButtonCount = await tryButtons.count();
      console.log(`Found ${tryButtonCount} "Try" buttons`);

      // Check for coming soon / disabled tools
      const disabledTools = page.locator('[class*="disabled"], [aria-disabled="true"], :has-text("coming soon")');
      const disabledCount = await disabledTools.count();
      console.log(`Found ${disabledCount} disabled/coming soon elements`);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/tools-page-viewport.png` });
    });

    test('should have working tool links', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools`);
      await page.waitForLoadState('networkidle');

      // Find all tool links
      const toolLinks = page.locator('a[href*="/tools/"]');
      const linkCount = await toolLinks.count();
      console.log(`Found ${linkCount} tool links`);

      for (let i = 0; i < linkCount; i++) {
        const link = toolLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`Tool link: "${text?.trim()?.substring(0, 30)}" -> ${href}`);
      }
    });
  });

  test.describe('Pricing Page (/pricing)', () => {
    test('should display pricing tiers', async ({ page }) => {
      await page.goto(`${BASE_URL}/pricing`);
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/pricing-page-full.png`,
        fullPage: true
      });

      // Check pricing cards/tiers
      const pricingCards = page.locator('[class*="card"], [class*="tier"], [class*="plan"]');
      const cardCount = await pricingCards.count();
      console.log(`Found ${cardCount} pricing cards`);

      // Check for price amounts
      const prices = page.locator(':has-text("$"), :has-text("/mo"), :has-text("/month")');
      const priceCount = await prices.count();
      console.log(`Found ${priceCount} price elements`);

      // Check feature lists
      const featureLists = page.locator('ul, [class*="feature"]');
      const featureCount = await featureLists.count();
      console.log(`Found ${featureCount} feature list elements`);

      // Check CTA buttons
      const ctaButtons = page.locator('a[href*="/signup"], button:has-text("start"), button:has-text("get"), button:has-text("subscribe")');
      const ctaCount = await ctaButtons.count();
      console.log(`Found ${ctaCount} CTA buttons`);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/pricing-page-viewport.png` });
    });
  });

  test.describe('Login Page (/login)', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/login-page.png`,
        fullPage: true
      });

      // Check form elements
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("login"), button:has-text("sign in")');

      console.log(`Email input found: ${await emailInput.count() > 0}`);
      console.log(`Password input found: ${await passwordInput.count() > 0}`);
      console.log(`Submit button found: ${await submitButton.count() > 0}`);

      // Check link to signup
      const signupLink = page.locator('a[href*="/signup"], a:has-text("sign up"), a:has-text("register")');
      console.log(`Signup link found: ${await signupLink.count() > 0}`);

      // Test validation - submit empty form
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        await page.waitForTimeout(500);

        // Check for validation messages
        const validationMessages = page.locator('[class*="error"], [role="alert"], .text-red, .text-destructive');
        const validationCount = await validationMessages.count();
        console.log(`Validation messages shown: ${validationCount}`);

        await page.screenshot({ path: `${SCREENSHOT_DIR}/login-page-validation.png` });
      }
    });
  });

  test.describe('Signup Page (/signup)', () => {
    test('should display signup form correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/signup`);
      await page.waitForLoadState('networkidle');

      // Take screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/signup-page.png`,
        fullPage: true
      });

      // Check form elements
      const nameInput = page.locator('input[name="name"], input[placeholder*="name"]');
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("sign up"), button:has-text("register"), button:has-text("create")');

      console.log(`Name input found: ${await nameInput.count() > 0}`);
      console.log(`Email input found: ${await emailInput.count() > 0}`);
      console.log(`Password input found: ${await passwordInput.count() > 0}`);
      console.log(`Submit button found: ${await submitButton.count() > 0}`);

      // Check link to login
      const loginLink = page.locator('a[href*="/login"], a:has-text("log in"), a:has-text("sign in")');
      console.log(`Login link found: ${await loginLink.count() > 0}`);

      // Test validation - submit empty form
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        await page.waitForTimeout(500);

        // Check for validation messages
        const validationMessages = page.locator('[class*="error"], [role="alert"], .text-red, .text-destructive');
        const validationCount = await validationMessages.count();
        console.log(`Validation messages shown: ${validationCount}`);

        await page.screenshot({ path: `${SCREENSHOT_DIR}/signup-page-validation.png` });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Homepage mobile
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/homepage-mobile.png`,
        fullPage: true
      });

      // Check for mobile menu
      const mobileMenu = page.locator('[class*="hamburger"], [class*="mobile-menu"], button[aria-label*="menu"], [class*="MenuIcon"]');
      console.log(`Mobile menu button found: ${await mobileMenu.count() > 0}`);

      // Tools page mobile
      await page.goto(`${BASE_URL}/tools`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/tools-page-mobile.png`,
        fullPage: true
      });

      // Pricing page mobile
      await page.goto(`${BASE_URL}/pricing`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/pricing-page-mobile.png`,
        fullPage: true
      });
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/homepage-tablet.png`,
        fullPage: true
      });

      await page.goto(`${BASE_URL}/tools`);
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/tools-page-tablet.png`,
        fullPage: true
      });
    });
  });

  test.describe('Broken Links Check', () => {
    test('should not have broken internal links', async ({ page }) => {
      const pagesToCheck = ['/', '/tools', '/pricing', '/login', '/signup'];
      const brokenLinks: { page: string; link: string; status: number }[] = [];

      for (const pagePath of pagesToCheck) {
        await page.goto(`${BASE_URL}${pagePath}`);
        await page.waitForLoadState('networkidle');

        const links = page.locator('a[href^="/"]');
        const linkCount = await links.count();

        for (let i = 0; i < linkCount; i++) {
          const link = links.nth(i);
          const href = await link.getAttribute('href');

          if (href && !href.includes('#')) {
            try {
              const response = await page.request.get(`${BASE_URL}${href}`);
              if (!response.ok()) {
                brokenLinks.push({
                  page: pagePath,
                  link: href,
                  status: response.status()
                });
              }
            } catch (e) {
              console.log(`Error checking link ${href}: ${e}`);
            }
          }
        }
      }

      if (brokenLinks.length > 0) {
        console.log('Broken links found:');
        brokenLinks.forEach(bl => {
          console.log(`  ${bl.page} -> ${bl.link} (${bl.status})`);
        });
      } else {
        console.log('No broken internal links found');
      }
    });
  });
});
