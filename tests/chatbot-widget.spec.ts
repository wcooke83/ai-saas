import { test, expect } from '@playwright/test';

test.describe('Chatbot Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the widget SDK script', async ({ page }) => {
    const sdkScript = await page.locator('script[src="/widget/sdk.js"]').count();
    expect(sdkScript).toBeGreaterThan(0);
  });

  test('should display the chat button on the page', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    const buttonStyles = await chatButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        bottom: styles.bottom,
        right: styles.right,
        borderRadius: styles.borderRadius,
      };
    });
    
    expect(buttonStyles.position).toBe('fixed');
    expect(buttonStyles.bottom).toBe('20px');
    expect(buttonStyles.right).toBe('20px');
  });

  test('should open chat widget when button is clicked', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    await chatButton.click();
    
    const iframe = page.frameLocator('#chatbot-widget-container iframe');
    await expect(iframe.locator('body')).toBeVisible({ timeout: 5000 });
    
    await expect(chatButton).not.toBeVisible();
  });

  test('should hide button and show iframe when opened', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    const container = page.locator('#chatbot-widget-container');
    
    await chatButton.click();
    
    const iframe = container.locator('iframe');
    await expect(iframe).toBeVisible();
    
    const iframeDisplay = await iframe.evaluate((el) => 
      window.getComputedStyle(el).display
    );
    expect(iframeDisplay).toBe('block');
  });

  test('should load the correct chatbot in the iframe', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    
    const iframe = page.locator('#chatbot-widget-container iframe');
    const iframeSrc = await iframe.getAttribute('src');
    
    expect(iframeSrc).toContain('/widget/');
    expect(iframeSrc).toContain('10df2440-6aac-441a-855d-715c0ea8e506');
  });

  test('should have correct iframe dimensions', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    
    const iframe = page.locator('#chatbot-widget-container iframe');
    
    const dimensions = await iframe.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
      };
    });
    
    expect(dimensions.width).toBe('400px');
    expect(dimensions.height).toBe('600px');
    expect(dimensions.borderRadius).toBe('12px');
  });

  test('should not initialize widget inside iframe (no recursion)', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    await page.goto(`/widget/${chatbotId}`);

    await expect(page.locator('#chatbot-widget-button')).not.toBeVisible();
    await expect(page.locator('#chatbot-widget-container')).not.toBeVisible();
  });

  test('should not load widget on widget pages', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    await page.goto(`/widget/${chatbotId}`);

    await expect(page.locator('script[src="/widget/sdk.js"]')).toHaveCount(0);
  });

  test('should have hover effects on chat button', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();

    const initialTransform = await chatButton.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    await chatButton.hover();

    await expect(async () => {
      const hoveredTransform = await chatButton.evaluate((el) =>
        window.getComputedStyle(el).transform
      );
      expect(hoveredTransform).not.toBe(initialTransform);
    }).toPass({ timeout: 2000 });
  });

  test('should only create one widget instance', async ({ page }) => {
    await expect(page.locator('#chatbot-widget-container')).toHaveCount(1);
    await expect(page.locator('#chatbot-widget-button')).toHaveCount(1);
  });

  test('should have correct z-index for overlay', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    const zIndex = await chatButton.evaluate((el) => 
      window.getComputedStyle(el).zIndex
    );
    
    expect(parseInt(zIndex)).toBeGreaterThanOrEqual(9999);
  });

  test('should apply gradient background to button', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    const background = await chatButton.evaluate((el) => 
      window.getComputedStyle(el).background
    );
    
    expect(background).toContain('gradient');
  });

  test('should have SVG icon in button', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    const svg = chatButton.locator('svg');
    
    await expect(svg).toBeVisible();
    
    const svgDimensions = await svg.evaluate((el) => ({
      width: el.getAttribute('width'),
      height: el.getAttribute('height'),
    }));
    
    expect(svgDimensions.width).toBe('24');
    expect(svgDimensions.height).toBe('24');
  });

  test('should load widget on dashboard page', async ({ page }) => {
    await page.goto('/dashboard');

    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
  });

  test('should load widget on public pages', async ({ page }) => {
    await page.goto('/');

    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
  });

  test('should have proper iframe attributes', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    
    const iframe = page.locator('#chatbot-widget-container iframe');
    
    const attributes = await iframe.evaluate((el) => ({
      border: el.style.border,
      allow: el.getAttribute('allow'),
    }));
    
    expect(attributes.border).toBe('none');
    expect(attributes.allow).toBe('clipboard-write');
  });

  test('should initialize ChatWidget global object', async ({ page }) => {
    await expect(page.locator('#chatbot-widget-button')).toBeVisible();

    const hasChatWidget = await page.evaluate(() => {
      return typeof (window as any).ChatWidget !== 'undefined' &&
             typeof (window as any).ChatWidget.init === 'function';
    });
    
    expect(hasChatWidget).toBe(true);
  });

  test('should not initialize in nested iframes', async ({ page }) => {
    await expect(page.locator('#chatbot-widget-button')).toBeVisible();

    const isTopWindow = await page.evaluate(() => {
      return window.self === window.top;
    });
    
    expect(isTopWindow).toBe(true);
  });

  test('should handle multiple page navigations without duplicating widget', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#chatbot-widget-container')).toHaveCount(1);

    await page.goto('/dashboard');
    await expect(page.locator('#chatbot-widget-container')).toHaveCount(1);
  });

  test('should have circular button shape', async ({ page }) => {
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    
    const buttonShape = await chatButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
      };
    });
    
    expect(buttonShape.width).toBe('60px');
    expect(buttonShape.height).toBe('60px');
    expect(buttonShape.borderRadius).toBe('50%');
  });

  test('should position container at bottom-right', async ({ page }) => {
    const container = page.locator('#chatbot-widget-container');
    await expect(container).toBeVisible();
    
    const position = await container.evaluate((el) => {
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
    expect(parseInt(position.zIndex)).toBeGreaterThanOrEqual(9999);
  });
});
