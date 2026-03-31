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
  title: 'Chatbot Analytics: What to Track and Why It Matters | VocUI',
  description:
    'Track the right chatbot metrics to improve performance. Learn which analytics matter — from conversation volume and deflection rate to satisfaction and conversion.',
  openGraph: {
    title: 'Chatbot Analytics: What to Track and Why It Matters | VocUI',
    description:
      'Track the right chatbot metrics to improve performance. Learn which analytics matter — from conversation volume and deflection rate to satisfaction and conversion.',
    url: 'https://vocui.com/blog/chatbot-analytics-what-to-track',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot Analytics: What to Track and Why It Matters | VocUI',
    description:
      'Track the right chatbot metrics to improve performance. Learn which analytics matter — from conversation volume and deflection rate to satisfaction and conversion.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-analytics-what-to-track' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Chatbot Analytics: What to Track and Why It Matters',
      description:
        'Track the right chatbot metrics to improve performance. Learn which analytics matter \u2014 from conversation volume and deflection rate to satisfaction and conversion.',
      url: 'https://vocui.com/blog/chatbot-analytics-what-to-track',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-analytics-what-to-track',
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
        url: 'https://vocui.com/blog/chatbot-analytics-what-to-track/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: "What's the most important chatbot metric?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Resolution rate \u2014 the percentage of conversations where the chatbot successfully answers the visitor\u2019s question without human escalation. This single metric tells you whether your chatbot is doing its primary job. A healthy resolution rate is 60\u201380%. If yours is below 50%, your knowledge base needs significant improvement. If it\u2019s above 80%, your chatbot is handling most queries effectively and you can focus on optimizing other aspects.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I track deflection rate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Deflection rate measures conversations the chatbot handles that would have otherwise required human support. Calculate it by comparing your support ticket volume before and after deploying the chatbot, or by counting conversations where the chatbot resolved the issue without triggering an escalation to your team. A simpler proxy: count conversations that end without the visitor contacting support through another channel within 24 hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I see individual conversations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, most chatbot platforms including VocUI provide access to full conversation logs. You can read the complete exchange between the visitor and the chatbot, see which knowledge sources were used to generate answers, and identify where the conversation went well or poorly. Reviewing individual conversations is essential for finding specific improvement opportunities that aggregate metrics miss.',
          },
        },
        {
          '@type': 'Question',
          name: "What's a good resolution rate?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A good resolution rate for a well-configured chatbot is 60\u201380%. Rates below 50% indicate significant gaps in your knowledge base or system prompt. Rates above 80% are excellent and suggest your chatbot is handling most visitor questions effectively. Keep in mind that some questions should always escalate to humans (complaints, complex account issues, sensitive topics), so 100% resolution is neither realistic nor desirable.',
          },
        },
        {
          '@type': 'Question',
          name: 'How often should I review analytics?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Weekly during the first month after launch, then monthly once your chatbot is performing consistently. Weekly reviews during the early period help you catch and fix problems quickly while the chatbot is still being calibrated. After the first month, monthly reviews are sufficient to track trends, identify new question patterns, and keep your knowledge base current. Set a recurring calendar reminder so reviews happen consistently.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotAnalyticsWhatToTrackPage() {
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
                Chatbot Analytics: What to Track
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Best Practice
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                Chatbot Analytics: What to Track and Why It Matters
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Most businesses deploy a chatbot and never look at the data. That&apos;s like
                running ads without checking the results. Chatbot analytics tell you what&apos;s
                working, what&apos;s broken, and where to focus your improvement efforts. Track
                the right metrics &mdash; conversation volume, resolution rate, common questions,
                and conversion impact &mdash; and your chatbot gets better every month.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Chatbot Analytics Matter
                </h2>
                <p>
                  A chatbot without analytics is a black box. You know visitors are using it, but
                  you don&apos;t know if it&apos;s helping them, frustrating them, or giving them
                  wrong information. Analytics transform your chatbot from a static tool into an
                  evolving system that improves based on real data. Without measurement, you&apos;re
                  guessing about performance. With measurement, you&apos;re making informed
                  decisions.
                </p>
                <p className="mt-4">
                  Analytics also justify the investment. When your boss or stakeholders ask whether
                  the chatbot is worth it, data provides the answer. &quot;Our chatbot resolved
                  340 conversations last month that would have required support agents, saving an
                  estimated $2,700 in labor costs&quot; is far more compelling than &quot;people
                  seem to use it.&quot;
                </p>
                <p className="mt-4">
                  The businesses that get the most value from chatbots are the ones that treat
                  analytics as a core part of the operation, not an afterthought. They review data
                  regularly, identify patterns, make improvements, and track whether those
                  improvements had the desired effect. This feedback loop is what separates a
                  chatbot that stagnates from one that continuously gets better. Read our{' '}
                  <Link
                    href="/blog/how-to-measure-chatbot-roi"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    guide to measuring chatbot ROI
                  </Link>{' '}
                  for a detailed framework on connecting metrics to business outcomes.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Conversation Volume and Trends
                </h2>
                <p>
                  Conversation volume is your baseline metric: how many chat sessions happen per
                  day, week, and month. Track this over time to understand usage patterns. You&apos;ll
                  see trends &mdash; higher volume on certain days of the week, spikes during
                  marketing campaigns, dips during holidays. These patterns help you understand
                  when your chatbot is most needed and plan your knowledge base updates
                  accordingly.
                </p>
                <p className="mt-4">
                  A sudden spike in volume might indicate a problem: a confusing product update,
                  a billing issue, or a broken link on your website. Conversely, a sudden drop
                  might mean the chatbot is hidden or not loading properly. Volume alone
                  doesn&apos;t tell you about quality, but dramatic changes in volume always
                  warrant investigation.
                </p>
                <p className="mt-4">
                  Compare conversation volume against your website traffic to calculate your
                  chatbot engagement rate &mdash; the percentage of visitors who interact with the
                  chatbot. A typical engagement rate is 5&ndash;15%, depending on chatbot
                  placement and how proactively it greets visitors. If your rate is below 3%,
                  your chatbot might be too hard to find or its greeting message isn&apos;t
                  compelling enough to start a conversation.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Resolution Rate and Deflection Rate
                </h2>
                <p>
                  Resolution rate measures how often your chatbot successfully answers a
                  visitor&apos;s question without requiring human intervention. This is the
                  single most important metric for evaluating chatbot effectiveness. A
                  well-configured chatbot should resolve 60&ndash;80% of conversations. If
                  yours is below 50%, your knowledge base has significant gaps that need
                  addressing.
                </p>
                <p className="mt-4">
                  Deflection rate is a related metric that measures how many support tickets your
                  chatbot prevents. Calculate it by comparing your support volume before and after
                  deploying the chatbot, or by tracking conversations that end without the visitor
                  contacting support through another channel. A high deflection rate directly
                  reduces your support costs and frees your team to focus on complex issues that
                  genuinely need human attention.
                </p>
                <p className="mt-4">
                  Track both metrics monthly and watch for trends. A declining resolution rate
                  often signals that your knowledge base is becoming outdated or that visitor
                  questions are shifting to topics you haven&apos;t covered. An improving
                  resolution rate confirms that your knowledge base updates are working. Use
                  these trends to prioritize your monthly review efforts. See our{' '}
                  <Link
                    href="/blog/how-to-improve-chatbot-accuracy"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    accuracy improvement guide
                  </Link>{' '}
                  for specific techniques to boost resolution rates.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Most Common Questions Asked
                </h2>
                <p>
                  Knowing what visitors ask most frequently is arguably as valuable as knowing
                  how well your chatbot answers. The list of top questions reveals what your
                  customers care about, what information is hard to find on your website, and
                  what gaps exist in your existing content. This data should influence not just
                  your chatbot strategy but your website content, marketing messaging, and
                  product decisions.
                </p>
                <p className="mt-4">
                  Group similar questions into categories. You might find that 30% of questions
                  are about pricing, 20% about specific features, 15% about integrations, and
                  the rest spread across various topics. This distribution tells you where to
                  invest your knowledge base efforts. If pricing questions dominate, make sure
                  your pricing content is comprehensive and up to date. If feature questions are
                  growing, you might need to improve your product documentation.
                </p>
                <p className="mt-4">
                  Pay special attention to questions that weren&apos;t in your original
                  knowledge base plan. These are topics you didn&apos;t anticipate but your
                  customers care about. Adding coverage for these questions is the fastest way
                  to improve your resolution rate because you&apos;re directly addressing
                  demonstrated demand. Review your top questions monthly and ensure every
                  high-volume topic has thorough, accurate content in your knowledge base.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Unanswered or Low-Confidence Queries
                </h2>
                <p>
                  Every question your chatbot can&apos;t answer is an improvement opportunity.
                  Track unanswered queries &mdash; questions where the chatbot triggered its
                  fallback response or gave a vague, non-specific answer. These are the gaps in
                  your knowledge base, clearly identified by your visitors. Fixing the top 5
                  unanswered queries each month can improve your resolution rate by 5&ndash;10
                  percentage points.
                </p>
                <p className="mt-4">
                  Also watch for low-confidence responses &mdash; answers where the chatbot
                  responded but the content was only marginally relevant to the question. These
                  are harder to spot in aggregate data but visible when you review individual
                  conversations. The chatbot gave an answer, but it wasn&apos;t quite right
                  because the knowledge base content didn&apos;t precisely match the question.
                  These situations often need content restructuring rather than new content.
                </p>
                <p className="mt-4">
                  Create a running list of unanswered queries and review it during your monthly
                  knowledge base audit. Prioritize by frequency &mdash; a question asked 50 times
                  that the chatbot can&apos;t answer matters more than one asked twice. Over
                  time, this list gets shorter as your knowledge base becomes more comprehensive,
                  and your chatbot&apos;s performance climbs steadily. Learn more in our{' '}
                  <Link
                    href="/blog/chatbot-best-practices-for-small-business"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    chatbot best practices guide
                  </Link>.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Conversion and Lead Capture Metrics
                </h2>
                <p>
                  If your chatbot captures leads or drives sign-ups, track the conversion funnel:
                  how many visitors engage with the chatbot, how many reach the point where the
                  chatbot offers to capture contact information, and how many actually provide it.
                  This funnel analysis tells you where visitors drop off and where to optimize.
                  Maybe the chatbot is engaging plenty of visitors but the lead capture prompt
                  feels too aggressive, causing drop-offs.
                </p>
                <p className="mt-4">
                  Compare conversion rates between visitors who use the chatbot and those who
                  don&apos;t. This chatbot-assisted conversion rate is the clearest measure of
                  whether the chatbot is driving business results. If chatbot users convert at a
                  higher rate, the chatbot is proving its value. If there&apos;s no difference or
                  chatbot users convert less, the chatbot experience might be creating friction
                  rather than removing it.
                </p>
                <p className="mt-4">
                  Also measure lead quality, not just quantity. Are leads captured through the
                  chatbot more or less likely to become paying customers than leads from your
                  contact form? Chatbot-captured leads often include context from the conversation
                  &mdash; what the visitor asked about, what features they care about &mdash;
                  that makes them easier to qualify and follow up with. This context is a
                  significant advantage over a blank form submission. Visit our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>{' '}
                  to see plans that include built-in analytics dashboards.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Building a Monthly Review Process
                </h2>
                <p>
                  Consistency matters more than depth. A 30-minute monthly review that happens
                  every month is more valuable than a thorough quarterly review that gets skipped.
                  Set a recurring calendar reminder and build a simple review checklist: check
                  conversation volume trends, review resolution rate, scan the top unanswered
                  queries, read 10&ndash;15 recent conversations, and update your knowledge base
                  with at least one improvement.
                </p>
                <p className="mt-4">
                  Keep a simple log of changes and their impact. &quot;March: Added FAQ about
                  shipping times. Resolution rate improved from 64% to 71%.&quot; This log helps
                  you understand which types of changes produce the biggest improvements and
                  builds an institutional knowledge of what works. Over six months, you&apos;ll
                  have a clear record of how your chatbot has evolved and the measurable impact of
                  each change.
                </p>
                <p className="mt-4">
                  Share key metrics with your team. When everyone can see how the chatbot is
                  performing, they&apos;re more likely to contribute knowledge base content, flag
                  issues they notice, and support the ongoing investment. A monthly email or
                  Slack message with three numbers &mdash; conversation volume, resolution rate,
                  and estimated tickets deflected &mdash; keeps stakeholders informed and engaged
                  without requiring them to dig into a dashboard.
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
                      q: "What's the most important chatbot metric?",
                      a: "Resolution rate \u2014 the percentage of conversations where the chatbot successfully answers the visitor\u2019s question without human escalation. This single metric tells you whether your chatbot is doing its primary job. A healthy resolution rate is 60\u201380%. If yours is below 50%, your knowledge base needs significant improvement. If it\u2019s above 80%, your chatbot is handling most queries effectively and you can focus on optimizing other aspects.",
                    },
                    {
                      q: 'How do I track deflection rate?',
                      a: "Deflection rate measures conversations the chatbot handles that would have otherwise required human support. Calculate it by comparing your support ticket volume before and after deploying the chatbot, or by counting conversations where the chatbot resolved the issue without triggering an escalation to your team. A simpler proxy: count conversations that end without the visitor contacting support through another channel within 24 hours.",
                    },
                    {
                      q: 'Can I see individual conversations?',
                      a: "Yes, most chatbot platforms including VocUI provide access to full conversation logs. You can read the complete exchange between the visitor and the chatbot, see which knowledge sources were used to generate answers, and identify where the conversation went well or poorly. Reviewing individual conversations is essential for finding specific improvement opportunities that aggregate metrics miss.",
                    },
                    {
                      q: "What's a good resolution rate?",
                      a: "A good resolution rate for a well-configured chatbot is 60\u201380%. Rates below 50% indicate significant gaps in your knowledge base or system prompt. Rates above 80% are excellent and suggest your chatbot is handling most visitor questions effectively. Keep in mind that some questions should always escalate to humans (complaints, complex account issues, sensitive topics), so 100% resolution is neither realistic nor desirable.",
                    },
                    {
                      q: 'How often should I review analytics?',
                      a: "Weekly during the first month after launch, then monthly once your chatbot is performing consistently. Weekly reviews during the early period help you catch and fix problems quickly while the chatbot is still being calibrated. After the first month, monthly reviews are sufficient to track trends, identify new question patterns, and keep your knowledge base current. Set a recurring calendar reminder so reviews happen consistently.",
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
            <h2 className="text-2xl font-bold mb-3">Put this into practice -- today</h2>
            <p className="text-white/80 mb-2">
              You have the strategy. VocUI gives you the platform to execute it without writing code.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Your first chatbot is free. Most teams are live in under an hour.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Launch your first chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Start building -- your first chatbot is free</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
