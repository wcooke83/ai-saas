/**
 * Section Regeneration API Endpoint
 * POST /api/tools/proposal-generator/section
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildSectionRegenerationPrompt,
  PROPOSAL_SYSTEM_PROMPT,
} from '@/lib/ai/prompts/proposal-generator';
import { authenticate } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementUsage } from '@/lib/usage/tracker';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';
import {
  type SectionType,
  type ProposalTone,
  type ProposalType,
  type Industry,
  SECTION_LABELS,
  TIER_RESTRICTIONS,
} from '@/types/proposal';

// ===================
// INPUT VALIDATION
// ===================

const sectionInputSchema = z.object({
  sectionType: z.enum([
    'executive-summary', 'company-overview', 'problem-statement', 'proposed-solution',
    'scope-of-work', 'deliverables', 'timeline-milestones', 'pricing-fees',
    'team-qualifications', 'case-studies', 'methodology', 'terms-conditions',
    'next-steps', 'appendix', 'budget-breakdown', 'success-metrics',
    'risk-mitigation', 'competitive-analysis',
  ] as const),
  context: z.object({
    proposalType: z.enum([
      'sales', 'rfp-response', 'partnership', 'pricing', 'project',
      'service-quote', 'capability-statement', 'sow', 'grant', 'consulting',
    ] as const),
    industry: z.enum([
      'tech-saas', 'marketing-agency', 'finance', 'healthcare',
      'legal', 'construction', 'education', 'nonprofit',
    ] as const),
    clientName: z.string(),
    clientCompany: z.string(),
    senderName: z.string(),
    senderCompany: z.string(),
    projectDescription: z.string(),
    objectives: z.string(),
    tone: z.enum(['formal', 'professional', 'friendly'] as const),
  }),
  existingSections: z.array(z.object({
    type: z.string(),
    content: z.string(),
  })).optional(),
  instructions: z.string().max(500).optional(),
});

// ===================
// MAIN HANDLER
// ===================

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (required for section regeneration)
    const user = await authenticate(req);

    if (!user) {
      throw APIError.unauthorized('Authentication required for section regeneration');
    }

    // 2. Check tier (Pro feature)
    const userTier = user.plan === 'pro' || user.plan === 'enterprise' ? 'pro' : 'free';
    const restrictions = TIER_RESTRICTIONS[userTier];

    if (!restrictions.features.sectionRegeneration) {
      throw APIError.forbidden('Section regeneration requires a Pro plan');
    }

    // 3. Rate limiting
    const rateLimitKey = user.id;
    const tier: RateLimitTier = (user.plan as RateLimitTier) || 'free';
    const limits = getRateLimitForTier(tier);

    const rateLimitResult = await rateLimit(rateLimitKey, limits.limit, limits.window);

    if (!rateLimitResult.success) {
      throw APIError.rateLimited(
        `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000)} seconds.`
      );
    }

    // 4. Check usage limits
    await checkUsageLimit(user.id, 1);

    // 5. Validate input
    const input = await parseBody(req, sectionInputSchema);

    // 6. Build regeneration prompt
    const proposalInput = {
      ...input.context,
      tone: input.context.tone as ProposalTone,
      proposalType: input.context.proposalType as ProposalType,
      industry: input.context.industry as Industry,
      selectedSections: [] as SectionType[],
    };

    const existingSections = (input.existingSections || []).map(s => ({
      type: s.type as SectionType,
      content: s.content,
    }));

    const prompt = buildSectionRegenerationPrompt(
      input.sectionType,
      proposalInput,
      existingSections,
      input.instructions
    );

    // 7. Generate section
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'balanced',
      systemPrompt: PROPOSAL_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 2048,
    });

    // 8. Track usage
    await incrementUsage(user.id, 1);

    // 9. Return response
    return successResponse(
      {
        sectionId: `section-${input.sectionType}-${Date.now()}`,
        type: input.sectionType,
        title: SECTION_LABELS[input.sectionType],
        content: result.content.trim(),
        metadata: {
          tokensUsed: result.tokensInput + result.tokensOutput,
          model: result.model,
        },
      },
      {
        usage: {
          tokensUsed: result.tokensInput + result.tokensOutput,
          creditsUsed: 1,
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

// ===================
// CORS PREFLIGHT
// ===================

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
