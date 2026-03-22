import { chromium, Browser, Page } from 'playwright';

interface CardMetrics {
  name: string;
  height: number;
  buttonBottom: number;
  cardBottom: number;
  buttonDistanceFromBottom: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  boxShadow: string;
}

async function analyzePricingCards() {
  const browser: Browser = await chromium.launch({ headless: true });
  const page: Page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    // 1. Navigate to pricing page
    console.log('Navigating to pricing page...');
    await page.goto('http://localhost:3030/pricing', { waitUntil: 'networkidle' });

    // 2. Enable dark mode
    console.log('Enabling dark mode...');
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Wait for styles to apply
    await page.waitForTimeout(500);

    // 3. Take a screenshot of the pricing cards
    console.log('Taking screenshot...');
    await page.screenshot({
      path: '/home/wcooke/projects/ai-saas/tests/pricing-dark-mode.png',
      fullPage: false
    });

    // 4. Analyze the pricing cards
    console.log('\n=== Pricing Card Analysis in Dark Mode ===\n');

    const cardMetrics: CardMetrics[] = await page.evaluate(() => {
      const cards = document.querySelectorAll('.grid > div');
      const metrics: CardMetrics[] = [];

      cards.forEach((card, index) => {
        const cardEl = card as HTMLElement;
        const cardRect = cardEl.getBoundingClientRect();
        const cardStyles = window.getComputedStyle(cardEl);

        // Find the button/link inside the card
        const button = cardEl.querySelector('a[href*="signup"], a[href*="help"]') as HTMLElement;
        const buttonRect = button ? button.getBoundingClientRect() : null;

        const names = ['Free', 'Pro', 'Enterprise'];

        metrics.push({
          name: names[index] || `Card ${index + 1}`,
          height: Math.round(cardRect.height),
          buttonBottom: buttonRect ? Math.round(buttonRect.bottom) : 0,
          cardBottom: Math.round(cardRect.bottom),
          buttonDistanceFromBottom: buttonRect ? Math.round(cardRect.bottom - buttonRect.bottom) : 0,
          backgroundColor: cardStyles.backgroundColor,
          borderColor: cardStyles.borderColor,
          borderWidth: cardStyles.borderWidth,
          boxShadow: cardStyles.boxShadow
        });
      });

      return metrics;
    });

    // Print detailed analysis
    cardMetrics.forEach(card => {
      console.log(`--- ${card.name} Card ---`);
      console.log(`  Height: ${card.height}px`);
      console.log(`  Button distance from bottom: ${card.buttonDistanceFromBottom}px`);
      console.log(`  Background: ${card.backgroundColor}`);
      console.log(`  Border: ${card.borderWidth} - ${card.borderColor}`);
      console.log(`  Box Shadow: ${card.boxShadow.substring(0, 80)}...`);
      console.log('');
    });

    // Check for alignment issues
    console.log('=== ISSUES DETECTED ===\n');

    const heights = cardMetrics.map(c => c.height);
    const buttonDistances = cardMetrics.map(c => c.buttonDistanceFromBottom);

    // Check if heights are equal
    const heightsEqual = heights.every(h => h === heights[0]);
    if (!heightsEqual) {
      console.log('ISSUE: Card heights are NOT equal');
      cardMetrics.forEach(c => console.log(`  ${c.name}: ${c.height}px`));
    } else {
      console.log('OK: All cards have equal height');
    }

    console.log('');

    // Check if buttons are aligned
    const buttonsAligned = buttonDistances.every(d => Math.abs(d - buttonDistances[0]) < 5);
    if (!buttonsAligned) {
      console.log('ISSUE: Buttons are NOT aligned at the bottom');
      cardMetrics.forEach(c => console.log(`  ${c.name}: ${c.buttonDistanceFromBottom}px from bottom`));
    } else {
      console.log('OK: All buttons are aligned at the bottom');
    }

    // Get specific Enterprise card computed styles in dark mode
    console.log('\n=== Enterprise Card Dark Mode Styles ===\n');

    const enterpriseStyles = await page.evaluate(() => {
      const cards = document.querySelectorAll('.grid > div');
      const enterprise = cards[2] as HTMLElement;
      const styles = window.getComputedStyle(enterprise);

      return {
        background: styles.background,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
        boxShadow: styles.boxShadow,
        classes: enterprise.className,
        isDarkBackgroundCorrect: styles.backgroundColor.includes('rgb(30, 41, 59)') ||
                                 styles.backgroundColor.includes('rgb(15, 23, 42)') ||
                                 styles.backgroundColor.includes('rgba'),
      };
    });

    console.log('Enterprise Card Classes:', enterpriseStyles.classes);
    console.log('Background:', enterpriseStyles.background);
    console.log('Background Color:', enterpriseStyles.backgroundColor);
    console.log('Background Image:', enterpriseStyles.backgroundImage);
    console.log('Border:', enterpriseStyles.borderWidth, enterpriseStyles.borderColor);
    console.log('Box Shadow:', enterpriseStyles.boxShadow);

    // Check for the specific issue - light background in dark mode
    if (enterpriseStyles.backgroundColor.includes('rgb(255, 255, 255)') ||
        enterpriseStyles.backgroundColor === 'rgba(0, 0, 0, 0)' ||
        enterpriseStyles.backgroundImage.includes('white')) {
      console.log('\nISSUE: Enterprise card appears to have LIGHT background in dark mode!');
      console.log('The card should have dark:bg-secondary-800 or similar dark background');
    }

    // Take a focused screenshot of just the cards area
    const cardsSection = page.locator('.grid.md\\:grid-cols-3');
    await cardsSection.screenshot({
      path: '/home/wcooke/projects/ai-saas/tests/pricing-cards-dark-mode-focused.png'
    });
    console.log('\nScreenshots saved to tests/ directory');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

analyzePricingCards();
