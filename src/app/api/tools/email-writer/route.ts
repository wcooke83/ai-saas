/**
 * Email Writer API Endpoint
 * POST /api/tools/email-writer
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate, generateStream, createStreamingResponse } from '@/lib/ai/provider';
import { buildEmailPrompt, EMAIL_SYSTEM_PROMPT, type EmailInput } from '@/lib/ai/prompts/email-writer';
import { authenticate, type AuthenticatedUser } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';

// Input validation schema
const emailInputSchema = z.object({
  type: z.enum([
    'cold-outreach',
    'follow-up',
    'introduction',
    'thank-you',
    'meeting-request',
    'proposal',
    'feedback-request',
  ]),
  tone: z.enum(['formal', 'professional', 'friendly', 'casual']),
  senderName: z.string().min(1).max(100),
  senderRole: z.string().max(100).optional(),
  senderCompany: z.string().max(100).optional(),
  recipientName: z.string().min(1).max(100),
  recipientRole: z.string().max(100).optional(),
  recipientCompany: z.string().max(100).optional(),
  purpose: z.string().min(10).max(1000),
  keyPoints: z.string().max(1000).optional(),
  callToAction: z.string().max(500).optional(),
  additionalContext: z.string().max(1000).optional(),
  stream: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 2. Rate limiting
    const rateLimitKey = user?.id || getClientIP(req);
    const tier: RateLimitTier = user
      ? (user.plan as RateLimitTier) || 'free'
      : 'public';
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
    const input = await parseBody(req, emailInputSchema);

    // 5. Build prompt
    const prompt = buildEmailPrompt(input as EmailInput);

    // 6. Generate email
    if (input.stream) {
      // Streaming response
      const generator = generateStream(prompt, {
        provider: 'claude',
        model: 'balanced',
        systemPrompt: EMAIL_SYSTEM_PROMPT,
        temperature: 0.7,
        maxTokens: 1024,
      });

      // Increment usage after starting (for streaming, we count the request)
      if (user) {
        incrementUsage(user.id, 1).catch(console.error);
      }

      return createStreamingResponse(generator);
    }

    // Non-streaming response
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: EMAIL_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 1024,
    });

    // 7. Track usage
    if (user) {
      await incrementUsage(user.id, 1);
    }

    // 8. Parse the response
    const { subject, body } = parseEmailResponse(result.content);

    return successResponse(
      {
        subject,
        body,
        fullText: result.content,
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

/**
 * Parse the AI response into subject and body
 */
function parseEmailResponse(content: string): { subject: string; body: string } {
  const lines = content.trim().split('\n');
  let subject = '';
  let bodyStart = 0;

  // Find subject line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith('subject:')) {
      subject = line.substring(8).trim();
      bodyStart = i + 1;
      break;
    }
  }

  // Skip empty lines after subject
  while (bodyStart < lines.length && lines[bodyStart].trim() === '') {
    bodyStart++;
  }

  const body = lines.slice(bodyStart).join('\n').trim();

  return { subject, body };
}
