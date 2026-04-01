import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Add a Chatbot to Any Website | VocUI',
  description:
    'Step-by-step guides for embedding AI chatbots on WordPress, Shopify, Squarespace, Wix, and any other platform. One script tag, no coding.',
  openGraph: {
    title: 'How to Add a Chatbot to Any Website | VocUI',
    description:
      'Step-by-step guides for embedding AI chatbots on WordPress, Shopify, Squarespace, Wix, and any other platform. One script tag, no coding.',
    url: 'https://vocui.com/blog/embed-chatbot-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Add a Chatbot to Any Website | VocUI',
    description:
      'Step-by-step guides for embedding AI chatbots on WordPress, Shopify, Squarespace, Wix, and any other platform. One script tag, no coding.',
  },
  alternates: { canonical: 'https://vocui.com/blog/embed-chatbot-guide' },
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

const overviewPosts: SpokePost[] = [
  {
    slug: 'how-to-add-chatbot-to-website',
    title: 'How to Add a Chatbot to Your Website (No Coding Required)',
    description:
      'The universal guide. Learn how to add a chatbot to any website in minutes with a single script tag.',
    readTime: '7 min read',
    tag: 'Guide',
    startHere: true,
  },
  {
    slug: 'what-is-a-chatbot-widget',
    title: 'What Is a Chatbot Widget and How Does It Work?',
    description:
      'Understand what a chatbot widget is, how it appears on your site, and what happens when visitors interact with it.',
    readTime: '6 min read',
    tag: 'Explainer',
  },
];

const platformGuides: SpokePost[] = [
  {
    slug: 'how-to-embed-chatbot-in-wordpress',
    title: 'How to Embed a Chatbot in WordPress',
    description:
      'Add a chatbot to WordPress in under 5 minutes. Paste one script tag into your theme or use a plugin.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-shopify',
    title: 'How to Embed a Chatbot in Shopify',
    description:
      'Add a chatbot to your Shopify store to answer product, shipping, and return questions automatically.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-squarespace',
    title: 'How to Embed a Chatbot in Squarespace',
    description:
      'Use Squarespace code injection to add a chatbot to your site. No plugins, no app installs.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-wix',
    title: 'How to Embed a Chatbot in Wix',
    description:
      'Embed a chatbot on your Wix site using the custom code feature. Works on any Wix plan with custom code access.',
    readTime: '6 min read',
    tag: 'Guide',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const allPosts = [...overviewPosts, ...platformGuides];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'How to Add a Chatbot to Any Website',
      description:
        'Step-by-step guides for embedding AI chatbots on WordPress, Shopify, Squarespace, Wix, and any other platform.',
      url: 'https://vocui.com/blog/embed-chatbot-guide',
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
          name: 'Embed Chatbot Guide',
          item: 'https://vocui.com/blog/embed-chatbot-guide',
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

export default function EmbedChatbotGuidePage() {
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
              Embed Chatbot Guide
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
              6 articles
            </span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            How to Add a Chatbot to Any Website
          </h1>
          <div className="text-lg text-secondary-600 dark:text-secondary-400 space-y-3">
            <p>
              Adding a chatbot to your website takes one script tag and about five minutes.
              But the exact steps vary depending on your platform -- WordPress, Shopify,
              Squarespace, and Wix each have their own way of adding custom code.
            </p>
            <p>
              This guide collects every platform-specific tutorial in one place. Start with
              the overview if you are new to chatbot widgets, then jump to the guide for your
              platform.
            </p>
          </div>
        </div>

        {/* Section: Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Getting Started
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            Understand what a chatbot widget is and how the embed process works on any site.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {overviewPosts.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Section: Platform Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Platform-Specific Guides
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            Step-by-step instructions for the most popular website builders and CMS platforms.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {platformGuides.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
            Get your embed code in 2 minutes
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-lg mx-auto">
            Create a chatbot, train it on your content, and copy the embed snippet.
            Works on any website that supports custom HTML.
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
