import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, BookOpen, Star } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Knowledge Base Chatbot Guide | VocUI',
  description:
    'Everything you need to build, train, and deploy an AI chatbot powered by your own content. Guides on RAG, embeddings, accuracy, and more.',
  openGraph: {
    title: 'Knowledge Base Chatbot Guide | VocUI',
    description:
      'Everything you need to build, train, and deploy an AI chatbot powered by your own content. Guides on RAG, embeddings, accuracy, and more.',
    url: 'https://vocui.com/blog/knowledge-base-chatbot-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge Base Chatbot Guide | VocUI',
    description:
      'Everything you need to build, train, and deploy an AI chatbot powered by your own content. Guides on RAG, embeddings, accuracy, and more.',
  },
  alternates: { canonical: 'https://vocui.com/blog/knowledge-base-chatbot-guide' },
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
      'Practical steps to fix vague or incorrect answers -- from better knowledge sources to smarter system prompts.',
    readTime: '8 min read',
    tag: 'Guide',
  },
];

const techDeepDives: SpokePost[] = [
  {
    slug: 'what-is-rag-retrieval-augmented-generation',
    title: 'What Is RAG? Retrieval-Augmented Generation Explained',
    description:
      'The technique behind knowledge base chatbots. Learn how RAG combines search with AI generation to produce accurate answers.',
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
      '@type': 'CollectionPage',
      name: 'The Complete Guide to Knowledge Base Chatbots',
      description:
        'Everything you need to know about building, training, and deploying AI chatbots powered by your own content.',
      url: 'https://vocui.com/blog/knowledge-base-chatbot-guide',
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
          name: 'Knowledge Base Chatbot Guide',
          item: 'https://vocui.com/blog/knowledge-base-chatbot-guide',
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

export default function KnowledgeBaseChatbotGuidePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content" className="container mx-auto px-4 py-16 max-w-4xl">
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
              Knowledge Base Chatbot Guide
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
              9 articles
            </span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            The Complete Guide to Knowledge Base Chatbots
          </h1>
          <div className="text-lg text-secondary-600 dark:text-secondary-400 space-y-3">
            <p>
              A knowledge base chatbot answers questions from your own content -- your docs,
              FAQs, PDFs, and web pages -- instead of making things up from general training
              data. The result is accurate, on-brand answers that your customers and team can
              trust.
            </p>
            <p>
              This guide covers everything from the fundamentals to the underlying technology.
              Whether you are evaluating knowledge base chatbots for the first time or
              optimizing one you have already built, start with the articles below.
            </p>
          </div>
        </div>

        {/* Section: Fundamentals */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Fundamentals
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            What knowledge base chatbots are, how to train one, and how to prepare your content.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {fundamentals.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Section: Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Use Cases
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            Practical guides for FAQ chatbots, internal knowledge bots, and accuracy optimization.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {useCases.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Section: How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            How It Works Under the Hood
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            Technical explainers on the AI techniques that power knowledge base chatbots.
          </p>
          <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {techDeepDives.map((post) => (
              <SpokeCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
            Ready to build your own knowledge base chatbot?
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-lg mx-auto">
            Upload your docs, train your chatbot, and embed it on your site in under 10
            minutes. No coding required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
          >
            Get started free
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
