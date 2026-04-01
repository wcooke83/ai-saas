import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vocui.com'

const industryPages = [
  // Health & Wellness
  '/chatbot-for-healthcare',
  '/chatbot-for-dentists',
  '/chatbot-for-chiropractors',
  '/chatbot-for-optometrists',
  '/chatbot-for-pharmacies',
  '/chatbot-for-veterinarians',
  '/chatbot-for-therapists',
  '/chatbot-for-plastic-surgeons',
  // Legal & Finance
  '/chatbot-for-lawyers',
  '/chatbot-for-immigration-lawyers',
  '/chatbot-for-accountants',
  '/chatbot-for-accountancy-firms',
  '/chatbot-for-financial-advisors',
  '/chatbot-for-insurance-agents',
  '/chatbot-for-mortgage-brokers',
  '/chatbot-for-mortgage-lenders',
  // Hospitality & Food
  '/chatbot-for-restaurants',
  '/chatbot-for-hotels',
  '/chatbot-for-travel-agencies',
  // Fitness & Wellness
  '/chatbot-for-gyms',
  '/chatbot-for-fitness-studios',
  '/chatbot-for-yoga-studios',
  '/chatbot-for-personal-trainers',
  '/chatbot-for-spas',
  '/chatbot-for-salons',
  '/chatbot-for-pet-grooming',
  // Home Services & Trades
  '/chatbot-for-plumbers',
  '/chatbot-for-electricians',
  '/chatbot-for-hvac',
  '/chatbot-for-landscapers',
  '/chatbot-for-cleaning-services',
  // Automotive & Events
  '/chatbot-for-car-dealerships',
  '/chatbot-for-auto-repair',
  '/chatbot-for-event-planners',
  '/chatbot-for-wedding-venues',
  '/chatbot-for-photography-studios',
  // Business Services & Agencies
  '/chatbot-for-recruiters',
  '/chatbot-for-hr',
  '/chatbot-for-it-support',
  '/chatbot-for-saas',
  '/chatbot-for-marketing-agencies',
  '/chatbot-for-web-design-agencies',
  // Education & Non-Profit
  '/chatbot-for-tutoring-centers',
  '/chatbot-for-universities',
  '/chatbot-for-online-courses',
  '/chatbot-for-nonprofits',
  '/chatbot-for-churches',
  '/chatbot-for-government',
  // Property
  '/chatbot-for-real-estate',
  '/chatbot-for-property-managers',
  // B2B, Logistics & Industry
  '/chatbot-for-ecommerce',
  '/chatbot-for-logistics',
  '/chatbot-for-manufacturers',
  '/chatbot-for-wholesale',
  // Other solutions
  '/chatbot-for-customer-support',
  '/chatbot-for-lead-capture',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const industryEntries: MetadataRoute.Sitemap = industryPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/chatbot-booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/knowledge-base-chatbot`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/slack-chatbot`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...industryEntries,
    {
      url: `${BASE_URL}/vs-intercom`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/vs-tidio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/sdk`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // ─── Blog Topic Guides (Hub Pages) ──────────────────────────────────────
    ...[
      'knowledge-base-chatbot-guide',
      'embed-chatbot-guide',
      'chatbot-for-business-guide',
      'chatbot-alternatives-guide',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/blog/how-to-add-chatbot-to-website`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/how-to-train-chatbot-on-your-own-data`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/chatbase-alternatives`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/how-to-reduce-customer-support-tickets`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/what-is-a-knowledge-base-chatbot`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // ─── Batch 1: How-To Guides ──────────────────────────────────────────────
    ...[
      'how-to-create-faq-chatbot',
      'how-to-build-internal-knowledge-bot',
      'how-to-embed-chatbot-in-wordpress',
      'how-to-embed-chatbot-in-shopify',
      'how-to-write-chatbot-system-prompt',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 2: How-To Guides + Setup ──────────────────────────────────────
    ...[
      'how-to-embed-chatbot-in-squarespace',
      'how-to-embed-chatbot-in-wix',
      'how-to-measure-chatbot-roi',
      'how-to-improve-chatbot-accuracy',
      'how-to-set-up-slack-chatbot-for-team',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 3: Industry Use Cases ─────────────────────────────────────────
    ...[
      'chatbot-for-saas-onboarding',
      'chatbot-for-restaurants',
      'chatbot-for-education',
      'chatbot-for-financial-services',
      'chatbot-for-recruitment',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 4: Industry Use Cases ─────────────────────────────────────────
    ...[
      'chatbot-for-nonprofits',
      'chatbot-for-insurance',
      'chatbot-for-travel-agencies',
      'chatbot-for-fitness-studios',
      'chatbot-for-accounting-firms',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 5: Strategy & Business Value ──────────────────────────────────
    ...[
      'ai-chatbot-vs-live-chat',
      'chatbot-lead-generation-strategies',
      'reduce-employee-onboarding-time-with-ai',
      'ai-customer-service-statistics',
      'small-business-ai-automation-guide',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 6: Strategy & Business Value ──────────────────────────────────
    ...[
      'chatbot-conversion-rate-optimization',
      'cost-of-customer-support-without-ai',
      'ai-chatbot-for-after-hours-support',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 7: Explainers ─────────────────────────────────────────────────
    ...[
      'what-is-rag-retrieval-augmented-generation',
      'what-are-embeddings-explained-simply',
      'what-is-a-chatbot-widget',
      'what-is-conversational-ai',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 8: Explainers + Technical ─────────────────────────────────────
    ...[
      'what-is-vector-search',
      'ai-hallucination-what-it-is-how-to-prevent-it',
      'chatbot-vs-virtual-assistant',
      'how-ai-chatbots-understand-questions',
      'what-is-prompt-engineering',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 9: Comparisons & Alternatives ─────────────────────────────────
    ...[
      'tidio-alternatives',
      'intercom-alternatives',
      'drift-alternatives',
      'zendesk-chat-alternatives',
      'freshchat-alternatives',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // ─── Batch 10: Best Practices ────────────────────────────────────────────
    ...[
      'chatbot-best-practices-for-small-business',
      'knowledge-base-content-best-practices',
      'chatbot-personality-and-tone-guide',
      'chatbot-security-and-privacy-guide',
      'chatbot-analytics-what-to-track',
    ].map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: `${BASE_URL}/wiki`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/security`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
