/**
 * Blog Writer API Endpoint
 * POST /api/tools/blog-writer
 *
 * Supports two modes:
 * - mode: 'outline' - Generate a blog post outline
 * - mode: 'full' - Generate full blog post from outline
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildOutlinePrompt,
  buildFullPostPrompt,
  BLOG_SYSTEM_PROMPT,
  type BlogOutlineRequest,
  type BlogFullPostRequest,
  type GeneratedOutline,
  type GeneratedBlogPost,
} from '@/lib/ai/prompts/blog-writer';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';

// Outline section schema
const outlineSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  keyPoints: z.array(z.string()),
  estimatedWords: z.number(),
});

// Generated outline schema
const generatedOutlineSchema = z.object({
  suggestedTitle: z.string(),
  alternativeTitles: z.array(z.string()),
  metaDescription: z.string(),
  sections: z.array(outlineSectionSchema),
  estimatedTotalWords: z.number(),
});

// Base input schema (shared fields)
const baseInputSchema = z.object({
  format: z.enum(['listicle', 'how-to', 'thought-leadership', 'tutorial', 'review', 'case-study']),
  tone: z.enum(['professional', 'conversational', 'expert', 'friendly', 'persuasive', 'educational']),
  topic: z.string().min(10).max(500),
  targetAudience: z.string().max(300).optional(),
  targetKeywords: z.string().max(200).optional(),
  wordCount: z.number().min(300).max(5000),
  additionalInstructions: z.string().max(500).optional(),
});

// Outline request schema
const outlineRequestSchema = baseInputSchema.extend({
  mode: z.literal('outline'),
});

// Full post request schema
const fullPostRequestSchema = baseInputSchema.extend({
  mode: z.literal('full'),
  outline: generatedOutlineSchema,
});

// Combined schema
const blogInputSchema = z.discriminatedUnion('mode', [outlineRequestSchema, fullPostRequestSchema]);

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'blog-writer');
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
    const input = await parseBody(req, blogInputSchema);

    // 5. Generate based on mode
    if (input.mode === 'outline') {
      return await generateOutline(input as BlogOutlineRequest, user?.id);
    } else {
      return await generateFullPost(input as BlogFullPostRequest, user?.id);
    }
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
 * Generate blog post outline
 */
async function generateOutline(
  input: BlogOutlineRequest,
  userId: string | undefined
): Promise<Response> {
  const prompt = buildOutlinePrompt(input);

  const result = await generate(prompt, {
    provider: 'claude',
    model: 'balanced',
    systemPrompt: BLOG_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 2048,
  });

  // Track usage (1 credit for outline)
  if (userId) {
    await incrementUsage(userId, 1);
  }

  // Parse response
  const outline = parseOutlineResponse(result.content);

  return successResponse(
    { outline },
    {
      usage: {
        tokensUsed: result.tokensInput + result.tokensOutput,
        creditsUsed: 1,
      },
    }
  );
}

/**
 * Generate full blog post from outline
 */
async function generateFullPost(
  input: BlogFullPostRequest,
  userId: string | undefined
): Promise<Response> {
  const prompt = buildFullPostPrompt(input);

  const result = await generate(prompt, {
    provider: 'claude',
    model: 'balanced',
    systemPrompt: BLOG_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 4096,
  });

  // Track usage (2 credits for full post - longer content)
  if (userId) {
    await incrementUsage(userId, 2);
  }

  // Parse response
  const post = parsePostResponse(result.content);

  return successResponse(
    { post },
    {
      usage: {
        tokensUsed: result.tokensInput + result.tokensOutput,
        creditsUsed: 2,
      },
    }
  );
}

/**
 * Parse outline generation response
 */
function parseOutlineResponse(content: string): GeneratedOutline {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!parsed.suggestedTitle || !parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid outline structure');
    }

    // Ensure all sections have required fields
    const sections = parsed.sections.map((section: Record<string, unknown>, index: number) => ({
      id: section.id || String(index + 1),
      title: section.title || `Section ${index + 1}`,
      keyPoints: Array.isArray(section.keyPoints) ? section.keyPoints : [],
      estimatedWords: typeof section.estimatedWords === 'number' ? section.estimatedWords : 100,
    }));

    return {
      suggestedTitle: parsed.suggestedTitle,
      alternativeTitles: Array.isArray(parsed.alternativeTitles) ? parsed.alternativeTitles : [],
      metaDescription: parsed.metaDescription || '',
      sections,
      estimatedTotalWords:
        parsed.estimatedTotalWords ||
        sections.reduce(
          (sum: number, s: { estimatedWords: number }) => sum + s.estimatedWords,
          0
        ),
    };
  } catch {
    // Fallback: create a basic outline structure
    return {
      suggestedTitle: 'Untitled Post',
      alternativeTitles: [],
      metaDescription: '',
      sections: [
        { id: '1', title: 'Introduction', keyPoints: [], estimatedWords: 100 },
        { id: '2', title: 'Main Content', keyPoints: [], estimatedWords: 300 },
        { id: '3', title: 'Conclusion', keyPoints: [], estimatedWords: 100 },
      ],
      estimatedTotalWords: 500,
    };
  }
}

/**
 * Parse full post generation response
 */
function parsePostResponse(content: string): GeneratedBlogPost {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Count words in content
    const wordCount =
      parsed.wordCount ||
      (typeof parsed.content === 'string'
        ? parsed.content.split(/\s+/).filter(Boolean).length
        : 0);

    return {
      title: parsed.title || 'Untitled Post',
      metaDescription: parsed.metaDescription || '',
      suggestedTitleTags: Array.isArray(parsed.suggestedTitleTags) ? parsed.suggestedTitleTags : [],
      content: parsed.content || '',
      wordCount,
    };
  } catch {
    // Fallback: return the raw content as the post
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return {
      title: 'Generated Post',
      metaDescription: '',
      suggestedTitleTags: [],
      content: content,
      wordCount,
    };
  }
}
