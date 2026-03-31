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
  title: 'How to Train a Chatbot on Your Own Data | VocUI',
  description:
    'Train an AI chatbot on your own PDFs, URLs, and documents — no ML experience needed. Step-by-step guide to building a knowledge base chatbot with VocUI.',
  openGraph: {
    title: 'How to Train a Chatbot on Your Own Data | VocUI',
    description:
      'Train an AI chatbot on your own PDFs, URLs, and documents — no ML experience needed. Step-by-step guide to building a knowledge base chatbot with VocUI.',
    url: 'https://vocui.com/blog/how-to-train-chatbot-on-your-own-data',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Train a Chatbot on Your Own Data | VocUI',
    description:
      'Train an AI chatbot on your own PDFs, URLs, and documents — no ML experience needed. Step-by-step guide to building a knowledge base chatbot with VocUI.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-train-chatbot-on-your-own-data' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      name: 'How to Train a Chatbot on Your Own Data',
      description:
        'A step-by-step guide to training an AI chatbot on your own documents, PDFs, and URLs with no ML experience required.',
      url: 'https://vocui.com/blog/how-to-train-chatbot-on-your-own-data',
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
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Add a knowledge source',
          text: 'Upload a PDF, paste a URL to scrape, or type Q&A pairs directly into VocUI.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Let the system embed your content',
          text: 'VocUI chunks the text, runs it through an embedding model, and stores it in a vector database automatically.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Test retrieval',
          text: 'Use the built-in chat tester to ask questions and verify the chatbot is pulling the right content.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Refine with a system prompt',
          text: 'Add a system prompt to constrain the chatbot\'s scope, personality, and escalation behavior.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need machine learning experience to train a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. VocUI handles all the ML infrastructure — embeddings, vector storage, retrieval — automatically. You just provide the content.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many documents can I train the chatbot on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This depends on your plan. The free plan supports a limited number of knowledge sources. Paid plans allow significantly more content, including full website crawls.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I update the chatbot\'s knowledge base?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Any time your products, pricing, policies, or services change. A good rule: if you would update your FAQ page, update your chatbot knowledge base too.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens if the chatbot doesn\'t know the answer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'By default, VocUI chatbots say they don\'t have that information rather than making something up. You can configure them to escalate to a human agent in that case.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToTrainChatbotPage() {
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
                How to Train a Chatbot on Your Own Data
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">9 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Train a Chatbot on Your Own Data
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                The phrase &quot;train a chatbot&quot; sounds like something that requires a PhD and a GPU
                cluster. It doesn&apos;t. With modern retrieval-augmented generation tools, you can teach
                a chatbot to answer questions from your own documents in about 20 minutes — no
                machine learning experience required.
              </p>
            </header>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What &quot;training&quot; actually means
                </h2>
                <p>
                  When most people say &quot;train a chatbot on my data,&quot; they don&apos;t mean fine-tuning
                  a large language model — a process that costs thousands of dollars and months of
                  work. They mean something much simpler: giving the chatbot access to their content
                  so it can answer questions from it.
                </p>
                <p className="mt-4">
                  The technical term for this is Retrieval-Augmented Generation (RAG). Here&apos;s how
                  it works in plain English:
                </p>
                <ol className="list-decimal list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    Your documents get broken into small chunks (a few hundred words each).
                  </li>
                  <li>
                    Each chunk gets converted into a mathematical representation called an
                    embedding — a list of numbers that captures the meaning of the text.
                  </li>
                  <li>
                    When a user asks a question, the system finds the chunks most semantically
                    similar to the question.
                  </li>
                  <li>
                    Those chunks get passed to an AI language model (like Claude or GPT-4), which
                    uses them to generate a precise answer.
                  </li>
                </ol>
                <p className="mt-4">
                  The result is a chatbot that answers from your specific content — not from
                  generic internet knowledge. This is what makes it useful for your business: it
                  knows your pricing, your policies, and your product, because you told it. Learn
                  more on our{' '}
                  <Link href="/knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot
                  </Link>{' '}
                  page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What data formats you can use
                </h2>
                <p>
                  VocUI accepts several content types. You don&apos;t need to convert everything into
                  one format — you can mix and match.
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">URLs</strong> — paste any web page and VocUI scrapes the text. This
                    works for your help center, pricing page, product pages, blog posts, and more.
                    You can add multiple URLs — one at a time or as a list.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">PDFs</strong> — upload product manuals, onboarding guides, service
                    brochures, or any reference document. VocUI extracts the text automatically,
                    including from multi-page files.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">DOCX files</strong> — Microsoft Word documents work just as well as
                    PDFs. If your internal knowledge is in Word files, upload them directly.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Q&amp;A pairs</strong> — type questions and answers manually. This is
                    the most targeted format because you control exactly what gets asked and what
                    the answer should be. Use this for your most common support questions.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Plain text</strong> — paste raw text directly if you have content
                    that doesn&apos;t fit neatly into a file or URL.
                  </li>
                </ul>
                <p className="mt-4">
                  There&apos;s no need to format your content in any special way before uploading. VocUI
                  processes whatever you give it. The only thing that matters is that the content
                  is text — scanned images of documents won&apos;t work unless they have been OCR&apos;d first.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 1: Add a knowledge source
                </h2>
                <p>
                  In your VocUI dashboard, open your chatbot and go to the Knowledge tab. Click
                  &quot;Add source&quot; and choose the type of content you want to add.
                </p>
                <p className="mt-4">
                  Start with your most important content. If you have a help center, start there.
                  If you&apos;re a service business, your FAQ page and your &quot;How it works&quot; page are
                  usually the highest-value sources. If you&apos;re a lawyer or professional services
                  firm, a document explaining your areas of practice and intake process is a good
                  first source — see our guide for{' '}
                  <Link href="/chatbot-for-lawyers" className="text-primary-600 dark:text-primary-400 hover:underline">
                    law firm chatbots
                  </Link>{' '}
                  for specifics.
                </p>
                <p className="mt-4">
                  You don&apos;t need to add everything at once. Start with a few key sources, test the
                  chatbot, and add more content where you find gaps.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 2: Let the system embed your content
                </h2>
                <p>
                  After you add a source, VocUI processes it automatically. You&apos;ll see a status
                  indicator in the Knowledge tab — usually it goes from &quot;Processing&quot; to &quot;Ready&quot;
                  within a minute or two, depending on the size of the content.
                </p>
                <p className="mt-4">
                  During processing, VocUI is doing several things:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>Splitting the content into overlapping chunks to preserve context</li>
                  <li>Sending each chunk through an embedding model to create a vector representation</li>
                  <li>Storing those vectors in a database built for fast semantic search</li>
                </ul>
                <p className="mt-4">
                  You don&apos;t need to do anything during this step. Just wait for the status to turn
                  green, then move on to testing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 3: Test retrieval
                </h2>
                <p>
                  Once your sources are processed, use the built-in chat tester in the dashboard.
                  Ask the chatbot a few questions that your documents should answer.
                </p>
                <p className="mt-4">
                  Pay attention to three things:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Accuracy</strong> — is the answer factually correct based on your
                    content?
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Completeness</strong> — does it give the full answer, or just part of
                    it?
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Tone</strong> — does it sound like something your business would say?
                  </li>
                </ul>
                <p className="mt-4">
                  If the answers are accurate but the tone is off, that&apos;s a system prompt issue
                  (covered in Step 4). If the answers are wrong or missing key information, you
                  need to add more content or improve the existing content in your knowledge base.
                </p>
                <p className="mt-4">
                  A common issue: you add a URL, but the chatbot doesn&apos;t know a piece of
                  information that&apos;s clearly on that page. This usually happens when the content is
                  inside a JavaScript-rendered component that the scraper couldn&apos;t read. The fix is
                  to add that information as a Q&amp;A pair or plain text source instead.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 4: Refine with a system prompt
                </h2>
                <p>
                  The system prompt is a set of instructions the AI sees before every conversation.
                  It&apos;s how you control the chatbot&apos;s personality, scope, and behavior.
                </p>
                <p className="mt-4">
                  A good system prompt for a small business chatbot covers three things:
                </p>
                <ol className="list-decimal list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Identity</strong> — what the chatbot is and who it represents.
                    Example: &quot;You are a helpful assistant for Greenfield Landscaping. Answer
                    questions about our services, pricing, and scheduling.&quot;
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Scope</strong> — what topics are in bounds and out of bounds. Example:
                    &quot;Only answer questions related to our landscaping services. Do not provide
                    advice on unrelated topics.&quot;
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Escalation</strong> — what to do when the chatbot can&apos;t help.
                    Example: &quot;If you can&apos;t answer a question, let the customer know and suggest
                    they call us at 555-0100 or send an email to info@greenfieldlandscaping.com.&quot;
                  </li>
                </ol>
                <p className="mt-4">
                  Keep the system prompt short and direct. A paragraph or two is usually enough.
                  Longer prompts tend to get ignored by the model in subtle ways.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How often to update your knowledge base
                </h2>
                <p>
                  The chatbot only knows what you&apos;ve told it. Any time your products, pricing,
                  policies, or services change, you need to update the knowledge base.
                </p>
                <p className="mt-4">
                  A practical rule: if it would update your FAQ page, it should update your chatbot
                  knowledge base. Some businesses build it into their launch checklist — every time
                  they change a price or add a service, updating the chatbot is a step in the process.
                </p>
                <p className="mt-4">
                  For URL-based sources, you can re-scrape them on demand. If your help center
                  page changes, you can delete the old URL source and add it again — the new content
                  will be processed automatically. VocUI&apos;s paid plans also support scheduled
                  re-indexing so you don&apos;t have to remember to do this manually.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to do when the chatbot gives wrong answers
                </h2>
                <p>
                  Wrong answers from a knowledge base chatbot almost always have one of three causes:
                </p>
                <ol className="list-decimal list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">The information isn&apos;t in the knowledge base.</strong> Add it.
                    Either upload the document that has it, or create a Q&amp;A pair that covers the
                    specific question.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">The information is there but it&apos;s ambiguous.</strong> If your
                    knowledge base says &quot;our services start at $99&quot; in one place and &quot;custom pricing
                    available&quot; in another, the chatbot might give inconsistent answers. Make the
                    content consistent.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">The system prompt is too permissive.</strong> If you haven&apos;t told
                    the chatbot to stick to your content, it might fill in gaps with general knowledge
                    — which could be wrong for your specific business. Tighten the system prompt.
                  </li>
                </ol>
                <p className="mt-4">
                  The conversation logs in your dashboard are the best diagnostic tool. Look at the
                  exact messages where the chatbot went wrong, trace it back to what was in the
                  knowledge base at that time, and fix the source content.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Do I need machine learning experience to train a chatbot?',
                      a: 'No. VocUI handles all the ML infrastructure — embeddings, vector storage, retrieval — automatically. You just provide the content.',
                    },
                    {
                      q: 'How many documents can I train the chatbot on?',
                      a: 'This depends on your plan. The free plan supports a limited number of knowledge sources. Paid plans allow significantly more content, including full website crawls.',
                    },
                    {
                      q: "How often should I update the chatbot's knowledge base?",
                      a: "Any time your products, pricing, policies, or services change. A good rule: if you would update your FAQ page, update your chatbot knowledge base too.",
                    },
                    {
                      q: "What happens if the chatbot doesn't know the answer?",
                      a: "By default, VocUI chatbots say they don't have that information rather than making something up. You can configure them to escalate to a human agent in that case.",
                    },
                    {
                      q: 'Can I train the chatbot on confidential documents?',
                      a: "Yes. Your knowledge base content is stored securely and only accessible to your chatbot. It's never used to train any shared models. Check our privacy policy for full details.",
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
            <h2 className="text-2xl font-bold mb-3">Your turn — build it in under 5 minutes</h2>
            <p className="text-white/80 mb-2">
              Follow the steps you just read, but with your own content. Upload your docs, customize the look, and go live.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. No code, no developers, no waiting.
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
            <p className="text-xs text-white/50 mt-4">Join 1,000+ businesses already using VocUI</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
