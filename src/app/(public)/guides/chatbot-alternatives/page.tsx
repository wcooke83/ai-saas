import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { GuideHero } from './guide-hero';
import { GuideComparisonGrid } from './guide-comparison-grid';
import type { ComparisonPost } from './guide-comparison-grid';
import { GuideCriteria } from './guide-criteria';
import { GuideCta } from './guide-cta';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Chatbot Alternatives Compared (2026) | VocUI',
  description:
    'Compare chatbot alternatives side by side. Chatbase, Tidio, Intercom, Drift, Zendesk Chat, and Freshchat rated on pricing, AI features, and setup time.',
  keywords: [
    'chatbot alternatives',
    'chatbot platform comparison',
    'best chatbot platforms',
    'Chatbase alternatives',
    'Tidio alternatives',
    'Intercom alternatives',
    'AI chatbot builder',
  ],
  openGraph: {
    title: 'Chatbot Alternatives Compared (2026) | VocUI',
    description:
      'Compare chatbot alternatives side by side. Chatbase, Tidio, Intercom, Drift, Zendesk Chat, and Freshchat rated on pricing, AI features, and setup time.',
    url: 'https://vocui.com/guides/chatbot-alternatives',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot Alternatives Compared (2026) | VocUI',
    description:
      'Compare chatbot alternatives side by side. Chatbase, Tidio, Intercom, Drift, Zendesk Chat, and Freshchat rated on pricing, AI features, and setup time.',
  },
  alternates: { canonical: 'https://vocui.com/guides/chatbot-alternatives' },
  robots: { index: true, follow: true },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const comparisonPosts: ComparisonPost[] = [
  {
    slug: 'chatbase-alternatives',
    title: 'Best Chatbase Alternatives for Custom AI Chat',
    description:
      'How Chatbase compares on pricing, knowledge training, Slack integration, and embeddable widgets — plus 4 alternatives worth testing.',
    readTime: '11 min read',
    tag: 'Comparison',
    startHere: true,
    platformLabel: 'Chatbase',
    platformInitial: 'C',
  },
  {
    slug: 'tidio-alternatives',
    title: '5 Tidio Alternatives That Train on Your Content',
    description:
      'Tidio vs. five AI chat platforms compared on pricing, knowledge training, and ease of setup for small businesses.',
    readTime: '10 min read',
    tag: 'Comparison',
    platformLabel: 'Tidio',
    platformInitial: 'T',
  },
  {
    slug: 'intercom-alternatives',
    title: "Intercom Alternatives That Won't Break the Budget",
    description:
      'Five platforms with AI chatbot features, knowledge training, and simple setup — at a fraction of Intercom pricing.',
    readTime: '10 min read',
    tag: 'Comparison',
    platformLabel: 'Intercom',
    platformInitial: 'I',
  },
  {
    slug: 'drift-alternatives',
    title: '5 Drift Alternatives for AI-Powered Lead Capture',
    description:
      'Drift vs. five platforms compared on lead capture, AI chat, and pricing for growing teams.',
    readTime: '10 min read',
    tag: 'Comparison',
    platformLabel: 'Drift',
    platformInitial: 'D',
  },
  {
    slug: 'zendesk-chat-alternatives',
    title: 'Best Zendesk Chat Alternatives for Small Teams',
    description:
      'Simpler platforms with AI chatbot features and better pricing — no enterprise contract required.',
    readTime: '10 min read',
    tag: 'Comparison',
    platformLabel: 'Zendesk',
    platformInitial: 'Z',
  },
  {
    slug: 'freshchat-alternatives',
    title: 'Best Freshchat Alternatives Outside the Freshworks Ecosystem',
    description:
      'Standalone AI chat platforms that don\'t lock you into Freshworks — compared on pricing, setup, and knowledge training.',
    readTime: '10 min read',
    tag: 'Comparison',
    platformLabel: 'Freshchat',
    platformInitial: 'F',
  },
];

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  tag: string;
}

const relatedPosts: RelatedPost[] = [
  {
    slug: 'ai-chatbot-vs-live-chat',
    title: 'AI Chatbot vs. Live Chat: Which One Fits Your Team?',
    description:
      'Cost, availability, and scalability compared — plus when a hybrid approach makes the most sense.',
    readTime: '9 min read',
    tag: 'Strategy',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://vocui.com/guides/chatbot-alternatives',
      name: 'Chatbot Alternatives Compared (2026)',
      description:
        'Compare chatbot alternatives side by side. Chatbase, Tidio, Intercom, Drift, Zendesk Chat, and Freshchat rated on pricing, AI features, and setup time.',
      url: 'https://vocui.com/guides/chatbot-alternatives',
      dateCreated: '2026-03-08',
      dateModified: '2026-04-04',
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
        logo: { '@type': 'ImageObject', url: 'https://vocui.com/icon.png' },
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: comparisonPosts.length,
        itemListElement: comparisonPosts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://vocui.com/blog/${post.slug}`,
          name: post.title,
          description: post.description,
        })),
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What pricing structure should you look for in a chatbot platform?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Check whether the free plan is genuinely usable, whether AI conversations cost extra per resolution, and what the next tier actually unlocks.',
          },
        },
        {
          '@type': 'Question',
          name: 'How important is knowledge base training for a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Critical. The best platforms let you train on your own documents, URLs, and PDFs rather than relying on a generic model with no grounding in your content.',
          },
        },
        {
          '@type': 'Question',
          name: 'How complex is it to set up an AI chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It varies. Some platforms get you live in minutes with no developer resources, while others require onboarding calls or sales conversations first.',
          },
        },
        {
          '@type': 'Question',
          name: 'What deployment options should a chatbot platform offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Look for platforms that can embed on your site, connect to Slack, deploy on Telegram, and support live agent handoff when the AI falls short.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://vocui.com/guides' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Chatbot Alternatives Guide',
          item: 'https://vocui.com/guides/chatbot-alternatives',
        },
      ],
    },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatbotAlternativesGuidePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">
        {/* ── Hero: grid overlay, display heading, asymmetric 7/5 layout ───── */}
        <GuideHero />

        {/* ── Comparison Grid: tinted bg, featured + compact tiles ──────────── */}
        <GuideComparisonGrid posts={comparisonPosts} />

        {/* ── Criteria: full-bleed dark interlude, numbered criteria ─────────── */}
        <GuideCriteria />

        {/* ── CTA: full-bleed gradient + related reading strip ──────────────── */}
        <GuideCta relatedPosts={relatedPosts} />

        {/* ── Back nav ─────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to all guides
          </Link>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
