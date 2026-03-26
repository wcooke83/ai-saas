import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before importing the module under test
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/lib/settings', () => ({
  getMultiplierForProvider: vi.fn(),
  getModelById: vi.fn(),
  isUserAffiliate: vi.fn(),
}));

import {
  PLAN_LIMITS,
  type UsageStats,
} from './tracker';
import { calculateTokenCost } from '@/types/ai-models';
import { getMultiplierForProvider, getModelById, isUserAffiliate } from '@/lib/settings';
import { createAdminClient } from '@/lib/supabase/admin';

// -------------------------------------------------------
// Helpers to build mock Supabase query chains
// -------------------------------------------------------

function mockSupabaseSelect(data: unknown, error: unknown = null) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    single: vi.fn().mockResolvedValue({ data, error }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockReturnThis(),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return chain;
}

function mockSupabaseRpc(data: unknown, error: unknown = null) {
  const chain = mockSupabaseSelect(null);
  chain.rpc = vi.fn().mockResolvedValue({ data, error });
  return chain;
}

// -------------------------------------------------------
// PLAN_LIMITS constants
// -------------------------------------------------------

describe('PLAN_LIMITS', () => {
  it('has expected plan types', () => {
    expect(PLAN_LIMITS).toHaveProperty('base');
    expect(PLAN_LIMITS).toHaveProperty('free');
    expect(PLAN_LIMITS).toHaveProperty('pro');
    expect(PLAN_LIMITS).toHaveProperty('enterprise');
  });

  it('base and free have same credits', () => {
    expect(PLAN_LIMITS.base.credits).toBe(PLAN_LIMITS.free.credits);
  });

  it('pro has more credits than free', () => {
    expect(PLAN_LIMITS.pro.credits).toBeGreaterThan(PLAN_LIMITS.free.credits);
  });

  it('enterprise has unlimited credits (-1)', () => {
    expect(PLAN_LIMITS.enterprise.credits).toBe(-1);
  });

  it('enterprise has unlimited features', () => {
    expect(PLAN_LIMITS.enterprise.features.generations).toBe(-1);
    expect(PLAN_LIMITS.enterprise.features.apiCalls).toBe(-1);
    expect(PLAN_LIMITS.enterprise.features.storage).toBe(-1);
  });
});

// -------------------------------------------------------
// Usage stats computation logic
// (testing the math extracted from getUsage)
// -------------------------------------------------------

describe('usage stats computation', () => {
  /**
   * Replicate the computation from getUsage to test the math in isolation.
   * This is the core logic at lines 182-192 of tracker.ts.
   */
  function computeUsageStats(creditsUsed: number, creditsLimit: number): Partial<UsageStats> {
    const isUnlimited = creditsLimit === -1 || creditsLimit >= 999999;
    return {
      creditsUsed,
      creditsLimit,
      creditsRemaining: isUnlimited ? Infinity : Math.max(0, creditsLimit - creditsUsed),
      percentUsed: isUnlimited ? 0 : Math.round((creditsUsed / creditsLimit) * 100),
      isUnlimited,
    };
  }

  it('normal usage: 500 of 1000', () => {
    const stats = computeUsageStats(500, 1000);
    expect(stats.creditsRemaining).toBe(500);
    expect(stats.percentUsed).toBe(50);
    expect(stats.isUnlimited).toBe(false);
  });

  it('zero usage', () => {
    const stats = computeUsageStats(0, 1000);
    expect(stats.creditsRemaining).toBe(1000);
    expect(stats.percentUsed).toBe(0);
    expect(stats.isUnlimited).toBe(false);
  });

  it('at limit', () => {
    const stats = computeUsageStats(1000, 1000);
    expect(stats.creditsRemaining).toBe(0);
    expect(stats.percentUsed).toBe(100);
  });

  it('over limit: remaining is 0, not negative', () => {
    const stats = computeUsageStats(1500, 1000);
    expect(stats.creditsRemaining).toBe(0);
    expect(stats.percentUsed).toBe(150);
  });

  it('unlimited via -1', () => {
    const stats = computeUsageStats(500, -1);
    expect(stats.isUnlimited).toBe(true);
    expect(stats.creditsRemaining).toBe(Infinity);
    expect(stats.percentUsed).toBe(0);
  });

  it('unlimited via high limit (999999)', () => {
    const stats = computeUsageStats(500, 999999);
    expect(stats.isUnlimited).toBe(true);
    expect(stats.creditsRemaining).toBe(Infinity);
    expect(stats.percentUsed).toBe(0);
  });

  it('unlimited via limit above 999999', () => {
    const stats = computeUsageStats(0, 1000000);
    expect(stats.isUnlimited).toBe(true);
  });

  it('not unlimited at 999998', () => {
    const stats = computeUsageStats(0, 999998);
    expect(stats.isUnlimited).toBe(false);
  });
});

// -------------------------------------------------------
// Token billing math (incrementTokenUsage)
// -------------------------------------------------------

describe('token billing math', () => {
  /**
   * Replicate the math from incrementTokenUsage (lines 311-315 of tracker.ts).
   */
  function computeTokenBilling(
    tokensInput: number,
    tokensOutput: number,
    multiplier: number
  ) {
    const rawTokens = tokensInput + tokensOutput;
    const billedTokens = Math.ceil(rawTokens * multiplier);
    const credits = Math.ceil(billedTokens / 1000);
    return { rawTokens, billedTokens, credits };
  }

  it('1x multiplier: 1000 tokens = 1 credit', () => {
    const result = computeTokenBilling(500, 500, 1);
    expect(result.rawTokens).toBe(1000);
    expect(result.billedTokens).toBe(1000);
    expect(result.credits).toBe(1);
  });

  it('2x multiplier doubles billed tokens', () => {
    const result = computeTokenBilling(500, 500, 2);
    expect(result.billedTokens).toBe(2000);
    expect(result.credits).toBe(2);
  });

  it('fractional multiplier rounds up', () => {
    const result = computeTokenBilling(100, 100, 1.5);
    expect(result.rawTokens).toBe(200);
    expect(result.billedTokens).toBe(300); // ceil(200 * 1.5) = 300
    expect(result.credits).toBe(1); // ceil(300 / 1000) = 1
  });

  it('small token count: minimum 1 credit', () => {
    const result = computeTokenBilling(1, 0, 1);
    expect(result.rawTokens).toBe(1);
    expect(result.billedTokens).toBe(1);
    expect(result.credits).toBe(1); // ceil(1 / 1000) = 1
  });

  it('zero tokens = 0 credits', () => {
    const result = computeTokenBilling(0, 0, 1);
    expect(result.credits).toBe(0); // ceil(0 / 1000) = 0
  });

  it('large token count', () => {
    const result = computeTokenBilling(50000, 10000, 1);
    expect(result.rawTokens).toBe(60000);
    expect(result.credits).toBe(60);
  });

  it('mock provider multiplier is 0', () => {
    const result = computeTokenBilling(1000, 500, 0);
    expect(result.billedTokens).toBe(0);
    expect(result.credits).toBe(0);
  });
});

// -------------------------------------------------------
// Model-based billing math (incrementModelUsage)
// -------------------------------------------------------

describe('model billing math', () => {
  /**
   * Replicate the core math from incrementModelUsage (lines 356-380 of tracker.ts).
   */
  function computeModelBilling(
    tokensInput: number,
    tokensOutput: number,
    model: {
      cost_input_per_mtok: number;
      cost_output_per_mtok: number;
      wholesale_input_per_mtok: number;
      wholesale_output_per_mtok: number;
      retail_input_per_mtok: number;
      retail_output_per_mtok: number;
    },
    isAffiliate: boolean
  ) {
    const costUsd = calculateTokenCost(
      tokensInput,
      tokensOutput,
      model.cost_input_per_mtok,
      model.cost_output_per_mtok
    );

    const billedUsd = isAffiliate
      ? calculateTokenCost(
          tokensInput,
          tokensOutput,
          model.wholesale_input_per_mtok,
          model.wholesale_output_per_mtok
        )
      : calculateTokenCost(
          tokensInput,
          tokensOutput,
          model.retail_input_per_mtok,
          model.retail_output_per_mtok
        );

    const profitUsd = billedUsd - costUsd;
    const credits = Math.ceil(billedUsd * 100);

    return { costUsd, billedUsd, profitUsd, credits };
  }

  const claudeModel = {
    cost_input_per_mtok: 3,
    cost_output_per_mtok: 15,
    wholesale_input_per_mtok: 4,
    wholesale_output_per_mtok: 20,
    retail_input_per_mtok: 5,
    retail_output_per_mtok: 25,
  };

  it('retail user: billed at retail rates', () => {
    const result = computeModelBilling(1_000_000, 1_000_000, claudeModel, false);
    expect(result.billedUsd).toBe(30); // $5 input + $25 output
    expect(result.costUsd).toBe(18);   // $3 input + $15 output
    expect(result.profitUsd).toBe(12);
    expect(result.credits).toBe(3000); // ceil(30 * 100)
  });

  it('affiliate user: billed at wholesale rates', () => {
    const result = computeModelBilling(1_000_000, 1_000_000, claudeModel, true);
    expect(result.billedUsd).toBe(24); // $4 input + $20 output
    expect(result.credits).toBe(2400);
  });

  it('small request: credits round up to 1 cent minimum', () => {
    // 100 tokens at $5/Mtok = $0.0005 -> ceil(0.0005 * 100) = 1 credit
    const result = computeModelBilling(100, 0, claudeModel, false);
    expect(result.billedUsd).toBeCloseTo(0.0005, 10);
    expect(result.credits).toBe(1);
  });

  it('zero tokens = 0 credits', () => {
    const result = computeModelBilling(0, 0, claudeModel, false);
    expect(result.credits).toBe(0);
    expect(result.billedUsd).toBe(0);
    expect(result.profitUsd).toBe(0);
  });

  it('free model: 0 cost, 0 billed', () => {
    const freeModel = {
      cost_input_per_mtok: 0,
      cost_output_per_mtok: 0,
      wholesale_input_per_mtok: 0,
      wholesale_output_per_mtok: 0,
      retail_input_per_mtok: 0,
      retail_output_per_mtok: 0,
    };
    const result = computeModelBilling(1_000_000, 1_000_000, freeModel, false);
    expect(result.credits).toBe(0);
    expect(result.profitUsd).toBe(0);
  });

  it('profit can be negative if cost > billed', () => {
    const lossModel = {
      cost_input_per_mtok: 10,
      cost_output_per_mtok: 50,
      wholesale_input_per_mtok: 5,
      wholesale_output_per_mtok: 25,
      retail_input_per_mtok: 5,
      retail_output_per_mtok: 25,
    };
    const result = computeModelBilling(1_000_000, 1_000_000, lossModel, false);
    expect(result.profitUsd).toBeLessThan(0);
  });
});

// -------------------------------------------------------
// getUsage with mocked Supabase
// -------------------------------------------------------

describe('getUsage (mocked DB)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns stats from existing usage record', async () => {
    const mockChain = mockSupabaseSelect({
      credits_used: 300,
      credits_limit: 1000,
      period_start: '2024-01-01T00:00:00Z',
      period_end: '2024-01-31T00:00:00Z',
    });
    vi.mocked(createAdminClient).mockReturnValue(mockChain as any);

    const { getUsage } = await import('./tracker');
    const stats = await getUsage('user-123');

    expect(stats.creditsUsed).toBe(300);
    expect(stats.creditsLimit).toBe(1000);
    expect(stats.creditsRemaining).toBe(700);
    expect(stats.percentUsed).toBe(30);
    expect(stats.isUnlimited).toBe(false);
  });

  it('detects unlimited plan from DB record', async () => {
    const mockChain = mockSupabaseSelect({
      credits_used: 500,
      credits_limit: -1,
      period_start: '2024-01-01T00:00:00Z',
      period_end: '2024-01-31T00:00:00Z',
    });
    vi.mocked(createAdminClient).mockReturnValue(mockChain as any);

    const { getUsage } = await import('./tracker');
    const stats = await getUsage('user-123');

    expect(stats.isUnlimited).toBe(true);
    expect(stats.creditsRemaining).toBe(Infinity);
    expect(stats.percentUsed).toBe(0);
  });

  it('creates record when none exists and returns defaults on insert error', async () => {
    const mockChain = mockSupabaseSelect(null); // no existing record
    mockChain.insert = vi.fn().mockResolvedValue({ data: null, error: { message: 'insert failed' } });
    vi.mocked(createAdminClient).mockReturnValue(mockChain as any);

    const { getUsage } = await import('./tracker');
    const stats = await getUsage('user-123');

    expect(stats.creditsUsed).toBe(0);
    expect(stats.creditsLimit).toBe(PLAN_LIMITS.base.credits);
    expect(stats.isUnlimited).toBe(false);
  });
});

// -------------------------------------------------------
// incrementTokenUsage with mocked dependencies
// -------------------------------------------------------

describe('incrementTokenUsage (mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock incrementUsage path
    const mockChain = mockSupabaseRpc(null);
    vi.mocked(createAdminClient).mockReturnValue(mockChain as any);
  });

  it('applies multiplier and converts to credits', async () => {
    vi.mocked(getMultiplierForProvider).mockResolvedValue(2);

    const { incrementTokenUsage } = await import('./tracker');
    const result = await incrementTokenUsage('user-1', 500, 500, 'claude');

    expect(result.rawTokens).toBe(1000);
    expect(result.billedTokens).toBe(2000); // 1000 * 2
    expect(result.multiplier).toBe(2);
  });

  it('mock provider has 0 multiplier', async () => {
    vi.mocked(getMultiplierForProvider).mockResolvedValue(0);

    const { incrementTokenUsage } = await import('./tracker');
    const result = await incrementTokenUsage('user-1', 1000, 500, 'mock');

    expect(result.billedTokens).toBe(0);
  });
});

// -------------------------------------------------------
// incrementModelUsage with mocked dependencies
// -------------------------------------------------------

describe('incrementModelUsage (mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockChain = mockSupabaseRpc(null);
    vi.mocked(createAdminClient).mockReturnValue(mockChain as any);
  });

  it('uses retail pricing for non-affiliate users', async () => {
    vi.mocked(getModelById).mockResolvedValue({
      id: 'model-1',
      name: 'Claude 3',
      cost_input_per_mtok: 3,
      cost_output_per_mtok: 15,
      wholesale_input_per_mtok: 4,
      wholesale_output_per_mtok: 20,
      retail_input_per_mtok: 5,
      retail_output_per_mtok: 25,
      provider: { slug: 'anthropic' },
    } as any);
    vi.mocked(isUserAffiliate).mockResolvedValue(false);

    const { incrementModelUsage } = await import('./tracker');
    const result = await incrementModelUsage('user-1', 'model-1', 1_000_000, 1_000_000);

    expect(result.billed_usd).toBe(30); // retail: $5 + $25
    expect(result.cost_usd).toBe(18);   // cost: $3 + $15
    expect(result.profit_usd).toBe(12);
  });

  it('uses wholesale pricing for affiliate users', async () => {
    vi.mocked(getModelById).mockResolvedValue({
      id: 'model-1',
      name: 'Claude 3',
      cost_input_per_mtok: 3,
      cost_output_per_mtok: 15,
      wholesale_input_per_mtok: 4,
      wholesale_output_per_mtok: 20,
      retail_input_per_mtok: 5,
      retail_output_per_mtok: 25,
      provider: { slug: 'anthropic' },
    } as any);
    vi.mocked(isUserAffiliate).mockResolvedValue(true);

    const { incrementModelUsage } = await import('./tracker');
    const result = await incrementModelUsage('user-1', 'model-1', 1_000_000, 1_000_000);

    expect(result.billed_usd).toBe(24); // wholesale: $4 + $20
    expect(result.profit_usd).toBe(6);  // 24 - 18
  });

  it('falls back to legacy billing when model not found', async () => {
    vi.mocked(getModelById).mockResolvedValue(null);
    vi.mocked(getMultiplierForProvider).mockResolvedValue(1);

    const { incrementModelUsage } = await import('./tracker');
    const result = await incrementModelUsage('user-1', 'missing-model', 1000, 500);

    expect(result.model_name).toBe('Unknown');
    expect(result.cost_usd).toBe(0);
    expect(result.billed_usd).toBe(0);
  });
});
