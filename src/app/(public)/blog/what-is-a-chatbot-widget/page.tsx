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
  title: 'What Is a Chatbot Widget and How Does It Work? | VocUI',
  description:
    'A chatbot widget is a small chat interface embedded on your website. Learn how it works, what it looks like, and how to add one to your site.',
  openGraph: {
    title: 'What Is a Chatbot Widget and How Does It Work? | VocUI',
    description:
      'A chatbot widget is a small chat interface embedded on your website. Learn how it works, what it looks like, and how to add one to your site.',
    url: 'https://vocui.com/blog/what-is-a-chatbot-widget',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is a Chatbot Widget and How Does It Work? | VocUI',
    description:
      'A chatbot widget is a small chat interface embedded on your website. Learn how it works, what it looks like, and how to add one to your site.',
  },
  alternates: { canonical: 'https://vocui.com/blog/what-is-a-chatbot-widget' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What Is a Chatbot Widget and How Does It Work?',
      description:
        'An explainer on chatbot widgets — the small, embeddable chat interfaces that let website visitors ask questions and get instant AI-powered answers.',
      url: 'https://vocui.com/blog/what-is-a-chatbot-widget',
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
          name: 'What is a chatbot widget?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A chatbot widget is a small, interactive chat interface that is embedded directly on a website. It typically appears as a button in the bottom-right corner of the page. When clicked, it opens a chat window where visitors can type questions and receive instant AI-powered answers without leaving the page.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does a chatbot widget slow down my website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A well-built chatbot widget has minimal impact on page load speed. Most widgets load asynchronously, meaning the rest of your page loads first and the widget loads in the background. The VocUI widget script is lightweight and does not block page rendering.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I customize the colors of a chatbot widget?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Most chatbot platforms let you customize the widget\'s colors, position, greeting message, and avatar to match your brand. VocUI provides options for primary color, chat bubble position, welcome message, and display name.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does a chatbot widget appear on the page?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'By default, most chatbot widgets appear as a floating button in the bottom-right corner of the page. Some platforms also support bottom-left placement. The widget floats above your page content and stays visible as the visitor scrolls.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do visitors need to install anything to use a chatbot widget?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The chatbot widget runs entirely in the visitor\'s web browser. They don\'t need to install any software, create an account, or download an app. They simply click the chat button and start typing.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WhatIsAChatbotWidgetPage() {
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
                What Is a Chatbot Widget?
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
                <span className="text-xs text-secondary-400 dark:text-secondary-500">6 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                What Is a Chatbot Widget and How Does It Work?
              </h1>
            </header>

            {/* Featured snippet paragraph */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A chatbot widget is a small, interactive chat interface embedded directly on your
                website. It appears as a floating button — usually in the bottom-right corner —
                that visitors can click to open a conversation window and get instant answers
                without leaving your page.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What a chatbot widget is
                </h2>
                <p>
                  If you&apos;ve visited a website and noticed a small chat bubble in the corner of
                  the screen, you&apos;ve seen a chatbot widget. It&apos;s a lightweight chat interface
                  that sits on top of your existing website, giving visitors a way to ask
                  questions and get answers in real time. According to{' '}
                  <a href="https://www.tidio.com/blog/chatbot-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Tidio</a>,
                  88% of customers had at least one conversation with a chatbot in 2022 — these
                  widgets have become one of the most common touchpoints between businesses and
                  their customers. The widget is added to your site with a small piece of code —
                  typically a single script tag — and it works on any website regardless of the
                  platform.
                </p>
                <p className="mt-4">
                  Unlike a full-page chat application, a widget is designed to be unobtrusive. It
                  doesn&apos;t take over the screen or redirect visitors to another page. It floats
                  above your content, available when needed but out of the way when it&apos;s not. A
                  visitor can browse your site, click the chat button when they have a question,
                  get an answer, and go right back to what they were doing.
                </p>
                <p className="mt-4">
                  Modern chatbot widgets are powered by AI, which means they don&apos;t just match
                  keywords to canned responses. They understand the intent behind questions and
                  generate natural, conversational answers drawn from your{' '}
                  <Link href="/blog/what-is-a-knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base
                  </Link>
                  . This makes them far more useful than the rule-based chat popups of a few years ago.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How it appears on your site
                </h2>
                <p>
                  The widget has two visual states: collapsed and expanded. In its collapsed state,
                  it&apos;s a small circular button — often with a chat icon or your brand&apos;s logo —
                  floating in the bottom-right (or bottom-left) corner of the page. It stays
                  visible as visitors scroll, so it&apos;s always accessible without being intrusive.
                </p>
                <p className="mt-4">
                  When a visitor clicks the button, the widget expands into a chat window. This
                  window typically includes a header with your chatbot&apos;s name and avatar, a
                  message area showing the conversation history, and a text input where the
                  visitor types their question. Some widgets also display a welcome message or
                  suggested questions to help visitors get started.
                </p>
                <p className="mt-4">
                  The expanded chat window is sized to fit comfortably in the corner of the
                  screen — large enough to read and type comfortably, but small enough that it
                  doesn&apos;t cover the main page content. On mobile devices, most widgets expand
                  to fill more of the screen for easier typing and reading.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What happens when a visitor clicks it
                </h2>
                <p>
                  When a visitor clicks the chat button and types a question, a chain of events
                  happens behind the scenes in about 1-3 seconds. The visitor&apos;s question is sent
                  to your chatbot&apos;s backend, where it&apos;s processed through the{' '}
                  <Link href="/blog/what-is-rag-retrieval-augmented-generation" className="text-primary-600 dark:text-primary-400 hover:underline">
                    RAG pipeline
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  First, the system searches your knowledge base for the most relevant content
                  using semantic search. It finds the passages most closely related to the
                  visitor&apos;s question, regardless of the exact words used. Then, those passages
                  are passed to a language model along with the question and your system prompt.
                  The model generates a natural, conversational answer and streams it back to the
                  widget in real time.
                </p>
                <p className="mt-4">
                  The visitor sees the response appear word by word, similar to how ChatGPT
                  displays its responses. They can then ask follow-up questions, and the chatbot
                  maintains context from the conversation. According to{' '}
                  <a href="https://masterofcode.com/blog/chatbot-statistics" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Master of Code</a>,
                  80% of consumers have interacted with a chatbot at some point — and for many,
                  this widget-based experience is their first exposure. If the chatbot can&apos;t find
                  an answer in the knowledge base, it can be configured to suggest contacting
                  support, collecting the visitor&apos;s email, or redirecting them to a relevant page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Customization options
                </h2>
                <p>
                  A good chatbot widget doesn&apos;t look like a foreign element bolted onto your
                  site. It should feel like a natural part of your brand. Most chatbot platforms
                  offer several customization options to achieve this.
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Colors:</strong> Match the widget&apos;s primary color to your brand.
                    The chat button, header, and message bubbles all adopt your chosen color,
                    so the widget looks like it belongs on your site.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Position:</strong> Choose bottom-right or bottom-left placement
                    depending on your site layout. Bottom-right is the most common and what
                    visitors expect.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Greeting message:</strong> Set a welcome message that appears
                    when the widget opens. This can introduce the chatbot, set expectations
                    (&quot;I can help with questions about our products and pricing&quot;), or prompt
                    the visitor with a suggested first question.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Display name and avatar:</strong> Give your chatbot a name and
                    image. Some businesses use a human name and photo; others use their company
                    logo. Both work — the key is setting clear expectations about whether the
                    visitor is talking to AI or a human.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How to add one to your site
                </h2>
                <p>
                  Adding a chatbot widget to your website is straightforward. Most platforms —
                  including VocUI — give you a small script tag that you paste into your site&apos;s
                  HTML. It looks something like this:
                </p>
                <div className="mt-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/60 p-4 font-mono text-sm text-secondary-700 dark:text-secondary-300 overflow-x-auto">
                  &lt;script src=&quot;https://vocui.com/widget/your-chatbot-id.js&quot; async&gt;&lt;/script&gt;
                </div>
                <p className="mt-4">
                  You paste this before the closing <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag
                  of your website. If you&apos;re using a website builder like WordPress, Shopify,
                  Squarespace, or Wix, there are specific places to add custom code — usually in
                  the site settings or theme editor. Our step-by-step guides cover the details
                  for each platform:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">
                      How to add a chatbot to any website
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/how-to-embed-chatbot-in-wordpress" className="text-primary-600 dark:text-primary-400 hover:underline">
                      How to embed a chatbot in WordPress
                    </Link>
                  </li>
                </ul>
                <p className="mt-4">
                  The script loads asynchronously, meaning it won&apos;t block your page from
                  rendering. Your site loads first; the widget loads in the background.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Widget vs full-page chat
                </h2>
                <p>
                  A widget and a full-page chat interface serve different purposes. A widget is
                  designed for quick, contextual help — a visitor has a question while browsing
                  your site and wants an answer without interrupting their flow. A full-page chat
                  is a dedicated experience where the conversation is the primary activity.
                </p>
                <p className="mt-4">
                  For most business websites, the widget is the right choice. It&apos;s non-intrusive,
                  always available, and doesn&apos;t require visitors to navigate away from what
                  they&apos;re doing. Full-page chat makes more sense for internal tools — like an
                  employee knowledge bot or an internal help desk — where the user is specifically
                  going there to ask questions.
                </p>
                <p className="mt-4">
                  VocUI supports both formats. Every chatbot can be deployed as an embedded widget
                  on your site or shared as a standalone chat page via a direct link. You can also
                  deploy the same chatbot to{' '}
                  <Link href="/blog/how-to-set-up-slack-chatbot-for-team" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Slack
                  </Link>{' '}
                  for internal team use.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'What is a chatbot widget?',
                      a: "A chatbot widget is a small, interactive chat interface that is embedded directly on a website. It typically appears as a button in the bottom-right corner of the page. When clicked, it opens a chat window where visitors can type questions and receive instant AI-powered answers without leaving the page.",
                    },
                    {
                      q: 'Does a chatbot widget slow down my website?',
                      a: 'A well-built chatbot widget has minimal impact on page load speed. Most widgets load asynchronously, meaning the rest of your page loads first and the widget loads in the background. The VocUI widget script is lightweight and does not block page rendering.',
                    },
                    {
                      q: 'Can I customize the colors of a chatbot widget?',
                      a: "Yes. Most chatbot platforms let you customize the widget's colors, position, greeting message, and avatar to match your brand. VocUI provides options for primary color, chat bubble position, welcome message, and display name.",
                    },
                    {
                      q: 'Where does a chatbot widget appear on the page?',
                      a: 'By default, most chatbot widgets appear as a floating button in the bottom-right corner of the page. Some platforms also support bottom-left placement. The widget floats above your page content and stays visible as the visitor scrolls.',
                    },
                    {
                      q: 'Do visitors need to install anything to use a chatbot widget?',
                      a: "No. The chatbot widget runs entirely in the visitor's web browser. They don't need to install any software, create an account, or download an app. They simply click the chat button and start typing.",
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
