import { test, expect, type Page } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const UPLOAD_URL = `/api/widget/${CHATBOT_ID}/upload`;
const WIDGET_URL = `/widget/${CHATBOT_ID}`;

/**
 * Navigate to the widget and wait for the chat input area (with attach button) to be ready.
 */
async function openWidgetWithUploads(page: Page) {
  // Reset message count so a near-limit chatbot doesn't block unrelated widget tests
  await page.request.patch(`/api/chatbots/${CHATBOT_ID}`, {
    data: { messages_this_month: 0, monthly_message_limit: 1000 },
  }).catch(() => {});

  await page.goto(WIDGET_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.chat-widget-container')).toBeVisible({ timeout: 15000 });
  // Wait for the attach button to confirm uploads are enabled
  await expect(page.locator('.chat-widget-attach-btn')).toBeVisible({ timeout: 10000 });
}

// Minimal valid 1x1 PNG for image upload tests
const VALID_PNG = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE,
  0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54,
  0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
]);

test.describe('File Upload', () => {
  test.beforeAll(async ({ request }) => {
    // Enable file uploads via API — the settings UI toggle works the same way but is slow
    // and prone to timing issues in beforeAll. This matches the credit-reset pattern:
    // test setup that requires a known state with no UI alternative for reliable setup.
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        file_upload_config: {
          enabled: true,
          allowed_types: { images: true, documents: true, spreadsheets: false, archives: false },
          max_file_size_mb: 10,
          max_files_per_message: 3,
        },
      },
    });
  });

  test.afterAll(async ({ request }) => {
    // Restore file uploads to disabled so other tests aren't affected
    await request.patch(`/api/chatbots/${CHATBOT_ID}`, {
      data: {
        file_upload_config: {
          enabled: false,
          allowed_types: { images: true, documents: true, spreadsheets: false, archives: false },
          max_file_size_mb: 2,
          max_files_per_message: 3,
        },
      },
    });
  });

  test('reject upload without file', async ({ page }) => {
    // API-only: the UI always requires a file selection before upload is triggered,
    // so there is no way to submit an empty upload through the widget.
    const res = await page.request.post(UPLOAD_URL, {
      multipart: {
        session_id: 'e2e-upload-test',
      },
    });
    // Should return 400 (no file provided) — not 500
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('reject upload without session_id', async ({ page }) => {
    // API-only: the UI always includes session_id automatically in every upload request,
    // so this server-side validation cannot be triggered through the widget.
    const fileContent = Buffer.from('test file content');
    const res = await page.request.post(UPLOAD_URL, {
      multipart: {
        file: {
          name: 'test.txt',
          mimeType: 'text/plain',
          buffer: fileContent,
        },
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('upload with valid image file', async ({ page }) => {
    test.setTimeout(60_000);
    await openWidgetWithUploads(page);

    // Click the attach button and intercept the native file chooser.
    // Pass an explicit mimeType to ensure React's file.type is set correctly.
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('.chat-widget-attach-btn').click(),
    ]);
    await fileChooser.setFiles({ name: 'test.png', mimeType: 'image/png', buffer: VALID_PNG });

    // Playwright's fileChooser.setFiles() sets files via CDP but doesn't reliably
    // trigger React 18's onChange. Use DataTransfer to explicitly create the File
    // object and dispatch a change event that React's root listener will handle.
    await page.evaluate(({ buf }: { buf: number[] }) => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!input) return;
      const dt = new DataTransfer();
      dt.items.add(new File([new Uint8Array(buf)], 'test.png', { type: 'image/png' }));
      Object.defineProperty(input, 'files', { value: dt.files, configurable: true });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, { buf: Array.from(VALID_PNG) });

    // The file should appear in the pending attachments preview
    await expect(page.locator('.chat-widget-pending-attachments')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.chat-widget-pending-name', { hasText: 'test.png' })).toBeVisible({ timeout: 5000 });
  });

  test('reject disallowed file type', async ({ page }) => {
    // .exe files are not in any allowed type category — the client-side validation
    // in handleFileSelect rejects them before they reach the server.
    await openWidgetWithUploads(page);

    // Click the attach button and intercept the native file chooser.
    // Use explicit mimeType so the file.type is set correctly in the browser.
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('.chat-widget-attach-btn').click(),
    ]);
    await fileChooser.setFiles({ name: 'malware.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ fake executable') });

    // Use DataTransfer to explicitly set the file and trigger React's onChange.
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!input) return;
      const dt = new DataTransfer();
      dt.items.add(new File(['MZ fake executable'], 'malware.exe', { type: 'application/x-msdownload' }));
      Object.defineProperty(input, 'files', { value: dt.files, configurable: true });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Client-side validation should show an error message about rejected file
    const errorBanner = page.locator('text=/rejected/i');
    await expect(errorBanner).toBeVisible({ timeout: 5000 });

    // Pending attachments should NOT appear (file was rejected)
    await expect(page.locator('.chat-widget-pending-attachments')).not.toBeVisible({ timeout: 2000 });
  });
});
