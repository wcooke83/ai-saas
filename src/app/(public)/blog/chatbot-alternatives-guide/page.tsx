import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Chatbot Platform Alternatives Compared | VocUI',
  description:
    'Honest comparisons of the top AI chatbot platforms including Chatbase, Tidio, Intercom, Drift, Zendesk, and Freshchat. Find the right fit.',
  openGraph: {
    title: 'Chatbot Platform Alternatives Compared | VocUI',
    description:
      'Honest comparisons of the top AI chatbot platforms including Chatbase, Tidio, Intercom, Drift, Zendesk, and Freshchat. Find the right fit.',
    url: 'https://vocui.com/blog/chatbot-alternatives-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot Platform Alternatives Compared | VocUI',
    description:
      'Honest comparisons of the top AI chatbot platforms including Chatbase, Tidio, Intercom, Drift, Zendesk, and Freshchat. Find the right fit.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-alternatives-guide' },
  robots: { index: true, follow: true },
};

// ─── Spoke Posts ──────────────────────────────────────────────────────────────

interface SpokePost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  tag: string;
  startHere?: boolean;
}

const comparisonPosts: SpokePost[] = [
  {
    slug: 'chatbase-alternatives',
    title: '5 Chatbase Alternatives Worth Trying',
    description:
      'Compare the top AI chatbot builders on pricing, knowledge base support, Slack integration, and embed options.',
    readTime: '11 min read',
    tag: 'Comparison',
    startHere: true,
  },
  {
    slug: 'tidio-alternatives',
    title: '5 Tidio Alternatives for AI-Powered Chat',
    description:
      'Five AI-powered chat platforms compared on pricing, knowledge base support, and ease of use for small businesses.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'intercom-alternatives',
    title: "5 Intercom Alternatives That Won't Break the Budget",
    description:
      'Affordable alternatives with AI chatbot features, knowledge base support, and simple setup.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'drift-alternatives',
    title: '5 Drift Alternatives for Conversational Marketing',
    description:
      'Compare five alternatives for lead capture, chat, and AI-powered conversations.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'zendesk-chat-alternatives',
    title: '5 Zendesk Chat Alternatives Worth Considering',
    description:
      'Simpler alternatives with AI chatbot features and better pricing for small businesses.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
  {
    slug: 'freshchat-alternatives',
    title: '5 Freshchat Alternatives for Small Business',
    description:
      'Standalone AI chat solutions that work outside the Freshworks ecosystem.',
    readTime: '10 min read',
    tag: 'Comparison',
  },
];

const relatedPosts: SpokePost[] = [
  {
    slug: 'ai-chatbot-vs-live-chat',
    title: 'AI Chatbot vs Live Chat: Which Is Right for You?',
    description:
      'Comparing AI chatbots and live chat on cost, availability, scalability, and customer satisfaction.',
    readTime: '9 min read',
    tag: 'Strategy',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const allPosts = [...comparisonPosts, ...relatedPosts];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Best Chatbot Platform Alternatives Compared',
      description:
        'Honest comparisons of the top AI chatbot platforms including Chatbase, Tidio, Intercom, Drift, Zendesk, and Freshchat.',
      url: 'https://vocui.com/blog/chatbot-alternatives-guide',
      dateCreated: '2026-03-08',
      dateModified: '2026-04-02',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: allPosts.length,
        itemListElement: allPosts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://vocui.com/blog/${post.slug}`,
          name: post.title,
        })),
      },
      isPartOf: {
        '@type': 'Blog',
        name: 'VocUI Blog',
        url: 'https://vocui.com/blog',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Chatbot Alternatives Guide',
          item: 'https://vocui.com/blog/chatbot-alternatives-guide',
        },
      ],
    },
  ],
};

// ─── Components ──────────────────────────────────────────────────────────────

function SpokeCard({ post }: { post: SpokePost }) {
  return (
    <article className="py-6 group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
            {post.tag}
          </span>
          <span className="text-xs text-secondary-400 dark:text-secondary-500">
            {post.readTime}
          </span>
          {post.startHere && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              <Star className="w-3 h-3" aria-hidden="true" />
              Start here
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-2">
          {post.description}
        </p>
        <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
          Read article
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatbotAlternativesGuidePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content" className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li>
              <Link href="/" className="hover:text-primary-500 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-primary-500 transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">
              Chatbot Alternatives Guide
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Topic Guide
            </span>
            <span className="text-sm text-secondary-400 dark:text-secondary-500">
              7 articles
            </span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            Best Chatbot Platform Alternatives Compared
          </h1>
          <div className="text-lg text-secondary-600 dark:text-secondary-400 space-y-3">
            <p>
              Choosing a chatbot platform is hard when every tool claims to be the best. These
              comparison guides break down the real differences -- pricing, AI capabilities,
              knowledge base support, and ease of setup -- so you can pick the right one for
              your business.
            </p>
            <p>
              Each guide compares five alternatives to a specific platform. If you are
              evaluating options or considering a switch, start with the platform you are
              currently using (or considering) and see how the alternatives stack up.
            </p>
          </div>
        </div>

        {/* Section: Platform Comparisons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Platform Comparisons
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            Side-by-side comparisons of the most popular chatbot platforms and their alternatives.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {comparisonPosts.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Section: Related Reading */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Related Reading
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            Broader context to help you decide what type of chat solution fits your needs.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {relatedPosts.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
            Try VocUI free -- no credit card required
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-lg mx-auto">
            Create a chatbot trained on your content, embed it on your site, and see the
            difference in minutes. Switch from any platform with zero migration headaches.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
          >
            Create your chatbot
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <Link
            href="/blog"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            &larr; Back to all articles
          </Link>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
