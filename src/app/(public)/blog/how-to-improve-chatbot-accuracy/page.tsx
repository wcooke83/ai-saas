import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { DashboardPath } from '@/components/blog/dashboard-path';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Improve Your Chatbot\u2019s Answer Accuracy | VocUI',
  description:
    'Getting vague or wrong answers from your chatbot? Here are practical steps to improve accuracy — from better knowledge sources to smarter system prompts.',
  openGraph: {
    title: 'How to Improve Your Chatbot\u2019s Answer Accuracy | VocUI',
    description:
      'Getting vague or wrong answers from your chatbot? Here are practical steps to improve accuracy — from better knowledge sources to smarter system prompts.',
    url: 'https://vocui.com/blog/how-to-improve-chatbot-accuracy',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Improve Your Chatbot\u2019s Answer Accuracy | VocUI',
    description:
      'Getting vague or wrong answers from your chatbot? Here are practical steps to improve accuracy — from better knowledge sources to smarter system prompts.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-improve-chatbot-accuracy' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Improve Your Chatbot\u2019s Answer Accuracy',
      description:
        'Getting vague or wrong answers from your chatbot? Here are practical steps to improve accuracy — from better knowledge sources to smarter system prompts.',
      url: 'https://vocui.com/blog/how-to-improve-chatbot-accuracy',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-improve-chatbot-accuracy',
      },
      datePublished: '2026-03-03',
      dateModified: '2026-03-03',
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
          name: 'Why does my chatbot give wrong answers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wrong answers usually stem from three causes: incomplete knowledge sources (the information is not in the training data), poorly structured content (the bot cannot find the right chunk), or a vague system prompt (the bot does not know its boundaries). Audit all three to identify the root cause.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I fix chatbot hallucinations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Add explicit instructions in your system prompt telling the bot to only answer from provided content and to say "I don\'t have information about that" when a topic is not covered. Then fill content gaps by adding more knowledge sources for frequently asked topics. Hallucinations decrease as your knowledge base becomes more comprehensive.',
          },
        },
        {
          '@type': 'Question',
          name: 'Should I use short or long documents for training?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Focused, well-structured documents work better than long, monolithic ones. Break content into topic-specific pages or sections with clear headings. A 500-word page about your return policy will produce better answers than a 5,000-word page that covers returns, shipping, and ten other topics together.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I update my chatbot content?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update your knowledge sources whenever your business information changes — new pricing, updated policies, new products, or revised hours. At minimum, review your content quarterly. Set a calendar reminder to audit your knowledge base and refresh any outdated material.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I see what answers the chatbot gave?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. VocUI\'s dashboard includes conversation logs where you can review every chat session. Read through recent conversations regularly to spot incorrect answers, identify content gaps, and find opportunities to improve your system prompt or knowledge sources.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToImproveChatbotAccuracyPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
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
                Chatbot Accuracy
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2026-03-03" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 3, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Improve Your Chatbot&apos;s Answer Accuracy
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Chatbot accuracy depends on three things: the quality of your knowledge sources,
                the structure of your content, and the clarity of your system prompt. Fix these
                three areas and you&apos;ll eliminate most wrong or vague answers without
                touching any code.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Chatbot Accuracy Matters
                </h2>
                <p>
                  A chatbot that gives wrong answers is worse than no chatbot at all. Incorrect
                  information erodes trust, frustrates visitors, and can create real business
                  problems — like a customer being told the wrong return policy or getting
                  incorrect pricing. One bad answer can undo the goodwill of a hundred correct
                  ones.
                </p>
                <p className="mt-4">
                  The good news is that most accuracy problems are fixable. They rarely come from
                  the AI model itself. Instead, they come from gaps in your knowledge base,
                  poorly organized content, or a system prompt that doesn&apos;t give the bot
                  clear enough instructions. These are all things you control.
                </p>
                <p className="mt-4">
                  Improving accuracy is also an iterative process, not a one-time setup. As your
                  business changes, your chatbot content needs to keep up. New products, updated
                  policies, seasonal changes — all of these affect what your bot should say.
                  Building a habit of regular review and improvement is what separates chatbots
                  that impress from chatbots that embarrass.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Audit Your Knowledge Sources
                </h2>
                <p>
                  Start by reviewing what your chatbot actually has to work with. Open your VocUI
                  dashboard and look at your knowledge sources. Ask yourself these questions:
                </p>
                <DashboardPath steps={['Chatbots', 'Your chatbot', 'Knowledge Sources']} tip="Review your sources and re-scrape any outdated content." />
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>
                    <strong>Is the information complete?</strong> If customers ask about returns
                    and your return policy isn&apos;t in the knowledge base, the bot will either
                    guess or say it doesn&apos;t know. Neither is ideal. List your top 20
                    customer questions and verify that answers to all of them exist in your
                    training data.
                  </li>
                  <li>
                    <strong>Is the information current?</strong> Outdated content is a common
                    source of wrong answers. If you changed your pricing six months ago but
                    didn&apos;t update your knowledge sources, the bot is still quoting the old
                    prices. Check dates and refresh stale content.
                  </li>
                  <li>
                    <strong>Is the information consistent?</strong> If two different documents
                    mention different business hours or conflicting policies, the bot may pull
                    from either one. Remove duplicates and resolve contradictions.
                  </li>
                </ul>
                <p className="mt-4">
                  For a deeper dive into building an effective knowledge base, see our guide on{' '}
                  <Link
                    href="/blog/how-to-train-chatbot-on-your-own-data"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    training a chatbot on your own data
                  </Link>
                  .
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Improve Your Content Structure
                </h2>
                <p>
                  How you organize your content matters as much as what&apos;s in it. The chatbot
                  retrieves relevant chunks of content based on the user&apos;s question. If your
                  content is well-structured, the right chunk gets retrieved. If it&apos;s a
                  wall of text, the bot may pull an irrelevant section.
                </p>
                <ul className="list-disc pl-5 space-y-3 mt-4">
                  <li>
                    <strong>Use clear headings.</strong> Break content into sections with
                    descriptive H2 and H3 headings. &quot;Return Policy for US Orders&quot; is
                    better than &quot;Section 4.2&quot;.
                  </li>
                  <li>
                    <strong>Keep topics focused.</strong> One page per topic works better than a
                    single document covering everything. A dedicated shipping policy page will
                    produce more accurate shipping answers than a general FAQ page that mentions
                    shipping in passing.
                  </li>
                  <li>
                    <strong>Write in Q&A format where possible.</strong> If you have a FAQ page,
                    structure it as clear question-and-answer pairs. This format aligns perfectly
                    with how the retrieval system matches user queries to content.
                  </li>
                  <li>
                    <strong>Avoid large tables and complex formatting.</strong> Tables with many
                    columns or deeply nested lists can confuse the chunking process. Convert
                    important table data into simple prose or short bullet lists.
                  </li>
                </ul>
                <p className="mt-4">
                  For more on this topic, see our{' '}
                  <Link
                    href="/blog/what-is-a-knowledge-base-chatbot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    knowledge base chatbot guide
                  </Link>{' '}
                  which covers content organization in depth.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Write a Better System Prompt
                </h2>
                <p>
                  Your system prompt is the instruction set that tells the chatbot who it is, how
                  to behave, and what to do when it doesn&apos;t have an answer. A vague system
                  prompt leads to vague responses. A precise one keeps the bot focused and
                  accurate.
                </p>
                <p className="mt-4">
                  Key principles for an accuracy-focused system prompt:
                </p>
                <ul className="list-disc pl-5 space-y-3 mt-4">
                  <li>
                    <strong>Set explicit boundaries.</strong> Tell the bot: &quot;Only answer
                    questions using the provided knowledge base content. If the answer is not in
                    the provided content, say &apos;I don&apos;t have specific information about
                    that. Please contact us at [email] for help.&apos;&quot;
                  </li>
                  <li>
                    <strong>Define the bot&apos;s identity.</strong> &quot;You are a customer
                    support assistant for [Company Name]. You help visitors with questions about
                    our products, services, shipping, and returns.&quot;
                  </li>
                  <li>
                    <strong>Specify what to avoid.</strong> &quot;Do not make up information. Do
                    not provide medical, legal, or financial advice. Do not discuss competitor
                    products.&quot;
                  </li>
                  <li>
                    <strong>Set the tone.</strong> &quot;Respond in a friendly, professional
                    tone. Keep answers concise — under three sentences when possible.&quot;
                  </li>
                </ul>
                <p className="mt-4">
                  Our full{' '}
                  <Link
                    href="/blog/how-to-write-chatbot-system-prompt"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    system prompt writing guide
                  </Link>{' '}
                  covers this topic in detail with examples and templates.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Test and Iterate Regularly
                </h2>
                <p>
                  After making changes to your knowledge base or system prompt, test the chatbot
                  with real questions. Don&apos;t just ask one question — run through your top
                  20-30 most common customer queries and verify the answers are correct.
                </p>
                <p className="mt-4">
                  Build a testing routine:
                </p>
                <ol className="list-decimal pl-5 space-y-3 mt-4">
                  <li>
                    <strong>Review conversation logs weekly.</strong> Open VocUI&apos;s chat
                    history and read recent conversations. Flag answers that were wrong, vague,
                    or unhelpful.
                  </li>
                  <li>
                    <strong>Identify content gaps.</strong> If the bot repeatedly fails on a
                    specific topic, add or improve the content for that topic in your knowledge
                    base.
                  </li>
                  <li>
                    <strong>Test after every change.</strong> When you update a knowledge source
                    or modify your system prompt, immediately test with 5-10 relevant questions
                    to make sure the change improved things without breaking other answers.
                  </li>
                  <li>
                    <strong>Track accuracy over time.</strong> Keep a simple log of correct vs.
                    incorrect answers. You should see the ratio improve as you refine your
                    content.
                  </li>
                </ol>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  When to Use Q&A Pairs for Precision
                </h2>
                <p>
                  For questions where exact wording matters — like pricing, legal disclaimers, or
                  specific policies — consider adding dedicated Q&A pairs to your knowledge base
                  instead of relying on the bot to extract answers from longer documents.
                </p>
                <p className="mt-4">
                  A Q&A pair is a direct question-and-answer formatted entry in your knowledge
                  source. For example, instead of hoping the bot pulls the right sentence from
                  your shipping policy page, add: &quot;Q: How long does shipping take? A: US
                  orders ship within 2-3 business days. International orders take 7-14 business
                  days.&quot;
                </p>
                <p className="mt-4">
                  Q&A pairs are especially useful for:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>Pricing information that must be exact</li>
                  <li>Business hours and location details</li>
                  <li>Warranty and return deadlines</li>
                  <li>Answers that customers frequently get wrong or confused about</li>
                </ul>
                <p className="mt-4">
                  Combine Q&A pairs with your regular knowledge sources for the best results.
                  The broader documents handle general questions, while Q&A pairs handle the
                  specifics that need to be word-perfect. View{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    our pricing plans
                  </Link>{' '}
                  to see what knowledge source options are available.
                </p>
              </section>

              {/* FAQ section */}
              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Why does my chatbot give wrong answers?',
                      a: 'Wrong answers usually stem from three causes: incomplete knowledge sources (the information is not in the training data), poorly structured content (the bot cannot find the right chunk), or a vague system prompt (the bot does not know its boundaries). Audit all three to identify the root cause.',
                    },
                    {
                      q: 'How do I fix chatbot hallucinations?',
                      a: "Add explicit instructions in your system prompt telling the bot to only answer from provided content and to say \"I don't have information about that\" when a topic is not covered. Then fill content gaps by adding more knowledge sources for frequently asked topics. Hallucinations decrease as your knowledge base becomes more comprehensive.",
                    },
                    {
                      q: 'Should I use short or long documents for training?',
                      a: 'Focused, well-structured documents work better than long, monolithic ones. Break content into topic-specific pages or sections with clear headings. A 500-word page about your return policy will produce better answers than a 5,000-word page that covers returns, shipping, and ten other topics together.',
                    },
                    {
                      q: 'How often should I update my chatbot content?',
                      a: 'Update your knowledge sources whenever your business information changes — new pricing, updated policies, new products, or revised hours. At minimum, review your content quarterly. Set a calendar reminder to audit your knowledge base and refresh any outdated material.',
                    },
                    {
                      q: 'Can I see what answers the chatbot gave?',
                      a: "Yes. VocUI's dashboard includes conversation logs where you can review every chat session. Read through recent conversations regularly to spot incorrect answers, identify content gaps, and find opportunities to improve your system prompt or knowledge sources.",
                    },
                  ].map(({ q, a }) => (
                    <div
                      key={q}
                      className="border-b border-secondary-200 dark:border-secondary-700 pb-6"
                    >
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {q}
                      </dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">You read the guide -- now build it</h2>
            <p className="text-white/80 mb-2">
              Upload your content and follow along with a working chatbot in front of you.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Most people finish setup in under 5 minutes.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Create your chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Free plan included -- no credit card needed</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
