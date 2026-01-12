/**
 * Ad Copy Generator API Endpoint
 * POST /api/tools/ad-copy
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildAdCopyPrompt,
  parseAdCopyResponse,
  AD_COPY_SYSTEM_PROMPT,
  type AdCopyInput,
} from '@/lib/ai/prompts/ad-copy';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';

// Input validation schema
const adCopySchema = z.object({
  platform: z.enum([
    'google-search',
    'google-display',
    'meta',
    'linkedin',
    'twitter',
    'tiktok',
    'pinterest',
  ]),
  productName: z.string().min(1, 'Product name is required').max(100),
  productDescription: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  targetAudience: z.string().min(5, 'Target audience is required').max(500),
  keyBenefits: z.string().min(5, 'Key benefits are required').max(500),
  tone: z.enum(['professional', 'casual', 'urgent', 'friendly', 'bold', 'trustworthy']),
  ctaGoal: z.string().min(3, 'CTA goal is required').max(200),
  landingPageUrl: z.string().url().optional().or(z.literal('')),
  variationCount: z.number().int().min(1).max(3).default(3),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'ad-copy');
    }

    // 2. Rate limiting
    const rateLimitKey = user?.id || getClientIP(req);
    const tier: RateLimitTier = user ? (user.plan as RateLimitTier) || 'free' : 'public';
    const limits = getRateLimitForTier(tier);

    const rateLimitResult = await rateLimit(rateLimitKey, limits.limit, limits.window);

    if (!rateLimitResult.success) {
      throw APIError.rateLimited(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)} seconds.`
      );
    }

    // 3. Check usage limits (if authenticated)
    if (user) {
      await checkUsageLimit(user.id);
    }

    // 4. Validate input
    const input = await parseBody(req, adCopySchema);

    // Clean up optional URL and ensure variationCount has a default
    const cleanInput: AdCopyInput = {
      ...input,
      landingPageUrl: input.landingPageUrl || undefined,
      variationCount: input.variationCount ?? 3,
    };

    // 5. Build prompt
    const prompt = buildAdCopyPrompt(cleanInput);

    // 6. Generate ad copy
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: AD_COPY_SYSTEM_PROMPT,
      temperature: 0.8, // Higher temperature for creative variations
      maxTokens: 4096,
    });

    // 7. Track usage (1 credit)
    if (user) {
      await incrementUsage(user.id, 1);
    }

    // 8. Parse the response
    const adCopy = parseAdCopyResponse(result.content, cleanInput);

    return successResponse(adCopy, {
      usage: {
        tokensUsed: result.tokensInput + result.tokensOutput,
        creditsUsed: 1,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}
