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
  // Fast, cost-effective for simple tasks ($1/$5 per MTok)
  fast: 'claude-haiku-4-5-20251001',
  // Balanced performance and cost ($3/$15 per MTok)
  balanced: 'claude-sonnet-4-5-20250929',
  // Most capable for complex tasks ($5/$25 per MTok)
  powerful: 'claude-opus-4-5-20251101',
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
  // Prices per 1K tokens (Dec 2025)
  const prices = {
    fast: { input: 0.001, output: 0.005 },       // Haiku 4.5
    balanced: { input: 0.003, output: 0.015 },   // Sonnet 4.5
    powerful: { input: 0.005, output: 0.025 },   // Opus 4.5
  };

  const price = prices[model];
  return (inputTokens / 1000) * price.input + (outputTokens / 1000) * price.output;
}
