/**
 * Proposal Export API Endpoint
 * POST /api/tools/proposal-generator/export
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticate, requireToolAccess } from '@/lib/auth/session';
import { errorResponse, APIError, parseBody } from '@/lib/api/utils';
import {
  type ProposalSection,
  type ExportFormat,
  SECTION_LABELS,
  TIER_RESTRICTIONS,
} from '@/types/proposal';

// ===================
// INPUT VALIDATION
// ===================

const exportInputSchema = z.object({
  format: z.enum(['markdown', 'pdf', 'docx'] as const),
  title: z.string().max(200),
  sections: z.array(z.object({
    id: z.string(),
    type: z.string(),
    title: z.string(),
    content: z.string(),
    isEnabled: z.boolean(),
    order: z.number(),
  })),
  options: z.object({
    includeCoverPage: z.boolean().default(true),
    includeTableOfContents: z.boolean().default(false),
    includePageNumbers: z.boolean().default(true),
  }).optional(),
  branding: z.object({
    companyName: z.string(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    tagline: z.string().optional(),
    footerText: z.string().optional(),
  }).optional(),
  clientInfo: z.object({
    clientName: z.string(),
    clientCompany: z.string(),
  }).optional(),
});

// ===================
// MAIN HANDLER
// ===================

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const user = await authenticate(req);

    // 1.5. Check tool access (if authenticated)
    if (user) {
      await requireToolAccess(user, 'proposal-generator');
    }

    // 2. Validate input
    const input = await parseBody(req, exportInputSchema);

    // 3. Check tier restrictions
    const userTier = user?.plan === 'pro' || user?.plan === 'enterprise' ? 'pro' : 'free';
    const restrictions = TIER_RESTRICTIONS[userTier];

    if (input.format === 'docx' && !restrictions.features.docxExport) {
      throw APIError.forbidden('DOCX export requires a Pro plan');
    }

    // 4. Filter enabled sections and sort by order
    const enabledSections = input.sections
      .filter(s => s.isEnabled)
      .sort((a, b) => a.order - b.order);

    // 5. Generate export based on format
    switch (input.format) {
      case 'markdown':
        return generateMarkdownExport(input.title, enabledSections, input.branding, userTier === 'free');

      case 'pdf':
        return generatePDFExport(
          input.title,
          enabledSections,
          input.options || {},
          input.branding,
          input.clientInfo,
          userTier === 'free'
        );

      case 'docx':
        return generateDOCXExport(
          input.title,
          enabledSections,
          input.options || {},
          input.branding,
          input.clientInfo
        );

      default:
        throw APIError.badRequest(`Unsupported export format: ${input.format}`);
    }
  } catch (error) {
    return errorResponse(error);
  }
}

// ===================
// MARKDOWN EXPORT
// ===================

function generateMarkdownExport(
  title: string,
  sections: Array<{ type: string; title: string; content: string }>,
  branding?: { companyName: string; tagline?: string },
  addWatermark = false
): Response {
  const lines: string[] = [];

  // Title
  lines.push(`# ${title}`);
  lines.push('');

  if (branding) {
    lines.push(`**Prepared by ${branding.companyName}**`);
    if (branding.tagline) {
      lines.push(`*${branding.tagline}*`);
    }
    lines.push('');
  }

  lines.push(`*Generated on ${new Date().toLocaleDateString()}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  sections.forEach((section, index) => {
    lines.push(`${index + 1}. [${section.title}](#${section.type})`);
  });
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sections
  sections.forEach((section) => {
    lines.push(`## ${section.title} {#${section.type}}`);
    lines.push('');
    lines.push(section.content);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  // Watermark for free tier
  if (addWatermark) {
    lines.push('');
    lines.push('---');
    lines.push('*Generated with AI SaaS Tools - Free Tier*');
    lines.push('*Upgrade to Pro for watermark-free exports*');
  }

  const markdown = lines.join('\n');

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${sanitizeFilename(title)}.md"`,
    },
  });
}

// ===================
// PDF EXPORT (Placeholder - uses react-pdf on client)
// ===================

async function generatePDFExport(
  title: string,
  sections: Array<{ type: string; title: string; content: string }>,
  options: { includeCoverPage?: boolean; includeTableOfContents?: boolean; includePageNumbers?: boolean },
  branding?: { companyName: string; primaryColor?: string; tagline?: string; footerText?: string },
  clientInfo?: { clientName: string; clientCompany: string },
  addWatermark = false
): Promise<Response> {
  // For server-side PDF generation, we'd use puppeteer or similar
  // For now, return data that the client can use with react-pdf

  const pdfData = {
    title,
    sections: sections.map(s => ({
      type: s.type,
      title: s.title,
      content: s.content,
    })),
    options: {
      includeCoverPage: options.includeCoverPage ?? true,
      includeTableOfContents: options.includeTableOfContents ?? false,
      includePageNumbers: options.includePageNumbers ?? true,
      addWatermark,
    },
    branding: branding || {
      companyName: 'AI SaaS Tools',
      primaryColor: '#0ea5e9',
    },
    clientInfo,
    generatedAt: new Date().toISOString(),
  };

  // Return JSON that client will use to render PDF
  return new Response(JSON.stringify(pdfData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// ===================
// DOCX EXPORT (Placeholder)
// ===================

async function generateDOCXExport(
  title: string,
  sections: Array<{ type: string; title: string; content: string }>,
  options: { includeCoverPage?: boolean; includeTableOfContents?: boolean; includePageNumbers?: boolean },
  branding?: { companyName: string; primaryColor?: string; tagline?: string; footerText?: string },
  clientInfo?: { clientName: string; clientCompany: string }
): Promise<Response> {
  // DOCX generation requires the 'docx' package
  // For now, return markdown as a fallback with instructions

  const markdown = [
    `# ${title}`,
    '',
    branding ? `**Prepared by ${branding.companyName}**` : '',
    '',
    clientInfo ? `**Prepared for ${clientInfo.clientName}, ${clientInfo.clientCompany}**` : '',
    '',
    `*Generated on ${new Date().toLocaleDateString()}*`,
    '',
    '---',
    '',
    ...sections.flatMap(s => [
      `## ${s.title}`,
      '',
      s.content,
      '',
      '---',
      '',
    ]),
  ].join('\n');

  // Return as text with docx mime type suggestion
  // Full DOCX generation would use the 'docx' npm package
  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${sanitizeFilename(title)}.txt"`,
      'X-Note': 'Install docx package for full DOCX support',
    },
  });
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
// HELPERS
// ===================

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 50);
}
