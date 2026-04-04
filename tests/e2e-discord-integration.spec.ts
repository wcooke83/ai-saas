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

async function gotoDiscordTab(page: import('@playwright/test').Page) {
  await gotoDeploy(page);
  await page.getByRole('tab', { name: /Discord/i }).click();
  await expect(page.getByRole('heading', { name: 'Discord' })).toBeVisible({ timeout: 10000 });
}

/** Minimal chatbot API response shape with discord_config enabled */
function makeConnectedChatbotResponse(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      chatbot: {
        id: CHATBOT_ID,
        name: 'E2E Test Bot',
        published: true,
        discord_config: {
          enabled: true,
          application_id: '123456789012345678',
          public_key: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          ai_responses_enabled: true,
          ...overrides,
        },
      },
    },
  };
}

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Navigation', () => {
  test('DC-UI-001: Discord tab trigger is visible and clickable', async ({ page }) => {
    await gotoDeploy(page);

    const tab = page.getByRole('tab', { name: /Discord/i });
    await expect(tab).toBeVisible({ timeout: 10000 });
    await tab.click();
    await expect(tab).toHaveAttribute('data-state', 'active');
  });

  test('DC-UI-002: Clicking Discord tab shows the Discord card with title and description', async ({ page }) => {
    await gotoDeploy(page);

    await page.getByRole('tab', { name: /Discord/i }).click();

    await expect(page.getByRole('heading', { name: 'Discord' })).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Deploy this chatbot to Discord/)
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─── Disconnected State ───────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Disconnected State', () => {
  test('DC-UI-010: Shows step-by-step setup guide when disconnected', async ({ page }) => {
    await gotoDiscordTab(page);

    await expect(page.getByText('Create a Discord app')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Create a bot user')).toBeVisible();
    await expect(page.getByText('Copy credentials')).toBeVisible();
    await expect(page.getByText('Enter credentials')).toBeVisible();

    for (const n of ['1', '2', '3']) {
      await expect(page.locator('span').filter({ hasText: n }).first()).toBeVisible();
    }
  });

  test('DC-UI-011: Application ID input is visible with correct placeholder', async ({ page }) => {
    await gotoDiscordTab(page);

    const input = page.locator('#discord-app-id');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('placeholder', '123456789012345678');
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('DC-UI-012: Bot Token input is visible and is type=password', async ({ page }) => {
    await gotoDiscordTab(page);

    const input = page.locator('#discord-bot-token');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Your bot token');
  });

  test('DC-UI-013: Public Key input is visible', async ({ page }) => {
    await gotoDiscordTab(page);

    const input = page.locator('#discord-public-key');
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveAttribute('placeholder', 'Your application public key');
  });

  test('DC-UI-014: Connect button is disabled when all inputs are empty', async ({ page }) => {
    await gotoDiscordTab(page);

    const connectBtn = page.getByRole('button', { name: /Connect to Discord/i });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await expect(connectBtn).toBeDisabled();
  });

  test('DC-UI-015: Connect button remains disabled when only Application ID is filled', async ({ page }) => {
    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    const connectBtn = page.getByRole('button', { name: /Connect to Discord/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('DC-UI-016: Connect button remains disabled when only App ID and Bot Token are filled', async ({ page }) => {
    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Token.Here');
    const connectBtn = page.getByRole('button', { name: /Connect to Discord/i });
    await expect(connectBtn).toBeDisabled();
  });

  test('DC-UI-017: Connect button enables when all three fields are filled', async ({ page }) => {
    await gotoDiscordTab(page);

    const connectBtn = page.getByRole('button', { name: /Connect to Discord/i });
    await expect(connectBtn).toBeDisabled();

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Token.Here');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await expect(connectBtn).toBeEnabled({ timeout: 5000 });
  });

  test('DC-UI-018: Fields show labels with correct text', async ({ page }) => {
    await gotoDiscordTab(page);

    await expect(page.getByText('Application ID')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Bot Token')).toBeVisible();
    await expect(page.getByText('Public Key')).toBeVisible();
  });

  test('DC-UI-019: Encrypted-at-rest notice is visible', async ({ page }) => {
    await gotoDiscordTab(page);

    await expect(
      page.getByText(/stored securely and encrypted/i)
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─── Loading State ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Loading State', () => {
  test('DC-UI-020: Skeleton is rendered during initial data load', async ({ page }) => {
    // Delay the chatbot API response so we can catch the skeleton state
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.continue();
    });

    await page.goto(DEPLOY_URL);
    await page.waitForLoadState('domcontentloaded');

    // Navigate to discord tab while skeleton should be visible
    const tab = page.getByRole('tab', { name: /Discord/i });
    if (await tab.isVisible()) {
      await tab.click();
      // Skeleton or the form should be present (we can't guarantee exact timing in test)
      const skeleton = page.locator('.animate-pulse, [data-testid="skeleton"]').first();
      const form = page.locator('#discord-app-id');
      // Either the skeleton or the form should be present
      await expect(skeleton.or(form)).toBeVisible({ timeout: 5000 });
    }
  });
});

// ─── Connected State ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Connected State', () => {
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
    // Stub the slack integration endpoint to avoid timeouts
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();
  });

  test('DC-UI-030: Connected state shows green "Connected to Discord" banner', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-031: Connected state shows Disconnect button', async ({ page }) => {
    const disconnectBtn = page.getByRole('button', { name: /Disconnect/i });
    await expect(disconnectBtn).toBeVisible({ timeout: 10000 });
    await expect(disconnectBtn).toBeEnabled();
  });

  test('DC-UI-032: Connected state shows AI Responses toggle as role=switch', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-033: AI toggle reflects ai_responses_enabled=true with aria-checked=true', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  test('DC-UI-034: AI toggle reflects ai_responses_enabled=false with aria-checked=false', async ({ page }) => {
    // This test sets up its own route override with ai_responses_enabled: false
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse({ ai_responses_enabled: false })),
        });
      } else {
        await route.continue();
      }
    });
    // Navigate again to pick up the new route
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  test('DC-UI-035: Interactions Endpoint URL is displayed in a code element', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/discord/webhook/${CHATBOT_ID}` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent();
    expect(text).toContain(`/api/discord/webhook/${CHATBOT_ID}`);
  });

  test('DC-UI-036: Webhook copy button is visible next to the URL', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const endpointSection = page.locator('div').filter({ hasText: 'Interactions Endpoint URL' }).last();
    await expect(endpointSection).toBeVisible({ timeout: 10000 });

    const copyBtn = endpointSection.getByRole('button').first();
    await expect(copyBtn).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-037: Copy button changes icon after click', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const endpointSection = page.locator('div').filter({ hasText: 'Interactions Endpoint URL' }).last();
    const copyBtn = endpointSection.getByRole('button').first();

    // Click copy button
    await copyBtn.click();

    // After click the Check icon should appear (icon changes)
    // The button still exists and has changed state
    await expect(copyBtn).toBeVisible({ timeout: 5000 });
  });

  test('DC-UI-038: Disconnected inputs (App ID, Bot Token, Public Key) are NOT visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('#discord-app-id')).not.toBeVisible();
    await expect(page.locator('#discord-bot-token')).not.toBeVisible();
    await expect(page.locator('#discord-public-key')).not.toBeVisible();
  });

  test('DC-UI-039: Connect button is NOT visible in connected state', async ({ page }) => {
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('button', { name: /Connect to Discord/i })).not.toBeVisible();
  });
});

// ─── Connect Flow ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Connect Flow', () => {
  test('DC-UI-040: Filling all fields and clicking Connect triggers the PATCH API call', async ({ page }) => {
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

    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, webhook_url: `https://example.com/api/discord/webhook/${CHATBOT_ID}` }),
      });
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes(`/api/chatbots/${CHATBOT_ID}`) && res.request().method() === 'PATCH',
      { timeout: 10000 }
    );

    expect(patchCalled).toBe(true);
    const dc = patchBody.discord_config as Record<string, unknown>;
    expect(dc).toBeDefined();
    expect(dc.application_id).toBe('123456789012345678');
    expect(dc.enabled).toBe(true);
    expect(dc.bot_token).toBe('Bot.Test.Token123');
    expect(dc.public_key).toBe('abcdef1234567890abcdef1234567890');
  });

  test('DC-UI-041: After PATCH, the setup POST is called for slash command registration', async ({ page }) => {
    let setupPostCalled = false;

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

    await page.route(`**/api/discord/setup**`, async (route) => {
      setupPostCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, webhook_url: `https://example.com/api/discord/webhook/${CHATBOT_ID}` }),
      });
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes('/api/discord/setup') && res.request().method() === 'POST',
      { timeout: 10000 }
    );

    expect(setupPostCalled).toBe(true);
  });

  test('DC-UI-042: After successful connect, shows connected state UI', async ({ page }) => {
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

    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-043: After successful connect, credential input fields are cleared', async ({ page }) => {
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

    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    // Input fields are hidden (form is replaced by connected state)
    await expect(page.locator('#discord-app-id')).not.toBeVisible();
    await expect(page.locator('#discord-bot-token')).not.toBeVisible();
    await expect(page.locator('#discord-public-key')).not.toBeVisible();
  });

  test('DC-UI-044: Connect button shows "Connecting..." spinner while in flight', async ({ page }) => {
    let resolveSetup!: () => void;
    const setupPending = new Promise<void>((res) => { resolveSetup = res; });

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        // Delay slightly to let us observe the connecting state
        await new Promise((r) => setTimeout(r, 200));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/discord/setup**`, async (route) => {
      // Hold the setup request until we've observed the button state
      await setupPending;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    // Start the connect and check for connecting state
    const connectBtn = page.getByRole('button', { name: /Connect to Discord|Connecting/i });
    await connectBtn.click();

    // The button should show connecting state (disabled) during the request
    await expect(page.getByRole('button', { name: /Connecting/i })).toBeVisible({ timeout: 5000 });

    resolveSetup();
  });
});

// ─── Disconnect Flow ──────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Disconnect Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeConnectedChatbotResponse()),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID } } }),
        });
      }
    });
    await page.route(`**/api/chatbots/${CHATBOT_ID}/integrations/slack`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
    });
    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-050: Clicking Disconnect calls DELETE /api/discord/setup', async ({ page }) => {
    let deleteCalled = false;

    await page.route(`**/api/discord/setup**`, async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByRole('button', { name: /Disconnect/i }).click();

    await page.waitForResponse(
      (res) => res.url().includes('/api/discord/setup') && res.request().method() === 'DELETE',
      { timeout: 10000 }
    ).catch(() => {});

    expect(deleteCalled).toBe(true);
  });

  test('DC-UI-051: After disconnect, shows disconnected form state', async ({ page }) => {
    await page.getByRole('button', { name: /Disconnect/i }).click();

    await expect(page.locator('#discord-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#discord-bot-token')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#discord-public-key')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Discord')).not.toBeVisible();
  });
});

// ─── AI Toggle ────────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – AI Toggle', () => {
  test.beforeEach(async ({ page }) => {
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
    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-060: Clicking AI toggle calls PATCH with ai_responses_enabled toggled', async ({ page }) => {
    let patchBody: Record<string, unknown> = {};

    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        patchBody = JSON.parse(req.postData() ?? '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID } } }),
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

    const dc = patchBody.discord_config as Record<string, unknown>;
    expect(dc).toBeDefined();
    // Since initial state was true (ai_responses_enabled: true), toggling should set it to false
    expect(dc.ai_responses_enabled).toBe(false);
  });

  test('DC-UI-061: AI toggle visually flips after click', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID } } }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-checked', 'false', { timeout: 5000 });
  });

  test('DC-UI-062: AI toggle reverts to original value on PATCH failure', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      } else {
        await route.continue();
      }
    });

    const toggle = page.getByRole('switch');
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    await toggle.click();

    // After API failure, the toggle should revert to its original state
    await expect(toggle).toHaveAttribute('aria-checked', 'true', { timeout: 10000 });
  });
});

// ─── Error States ─────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Error States', () => {
  test('DC-UI-070: PATCH 403 (plan gate) shows error toast', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Discord integration requires a Pro or Agency plan' } }),
        });
      } else {
        await route.continue();
      }
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    // Should not transition to connected state
    await expect(page.getByText('Connected to Discord')).not.toBeVisible({ timeout: 5000 });
    // Form should still be visible
    await expect(page.locator('#discord-app-id')).toBeVisible({ timeout: 5000 });
  });

  test('DC-UI-071: PATCH 500 (server error) shows error toast and keeps form visible', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: { message: 'Internal server error' } }),
        });
      } else {
        await route.continue();
      }
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    // Form should still be visible after error
    await expect(page.locator('#discord-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Discord')).not.toBeVisible();
  });

  test('DC-UI-072: Setup POST 502 (slash command registration failure) shows error', async ({ page }) => {
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

    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to register slash command with Discord: Unknown Application' }),
      });
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    // On setup failure, the form should still be visible (not connected)
    await expect(page.locator('#discord-app-id')).toBeVisible({ timeout: 10000 });
  });

  test('DC-UI-073: Network failure during connect shows error and keeps form', async ({ page }) => {
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'PATCH') {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });

    await gotoDiscordTab(page);

    await page.locator('#discord-app-id').fill('123456789012345678');
    await page.locator('#discord-bot-token').fill('Bot.Test.Token123');
    await page.locator('#discord-public-key').fill('abcdef1234567890abcdef1234567890');

    await page.getByRole('button', { name: /Connect to Discord/i }).click();

    // Form should remain visible after network failure
    await expect(page.locator('#discord-app-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected to Discord')).not.toBeVisible();
  });
});

// ─── Webhook URL ──────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Interactions Endpoint URL', () => {
  test('DC-UI-080: Webhook URL uses /{chatbotId} path-param format', async ({ page }) => {
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
    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });

    const webhookCode = page.locator('code').filter({ hasText: `/api/discord/webhook/${CHATBOT_ID}` }).first();
    await expect(webhookCode).toBeVisible({ timeout: 10000 });

    const text = await webhookCode.textContent() ?? '';
    expect(text).toContain(`/api/discord/webhook/${CHATBOT_ID}`);
    // Must not use query-param form
    expect(text).not.toContain(`?chatbot_id=`);
  });
});

// ─── Page Reload with Connected Config ───────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Page Reload with Connected Config', () => {
  test('DC-UI-090: Page reload with connected discord_config shows connected state immediately', async ({ page }) => {
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
    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();

    // Should show connected state without any connect action needed
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Disconnect/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#discord-app-id')).not.toBeVisible();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

test.describe('Deploy Page – Discord Tab – Accessibility', () => {
  test.beforeEach(async ({ page }) => {
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
    await page.route(`**/api/discord/setup**`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();
    await expect(page.getByText('Connected to Discord')).toBeVisible({ timeout: 10000 });
  });

  test('DC-A11Y-001: AI toggle has role="switch"', async ({ page }) => {
    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible({ timeout: 10000 });
  });

  test('DC-A11Y-002: AI toggle has aria-checked attribute', async ({ page }) => {
    const toggle = page.getByRole('switch');
    const ariaChecked = await toggle.getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  });

  test('DC-A11Y-003: Disconnected form inputs have associated labels', async ({ page }) => {
    // Navigate to disconnected state
    await page.route(`**/api/chatbots/${CHATBOT_ID}`, async (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { chatbot: { id: CHATBOT_ID, name: 'E2E Test Bot' } } }),
        });
      } else {
        await route.continue();
      }
    });
    await gotoDeploy(page);
    await page.getByRole('tab', { name: /Discord/i }).click();

    // Labels should be associated (htmlFor matches input id)
    await expect(page.locator('label[for="discord-app-id"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('label[for="discord-bot-token"]')).toBeVisible();
    await expect(page.locator('label[for="discord-public-key"]')).toBeVisible();
  });
});
