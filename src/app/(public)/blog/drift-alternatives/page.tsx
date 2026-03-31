import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: '5 Drift Alternatives for Conversational Marketing | VocUI',
  description:
    'Drift changed the conversational marketing game, but it\'s not the only option. Compare five alternatives for lead capture, chat, and AI-powered conversations.',
  openGraph: {
    title: '5 Drift Alternatives for Conversational Marketing | VocUI',
    description:
      'Drift changed the conversational marketing game, but it\'s not the only option. Compare five alternatives for lead capture, chat, and AI-powered conversations.',
    url: 'https://vocui.com/blog/drift-alternatives',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Drift Alternatives for Conversational Marketing | VocUI',
    description:
      'Drift changed the conversational marketing game, but it\'s not the only option. Compare five alternatives for lead capture, chat, and AI-powered conversations.',
  },
  alternates: { canonical: 'https://vocui.com/blog/drift-alternatives' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '5 Drift Alternatives for Conversational Marketing',
      description:
        'A comparison of five alternatives to Drift for lead capture, conversational marketing, and AI-powered chat.',
      url: 'https://vocui.com/blog/drift-alternatives',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/drift-alternatives',
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
        url: 'https://vocui.com/blog/drift-alternatives/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I export my Drift playbooks to another platform?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "No. Drift playbooks are proprietary and can\u2019t be exported. You\u2019ll need to rebuild your conversation flows in whatever tool you switch to. AI-powered tools like VocUI don\u2019t use playbooks \u2014 the AI handles conversation routing based on your content instead.",
          },
        },
        {
          '@type': 'Question',
          name: 'What happens to my Drift data after the Salesloft acquisition?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Your data remains accessible through the Salesloft platform as long as you have an active account. If you\u2019re planning to leave, export your contact data and conversation history before canceling. Salesloft provides data export options.",
          },
        },
        {
          '@type': 'Question',
          name: 'Which Drift alternative has the best meeting booking?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "HubSpot Chatbot has the most seamless meeting booking if you use HubSpot CRM \u2014 it connects directly to your team\u2019s calendar. Qualified also excels at meeting scheduling for enterprise sales. VocUI doesn\u2019t have built-in calendar booking.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is there a Drift alternative for ABM targeting?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Qualified is the closest to Drift for ABM. It identifies target accounts, personalizes the chat experience, and routes VIP visitors to reps in real time. It integrates deeply with Salesforce. The price ($3,500+/month) reflects the enterprise focus.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I replace Drift with something under $100/month?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes, but with trade-offs. VocUI ($29/month) handles AI chat with lead capture but not ABM or meeting booking. HubSpot\u2019s free chatbot covers lead routing and meeting scheduling but has limited AI. Tidio ($29/month) offers chat automation for small businesses. None replicate Drift\u2019s full ABM feature set at that price.",
          },
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
  leadRouting: SupportLevel;
  meetingBooking: SupportLevel;
  playbooks: SupportLevel;
  abmFeatures: SupportLevel;
  revenueAttribution: SupportLevel;
}

const comparisonData: ToolRow[] = [
  {
    tool: 'VocUI',
    startingPrice: 'Free / $29+',
    leadRouting: 'partial',
    meetingBooking: 'no',
    playbooks: 'no',
    abmFeatures: 'no',
    revenueAttribution: 'no',
  },
  {
    tool: 'Intercom',
    startingPrice: '$74+',
    leadRouting: 'yes',
    meetingBooking: 'partial',
    playbooks: 'yes',
    abmFeatures: 'partial',
    revenueAttribution: 'partial',
  },
  {
    tool: 'HubSpot Chatbot',
    startingPrice: 'Free / $20+',
    leadRouting: 'yes',
    meetingBooking: 'yes',
    playbooks: 'partial',
    abmFeatures: 'partial',
    revenueAttribution: 'yes',
  },
  {
    tool: 'Tidio',
    startingPrice: 'Free / $29+',
    leadRouting: 'partial',
    meetingBooking: 'no',
    playbooks: 'partial',
    abmFeatures: 'no',
    revenueAttribution: 'no',
  },
  {
    tool: 'Qualified',
    startingPrice: '$3,500+/mo',
    leadRouting: 'yes',
    meetingBooking: 'yes',
    playbooks: 'yes',
    abmFeatures: 'yes',
    revenueAttribution: 'yes',
  },
];

function SupportIcon({ level }: { level: SupportLevel }) {
  if (level === 'yes') return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (level === 'no') return <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />;
  return <MinusCircle className="w-5 h-5 text-amber-400 mx-auto" aria-label="Partial" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DriftAlternativesPage() {
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
                5 Drift Alternatives
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Comparison
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">10 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                5 Drift Alternatives for Conversational Marketing
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Drift defined conversational marketing for a generation of B2B teams. Now that
                it&apos;s been absorbed into Salesloft, many businesses are looking for alternatives
                that deliver the same lead capture and chat capabilities — often at a lower price.
              </p>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 font-medium">
                The top Drift alternatives are VocUI, Intercom, HubSpot Chatbot, Tidio, and
                Qualified. The right choice depends on whether you need enterprise ABM (Qualified),
                a full support suite (Intercom), CRM-native chat (HubSpot), or AI knowledge base
                conversations (VocUI).
              </p>
            </div>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 italic mb-8">
              Disclosure: VocUI is our product. We&apos;ve aimed to be fair in this comparison, but we recommend trying any tool yourself before committing. All pricing and feature information was accurate at time of writing.
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What happened to Drift?
                </h2>
                <p>
                  Drift pioneered &quot;conversational marketing&quot; — the idea that a chat widget could
                  replace forms, qualify leads in real time, and book meetings while sales reps
                  sleep. It worked. Drift became the standard for B2B teams that wanted to engage
                  website visitors the moment they showed buying intent.
                </p>
                <p className="mt-4">
                  Then Salesloft acquired Drift in early 2024. Since the acquisition, the standalone
                  Drift product has been folded into Salesloft&apos;s broader revenue platform. For
                  existing users, this means:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Product consolidation.</strong> Drift
                    features are being merged into Salesloft. Some standalone capabilities have been
                    deprecated or renamed. The roadmap now serves Salesloft&apos;s priorities.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Pricing changes.</strong> Drift
                    was already enterprise-priced. The Salesloft bundle hasn&apos;t made it cheaper — and
                    for teams that only need chat, paying for a full revenue platform is overkill.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">No new standalone signups.</strong> You
                    can&apos;t sign up for &quot;Drift&quot; anymore in most cases — you&apos;re signing up for
                    Salesloft. The brand is being absorbed.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Limited AI for support use cases.</strong> Drift&apos;s
                    AI was always about routing and playbooks, not answering questions from your
                    knowledge base. See our{' '}
                    <Link href="/blog/chatbot-lead-generation-strategies" className="text-primary-600 dark:text-primary-400 hover:underline">
                      chatbot lead generation strategies
                    </Link>{' '}
                    for approaches that combine AI answers with lead capture.
                  </li>
                </ul>
                <p className="mt-4">
                  Whether you&apos;re a current Drift user evaluating your options or a new buyer who
                  found this page searching for what Drift used to offer, the alternatives below
                  cover the full spectrum — from enterprise ABM to affordable AI chat.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  1. VocUI
                </h2>
                <p>
                  VocUI takes a different approach than Drift. Instead of scripted playbooks and
                  lead routing rules, VocUI trains an AI chatbot on your actual content — product
                  docs, pricing pages, FAQs, support articles — and lets it have natural
                  conversations with visitors. When those conversations reveal a qualified lead,
                  VocUI captures their information automatically.
                </p>
                <p className="mt-4">
                  This means visitors get real answers to their questions (not just &quot;let me connect
                  you with sales&quot;), which builds trust and keeps them on your site longer. The lead
                  capture happens within the conversation flow, not as a gated popup. And because
                  VocUI also deploys to Slack, your sales and support teams can use the same
                  knowledge base bot internally.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  knowledge base chatbot, in-chat lead capture, embeddable widget, Slack and
                  Telegram deployment, live agent handoff, conversation analytics, and custom
                  branding.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month. No enterprise-only gating. See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Where VocUI falls short:</strong> VocUI
                  doesn&apos;t have built-in meeting booking, lead routing rules, ABM targeting, or
                  revenue attribution. If you relied on Drift&apos;s playbooks to route enterprise
                  accounts to specific reps and book calendar slots automatically, VocUI won&apos;t
                  replace that. For true Drift-level ABM, Qualified or HubSpot are better fits.
                  VocUI&apos;s strength is AI-powered conversations with lead capture — a different
                  approach to the same goal.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Businesses
                  that want conversational lead capture powered by AI knowledge base answers, not
                  scripted playbooks.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  2. Intercom
                </h2>
                <p>
                  Intercom is the closest enterprise-grade alternative to Drift for conversational
                  engagement. It covers the full customer lifecycle: marketing messages, support
                  inbox, knowledge base, product tours, and an AI assistant (Fin) that can resolve
                  questions autonomously.
                </p>
                <p className="mt-4">
                  For teams that used Drift primarily for lead qualification and meeting booking,
                  Intercom can replicate most of that with Custom Bots and workflow automation. The
                  addition of Fin gives it stronger AI capabilities than Drift ever had for
                  knowledge-base-driven conversations. The trade-off is cost — Intercom&apos;s per-seat
                  pricing plus per-resolution Fin charges add up quickly. See our{' '}
                  <Link href="/blog/intercom-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Intercom alternatives
                  </Link>{' '}
                  if Intercom is also too expensive.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  chatbot (Fin), Custom Bots, shared inbox, help center, product tours, campaigns,
                  and deep CRM integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts at
                  $74/month per seat. Fin AI costs extra per resolution. No free plan.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Mid-market
                  teams that need a full conversational platform and can justify Intercom&apos;s pricing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  3. HubSpot Chatbot
                </h2>
                <p>
                  HubSpot&apos;s chatbot builder comes free with HubSpot CRM. If you&apos;re already using
                  HubSpot for marketing or sales, the chatbot is a natural extension — leads captured
                  in chat flow directly into your CRM contacts, deals, and workflows without any
                  third-party integration.
                </p>
                <p className="mt-4">
                  The chatbot itself is rule-based, not AI-driven. You build conversation flows with
                  a visual editor that handles qualification questions, meeting booking, and ticket
                  creation. It&apos;s effective for structured lead capture but can&apos;t answer open-ended
                  questions from your knowledge base the way VocUI or Intercom can. HubSpot has
                  started adding AI features (ChatSpot, AI content assistant), but the chatbot
                  builder itself remains primarily flow-based.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Visual
                  chatbot builder, HubSpot CRM integration, meeting scheduling, ticket creation,
                  live chat, and free-tier availability.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free with
                  HubSpot CRM. Paid HubSpot plans (for advanced features) start at $20/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Teams
                  already using HubSpot CRM that want lead capture chat without adding another tool.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  4. Tidio
                </h2>
                <p>
                  Tidio is the budget-friendly option on this list. It combines live chat, a visual
                  chatbot builder, and an AI assistant (Lyro) in a package that starts free and
                  stays affordable as you scale. For small businesses that want to engage website
                  visitors without Drift&apos;s complexity or price, Tidio is a practical choice.
                </p>
                <p className="mt-4">
                  Tidio&apos;s chatbot builder handles lead capture flows, automated greetings, and
                  basic qualification. Lyro adds AI-powered FAQ responses, though it&apos;s less capable
                  than VocUI for deep knowledge base use cases. The main gap compared to Drift is
                  CRM depth — Tidio integrates with popular CRMs via Zapier but doesn&apos;t have native
                  Salesforce or HubSpot connectors.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, visual chatbot builder, Lyro AI, visitor tracking, lead capture, email
                  marketing, and ecommerce integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month. Lyro AI is an add-on.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  businesses and ecommerce sites that need affordable chat with basic lead capture
                  and automation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  5. Qualified
                </h2>
                <p>
                  Qualified is Drift&apos;s most direct competitor in the enterprise ABM (account-based
                  marketing) space. It&apos;s built specifically for B2B companies that use Salesforce
                  and want to identify, engage, and convert target accounts through real-time
                  website conversations.
                </p>
                <p className="mt-4">
                  If you were using Drift for ABM plays — showing different experiences to target
                  accounts, routing VIP visitors to reps instantly, and syncing everything back to
                  Salesforce — Qualified is the closest replacement. The AI features (Piper) can
                  engage visitors 24/7 and schedule meetings automatically. The catch is price:
                  Qualified starts around $3,500/month, making it exclusively an enterprise tool.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> ABM
                  targeting, Salesforce-native integration, Piper AI agent, real-time visitor
                  identification, meeting scheduling, and pipeline analytics.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts
                  around $3,500/month. Enterprise only. No free plan or self-serve option.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Enterprise
                  B2B teams running ABM with Salesforce that need a direct Drift replacement at the
                  same scale.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Side-by-side comparison
                </h2>

                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tool</th>
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Starting price</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Lead routing</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Meetings</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Playbooks</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">ABM</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Revenue attr.</th>
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
                          <td className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">
                            {i === 0 ? <strong>{row.tool}</strong> : row.tool}
                          </td>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{row.startingPrice}</td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.leadRouting} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.meetingBooking} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.playbooks} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.abmFeatures} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.revenueAttribution} /></td>
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
                <ul className="list-disc list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you want AI-driven conversations with lead capture:</strong>{' '}
                    VocUI gives visitors real answers from your content and captures leads naturally
                    — no scripted playbooks needed.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you need a full conversational suite:</strong>{' '}
                    Intercom covers marketing, support, and AI in one platform.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you&apos;re already on HubSpot:</strong>{' '}
                    The free chatbot builder integrates natively with your CRM.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If budget is the priority:</strong>{' '}
                    Tidio offers chat and basic automation at the lowest cost.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you need enterprise ABM with Salesforce:</strong>{' '}
                    Qualified is the direct Drift replacement at that scale.
                  </li>
                </ul>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Can I export my Drift playbooks to another platform?',
                      a: "No. Drift playbooks are proprietary and can't be exported. You'll need to rebuild your conversation flows in whatever tool you switch to. AI-powered tools like VocUI don't use playbooks — the AI handles conversation routing based on your content instead.",
                    },
                    {
                      q: 'What happens to my Drift data after the Salesloft acquisition?',
                      a: "Your data remains accessible through the Salesloft platform as long as you have an active account. If you're planning to leave, export your contact data and conversation history before canceling. Salesloft provides data export options.",
                    },
                    {
                      q: 'Which Drift alternative has the best meeting booking?',
                      a: "HubSpot Chatbot has the most seamless meeting booking if you use HubSpot CRM — it connects directly to your team's calendar. Qualified also excels at meeting scheduling for enterprise sales. VocUI doesn't have built-in calendar booking.",
                    },
                    {
                      q: 'Is there a Drift alternative for ABM targeting?',
                      a: 'Qualified is the closest to Drift for ABM. It identifies target accounts, personalizes the chat experience, and routes VIP visitors to reps in real time. It integrates deeply with Salesforce. The price ($3,500+/month) reflects the enterprise focus.',
                    },
                    {
                      q: 'Can I replace Drift with something under $100/month?',
                      a: "Yes, but with trade-offs. VocUI ($29/month) handles AI chat with lead capture but not ABM or meeting booking. HubSpot's free chatbot covers lead routing and meeting scheduling but has limited AI. Tidio ($29/month) offers chat automation for small businesses. None replicate Drift's full ABM feature set at that price.",
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
            <h2 className="text-2xl font-bold mb-3">Try VocUI free and compare for yourself</h2>
            <p className="text-white/80 mb-2">
              The best way to evaluate a chatbot platform is to use it. Create a free chatbot, train it on your content, and see the difference.
            </p>
            <p className="text-white/60 text-sm mb-8">
              No sales calls. No credit card. Just results you can measure.
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
            <p className="text-xs text-white/50 mt-4">Switch in minutes — import your content and go live today</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
