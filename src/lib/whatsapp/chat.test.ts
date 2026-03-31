import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/lib/chatbots/execute-chat', () => ({
  executeChat: vi.fn(),
  QuotaExhaustedError: class QuotaExhaustedError extends Error {
    constructor(msg = 'quota') {
      super(msg);
      this.name = 'QuotaExhaustedError';
    }
  },
}));

vi.mock('./client', () => ({
  sendWhatsAppMessage: vi.fn(),
}));

vi.mock('./rate-limit', () => ({
  checkWhatsAppRateLimit: vi.fn(),
}));

import { handleWhatsAppMessage } from './chat';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendWhatsAppMessage } from './client';
import { checkWhatsAppRateLimit } from './rate-limit';
import type { WhatsAppConfig, WhatsAppMessage, WhatsAppContact } from './types';

// -- Helpers --

function makeConfig(overrides: Partial<WhatsAppConfig> = {}): WhatsAppConfig {
  return {
    enabled: true,
    phone_number_id: 'phone-123',
    access_token: 'fake-token',
    verify_token: 'verify-tok',
    ai_responses_enabled: true,
    ...overrides,
  };
}

function makeMessage(overrides: Partial<WhatsAppMessage> = {}): WhatsAppMessage {
  return {
    from: '+14155551234',
    id: 'wamid.test1',
    timestamp: '1700000000',
    type: 'text',
    text: { body: 'Hello bot' },
    ...overrides,
  };
}

function makeContact(overrides: Partial<WhatsAppContact> = {}): WhatsAppContact {
  return {
    profile: { name: 'Test User' },
    wa_id: '+14155551234',
    ...overrides,
  };
}

function makeChatResult(overrides: Record<string, unknown> = {}) {
  return {
    content: 'AI response',
    tokensInput: 10,
    tokensOutput: 20,
    model: 'claude',
    provider: 'anthropic',
    conversationId: 'conv-1',
    messageId: 'msg-1',
    sessionId: 'sess-1',
    language: 'en',
    ragChunksUsed: 0,
    ragConfidence: 0,
    latencyMs: 100,
    ...overrides,
  };
}

const CHATBOT_ID = 'chatbot-wa-123';

// -- Setup --

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();

  const mockSingle = vi.fn().mockResolvedValue({
    data: { id: CHATBOT_ID, name: 'Test Bot', is_published: true },
    error: null,
  });
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

  vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);
  vi.mocked(checkWhatsAppRateLimit).mockReturnValue({ allowed: true });
  vi.mocked(executeChat).mockResolvedValue(makeChatResult());
  vi.mocked(sendWhatsAppMessage).mockResolvedValue(true);
});

// -- Tests --

describe('handleWhatsAppMessage', () => {
  it('processes a text message and sends AI response', async () => {
    const msg = makeMessage({ text: { body: 'What is VocUI?' } });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), msg, makeContact());

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({
        chatbotId: CHATBOT_ID,
        message: 'What is VocUI?',
        sessionId: 'whatsapp_+14155551234',
        channel: 'whatsapp',
        visitorId: '+14155551234',
        stream: false,
      })
    );
    expect(sendWhatsAppMessage).toHaveBeenCalledWith(
      expect.anything(),
      '+14155551234',
      'AI response'
    );
  });

  it('formats session ID as whatsapp_{phone}', async () => {
    const msg = makeMessage({ from: '+447911123456' });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), msg, undefined);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'whatsapp_+447911123456' })
    );
  });

  it('passes contact name as userData when available', async () => {
    const msg = makeMessage();
    const contact = makeContact({ profile: { name: 'Alice Smith' } });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), msg, contact);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({
        userData: { name: 'Alice Smith' },
      })
    );
  });

  it('omits userData when no contact provided', async () => {
    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({
        userData: undefined,
      })
    );
  });

  // -- Ignored messages --

  it('returns silently when chatbot is not published', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: CHATBOT_ID, name: 'Test Bot', is_published: false },
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined);

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendWhatsAppMessage).not.toHaveBeenCalled();
  });

  it('returns silently when chatbot is not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when message type is not text', async () => {
    const msg = makeMessage({ type: 'image', text: undefined });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), msg, undefined);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when text body is missing', async () => {
    const msg = makeMessage({ type: 'text', text: undefined });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), msg, undefined);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when text body is only whitespace', async () => {
    const msg = makeMessage({ text: { body: '   ' } });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), msg, undefined);

    expect(executeChat).not.toHaveBeenCalled();
  });

  // -- Handoff --

  it('does not send a reply when handoffActive is true', async () => {
    vi.mocked(executeChat).mockResolvedValue(
      makeChatResult({ handoffActive: true, content: '' })
    );

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined);

    expect(executeChat).toHaveBeenCalled();
    expect(sendWhatsAppMessage).not.toHaveBeenCalled();
  });

  // -- Rate limiting --

  it('sends rate limit message and skips executeChat when rate limited', async () => {
    vi.mocked(checkWhatsAppRateLimit).mockReturnValue({
      allowed: false,
      retryAfterSeconds: 45,
    });

    await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined);

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendWhatsAppMessage).toHaveBeenCalledWith(
      expect.anything(),
      '+14155551234',
      expect.stringContaining('45s')
    );
  });

  // -- Error handling --

  describe('error handling', () => {
    it('sends quota message on QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined);

      expect(sendWhatsAppMessage).toHaveBeenCalledWith(
        expect.anything(),
        '+14155551234',
        expect.stringContaining('monthly message limit')
      );
    });

    it('does not re-throw QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await expect(
        handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined)
      ).resolves.toBeUndefined();
    });

    it('re-throws unexpected errors', async () => {
      vi.mocked(executeChat).mockRejectedValue(new Error('network failure'));

      await expect(
        handleWhatsAppMessage(CHATBOT_ID, makeConfig(), makeMessage(), undefined)
      ).rejects.toThrow('network failure');
    });
  });
});
