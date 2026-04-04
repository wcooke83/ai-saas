import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// -------------------------------------------------------
// Mocks — factories must not reference top-level variables
// -------------------------------------------------------

vi.mock('@/lib/auth/session', () => ({
  authenticate: vi.fn(),
  requireToolAccess: vi.fn(),
}));

vi.mock('@/lib/api/utils', () => ({
  successResponse: vi.fn((data: unknown, _msg?: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status })
  ),
  errorResponse: vi.fn((err: unknown) => {
    const status = (err as any)?.statusCode || 500;
    return new Response(JSON.stringify({ error: String(err) }), { status });
  }),
  APIError: {
    unauthorized: (msg: string) => Object.assign(new Error(msg), { statusCode: 401 }),
    forbidden: (msg: string) => Object.assign(new Error(msg), { statusCode: 403 }),
  },
  parseBody: vi.fn(),
}));

vi.mock('@/lib/chatbots/api', () => ({
  getChatbotsWithStats: vi.fn().mockResolvedValue([]),
  createChatbot: vi.fn(),
  generateUniqueSlug: vi.fn(),
  checkChatbotLimit: vi.fn(),
}));

vi.mock('@/lib/chatbots/reembed-check', () => ({
  checkReembedStatusBatch: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/chatbots/plan-limits', () => ({
  getPlanLimits: vi.fn(),
  FREE_PLAN_LIMITS: {
    chatbots: 1, knowledgeSources: 3, maxFileSizeBytes: 5242880,
    slackEnabled: false, telegramEnabled: false, whatsappEnabled: false,
    discordEnabled: false, teamsEnabled: false, customBrandingEnabled: false,
    monthlyMessageLimit: 100, apiKeysLimit: 0,
  },
}));

// -------------------------------------------------------
// Imports after mocks
// -------------------------------------------------------

import { POST } from './route';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { parseBody } from '@/lib/api/utils';
import { createChatbot, generateUniqueSlug, checkChatbotLimit } from '@/lib/chatbots/api';
import { getPlanLimits, FREE_PLAN_LIMITS } from '@/lib/chatbots/plan-limits';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function makeRequest(): NextRequest {
  return new NextRequest('http://localhost/api/chatbots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'My Bot' }),
  });
}

function makeUser(plan: string) {
  return { id: 'user-1', email: 'test@example.com', plan, subscriptionStatus: 'active', authMethod: 'session' as const };
}

const validInput = { name: 'My Bot', system_prompt: 'You are a helpful assistant for testing.' };
const mockChatbot = { id: 'chatbot-1', name: 'My Bot', slug: 'my-bot' };

// -------------------------------------------------------
// Setup
// -------------------------------------------------------

function makePlanLimits(monthlyMessageLimit: number) {
  return {
    chatbots: 10, knowledgeSources: 50, maxFileSizeBytes: 26214400,
    slackEnabled: true, telegramEnabled: true, whatsappEnabled: true,
    discordEnabled: true, teamsEnabled: true, customBrandingEnabled: true,
    monthlyMessageLimit, apiKeysLimit: 5,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireToolAccess).mockResolvedValue(undefined as any);
  vi.mocked(checkChatbotLimit).mockResolvedValue(true);
  vi.mocked(generateUniqueSlug).mockResolvedValue('my-bot');
  vi.mocked(createChatbot).mockResolvedValue(mockChatbot as any);
  vi.mocked(parseBody).mockResolvedValue(validInput as any);
  // Default: pro plan limits
  vi.mocked(getPlanLimits).mockResolvedValue(makePlanLimits(10000));
});

// -------------------------------------------------------
// Tests
// -------------------------------------------------------

describe('POST /api/chatbots — monthly_message_limit from plan', () => {
  it('sets monthly_message_limit from DB plan limits for a pro plan user', async () => {
    vi.mocked(authenticate).mockResolvedValue(makeUser('pro') as any);
    vi.mocked(getPlanLimits).mockResolvedValue(makePlanLimits(10000));

    await POST(makeRequest());

    const call = vi.mocked(createChatbot).mock.calls[0][0];
    expect(call.monthly_message_limit).toBe(10000);
  });

  it('sets monthly_message_limit from DB plan limits for a free plan user', async () => {
    vi.mocked(authenticate).mockResolvedValue(makeUser('free') as any);
    vi.mocked(getPlanLimits).mockResolvedValue(makePlanLimits(100));

    await POST(makeRequest());

    const call = vi.mocked(createChatbot).mock.calls[0][0];
    expect(call.monthly_message_limit).toBe(100);
  });

  it('sets monthly_message_limit = 0 (unlimited) for an agency plan user', async () => {
    vi.mocked(authenticate).mockResolvedValue(makeUser('agency') as any);
    // DB convention: 0 means unlimited
    vi.mocked(getPlanLimits).mockResolvedValue(makePlanLimits(0));

    await POST(makeRequest());

    const call = vi.mocked(createChatbot).mock.calls[0][0];
    expect(call.monthly_message_limit).toBe(0);
  });

  it('falls back to FREE_PLAN_LIMITS when getPlanLimits rejects (empty plan string)', async () => {
    vi.mocked(authenticate).mockResolvedValue(makeUser('') as any);
    vi.mocked(getPlanLimits).mockRejectedValue(new Error('not found'));

    await POST(makeRequest());

    const call = vi.mocked(createChatbot).mock.calls[0][0];
    expect(call.monthly_message_limit).toBe(FREE_PLAN_LIMITS.monthlyMessageLimit);
  });

  it('falls back to FREE_PLAN_LIMITS for an unknown plan slug', async () => {
    vi.mocked(authenticate).mockResolvedValue(makeUser('nonexistent_plan') as any);
    vi.mocked(getPlanLimits).mockRejectedValue(new Error('not found'));

    await POST(makeRequest());

    const call = vi.mocked(createChatbot).mock.calls[0][0];
    expect(call.monthly_message_limit).toBe(FREE_PLAN_LIMITS.monthlyMessageLimit);
  });

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(authenticate).mockResolvedValue(null);

    const res = await POST(makeRequest());

    expect(res.status).toBe(401);
    expect(createChatbot).not.toHaveBeenCalled();
  });

  it('returns 403 when chatbot limit is reached', async () => {
    vi.mocked(authenticate).mockResolvedValue(makeUser('free') as any);
    vi.mocked(checkChatbotLimit).mockResolvedValue(false);

    const res = await POST(makeRequest());

    expect(res.status).toBe(403);
    expect(createChatbot).not.toHaveBeenCalled();
  });
});
