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
  sendTeamsMessage: vi.fn(),
  sendTeamsTypingIndicator: vi.fn(),
}));

vi.mock('./rate-limit', () => ({
  checkTeamsRateLimit: vi.fn(),
}));

import { handleTeamsMessage } from './chat';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendTeamsMessage, sendTeamsTypingIndicator } from './client';
import { checkTeamsRateLimit } from './rate-limit';
import type { TeamsActivity } from './types';
import type { TeamsConfig } from '@/lib/chatbots/types';

// -- Helpers --

function makeConfig(overrides: Partial<TeamsConfig> = {}): TeamsConfig {
  return {
    enabled: true,
    app_id: 'app-123',
    app_secret: 'secret-456',
    bot_name: 'TestBot',
    ai_responses_enabled: true,
    ...overrides,
  };
}

function makeActivity(overrides: Partial<TeamsActivity> = {}): TeamsActivity {
  return {
    type: 'message',
    id: 'activity-1',
    timestamp: '2024-01-01T00:00:00Z',
    serviceUrl: 'https://smba.trafficmanager.net/teams/',
    channelId: 'msteams',
    from: { id: 'user-42', name: 'Test User' },
    conversation: { id: 'conv-100' },
    recipient: { id: 'bot-99', name: 'TestBot' },
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

const CHATBOT_ID = 'chatbot-teams-123';

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
  vi.mocked(checkTeamsRateLimit).mockReturnValue({ allowed: true });
  vi.mocked(executeChat).mockResolvedValue(makeChatResult());
  vi.mocked(sendTeamsMessage).mockResolvedValue(true);
  vi.mocked(sendTeamsTypingIndicator).mockResolvedValue(undefined);
});

// -- Tests --

describe('handleTeamsMessage', () => {
  it('processes a message and sends AI response', async () => {
    const activity = makeActivity({ text: 'What is VocUI?' });

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({
        chatbotId: CHATBOT_ID,
        message: 'What is VocUI?',
        sessionId: 'teams_conv-100',
        channel: 'teams',
        visitorId: 'user-42',
        stream: false,
      })
    );
    expect(sendTeamsMessage).toHaveBeenCalledWith(
      expect.anything(),
      'https://smba.trafficmanager.net/teams/',
      'conv-100',
      'activity-1',
      'AI response'
    );
  });

  it('formats session ID as teams_{conversationId}', async () => {
    const activity = makeActivity({
      conversation: { id: 'conv-xyz' },
    });

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'teams_conv-xyz' })
    );
  });

  it('sends typing indicator before processing', async () => {
    await handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity());

    expect(sendTeamsTypingIndicator).toHaveBeenCalledWith(
      expect.anything(),
      'https://smba.trafficmanager.net/teams/',
      'conv-100'
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

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity());

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendTeamsMessage).not.toHaveBeenCalled();
  });

  it('returns silently when chatbot is not found', async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity());

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when activity has no text', async () => {
    const activity = makeActivity({ text: undefined });

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when activity has no from field', async () => {
    const activity = makeActivity({ from: undefined as any });

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('returns silently when text is only whitespace', async () => {
    const activity = makeActivity({ text: '   ' });

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

    expect(executeChat).not.toHaveBeenCalled();
  });

  // -- Group chat behavior --

  describe('group chat mentions', () => {
    it('ignores group messages without @mention of bot', async () => {
      const activity = makeActivity({
        conversation: { id: 'conv-group', conversationType: 'groupChat', isGroup: true },
        text: 'Hello everyone',
        entities: [],
      });

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

      expect(executeChat).not.toHaveBeenCalled();
    });

    it('processes group message when bot is @mentioned', async () => {
      const activity = makeActivity({
        conversation: { id: 'conv-group', conversationType: 'groupChat', isGroup: true },
        text: '<at>TestBot</at> What is VocUI?',
        entities: [
          {
            type: 'mention',
            mentioned: { id: 'bot-99', name: 'TestBot' },
            text: '<at>TestBot</at>',
          },
        ],
      });

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'What is VocUI?' })
      );
    });

    it('ignores channel messages without @mention', async () => {
      const activity = makeActivity({
        conversation: { id: 'conv-ch', conversationType: 'channel' },
        text: 'Not for the bot',
        entities: [],
      });

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

      expect(executeChat).not.toHaveBeenCalled();
    });

    it('strips @mention text from the message', async () => {
      const activity = makeActivity({
        conversation: { id: 'conv-group', conversationType: 'groupChat', isGroup: true },
        text: '<at>TestBot</at> tell me about pricing',
        entities: [
          {
            type: 'mention',
            mentioned: { id: 'bot-99', name: 'TestBot' },
            text: '<at>TestBot</at>',
          },
        ],
      });

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'tell me about pricing' })
      );
    });

    it('ignores group message with only @mention and no other text', async () => {
      const activity = makeActivity({
        conversation: { id: 'conv-group', conversationType: 'groupChat', isGroup: true },
        text: '<at>TestBot</at>',
        entities: [
          {
            type: 'mention',
            mentioned: { id: 'bot-99', name: 'TestBot' },
            text: '<at>TestBot</at>',
          },
        ],
      });

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

      expect(executeChat).not.toHaveBeenCalled();
    });

    it('processes personal chat without requiring @mention', async () => {
      const activity = makeActivity({
        conversation: { id: 'conv-personal', conversationType: 'personal' },
        text: 'No mention needed',
      });

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), activity);

      expect(executeChat).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'No mention needed' })
      );
    });
  });

  // -- Handoff --

  it('does not send a reply when handoffActive is true', async () => {
    vi.mocked(executeChat).mockResolvedValue(
      makeChatResult({ handoffActive: true, content: '' })
    );

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity());

    expect(executeChat).toHaveBeenCalled();
    expect(sendTeamsMessage).not.toHaveBeenCalled();
  });

  // -- Rate limiting --

  it('sends rate limit message and skips executeChat when rate limited', async () => {
    vi.mocked(checkTeamsRateLimit).mockReturnValue({
      allowed: false,
      retryAfterSeconds: 30,
    });

    await handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity());

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendTeamsMessage).toHaveBeenCalledWith(
      expect.anything(),
      'https://smba.trafficmanager.net/teams/',
      'conv-100',
      'activity-1',
      expect.stringContaining('30s')
    );
  });

  // -- Error handling --

  describe('error handling', () => {
    it('sends quota message on QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity());

      expect(sendTeamsMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'conv-100',
        'activity-1',
        expect.stringContaining('monthly message limit')
      );
    });

    it('does not re-throw QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await expect(
        handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity())
      ).resolves.toBeUndefined();
    });

    it('re-throws unexpected errors', async () => {
      vi.mocked(executeChat).mockRejectedValue(new Error('network failure'));

      await expect(
        handleTeamsMessage(CHATBOT_ID, makeConfig(), makeActivity())
      ).rejects.toThrow('network failure');
    });
  });
});
