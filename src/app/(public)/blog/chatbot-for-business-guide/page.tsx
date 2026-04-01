import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbots for Business: Industry Guide | VocUI',
  description:
    'How businesses across industries use AI chatbots to automate support, capture leads, and serve customers 24/7. Guides for 10+ industries.',
  openGraph: {
    title: 'AI Chatbots for Business: Industry Guide | VocUI',
    description:
      'How businesses across industries use AI chatbots to automate support, capture leads, and serve customers 24/7. Guides for 10+ industries.',
    url: 'https://vocui.com/blog/chatbot-for-business-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Business: Industry Guide | VocUI',
    description:
      'How businesses across industries use AI chatbots to automate support, capture leads, and serve customers 24/7. Guides for 10+ industries.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-business-guide' },
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

const industryPosts: SpokePost[] = [
  {
    slug: 'chatbot-for-restaurants',
    title: 'AI Chatbots for Restaurants',
    description:
      'Answer questions about menus, hours, reservations, and dietary options without tying up staff on the phone.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-education',
    title: 'AI Chatbots for Education',
    description:
      'Automate student FAQs about enrollment, deadlines, and course content for universities and online platforms.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-financial-services',
    title: 'AI Chatbots for Financial Services',
    description:
      'Answer client questions about services, fees, and processes while staying compliant with industry regulations.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-recruitment',
    title: 'AI Chatbots for Recruitment',
    description:
      'Answer candidate questions, pre-screen applicants, and reduce time-to-hire without adding headcount.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-nonprofits',
    title: 'AI Chatbots for Nonprofits',
    description:
      'Engage donors, recruit volunteers, and share program info without stretching limited staff resources.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-insurance',
    title: 'AI Chatbots for Insurance',
    description:
      'Automate policy questions, explain coverage options, and qualify leads to reduce call volume.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-travel-agencies',
    title: 'AI Chatbots for Travel Agencies',
    description:
      'Answer destination and booking questions 24/7, capture leads, and explain travel packages automatically.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-fitness-studios',
    title: 'AI Chatbots for Gyms and Fitness Studios',
    description:
      'Answer membership questions, share class schedules, and convert website visitors into members.',
    readTime: '6 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-accounting-firms',
    title: 'AI Chatbots for Accounting Firms',
    description:
      'Let clients self-serve answers about services, deadlines, and document requirements to free up billable hours.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-saas-onboarding',
    title: 'AI Chatbots for SaaS Onboarding',
    description:
      'Guide new users through onboarding, answer setup questions, and reduce time-to-value for SaaS products.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
];

const strategyPosts: SpokePost[] = [
  {
    slug: 'chatbot-best-practices-for-small-business',
    title: 'Chatbot Best Practices for Small Business Owners',
    description:
      'Nine practical best practices for small businesses -- from knowledge base setup to system prompts and testing.',
    readTime: '9 min read',
    tag: 'Best Practice',
    startHere: true,
  },
  {
    slug: 'small-business-ai-automation-guide',
    title: 'The Small Business Guide to AI Automation',
    description:
      'What to automate first, which tools to use, and how to start without technical skills or a big budget.',
    readTime: '10 min read',
    tag: 'Strategy',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const allPosts = [...strategyPosts, ...industryPosts];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'AI Chatbots for Business: Industry Guide',
      description:
        'How businesses across industries use AI chatbots to automate support, capture leads, and serve customers 24/7.',
      url: 'https://vocui.com/blog/chatbot-for-business-guide',
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
          name: 'Chatbot for Business Guide',
          item: 'https://vocui.com/blog/chatbot-for-business-guide',
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

export default function ChatbotForBusinessGuidePage() {
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
              Chatbot for Business Guide
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
              12 articles
            </span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            AI Chatbots for Business: Industry Guide
          </h1>
          <div className="text-lg text-secondary-600 dark:text-secondary-400 space-y-3">
            <p>
              Every business answers the same questions over and over -- hours, pricing,
              availability, policies. An AI chatbot trained on your content handles those
              questions instantly, 24/7, so your team can focus on higher-value work.
            </p>
            <p>
              The guides below show how businesses in specific industries use chatbots to
              automate support, capture leads, and improve the customer experience. Find your
              industry or start with the general best practices guide.
            </p>
          </div>
        </div>

        {/* Section: Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Getting Started
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            General best practices and automation strategies that apply to any business.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {strategyPosts.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Section: Industry Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Industry Guides
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            See how chatbots solve specific problems in your industry.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {industryPosts.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        
          {/* Related Industry Pages */}
          <div className="mt-10 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Related industry guides</p>
            <ul className="space-y-3">
              <li>
                <Link href="/industries" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  VocUI by Industry — All 56 Verticals →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">See how VocUI works for your specific industry — from healthcare and legal to fitness and e-commerce.</p>
              </li>
            </ul>
          </div>
          {/* CTA */}
        <section className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
            See it work for your business
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-lg mx-auto">
            Upload your FAQ, product info, or policy docs. Your chatbot will be answering
            real questions in under 10 minutes.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
          >
            Start free
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
