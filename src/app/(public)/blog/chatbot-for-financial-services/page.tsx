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
  title: 'AI Chatbots for Financial Services and Advisors | VocUI',
  description:
    'Financial advisors and service firms use AI chatbots to answer client questions about services, fees, and processes — while staying compliant with SEC and FINRA rules.',
  openGraph: {
    title: 'AI Chatbots for Financial Services and Advisors | VocUI',
    description:
      'Financial advisors and service firms use AI chatbots to answer client questions about services, fees, and processes — while staying compliant with SEC and FINRA rules.',
    url: 'https://vocui.com/blog/chatbot-for-financial-services',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Financial Services and Advisors | VocUI',
    description:
      'Financial advisors and service firms use AI chatbots to answer client questions about services, fees, and processes — while staying compliant with SEC and FINRA rules.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-financial-services' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Financial Services and Advisors',
      description:
        'Financial advisors and service firms use AI chatbots to answer client questions about services, fees, and processes — while staying compliant with SEC and FINRA rules.',
      url: 'https://vocui.com/blog/chatbot-for-financial-services',
      datePublished: '2025-03-31',
      dateModified: '2026-03-31',
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
          name: 'What is the difference between providing information and giving financial advice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Information is factual and general: "Our firm offers retirement planning, estate planning, and tax strategy services. Our minimum account size is $250,000." Advice is personalized and actionable: "Based on your situation, you should roll over your 401(k) into a Roth IRA." A chatbot should only provide information. Configure your system prompt to decline advice requests explicitly and direct those conversations to a licensed advisor. This distinction is fundamental to SEC and FINRA compliance — crossing the line from information to advice without proper licensing and suitability determination creates regulatory liability.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which financial regulations apply to chatbot communications?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For SEC-registered investment advisors (RIAs), the Investment Advisers Act of 1940 governs advertising and client communications. FINRA Rules 2210 and 2220 regulate communications with the public for broker-dealers. State securities regulators add additional requirements. The key principle across all of these: marketing communications must be fair, balanced, and not misleading. A chatbot trained on compliance-reviewed content that includes appropriate disclaimers operates within these boundaries because it only repeats information your firm has already approved for public use.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can prospects book consultations through the chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Configure the chatbot to share a direct link to your scheduling tool (Calendly, Acuity, or your firm\'s booking system) when a visitor expresses interest. The chatbot answers pre-meeting questions first — what to expect, what documents to prepare, how long the meeting takes — so prospects arrive informed and the meeting is more productive. This turns the chatbot into a lead qualification and booking assistant that operates outside business hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I prevent the chatbot from accessing client financial data?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot has no access to client data by design. It does not connect to your custodian, portfolio management platform, CRM, or any system containing client information. It only knows what you train it on — and your training content should be limited to public-facing materials: service descriptions, fee schedules, process overviews, and educational articles. Never upload client lists, portfolio reports, or account-specific documents to the knowledge base.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do SOX compliance requirements apply to the chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SOX (Sarbanes-Oxley Act) applies to publicly traded companies and their financial reporting. If your firm is publicly traded or provides services to public companies, SOX may affect your internal controls. However, since a VocUI chatbot does not process financial transactions, access internal accounting systems, or handle material non-public information, it falls outside the scope of SOX controls. It is a marketing and informational tool operating on publicly available content. Confirm with your compliance officer if you have specific SOX obligations.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForFinancialServicesPage() {
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
                Chatbot for Financial Services
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Use Case
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  9 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbots for Financial Services and Advisors
              </h1>
            </header>

            {/* Featured snippet — stat-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                The average financial advisor spends 20+ hours per month answering the same
                prospect questions: fee structures, account minimums, service offerings, and
                &quot;how does your process work?&quot; An AI chatbot handles these
                conversations instantly — on your website, at 9 PM, when that prospect is
                comparing three advisory firms from their couch.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Prospects Leave Before You Even Know They Visited
                </h2>
                <p>
                  Financial advisors and wealth management firms spend a disproportionate amount of
                  time answering the same pre-sales and onboarding questions. The trend toward automation in financial services is already well underway — according to <a href="https://coinlaw.io/banking-chatbot-adoption-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">CoinLaw</a>, 92% of North American banks now use AI-powered chatbots for customer interactions. Prospects want to
                  know about minimum investment thresholds, fee structures, services offered, and
                  how the engagement process works. These are high-value interactions — they often
                  precede a new client relationship. But the questions themselves are routine and
                  well-documented on your website.
                </p>
                <p className="mt-4">
                  The bottleneck is timing. Prospects research financial advisors in the evenings
                  and on weekends — precisely when your office is closed. A prospect visiting your
                  site at 9 PM with questions about your fee structure gets no answers. By Monday,
                  they&apos;ve visited three competitor sites that were either more informative or
                  had a chatbot that engaged them immediately. A chatbot bridges this gap by
                  providing instant, accurate answers from your approved content while you and
                  your team focus on client relationships.
                </p>
              </section>

              {/* Section 2 — unique: information vs. advice distinction */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Critical Line: Information vs. Financial Advice
                </h2>

                {/* Warning callout — unique to financial post */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-6 py-5 mb-6">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Compliance boundary
                  </p>
                  <p className="text-secondary-700 dark:text-secondary-300">
                    A chatbot should provide <em>information</em> (&quot;We offer Roth IRA
                    rollovers as part of our retirement planning service&quot;) but never
                    <em> advice</em> (&quot;You should roll your 401(k) into a Roth IRA&quot;).
                    This distinction determines whether the chatbot stays informational or
                    crosses into regulated advisory territory.
                  </p>
                </div>

                <p>
                  This is the most important concept for any financial services firm deploying
                  a chatbot. Information is factual and general: your firm&apos;s services, fee
                  schedules, minimum account sizes, process descriptions, and educational content
                  about financial concepts. Advice is personalized and actionable: analyzing
                  a client&apos;s specific situation and recommending a course of action.
                </p>
                <p className="mt-4">
                  A VocUI chatbot operates strictly in the informational category. It does not
                  analyze portfolios, recommend investments, evaluate a prospect&apos;s financial
                  situation, or suggest specific products. When a visitor asks &quot;Should I
                  convert my traditional IRA to a Roth?&quot; the chatbot explains what a Roth
                  conversion is, describes your firm&apos;s approach to retirement planning, and
                  suggests scheduling a consultation with a licensed advisor to discuss their
                  specific situation.
                </p>
                <p className="mt-4">
                  Configure this boundary in your system prompt with explicit instructions:
                  &quot;Never provide personalized financial advice. When asked for advice on
                  a specific situation, explain that personalized guidance requires a consultation
                  with a licensed advisor and provide the booking link.&quot; For more on writing
                  effective system prompts, see our guide on{' '}
                  <Link
                    href="/blog/how-to-write-chatbot-system-prompt"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    writing a chatbot system prompt
                  </Link>
                  .
                </p>
              </section>

              {/* Section 3 — regulation specifics — unique depth */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  SEC, FINRA, and State Compliance for Chatbot Communications
                </h2>
                <p>
                  Financial services is one of the most heavily regulated industries, and any
                  customer-facing communication tool needs to operate within those boundaries.
                  Here is how a VocUI chatbot fits within the major regulatory frameworks:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong>SEC (Investment Advisers Act of 1940).</strong> For registered
                    investment advisors (RIAs), marketing communications must be fair, balanced,
                    and not misleading. A chatbot trained on compliance-reviewed content that
                    includes appropriate disclaimers satisfies this requirement because it only
                    repeats information your firm has already approved for public use.
                  </li>
                  <li>
                    <strong>FINRA Rules 2210/2220.</strong> For broker-dealers, communications
                    with the public are categorized as retail communications, correspondence, or
                    institutional communications. A chatbot on a public website falls under retail
                    communications, which must be supervised and may require principal pre-approval.
                    Have your compliance principal review the chatbot&apos;s training content and
                    system prompt before deployment.
                  </li>
                  <li>
                    <strong>SOX (Sarbanes-Oxley).</strong> Applies to publicly traded companies
                    and their financial reporting. Since the chatbot does not process transactions,
                    access accounting systems, or handle material non-public information, it
                    typically falls outside SOX control scope. Confirm with your compliance officer.
                  </li>
                  <li>
                    <strong>State securities regulators.</strong> Individual states may have
                    additional communication requirements. California, New York, and Texas have
                    particularly detailed advertising rules for financial professionals. Include
                    your state-specific disclaimers in the system prompt.
                  </li>
                </ul>
                <p className="mt-4">
                  The common thread: train the chatbot only on compliance-approved content, include
                  clear disclaimers in every interaction, and have your compliance team review the
                  setup before deployment. The chatbot says nothing your firm hasn&apos;t already
                  published or approved. The financial incentive is clear: according to <a href="https://www.juniperresearch.com/press/bank-cost-savings-via-chatbots-reach-7-3bn-2023/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Juniper Research</a>, global banking chatbot cost reductions are projected to reach $7.3 billion — savings that extend to advisory firms handling routine informational queries at scale.
                </p>
              </section>

              {/* Section 4 — training content */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Train It On (and What to Keep Out)
                </h2>
                <p>
                  Start with the content that already exists on your website and in your marketing
                  materials: services page, about page, FAQ, blog posts about financial planning
                  topics, and client-facing guides. Add your onboarding documentation — new client
                  checklists, account transfer guides, and meeting preparation instructions.
                </p>
                <p className="mt-4">
                  Educational content is especially valuable. If you&apos;ve written articles about
                  retirement planning basics, tax-loss harvesting, or estate planning fundamentals,
                  include them. The chatbot surfaces relevant educational content when visitors ask
                  general questions, positioning your firm as knowledgeable and helpful — without
                  crossing into advice.
                </p>
                <p className="mt-4">
                  <strong>Never include:</strong> client names, account numbers, portfolio details,
                  performance data tied to specific accounts, or any document from your CRM, custodian
                  portal, or portfolio management platform. The chatbot&apos;s knowledge base should
                  mirror your public-facing website — nothing more. Every piece of training content
                  should be something you&apos;d hand to a prospective client in an initial meeting.
                </p>
              </section>

              {/* Section 5 — deployment */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Deploying Without an IT Department
                </h2>
                <p>
                  Most financial advisory firms don&apos;t have an in-house IT team, and they
                  don&apos;t need one. VocUI is designed for non-technical users. Create a chatbot,
                  add your website URL as a knowledge source, customize the appearance to match
                  your firm&apos;s branding, and copy a single embed code into your website.
                </p>
                <p className="mt-4">
                  If your website runs on Squarespace, WordPress, or Wix, adding the chatbot takes
                  five minutes. Write a system prompt that sets the right tone and compliance
                  boundaries. Test it yourself by asking the questions you hear most from prospects.
                  The entire setup typically takes under an hour. Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>
                  {' '}to find the right plan for your firm.
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
                      q: 'What is the difference between providing information and giving financial advice?',
                      a: "Information is factual and general: \u201COur firm offers retirement planning, estate planning, and tax strategy services. Our minimum account size is $250,000.\u201D Advice is personalized and actionable: \u201CBased on your situation, you should roll over your 401(k) into a Roth IRA.\u201D A chatbot should only provide information. Configure your system prompt to decline advice requests explicitly and direct those conversations to a licensed advisor. This distinction is fundamental to SEC and FINRA compliance \u2014 crossing the line from information to advice without proper licensing and suitability determination creates regulatory liability.",
                    },
                    {
                      q: 'Which financial regulations apply to chatbot communications?',
                      a: "For SEC-registered investment advisors (RIAs), the Investment Advisers Act of 1940 governs advertising and client communications. FINRA Rules 2210 and 2220 regulate communications with the public for broker-dealers. State securities regulators add additional requirements. The key principle across all of these: marketing communications must be fair, balanced, and not misleading. A chatbot trained on compliance-reviewed content that includes appropriate disclaimers operates within these boundaries because it only repeats information your firm has already approved for public use.",
                    },
                    {
                      q: 'Can prospects book consultations through the chatbot?',
                      a: "Yes. Configure the chatbot to share a direct link to your scheduling tool (Calendly, Acuity, or your firm\u2019s booking system) when a visitor expresses interest. The chatbot answers pre-meeting questions first \u2014 what to expect, what documents to prepare, how long the meeting takes \u2014 so prospects arrive informed and the meeting is more productive. This turns the chatbot into a lead qualification and booking assistant that operates outside business hours.",
                    },
                    {
                      q: 'How do I prevent the chatbot from accessing client financial data?',
                      a: "The chatbot has no access to client data by design. It does not connect to your custodian, portfolio management platform, CRM, or any system containing client information. It only knows what you train it on \u2014 and your training content should be limited to public-facing materials: service descriptions, fee schedules, process overviews, and educational articles. Never upload client lists, portfolio reports, or account-specific documents to the knowledge base.",
                    },
                    {
                      q: 'Do SOX compliance requirements apply to the chatbot?',
                      a: "SOX (Sarbanes-Oxley Act) applies to publicly traded companies and their financial reporting. If your firm is publicly traded or provides services to public companies, SOX may affect your internal controls. However, since a VocUI chatbot does not process financial transactions, access internal accounting systems, or handle material non-public information, it falls outside the scope of SOX controls. It is a marketing and informational tool operating on publicly available content. Confirm with your compliance officer if you have specific SOX obligations.",
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
            <h2 className="text-2xl font-bold mb-3">See how financial firms use VocUI</h2>
            <p className="text-white/80 mb-2">
              Upload your service docs, train a chatbot on your content, and let it handle client questions around the clock.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. Most firms are live in under an hour.
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
