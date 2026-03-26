import { test, expect } from '@playwright/test';

const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';

function baseWidgetConfig(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    chatbot: { id: BOT_ID, name: 'E2E Test Bot', welcome_message: 'Hello!', placeholder_text: 'Type a message...', logo_url: null, language: 'en' },
    widgetConfig: {
      position: 'bottom-right', offsetX: 20, offsetY: 20,
      width: 380, height: 600, buttonSize: 60,
      primaryColor: '#0ea5e9', secondaryColor: '#f0f9ff', backgroundColor: '#ffffff',
      textColor: '#0f172a', userBubbleColor: '#0ea5e9', userBubbleTextColor: '#ffffff',
      botBubbleColor: '#f1f5f9', botBubbleTextColor: '#0f172a', headerTextColor: '#ffffff',
      inputBackgroundColor: '#ffffff', inputTextColor: '#0f172a', inputPlaceholderColor: '#94a3b8',
      sendButtonColor: '#0ea5e9', sendButtonIconColor: '#ffffff',
      formBackgroundColor: '#ffffff', formTitleColor: '#0f172a', formDescriptionColor: '#6b7280',
      formBorderColor: '#e5e7eb', formLabelColor: '#0f172a', formSubmitButtonTextColor: '#ffffff',
      formPlaceholderColor: '#94a3b8', formInputBackgroundColor: '#ffffff', formInputTextColor: '#0f172a',
      secondaryButtonColor: 'transparent', secondaryButtonTextColor: '#374151', secondaryButtonBorderColor: '#d1d5db',
      fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14,
      containerBorderRadius: 16, inputBorderRadius: 24, buttonBorderRadius: 50,
      showBranding: true, headerText: 'Chat with us',
      autoOpen: false, autoOpenDelay: 3000, soundEnabled: false,
      reportBackgroundColor: '#ffffff', reportTextColor: '#0f172a',
      reportReasonButtonColor: '#f1f5f9', reportReasonButtonTextColor: '#0f172a',
      reportReasonSelectedColor: '#0ea5e9', reportReasonSelectedTextColor: '#ffffff',
      reportSubmitButtonColor: '#0ea5e9', reportSubmitButtonTextColor: '#ffffff',
      reportInputBackgroundColor: '#f1f5f9', reportInputTextColor: '#0f172a',
      reportInputBorderColor: '#e2e8f0', customCss: '',
    },
    preChatFormConfig: { enabled: false },
    postChatSurveyConfig: { enabled: false },
    fileUploadConfig: { enabled: false },
    proactiveMessagesConfig: { enabled: false },
    transcriptConfig: { enabled: false },
    escalationConfig: { enabled: false },
    feedbackConfig: { enabled: false },
    liveHandoffConfig: { enabled: false },
    agentsAvailable: false,
    creditExhausted: false,
    creditLow: false,
    creditRemaining: null,
    creditExhaustionMode: 'tickets',
    creditExhaustionConfig: {},
    creditPackages: [],
    memoryEnabled: false,
    sessionTtlHours: 24,
    ...overrides,
  };
}

test('debug LOW-001 error capture', async ({ page }) => {
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Error') || text.includes('error') || text.includes('Cannot') || text.includes('undefined') || text.includes('TypeError') || text.includes('ReferenceError')) {
      console.log(`[${msg.type()}] ${text}`);
    }
  });
  page.on('pageerror', err => {
    console.log(`PAGE_ERROR: ${err.message}`);
    console.log(`STACK: ${err.stack?.slice(0, 500)}`);
  });

  const cfg = baseWidgetConfig({
    creditLow: true,
    creditRemaining: 5,
    creditExhausted: false,
    creditExhaustionMode: 'purchase_credits',
    creditPackages: [
      { id: 'pkg-low-1', name: '50 Credits', creditAmount: 50, priceCents: 499, stripePriceId: 'price_low_test' },
    ],
  });

  await page.route(`**/api/widget/${BOT_ID}/config*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: cfg }),
    })
  );

  await page.goto(`/widget/${BOT_ID}`);
  await page.waitForLoadState('domcontentloaded');

  const hasError = await page.getByText('Something went wrong').isVisible().catch(() => false);
  expect(hasError).toBeFalsy();
});
