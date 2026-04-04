import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;
const DEPLOY_URL = `${BASE}/deploy`;

async function gotoDeploy(page: import('@playwright/test').Page) {
  await page.goto(DEPLOY_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForResponse(
    (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.status() === 200,
    { timeout: 15000 }
  ).catch(() => {});
  await expect(page.getByText('Deploy Chatbot')).toBeVisible({ timeout: 20000 });
}

async function gotoWhatsAppTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /WhatsApp/i }).click();
  await expect(page.getByText('WhatsApp').first()).toBeVisible({ timeout: 10000 });
}

/** Minimal chatbot API response shape the page expects */
function makeConnectedChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        whatsapp_config: {
          enabled: true,
          phone_number_id: '123456789012345',
          verify_token: 'test-verify-token-abc',
          ai_responses_enabled: true,
          ...overrides,
        },
      },
    },
  };
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – WhatsApp Tab – Navigation', () => {
  test('WA-UI-001: WhatsApp tab trigger is visible and clickable', async ({ page }) => {
    await gotoDeploy(page);

    const tab = page.getByRole('tab', { name: /WhatsApp/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
    await tab.click();
    // Tab is now selected
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('WA-UI-002: Clicking WhatsApp tab shows the WhatsApp card with title', async ({ page }) => {
    await gotoDeploy(page);

    await page.getByRole('tab', { name: /WhatsApp/i }).click();

    // Card title rendered inside the tab content
    await expect(page.getByRole('heading', { name: 'WhatsApp' })).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText('Deploy this chatbot on WhatsApp')
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disconnected State ───────────────────────────────────────────────────────

test.describe('Deploy Page – WhatsApp Tab – Disconnected State', () => {
  test('WA-UI-010: Shows 4-step setup guide when disconnected', async ({ page }) => {
    await gotoWhatsAppTab(page);

    // The numbered steps should be visible
    await expect(page.getByText('Create a Meta Business app')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Get your credentials')).toBeVisible();
    await expect(page.getByText('Enter credentials below')).toBeVisible();
    await expect(page.getByText('Configure webhook')).toBeVisible();

    // Step numbers 1-4 appear as round badges (each step card has one)
    for (const n of ['1', '2', '3', '4']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('WA-UI-011: Phone Number ID input is visible with correct placeholder', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const input = page.locator('#whatsapp-phone-id');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', '123456789012345');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('WA-UI-012: Access Token input is visible and is type=password', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const input = page.locator('#whatsapp-token');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Your permanent access token');
  });

  test('WA-UI-013: Verify Token input is visible with Generate button', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const input = page.locator('#whatsapp-verify-token');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', 'Leave blank to auto-generate');

    const generateBtn = page.getByRole('button', { name: /Generate/i });
    await expect(generateBtn).toBeVisible({ timeout: 10000 });
  });

  test('WA-UI-014: Connect button is disabled when inputs are empty', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const connectBtn = page.getByRole('button', { name: /Connect to WhatsApp/i });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await expect(connectBtn).toBeDisabled();
  });

  test('WA-UI-015: Connect button enables when Phone Number ID and Access Token are filled', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const connectBtn = page.getByRole('button', { name: /Connect to WhatsApp/i });
    await expect(connectBtn).toBeDisabled();

    // Fill Phone Number ID only — still disabled
    await page.locator('#whatsapp-phone-id').fill('123456789012345');
    await expect(connectBtn).toBeDisabled();

    // Fill Access Token too — now enabled
    await page.locator('#whatsapp-token').fill('EAAexampletoken123');
    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('WA-UI-016: Generate button populates the Verify Token field with a non-empty value', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const input = page.locator('#whatsapp-verify-token');
    await expect(input).toHaveValue('');

    await page.getByRole('button', { name: /Generate/i }).click();

    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('WA-UI-017: Verify Token can be manually entered', async ({ page }) => {
    await gotoWhatsAppTab(page);

    const input = page.locator('#whatsapp-verify-token');
    await input.fill('my-custom-verify-token');
    await expect(input).toHaveValue('my-custom-verify-token');
  });
});

// ─── Connected State ──────────────────────────────────────────────────────────

test.describe('Deploy Page – WhatsApp Tab – Connected State', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept chatbot fetch BEFORE navigating so state initialises as connected
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    // Intercept the slack integration endpoint (loaded in the same useEffect) to avoid timeouts
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/whatsapp/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /WhatsApp/i }).click();
  });

  test('WA-UI-020: Connected state shows green "Connected to WhatsApp" banner', async ({ page }) => {
    await expect(page.getByText('Connected to WhatsApp')).toBeVisible({ timeout: 10000 });
  });

  test('WA-UI-021: Connected state shows Phone Number ID', async ({ page }) => {
    await expect(page.getByText(/Phone Number ID: 123456789012345/)).toBeVisible({ timeout: 10000 });
  });

  test('WA-UI-022: Connected state shows Webhook URL containing path-param form, not query-param', async ({ page }) => {
    const expectedPath = `/api/whatsapp/webhook/${CHATBOT_ID}`;
    const webhookCode = page.locator('code').filter({ hasText: expectedPath }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent();
    expect(text).toContain(expectedPath);
    // Explicitly assert the old (broken) query-param form is NOT used
    expect(text).not.toContain(`?chatbot_id=${CHATBOT_ID}`);
  });

  test('WA-UI-023: Connected state shows Verify Token value', async ({ page }) => {
    // The verify token is displayed in a <code> element in the connected state
    const verifyTokenCode = page.locator('code').filter({ hasText: 'test-verify-token-abc' }).first();
    await expect(verifyTokenCode).toBeVisible({ timeout: 10000 });
  });

  test('WA-UI-024: Disconnect button is visible in connected state', async ({ page }) => {
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeVisible({ timeout: 10000 });
    await expect(disconnectBtn).toBeEnabled();
  });

  test('WA-UI-025: AI Responses toggle is visible in connected state', async ({ page }) => {
    // The switch is a <button role="switch">
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    // ai_responses_enabled: true in our mock, so aria-checked should be "true"
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('WA-UI-026: Webhook URL copy button is present', async ({ page }) => {
    // Wait for connected state
    await expect(page.getByText('Connected to WhatsApp')).toBeVisible({ timeout: 10000 });

    // The webhook URL row contains a copy button (SVG icon button next to the code block)
    const webhookSection = page.locator('div').filter({ hasText: 'Webhook URL' }).last();
    await expect(webhookSection).toBeVisible({ timeout: 10000 });

    // There should be a button in the webhook section
    const copyBtn = webhookSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });
});

// ─── Connect Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – WhatsApp Tab – Connect Flow', () => {
  test('WA-UI-030: Filling all fields and clicking Connect triggers the PATCH API call', async ({ page }) => {
    let patchCalled = false;
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchCalled = true;
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ verify_token: 'generated-token' })),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/whatsapp/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, webhook_url: `https://example.com/api/whatsapp/webhook/${CHATBOT_ID}` }),
      });
    });

    await gotoWhatsAppTab(page);

    await page.locator('#whatsapp-phone-id').fill('123456789012345');
    await page.locator('#whatsapp-token').fill('EAAexampletoken123');
    await page.locator('#whatsapp-verify-token').fill('my-verify-token');

    await page.getByRole('button', { name: /Connect to WhatsApp/i }).click();

    // Wait for PATCH to have been made
    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
    expect(patchBody.whatsapp_config).toBeDefined();
    const wc = patchBody.whatsapp_config as Record<string, unknown>;
    expect(wc.phone_number_id).toBe('123456789012345');
    expect(wc.enabled).toBe(true);
    expect(wc.verify_token).toBe('my-verify-token');
  });

  test('WA-UI-031: After successful connect, shows connected state UI', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ verify_token: 'generated-token' })),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/whatsapp/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoWhatsAppTab(page);

    await page.locator('#whatsapp-phone-id').fill('123456789012345');
    await page.locator('#whatsapp-token').fill('EAAexampletoken123');
    await page.getByRole('button', { name: /Connect to WhatsApp/i }).click();

    // After connect, the green banner should appear
    await expect(page.getByText('Connected to WhatsApp')).toBeVisible({ timeout: 10000 });
    // Disconnect button should now be visible
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
  });

  test('WA-UI-032: After successful connect, input fields are cleared', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ verify_token: 'generated-token' })),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/whatsapp/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoWhatsAppTab(page);

    await page.locator('#whatsapp-phone-id').fill('123456789012345');
    await page.locator('#whatsapp-token').fill('EAAexampletoken123');
    await page.locator('#whatsapp-verify-token').fill('my-token');

    await page.getByRole('button', { name: /Connect to WhatsApp/i }).click();
    await expect(page.getByText('Connected to WhatsApp')).toBeVisible({ timeout: 10000 });

    // The connect form is no longer rendered; in disconnected state the inputs would be empty.
    // The Phone Number ID and Access Token inputs are not visible in connected state.
    await expect(page.locator('#whatsapp-phone-id')).not.toBeVisible();
    await expect(page.locator('#whatsapp-token')).not.toBeVisible();
    await expect(page.locator('#whatsapp-verify-token')).not.toBeVisible();
  });
});

// ─── Webhook URL correctness ──────────────────────────────────────────────────

test.describe('Deploy Page – WhatsApp Tab – Webhook URL correctness', () => {
  test('WA-UI-040: In connected state, webhook URL uses /{chatbotId} format, not ?chatbot_id={chatbotId}', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });

    await page.route(`**/api/whatsapp/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /WhatsApp/i }).click();
    await expect(page.getByText('Connected to WhatsApp')).toBeVisible({ timeout: 10000 });

    // Find the webhook URL code element
    const webhookCode = page.locator('code').filter({ hasText: `/api/whatsapp/webhook/${CHATBOT_ID}` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent() ?? '';

    // Must use path param format: /api/whatsapp/webhook/{chatbotId}
    expect(text).toContain(`/api/whatsapp/webhook/${CHATBOT_ID}`);

    // Must NOT use the old broken query-param format
    expect(text).not.toContain(`?chatbot_id=`);
    expect(text).not.toContain(`?chatbot_id=${CHATBOT_ID}`);
  });
});
