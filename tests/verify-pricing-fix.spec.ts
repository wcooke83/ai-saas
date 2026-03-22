import { test, expect } from '@playwright/test';

test('Verify pricing card fixes in dark mode', async ({ page }) => {
  // Navigate to pricing page
  await page.goto('http://localhost:3030/pricing');
  await page.waitForLoadState('networkidle');

  // Enable dark mode via localStorage and class
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });

  // Reload to apply theme properly
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Re-enable dark mode after reload
  await page.evaluate(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });

  // Wait for styles to apply
  await page.waitForTimeout(500);

  // Take full page screenshot
  await page.screenshot({
    path: 'tests/screenshots/pricing-dark-mode-fix.png',
    fullPage: true
  });

  // Scroll to pricing cards and take focused screenshot
  const pricingHeading = page.locator('text=Simple, transparent pricing');
  await pricingHeading.scrollIntoViewIfNeeded();

  // Take screenshot of just the pricing section
  await page.screenshot({
    path: 'tests/screenshots/pricing-cards-dark.png',
    clip: { x: 0, y: 0, width: 1280, height: 800 }
  });

  // Find the three pricing cards by their tier names
  const cards = await page.locator('div').filter({ has: page.locator('h3, h2, p').filter({ hasText: /^(Free|Pro|Enterprise)$/ }) }).all();

  console.log(`\n=== PRICING CARD VERIFICATION ===\n`);

  // Get all card backgrounds
  const tiers = ['Free', 'Pro', 'Enterprise'];
  for (const tier of tiers) {
    const cardContainer = page.locator('div').filter({ hasText: tier }).filter({ hasText: /month|credits|Custom/ }).first();

    try {
      const bgInfo = await cardContainer.evaluate((el) => {
        // Find the card container with background
        let current: HTMLElement | null = el as HTMLElement;
        let cardBg = 'transparent';
        let cardElement = '';

        while (current && current.tagName !== 'BODY') {
          const styles = window.getComputedStyle(current);
          const bg = styles.backgroundColor;

          // Check if this looks like a card (has rounded corners and background)
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            cardBg = bg;
            cardElement = `${current.tagName}.${current.className.split(' ').slice(0, 3).join('.')}`;
            break;
          }
          current = current.parentElement;
        }

        return { backgroundColor: cardBg, element: cardElement };
      });

      console.log(`${tier} card: ${bgInfo.backgroundColor}`);
    } catch (e) {
      console.log(`${tier} card: Could not find`);
    }
  }

  // Find CTA buttons and check alignment
  console.log(`\n=== BUTTON ALIGNMENT CHECK ===\n`);

  const ctaButtons = page.locator('a, button').filter({
    hasText: /Get Started|Start Free Trial|Contact Sales/i
  });

  const buttonCount = await ctaButtons.count();
  console.log(`Found ${buttonCount} CTA buttons`);

  const buttonData: { text: string; y: number; bottom: number }[] = [];

  for (let i = 0; i < buttonCount; i++) {
    const btn = ctaButtons.nth(i);
    const box = await btn.boundingBox();
    const text = await btn.textContent();

    if (box && text) {
      buttonData.push({
        text: text.trim(),
        y: Math.round(box.y),
        bottom: Math.round(box.y + box.height)
      });
    }
  }

  // Sort by text for consistent output
  buttonData.sort((a, b) => a.text.localeCompare(b.text));

  for (const btn of buttonData) {
    console.log(`  "${btn.text}" - Top: ${btn.y}px, Bottom: ${btn.bottom}px`);
  }

  if (buttonData.length >= 2) {
    const bottomPositions = buttonData.map(b => b.bottom);
    const topPositions = buttonData.map(b => b.y);
    const maxBottomDiff = Math.max(...bottomPositions) - Math.min(...bottomPositions);
    const maxTopDiff = Math.max(...topPositions) - Math.min(...topPositions);

    console.log(`\nButton top alignment diff: ${maxTopDiff}px`);
    console.log(`Button bottom alignment diff: ${maxBottomDiff}px`);
    console.log(`\nButtons are ${maxBottomDiff <= 5 ? 'ALIGNED ✓' : 'NOT ALIGNED ✗'}`);
  }

  console.log(`\n=== VERIFICATION COMPLETE ===\n`);
});
