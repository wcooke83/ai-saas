import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { StyledBulletList } from '@/components/blog/styled-lists';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: '5 Intercom Alternatives That Won\'t Break the Budget | VocUI',
  description:
    'Intercom is powerful but expensive. Here are five affordable alternatives with AI chatbot features, knowledge base support, and simple setup.',
  openGraph: {
    title: '5 Intercom Alternatives That Won\'t Break the Budget | VocUI',
    description:
      'Intercom is powerful but expensive. Here are five affordable alternatives with AI chatbot features, knowledge base support, and simple setup.',
    url: 'https://vocui.com/blog/intercom-alternatives',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Intercom Alternatives That Won\'t Break the Budget | VocUI',
    description:
      'Intercom is powerful but expensive. Here are five affordable alternatives with AI chatbot features, knowledge base support, and simple setup.',
  },
  alternates: { canonical: 'https://vocui.com/blog/intercom-alternatives' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '5 Intercom Alternatives That Won\u2019t Break the Budget',
      description:
        'A comparison of five affordable Intercom alternatives with AI chatbot features and knowledge base support.',
      url: 'https://vocui.com/blog/intercom-alternatives',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/intercom-alternatives',
      },
      datePublished: '2025-11-24',
      dateModified: '2026-04-01',
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
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/intercom-alternatives/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I migrate my Intercom help center articles to another tool?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. Intercom lets you export help center articles as HTML. You can re-add those URLs or documents as knowledge base sources in VocUI, or import them into HelpScout Docs. The migration isn\u2019t one-click, but the content transfers cleanly.",
          },
        },
        {
          '@type': 'Question',
          name: 'What happens to my Intercom Fin conversations if I switch?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Intercom retains your conversation history as long as your account is active. Most alternatives don\u2019t import historical conversations, so you\u2019ll start fresh. Export your Intercom data before canceling.",
          },
        },
        {
          '@type': 'Question',
          name: 'Which Intercom alternative has the best ticketing system?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "HelpScout is the strongest for ticketing and shared inbox workflows. Crisp also has a shared inbox with basic ticket features. VocUI and Tidio don\u2019t have ticketing systems \u2014 they focus on chat and AI instead.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is there an Intercom alternative with both AI chat and CRM?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Drift (now Salesloft) combines chat with CRM-level lead tracking for B2B sales. HelpScout pairs AI-assisted support with customer management. VocUI integrates with external CRMs via webhooks but doesn\u2019t have a built-in CRM.",
          },
        },
        {
          '@type': 'Question',
          name: 'How much can I save switching from Intercom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A typical small team (3 agents, 500 AI resolutions/month) might pay $700+/month on Intercom. VocUI handles the AI chatbot portion for $29\u201379/month. HelpScout covers help desk needs for $75/month. The savings are significant, but you may need two tools to replace everything Intercom bundles.',
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
          name: '5 Intercom Alternatives That Won\u2019t Break the Budget',
          item: 'https://vocui.com/blog/intercom-alternatives',
        },
      ],
    },
  ],
};

// ─── Comparison data ───────────────────────────────────────────────────────────

type SupportLevel = 'yes' | 'no' | 'partial';

interface ToolRow {
  tool: string;
  startingPrice: string;
  aiBot: SupportLevel;
  helpCenter: SupportLevel;
  crmIntegration: SupportLevel;
  ticketSystem: SupportLevel;
}

const comparisonData: ToolRow[] = [
  {
    tool: 'VocUI',
    startingPrice: 'Free / $29+',
    aiBot: 'yes',
    helpCenter: 'no',
    crmIntegration: 'partial',
    ticketSystem: 'no',
  },
  {
    tool: 'Tidio',
    startingPrice: 'Free / $29+',
    aiBot: 'partial',
    helpCenter: 'no',
    crmIntegration: 'partial',
    ticketSystem: 'no',
  },
  {
    tool: 'Crisp',
    startingPrice: 'Free / $25+',
    aiBot: 'partial',
    helpCenter: 'yes',
    crmIntegration: 'partial',
    ticketSystem: 'partial',
  },
  {
    tool: 'HelpScout',
    startingPrice: '$25+',
    aiBot: 'partial',
    helpCenter: 'yes',
    crmIntegration: 'partial',
    ticketSystem: 'yes',
  },
  {
    tool: 'Drift',
    startingPrice: '$50+',
    aiBot: 'partial',
    helpCenter: 'no',
    crmIntegration: 'yes',
    ticketSystem: 'no',
  },
];

function SupportIcon({ level }: { level: SupportLevel }) {
  if (level === 'yes') return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (level === 'no') return <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />;
  return <MinusCircle className="w-5 h-5 text-amber-400 mx-auto" aria-label="Partial" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IntercomAlternativesPage() {
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
                <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                5 Intercom Alternatives
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Comparison
                </span>
                <time dateTime="2025-11-24" className="text-xs text-secondary-400 dark:text-secondary-500">Nov 24, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">10 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                5 Intercom Alternatives That Won&apos;t Break the Budget
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Intercom is the gold standard for customer messaging — and priced like it. If you
                need AI chatbot features without the enterprise price tag, these five alternatives
                deliver real value at a fraction of the cost.
              </p>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 font-medium">
                The top affordable Intercom alternatives are VocUI, Tidio, Crisp, HelpScout, and
                Drift. The right choice depends on whether you need a full support suite (HelpScout),
                AI chatbot answers (VocUI), or affordable live chat (Tidio, Crisp).
              </p>
            </div>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 italic mb-8">
              Disclosure: VocUI is our product. We&apos;ve aimed to be fair in this comparison, but we recommend trying any tool yourself before committing. All pricing and feature information was accurate at time of writing.
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Intercom pricing problem
                </h2>
                <p>
                  Intercom is a genuinely excellent product. The messenger is polished, the help
                  center is mature, Fin produces accurate AI answers, and the CRM integration is
                  deep. If you need the full customer lifecycle platform — messaging, ticketing, help
                  docs, product tours, campaigns — Intercom is hard to beat. But that&apos;s exactly the
                  problem for most small businesses: you&apos;re paying for all of it even if you only
                  need a fraction.
                </p>
                <p className="mt-4">
                  Here&apos;s what the real cost looks like:
                </p>
                <StyledBulletList items={[
                  { title: '$74/month per seat', description: 'for the Essential plan. A 3-person support team is $222/month before any add-ons.' },
                  { title: '$0.99 per Fin resolution', description: 'on top of that. 500 AI resolutions per month adds $495.' },
                  { title: 'Product tours and campaigns', description: 'are bundled into higher tiers even if you never use them.' },
                  { title: 'No free plan.', description: 'You can\u2019t test Intercom without committing to at least $74/month.' },
                ]} />
                <p className="mt-4">
                  The question isn&apos;t whether Intercom is good — it is. The question is whether you need
                  everything it bundles. If you need a CRM-integrated help desk with ticketing, Intercom
                  or HelpScout are the right tools. If you need an AI chatbot that answers customer
                  questions from your knowledge base, you can get that for 80% less. See also our{' '}
                  <Link href="/blog/ai-chatbot-vs-live-chat" className="text-primary-600 dark:text-primary-400 hover:underline">
                    AI chatbot vs. live chat
                  </Link>{' '}
                  breakdown.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  1. VocUI
                </h2>
                <p>
                  VocUI is an AI chatbot platform that focuses on one thing: letting you train a
                  chatbot on your own content and deploy it where your customers (or team) already
                  are. It&apos;s the most direct alternative to Intercom&apos;s Fin feature — at roughly 1/5
                  the cost.
                </p>
                <p className="mt-4">
                  You add your knowledge base sources — URLs, PDFs, DOCX files, or custom Q&amp;A
                  pairs — and VocUI builds an AI chatbot that answers questions using only your
                  content. No hallucinated answers from general training data. The chatbot embeds on
                  your website with a single script tag and also deploys natively to Slack and
                  Telegram.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  knowledge base chatbot, embeddable widget, Slack and Telegram deployment, lead
                  capture forms, live agent handoff, conversation analytics, and custom branding.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month with AI included. No per-seat pricing, no
                  per-resolution charges. See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Where VocUI falls short:</strong> VocUI
                  doesn&apos;t have a built-in help center, ticketing system, or CRM. If you need to
                  manage support tickets, publish help docs, or track customer lifecycles, Intercom
                  and HelpScout are genuinely better tools for that. VocUI is purpose-built for AI
                  chatbot conversations — it&apos;s not trying to replace a full support suite.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small and
                  mid-size businesses that want Intercom-quality AI chatbot answers without paying
                  Intercom prices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  2. Tidio
                </h2>
                <p>
                  Tidio is a live chat platform that has grown into a capable customer service tool
                  for small businesses. It combines a clean chat widget with rule-based chatbot
                  automation and, more recently, an AI assistant called Lyro that can handle FAQ-style
                  questions.
                </p>
                <p className="mt-4">
                  Compared to Intercom, Tidio is significantly cheaper and faster to set up. The
                  trade-off is depth: Tidio&apos;s AI is less sophisticated, the knowledge base
                  capabilities are more limited, and there&apos;s no Slack integration for deploying a
                  chatbot internally. But for ecommerce businesses or small service companies that
                  primarily need live chat with some AI automation, Tidio hits a sweet spot. See our{' '}
                  <Link href="/blog/tidio-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Tidio alternatives
                  </Link>{' '}
                  page for more context.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat widget, Lyro AI assistant, visual chatbot builder, visitor tracking, email
                  marketing, and Shopify/WordPress integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month. Lyro AI is an add-on starting at $39/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Ecommerce
                  and small businesses that need affordable live chat with basic AI automation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  3. Crisp
                </h2>
                <p>
                  Crisp is a messaging platform that bundles live chat, a shared inbox, a knowledge
                  base, and a basic chatbot builder into one product. Its free plan is one of the
                  most generous in the category: two agent seats with unlimited chat history.
                </p>
                <p className="mt-4">
                  For teams coming from Intercom, Crisp feels familiar — shared inbox, canned
                  responses, visitor info sidebar — but at a much lower price. The main gap is AI.
                  Crisp&apos;s chatbot is rule-based, not AI-driven. It can surface knowledge base
                  articles based on keywords, but it won&apos;t generate natural-language answers from
                  your content. For teams that rely on live agents and just need automation to handle
                  routing and FAQs, this is fine. For teams that want AI to answer questions
                  directly, it&apos;s a limitation.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, shared inbox, knowledge base, chatbot flows, CRM, and campaign messaging.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  for 2 agents. Pro plan at $25/month per workspace. Unlimited plan at $95/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  teams that want a shared inbox and live chat at a low price, with basic automation
                  for routing and FAQs.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  4. HelpScout
                </h2>
                <p>
                  HelpScout is a help desk platform built for small businesses that want email-first
                  customer support with a clean, simple interface. It&apos;s not a chat-first tool like
                  Intercom — the strength is in shared inboxes, knowledge base documentation (Docs),
                  and a Beacon widget that combines chat, search, and self-service.
                </p>
                <p className="mt-4">
                  HelpScout recently added AI features (AI Summarize, AI Drafts, AI Answers) that
                  help agents respond faster and surface relevant knowledge base articles. It&apos;s not
                  as autonomous as VocUI&apos;s AI chatbot — the AI assists agents rather than replacing
                  them — but for teams that want humans in the loop with AI support, it&apos;s a solid
                  choice.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Shared
                  inbox, Docs knowledge base, Beacon widget (chat + self-service), AI drafts and
                  summaries, reporting, and 50+ integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts at
                  $25/month per user. No free plan. 15-day free trial.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  support teams that prefer email-first workflows with a clean knowledge base and
                  want AI to assist agents, not replace them.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  5. Drift
                </h2>
                <p>
                  Drift (now part of Salesloft) pioneered the &quot;conversational marketing&quot; category.
                  It&apos;s designed primarily for B2B sales teams that want to engage website visitors in
                  real-time, qualify leads through chat, and book meetings automatically. If your goal
                  is lead generation rather than customer support, Drift is purpose-built for that.
                </p>
                <p className="mt-4">
                  The downside is complexity and cost. Drift&apos;s pricing isn&apos;t publicly listed anymore
                  (always a red flag for budget-conscious teams), but plans historically start around
                  $50/month and scale into enterprise territory quickly. The AI features focus on
                  lead routing and meeting scheduling rather than knowledge base answers. See our{' '}
                  <Link href="/blog/chatbase-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Chatbase alternatives
                  </Link>{' '}
                  post if you need a more AI-focused comparison.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Conversational
                  marketing, lead routing, meeting scheduling, chatbot playbooks, ABM targeting,
                  and Salesforce/HubSpot integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts
                  around $50/month (pricing not publicly listed). Enterprise plans available.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> B2B sales
                  teams focused on lead capture and meeting scheduling, not customer support.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Side-by-side comparison
                </h2>

                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Comparison of Intercom alternatives by features and pricing</caption>
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th scope="col" className="sticky left-0 z-10 bg-secondary-50 dark:bg-secondary-800/60 text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tool</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Starting price</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">AI bot</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Help center</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">CRM</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tickets</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                      {comparisonData.map((row, i) => (
                        <tr
                          key={row.tool}
                          className={
                            i === 0
                              ? 'bg-primary-50/50 dark:bg-primary-900/10'
                              : 'bg-white dark:bg-secondary-800/30'
                          }
                        >
                          <th scope="row" className={`sticky left-0 z-10 px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100 ${i === 0 ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'bg-white dark:bg-secondary-800/30'}`}>
                            {i === 0 ? <strong>{row.tool}</strong> : row.tool}
                          </th>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{row.startingPrice}</td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.aiBot} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.helpCenter} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.crmIntegration} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.ticketSystem} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">
                  Partial ( <MinusCircle className="inline w-3 h-3 text-amber-400" /> ) = feature exists but limited in scope or requires a higher-tier plan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Which is right for you?
                </h2>
                <StyledBulletList items={[
                  { title: 'If you want AI chatbot answers from your knowledge base:', description: 'VocUI gives you what Intercom Fin does at a fraction of the cost \u2014 with a free plan to test first.' },
                  { title: 'If you need affordable live chat with basic AI:', description: 'Tidio is simple, fast to set up, and priced for small businesses.' },
                  { title: 'If you want a free shared inbox:', description: 'Crisp\u2019s free plan covers two agents with unlimited history.' },
                  { title: 'If you prefer email-first support with a knowledge base:', description: 'HelpScout is clean, focused, and AI-assisted.' },
                  { title: 'If your priority is B2B lead capture:', description: 'Drift is built for sales conversations, not support.' },
                ]} />
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Can I migrate my Intercom help center articles to another tool?',
                      a: "Yes. Intercom lets you export help center articles as HTML. You can re-add those URLs or documents as knowledge base sources in VocUI, or import them into HelpScout Docs. The migration isn't one-click, but the content transfers cleanly.",
                    },
                    {
                      q: 'What happens to my Intercom Fin conversations if I switch?',
                      a: "Intercom retains your conversation history as long as your account is active. Most alternatives don't import historical conversations, so you'll start fresh. Export your Intercom data before canceling.",
                    },
                    {
                      q: 'Which Intercom alternative has the best ticketing system?',
                      a: "HelpScout is the strongest for ticketing and shared inbox workflows. Crisp also has a shared inbox with basic ticket features. VocUI and Tidio don't have ticketing systems — they focus on chat and AI instead.",
                    },
                    {
                      q: 'Is there an Intercom alternative with both AI chat and CRM?',
                      a: "Drift (now Salesloft) combines chat with CRM-level lead tracking for B2B sales. HelpScout pairs AI-assisted support with customer management. VocUI integrates with external CRMs via webhooks but doesn't have a built-in CRM.",
                    },
                    {
                      q: 'How much can I save switching from Intercom?',
                      a: "A typical small team (3 agents, 500 AI resolutions/month) might pay $700+/month on Intercom. VocUI handles the AI chatbot portion for $29-79/month. HelpScout covers help desk needs for $75/month. The savings are significant, but you may need two tools to replace everything Intercom bundles.",
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
            <h2 className="text-2xl font-bold mb-3">Test VocUI side by side -- for free</h2>
            <p className="text-white/80 mb-2">
              Import your existing content and see how VocUI handles your real questions, not a canned demo.
            </p>
            <p className="text-white/60 text-sm mb-8">
              No sales calls. No contracts. Cancel anytime.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Create a free chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Switch in minutes -- bring your content and go live today</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
