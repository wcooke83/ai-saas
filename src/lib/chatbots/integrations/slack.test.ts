import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Must set env before importing the module (module-level const reads process.env)
const FAKE_CLIENT_SECRET = 'test-slack-client-secret';
vi.stubEnv('SLACK_CLIENT_SECRET', FAKE_CLIENT_SECRET);
vi.stubEnv('SLACK_CLIENT_ID', 'test-client-id');
vi.stubEnv('SLACK_SIGNING_SECRET', 'test-signing-secret');

// Mock heavy dependencies that slack.ts imports at module level
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));
vi.mock('../api', () => ({
  getChatbot: vi.fn(),
}));
vi.mock('../execute-chat', () => ({
  executeChat: vi.fn(),
  QuotaExhaustedError: class extends Error {
    constructor(msg = 'quota') {
      super(msg);
      this.name = 'QuotaExhaustedError';
    }
  },
}));

import { signOAuthState, verifyOAuthState, handleSlackEvent, getSlackIntegration, sendSlackMessage } from './slack';
import { createAdminClient } from '@/lib/supabase/admin';
import { getChatbot } from '../api';
import { executeChat, QuotaExhaustedError } from '../execute-chat';

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

// ── OAuth State Signing ────────────────────────────────────────────

describe('signOAuthState / verifyOAuthState', () => {
  it('valid state verifies correctly and returns chatbot ID', () => {
    const chatbotId = 'chatbot-abc-123';
    const state = signOAuthState(chatbotId);
    const result = verifyOAuthState(state);
    expect(result).toBe(chatbotId);
  });

  it('state format is chatbotId:timestamp:signature', () => {
    const state = signOAuthState('my-bot');
    const parts = state.split(':');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe('my-bot');
    expect(Number(parts[1])).not.toBeNaN();
    expect(parts[2]).toMatch(/^[a-f0-9]+$/); // hex signature
  });

  it('tampered signature fails verification', () => {
    const state = signOAuthState('chatbot-1');
    const parts = state.split(':');
    parts[2] = 'deadbeef'.repeat(8); // wrong signature
    const tampered = parts.join(':');
    expect(verifyOAuthState(tampered)).toBeNull();
  });

  it('tampered chatbot ID fails verification', () => {
    const state = signOAuthState('chatbot-1');
    const parts = state.split(':');
    parts[0] = 'chatbot-evil';
    const tampered = parts.join(':');
    expect(verifyOAuthState(tampered)).toBeNull();
  });

  it('expired state (>10 min) fails verification', () => {
    const chatbotId = 'chatbot-1';
    const state = signOAuthState(chatbotId);
    const parts = state.split(':');

    // Set timestamp to 11 minutes ago
    const oldTs = (Date.now() - 11 * 60 * 1000).toString();

    // Re-create the signature with the old timestamp so only the age check fails
    const crypto = require('crypto');
    const sig = crypto
      .createHmac('sha256', FAKE_CLIENT_SECRET)
      .update(`${chatbotId}${oldTs}`)
      .digest('hex');

    const expiredState = `${chatbotId}:${oldTs}:${sig}`;
    expect(verifyOAuthState(expiredState)).toBeNull();
  });

  it('missing parts fail verification', () => {
    expect(verifyOAuthState('')).toBeNull();
    expect(verifyOAuthState('only-one-part')).toBeNull();
    expect(verifyOAuthState('two:parts')).toBeNull();
    expect(verifyOAuthState(':::')).toBeNull();
  });
});

// ── handleSlackEvent filtering ─────────────────────────────────────

describe('handleSlackEvent filtering', () => {
  const baseEvent = {
    type: 'app_mention',
    user: 'U_USER',
    text: '<@U_BOT> hello',
    channel: 'C123',
    ts: '1234567890.123456',
  };

  const mockChatbot = {
    id: 'bot-1',
    name: 'Test Bot',
    is_published: true,
    user_id: 'owner-1',
  };

  function mockIntegration(overrides: Record<string, unknown> = {}) {
    return {
      id: 'int-1',
      chatbot_id: 'bot-1',
      team_id: 'T123',
      team_name: 'Test Team',
      bot_token: 'xoxb-test',
      bot_user_id: 'U_BOT',
      channel_ids: [],
      is_active: true,
      mention_only: false,
      user_id: 'owner-1',
      created_at: null,
      updated_at: null,
      ...overrides,
    };
  }

  // Mock sendSlackMessage at the module level via fetch
  let fetchCalls: { url: string; body: string }[];

  beforeEach(() => {
    fetchCalls = [];
    vi.mocked(getChatbot).mockResolvedValue(mockChatbot as any);
    vi.mocked(executeChat).mockResolvedValue({
      content: 'AI response',
      tokensInput: 100,
      tokensOutput: 50,
      model: 'claude-3-haiku',
      provider: 'anthropic',
      conversationId: 'conv-1',
      messageId: 'msg-1',
      sessionId: 'sess-1',
      language: 'en',
      ragChunksUsed: 0,
      ragConfidence: 0,
      latencyMs: 100,
    });

    // Mock fetch for sendSlackMessage
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ ok: true, ts: '123.456' }),
    }) as any;
  });

  // getSlackIntegration uses the admin client, so we mock it module-level
  // We'll mock it by re-mocking the supabase module behavior
  function setupIntegrationMock(integration: ReturnType<typeof mockIntegration> | null) {
    vi.mocked(createAdminClient).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve(
                  integration
                    ? { data: integration, error: null }
                    : { data: null, error: { code: 'PGRST116' } }
                ),
            }),
          }),
        }),
      }),
    } as any);
  }

  it('drops events from channels not in channel_ids when list is non-empty', async () => {
    setupIntegrationMock(mockIntegration({ channel_ids: ['C_ALLOWED'] }));

    await handleSlackEvent('bot-1', {
      ...baseEvent,
      channel: 'C_OTHER', // Not in the allowed list
    });

    // executeChat should NOT have been called
    expect(vi.mocked(executeChat)).not.toHaveBeenCalled();
  });

  it('allows events from channels in channel_ids', async () => {
    setupIntegrationMock(mockIntegration({ channel_ids: ['C123'] }));

    await handleSlackEvent('bot-1', baseEvent);

    expect(vi.mocked(executeChat)).toHaveBeenCalled();
  });

  it('allows all channels when channel_ids is empty', async () => {
    setupIntegrationMock(mockIntegration({ channel_ids: [] }));

    await handleSlackEvent('bot-1', baseEvent);

    expect(vi.mocked(executeChat)).toHaveBeenCalled();
  });

  it('allows all channels when channel_ids is null', async () => {
    setupIntegrationMock(mockIntegration({ channel_ids: null }));

    await handleSlackEvent('bot-1', baseEvent);

    expect(vi.mocked(executeChat)).toHaveBeenCalled();
  });

  it('drops message events when mention_only is true', async () => {
    setupIntegrationMock(mockIntegration({ mention_only: true }));

    await handleSlackEvent('bot-1', {
      ...baseEvent,
      type: 'message', // Not an app_mention
    });

    expect(vi.mocked(executeChat)).not.toHaveBeenCalled();
  });

  it('allows app_mention events when mention_only is true', async () => {
    setupIntegrationMock(mockIntegration({ mention_only: true }));

    await handleSlackEvent('bot-1', {
      ...baseEvent,
      type: 'app_mention',
    });

    expect(vi.mocked(executeChat)).toHaveBeenCalled();
  });

  it('allows message events when mention_only is false', async () => {
    setupIntegrationMock(mockIntegration({ mention_only: false }));

    await handleSlackEvent('bot-1', {
      ...baseEvent,
      type: 'message',
    });

    expect(vi.mocked(executeChat)).toHaveBeenCalled();
  });

  it('skips bot own messages', async () => {
    setupIntegrationMock(mockIntegration({ bot_user_id: 'U_BOT' }));

    await handleSlackEvent('bot-1', {
      ...baseEvent,
      user: 'U_BOT', // Same as bot_user_id
    });

    expect(vi.mocked(executeChat)).not.toHaveBeenCalled();
  });

  it('returns early for unpublished chatbot', async () => {
    vi.mocked(getChatbot).mockResolvedValue({ ...mockChatbot, is_published: false } as any);
    setupIntegrationMock(mockIntegration());

    await handleSlackEvent('bot-1', baseEvent);

    expect(vi.mocked(executeChat)).not.toHaveBeenCalled();
  });

  it('strips bot mention from message text', async () => {
    setupIntegrationMock(mockIntegration({ bot_user_id: 'UBOT123' }));

    await handleSlackEvent('bot-1', {
      ...baseEvent,
      user: 'UUSER456',
      text: '<@UBOT123> what is the weather?',
    });

    expect(vi.mocked(executeChat)).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'what is the weather?',
      })
    );
  });

  it('sends quota exhausted message on QuotaExhaustedError', async () => {
    setupIntegrationMock(mockIntegration());
    vi.mocked(executeChat).mockRejectedValue(new QuotaExhaustedError());

    await handleSlackEvent('bot-1', baseEvent);

    // fetch should have been called with a quota message
    expect(global.fetch).toHaveBeenCalledWith(
      'https://slack.com/api/chat.postMessage',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('monthly message limit'),
      })
    );
  });
});
