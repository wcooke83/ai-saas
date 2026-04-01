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
  title: 'How to Create an FAQ Chatbot in Minutes | VocUI',
  description:
    'Learn how to create an FAQ chatbot that answers common customer questions instantly. No coding required — just upload your FAQs and go live.',
  openGraph: {
    title: 'How to Create an FAQ Chatbot in Minutes | VocUI',
    description:
      'Learn how to create an FAQ chatbot that answers common customer questions instantly. No coding required — just upload your FAQs and go live.',
    url: 'https://vocui.com/blog/how-to-create-faq-chatbot',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Create an FAQ Chatbot in Minutes | VocUI',
    description:
      'Learn how to create an FAQ chatbot that answers common customer questions instantly. No coding required — just upload your FAQs and go live.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-create-faq-chatbot' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Create an FAQ Chatbot in Minutes',
      description:
        'Learn how to create an FAQ chatbot that answers common customer questions instantly. No coding required — just upload your FAQs and go live.',
      url: 'https://vocui.com/blog/how-to-create-faq-chatbot',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-create-faq-chatbot',
      },
      datePublished: '2026-03-09',
      dateModified: '2026-03-09',
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
        url: 'https://vocui.com/blog/how-to-create-faq-chatbot/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is an FAQ chatbot different from a regular FAQ page?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A traditional FAQ page is a static list that visitors have to scroll through or search manually. An FAQ chatbot lets visitors type their question in plain language and get an instant, conversational answer — even if the wording doesn\'t match your FAQ exactly. The chatbot uses AI to understand the intent behind each question and surfaces the most relevant answer from your content.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I update the FAQ content after launching?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can add, edit, or remove FAQ entries at any time from your VocUI dashboard. Changes are reflected within minutes — no need to redeploy your website or touch any code.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does an FAQ chatbot work on mobile?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely. The VocUI chat widget is fully responsive and designed for mobile screens. It floats as a small button in the corner and expands to a mobile-friendly chat window when tapped.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many questions can an FAQ chatbot handle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There is no hard limit on the number of FAQ entries. VocUI customers typically start with 20 to 50 questions and grow from there. The chatbot can handle hundreds of FAQ items without any performance issues.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I customize the look of the chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can customize the chatbot\'s colors, position, welcome message, avatar, and more from the VocUI dashboard. Match it to your brand so it feels like a natural part of your website.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToCreateFaqChatbotPage() {
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
                FAQ Chatbot
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2026-03-09" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 9, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  6 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Create an FAQ Chatbot in Minutes
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                An FAQ chatbot takes your frequently asked questions and turns them into an
                interactive, conversational experience. Instead of forcing visitors to scroll
                through a long list, they type their question and get an instant answer — powered
                by AI that understands natural language, not just exact keyword matches.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why FAQ Chatbots Beat Static FAQ Pages
                </h2>
                <p>
                  Static FAQ pages have been around since the early web, and they still have their
                  place. But they come with real limitations. Visitors have to guess which category
                  their question falls under, scan through dozens of entries, and hope the exact
                  phrasing matches what they&apos;re looking for. Most people give up and email
                  your support team instead.
                </p>
                <p className="mt-4">
                  An FAQ chatbot flips that experience. Visitors type a question in their own words
                  — &quot;do you ship to Canada?&quot; or &quot;what&apos;s your refund
                  policy?&quot; — and the chatbot finds the best answer from your content
                  instantly. There&apos;s no scrolling, no guessing, and no waiting for a human to
                  respond. The result is fewer support tickets, happier visitors, and a support
                  experience that feels modern.
                </p>
                <p className="mt-4">
                  FAQ chatbots also collect data about what people are asking. Over time, you can
                  spot gaps in your content, discover questions you never thought to include, and
                  improve your answers based on real usage patterns.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What You Need to Get Started
                </h2>
                <p>
                  Creating an FAQ chatbot is simpler than you might expect. You don&apos;t need
                  any coding skills, API integrations, or machine learning expertise. Here&apos;s
                  what you&apos;ll need:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>
                    <strong>Your FAQ content</strong> — This can be an existing FAQ page, a
                    spreadsheet of questions and answers, a PDF document, or even a help center
                    URL. If you can read it, VocUI can train on it.
                  </li>
                  <li>
                    <strong>A VocUI account</strong> — The free plan includes everything you need
                    to build and deploy your first FAQ chatbot.
                  </li>
                  <li>
                    <strong>Five minutes</strong> — Seriously. The setup process from sign-up to
                    live chatbot typically takes less time than writing a single support email.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step: Creating Your FAQ Chatbot with VocUI
                </h2>
                <p>
                  Here&apos;s the process from start to finish. No coding, no complex
                  configuration — just straightforward steps.
                </p>
                <ol className="list-decimal pl-5 space-y-4 mt-4">
                  <li>
                    <strong>Create a new chatbot.</strong> Log in to your VocUI dashboard and click
                    &quot;Create Chatbot.&quot; Give it a name that reflects its purpose — something
                    like &quot;Support FAQ Bot&quot; or &quot;Help Center Assistant.&quot;
                  </li>
                  <li>
                    <strong>Add your FAQ content as a knowledge source.</strong> You have several
                    options: paste a URL to your existing FAQ page and VocUI will scrape the
                    content automatically, upload a PDF or DOCX file containing your Q&amp;As, or
                    enter question-and-answer pairs directly. Most users start by pointing the bot
                    at their existing FAQ or help center URL.
                    <DashboardPath steps={['Chatbots', 'Create New', 'Knowledge Sources', 'Add']} tip="Choose URL, PDF, or manual Q&A to add your content." />
                  </li>
                  <li>
                    <strong>Customize the system prompt.</strong> The default prompt works well for
                    most FAQ use cases, but you can tailor it. Tell the bot to only answer from the
                    provided content, set a friendly tone, and instruct it to say &quot;I don&apos;t
                    know&quot; when a question falls outside the FAQ. Check out our guide
                    on{' '}
                    <Link
                      href="/blog/how-to-write-chatbot-system-prompt"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      writing effective system prompts
                    </Link>{' '}
                    for detailed tips.
                  </li>
                  <li>
                    <strong>Style the widget.</strong> Choose colors, set the chat bubble position,
                    write a welcome message, and pick an avatar. Make it match your brand so it
                    feels like a native part of your website.
                  </li>
                  <li>
                    <strong>Deploy.</strong> Copy the one-line embed code from the Deploy tab and
                    paste it into your website. See our guide
                    on{' '}
                    <Link
                      href="/blog/how-to-add-chatbot-to-website"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      adding a chatbot to your website
                    </Link>{' '}
                    for platform-specific instructions.
                  </li>
                </ol>
                <p className="mt-4">
                  That&apos;s it. Your FAQ chatbot is now live and ready to answer visitor
                  questions 24/7.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Tips for Writing Great FAQ Content
                </h2>
                <p>
                  The quality of your FAQ chatbot depends entirely on the quality of the content
                  you feed it. Here are some best practices for writing FAQ content that produces
                  accurate, helpful chatbot responses:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>
                    <strong>Write answers in complete sentences.</strong> Instead of bullet-point
                    fragments, write full, conversational answers. The chatbot will echo this tone
                    in its responses.
                  </li>
                  <li>
                    <strong>Cover one topic per question.</strong> Don&apos;t bundle multiple
                    topics into a single FAQ entry. &quot;What&apos;s your return policy?&quot; and
                    &quot;How long do refunds take?&quot; should be separate items.
                  </li>
                  <li>
                    <strong>Include variations of common questions.</strong> People ask the same
                    thing in different ways. If you know customers ask &quot;Do you offer free
                    shipping?&quot; and &quot;How much does delivery cost?&quot;, include both
                    variations in your content.
                  </li>
                  <li>
                    <strong>Keep answers concise but complete.</strong> Aim for 2-4 sentences per
                    answer. Enough to be helpful, short enough to read quickly in a chat window.
                  </li>
                  <li>
                    <strong>Update regularly.</strong> Set a monthly reminder to review your FAQ
                    content. Add new questions based on what customers are actually asking (VocUI&apos;s
                    analytics dashboard shows you exactly this).
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  When to Upgrade from FAQ Bot to Full Knowledge Base
                </h2>
                <p>
                  An FAQ chatbot is a great starting point, but some businesses outgrow it. If
                  you find yourself adding hundreds of entries, including long-form documentation,
                  or needing the bot to handle complex multi-step questions, it might be time to
                  upgrade to a{' '}
                  <Link
                    href="/blog/what-is-a-knowledge-base-chatbot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    full knowledge base chatbot
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  The difference is scope. An FAQ chatbot works best with short, self-contained
                  question-and-answer pairs. A knowledge base chatbot can ingest entire help
                  centers, product documentation, policy manuals, and training materials — then
                  synthesize answers that draw from multiple sources.
                </p>
                <p className="mt-4">
                  The good news: with VocUI, upgrading is seamless. Your FAQ content stays in
                  place. You simply add more knowledge sources — URLs, PDFs, documents — and the
                  bot gets smarter. There&apos;s no migration, no rebuilding, and no downtime.
                  Check out{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    our pricing plans
                  </Link>{' '}
                  to see which tier fits your needs.
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
                      q: 'How is an FAQ chatbot different from a regular FAQ page?',
                      a: 'A traditional FAQ page is a static list that visitors have to scroll through or search manually. An FAQ chatbot lets visitors type their question in plain language and get an instant, conversational answer — even if the wording doesn\'t match your FAQ exactly. The chatbot uses AI to understand the intent behind each question and surfaces the most relevant answer from your content.',
                    },
                    {
                      q: 'Can I update the FAQ content after launching?',
                      a: 'Yes. You can add, edit, or remove FAQ entries at any time from your VocUI dashboard. Changes are reflected within minutes — no need to redeploy your website or touch any code.',
                    },
                    {
                      q: 'Does an FAQ chatbot work on mobile?',
                      a: 'Absolutely. The VocUI chat widget is fully responsive and designed for mobile screens. It floats as a small button in the corner and expands to a mobile-friendly chat window when tapped.',
                    },
                    {
                      q: 'How many questions can an FAQ chatbot handle?',
                      a: 'There is no hard limit on the number of FAQ entries. VocUI customers typically start with 20 to 50 questions and grow from there. The chatbot can handle hundreds of FAQ items without any performance issues.',
                    },
                    {
                      q: 'Can I customize the look of the chatbot?',
                      a: 'Yes. You can customize the chatbot\'s colors, position, welcome message, avatar, and more from the VocUI dashboard. Match it to your brand so it feels like a natural part of your website.',
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
