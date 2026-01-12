/**
 * Meeting Notes Summarizer API Endpoint
 * POST /api/tools/meeting-notes
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildMeetingNotesPrompt,
  parseMeetingNotesResponse,
  MEETING_NOTES_SYSTEM_PROMPT,
  type MeetingNotesInput,
} from '@/lib/ai/prompts/meeting-notes';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';

// Input validation schema
const meetingNotesSchema = z.object({
  transcript: z.string().min(50, 'Transcript must be at least 50 characters').max(100000),
  meetingType: z.enum([
    'team-standup',
    'one-on-one',
    'client-call',
    'project-review',
    'brainstorming',
    'all-hands',
    'general',
  ]),
  sections: z.array(
    z.enum([
      'executive-summary',
      'key-discussions',
      'action-items',
      'decisions',
      'follow-ups',
      'attendees',
      'next-steps',
      'open-questions',
    ])
  ).min(1, 'At least one section must be selected'),
  meetingTitle: z.string().max(200).optional(),
  meetingDate: z.string().max(50).optional(),
  additionalContext: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'meeting-notes');
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
    const input = await parseBody(req, meetingNotesSchema);

    // 5. Build prompt
    const prompt = buildMeetingNotesPrompt(input as MeetingNotesInput);

    // 6. Generate summary
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: MEETING_NOTES_SYSTEM_PROMPT,
      temperature: 0.5, // Lower temperature for more consistent summaries
      maxTokens: 4096,
    });

    // 7. Track usage (1 credit)
    if (user) {
      await incrementUsage(user.id, 1);
    }

    // 8. Parse the response
    const summary = parseMeetingNotesResponse(result.content, input as MeetingNotesInput);

    return successResponse(summary, {
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
