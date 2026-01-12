/**
 * Ad Copy Generator - Types, Configs, and Prompt Builders
 * Generates high-converting ad copy for 6 platforms with A/B variations
 */

// ============================================================================
// Types
// ============================================================================

export type AdPlatform =
  | 'google-search'
  | 'google-display'
  | 'meta'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'pinterest';

export type AdTone =
  | 'professional'
  | 'casual'
  | 'urgent'
  | 'friendly'
  | 'bold'
  | 'trustworthy';

export interface AdField {
  name: string;
  label: string;
  value: string;
  characterCount: number;
  characterLimit: number;
  isWithinLimit: boolean;
  isMultiline?: boolean;
}

export interface GeneratedAd {
  variationNumber: number;
  fields: AdField[];
  allWithinLimits: boolean;
}

export interface AdCopyInput {
  platform: AdPlatform;
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits: string;
  tone: AdTone;
  ctaGoal: string;
  landingPageUrl?: string;
  variationCount: number;
}

export interface AdCopyOutput {
  platform: AdPlatform;
  ads: GeneratedAd[];
}

export interface PlatformFieldConfig {
  name: string;
  label: string;
  characterLimit: number;
  isMultiline?: boolean;
  isRequired?: boolean;
}

export interface PlatformConfig {
  id: AdPlatform;
  name: string;
  description: string;
  fields: PlatformFieldConfig[];
}

// ============================================================================
// Platform Configurations
// ============================================================================

export const PLATFORM_CONFIGS: Record<AdPlatform, PlatformConfig> = {
  'google-search': {
    id: 'google-search',
    name: 'Google Search',
    description: 'Text ads for Google Search results',
    fields: [
      { name: 'headline1', label: 'Headline 1', characterLimit: 30, isRequired: true },
      { name: 'headline2', label: 'Headline 2', characterLimit: 30, isRequired: true },
      { name: 'headline3', label: 'Headline 3', characterLimit: 30 },
      { name: 'description1', label: 'Description 1', characterLimit: 90, isMultiline: true, isRequired: true },
      { name: 'description2', label: 'Description 2', characterLimit: 90, isMultiline: true },
    ],
  },
  'google-display': {
    id: 'google-display',
    name: 'Google Display',
    description: 'Visual ads for Google Display Network',
    fields: [
      { name: 'shortHeadline', label: 'Short Headline', characterLimit: 25, isRequired: true },
      { name: 'longHeadline', label: 'Long Headline', characterLimit: 90, isRequired: true },
      { name: 'description', label: 'Description', characterLimit: 90, isMultiline: true, isRequired: true },
      { name: 'businessName', label: 'Business Name', characterLimit: 25, isRequired: true },
    ],
  },
  meta: {
    id: 'meta',
    name: 'Meta (Facebook/Instagram)',
    description: 'Ads for Facebook and Instagram feeds',
    fields: [
      { name: 'primaryText', label: 'Primary Text', characterLimit: 125, isMultiline: true, isRequired: true },
      { name: 'headline', label: 'Headline', characterLimit: 40, isRequired: true },
      { name: 'description', label: 'Link Description', characterLimit: 30, isRequired: true },
    ],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional ads for LinkedIn feed',
    fields: [
      { name: 'introText', label: 'Intro Text', characterLimit: 150, isMultiline: true, isRequired: true },
      { name: 'headline', label: 'Headline', characterLimit: 70, isRequired: true },
      { name: 'description', label: 'Description', characterLimit: 100, isMultiline: true },
    ],
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Promoted tweets and card ads',
    fields: [
      { name: 'tweetCopy', label: 'Tweet Copy', characterLimit: 280, isMultiline: true, isRequired: true },
      { name: 'cardHeadline', label: 'Card Headline', characterLimit: 70 },
    ],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Video ad scripts and captions',
    fields: [
      { name: 'adText', label: 'Ad Text/Caption', characterLimit: 100, isMultiline: true, isRequired: true },
      { name: 'videoHook', label: 'Video Hook (First 3s)', characterLimit: 50, isRequired: true },
      { name: 'videoBody', label: 'Video Body Script', characterLimit: 200, isMultiline: true, isRequired: true },
      { name: 'cta', label: 'Call to Action', characterLimit: 50, isRequired: true },
    ],
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    description: 'Promoted pins for Pinterest',
    fields: [
      { name: 'title', label: 'Pin Title', characterLimit: 100, isRequired: true },
      { name: 'description', label: 'Pin Description', characterLimit: 500, isMultiline: true, isRequired: true },
    ],
  },
};

// ============================================================================
// Tone Configurations
// ============================================================================

export const TONE_CONFIGS: Record<AdTone, { name: string; guidance: string }> = {
  professional: {
    name: 'Professional',
    guidance: 'Use formal language, emphasize credibility and expertise. Avoid slang.',
  },
  casual: {
    name: 'Casual',
    guidance: 'Use conversational language, contractions, and a relaxed tone.',
  },
  urgent: {
    name: 'Urgent',
    guidance: 'Create a sense of urgency with time-sensitive language, limited offers, act now messaging.',
  },
  friendly: {
    name: 'Friendly',
    guidance: 'Warm and approachable tone, like talking to a friend. Use inclusive language.',
  },
  bold: {
    name: 'Bold',
    guidance: 'Confident and assertive language. Make strong claims. Stand out from competition.',
  },
  trustworthy: {
    name: 'Trustworthy',
    guidance: 'Emphasize reliability, security, social proof. Use reassuring language.',
  },
};

// ============================================================================
// System Prompt
// ============================================================================

export const AD_COPY_SYSTEM_PROMPT = `You are an expert advertising copywriter with 15+ years of experience creating high-converting ad copy for digital platforms. You understand the nuances of each advertising platform and craft copy that:

1. Captures attention immediately
2. Communicates value clearly and concisely
3. Stays within strict character limits
4. Drives action with compelling CTAs
5. Resonates with the target audience

You always respect character limits exactly - this is critical for ad platforms. Each variation should take a different angle or approach while maintaining the core message.

Return your response as valid JSON matching the requested format.`;

// ============================================================================
// Prompt Builder
// ============================================================================

export function buildAdCopyPrompt(input: AdCopyInput): string {
  const platformConfig = PLATFORM_CONFIGS[input.platform];
  const toneConfig = TONE_CONFIGS[input.tone];

  const fieldsDescription = platformConfig.fields
    .map((f) => `- ${f.label}: max ${f.characterLimit} characters${f.isRequired ? ' (required)' : ''}`)
    .join('\n');

  return `Generate ${input.variationCount} unique ad copy variation(s) for ${platformConfig.name}.

## Product Information
- **Product Name**: ${input.productName}
- **Description**: ${input.productDescription}
- **Target Audience**: ${input.targetAudience}
- **Key Benefits**: ${input.keyBenefits}
- **CTA Goal**: ${input.ctaGoal}
${input.landingPageUrl ? `- **Landing Page**: ${input.landingPageUrl}` : ''}

## Tone
${toneConfig.name}: ${toneConfig.guidance}

## Platform: ${platformConfig.name}
${platformConfig.description}

## Required Fields (with character limits)
${fieldsDescription}

## Instructions
1. Generate exactly ${input.variationCount} unique variations
2. Each variation should take a different angle (e.g., benefit-focused, problem-solution, social proof, urgency)
3. CRITICAL: Stay within character limits for EVERY field
4. Make each field compelling and action-oriented
5. Include the product name naturally where appropriate
6. Ensure CTA aligns with the stated goal

## Response Format
Return valid JSON in this exact structure:
{
  "ads": [
    {
      "variationNumber": 1,
      "fields": [
        { "name": "fieldName", "label": "Field Label", "value": "The ad copy text", "characterLimit": 30 }
      ]
    }
  ]
}

Include all fields from the platform config for each variation. The field names should match exactly: ${platformConfig.fields.map((f) => f.name).join(', ')}`;
}

// ============================================================================
// Response Parser
// ============================================================================

export function parseAdCopyResponse(content: string, input: AdCopyInput): AdCopyOutput {
  const platformConfig = PLATFORM_CONFIGS[input.platform];

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse ad copy response: No JSON found');
  }

  let parsed: { ads: Array<{ variationNumber: number; fields: Array<{ name: string; label: string; value: string; characterLimit: number }> }> };
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Failed to parse ad copy response: Invalid JSON');
  }

  if (!parsed.ads || !Array.isArray(parsed.ads)) {
    throw new Error('Failed to parse ad copy response: Missing ads array');
  }

  const ads: GeneratedAd[] = parsed.ads.map((ad, idx) => {
    // Build fields with proper character counts and limits
    const fields: AdField[] = platformConfig.fields.map((fieldConfig) => {
      const generatedField = ad.fields.find((f) => f.name === fieldConfig.name);
      const value = generatedField?.value || '';
      const characterCount = value.length;

      return {
        name: fieldConfig.name,
        label: fieldConfig.label,
        value,
        characterCount,
        characterLimit: fieldConfig.characterLimit,
        isWithinLimit: characterCount <= fieldConfig.characterLimit,
        isMultiline: fieldConfig.isMultiline,
      };
    });

    const allWithinLimits = fields.every((f) => f.isWithinLimit);

    return {
      variationNumber: ad.variationNumber || idx + 1,
      fields,
      allWithinLimits,
    };
  });

  return {
    platform: input.platform,
    ads,
  };
}

// ============================================================================
// Export Utilities
// ============================================================================

export function exportAdsAsCSV(output: AdCopyOutput): string {
  const platformConfig = PLATFORM_CONFIGS[output.platform];
  const fieldNames = platformConfig.fields.map((f) => f.label);

  // Header row
  const headers = ['Variation', ...fieldNames, 'All Within Limits'];
  const rows = [headers.join(',')];

  // Data rows
  for (const ad of output.ads) {
    const values = [
      ad.variationNumber.toString(),
      ...platformConfig.fields.map((fieldConfig) => {
        const field = ad.fields.find((f) => f.name === fieldConfig.name);
        // Escape quotes and wrap in quotes
        const value = (field?.value || '').replace(/"/g, '""');
        return `"${value}"`;
      }),
      ad.allWithinLimits ? 'Yes' : 'No',
    ];
    rows.push(values.join(','));
  }

  return rows.join('\n');
}

export function copyAdAsText(ad: GeneratedAd): string {
  return ad.fields
    .filter((f) => f.value)
    .map((f) => `${f.label}: ${f.value}`)
    .join('\n');
}
