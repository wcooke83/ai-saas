import { describe, it, expect, vi, beforeEach } from 'vitest';

// Module-level mocks (hoisted — no top-level variable references)
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
  sendTelegramMessage: vi.fn(),
}));

vi.mock('./rate-limit', () => ({
  checkTelegramRateLimit: vi.fn(),
}));

import { handleTelegramChat } from './chat';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendTelegramMessage } from './client';
import { checkTelegramRateLimit } from './rate-limit';
import type { TelegramConfig, TelegramMessage } from './types';

// ── Helpers ────────────────────────────────────────────────────────

function makeConfig(overrides: Partial<TelegramConfig> = {}): TelegramConfig {
  return {
    enabled: true,
    bot_token: 'fake-token',
    chat_id: '999',
    ai_responses_enabled: true,
    ...overrides,
  };
}

function makeMessage(overrides: Partial<TelegramMessage> = {}): TelegramMessage {
  return {
    message_id: 1,
    chat: { id: 100, type: 'private' },
    from: { id: 42, is_bot: false, first_name: 'Test' },
    text: 'Hello bot',
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

const CHATBOT_ID = 'chatbot-123';

// ── Setup ──────────────────────────────────────────────────────────

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();

  // Default: chatbot exists and is published
  const mockSingle = vi.fn().mockResolvedValue({
    data: { id: CHATBOT_ID, name: 'Test Bot', is_published: true },
    error: null,
  });
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

  vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);
  vi.mocked(checkTelegramRateLimit).mockReturnValue({ allowed: true });
  vi.mocked(executeChat).mockResolvedValue(makeChatResult());
  vi.mocked(sendTelegramMessage).mockResolvedValue(null);
});

// ── Tests ──────────────────────────────────────────────────────────

describe('handleTelegramChat', () => {
  // -- Basic message processing --

  it('processes a DM and sends AI response', async () => {
    const msg = makeMessage({ text: 'What is VocUI?' });

    await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({
        chatbotId: CHATBOT_ID,
        message: 'What is VocUI?',
        sessionId: 'telegram_100_42',
        channel: 'telegram',
        visitorId: '42',
        stream: false,
      })
    );
    expect(sendTelegramMessage).toHaveBeenCalledWith(
      expect.anything(),
      'AI response',
      expect.objectContaining({
        chatId: '100',
        replyToMessageId: 1,
      })
    );
  });

  it('formats session ID as telegram_{chatId}_{userId}', async () => {
    const msg = makeMessage({
      chat: { id: 555, type: 'private' },
      from: { id: 77, is_bot: false, first_name: 'Alice' },
    });

    await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'telegram_555_77' })
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

    await handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage());

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it('returns silently when chatbot is not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);

    await handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage());

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when message has no text', async () => {
    const msg = makeMessage({ text: undefined });

    await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when message has no from field', async () => {
    const msg = makeMessage({ from: undefined });

    await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when message text is only whitespace', async () => {
    const msg = makeMessage({ text: '   ' });

    await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

    expect(executeChat).not.toHaveBeenCalled();
  });

  // -- Group chat behavior --

  describe('group chat mentions', () => {
    it('ignores group messages without @mention', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: 'Hello everyone',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).not.toHaveBeenCalled();
    });

    it('ignores supergroup messages without @mention', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'supergroup' },
        text: 'Hello everyone',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).not.toHaveBeenCalled();
    });

    it('processes group message with @mention and strips it', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: '@mybot What is VocUI?',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'What is VocUI?' })
      );
    });

    it('processes supergroup message with @mention', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'supergroup' },
        text: '@helperbot tell me a joke',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'tell me a joke' })
      );
    });

    it('handles mention in middle of text', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: 'Hey @vocuibot what do you think?',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Hey  what do you think?' })
      );
    });

    it('ignores group message with only @mention and no other text', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: '@mybot',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).not.toHaveBeenCalled();
    });

    it('processes DMs without requiring a mention', async () => {
      const msg = makeMessage({
        chat: { id: 100, type: 'private' },
        text: 'No mention needed here',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'No mention needed here' })
      );
    });
  });

  // -- Bot mention stripping regex --

  describe('mention stripping', () => {
    it('strips @usernamebot case-insensitively', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: '@MyBot question here',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'question here' })
      );
    });

    it('preserves text after mention', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: '@testbot how does this work and can you explain?',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'how does this work and can you explain?',
        })
      );
    });

    it('strips only first mention (replace without /g)', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: '@firstbot tell @secondbot hello',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      // Only first @*bot is stripped; second remains
      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'tell @secondbot hello',
        })
      );
    });

    it('does not match usernames that do not end in "bot"', async () => {
      const msg = makeMessage({
        chat: { id: 200, type: 'group' },
        text: '@john please help',
      });

      await handleTelegramChat(CHATBOT_ID, makeConfig(), msg);

      // @john does not match /@\w+bot\b/i, so message is ignored in group
      expect(executeChat).not.toHaveBeenCalled();
    });
  });

  // -- Handoff --

  it('does not send a reply when handoffActive is true', async () => {
    vi.mocked(executeChat).mockResolvedValue(
      makeChatResult({ handoffActive: true, content: '' })
    );

    await handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage());

    expect(executeChat).toHaveBeenCalled();
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  // -- Rate limiting --

  it('sends rate limit message and skips executeChat when rate limited', async () => {
    vi.mocked(checkTelegramRateLimit).mockReturnValue({
      allowed: false,
      retryAfterSeconds: 45,
    });

    await handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage());

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendTelegramMessage).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('45s'),
      expect.objectContaining({ chatId: '100', replyToMessageId: 1 })
    );
  });

  // -- Error handling --

  describe('error handling', () => {
    it('sends quota message on QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage());

      expect(sendTelegramMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('monthly message limit'),
        expect.objectContaining({ chatId: '100', replyToMessageId: 1 })
      );
    });

    it('does not re-throw QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await expect(
        handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage())
      ).resolves.toBeUndefined();
    });

    it('re-throws unexpected errors', async () => {
      vi.mocked(executeChat).mockRejectedValue(new Error('network failure'));

      await expect(
        handleTelegramChat(CHATBOT_ID, makeConfig(), makeMessage())
      ).rejects.toThrow('network failure');
    });
  });
});
