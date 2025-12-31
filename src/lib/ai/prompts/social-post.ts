/**
 * AI Social Post Generator - Types and Prompts
 * Generates platform-optimized social media posts
 */

// Platform types
export type Platform = 'linkedin' | 'twitter' | 'instagram' | 'tiktok';
export type PostTone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';
export type PostType = 'announcement' | 'thought-leadership' | 'promotion' | 'engagement' | 'story' | 'tips';
export type VariationCount = 1 | 2 | 3 | 4 | 5;

// Input for generating social posts
export interface SocialPostInput {
  topic: string;
  contentToRepurpose?: string;
  keyPoints?: string;
  platforms: Platform[];
  variationCount: VariationCount;
  postType: PostType;
  tone: PostTone;
  includeHashtags: boolean;
  includeEmojis: boolean;
  callToAction?: string;
  targetAudience?: string;
}

// Single generated post
export interface GeneratedPost {
  platform: Platform;
  variationNumber: number;
  content: string;
  characterCount: number;
  characterLimit: number;
  isWithinLimit: boolean;
  hashtags: string[];
}

// Complete generation result
export interface SocialPostResult {
  posts: GeneratedPost[];
  totalPosts: number;
  platforms: Platform[];
  generatedAt: string;
}

// Platform configurations
export const PLATFORM_CONFIG: Record<
  Platform,
  {
    label: string;
    limit: number;
    optimal: number;
    maxHashtags: number;
    style: string;
    icon: string;
  }
> = {
  twitter: {
    label: 'Twitter/X',
    limit: 280,
    optimal: 200,
    maxHashtags: 3,
    style: 'Concise, punchy, conversational. Strong hook in first line. Use line breaks for emphasis.',
    icon: 'twitter',
  },
  linkedin: {
    label: 'LinkedIn',
    limit: 3000,
    optimal: 200,
    maxHashtags: 5,
    style: 'Professional but personable. Story-driven. Use line breaks liberally. Hook readers in first 2 lines (before "see more").',
    icon: 'linkedin',
  },
  instagram: {
    label: 'Instagram',
    limit: 2200,
    optimal: 150,
    maxHashtags: 30,
    style: 'Visual-first caption. Emoji-friendly. Engaging question or CTA. Hashtags at end or in first comment.',
    icon: 'instagram',
  },
  tiktok: {
    label: 'TikTok',
    limit: 2200,
    optimal: 150,
    maxHashtags: 5,
    style: 'Casual, trendy, Gen-Z friendly. Hook in first line. Use trending phrases. Keep it real and relatable.',
    icon: 'music',
  },
};

// Post type configurations
export const POST_TYPE_CONFIG: Record<
  PostType,
  {
    label: string;
    description: string;
    guidance: string;
  }
> = {
  announcement: {
    label: 'Announcement',
    description: 'Share news, updates, or launches',
    guidance: 'Lead with the news. Create excitement. Include key details. End with CTA.',
  },
  'thought-leadership': {
    label: 'Thought Leadership',
    description: 'Share insights, opinions, or expertise',
    guidance: 'Start with a bold statement or counterintuitive insight. Back it up with experience. Invite discussion.',
  },
  promotion: {
    label: 'Promotion',
    description: 'Promote products, services, or offers',
    guidance: 'Focus on benefits, not features. Create urgency. Clear CTA. Don\'t be too salesy.',
  },
  engagement: {
    label: 'Engagement',
    description: 'Drive comments, shares, and interaction',
    guidance: 'Ask questions. Create polls. Be controversial (safely). Invite opinions.',
  },
  story: {
    label: 'Story',
    description: 'Share personal stories or case studies',
    guidance: 'Start in the middle of action. Build tension. Share the lesson. Make it relatable.',
  },
  tips: {
    label: 'Tips & How-To',
    description: 'Share actionable advice or tutorials',
    guidance: 'Lead with the benefit. Number your tips. Keep each tip actionable. Save the best for last.',
  },
};

// Tone configurations
export const TONE_CONFIG: Record<
  PostTone,
  {
    label: string;
    guidance: string;
  }
> = {
  professional: {
    label: 'Professional',
    guidance: 'Polished and credible. Industry-appropriate language. Data-driven when possible.',
  },
  casual: {
    label: 'Casual',
    guidance: 'Relaxed and conversational. Like talking to a friend. Contractions welcome.',
  },
  humorous: {
    label: 'Humorous',
    guidance: 'Witty and playful. Use wordplay. Self-deprecating humor works. Don\'t force it.',
  },
  inspirational: {
    label: 'Inspirational',
    guidance: 'Uplifting and motivational. Share transformation. Paint a vision. End on hope.',
  },
  educational: {
    label: 'Educational',
    guidance: 'Clear and informative. Break down complex topics. Use examples. Teach something valuable.',
  },
};

// Build the prompt for social post generation
export function buildSocialPostPrompt(input: SocialPostInput): string {
  const platformInstructions = input.platforms
    .map((p) => {
      const config = PLATFORM_CONFIG[p];
      return `
### ${config.label}
- **Character limit**: ${config.limit} (optimal: ${config.optimal})
- **Max hashtags**: ${config.maxHashtags}
- **Style**: ${config.style}`;
    })
    .join('\n');

  const postTypeConfig = POST_TYPE_CONFIG[input.postType];
  const toneConfig = TONE_CONFIG[input.tone];

  return `
Generate ${input.variationCount} unique social media post variation(s) for EACH of the following platforms: ${input.platforms.map((p) => PLATFORM_CONFIG[p].label).join(', ')}.

## Content Details
- **Topic**: ${input.topic}
- **Post Type**: ${postTypeConfig.label} - ${postTypeConfig.guidance}
- **Tone**: ${toneConfig.label} - ${toneConfig.guidance}
${input.keyPoints ? `- **Key Points to Include**: ${input.keyPoints}` : ''}
${input.targetAudience ? `- **Target Audience**: ${input.targetAudience}` : ''}
${input.callToAction ? `- **Call to Action**: ${input.callToAction}` : ''}

${
  input.contentToRepurpose
    ? `## Content to Repurpose
Transform this content into platform-optimized posts:
---
${input.contentToRepurpose}
---`
    : ''
}

## Platform Requirements
${platformInstructions}

## Variation Guidelines
Each variation MUST use a DIFFERENT approach:
1. **Hook styles**: Question, bold statement, statistic, story opening, controversial take
2. **Angles**: Problem-focused, benefit-focused, curiosity-driven, social proof, urgency
3. **CTA styles**: Soft ask, direct request, curiosity builder, value exchange

## Content Rules
- ${input.includeEmojis ? 'Include relevant emojis naturally throughout the post' : 'Do NOT include any emojis'}
- ${input.includeHashtags ? 'Generate relevant hashtags (respect platform limits)' : 'Do NOT include any hashtags'}
- Keep posts within optimal character counts when possible
- Each variation should feel genuinely different, not just reworded

## Output Format
Return a valid JSON array with objects for each post:
[
  {
    "platform": "linkedin",
    "variationNumber": 1,
    "content": "The post content here...",
    "hashtags": ["#hashtag1", "#hashtag2"]
  }
]

Generate ${input.variationCount * input.platforms.length} total posts now (${input.variationCount} variations x ${input.platforms.length} platforms).
`;
}

// System prompt for social post generation
export const SOCIAL_POST_SYSTEM_PROMPT = `You are an expert social media strategist and copywriter who creates viral, engaging content optimized for each platform.

You understand:
- Platform-specific best practices, algorithms, and character limits
- Optimal posting formats (hooks, storytelling, CTAs) for each platform
- Hashtag strategies that drive discovery without looking spammy
- How to write for different audiences (B2B on LinkedIn, Gen-Z on TikTok)
- The difference between engagement-bait and genuine value

Your posts are:
- Scroll-stopping: The first line MUST hook the reader
- Value-packed: Every post teaches, entertains, or inspires
- Platform-native: You write LinkedIn posts that feel like LinkedIn, not Twitter threads
- Authentic: You avoid corporate jargon and write like a real person
- Actionable: Clear CTAs that drive engagement or conversion

You always return valid JSON matching the exact format specified.`;

// Parse AI response into structured posts
export function parseSocialPostResponse(
  response: string,
  input: SocialPostInput
): GeneratedPost[] {
  try {
    // Try to extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as Array<{
        platform: Platform;
        variationNumber: number;
        content: string;
        hashtags?: string[];
      }>;

      return parsed.map((post) => {
        const platformConfig = PLATFORM_CONFIG[post.platform];
        const content = post.content || '';
        const charCount = content.length;

        return {
          platform: post.platform,
          variationNumber: post.variationNumber,
          content,
          characterCount: charCount,
          characterLimit: platformConfig.limit,
          isWithinLimit: charCount <= platformConfig.limit,
          hashtags: post.hashtags || [],
        };
      });
    }
  } catch {
    // Fall back to text parsing
  }

  // Fallback: Parse structured text response
  const posts: GeneratedPost[] = [];
  const sections = response.split(/(?=#{1,3}\s*(?:LinkedIn|Twitter|Instagram|TikTok))/i);

  for (const section of sections) {
    if (!section.trim()) continue;

    // Detect platform
    let platform: Platform | null = null;
    if (/linkedin/i.test(section)) platform = 'linkedin';
    else if (/twitter|x\b/i.test(section)) platform = 'twitter';
    else if (/instagram/i.test(section)) platform = 'instagram';
    else if (/tiktok/i.test(section)) platform = 'tiktok';

    if (!platform) continue;

    // Extract variations
    const variationBlocks = section.split(/(?=Variation \d|Option \d|\*\*Variation|\*\*Option)/i);

    let variationNumber = 0;
    for (const block of variationBlocks) {
      if (block.length < 20) continue;

      variationNumber++;
      const content = block
        .replace(/^#+\s*\w+.*$/m, '')
        .replace(/Variation \d:?|Option \d:?/gi, '')
        .replace(/\*\*Variation.*?\*\*/gi, '')
        .replace(/Hashtags?:?\s*/gi, '')
        .trim();

      if (content.length > 10) {
        const platformConfig = PLATFORM_CONFIG[platform];
        const hashtagMatch = content.match(/#\w+/g);

        posts.push({
          platform,
          variationNumber,
          content: content.replace(/#\w+\s*/g, '').trim(),
          characterCount: content.length,
          characterLimit: platformConfig.limit,
          isWithinLimit: content.length <= platformConfig.limit,
          hashtags: hashtagMatch || [],
        });
      }
    }
  }

  // If we still don't have posts, create a basic fallback
  if (posts.length === 0) {
    for (const platform of input.platforms) {
      const platformConfig = PLATFORM_CONFIG[platform];
      for (let v = 1; v <= input.variationCount; v++) {
        posts.push({
          platform,
          variationNumber: v,
          content: response.substring(0, platformConfig.optimal),
          characterCount: Math.min(response.length, platformConfig.optimal),
          characterLimit: platformConfig.limit,
          isWithinLimit: true,
          hashtags: [],
        });
      }
    }
  }

  return posts;
}
