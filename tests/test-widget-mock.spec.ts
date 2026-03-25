import { test, expect } from '@playwright/test';

const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test('debug widget page load', async ({ page }) => {
  // Listen to console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  await page.route(`**/api/widget/${BOT_ID}/config*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          chatbot: { id: BOT_ID, name: 'Test Bot', welcome_message: 'Hello!', placeholder_text: 'Type...', logo_url: null, language: 'en' },
          widgetConfig: {
            position: 'bottom-right', offsetX: 20, offsetY: 20,
            width: 380, height: 600, buttonSize: 60,
            primaryColor: '#0ea5e9', secondaryColor: '#f0f9ff', backgroundColor: '#ffffff',
            textColor: '#0f172a', userBubbleColor: '#0ea5e9', userBubbleTextColor: '#ffffff',
            botBubbleColor: '#f1f5f9', botBubbleTextColor: '#0f172a', headerTextColor: '#ffffff',
            inputBackgroundColor: '#ffffff', inputTextColor: '#0f172a', inputPlaceholderColor: '#94a3b8',
            sendButtonColor: '#0ea5e9', sendButtonIconColor: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14,
            containerBorderRadius: 16, inputBorderRadius: 24, buttonBorderRadius: 50,
            showBranding: true, headerText: 'Chat with us',
            autoOpen: false, autoOpenDelay: 3000, soundEnabled: false, customCss: '',
          },
          creditExhausted: false,
          creditLow: true,
          creditRemaining: 5,
          creditExhaustionMode: 'purchase_credits',
          creditPackages: [
            { id: 'pkg-1', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_test' },
          ],
        },
      }),
    })
  );

  await page.goto(`/widget/${BOT_ID}`);
  await page.waitForTimeout(5000);

  const html = await page.content();
  console.log('PAGE TITLE:', await page.title());
  console.log('HAS ERROR:', html.includes('Something went wrong'));
  console.log('HAS WIDGET:', html.includes('chat-widget'));
});
