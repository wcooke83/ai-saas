// ─── Author Registry ──────────────────────────────────────────────────────────
// Typed author data for blog bylines, author pages, and JSON-LD structured data.

export interface BlogAuthor {
  name: string;
  slug: string;
  title: string; // job title
  bio: string; // one-line bio for byline
  extendedBio: string; // 2-3 sentences for author page
  expertise: string[]; // for JSON-LD
  avatar?: string; // path to avatar image (optional, for future)
}

export const AUTHORS: Record<string, BlogAuthor> = {
  tech: {
    name: 'Daniel Reeves',
    slug: 'daniel-reeves',
    title: 'Senior AI Engineer at VocUI',
    bio: 'Writes about AI architecture, embeddings, and retrieval systems.',
    extendedBio:
      'Daniel Reeves is a Senior AI Engineer at VocUI, focused on retrieval-augmented generation, embedding pipelines, and vector search. He writes about the technical foundations that make knowledge-base chatbots accurate and reliable.',
    expertise: [
      'artificial intelligence',
      'machine learning',
      'natural language processing',
      'retrieval-augmented generation',
      'vector search',
    ],
  },
  growth: {
    name: 'Priya Sharma',
    slug: 'priya-sharma',
    title: 'Head of Growth at VocUI',
    bio: 'Writes about chatbot strategy, analytics, and business impact.',
    extendedBio:
      'Priya Sharma leads growth at VocUI, where she focuses on helping businesses measure and maximize the ROI of AI chatbots. She writes about conversion optimization, customer service automation, and data-driven chatbot strategy.',
    expertise: [
      'digital marketing',
      'conversion optimization',
      'customer experience',
      'business analytics',
      'SaaS growth',
    ],
  },
  product: {
    name: 'Megan Torres',
    slug: 'megan-torres',
    title: 'Product Lead at VocUI',
    bio: 'Writes about chatbot implementation, integrations, and best practices.',
    extendedBio:
      'Megan Torres is the Product Lead at VocUI, overseeing the chatbot builder, deployment integrations, and knowledge management features. She writes practical guides for businesses setting up and customizing their AI chatbots.',
    expertise: [
      'product development',
      'chatbot implementation',
      'SaaS platforms',
      'user experience',
      'platform integrations',
    ],
  },
  'will-cooke': {
    name: 'Will Cooke',
    slug: 'will-cooke',
    title: 'Founder at VocUI',
    bio: 'Founder of VocUI. Writes about the chatbot landscape and product comparisons.',
    extendedBio:
      'Will Cooke is the founder of VocUI, an AI chatbot platform that helps businesses deploy knowledge-base chatbots. He writes about the competitive landscape and product strategy.',
    expertise: [
      'SaaS entrepreneurship',
      'AI chatbot platforms',
      'product strategy',
    ],
  },
};

// ─── Post-to-Author Mapping ──────────────────────────────────────────────────

export const POST_AUTHORS: Record<string, string> = {
  // Tech/Engineering
  'what-is-rag-retrieval-augmented-generation': 'tech',
  'what-are-embeddings-explained-simply': 'tech',
  'what-is-vector-search': 'tech',
  'what-is-conversational-ai': 'tech',
  'what-is-prompt-engineering': 'tech',
  'what-is-a-system-prompt': 'tech',
  'how-ai-chatbots-understand-questions': 'tech',
  'ai-hallucination-what-it-is-how-to-prevent-it': 'tech',
  'how-to-write-chatbot-system-prompt': 'tech',
  'how-to-improve-chatbot-accuracy': 'tech',
  'how-to-train-chatbot-on-your-own-data': 'tech',
  'what-is-a-chatbot-widget': 'tech',

  // Growth/Marketing
  'chatbot-lead-generation-strategies': 'growth',
  'chatbot-conversion-rate-optimization': 'growth',
  'chatbot-analytics-what-to-track': 'growth',
  'how-to-measure-chatbot-roi': 'growth',
  'cost-of-customer-support-without-ai': 'growth',
  'ai-customer-service-statistics': 'growth',
  'small-business-ai-automation-guide': 'growth',
  'reduce-employee-onboarding-time-with-ai': 'growth',
  'ai-chatbot-for-after-hours-support': 'growth',
  'chatbot-best-practices-for-small-business': 'growth',
  'automate-repetitive-customer-questions': 'growth',

  // Product/Practitioner
  'how-to-add-chatbot-to-website': 'product',
  'how-to-create-faq-chatbot': 'product',
  'how-to-build-internal-knowledge-bot': 'product',
  'how-to-embed-chatbot-in-wordpress': 'product',
  'how-to-embed-chatbot-in-shopify': 'product',
  'how-to-embed-chatbot-in-squarespace': 'product',
  'how-to-embed-chatbot-in-wix': 'product',
  'how-to-set-up-slack-chatbot-for-team': 'product',
  'chatbot-personality-and-tone-guide': 'product',
  'chatbot-security-and-privacy-guide': 'product',
  'knowledge-base-content-best-practices': 'product',
  'what-is-a-knowledge-base-chatbot': 'product',
  'chatbot-vs-virtual-assistant': 'product',
  'chatbot-for-restaurants': 'product',
  'chatbot-for-education': 'product',
  'chatbot-for-financial-services': 'product',
  'chatbot-for-recruitment': 'product',
  'chatbot-for-nonprofits': 'product',
  'chatbot-for-insurance': 'product',
  'chatbot-for-travel-agencies': 'product',
  'chatbot-for-fitness-studios': 'product',
  'chatbot-for-accounting-firms': 'product',
  'chatbot-for-saas-onboarding': 'product',
  'chatbot-for-lead-qualification': 'product',

  // Will Cooke (founder)
  'chatbase-alternatives': 'will-cooke',
  'tidio-alternatives': 'will-cooke',
  'intercom-alternatives': 'will-cooke',
  'drift-alternatives': 'will-cooke',
  'zendesk-chat-alternatives': 'will-cooke',
  'freshchat-alternatives': 'will-cooke',
  'ai-chatbot-vs-live-chat': 'will-cooke',
  'how-to-reduce-customer-support-tickets': 'will-cooke',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAuthorForPost(slug: string): BlogAuthor {
  const authorKey = POST_AUTHORS[slug] || 'product';
  return AUTHORS[authorKey];
}

/** Get all post slugs written by a given author key */
export function getPostSlugsForAuthor(authorKey: string): string[] {
  return Object.entries(POST_AUTHORS)
    .filter(([, key]) => key === authorKey)
    .map(([slug]) => slug);
}

/** Find the author key for a given author slug (e.g. 'will-cooke' -> 'will-cooke', 'placeholder-tech' -> 'tech') */
export function getAuthorBySlug(slug: string): { key: string; author: BlogAuthor } | null {
  const entry = Object.entries(AUTHORS).find(([, author]) => author.slug === slug);
  if (!entry) return null;
  return { key: entry[0], author: entry[1] };
}
