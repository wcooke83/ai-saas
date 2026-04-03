import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';
import { StyledBulletList } from '@/components/blog/styled-lists';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Freshchat Alternatives for Small Business | VocUI',
  description:
    'Freshchat works best within the Freshworks ecosystem. If you need a standalone AI chat solution, here are the best alternatives to consider.',
  openGraph: {
    title: 'Best Freshchat Alternatives for Small Business | VocUI',
    description:
      'Freshchat works best within the Freshworks ecosystem. If you need a standalone AI chat solution, here are the best alternatives to consider.',
    url: 'https://vocui.com/blog/freshchat-alternatives',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Freshchat Alternatives for Small Business | VocUI',
    description:
      'Freshchat works best within the Freshworks ecosystem. If you need a standalone AI chat solution, here are the best alternatives to consider.',
  },
  alternates: { canonical: 'https://vocui.com/blog/freshchat-alternatives' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Best Freshchat Alternatives for Small Business',
      description:
        'A comparison of the best standalone Freshchat alternatives with AI chatbot features and knowledge base support for small businesses.',
      url: 'https://vocui.com/blog/freshchat-alternatives',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/freshchat-alternatives',
      },
      datePublished: '2025-12-31',
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
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I migrate my Freshchat bot flows to another platform?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Freshchat bot flows aren\u2019t exportable. You\u2019ll need to recreate them in your new tool. AI-powered alternatives like VocUI don\u2019t use visual bot flows \u2014 the AI handles conversations based on your knowledge base content, which is often simpler to set up than rebuilding flows.",
          },
        },
        {
          '@type': 'Question',
          name: 'What if I use Freshdesk alongside Freshchat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "If you use Freshdesk for ticketing, leaving Freshchat means losing the native chat-to-ticket integration. Consider whether you\u2019re ready to replace both products or just the chat component. VocUI and Crisp can work alongside Freshdesk via webhooks, but it won\u2019t be as seamless.",
          },
        },
        {
          '@type': 'Question',
          name: 'Which Freshchat alternative has campaign messaging?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Tidio and Crisp both support proactive campaign messages to website visitors. Intercom has the most sophisticated campaign system (targeted messages, in-app tours, sequences). VocUI doesn\u2019t have campaign messaging \u2014 it focuses on responding to visitor questions rather than initiating outbound conversations.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is Freddy AI comparable to VocUI or Intercom Fin?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Freddy AI handles basic FAQ deflection and routing well but can\u2019t answer complex questions from your documents. VocUI\u2019s AI reads and understands your full knowledge base to generate contextual answers. Intercom Fin does the same with Intercom\u2019s help center content. Both go significantly deeper than Freddy.",
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use Freshchat without the rest of Freshworks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Technically yes, but you lose most of the integration value. Ticket creation, CRM sync, and advanced analytics all require other Freshworks products. If you\u2019re not using the ecosystem, a standalone tool like VocUI, Tidio, or Crisp will give you a simpler, more focused experience.",
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
          name: 'Best Freshchat Alternatives for Small Business',
          item: 'https://vocui.com/blog/freshchat-alternatives',
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
  standaloneSetup: SupportLevel;
  aiChatbot: SupportLevel;
  campaignMessages: SupportLevel;
  integrations: SupportLevel;
  freePlan: SupportLevel;
}

const comparisonData: ToolRow[] = [
  {
    tool: 'VocUI',
    startingPrice: 'Free / $29+',
    standaloneSetup: 'yes',
    aiChatbot: 'yes',
    campaignMessages: 'no',
    integrations: 'partial',
    freePlan: 'yes',
  },
  {
    tool: 'Tidio',
    startingPrice: 'Free / $29+',
    standaloneSetup: 'yes',
    aiChatbot: 'partial',
    campaignMessages: 'yes',
    integrations: 'yes',
    freePlan: 'yes',
  },
  {
    tool: 'Crisp',
    startingPrice: 'Free / $25+',
    standaloneSetup: 'yes',
    aiChatbot: 'partial',
    campaignMessages: 'yes',
    integrations: 'partial',
    freePlan: 'yes',
  },
  {
    tool: 'Intercom',
    startingPrice: '$74+',
    standaloneSetup: 'yes',
    aiChatbot: 'yes',
    campaignMessages: 'yes',
    integrations: 'yes',
    freePlan: 'no',
  },
  {
    tool: 'LiveChat',
    startingPrice: '$20+',
    standaloneSetup: 'yes',
    aiChatbot: 'partial',
    campaignMessages: 'no',
    integrations: 'yes',
    freePlan: 'no',
  },
];

function SupportIcon({ level }: { level: SupportLevel }) {
  if (level === 'yes') return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (level === 'no') return <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />;
  return <MinusCircle className="w-5 h-5 text-amber-400 mx-auto" aria-label="Partial" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FreshchatAlternativesPage() {
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
                Freshchat Alternatives
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Comparison
                </span>
                <time dateTime="2025-12-31" className="text-xs text-secondary-400 dark:text-secondary-500">Dec 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">10 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                Best Freshchat Alternatives for Small Business
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Freshchat is a solid messaging tool if you&apos;re already in the Freshworks ecosystem.
                But if you need a standalone chat solution with real AI capabilities, you have
                better options. Here are the best alternatives worth evaluating.
              </p>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 font-medium">
                The top Freshchat alternatives are VocUI, Tidio, Crisp, Intercom, and LiveChat.
                The best choice depends on whether you need AI-first chat (VocUI), ecommerce
                integrations (Tidio), a free shared inbox (Crisp), or a full platform (Intercom).
              </p>
            </div>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 italic mb-8">
              Disclosure: VocUI is our product. We&apos;ve aimed to be fair in this comparison, but we recommend trying any tool yourself before committing. All pricing and feature information was accurate at time of writing.
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Freshworks lock-in problem
                </h2>
                <p>
                  Freshchat is a capable messaging product — when it&apos;s running alongside Freshdesk,
                  Freshsales, and FreshCRM. The Freshworks ecosystem is designed so that each product
                  enhances the others: tickets flow from chat to Freshdesk, contacts sync to
                  Freshsales, and reporting spans the entire suite. If you use the full stack, the
                  integration is genuinely seamless.
                </p>
                <p className="mt-4">
                  The problem is what happens when you don&apos;t. As a standalone product, Freshchat
                  loses much of its value:
                </p>
                <StyledBulletList items={[
                  { title: 'Features expect siblings.', description: 'Ticket creation, CRM sync, and advanced reporting are designed around Freshdesk and Freshsales. Without them, you get partial versions of these features \u2014 or need third-party connectors to fill the gaps.' },
                  { title: 'Freddy AI is shallow.', description: 'Freshchat\u2019s AI handles basic deflection and FAQ routing, but can\u2019t answer open-ended questions from your knowledge base. Purpose-built AI chatbot tools go significantly deeper.' },
                  { title: 'Pricing is a puzzle.', description: 'Per-agent pricing, bot session limits, and AI features spread across tiers make it hard to know what you\u2019ll actually pay. The listed price rarely matches the real cost for meaningful usage.' },
                  { title: 'Switching costs grow.', description: 'The deeper you go into Freshworks, the harder it is to leave. Data, workflows, and automations become entangled across products. If you\u2019re evaluating Freshchat, consider whether you want that level of dependency.' },
                ]} />
                <p className="mt-4">
                  If you&apos;re already committed to Freshworks, Freshchat makes sense — the ecosystem
                  integration is a real advantage. But if you&apos;re choosing a standalone chat tool or
                  looking for better AI capabilities, these alternatives deserve consideration.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  1. VocUI
                </h2>
                <p>
                  VocUI is built to work as a standalone product from day one. There&apos;s no ecosystem
                  to buy into, no separate help desk required, and no confusing tier-gated features.
                  You upload your knowledge base content, VocUI trains an AI chatbot, and you deploy
                  it wherever your customers (or team) need it.
                </p>
                <p className="mt-4">
                  The core difference from Freshchat is AI depth. VocUI&apos;s chatbot answers questions
                  by understanding your actual content — help articles, product docs, PDFs, FAQs — not
                  just matching keywords. When the bot encounters something outside its knowledge, it
                  hands off to a human agent through the built-in console. This means fewer tickets,
                  faster first responses, and customers who actually get their answers.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  knowledge base chatbot, embeddable widget, Slack and Telegram deployment, live
                  agent handoff, lead capture, conversation analytics, and custom branding.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month with AI included. No per-agent pricing, no
                  hidden tier gates. See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Where VocUI falls short:</strong> VocUI
                  doesn&apos;t have campaign messaging, proactive chat triggers, or built-in email
                  marketing. If you used Freshchat&apos;s campaigns to send targeted messages to website
                  visitors or push notifications, Tidio or Crisp are better replacements for that
                  specific feature. VocUI focuses on answering questions, not initiating outbound
                  conversations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  businesses that need a standalone AI chatbot trained on their own content, without
                  buying into an ecosystem.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  2. Tidio
                </h2>
                <p>
                  Tidio is arguably the most popular live chat tool for small businesses and
                  ecommerce. It combines a clean chat widget, a visual chatbot builder, and an AI
                  assistant (Lyro) in a package that&apos;s easy to set up and affordable. For businesses
                  switching from Freshchat, Tidio offers a simpler experience with less configuration.
                </p>
                <p className="mt-4">
                  Where Tidio shines is ecommerce. It has deep integrations with Shopify, WordPress,
                  and other platforms that small online stores use. The chatbot builder handles order
                  status inquiries, product recommendations, and cart abandonment flows without code.
                  Lyro adds AI-powered FAQ responses, though it&apos;s less capable than VocUI for
                  document-heavy knowledge bases. The main gaps are no Slack integration and limited
                  multi-channel deployment.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, visual chatbot builder, Lyro AI, visitor tracking, email marketing, and deep
                  ecommerce integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available. Paid plans from $29/month. Lyro AI is an add-on starting at $39/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Ecommerce
                  businesses and small companies that need affordable live chat with basic automation
                  and don&apos;t need deep AI.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  3. Crisp
                </h2>
                <p>
                  Crisp is a messaging platform that packs live chat, a shared inbox, a knowledge
                  base, and chatbot automation into one product. Its free plan is the most generous
                  on this list for live chat — two agent seats with unlimited conversation history,
                  no time limit.
                </p>
                <p className="mt-4">
                  For teams leaving Freshchat because of pricing confusion, Crisp&apos;s straightforward
                  tiers are refreshing. The free plan covers basic needs, the Pro plan ($25/month per
                  workspace) adds automation and the knowledge base, and the Unlimited plan
                  ($95/month) removes all limits. The chatbot is rule-based, not AI-driven, so it
                  handles routing and article suggestions well but won&apos;t generate answers from your
                  docs. See our{' '}
                  <Link href="/blog/zendesk-chat-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Zendesk Chat alternatives
                  </Link>{' '}
                  for more on Crisp.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, shared inbox, knowledge base, chatbot flows, CRM, campaign messaging, and
                  a generous free tier.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  for 2 agents. Pro at $25/month per workspace. Unlimited at $95/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  teams that want an all-in-one messaging platform with clear pricing and a strong
                  free plan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  4. Intercom
                </h2>
                <p>
                  Intercom is the premium option on this list. If you&apos;re leaving Freshchat because
                  you&apos;ve outgrown it and need a full customer communication platform, Intercom is the
                  upgrade path. It covers messaging, help desk, knowledge base, product tours,
                  campaigns, and an AI assistant (Fin) that resolves questions autonomously.
                </p>
                <p className="mt-4">
                  The trade-off is cost. Intercom starts at $74/month per seat and adds
                  per-resolution pricing for Fin. For a small team, the total cost can easily reach
                  $200-400/month. If your budget supports it and you need the full suite, Intercom
                  is hard to beat. If you just need a chatbot that answers questions from your
                  knowledge base, VocUI does that specific job for 80% less. See our{' '}
                  <Link href="/blog/intercom-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Intercom alternatives
                  </Link>{' '}
                  comparison for a deeper look.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  chatbot (Fin), shared inbox, help center, product tours, campaigns, Custom Bots,
                  and deep integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts at
                  $74/month per seat. Fin AI costs extra per resolution. No free plan.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Growing
                  teams that have outgrown Freshchat and need a full customer communication platform
                  with AI.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  5. LiveChat
                </h2>
                <p>
                  LiveChat is the purist&apos;s choice. It does live chat and does it well — no help
                  desk, no CRM, no email marketing bundled in. The agent interface is fast, the
                  widget is clean, and the reporting gives you clear visibility into chat volume,
                  response times, and satisfaction scores.
                </p>
                <p className="mt-4">
                  For teams that were using Freshchat primarily for live chat (not the AI or
                  automation features), LiveChat is a focused alternative. It integrates with
                  ChatBot (a sister product) for automation, but the core product is agent-centric.
                  Every conversation goes to a human. If you have dedicated support agents and want
                  the best possible live chat experience, LiveChat delivers. If you need AI to
                  handle conversations when agents aren&apos;t available, look at VocUI instead.
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
                  with dedicated support agents who want a polished, focused live chat experience
                  without bundled extras.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Side-by-side comparison
                </h2>

                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Comparison of Freshchat alternatives by features and pricing</caption>
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th scope="col" className="sticky left-0 z-10 bg-secondary-50 dark:bg-secondary-800/60 text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tool</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Starting price</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Standalone</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">AI chatbot</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Campaigns</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Integrations</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Free plan</th>
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
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.standaloneSetup} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.aiChatbot} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.campaignMessages} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.integrations} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.freePlan} /></td>
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
                  { title: 'If you need a standalone AI chatbot with knowledge base training:', description: 'VocUI is purpose-built for this \u2014 no ecosystem required.' },
                  { title: 'If you run an ecommerce store:', description: 'Tidio has the deepest Shopify and WordPress integrations.' },
                  { title: 'If you want the best free plan:', description: 'Crisp gives you two agents with unlimited chat history at no cost.' },
                  { title: 'If you\u2019ve outgrown Freshchat entirely:', description: 'Intercom is the full-platform upgrade, at a premium price.' },
                  { title: 'If you just need focused live chat:', description: 'LiveChat is the most polished agent-centric tool available.' },
                ]} />
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Can I migrate my Freshchat bot flows to another platform?',
                      a: "Freshchat bot flows aren't exportable. You'll need to recreate them in your new tool. AI-powered alternatives like VocUI don't use visual bot flows — the AI handles conversations based on your knowledge base content, which is often simpler to set up than rebuilding flows.",
                    },
                    {
                      q: 'What if I use Freshdesk alongside Freshchat?',
                      a: "If you use Freshdesk for ticketing, leaving Freshchat means losing the native chat-to-ticket integration. Consider whether you're ready to replace both products or just the chat component. VocUI and Crisp can work alongside Freshdesk via webhooks, but it won't be as seamless.",
                    },
                    {
                      q: 'Which Freshchat alternative has campaign messaging?',
                      a: "Tidio and Crisp both support proactive campaign messages to website visitors. Intercom has the most sophisticated campaign system (targeted messages, in-app tours, sequences). VocUI doesn't have campaign messaging — it focuses on responding to visitor questions rather than initiating outbound conversations.",
                    },
                    {
                      q: 'Is Freddy AI comparable to VocUI or Intercom Fin?',
                      a: "Freddy AI handles basic FAQ deflection and routing well but can't answer complex questions from your documents. VocUI's AI reads and understands your full knowledge base to generate contextual answers. Intercom Fin does the same with Intercom's help center content. Both go significantly deeper than Freddy.",
                    },
                    {
                      q: 'Can I use Freshchat without the rest of Freshworks?',
                      a: "Technically yes, but you lose most of the integration value. Ticket creation, CRM sync, and advanced analytics all require other Freshworks products. If you're not using the ecosystem, a standalone tool like VocUI, Tidio, or Crisp will give you a simpler, more focused experience.",
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
