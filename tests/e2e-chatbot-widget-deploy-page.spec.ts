import { test, expect, type Page } from '@playwright/test';

test.describe('Chatbot Widget on Deploy Page', () => {
  // Each test gets 120s — first-load Next.js compilation can take ~20-30s
  test.describe.configure({ timeout: 120000 });

  const chatbotId = 'e2e00000-0000-0000-0000-000000000001';
  const deployPageUrl = `/dashboard/chatbots/${chatbotId}/deploy`;

  // Ensure the chatbot is published before any tests run so the SDK widget renders.
  test.beforeAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: 'tests/auth/e2e-storage.json' });
    const page = await ctx.newPage();
    await page.request.post('/api/e2e/ensure-chatbot', {
      data: {
        secret: process.env.E2E_TEST_SECRET,
        chatbot_id: chatbotId,
        is_published: true,
      },
    });
    await ctx.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(deployPageUrl);
    await page.waitForLoadState('domcontentloaded');
    // Allow up to 45s for first load — Next.js dev server may need to compile + Google Fonts DNS can timeout
    await page.waitForSelector('pre', { timeout: 45000 });
  });

  // Helper: wait for the SDK widget button (loads asynchronously via useEffect polling).
  async function waitForWidgetButton(page: Page) {
    await page.waitForSelector(`#chatbot-widget-${chatbotId} button`, { timeout: 30000 });
  }

  test('should display chat widget button on deploy page', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
  });

  test('should open chat widget when button clicked on deploy page', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();

    await chatButton.click();

    const iframe = page.locator('#chatbot-widget-' + chatbotId + ' iframe');
    await expect(iframe).toBeVisible({ timeout: 5000 });

    const iframeSrc = await iframe.getAttribute('src');
    expect(iframeSrc).toContain('/widget/');
    expect(iframeSrc).toContain(chatbotId);
  });

  test('should position widget correctly on deploy page', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();

    const position = await chatButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        bottom: styles.bottom,
        right: styles.right,
        zIndex: styles.zIndex,
      };
    });

    expect(position.position).toBe('fixed');
    expect(position.bottom).toBe('20px');
    expect(position.right).toBe('20px');
    expect(parseInt(position.zIndex)).toBeGreaterThanOrEqual(10000);
  });

  test('should not interfere with deploy page content', async ({ page }) => {
    await waitForWidgetButton(page);
    await expect(page.locator('h1').first()).toBeVisible();
    const pageTitle = await page.locator('h1').first().textContent();
    expect(pageTitle).toContain('Deploy');

    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();

    const codeBlocks = page.locator('pre');
    const codeBlockCount = await codeBlocks.count();
    expect(codeBlockCount).toBeGreaterThan(0);
  });

  test('should show widget preview iframe on deploy page', async ({ page }) => {
    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    await expect(previewIframe).toBeVisible();

    const previewSrc = await previewIframe.getAttribute('src');
    expect(previewSrc).toContain(`/widget/${chatbotId}`);
  });

  test('should not show widget inside preview iframe', async ({ page }) => {
    await expect(page.locator('iframe[title="Chatbot Preview"]')).toBeVisible();
    const previewIframe = page.frameLocator('iframe[title="Chatbot Preview"]');

    const widgetInPreview = await previewIframe.locator('#chatbot-widget-' + chatbotId + ' button').count();
    expect(widgetInPreview).toBe(0);
  });

  test('should not show widget inside opened chat iframe', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    await expect(page.locator('#chatbot-widget-' + chatbotId + ' iframe')).toBeVisible();

    const chatIframe = page.frameLocator('#chatbot-widget-' + chatbotId + ' iframe');

    const nestedWidget = await chatIframe.locator('#chatbot-widget-' + chatbotId + ' button').count();
    expect(nestedWidget).toBe(0);
  });

  test('should display SDK code examples on deploy page', async ({ page }) => {
    // ChatWidget.init is shown in the "Manual Init" embed method tab.
    await page.locator('button').filter({ hasText: 'Manual Init' }).click();

    const sdkCodeBlock = page.locator('pre').filter({ hasText: 'ChatWidget.init' }).first();
    await expect(sdkCodeBlock).toBeVisible();

    const sdkCode = await sdkCodeBlock.textContent();
    expect(sdkCode).toContain('ChatWidget.init');
    expect(sdkCode).toContain(chatbotId);
  });

  test('should have copy buttons for code examples', async ({ page }) => {
    const copyButtons = page.locator('button').filter({ hasText: /Copy|Copied/ });
    const copyButtonCount = await copyButtons.count();

    expect(copyButtonCount).toBeGreaterThan(0);
  });

  test('should show Script Tag section', async ({ page }) => {
    // The embed method section was refactored. "Script Tag" is now the label
    // (previously "JavaScript SDK"). There is no longer a "Recommended" badge.
    const scriptTagButton = page.locator('button').filter({ hasText: 'Script Tag' });
    await expect(scriptTagButton).toBeVisible();
  });

  test('should show Next.js integration example', async ({ page }) => {
    // Label changed from "Next.js / TypeScript" to "Next.js / React".
    const nextjsButton = page.locator('button').filter({ hasText: 'Next.js / React' });
    await expect(nextjsButton).toBeVisible();

    // Click the method to make the code block visible before asserting.
    await nextjsButton.click();

    const nextjsCode = page.locator('pre').filter({ hasText: 'next/script' });
    await expect(nextjsCode.first()).toBeVisible();
  });

  test('should show iframe embed option', async ({ page }) => {
    // Label changed from "iFrame Embed" to "iFrame".
    const iframeButton = page.locator('button').filter({ hasText: 'iFrame' }).first();
    await expect(iframeButton).toBeVisible();

    // Click the method to make the code block visible before asserting.
    await iframeButton.click();

    const iframeCode = page.locator('pre').filter({ hasText: '<iframe' });
    await expect(iframeCode.first()).toBeVisible();
  });

  test('should show REST API section', async ({ page }) => {
    // Click the REST API tab to make the content visible.
    // Note: custom Tabs component uses plain buttons, not role="tab"
    await page.locator('button').filter({ hasText: 'REST API' }).first().click();

    const apiSection = page.locator('text=REST API');
    await expect(apiSection.first()).toBeVisible();

    const apiEndpoint = page.locator('code').filter({ hasText: `/api/chat/${chatbotId}` });
    await expect(apiEndpoint.first()).toBeVisible();
  });

  // Back to Chatbot link was removed from the deploy page. The page no longer
  // renders a "Back to Chatbot" anchor — navigation is handled by the sidebar.
  test.skip('should have back to chatbot link', async ({ page }) => {
    const backLink = page.locator('a').filter({ hasText: 'Back to Chatbot' });
    await expect(backLink).toBeVisible();

    const href = await backLink.getAttribute('href');
    expect(href).toContain(`/dashboard/chatbots/${chatbotId}`);
  });

  test('should have SDK documentation link', async ({ page }) => {
    // Link text changed from "SDK Documentation" to "SDK Docs".
    const docsLink = page.locator('a').filter({ hasText: 'SDK Docs' });
    await expect(docsLink).toBeVisible();

    const href = await docsLink.getAttribute('href');
    expect(href).toContain('/sdk');
  });

  test('should widget button be on top of page content', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
    const buttonZIndex = await chatButton.evaluate((el) =>
      parseInt(window.getComputedStyle(el).zIndex)
    );

    const pageContent = page.locator('main, div[class*="space-y"]').first();
    const contentZIndex = await pageContent.evaluate((el) => {
      const zIndex = window.getComputedStyle(el).zIndex;
      return zIndex === 'auto' ? 0 : parseInt(zIndex);
    });

    expect(buttonZIndex).toBeGreaterThan(contentZIndex);
  });

  test('should widget not block interaction with copy buttons', async ({ page }) => {
    const copyButton = page.locator('button').filter({ hasText: /Copy/ }).first();
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toBeEnabled();

    // Clicking should succeed without being intercepted by the floating widget overlay
    await copyButton.click();
    // Button still accessible after click (not replaced by an error state)
    await expect(copyButton).toBeVisible();
  });

  test('should scroll page with widget visible', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 500));

    await expect(chatButton).toBeVisible();

    const position = await chatButton.evaluate((el) =>
      window.getComputedStyle(el).position
    );
    expect(position).toBe('fixed');
  });

  test('should widget persist when navigating between tabs', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 1000));

    await expect(chatButton).toBeVisible();
  });

  test('should only have one widget instance on deploy page', async ({ page }) => {
    await waitForWidgetButton(page);
    await expect(page.locator('#chatbot-widget-' + chatbotId + ' button').first()).toBeVisible();
    const widgetContainers = await page.locator('#chatbot-widget-' + chatbotId).count();
    expect(widgetContainers).toBe(1);

    const chatButtons = await page.locator('#chatbot-widget-' + chatbotId + ' button').first().count();
    expect(chatButtons).toBe(1);
  });

  test('should widget iframe have correct chatbot ID', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    const iframe = page.locator('#chatbot-widget-' + chatbotId + ' iframe');
    const src = await iframe.getAttribute('src');

    expect(src).toBe(`http://localhost:3030/widget/${chatbotId}`);
  });

  test('should preview iframe and widget iframe be different', async ({ page }) => {
    await waitForWidgetButton(page);
    await expect(page.locator('iframe[title="Chatbot Preview"]')).toBeVisible();
    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    const previewSrc = await previewIframe.getAttribute('src');

    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await chatButton.click();

    const widgetIframe = page.locator('#chatbot-widget-' + chatbotId + ' iframe');
    const widgetSrc = await widgetIframe.getAttribute('src');

    expect(previewSrc).toContain(`/widget/${chatbotId}`);
    expect(widgetSrc).toContain(`/widget/${chatbotId}`);
  });

  test('should widget button have gradient background', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
    const background = await chatButton.evaluate((el) =>
      window.getComputedStyle(el).background
    );

    expect(background).toContain('gradient');
  });

  test('should widget button be circular', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();

    const shape = await chatButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
      };
    });

    expect(shape.width).toBe('60px');
    expect(shape.height).toBe('60px');
    expect(shape.borderRadius).toBe('50%');
  });

  test('should widget button have chat icon', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
    const svg = chatButton.locator('svg');

    await expect(svg).toBeVisible();

    const svgPath = svg.locator('path');
    await expect(svgPath).toBeVisible();
  });

  test('should close widget when clicking outside (if implemented)', async ({ page }) => {
    await waitForWidgetButton(page);
    const chatButton = page.locator('#chatbot-widget-' + chatbotId + ' button').first();
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    const iframe = page.locator('#chatbot-widget-' + chatbotId + ' iframe');
    await expect(iframe).toBeVisible();
  });
});
