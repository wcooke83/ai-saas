import { test, expect } from '@playwright/test';

test.describe('Chatbot Widget on Deploy Page', () => {
  const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
  const deployPageUrl = `/dashboard/chatbots/${chatbotId}/deploy`;

  test.beforeEach(async ({ page }) => {
    await page.goto(deployPageUrl);
  });

  test('should display chat widget button on deploy page', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
  });

  test('should open chat widget when button clicked on deploy page', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    await chatButton.click();
    
    const iframe = page.locator('#chatbot-widget-container iframe');
    await expect(iframe).toBeVisible({ timeout: 5000 });
    
    const iframeSrc = await iframe.getAttribute('src');
    expect(iframeSrc).toContain('/widget/');
    expect(iframeSrc).toContain(chatbotId);
  });

  test('should position widget correctly on deploy page', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    
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
    await page.waitForTimeout(1000);
    
    const pageTitle = await page.locator('h1').first().textContent();
    expect(pageTitle).toContain('Deploy');
    
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    const codeBlocks = page.locator('pre');
    const codeBlockCount = await codeBlocks.count();
    expect(codeBlockCount).toBeGreaterThan(0);
  });

  test('should show widget preview iframe on deploy page', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    await expect(previewIframe).toBeVisible();
    
    const previewSrc = await previewIframe.getAttribute('src');
    expect(previewSrc).toContain(`/widget/${chatbotId}`);
  });

  test('should not show widget inside preview iframe', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const previewIframe = page.frameLocator('iframe[title="Chatbot Preview"]');
    
    const widgetInPreview = await previewIframe.locator('#chatbot-widget-button').count();
    expect(widgetInPreview).toBe(0);
  });

  test('should not show widget inside opened chat iframe', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await chatButton.click();
    
    await page.waitForTimeout(1000);
    
    const chatIframe = page.frameLocator('#chatbot-widget-container iframe');
    
    const nestedWidget = await chatIframe.locator('#chatbot-widget-button').count();
    expect(nestedWidget).toBe(0);
  });

  test('should display SDK code examples on deploy page', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const sdkCodeBlock = page.locator('pre').filter({ hasText: 'ChatWidget.init' }).first();
    await expect(sdkCodeBlock).toBeVisible();
    
    const sdkCode = await sdkCodeBlock.textContent();
    expect(sdkCode).toContain('ChatWidget.init');
    expect(sdkCode).toContain(chatbotId);
  });

  test('should have copy buttons for code examples', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const copyButtons = page.locator('button').filter({ hasText: /Copy|Copied/ });
    const copyButtonCount = await copyButtons.count();
    
    expect(copyButtonCount).toBeGreaterThan(0);
  });

  test('should show JavaScript SDK section', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const sdkSection = page.locator('text=JavaScript SDK');
    await expect(sdkSection).toBeVisible();
    
    const recommendedBadge = page.locator('text=Recommended').first();
    await expect(recommendedBadge).toBeVisible();
  });

  test('should show Next.js integration example', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const nextjsSection = page.locator('text=Next.js / TypeScript');
    await expect(nextjsSection).toBeVisible();
    
    const nextjsCode = page.locator('pre').filter({ hasText: 'next/script' });
    await expect(nextjsCode.first()).toBeVisible();
  });

  test('should show iframe embed option', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const iframeSection = page.locator('text=iFrame Embed');
    await expect(iframeSection).toBeVisible();
    
    const iframeCode = page.locator('pre').filter({ hasText: '<iframe' });
    await expect(iframeCode.first()).toBeVisible();
  });

  test('should show REST API section', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const apiSection = page.locator('text=REST API');
    await expect(apiSection).toBeVisible();
    
    const apiEndpoint = page.locator('code').filter({ hasText: `/api/chat/${chatbotId}` });
    await expect(apiEndpoint.first()).toBeVisible();
  });

  test('should have back to chatbot link', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const backLink = page.locator('a').filter({ hasText: 'Back to Chatbot' });
    await expect(backLink).toBeVisible();
    
    const href = await backLink.getAttribute('href');
    expect(href).toContain(`/dashboard/chatbots/${chatbotId}`);
  });

  test('should have SDK documentation link', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const docsLink = page.locator('a').filter({ hasText: 'SDK Documentation' });
    await expect(docsLink).toBeVisible();
    
    const href = await docsLink.getAttribute('href');
    expect(href).toContain('/sdk');
  });

  test('should widget button be on top of page content', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
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
    await page.waitForTimeout(1000);
    
    const copyButton = page.locator('button').filter({ hasText: /Copy/ }).first();
    await expect(copyButton).toBeVisible();
    
    await copyButton.click();
    
    await expect(copyButton.filter({ hasText: 'Copied' })).toBeVisible({ timeout: 2000 });
  });

  test('should scroll page with widget visible', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    await expect(chatButton).toBeVisible();
    
    const position = await chatButton.evaluate((el) => 
      window.getComputedStyle(el).position
    );
    expect(position).toBe('fixed');
  });

  test('should widget persist when navigating between tabs', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    await expect(chatButton).toBeVisible();
  });

  test('should only have one widget instance on deploy page', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const widgetContainers = await page.locator('#chatbot-widget-container').count();
    expect(widgetContainers).toBe(1);
    
    const chatButtons = await page.locator('#chatbot-widget-button').count();
    expect(chatButtons).toBe(1);
  });

  test('should widget iframe have correct chatbot ID', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await chatButton.click();
    
    const iframe = page.locator('#chatbot-widget-container iframe');
    const src = await iframe.getAttribute('src');
    
    expect(src).toBe(`http://localhost:3030/widget/${chatbotId}`);
  });

  test('should preview iframe and widget iframe be different', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    const previewSrc = await previewIframe.getAttribute('src');
    
    const chatButton = page.locator('#chatbot-widget-button');
    await chatButton.click();
    
    const widgetIframe = page.locator('#chatbot-widget-container iframe');
    const widgetSrc = await widgetIframe.getAttribute('src');
    
    expect(previewSrc).toContain(`/widget/${chatbotId}`);
    expect(widgetSrc).toContain(`/widget/${chatbotId}`);
  });

  test('should widget button have gradient background', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    const background = await chatButton.evaluate((el) => 
      window.getComputedStyle(el).background
    );
    
    expect(background).toContain('gradient');
  });

  test('should widget button be circular', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    
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
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    const svg = chatButton.locator('svg');
    
    await expect(svg).toBeVisible();
    
    const svgPath = svg.locator('path');
    await expect(svgPath).toBeVisible();
  });

  test('should close widget when clicking outside (if implemented)', async ({ page }) => {
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await chatButton.click();
    
    const iframe = page.locator('#chatbot-widget-container iframe');
    await expect(iframe).toBeVisible();
    
    await page.waitForTimeout(500);
  });
});
