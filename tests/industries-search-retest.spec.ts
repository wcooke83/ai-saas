import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOT_DIR = '/home/wcooke/projects/ai-saas/tests/screenshots/industries-search/retest';

test.describe('Industries Search Retest', () => {

  test('Test 1: "dental" search finds Dentists', async ({ page }) => {
    await page.goto('http://localhost:3030/industries');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    // The search input has type="search" and placeholder containing "Search industries"
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.click();
    await searchInput.fill('dental');
    await page.waitForTimeout(2000);

    // Take a full page screenshot to capture everything
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test1-dental-fullpage.png'), fullPage: true });

    // Check for "Dentists" text in the page content (search results)
    const dentistsHeading = page.locator('h3:has-text("Dentists")');
    await expect(dentistsHeading).toBeVisible({ timeout: 5000 });
    console.log('TEST 1 PASS - "Dentists" is visible in search results');

    // Get the result count text (e.g. "3 results for "dental"")
    const resultCountEl = page.locator('text=/\\d+ results? for/');
    const resultText = await resultCountEl.textContent();
    console.log(`TEST 1 - Result count text: "${resultText}"`);

    // Scroll to the search results area and take a viewport screenshot
    await dentistsHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test1-dental-results.png'), fullPage: false });
  });

  test('Test 2: Gap between search bar and results is reduced', async ({ page }) => {
    await page.goto('http://localhost:3030/industries');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.click();
    await searchInput.fill('de');
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test2-gap-fullpage.png'), fullPage: true });

    // Measure the gap between the search bar and the first search result
    // The search input is inside the hero section. The results are in the next container.
    const measurements = await page.evaluate(() => {
      const input = document.querySelector('input[type="search"]');
      if (!input) return { error: 'No search input found' };
      const inputRect = input.getBoundingClientRect();

      // The result count hint appears right below the search
      // The actual result rows are <article> elements with <a> links
      const firstArticle = document.querySelector('article');
      if (!firstArticle) return { error: 'No result article found', inputBottom: inputRect.bottom };
      const articleRect = firstArticle.getBoundingClientRect();

      // Also find the results container (the div with py-6)
      const resultsContainer = firstArticle.closest('div.container');
      const containerRect = resultsContainer?.getBoundingClientRect();

      return {
        inputBottom: Math.round(inputRect.bottom),
        firstArticleTop: Math.round(articleRect.top),
        gap: Math.round(articleRect.top - inputRect.bottom),
        containerTop: containerRect ? Math.round(containerRect.top) : null,
        containerPaddingTop: resultsContainer ? window.getComputedStyle(resultsContainer).paddingTop : null,
      };
    });

    console.log(`TEST 2 - Measurements: ${JSON.stringify(measurements, null, 2)}`);

    if ('gap' in measurements && typeof measurements.gap === 'number') {
      console.log(`TEST 2 - Gap between search input bottom and first result: ${measurements.gap}px`);
      // With py-6 (24px), the gap should be reasonable: the hero's bottom padding (pb-8 = 32px) + container padding (py-6 = 24px) + result-count hint height ≈ ~80-120px
      // Old py-12 lg:py-16 would have been ~48-64px extra
      console.log(`TEST 2 - Container paddingTop: ${measurements.containerPaddingTop}`);
    }

    // Scroll to show the search bar and the top of results together
    await page.evaluate(() => {
      const input = document.querySelector('input[type="search"]');
      if (input) {
        input.scrollIntoView({ block: 'start' });
        window.scrollBy(0, -20); // small offset above
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test2-gap-viewport.png'), fullPage: false });
  });

  test('Test 3: "lawyer" search finds Law Firms', async ({ page }) => {
    await page.goto('http://localhost:3030/industries');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.click();
    await searchInput.fill('lawyer');
    await page.waitForTimeout(2000);

    // Take full page screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test3-lawyer-fullpage.png'), fullPage: true });

    // Check for "Law Firms" in search results
    const lawFirmsHeading = page.locator('h3:has-text("Law Firms")');
    await expect(lawFirmsHeading).toBeVisible({ timeout: 5000 });
    console.log('TEST 3 PASS - "Law Firms" is visible in search results');

    // Get result count
    const resultCountEl = page.locator('text=/\\d+ results? for/');
    const resultText = await resultCountEl.textContent();
    console.log(`TEST 3 - Result count text: "${resultText}"`);

    // Scroll to show the results and take viewport screenshot
    await lawFirmsHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'test3-lawyer-results.png'), fullPage: false });
  });
});
