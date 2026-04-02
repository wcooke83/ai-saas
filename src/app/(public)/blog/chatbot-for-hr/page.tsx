import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';
import { ChatPreview, IndustryStatBar } from '@/components/blog/industry-visuals';
import { StyledBulletList } from '@/components/blog/styled-lists';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbot for HR Teams: Policy Questions and Onboarding at Scale | VocUI',
  description:
    'How HR teams use internal AI chatbots to answer staff policy questions, guide new starter onboarding, and reduce repetitive enquiries — without adding headcount.',
  openGraph: {
    title: 'AI Chatbot for HR Teams: Policy Questions and Onboarding at Scale | VocUI',
    description:
      'How HR teams use internal AI chatbots to answer staff policy questions, guide new starter onboarding, and reduce repetitive enquiries — without adding headcount.',
    url: 'https://vocui.com/blog/chatbot-for-hr',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for HR Teams: Policy Questions and Onboarding at Scale | VocUI',
    description:
      'How HR teams use internal AI chatbots to answer staff policy questions, guide new starter onboarding, and reduce repetitive enquiries — without adding headcount.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-hr' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot for HR Teams: Answering Policy Questions and Onboarding New Starters at Scale',
      description:
        'How HR teams use internal AI chatbots to answer staff policy questions, guide new starter onboarding, and reduce repetitive enquiries — without adding headcount.',
      url: 'https://vocui.com/blog/chatbot-for-hr',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-hr',
      },
      datePublished: '2026-04-02',
      dateModified: '2026-04-02',
      author: VOCUI_AUTHOR,
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
          name: 'Is the chatbot secure for sensitive HR content?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For internal HR chatbots, deploy via Slack or your intranet rather than on a public website. VocUI\'s Slack integration keeps the chatbot within your existing access controls — only team members in the workspace can interact with it. Avoid uploading personally identifiable information about individual employees; keep knowledge base content to policies, procedures, and general guidance that applies across the workforce. Individual employee records, disciplinary cases, or pay details should never be in the knowledge base.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when policies change?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update the knowledge base when policies change. If your staff handbook is uploaded as a document, replace it with the updated version. If it is hosted on your intranet as a web page, re-scrape that URL. Most HR policy changes happen in cycles — annual handbook reviews, benefits updates, new legislative requirements. Build knowledge base updates into those existing review cycles so the chatbot stays current. An HR chatbot that gives outdated policy information is worse than no chatbot, so accuracy maintenance matters.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot handle sensitive questions like grievances or mental health?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Configure the chatbot to recognise and redirect sensitive situations. Questions about grievance procedures should be answered with process information — how to raise a formal grievance, who to contact, what the timeline looks like — then route to HR for anything beyond that. Questions about mental health or personal difficulties should acknowledge the topic and immediately provide your EAP (Employee Assistance Programme) details and encourage direct HR contact. The chatbot provides information; it does not provide counselling or case management.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to set up an HR chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most HR teams have a working chatbot within a day. Upload your staff handbook, leave policy, expense procedure, and onboarding checklist — four documents covers the majority of what staff ask about. Connect to Slack, write a system prompt that establishes tone and any deflection rules, and test with the ten most common questions your inbox receives. Refinement is ongoing, but the initial setup is genuinely fast for teams that already have their policies documented.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'AI Chatbot for HR Teams: Answering Policy Questions and Onboarding New Starters at Scale',
          item: 'https://vocui.com/blog/chatbot-for-hr',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHRPage() {
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
                Chatbot for HR
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Use Case
                </span>
                <time dateTime="2026-04-02" className="text-xs text-secondary-400 dark:text-secondary-500">Apr 2, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  9 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbot for HR Teams: Answering Policy Questions and Onboarding New Starters at Scale
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Every HR professional knows the inbox problem. Monday morning brings the same
                ten questions: how many days of annual leave do I have left, what is the
                process for a flexible working request, where is the expense form, when does
                the pension contribution change? These questions are answerable in seconds —
                but collectively they consume hours of every HR team&apos;s week. An internal
                AI chatbot trained on your policies answers them instantly, every time.
              </p>
            </div>

            <IndustryStatBar
              stats={[
                { value: '40%', label: 'of HR time spent on repetitive queries' },
                { value: '24/7', label: 'policy answers for staff across time zones' },
                { value: '3x', label: 'faster onboarding with self-service FAQ' },
              ]}
            />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The HR Inbox Problem
                </h2>
                <p>
                  HR teams in growing businesses face a structural challenge: their workload
                  scales with headcount, but team size does not. A 100-person company with two
                  HR professionals might handle 50 or more inbound staff queries per week.
                  Many of these questions have identical answers — they are asked by different
                  people at different points in their employment lifecycle, but the answer
                  does not change.
                </p>
                <p className="mt-4">
                  This is not a failure of documentation. Most organisations have a staff
                  handbook, a leave policy, and an onboarding checklist. The problem is
                  findability and accessibility. Staff do not know which document answers their
                  question, cannot remember where the shared drive folder is, or simply find it
                  faster to email HR than to search a SharePoint hierarchy they have not used
                  in four months.
                </p>
                <p className="mt-4">
                  An internal chatbot trained on your HR documents changes this. A staff member
                  asks a question in Slack or on your intranet and receives an accurate, sourced
                  answer in seconds. The chatbot does not replace HR for complex or sensitive
                  matters — it handles the routine queries so HR professionals can spend their
                  time on the work that genuinely requires human judgment.
                </p>
              </section>

              {/* Section 2 — example conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What an HR Chatbot Conversation Looks Like
                </h2>
                <p>
                  Here is a typical interaction via a Slack-based HR chatbot:
                </p>

                <ChatPreview
                  botName="HR Bot"
                  industry="HR"
                  messages={[
                    { role: 'user', text: "How much notice do I need to give for annual leave?" },
                    { role: 'bot', text: "According to the staff handbook, you need to give at least twice as much notice as the leave you are requesting — so for 5 days off, you need to request 10 working days in advance. For leave of more than 5 days, please give at least 4 weeks' notice. All leave requests go through your line manager first. Is there anything else you need?" },
                    { role: 'user', text: "What's the process for claiming expenses?" },
                    { role: 'bot', text: "Expenses should be submitted within 30 days of being incurred using the expense claim form in the Finance shared folder. Attach all receipts, get your line manager to approve, then send to finance@company.com. Anything over £500 needs pre-approval before the expense is made. I've linked the expense policy here for full details: [link]." },
                  ]}
                />

                <p className="mt-4">
                  Both questions were answered accurately, sourced from the relevant policies,
                  and completed in under 30 seconds — with no HR involvement required.
                </p>
              </section>

              {/* Section 3 — onboarding */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  New Starter Onboarding: The First 90 Days
                </h2>
                <p>
                  New starters generate a disproportionate share of HR enquiries. In their
                  first three months, they have no institutional knowledge and ask questions
                  that seem obvious to longer-tenured staff. What time does the office open,
                  where do I set up my email signature, what is the probation review process,
                  how do I add a beneficiary to the pension — these questions are entirely
                  reasonable, but answering them individually across dozens of new joiners
                  consumes significant HR bandwidth.
                </p>
                <p className="mt-4">
                  A chatbot trained on your onboarding materials becomes a self-service
                  resource for new starters. Upload your onboarding checklist, IT setup
                  guide, benefits summary, and first-week schedule to the knowledge base.
                  New starters get a Slack invite on their first day and are told the HR bot
                  can answer their setup questions. The number of &quot;quick questions&quot;
                  to HR drops sharply within the first week.
                </p>

                <div className="mt-6 bg-secondary-50 dark:bg-secondary-800/40 rounded-xl p-6">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                    High-value content for a new starter chatbot
                  </p>
                  <StyledBulletList items={[
                    { title: 'IT and systems setup guide:', description: 'How to access email, VPN, Slack, and core tools.' },
                    { title: 'Benefits enrolment:', description: 'Pension contribution rates, health insurance options, deadlines.' },
                    { title: 'First-week schedule:', description: 'When and where induction sessions are, who to meet.' },
                    { title: 'Probation process:', description: 'Review timelines, what is assessed, who conducts the review.' },
                    { title: 'Expense and travel policy:', description: 'What is reimbursable, how to claim, approval thresholds.' },
                    { title: 'Office and remote working guidance:', description: 'Hours, flexi policy, desk booking, parking.' },
                  ]} />
                </div>
              </section>

              {/* Section 4 — multi-site */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Multi-Site Complexity: When Policies Differ by Location
                </h2>
                <p>
                  For organisations with staff across multiple offices, countries, or
                  employment types, policy variation is a significant source of HR enquiries.
                  A contractor asks about holiday entitlement and the answer is different from
                  a permanent employee&apos;s. A staff member in Scotland asks about redundancy
                  rights and the details differ from those applicable in England. An employee
                  in the Dublin office asks about parental leave and Irish law applies, not UK
                  legislation.
                </p>
                <p className="mt-4">
                  A well-structured knowledge base handles this by labelling content clearly.
                  Upload separate policy documents for each jurisdiction or employment type,
                  and write a system prompt that instructs the chatbot to ask a clarifying
                  question when it matters: &quot;Are you a permanent employee or a
                  contractor?&quot; or &quot;Which office are you based in?&quot; before
                  answering a policy question where the answer varies. This prevents incorrect
                  answers from the chatbot giving the wrong policy to the wrong person — a
                  risk that increases with policy complexity.
                </p>
              </section>

              {/* Section 5 — what to upload */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Upload and What the Chatbot Handles vs What HR Must
                </h2>
                <p>
                  Build the knowledge base around your most-asked questions. For most HR
                  teams, the core documents are: staff handbook, leave policy (annual,
                  sick, parental), expense procedure, performance review process, onboarding
                  checklist, IT and systems setup guide, and benefits summary.
                </p>
                <p className="mt-4">
                  Be equally clear about what the chatbot should not handle. Individual
                  employee pay queries, disciplinary or grievance matters, performance
                  conversations, and requests for formal accommodations all require human
                  HR involvement. Configure the system prompt to redirect these: &quot;For
                  questions about your specific pay or personal circumstances, please contact
                  the HR team directly at hr@company.com.&quot;
                </p>
                <p className="mt-4">
                  For internal deployment, VocUI&apos;s Slack integration is the most
                  effective channel. Staff interact where they already work, with no additional
                  login or app required. See our guide on{' '}
                  <Link href="/blog/how-to-set-up-slack-chatbot-for-team" className="text-primary-600 dark:text-primary-400 hover:underline">
                    setting up a Slack chatbot for your team
                  </Link>
                  {' '}and our related post on{' '}
                  <Link href="/blog/how-to-build-internal-knowledge-bot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    building an internal knowledge bot
                  </Link>
                  {' '}for step-by-step setup guidance.
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
                      q: 'Is the chatbot secure for sensitive HR content?',
                      a: "For internal HR chatbots, deploy via Slack or your intranet rather than on a public website. VocUI\u2019s Slack integration keeps the chatbot within your existing access controls \u2014 only team members in the workspace can interact with it. Avoid uploading personally identifiable information about individual employees; keep knowledge base content to policies, procedures, and general guidance that applies across the workforce. Individual employee records, disciplinary cases, or pay details should never be in the knowledge base.",
                    },
                    {
                      q: 'What happens when policies change?',
                      a: "Update the knowledge base when policies change. If your staff handbook is uploaded as a document, replace it with the updated version. If it is hosted on your intranet as a web page, re-scrape that URL. Most HR policy changes happen in cycles \u2014 annual handbook reviews, benefits updates, new legislative requirements. Build knowledge base updates into those existing review cycles so the chatbot stays current. An HR chatbot that gives outdated policy information is worse than no chatbot, so accuracy maintenance matters.",
                    },
                    {
                      q: 'Can the chatbot handle sensitive questions like grievances or mental health?',
                      a: "Configure the chatbot to recognise and redirect sensitive situations. Questions about grievance procedures should be answered with process information \u2014 how to raise a formal grievance, who to contact, what the timeline looks like \u2014 then route to HR for anything beyond that. Questions about mental health or personal difficulties should acknowledge the topic and immediately provide your EAP (Employee Assistance Programme) details and encourage direct HR contact. The chatbot provides information; it does not provide counselling or case management.",
                    },
                    {
                      q: 'How long does it take to set up an HR chatbot?',
                      a: "Most HR teams have a working chatbot within a day. Upload your staff handbook, leave policy, expense procedure, and onboarding checklist \u2014 four documents covers the majority of what staff ask about. Connect to Slack, write a system prompt that establishes tone and any deflection rules, and test with the ten most common questions your inbox receives. Refinement is ongoing, but the initial setup is genuinely fast for teams that already have their policies documented.",
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

          {/* Related Industry Pages */}
          <div className="mt-10 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Related industry guides</p>
            <ul className="space-y-3">
              <li>
                <Link href="/chatbot-for-hr" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbot for HR Teams →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Internal policy FAQ, new starter onboarding, and staff self-service for HR departments.</p>
              </li>
            </ul>
          </div>

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
