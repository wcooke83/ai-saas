import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight, Check, X, BookOpen, CalendarCheck, Zap } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'VocUI vs Intercom: AI Chatbot Comparison for Small Business | VocUI',
    description:
      'Compare VocUI and Intercom for AI chatbot and customer support. VocUI trains on your own knowledge base, includes appointment booking, and starts free.',
    openGraph: {
      title: 'VocUI vs Intercom: AI Chatbot Comparison for Small Business | VocUI',
      description:
        'Compare VocUI and Intercom for AI chatbot and customer support. VocUI trains on your own knowledge base, includes appointment booking, and starts free.',
      url: 'https://vocui.com/vs-intercom',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'VocUI vs Intercom: AI Chatbot Comparison for Small Business | VocUI',
      description:
        'Compare VocUI and Intercom for AI chatbot and customer support. VocUI trains on your own knowledge base, includes appointment booking, and starts free.',
    },
    alternates: {
      canonical: 'https://vocui.com/vs-intercom',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'VocUI vs Intercom: AI Chatbot Comparison for Small Business',
  description:
    'Compare VocUI and Intercom for AI chatbot and customer support. VocUI trains on your own knowledge base, includes appointment booking, and starts free.',
  url: 'https://vocui.com/vs-intercom',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
      { '@type': 'ListItem', position: 2, name: 'VocUI vs Intercom', item: 'https://vocui.com/vs-intercom' },
    ],
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

type CellValue = '✅' | '❌' | string;

interface ComparisonRow {
  feature: string;
  vocui: CellValue;
  competitor: CellValue;
}

const comparisonRows: ComparisonRow[] = [
  { feature: 'Train on your own documents', vocui: '✅', competitor: 'Limited' },
  { feature: 'Train on URLs / website content', vocui: '✅', competitor: 'Limited' },
  { feature: 'PDF and DOCX upload', vocui: '✅', competitor: '❌' },
  { feature: 'Appointment booking in chat', vocui: '✅', competitor: '❌' },
  { feature: 'Free plan', vocui: '✅', competitor: '❌' },
  { feature: 'Live agent handoff', vocui: '✅', competitor: '✅' },
  { feature: 'Sentiment scoring', vocui: '✅', competitor: '✅' },
  { feature: 'Slack deployment', vocui: '✅', competitor: '✅' },
  { feature: 'Telegram deployment', vocui: '✅', competitor: '❌' },
  { feature: 'No credit card to start', vocui: '✅', competitor: '❌' },
  { feature: 'Setup time', vocui: 'Under 1 hour', competitor: 'Days to weeks' },
];

const advantages = [
  {
    icon: BookOpen,
    title: 'Train on your actual content',
    body: "Intercom's chatbot (Fin) is powered by a general AI model that you can configure, but VocUI is built from the ground up to train on YOUR documents, URLs, and FAQs. Your answers come from your knowledge — not a model's best guess.",
  },
  {
    icon: CalendarCheck,
    title: 'Appointment booking is built in',
    body: 'VocUI connects to your calendar and lets visitors check availability and book appointments directly in the chat window. Intercom has no equivalent feature — you would need to build a separate integration.',
  },
  {
    icon: Zap,
    title: 'Start free, scale when ready',
    body: "VocUI has a genuinely usable free plan. Intercom's entry pricing starts at $74/month with no free plan and requires a sales conversation at enterprise tiers.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CellIcon({ value }: { value: CellValue }) {
  if (value === '✅') return <Check className="h-5 w-5 text-green-500 mx-auto" aria-label="Yes" />;
  if (value === '❌') return <X className="h-5 w-5 text-red-400 mx-auto" aria-label="No" />;
  return <span className="text-secondary-700 dark:text-secondary-300 text-sm">{value}</span>;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VsIntercomPage() {
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
          <Badge className="mb-6">VocUI vs Intercom</Badge>

          <H1 className="max-w-4xl mb-6">
            Intercom is built for enterprise teams.{' '}
            <span className="text-primary-500">VocUI is built for businesses that want results without the complexity.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Both tools handle customer conversations. But VocUI trains on your own content, includes appointment
            booking, and doesn&apos;t require a sales call to get started.
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
            Free plan &middot; No credit card &middot; No sales call required
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
                    'You want a chatbot trained on your own docs, URLs, and PDFs',
                    'You need appointment booking built into the chat',
                    'You want a free plan with no credit card required',
                    "You're an SMB or growing team without a dedicated support ops team",
                    'You want to be live in under an hour',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Choose Intercom */}
              <div className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-secondary-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">Choose Intercom if...</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "You're an enterprise with a dedicated CX team",
                    'You need deep CRM integrations and a full helpdesk suite',
                    'You have budget for $74+/month',
                    'You need advanced workflow automation at scale',
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
              VocUI vs Intercom: feature by feature
            </h2>
          </div>

          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 dark:bg-secondary-800">
                  <th className="text-left px-6 py-4 font-semibold text-secondary-900 dark:text-secondary-100">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">VocUI</th>
                  <th className="text-center px-6 py-4 font-semibold text-secondary-600 dark:text-secondary-400">Intercom</th>
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
            Feature comparison based on publicly available information. Verify current Intercom capabilities at intercom.com.
          </p>
        </section>

        {/* ── VocUI Key Advantages ───────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Where VocUI wins</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                What VocUI does that Intercom doesn&apos;t
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
              VocUI vs Intercom: pricing
            </h2>
          </div>

          <div className="max-w-2xl mx-auto overflow-x-auto rounded-xl border border-secondary-200 dark:border-secondary-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 dark:bg-secondary-800">
                  <th className="text-left px-6 py-4 font-semibold text-secondary-900 dark:text-secondary-100" />
                  <th className="text-center px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">VocUI</th>
                  <th className="text-center px-6 py-4 font-semibold text-secondary-600 dark:text-secondary-400">Intercom</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Free plan', vocui: '✅ Free forever', competitor: '❌' },
                  { label: 'Entry paid plan', vocui: 'From $29/month', competitor: 'From $74/month' },
                  { label: 'No credit card to start', vocui: '✅', competitor: '❌' },
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

        {/* ── Final CTA ──────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                All the chatbot. None of the enterprise complexity.
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Build a chatbot trained on your own content, with appointment booking built in — and be live today.
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
                Free plan &middot; No credit card &middot; No sales call required
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
