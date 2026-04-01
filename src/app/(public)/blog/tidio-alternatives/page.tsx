import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { StyledBulletList } from '@/components/blog/styled-lists';
import { AuthorByline } from '@/components/blog/author-byline';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: '5 Tidio Alternatives for AI-Powered Customer Chat | VocUI',
  description:
    'Looking for a Tidio alternative? Compare five AI-powered chat platforms on pricing, knowledge base support, and ease of use for small businesses.',
  openGraph: {
    title: '5 Tidio Alternatives for AI-Powered Customer Chat | VocUI',
    description:
      'Looking for a Tidio alternative? Compare five AI-powered chat platforms on pricing, knowledge base support, and ease of use for small businesses.',
    url: 'https://vocui.com/blog/tidio-alternatives',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Tidio Alternatives for AI-Powered Customer Chat | VocUI',
    description:
      'Looking for a Tidio alternative? Compare five AI-powered chat platforms on pricing, knowledge base support, and ease of use for small businesses.',
  },
  alternates: { canonical: 'https://vocui.com/blog/tidio-alternatives' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '5 Tidio Alternatives for AI-Powered Customer Chat',
      description:
        'A comparison of five AI chat platforms for small businesses looking for a Tidio alternative.',
      url: 'https://vocui.com/blog/tidio-alternatives',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/tidio-alternatives',
      },
      datePublished: '2025-11-21',
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
        url: 'https://vocui.com/blog/tidio-alternatives/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I keep my Tidio chatbot flows when switching?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "No. Tidio\u2019s visual flows aren\u2019t exportable to other platforms. However, AI-powered alternatives like VocUI don\u2019t use flow-based logic \u2014 you train on your content and the AI handles conversation routing automatically, so you don\u2019t need to rebuild flows.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does any Tidio alternative match its Shopify integration?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Tidio\u2019s Shopify integration is best-in-class for small ecommerce. Crisp and Freshchat also have Shopify plugins but with fewer features. VocUI integrates via embed widget on any platform but doesn\u2019t have native Shopify order lookup.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is Tidio Lyro worth the extra cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Lyro ($39/month add-on) handles basic FAQ responses well but struggles with complex, document-heavy knowledge bases. If your needs are simple FAQs, it\u2019s decent. If you need deep knowledge base answers, VocUI or Chatbase offer more capable AI at a similar or lower price.",
          },
        },
        {
          '@type': 'Question',
          name: 'Which Tidio alternative has the best mobile experience?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Crisp and Freshchat both have polished mobile apps for agent responses. Intercom has the most full-featured mobile experience. VocUI currently works through a responsive web dashboard rather than a native app.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use a Tidio alternative for both live chat and AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "VocUI combines AI chatbot answers with live agent handoff in one product \u2014 AI handles what it can, and hands off to humans when it can\u2019t. Intercom does this too but at a much higher price. Crisp handles live chat well but its AI is rule-based, not generative.",
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
          name: '5 Tidio Alternatives for AI-Powered Customer Chat',
          item: 'https://vocui.com/blog/tidio-alternatives',
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
  freePlanLimits: string;
  liveChat: SupportLevel;
  aiChatbot: SupportLevel;
  ecommerceIntegrations: SupportLevel;
  mobileApp: SupportLevel;
}

const comparisonData: ToolRow[] = [
  {
    tool: 'VocUI',
    startingPrice: 'Free / $29+',
    freePlanLimits: '50 msgs/mo',
    liveChat: 'yes',
    aiChatbot: 'yes',
    ecommerceIntegrations: 'partial',
    mobileApp: 'no',
  },
  {
    tool: 'Intercom',
    startingPrice: '$74+',
    freePlanLimits: 'No free plan',
    liveChat: 'yes',
    aiChatbot: 'yes',
    ecommerceIntegrations: 'yes',
    mobileApp: 'yes',
  },
  {
    tool: 'Crisp',
    startingPrice: 'Free / $25+',
    freePlanLimits: '2 agents',
    liveChat: 'yes',
    aiChatbot: 'partial',
    ecommerceIntegrations: 'partial',
    mobileApp: 'yes',
  },
  {
    tool: 'Freshchat',
    startingPrice: 'Free / $19+',
    freePlanLimits: '100 agents',
    liveChat: 'yes',
    aiChatbot: 'partial',
    ecommerceIntegrations: 'partial',
    mobileApp: 'yes',
  },
  {
    tool: 'Chatbase',
    startingPrice: 'Free / $19+',
    freePlanLimits: '20 msgs/mo',
    liveChat: 'no',
    aiChatbot: 'yes',
    ecommerceIntegrations: 'no',
    mobileApp: 'no',
  },
];

function SupportIcon({ level }: { level: SupportLevel }) {
  if (level === 'yes') return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (level === 'no') return <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />;
  return <MinusCircle className="w-5 h-5 text-amber-400 mx-auto" aria-label="Partial" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TidioAlternativesPage() {
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
                5 Tidio Alternatives
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Comparison
                </span>
                <time dateTime="2025-11-21" className="text-xs text-secondary-400 dark:text-secondary-500">Nov 21, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">10 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                5 Tidio Alternatives for AI-Powered Customer Chat
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Tidio is a solid live chat tool with growing AI features. But if you need deeper
                knowledge base training, Slack deployment, or more flexible pricing, these five
                alternatives are worth a close look.
              </p>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 font-medium">
                The top Tidio alternatives for small business chat are VocUI, Intercom, Crisp,
                Freshchat, and Chatbase. Each excels in a different area — from AI knowledge base
                depth to ecommerce integrations to free plan generosity.
              </p>
            </div>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 italic mb-8">
              Disclosure: VocUI is our product. We&apos;ve aimed to be fair in this comparison, but we recommend trying any tool yourself before committing. All pricing and feature information was accurate at time of writing.
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What Tidio does well — and where it falls short
                </h2>
                <p>
                  Tidio deserves credit for making live chat genuinely accessible to small businesses.
                  The widget looks good, the free plan is functional, the Shopify and WordPress
                  integrations are among the best in the category, and the mobile app lets you reply
                  to customers on the go. For ecommerce businesses that need chat with some automation,
                  Tidio is a strong choice.
                </p>
                <p className="mt-4">
                  But Tidio&apos;s strengths are also its boundaries. Here&apos;s where businesses typically
                  start looking elsewhere:
                </p>
                <StyledBulletList items={[
                  { title: 'AI is an add-on, not the core.', description: 'Tidio\u2019s AI assistant (Lyro) costs extra and works best for simple FAQ-style responses. If you need a chatbot that can answer complex questions from your docs, you\u2019ll hit a ceiling quickly.' },
                  { title: 'No Slack deployment.', description: 'Tidio is built for website chat. If you want your chatbot available inside Slack for internal team use, you need a different tool entirely.' },
                  { title: 'Pricing jumps with AI.', description: 'The $29/month starting price doesn\u2019t include Lyro. Add that at $39/month and you\u2019re suddenly at $68+/month \u2014 more than some full-featured alternatives.' },
                  { title: 'Limited document training.', description: 'You can\u2019t train Tidio on PDFs, DOCX files, or large knowledge bases the way you can with purpose-built AI chatbot platforms.' },
                ]} />
                <p className="mt-4">
                  None of these are dealbreakers for everyone. If Tidio covers your needs, stick with
                  it — especially if you rely on its mobile app or ecommerce integrations. But if any
                  of these gaps matter, here are five alternatives worth evaluating.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  1. VocUI
                </h2>
                <p>
                  VocUI is an AI chatbot platform built for small businesses that want to train a
                  chatbot on their own content and deploy it anywhere — website, Slack, or Telegram.
                  Unlike Tidio, AI isn&apos;t an add-on. It&apos;s the core of the product.
                </p>
                <p className="mt-4">
                  You upload your knowledge base (URLs, PDFs, DOCX files, or Q&amp;A pairs), and VocUI
                  trains an AI chatbot that answers questions using only your content. The setup takes
                  minutes, not hours. There&apos;s no flow builder to wrestle with because the AI handles
                  conversational logic automatically based on what it knows.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Knowledge
                  base training from multiple source types, embeddable widget with custom branding,
                  native Slack integration, Telegram bot support, lead capture, live agent handoff,
                  and conversation analytics.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available with limited messages. Paid plans start at $29/month with AI included — no
                  surprise add-ons. See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>{' '}
                  for details.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Where VocUI falls short:</strong> VocUI
                  doesn&apos;t have a dedicated mobile app for agent responses — you use the web
                  dashboard. If replying to customers from your phone is critical, Tidio&apos;s mobile
                  app is genuinely better. VocUI also has fewer ecommerce-specific integrations
                  (no native Shopify order lookup or cart abandonment flows).
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  businesses that want an AI chatbot trained on their own docs, deployed on their
                  website and in Slack, without paying for features they don&apos;t need.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  2. Intercom
                </h2>
                <p>
                  Intercom is the enterprise standard for customer messaging. Its AI assistant, Fin,
                  can answer questions from your Intercom Articles knowledge base and hand off to human
                  agents seamlessly. The product is polished, the integrations are deep, and the
                  reporting is best-in-class.
                </p>
                <p className="mt-4">
                  The catch is cost. Intercom starts at $74/month for the base plan, and Fin adds
                  per-resolution pricing on top. A small business handling 500 AI resolutions per
                  month could easily spend $150+ before adding seats for agents. For companies that
                  need the full suite — help desk, knowledge base, product tours, in-app messaging —
                  it&apos;s worth the investment. For everyone else, it&apos;s overkill.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> AI
                  chatbot (Fin), help desk, knowledge base articles, product tours, in-app messaging,
                  robust reporting, and hundreds of integrations.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Starts at
                  $74/month. Fin AI costs extra per resolution. No free plan. See our{' '}
                  <Link href="/blog/intercom-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Intercom alternatives
                  </Link>{' '}
                  comparison for more detail.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Mid-market
                  and enterprise teams that need a full customer communication platform, not just a
                  chatbot.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  3. Crisp
                </h2>
                <p>
                  Crisp is an all-in-one messaging platform that includes live chat, a shared inbox,
                  a knowledge base, and chatbot automation. It has a generous free plan that covers
                  two agent seats with basic chat — making it one of the most accessible starting
                  points for small businesses.
                </p>
                <p className="mt-4">
                  Where Crisp falls short is AI depth. Its chatbot builder is rule-based, not AI-driven.
                  You can set up automated flows and connect a knowledge base for suggested articles,
                  but it won&apos;t generate natural-language answers from your content the way VocUI or
                  Chatbase does. If your primary need is live chat with some automation, Crisp is
                  excellent. If you want a chatbot that actually reads and answers from your docs,
                  you&apos;ll hit a ceiling.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, shared inbox, knowledge base (article suggestions), chatbot flows, campaign
                  messaging, and a CRM.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  for 2 agents. Paid plans start at $25/month per workspace. AI features are limited
                  to higher tiers.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small
                  teams that need live chat and a shared inbox at a low price, and don&apos;t require
                  deep AI knowledge base capabilities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  4. Freshchat
                </h2>
                <p>
                  Freshchat is the messaging product in the Freshworks suite, sitting alongside
                  Freshdesk, Freshsales, and FreshCRM. If your business already runs on Freshworks,
                  Freshchat is the natural chat solution — it shares data, contacts, and workflows
                  across the suite without third-party connectors.
                </p>
                <p className="mt-4">
                  As a standalone product, Freshchat is decent but unremarkable. The AI chatbot
                  (Freddy) can handle basic deflection and FAQ responses, but it doesn&apos;t match the
                  knowledge base depth of VocUI or Chatbase. The free plan is limited to 100 agents
                  but restricts bot sessions. Paid plans unlock more AI features, though the pricing
                  structure can be confusing.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Live
                  chat, Freddy AI bot, campaign messaging, Freshworks ecosystem integration, and
                  multi-channel support (web, mobile, WhatsApp).
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available (limited bots). Paid plans start at $19/month per agent. AI features
                  require higher tiers.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Teams
                  already using the Freshworks ecosystem that want chat tightly integrated with their
                  existing help desk and CRM.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  5. Chatbase
                </h2>
                <p>
                  Chatbase is one of the original &quot;train a chatbot on your data&quot; tools. It was among
                  the first to make knowledge base chatbots accessible to non-developers, and it
                  still does that well. You upload your content, get a chatbot, and embed it on your
                  site within minutes.
                </p>
                <p className="mt-4">
                  The limitations are in deployment and integrations. Chatbase is primarily a website
                  embed tool. Slack integration exists but is limited to higher plans. There&apos;s no
                  native live agent handoff, and the customization options are narrower than VocUI.
                  See our{' '}
                  <Link href="/blog/chatbase-alternatives" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Chatbase alternatives
                  </Link>{' '}
                  comparison for a deeper look.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Key features:</strong> Knowledge
                  base training (URLs, PDFs, text), embeddable widget, API access, and basic
                  analytics.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan
                  available (very limited). Paid plans start at $19/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Users who
                  want a simple, focused knowledge base chatbot for their website and don&apos;t need
                  multi-channel deployment or live chat features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Side-by-side comparison
                </h2>

                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Comparison of Tidio alternatives by features and pricing</caption>
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th scope="col" className="sticky left-0 z-10 bg-secondary-50 dark:bg-secondary-800/60 text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tool</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Starting price</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Free plan limits</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Live chat</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">AI chatbot</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Ecommerce</th>
                        <th scope="col" className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Mobile app</th>
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
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{row.freePlanLimits}</td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.liveChat} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.aiChatbot} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.ecommerceIntegrations} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.mobileApp} /></td>
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
                  { title: 'If you need AI-powered answers from your own content:', description: 'VocUI is the strongest option \u2014 knowledge base training is the core product, not an afterthought.' },
                  { title: 'If you need a full customer communication suite:', description: 'Intercom has the deepest feature set, but expect to pay for it.' },
                  { title: 'If you need free live chat with basic automation:', description: 'Crisp\u2019s free plan is hard to beat for simple use cases.' },
                  { title: 'If you\u2019re already on Freshworks:', description: 'Freshchat integrates natively with the rest of the suite.' },
                  { title: 'If you want a simple embed-only AI chatbot:', description: 'Chatbase is focused and easy to set up.' },
                ]} />
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Can I keep my Tidio chatbot flows when switching?',
                      a: "No. Tidio's visual flows aren't exportable to other platforms. However, AI-powered alternatives like VocUI don't use flow-based logic — you train on your content and the AI handles conversation routing automatically, so you don't need to rebuild flows.",
                    },
                    {
                      q: 'Does any Tidio alternative match its Shopify integration?',
                      a: "Tidio's Shopify integration is best-in-class for small ecommerce. Crisp and Freshchat also have Shopify plugins but with fewer features. VocUI integrates via embed widget on any platform but doesn't have native Shopify order lookup.",
                    },
                    {
                      q: 'Is Tidio Lyro worth the extra cost?',
                      a: "Lyro ($39/month add-on) handles basic FAQ responses well but struggles with complex, document-heavy knowledge bases. If your needs are simple FAQs, it's decent. If you need deep knowledge base answers, VocUI or Chatbase offer more capable AI at a similar or lower price.",
                    },
                    {
                      q: 'Which Tidio alternative has the best mobile experience?',
                      a: 'Crisp and Freshchat both have polished mobile apps for agent responses. Intercom has the most full-featured mobile experience. VocUI currently works through a responsive web dashboard rather than a native app.',
                    },
                    {
                      q: 'Can I use a Tidio alternative for both live chat and AI?',
                      a: "VocUI combines AI chatbot answers with live agent handoff in one product — AI handles what it can, and hands off to humans when it can't. Intercom does this too but at a much higher price. Crisp handles live chat well but its AI is rule-based, not generative.",
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
