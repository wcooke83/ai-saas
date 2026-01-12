/**
 * Meeting Notes Summarizer Prompt Templates
 * Structured meeting summaries with customizable sections
 */

// Meeting Types
export type MeetingType =
  | 'team-standup'
  | 'one-on-one'
  | 'client-call'
  | 'project-review'
  | 'brainstorming'
  | 'all-hands'
  | 'general';

export const MEETING_TYPES: { value: MeetingType; label: string }[] = [
  { value: 'general', label: 'General Meeting' },
  { value: 'team-standup', label: 'Team Standup' },
  { value: 'one-on-one', label: '1:1 Meeting' },
  { value: 'client-call', label: 'Client Call' },
  { value: 'project-review', label: 'Project Review' },
  { value: 'brainstorming', label: 'Brainstorming Session' },
  { value: 'all-hands', label: 'All-Hands / Town Hall' },
];

// Output Sections
export type SummarySection =
  | 'executive-summary'
  | 'key-discussions'
  | 'action-items'
  | 'decisions'
  | 'follow-ups'
  | 'attendees'
  | 'next-steps'
  | 'open-questions';

export const SECTION_CONFIG: Record<
  SummarySection,
  { label: string; description: string; required?: boolean }
> = {
  'executive-summary': {
    label: 'Executive Summary',
    description: 'High-level overview of the meeting',
    required: true,
  },
  'key-discussions': {
    label: 'Key Discussion Points',
    description: 'Main topics covered',
  },
  'action-items': {
    label: 'Action Items',
    description: 'Tasks with owners and deadlines',
  },
  decisions: {
    label: 'Key Decisions Made',
    description: 'Decisions and their rationale',
  },
  'follow-ups': {
    label: 'Follow-up Items',
    description: 'Items needing follow-up',
  },
  attendees: {
    label: 'Attendees',
    description: 'Participants extracted from transcript',
  },
  'next-steps': {
    label: 'Next Steps',
    description: 'Immediate next actions',
  },
  'open-questions': {
    label: 'Open Questions / Parking Lot',
    description: 'Unresolved items for future discussion',
  },
};

export const ALL_SECTIONS: SummarySection[] = [
  'executive-summary',
  'key-discussions',
  'action-items',
  'decisions',
  'follow-ups',
  'attendees',
  'next-steps',
  'open-questions',
];

// Default sections per meeting type
export const MEETING_TYPE_DEFAULTS: Record<MeetingType, SummarySection[]> = {
  'team-standup': ['executive-summary', 'action-items', 'key-discussions'],
  'one-on-one': ['executive-summary', 'key-discussions', 'action-items', 'follow-ups'],
  'client-call': ['executive-summary', 'action-items', 'decisions', 'next-steps'],
  'project-review': [
    'executive-summary',
    'key-discussions',
    'decisions',
    'action-items',
    'next-steps',
  ],
  brainstorming: ['executive-summary', 'key-discussions', 'open-questions'],
  'all-hands': ['executive-summary', 'key-discussions', 'decisions', 'next-steps'],
  general: ['executive-summary', 'key-discussions', 'action-items', 'next-steps'],
};

// Input interface
export interface MeetingNotesInput {
  transcript: string;
  meetingType: MeetingType;
  sections: SummarySection[];
  meetingTitle?: string;
  meetingDate?: string;
  additionalContext?: string;
}

// Output interfaces
export interface ActionItem {
  task: string;
  owner?: string;
  deadline?: string;
}

export interface Attendee {
  name: string;
  role?: string;
}

export interface SummaryOutputSection {
  type: SummarySection;
  title: string;
  content: string;
  items?: ActionItem[] | Attendee[];
}

export interface MeetingSummary {
  title: string;
  date: string;
  meetingType: MeetingType;
  sections: SummaryOutputSection[];
}

// Section-specific guidance for the prompt
const SECTION_GUIDANCE: Record<SummarySection, string> = {
  'executive-summary': `Provide a concise 2-3 sentence overview of the meeting's purpose and key outcomes.`,
  'key-discussions': `List the main topics discussed with brief context. Use bullet points.`,
  'action-items': `Extract all action items mentioned. For each, identify:
- The task to be completed
- The owner/assignee (if mentioned)
- The deadline (if mentioned)
Format as a structured list.`,
  decisions: `List any decisions made during the meeting with brief rationale if provided.`,
  'follow-ups': `Identify items that require follow-up but aren't immediate action items.`,
  attendees: `Extract participant names from the transcript (look for speaker labels, introductions, or mentions).`,
  'next-steps': `List the immediate next steps agreed upon.`,
  'open-questions': `Identify questions that were raised but not resolved, or items parked for future discussion.`,
};

// Meeting type context for the prompt
const MEETING_TYPE_CONTEXT: Record<MeetingType, string> = {
  'team-standup': `This is a team standup meeting. Focus on: what was done, what's planned, and any blockers.`,
  'one-on-one': `This is a 1:1 meeting. Focus on: personal updates, feedback, career discussions, and action items.`,
  'client-call': `This is a client call. Focus on: client requirements, commitments made, and follow-up items.`,
  'project-review': `This is a project review meeting. Focus on: progress updates, risks, decisions, and next milestones.`,
  brainstorming: `This is a brainstorming session. Focus on: ideas generated, themes identified, and items to explore further.`,
  'all-hands': `This is an all-hands/town hall meeting. Focus on: company updates, announcements, and Q&A highlights.`,
  general: `This is a general meeting. Provide a balanced summary of discussions and outcomes.`,
};

export function buildMeetingNotesPrompt(input: MeetingNotesInput): string {
  const { transcript, meetingType, sections, meetingTitle, meetingDate, additionalContext } = input;

  const meetingInfo = [
    meetingTitle && `- Title: ${meetingTitle}`,
    meetingDate && `- Date: ${meetingDate}`,
    `- Type: ${MEETING_TYPES.find((t) => t.value === meetingType)?.label || meetingType}`,
  ]
    .filter(Boolean)
    .join('\n');

  const sectionInstructions = sections
    .map((s) => {
      const config = SECTION_CONFIG[s];
      return `### ${config.label}\n${SECTION_GUIDANCE[s]}`;
    })
    .join('\n\n');

  return `Analyze this meeting transcript and generate a structured summary.

## Meeting Information
${meetingInfo}

## Context
${MEETING_TYPE_CONTEXT[meetingType]}

${additionalContext ? `## Additional Context\n${additionalContext}\n` : ''}
## Transcript
${transcript}

## Required Sections
Generate the following sections:

${sectionInstructions}

## Output Format
Return a JSON object with this structure:
{
  "sections": [
    {
      "type": "section-type-id",
      "title": "Section Title",
      "content": "Formatted content with bullet points where appropriate...",
      "items": []  // Only for action-items and attendees sections
    }
  ]
}

For action-items section, include structured items:
{
  "type": "action-items",
  "title": "Action Items",
  "content": "Summary of action items...",
  "items": [
    { "task": "Task description", "owner": "Person name or null", "deadline": "Date or null" }
  ]
}

For attendees section, include structured items:
{
  "type": "attendees",
  "title": "Attendees",
  "content": "List of participants...",
  "items": [
    { "name": "Person name", "role": "Role if mentioned or null" }
  ]
}

Return ONLY valid JSON, no additional text or markdown formatting.`;
}

export const MEETING_NOTES_SYSTEM_PROMPT = `You are an expert meeting analyst who creates clear, actionable meeting summaries.

Your summaries are:
- Concise yet comprehensive
- Action-oriented with clear owners and deadlines
- Well-organized by topic
- Written in professional language

You excel at:
- Extracting action items with owners and deadlines when mentioned
- Identifying key decisions and their rationale
- Distinguishing between decisions, action items, and open questions
- Recognizing speaker names from transcript patterns (e.g., "John:", "[John]", "Speaker 1: I'm John")

Always:
- Use bullet points for lists
- Format action items clearly with owner and deadline when mentioned
- Keep the executive summary brief (2-3 sentences)
- Identify implicit action items (e.g., "I'll send that over" = action item)`;

/**
 * Parse the AI response into a structured MeetingSummary
 */
export function parseMeetingNotesResponse(
  content: string,
  input: MeetingNotesInput
): MeetingSummary {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response structure');
    }

    // Validate and clean sections
    const sections: SummaryOutputSection[] = parsed.sections
      .filter((s: Record<string, unknown>) => s.type && s.title && s.content)
      .map((s: Record<string, unknown>) => ({
        type: s.type as SummarySection,
        title: String(s.title),
        content: String(s.content),
        items: Array.isArray(s.items) ? s.items : undefined,
      }));

    return {
      title: input.meetingTitle || 'Meeting Summary',
      date: input.meetingDate || new Date().toISOString().split('T')[0],
      meetingType: input.meetingType,
      sections,
    };
  } catch {
    // Fallback: create basic summary from raw content
    return {
      title: input.meetingTitle || 'Meeting Summary',
      date: input.meetingDate || new Date().toISOString().split('T')[0],
      meetingType: input.meetingType,
      sections: [
        {
          type: 'executive-summary',
          title: 'Executive Summary',
          content: content.slice(0, 500) + (content.length > 500 ? '...' : ''),
        },
      ],
    };
  }
}

/**
 * Export summary as Markdown
 */
export function exportAsMarkdown(summary: MeetingSummary): string {
  const lines: string[] = [
    `# ${summary.title}`,
    '',
    `**Date:** ${summary.date}`,
    `**Type:** ${MEETING_TYPES.find((t) => t.value === summary.meetingType)?.label || summary.meetingType}`,
    '',
  ];

  for (const section of summary.sections) {
    lines.push(`## ${section.title}`);
    lines.push('');
    lines.push(section.content);
    lines.push('');

    // Add structured items for action items
    if (section.type === 'action-items' && section.items) {
      lines.push('');
      for (const item of section.items as ActionItem[]) {
        const owner = item.owner ? ` - **Owner:** ${item.owner}` : '';
        const deadline = item.deadline ? ` - **Due:** ${item.deadline}` : '';
        lines.push(`- [ ] ${item.task}${owner}${deadline}`);
      }
      lines.push('');
    }

    // Add structured items for attendees
    if (section.type === 'attendees' && section.items) {
      lines.push('');
      for (const item of section.items as Attendee[]) {
        const role = item.role ? ` (${item.role})` : '';
        lines.push(`- ${item.name}${role}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Export summary as plain text
 */
export function exportAsText(summary: MeetingSummary): string {
  const lines: string[] = [
    'MEETING SUMMARY',
    '=' .repeat(50),
    '',
    `Title: ${summary.title}`,
    `Date: ${summary.date}`,
    `Type: ${MEETING_TYPES.find((t) => t.value === summary.meetingType)?.label || summary.meetingType}`,
    '',
  ];

  for (const section of summary.sections) {
    lines.push(section.title.toUpperCase());
    lines.push('-'.repeat(section.title.length));
    lines.push(section.content);
    lines.push('');

    // Add structured items for action items
    if (section.type === 'action-items' && section.items) {
      for (const item of section.items as ActionItem[]) {
        const owner = item.owner ? ` (Owner: ${item.owner})` : '';
        const deadline = item.deadline ? ` (Due: ${item.deadline})` : '';
        lines.push(`[ ] ${item.task}${owner}${deadline}`);
      }
      lines.push('');
    }

    // Add structured items for attendees
    if (section.type === 'attendees' && section.items) {
      for (const item of section.items as Attendee[]) {
        const role = item.role ? ` - ${item.role}` : '';
        lines.push(`* ${item.name}${role}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}
