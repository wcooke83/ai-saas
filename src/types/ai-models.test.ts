import { describe, it, expect } from 'vitest';
import {
  getModelPricing,
  calculateTokenCost,
  getCostIndicator,
  formatPrice,
  type AIModel,
} from './ai-models';

function makeModel(overrides: Partial<AIModel> = {}): AIModel {
  return {
    id: 'test-id',
    provider_id: 'provider-1',
    slug: 'test-model',
    name: 'Test Model',
    api_model_id: 'test-v1',
    tier: 'balanced',
    grade: 'A',
    is_enabled: true,
    is_default: false,
    max_tokens: 4096,
    supports_streaming: true,
    display_order: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    cost_input_per_mtok: 3,
    cost_output_per_mtok: 15,
    wholesale_input_per_mtok: 4,
    wholesale_output_per_mtok: 20,
    retail_input_per_mtok: 5,
    retail_output_per_mtok: 25,
    ...overrides,
  };
}

describe('getModelPricing', () => {
  const model = makeModel();

  it('returns retail pricing by default', () => {
    expect(getModelPricing(model)).toEqual({ input: 5, output: 25 });
  });

  it('returns retail pricing when specified', () => {
    expect(getModelPricing(model, 'retail')).toEqual({ input: 5, output: 25 });
  });

  it('returns wholesale pricing when specified', () => {
    expect(getModelPricing(model, 'wholesale')).toEqual({ input: 4, output: 20 });
  });
});

describe('calculateTokenCost', () => {
  it('calculates cost for 1M tokens at $3/$15 per Mtok', () => {
    const cost = calculateTokenCost(1_000_000, 1_000_000, 3, 15);
    expect(cost).toBe(18); // $3 input + $15 output
  });

  it('calculates cost for 500 tokens', () => {
    const cost = calculateTokenCost(500, 200, 3, 15);
    expect(cost).toBeCloseTo(0.0015 + 0.003, 10);
  });

  it('returns 0 for zero tokens', () => {
    expect(calculateTokenCost(0, 0, 3, 15)).toBe(0);
  });

  it('handles free tier (zero pricing)', () => {
    expect(calculateTokenCost(1_000_000, 1_000_000, 0, 0)).toBe(0);
  });

  it('handles large token counts', () => {
    const cost = calculateTokenCost(10_000_000, 5_000_000, 3, 15);
    expect(cost).toBe(30 + 75); // $30 input + $75 output
  });
});

describe('getCostIndicator', () => {
  it('returns $ for cheap models (avg <= 2)', () => {
    const model = makeModel({ retail_input_per_mtok: 1, retail_output_per_mtok: 1 });
    expect(getCostIndicator(model)).toBe('$');
  });

  it('returns $ at the boundary (avg = 2)', () => {
    const model = makeModel({ retail_input_per_mtok: 2, retail_output_per_mtok: 2 });
    expect(getCostIndicator(model)).toBe('$');
  });

  it('returns $$ for mid-range models (2 < avg <= 15)', () => {
    const model = makeModel({ retail_input_per_mtok: 5, retail_output_per_mtok: 10 });
    expect(getCostIndicator(model)).toBe('$$');
  });

  it('returns $$ at the upper boundary (avg = 15)', () => {
    const model = makeModel({ retail_input_per_mtok: 15, retail_output_per_mtok: 15 });
    expect(getCostIndicator(model)).toBe('$$');
  });

  it('returns $$$ for expensive models (avg > 15)', () => {
    const model = makeModel({ retail_input_per_mtok: 15, retail_output_per_mtok: 75 });
    expect(getCostIndicator(model)).toBe('$$$');
  });

  it('returns $ for free models', () => {
    const model = makeModel({ retail_input_per_mtok: 0, retail_output_per_mtok: 0 });
    expect(getCostIndicator(model)).toBe('$');
  });
});

describe('formatPrice', () => {
  it('returns "Free" for zero', () => {
    expect(formatPrice(0)).toBe('Free');
  });

  it('formats sub-dollar prices', () => {
    expect(formatPrice(0.5)).toBe('$0.50');
  });

  it('formats whole dollar prices', () => {
    expect(formatPrice(3)).toBe('$3.00');
  });

  it('formats large prices', () => {
    expect(formatPrice(75)).toBe('$75.00');
  });
});
