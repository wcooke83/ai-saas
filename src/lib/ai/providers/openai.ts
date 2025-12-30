/**
 * OpenAI Client
 * Fallback provider and specific use cases
 */

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set - OpenAI features will be unavailable');
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const OPENAI_MODELS = {
  // Fast, cost-effective
  fast: 'gpt-4o-mini',
  // Balanced
  balanced: 'gpt-4o',
  // Most capable
  powerful: 'gpt-4o',
} as const;

export type OpenAIModel = keyof typeof OPENAI_MODELS;

export function getOpenAIModel(type: OpenAIModel = 'balanced'): string {
  return OPENAI_MODELS[type];
}

/**
 * Calculate cost estimate (in USD)
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: OpenAIModel = 'balanced'
): number {
  const prices = {
    fast: { input: 0.00015, output: 0.0006 },       // GPT-4o-mini
    balanced: { input: 0.0025, output: 0.01 },      // GPT-4o
    powerful: { input: 0.0025, output: 0.01 },      // GPT-4o
  };

  const price = prices[model];
  return (inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output;
}
