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
  title: 'Best Zendesk Chat Alternatives Compared | VocUI',
  description:
    'Zendesk Chat is reliable but complex and costly. Compare the best alternatives with AI chatbot features and better pricing for small businesses.',
  openGraph: {
    title: 'Best Zendesk Chat Alternatives Compared | VocUI',
    description:
      'Zendesk Chat is reliable but complex and costly. Compare the best alternatives with AI chatbot features and better pricing for small businesses.',
    url: 'https://vocui.com/blog/zendesk-chat-alternatives',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Zendesk Chat Alternatives Compared | VocUI',
    description:
      'Zendesk Chat is reliable but complex and costly. Compare the best alternatives with AI chatbot features and better pricing for small businesses.',
  },
  alternates: { canonical: 'https://vocui.com/blog/zendesk-chat-alternatives' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Best Zendesk Chat Alternatives Compared',
      description:
        'A comparison of the best Zendesk Chat alternatives with simpler setup, AI chatbot features, and better pricing for small businesses.',
      url: 'https://vocui.com/blog/zendesk-chat-alternatives',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/zendesk-chat-alternatives',
      },
      datePublished: '2025-12-03',
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
        url: 'https://vocui.com/blog/zendesk-chat-alternatives/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I export my Zendesk Chat triggers and automations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Zendesk automations are not directly exportable to other platforms. You\u2019ll need to recreate your workflows. Simpler alternatives like VocUI and Tidio don\u2019t use trigger-based systems \u2014 they handle routing through AI or visual chatbot builders, which are faster to set up from scratch.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I migrate my Zendesk help center articles?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Export your Zendesk help center articles as HTML or use the API. You can then add those URLs as knowledge base sources in VocUI, or import the content into Crisp or Freshchat knowledge bases. The text transfers cleanly even if formatting needs adjustment.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which Zendesk alternative handles phone and email support too?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Freshchat (as part of Freshworks) handles email, phone, WhatsApp, and chat. LiveChat integrates with LiveChat\u2019s sister product (HelpDesk) for email ticketing. VocUI, Tidio, and Crisp focus primarily on chat and messaging \u2014 they won\u2019t replace Zendesk\u2019s phone/email routing.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is Zendesk Chat available without the full Suite?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Zendesk has been pushing users toward Suite plans. Standalone Chat plans exist but are increasingly limited in features and AI access. For most new users, Zendesk means buying the Suite at $55+/agent/month \u2014 which is why many small teams look for focused alternatives.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which Zendesk Chat alternative has the best reporting?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "LiveChat and Freshchat both have strong reporting dashboards for chat metrics, response times, and satisfaction scores. VocUI provides conversation analytics focused on AI performance (questions asked, resolution rate). None match Zendesk Explore\u2019s depth for enterprise-grade analytics.",
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
          name: 'Best Zendesk Chat Alternatives Compared',
          item: 'https://vocui.com/blog/zendesk-chat-alternatives',
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
  ticketManagement: SupportLevel;
  knowledgeBase: SupportLevel;
  aiSuggestions: SupportLevel;
  multichannel: SupportLevel;
  reporting: SupportLevel;
}

const comparisonData: ToolRow[] = [
  {
    tool: 'VocUI',
    startingPrice: 'Free / $29+',
    ticketManagement: 'no',
    knowledgeBase: 'yes',
    aiSuggestions: 'yes',
    multichannel: 'partial',
    reporting: 'partial',
  },
  {
    tool: 'Freshchat',
    startingPrice: 'Free / $19+',
    ticketManagement: 'partial',
    knowledgeBase: 'partial',
    aiSuggestions: 'partial',
    multichannel: 'yes',
    reporting: 'yes',
  },
  {
    tool: 'Tidio',
    startingPrice: 'Free / $29+',
    ticketManagement: 'no',
    knowledgeBase: 'partial',
    aiSuggestions: 'partial',
    multichannel: 'partial',
    reporting: 'partial',
  },
  {
    tool: 'LiveChat',
    startingPrice: '$20+',
    ticketManagement: 'partial',
    knowledgeBase: 'no',
    aiSuggestions: 'partial',
    multichannel: 'partial',
    reporting: 'yes',
  },
  {
    tool: 'Crisp',
    startingPrice: 'Free / $25+',
    ticketManagement: 'partial',
    knowledgeBase: 'yes',
    aiSuggestions: 'partial',
    multichannel: 'partial',
    reporting: 'partial',
  },
];

function SupportIcon({ level }: { level: SupportLevel }) {
  if (level === 'yes') return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (level === 'no') return <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />;
  return <MinusCircle className="w-5 h-5 text-amber-400 mx-auto" aria-label="Partial" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ZendeskChatAlternativesPage() {
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
                Zendesk Chat Alternatives
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Comparison
                </span>
                <time dateTime="2025-12-03" className="text-xs text-secondary-400 dark:text-secondary-500">Dec 3, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">10 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                Best Zendesk Chat Alternatives Compared
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Zendesk Chat is battle-tested and reliable. But for small businesses that don&apos;t
                need the full Zendesk Suite, the complexity and cost often outweigh the benefits.
                Here are the best alternatives that get the job done.
              </p>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 font-medium">
                The top Zendesk Chat alternatives are VocUI, Freshchat, Tidio, LiveChat, and Crisp.
                The right choice depends on whether you need AI answers (VocUI), multichannel
                support (Freshchat), simple live chat (Tidio, LiveChat), or a free shared inbox (Crisp).
              </p>
            </div>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 italic mb-8">
              Disclosure: VocUI is our product. We&apos;ve aimed to be fair in this comparison, but we recommend trying any tool yourself before committing. All pricing and feature information was accurate at time of writing.
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  When Zendesk Chat is overkill
                </h2>
                <p>
                  Zendesk is an institution in customer support. The ticket management is mature, the
                  multichannel routing is battle-tested, and the reporting gives ops teams exactly the
                  data they need. For mid-market and enterprise support organizations, Zendesk earns
                  its price. The problem is when small businesses sign up for &quot;just chat&quot; and find
                  themselves inside a platform built for teams 10x their size.
                </p>
                <p className="mt-4">
                  Here&apos;s where the friction shows up:
                </p>
                <StyledBulletList items={[
                  { title: 'You pay for the suite.', description: 'Zendesk now pushes the Suite plan ($55/agent/month), bundling ticketing, talk, and chat. If you only need chat, most of that spend is wasted.' },
                  { title: 'Configuration takes days.', description: 'Setting up triggers, automations, views, and groups requires patience and Zendesk-specific knowledge. Small teams often leave features unconfigured because the learning curve isn\u2019t worth it.' },
                  { title: 'AI requires higher tiers.', description: <>Zendesk has AI features, but they live behind Suite Professional ($115/agent/month) or require add-ons. Getting AI chatbot answers from your knowledge base is expensive. See our <Link href="/blog/chatbase-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">Chatbase alternatives</Link> for dedicated AI chatbot tools.</> },
                  { title: 'Ticket-centric workflow.', description: 'Zendesk treats every conversation as a ticket. If you want lighter, more conversational interactions \u2014 more like messaging than a help desk \u2014 the paradigm feels heavy.' },
                ]} />
                <p className="mt-4">
                  If you need ticket management, multichannel routing, and enterprise-grade reporting,
                  Zendesk is still the right tool — or Freshchat if you want a similar approach with
                  less complexity. But if you want a simpler solution for chat and AI, the alternatives
                  below deliver more value per dollar.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  1. VocUI
                </h2>
                <p>
                  VocUI is an AI chatbot platform that does what many Zendesk Chat users actually
                  want: answer customer questions automatically using your existing content. Instead
                  of routing every visitor to a live agent and hoping they&apos;re available, VocUI
                  trains an AI chatbot on your knowledge base and lets it handle the conversation.
                </p>
                <p className="mt-4">
                  You add your content sources — help articles, product docs, FAQs, PDFs — and VocUI
                  builds a chatbot that answers questions using only that content. No hallucinated
                  answers. When the bot can&apos;t help, it hands off to a human agent through the
                  built-in live agent console. The whole setup takes under 15 minutes, compared to
                  the days it often takes to configure Zendesk properly.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  knowledge base chatbot, embeddable widget, Slack and Telegram deployment, live
                  agent handoff, lead capture, conversation analytics, and custom branding.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month. No per-agent pricing. See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Where VocUI falls short:</strong> VocUI
                  doesn&apos;t have ticket management, multichannel routing (phone, SMS, social), or the
                  depth of reporting that Zendesk offers. If you need to track SLA compliance, route
                  tickets across teams, or manage support across email, phone, and chat from one
                  dashboard, Zendesk or Freshchat are genuinely better tools for that. VocUI focuses
                  specifically on AI chat conversations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  businesses that want AI-powered customer support without the complexity of a full
                  help desk suite.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  2. Freshchat
                </h2>
                <p>
                  Freshchat is the messaging product in the Freshworks ecosystem. If Zendesk feels
                  bloated and you want a modern alternative with a cleaner interface, Freshchat is
                  worth evaluating. The UI is noticeably more approachable, and the pricing is lower
                  — especially for small teams.
                </p>
                <p className="mt-4">
                  Freshchat includes live chat, chatbot automation (Freddy AI), and multi-channel
                  support across web, mobile, WhatsApp, and Apple Business Chat. The AI capabilities
                  are improving but still trail dedicated AI chatbot tools like VocUI for knowledge
                  base depth. Where Freshchat shines is within the Freshworks ecosystem: if you use
                  Freshdesk for ticketing or Freshsales for CRM, the data flows between products
                  without connectors. See our{' '}
                  <Link href="/blog/tidio-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Tidio alternatives
                  </Link>{' '}
                  for more context on Freshchat.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, Freddy AI bot, multi-channel messaging, Freshworks ecosystem integration,
                  campaign messaging, and a free tier.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available (limited). Paid plans from $19/month per agent.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Teams
                  that want a modern Zendesk alternative within the Freshworks ecosystem, or need
                  multi-channel messaging at a lower price.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  3. Tidio
                </h2>
                <p>
                  Tidio is the easiest to set up on this list. Where Zendesk requires careful
                  configuration of triggers, groups, and automations, Tidio gets you a working live
                  chat widget in under five minutes. The visual chatbot builder adds automation
                  without any code, and Lyro (Tidio&apos;s AI) handles basic FAQ responses.
                </p>
                <p className="mt-4">
                  For small businesses switching from Zendesk Chat, Tidio is often the simplest
                  transition. The feature set is narrower — no ticketing system, no phone support,
                  no complex routing — but that narrowness is the point. You get chat, automation,
                  and basic AI without the overhead. The trade-off is depth: Tidio&apos;s AI is less
                  capable than VocUI for document-heavy knowledge bases, and there&apos;s no Slack
                  integration for internal use.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, visual chatbot builder, Lyro AI, visitor tracking, email marketing, and
                  ecommerce integrations (Shopify, WordPress).
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month. Lyro AI is an add-on.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  businesses that want the simplest possible live chat setup with basic chatbot
                  automation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  4. LiveChat
                </h2>
                <p>
                  LiveChat is a dedicated live chat tool that does exactly what the name suggests. No
                  help desk bundled in, no CRM, no email marketing — just a polished chat widget
                  with a clean agent interface. For teams whose primary need is real-time
                  conversations with website visitors, LiveChat provides a focused experience.
                </p>
                <p className="mt-4">
                  LiveChat has added AI features through integrations (particularly with ChatBot,
                  a sister product), but the core product remains agent-centric. You get canned
                  responses, file sharing, chat ratings, and solid reporting. The agent desktop app
                  is well-designed and responsive. The main limitation is that without ChatBot
                  (separate subscription), there&apos;s no AI automation — every conversation requires a
                  human agent.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat widget, agent desktop app, canned responses, file sharing, chat ratings,
                  reporting, and 200+ integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts at
                  $20/month per agent. No free plan. 14-day free trial.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Teams
                  that want a dedicated, polished live chat experience and have agents available to
                  handle every conversation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  5. Crisp
                </h2>
                <p>
                  Crisp bundles live chat, a shared inbox, a knowledge base, and chatbot automation
                  into a single product with one of the best free plans in the category. For small
                  teams coming from Zendesk who want to simplify their stack, Crisp covers a lot of
                  ground at a low price.
                </p>
                <p className="mt-4">
                  The free plan includes two agent seats with unlimited chat history — more generous
                  than most competitors. The chatbot builder is rule-based (not AI-driven), which
                  means you can automate common flows and surface knowledge base articles, but it
                  won&apos;t generate natural-language answers from your content. For teams that rely on
                  human agents and just need chat automation for routing and first-response, Crisp
                  delivers a lot of value per dollar.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, shared inbox, knowledge base, chatbot flows, CRM, campaign messaging, and
                  a generous free tier.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  for 2 agents. Pro plan at $25/month per workspace. Unlimited plan at $95/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  teams that need an all-in-one messaging tool with a strong free plan and don&apos;t
                  require AI-generated answers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Side-by-side comparison
                </h2>

                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Comparison of Zendesk Chat alternatives by features and pricing</caption>
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th scope="col" className="sticky left-0 z-10 bg-secondary-50 dark:bg-secondary-800/60 text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tool</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Starting price</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tickets</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Knowledge base</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">AI suggestions</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Multichannel</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Reporting</th>
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
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.ticketManagement} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.knowledgeBase} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.aiSuggestions} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.multichannel} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.reporting} /></td>
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
                  { title: 'If you want AI to answer customer questions automatically:', description: 'VocUI trains on your content and handles conversations without requiring live agents for every chat.' },
                  { title: 'If you\u2019re already on Freshworks:', description: 'Freshchat integrates natively and has a cleaner interface than Zendesk.' },
                  { title: 'If you want the simplest possible setup:', description: 'Tidio gets you live chat with automation in minutes.' },
                  { title: 'If you need dedicated live chat with no extras:', description: 'LiveChat is focused, polished, and agent-friendly.' },
                  { title: 'If you want the best free plan:', description: 'Crisp gives you two agent seats with unlimited history at no cost.' },
                ]} />
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Can I export my Zendesk Chat triggers and automations?',
                      a: "Zendesk automations are not directly exportable to other platforms. You'll need to recreate your workflows. Simpler alternatives like VocUI and Tidio don't use trigger-based systems — they handle routing through AI or visual chatbot builders, which are faster to set up from scratch.",
                    },
                    {
                      q: 'How do I migrate my Zendesk help center articles?',
                      a: 'Export your Zendesk help center articles as HTML or use the API. You can then add those URLs as knowledge base sources in VocUI, or import the content into Crisp or Freshchat knowledge bases. The text transfers cleanly even if formatting needs adjustment.',
                    },
                    {
                      q: 'Which Zendesk alternative handles phone and email support too?',
                      a: "Freshchat (as part of Freshworks) handles email, phone, WhatsApp, and chat. LiveChat integrates with LiveChat's sister product (HelpDesk) for email ticketing. VocUI, Tidio, and Crisp focus primarily on chat and messaging — they won't replace Zendesk's phone/email routing.",
                    },
                    {
                      q: 'Is Zendesk Chat available without the full Suite?',
                      a: "Zendesk has been pushing users toward Suite plans. Standalone Chat plans exist but are increasingly limited in features and AI access. For most new users, Zendesk means buying the Suite at $55+/agent/month — which is why many small teams look for focused alternatives.",
                    },
                    {
                      q: 'Which Zendesk Chat alternative has the best reporting?',
                      a: "LiveChat and Freshchat both have strong reporting dashboards for chat metrics, response times, and satisfaction scores. VocUI provides conversation analytics focused on AI performance (questions asked, resolution rate). None match Zendesk Explore's depth for enterprise-grade analytics.",
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
