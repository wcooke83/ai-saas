/**
 * Anthropic Claude Client
 * Primary AI provider for long-form content
 */

import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('ANTHROPIC_API_KEY not set - Claude features will be unavailable');
}

export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export const CLAUDE_MODELS = {
  // Fast, cost-effective for simple tasks
  fast: 'claude-3-5-haiku-20241022',
  // Balanced performance and cost
  balanced: 'claude-3-5-sonnet-20241022',
  // Most capable for complex tasks
  powerful: 'claude-3-opus-20240229',
} as const;

export type ClaudeModel = keyof typeof CLAUDE_MODELS;

export function getClaudeModel(type: ClaudeModel = 'balanced'): string {
  return CLAUDE_MODELS[type];
}

/**
 * Token estimation (rough estimate before API call)
 * Claude uses ~4 chars per token on average
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Calculate cost estimate (in USD)
 * Prices as of 2024 - update as needed
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: ClaudeModel = 'balanced'
): number {
  const prices = {
    fast: { input: 0.00025, output: 0.00125 },      // Haiku
    balanced: { input: 0.003, output: 0.015 },      // Sonnet
    powerful: { input: 0.015, output: 0.075 },      // Opus
  };

  const price = prices[model];
  return (inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output;
}
