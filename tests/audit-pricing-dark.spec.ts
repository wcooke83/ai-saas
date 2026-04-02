import { test, expect } from '@playwright/test';

test.describe('Pricing Page Dark Mode UI/UX Audit', () => {
  test('comprehensive dark mode audit', async ({ page }) => {
    // Navigate to pricing page
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Click the theme toggle button to switch to dark mode
    const themeToggle = page.locator('button:has(svg.lucide-sun), button:has(svg.lucide-moon)').first();
    await themeToggle.click();

    // Wait for dark mode to apply
    await page.waitForTimeout(500);

    // Verify dark mode is applied
    const isDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    console.log(`Dark mode applied: ${isDark}`);

    // If not dark, try setting via localStorage and reload
    if (!isDark) {
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      });
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/screenshots/pricing-dark-full.png',
      fullPage: true
    });

    // Take viewport screenshot of hero section
    await page.screenshot({
      path: 'tests/screenshots/pricing-dark-hero.png',
    });

    // Analyze page structure
    console.log('\n========================================');
    console.log('PRICING PAGE DARK MODE UI/UX AUDIT');
    console.log('========================================\n');

    // Check dark mode colors
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const main = document.querySelector('main');
      const computedBody = window.getComputedStyle(body);
      const root = document.documentElement;
      const computedRoot = window.getComputedStyle(root);

      return {
        bodyBg: computedBody.backgroundColor,
        isDarkClass: root.classList.contains('dark'),
        colorScheme: computedRoot.colorScheme,
      };
    });

    console.log('=== DARK MODE STATUS ===');
    console.log(`Dark class on html: ${bodyStyles.isDarkClass}`);
    console.log(`Body background: ${bodyStyles.bodyBg}`);
    console.log(`Color scheme: ${bodyStyles.colorScheme}`);

    // Analyze pricing cards
    console.log('\n=== PRICING CARDS ANALYSIS ===');

    // Find pricing cards by their structure (contains plan name and price)
    const cardContainers = page.locator('.grid > div').filter({ has: page.locator('h2, h3') });
    const cardCount = await cardContainers.count();
    console.log(`Pricing card containers found: ${cardCount}`);

    // Analyze each tier
    const tiers = ['Free', 'Pro', 'Enterprise'];
    for (const tier of tiers) {
      const tierCard = page.locator(`div:has(h2:text("${tier}"), h3:text("${tier}"))`).first();
      if (await tierCard.isVisible()) {
        const styles = await tierCard.evaluate((el) => {
          const cs = window.getComputedStyle(el);
          return {
            bg: cs.backgroundColor,
            border: cs.border,
            boxShadow: cs.boxShadow,
          };
        });
        console.log(`\n${tier} Card:`);
        console.log(`  Background: ${styles.bg}`);
        console.log(`  Border: ${styles.border}`);
        console.log(`  Shadow: ${styles.boxShadow.slice(0, 60)}...`);
      }
    }

    // Check "Most Popular" badge
    console.log('\n=== BADGE ANALYSIS ===');
    const popularBadge = page.locator('text=Most Popular').first();
    if (await popularBadge.isVisible()) {
      const badgeStyles = await popularBadge.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          bg: cs.background,
          color: cs.color,
          padding: cs.padding,
        };
      });
      console.log('Most Popular Badge:');
      console.log(`  Background: ${badgeStyles.bg.slice(0, 80)}...`);
      console.log(`  Text color: ${badgeStyles.color}`);
    } else {
      console.log('Most Popular badge: NOT VISIBLE');
    }

    // Check header badge
    const pricingBadge = page.locator('text=Pricing').first();
    if (await pricingBadge.isVisible()) {
      const badgeStyles = await pricingBadge.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          bg: cs.backgroundColor,
          color: cs.color,
          border: cs.border,
        };
      });
      console.log('\nPricing Badge (header):');
      console.log(`  Background: ${badgeStyles.bg}`);
      console.log(`  Text color: ${badgeStyles.color}`);
      console.log(`  Border: ${badgeStyles.border}`);
    }

    // Analyze buttons
    console.log('\n=== BUTTON ANALYSIS ===');
    const ctaButtons = ['Get Started Free', 'Start Pro Trial', 'Contact Sales'];
    for (const btnText of ctaButtons) {
      const btn = page.locator(`a:text("${btnText}"), button:text("${btnText}")`).first();
      if (await btn.isVisible()) {
        const btnStyles = await btn.evaluate((el) => {
          const cs = window.getComputedStyle(el);
          return {
            bg: cs.background,
            color: cs.color,
            border: cs.border,
          };
        });
        console.log(`\n${btnText}:`);
        console.log(`  Background: ${btnStyles.bg.slice(0, 80)}...`);
        console.log(`  Text color: ${btnStyles.color}`);
        console.log(`  Border: ${btnStyles.border}`);
      }
    }

    // Scroll to pricing cards section and take screenshot
    const proCard = page.locator('text=Pro').first();
    await proCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: 'tests/screenshots/pricing-dark-cards.png',
    });

    // Analyze text colors
    console.log('\n=== TEXT COLOR ANALYSIS ===');
    const headings = await page.locator('h1, h2, h3').all();
    for (let i = 0; i < Math.min(headings.length, 6); i++) {
      const heading = headings[i];
      if (await heading.isVisible()) {
        const data = await heading.evaluate((el) => ({
          tag: el.tagName,
          text: el.textContent?.trim().slice(0, 30),
          color: window.getComputedStyle(el).color,
        }));
        console.log(`${data.tag}: "${data.text}" - color: ${data.color}`);
      }
    }

    // Check paragraph text
    const paragraphs = await page.locator('p').all();
    console.log('\nParagraph text samples:');
    for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
      const p = paragraphs[i];
      if (await p.isVisible()) {
        const data = await p.evaluate((el) => ({
          text: el.textContent?.trim().slice(0, 40),
          color: window.getComputedStyle(el).color,
        }));
        console.log(`  "${data.text}..." - color: ${data.color}`);
      }
    }

    // Check icon colors
    console.log('\n=== ICON ANALYSIS ===');
    const checkIcons = page.locator('svg.lucide-check').first();
    if (await checkIcons.isVisible()) {
      const iconColor = await checkIcons.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      console.log(`Check icons color: ${iconColor}`);
    }

    // Analyze FAQ section
    console.log('\n=== FAQ SECTION ===');
    const faqSection = page.locator('text=Frequently Asked Questions').first();
    if (await faqSection.isVisible()) {
      await faqSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const faqCard = page.locator('div:has(h3:text("What are credits"))').first();
      if (await faqCard.isVisible()) {
        const faqStyles = await faqCard.evaluate((el) => {
          const cs = window.getComputedStyle(el);
          return {
            bg: cs.backgroundColor,
            border: cs.border,
          };
        });
        console.log('FAQ Card styles:');
        console.log(`  Background: ${faqStyles.bg}`);
        console.log(`  Border: ${faqStyles.border}`);
      }

      await page.screenshot({
        path: 'tests/screenshots/pricing-dark-faq.png',
      });
    }

    // Check header/footer
    console.log('\n=== HEADER/FOOTER ===');
    const header = page.locator('header').first();
    if (await header.isVisible()) {
      const headerStyles = await header.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          bg: cs.backgroundColor,
          borderBottom: cs.borderBottom,
        };
      });
      console.log('Header:');
      console.log(`  Background: ${headerStyles.bg}`);
      console.log(`  Border: ${headerStyles.borderBottom}`);
    }

    const footer = page.locator('footer').first();
    if (await footer.isVisible()) {
      await footer.scrollIntoViewIfNeeded();
      const footerStyles = await footer.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          bg: cs.backgroundColor,
          borderTop: cs.borderTop,
        };
      });
      console.log('\nFooter:');
      console.log(`  Background: ${footerStyles.bg}`);
      console.log(`  Border: ${footerStyles.borderTop}`);

      await page.screenshot({
        path: 'tests/screenshots/pricing-dark-footer.png',
      });
    }

    // Theme toggle visibility
    console.log('\n=== THEME TOGGLE ===');
    const toggle = page.locator('button:has(svg.lucide-moon)').first();
    if (await toggle.isVisible()) {
      const toggleStyles = await toggle.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          visibility: cs.visibility,
          opacity: cs.opacity,
        };
      });
      console.log(`Theme toggle visible: ${toggleStyles.visibility}, opacity: ${toggleStyles.opacity}`);
    }

    console.log('\n========================================');
    console.log('AUDIT COMPLETE');
    console.log('========================================');
  });

  test('contrast and accessibility analysis', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Enable dark mode via click
    const themeToggle = page.locator('button:has(svg.lucide-sun), button:has(svg.lucide-moon)').first();
    await themeToggle.click();
    await page.waitForTimeout(500);

    console.log('\n========================================');
    console.log('CONTRAST & ACCESSIBILITY ANALYSIS');
    console.log('========================================\n');

    // Analyze contrast ratios
    const contrastData = await page.evaluate(() => {
      function getLuminance(r: number, g: number, b: number): number {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function getContrastRatio(l1: number, l2: number): number {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      function parseColor(color: string): { r: number; g: number; b: number } | null {
        const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgb) {
          return { r: parseInt(rgb[1]), g: parseInt(rgb[2]), b: parseInt(rgb[3]) };
        }
        const rgba = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgba) {
          return { r: parseInt(rgba[1]), g: parseInt(rgba[2]), b: parseInt(rgba[3]) };
        }
        return null;
      }

      function getEffectiveBg(el: Element): string {
        let current: Element | null = el;
        while (current) {
          const bg = window.getComputedStyle(current).backgroundColor;
          const parsed = parseColor(bg);
          if (parsed && (parsed.r > 0 || parsed.g > 0 || parsed.b > 0)) {
            return bg;
          }
          current = current.parentElement;
        }
        // Default dark bg
        return 'rgb(15, 23, 42)';
      }

      const results: Array<{
        element: string;
        text: string;
        textColor: string;
        bgColor: string;
        contrastRatio: number;
        wcagAA: boolean;
        wcagAAA: boolean;
        isLargeText: boolean;
      }> = [];

      const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, li, a, button');
      const seen = new Set<string>();

      elements.forEach((el) => {
        const text = (el.textContent || '').trim();
        if (!text || text.length < 2 || seen.has(text.slice(0, 30))) return;
        seen.add(text.slice(0, 30));

        const style = getComputedStyle(el);
        const textColor = style.color;
        const bgColor = getEffectiveBg(el);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight) || 400;
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);

        const textRgb = parseColor(textColor);
        const bgRgb = parseColor(bgColor);

        if (textRgb && bgRgb) {
          const textLum = getLuminance(textRgb.r, textRgb.g, textRgb.b);
          const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
          const ratio = getContrastRatio(textLum, bgLum);

          const aaThreshold = isLargeText ? 3 : 4.5;
          const aaaThreshold = isLargeText ? 4.5 : 7;

          results.push({
            element: el.tagName,
            text: text.slice(0, 40),
            textColor,
            bgColor,
            contrastRatio: Math.round(ratio * 100) / 100,
            wcagAA: ratio >= aaThreshold,
            wcagAAA: ratio >= aaaThreshold,
            isLargeText
          });
        }
      });

      return results.slice(0, 40);
    });

    console.log('=== CONTRAST RATIO RESULTS ===\n');

    let passCount = 0;
    let failCount = 0;

    contrastData.forEach(item => {
      const status = item.wcagAAA ? 'AAA' : item.wcagAA ? 'AA ' : 'FAIL';
      const icon = item.wcagAA ? 'PASS' : 'FAIL';

      if (item.wcagAA) passCount++;
      else failCount++;

      console.log(`[${icon}] ${status} [${item.contrastRatio}:1] ${item.element}: "${item.text}"`);
      if (!item.wcagAA) {
        console.log(`        Text: ${item.textColor}`);
        console.log(`        BG: ${item.bgColor}`);
        console.log(`        Large text: ${item.isLargeText}`);
      }
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${passCount + failCount}`);

    // Focus state analysis
    console.log('\n=== FOCUS STATE ANALYSIS ===');
    const focusableElements = await page.locator('button, a, input, [tabindex="0"]').all();
    console.log(`Total focusable elements: ${focusableElements.length}`);

    // Test focus on first button
    const firstButton = page.locator('a:text("Get Started Free")').first();
    if (await firstButton.isVisible()) {
      await firstButton.focus();
      await page.waitForTimeout(100);

      const focusStyles = await firstButton.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          outline: cs.outline,
          boxShadow: cs.boxShadow,
          ring: cs.getPropertyValue('--tw-ring-color'),
        };
      });
      console.log('\nFocus state on "Get Started Free" button:');
      console.log(`  Outline: ${focusStyles.outline}`);
      console.log(`  Box shadow: ${focusStyles.boxShadow.slice(0, 60)}...`);

      await page.screenshot({
        path: 'tests/screenshots/pricing-dark-focus.png',
      });
    }

    console.log('\n========================================');
    console.log('ACCESSIBILITY ANALYSIS COMPLETE');
    console.log('========================================');
  });
});
