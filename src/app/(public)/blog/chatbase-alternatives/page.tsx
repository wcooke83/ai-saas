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
  title: '5 Chatbase Alternatives Worth Trying in 2025 | VocUI',
  description:
    'Looking for a Chatbase alternative? Compare the top AI chatbot builders on pricing, knowledge base support, Slack integration, and embed options.',
  openGraph: {
    title: '5 Chatbase Alternatives Worth Trying in 2025 | VocUI',
    description:
      'Looking for a Chatbase alternative? Compare the top AI chatbot builders on pricing, knowledge base support, Slack integration, and embed options.',
    url: 'https://vocui.com/blog/chatbase-alternatives',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Chatbase Alternatives Worth Trying in 2025 | VocUI',
    description:
      'Looking for a Chatbase alternative? Compare the top AI chatbot builders on pricing, knowledge base support, Slack integration, and embed options.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbase-alternatives' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '5 Chatbase Alternatives Worth Trying in 2025',
      description:
        'A comparison of the top AI chatbot builders for small businesses looking for a Chatbase alternative.',
      url: 'https://vocui.com/blog/chatbase-alternatives',
      datePublished: '2025-03-31',
      dateModified: '2025-03-31',
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
      '@type': 'ItemList',
      name: '5 Chatbase Alternatives',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'VocUI', url: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Botpress', url: 'https://botpress.com' },
        { '@type': 'ListItem', position: 3, name: 'Tidio', url: 'https://tidio.com' },
        { '@type': 'ListItem', position: 4, name: 'Intercom Fin', url: 'https://intercom.com' },
        { '@type': 'ListItem', position: 5, name: 'CustomGPT.ai', url: 'https://customgpt.ai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Chatbase free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Chatbase has a free tier, but it's very limited \u2014 a small number of messages per month and one chatbot. Most real use cases require a paid plan.",
          },
        },
        {
          '@type': 'Question',
          name: 'Can I migrate my Chatbase knowledge base to another tool?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Most tools accept the same source formats (URLs, PDFs, text). You'll need to re-add your sources, but there's no proprietary format that would trap you in Chatbase.",
          },
        },
        {
          '@type': 'Question',
          name: 'Which Chatbase alternative is best for Slack?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VocUI and Botpress both have genuine Slack integration. VocUI is easier to set up for non-developers. Botpress offers more customization.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does VocUI work for non-English content?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. VocUI supports 20+ languages. You can train the knowledge base in any language and the chatbot will respond in the language the visitor is writing in.',
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
  knowledgeBaseTraining: SupportLevel;
  aiModelChoice: SupportLevel;
  customBranding: SupportLevel;
  analyticsDashboard: SupportLevel;
  apiAccess: SupportLevel;
}

const comparisonData: ToolRow[] = [
  {
    tool: 'VocUI',
    startingPrice: 'Free / $29+',
    knowledgeBaseTraining: 'yes',
    aiModelChoice: 'yes',
    customBranding: 'yes',
    analyticsDashboard: 'yes',
    apiAccess: 'yes',
  },
  {
    tool: 'Botpress',
    startingPrice: 'Free / $89+',
    knowledgeBaseTraining: 'yes',
    aiModelChoice: 'partial',
    customBranding: 'yes',
    analyticsDashboard: 'yes',
    apiAccess: 'yes',
  },
  {
    tool: 'Tidio',
    startingPrice: 'Free / $29+',
    knowledgeBaseTraining: 'partial',
    aiModelChoice: 'no',
    customBranding: 'yes',
    analyticsDashboard: 'yes',
    apiAccess: 'partial',
  },
  {
    tool: 'Intercom Fin',
    startingPrice: '$74+',
    knowledgeBaseTraining: 'yes',
    aiModelChoice: 'no',
    customBranding: 'yes',
    analyticsDashboard: 'yes',
    apiAccess: 'yes',
  },
  {
    tool: 'CustomGPT.ai',
    startingPrice: '$49+',
    knowledgeBaseTraining: 'yes',
    aiModelChoice: 'partial',
    customBranding: 'partial',
    analyticsDashboard: 'partial',
    apiAccess: 'yes',
  },
];

function SupportIcon({ level }: { level: SupportLevel }) {
  if (level === 'yes') return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (level === 'no') return <XCircle className="w-5 h-5 text-red-400 mx-auto" aria-label="No" />;
  return <MinusCircle className="w-5 h-5 text-amber-400 mx-auto" aria-label="Partial" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbaseAlternativesPage() {
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
                5 Chatbase Alternatives
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
                <span className="text-xs text-secondary-400 dark:text-secondary-500">11 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                5 Chatbase Alternatives Worth Trying in 2025
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Chatbase was one of the first tools to make &quot;train a chatbot on your own data&quot;
                accessible for non-developers. But it&apos;s not the only option — and for many use
                cases, it&apos;s not the best one either. Here&apos;s how the top alternatives stack up.
              </p>
            </header>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 italic mb-8">
              Disclosure: VocUI is our product. We&apos;ve aimed to be fair in this comparison, but we recommend trying any tool yourself before committing. All pricing and feature information was accurate at time of writing.
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why people look for Chatbase alternatives
                </h2>
                <p>
                  Chatbase is genuinely useful for getting a chatbot up fast. But users frequently
                  cite a few frustrations that push them to look elsewhere:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Limited integrations.</strong> Chatbase embeds on websites, but
                    Slack integration, Telegram, and native API access are either limited or
                    require higher-tier plans.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">No live agent handoff.</strong> When the bot can&apos;t help, there&apos;s
                    no native way to transfer the conversation to a human agent.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Pricing scales steeply.</strong> The free tier is very limited and
                    the jump to paid is significant if you have high chat volume.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">No lead capture.</strong> You can&apos;t collect visitor contact
                    information from within the chatbot without a third-party form tool.
                  </li>
                </ul>
                <p className="mt-4">
                  These aren&apos;t fatal flaws — they just mean Chatbase isn&apos;t a fit for everyone.
                  Depending on what you need, one of the alternatives below might be a better match.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How we compared these tools
                </h2>
                <p>
                  Since Chatbase is primarily a knowledge-base chatbot builder, we focused on the
                  criteria that matter most when comparing tools in this specific category:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li><strong className="text-secondary-800 dark:text-secondary-200">Knowledge base training</strong> — how deep and flexible is the content ingestion?</li>
                  <li><strong className="text-secondary-800 dark:text-secondary-200">AI model choice</strong> — can you select which AI model powers responses?</li>
                  <li><strong className="text-secondary-800 dark:text-secondary-200">Custom branding</strong> — can you make the widget match your brand?</li>
                  <li><strong className="text-secondary-800 dark:text-secondary-200">Analytics dashboard</strong> — can you see what questions users ask and how the bot performs?</li>
                  <li><strong className="text-secondary-800 dark:text-secondary-200">API access</strong> — can you integrate the chatbot into your own applications programmatically?</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  1. VocUI
                </h2>
                <p>
                  VocUI is built specifically for small businesses that want to train a chatbot on
                  their own content and deploy it across multiple channels — without needing a
                  developer. It&apos;s the most direct Chatbase alternative for businesses that want
                  more than just a website widget.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Knowledge base:</strong> Yes. Train on URLs, PDFs, DOCX files, and
                  Q&amp;A pairs. You can add multiple sources and update them individually without
                  retraining everything.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Slack integration:</strong> Yes. Deploy your chatbot as a Slack bot
                  in your workspace — useful for internal knowledge bases and team support. See our{' '}
                  <Link href="/slack-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Slack chatbot guide
                  </Link>{' '}
                  for setup details.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Embed widget:</strong> Yes. One script tag, fully customizable colors
                  and branding, works on any website platform.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Live agent handoff:</strong> Yes, with an embeddable agent console.
                  When a conversation needs a human, agents can take over instantly without
                  logging into a separate platform.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free plan available. Paid plans from $29/month.
                  See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>{' '}
                  for full details.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Where VocUI falls short:</strong> VocUI
                  doesn&apos;t have a visual conversation flow builder. If you need complex branching
                  logic or multi-step workflows beyond what AI handles naturally, Botpress gives
                  you more control. VocUI also has fewer third-party integrations than Chatbase&apos;s
                  higher-tier plans.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Small businesses that need a knowledge base
                  chatbot for customer support, lead capture, or internal use — and want it to
                  work on both their website and in Slack without stitching tools together.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  2. Botpress
                </h2>
                <p>
                  Botpress is an open-source chatbot platform that has added a cloud-hosted option
                  with AI capabilities. It&apos;s more powerful than Chatbase for complex conversational
                  flows — but that power comes with complexity.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Knowledge base:</strong> Yes, through its &quot;Knowledge Base&quot; module.
                  You can add URLs and documents. The implementation is solid but the interface is
                  more technical than VocUI or Chatbase.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Slack integration:</strong> Yes, with good documentation.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Setup complexity:</strong> Moderate. Botpress is not really a
                  no-code tool — it has a visual flow editor that requires some logic thinking.
                  Fine for technical founders, potentially frustrating for non-developers.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free tier available. Paid plans start around
                  $89/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Teams with some technical capability who need
                  complex conversation flows and more customization than Chatbase offers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  3. Tidio
                </h2>
                <p>
                  Tidio started as a live chat tool and has expanded into AI automation. It&apos;s a
                  strong choice if your primary need is live chat with AI augmentation — but it&apos;s
                  less focused on knowledge-base-driven chatbots than the other tools on this list.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Knowledge base:</strong> Partial. Tidio&apos;s AI can use a basic
                  knowledge base, but it&apos;s not as capable as VocUI or Chatbase for document-heavy
                  use cases. It works well for simple FAQs.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Slack integration:</strong> No native Slack deployment for the chatbot.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Live agent handoff:</strong> Excellent. This is Tidio&apos;s strength —
                  the transition between bot and human is seamless, and the agent interface is
                  polished.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Free tier available. Paid plans start around
                  $29/month, but the AI features require add-ons. Compare with{' '}
                  <Link href="/vs-tidio" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI vs Tidio
                  </Link>{' '}
                  for a full breakdown.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> E-commerce businesses that primarily need live
                  chat with some AI automation, and don&apos;t need deep knowledge base functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  4. Intercom Fin
                </h2>
                <p>
                  Intercom Fin is Intercom&apos;s AI-powered chatbot that sits on top of your Intercom
                  knowledge base. It&apos;s the most polished product on this list — but also by far the
                  most expensive, and it only makes sense if you&apos;re already using (or planning to
                  use) the full Intercom suite.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Knowledge base:</strong> Yes. Fin answers from your Intercom Articles
                  knowledge base. If you&apos;re already publishing help docs in Intercom, this is
                  seamless.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Live agent handoff:</strong> Excellent — Intercom is the gold standard
                  here.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> Intercom starts at $74/month and scales steeply.
                  Fin adds per-resolution pricing on top of that. See{' '}
                  <Link href="/vs-intercom" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI vs Intercom
                  </Link>{' '}
                  for a direct comparison.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Mid-market and enterprise companies already on
                  Intercom who want AI deflection without switching platforms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  5. CustomGPT.ai
                </h2>
                <p>
                  CustomGPT.ai is a focused knowledge-base chatbot tool similar to Chatbase. It&apos;s
                  easy to set up, supports a good range of document types, and produces accurate
                  answers. The main limitation is deployment: it&apos;s primarily an embed widget tool
                  with no Slack integration and no live agent handoff.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Knowledge base:</strong> Strong. Supports URLs, PDFs, YouTube videos,
                  XML sitemaps, and more.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Slack integration:</strong> No.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Live agent handoff:</strong> No. When the chatbot hits its limits,
                  there&apos;s no built-in escalation path.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Pricing:</strong> No free plan. Paid plans start at $49/month.
                </p>
                <p className="mt-4">
                  <strong className="text-secondary-800 dark:text-secondary-200">Best for:</strong> Users who primarily need an embed widget with
                  strong document ingestion and don&apos;t need multi-channel deployment or live agent
                  features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Side-by-side comparison
                </h2>

                {/* Comparison table */}
                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Tool</th>
                        <th className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Starting price</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">KB training</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Model choice</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Branding</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Analytics</th>
                        <th className="text-center px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">API access</th>
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
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.knowledgeBaseTraining} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.aiModelChoice} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.customBranding} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.analyticsDashboard} /></td>
                          <td className="px-4 py-3 text-center"><SupportIcon level={row.apiAccess} /></td>
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
                <p>
                  The &quot;best&quot; Chatbase alternative depends entirely on what you actually need.
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you need a knowledge base chatbot for your website and Slack:</strong>{' '}
                    VocUI is the most direct match — it does both well without requiring you to
                    stitch tools together.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you need complex conversation flows and have technical help:</strong>{' '}
                    Botpress gives you the most flexibility.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If live chat is more important than AI knowledge base answers:</strong>{' '}
                    Tidio is the best live chat experience at an accessible price.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you&apos;re already deep in the Intercom ecosystem:</strong>{' '}
                    Fin is the path of least resistance, even if it&apos;s expensive.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">If you just need a simple embed with good document support and no
                    live agent requirements:</strong>{' '}
                    CustomGPT.ai is a clean, focused option.
                  </li>
                </ul>
                <p className="mt-4">
                  If you&apos;re not sure, the best approach is to start with something free, run a quick
                  test with your own content, and see if the answers are good enough for your use
                  case. VocUI&apos;s free plan lets you do exactly that — train on a few sources and test
                  without putting a credit card in.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Is Chatbase free?',
                      a: "Chatbase has a free tier, but it's very limited — a small number of messages per month and one chatbot. Most real use cases require a paid plan.",
                    },
                    {
                      q: 'Can I migrate my Chatbase knowledge base to another tool?',
                      a: "Most tools accept the same source formats (URLs, PDFs, text). You'll need to re-add your sources, but there's no proprietary format that would trap you in Chatbase.",
                    },
                    {
                      q: 'Which Chatbase alternative is best for Slack?',
                      a: 'VocUI and Botpress both have genuine Slack integration. VocUI is easier to set up for non-developers. Botpress offers more customization.',
                    },
                    {
                      q: 'Does VocUI work for non-English content?',
                      a: 'Yes. VocUI supports 20+ languages. You can train the knowledge base in any language and the chatbot will respond in the language the visitor is writing in.',
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
