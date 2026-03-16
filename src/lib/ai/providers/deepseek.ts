/**
 * DeepSeek AI Provider
 * Uses OpenAI-compatible API with custom base URL
 */

import OpenAI from 'openai';

if (!process.env.DEEPSEEK_API_KEY) {
  console.warn('DEEPSEEK_API_KEY not set - DeepSeek features will be unavailable');
}

export const deepseek = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })
  : null;

export const DEEPSEEK_MODELS = {
  fast: 'deepseek-chat',
  balanced: 'deepseek-chat',
  powerful: 'deepseek-reasoner',
} as const;

export type DeepSeekModel = keyof typeof DEEPSEEK_MODELS;

export function getDeepSeekModel(type: DeepSeekModel = 'balanced'): string {
  return DEEPSEEK_MODELS[type];
}

/**
 * Calculate cost estimate (in USD)
 * Prices per million tokens (as of March 2026)
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: DeepSeekModel = 'balanced'
): number {
  const prices = {
    fast: { input: 0.00027, output: 0.0011 },        // DeepSeek-V3
    balanced: { input: 0.00027, output: 0.0011 },     // DeepSeek-V3
    powerful: { input: 0.00055, output: 0.00219 },    // DeepSeek-R1
  };

  const price = prices[model];
  return (inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output;
}
