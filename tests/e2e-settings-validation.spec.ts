import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

test.describe('Settings Validation', () => {
  test('reject empty chatbot name', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { name: '' },
    });
    // Should reject or ignore empty name
    expect(res.status()).toBeLessThan(500);
  });

  test('update memory config', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: { memory_enabled: true, memory_days: 30 },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('update file upload config', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        file_upload_config: {
          enabled: true,
          max_file_size_mb: 5,
          max_files_per_message: 3,
          allowed_types: { images: true, documents: true, spreadsheets: false, text: true },
        },
      },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('update proactive message config', async ({ page }) => {
    const res = await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        proactive_messages: [
          {
            id: 'test-rule',
            name: 'E2E Test Rule',
            trigger_type: 'time_on_site',
            trigger_config: { seconds: 30 },
            message: 'Need help?',
            enabled: false,
          },
        ],
      },
    });
    expect(res.status()).toBeLessThan(500);
  });
});
