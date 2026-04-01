import { test, expect } from '@playwright/test';

const SCREENSHOTS = 'tests/screenshots/onboarding-wizard';

test.describe('Onboarding Wizard Flow', () => {
  test.setTimeout(180_000);

  // Clean up test chatbots before running
  test.beforeEach(async ({ page }) => {
    const res = await page.request.get('/api/chatbots');
    if (res.ok()) {
      const data = await res.json();
      const chatbots = data.data?.chatbots ?? [];
      for (const bot of chatbots) {
        if (bot.name === 'Test Wizard Bot') {
          console.log(`Cleaning up test chatbot: ${bot.id}`);
          await page.request.delete(`/api/chatbots/${bot.id}`);
        }
      }
    }
  });

  test('full wizard flow: name -> train -> test -> style -> deploy -> dashboard', async ({ page }) => {
    // Log console messages and errors for debugging
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log(`[BROWSER ERROR]: ${msg.text()}`);
    });
    page.on('pageerror', (err) => {
      console.log(`[PAGE ERROR]: ${err.message}`);
    });

    // ──────────────────────────────────────────────
    // 1. Dashboard entry point
    // ──────────────────────────────────────────────
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS}/01-dashboard.png`, fullPage: true });
    console.log(`Dashboard URL: ${page.url()}`);

    // Navigate to the onboarding entry; let the server decide where to go
    await page.goto('/onboarding');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    let entryUrl = page.url();
    console.log(`After /onboarding navigation: ${entryUrl}`);

    // If redirected to dashboard, user has chatbots with completed onboarding.
    // The /onboarding entry page will redirect to /dashboard if user already has bots.
    // Since we want to test step 1, go directly to /onboarding/new/step/1.
    if (entryUrl.includes('/dashboard')) {
      console.log('Redirected to dashboard. Trying /onboarding/new/step/1...');
      await page.goto('/onboarding/new/step/1');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
      entryUrl = page.url();
      console.log(`After /onboarding/new/step/1: ${entryUrl}`);
    }

    // If we ended up on a specific step that's not step 1, check the page content
    await page.screenshot({ path: `${SCREENSHOTS}/02-step1-name.png`, fullPage: true });

    // Check if we got a 404
    const is404 = await page.locator('text=This page could not be found').isVisible().catch(() => false);
    if (is404) {
      console.log('WARNING: Got 404 on /onboarding/new/step/1. The route may not be compiled yet in dev mode.');
      console.log('Trying to navigate via /onboarding and waiting for server redirect...');

      // Refresh and try again -- sometimes Next.js dev needs a second compile
      await page.goto('/onboarding');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
      entryUrl = page.url();
      console.log(`Second attempt URL: ${entryUrl}`);
      await page.screenshot({ path: `${SCREENSHOTS}/02-step1-name.png`, fullPage: true });
    }

    // At this point we should be on some onboarding step
    // Handle the various states:
    const isOnOnboarding = entryUrl.includes('/onboarding');
    const isOnStep1 = entryUrl.includes('/step/1') || entryUrl.includes('/new/');
    console.log(`On onboarding: ${isOnOnboarding}, On step 1: ${isOnStep1}`);

    if (!isOnOnboarding) {
      // If still on dashboard, this means user already has completed chatbots.
      // Skip to /onboarding/new/step/1 -- this IS a valid route according to the code.
      console.log('Not on onboarding page. Current URL:', entryUrl);
      // The 404 might mean the page hasn't been compiled by Next.js dev server yet.
      // Let's force a compile by visiting it fresh.
      const resp = await page.goto('/onboarding/new/step/1', { waitUntil: 'networkidle' });
      console.log(`Direct navigation response status: ${resp?.status()}`);
      await page.waitForTimeout(3000);
      entryUrl = page.url();
      console.log(`After direct navigation: ${entryUrl}`);
      await page.screenshot({ path: `${SCREENSHOTS}/02-step1-name-retry.png`, fullPage: true });
    }

    // ──────────────────────────────────────────────
    // 2. Step 1: Name your chatbot
    // ──────────────────────────────────────────────

    // Wait for the progress stepper to appear (may take a moment after redirect)
    const stepper = page.locator('nav[aria-label="Setup progress"]');
    await expect(stepper).toBeVisible({ timeout: 15000 });
    console.log('PASS: Progress stepper is visible');

    // No sidebar
    const sidebarCount = await page.locator('nav[aria-label="Sidebar"], [data-testid="sidebar"]').count();
    expect(sidebarCount).toBe(0);
    console.log('PASS: No sidebar visible (onboarding layout)');

    // 5 steps in stepper
    const stepButtons = stepper.locator('button');
    expect(await stepButtons.count()).toBe(5);
    console.log('PASS: 5 steps in the stepper');

    // Step 1 is active
    const activeStep = page.locator('button[aria-current="step"]');
    await expect(activeStep).toBeVisible();
    const activeLabel = await activeStep.getAttribute('aria-label');
    console.log(`Active step: ${activeLabel}`);
    expect(activeLabel).toContain('Name');
    console.log('PASS: Step 1 (Name) is the current step');

    // Name input
    const nameInput = page.locator('#chatbot-name');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    console.log('PASS: Name input is visible');

    // 6 template cards
    const templates = page.locator('button[aria-pressed]');
    expect(await templates.count()).toBe(6);
    console.log('PASS: 6 template cards visible');

    // First template pre-selected
    expect(await templates.first().getAttribute('aria-pressed')).toBe('true');
    console.log('PASS: First template pre-selected');

    // Fill name and submit
    await nameInput.fill('Test Wizard Bot');
    console.log('Typed chatbot name: "Test Wizard Bot"');

    const nextBtn1 = page.locator('button', { hasText: 'Next: Train your chatbot' });
    await expect(nextBtn1).toBeEnabled();
    await page.screenshot({ path: `${SCREENSHOTS}/03-step1-filled.png`, fullPage: true });

    // Listen for API response
    const createPromise = page.waitForResponse(
      (r) => r.url().includes('/api/onboarding/start'),
      { timeout: 30000 }
    );
    await nextBtn1.click();
    console.log('Clicked "Next: Train your chatbot"');

    const createResp = await createPromise;
    console.log(`/api/onboarding/start: ${createResp.status()}`);
    if (!createResp.ok()) {
      const body = await createResp.text().catch(() => '');
      console.log(`ERROR body: ${body}`);
      await page.screenshot({ path: `${SCREENSHOTS}/error-step1.png`, fullPage: true });
    }
    expect(createResp.ok()).toBeTruthy();

    await page.waitForURL(/\/step\/2/, { timeout: 30000 });
    console.log(`PASS: Navigated to step 2: ${page.url()}`);

    // ──────────────────────────────────────────────
    // 3. Step 2: Train your chatbot
    // ──────────────────────────────────────────────
    await page.waitForLoadState('domcontentloaded');
    // Extra wait to ensure chatbot is fully persisted in DB
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${SCREENSHOTS}/04-step2-train.png`, fullPage: true });

    // Verify step 2 active
    const step2Label = await page.locator('button[aria-current="step"]').getAttribute('aria-label');
    expect(step2Label).toContain('Train');
    console.log('PASS: Step 2 (Train) is active');

    // Step 1 completed
    const step1Done = await page.locator('button[aria-label*="Name"][aria-label*="completed"]').isVisible();
    console.log(`Step 1 completed indicator: ${step1Done}`);

    // Tabs visible
    await expect(page.locator('#tab-url')).toBeVisible();
    await expect(page.locator('#tab-text')).toBeVisible();
    console.log('PASS: Import Website and Paste Text tabs visible');

    // URL tab active by default
    expect(await page.locator('#tab-url').getAttribute('aria-selected')).toBe('true');
    console.log('PASS: URL tab active by default');

    // Switch to Paste Text
    await page.locator('#tab-text').click();
    await page.waitForTimeout(500);
    expect(await page.locator('#tab-text').getAttribute('aria-selected')).toBe('true');
    console.log('PASS: Switched to Paste Text tab');

    // Type content
    await page.locator('#text-content').fill('VocUI is an AI chatbot builder. It helps businesses create custom chatbots.');
    console.log('Typed text content');

    // Add text
    const addBtn = page.locator('button', { hasText: 'Add Text' });
    await expect(addBtn).toBeEnabled();

    const kPromise = page.waitForResponse(
      (r) => r.url().includes('/knowledge') && r.request().method() === 'POST',
      { timeout: 30000 }
    );
    await addBtn.click();
    console.log('Clicked "Add Text"');

    const kResp = await kPromise;
    console.log(`Knowledge API: ${kResp.status()}`);
    expect(kResp.ok()).toBeTruthy();

    // Source appears in list
    await expect(page.locator('text=Knowledge sources')).toBeVisible({ timeout: 15000 });
    console.log('PASS: Knowledge source added and visible');

    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOTS}/05-step2-source-added.png`, fullPage: true });

    // Next: Test
    const nextBtn2 = page.locator('button', { hasText: 'Next: Test your chatbot' });
    const sPromise2 = page.waitForResponse(
      (r) => r.url().includes('/step') && r.request().method() === 'PATCH',
      { timeout: 30000 }
    );
    await nextBtn2.click();
    console.log('Clicked "Next: Test your chatbot"');

    const sResp2 = await sPromise2;
    console.log(`Step 2->3 API: ${sResp2.status()}`);

    await page.waitForURL(/\/step\/3/, { timeout: 30000 });
    console.log(`PASS: Navigated to step 3: ${page.url()}`);

    // ──────────────────────────────────────────────
    // 4. Step 3: Test your chatbot
    // ──────────────────────────────────────────────
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS}/06-step3-test.png`, fullPage: true });

    // Verify step 3 active
    const step3Label = await page.locator('button[aria-current="step"]').getAttribute('aria-label');
    expect(step3Label).toContain('Test');
    console.log('PASS: Step 3 (Test) is active');

    // Chat input should be visible
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"], input[type="text"]').first();
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    console.log('PASS: Chat input visible');

    // Suggested questions should be visible
    const suggestions = page.locator('button[data-suggestion], button:has-text("Try:")').first();
    const hasSuggestions = await suggestions.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Suggested questions visible: ${hasSuggestions}`);

    // Skip the test step (we don't want to wait for AI response in e2e)
    const skipTest = page.locator('button, a', { hasText: /skip|Next: Style/i }).first();
    await expect(skipTest).toBeVisible({ timeout: 5000 });
    const skipStepPromise = page.waitForResponse(
      (r) => r.url().includes('/step') && r.request().method() === 'PATCH',
      { timeout: 30000 }
    );
    await skipTest.click();
    console.log('Clicked skip/next on Test step');

    const skipResp = await skipStepPromise;
    console.log(`Step 3->4 API: ${skipResp.status()}`);

    await page.waitForURL(/\/step\/4/, { timeout: 30000 });
    console.log(`PASS: Navigated to step 4: ${page.url()}`);

    // ──────────────────────────────────────────────
    // 5. Step 4: Style your widget
    // ──────────────────────────────────────────────
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS}/07-step4-style.png`, fullPage: true });

    // Verify step 4 active
    const step4StyleLabel = await page.locator('button[aria-current="step"]').getAttribute('aria-label');
    expect(step4StyleLabel).toContain('Style');
    console.log('PASS: Step 4 (Style) is active');

    // Color swatches
    const purple = page.locator('button[aria-label="Purple"]');
    await expect(purple).toBeVisible({ timeout: 5000 });
    console.log('PASS: Color swatches visible');

    // Position selector
    expect(await page.locator('[role="radio"]').count()).toBe(4);
    console.log('PASS: 4 position radio buttons');

    // Select purple
    await purple.click();
    await page.waitForTimeout(300);
    expect(await purple.getAttribute('aria-pressed')).toBe('true');
    console.log('PASS: Purple swatch selected');

    // Select Bottom Left (force: true to avoid chat widget bubble intercepting)
    const bl = page.locator('[role="radio"]', { hasText: 'Bottom Left' });
    await bl.click({ force: true });
    await page.waitForTimeout(300);
    expect(await bl.getAttribute('aria-checked')).toBe('true');
    console.log('PASS: Bottom Left position selected');

    await page.screenshot({ path: `${SCREENSHOTS}/08-step4-styled.png`, fullPage: true });

    // Next: Deploy
    const nextBtn4 = page.locator('button', { hasText: 'Next: Deploy your chatbot' });
    const styleApiPromise = page.waitForResponse(
      (r) => r.url().match(/\/api\/chatbots\/[^/]+$/) !== null && r.request().method() === 'PATCH',
      { timeout: 30000 }
    ).catch(() => null);
    await nextBtn4.click({ force: true });
    console.log('Clicked "Next: Deploy your chatbot"');

    if (styleApiPromise) {
      const styleResp = await styleApiPromise;
      if (styleResp) console.log(`Style save API: ${styleResp.status()}`);
    }

    await page.waitForURL(/\/step\/5/, { timeout: 30000 });
    console.log(`PASS: Navigated to step 5: ${page.url()}`);

    // ──────────────────────────────────────────────
    // 6. Step 5: Deploy your chatbot
    // ──────────────────────────────────────────────
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS}/09-step5-deploy.png`, fullPage: true });

    // Verify step 5 active
    const step5Label = await page.locator('button[aria-current="step"]').getAttribute('aria-label');
    expect(step5Label).toContain('Deploy');
    console.log('PASS: Step 5 (Deploy) is active');

    // Publish button
    const publishBtn = page.locator('button', { hasText: 'Publish Chatbot' });
    await expect(publishBtn).toBeVisible({ timeout: 5000 });
    console.log('PASS: "Publish Chatbot" button visible');

    // Embed code
    const embedPre = page.locator('pre[aria-label="Embed code snippet"]');
    await expect(embedPre).toBeVisible();
    console.log('PASS: Embed code section visible');

    // Greyed out before publish
    expect(await embedPre.getAttribute('class')).toContain('opacity-50');
    console.log('PASS: Embed code greyed out (unpublished)');

    // Publish
    const pubPromise = page.waitForResponse(
      (r) => r.url().includes('/publish') && r.request().method() === 'POST',
      { timeout: 30000 }
    );
    await publishBtn.click();
    console.log('Clicked "Publish Chatbot"');

    const pubResp = await pubPromise;
    console.log(`Publish API: ${pubResp.status()}`);
    expect(pubResp.ok()).toBeTruthy();

    // Success state
    await expect(page.locator('text=Your chatbot is live')).toBeVisible({ timeout: 15000 });
    console.log('PASS: "Your chatbot is live" message appeared');

    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOTS}/10-step5-published.png`, fullPage: true });

    // Embed code active after publish
    expect(await embedPre.getAttribute('class')).not.toContain('opacity-50');
    console.log('PASS: Embed code is now active');

    // Go to dashboard
    const dashBtn = page.locator('button', { hasText: 'Go to dashboard' });
    await expect(dashBtn).toBeVisible();

    // Listen for the step completion API call
    const completePromise = page.waitForResponse(
      (r) => r.url().includes('/step') && r.request().method() === 'PATCH',
      { timeout: 30000 }
    ).catch(() => null);

    await dashBtn.click();
    console.log('Clicked "Go to dashboard"');

    const completeResp = await completePromise;
    if (completeResp) {
      console.log(`Complete API: ${completeResp.status()}`);
    }

    // ──────────────────────────────────────────────
    // 6. Post-wizard: verify landing page
    // ──────────────────────────────────────────────
    // Wait for navigation -- Next.js client-side nav may take a moment
    // Poll for the URL change since router.push may not trigger "load"
    let navigated = false;
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000);
      const url = page.url();
      if (url.includes('/dashboard/chatbots/')) {
        navigated = true;
        console.log(`Navigation detected after ${i + 1}s: ${url}`);
        break;
      }
      if (i === 9) console.log(`Still waiting for navigation... URL: ${url}`);
      if (i === 19) console.log(`Still waiting for navigation... URL: ${url}`);
    }

    if (!navigated) {
      // Last resort: check if the "Go to dashboard" button changed state
      const url = page.url();
      console.log(`Navigation not detected after 30s. Current URL: ${url}`);
      await page.screenshot({ path: `${SCREENSHOTS}/error-post-wizard.png`, fullPage: true });
    }

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    console.log(`Final URL: ${finalUrl}`);
    expect(finalUrl).toContain('/dashboard/chatbots/');
    expect(finalUrl).not.toContain('/onboarding');
    console.log('PASS: Landed on chatbot dashboard page');

    await page.screenshot({ path: `${SCREENSHOTS}/10-post-wizard-dashboard.png`, fullPage: true });

    console.log('');
    console.log('===========================================');
    console.log('  ONBOARDING WIZARD: ALL CHECKS PASSED');
    console.log('===========================================');
  });
});
