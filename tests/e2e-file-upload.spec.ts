import { test, expect } from '@playwright/test';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const UPLOAD_URL = `/api/widget/${CHATBOT_ID}/upload`;

test.describe('File Upload', () => {
  test('reject upload without file', async ({ page }) => {
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
    // Create a small text file as a buffer
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
    // Create a minimal 1x1 PNG
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // 8-bit RGB
      0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
      0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82, // IEND
    ]);

    const res = await page.request.post(UPLOAD_URL, {
      multipart: {
        file: {
          name: 'test.png',
          mimeType: 'image/png',
          buffer: pngHeader,
        },
        session_id: `e2e-upload-${Date.now()}`,
      },
    });

    // May succeed (200) or fail if uploads disabled for this chatbot (403)
    expect(res.status()).toBeLessThan(500);
    if (res.ok()) {
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data?.url).toBeTruthy();
      expect(body.data?.file_name).toBe('test.png');
    }
  });

  test('reject disallowed file type', async ({ page }) => {
    const exeContent = Buffer.from('MZ fake executable');
    const res = await page.request.post(UPLOAD_URL, {
      multipart: {
        file: {
          name: 'malware.exe',
          mimeType: 'application/x-msdownload',
          buffer: exeContent,
        },
        session_id: `e2e-upload-bad-${Date.now()}`,
      },
    });
    // Should be 400 (bad file type) or 403 (uploads disabled)
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
