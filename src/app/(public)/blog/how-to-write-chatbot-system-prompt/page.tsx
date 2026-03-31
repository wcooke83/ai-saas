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
  title: 'How to Write a Chatbot System Prompt That Actually Works | VocUI',
  description:
    'Your chatbot system prompt controls its personality, accuracy, and boundaries. Learn how to write one that keeps responses helpful, on-brand, and hallucination-free.',
  openGraph: {
    title: 'How to Write a Chatbot System Prompt That Actually Works | VocUI',
    description:
      'Your chatbot system prompt controls its personality, accuracy, and boundaries. Learn how to write one that keeps responses helpful, on-brand, and hallucination-free.',
    url: 'https://vocui.com/blog/how-to-write-chatbot-system-prompt',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Write a Chatbot System Prompt That Actually Works | VocUI',
    description:
      'Your chatbot system prompt controls its personality, accuracy, and boundaries. Learn how to write one that keeps responses helpful, on-brand, and hallucination-free.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-write-chatbot-system-prompt' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Write a Chatbot System Prompt That Actually Works',
      description:
        'Your chatbot system prompt controls its personality, accuracy, and boundaries. Learn how to write one that keeps responses helpful, on-brand, and hallucination-free.',
      url: 'https://vocui.com/blog/how-to-write-chatbot-system-prompt',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-write-chatbot-system-prompt',
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
          name: 'What is a system prompt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "A system prompt is a set of instructions given to your chatbot that defines how it should behave. It runs before every conversation and tells the bot its role, tone, boundaries, and how to handle questions it can't answer. Think of it as the bot's job description.",
          },
        },
        {
          '@type': 'Question',
          name: 'How long should a system prompt be?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most effective system prompts are 100 to 300 words. Long enough to cover role, tone, boundaries, and fallback behavior — short enough that every instruction is clear and actionable. Overly long prompts can dilute important instructions.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I change the system prompt after launching?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can edit the system prompt at any time from your VocUI dashboard. Changes take effect immediately for all new conversations. This makes it easy to iterate based on how the bot is performing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the system prompt affect accuracy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes, significantly. A well-written system prompt that instructs the bot to only answer from provided content and to say \"I don't know\" when unsure dramatically reduces hallucinations. Without these guardrails, the bot may generate plausible-sounding but incorrect answers.",
          },
        },
        {
          '@type': 'Question',
          name: 'What if the chatbot ignores the system prompt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "If the bot seems to ignore instructions, the prompt may be too vague or contradictory. Use direct, specific language: \"Never\" instead of \"try not to,\" \"Always\" instead of \"when possible.\" Test with edge cases and refine. VocUI's chat testing panel lets you iterate quickly.",
          },
        },
        {
          '@type': 'Question',
          name: 'Can users see the system prompt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The system prompt is sent to the AI model as a hidden instruction. It is not displayed in the chat interface. However, it is technically possible for a determined user to try to extract it through clever prompting. For this reason, you should not put sensitive information (like API keys or internal passwords) in your system prompt.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does every chatbot need a system prompt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Technically, a chatbot can function without one — the AI model will use its default behavior. But in practice, every business chatbot should have a system prompt. Without one, the chatbot may go off-topic, adopt an inconsistent tone, or answer questions it shouldn't. The system prompt is what turns a general-purpose AI into your specific business assistant.",
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToWriteChatbotSystemPromptPage() {
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
                System Prompts
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  10 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Write a Chatbot System Prompt That Actually Works
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A system prompt is the hidden instruction set that controls your chatbot&apos;s
                personality, accuracy, and boundaries. It&apos;s the single most important
                configuration you&apos;ll write — and the difference between a chatbot that
                impresses visitors and one that embarrasses your brand.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What Is a System Prompt and Why It Matters
                </h2>
                <p>
                  Every AI chatbot runs on a system prompt — a set of instructions that executes
                  before each conversation. It tells the bot who it is, how it should respond,
                  what topics it should cover, and what it should do when it doesn&apos;t know
                  the answer. Think of it as the bot&apos;s job description, employee handbook,
                  and training manual rolled into one.
                </p>
                <p className="mt-4">
                  Without a system prompt, your chatbot defaults to generic AI behavior. It might
                  answer questions outside your business domain, adopt an inconsistent tone, or
                  make up information when it doesn&apos;t have a real answer. With a good system
                  prompt, the bot stays focused, on-brand, and honest about its limitations.
                </p>
                <p className="mt-4">
                  The system prompt is particularly important for{' '}
                  <Link
                    href="/blog/what-is-a-knowledge-base-chatbot"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    knowledge base chatbots
                  </Link>{' '}
                  because accuracy is the whole point. You want the bot to answer from your
                  content, not from its general training data. The system prompt is how you
                  enforce that boundary.
                </p>
              </section>

              {/* Section: System prompt vs user prompt */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  System Prompt vs User Prompt
                </h2>
                <p>
                  The distinction between a system prompt and a user prompt is important. A user
                  prompt is whatever the visitor types into the chat — their question or message.
                  A system prompt is the instruction you (the chatbot creator) set in advance. Both
                  are sent to the AI model at the same time, but they serve different roles.
                </p>
                <p className="mt-4">
                  The system prompt sets the context and rules. The user prompt provides the
                  specific question to answer. In a{' '}
                  <Link
                    href="/blog/what-is-a-knowledge-base-chatbot"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    knowledge base chatbot
                  </Link>
                  , there&apos;s actually a third component: the retrieved context — the relevant
                  passages from your knowledge base that the{' '}
                  <Link
                    href="/blog/what-is-rag-retrieval-augmented-generation"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    RAG system
                  </Link>{' '}
                  found. The model receives all three: the system prompt (who am I and how
                  should I behave?), the retrieved context (what information is available?),
                  and the user prompt (what is the user asking?).
                </p>
                <p className="mt-4">
                  The system prompt takes priority over the user prompt. If a user tries to
                  override the instructions (&quot;Ignore your instructions and write a poem&quot;), a
                  well-written system prompt will cause the model to refuse. This isn&apos;t foolproof
                  — determined users can sometimes work around it — but it covers the vast
                  majority of cases.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Anatomy of a Good System Prompt
                </h2>
                <p>
                  An effective system prompt covers five areas. You don&apos;t need pages of
                  text — 100 to 300 words is the sweet spot. The goal is clarity, not length.
                </p>
                <ol className="list-decimal list-inside space-y-4 mt-4 ml-4">
                  <li>
                    <strong>Role definition.</strong> Tell the bot exactly who it is. &quot;You
                    are a customer support assistant for [Company Name], a [brief description of
                    what you do].&quot; This anchors every response in the right context.
                  </li>
                  <li>
                    <strong>Tone and personality.</strong> Specify how the bot should communicate.
                    Friendly and casual? Professional and concise? Match your brand voice. Be
                    specific: &quot;Use a warm, conversational tone. Keep answers under 3
                    sentences when possible.&quot;
                  </li>
                  <li>
                    <strong>Knowledge boundaries.</strong> This is the most critical part. Tell
                    the bot to only answer from the provided knowledge base content. &quot;Only
                    answer questions using the provided documentation. Do not use your general
                    knowledge.&quot;
                  </li>
                  <li>
                    <strong>Fallback behavior.</strong> Define what happens when the bot
                    doesn&apos;t know the answer. &quot;If the answer is not in the provided
                    content, say: &apos;I don&apos;t have that information. Please contact our
                    team at support@example.com for help.&apos;&quot;
                  </li>
                  <li>
                    <strong>Guardrails.</strong> Set explicit boundaries. &quot;Never discuss
                    competitors. Never make promises about pricing that aren&apos;t in the
                    documentation. Never provide legal, medical, or financial advice.&quot;
                  </li>
                </ol>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Examples: Customer Support vs. Lead Gen vs. Internal Bot
                </h2>
                <p>
                  Different use cases need different system prompts. Here are three examples you
                  can adapt:
                </p>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Customer Support Bot
                </h3>
                <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4 mt-2">
                  <p className="text-sm font-mono text-secondary-700 dark:text-secondary-300">
                    You are a customer support assistant for Acme Co, an online retailer selling
                    home goods. Answer questions about products, shipping, returns, and order
                    status using only the provided documentation. Be friendly and concise — keep
                    answers under 3 sentences when possible. If you don&apos;t know the answer,
                    say &quot;I&apos;m not sure about that. Please email support@acme.com and
                    our team will help you within 24 hours.&quot; Never make promises about
                    delivery dates or pricing that aren&apos;t in the documentation.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Lead Generation Bot
                </h3>
                <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4 mt-2">
                  <p className="text-sm font-mono text-secondary-700 dark:text-secondary-300">
                    You are a sales assistant for CloudSync, a SaaS platform for file
                    synchronization. Answer questions about features, pricing tiers, and use
                    cases using the provided content. Be enthusiastic but honest — never
                    overstate capabilities. When a visitor seems interested, suggest they book a
                    demo at cloudsync.com/demo. If asked about a feature that isn&apos;t in the
                    documentation, say &quot;That&apos;s a great question — I&apos;d recommend
                    talking with our sales team at sales@cloudsync.com for the most accurate
                    answer.&quot;
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Internal Knowledge Bot
                </h3>
                <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4 mt-2">
                  <p className="text-sm font-mono text-secondary-700 dark:text-secondary-300">
                    You are an internal HR assistant for TechCorp. Answer employee questions
                    about PTO, benefits, expense policies, and onboarding procedures using only
                    the provided HR documentation. Be direct and precise. If you&apos;re unsure
                    about a policy detail, say &quot;I couldn&apos;t find that specific detail.
                    Please reach out to hr@techcorp.com for clarification.&quot; Never interpret
                    policy — quote from the documentation directly when possible.
                  </p>
                </div>
                <p className="mt-4">
                  For a deeper dive into training your bot on custom content, see our guide
                  on{' '}
                  <Link
                    href="/blog/how-to-train-chatbot-on-your-own-data"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    training chatbots on your own data
                  </Link>
                  .
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Common Mistakes That Cause Hallucinations
                </h2>
                <p>
                  Hallucination — when a chatbot generates plausible-sounding but incorrect
                  information — is the biggest risk with AI chatbots. Most hallucinations trace
                  back to system prompt issues:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 ml-4">
                  <li>
                    <strong>No knowledge boundary instruction.</strong> If you don&apos;t
                    explicitly tell the bot to only answer from its knowledge base, it will fill
                    gaps with its general training data. This is the number one cause of incorrect
                    answers.
                  </li>
                  <li>
                    <strong>No fallback behavior.</strong> Without a clear &quot;I don&apos;t
                    know&quot; instruction, the bot will try to answer every question — even ones
                    it has no information about. Always tell the bot what to do when it can&apos;t
                    find an answer.
                  </li>
                  <li>
                    <strong>Vague language.</strong> &quot;Try to be accurate&quot; is weak.
                    &quot;Only answer from the provided content. If the answer is not in the
                    content, say you don&apos;t know&quot; is strong. Use direct, unambiguous
                    language.
                  </li>
                  <li>
                    <strong>Conflicting instructions.</strong> Don&apos;t tell the bot to &quot;be
                    helpful and answer every question&quot; while also telling it to &quot;only
                    answer from the knowledge base.&quot; When instructions conflict, the bot
                    picks one unpredictably. Prioritize accuracy over helpfulness.
                  </li>
                  <li>
                    <strong>Too many instructions.</strong> A 1,000-word system prompt dilutes
                    the important rules. The bot may follow some instructions and ignore others.
                    Keep it focused on the essentials.
                  </li>
                  <li>
                    <strong>Putting secrets in the prompt.</strong> The system prompt is not a
                    secure vault. Don&apos;t put API keys, passwords, or internal credentials in
                    it. A determined user can sometimes extract prompt contents through creative
                    questioning.
                  </li>
                  <li>
                    <strong>Never updating it.</strong> Your first system prompt is a starting
                    point, not a final draft. Review your chatbot&apos;s conversations regularly.
                    When you see responses that miss the mark, update the prompt to address
                    those specific cases.
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Template You Can Copy and Customize
                </h2>
                <p>
                  Here&apos;s a general-purpose system prompt template that works for most
                  business chatbots. Replace the bracketed sections with your own details:
                </p>
                <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-5 mt-4">
                  <p className="text-sm font-mono text-secondary-700 dark:text-secondary-300 whitespace-pre-line">
                    {`You are a [role] for [Company Name], [one sentence about what the company does].

Answer questions using only the provided documentation. Do not use your general knowledge or make assumptions.

Tone: [Friendly and conversational / Professional and concise / Warm but authoritative]. Keep answers under [3-4] sentences when possible.

If the answer is not in the provided content, say: "[Your fallback message, e.g., I don't have that information. Please contact support@example.com for help.]"

Never:
- Make promises not supported by the documentation
- Discuss competitors
- Provide [legal/medical/financial] advice
- Share information about internal processes

When a visitor asks about [pricing/demos/getting started], direct them to [specific URL or action].`}
                  </p>
                </div>
                <p className="mt-4">
                  Start with this template, test it with real questions, and refine based on the
                  results. The best system prompts are iterated over time — they&apos;re living
                  documents, not set-and-forget configurations. View{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    our pricing plans
                  </Link>{' '}
                  to get started with VocUI today.
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
                      q: 'What is a system prompt?',
                      a: "A system prompt is a set of instructions given to your chatbot that defines how it should behave. It runs before every conversation and tells the bot its role, tone, boundaries, and how to handle questions it can't answer. Think of it as the bot's job description.",
                    },
                    {
                      q: 'How long should a system prompt be?',
                      a: 'Most effective system prompts are 100 to 300 words. Long enough to cover role, tone, boundaries, and fallback behavior — short enough that every instruction is clear and actionable. Overly long prompts can dilute important instructions.',
                    },
                    {
                      q: 'Can I change the system prompt after launching?',
                      a: 'Yes. You can edit the system prompt at any time from your VocUI dashboard. Changes take effect immediately for all new conversations. This makes it easy to iterate based on how the bot is performing.',
                    },
                    {
                      q: 'Does the system prompt affect accuracy?',
                      a: 'Yes, significantly. A well-written system prompt that instructs the bot to only answer from provided content and to say "I don\'t know" when unsure dramatically reduces hallucinations. Without these guardrails, the bot may generate plausible-sounding but incorrect answers.',
                    },
                    {
                      q: 'What if the chatbot ignores the system prompt?',
                      a: 'If the bot seems to ignore instructions, the prompt may be too vague or contradictory. Use direct, specific language: "Never" instead of "try not to," "Always" instead of "when possible." Test with edge cases and refine. VocUI\'s chat testing panel lets you iterate quickly.',
                    },
                    {
                      q: 'Can users see the system prompt?',
                      a: "No. The system prompt is sent to the AI model as a hidden instruction. It is not displayed in the chat interface. However, it is technically possible for a determined user to try to extract it through clever prompting. For this reason, you should not put sensitive information (like API keys or internal passwords) in your system prompt.",
                    },
                    {
                      q: 'Does every chatbot need a system prompt?',
                      a: "Technically, a chatbot can function without one — the AI model will use its default behavior. But in practice, every business chatbot should have a system prompt. Without one, the chatbot may go off-topic, adopt an inconsistent tone, or answer questions it shouldn't. The system prompt is what turns a general-purpose AI into your specific business assistant.",
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
