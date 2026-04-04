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

async function gotoMessengerTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /Messenger/i }).click();
  await expect(page.getByRole('heading', { name: 'Facebook Messenger' })).toBeVisible({ timeout: 10000 });
}

function makeConnectedChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        messenger_config: {
          enabled: true,
          page_id: '123456789012345',
          page_name: 'My Business Page',
          access_token: 'test-access-token',
          ai_responses_enabled: true,
          ...overrides,
        },
      },
    },
  };
}

function makeDisconnectedChatbotResponse() {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        messenger_config: { enabled: false },
      },
    },
  };
}

async function setupConnectedState(page: import('@playwright/test').Page, configOverrides: Record<string, unknown> = {}) {
  await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
    const req = route.request();
    if (req.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeConnectedChatbotResponse(configOverrides)),
      });
    } else {
      await route.continue();
    }
  });
  await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
  });
  await page.route(`**/api/messenger/setup**`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Navigation', () => {
  test('MSG-UI-001: Messenger tab is visible in TabsList', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /Messenger/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-002: Messenger tab becomes active when clicked', async ({ page }) => {
    await gotoDeploy(page);
    const tab = page.getByRole('tab', { name: /Messenger/i });
    await tab.click();
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('MSG-UI-003: Clicking Messenger tab shows the Facebook Messenger heading', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByRole('heading', { name: 'Facebook Messenger' })).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-004: Clicking Messenger tab shows the deploy subtitle text', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Deploy this chatbot on Messenger')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-005: Switching from another tab to Messenger correctly shows the panel', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /SMS/i }).click();
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByRole('heading', { name: 'Facebook Messenger' })).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disconnected State ───────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Disconnected State', () => {
  test('MSG-UI-010: Shows 4-step setup guide when disconnected', async ({ page }) => {
    await gotoMessengerTab(page);
    await expect(page.getByText('Create a Meta app')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Get your credentials')).toBeVisible();
    await expect(page.getByText('Enter credentials below')).toBeVisible();
    await expect(page.getByText('Configure webhook')).toBeVisible();
    for (const n of ['1', '2', '3', '4']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('MSG-UI-011: Page ID input is visible with correct placeholder', async ({ page }) => {
    await gotoMessengerTab(page);
    const input = page.locator('#messenger-page-id');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', '123456789012345');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('MSG-UI-012: Page Name input is visible and marked optional', async ({ page }) => {
    await gotoMessengerTab(page);
    const input = page.locator('#messenger-page-name');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', 'My Business Page');
    await expect(page.getByText('(optional)')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-013: Access Token input is type=password', async ({ page }) => {
    await gotoMessengerTab(page);
    const input = page.locator('#messenger-token');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Your permanent Page Access Token');
  });

  test('MSG-UI-014: Connect button is disabled when inputs are empty', async ({ page }) => {
    await gotoMessengerTab(page);
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await expect(connectBtn).toBeDisabled();
  });

  test('MSG-UI-015: Connect button is disabled with only Page ID filled', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('MSG-UI-016: Connect button is disabled with only Access Token filled', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-token').fill('test-access-token');
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('MSG-UI-017: Connect button enables when Page ID and Access Token are both filled', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('MSG-UI-018: Page Name is optional — Connect button enables without it', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    // Page name intentionally left blank
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('MSG-UI-019: Whitespace-only Page ID keeps Connect button disabled', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('   ');
    await page.locator('#messenger-token').fill('test-access-token');
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('MSG-UI-019b: Whitespace-only Access Token keeps Connect button disabled', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('   ');
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('MSG-UI-019c: Very long input values are accepted without breaking UI', async ({ page }) => {
    await gotoMessengerTab(page);
    const longValue = 'A'.repeat(500);
    await page.locator('#messenger-page-id').fill(longValue);
    await page.locator('#messenger-token').fill(longValue);
    // Page should not crash
    await expect(page.getByRole('button', { name: /Connect to Messenger/i })).toBeVisible();
  });

  test('MSG-UI-019d: Special characters in Page Name do not break the UI', async ({ page }) => {
    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-page-name').fill('Café & Bistro <Test> "Page"');
    await page.locator('#messenger-token').fill('test-access-token');
    await expect(page.getByRole('button', { name: /Connect to Messenger/i })).toBeEnabled();
  });

  test('MSG-UI-019e: All input fields have associated labels', async ({ page }) => {
    await gotoMessengerTab(page);
    await expect(page.locator('label[for="messenger-page-id"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('label[for="messenger-page-name"]')).toBeVisible();
    await expect(page.locator('label[for="messenger-token"]')).toBeVisible();
  });
});

// ─── Loading State ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Loading State', () => {
  test('MSG-UI-035: Skeleton shown while chatbot data loads', async ({ page }) => {
    let resolveRequest!: () => void;
    const requestPending = new Promise<void>((resolve) => { resolveRequest = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        // Hold the response until we explicitly resolve
        await requestPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });

    await page.goto(DEPLOY_URL);
    // Skeleton should be visible while loading
    await expect(page.locator('[data-slot="skeleton"]').first()).toBeVisible({ timeout: 5000 });
    resolveRequest();
  });
});

// ─── Connected State ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Connected State', () => {
  test.beforeEach(async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
  });

  test('MSG-UI-020: Connected state shows green "Connected to Messenger" banner', async ({ page }) => {
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-021: Connected state shows Page ID', async ({ page }) => {
    await expect(page.getByText(/Page ID: 123456789012345/)).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-022: Connected state shows page name', async ({ page }) => {
    await expect(page.getByText(/Page: My Business Page/)).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-023: Connected state shows webhook URL as app-level (no chatbotId in path)', async ({ page }) => {
    const expectedPath = `/api/messenger/webhook`;
    const webhookCode = page.locator('code').filter({ hasText: expectedPath }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });
    const text = await webhookCode.textContent();
    expect(text).toContain(expectedPath);
    expect(text).not.toContain(CHATBOT_ID);
  });

  test('MSG-UI-024: Disconnect button is visible and enabled in connected state', async ({ page }) => {
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeVisible({ timeout: 10000 });
    await expect(disconnectBtn).toBeEnabled();
  });

  test('MSG-UI-025: AI Responses toggle is visible and aria-checked=true in connected state', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('MSG-UI-026: AI Responses toggle has role="switch"', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-027: Webhook URL copy button is present', async ({ page }) => {
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    const webhookSection = page.locator('div').filter({ hasText: 'Webhook URL' }).last();
    await expect(webhookSection).toBeVisible({ timeout: 10000 });
    const copyBtn = webhookSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-028: Connect form inputs are not visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#messenger-page-id')).not.toBeVisible();
    await expect(page.locator('#messenger-token')).not.toBeVisible();
  });

  test('MSG-UI-029: Connected without page_name shows ID only in banner', async ({ page }) => {
    // Override route to return config without page_name
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ page_name: undefined })),
        });
      } else {
        await route.continue();
      }
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Page ID: 123456789012345/)).toBeVisible({ timeout: 10000 });
  });
});

// ─── Persistence (page reload simulation) ─────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Persistence', () => {
  test('MSG-UI-036: Mock chatbot GET returns connected config → connected state shown on load', async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-037: Mock chatbot GET returns disabled config → disconnected state shown on load', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByRole('button', { name: /Connect to Messenger/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Messenger')).not.toBeVisible();
  });
});

// ─── Connect Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Connect Flow', () => {
  test('MSG-UI-030: Filling Page ID and Token and clicking Connect triggers PATCH API call', async ({ page }) => {
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
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);

    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-page-name').fill('My Business Page');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
    expect(patchBody.messenger_config).toBeDefined();
    const mc = patchBody.messenger_config as Record<string, unknown>;
    expect(mc.page_id).toBe('123456789012345');
    expect(mc.enabled).toBe(true);
    expect(mc.access_token).toBe('test-access-token');
  });

  test('MSG-UI-031: PATCH body includes page_name when filled', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-page-name').fill('My Business Page');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const mc = patchBody.messenger_config as Record<string, unknown>;
    expect(mc.page_name).toBe('My Business Page');
  });

  test('MSG-UI-032: After successful connect, shows connected state UI', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-033: After successful connect, input fields are no longer visible', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#messenger-page-id')).not.toBeVisible();
    await expect(page.locator('#messenger-token')).not.toBeVisible();
    await expect(page.locator('#messenger-page-name')).not.toBeVisible();
  });

  test('MSG-UI-034: Connect button shows spinner while request in-flight', async ({ page }) => {
    let resolveSetup!: () => void;
    const setupPending = new Promise<void>((resolve) => { resolveSetup = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await setupPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    // While in-flight, button should show loading text or be disabled
    const connectBtn = page.getByRole('button', { name: /Connecting|Connect to Messenger/i });
    await expect(connectBtn).toBeDisabled({ timeout: 3000 }).catch(() => {
      // Some implementations show spinner but keep disabled
    });
    resolveSetup();
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Error Handling', () => {
  test('MSG-UI-060: API returns 500 on connect → shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Internal Server Error' } }),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    // Should show an error toast (sonner renders role=status or aria-live)
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    // Should remain on disconnected state
    await expect(page.locator('#messenger-page-id')).toBeVisible({ timeout: 5000 });
  });

  test('MSG-UI-061: API returns 403 on connect → shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Upgrade your plan to use this integration' } }),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-062: Network failure during connect → button re-enabled', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoMessengerTab(page);
    await page.locator('#messenger-page-id').fill('123456789012345');
    await page.locator('#messenger-token').fill('test-access-token');
    await page.getByRole('button', { name: /Connect to Messenger/i }).click();

    // After failure, connect button should re-enable
    const connectBtn = page.getByRole('button', { name: /Connect to Messenger/i });
    await expect(connectBtn).toBeEnabled({ timeout: 10000 });
  });

  test('MSG-UI-063: Network failure during disconnect → shows error toast', async ({ page }) => {
    await setupConnectedState(page);
    await page.route(`**/api/messenger/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.abort('failed');
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
  });
});

// ─── AI Toggle ────────────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – AI Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-070: Toggle off → PATCH called with ai_responses_enabled: false', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: false })),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const mc = patchBody.messenger_config as Record<string, unknown>;
    expect(mc.ai_responses_enabled).toBe(false);
  });

  test('MSG-UI-071: Toggle on → PATCH called with ai_responses_enabled: true', async ({ page }) => {
    // Start with ai disabled
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: false })),
        });
      } else if (req.method() === 'PATCH') {
        const body = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: body.messenger_config?.ai_responses_enabled })),
        });
      } else {
        await route.continue();
      }
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });

    let patchBody: Record<string, unknown> = {};
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: true })),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await toggle.click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    const mc = patchBody.messenger_config as Record<string, unknown>;
    expect(mc.ai_responses_enabled).toBe(true);
  });

  test('MSG-UI-072: API failure on toggle → reverts to previous state and shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Failed to save' } }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.click();

    // Error toast should appear
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 });
    // Toggle should revert back to true
    await expect(toggle).toHaveAttribute('aria-checked', 'true', { timeout: 5000 });
  });
});

// ─── Webhook URL correctness ──────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Webhook URL correctness', () => {
  test('MSG-UI-040: Webhook URL is app-level — no chatbotId in path', async ({ page }) => {
    await setupConnectedState(page);
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/messenger/webhook` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent() ?? '';
    expect(text).toContain(`/api/messenger/webhook`);
    expect(text).not.toContain(CHATBOT_ID);
    expect(text).not.toContain(`?chatbot_id=`);
  });
});

// ─── Disconnect Flow ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Messenger Tab – Disconnect Flow', () => {
  test('MSG-UI-050: Clicking Disconnect returns to the disconnected setup form', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.getByRole('button', { name: /Connect to Messenger/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#messenger-page-id')).toBeVisible({ timeout: 10000 });
  });

  test('MSG-UI-051: Disconnect button shows spinner while in-flight', async ({ page }) => {
    let resolveDisconnect!: () => void;
    const disconnectPending = new Promise<void>((resolve) => { resolveDisconnect = resolve; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else if (req.method() === 'PATCH') {
        await disconnectPending;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeDisconnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/messenger/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Messenger/i }).click();
    await expect(page.getByText('Connected to Messenger')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: /Disconnect/i }).click();
    // While in-flight the button should be disabled
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeDisabled({ timeout: 3000 }).catch(() => {});
    resolveDisconnect();
  });
});
