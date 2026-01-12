/**
 * Email Sequence Builder API Endpoint
 * POST /api/tools/email-sequence
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildSequencePrompt,
  SEQUENCE_SYSTEM_PROMPT,
  parseSequenceResponse,
  type SequenceInput,
} from '@/lib/ai/prompts/email-sequence';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';

// Input validation schema
const sequenceInputSchema = z.object({
  type: z.enum([
    'cold-outreach',
    'follow-up',
    'onboarding',
    're-engagement',
    'sales-nurture',
    'event-promotion',
    'product-launch',
    'feedback-request',
  ]),
  tone: z.enum(['formal', 'professional', 'friendly', 'casual', 'persuasive']),
  numberOfEmails: z.union([z.literal(3), z.literal(5), z.literal(7)]),
  senderName: z.string().min(1).max(100),
  senderRole: z.string().max(100).optional(),
  senderCompany: z.string().max(100).optional(),
  targetAudience: z.string().min(5).max(500),
  targetIndustry: z.string().max(100).optional(),
  campaignGoal: z.string().min(10).max(500),
  productOrService: z.string().min(3).max(200),
  uniqueValue: z.string().min(10).max(500),
  painPoints: z.string().max(500).optional(),
  callToAction: z.string().max(200).optional(),
  additionalContext: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'email-sequence');
    }

    // 2. Rate limiting (sequences are more expensive, so stricter limits)
    const rateLimitKey = user?.id || getClientIP(req);
    const tier: RateLimitTier = user
      ? (user.plan as RateLimitTier) || 'free'
      : 'public';
    const limits = getRateLimitForTier(tier);

    // Stricter rate limit for sequences (they use more tokens)
    const sequenceLimits = {
      limit: Math.max(1, Math.floor(limits.limit / 3)),
      window: limits.window,
    };

    const rateLimitResult = await rateLimit(
      `sequence:${rateLimitKey}`,
      sequenceLimits.limit,
      sequenceLimits.window
    );

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
    const input = await parseBody(req, sequenceInputSchema);

    // 5. Build prompt
    const prompt = buildSequencePrompt(input as SequenceInput);

    // 6. Generate sequence (non-streaming due to complexity)
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: SEQUENCE_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 4096, // Higher limit for full sequence
    });

    // 7. Track usage (count as 3 generations due to complexity)
    if (user) {
      await incrementUsage(user.id, 3);
    }

    // 8. Parse the response
    const sequence = parseSequenceResponse(result.content);

    // Ensure the sequence type matches the input
    sequence.sequenceType = input.type as SequenceInput['type'];
    sequence.totalEmails = sequence.emails.length;

    return successResponse(
      {
        sequence,
        rawContent: result.content,
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
