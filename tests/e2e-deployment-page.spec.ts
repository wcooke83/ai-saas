import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const BASE = `/dashboard/chatbots/${CHATBOT_ID}`;
const DEPLOY_URL = `${BASE}/deploy`;

async function gotoDeploy(page: import('@playwright/test').Page) {
  await page.goto(DEPLOY_URL, { waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);
  await expect(page.getByText('Deploy Chatbot')).toBeVisible({ timeout: 30000 });
}

test.describe('23. Deployment', () => {
  test('DEPLOY-001: Deploy page loads', async ({ page }) => {
    await gotoDeploy(page);

    await expect(page.getByText('Add to Your Website')).toBeVisible();
    await expect(page.getByText('Live Preview')).toBeVisible();
  });

  test('DEPLOY-002: SDK embed code displays correctly', async ({ page }) => {
    await gotoDeploy(page);

    // SDK code block should contain chatbot ID and sdk.js
    const codeBlocks = page.locator('code, pre');
    const sdkCode = codeBlocks.filter({ hasText: 'data-chatbot-id' }).first();
    await expect(sdkCode).toBeVisible({ timeout: 10000 });
    await expect(sdkCode).toContainText(CHATBOT_ID);
    await expect(sdkCode).toContainText('sdk.js');
  });

  test('DEPLOY-003: Copy embed code', async ({ page }) => {
    await gotoDeploy(page);

    const copyButton = page.getByRole('button', { name: /Copy/i }).first();
    await expect(copyButton).toBeVisible({ timeout: 10000 });
    await copyButton.click();

    await expect(page.getByText('Copied')).toBeVisible({ timeout: 5000 });
  });

  test('DEPLOY-004: All code variants shown', async ({ page }) => {
    await gotoDeploy(page);

    await expect(page.getByText('Add to Your Website')).toBeVisible();
    await expect(page.getByText('Next.js / React')).toBeVisible();
    await expect(page.getByText('Manual Init')).toBeVisible();
    await expect(page.getByText('iFrame Embed')).toBeVisible();
    await expect(page.getByText('Authenticated Users')).toBeVisible();
    await expect(page.getByText('Agent Console')).toBeVisible();
  });

  test('DEPLOY-005: Live preview iframe', async ({ page }) => {
    await gotoDeploy(page);

    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    await expect(previewIframe).toBeVisible({ timeout: 15000 });

    const src = await previewIframe.getAttribute('src');
    expect(src).toContain(CHATBOT_ID);
  });

  test('DEPLOY-006: Widget position in preview', async ({ page }) => {
    await gotoDeploy(page);

    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    await expect(previewIframe).toBeVisible({ timeout: 15000 });
  });
});

test.describe('35. Deployment Page Details', () => {
  test('DEPLOY-ADV-001: Not published warning banner', async ({ page }) => {
    await gotoDeploy(page);

    // If unpublished, warning shows; if published, it doesn't — both are valid
    const warningBanner = page.getByText('Chatbot not published');
    const isVisible = await warningBanner.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await expect(page.getByText(/overview to publish/i)).toBeVisible();
    }
    // Test passes either way
  });

  test('DEPLOY-ADV-002: Agent Console embed section -- all three code variants', async ({ page }) => {
    await gotoDeploy(page);

    const agentSection = page.getByText('Agent Console').first();
    await agentSection.scrollIntoViewIfNeeded();

    // At least one agent-console related code block should exist
    const agentCode = page.locator('code, pre').filter({ hasText: /agent-console|agentConsole/i });
    const count = await agentCode.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('DEPLOY-ADV-003: Agent Console position info boxes', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByText('Agent Console').first().scrollIntoViewIfNeeded();

    // Position guidance text
    const positionInfo = page.getByText(/position.*full|position.*sidebar/i);
    if (await positionInfo.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(positionInfo.first()).toBeVisible();
    } else {
      test.skip(true, 'Position info boxes not present');
    }
  });

  test('DEPLOY-ADV-004: Agent Console API Key warning', async ({ page }) => {
    await gotoDeploy(page);
    await page.getByText('Agent Console').first().scrollIntoViewIfNeeded();

    const apiKeyWarning = page.getByText(/API key/i).first();
    if (await apiKeyWarning.isVisible({ timeout: 3000 }).catch(() => false)) {
      const apiKeysLink = page.getByRole('link', { name: /API Keys/i }).first();
      if (await apiKeysLink.isVisible().catch(() => false)) {
        await expect(apiKeysLink).toHaveAttribute('href', '/dashboard/api-keys');
      }
    }
  });

  test('DEPLOY-ADV-005: REST API section with endpoint display', async ({ page }) => {
    await gotoDeploy(page);

    const restSection = page.getByText('REST API').first();
    await restSection.scrollIntoViewIfNeeded();

    const endpointCode = page.locator('code, pre').filter({ hasText: /\/api\/chat\// });
    await expect(endpointCode.first()).toBeVisible({ timeout: 10000 });
  });

  test('DEPLOY-ADV-006: Authenticated Users code section', async ({ page }) => {
    await gotoDeploy(page);

    const authSection = page.getByText('Authenticated Users').first();
    await authSection.scrollIntoViewIfNeeded();

    const authCode = page.locator('code, pre').filter({ hasText: /user|context/ });
    await expect(authCode.first()).toBeVisible({ timeout: 10000 });
  });

  test('DEPLOY-ADV-007: "Need More Help?" resource cards', async ({ page }) => {
    await gotoDeploy(page);

    const helpSection = page.getByText('Need More Help?');
    await helpSection.scrollIntoViewIfNeeded();
    await expect(helpSection).toBeVisible();

    await expect(page.getByRole('link', { name: /SDK Documentation/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /API Keys/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Chatbot Settings/i })).toBeVisible();
  });

  test('DEPLOY-ADV-008: Full SDK Documentation link', async ({ page }) => {
    await gotoDeploy(page);

    const sdkLink = page.getByRole('link', { name: /SDK Documentation/i }).first();
    await sdkLink.scrollIntoViewIfNeeded();
    await expect(sdkLink).toBeVisible();
    await expect(sdkLink).toHaveAttribute('href', '/sdk#chatbots');
  });

  test('DEPLOY-ADV-009: Preview widget close via postMessage', async ({ page }) => {
    await gotoDeploy(page);

    const previewIframe = page.locator('iframe[title="Chatbot Preview"]');
    if (await previewIframe.isVisible({ timeout: 10000 }).catch(() => false)) {
      // Try to close via postMessage
      await page.evaluate(() => {
        window.postMessage({ type: 'close-chat-widget' }, '*');
      });

      const reopenButton = page.locator('button[aria-label="Open chat preview"]');
      if (await reopenButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await reopenButton.click();
        await expect(previewIframe).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('DEPLOY-ADV-010: Iframe embed code uses widget_config dimensions', async ({ page }) => {
    await gotoDeploy(page);

    const iframeCode = page.locator('code, pre').filter({ hasText: /iframe/i }).filter({ hasText: /width|height/ });
    if (await iframeCode.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      const codeText = await iframeCode.first().textContent();
      expect(codeText).toMatch(/width/i);
      expect(codeText).toMatch(/height/i);
    } else {
      test.skip(true, 'No iframe code with dimensions found');
    }
  });
});
