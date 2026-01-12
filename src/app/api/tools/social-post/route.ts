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
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementTokenUsage, logGeneration } from '@/lib/usage/tracker';
import { logAPICall } from '@/lib/api/logging';
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
    console.log('[Social Post] Step 1: Authenticating...');
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);
    console.log('[Social Post] Step 1 complete:', { userId: user?.id, plan: user?.plan });

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'social-post');
    }

    // 2. Rate limiting
    console.log('[Social Post] Step 2: Rate limiting...');
    const rateLimitKey = user?.id || getClientIP(req);
    const tier: RateLimitTier = user ? (user.plan as RateLimitTier) || 'free' : 'public';
    const limits = getRateLimitForTier(tier);

    const rateLimitResult = await rateLimit(
      `social-post:${rateLimitKey}`,
      limits.limit,
      limits.window
    );
    console.log('[Social Post] Step 2 complete:', { success: rateLimitResult.success });

    if (!rateLimitResult.success) {
      throw APIError.rateLimited(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)} seconds.`
      );
    }

    // 3. Check usage limits (1 credit per generation)
    console.log('[Social Post] Step 3: Checking usage limits...');
    if (user) {
      await checkUsageLimit(user.id);
    }
    console.log('[Social Post] Step 3 complete');

    // 4. Validate input
    console.log('[Social Post] Step 4: Validating input...');
    const input = await parseBody(req, socialPostInputSchema);
    console.log('[Social Post] Step 4 complete');

    // 5. Build prompt
    console.log('[Social Post] Step 5: Building prompt...');
    const prompt = buildSocialPostPrompt(input as SocialPostInput);
    console.log('[Social Post] Step 5 complete');

    // 6. Generate posts
    console.log('[Social Post] Step 6: Calling AI provider...');
    const result = await generate(prompt, {
      model: 'balanced',
      systemPrompt: SOCIAL_POST_SYSTEM_PROMPT,
      temperature: 0.8, // Higher for creative variation
      maxTokens: 4096,
    });
    console.log('[Social Post] Step 6 complete:', { provider: result.provider, tokensUsed: result.tokensInput + result.tokensOutput });

    // 7. Track usage with provider-specific token multiplier
    let usageInfo = { rawTokens: 0, billedTokens: 0, multiplier: 1 };
    if (user) {
      usageInfo = await incrementTokenUsage(
        user.id,
        result.tokensInput,
        result.tokensOutput,
        result.provider
      );

      // Log to generations table for usage history
      await logGeneration({
        userId: user.id,
        toolId: 'social-post',
        type: 'social-post',
        prompt: prompt,
        output: result.content,
        model: result.model,
        tokensInput: result.tokensInput,
        tokensOutput: result.tokensOutput,
        durationMs: result.durationMs,
        status: 'completed',
        metadata: {
          platforms: input.platforms,
          postType: input.postType,
          tone: input.tone,
        },
      });
    }

    // 8. Log the API call with raw AI data
    await logAPICall({
      user_id: user?.id,
      endpoint: '/api/tools/social-post',
      method: 'POST',
      request_body: input as Record<string, unknown>,
      raw_ai_prompt: prompt,
      raw_ai_response: result.content,
      status_code: 200,
      provider: result.provider,
      model: result.model,
      tokens_input: result.tokensInput,
      tokens_output: result.tokensOutput,
      tokens_billed: usageInfo.billedTokens,
      duration_ms: result.durationMs,
      ip_address: getClientIP(req),
      user_agent: req.headers.get('user-agent') || undefined,
    });

    // 9. Parse the response
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
          tokensInput: result.tokensInput,
          tokensOutput: result.tokensOutput,
          tokensRaw: usageInfo.rawTokens,
          tokensBilled: usageInfo.billedTokens,
          multiplier: usageInfo.multiplier,
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
