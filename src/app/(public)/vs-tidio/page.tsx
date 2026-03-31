import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, Check, X, BookOpen, CalendarCheck, Radio } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'VocUI vs Tidio: AI Chatbot Builder Comparison | VocUI',
    description:
      'Compare VocUI and Tidio for AI chatbot building. VocUI trains on your own knowledge base and includes appointment booking. Tidio focuses on live chat and basic automation.',
    openGraph: {
      title: 'VocUI vs Tidio: AI Chatbot Builder Comparison | VocUI',
      description:
        'Compare VocUI and Tidio for AI chatbot building. VocUI trains on your own knowledge base and includes appointment booking. Tidio focuses on live chat and basic automation.',
      url: 'https://vocui.com/vs-tidio',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'VocUI vs Tidio: AI Chatbot Builder Comparison | VocUI',
      description:
        'Compare VocUI and Tidio for AI chatbot building. VocUI trains on your own knowledge base and includes appointment booking. Tidio focuses on live chat and basic automation.',
    },
    alternates: {
      canonical: 'https://vocui.com/vs-tidio',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const faqItems = [
  {
    question: 'Can I switch from Tidio to VocUI easily?',
    answer:
      'Yes. VocUI doesn\'t require importing data from Tidio. You upload your knowledge base content (URLs, PDFs, docs) directly and VocUI trains a new chatbot. Most teams switch and go live in under an hour.',
  },
  {
    question: 'How is VocUI\'s AI different from Tidio\'s?',
    answer:
      'Tidio uses template-based chatbot flows and a general-purpose AI. VocUI trains directly on your documents, URLs, and FAQs — so answers are grounded in your actual content, not generic responses.',
  },
  {
    question: 'Does VocUI support live chat?',
    answer:
      'Yes. VocUI includes live agent handoff so your team can jump into any conversation. The AI handles the majority of questions automatically, and your team only steps in when needed.',
  },
  {
    question: 'What\'s included in VocUI\'s free plan vs Tidio\'s?',
    answer:
      'VocUI\'s free plan includes document training, the embeddable widget, and sentiment scoring — no credit card required. Tidio\'s free plan is limited to basic live chat with a small number of conversations.',
  },
  {
    question: 'Can I use VocUI on multiple websites?',
    answer:
      'Yes. You can deploy VocUI chatbots across multiple websites, plus Slack and Telegram — all powered by the same knowledge base. Tidio is primarily a single-site live chat tool.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'VocUI vs Tidio: AI Chatbot Builder Comparison',
      description:
        'Compare VocUI and Tidio for AI chatbot building. VocUI trains on your own knowledge base and includes appointment booking. Tidio focuses on live chat and basic automation.',
      url: 'https://vocui.com/vs-tidio',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
          { '@type': 'ListItem', position: 2, name: 'VocUI vs Tidio', item: 'https://vocui.com/vs-tidio' },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

type CellValue = '✅' | '❌' | string;

interface ComparisonRow {
  feature: string;
  vocui: CellValue;
  competitor: CellValue;
}

const comparisonRows: ComparisonRow[] = [
  { feature: 'Train on your own documents', vocui: '✅', competitor: '❌' },
  { feature: 'Train on URLs / website content', vocui: '✅', competitor: '❌' },
  { feature: 'PDF and DOCX upload', vocui: '✅', competitor: '❌' },
  { feature: 'Appointment booking in chat', vocui: '✅', competitor: '❌' },
  { feature: 'Free plan', vocui: '✅', competitor: '✅' },
  { feature: 'Live agent handoff', vocui: '✅', competitor: '✅' },
  { feature: 'Sentiment scoring', vocui: '✅', competitor: 'Limited' },
  { feature: 'Slack deployment', vocui: '✅', competitor: '❌' },
  { feature: 'Telegram deployment', vocui: '✅', competitor: '❌' },
  { feature: 'Answers grounded in your content', vocui: '✅', competitor: '❌' },
  { feature: 'Multilingual support', vocui: '20+ languages', competitor: '✅' },
];

const advantages = [
  {
    icon: BookOpen,
    title: 'Knowledge-base-first AI',
    body: "Tidio's AI is a general-purpose chatbot that you configure with decision trees and templates. VocUI's AI is trained on your specific documents, URLs, and FAQs — so it answers questions your business can actually answer, not generic placeholders.",
  },
  {
    icon: CalendarCheck,
    title: 'Appointment booking in chat',
    body: 'VocUI lets visitors check availability and book appointments directly in the chat window. Tidio has no equivalent feature — scheduling requires a separate tool and integration work.',
  },
  {
    icon: Radio,
    title: 'Multi-channel: Slack + Telegram + website',
    body: 'VocUI deploys the same trained chatbot to your website widget, Slack workspace, and Telegram channel. Tidio is primarily a website live chat tool with limited channel options.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CellIcon({ value }: { value: CellValue }) {
  if (value === '✅') return <Check className="h-5 w-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (value === '❌') return <X className="h-5 w-5 text-red-400 mx-auto" aria-label="No" />;
  return <span className="text-secondary-700 dark:text-secondary-300 text-sm">{value}</span>;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VsTidioPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">VocUI vs Tidio</Badge>

          <H1 className="max-w-4xl mb-6">
            Both tools add chat to your website.{' '}
            <span className="text-primary-500">VocUI trains that chat on everything your business already knows.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Tidio is a solid live chat and basic chatbot tool. VocUI is a knowledge-base-first AI chatbot builder
            with appointment booking, sentiment scoring, and multi-channel deployment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Try VocUI Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Free plan &middot; No credit card &middot; Trained on your content
          </p>
        </section>

        {/* ── Quick Verdict ──────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Quick verdict</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Which tool is right for you?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Choose VocUI */}
              <div className="bg-white dark:bg-secondary-800 border-2 border-primary-200 dark:border-primary-700 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">Choose VocUI if...</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'You want a chatbot trained on your own docs and URLs',
                    'You need appointment booking built into the chat',
                    'You want AI answers grounded in your content (not generic responses)',
                    'You need Telegram deployment alongside website and Slack',
                    'You want performance telemetry and sentiment scoring',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Choose Tidio */}
              <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">Choose Tidio if...</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'You primarily want live chat with basic chatbot automation',
                    'You need Shopify-native integration with product card previews',
                    'You want a large library of pre-built chatbot templates',
                    'Your main use case is cart abandonment recovery for e-commerce',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-secondary-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Comparison Table ───────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Feature comparison</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              VocUI vs Tidio: feature by feature
            </h2>
          </div>

          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 dark:bg-secondary-800">
                  <th className="text-left px-6 py-4 font-semibold text-secondary-900 dark:text-secondary-100">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">VocUI</th>
                  <th className="text-center px-6 py-4 font-semibold text-secondary-600 dark:text-secondary-400">Tidio</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i % 2 === 0
                        ? 'bg-white dark:bg-secondary-900'
                        : 'bg-secondary-50/50 dark:bg-secondary-800/50'
                    }
                  >
                    <td className="px-6 py-4 text-secondary-700 dark:text-secondary-300">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <CellIcon value={row.vocui} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellIcon value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-secondary-400 dark:text-secondary-500 text-center mt-4 max-w-xl mx-auto">
            Feature comparison based on publicly available information. Verify current Tidio capabilities at tidio.com.
          </p>
        </section>

        {/* ── VocUI Key Advantages ───────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Key differences</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                What VocUI does that Tidio doesn&apos;t
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {advantages.map((adv) => {
                const Icon = adv.icon;
                return (
                  <div
                    key={adv.title}
                    className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4">
                      <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{adv.title}</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{adv.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pricing Comparison ─────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              VocUI vs Tidio: pricing
            </h2>
          </div>

          <div className="max-w-2xl mx-auto overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 dark:bg-secondary-800">
                  <th className="text-left px-6 py-4 font-semibold text-secondary-900 dark:text-secondary-100" />
                  <th className="text-center px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">VocUI</th>
                  <th className="text-center px-6 py-4 font-semibold text-secondary-600 dark:text-secondary-400">Tidio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Free plan', vocui: '✅ Free forever', competitor: '✅ Limited free plan' },
                  { label: 'Entry paid plan', vocui: 'From $29/month', competitor: 'From $29/month' },
                  { label: 'AI conversation limit', vocui: 'Included in plan', competitor: '50/month on Lyro AI' },
                  { label: 'Seats included', vocui: 'Unlimited', competitor: '3 on free (paid add-on)' },
                  { label: 'Contract required', vocui: 'Month-to-month', competitor: 'Month-to-month' },
                  { label: 'Document training', vocui: 'All paid plans', competitor: '❌ Not available' },
                ].map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 0
                        ? 'bg-white dark:bg-secondary-900'
                        : 'bg-secondary-50/50 dark:bg-secondary-800/50'
                    }
                  >
                    <td className="px-6 py-4 font-medium text-secondary-700 dark:text-secondary-300">{row.label}</td>
                    <td className="px-6 py-4 text-center">
                      <CellIcon value={row.vocui} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellIcon value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Frequently asked questions</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Thinking about switching from Tidio?
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Chat that knows your business, not just chat.
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Build a chatbot trained on your own content — with booking, sentiment scoring, and multi-channel deployment included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Try VocUI Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline-light" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              <p className="text-xs text-white/50 mt-6">
                Free plan &middot; No credit card &middot; Trained on your content
              </p>
            </div>
          </div>
        </section>

        {/* ── See Also ─────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 pb-20 text-center">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Also considering Intercom?{' '}
            <Link href="/vs-intercom" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Read our VocUI vs Intercom comparison
            </Link>
          </p>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
