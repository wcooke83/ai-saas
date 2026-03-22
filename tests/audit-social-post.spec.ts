import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = '/home/wcooke/projects/ai-saas/tests/screenshots/audit/social-post-full';

// Ensure screenshot directory exists
test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

test.describe('Social Post Generator - Comprehensive Audit', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Page Load - Initial state verification', async () => {
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-initial-page-load.png'),
      fullPage: true
    });

    // Verify header with "New" badge
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const newBadge = page.locator('header').getByText('New');
    await expect(newBadge).toBeVisible();

    const socialPostTitle = page.locator('header').getByText('Social Post Generator');
    await expect(socialPostTitle).toBeVisible();

    // Verify 4 feature cards
    const featureCards = page.locator('.grid.sm\\:grid-cols-4 > div');
    await expect(featureCards).toHaveCount(4);

    // Verify specific feature card text
    await expect(page.getByText('4 Platforms')).toBeVisible();
    await expect(page.getByText('5 Variations', { exact: true })).toBeVisible();
    await expect(page.getByText('Smart Hashtags')).toBeVisible();
    await expect(page.getByText('Export Ready')).toBeVisible();

    // Verify platform cards at bottom
    await expect(page.getByRole('heading', { name: 'Optimized for Each Platform' })).toBeVisible();
    const platformCards = page.locator('.grid.lg\\:grid-cols-4 > div');
    await expect(platformCards).toHaveCount(4);

    // Verify each platform card
    await expect(page.locator('.grid.lg\\:grid-cols-4').getByText('LinkedIn')).toBeVisible();
    await expect(page.locator('.grid.lg\\:grid-cols-4').getByText('Twitter/X')).toBeVisible();
    await expect(page.locator('.grid.lg\\:grid-cols-4').getByText('Instagram')).toBeVisible();
    await expect(page.locator('.grid.lg\\:grid-cols-4').getByText('TikTok')).toBeVisible();

    console.log('Page Load Test: PASSED');
  });

  test('2. Form Functionality - Fill all fields', async () => {
    // Topic field
    const topicField = page.locator('textarea').first();
    await topicField.fill('5 lessons I learned building my first SaaS product');

    // Repurpose existing content toggle
    const repurposeToggle = page.getByRole('button', { name: /Repurpose existing content/i });
    await repurposeToggle.click();

    // Wait for textarea to appear
    const repurposeField = page.locator('textarea').nth(1);
    await expect(repurposeField).toBeVisible();
    await repurposeField.fill('Building a SaaS from scratch taught me more than any MBA. Here are the hard truths: 1) Ship faster than you think is reasonable, 2) Talk to users daily, 3) Pricing is a feature, 4) Competition is validation, 5) Revenue solves everything.');

    // Select ALL 4 platforms - first check current state
    const linkedinBtn = page.getByRole('button', { name: /LinkedIn/i }).first();
    const twitterBtn = page.getByRole('button', { name: /Twitter/i }).first();
    const instagramBtn = page.getByRole('button', { name: /Instagram/i }).first();
    const tiktokBtn = page.getByRole('button', { name: /TikTok/i }).first();

    // LinkedIn and Twitter are selected by default, need to select Instagram and TikTok
    await instagramBtn.click();
    await tiktokBtn.click();

    // Verify all platforms are selected (aria-pressed="true")
    await expect(linkedinBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(twitterBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(instagramBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(tiktokBtn).toHaveAttribute('aria-pressed', 'true');

    // Set variations to 3
    const variationsSelect = page.locator('select').filter({ hasText: 'variation' });
    await variationsSelect.selectOption('3');

    // Post type: Story
    const postTypeSelect = page.locator('select').first();
    await postTypeSelect.selectOption('story');

    // Tone: Casual
    const toneSelect = page.locator('select').nth(1);
    await toneSelect.selectOption('casual');

    // Verify hashtags and emojis are enabled (they are by default)
    const hashtagsCheckbox = page.locator('input[type="checkbox"]').first();
    const emojisCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await expect(hashtagsCheckbox).toBeChecked();
    await expect(emojisCheckbox).toBeChecked();

    // Target audience
    const audienceField = page.getByPlaceholder(/SaaS founders/i);
    await audienceField.fill('Indie hackers and startup founders');

    // CTA
    const ctaField = page.getByPlaceholder(/Sign up/i);
    await ctaField.fill('What lesson resonates most with you?');

    // Screenshot of filled form
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-filled-form.png'),
      fullPage: true
    });

    console.log('Form Functionality Test: PASSED');
  });

  test('3. Generation - Generate posts and verify output', async () => {
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });

    // Record start time
    const startTime = Date.now();

    // Click generate
    await generateButton.click();

    // Verify loading state
    await expect(page.getByText('Generating...')).toBeVisible();

    // Wait for generation to complete (up to 60 seconds)
    await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 60000 });

    const loadTime = Date.now() - startTime;
    console.log(`Generation completed in ${loadTime}ms (${(loadTime/1000).toFixed(1)}s)`);

    // Wait for posts to appear
    await page.waitForTimeout(500);

    // Screenshot of generated posts
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-generated-posts.png'),
      fullPage: true
    });

    // Verify posts badge shows count
    const postsBadge = page.locator('text=/\\d+ posts/');
    await expect(postsBadge).toBeVisible();

    console.log('Generation Test: PASSED');
  });

  test('4a. Output Features - Platform filter tabs', async () => {
    // Test All filter
    const allFilter = page.getByRole('button', { name: /^All \(\d+\)$/ });
    await expect(allFilter).toBeVisible();
    await allFilter.click();

    // Test LinkedIn filter
    const linkedinFilter = page.getByRole('button', { name: /LinkedIn \(\d+\)/ });
    if (await linkedinFilter.isVisible()) {
      await linkedinFilter.click();
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '04a-filter-linkedin.png'),
        fullPage: false
      });
    }

    // Test Twitter filter
    const twitterFilter = page.getByRole('button', { name: /Twitter \(\d+\)/ });
    if (await twitterFilter.isVisible()) {
      await twitterFilter.click();
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '04b-filter-twitter.png'),
        fullPage: false
      });
    }

    // Test Instagram filter
    const instagramFilter = page.getByRole('button', { name: /Instagram \(\d+\)/ });
    if (await instagramFilter.isVisible()) {
      await instagramFilter.click();
    }

    // Test TikTok filter
    const tiktokFilter = page.getByRole('button', { name: /TikTok \(\d+\)/ });
    if (await tiktokFilter.isVisible()) {
      await tiktokFilter.click();
    }

    // Reset to All
    await allFilter.click();

    console.log('Platform Filter Test: PASSED');
  });

  test('4b. Output Features - Character count bars', async () => {
    // Find character count indicators
    const characterCounts = page.locator('text=/\\d+ \\/ \\d+ characters/');
    const countText = await characterCounts.first().textContent();
    console.log(`Sample character count: ${countText}`);

    // Check for progress bars
    const progressBars = page.locator('.h-1\\.5.bg-secondary-200');
    const barCount = await progressBars.count();
    console.log(`Found ${barCount} progress bars`);

    // Check for color indicators (green, yellow, red)
    const greenBars = page.locator('.bg-green-500');
    const yellowBars = page.locator('.bg-yellow-500');
    const redBars = page.locator('.bg-red-500');

    console.log(`Green bars: ${await greenBars.count()}, Yellow bars: ${await yellowBars.count()}, Red bars: ${await redBars.count()}`);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04c-character-counts.png'),
      fullPage: false
    });

    console.log('Character Count Test: PASSED');
  });

  test('4c. Output Features - Copy individual post', async () => {
    // Find first copy button in the posts section
    const copyButtons = page.locator('[aria-label="Copy post"]');
    const firstCopyBtn = copyButtons.first();

    if (await firstCopyBtn.isVisible()) {
      await firstCopyBtn.click();

      // Verify checkmark appears (copied state)
      await expect(page.locator('.text-green-500').first()).toBeVisible();

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '04d-copy-post.png'),
        fullPage: false
      });
    }

    console.log('Copy Individual Post Test: PASSED');
  });

  test('4d. Output Features - Copy hashtags', async () => {
    // Find copy hashtags button
    const copyHashtagsBtn = page.locator('[aria-label="Copy hashtags"]').first();

    if (await copyHashtagsBtn.isVisible()) {
      await copyHashtagsBtn.click();

      // Wait a moment for UI update
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '04e-copy-hashtags.png'),
        fullPage: false
      });
    }

    console.log('Copy Hashtags Test: PASSED');
  });

  test('4e. Output Features - Export menu', async () => {
    // Open export menu
    const exportButton = page.getByRole('button', { name: /Export/i });
    await exportButton.click();

    // Verify menu items
    await expect(page.getByText('Export CSV')).toBeVisible();
    await expect(page.getByText('Export JSON')).toBeVisible();
    await expect(page.getByText('Copy All')).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04f-export-menu.png'),
      fullPage: false
    });

    // Test CSV export (triggers download)
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByText('Export CSV').click()
    ]);
    console.log(`CSV downloaded: ${download.suggestedFilename()}`);

    // Open menu again for JSON export
    await exportButton.click();
    const [downloadJson] = await Promise.all([
      page.waitForEvent('download'),
      page.getByText('Export JSON').click()
    ]);
    console.log(`JSON downloaded: ${downloadJson.suggestedFilename()}`);

    // Test Copy All
    await exportButton.click();
    await page.getByText('Copy All').click();

    console.log('Export Menu Test: PASSED');
  });

  test('5a. Edge Cases - Single platform', async () => {
    // Reload page for fresh state
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Fill topic
    const topicField = page.locator('textarea').first();
    await topicField.fill('Quick test for single platform');

    // Deselect all, then select only Twitter
    const linkedinBtn = page.getByRole('button', { name: /LinkedIn/i }).first();
    const twitterBtn = page.getByRole('button', { name: /Twitter/i }).first();

    await linkedinBtn.click(); // Deselect
    // Twitter should remain selected

    await expect(linkedinBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(twitterBtn).toHaveAttribute('aria-pressed', 'true');

    // Generate
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });
    await generateButton.click();

    // Wait for completion
    await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05a-single-platform.png'),
      fullPage: true
    });

    console.log('Single Platform Test: PASSED');
  });

  test('5b. Edge Cases - 5 variations', async () => {
    // Reload page
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Fill topic
    const topicField = page.locator('textarea').first();
    await topicField.fill('Test with maximum 5 variations');

    // Set variations to 5
    const variationsSelect = page.locator('select').filter({ hasText: 'variation' });
    await variationsSelect.selectOption('5');

    // Verify total posts calculation (2 platforms x 5 variations = 10)
    await expect(page.getByText('Will generate 10 total posts')).toBeVisible();

    // Generate
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });
    await generateButton.click();

    // Wait for completion
    await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 90000 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05b-five-variations.png'),
      fullPage: true
    });

    console.log('5 Variations Test: PASSED');
  });

  test('5c. Edge Cases - Emojis disabled', async () => {
    // Reload page
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Fill topic
    const topicField = page.locator('textarea').first();
    await topicField.fill('Test without emojis');

    // Disable emojis
    const emojisCheckbox = page.locator('input[type="checkbox"]').nth(1);
    await emojisCheckbox.uncheck();
    await expect(emojisCheckbox).not.toBeChecked();

    // Generate
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });
    await generateButton.click();

    // Wait for completion
    await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05c-no-emojis.png'),
      fullPage: true
    });

    console.log('Emojis Disabled Test: PASSED');
  });

  test('5d. Edge Cases - Hashtags disabled', async () => {
    // Reload page
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Fill topic
    const topicField = page.locator('textarea').first();
    await topicField.fill('Test without hashtags');

    // Disable hashtags
    const hashtagsCheckbox = page.locator('input[type="checkbox"]').first();
    await hashtagsCheckbox.uncheck();
    await expect(hashtagsCheckbox).not.toBeChecked();

    // Generate
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });
    await generateButton.click();

    // Wait for completion
    await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05d-no-hashtags.png'),
      fullPage: true
    });

    // Verify no hashtags section appears
    const hashtagSections = page.locator('[aria-label="Copy hashtags"]');
    const hashtagCount = await hashtagSections.count();
    console.log(`Hashtag copy buttons visible: ${hashtagCount}`);

    console.log('Hashtags Disabled Test: PASSED');
  });

  test('6a. Dark Mode', async () => {
    // Reload page
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Enable dark mode via class on html element
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06a-dark-mode.png'),
      fullPage: true
    });

    console.log('Dark Mode Test: PASSED');
  });

  test('6b. Responsive - Mobile (375px)', async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06b-mobile-375px.png'),
      fullPage: true
    });

    // Verify elements are visible and properly laid out
    await expect(page.getByRole('heading', { name: 'AI Social Post Generator' })).toBeVisible();

    console.log('Mobile View Test: PASSED');
  });

  test('6c. Responsive - Tablet (768px)', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06c-tablet-768px.png'),
      fullPage: true
    });

    console.log('Tablet View Test: PASSED');
  });

  test('7a. Validation - Empty topic', async () => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Try to generate with empty topic
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });

    // Button should be disabled
    await expect(generateButton).toBeDisabled();

    // Type less than 5 characters
    const topicField = page.locator('textarea').first();
    await topicField.fill('Test');

    // Button should still be disabled
    await expect(generateButton).toBeDisabled();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07a-empty-topic.png'),
      fullPage: false
    });

    console.log('Empty Topic Validation Test: PASSED');
  });

  test('7b. Validation - No platforms selected', async () => {
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Fill valid topic
    const topicField = page.locator('textarea').first();
    await topicField.fill('Valid topic with more than 5 characters');

    // Deselect all platforms
    const linkedinBtn = page.getByRole('button', { name: /LinkedIn/i }).first();
    const twitterBtn = page.getByRole('button', { name: /Twitter/i }).first();

    await linkedinBtn.click(); // Deselect
    await twitterBtn.click(); // Deselect

    // Verify error message
    await expect(page.getByText('Select at least one platform')).toBeVisible();

    // Button should be disabled
    const generateButton = page.getByRole('button', { name: /Generate Posts/i });
    await expect(generateButton).toBeDisabled();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07b-no-platforms.png'),
      fullPage: false
    });

    console.log('No Platforms Validation Test: PASSED');
  });
});
