import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Blog | VocUI',
  description:
    'Tips, guides, and strategies for small businesses using AI chatbots.',
  openGraph: {
    title: 'Blog | VocUI',
    description: 'Tips, guides, and strategies for small businesses using AI chatbots.',
    url: 'https://vocui.com/blog',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | VocUI',
    description: 'Tips, guides, and strategies for small businesses using AI chatbots.',
  },
  alternates: { canonical: 'https://vocui.com/blog' },
  robots: { index: true, follow: true },
};

// ─── Posts ─────────────────────────────────────────────────────────────────────

const posts = [
  {
    slug: 'how-to-add-chatbot-to-website',
    title: 'How to Add a Chatbot to Your Website (No Coding Required)',
    description:
      'Learn how to add a chatbot to your website in minutes — no coding required. Train it on your content, embed one script tag, and go live today.',
    readTime: '7 min read',
    tag: 'Guide',
  },
  {
    slug: 'how-to-train-chatbot-on-your-own-data',
    title: 'How to Train a Chatbot on Your Own Data',
    description:
      'Train an AI chatbot on your own PDFs, URLs, and documents — no ML experience needed. Step-by-step guide to building a knowledge base chatbot with VocUI.',
    readTime: '9 min read',
    tag: 'Guide',
  },
  {
    slug: 'chatbase-alternatives',
    title: '5 Chatbase Alternatives Worth Trying in 2025',
    description:
      'Looking for a Chatbase alternative? Compare the top AI chatbot builders on pricing, knowledge base support, Slack integration, and embed options.',
    readTime: '11 min read',
    tag: 'Comparison',
  },
  {
    slug: 'how-to-reduce-customer-support-tickets',
    title: 'How to Reduce Customer Support Tickets with AI',
    description:
      'Cut support ticket volume by up to 40% with an AI chatbot that answers questions instantly from your knowledge base — no agent intervention needed.',
    readTime: '9 min read',
    tag: 'Strategy',
  },
  {
    slug: 'what-is-a-knowledge-base-chatbot',
    title: 'What Is a Knowledge Base Chatbot?',
    description:
      'A knowledge base chatbot is an AI trained on your own documents, URLs, or PDFs to answer questions instantly. Learn how it works and when to use one.',
    readTime: '7 min read',
    tag: 'Explainer',
  },
];

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'VocUI Blog',
  description: 'Tips, guides, and strategies for small businesses using AI chatbots.',
  url: 'https://vocui.com/blog',
  itemListElement: posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `https://vocui.com/blog/${post.slug}`,
    name: post.title,
  })),
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BlogIndexPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">Blog</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            VocUI Blog
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            Practical guides for small business owners building AI chatbots — no technical background required.
          </p>
        </div>

        {/* Post list */}
        <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
          {posts.map((post) => (
            <article key={post.slug} className="py-8 group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    {post.tag}
                  </span>
                  <span className="text-xs text-secondary-400 dark:text-secondary-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-3">
                  {post.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
                  Read article
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
