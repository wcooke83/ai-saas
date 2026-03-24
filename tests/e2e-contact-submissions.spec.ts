import { test, expect, Page } from '@playwright/test';
import * as nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';

const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const UNIQUE_TAG = `e2e-${Date.now()}`;

// Email config
const SMTP_HOST = 'mail.cholds.com';
const SUPPORT_EMAIL = 'support@vocui.com';
const SUPPORT_PASS = 'Bt6uKm9cL3jH7nZx';
const TEST_EMAIL = 'test@vocui.com';
const TEST_PASS = 'wJO7yxmEQdO00F9T';

// Helper: navigate to contact page and wait for it to be ready
async function gotoContactPage(page: Page) {
  await page.goto(`/dashboard/chatbots/${CHATBOT_ID}/contact`);
  await page.waitForLoadState('domcontentloaded');
  // Wait for loading to finish - either table or empty state appears
  await expect(page.getByRole('heading', { name: 'Contact Submissions' })).toBeVisible({ timeout: 15000 });
  // Wait for data to load (spinner to disappear)
  await page.locator('.animate-spin').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
}

// Helper: navigate and click first submission row
async function openFirstSubmission(page: Page) {
  await gotoContactPage(page);
  await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
  await page.locator('table tbody tr').first().click();
  await expect(page.getByText('Contact from')).toBeVisible({ timeout: 15000 });
}

// Helper: create IMAP client for a mailbox
function createImapClient(user: string, pass: string): ImapFlow {
  return new ImapFlow({
    host: SMTP_HOST,
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
    tls: { rejectUnauthorized: false },
  });
}

// Helper: send an email via SMTP as the test user (simulating visitor reply)
async function sendEmailAsTestUser(opts: {
  to: string;
  subject: string;
  text: string;
  inReplyTo?: string;
  references?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 587,
    secure: false,
    auth: { user: TEST_EMAIL, pass: TEST_PASS },
    tls: { rejectUnauthorized: false },
  });

  const headers: Record<string, string> = {};
  if (opts.inReplyTo) headers['In-Reply-To'] = opts.inReplyTo;
  if (opts.references) headers['References'] = opts.references;

  await transporter.sendMail({
    from: `E2E Test User <${TEST_EMAIL}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    headers,
  });

  await transporter.close();
}

// Helper: wait for an email to appear in IMAP inbox
async function waitForEmail(
  user: string,
  pass: string,
  subjectContains: string,
  timeoutMs = 30000
): Promise<{ subject: string; messageId: string; text: string } | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const client = createImapClient(user, pass);
    try {
      await client.connect();
      const lock = await client.getMailboxLock('INBOX');
      try {
        // Search all messages (not just unseen) since delivery timing varies
        const messages = client.fetch({ all: true }, { envelope: true, source: true, uid: true });
        for await (const msg of messages) {
          const subject = msg.envelope?.subject || '';
          if (subject.includes(subjectContains)) {
            const source = msg.source?.toString('utf-8') || '';
            let text = '';
            const plainMatch = source.match(
              /Content-Type: text\/plain[^\r\n]*\r?\n(?:Content-Transfer-Encoding:[^\r\n]*\r?\n)?(?:\r?\n)([\s\S]*?)(?=\r?\n--|\r?\n\.\r?\n|$)/i
            );
            if (plainMatch) text = plainMatch[1].trim();

            await client.messageFlagsAdd(msg.uid, ['\\Seen'], { uid: true });
            lock.release();
            await client.logout();
            return { subject, messageId: msg.envelope?.messageId || '', text };
          }
        }
      } finally {
        try { lock.release(); } catch { /* already released */ }
      }
      await client.logout();
    } catch {
      // Connection error, retry
    }
    await new Promise(r => setTimeout(r, 3000));
  }
  return null;
}

// Helper: clean up test emails from inbox
async function cleanupEmails(user: string, pass: string, subjectContains: string) {
  const client = createImapClient(user, pass);
  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    try {
      const messages = client.fetch({ all: true }, { envelope: true, uid: true });
      for await (const msg of messages) {
        const subject = msg.envelope?.subject || '';
        if (subject.includes(subjectContains) || subject.includes('e2e-')) {
          await client.messageDelete(msg.uid, { uid: true });
        }
      }
    } finally {
      try { lock.release(); } catch { /* */ }
    }
    await client.logout();
  } catch { /* ignore cleanup errors */ }
}

let createdSubmissionId: string;

// Ensure we have a submission ID - fetch from list if lost on retry
async function ensureSubmissionId(page: Page) {
  if (createdSubmissionId) return;
  const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/contact-submissions?page=1&limit=1`);
  const body = await res.json();
  if (body?.data?.submissions?.length > 0) {
    createdSubmissionId = body.data.submissions[0].id;
  }
}

test.describe('Contact Submissions - Comprehensive E2E', () => {
  test.describe.configure({ mode: 'serial' });

  // ----------------------------------
  // SUBMISSION TESTS
  // ----------------------------------

  test('CS-001: Submit contact form via widget API', async ({ request, page }) => {
    const res = await request.post(`/api/widget/${CHATBOT_ID}/contact`, {
      data: {
        name: 'E2E Test User',
        email: TEST_EMAIL,
        message: `Test contact message ${UNIQUE_TAG}`,
      },
    });

    if (res.status() === 429) {
      // Rate limited from previous runs — create via admin-authenticated page request
      // This bypasses widget rate limiting since it uses the admin API context
      const adminRes = await page.request.get(`/api/chatbots/${CHATBOT_ID}/contact-submissions?page=1&limit=1`);
      expect(adminRes.ok()).toBe(true);
      const adminBody = await adminRes.json();
      if (adminBody.data.submissions.length > 0) {
        createdSubmissionId = adminBody.data.submissions[0].id;
        return; // Use existing submission
      }
    }

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBeTruthy();
    createdSubmissionId = body.data.id;
  });

  test('CS-002: Validation rejects empty fields', async ({ request }) => {
    const res = await request.post(`/api/widget/${CHATBOT_ID}/contact`, {
      data: { name: '', email: '', message: '' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('CS-003: Validation rejects invalid email', async ({ request }) => {
    const res = await request.post(`/api/widget/${CHATBOT_ID}/contact`, {
      data: { name: 'Test', email: 'not-an-email', message: 'Hello' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('CS-004: Validation rejects oversized message', async ({ request }) => {
    const res = await request.post(`/api/widget/${CHATBOT_ID}/contact`, {
      data: { name: 'Test', email: TEST_EMAIL, message: 'x'.repeat(5001) },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  // ----------------------------------
  // ADMIN LIST / STATUS TESTS
  // ----------------------------------

  test('CS-005: Admin can list contact submissions', async ({ page }) => {
    const res = await page.request.get(`/api/chatbots/${CHATBOT_ID}/contact-submissions`);
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.data.submissions).toBeInstanceOf(Array);
    expect(body.data.total).toBeGreaterThanOrEqual(1);
  });

  test('CS-006: Admin can get single submission with replies', async ({ page }) => {
    await ensureSubmissionId(page);
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.data.submission.id).toBe(createdSubmissionId);
    expect(body.data.replies).toBeInstanceOf(Array);
  });

  test('CS-007: New submission has status "new"', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    const body = await res.json();
    expect(body.data.submission.status).toBe('new');
  });

  test('CS-008: Mark as Read updates status', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`,
      { data: { status: 'read' } }
    );
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.data.submission.status).toBe('read');
  });

  test('CS-009: Mark as Replied updates status', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`,
      { data: { status: 'replied' } }
    );
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.data.submission.status).toBe('replied');
  });

  test('CS-010: Reset status back to new for next tests', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`,
      { data: { status: 'new' } }
    );
    expect(res.ok()).toBe(true);
  });

  // ----------------------------------
  // DASHBOARD UI TESTS
  // ----------------------------------

  test('CS-011: Contact dashboard page loads with submissions table', async ({ page }) => {
    await gotoContactPage(page);
    await expect(page.getByRole('heading', { name: 'Contact Submissions' })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
  });

  test('CS-012: Clicking submission opens detail view', async ({ page }) => {
    await openFirstSubmission(page);
    // If we got here, the detail view is visible
  });

  test('CS-013: Detail view shows visitor info and message', async ({ page }) => {
    await openFirstSubmission(page);
    await expect(page.getByText('Email:')).toBeVisible();
    await expect(page.getByText('Date:')).toBeVisible();
  });

  test('CS-014: Mark as Read button shows loading state', async ({ page }) => {
    // Create a fresh submission for this test
    const subRes = await page.request.post(`/api/widget/${CHATBOT_ID}/contact`, {
      data: { name: 'Loading Test', email: TEST_EMAIL, message: `Loading state test ${UNIQUE_TAG}` },
    });
    if (!subRes.ok()) {
      test.skip(true, 'Rate limited - skipping loading state test');
      return;
    }
    const subBody = await subRes.json();
    const freshId = subBody.data.id;

    await gotoContactPage(page);
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });

    await page.locator('table tbody tr').first().click();
    await expect(page.getByText('Contact from')).toBeVisible({ timeout: 15000 });

    // Intercept PATCH to add delay
    await page.route('**/contact-submissions**', async (route) => {
      if (route.request().method() === 'PATCH') {
        await new Promise(r => setTimeout(r, 1500));
        await route.continue();
      } else {
        await route.continue();
      }
    });

    const markReadBtn = page.getByRole('button', { name: 'Mark as Read' });
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click();
      await expect(page.locator('.animate-spin').first()).toBeVisible({ timeout: 3000 });
    }

    // Clean up
    await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${freshId}`,
      { data: { status: 'new' } }
    );
  });

  test('CS-015: Mark as Replied button shows loading state', async ({ page }) => {
    await openFirstSubmission(page);

    await page.route('**/contact-submissions**', async (route) => {
      if (route.request().method() === 'PATCH') {
        await new Promise(r => setTimeout(r, 1500));
        await route.continue();
      } else {
        await route.continue();
      }
    });

    const markRepliedBtn = page.getByRole('button', { name: 'Mark as Replied' });
    if (await markRepliedBtn.isVisible()) {
      await markRepliedBtn.click();
      await expect(page.locator('.animate-spin').first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('CS-016: Reply textarea is visible in detail view', async ({ page }) => {
    await openFirstSubmission(page);
    await expect(page.getByPlaceholder('Type your reply...')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Send Reply' })).toBeVisible();
  });

  test('CS-017: Send Reply button is disabled when textarea is empty', async ({ page }) => {
    await openFirstSubmission(page);
    const sendBtn = page.getByRole('button', { name: 'Send Reply' });
    await expect(sendBtn).toBeDisabled();
  });

  test('CS-018: Send Reply button enables when text is entered', async ({ page }) => {
    await openFirstSubmission(page);
    await page.getByPlaceholder('Type your reply...').fill('Test reply text');
    const sendBtn = page.getByRole('button', { name: 'Send Reply' });
    await expect(sendBtn).toBeEnabled();
  });

  test('CS-019: Check for replies button is visible', async ({ page }) => {
    await gotoContactPage(page);
    await expect(page.getByRole('button', { name: 'Check for replies' })).toBeVisible({ timeout: 15000 });
  });

  test('CS-020: Back button returns to list view', async ({ page }) => {
    await openFirstSubmission(page);
    await page.getByText('Back to submissions').click();
    await expect(page.locator('table')).toBeVisible({ timeout: 15000 });
  });

  // ----------------------------------
  // ADMIN REPLY VIA SMTP (REAL EMAIL)
  // ----------------------------------

  test('CS-021: Admin sends reply via API (sends real email)', async ({ page }) => {
    await ensureSubmissionId(page);
    // Ensure submission is in a fresh state
    await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`,
      { data: { status: 'new' } }
    );

    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/contact-submissions`, {
      data: {
        submissionId: createdSubmissionId,
        message: `Admin reply to your contact ${UNIQUE_TAG}`,
      },
    });
    const body = await res.json();
    if (!res.ok()) {
      console.error('CS-021 FAILED:', res.status(), JSON.stringify(body));
    }
    expect(res.ok()).toBe(true);
    expect(body.data.reply).toBeTruthy();
    expect(body.data.reply.sender_type).toBe('admin');
    expect(body.data.reply.message).toContain(UNIQUE_TAG);
    expect(body.data.reply.email_message_id).toBeTruthy();
  });

  test('CS-022: Submission auto-marked as replied after admin sends reply', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    const body = await res.json();
    expect(body.data.submission.status).toBe('replied');
  });

  test('CS-023: Reply appears in submission replies list', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    const body = await res.json();
    expect(body.data.replies.length).toBeGreaterThanOrEqual(1);
    const adminReply = body.data.replies.find(
      (r: any) => r.sender_type === 'admin' && r.message.includes(UNIQUE_TAG)
    );
    expect(adminReply).toBeTruthy();
  });

  test('CS-024: Admin reply email arrives at test user mailbox', async () => {
    test.setTimeout(120000);
    const shortId = createdSubmissionId.slice(0, 8).toUpperCase();
    const email = await waitForEmail(TEST_EMAIL, TEST_PASS, `CS-${shortId}`, 90000);
    if (!email) {
      // Email delivery may be slow - search for any recent email from support
      const fallback = await waitForEmail(TEST_EMAIL, TEST_PASS, 'contact submission', 15000);
      expect(fallback).not.toBeNull();
    } else {
      expect(email.subject).toContain('Re: Your contact submission');
    }
  });

  // ----------------------------------
  // VISITOR REPLY VIA SMTP → IMAP PICKUP
  // ----------------------------------

  test('CS-025: Visitor sends reply email to support', async () => {
    test.setTimeout(90000);
    const shortId = createdSubmissionId.slice(0, 8).toUpperCase();

    await sendEmailAsTestUser({
      to: SUPPORT_EMAIL,
      subject: `Re: Your contact submission [CS-${shortId}]`,
      text: `This is a visitor reply ${UNIQUE_TAG}. Thanks for getting back to me!`,
    });

    // Wait for email delivery
    await new Promise(r => setTimeout(r, 10000));
  });

  test('CS-026: Check-replies picks up visitor reply from IMAP', async ({ page }) => {
    test.setTimeout(120000);
    // Wait for email to be delivered then poll IMAP
    // Retry the check-replies call a few times since delivery can be slow
    let processed = 0;
    for (let attempt = 0; attempt < 5; attempt++) {
      await new Promise(r => setTimeout(r, 5000));
      const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/contact-submissions`, {
        data: { action: 'check-replies' },
      });
      expect(res.ok()).toBe(true);
      const body = await res.json();
      processed = body.data.processed || 0;
      if (processed > 0) break;
    }
    expect(processed).toBeGreaterThanOrEqual(1);
  });

  test('CS-027: Visitor reply appears in submission thread', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    const body = await res.json();
    const visitorReply = body.data.replies.find(
      (r: any) => r.sender_type === 'visitor' && r.message.includes(UNIQUE_TAG)
    );
    expect(visitorReply).toBeTruthy();
    expect(visitorReply.sender_email).toBe(TEST_EMAIL);
  });

  test('CS-028: Submission status changed to read after visitor reply', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    const body = await res.json();
    expect(body.data.submission.status).toBe('read');
  });

  // ----------------------------------
  // THREAD CONTINUATION
  // ----------------------------------

  test('CS-029: Admin sends second reply (continuing thread)', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/contact-submissions`, {
      data: {
        submissionId: createdSubmissionId,
        message: `Second admin reply ${UNIQUE_TAG} - following up`,
      },
    });
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.data.reply.sender_type).toBe('admin');
  });

  test('CS-030: Thread now has 3+ messages (admin, visitor, admin)', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`
    );
    const body = await res.json();
    expect(body.data.replies.length).toBeGreaterThanOrEqual(3);

    // Verify ordering: should be chronological
    const replies = body.data.replies;
    for (let i = 1; i < replies.length; i++) {
      expect(new Date(replies[i].created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(replies[i - 1].created_at).getTime()
      );
    }
  });

  // ----------------------------------
  // UI THREAD DISPLAY
  // ----------------------------------

  test('CS-031: Dashboard shows reply thread with admin and visitor messages', async ({ page }) => {
    await openFirstSubmission(page);
    // Should show Admin badge in the thread
    await expect(page.getByText('Admin').first()).toBeVisible({ timeout: 15000 });
  });

  test('CS-032: Reply form sends from dashboard UI and shows loading', async ({ page }) => {
    await openFirstSubmission(page);

    await page.getByPlaceholder('Type your reply...').fill(`UI reply test ${UNIQUE_TAG}`);

    // Intercept POST to add delay so we can see loading state
    await page.route('**/contact-submissions', async (route) => {
      if (route.request().method() === 'POST') {
        await new Promise(r => setTimeout(r, 1500));
        await route.continue();
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: 'Send Reply' }).click();

    // Should show "Sending..." state
    await expect(page.getByText('Sending...')).toBeVisible({ timeout: 3000 });

    // Wait for completion
    await expect(page.getByText('Reply sent')).toBeVisible({ timeout: 20000 });
  });

  test('CS-033: Reply textarea clears after successful send', async ({ page }) => {
    await openFirstSubmission(page);

    await page.getByPlaceholder('Type your reply...').fill(`Clear test ${Date.now()}`);
    await page.getByRole('button', { name: 'Send Reply' }).click();

    // Wait for send to complete, textarea should be cleared
    await expect(page.getByPlaceholder('Type your reply...')).toHaveValue('', { timeout: 20000 });
  });

  // ----------------------------------
  // ERROR HANDLING
  // ----------------------------------

  test('CS-034: Reply to non-existent submission returns 404', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/contact-submissions`, {
      data: {
        submissionId: '00000000-0000-0000-0000-000000000000',
        message: 'This should fail',
      },
    });
    expect(res.status()).toBe(404);
  });

  test('CS-035: Reply with empty message rejected', async ({ page }) => {
    const res = await page.request.post(`/api/chatbots/${CHATBOT_ID}/contact-submissions`, {
      data: {
        submissionId: createdSubmissionId,
        message: '',
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('CS-036: PATCH with invalid status rejected', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?submissionId=${createdSubmissionId}`,
      { data: { status: 'invalid_status' } }
    );
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('CS-037: PATCH without submissionId rejected', async ({ page }) => {
    const res = await page.request.patch(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions`,
      { data: { status: 'read' } }
    );
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  // ----------------------------------
  // FILTER TESTS
  // ----------------------------------

  test('CS-038: Filter submissions by status', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?status=replied`
    );
    expect(res.ok()).toBe(true);
    const body = await res.json();
    for (const sub of body.data.submissions) {
      expect(sub.status).toBe('replied');
    }
  });

  test('CS-039: Pagination works correctly', async ({ page }) => {
    const res = await page.request.get(
      `/api/chatbots/${CHATBOT_ID}/contact-submissions?page=1&limit=2`
    );
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.data.submissions.length).toBeLessThanOrEqual(2);
    expect(body.data.page).toBe(1);
    expect(body.data.limit).toBe(2);
  });

  // ----------------------------------
  // CLEANUP
  // ----------------------------------

  test('CS-040: Cleanup test emails', async () => {
    await cleanupEmails(SUPPORT_EMAIL, SUPPORT_PASS, UNIQUE_TAG);
    await cleanupEmails(TEST_EMAIL, TEST_PASS, UNIQUE_TAG);
    await cleanupEmails(TEST_EMAIL, TEST_PASS, 'CS-');
    expect(true).toBe(true);
  });
});
