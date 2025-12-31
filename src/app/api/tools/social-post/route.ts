/**
 * AI Social Post Generator API Endpoint
 * POST /api/tools/social-post
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildSocialPostPrompt,
  SOCIAL_POST_SYSTEM_PROMPT,
  parseSocialPostResponse,
  type SocialPostInput,
} from '@/lib/ai/prompts/social-post';
import { authenticate } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';

// Input validation schema
const socialPostInputSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters').max(500),
  contentToRepurpose: z.string().max(5000).optional(),
  keyPoints: z.string().max(1000).optional(),
  platforms: z
    .array(z.enum(['linkedin', 'twitter', 'instagram', 'tiktok']))
    .min(1, 'Select at least one platform')
    .max(4),
  variationCount: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
    .default(3),
  postType: z.enum([
    'announcement',
    'thought-leadership',
    'promotion',
    'engagement',
    'story',
    'tips',
  ]),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational', 'educational']),
  includeHashtags: z.boolean().default(true),
  includeEmojis: z.boolean().default(true),
  callToAction: z.string().max(200).optional(),
  targetAudience: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 2. Rate limiting
    const rateLimitKey = user?.id || getClientIP(req);
    const tier: RateLimitTier = user ? (user.plan as RateLimitTier) || 'free' : 'public';
    const limits = getRateLimitForTier(tier);

    const rateLimitResult = await rateLimit(
      `social-post:${rateLimitKey}`,
      limits.limit,
      limits.window
    );

    if (!rateLimitResult.success) {
      throw APIError.rateLimited(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)} seconds.`
      );
    }

    // 3. Check usage limits (1 credit per generation)
    if (user) {
      await checkUsageLimit(user.id);
    }

    // 4. Validate input
    const input = await parseBody(req, socialPostInputSchema);

    // 5. Build prompt
    const prompt = buildSocialPostPrompt(input as SocialPostInput);

    // 6. Generate posts
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: SOCIAL_POST_SYSTEM_PROMPT,
      temperature: 0.8, // Higher for creative variation
      maxTokens: 4096,
    });

    // 7. Track usage (1 credit)
    if (user) {
      await incrementUsage(user.id, 1);
    }

    // 8. Parse the response
    const posts = parseSocialPostResponse(result.content, input as SocialPostInput);

    return successResponse(
      {
        posts,
        totalPosts: posts.length,
        platforms: input.platforms,
        generatedAt: new Date().toISOString(),
      },
      {
        usage: {
          tokensUsed: result.tokensInput + result.tokensOutput,
        },
      }
    );
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
