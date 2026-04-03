import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { GuideHero } from './guide-hero';
import { GuideGettingStarted } from './guide-getting-started';
import { GuideIndustryGrid } from './guide-industry-grid';
import { GuideCta } from './guide-cta';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Chatbot for Business: 12 Industry Guides | VocUI',
  description:
    'Learn how businesses use AI chatbots to automate support, capture leads, and answer FAQs 24/7. Guides for restaurants, finance, insurance, SaaS, and more.',
  keywords: [
    'chatbot for business',
    'AI chatbot for small business',
    'business chatbot',
    'industry chatbot guide',
    'customer support chatbot',
  ],
  openGraph: {
    title: 'Chatbot for Business: 12 Industry Guides | VocUI',
    description:
      'Learn how businesses use AI chatbots to automate support, capture leads, and answer FAQs 24/7. Guides for restaurants, finance, insurance, SaaS, and more.',
    url: 'https://vocui.com/guides/chatbot-for-business',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot for Business: 12 Industry Guides | VocUI',
    description:
      'Learn how businesses use AI chatbots to automate support, capture leads, and answer FAQs 24/7. Guides for restaurants, finance, insurance, SaaS, and more.',
  },
  alternates: { canonical: 'https://vocui.com/guides/chatbot-for-business' },
  robots: { index: true, follow: true },
};

// ─── Spoke Posts ────────────────────────────────────────────────────────────────

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
      'An AI chatbot handles menu, hours, reservation, and dietary questions — so staff can focus on guests instead of the phone.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-education',
    title: 'AI Chatbots for Education',
    description:
      'Students ask the same questions about enrollment, deadlines, and courses. An AI chatbot gives them instant answers, day or night.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-financial-services',
    title: 'AI Chatbots for Financial Services',
    description:
      'Let an AI chatbot answer client questions about fees, services, and processes — while keeping every response compliant.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-recruitment',
    title: 'AI Chatbots for Recruitment',
    description:
      'Put an AI chatbot on your careers page to answer candidate questions, pre-screen applicants, and shorten time-to-hire.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-nonprofits',
    title: 'AI Chatbots for Nonprofits',
    description:
      'Engage donors, recruit volunteers, and share program details around the clock — with an AI chatbot that never stretches your small team thinner.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-insurance',
    title: 'AI Chatbots for Insurance',
    description:
      'Policy questions, coverage explanations, lead qualification — an AI chatbot handles the calls your agents shouldn\'t have to take.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-travel-agencies',
    title: 'AI Chatbots for Travel Agencies',
    description:
      'Answer destination and booking questions 24/7 with an AI chatbot that captures leads and walks travelers through your packages.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-fitness-studios',
    title: 'AI Chatbots for Gyms and Fitness Studios',
    description:
      'Membership questions, class schedules, pricing — an AI chatbot answers them all and turns website visitors into members.',
    readTime: '6 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-accounting-firms',
    title: 'AI Chatbots for Accounting Firms',
    description:
      'Give clients an AI chatbot that answers questions about services, deadlines, and required documents — so your team bills more hours, not fewer.',
    readTime: '7 min read',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-saas-onboarding',
    title: 'AI Chatbots for SaaS Onboarding',
    description:
      'Guide new users through onboarding with an AI chatbot that answers setup questions and gets them to value faster.',
    readTime: '8 min read',
    tag: 'Use Case',
  },
];

const strategyPosts: SpokePost[] = [
  {
    slug: 'chatbot-best-practices-for-small-business',
    title: 'Chatbot Best Practices for Small Business Owners',
    description:
      'Nine practical best practices for small businesses — from building your knowledge base to writing chatbot instructions and testing.',
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

// ─── JSON-LD ────────────────────────────────────────────────────────────────────

const allPosts = [...strategyPosts, ...industryPosts];

const faqEntries = [
  {
    question: 'What is an AI chatbot for business?',
    answer:
      'It\'s a chatbot trained on your own content — FAQs, product info, policies — that answers customer questions instantly on your website, Slack, or Telegram. You control what it knows and how it responds.',
  },
  {
    question: 'Which industries benefit most from AI chatbots?',
    answer:
      'Any business that answers the same questions repeatedly. Restaurants, financial services, insurance, education, recruitment, nonprofits, travel, fitness, accounting, and SaaS companies all see strong results.',
  },
  {
    question: 'How long does it take to set up a business chatbot?',
    answer:
      'With VocUI, you upload your content and have a working chatbot in under 10 minutes. No coding required — just your existing docs, URLs, or PDFs.',
  },
  {
    question: 'Can I customize the chatbot for my specific industry?',
    answer:
      'Yes. Your chatbot learns from your own content — URLs, PDFs, and documents — so every answer is specific to your business. You can also customize its tone and behavior.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://vocui.com/guides/chatbot-for-business',
      name: 'Chatbot for Business: 12 Industry Guides',
      description:
        'Learn how businesses use AI chatbots to automate support, capture leads, and answer FAQs 24/7. Guides for restaurants, finance, insurance, SaaS, and more.',
      url: 'https://vocui.com/guides/chatbot-for-business',
      dateCreated: '2026-03-08',
      dateModified: '2026-04-04',
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
      },
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
        '@type': 'WebSite',
        name: 'VocUI',
        url: 'https://vocui.com',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqEntries.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://vocui.com/guides' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Chatbot for Business',
          item: 'https://vocui.com/guides/chatbot-for-business',
        },
      ],
    },
  ],
};

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ChatbotForBusinessGuidePage() {
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

        {/* ── Getting Started: light tint, side-by-side featured cards ──────── */}
        <GuideGettingStarted posts={strategyPosts} />

        {/* ── Industry Guides: full-bleed dark, 2-col grid with icons ──────── */}
        <GuideIndustryGrid posts={industryPosts} />

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-4">
              Common questions
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-12">
              Frequently Asked Questions
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              {faqEntries.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    {faq.question}
                  </dt>
                  <dd className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Related strip + gradient CTA ─────────────────────────────────── */}
        <GuideCta />

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
