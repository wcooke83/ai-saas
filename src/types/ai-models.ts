/**
 * AI Providers and Models Type Definitions
 * Used for configuring available AI models and their pricing
 */

// =============================================================================
// AI PROVIDERS
// =============================================================================

export interface AIProvider {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  is_enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AIProviderWithModels extends AIProvider {
  models: AIModel[];
  models_count: number;
}

export type AIProviderSlug = 'anthropic' | 'openai' | 'xai' | 'google' | 'meta' | 'local';

// =============================================================================
// AI MODELS
// =============================================================================

export interface AIModelPricing {
  cost: {
    input: number;
    output: number;
  };
  wholesale: {
    input: number;
    output: number;
  };
  retail: {
    input: number;
    output: number;
  };
}

export interface AIModel {
  id: string;
  provider_id: string;
  slug: string;
  name: string;
  api_model_id: string;
  tier: 'fast' | 'balanced' | 'powerful' | null;
  is_enabled: boolean;
  is_default: boolean;
  max_tokens: number;
  supports_streaming: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;

  // Pricing per million tokens
  cost_input_per_mtok: number;
  cost_output_per_mtok: number;
  wholesale_input_per_mtok: number;
  wholesale_output_per_mtok: number;
  retail_input_per_mtok: number;
  retail_output_per_mtok: number;
}

export interface AIModelWithProvider extends AIModel {
  provider: AIProvider;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

// Admin: Create/Update Provider
export interface CreateProviderInput {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  is_enabled?: boolean;
  display_order?: number;
}

export interface UpdateProviderInput {
  name?: string;
  description?: string;
  logo_url?: string;
  is_enabled?: boolean;
  display_order?: number;
}

// Admin: Create/Update Model
export interface CreateModelInput {
  provider_id: string;
  slug: string;
  name: string;
  api_model_id: string;
  tier?: 'fast' | 'balanced' | 'powerful';
  is_enabled?: boolean;
  is_default?: boolean;
  max_tokens?: number;
  supports_streaming?: boolean;
  cost_input_per_mtok: number;
  cost_output_per_mtok: number;
  wholesale_input_per_mtok: number;
  wholesale_output_per_mtok: number;
  retail_input_per_mtok: number;
  retail_output_per_mtok: number;
  display_order?: number;
}

export interface UpdateModelInput {
  name?: string;
  api_model_id?: string;
  tier?: 'fast' | 'balanced' | 'powerful' | null;
  is_enabled?: boolean;
  is_default?: boolean;
  max_tokens?: number;
  supports_streaming?: boolean;
  cost_input_per_mtok?: number;
  cost_output_per_mtok?: number;
  wholesale_input_per_mtok?: number;
  wholesale_output_per_mtok?: number;
  retail_input_per_mtok?: number;
  retail_output_per_mtok?: number;
  display_order?: number;
}

// =============================================================================
// USER MODEL SELECTION
// =============================================================================

export interface UserModelPreference {
  model_id: string | null;
  model: AIModelWithProvider | null;
}

// Model for display to users (simplified pricing based on user type)
export interface UserAvailableModel {
  id: string;
  provider_id: string;
  provider_name: string;
  provider_slug: string;
  name: string;
  tier: 'fast' | 'balanced' | 'powerful' | null;
  input_per_mtok: number;   // Based on user type (retail or wholesale)
  output_per_mtok: number;
  cost_indicator: '$' | '$$' | '$$$';  // Visual cost level
  is_current: boolean;  // Is this the user's current selection
  is_default: boolean;  // Is this the system default
}

// =============================================================================
// BILLING CALCULATION
// =============================================================================

export interface ModelBillingResult {
  model_id: string;
  model_name: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;      // What we paid
  billed_usd: number;    // What user pays (wholesale or retail)
  profit_usd: number;    // Difference
}

export type UserPricingTier = 'retail' | 'wholesale';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get pricing for a model based on user type
 */
export function getModelPricing(
  model: AIModel,
  userType: UserPricingTier = 'retail'
): { input: number; output: number } {
  if (userType === 'wholesale') {
    return {
      input: model.wholesale_input_per_mtok,
      output: model.wholesale_output_per_mtok,
    };
  }
  return {
    input: model.retail_input_per_mtok,
    output: model.retail_output_per_mtok,
  };
}

/**
 * Calculate cost for token usage
 */
export function calculateTokenCost(
  tokensInput: number,
  tokensOutput: number,
  inputPricePerMtok: number,
  outputPricePerMtok: number
): number {
  const inputCost = (tokensInput / 1_000_000) * inputPricePerMtok;
  const outputCost = (tokensOutput / 1_000_000) * outputPricePerMtok;
  return inputCost + outputCost;
}

/**
 * Get cost indicator ($, $$, $$$) based on retail pricing
 */
export function getCostIndicator(model: AIModel): '$' | '$$' | '$$$' {
  const avgPrice = (model.retail_input_per_mtok + model.retail_output_per_mtok) / 2;

  if (avgPrice <= 2) return '$';
  if (avgPrice <= 15) return '$$';
  return '$$$';
}

/**
 * Format price for display
 */
export function formatPrice(pricePerMtok: number): string {
  if (pricePerMtok === 0) return 'Free';
  if (pricePerMtok < 1) return `$${pricePerMtok.toFixed(2)}`;
  return `$${pricePerMtok.toFixed(2)}`;
}
