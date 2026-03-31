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
  title: 'What Are Embeddings? A Simple Explanation | VocUI',
  description:
    'Embeddings turn text into numbers that capture meaning. Learn how AI chatbots use embeddings to find relevant answers — explained without jargon.',
  openGraph: {
    title: 'What Are Embeddings? A Simple Explanation | VocUI',
    description:
      'Embeddings turn text into numbers that capture meaning. Learn how AI chatbots use embeddings to find relevant answers — explained without jargon.',
    url: 'https://vocui.com/blog/what-are-embeddings-explained-simply',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Are Embeddings? A Simple Explanation | VocUI',
    description:
      'Embeddings turn text into numbers that capture meaning. Learn how AI chatbots use embeddings to find relevant answers — explained without jargon.',
  },
  alternates: { canonical: 'https://vocui.com/blog/what-are-embeddings-explained-simply' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What Are Embeddings? A Simple Explanation',
      description:
        'A jargon-free guide to embeddings — the numerical representations that let AI chatbots understand meaning and find relevant answers from your content.',
      url: 'https://vocui.com/blog/what-are-embeddings-explained-simply',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/what-are-embeddings-explained-simply',
      },
      datePublished: '2026-04-01',
      dateModified: '2026-04-01',
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
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are embeddings in AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Embeddings are lists of numbers (vectors) that represent the meaning of a piece of text. Words, sentences, or entire paragraphs are converted into these numerical coordinates so that similar meanings end up close together in mathematical space. This lets AI systems compare text by meaning rather than by exact word matches.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do embeddings work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An embedding model reads a piece of text and outputs a long list of numbers — typically 1,536 dimensions for modern models. Each number represents one aspect of the text\'s meaning. Texts with similar meanings produce similar lists of numbers, so the system can find related content by comparing these numerical representations using mathematical distance measures like cosine similarity.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why not just use keyword search?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Keyword search only finds exact word matches. If your documentation says "cancellation policy" but a customer asks about "how to end my subscription," keyword search fails. Embedding-based semantic search understands that these phrases mean the same thing and returns the right result regardless of wording.',
          },
        },
        {
          '@type': 'Question',
          name: 'What model creates embeddings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Several models can create embeddings. OpenAI\'s text-embedding-3-small and text-embedding-ada-002 are widely used. Google, Cohere, and open-source projects like Sentence Transformers also offer embedding models. VocUI uses OpenAI\'s embedding model for fast, high-quality results.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to know about embeddings to use a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Embeddings are the behind-the-scenes technology that makes chatbot search work. Platforms like VocUI handle embedding generation, storage, and retrieval automatically. You just add your content and the system does the rest.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WhatAreEmbeddingsExplainedSimplyPage() {
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
                What Are Embeddings?
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
                What Are Embeddings? A Simple Explanation
              </h1>
            </header>

            {/* Featured snippet paragraph */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Embeddings are lists of numbers that represent the meaning of text. They let AI
                systems compare words, sentences, and documents by meaning rather than by exact
                wording — which is how chatbots find the right answer even when a question is
                phrased differently from the source material.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What embeddings are (the analogy)
                </h2>
                <p>
                  Imagine you have a giant library with thousands of books, and you need to find
                  the ones most relevant to a specific question. You could search by title or by
                  scanning for exact keywords, but that would miss books that discuss the same
                  topic using different words. What you really want is to search by meaning.
                </p>
                <p className="mt-4">
                  Embeddings make this possible. An embedding model reads a piece of text and
                  assigns it a location in a mathematical space — like GPS coordinates, but with
                  hundreds of dimensions instead of just latitude and longitude. Texts that mean
                  similar things get assigned nearby coordinates. &quot;How do I cancel my account?&quot;
                  and &quot;Steps to close my subscription&quot; end up close together, even though they
                  share almost no words, because their meaning is similar.
                </p>
                <p className="mt-4">
                  This is what makes modern AI chatbots fundamentally different from old keyword-based
                  search. When someone asks your chatbot a question, the system doesn&apos;t look for
                  exact word matches in your documents — it looks for the closest meaning. That&apos;s
                  embeddings at work.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How text becomes numbers
                </h2>
                <p>
                  An embedding model is a neural network trained on massive amounts of text. It
                  learned patterns about which words appear in similar contexts, which phrases mean
                  the same thing, and how concepts relate to each other. When you feed it a sentence,
                  it outputs a list of numbers — typically 1,536 numbers for models like OpenAI&apos;s
                  text-embedding-3-small.
                </p>
                <p className="mt-4">
                  Each number in the list represents one dimension of meaning. No single number maps
                  neatly to a concept you&apos;d recognize (like &quot;topic&quot; or &quot;sentiment&quot;), but
                  taken together, the list captures the overall semantic content of the text. You
                  can think of it like a fingerprint for meaning — two texts with similar meanings
                  will produce similar fingerprints.
                </p>
                <p className="mt-4">
                  The conversion is one-directional: you can go from text to embedding, but you
                  can&apos;t reconstruct the original text from the embedding alone. The embedding
                  captures what the text means, not exactly how it was worded. This is a feature,
                  not a limitation — it&apos;s why &quot;refund policy&quot; and &quot;how to get my money back&quot;
                  produce similar embeddings even though the words are entirely different.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why embeddings matter for chatbots
                </h2>
                <p>
                  When you build a chatbot and add your knowledge base — help articles, product
                  docs, FAQs — each piece of content is split into chunks and each chunk is
                  converted into an embedding. These embeddings are stored in a vector database.
                  This is the indexing step of{' '}
                  <Link href="/blog/what-is-rag-retrieval-augmented-generation" className="text-primary-600 dark:text-primary-400 hover:underline">
                    RAG (Retrieval-Augmented Generation)
                  </Link>.
                </p>
                <p className="mt-4">
                  When a visitor asks a question, the same embedding model converts their question
                  into an embedding. The system then compares the question&apos;s embedding against all
                  the stored chunk embeddings to find the closest matches. The closest matches are
                  the most semantically relevant pieces of your content — the ones most likely to
                  contain the answer.
                </p>
                <p className="mt-4">
                  These matched chunks are then passed to a language model (like Claude or GPT-4),
                  which reads them along with the question and generates a natural-language answer.
                  The quality of the final answer depends heavily on the quality of the retrieval
                  step — and the retrieval step depends entirely on embeddings. Good embeddings
                  mean the right content gets retrieved. Wrong content retrieved means a wrong or
                  irrelevant answer, no matter how capable the language model is.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Semantic search vs keyword search
                </h2>
                <p>
                  Traditional search engines and most website search bars use keyword matching.
                  They look for documents that contain the exact words (or close variations) in
                  the query. This works reasonably well when you know the right terminology, but
                  breaks down in everyday conversation.
                </p>
                <p className="mt-4">
                  Consider a customer asking: &quot;Can I get my money back if I don&apos;t like the
                  product?&quot; Your documentation might have a section titled &quot;Refund and Return
                  Policy.&quot; A keyword search for &quot;money back&quot; might not match &quot;refund&quot; or
                  &quot;return.&quot; A semantic search using embeddings would match instantly because
                  the meanings are closely related.
                </p>
                <p className="mt-4">
                  This distinction matters enormously for chatbots. Your customers don&apos;t know
                  your internal terminology. They ask questions in their own words, often
                  informally. Embedding-based search bridges that gap by matching intent rather
                  than vocabulary. According to{' '}
                  <a href="https://dev.to/klement_gunndu_e16216829c/vector-databases-guide-rag-applications-2025-55oj" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">compiled industry research</a>,
                  companies report 40-60% faster resolution times with semantic search compared to
                  manual keyword-based search. It&apos;s the reason a well-built{' '}
                  <Link href="/blog/what-is-a-knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot
                  </Link>{' '}
                  feels like it actually understands questions rather than just pattern-matching
                  keywords.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How VocUI uses embeddings
                </h2>
                <p>
                  When you add a knowledge source in VocUI — whether it&apos;s a URL to scrape, a
                  PDF to parse, or text you type directly — the platform automatically processes
                  your content through the embedding pipeline. Your text is chunked into
                  overlapping sections (to preserve context at chunk boundaries), each chunk is
                  embedded using OpenAI&apos;s embedding model, and the resulting vectors are stored
                  in Supabase with pgvector.
                </p>
                <p className="mt-4">
                  At query time, VocUI uses a Supabase RPC function to perform a cosine similarity
                  search across all stored embeddings. The top matching chunks are returned in
                  milliseconds, then passed to the language model along with the user&apos;s question
                  and your system prompt. The entire process — from question to answer — typically
                  takes 1-3 seconds.
                </p>
                <p className="mt-4">
                  You never interact with embeddings directly. There&apos;s no configuration, no
                  tuning, no vector database to manage. The system is designed so that you focus
                  on your content and your chatbot&apos;s personality, while the embedding
                  infrastructure runs invisibly underneath. Read more about how it all fits together in our{' '}
                  <Link href="/blog/what-is-rag-retrieval-augmented-generation" className="text-primary-600 dark:text-primary-400 hover:underline">
                    RAG explainer
                  </Link>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The limits of embeddings
                </h2>
                <p>
                  Embeddings are powerful, but they aren&apos;t perfect. Understanding their limitations
                  helps you build a better chatbot.
                </p>
                <p className="mt-4">
                  First, embeddings capture semantic similarity, not logical relationships. They
                  can tell that &quot;dog&quot; and &quot;puppy&quot; are related, but they don&apos;t inherently
                  understand that &quot;all puppies are dogs but not all dogs are puppies.&quot; For most
                  chatbot use cases, this distinction doesn&apos;t matter — but it&apos;s worth knowing.
                </p>
                <p className="mt-4">
                  Second, embedding quality depends on the model used. Different embedding models
                  have different strengths. Some handle technical jargon better than others. Some
                  perform better with long passages versus short phrases. VocUI uses OpenAI&apos;s
                  embedding models, which offer strong general-purpose performance across most
                  business content types.
                </p>
                <p className="mt-4">
                  Third, very short or very ambiguous text can produce less useful embeddings.
                  A single word like &quot;bank&quot; could mean a financial institution or the side of
                  a river. More context produces better embeddings, which is one reason why
                  knowledge base content should be written clearly and with enough surrounding
                  detail to convey meaning unambiguously.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What are embeddings in AI?',
                      a: 'Embeddings are lists of numbers (vectors) that represent the meaning of a piece of text. Words, sentences, or entire paragraphs are converted into these numerical coordinates so that similar meanings end up close together in mathematical space. This lets AI systems compare text by meaning rather than by exact word matches.',
                    },
                    {
                      q: 'How do embeddings work?',
                      a: "An embedding model reads a piece of text and outputs a long list of numbers — typically 1,536 dimensions for modern models. Each number represents one aspect of the text's meaning. Texts with similar meanings produce similar lists of numbers, so the system can find related content by comparing these numerical representations using mathematical distance measures like cosine similarity.",
                    },
                    {
                      q: 'Why not just use keyword search?',
                      a: 'Keyword search only finds exact word matches. If your documentation says "cancellation policy" but a customer asks about "how to end my subscription," keyword search fails. Embedding-based semantic search understands that these phrases mean the same thing and returns the right result regardless of wording.',
                    },
                    {
                      q: 'What model creates embeddings?',
                      a: "Several models can create embeddings. OpenAI's text-embedding-3-small and text-embedding-ada-002 are widely used. Google, Cohere, and open-source projects like Sentence Transformers also offer embedding models. VocUI uses OpenAI's embedding model for fast, high-quality results.",
                    },
                    {
                      q: 'Do I need to know about embeddings to use a chatbot?',
                      a: 'No. Embeddings are the behind-the-scenes technology that makes chatbot search work. Platforms like VocUI handle embedding generation, storage, and retrieval automatically. You just add your content and the system does the rest.',
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
