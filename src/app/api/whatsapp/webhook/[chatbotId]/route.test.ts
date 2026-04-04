import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/lib/whatsapp/crypto', () => ({
  decryptWhatsAppConfig: vi.fn((obj: unknown) => obj),
}));

vi.mock('@/lib/whatsapp/client', () => ({
  markAsRead: vi.fn(),
}));

vi.mock('@/lib/whatsapp/chat', () => ({
  handleWhatsAppMessage: vi.fn(),
}));

vi.mock('@/lib/whatsapp/rate-limit', () => ({
  isWhatsAppMessageDuplicate: vi.fn(),
  checkWhatsAppRateLimit: vi.fn(),
}));

import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { createAdminClient } from '@/lib/supabase/admin';
import { markAsRead } from '@/lib/whatsapp/client';
import { handleWhatsAppMessage } from '@/lib/whatsapp/chat';
import { isWhatsAppMessageDuplicate } from '@/lib/whatsapp/rate-limit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CHATBOT_ID = 'a0000000-0000-0000-0000-000000000001';
const APP_SECRET = 'test-secret';
const BASE_PATH = `/api/whatsapp/webhook/${CHATBOT_ID}`;

function makeSignature(body: string, secret: string): string {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');
}

function makeGetRequest(searchParams: Record<string, string>): NextRequest {
  const url = new URL(`http://localhost${BASE_PATH}`);
  for (const [k, v] of Object.entries(searchParams)) {
    url.searchParams.set(k, v);
  }
  return new NextRequest(url, { method: 'GET' });
}

function makePostRequest(body: string, headers: Record<string, string> = {}): NextRequest {
  const url = new URL(`http://localhost${BASE_PATH}`);
  return new NextRequest(url, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/** Standard text-message webhook payload */
function makeTextPayload(wamid = 'wamid.test-001', from = '14155551234') {
  return {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'waba-id-123',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+14155550000', phone_number_id: 'phone-123' },
              contacts: [{ profile: { name: 'Test User' }, wa_id: from }],
              messages: [
                {
                  from,
                  id: wamid,
                  timestamp: '1700000000',
                  type: 'text',
                  text: { body: 'Hello bot' },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeStatusPayload() {
  return {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'waba-id-123',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+14155550000', phone_number_id: 'phone-123' },
              statuses: [
                {
                  id: 'wamid.status-001',
                  status: 'delivered',
                  timestamp: '1700000001',
                  recipient_id: '14155551234',
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function makeImagePayload() {
  return {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'waba-id-123',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+14155550000', phone_number_id: 'phone-123' },
              contacts: [{ profile: { name: 'Test User' }, wa_id: '14155551234' }],
              messages: [
                {
                  from: '14155551234',
                  id: 'wamid.image-001',
                  timestamp: '1700000000',
                  type: 'image',
                  image: { id: 'img-id-1', mime_type: 'image/jpeg' },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

/** Default WhatsApp config returned by the Supabase mock */
const DEFAULT_CONFIG = {
  enabled: true,
  phone_number_id: 'phone-123',
  access_token: 'fake-token',
  verify_token: 'test-verify-token',
  ai_responses_enabled: true,
};

function setupSupabaseMock(config: Record<string, unknown> | null = DEFAULT_CONFIG) {
  const mockSingle = vi.fn().mockResolvedValue({
    data: config ? { whatsapp_config: config } : null,
    error: null,
  });
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
  vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();

  process.env.WHATSAPP_APP_SECRET = APP_SECRET;

  setupSupabaseMock();

  vi.mocked(isWhatsAppMessageDuplicate).mockReturnValue(false);
  vi.mocked(markAsRead).mockResolvedValue(undefined as any);
  vi.mocked(handleWhatsAppMessage).mockResolvedValue(undefined);
});

afterEach(() => {
  delete process.env.WHATSAPP_APP_SECRET;
});

// ---------------------------------------------------------------------------
// GET — Webhook verification
// ---------------------------------------------------------------------------

describe('GET /api/whatsapp/webhook/[chatbotId]', () => {
  it('WA-WEBHOOK-001: valid hub.mode=subscribe + correct verify_token → 200 with challenge', async () => {
    const req = makeGetRequest({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test-verify-token',
      'hub.challenge': 'challenge-abc123',
    });

    const res = await GET(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('challenge-abc123');
  });

  it('WA-WEBHOOK-002: wrong verify_token → 403', async () => {
    const req = makeGetRequest({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong-token',
      'hub.challenge': 'challenge-abc123',
    });

    const res = await GET(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(403);
  });

  it('WA-WEBHOOK-003: missing hub.mode → 400', async () => {
    const req = makeGetRequest({
      'hub.verify_token': 'test-verify-token',
      'hub.challenge': 'challenge-abc123',
    });

    const res = await GET(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(400);
  });

  it('WA-WEBHOOK-004: missing hub.challenge → 400', async () => {
    const req = makeGetRequest({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test-verify-token',
    });

    const res = await GET(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(400);
  });

  it('WA-WEBHOOK-005: chatbot not found → 404', async () => {
    setupSupabaseMock(null);

    const req = makeGetRequest({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test-verify-token',
      'hub.challenge': 'challenge-abc123',
    });

    const res = await GET(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(404);
  });

  it('WA-WEBHOOK-006: config has no verify_token → 404', async () => {
    setupSupabaseMock({ enabled: true, phone_number_id: 'phone-123' });

    const req = makeGetRequest({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'any-token',
      'hub.challenge': 'challenge-abc123',
    });

    const res = await GET(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST — Incoming messages
// ---------------------------------------------------------------------------

describe('POST /api/whatsapp/webhook/[chatbotId]', () => {
  it('WA-WEBHOOK-010: missing WHATSAPP_APP_SECRET → 500', async () => {
    delete process.env.WHATSAPP_APP_SECRET;

    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(500);
  });

  it('WA-WEBHOOK-011: missing X-Hub-Signature-256 header → 401', async () => {
    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body);

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(401);
  });

  it('WA-WEBHOOK-012: invalid HMAC signature → 401', async () => {
    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': 'sha256=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(401);
  });

  it('WA-WEBHOOK-013: valid signature + text message + AI enabled → calls handleWhatsAppMessage, returns 200', async () => {
    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).toHaveBeenCalledOnce();
    expect(handleWhatsAppMessage).toHaveBeenCalledWith(
      CHATBOT_ID,
      expect.objectContaining({ enabled: true, ai_responses_enabled: true }),
      expect.objectContaining({ id: 'wamid.test-001', type: 'text' }),
      expect.objectContaining({ wa_id: '14155551234' })
    );
  });

  it('WA-WEBHOOK-014: payload.object !== whatsapp_business_account → 200 without handleWhatsAppMessage', async () => {
    const payload = { ...makeTextPayload(), object: 'instagram' };
    const body = JSON.stringify(payload);
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-015: status-only payload (no messages array) → 200 without handleWhatsAppMessage', async () => {
    const body = JSON.stringify(makeStatusPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-016: non-text message type (image) → 200 without handleWhatsAppMessage', async () => {
    const body = JSON.stringify(makeImagePayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-017: ai_responses_enabled=false → 200 without handleWhatsAppMessage', async () => {
    setupSupabaseMock({ ...DEFAULT_CONFIG, ai_responses_enabled: false });

    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-018: duplicate message → 200 without handleWhatsAppMessage', async () => {
    vi.mocked(isWhatsAppMessageDuplicate).mockReturnValue(true);

    const body = JSON.stringify(makeTextPayload('wamid.seen-before'));
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-019: invalid chatbot UUID format → 400', async () => {
    const body = JSON.stringify(makeTextPayload());
    const url = new URL('http://localhost/api/whatsapp/webhook/not-a-uuid');
    const req = new NextRequest(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
      },
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: 'not-a-uuid' }) });

    expect(res.status).toBe(400);
  });

  it('WA-WEBHOOK-020: config not found (null) → 200 without handleWhatsAppMessage', async () => {
    setupSupabaseMock(null);

    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-020b: config.enabled=false → 200 without handleWhatsAppMessage', async () => {
    setupSupabaseMock({ ...DEFAULT_CONFIG, enabled: false });

    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    expect(handleWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('WA-WEBHOOK-021: markAsRead is called before handleWhatsAppMessage', async () => {
    const callOrder: string[] = [];

    vi.mocked(markAsRead).mockImplementation(async () => {
      callOrder.push('markAsRead');
    });
    vi.mocked(handleWhatsAppMessage).mockImplementation(async () => {
      callOrder.push('handleWhatsAppMessage');
    });

    const body = JSON.stringify(makeTextPayload('wamid.order-check'));
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(callOrder[0]).toBe('markAsRead');
    expect(callOrder).toContain('handleWhatsAppMessage');
  });

  it('WA-WEBHOOK-022: handleWhatsAppMessage throws → still returns 200 (Meta must always get 200)', async () => {
    vi.mocked(handleWhatsAppMessage).mockRejectedValue(new Error('AI service down'));

    const body = JSON.stringify(makeTextPayload());
    const req = makePostRequest(body, {
      'X-Hub-Signature-256': makeSignature(body, APP_SECRET),
    });

    const res = await POST(req, { params: Promise.resolve({ chatbotId: CHATBOT_ID }) });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });
});
