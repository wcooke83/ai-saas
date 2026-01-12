export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  hasEmbed: boolean;
  hasApi: boolean;
  embedPath: string;
  apiPath: string;
  noEmbedReason?: string;
  examplePayload: Record<string, unknown>;
}

export const toolsConfig: Record<string, ToolConfig> = {
  'email-writer': {
    id: 'email-writer',
    name: 'Email Writer',
    description: 'Generate professional emails with AI. Perfect for cold outreach, follow-ups, and introductions.',
    iconName: 'Mail',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    hasEmbed: true,
    hasApi: true,
    embedPath: '/embed/email-writer',
    apiPath: '/api/tools/email-writer',
    examplePayload: {
      type: 'cold-outreach',
      recipient: 'potential client',
      tone: 'professional',
      keyPoints: ['Introduce our service', 'Request a meeting'],
    },
  },
  'proposal-generator': {
    id: 'proposal-generator',
    name: 'Proposal Generator',
    description: 'Create winning business proposals, RFP responses, and project proposals with AI assistance.',
    iconName: 'FileText',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    hasEmbed: true,
    hasApi: true,
    embedPath: '/embed/proposal-generator',
    apiPath: '/api/tools/proposal-generator',
    examplePayload: {
      clientName: 'Acme Corp',
      projectType: 'web-development',
      scope: 'Full website redesign with e-commerce',
      budget: '$50,000',
    },
  },
  'blog-writer': {
    id: 'blog-writer',
    name: 'Blog Writer',
    description: 'Generate SEO-optimized blog posts, listicles, how-tos, and tutorials.',
    iconName: 'PenTool',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400',
    hasEmbed: true,
    hasApi: true,
    embedPath: '/embed/blog-writer',
    apiPath: '/api/tools/blog-writer',
    examplePayload: {
      topic: 'AI in business',
      format: 'listicle',
      targetAudience: 'small business owners',
      keywords: ['AI', 'automation', 'productivity'],
    },
  },
  'meeting-notes': {
    id: 'meeting-notes',
    name: 'Meeting Summarizer',
    description: 'Transform meeting transcripts into structured summaries with action items.',
    iconName: 'MessageSquare',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    hasEmbed: true,
    hasApi: true,
    embedPath: '/embed/meeting-notes',
    apiPath: '/api/tools/meeting-notes',
    examplePayload: {
      transcript: 'Meeting transcript text here...',
      meetingType: 'standup',
      extractActionItems: true,
    },
  },
  'ad-copy': {
    id: 'ad-copy',
    name: 'Ad Copy Generator',
    description: 'Generate high-converting ad copy for Google, Meta, LinkedIn, and more.',
    iconName: 'Megaphone',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    iconColor: 'text-red-600 dark:text-red-400',
    hasEmbed: true,
    hasApi: true,
    embedPath: '/embed/ad-copy',
    apiPath: '/api/tools/ad-copy',
    examplePayload: {
      platform: 'google',
      product: 'AI writing assistant',
      targetAudience: 'marketers',
      callToAction: 'Start free trial',
    },
  },
  'social-post': {
    id: 'social-post',
    name: 'Social Post Generator',
    description: 'Create viral social media posts for LinkedIn, Twitter/X, Instagram, and TikTok.',
    iconName: 'Share2',
    iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-900/50',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    hasEmbed: true,
    hasApi: true,
    embedPath: '/embed/social-post',
    apiPath: '/api/tools/social-post',
    examplePayload: {
      platforms: ['linkedin'],
      topic: 'Product launch announcement',
      postType: 'announcement',
      tone: 'professional',
      includeHashtags: true,
    },
  },
};

export const toolsList = Object.values(toolsConfig);
