/**
 * Rate Limiting
 * Supports Redis (Upstash) for production, in-memory for development
 */

import { NextRequest } from 'next/server';
import { getClientIP } from './utils';

// ===================
// TYPES
// ===================

export interface RateLimitConfig {
  limit: number;           // Max requests
  window: number;          // Window in seconds
  identifier?: string;     // Custom identifier (user ID, API key, etc.)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;           // Unix timestamp when limit resets
}

// ===================
// IN-MEMORY STORE (Development)
// ===================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 60000); // Clean every minute
}

async function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    const resetTime = now + windowMs;
    memoryStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.floor(resetTime / 1000),
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.floor(entry.resetTime / 1000),
    };
  }

  entry.count++;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: Math.floor(entry.resetTime / 1000),
  };
}

// ===================
// REDIS STORE (Production via Upstash)
// ===================

async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Only import Upstash if configured
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return memoryRateLimit(key, limit, windowMs);
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
      analytics: true,
    });

    const result = await ratelimit.limit(key);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: Math.floor(result.reset / 1000),
    };
  } catch (error) {
    console.error('Redis rate limit error, falling back to memory:', error);
    return memoryRateLimit(key, limit, windowMs);
  }
}

// ===================
// MAIN RATE LIMIT FUNCTION
// ===================

/**
 * Rate limit by identifier
 * @param identifier - User ID, API key, or IP address
 * @param limit - Max requests per window (default: 60)
 * @param windowSeconds - Window in seconds (default: 60)
 */
export async function rateLimit(
  identifier: string,
  limit = 60,
  windowSeconds = 60
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const windowMs = windowSeconds * 1000;

  // Use Redis in production, memory in development
  if (process.env.NODE_ENV === 'production' && process.env.UPSTASH_REDIS_REST_URL) {
    return redisRateLimit(key, limit, windowMs);
  }

  return memoryRateLimit(key, limit, windowMs);
}

/**
 * Rate limit from request (uses IP as identifier)
 */
export async function rateLimitRequest(
  req: NextRequest,
  config: Partial<RateLimitConfig> = {}
): Promise<RateLimitResult> {
  const { limit = 60, window = 60, identifier } = config;
  const key = identifier || getClientIP(req);

  return rateLimit(key, limit, window);
}

// ===================
// TIER-BASED LIMITS
// ===================

export const RATE_LIMITS = {
  // Public/unauthenticated
  public: { limit: 10, window: 60 },

  // Free tier
  free: { limit: 30, window: 60 },

  // Pro tier
  pro: { limit: 120, window: 60 },

  // Enterprise tier
  enterprise: { limit: 600, window: 60 },

  // API key (external integrations)
  apiKey: { limit: 300, window: 60 },

  // Webhooks (higher for reliability)
  webhook: { limit: 1000, window: 60 },
} as const;

export type RateLimitTier = keyof typeof RATE_LIMITS;

/**
 * Get rate limit config for user tier
 */
export function getRateLimitForTier(tier: RateLimitTier): RateLimitConfig {
  return RATE_LIMITS[tier] || RATE_LIMITS.free;
}
