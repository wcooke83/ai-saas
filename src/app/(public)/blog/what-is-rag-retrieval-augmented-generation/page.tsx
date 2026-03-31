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
  title: 'What Is RAG? Retrieval-Augmented Generation Explained | VocUI',
  description:
    'RAG (Retrieval-Augmented Generation) is the technique behind knowledge base chatbots. Learn how it works, why it matters, and how it reduces hallucinations.',
  openGraph: {
    title: 'What Is RAG? Retrieval-Augmented Generation Explained | VocUI',
    description:
      'RAG (Retrieval-Augmented Generation) is the technique behind knowledge base chatbots. Learn how it works, why it matters, and how it reduces hallucinations.',
    url: 'https://vocui.com/blog/what-is-rag-retrieval-augmented-generation',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is RAG? Retrieval-Augmented Generation Explained | VocUI',
    description:
      'RAG (Retrieval-Augmented Generation) is the technique behind knowledge base chatbots. Learn how it works, why it matters, and how it reduces hallucinations.',
  },
  alternates: { canonical: 'https://vocui.com/blog/what-is-rag-retrieval-augmented-generation' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What Is RAG? Retrieval-Augmented Generation Explained',
      description:
        'An explainer on Retrieval-Augmented Generation (RAG) — the technique that powers knowledge base chatbots by grounding AI answers in your own content.',
      url: 'https://vocui.com/blog/what-is-rag-retrieval-augmented-generation',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/what-is-rag-retrieval-augmented-generation',
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
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/what-is-rag-retrieval-augmented-generation/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does RAG stand for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RAG stands for Retrieval-Augmented Generation. It is a technique that combines information retrieval (searching a knowledge base) with text generation (using a large language model) to produce answers grounded in specific source documents rather than general training data.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is RAG different from fine-tuning?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fine-tuning permanently changes a model\'s weights by retraining it on new data, which is expensive and hard to update. RAG keeps the model unchanged and instead retrieves relevant documents at query time, making it cheaper, easier to update, and more transparent since you can trace answers back to specific source passages.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does RAG eliminate hallucinations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RAG significantly reduces hallucinations but does not eliminate them entirely. By grounding answers in retrieved documents, the model is far less likely to fabricate information. However, it can still occasionally misinterpret or incorrectly combine passages. A well-written system prompt that instructs the model to say "I don\'t know" when unsure further reduces this risk.',
          },
        },
        {
          '@type': 'Question',
          name: 'What databases does RAG use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RAG typically uses a vector database to store and search document embeddings. Common options include Supabase with pgvector, Pinecone, Weaviate, and Qdrant. VocUI uses Supabase with pgvector for fast, scalable semantic search across your knowledge base.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to understand RAG to use a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. RAG is the underlying technology, but platforms like VocUI handle all of it automatically. You just upload your content — URLs, PDFs, or documents — and the system takes care of chunking, embedding, retrieval, and generation behind the scenes.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WhatIsRagRetrievalAugmentedGenerationPage() {
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
                What Is RAG?
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
                <span className="text-xs text-secondary-400 dark:text-secondary-500">9 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                What Is RAG? Retrieval-Augmented Generation Explained
              </h1>
            </header>

            {/* Featured snippet paragraph */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                RAG (Retrieval-Augmented Generation) is a technique that combines document
                retrieval with AI text generation. Instead of answering from memory alone, a
                RAG system searches your knowledge base for relevant content and uses it to
                generate grounded, accurate responses.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  RAG in one sentence
                </h2>
                <p>
                  Retrieval-Augmented Generation is the practice of fetching relevant documents
                  from a knowledge base and passing them to a language model so it can answer
                  questions using your specific content instead of its general training data. Think
                  of it as giving the AI an open-book exam rather than asking it to rely on what it
                  memorized months ago.
                </p>
                <p className="mt-4">
                  The term was introduced in a 2020 research paper by Facebook AI (now Meta), but the
                  concept has since become the standard approach for building AI chatbots that need to
                  stay accurate and up to date. If you&apos;ve used a{' '}
                  <Link href="/blog/what-is-a-knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot
                  </Link>
                  , you&apos;ve already used RAG — you just may not have known the name.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The problem RAG solves
                </h2>
                <p>
                  Large language models like Claude and GPT-4 are trained on vast amounts of public
                  data. They can write code, summarize articles, and hold conversations. But they
                  have a critical limitation: they don&apos;t know anything about your business. They
                  have never read your help center, your product documentation, or your internal
                  policies.
                </p>
                <p className="mt-4">
                  When you ask a general-purpose LLM a question it doesn&apos;t have the answer to, it
                  does the only thing it can: it generates something plausible-sounding. This is
                  called a hallucination. The answer looks confident, reads well, and is completely
                  made up. For a customer support use case, that&apos;s not just unhelpful — it&apos;s
                  actively dangerous. A hallucinated return policy or pricing detail can cost real
                  money and erode trust.
                </p>
                <p className="mt-4">
                  RAG solves this by giving the model access to your content at the moment it
                  generates a response. Instead of guessing, it reads the relevant passages and
                  synthesizes an answer from them. The model still does the writing, but the facts
                  come from your documents.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How RAG works step by step
                </h2>
                <p>
                  RAG has two phases: an offline indexing phase (done once when you add content)
                  and a real-time query phase (done every time someone asks a question). Understanding
                  both phases helps you see why the system is both fast and accurate.
                </p>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Phase 1: Indexing
                </h3>
                <p>
                  When you add a document to your knowledge base — a URL, PDF, or text file — the
                  system breaks it into small, overlapping chunks of text. Each chunk is typically
                  a few hundred words. These chunks are then converted into numerical representations
                  called{' '}
                  <Link href="/blog/what-are-embeddings-explained-simply" className="text-primary-600 dark:text-primary-400 hover:underline">
                    embeddings
                  </Link>
                  {' '}— lists of numbers that capture the semantic meaning of the text. The embeddings
                  are stored in a vector database where they can be searched efficiently.
                  The{' '}
                  <a href="https://dev.to/klement_gunndu_e16216829c/vector-databases-guide-rag-applications-2025-55oj" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">vector database market</a>{' '}
                  has grown rapidly alongside RAG adoption, reaching $1.73 billion in 2024 with
                  projections of $10.6 billion by 2032.
                </p>
                <p className="mt-4">
                  This process happens once per document. When you update a document, its chunks and
                  embeddings are regenerated. The rest of the knowledge base stays unchanged.
                </p>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Phase 2: Retrieval
                </h3>
                <p>
                  When a user asks a question, the same embedding model converts their question into
                  an embedding. The system then compares this question embedding against all the
                  stored chunk embeddings using cosine similarity — a mathematical measure of how
                  close two vectors are in meaning. The top matching chunks (typically 3-10) are
                  returned as context.
                </p>
                <p className="mt-4">
                  This is semantic search, not keyword search. A question about &quot;cancellation
                  policy&quot; will match a chunk that discusses &quot;how to end your subscription&quot; even
                  though the words are completely different. What matters is meaning, not exact
                  word overlap.
                </p>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Phase 3: Generation
                </h3>
                <p>
                  The retrieved chunks are inserted into the prompt alongside the user&apos;s question.
                  The language model reads both the question and the context, then generates an
                  answer that synthesizes the relevant information. A well-configured system prompt
                  instructs the model to only answer from the provided context and to say &quot;I
                  don&apos;t know&quot; if the answer isn&apos;t there.
                </p>
                <p className="mt-4">
                  The result is an answer that reads naturally — it doesn&apos;t just quote your
                  documents — but is factually grounded in your content. The user gets a helpful,
                  conversational response. You get the confidence that the information is accurate.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  RAG vs fine-tuning
                </h2>
                <p>
                  Fine-tuning is the other major approach to customizing an AI model. It involves
                  retraining the model&apos;s weights on your specific data so that the knowledge is
                  baked into the model itself. Both RAG and fine-tuning make a model more useful
                  for your domain, but they work in fundamentally different ways.
                </p>
                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100"></th>
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">RAG</th>
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Fine-tuning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700 bg-white dark:bg-secondary-800/30">
                      {[
                        ['Update content', 'Add new docs instantly', 'Retrain the model'],
                        ['Cost', 'Low (retrieval + generation)', 'High (training compute)'],
                        ['Transparency', 'Can cite source passages', 'Knowledge is opaque'],
                        ['Accuracy on your data', 'High (grounded in docs)', 'Variable (may still hallucinate)'],
                        ['Setup time', 'Minutes to hours', 'Days to weeks'],
                      ].map(([label, rag, ft]) => (
                        <tr key={label}>
                          <td className="px-4 py-3 font-medium text-secondary-700 dark:text-secondary-300">{label}</td>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{rag}</td>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{ft}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  For most business chatbot use cases, RAG is the better choice. It&apos;s cheaper,
                  faster to set up, easier to maintain, and more transparent. Fine-tuning makes
                  sense when you need to change how the model writes (tone, format, style) rather
                  than what it knows.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why RAG reduces hallucinations
                </h2>
                <p>
                  Hallucinations happen when a language model generates text that isn&apos;t grounded
                  in real information. Without RAG, the model has to rely entirely on what it
                  learned during training — which may be outdated, incomplete, or simply wrong for
                  your specific context. The model doesn&apos;t know what it doesn&apos;t know, so it fills
                  in the gaps with plausible-sounding text.
                </p>
                <p className="mt-4">
                  RAG reduces hallucinations through two mechanisms. First, it provides the model
                  with the actual source material to reference. The model doesn&apos;t need to guess
                  your return policy because the policy document is right there in the prompt.
                  Second, a well-written system prompt explicitly tells the model to only answer
                  from the provided context. If the retrieved chunks don&apos;t contain the answer,
                  the model is instructed to say so rather than speculate.
                </p>
                <p className="mt-4">
                  This doesn&apos;t make hallucinations impossible. The model can still misinterpret
                  a passage or incorrectly combine information from multiple chunks. But it reduces
                  the hallucination rate dramatically compared to a model answering from memory
                  alone. According to research published in{' '}
                  <a href="https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1635381/full" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Frontiers in Public Health</a>,
                  RAG reduces hallucination rates by over 40%. In practice, most RAG-powered
                  chatbots with good system prompts achieve accuracy rates well above 90% on
                  questions covered by the knowledge base.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  RAG in practice: VocUI&apos;s approach
                </h2>
                <p>
                  VocUI uses RAG as the foundation of every chatbot you build on the platform.
                  When you add a knowledge source — a URL, PDF, or document — VocUI automatically
                  handles the entire RAG pipeline: chunking the text with overlap to preserve
                  context, generating embeddings via OpenAI&apos;s embedding model, storing them in
                  Supabase with pgvector, and retrieving relevant chunks at query time using
                  cosine similarity search.
                </p>
                <p className="mt-4">
                  You don&apos;t need to configure any of this. You paste a URL, upload a file, or
                  type content directly. Within minutes, your chatbot can answer questions about
                  that content. The system handles chunk size optimization, embedding generation,
                  and retrieval ranking behind the scenes.
                </p>
                <p className="mt-4">
                  Every chatbot also includes a system prompt that you can customize to control
                  tone, boundaries, and fallback behavior. This is the layer that tells the model
                  how to use the retrieved content — whether to be formal or casual, whether to
                  suggest contacting support when it can&apos;t answer, and what topics are out of
                  scope. See our guide on{' '}
                  <Link href="/blog/what-is-a-knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbots
                  </Link>{' '}
                  for a deeper look at the end-to-end experience.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What does RAG stand for?',
                      a: 'RAG stands for Retrieval-Augmented Generation. It is a technique that combines information retrieval (searching a knowledge base) with text generation (using a large language model) to produce answers grounded in specific source documents rather than general training data.',
                    },
                    {
                      q: 'How is RAG different from fine-tuning?',
                      a: "Fine-tuning permanently changes a model's weights by retraining it on new data, which is expensive and hard to update. RAG keeps the model unchanged and instead retrieves relevant documents at query time, making it cheaper, easier to update, and more transparent since you can trace answers back to specific source passages.",
                    },
                    {
                      q: 'Does RAG eliminate hallucinations?',
                      a: "RAG significantly reduces hallucinations but does not eliminate them entirely. By grounding answers in retrieved documents, the model is far less likely to fabricate information. However, it can still occasionally misinterpret or incorrectly combine passages. A well-written system prompt that instructs the model to say \"I don't know\" when unsure further reduces this risk.",
                    },
                    {
                      q: 'What databases does RAG use?',
                      a: 'RAG typically uses a vector database to store and search document embeddings. Common options include Supabase with pgvector, Pinecone, Weaviate, and Qdrant. VocUI uses Supabase with pgvector for fast, scalable semantic search across your knowledge base.',
                    },
                    {
                      q: 'Do I need to understand RAG to use a chatbot?',
                      a: "No. RAG is the underlying technology, but platforms like VocUI handle all of it automatically. You just upload your content — URLs, PDFs, or documents — and the system takes care of chunking, embedding, retrieval, and generation behind the scenes.",
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
