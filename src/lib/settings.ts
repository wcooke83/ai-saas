/**
 * App Settings
 * Global settings management for the application
 */

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AIProvider as AIProviderType, AIModel, AIModelWithProvider } from '@/types/ai-models';

export interface AppSettings {
  id: string;
  ai_provider: 'claude' | 'local';
  local_api_path: string;
  local_api_key: string | null;
  local_api_timeout: number;
  local_api_provider: 'default' | 'chatgpt' | 'claude' | 'grok';
  token_multiplier: number; // Legacy - kept for backwards compatibility
  multiplier_claude: number;
  multiplier_openai: number;
  multiplier_local: number;
  embedding_model_id: string | null; // Preferred model for embeddings
  sentiment_model_id: string | null; // Preferred model for sentiment analysis
  article_generation_model_id: string | null; // Preferred model for article generation from URL
  chat_debug_mode: boolean; // When true, logs full prompt sources for every chat message
  updated_at: string;
  updated_by: string | null;
}

export type AIProvider = 'claude' | 'openai' | 'deepseek' | 'gemini' | 'local' | 'mock';

/**
 * Get the token multiplier for a specific provider
 */
export async function getMultiplierForProvider(provider: AIProvider): Promise<number> {
  const settings = await getAppSettings();
  if (!settings) return 1;

  switch (provider) {
    case 'claude':
      return settings.multiplier_claude ?? settings.token_multiplier ?? 1;
    case 'openai':
      return settings.multiplier_openai ?? settings.token_multiplier ?? 1;
    case 'local':
      return settings.multiplier_local ?? settings.token_multiplier ?? 1;
    case 'mock':
      return 0; // Mock mode doesn't bill
    default:
      return settings.token_multiplier ?? 1;
  }
}

// Cache settings for 60 seconds to avoid repeated DB calls
let settingsCache: AppSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Get app settings from database (with caching)
 */
export async function getAppSettings(): Promise<AppSettings | null> {
  const now = Date.now();

  // Return cached settings if still valid
  if (settingsCache && now - cacheTime < CACHE_TTL) {
    return settingsCache;
  }

  try {
    const supabase = await createClient();

    // Use type assertion since app_settings table may not be in generated types yet
    const { data, error } = await (supabase as any)
      .from('app_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Failed to fetch app settings:', error);
      return null;
    }

    settingsCache = data as AppSettings;
    cacheTime = now;

    return settingsCache;
  } catch (error) {
    console.error('Failed to fetch app settings:', error);
    return null;
  }
}

/**
 * Update app settings (admin only - validation done at API layer)
 */
export async function updateAppSettings(
  settings: Partial<Omit<AppSettings, 'id' | 'updated_at'>>,
  updatedBy: string
): Promise<AppSettings | null> {
  try {
    const supabase = await createClient();

    // First get the settings row id (singleton table)
    const { data: existing } = await (supabase as any)
      .from('app_settings')
      .select('id')
      .limit(1)
      .single();

    if (!existing?.id) {
      console.error('No app_settings row found');
      return null;
    }

    // Use type assertion since app_settings table may not be in generated types yet
    const { data, error } = await (supabase as any)
      .from('app_settings')
      .update({
        ...settings,
        updated_by: updatedBy,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update app settings:', error);
      return null;
    }

    // Invalidate cache
    settingsCache = data as AppSettings;
    cacheTime = Date.now();

    return settingsCache;
  } catch (error) {
    console.error('Failed to update app settings:', error);
    return null;
  }
}

/**
 * Check if chat debug mode is enabled (uses cached settings)
 */
export async function isChatDebugMode(): Promise<boolean> {
  const settings = await getAppSettings();
  return settings?.chat_debug_mode ?? false;
}

/**
 * Clear settings cache (useful for testing or forced refresh)
 */
export function clearSettingsCache(): void {
  settingsCache = null;
  cacheTime = 0;
}

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    // Use admin client to bypass RLS (profiles RLS may block is_admin column reads)
    const supabase = createAdminClient();

    // Use type assertion since is_admin column may not be in generated types yet
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.is_admin === true;
  } catch {
    return false;
  }
}

// =============================================================================
// AI PROVIDERS & MODELS
// =============================================================================

// Cache for providers and models
let providersCache: AIProviderType[] | null = null;
let providersCacheTime = 0;
let modelsCache: AIModelWithProvider[] | null = null;
let modelsCacheTime = 0;

/**
 * Get all enabled AI providers (with caching)
 */
export async function getAIProviders(): Promise<AIProviderType[]> {
  const now = Date.now();

  // Return cached providers if still valid
  if (providersCache && now - providersCacheTime < CACHE_TTL) {
    return providersCache;
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ai_providers')
      .select('*')
      .eq('is_enabled', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch AI providers:', error);
      return providersCache || [];
    }

    providersCache = data as AIProviderType[];
    providersCacheTime = now;

    return providersCache;
  } catch (error) {
    console.error('Failed to fetch AI providers:', error);
    return providersCache || [];
  }
}

/**
 * Get all enabled AI models with their providers (with caching)
 */
export async function getAIModels(): Promise<AIModelWithProvider[]> {
  const now = Date.now();

  // Return cached models if still valid
  if (modelsCache && now - modelsCacheTime < CACHE_TTL) {
    return modelsCache;
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ai_models')
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .eq('is_enabled', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch AI models:', error);
      return modelsCache || [];
    }

    // Filter out models from disabled providers
    const enabledModels = (data as AIModelWithProvider[]).filter(
      (model) => model.provider?.is_enabled
    );

    modelsCache = enabledModels;
    modelsCacheTime = now;

    return modelsCache;
  } catch (error) {
    console.error('Failed to fetch AI models:', error);
    return modelsCache || [];
  }
}

/**
 * Get the default AI model
 */
export async function getDefaultModel(): Promise<AIModelWithProvider | null> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ai_models')
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .eq('is_default', true)
      .eq('is_enabled', true)
      .single();

    if (error) {
      console.error('Failed to fetch default model:', error);
      // Fallback: get first enabled model
      const models = await getAIModels();
      return models[0] || null;
    }

    return data as AIModelWithProvider;
  } catch (error) {
    console.error('Failed to fetch default model:', error);
    return null;
  }
}

/**
 * Get an AI model by ID
 */
export async function getModelById(modelId: string): Promise<AIModelWithProvider | null> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ai_models')
      .select(`
        *,
        provider:ai_providers (*)
      `)
      .eq('id', modelId)
      .single();

    if (error) {
      console.error('Failed to fetch model by ID:', error);
      return null;
    }

    return data as AIModelWithProvider;
  } catch (error) {
    console.error('Failed to fetch model by ID:', error);
    return null;
  }
}


/**
 * Check if user is an affiliate
 */
export async function isUserAffiliate(userId: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('is_affiliate')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.is_affiliate === true;
  } catch {
    return false;
  }
}

/**
 * Get the preferred embedding model from app settings
 */
export async function getEmbeddingModel(): Promise<AIModelWithProvider | null> {
  try {
    const settings = await getAppSettings();
    
    // If no embedding model preference is set, return null (will use auto-selection)
    if (!settings?.embedding_model_id) {
      return null;
    }

    // Get the preferred embedding model
    const model = await getModelById(settings.embedding_model_id);

    // If model is disabled or deleted, return null to fall back to auto-selection
    if (!model || !model.is_enabled || !model.provider?.is_enabled) {
      return null;
    }

    return model;
  } catch (error) {
    console.error('Failed to fetch embedding model:', error);
    return null;
  }
}

/**
 * Get the preferred sentiment analysis model from app settings
 * Returns null when not set (falls back to system default chat model)
 */
export async function getSentimentModel(): Promise<AIModelWithProvider | null> {
  try {
    const settings = await getAppSettings();

    if (!settings?.sentiment_model_id) {
      return null;
    }

    const model = await getModelById(settings.sentiment_model_id);

    if (!model || !model.is_enabled || !model.provider?.is_enabled) {
      return null;
    }

    return model;
  } catch (error) {
    console.error('Failed to fetch sentiment model:', error);
    return null;
  }
}

/**
 * Get the preferred article generation model from app settings
 * Returns null when not set (falls back to system default chat model)
 */
export async function getArticleGenerationModel(): Promise<AIModelWithProvider | null> {
  try {
    const settings = await getAppSettings();

    if (!settings?.article_generation_model_id) {
      return null;
    }

    const model = await getModelById(settings.article_generation_model_id);

    if (!model || !model.is_enabled || !model.provider?.is_enabled) {
      return null;
    }

    return model;
  } catch (error) {
    console.error('Failed to fetch article generation model:', error);
    return null;
  }
}

/**
 * Get all models that support embeddings
 */
export async function getEmbeddingCapableModels(): Promise<AIModelWithProvider[]> {
  const models = await getAIModels();
  
  // Filter for models from providers that support embeddings
  // Currently: OpenAI and Google (Gemini)
  return models.filter(model => {
    const slug = model.provider?.slug?.toLowerCase();
    return slug === 'openai' || slug === 'google' || slug === 'gemini';
  });
}

/**
 * Clear all caches (providers, models, settings)
 */
export function clearAllCaches(): void {
  settingsCache = null;
  cacheTime = 0;
  providersCache = null;
  providersCacheTime = 0;
  modelsCache = null;
  modelsCacheTime = 0;
}
