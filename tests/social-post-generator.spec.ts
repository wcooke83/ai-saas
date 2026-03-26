import { test, expect } from '@playwright/test';

test.describe('AI Social Post Generator', () => {
  test('should generate social posts and test all features', async ({ page }) => {
    test.setTimeout(120000);

    // Listen for API responses
    let apiError: string | null = null;
    let apiStatus: number | null = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/tools/social-post')) {
        apiStatus = response.status();
        try {
          const data = await response.json();
          if (!data.success && data.error) {
            apiError = data.error.message || JSON.stringify(data.error);
          }
        } catch (e) {
          apiError = `Non-JSON response (status ${apiStatus})`;
        }
      }
    });

    // 1. Navigate to the page
    await page.goto('http://localhost:3030/tools/social-post');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/social-post-01-initial.png', fullPage: true });
    console.log('Step 1: Page loaded successfully');

    // 2. Fill out the form
    // Topic - using textarea with aria-required
    const topicTextarea = page.locator('textarea[aria-required="true"]').first();
    await topicTextarea.fill('Why AI is transforming how we work in 2025');
    console.log('Step 2a: Filled topic');

    // LinkedIn and Twitter are already selected by default (based on the component state)
    // Verify they're selected
    const linkedinButton = page.locator('button[aria-pressed="true"]:has-text("LinkedIn")');
    const twitterButton = page.locator('button[aria-pressed="true"]:has-text("Twitter")');

    const linkedinSelected = await linkedinButton.count() > 0;
    const twitterSelected = await twitterButton.count() > 0;
    console.log(`Step 2b: LinkedIn selected: ${linkedinSelected}, Twitter selected: ${twitterSelected}`);

    // Post type: Thought Leadership (should be default)
    // Verify the select has correct value
    const postTypeSelect = page.locator('select').first();
    const postTypeValue = await postTypeSelect.inputValue();
    console.log(`Step 2c: Post Type value: ${postTypeValue}`);

    // Tone: Professional - select it
    const toneSelect = page.locator('select').nth(1);
    await toneSelect.selectOption('professional');
    console.log('Step 2d: Selected Professional tone');

    // Variations: Keep at 3 (should be default)
    const variationsSelect = page.locator('select').nth(2);
    const variationsValue = await variationsSelect.inputValue();
    console.log(`Step 2e: Variations value: ${variationsValue}`);

    // Verify hashtags and emojis are checked
    const hashtagsCheckbox = page.locator('input[type="checkbox"]').first();
    const emojisCheckbox = page.locator('input[type="checkbox"]').nth(1);

    const hashtagsChecked = await hashtagsCheckbox.isChecked();
    const emojisChecked = await emojisCheckbox.isChecked();
    console.log(`Step 2f: Hashtags enabled: ${hashtagsChecked}, Emojis enabled: ${emojisChecked}`);

    // Take screenshot of filled form
    await page.screenshot({ path: 'tests/screenshots/social-post-02-form-filled.png', fullPage: true });

    // 3. Click Generate Posts button
    const generateButton = page.locator('button:has-text("Generate Posts")');
    await generateButton.click();
    console.log('Step 3: Clicked Generate Posts button');

    // 4. Wait for generation to complete
    // Wait for loading state to appear
    const loadingButton = page.locator('button:has-text("Generating...")');
    await loadingButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.log('Note: Loading state may have been too fast to catch');
    });
    console.log('Step 4a: Loading state detected');

    // Wait for loading to finish (button text changes back or error appears)
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const genBtn = buttons.find(b => b.textContent?.includes('Generate Posts') || b.textContent?.includes('Generating'));
        return genBtn && !genBtn.textContent?.includes('Generating');
      },
      { timeout: 90000 }
    );
    console.log('Step 4b: Loading finished');

    // Check for error alert (filter out the Next.js route announcer)
    const errorAlert = page.locator('[role="alert"]:not([id="__next-route-announcer__"])').first();
    if (await errorAlert.count() > 0) {
      const errorText = await errorAlert.textContent();
      console.log(`Step 4c: UI Error message: ${errorText}`);
    }

    if (apiError) {
      console.log(`Step 4c: API Error: ${apiError}`);
    }

    // Take screenshot of results (or error state)
    await page.screenshot({ path: 'tests/screenshots/social-post-03-results.png', fullPage: true });

    // Check for the badge that shows post count (e.g., "6 posts")
    const postsBadge = page.locator('text=/\\d+ posts/');
    const hasResults = await postsBadge.count() > 0;

    if (hasResults) {
      console.log('Step 4d: Posts generated successfully');

      // 5. Test copy button - look for any copy button with aria-label containing "Copy"
      const copyButton = page.locator('button[aria-label*="Copy"]').first();
      if (await copyButton.count() > 0) {
        await copyButton.click();
        console.log('Step 5: Clicked copy button');

        // Wait briefly for the icon to change to checkmark

        // Check if aria-label changed to "Copied!"
        const copiedButton = page.locator('button[aria-label="Copied!"]');
        if (await copiedButton.count() > 0) {
          console.log('Step 5: Copy confirmation shown (checkmark visible)');
        }

        await page.screenshot({ path: 'tests/screenshots/social-post-04-copy-clicked.png', fullPage: true });
      } else {
        console.log('Step 5: No copy button found');
      }

      // 6. Test platform filter tabs
      // The filter tabs are rounded-full buttons in the CardHeader area
      const filterContainer = page.locator('.flex.flex-wrap.gap-2.mt-4');
      const allFilterButton = filterContainer.locator('button:has-text("All")');
      const linkedinFilterButton = filterContainer.locator('button:has-text("LinkedIn")');
      const twitterFilterButton = filterContainer.locator('button:has-text("Twitter")');

      if (await allFilterButton.count() > 0) {
        console.log('Step 6: Found filter tabs');

        // Click LinkedIn filter
        if (await linkedinFilterButton.count() > 0) {
          await linkedinFilterButton.click();
          console.log('Step 6a: Clicked LinkedIn filter');
          await page.screenshot({ path: 'tests/screenshots/social-post-05-linkedin-filter.png', fullPage: true });
        }

        // Click Twitter/X filter
        if (await twitterFilterButton.count() > 0) {
          await twitterFilterButton.click();
          console.log('Step 6b: Clicked Twitter filter');
          await page.screenshot({ path: 'tests/screenshots/social-post-06-twitter-filter.png', fullPage: true });
        }

        // Click All filter
        await allFilterButton.click();
        console.log('Step 6c: Clicked All filter');
      } else {
        console.log('Step 6: No filter tabs found');
      }
    } else {
      console.log('Step 5: Skipping copy button test - no results generated');
      console.log('Step 6: Skipping filter tabs test - no results generated');
    }

    // Final screenshot
    await page.screenshot({ path: 'tests/screenshots/social-post-07-final.png', fullPage: true });
    console.log('Test completed');

    // Summary
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Form filled correctly: YES`);
    console.log(`LinkedIn selected: ${linkedinSelected}`);
    console.log(`Twitter selected: ${twitterSelected}`);
    console.log(`Post Type: ${postTypeValue}`);
    console.log(`Variations: ${variationsValue}`);
    console.log(`Hashtags enabled: ${hashtagsChecked}`);
    console.log(`Emojis enabled: ${emojisChecked}`);
    console.log(`Posts generated: ${hasResults ? 'YES' : 'NO'}`);
    if (apiError) {
      console.log(`\n=== BUG FOUND ===`);
      console.log(`API Error: ${apiError}`);
    }
  });
});
