/**
 * Proposal Generator API Endpoint
 * POST /api/tools/proposal-generator
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generate } from '@/lib/ai/provider';
import {
  buildProposalPrompt,
  PROPOSAL_SYSTEM_PROMPT,
  DEFAULT_SECTIONS_BY_TYPE,
} from '@/lib/ai/prompts/proposal-generator';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { rateLimit, getRateLimitForTier, type RateLimitTier } from '@/lib/api/rate-limit';
import { checkUsageLimit, incrementTokenUsage, logGeneration } from '@/lib/usage/tracker';
import { logAPICall } from '@/lib/api/logging';
import { successResponse, errorResponse, APIError, parseBody, getClientIP } from '@/lib/api/utils';
import {
  type ProposalType,
  type Industry,
  type SectionType,
  type ProposalTone,
  type ProposalSection,
  SECTION_LABELS,
  TIER_RESTRICTIONS,
  FREE_PROPOSAL_TYPES,
  FREE_INDUSTRIES,
} from '@/types/proposal';

// ===================
// INPUT VALIDATION
// ===================

const proposalInputSchema = z.object({
  // Basic Info
  proposalType: z.enum([
    'sales', 'rfp-response', 'partnership', 'pricing', 'project',
    'service-quote', 'capability-statement', 'sow', 'grant', 'consulting',
  ] as const),
  industry: z.enum([
    'tech-saas', 'marketing-agency', 'finance', 'healthcare',
    'legal', 'construction', 'education', 'nonprofit',
  ] as const),
  title: z.string().max(200).optional(),

  // Client Info
  clientName: z.string().min(1).max(100),
  clientCompany: z.string().min(1).max(100),
  clientRole: z.string().max(100).optional(),

  // Sender Info
  senderName: z.string().min(1).max(100),
  senderCompany: z.string().min(1).max(100),
  senderRole: z.string().max(100).optional(),
  senderEmail: z.string().email().optional(),

  // Project Details
  projectDescription: z.string().min(20).max(2000),
  objectives: z.string().min(10).max(1000),
  timeline: z.string().max(500).optional(),
  budget: z.string().max(500).optional(),
  constraints: z.string().max(1000).optional(),

  // Additional Context
  competitiveAdvantage: z.string().max(1000).optional(),
  previousWork: z.string().max(1000).optional(),
  additionalNotes: z.string().max(1000).optional(),

  // Configuration
  tone: z.enum(['formal', 'professional', 'friendly'] as const).default('professional'),
  selectedSections: z.array(z.string()).optional(),
});

// ===================
// MAIN HANDLER
// ===================

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate (session or API key)
    const user = await authenticate(req);

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'proposal-generator');
    }

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
      await checkUsageLimit(user.id, 2); // Proposals cost 2 credits
    }

    // 4. Validate input
    const input = await parseBody(req, proposalInputSchema);

    // 5. Check tier restrictions
    const userTier = user?.plan === 'pro' || user?.plan === 'enterprise' ? 'pro' : 'free';
    const restrictions = TIER_RESTRICTIONS[userTier];

    // Check proposal type access
    if (restrictions.allowedTypes !== 'all' &&
        !restrictions.allowedTypes.includes(input.proposalType as ProposalType)) {
      throw APIError.forbidden(
        `${input.proposalType} proposals require a Pro plan. ` +
        `Free tier supports: ${FREE_PROPOSAL_TYPES.join(', ')}`
      );
    }

    // Check industry access
    if (restrictions.allowedIndustries !== 'all' &&
        !restrictions.allowedIndustries.includes(input.industry as Industry)) {
      throw APIError.forbidden(
        `${input.industry} industry requires a Pro plan. ` +
        `Free tier supports: ${FREE_INDUSTRIES.join(', ')}`
      );
    }

    // 6. Determine sections
    let selectedSections: SectionType[] = input.selectedSections as SectionType[] ||
      DEFAULT_SECTIONS_BY_TYPE[input.proposalType as ProposalType];

    // Enforce section limit for free tier
    if (selectedSections.length > restrictions.maxSections) {
      selectedSections = selectedSections.slice(0, restrictions.maxSections);
    }

    // 7. Build prompt
    const promptInput = {
      ...input,
      tone: input.tone as ProposalTone,
      proposalType: input.proposalType as ProposalType,
      industry: input.industry as Industry,
      selectedSections,
    };

    const prompt = buildProposalPrompt(promptInput);

    // 8. Generate proposal
    const result = await generate(prompt, {
      model: 'powerful', // Use powerful model for proposals
      systemPrompt: PROPOSAL_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 8192,
    });

    // 9. Parse response
    const sections = parseProposalResponse(result.content, selectedSections);

    // 10. Track usage with provider-specific token multiplier
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
        toolId: 'proposal-generator',
        type: 'proposal',
        prompt: prompt,
        output: result.content,
        model: result.model,
        tokensInput: result.tokensInput,
        tokensOutput: result.tokensOutput,
        durationMs: result.durationMs,
        status: 'completed',
        metadata: {
          proposalType: input.proposalType,
          industry: input.industry,
          sectionCount: sections.length,
        },
      });
    }

    // 11. Log the API call
    await logAPICall({
      user_id: user?.id,
      endpoint: '/api/tools/proposal-generator',
      method: 'POST',
      request_body: { ...input, selectedSections } as Record<string, unknown>,
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

    // 12. Return response
    return successResponse(
      {
        sections,
        metadata: {
          generatedAt: new Date().toISOString(),
          tokensUsed: result.tokensInput + result.tokensOutput,
          model: result.model,
          sectionCount: sections.length,
        },
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

// ===================
// RESPONSE PARSER
// ===================

function parseProposalResponse(
  content: string,
  expectedSections: SectionType[]
): ProposalSection[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*"sections"[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      sections: Array<{
        type: string;
        title: string;
        content: string;
      }>;
    };

    if (!Array.isArray(parsed.sections)) {
      throw new Error('Invalid sections array');
    }

    return parsed.sections.map((section, index) => ({
      id: `section-${section.type}-${Date.now()}-${index}`,
      type: section.type as SectionType,
      title: section.title || SECTION_LABELS[section.type as SectionType] || section.type,
      content: section.content,
      isEnabled: true,
      isEdited: false,
      order: index,
      isRequired: section.type === 'executive-summary' || section.type === 'proposed-solution',
    }));
  } catch {
    // Fallback: create sections from plain text
    console.warn('Failed to parse JSON response, using fallback parser');
    return fallbackParser(content, expectedSections);
  }
}

function fallbackParser(content: string, expectedSections: SectionType[]): ProposalSection[] {
  const sections: ProposalSection[] = [];

  // Try to split by section headers
  const lines = content.split('\n');
  let currentSection: { type: SectionType; title: string; content: string[] } | null = null;

  for (const line of lines) {
    // Check for section headers (##, ###, or **Bold**)
    const headerMatch = line.match(/^#{1,3}\s+(.+)$/) || line.match(/^\*\*(.+)\*\*$/);

    if (headerMatch) {
      // Save previous section
      if (currentSection) {
        sections.push({
          id: `section-${currentSection.type}-${Date.now()}-${sections.length}`,
          type: currentSection.type,
          title: currentSection.title,
          content: currentSection.content.join('\n').trim(),
          isEnabled: true,
          isEdited: false,
          order: sections.length,
          isRequired: currentSection.type === 'executive-summary',
        });
      }

      // Find matching section type
      const headerText = headerMatch[1].toLowerCase();
      const matchedType = expectedSections.find(s =>
        headerText.includes(s.replace(/-/g, ' ')) ||
        SECTION_LABELS[s].toLowerCase().includes(headerText)
      ) || expectedSections[sections.length] || 'executive-summary';

      currentSection = {
        type: matchedType,
        title: headerMatch[1],
        content: [],
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections.push({
      id: `section-${currentSection.type}-${Date.now()}-${sections.length}`,
      type: currentSection.type,
      title: currentSection.title,
      content: currentSection.content.join('\n').trim(),
      isEnabled: true,
      isEdited: false,
      order: sections.length,
      isRequired: currentSection.type === 'executive-summary',
    });
  }

  return sections;
}
