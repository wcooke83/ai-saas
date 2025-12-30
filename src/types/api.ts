/**
 * API Types
 * Shared types for API requests and responses
 */

// ===================
// COMMON RESPONSE
// ===================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    requestId?: string;
    timestamp?: string;
    pagination?: PaginationMeta;
    usage?: UsageMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UsageMeta {
  tokensUsed?: number;
  creditsUsed?: number;
  remaining?: number;
}

// ===================
// GENERATION TYPES
// ===================

export interface GenerationRequest {
  toolId: string;
  input: Record<string, unknown>;
  options?: {
    model?: 'fast' | 'balanced' | 'powerful';
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

export interface GenerationResponse {
  id: string;
  content: string;
  model: string;
  provider: 'claude' | 'openai';
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  durationMs: number;
}

export interface StreamEvent {
  type: 'token' | 'done' | 'error';
  content?: string;
  usage?: GenerationResponse['usage'];
  error?: string;
}

// ===================
// TOOL TYPES
// ===================

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  inputSchema: ToolInputSchema;
  outputFormat: 'text' | 'json' | 'markdown' | 'html';
  estimatedTokens: {
    min: number;
    max: number;
  };
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, ToolInputField>;
  required: string[];
}

export interface ToolInputField {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  default?: unknown;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}

// ===================
// USER TYPES
// ===================

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface UserUsage {
  creditsUsed: number;
  creditsLimit: number;
  creditsRemaining: number;
  percentUsed: number;
  periodStart: string;
  periodEnd: string;
  isUnlimited: boolean;
}

// ===================
// API KEY TYPES
// ===================

export interface APIKeyPublic {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface APIKeyCreated extends APIKeyPublic {
  key: string; // Only returned at creation
}

export interface CreateAPIKeyRequest {
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}

// ===================
// WEBHOOK TYPES
// ===================

export interface WebhookPublic {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggeredAt: string | null;
  failureCount: number;
  createdAt: string;
}

export interface CreateWebhookRequest {
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// ===================
// ERROR CODES
// ===================

export const ERROR_CODES = {
  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_API_KEY: 'INVALID_API_KEY',
  API_KEY_EXPIRED: 'API_KEY_EXPIRED',
  MISSING_SCOPE: 'MISSING_SCOPE',

  // Input errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_JSON: 'INVALID_JSON',
  MISSING_FIELD: 'MISSING_FIELD',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  TOOL_NOT_FOUND: 'TOOL_NOT_FOUND',
  TOOL_DISABLED: 'TOOL_DISABLED',

  // Rate/usage errors
  RATE_LIMITED: 'RATE_LIMITED',
  USAGE_LIMIT_REACHED: 'USAGE_LIMIT_REACHED',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  AI_PROVIDER_ERROR: 'AI_PROVIDER_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
