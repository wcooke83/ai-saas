import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'What Is a Knowledge Base Chatbot? | VocUI',
  description:
    'A knowledge base chatbot is an AI trained on your own documents, URLs, or PDFs to answer questions instantly. Learn how it works and when to use one.',
  openGraph: {
    title: 'What Is a Knowledge Base Chatbot? | VocUI',
    description:
      'A knowledge base chatbot is an AI trained on your own documents, URLs, or PDFs to answer questions instantly. Learn how it works and when to use one.',
    url: 'https://vocui.com/blog/what-is-a-knowledge-base-chatbot',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is a Knowledge Base Chatbot? | VocUI',
    description:
      'A knowledge base chatbot is an AI trained on your own documents, URLs, or PDFs to answer questions instantly. Learn how it works and when to use one.',
  },
  alternates: { canonical: 'https://vocui.com/blog/what-is-a-knowledge-base-chatbot' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What Is a Knowledge Base Chatbot?',
      description:
        'An explainer on what a knowledge base chatbot is, how it works technically, and when to use one for your business.',
      url: 'https://vocui.com/blog/what-is-a-knowledge-base-chatbot',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/what-is-a-knowledge-base-chatbot',
      },
      datePublished: '2026-03-28',
      dateModified: '2026-03-28',
      author: {
        '@type': 'Person',
        name: 'Will Cooke',
        url: 'https://vocui.com/about',
      },
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vocui.com/icon.png',
        },
      },
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/what-is-a-knowledge-base-chatbot/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a knowledge base chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "A knowledge base chatbot is an AI assistant trained on a specific set of documents, web pages, or files. When a user asks a question, the bot searches that content for the most relevant passages and generates a precise answer — without relying on generic internet knowledge.",
          },
        },
        {
          '@type': 'Question',
          name: 'How is a knowledge base chatbot different from ChatGPT?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "ChatGPT answers from its general training data — everything it learned during training. A knowledge base chatbot answers from your specific content. It won't speculate about topics outside your documents, which makes it far more reliable for business use cases where accuracy matters.",
          },
        },
        {
          '@type': 'Question',
          name: 'What content can you use to train a knowledge base chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Most platforms accept URLs (web pages to scrape), PDFs, DOCX files, plain text, and Q&A pairs. VocUI supports all of these formats.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does a knowledge base chatbot make things up?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "A well-configured knowledge base chatbot is designed to say \"I don't know\" when the answer isn't in the knowledge base, rather than fabricating an answer. The system prompt controls this behavior — you can explicitly instruct the bot to only answer from its provided content.",
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to build a knowledge base chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "With VocUI, most businesses go from zero to a deployed chatbot in under an hour. The time depends on how much content you want to add — a single help page or FAQ document can be processed in minutes.",
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WhatIsKnowledgeBaseChatbotPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                What Is a Knowledge Base Chatbot?
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Explainer
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">7 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                What Is a Knowledge Base Chatbot?
              </h1>
            </header>

            {/* Featured snippet paragraph — immediately after H1, before first H2 */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A knowledge base chatbot is an AI assistant trained on a specific set of documents,
                web pages, or files. When a user asks a question, the bot searches that content for
                the most relevant passages and generates a precise answer — without relying on
                generic internet knowledge.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How a knowledge base chatbot works
                </h2>
                <p>
                  Under the hood, a knowledge base chatbot uses a technique called
                  Retrieval-Augmented Generation (RAG). It combines two systems: a search system
                  that finds relevant content, and a language model that generates answers from that
                  content.
                </p>
                <p className="mt-4">Here&apos;s the sequence of events when someone asks a question:</p>
                <ol className="list-decimal list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Indexing (happens once, during setup):</strong> Your documents
                    are chunked into small sections. Each chunk is converted into a numerical
                    representation called an embedding — a list of numbers that captures the
                    meaning of the text. These embeddings are stored in a vector database.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Query processing:</strong> When a user asks a question, the same
                    embedding process is applied to their question. This converts their question
                    into a numerical representation.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Semantic search:</strong> The system finds the knowledge base chunks
                    whose embeddings are closest to the question&apos;s embedding. This is semantic
                    search — it matches meaning, not keywords. A question about &quot;shipping time&quot;
                    will match a passage about &quot;delivery schedule&quot; even without the exact word match.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Answer generation:</strong> The relevant chunks are passed to a
                    large language model (like Claude or GPT-4) along with the user&apos;s question.
                    The model synthesizes an answer from that content.
                  </li>
                </ol>
                <p className="mt-4">
                  The key difference from a standard AI assistant: the model is constrained to
                  answer from your content. If the answer isn&apos;t in your knowledge base, the
                  chatbot should say so — not invent something plausible.
                </p>
                <p className="mt-4">
                  You can read more about this on our dedicated{' '}
                  <Link href="/knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot
                  </Link>{' '}
                  product page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Knowledge base chatbot vs. FAQ bot
                </h2>
                <p>
                  A traditional FAQ bot works with a fixed list of questions and answers. You define
                  exactly what questions it understands and exactly what responses it gives. If
                  someone asks a question that isn&apos;t in the list — even a close variant — the bot
                  fails or gives a generic fallback response.
                </p>
                <p className="mt-4">
                  A knowledge base chatbot is fundamentally different:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    It understands the meaning of questions, not just their exact wording.
                  </li>
                  <li>
                    It generates answers dynamically from your content, rather than retrieving
                    pre-written responses.
                  </li>
                  <li>
                    It can answer follow-up questions that reference earlier parts of the
                    conversation.
                  </li>
                  <li>
                    It handles novel questions — ones you never specifically anticipated —
                    as long as the answer is somewhere in the content you provided.
                  </li>
                </ul>
                <p className="mt-4">
                  The tradeoff: FAQ bots are completely predictable (you control every response
                  exactly), while knowledge base chatbots are more flexible but require you to
                  trust the AI&apos;s synthesis. For most customer-facing use cases, the flexibility
                  wins — customers don&apos;t ask questions in perfectly predictable forms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Knowledge base chatbot vs. general AI assistant
                </h2>
                <p>
                  ChatGPT and similar general-purpose AI assistants have broad knowledge from their
                  training data — they can discuss almost any topic. But they have no knowledge of
                  your business specifically. They can&apos;t tell a customer what your return policy is,
                  what services you offer, or how your onboarding process works.
                </p>
                <p className="mt-4">
                  A knowledge base chatbot is the opposite: narrow but accurate. It knows your
                  specific content deeply and won&apos;t speculate about things outside it. For business
                  use cases — customer support, lead qualification, internal knowledge management
                  — this specificity is exactly what you need.
                </p>
                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100"></th>
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">General AI assistant</th>
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Knowledge base chatbot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700 bg-white dark:bg-secondary-800/30">
                      {[
                        ['Knows your specific content', 'No', 'Yes'],
                        ['Answers accurately about your business', 'Unlikely', 'Yes'],
                        ['Can make things up', 'Yes', 'Reduced (configurable)'],
                        ['Broad general knowledge', 'Yes', 'Scoped to your content'],
                        ['Useful for customer support', 'Risky', 'Yes'],
                      ].map(([label, general, kb]) => (
                        <tr key={label}>
                          <td className="px-4 py-3 font-medium text-secondary-700 dark:text-secondary-300">{label}</td>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{general}</td>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{kb}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What content can you train it on?
                </h2>
                <p>
                  Almost any text-based content works. The most common sources:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Website pages</strong> — your help center, FAQ page, product pages,
                    pricing page, &quot;How it works&quot; page. Paste the URL and the content is scraped
                    automatically.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">PDF documents</strong> — service guides, product manuals, brochures,
                    onboarding materials. VocUI extracts the text from multi-page PDFs.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Word documents</strong> — internal knowledge bases, policy documents,
                    staff handbooks.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Q&amp;A pairs</strong> — type questions and answers directly. This is
                    the most precise format because you control both the question and the answer
                    exactly.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Plain text</strong> — anything that doesn&apos;t fit neatly into the
                    above categories. Copy and paste it in.
                  </li>
                </ul>
                <p className="mt-4">
                  The main limitation: the content must be text. Images, video, and scanned
                  document images without OCR won&apos;t work.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Use cases
                </h2>
                <p>
                  Knowledge base chatbots work well anywhere that customers or employees are
                  asking questions that have documented answers. Common use cases:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Customer support deflection</strong> — handle routine questions
                    about pricing, policies, and product features without tickets.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Professional services intake</strong> — law firms, clinics, and
                    consultancies can use knowledge base chatbots to answer common client
                    questions and qualify leads before a call. See our guides for{' '}
                    <Link href="/chatbot-for-lawyers" className="text-primary-600 dark:text-primary-400 hover:underline">
                      law firms
                    </Link>
                    {', '}
                    <Link href="/chatbot-for-healthcare" className="text-primary-600 dark:text-primary-400 hover:underline">
                      healthcare providers
                    </Link>
                    {', and '}
                    <Link href="/chatbot-for-real-estate" className="text-primary-600 dark:text-primary-400 hover:underline">
                      real estate agents
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Internal knowledge management</strong> — deploy the chatbot in
                    Slack so employees can query internal documentation, HR policies, and
                    process guides without pinging colleagues.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">E-commerce product questions</strong> — answer questions about
                    specifications, compatibility, shipping, and returns without live agent time.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Lead qualification</strong> — a chatbot that answers prospect
                    questions and captures contact information is a low-friction way to fill your
                    pipeline.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How to build one without ML experience
                </h2>
                <p>
                  You don&apos;t need to understand embeddings, vector databases, or language models to
                  build a knowledge base chatbot today. Platforms like VocUI handle all of that
                  infrastructure automatically.
                </p>
                <p className="mt-4">The practical steps are straightforward:</p>
                <ol className="list-decimal list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>Create a chatbot in VocUI and give it a name.</li>
                  <li>Add your knowledge sources — paste a URL, upload a file, or type Q&amp;A pairs.</li>
                  <li>Wait for processing (usually under two minutes).</li>
                  <li>Test it with the built-in chat tester.</li>
                  <li>Embed the widget on your site with a single script tag.</li>
                </ol>
                <p className="mt-4">
                  The free plan gets you started with no credit card required. Most businesses are
                  live in under an hour. Read our step-by-step guide on{' '}
                  <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">
                    adding a chatbot to your website
                  </Link>
                  .
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What is a knowledge base chatbot?',
                      a: "A knowledge base chatbot is an AI assistant trained on a specific set of documents, web pages, or files. When a user asks a question, the bot searches that content for the most relevant passages and generates a precise answer — without relying on generic internet knowledge.",
                    },
                    {
                      q: 'How is a knowledge base chatbot different from ChatGPT?',
                      a: "ChatGPT answers from its general training data — everything it learned during training. A knowledge base chatbot answers from your specific content. It won't speculate about topics outside your documents, which makes it far more reliable for business use cases where accuracy matters.",
                    },
                    {
                      q: 'What content can you use to train a knowledge base chatbot?',
                      a: "Most platforms accept URLs (web pages to scrape), PDFs, DOCX files, plain text, and Q&A pairs. VocUI supports all of these formats.",
                    },
                    {
                      q: 'Does a knowledge base chatbot make things up?',
                      a: "A well-configured knowledge base chatbot is designed to say \"I don't know\" when the answer isn't in the knowledge base, rather than fabricating an answer. The system prompt controls this behavior — you can explicitly instruct the bot to only answer from its provided content.",
                    },
                    {
                      q: 'How long does it take to build a knowledge base chatbot?',
                      a: "With VocUI, most businesses go from zero to a deployed chatbot in under an hour. The time depends on how much content you want to add — a single help page or FAQ document can be processed in minutes.",
                    },
                  ].map(({ q, a }) => (
                    <div key={q} className="border-b border-secondary-200 dark:border-secondary-700 pb-6">
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{q}</dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">See the concepts in action</h2>
            <p className="text-white/80 mb-2">
              Upload a document, ask your chatbot a question, and watch it pull the right answer from your content.
            </p>
            <p className="text-white/60 text-sm mb-8">
              No technical setup. The free plan is enough to try it.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Try it with your own docs
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">No setup fee, no commitment</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
