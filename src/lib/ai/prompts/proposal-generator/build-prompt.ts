/**
 * Proposal Prompt Builder
 */

import type { ProposalInput, SectionType } from '@/types/proposal';
import { SECTION_LABELS } from '@/types/proposal';
import { SECTION_PROMPTS } from './sections';
import { getIndustryContext } from './industry-presets';
import { getTypeGuidance, getToneGuidance } from './section-prompts';

// ===================
// SYSTEM PROMPT
// ===================

export const PROPOSAL_SYSTEM_PROMPT = `You are an expert business proposal writer with 20+ years of experience across multiple industries. You create compelling, professional proposals that win deals.

Your proposals are known for:
- Clear, persuasive writing that speaks to client needs
- Professional formatting and logical structure
- Specific, actionable content (not generic filler)
- Industry-appropriate terminology and tone
- Strong value propositions and clear next steps

You always:
- Address the specific client by name
- Reference their unique situation and challenges
- Provide concrete details, not vague promises
- Include realistic timelines and clear pricing
- End with compelling calls to action

Output Format: You MUST return valid JSON with a "sections" array containing objects with "type", "title", and "content" properties. The content should use markdown formatting for readability.`;

// ===================
// BUILD PROMPT
// ===================

export function buildProposalPrompt(input: ProposalInput): string {
  const industryContext = getIndustryContext(input.industry);
  const typeGuidance = getTypeGuidance(input.proposalType);
  const toneGuidance = getToneGuidance(input.tone);
  const sectionInstructions = buildSectionInstructions(input.selectedSections);

  const parts: string[] = [];

  // Header
  parts.push(`Create a ${input.proposalType.replace(/-/g, ' ')} proposal with the following specifications:`);

  // Industry Context
  parts.push(`\n## Industry Context\n${industryContext}`);

  // Type Guidance
  parts.push(`\n## Proposal Type Guidelines\n${typeGuidance}`);

  // Tone
  parts.push(`\n## Writing Tone\n${toneGuidance}`);

  // Client Information
  parts.push(`\n## Client Information
- Name: ${input.clientName}
- Company: ${input.clientCompany}${input.clientRole ? `\n- Role: ${input.clientRole}` : ''}`);

  // Sender Information
  parts.push(`\n## Your Company (Sender)
- Contact: ${input.senderName}
- Company: ${input.senderCompany}${input.senderRole ? `\n- Role: ${input.senderRole}` : ''}${input.senderEmail ? `\n- Email: ${input.senderEmail}` : ''}`);

  // Proposal Title
  if (input.title) {
    parts.push(`\n## Proposal Title\n${input.title}`);
  }

  // Project Details
  parts.push(`\n## Project Description\n${input.projectDescription}`);
  parts.push(`\n## Objectives\n${input.objectives}`);

  // Optional sections
  if (input.timeline) {
    parts.push(`\n## Desired Timeline\n${input.timeline}`);
  }

  if (input.budget) {
    parts.push(`\n## Budget Range\n${input.budget}`);
  }

  if (input.constraints) {
    parts.push(`\n## Constraints & Requirements\n${input.constraints}`);
  }

  if (input.competitiveAdvantage) {
    parts.push(`\n## Your Competitive Advantage\n${input.competitiveAdvantage}`);
  }

  if (input.previousWork) {
    parts.push(`\n## Relevant Previous Work\n${input.previousWork}`);
  }

  if (input.additionalNotes) {
    parts.push(`\n## Additional Notes\n${input.additionalNotes}`);
  }

  // Section Instructions
  parts.push(`\n## Required Sections\nGenerate content for the following sections in order:\n\n${sectionInstructions}`);

  // Output Format
  parts.push(`\n## Output Format
Return a JSON object with this exact structure:
\`\`\`json
{
  "sections": [
    {
      "type": "section-type-id",
      "title": "Section Title",
      "content": "Section content in markdown format..."
    }
  ]
}
\`\`\`

IMPORTANT:
- Return ONLY valid JSON, no additional text
- Use markdown formatting within each section's content (headers, bullets, bold)
- Keep each section focused and within the word limit specified
- Ensure logical flow between sections
- Use industry-appropriate terminology from the context provided
- Address ${input.clientName} and ${input.clientCompany} by name where appropriate
- Include specific, actionable details relevant to their situation`);

  return parts.join('\n');
}

// ===================
// SECTION INSTRUCTIONS
// ===================

function buildSectionInstructions(sections: SectionType[]): string {
  return sections.map((sectionType, index) => {
    const config = SECTION_PROMPTS[sectionType];
    const label = SECTION_LABELS[sectionType];

    return `### ${index + 1}. ${label} (type: "${sectionType}")
${config.guidance}
Maximum length: ~${config.maxWords} words`;
  }).join('\n\n');
}

// ===================
// SINGLE SECTION PROMPT
// ===================

export function buildSectionRegenerationPrompt(
  sectionType: SectionType,
  input: ProposalInput,
  existingSections: { type: SectionType; content: string }[],
  instructions?: string
): string {
  const config = SECTION_PROMPTS[sectionType];
  const label = SECTION_LABELS[sectionType];
  const industryContext = getIndustryContext(input.industry);
  const toneGuidance = getToneGuidance(input.tone);

  const existingContext = existingSections
    .filter(s => s.type !== sectionType)
    .slice(0, 3)
    .map(s => `${SECTION_LABELS[s.type]}: ${s.content.slice(0, 200)}...`)
    .join('\n\n');

  return `Regenerate the "${label}" section for a ${input.proposalType.replace(/-/g, ' ')} proposal.

## Context
Client: ${input.clientName} at ${input.clientCompany}
Project: ${input.projectDescription}
Objectives: ${input.objectives}

${industryContext}

${toneGuidance}

## Existing Sections (for context and consistency)
${existingContext || 'No other sections generated yet.'}

## Section Requirements
${config.guidance}
Maximum length: ~${config.maxWords} words

${instructions ? `## Special Instructions\n${instructions}` : ''}

## Output Format
Return ONLY the section content in markdown format. Do not include the section title or any JSON wrapper.`;
}
