/**
 * Embedding Generation
 * Generate vector embeddings for text using the configured AI provider
 * Supports: OpenAI, Google Gemini
 * 
 * Priority:
 *   1. Manually configured embedding model from /admin/ai-config
 *   2. Active chat provider (if it supports embeddings)
 *   3. Auto-fallback to available embedding providers (Gemini > OpenAI)
 */

import { getActiveModelAndProvider } from '@/lib/ai/provider';
import { getEmbeddingModel } from '@/lib/settings';
import { generateGeminiEmbeddings, getGeminiEmbeddingDimensions } from '@/lib/ai/providers/gemini';

// --- Query embedding cache ---
// Embeddings are deterministic (same text + model = same vector), so no TTL needed.
// Eviction is purely by LRU size cap to bound memory (~6KB per entry).
const EMBEDDING_CACHE_MAX_SIZE = parseInt(process.env.EMBEDDING_CACHE_MAX_SIZE || '', 10) || 200;

const embeddingCache = new Map<string, number[]>();

function getEmbeddingCacheKey(text: string, config: EmbeddingConfig): string {
  // Normalize: lowercase, collapse whitespace
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  return `${config.provider}:${config.model}:${normalized}`;
}

function getCachedEmbedding(key: string): number[] | null {
  const entry = embeddingCache.get(key);
  if (!entry) return null;
  // Move to end (most recently used) for LRU behavior
  embeddingCache.delete(key);
  embeddingCache.set(key, entry);
  return entry;
}

function setCachedEmbedding(key: string, embedding: number[]): void {
  // Evict oldest (least recently used) entry if at capacity
  if (embeddingCache.size >= EMBEDDING_CACHE_MAX_SIZE) {
    const firstKey = embeddingCache.keys().next().value;
    if (firstKey) embeddingCache.delete(firstKey);
  }
  embeddingCache.set(key, embedding);
}

/** Check if OPENAI_API_KEY looks like a real key (not a placeholder) */
function isValidOpenAIKey(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!key && key.startsWith('sk-') && key.length > 20;
}

export type EmbeddingProvider = 'openai' | 'gemini';

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  model: string;
  dimensions: number;
}

// --- resolveEmbeddingConfig cache (Finding #14) ---
// Caches the resolved config for 60s to avoid repeated getModelById() DB calls.
let _resolvedConfigCache: EmbeddingConfig | null | undefined = undefined;
let _resolvedConfigCacheTime = 0;
const RESOLVE_CONFIG_CACHE_TTL = 60_000; // 60s, matches getAppSettings cache

/**
 * Resolve which embedding provider to use.
 * Priority:
 *   1. Manually configured embedding model from admin settings
 *   2. Active chat provider from admin AI config (if it supports embeddings)
 *   3. Fallback to any available embedding-capable provider
 */
export async function resolveEmbeddingConfig(): Promise<EmbeddingConfig | null> {
  const now = Date.now();
  if (_resolvedConfigCache !== undefined && now - _resolvedConfigCacheTime < RESOLVE_CONFIG_CACHE_TTL) {
    return _resolvedConfigCache;
  }

  const result = await _resolveEmbeddingConfigUncached();
  _resolvedConfigCache = result;
  _resolvedConfigCacheTime = Date.now();
  return result;
}

async function _resolveEmbeddingConfigUncached(): Promise<EmbeddingConfig | null> {
  // 1. Check for manually configured embedding model preference
  try {
    const embeddingModel = await getEmbeddingModel();
    if (embeddingModel) {
      const slug = embeddingModel.provider?.slug?.toLowerCase();

      if (slug === 'openai' && isValidOpenAIKey()) {
        console.log('[Embeddings] Using configured embedding model:', embeddingModel.name);
        return {
          provider: 'openai',
          model: embeddingModel.api_model_id || 'text-embedding-ada-002',
          dimensions: 1536,
        };
      }

      if ((slug === 'google' || slug === 'gemini') && process.env.GOOGLE_API_KEY) {
        console.log('[Embeddings] Using configured embedding model:', embeddingModel.name);
        return {
          provider: 'gemini',
          model: 'gemini-embedding-001',
          dimensions: 1536,
        };
      }
    }
  } catch (err) {
    console.warn('[Embeddings] Failed to get configured embedding model:', err);
  }

  // 2. Check active chat provider from admin AI config
  try {
    const active = await getActiveModelAndProvider();
    const slug = active?.model?.provider?.slug?.toLowerCase();

    if (slug === 'openai' && isValidOpenAIKey()) {
      console.log('[Embeddings] Using active chat provider for embeddings: OpenAI');
      return {
        provider: 'openai',
        model: 'text-embedding-3-small',
        dimensions: 1536,
      };
    }

    if ((slug === 'google' || slug === 'gemini') && process.env.GOOGLE_API_KEY) {
      console.log('[Embeddings] Using active chat provider for embeddings: Gemini');
      return {
        provider: 'gemini',
        model: 'gemini-embedding-001',
        dimensions: 1536,
      };
    }
  } catch (err) {
    console.warn('[Embeddings] Failed to get active provider, trying fallbacks:', err);
  }

  // 3. Fallback: try available embedding providers in order of preference
  if (process.env.GOOGLE_API_KEY) {
    console.log('[Embeddings] Auto-selecting Gemini (free)');
    return {
      provider: 'gemini',
      model: 'gemini-embedding-001',
      dimensions: 1536,
    };
  }

  if (isValidOpenAIKey()) {
    console.log('[Embeddings] Auto-selecting OpenAI');
    return {
      provider: 'openai',
      model: 'text-embedding-3-small',
      dimensions: 1536,
    };
  }

  return null;
}

/**
 * Check if embeddings are available
 */
export async function isEmbeddingsAvailable(): Promise<boolean> {
  const config = await resolveEmbeddingConfig();
  return config !== null;
}

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

/**
 * Generate embeddings for multiple texts (batched)
 * @param overrideConfig - If provided, uses this config instead of resolving from settings
 */
export async function generateEmbeddings(texts: string[], overrideConfig?: EmbeddingConfig): Promise<number[][]> {
  const config = overrideConfig || await resolveEmbeddingConfig();

  if (!config) {
    throw new Error(
      'No embedding-capable AI provider available. ' +
      'Add GOOGLE_API_KEY (free) or OPENAI_API_KEY to .env.local, or configure an embedding-capable provider in AI Config.'
    );
  }

  if (texts.length === 0) {
    return [];
  }

  // Clean and validate texts
  const cleanedTexts = texts.map((text) =>
    text.replace(/\n+/g, ' ').trim().substring(0, 8000)
  );

  try {
    // Route to appropriate provider
    if (config.provider === 'gemini') {
      return await generateGeminiEmbeddings(cleanedTexts, config.model);
    }

    if (config.provider === 'openai') {
      return await generateOpenAIEmbeddings(cleanedTexts, config.model);
    }

    throw new Error(`Unsupported embedding provider: ${config.provider}`);
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

/**
 * Generate embeddings using OpenAI API
 */
const OPENAI_EMBEDDING_BATCH_SIZE = 100;

async function generateOpenAIEmbeddings(
  texts: string[],
  model: string
): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // For small batches, send directly
  if (texts.length <= OPENAI_EMBEDDING_BATCH_SIZE) {
    return fetchOpenAIEmbeddingsBatch(texts, model, apiKey);
  }

  // Split large requests into batches to avoid rate limits during ingestion
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += OPENAI_EMBEDDING_BATCH_SIZE) {
    const batch = texts.slice(i, i + OPENAI_EMBEDDING_BATCH_SIZE);
    const batchResult = await fetchOpenAIEmbeddingsBatch(batch, model, apiKey);
    results.push(...batchResult);
    // Rate limit spacing between batches
    if (i + OPENAI_EMBEDDING_BATCH_SIZE < texts.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return results;
}

async function fetchOpenAIEmbeddingsBatch(
  texts: string[],
  model: string,
  apiKey: string
): Promise<number[][]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate embeddings');
  }

  const data = await response.json();

  // Sort by index to ensure correct order
  const sortedData = data.data.sort(
    (a: { index: number }, b: { index: number }) => a.index - b.index
  );

  return sortedData.map((item: { embedding: number[] }) => item.embedding);
}

/**
 * Generate embedding for a single text (for queries)
 * Uses an in-memory cache to avoid redundant API calls for repeated queries.
 * @param overrideConfig - If provided, uses this config instead of resolving from settings
 */
export async function generateQueryEmbedding(query: string, overrideConfig?: EmbeddingConfig): Promise<number[]> {
  const config = overrideConfig || await resolveEmbeddingConfig();
  if (!config) {
    throw new Error('No embedding-capable AI provider available.');
  }

  const cacheKey = getEmbeddingCacheKey(query, config);
  const cached = getCachedEmbedding(cacheKey);
  if (cached) {
    console.log(`[Embeddings] Cache HIT for query (${query.substring(0, 50)}...)`);
    return cached;
  }

  try {
    const embeddings = await generateEmbeddings([query], config);
    const embedding = embeddings[0];
    setCachedEmbedding(cacheKey, embedding);
    return embedding;
  } catch (error) {
    // Single retry with 500ms backoff for transient failures
    console.warn(`[Embeddings] Query embedding failed, retrying in 500ms...`, error instanceof Error ? error.message : error);
    await new Promise(resolve => setTimeout(resolve, 500));
    const embeddings = await generateEmbeddings([query], config);
    const embedding = embeddings[0];
    setCachedEmbedding(cacheKey, embedding);
    return embedding;
  }
}
