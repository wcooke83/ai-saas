/**
 * Google Gemini AI Provider
 * Supports both chat completion and embeddings via Google AI Studio API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.warn('GOOGLE_API_KEY not set - Gemini features will be unavailable');
}

export const gemini = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

export const GEMINI_MODELS = {
  // Fast, cost-effective
  fast: 'gemini-2.0-flash-exp',
  // Balanced performance
  balanced: 'gemini-1.5-flash',
  // Most capable
  powerful: 'gemini-1.5-pro',
} as const;

export const GEMINI_EMBEDDING_MODELS = {
  // Latest multimodal embedding (text, image, video, audio, PDF)
  latest: 'gemini-embedding-2-preview',
  // Stable text-only embedding
  stable: 'gemini-embedding-001',
} as const;

export type GeminiModel = keyof typeof GEMINI_MODELS;
export type GeminiEmbeddingModel = keyof typeof GEMINI_EMBEDDING_MODELS;

export function getGeminiModel(type: GeminiModel = 'balanced'): string {
  return GEMINI_MODELS[type];
}

export function getGeminiEmbeddingModel(type: GeminiEmbeddingModel = 'latest'): string {
  return GEMINI_EMBEDDING_MODELS[type];
}

// Progressive retry delays: 3s, 10s, 30s, 1m, 2m, 5m, 10m, 30m, 1h, 2h, 6h, 12h
const RETRY_DELAYS_MS = [
  3_000,       // 3 seconds
  10_000,      // 10 seconds
  30_000,      // 30 seconds
  60_000,      // 1 minute
  120_000,     // 2 minutes
  300_000,     // 5 minutes
  600_000,     // 10 minutes
  1_800_000,   // 30 minutes
  3_600_000,   // 1 hour
  7_200_000,   // 2 hours
  21_600_000,  // 6 hours
  43_200_000,  // 12 hours
];
const MAX_RETRIES = RETRY_DELAYS_MS.length;

/**
 * Generate embeddings using Gemini API
 * Uses batchEmbedContents to minimize API calls (avoids per-minute rate limits)
 * Includes retry with exponential backoff for quota/rate limit errors
 */
export async function generateGeminiEmbeddings(
  texts: string[],
  model: string = GEMINI_EMBEDDING_MODELS.latest
): Promise<number[][]> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY not configured');
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  // Use batchEmbedContents to send all texts in one request
  // Max 100 texts per batch for the Gemini API
  const BATCH_LIMIT = 100;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_LIMIT) {
    const batch = texts.slice(i, i + BATCH_LIMIT);
    const batchEmbeddings = await batchEmbedWithRetry(apiKey, model, batch);
    allEmbeddings.push(...batchEmbeddings);
  }

  return allEmbeddings;
}

/**
 * Batch embed with retry and exponential backoff
 */
async function batchEmbedWithRetry(
  apiKey: string,
  model: string,
  texts: string[]
): Promise<number[][]> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const requests = texts.map((text) => ({
        model: `models/${model}`,
        content: { parts: [{ text }] },
        outputDimensionality: 1536,
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:batchEmbedContents?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        const message = err.error?.message || response.statusText;
        const status = response.status;

        // Retry on rate limit (429) or quota errors (400/429 with quota message)
        if ((status === 429 || (status === 400 && message.includes('quota'))) && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS_MS[attempt];
          const delayLabel = delay >= 60_000 ? `${Math.round(delay / 60_000)}m` : `${delay / 1000}s`;
          console.warn(`[Gemini Embeddings] Rate limited (attempt ${attempt + 1}/${MAX_RETRIES}), retrying in ${delayLabel}...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw new Error(`[GoogleGenerativeAI Error]: ${message}`);
      }

      const data = await response.json();
      return data.embeddings.map((e: { values: number[] }) => e.values);
    } catch (error) {
      if (attempt === MAX_RETRIES) throw error;

      // Retry on network errors
      const delay = RETRY_DELAYS_MS[attempt] || 60_000;
      const delayLabel = delay >= 60_000 ? `${Math.round(delay / 60_000)}m` : `${delay / 1000}s`;
      console.warn(`[Gemini Embeddings] Error (attempt ${attempt + 1}), retrying in ${delayLabel}:`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('[Gemini Embeddings] All retries exhausted');
}

/**
 * Calculate cost estimate (in USD)
 * Gemini pricing as of March 2026
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: GeminiModel = 'balanced'
): number {
  // Prices per million tokens
  const prices = {
    fast: { input: 0, output: 0 },                    // Free tier available
    balanced: { input: 0.075, output: 0.30 },         // Flash 1.5
    powerful: { input: 1.25, output: 5.00 },          // Pro 1.5
  };

  const price = prices[model];
  return (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;
}

/**
 * Get embedding dimensions for Gemini models
 */
export function getGeminiEmbeddingDimensions(model: string = GEMINI_EMBEDDING_MODELS.latest): number {
  // Gemini embeddings support flexible dimensions (128-3072)
  // Recommended defaults: 768, 1536, 3072
  return 768; // Default to 768 for compatibility
}
