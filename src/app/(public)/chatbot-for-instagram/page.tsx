import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1 } from '@/components/ui/heading';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  Zap,
  FileText,
  RefreshCw,
  ShoppingBag,
  Headphones,
  Star,
  TrendingUp,
  Moon,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'Instagram DM Chatbot | VocUI',
    description:
      'Turn Instagram DMs into instant support. Connect VocUI to your Instagram Professional account and auto-reply to every message with answers from your knowledge base.',
    keywords: [
      'Instagram DM chatbot',
      'automate Instagram DMs',
      'Instagram AI chatbot',
      'Instagram Messenger bot',
      'Instagram auto-reply AI',
      'Instagram support automation',
    ],
    openGraph: {
      title: 'Instagram DM Chatbot | VocUI',
      description:
        'Turn Instagram DMs into instant support. Connect VocUI to your Instagram Professional account and auto-reply to every message with answers from your knowledge base.',
      url: 'https://vocui.com/chatbot-for-instagram',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Instagram DM Chatbot | VocUI',
      description:
        'Turn Instagram DMs into instant support. Connect VocUI to your Instagram Professional account and auto-reply to every message with answers from your knowledge base.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-instagram',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const faqItems = [
  {
    question: 'Does VocUI work with personal Instagram accounts?',
    answer:
      'No. Instagram\'s Messaging API is only available to Professional accounts (Business or Creator). You\'ll need an Instagram Professional account linked to a Facebook Page to connect VocUI.',
  },
  {
    question: 'Will the bot reply to story replies and comment DMs?',
    answer:
      'Yes. VocUI handles DMs triggered by story replies and reactions in the same way it handles direct messages — with answers sourced from your knowledge base.',
  },
  {
    question: 'Can I keep the bot\'s replies on-brand?',
    answer:
      'Yes. When you build your knowledge base, you can include tone and voice guidelines alongside your content. The AI uses those to frame responses consistently with your brand personality.',
  },
  {
    question: 'What if a customer asks something outside my knowledge base?',
    answer:
      'VocUI is designed to answer from what you\'ve trained it on. If a question falls outside your knowledge base, it gives a polite fallback response and can be configured to trigger human handoff.',
  },
  {
    question: 'Can I use this alongside my website chatbot?',
    answer:
      'Yes. One knowledge base powers all your VocUI channels — Instagram DMs, your website widget, Facebook Messenger, and more. Train once, deploy across every channel you use.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'VocUI Instagram DM Chatbot',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Turn Instagram DMs into instant support. Connect VocUI to your Instagram Professional account and auto-reply to every message with answers from your knowledge base.',
      url: 'https://vocui.com/chatbot-for-instagram',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan available',
      },
      featureList: [
        'Instagram Messaging API integration',
        'Knowledge base powered replies',
        'Story reply handling',
        '24/7 automated responses',
        'Consistent brand voice',
        'Multi-channel: Instagram + website + Messenger',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Never miss a DM — replies fire within seconds',
  'Consistent brand voice, every message',
  'Works while you sleep — literally',
  'Same knowledge base as your website chatbot',
];

const painPoints = [
  {
    icon: Clock,
    title: 'DMs roll in faster than you can reply',
    body: 'A single viral post or well-targeted ad can flood your DMs in hours. Without automation, your response time tanks, followers get frustrated, and you lose the sales window before it closes.',
  },
  {
    icon: MessageSquare,
    title: '"How much does it cost?" — for the 40th time today',
    body: 'Most Instagram DMs ask the same questions: pricing, availability, shipping, how to book. Your team writes the same answers by hand, over and over, instead of doing higher-value work.',
  },
  {
    icon: Moon,
    title: 'Your audience is global. Your team is not.',
    body: 'Instagram has no concept of business hours. Followers in different time zones send DMs at all hours. Without automated replies, the only way to stay responsive is to never log off.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Connect your Instagram Professional account',
    description:
      'Authorize VocUI via your Instagram Professional account linked to a Facebook Page. The Messaging API connection takes under two minutes.',
  },
  {
    step: '02',
    title: 'Train on your content',
    description:
      'Add your product details, pricing, FAQs, and brand voice guidelines. VocUI indexes everything into a searchable knowledge base.',
  },
  {
    step: '03',
    title: 'Respond automatically',
    description:
      'Every incoming DM — including story replies — gets an instant, on-brand response sourced directly from your knowledge base.',
  },
];

const features = [
  {
    icon: Zap,
    name: 'Instant replies, around the clock',
    description:
      'VocUI responds to every Instagram DM the moment it arrives. No delays, no queues, no out-of-office messages.',
  },
  {
    icon: Star,
    name: 'Consistent brand voice',
    description:
      'Train the bot on your tone of voice guidelines alongside your content. Every reply sounds like your brand — not a generic AI.',
  },
  {
    icon: FileText,
    name: 'Knowledge base powered',
    description:
      'Answers come from your actual content: product pages, pricing sheets, FAQs, and policies. No hallucinations, no guesses.',
  },
  {
    icon: MessageSquare,
    name: 'Story reply handling',
    description:
      'When someone replies to your Instagram story, VocUI picks it up and responds just like a standard DM — with a relevant, helpful answer.',
  },
  {
    icon: RefreshCw,
    name: 'Always up to date',
    description:
      'Update your knowledge base whenever your offers, prices, or products change. Replies reflect your latest content immediately.',
  },
  {
    icon: TrendingUp,
    name: 'Multi-channel, one knowledge base',
    description:
      'Instagram DMs, Facebook Messenger, your website widget — all powered by the same trained knowledge base. No duplicate effort.',
  },
];

const useCases = [
  {
    icon: ShoppingBag,
    title: 'Fashion & beauty brands',
    description:
      'Handle sizing questions, shipping queries, and product availability DMs automatically — and never leave a potential buyer waiting.',
  },
  {
    icon: Star,
    title: 'Creators & influencers',
    description:
      'Manage collaboration enquiries, merch questions, and fan messages at scale without hiring a dedicated inbox manager.',
  },
  {
    icon: TrendingUp,
    title: 'Service businesses',
    description:
      'Answer pricing, availability, and booking DMs automatically. Convert followers into booked clients without the back-and-forth.',
  },
  {
    icon: Headphones,
    title: 'DTC ecommerce',
    description:
      'Reduce post-purchase DMs (order status, returns, sizing) by giving customers instant answers from your support documentation.',
  },
];

const testimonials = [
  {
    quote:
      'Our DM volume tripled after a collab post. VocUI handled the flood — our team only stepped in for the edge cases.',
    author: 'A.P.',
    role: 'Brand Manager, Fashion Label',
  },
  {
    quote:
      'I was spending two hours a day on Instagram DMs. Now I check in once and the AI has already handled everything routine.',
    author: 'J.W.',
    role: 'Founder, Online Coaching Business',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function InstagramChatbotPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Instagram DMs</Badge>

          <H1 className="max-w-4xl mb-6">
            Turn Instagram DMs into Instant Support.{' '}
            <span className="text-primary-500">Your knowledge base answers, while you sleep.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Connect VocUI to your Instagram Professional account and train it on your products,
            pricing, and FAQs. Every DM gets a fast, on-brand reply — automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Instagram Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; Free plan available &middot; Requires Instagram Professional account
          </p>
        </section>

        {/* ── Trust Bar ───────────────────────────────────────────────────────── */}
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem Section ─────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The DM volume problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Instagram rewards speed. Your inbox doesn&apos;t.
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Instagram&apos;s algorithm actively surfaces content from accounts with high engagement.
              Fast DM replies drive conversions. But manual replies don&apos;t scale.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {painPoints.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4">
                    <Icon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Your Instagram DM chatbot live in three steps
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div
                className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700"
                aria-hidden="true"
              />

              {steps.map((s) => (
                <div key={s.step} className="relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-14">
              <Button size="xl" asChild>
                <Link href="/signup">
                  Build Your Instagram Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for Instagram</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything your Instagram bot needs to convert
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Accurate answers. Consistent voice. Always on. VocUI handles your DMs so your
              team can focus on content, strategy, and the conversations that matter.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.name}
                  className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4">
                    <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Use Cases ───────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Use cases</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Who uses VocUI for Instagram
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                High-DM accounts in any vertical — from fashion brands to service businesses —
                use VocUI to reclaim hours from their Instagram inbox every week.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {useCases.map((u) => {
                const Icon = u.icon;
                return (
                  <Card
                    key={u.title}
                    className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mb-3">
                        <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base leading-snug">{u.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                        {u.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Social Proof ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">What customers say</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Brands that stopped losing DMs to their own inbox
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-8 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
              >
                <blockquote className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 text-base">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm">{t.author}</p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">Frequently asked questions</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Common questions about VocUI for Instagram
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
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Stop losing leads to a slow Instagram inbox.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Build an AI chatbot trained on your content and deploy it to Instagram DMs.
                Every message answered. Your brand voice. Your knowledge.
              </p>
              <p className="text-sm text-white/60 mb-4">
                Free plan available &middot; No credit card required &middot; Requires Instagram Professional account
              </p>
              <p className="text-xs text-white/40 mb-6">
                <Link href="/chatbot-for-facebook-messenger" className="text-white/60 hover:text-white/80 underline">Facebook Messenger chatbot</Link>
                {' '}&middot;{' '}
                <Link href="/integrations" className="text-white/60 hover:text-white/80 underline">All integrations</Link>
                {' '}&middot;{' '}
                <Link href="/slack-chatbot" className="text-white/60 hover:text-white/80 underline">Slack chatbot</Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Instagram Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline-light" asChild>
                  <Link href="/pricing">See Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </PageBackground>
  );
}
