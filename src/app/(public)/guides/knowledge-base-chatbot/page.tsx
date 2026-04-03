import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  ArrowRight,
  BookOpen,
  Star,
  HelpCircle,
  Users,
  Target,
  Brain,
  Hash,
  Search,
  type LucideIcon,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Knowledge Base Chatbot: The Complete Guide | VocUI',
  description:
    'Your complete guide to building AI chatbots that answer from your own docs, FAQs, and knowledge base. Learn how retrieval-augmented generation, embeddings, and content training power accurate answers.',
  openGraph: {
    title: 'Knowledge Base Chatbot: The Complete Guide | VocUI',
    description:
      'Your complete guide to building AI chatbots that answer from your own docs, FAQs, and knowledge base. Learn how retrieval-augmented generation, embeddings, and content training power accurate answers.',
    url: 'https://vocui.com/guides/knowledge-base-chatbot',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge Base Chatbot: The Complete Guide | VocUI',
    description:
      'Your complete guide to building AI chatbots that answer from your own docs, FAQs, and knowledge base. Learn how retrieval-augmented generation, embeddings, and content training power accurate answers.',
  },
  alternates: { canonical: 'https://vocui.com/guides/knowledge-base-chatbot' },
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

const fundamentals: SpokePost[] = [
  {
    slug: 'what-is-a-knowledge-base-chatbot',
    title: 'What Is a Knowledge Base Chatbot?',
    description:
      'Understand what a knowledge base chatbot is, how it differs from general-purpose AI, and when your business needs one.',
    readTime: '7 min read',
    tag: 'Explainer',
    startHere: true,
  },
  {
    slug: 'how-to-train-chatbot-on-your-own-data',
    title: 'How to Train a Chatbot on Your Own Data',
    description:
      'Step-by-step guide to uploading PDFs, URLs, and documents to create a chatbot that answers from your content.',
    readTime: '9 min read',
    tag: 'Guide',
  },
  {
    slug: 'knowledge-base-content-best-practices',
    title: 'How to Organize Your Knowledge Base for Better Answers',
    description:
      'Structure your content so the chatbot finds the right answers every time. Practical formatting and organization tips.',
    readTime: '8 min read',
    tag: 'Best Practice',
  },
];

const useCases: SpokePost[] = [
  {
    slug: 'how-to-create-faq-chatbot',
    title: 'How to Create an FAQ Chatbot in Minutes',
    description:
      'Turn your FAQ page into an interactive chatbot that answers customer questions instantly.',
    readTime: '6 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-build-internal-knowledge-bot',
    title: 'How to Build an Internal Knowledge Bot for Your Team',
    description:
      'Deploy a chatbot in Slack or on your intranet that answers HR, policy, and process questions from internal docs.',
    readTime: '8 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-improve-chatbot-accuracy',
    title: "How to Improve Your Chatbot's Answer Accuracy",
    description:
      'Practical steps to fix vague or incorrect answers — from better knowledge sources to smarter chatbot instructions.',
    readTime: '8 min read',
    tag: 'Guide',
  },
];

const techDeepDives: SpokePost[] = [
  {
    slug: 'what-is-rag-retrieval-augmented-generation',
    title: 'What Is RAG? Retrieval-Augmented Generation Explained',
    description:
      'How your chatbot combines search with AI to answer from your content — and why it\'s more accurate than general-purpose AI.',
    readTime: '9 min read',
    tag: 'Explainer',
  },
  {
    slug: 'what-are-embeddings-explained-simply',
    title: 'What Are Embeddings? A Simple Explanation',
    description:
      'How AI turns text into numbers that capture meaning, and why this matters for finding relevant answers.',
    readTime: '7 min read',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-vector-search',
    title: 'What Is Vector Search? How AI Chatbots Find Answers',
    description:
      'Vector search finds content by meaning, not keywords. Understand the search layer that powers accurate chatbot responses.',
    readTime: '8 min read',
    tag: 'Explainer',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const allPosts = [...fundamentals, ...useCases, ...techDeepDives];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebPage', 'CollectionPage'],
      '@id': 'https://vocui.com/guides/knowledge-base-chatbot',
      name: 'The Complete Guide to Knowledge Base Chatbots',
      description:
        'Everything you need to know about building, training, and deploying AI chatbots powered by your own content.',
      url: 'https://vocui.com/guides/knowledge-base-chatbot',
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
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://vocui.com/guides' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Knowledge Base Chatbot Guide',
          item: 'https://vocui.com/guides/knowledge-base-chatbot',
        },
      ],
    },
  ],
};

// ─── Icon maps ────────────────────────────────────────────────────────────────

const useCaseIcons: Record<string, LucideIcon> = {
  'how-to-create-faq-chatbot': HelpCircle,
  'how-to-build-internal-knowledge-bot': Users,
  'how-to-improve-chatbot-accuracy': Target,
};

const techIcons: Record<string, LucideIcon> = {
  'what-is-rag-retrieval-augmented-generation': Brain,
  'what-are-embeddings-explained-simply': Hash,
  'what-is-vector-search': Search,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KnowledgeBaseChatbotGuidePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────────────────────
            Full-bleed dark section. Display-scale headline, inline stats.
            Deliberately breaks out of the max-w-4xl blog column constraint.
        ────────────────────────────────────────────────────────────────────── */}
        <section className="relative w-full bg-primary-950 pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
          {/* Ambient radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 25% 65%, rgba(14,165,233,0.09) 0%, transparent 58%)',
            }}
          />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.18em] bg-primary-500/15 text-primary-400 border border-primary-500/20">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  Topic Guide
                </span>
              </div>

              {/* Headline — display scale for drama */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8">
                The Complete Guide to{' '}
                <span className="text-primary-400">Knowledge Base</span>{' '}
                Chatbots
              </h1>

              {/* Value statement */}
              <p className="text-lg sm:text-xl text-primary-200/60 leading-relaxed max-w-2xl mb-12">
                Learn how to build a chatbot that answers from your own docs, FAQs, and
                knowledge base — then deploy it on your site. Nine guides, three tracks.
                Start at the beginning or jump to what you need.
              </p>

              {/* Inline stat row */}
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                <div>
                  <span className="block text-4xl font-bold text-white tracking-tight">9</span>
                  <span className="text-xs text-primary-200/50 uppercase tracking-widest">
                    in-depth guides
                  </span>
                </div>
                <div className="w-px h-10 bg-primary-800/60 hidden sm:block" aria-hidden="true" />
                <div>
                  <span className="block text-4xl font-bold text-white tracking-tight">3</span>
                  <span className="text-xs text-primary-200/50 uppercase tracking-widest">
                    learning paths
                  </span>
                </div>
                <div className="w-px h-10 bg-primary-800/60 hidden sm:block" aria-hidden="true" />
                <div>
                  <span className="block text-sm font-medium text-primary-200/55 leading-snug max-w-[15rem]">
                    From first principles to a live chatbot on your site
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Track 1: Fundamentals ────────────────────────────────────────
            Light tint bg. Featured "Start Here" hero card at editorial scale,
            two supporting cards in a 2-col row below. Asymmetric, hierarchical.
        ────────────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 lg:mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-3">
                Track 1 — Fundamentals
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
                What knowledge base chatbots are and how to train one
              </h2>
              <p className="text-secondary-500 dark:text-secondary-400 max-w-xl">
                Three guides, read in order. By the end you&apos;ll know what a knowledge base
                chatbot is, how to train one, and how to get better answers from it.
              </p>
            </div>

            {/* Featured "Start Here" card — full width, asymmetric internal layout */}
            <article className="group relative rounded-lg border-2 border-primary-300 dark:border-primary-700 bg-white dark:bg-secondary-800 shadow-sm overflow-hidden mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left accent column */}
                <div className="lg:col-span-4 bg-primary-500 dark:bg-primary-600 px-6 py-8 lg:px-8 lg:py-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-4 h-4 text-white/90" aria-hidden="true" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                        Start here
                      </span>
                    </div>
                    <span className="block text-7xl lg:text-8xl font-black text-white/20 leading-none tracking-tight" aria-hidden="true">
                      01
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                      {fundamentals[0].tag}
                    </span>
                    <span className="text-xs text-white/60">
                      {fundamentals[0].readTime}
                    </span>
                  </div>
                </div>

                {/* Right content */}
                <div className="lg:col-span-8 px-6 py-8 lg:px-10 lg:py-10 flex flex-col justify-center">
                  <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                    {fundamentals[0].title}
                  </h3>
                  <p className="text-base text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6 max-w-xl">
                    {fundamentals[0].description}
                  </p>
                  <Link
                    href={`/blog/${fundamentals[0].slug}`}
                    className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 gap-1.5 group-hover:gap-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    Start reading
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Two supporting cards — 2-col, visually subordinate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fundamentals.slice(1).map((post, index) => (
                <article
                  key={post.slug}
                  className="group relative rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-start gap-5">
                    {/* Step number */}
                    <span className="shrink-0 text-4xl font-black text-secondary-200 dark:text-secondary-700 leading-none tracking-tight" aria-hidden="true">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          {post.tag}
                        </span>
                        <span className="text-xs text-secondary-400 dark:text-secondary-500">
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        Read article
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Track 2: Use Cases ──────────────────────────────────────────────
            Full-bleed dark section — the mid-page visual turn. Horizontal
            strip rows with icon, number, and copy side-by-side. Inspired by
            the AboutBeliefs pattern: divide-y, asymmetric columns, large
            decorative numbers.
        ────────────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-primary-950 py-24 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-14 lg:mb-20">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-400 mb-3">
                  Track 2 — Use Cases
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Put it to work: FAQ bots, internal tools, and more
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-primary-200/50 lg:text-lg leading-relaxed">
                  Already know the basics? Go straight to what you&apos;re building — an FAQ bot,
                  an internal knowledge tool, or a chatbot you need to trust.
                </p>
              </div>
            </div>

            {/* Horizontal strip rows */}
            <div className="divide-y divide-primary-800/40">
              {useCases.map((post, index) => {
                const Icon: LucideIcon = useCaseIcons[post.slug] ?? HelpCircle;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 py-8 lg:py-10 items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950 rounded"
                  >
                    {/* Number + icon */}
                    <div className="lg:col-span-2 flex items-center gap-4 lg:gap-5">
                      <span className="text-3xl lg:text-4xl font-black text-primary-500/25 leading-none tracking-tight" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-4">
                      <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-primary-400 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/15 text-primary-300">
                          {post.tag}
                        </span>
                        <span className="text-xs text-primary-200/40">
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-5">
                      <p className="text-sm text-primary-200/50 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="lg:col-span-1 flex justify-end">
                      <ArrowRight className="w-5 h-5 text-primary-500/40 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Track 3: Tech Deep Dives ────────────────────────────────────────
            Light section. Asymmetric 5/7 layout: editorial intro left,
            stacked reference list right with left-border accent lines.
            Compact, reference-shelf feel — not cards.
        ────────────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-secondary-50 dark:bg-secondary-900 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

              {/* Left column — editorial intro, sticky on desktop */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-primary-400 mb-3">
                  Track 3 — Under the Hood
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-5">
                  How your chatbot finds and delivers answers
                </h2>
                <p className="text-secondary-500 dark:text-secondary-400 leading-relaxed mb-6">
                  Understand the AI techniques that power your chatbot&apos;s accuracy — written
                  for builders, not researchers. Read these when you want to know the &ldquo;why&rdquo;
                  behind how your chatbot finds and delivers answers.
                </p>
                <div className="hidden lg:flex items-center gap-3 text-xs text-secondary-400 dark:text-secondary-500">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>3 explainers &middot; ~24 min total</span>
                </div>
              </div>

              {/* Right column — stacked reference rows with left accent */}
              <div className="lg:col-span-7">
                <div className="space-y-0">
                  {techDeepDives.map((post) => {
                    const Icon: LucideIcon = techIcons[post.slug] ?? Brain;
                    return (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block border-l-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-400 pl-6 lg:pl-8 py-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-r"
                      >
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400">
                                {post.tag}
                              </span>
                              <span className="text-xs text-secondary-400 dark:text-secondary-500">
                                {post.readTime}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
                              {post.description}
                            </p>
                          </div>
                          <ArrowRight className="shrink-0 w-4 h-4 mt-1 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────────
            Full-bleed gradient — SaaS landing page energy, not a bordered box.
            Asymmetric: copy left, decorative stat panels right (hidden on mobile).
        ────────────────────────────────────────────────────────────────────── */}
        <section
          className="relative w-full py-24 lg:py-32 overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(3,105,161) 40%, rgb(8,47,73) 100%)',
          }}
        >
          {/* Decorative highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)',
            }}
          />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left: CTA copy */}
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200/55 mb-6">
                  Now you know how — here's where you build it
                </p>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                  Your chatbot is 10 minutes away.
                </h2>
                <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg">
                  Upload your docs, train your chatbot, and embed it on your site. No coding
                  required. Free plan available.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="/login?mode=signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold text-base rounded-sm hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/knowledge-base-chatbot"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-medium text-base rounded-sm border border-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    See how it works
                  </Link>
                </div>
                <p className="mt-6 text-sm text-white/40">No credit card required.</p>
              </div>

              {/* Right: decorative stat panels — desktop only */}
              <div
                className="lg:col-span-5 hidden lg:flex flex-col gap-5 items-stretch"
                aria-hidden="true"
              >
                <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-5">
                  <span className="block text-5xl font-bold text-white tracking-tight mb-1">
                    9
                  </span>
                  <span className="text-xs text-primary-200/50 uppercase tracking-widest">
                    in-depth guides
                  </span>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-5">
                  <span className="block text-5xl font-bold text-white tracking-tight mb-1">
                    &lt;10
                  </span>
                  <span className="text-xs text-primary-200/50 uppercase tracking-widest">
                    minutes to deploy
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
