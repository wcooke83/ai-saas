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
  sendFollowup: vi.fn(),
}));

vi.mock('./rate-limit', () => ({
  checkDiscordRateLimit: vi.fn(),
}));

import { handleDiscordInteraction } from './chat';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeChat, QuotaExhaustedError } from '@/lib/chatbots/execute-chat';
import { sendFollowup } from './client';
import { checkDiscordRateLimit } from './rate-limit';
import type { DiscordConfig, DiscordInteraction } from './types';
import { InteractionType } from './types';

// -- Helpers --

function makeConfig(overrides: Partial<DiscordConfig> = {}): DiscordConfig {
  return {
    enabled: true,
    bot_token: 'fake-bot-token',
    application_id: 'app-discord-123',
    public_key: 'pubkey-hex',
    ai_responses_enabled: true,
    ...overrides,
  };
}

function makeInteraction(overrides: Partial<DiscordInteraction> = {}): DiscordInteraction {
  return {
    id: 'interaction-1',
    application_id: 'app-discord-123',
    type: InteractionType.APPLICATION_COMMAND,
    data: {
      name: 'ask',
      options: [{ name: 'question', value: 'What is VocUI?', type: 3 }],
    },
    channel_id: 'channel-42',
    member: { user: { id: 'user-77', username: 'TestUser' } },
    token: 'interaction-token-abc',
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

const CHATBOT_ID = 'chatbot-discord-123';

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
  vi.mocked(checkDiscordRateLimit).mockReturnValue({ allowed: true });
  vi.mocked(executeChat).mockResolvedValue(makeChatResult());
  vi.mocked(sendFollowup).mockResolvedValue(true);
});

// -- Tests --

describe('handleDiscordInteraction', () => {
  it('processes a slash command and sends AI response', async () => {
    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction());

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({
        chatbotId: CHATBOT_ID,
        message: 'What is VocUI?',
        sessionId: 'discord_channel-42_user-77',
        channel: 'discord',
        visitorId: 'user-77',
        stream: false,
      })
    );
    expect(sendFollowup).toHaveBeenCalledWith(
      'app-discord-123',
      'interaction-token-abc',
      'AI response'
    );
  });

  it('formats session ID as discord_{channelId}_{userId}', async () => {
    const interaction = makeInteraction({
      channel_id: 'ch-999',
      member: { user: { id: 'u-55', username: 'Bob' } },
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'discord_ch-999_u-55' })
    );
  });

  it('uses "dm" for channel_id when not provided', async () => {
    const interaction = makeInteraction({
      channel_id: undefined,
      user: { id: 'u-dm', username: 'DMUser' },
      member: undefined,
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'discord_dm_u-dm' })
    );
  });

  it('resolves user from interaction.user in DMs (no member)', async () => {
    const interaction = makeInteraction({
      member: undefined,
      user: { id: 'dm-user-1', username: 'DMUser' },
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).toHaveBeenCalledWith(
      expect.objectContaining({ visitorId: 'dm-user-1' })
    );
  });

  // -- Ignored interactions --

  it('returns silently for non-APPLICATION_COMMAND interactions', async () => {
    const interaction = makeInteraction({ type: InteractionType.PING });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendFollowup).not.toHaveBeenCalled();
  });

  it('returns silently when command name is not "ask"', async () => {
    const interaction = makeInteraction({
      data: { name: 'other', options: [] },
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).not.toHaveBeenCalled();
  });

  it('sends error followup when chatbot is not published', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: CHATBOT_ID, name: 'Test Bot', is_published: false },
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createAdminClient).mockReturnValue({ from: mockFrom } as any);

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction());

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendFollowup).toHaveBeenCalledWith(
      'app-discord-123',
      'interaction-token-abc',
      expect.stringContaining('not currently available')
    );
  });

  it('sends error followup when question option is empty', async () => {
    const interaction = makeInteraction({
      data: {
        name: 'ask',
        options: [{ name: 'question', value: '   ', type: 3 }],
      },
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendFollowup).toHaveBeenCalledWith(
      'app-discord-123',
      'interaction-token-abc',
      expect.stringContaining('provide a question')
    );
  });

  it('sends error followup when no user can be resolved', async () => {
    const interaction = makeInteraction({
      member: undefined,
      user: undefined,
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), interaction);

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendFollowup).toHaveBeenCalledWith(
      'app-discord-123',
      'interaction-token-abc',
      expect.stringContaining('identify the user')
    );
  });

  // -- Handoff --

  it('sends handoff message when handoffActive is true', async () => {
    vi.mocked(executeChat).mockResolvedValue(
      makeChatResult({ handoffActive: true, content: '' })
    );

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction());

    expect(sendFollowup).toHaveBeenCalledWith(
      'app-discord-123',
      'interaction-token-abc',
      expect.stringContaining('forwarded to a human agent')
    );
  });

  // -- Rate limiting --

  it('sends rate limit followup and skips executeChat when rate limited', async () => {
    vi.mocked(checkDiscordRateLimit).mockReturnValue({
      allowed: false,
      retryAfterSeconds: 20,
    });

    await handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction());

    expect(executeChat).not.toHaveBeenCalled();
    expect(sendFollowup).toHaveBeenCalledWith(
      'app-discord-123',
      'interaction-token-abc',
      expect.stringContaining('20s')
    );
  });

  // -- Error handling --

  describe('error handling', () => {
    it('sends quota message on QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction());

      expect(sendFollowup).toHaveBeenCalledWith(
        'app-discord-123',
        'interaction-token-abc',
        expect.stringContaining('monthly message limit')
      );
    });

    it('does not re-throw QuotaExhaustedError', async () => {
      vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

      await expect(
        handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction())
      ).resolves.toBeUndefined();
    });

    it('re-throws unexpected errors', async () => {
      vi.mocked(executeChat).mockRejectedValue(new Error('network failure'));

      await expect(
        handleDiscordInteraction(CHATBOT_ID, makeConfig(), makeInteraction())
      ).rejects.toThrow('network failure');
    });
  });
});
