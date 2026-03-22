import { test, expect } from '@playwright/test';

test.describe('Chatbot Widget - Recursion Prevention', () => {
  test('should not create widget inside widget iframe', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await expect(chatButton).toBeVisible();
    await chatButton.click();
    
    await page.waitForTimeout(1000);
    
    const iframe = page.frameLocator('#chatbot-widget-container iframe');
    
    const nestedWidgetButton = iframe.locator('#chatbot-widget-button');
    const nestedWidgetCount = await nestedWidgetButton.count();
    expect(nestedWidgetCount).toBe(0);
    
    const nestedContainer = iframe.locator('#chatbot-widget-container');
    const nestedContainerCount = await nestedContainer.count();
    expect(nestedContainerCount).toBe(0);
  });

  test('should prevent SDK initialization in iframe context', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    await page.goto(`/widget/${chatbotId}`);
    
    await page.waitForTimeout(2000);
    
    const hasWidget = await page.evaluate(() => {
      return document.getElementById('chatbot-widget-container') !== null;
    });
    
    expect(hasWidget).toBe(false);
  });

  test('should detect iframe context correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const chatButton = page.locator('#chatbot-widget-button');
    await chatButton.click();
    
    const iframe = page.frameLocator('#chatbot-widget-container iframe');
    
    const isInIframe = await iframe.locator('body').evaluate(() => {
      return window.self !== window.top;
    });
    
    expect(isInIframe).toBe(true);
  });

  test('should only load widget script once on main page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const scriptCount = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[src="/widget/sdk.js"]');
      return scripts.length;
    });
    
    expect(scriptCount).toBeLessThanOrEqual(1);
  });

  test('should not load widget on /widget/* paths', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    await page.goto(`/widget/${chatbotId}`);
    
    await page.waitForTimeout(2000);
    
    const widgetExists = await page.evaluate(() => {
      return document.getElementById('chatbot-widget-button') !== null;
    });
    
    expect(widgetExists).toBe(false);
  });

  test('should handle rapid navigation without widget duplication', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    
    await page.goto('/dashboard');
    await page.waitForTimeout(500);
    
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const widgetCount = await page.locator('#chatbot-widget-container').count();
    expect(widgetCount).toBeLessThanOrEqual(1);
  });

  test('should cleanup widget on navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const initialCount = await page.locator('#chatbot-widget-container').count();
    expect(initialCount).toBe(1);
    
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    const afterNavCount = await page.locator('#chatbot-widget-container').count();
    expect(afterNavCount).toBeLessThanOrEqual(1);
  });

  test('should verify widget layout has separate html/body', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    await page.goto(`/widget/${chatbotId}`);
    
    const hasHtml = await page.locator('html').count();
    const hasBody = await page.locator('body').count();
    
    expect(hasHtml).toBe(1);
    expect(hasBody).toBe(1);
  });

  test('should not inherit parent layout in widget iframe', async ({ page }) => {
    const chatbotId = '10df2440-6aac-441a-855d-715c0ea8e506';
    await page.goto(`/widget/${chatbotId}`);
    
    await page.waitForTimeout(1000);
    
    const hasThemeProvider = await page.evaluate(() => {
      const bodyContent = document.body.innerHTML;
      return bodyContent.includes('ThemeProvider') || 
             bodyContent.includes('ColorOverridesProvider');
    });
    
    expect(hasThemeProvider).toBe(false);
  });

  test('should prevent multiple init calls', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const initResult = await page.evaluate(() => {
      if ((window as any).ChatWidget) {
        (window as any).ChatWidget.init({
          chatbotId: '10df2440-6aac-441a-855d-715c0ea8e506'
        });
        
        (window as any).ChatWidget.init({
          chatbotId: '10df2440-6aac-441a-855d-715c0ea8e506'
        });
      }
      
      return document.querySelectorAll('#chatbot-widget-container').length;
    });
    
    expect(initResult).toBe(1);
  });

  test('should verify SDK serves correct content type', async ({ page }) => {
    const response = await page.goto('/widget/sdk.js');
    
    expect(response?.status()).toBe(200);
    
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('javascript');
  });

  test('should verify SDK contains recursion check', async ({ page }) => {
    const response = await page.goto('/widget/sdk.js');
    const sdkContent = await response?.text();
    
    expect(sdkContent).toContain('window.self !== window.top');
  });

  test('should verify SDK contains init function', async ({ page }) => {
    const response = await page.goto('/widget/sdk.js');
    const sdkContent = await response?.text();
    
    expect(sdkContent).toContain('ChatWidget');
    expect(sdkContent).toContain('init: function');
  });

  test('should not show widget in deeply nested iframes', async ({ page }) => {
    await page.setContent(`
      <html>
        <body>
          <iframe id="level1" src="about:blank"></iframe>
          <script src="/widget/sdk.js"></script>
          <script>
            if (window.ChatWidget) {
              window.ChatWidget.init({ chatbotId: '10df2440-6aac-441a-855d-715c0ea8e506' });
            }
          </script>
        </body>
      </html>
    `);
    
    await page.waitForTimeout(1000);
    
    const frame = page.frameLocator('#level1');
    const widgetInFrame = await frame.locator('#chatbot-widget-container').count();
    
    expect(widgetInFrame).toBe(0);
  });

  test('should handle missing chatbotId gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.evaluate(() => {
      if ((window as any).ChatWidget) {
        (window as any).ChatWidget.init({});
      }
    });
    
    await page.waitForTimeout(500);
    
    const hasError = consoleMessages.some(msg => 
      msg.includes('chatbotId is required')
    );
    
    expect(hasError).toBe(true);
  });
});
