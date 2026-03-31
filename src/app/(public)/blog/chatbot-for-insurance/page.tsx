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
  title: 'AI Chatbots for Insurance: Automate Policy Questions | VocUI',
  description:
    'Insurance agencies use AI chatbots to answer policy questions, explain coverage options, and qualify leads — reducing call volume and improving response time.',
  openGraph: {
    title: 'AI Chatbots for Insurance: Automate Policy Questions | VocUI',
    description:
      'Insurance agencies use AI chatbots to answer policy questions, explain coverage options, and qualify leads — reducing call volume and improving response time.',
    url: 'https://vocui.com/blog/chatbot-for-insurance',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Insurance: Automate Policy Questions | VocUI',
    description:
      'Insurance agencies use AI chatbots to answer policy questions, explain coverage options, and qualify leads — reducing call volume and improving response time.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-insurance' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Insurance: Automate Policy Questions',
      description:
        'Insurance agencies use AI chatbots to answer policy questions, explain coverage options, and qualify leads — reducing call volume and improving response time.',
      url: 'https://vocui.com/blog/chatbot-for-insurance',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-insurance',
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
          name: 'What should the chatbot handle vs. what needs a licensed agent?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot handles general informational questions: what types of coverage you offer, how the claims process works, what documents are needed, and what to expect during different interactions with your agency. A licensed agent is needed for: binding coverage, providing personalized policy recommendations, interpreting specific policy language for a client, adjusting coverage limits, and processing claims. The chatbot should explicitly redirect to a licensed agent when a visitor asks for a coverage recommendation or policy-specific interpretation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which state insurance regulations affect chatbot deployment?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'State Departments of Insurance regulate how insurance products are marketed and communicated. California (CDI), New York (DFS), Texas (TDI), and Florida (OIR) have particularly detailed advertising and communication requirements. The key principle across all states: marketing communications must be accurate, not misleading, and clearly distinguished from policy documents. Since a VocUI chatbot only repeats content you have already approved for public use and includes appropriate disclaimers, it operates within these standards. Have your compliance officer review the chatbot setup to confirm it meets your specific state requirements.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot help during a claims surge after a storm?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This is one of the strongest use cases. After a major weather event, your phone lines are overwhelmed with policyholders asking the same questions: "How do I file a claim?" "What documentation do I need?" "Will my homeowner\'s policy cover this?" "How long will the claims process take?" A chatbot answers all of these instantly, at any hour, without adding to your staff\'s workload during an already stressful period. Update your knowledge base before storm seasons with current claims procedures and emergency contact information.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForInsurancePage() {
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
                Chatbot for Insurance
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
                  14 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbots for Insurance: Automate Policy Questions
              </h1>
            </header>

            {/* Featured snippet — stat-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                The average insurance agency spends 60-70% of inbound call time on
                questions that have the same answer every time: &quot;What does my policy
                cover?&quot; &quot;How do I file a claim?&quot; &quot;What&apos;s the
                difference between HO-3 and HO-5?&quot; An AI chatbot on your agency
                website handles these questions instantly, freeing your agents for
                consultative selling and complex client needs.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Repetition Tax on Insurance Agencies
                </h2>
                <p>
                  Insurance agencies deal with a unique support challenge: the questions are
                  high-volume, repetitive, and often time-sensitive, but the answers require
                  domain expertise that generic support tools can&apos;t provide. The industry is moving fast to address this — according to <a href="https://insurancenewsnet.com/innarticle/ai-adoption-has-dramatically-changed-insurance-landscape-expert-says" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">InsuranceNewsNet</a>, insurance AI adoption jumped from 8% to 34% in 2025, a 400% increase. A prospect
                  comparing homeowner&apos;s policies wants to know what your coverage includes.
                  A policyholder who just had a fender bender needs to know how to file a claim.
                  A small business owner is trying to understand the difference between general
                  liability and professional liability.
                </p>
                <p className="mt-4">
                  Every five minutes an agent spends explaining what a deductible is or how to
                  submit proof of loss is five minutes not spent on policy reviews, cross-selling,
                  or closing new business. During peak seasons — open enrollment periods, storm
                  seasons, renewal cycles — the volume spikes and response times suffer, directly
                  impacting client satisfaction and retention.
                </p>
              </section>

              {/* Section 2 — unique: claims vs. policy questions */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Claims Questions vs. Policy Questions: What the Chatbot Should and Should Not Handle
                </h2>

                {/* Two-column comparison — unique to insurance post */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                    <p className="font-semibold text-green-800 dark:text-green-200 mb-3">Chatbot handles (informational)</p>
                    <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <li>&quot;How do I file a claim?&quot;</li>
                      <li>&quot;What documents do I need?&quot;</li>
                      <li>&quot;What is the general claims timeline?&quot;</li>
                      <li>&quot;What does renters insurance cover?&quot;</li>
                      <li>&quot;What&apos;s the difference between HO-3 and HO-5?&quot;</li>
                      <li>&quot;Do you offer umbrella policies?&quot;</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                    <p className="font-semibold text-red-800 dark:text-red-200 mb-3">Route to licensed agent</p>
                    <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <li>&quot;Is this specific damage covered under my policy?&quot;</li>
                      <li>&quot;What&apos;s the status of my open claim?&quot;</li>
                      <li>&quot;Should I increase my coverage limits?&quot;</li>
                      <li>&quot;Can you bind this coverage today?&quot;</li>
                      <li>&quot;My adjuster hasn&apos;t contacted me yet.&quot;</li>
                      <li>&quot;I disagree with my claim settlement.&quot;</li>
                    </ul>
                  </div>
                </div>

                <p>
                  The chatbot excels at general claims process questions: what steps to take after
                  an incident, what documentation to gather, how to contact your claims department,
                  and what to expect during the timeline. According to <a href="https://hyperleap.ai/blog/insurance-customer-service-automation-statistics-2026" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Hyperleap AI</a>, insurance chatbots can manage 80% of inbound inquiries, and 83% of insurance customers express satisfaction with chatbot interactions. It cannot file claims, access claim
                  status, or provide updates on specific cases. For those interactions, it directs
                  the visitor to your claims department phone number or portal.
                </p>
              </section>

              {/* Section 3 — claims process automation — unique to insurance post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Claims Process Automation: What the Chatbot Can (and Cannot) Do
                </h2>
                <p>
                  The claims process is where insurance chatbots deliver the most time savings.
                  After a car accident, a burst pipe, or a storm, policyholders are stressed
                  and need clear guidance. A chatbot walks them through the steps calmly and
                  consistently, every time.
                </p>

                {/* Claims workflow — unique to insurance post */}
                <div className="mt-6 mb-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">1</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Policyholder reports an incident</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;I had a fender bender. What do I do now?&quot;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">2</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Chatbot provides immediate steps</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Exchange information with the other driver, take photos, file a police report if needed, do not admit fault.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">3</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Chatbot explains the claims filing process</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Call your claims department at [number], have your policy number ready, provide photos and the police report number.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">4</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Chatbot answers process questions</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;How long does it take?&quot; &quot;Will my rates go up?&quot; &quot;What&apos;s my deductible?&quot; — answers from your training content.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-300 dark:bg-secondary-600 flex items-center justify-center text-sm font-bold text-secondary-700 dark:text-secondary-300">5</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Handoff to claims adjuster (human-led)</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">For claim status updates, coverage determinations, and settlement discussions — the chatbot directs to your claims team.</p>
                    </div>
                  </div>
                </div>

                <p>
                  The chatbot handles steps 1-4: the informational guidance that every claimant
                  needs. Step 5 requires a licensed adjuster. This division means your claims
                  department is not spending the first five minutes of every call explaining
                  what documents to gather — the policyholder arrives prepared.
                </p>
              </section>

              {/* Section 4 — policy comparison example — unique to insurance post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Example: A Policy Comparison Conversation
                </h2>
                <p>
                  Prospects often struggle to understand the differences between coverage
                  types. Here is how a chatbot handles a common comparison question:
                </p>

                {/* Example conversation — unique to insurance post */}
                <div className="mt-6 mb-6 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        What&apos;s the difference between an HO-3 and an HO-5 homeowner&apos;s policy?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Great question. An HO-3 is the most common homeowner&apos;s policy. It covers
                        your home&apos;s structure against all perils except those specifically
                        excluded (like floods and earthquakes), but your personal belongings are
                        only covered against named perils — a specific list of events like fire,
                        theft, and windstorm.
                      </p>
                      <p className="text-sm text-secondary-800 dark:text-secondary-200 mt-2">
                        An HO-5 covers both your structure and your belongings against all perils
                        except exclusions. It is broader coverage, which means fewer claim denials
                        for personal property. HO-5 policies cost more but provide more comprehensive
                        protection. Would you like to discuss which option fits your situation with
                        one of our agents?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Yes, can I get a quote?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        I cannot generate quotes directly, but I can get you started. You can
                        request a personalized quote here: [quote form link]. One of our agents
                        will follow up within one business day with options for both HO-3 and
                        HO-5 coverage so you can compare. You will need your property address
                        and current policy information if you have it.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  That conversation educated the prospect, demonstrated your agency&apos;s
                  expertise, and drove a quote request — all without an agent picking up the
                  phone. The prospect who fills out your quote form already understands the
                  product, which makes the follow-up call shorter and more likely to close.
                </p>
              </section>

              {/* Section 5 — state regulation specifics */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  State Insurance Regulations and Chatbot Compliance
                </h2>
                <p>
                  Insurance is regulated at the state level, and each State Department of Insurance
                  has specific requirements for how insurance products are communicated to the
                  public. A VocUI chatbot is an informational tool, not a licensed agent — it
                  does not sell policies, bind coverage, underwrite risk, or provide personalized
                  insurance advice.
                </p>
                <p className="mt-4">
                  Key regulatory bodies to be aware of:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong>California Department of Insurance (CDI)</strong> — strict advertising
                    standards; all marketing materials must be filed and approved.
                  </li>
                  <li>
                    <strong>New York Department of Financial Services (DFS)</strong> — detailed
                    requirements for consumer-facing communications and unfair trade practices.
                  </li>
                  <li>
                    <strong>Texas Department of Insurance (TDI)</strong> — specific rules around
                    advertising accuracy and prohibited representations.
                  </li>
                  <li>
                    <strong>Florida Office of Insurance Regulation (OIR)</strong> — heightened
                    requirements around property insurance communications given hurricane exposure.
                  </li>
                </ul>
                <p className="mt-4">
                  The principle across all states: marketing communications must be accurate, not
                  misleading, and clearly distinguished from policy documents. Train the chatbot
                  only on compliance-reviewed content, include disclaimers stating responses are
                  informational only, and have your compliance officer review the setup before
                  deployment. For detailed guidance on system prompts, see our post on{' '}
                  <Link
                    href="/blog/how-to-write-chatbot-system-prompt"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    writing a chatbot system prompt
                  </Link>
                  .
                </p>
              </section>

              {/* Section 4 — training */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Training on Coverage Guides, Not Policy Contracts
                </h2>
                <p>
                  The best training content for an insurance chatbot is the plain-language material
                  you already use to educate clients and prospects. Start with your website: product
                  pages, coverage comparison charts, FAQ sections, and educational blog posts. VocUI
                  scrapes and indexes this content automatically.
                </p>
                <p className="mt-4">
                  Add PDF documents that explain your products in clear terms: coverage summaries,
                  policy highlight sheets, claims process guides, and onboarding packets. Avoid
                  uploading actual policy contracts — they&apos;re written in legal language that
                  produces responses that are technically accurate but practically unhelpful. Use
                  the plain-language summaries your agency has already created for client education.
                </p>
                <p className="mt-4">
                  If your agency specializes in specific niches — commercial insurance for
                  construction, restaurant insurance, professional liability for consultants —
                  training on niche-specific content makes the chatbot far more useful than
                  generic insurance information. The more targeted your training content, the
                  more relevant the chatbot&apos;s responses for your actual audience.
                </p>
              </section>

              {/* Section 5 — storm season surge */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Storm Season, Open Enrollment, and Renewal Surges
                </h2>
                <p>
                  Insurance agencies experience dramatic volume spikes at predictable times.
                  After a major storm, every policyholder in your book calls with the same claims
                  questions simultaneously. During open enrollment, prospects flood your website
                  comparing health, Medicare supplement, or group plans. Renewal cycles bring a
                  wave of questions about rate changes and coverage adjustments.
                </p>
                <p className="mt-4">
                  A chatbot absorbs this surge without additional staffing. Update your knowledge
                  base before each predictable peak: add current claims procedures and emergency
                  contact information before storm season, refresh enrollment guides before open
                  enrollment, and update renewal FAQs before the cycle begins. The chatbot handles
                  the repetitive volume while your agents focus on the complex, high-value
                  interactions that require human expertise.
                </p>
              </section>

              {/* Section 6 — lead qualification */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  From Website Visitor to Quote-Ready Lead
                </h2>
                <p>
                  The chatbot also serves as a lead qualifier for your agency. When a prospect asks
                  &quot;What kind of business insurance do I need for a restaurant?&quot; the chatbot
                  explains general liability, commercial property, workers&apos; comp, and liquor
                  liability — educating the prospect while demonstrating your agency&apos;s
                  expertise. It then directs them to your quote request form or booking page.
                </p>
                <p className="mt-4">
                  The prospect who arrives at your form has already learned about the coverage
                  types relevant to their business. The quoting conversation is shorter, more
                  productive, and more likely to close because the education happened before the
                  sales call. Setup is straightforward — most agencies are live within an hour.
                  Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>
                  {' '}to find the right plan.
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
                      q: 'What should the chatbot handle vs. what needs a licensed agent?',
                      a: "The chatbot handles general informational questions: what types of coverage you offer, how the claims process works, what documents are needed, and what to expect during different interactions with your agency. A licensed agent is needed for: binding coverage, providing personalized policy recommendations, interpreting specific policy language for a client, adjusting coverage limits, and processing claims. The chatbot should explicitly redirect to a licensed agent when a visitor asks for a coverage recommendation or policy-specific interpretation.",
                    },
                    {
                      q: 'Which state insurance regulations affect chatbot deployment?',
                      a: "State Departments of Insurance regulate how insurance products are marketed and communicated. California (CDI), New York (DFS), Texas (TDI), and Florida (OIR) have particularly detailed advertising and communication requirements. The key principle across all states: marketing communications must be accurate, not misleading, and clearly distinguished from policy documents. Since a VocUI chatbot only repeats content you have already approved for public use and includes appropriate disclaimers, it operates within these standards. Have your compliance officer review the chatbot setup to confirm it meets your specific state requirements.",
                    },
                    {
                      q: 'Can the chatbot help during a claims surge after a storm?',
                      a: "This is one of the strongest use cases. After a major weather event, your phone lines are overwhelmed with policyholders asking the same questions: \u201CHow do I file a claim?\u201D \u201CWhat documentation do I need?\u201D \u201CWill my homeowner\u2019s policy cover this?\u201D \u201CHow long will the claims process take?\u201D A chatbot answers all of these instantly, at any hour, without adding to your staff\u2019s workload during an already stressful period. Update your knowledge base before storm seasons with current claims procedures and emergency contact information.",
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
            <h2 className="text-2xl font-bold mb-3">Build a chatbot trained on your business</h2>
            <p className="text-white/80 mb-2">
              Upload your FAQs, policies, and product info -- your chatbot answers from your knowledge, not generic scripts.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan. Live in under an hour.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Start with your content
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
