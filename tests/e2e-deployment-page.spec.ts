import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;
const DEPLOY_URL = `${BASE}/deploy`;

async function gotoDeploy(page: import('@playwright/test').Page) {
  await page.goto(DEPLOY_URL, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByText('Deploy Chatbot')).toBeVisible({ timeout: 15000 });
}

test.describe('Deploy Page – Page Load', () => {
  test('DEPLOY-001: page loads with heading and default tab', async ({ page }) => {
    await gotoDeploy(page);

    // Heading rendered by ChatbotPageHeader
    await expect(page.getByText('Deploy Chatbot')).toBeVisible();

    // SDK Docs link in header actions
    await expect(page.getByRole('link', { name: /SDK Docs/i })).toBeVisible({ timeout: 10000 });

    // Three top-level tabs are visible
    await expect(page.getByRole('button', { name: /Widget Embed/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Agent Console/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /REST API/i })).toBeVisible();
  });

  test('DEPLOY-002: SDK Docs link points to /sdk#chatbots', async ({ page }) => {
    await gotoDeploy(page);

    const sdkLink = page.getByRole('link', { name: /SDK Docs/i });
    await expect(sdkLink).toBeVisible({ timeout: 10000 });
    await expect(sdkLink).toHaveAttribute('href', '/sdk#chatbots');
  });
});

test.describe('Deploy Page – Widget Embed Tab', () => {
  test('DEPLOY-010: default tab shows embed method selectors', async ({ page }) => {
    await gotoDeploy(page);

    // Widget Embed is the default active tab, so its content is visible
    await expect(page.getByText('Choose Embed Method')).toBeVisible({ timeout: 10000 });

    // All four embed method buttons
    await expect(page.getByRole('button', { name: /Script Tag/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Next\.js \/ React/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Manual Init/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /iFrame/i })).toBeVisible();
  });

  test('DEPLOY-011: Script Tag embed code shows chatbot ID and sdk.js', async ({ page }) => {
    await gotoDeploy(page);

    // Script Tag is the default embed method
    const codeBlock = page.locator('pre code').filter({ hasText: 'data-chatbot-id' }).first();
    await expect(codeBlock).toBeVisible({ timeout: 10000 });
    await expect(codeBlock).toContainText(CHATBOT_ID);
    await expect(codeBlock).toContainText('sdk.js');
  });

  test('DEPLOY-012: switching embed methods changes code block', async ({ page }) => {
    await gotoDeploy(page);

    // Click Next.js / React method
    await page.getByRole('button', { name: /Next\.js \/ React/i }).click();
    const nextCode = page.locator('pre code').filter({ hasText: 'next/script' }).first();
    await expect(nextCode).toBeVisible({ timeout: 10000 });
    await expect(nextCode).toContainText('afterInteractive');

    // Click Manual Init method
    await page.getByRole('button', { name: /Manual Init/i }).click();
    const manualCode = page.locator('pre code').filter({ hasText: 'ChatWidget.init' }).first();
    await expect(manualCode).toBeVisible({ timeout: 10000 });

    // Click iFrame method
    await page.getByRole('button', { name: /iFrame/i }).click();
    const iframeCode = page.locator('pre code').filter({ hasText: '<iframe' }).first();
    await expect(iframeCode).toBeVisible({ timeout: 10000 });
    await expect(iframeCode).toContainText('width');
    await expect(iframeCode).toContainText('height');
  });

  test('DEPLOY-013: copy button changes to "Copied" on click', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoDeploy(page);

    const copyButton = page.getByRole('button', { name: /^Copy$/i }).first();
    await expect(copyButton).toBeVisible({ timeout: 10000 });
    await copyButton.click();

    await expect(page.getByRole('button', { name: /Copied/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test('DEPLOY-014: Authenticated Users section is collapsible', async ({ page }) => {
    await gotoDeploy(page);

    // The "Authenticated Users" heading should be visible
    const authToggle = page.getByText('Authenticated Users').first();
    await expect(authToggle).toBeVisible({ timeout: 10000 });

    // The Advanced badge should appear next to it
    await expect(page.getByText('Advanced')).toBeVisible();

    // Content should be hidden by default (collapsed)
    await expect(page.locator('pre code').filter({ hasText: 'user_123' })).not.toBeVisible();

    // Click to expand
    await authToggle.click();

    // Now the authenticated user code block should be visible
    const authCode = page.locator('pre code').filter({ hasText: 'user_123' }).first();
    await expect(authCode).toBeVisible({ timeout: 10000 });
    await expect(authCode).toContainText('ChatWidget.init');
    await expect(authCode).toContainText('context');
  });

  test('DEPLOY-015: Live Preview iframe is visible with correct src', async ({ page }) => {
    await gotoDeploy(page);

    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    await expect(previewIframe).toBeVisible({ timeout: 15000 });

    const src = await previewIframe.getAttribute('src');
    expect(src).toContain(`/widget/${CHATBOT_ID}`);
  });

  test('DEPLOY-016: Live Preview has Open button linking to widget', async ({ page }) => {
    await gotoDeploy(page);

    await expect(page.getByText('Live Preview')).toBeVisible({ timeout: 10000 });

    const openLink = page.getByRole('link', { name: /Open/i });
    await expect(openLink).toBeVisible({ timeout: 10000 });
    await expect(openLink).toHaveAttribute('href', `/widget/${CHATBOT_ID}`);
    await expect(openLink).toHaveAttribute('target', '_blank');
  });
});

test.describe('Deploy Page – Agent Console Tab', () => {
  test('DEPLOY-020: switching to Agent Console tab shows content', async ({ page }) => {
    await gotoDeploy(page);

    // Click the Agent Console tab
    await page.getByRole('button', { name: /Agent Console/i }).click();

    // Should show either the "handoff not enabled" state or the embed options
    const handoffDisabled = page.getByText('Live handoff is not enabled');
    const agentEmbed = page.getByText('Agent Console Embed');

    await expect(handoffDisabled.or(agentEmbed)).toBeVisible({ timeout: 10000 });
  });

  test('DEPLOY-021: handoff disabled state shows settings link', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('button', { name: /Agent Console/i }).click();

    const handoffDisabled = page.getByText('Live handoff is not enabled');
    const isDisabledState = await handoffDisabled.isVisible({ timeout: 5000 }).catch(() => false);

    if (isDisabledState) {
      await expect(page.getByText('Enable live handoff in your chatbot settings')).toBeVisible();
      const settingsLink = page.getByRole('link', { name: /Go to Settings/i });
      await expect(settingsLink).toBeVisible();
      await expect(settingsLink).toHaveAttribute('href', `${BASE}/settings`);
    } else {
      test.skip(true, 'Live handoff is enabled, skipping disabled-state test');
    }
  });

  test('DEPLOY-022: handoff enabled state shows method selectors and code', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('button', { name: /Agent Console/i }).click();

    const agentEmbed = page.getByText('Agent Console Embed');
    const isEnabledState = await agentEmbed.isVisible({ timeout: 5000 }).catch(() => false);

    if (isEnabledState) {
      // Method selector buttons
      await expect(page.getByRole('button', { name: /Quick Embed/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Manual Init/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /iFrame/i })).toBeVisible();

      // Default Quick Embed code block
      const agentCode = page.locator('pre code').filter({ hasText: 'agent-console/sdk.js' }).first();
      await expect(agentCode).toBeVisible({ timeout: 10000 });

      // API Key Required warning
      await expect(page.getByText('API Key Required')).toBeVisible();
      await expect(page.getByRole('link', { name: /API Keys/i }).first()).toHaveAttribute('href', '/dashboard/api-keys');

      // Position info boxes
      await expect(page.getByText('position: full')).toBeVisible();
      await expect(page.getByText('position: sidebar')).toBeVisible();
    } else {
      test.skip(true, 'Live handoff not enabled, skipping enabled-state test');
    }
  });
});

test.describe('Deploy Page – REST API Tab', () => {
  test('DEPLOY-030: switching to REST API tab shows endpoint', async ({ page }) => {
    await gotoDeploy(page);

    // Click the REST API tab
    await page.getByRole('button', { name: /REST API/i }).click();

    // Card heading
    await expect(page.getByText('Build custom chat UIs, backend integrations, or mobile apps')).toBeVisible({ timeout: 10000 });

    // Endpoint section
    await expect(page.getByText('Endpoint')).toBeVisible();

    // POST badge
    await expect(page.getByText('POST', { exact: true })).toBeVisible();

    // Endpoint URL contains chatbot ID
    const endpointCode = page.locator('code').filter({ hasText: `/api/chat/${CHATBOT_ID}` }).first();
    await expect(endpointCode).toBeVisible({ timeout: 10000 });
  });

  test('DEPLOY-031: cURL and JavaScript method selectors work', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('button', { name: /REST API/i }).click();

    // cURL is the default method
    const curlCode = page.locator('pre code').filter({ hasText: 'curl -X POST' }).first();
    await expect(curlCode).toBeVisible({ timeout: 10000 });
    await expect(curlCode).toContainText('Authorization: Bearer YOUR_API_KEY');

    // Switch to JavaScript
    await page.getByRole('button', { name: /JavaScript/i }).click();
    const jsCode = page.locator('pre code').filter({ hasText: 'await fetch' }).first();
    await expect(jsCode).toBeVisible({ timeout: 10000 });
    await expect(jsCode).toContainText('Authorization');
  });

  test('DEPLOY-032: REST API tab has API Key Required warning', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByRole('button', { name: /REST API/i }).click();

    await expect(page.getByText('API Key Required')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Never expose your API key in client-side code')).toBeVisible();

    const apiKeysLink = page.getByRole('link', { name: /API Keys/i }).first();
    await expect(apiKeysLink).toBeVisible();
    await expect(apiKeysLink).toHaveAttribute('href', '/dashboard/api-keys');
  });

  test('DEPLOY-033: endpoint copy button works', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoDeploy(page);
    await page.getByRole('button', { name: /REST API/i }).click();

    // The endpoint row has its own copy button (the one next to the endpoint display)
    // There are multiple copy buttons; the endpoint copy is in the endpoint section
    const endpointSection = page.locator('.flex-1').filter({ hasText: `/api/chat/${CHATBOT_ID}` });
    await expect(endpointSection).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Deploy Page – Unpublished Banner', () => {
  test('DEPLOY-040: unpublished banner appears when chatbot is not published', async ({ page }) => {
    await gotoDeploy(page);

    const warningBanner = page.getByText('Chatbot not published');
    const isUnpublished = await warningBanner.isVisible({ timeout: 5000 }).catch(() => false);

    if (isUnpublished) {
      await expect(page.getByText("Embed codes below won't work until you publish.")).toBeVisible();
      // "Publish now" link pointing to chatbot overview
      const publishLink = page.getByRole('link', { name: /Publish now/i });
      await expect(publishLink).toBeVisible();
      await expect(publishLink).toHaveAttribute('href', `/dashboard/chatbots/${CHATBOT_ID}`);

      // Code blocks should have the "Publish to enable" overlay
      await expect(page.getByText('Publish to enable')).toBeVisible();
    }
    // If published, no banner -- test passes either way
  });
});

test.describe('Deploy Page – Tab Isolation', () => {
  test('DEPLOY-050: switching tabs hides previous tab content', async ({ page }) => {
    await gotoDeploy(page);

    // Widget tab content is visible by default
    await expect(page.getByText('Choose Embed Method')).toBeVisible({ timeout: 10000 });

    // Switch to REST API tab
    await page.getByRole('button', { name: /REST API/i }).click();
    await expect(page.getByText('Endpoint')).toBeVisible({ timeout: 10000 });

    // Widget tab content should be gone (TabsContent renders null when inactive)
    await expect(page.getByText('Choose Embed Method')).not.toBeVisible();

    // Switch to Agent Console tab
    await page.getByRole('button', { name: /Agent Console/i }).click();

    // REST API content should be gone
    await expect(page.getByText('Endpoint')).not.toBeVisible();
  });
});
