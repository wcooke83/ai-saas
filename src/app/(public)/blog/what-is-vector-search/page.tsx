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
  title: 'What Is Vector Search? How AI Chatbots Find Answers | VocUI',
  description:
    'Vector search finds content by meaning, not keywords. Learn how AI chatbots use vector search to find the most relevant answers from your knowledge base.',
  openGraph: {
    title: 'What Is Vector Search? How AI Chatbots Find Answers | VocUI',
    description:
      'Vector search finds content by meaning, not keywords. Learn how AI chatbots use vector search to find the most relevant answers from your knowledge base.',
    url: 'https://vocui.com/blog/what-is-vector-search',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is Vector Search? How AI Chatbots Find Answers | VocUI',
    description:
      'Vector search finds content by meaning, not keywords. Learn how AI chatbots use vector search to find the most relevant answers from your knowledge base.',
  },
  alternates: { canonical: 'https://vocui.com/blog/what-is-vector-search' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What Is Vector Search? How AI Chatbots Find Answers',
      description:
        'Vector search finds content by meaning, not keywords. Learn how AI chatbots use vector search to find the most relevant answers from your knowledge base.',
      url: 'https://vocui.com/blog/what-is-vector-search',
      datePublished: '2025-03-31',
      dateModified: '2025-03-31',
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
          url: 'https://vocui.com/logo.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is vector search?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Vector search is a technique that finds content by meaning rather than exact keyword matches. It converts text into numerical representations called vectors, then finds other text whose vectors are closest in meaning. This lets AI chatbots find relevant answers even when a user\'s question uses completely different words than the source material.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is it different from Google search?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Google search uses a mix of techniques including keyword matching, link analysis, and increasingly semantic understanding. Vector search focuses specifically on semantic similarity — it compares the meaning of a query against the meaning of stored content. In a chatbot context, vector search operates over your private knowledge base rather than the public web, finding the most semantically relevant passages to answer a specific question.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a vector database?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A vector database is a specialized database designed to store and query high-dimensional vectors efficiently. Traditional databases search by exact values or ranges. Vector databases search by similarity — they find the vectors closest to a given query vector. Examples include Pinecone, Weaviate, and pgvector (a PostgreSQL extension). VocUI uses pgvector through Supabase so you don\'t need to manage any database infrastructure yourself.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does vector search always find the right answer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Not always. Vector search finds the most semantically similar content, but similarity isn\'t the same as correctness. If the answer doesn\'t exist in your knowledge base, vector search will still return the closest match — which may not be relevant. This is why quality knowledge base content and good system prompts matter. The better your source material, the more accurate your chatbot\'s answers will be.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to set up vector search myself?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Platforms like VocUI handle vector search automatically. When you add knowledge sources — URLs, PDFs, or documents — VocUI processes them into chunks, generates embeddings, and stores them in a vector database. When a user asks a question, vector search runs behind the scenes to find the most relevant content. You never need to configure or manage the search infrastructure.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WhatIsVectorSearchPage() {
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
                What Is Vector Search?
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
                <span className="text-xs text-secondary-400 dark:text-secondary-500">8 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                What Is Vector Search? How AI Chatbots Find Answers
              </h1>
            </header>

            {/* Featured snippet paragraph */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Vector search is a technique that finds content by meaning rather than exact keyword
                matches. Instead of looking for the same words in your question, it understands what
                you&apos;re asking and finds the most semantically relevant passages from a knowledge
                base — even if they use completely different wording.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What vector search is
                </h2>
                <p>
                  At its core, vector search is a way to find information based on meaning rather
                  than matching exact words. Traditional search engines work by scanning for documents
                  that contain the same keywords you typed. Vector search takes a fundamentally
                  different approach: it converts your question into a mathematical representation
                  (a vector) and then finds content whose mathematical representation is closest
                  to yours.
                </p>
                <p className="mt-4">
                  Think of it this way. If you search a traditional system for &quot;return policy,&quot; it
                  looks for documents containing those exact words. If your FAQ says &quot;How to send
                  items back for a refund&quot; but never uses the phrase &quot;return policy,&quot; traditional
                  search misses it. Vector search understands that &quot;return policy&quot; and &quot;send items
                  back for a refund&quot; mean the same thing, and finds that FAQ entry anyway.
                </p>
                <p className="mt-4">
                  This capability is what makes modern AI chatbots dramatically better at answering
                  questions than older keyword-based systems. Users don&apos;t need to guess which exact
                  words appear in your documentation — they can ask naturally, and vector search
                  bridges the gap between their language and your content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How it differs from keyword search
                </h2>
                <p>
                  Keyword search (also called lexical search) has been the default for decades. It
                  works by building an index of every word in every document, then returning documents
                  that contain the query terms. It&apos;s fast and predictable, but it has a fundamental
                  limitation: it has no understanding of meaning. The word &quot;bank&quot; in &quot;river bank&quot;
                  and &quot;savings bank&quot; looks identical to a keyword search engine.
                </p>
                <p className="mt-4">
                  Vector search solves this by operating in a semantic space. Words and sentences are
                  mapped to coordinates in a high-dimensional space where proximity corresponds to
                  similarity in meaning. &quot;How do I cancel my subscription?&quot; and &quot;I want to stop
                  my plan&quot; end up close together because they mean the same thing, even though they
                  share almost no words.
                </p>
                <p className="mt-4">
                  For chatbots, this difference is critical. One case study from{' '}
                  <a href="https://dev.to/klement_gunndu_e16216829c/vector-databases-guide-rag-applications-2025-55oj" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Zendesk</a>{' '}
                  found that switching to semantic search resulted in a 7% increase in mean
                  reciprocal rank for their help center results. Your customers ask questions in
                  dozens of different ways. Keyword search requires you to anticipate every possible
                  phrasing and either include it in your content or build explicit synonym lists.
                  Vector search handles variation naturally because it matches on meaning, not
                  vocabulary.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The role of embeddings in vector search
                </h2>
                <p>
                  Embeddings are the foundation that makes vector search work. An{' '}
                  <Link href="/blog/what-are-embeddings-explained-simply" className="text-primary-600 dark:text-primary-400 hover:underline">
                    embedding
                  </Link>{' '}
                  is a list of numbers (a vector) that represents the meaning of a piece of text.
                  These numbers are generated by an AI model that has been trained to place similar
                  meanings close together in a mathematical space.
                </p>
                <p className="mt-4">
                  When you add a document to a chatbot&apos;s knowledge base, the text is broken into
                  smaller chunks and each chunk is converted into an embedding. These embeddings are
                  stored in a vector database. When a user asks a question, their question is also
                  converted into an embedding using the same model. Vector search then compares the
                  question embedding against all stored chunk embeddings and returns the closest
                  matches.
                </p>
                <p className="mt-4">
                  The quality of the embeddings directly affects the quality of search results.
                  Modern embedding models like OpenAI&apos;s text-embedding models produce vectors
                  with over 1,500 dimensions, capturing nuances in meaning that simpler representations
                  would miss. The better the embeddings, the more accurately vector search can match
                  questions to relevant content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How chatbots use vector search to answer questions
                </h2>
                <p>
                  In a{' '}
                  <Link href="/blog/what-is-rag-retrieval-augmented-generation" className="text-primary-600 dark:text-primary-400 hover:underline">
                    RAG-based chatbot
                  </Link>
                  , vector search is the retrieval step — the &quot;R&quot; in RAG. Here&apos;s the process that
                  happens every time a user sends a message:
                </p>
                <ol className="list-decimal list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>The user&apos;s question is converted into an embedding vector.</li>
                  <li>That vector is compared against all knowledge base chunk vectors.</li>
                  <li>The most similar chunks (typically the top 3-5) are retrieved.</li>
                  <li>Those chunks are passed to the large language model as context.</li>
                  <li>The LLM generates a natural language answer based on the retrieved content.</li>
                </ol>
                <p className="mt-4">
                  This approach is why a{' '}
                  <Link href="/blog/what-is-a-knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot
                  </Link>{' '}
                  can answer specific questions about your business accurately. The LLM isn&apos;t
                  inventing answers from its general training — it&apos;s reading the most relevant
                  passages from your actual content and synthesizing a response. Vector search
                  is what ensures the right passages get selected.
                </p>
                <p className="mt-4">
                  Without vector search, the chatbot would either need to process your entire
                  knowledge base on every question (impossibly expensive and slow) or rely on
                  keyword matching (inaccurate). Vector search makes it practical to have a chatbot
                  that responds in seconds while drawing on thousands of pages of content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Vector databases explained simply
                </h2>
                <p>
                  A vector database is a specialized database built to store and search vectors
                  efficiently. Standard databases are designed to look up exact values — find the
                  row where <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">email = &quot;user@example.com&quot;</code>.
                  Vector databases solve a different problem: find the rows whose vectors are
                  closest to this query vector.
                </p>
                <p className="mt-4">
                  This &quot;nearest neighbor search&quot; is computationally intensive because each vector
                  might have 1,500+ dimensions and you might have millions of them. Vector databases
                  use specialized indexing algorithms (like HNSW or IVF) to make these searches fast
                  — typically returning results in milliseconds even over large datasets.
                </p>
                <p className="mt-4">
                  Popular vector database options include dedicated solutions like Pinecone and
                  Weaviate, as well as extensions for existing databases like pgvector for PostgreSQL.
                  The demand for these systems is growing rapidly — the{' '}
                  <a href="https://dev.to/klement_gunndu_e16216829c/vector-databases-guide-rag-applications-2025-55oj" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">vector database market</a>{' '}
                  is projected to reach $10.6 billion by 2032, driven largely by RAG and semantic
                  search adoption.
                  VocUI uses pgvector through Supabase, which means your knowledge base embeddings
                  live alongside your other data in a battle-tested PostgreSQL database. You never
                  need to provision, configure, or manage any of this infrastructure — it&apos;s handled
                  automatically when you add content to your chatbot.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why vector search makes chatbots smarter
                </h2>
                <p>
                  The ultimate impact of vector search is that chatbots can understand what you
                  mean, not just what you say. A customer might ask &quot;do you ship to Europe?&quot; and
                  vector search can find a knowledge base passage about &quot;international delivery
                  zones&quot; without either document using the other&apos;s exact terminology.
                </p>
                <p className="mt-4">
                  This semantic understanding compounds across a knowledge base. The more content
                  you add, the more questions your chatbot can handle — and vector search ensures
                  that the right content surfaces for each question regardless of how the user
                  phrases it. You don&apos;t need to write FAQ entries for every possible question
                  variation. You write clear, comprehensive content once, and vector search takes
                  care of matching.
                </p>
                <p className="mt-4">
                  Vector search also enables a chatbot to combine information from multiple sources.
                  If a question touches on both your pricing page and your terms of service, vector
                  search can retrieve relevant chunks from both documents, giving the LLM the full
                  picture it needs to compose a complete answer. Read our{' '}
                  <Link href="/blog/what-is-a-knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot explainer
                  </Link>{' '}
                  to see how VocUI puts all of this together.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What is vector search?',
                      a: 'Vector search is a technique that finds content by meaning rather than exact keyword matches. It converts text into numerical representations called vectors, then finds other text whose vectors are closest in meaning. This lets AI chatbots find relevant answers even when a user\'s question uses completely different words than the source material.',
                    },
                    {
                      q: 'How is it different from Google search?',
                      a: 'Google search uses a mix of techniques including keyword matching, link analysis, and increasingly semantic understanding. Vector search focuses specifically on semantic similarity — it compares the meaning of a query against the meaning of stored content. In a chatbot context, vector search operates over your private knowledge base rather than the public web, finding the most semantically relevant passages to answer a specific question.',
                    },
                    {
                      q: 'What is a vector database?',
                      a: 'A vector database is a specialized database designed to store and query high-dimensional vectors efficiently. Traditional databases search by exact values or ranges. Vector databases search by similarity — they find the vectors closest to a given query vector. Examples include Pinecone, Weaviate, and pgvector (a PostgreSQL extension). VocUI uses pgvector through Supabase so you don\'t need to manage any database infrastructure yourself.',
                    },
                    {
                      q: 'Does vector search always find the right answer?',
                      a: 'Not always. Vector search finds the most semantically similar content, but similarity isn\'t the same as correctness. If the answer doesn\'t exist in your knowledge base, vector search will still return the closest match — which may not be relevant. This is why quality knowledge base content and good system prompts matter. The better your source material, the more accurate your chatbot\'s answers will be.',
                    },
                    {
                      q: 'Do I need to set up vector search myself?',
                      a: 'No. Platforms like VocUI handle vector search automatically. When you add knowledge sources — URLs, PDFs, or documents — VocUI processes them into chunks, generates embeddings, and stores them in a vector database. When a user asks a question, vector search runs behind the scenes to find the most relevant content. You never need to configure or manage the search infrastructure.',
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
            <h2 className="text-2xl font-bold mb-3">Now see it in action — with your own content</h2>
            <p className="text-white/80 mb-2">
              You understand how it works. Try it yourself: upload a document, ask a question, and watch your chatbot answer from your knowledge.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free to start. Takes about 2 minutes to see your first answer.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">No setup fee, no commitments</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
