/**
 * Blog Post Writer Prompt Builders
 * Functions to construct prompts for blog post generation
 */

import type {
  PostFormat,
  BlogTone,
  BlogOutlineRequest,
  BlogFullPostRequest,
  GeneratedOutline,
} from './types';

// Format-specific guidance
const FORMAT_GUIDANCE: Record<PostFormat, string> = {
  listicle: `Structure as a numbered list with clear, scannable items.
- Start with an engaging intro (2-3 sentences)
- Each list item should have a clear heading
- Include brief explanations under each item
- End with a summary or call-to-action
- Use odd numbers (7, 9, 11) when possible - they perform better`,

  'how-to': `Structure as a step-by-step guide.
- Start with why this matters to the reader
- Number each step clearly
- Include tips or warnings where relevant
- Add a "What You'll Need" or "Prerequisites" section if applicable
- End with expected outcomes`,

  'thought-leadership': `Structure as an opinion/insight piece.
- Open with a bold statement or insight
- Support claims with data or examples
- Share unique perspectives from experience
- Challenge conventional thinking
- End with actionable takeaways or predictions`,

  tutorial: `Structure as an educational deep-dive.
- Start with learning objectives
- Break complex topics into digestible sections
- Include code examples, diagrams descriptions, or practical exercises
- Add "Pro Tips" or "Common Mistakes" callouts
- End with next steps for continued learning`,

  review: `Structure as a balanced analysis.
- Start with a brief overview of what's being reviewed
- Cover key features/aspects systematically
- Include pros and cons sections
- Provide specific use case recommendations
- End with a clear verdict/recommendation`,

  'case-study': `Structure as a narrative with results.
- Start with the challenge/problem faced
- Describe the approach/solution implemented
- Include specific metrics and outcomes
- Add quotes or testimonials if relevant
- End with key learnings and applicability`,
};

// Tone-specific guidance
const TONE_GUIDANCE: Record<BlogTone, string> = {
  professional:
    'Use clear, polished language. Avoid jargon unless necessary. Balance authority with accessibility.',
  conversational:
    'Write as if talking to a knowledgeable friend. Use contractions, questions, and personal anecdotes.',
  expert:
    'Demonstrate deep knowledge. Use industry terminology appropriately. Back claims with data and research.',
  friendly:
    'Be warm and approachable. Use inclusive language ("we", "let\'s"). Encourage and motivate the reader.',
  persuasive:
    'Focus on benefits. Use social proof and urgency where appropriate. Guide toward action.',
  educational:
    'Prioritize clarity over style. Define terms. Use analogies and examples to explain concepts.',
};

export function buildOutlinePrompt(input: BlogOutlineRequest): string {
  const { format, tone, topic, targetAudience, targetKeywords, wordCount, additionalInstructions } =
    input;

  const keywordsSection = targetKeywords
    ? `\n## Target Keywords\nIncorporate these keywords naturally: ${targetKeywords}`
    : '';

  const audienceSection = targetAudience
    ? `\n## Target Audience\n${targetAudience}`
    : '';

  const instructionsSection = additionalInstructions
    ? `\n## Additional Instructions\n${additionalInstructions}`
    : '';

  return `Generate a detailed blog post outline with the following specifications:

## Topic
${topic}

## Post Format
${format.replace('-', ' ')}
${FORMAT_GUIDANCE[format]}

## Tone
${TONE_GUIDANCE[tone]}
${audienceSection}${keywordsSection}

## Target Length
Approximately ${wordCount} words total

${instructionsSection}

## Output Requirements
Generate a JSON response with:
1. suggestedTitle: A compelling, SEO-friendly title
2. alternativeTitles: Array of 2-3 alternative titles
3. metaDescription: SEO meta description (150-160 characters)
4. sections: Array of outline sections, each with:
   - id: Unique identifier (use numbers as strings: "1", "2", etc.)
   - title: Section heading
   - keyPoints: Array of 2-4 bullet points for this section
   - estimatedWords: Approximate word count for this section
5. estimatedTotalWords: Sum of all section word counts

Ensure sections are well-balanced and sum to approximately ${wordCount} words.

Return ONLY valid JSON, no additional text or markdown formatting:
{
  "suggestedTitle": "...",
  "alternativeTitles": ["...", "..."],
  "metaDescription": "...",
  "sections": [
    {
      "id": "1",
      "title": "...",
      "keyPoints": ["...", "..."],
      "estimatedWords": 100
    }
  ],
  "estimatedTotalWords": ${wordCount}
}`;
}

export function buildFullPostPrompt(input: BlogFullPostRequest): string {
  const {
    format,
    tone,
    topic,
    targetAudience,
    targetKeywords,
    wordCount,
    additionalInstructions,
    outline,
  } = input;

  const sectionsText = outline.sections
    .map(
      (s, i) =>
        `${i + 1}. ${s.title} (~${s.estimatedWords} words)\n   Key points: ${s.keyPoints.join(', ')}`
    )
    .join('\n');

  const keywordsSection = targetKeywords
    ? `\n## SEO Keywords\nNaturally incorporate: ${targetKeywords}`
    : '';

  const audienceSection = targetAudience ? `\n## Target Audience\n${targetAudience}` : '';

  const instructionsSection = additionalInstructions
    ? `\n## Additional Instructions\n${additionalInstructions}`
    : '';

  return `Write a complete blog post based on this approved outline:

## Title
${outline.suggestedTitle}

## Topic
${topic}

## Approved Outline
${sectionsText}

## Post Format
${format.replace('-', ' ')}
${FORMAT_GUIDANCE[format]}

## Tone
${TONE_GUIDANCE[tone]}
${audienceSection}${keywordsSection}

## Target Length
Approximately ${wordCount} words total

${instructionsSection}

## Output Requirements
1. Write the complete blog post in Markdown format
2. Use ## for main section headings (matching the outline)
3. Use ### for subheadings where needed
4. Include all key points from the outline
5. Add smooth transitions between sections
6. Write an engaging introduction and strong conclusion
7. Target ${wordCount} words total

Also provide:
- suggestedTitleTags: 3-5 SEO title tag variations

Return JSON with:
{
  "title": "${outline.suggestedTitle}",
  "metaDescription": "${outline.metaDescription}",
  "suggestedTitleTags": ["...", "...", "..."],
  "content": "# Title\\n\\n[Full markdown content here]",
  "wordCount": [actual word count]
}

Return ONLY valid JSON, no additional text.`;
}

export const BLOG_SYSTEM_PROMPT = `You are an expert content writer and SEO specialist who creates engaging, high-quality blog posts.

You excel at:
- Crafting compelling headlines that drive clicks
- Writing scannable, well-structured content
- Balancing SEO optimization with readability
- Adapting tone and style to different audiences
- Creating content that provides genuine value

Your blog posts are:
- Well-researched and accurate
- Easy to read with clear formatting
- Optimized for both readers and search engines
- Actionable with practical takeaways
- Appropriately formatted for the web (short paragraphs, subheadings, lists)

Always prioritize the reader's experience while meeting SEO requirements.`;
