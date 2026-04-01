import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { DashboardPath } from '@/components/blog/dashboard-path';
import { StepFlow, KnowledgeSourceCards } from '@/components/blog/process-visuals';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Build an Internal Knowledge Bot for Your Team | VocUI',
  description:
    'Build an internal knowledge bot that lets your team find answers to HR, policy, and process questions instantly — deployed in Slack or on your intranet.',
  openGraph: {
    title: 'How to Build an Internal Knowledge Bot for Your Team | VocUI',
    description:
      'Build an internal knowledge bot that lets your team find answers to HR, policy, and process questions instantly — deployed in Slack or on your intranet.',
    url: 'https://vocui.com/blog/how-to-build-internal-knowledge-bot',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Build an Internal Knowledge Bot for Your Team | VocUI',
    description:
      'Build an internal knowledge bot that lets your team find answers to HR, policy, and process questions instantly — deployed in Slack or on your intranet.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-build-internal-knowledge-bot' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Build an Internal Knowledge Bot for Your Team',
      description:
        'Build an internal knowledge bot that lets your team find answers to HR, policy, and process questions instantly — deployed in Slack or on your intranet.',
      url: 'https://vocui.com/blog/how-to-build-internal-knowledge-bot',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-build-internal-knowledge-bot',
      },
      datePublished: '2026-03-13',
      dateModified: '2026-03-13',
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
          name: "What's the difference between an internal knowledge bot and a wiki?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A wiki requires employees to navigate pages, search for keywords, and read through documents to find what they need. An internal knowledge bot lets them ask a question in plain language and get a direct answer instantly. The bot searches across all your uploaded documents and surfaces the most relevant information — no browsing or keyword guessing required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I restrict access to the internal knowledge bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can deploy the bot within a private Slack workspace, behind your company VPN, or on an internal intranet page. The bot is only accessible where you deploy it — there is no public-facing URL unless you create one.',
          },
        },
        {
          '@type': 'Question',
          name: 'What formats can I upload to train the bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VocUI accepts URLs (web pages and intranet pages), PDFs, DOCX files, and plain text. You can also enter Q&A pairs directly. Most teams start by uploading their employee handbook, HR policies, and IT documentation as PDF or DOCX files.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the internal knowledge bot integrate with Slack?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. VocUI has a native Slack integration. Once connected, team members can message the bot directly in Slack and get answers without leaving their workflow. Setup takes about two minutes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I keep the bot content up to date?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can update knowledge sources from the VocUI dashboard at any time. Re-scrape URLs to pull in the latest content, upload new versions of documents, or add new knowledge sources. Changes are reflected within minutes.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToBuildInternalKnowledgeBotPage() {
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
                Internal Knowledge Bot
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2026-03-13" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 13, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Build an Internal Knowledge Bot for Your Team
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                An internal knowledge bot gives your team instant access to company information
                — HR policies, IT procedures, onboarding docs, product specs — through a simple
                chat interface. Instead of digging through shared drives or pinging colleagues,
                employees ask a question and get the answer in seconds.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Teams Need an Internal Knowledge Bot
                </h2>
                <p>
                  Every organization has the same problem: important information is scattered
                  across Google Drive folders, Notion pages, Confluence wikis, shared email
                  threads, and the heads of a few key employees. When someone needs an answer —
                  &quot;What&apos;s our PTO policy?&quot; or &quot;How do I request a new laptop?&quot;
                  — they either search through multiple tools or message a colleague who probably
                  has better things to do.
                </p>
                <p className="mt-4">
                  This is expensive. Studies consistently show that knowledge workers spend 20% or
                  more of their week searching for internal information. For a 50-person team,
                  that&apos;s the equivalent of 10 full-time employees doing nothing but looking
                  for answers.
                </p>
                <p className="mt-4">
                  An internal knowledge bot solves this by centralizing your team&apos;s
                  documentation into a single, searchable AI assistant. Upload your HR handbook,
                  IT runbooks, sales playbooks, and onboarding guides. Employees ask questions in
                  natural language and get instant, accurate answers pulled directly from your own
                  documents.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What Content to Include
                </h2>
                <p>
                  The most effective internal knowledge bots are trained on content that employees
                  ask about frequently. Start with the documents that generate the most
                  &quot;Hey, do you know where I can find...&quot; messages in your Slack channels.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>
                    <strong>HR policies</strong> — PTO, sick leave, parental leave, expense
                    reimbursement, remote work guidelines, dress code, and benefits enrollment.
                  </li>
                  <li>
                    <strong>IT documentation</strong> — How to set up VPN, request software
                    licenses, reset passwords, configure email on mobile, and troubleshoot common
                    issues.
                  </li>
                  <li>
                    <strong>Standard operating procedures (SOPs)</strong> — How to submit a
                    purchase order, create a new project, onboard a vendor, or file a bug report.
                  </li>
                  <li>
                    <strong>Onboarding materials</strong> — New hire checklists, tool access
                    guides, team org charts, and first-week schedules.
                  </li>
                  <li>
                    <strong>Product documentation</strong> — Internal feature specs, API
                    references, architecture diagrams, and release notes.
                  </li>
                </ul>
                <p className="mt-4">
                  You don&apos;t need to upload everything on day one. Start with the top 10
                  most-asked questions and expand from there based on what employees are searching
                  for.
                </p>

                <KnowledgeSourceCards caption="Upload internal docs in any of these formats" />
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step Setup with VocUI
                </h2>
                <p>
                  Building an internal knowledge bot with VocUI takes about 15 minutes. Here&apos;s
                  the process:
                </p>

                <StepFlow
                  steps={[
                    { number: 1, title: 'Create Bot', description: 'Name it for your team' },
                    { number: 2, title: 'Upload Docs', description: 'PDFs, URLs, or DOCX files' },
                    { number: 3, title: 'System Prompt', description: 'Set role and boundaries' },
                    { number: 4, title: 'Test', description: 'Verify answers are accurate' },
                    { number: 5, title: 'Deploy', description: 'Slack, intranet, or both' },
                  ]}
                  caption="Five steps to a working internal knowledge bot"
                />
                <ol className="list-decimal pl-5 space-y-4 mt-4">
                  <li>
                    <strong>Create a new chatbot.</strong> Log in to VocUI and click &quot;Create
                    Chatbot.&quot; Name it something your team will recognize, like &quot;HR
                    Bot&quot; or &quot;Company Knowledge Base.&quot;
                    <DashboardPath steps={['Chatbots', 'Create New']} tip="Name your bot, add your internal docs, and deploy to Slack." />
                  </li>
                  <li>
                    <strong>Upload your documents.</strong> Add knowledge sources: upload PDFs of
                    your employee handbook, paste URLs to your internal wiki pages, or drag in DOCX
                    files. VocUI processes the content, chunks it into searchable segments, and
                    creates embeddings for semantic search.
                  </li>
                  <li>
                    <strong>Configure the system prompt.</strong> Tell the bot its role — for
                    example: &quot;You are an internal HR assistant for [Company Name]. Answer
                    questions using only the provided documentation. If the answer is not in the
                    documents, say you don&apos;t know and suggest who to contact.&quot; Learn more
                    about{' '}
                    <Link
                      href="/blog/how-to-train-chatbot-on-your-own-data"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      training chatbots on your own data
                    </Link>
                    .
                  </li>
                  <li>
                    <strong>Test thoroughly.</strong> Ask the bot questions you know the answers to.
                    Verify that it pulls the correct information and handles edge cases gracefully.
                    Adjust the system prompt or add more content as needed.
                  </li>
                  <li>
                    <strong>Deploy.</strong> Choose your deployment method — Slack integration for
                    team chat, an embed code for your intranet, or both.
                  </li>
                </ol>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Deploying to Slack for Team Access
                </h2>
                <p>
                  Slack is the most popular deployment channel for internal knowledge bots because
                  it meets employees where they already work. No one has to open a new tab or
                  remember a URL — they just message the bot in Slack.
                </p>
                <p className="mt-4">
                  VocUI&apos;s{' '}
                  <Link
                    href="/slack-chatbot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Slack integration
                  </Link>{' '}
                  takes about two minutes to set up. From your chatbot&apos;s dashboard, go to
                  Integrations, click &quot;Connect Slack,&quot; and authorize the app in your
                  workspace. Once connected, team members can DM the bot or mention it in any
                  channel.
                </p>
                <p className="mt-4">
                  Some teams create a dedicated #ask-hr or #ask-it channel and add the bot there.
                  This way, everyone can see the questions being asked and the answers given —
                  which often helps multiple people at once. It also creates a searchable archive
                  of team knowledge that grows over time.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Measuring Adoption and Improving Over Time
                </h2>
                <p>
                  Launching the bot is just the beginning. To make it truly useful, you need to
                  monitor how it&apos;s being used and continuously improve the content.
                </p>
                <p className="mt-4">
                  VocUI&apos;s analytics dashboard shows you the questions being asked, the
                  responses given, and which questions the bot couldn&apos;t answer. Pay close
                  attention to unanswered questions — these are gaps in your knowledge base that
                  you can fill by uploading new content or updating existing documents.
                </p>
                <p className="mt-4">
                  Track adoption metrics like daily active users, questions per day, and the
                  percentage of questions answered successfully. Share these numbers with
                  leadership to demonstrate ROI. A well-maintained internal knowledge bot
                  typically saves 2-5 hours per employee per month — time that was previously
                  spent searching for information or waiting for answers from colleagues.
                </p>
                <p className="mt-4">
                  Set a recurring monthly task to review the bot&apos;s performance, update
                  outdated content, and add new knowledge sources as your company&apos;s policies
                  and procedures evolve. Check out{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    our pricing plans
                  </Link>{' '}
                  to find the right tier for your team size.
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
                      q: "What's the difference between an internal knowledge bot and a wiki?",
                      a: 'A wiki requires employees to navigate pages, search for keywords, and read through documents to find what they need. An internal knowledge bot lets them ask a question in plain language and get a direct answer instantly. The bot searches across all your uploaded documents and surfaces the most relevant information — no browsing or keyword guessing required.',
                    },
                    {
                      q: 'Can I restrict access to the internal knowledge bot?',
                      a: 'Yes. You can deploy the bot within a private Slack workspace, behind your company VPN, or on an internal intranet page. The bot is only accessible where you deploy it — there is no public-facing URL unless you create one.',
                    },
                    {
                      q: 'What formats can I upload to train the bot?',
                      a: 'VocUI accepts URLs (web pages and intranet pages), PDFs, DOCX files, and plain text. You can also enter Q&A pairs directly. Most teams start by uploading their employee handbook, HR policies, and IT documentation as PDF or DOCX files.',
                    },
                    {
                      q: 'Does the internal knowledge bot integrate with Slack?',
                      a: "Yes. VocUI has a native Slack integration. Once connected, team members can message the bot directly in Slack and get answers without leaving their workflow. Setup takes about two minutes.",
                    },
                    {
                      q: 'How do I keep the bot content up to date?',
                      a: 'You can update knowledge sources from the VocUI dashboard at any time. Re-scrape URLs to pull in the latest content, upload new versions of documents, or add new knowledge sources. Changes are reflected within minutes.',
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
