import { test, expect } from '@playwright/test';

test('Verify pricing page dark mode fixes', async ({ page }) => {
  // Navigate to pricing page
  await page.goto('http://localhost:3030/pricing');
  await page.waitForLoadState('networkidle');

  // Enable dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(300);

  // Take screenshot
  await page.screenshot({
    path: 'tests/screenshots/pricing-dark-mode.png',
    fullPage: true
  });

  console.log('\n=== DARK MODE VERIFICATION REPORT ===\n');

  // 1. Check Card backgrounds (should be solid secondary-800, not transparent)
  const cardBgCheck = await page.evaluate(() => {
    const cards = document.querySelectorAll('.dark\\:bg-secondary-800');
    const results: string[] = [];
    cards.forEach((card) => {
      const style = window.getComputedStyle(card);
      results.push(`bg: ${style.backgroundColor}`);
    });
    return results;
  });
  console.log('1. CARD BACKGROUNDS (should be solid rgb color, not transparent):');
  console.log(`   Found ${cardBgCheck.length} cards with dark:bg-secondary-800`);
  cardBgCheck.slice(0, 5).forEach((r, i) => console.log(`   Card ${i + 1}: ${r}`));

  // 2. Check borders (should be secondary-600, not secondary-700)
  const borderCheck = await page.evaluate(() => {
    // FAQ cards
    const faqCards = document.querySelectorAll('.dark\\:border-secondary-600');
    // Free plan card
    const freeCard = document.querySelector('[class*="dark:border-secondary-600"]');

    const results: any[] = [];
    faqCards.forEach((card, i) => {
      const style = window.getComputedStyle(card);
      results.push({
        type: 'FAQ/Free card',
        borderColor: style.borderColor
      });
    });
    return results;
  });
  console.log('\n2. BORDERS (should be secondary-600 - visible in dark mode):');
  console.log(`   Found ${borderCheck.length} elements with dark:border-secondary-600`);
  borderCheck.slice(0, 5).forEach((r, i) => console.log(`   Element ${i + 1}: ${r.borderColor}`));

  // 3. Check period text (should be secondary-300 for readability)
  const periodCheck = await page.evaluate(() => {
    const periodTexts = document.querySelectorAll('.dark\\:text-secondary-300');
    const results: any[] = [];
    periodTexts.forEach((el) => {
      const style = window.getComputedStyle(el);
      const text = el.textContent?.trim().substring(0, 40);
      results.push({
        text,
        color: style.color
      });
    });
    return results;
  });
  console.log('\n3. PERIOD/DESCRIPTION TEXT (should be secondary-300 - readable):');
  console.log(`   Found ${periodCheck.length} elements with dark:text-secondary-300`);
  periodCheck.slice(0, 8).forEach((r, i) => console.log(`   "${r.text}" -> ${r.color}`));

  // 4. Verify Pro card has proper styling
  const proCardCheck = await page.evaluate(() => {
    const proCard = document.querySelector('[class*="border-primary-400"]');
    if (!proCard) return null;
    const style = window.getComputedStyle(proCard);
    return {
      borderColor: style.borderColor,
      backgroundColor: style.backgroundColor,
      boxShadow: style.boxShadow.substring(0, 100)
    };
  });
  console.log('\n4. PRO CARD (featured card styling):');
  if (proCardCheck) {
    console.log(`   Border: ${proCardCheck.borderColor}`);
    console.log(`   Background: ${proCardCheck.backgroundColor}`);
    console.log(`   Shadow: ${proCardCheck.boxShadow}...`);
  } else {
    console.log('   Pro card not found with expected classes');
  }

  // 5. Check FAQ section
  const faqCheck = await page.evaluate(() => {
    const faqCards = document.querySelectorAll('section:last-of-type .rounded-lg');
    const results: any[] = [];
    faqCards.forEach((card, i) => {
      if (i < 4) {
        const style = window.getComputedStyle(card);
        results.push({
          bg: style.backgroundColor,
          border: style.borderColor
        });
      }
    });
    return results;
  });
  console.log('\n5. FAQ CARDS:');
  faqCheck.forEach((r, i) => console.log(`   FAQ ${i + 1}: bg=${r.bg}, border=${r.border}`));

  console.log('\n=== SCREENSHOT SAVED: tests/screenshots/pricing-dark-mode.png ===\n');
});
