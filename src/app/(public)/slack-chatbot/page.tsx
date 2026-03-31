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
  Search,
  Users,
  Clock,
  FileText,
  MessageSquare,
  Eye,
  RefreshCw,
  Layers,
  BarChart2,
  BookOpen,
  Code2,
  TrendingUp,
  Headphones,
  Sparkles,
  XCircle,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Slack | Train on Your Docs | VocUI',
    description:
      'Deploy an AI chatbot to your Slack workspace trained on your own documents, SOPs, and FAQs. Answer team questions instantly — no more searching through wikis.',
    keywords: [
      'AI chatbot for Slack',
      'Slack bot trained on documents',
      'custom Slack bot with AI',
      'knowledge base Slack bot',
      'Slack AI assistant',
      'internal knowledge bot Slack',
    ],
    openGraph: {
      title: 'AI Chatbot for Slack | Train on Your Docs | VocUI',
      description:
        'Deploy an AI chatbot to your Slack workspace trained on your own documents, SOPs, and FAQs. Answer team questions instantly — no more searching through wikis.',
      url: 'https://vocui.com/slack-chatbot',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Slack | Train on Your Docs | VocUI',
      description:
        'Deploy an AI chatbot to your Slack workspace trained on your own documents, SOPs, and FAQs. Answer team questions instantly — no more searching through wikis.',
    },
    alternates: {
      canonical: 'https://vocui.com/slack-chatbot',
    },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const faqItems = [
  {
    question: 'Does the Slack chatbot work in private channels?',
    answer:
      'Yes. Once you invite the VocUI bot to a private channel, it responds to @mentions and direct questions just like in public channels. It only has access to channels you explicitly add it to.',
  },
  {
    question: 'What Slack permissions does VocUI need?',
    answer:
      'VocUI requests the minimum permissions needed: reading messages in channels it\'s added to and posting replies. It does not access your DMs, files, or channels it hasn\'t been invited to.',
  },
  {
    question: 'Can I control which channels the bot responds in?',
    answer:
      'Yes. The bot only responds in channels you invite it to. Remove it from a channel at any time and it stops responding there immediately.',
  },
  {
    question: 'How does VocUI compare to Slack AI?',
    answer:
      'Slack AI summarises your Slack messages and threads. VocUI answers from your external documentation — PDFs, SOPs, and URLs. They solve different problems, and VocUI works on any Slack plan including free.',
  },
  {
    question: 'Can the same chatbot work on both Slack and my website?',
    answer:
      'Yes. One VocUI knowledge base powers both your Slack bot and your website chat widget. Train once, deploy everywhere — your team and customers get the same accurate answers.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'VocUI Slack Chatbot',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Deploy an AI chatbot to your Slack workspace trained on your own documents, SOPs, and FAQs. Answer team questions instantly without hunting through wikis.',
      url: 'https://vocui.com/slack-chatbot',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan available',
      },
      featureList: [
        'Slack workspace deployment',
        'Document and PDF training',
        'Natural language question answering',
        'Source transparency',
        'Multi-channel: Slack and website',
        'Usage analytics',
      ],
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

const trustSignals = [
  'Live in your Slack workspace in under an hour',
  'Trained on your actual docs — not generic AI',
  'Works on free and paid Slack plans',
  'Same knowledge base powers your website chatbot too',
];

const painPoints = [
  {
    icon: Search,
    title: '"Does anyone know where the onboarding doc is?"',
    body: 'Every team has a Slack channel full of questions about internal processes, policies, and procedures. The answers exist — they\'re just buried in Notion, Google Drive, or a wiki nobody reads.',
  },
  {
    icon: Users,
    title: 'Your senior people become human search engines',
    body: 'New hires and junior team members ping senior colleagues for answers that should be self-serve. Every "quick question" in Slack is an interruption that compounds across the team.',
  },
  {
    icon: Clock,
    title: 'Context switching kills deep work',
    body: 'Answering team questions in Slack is reactive, interrupt-driven work. The people who know the most get pinged the most — when they should be doing the work they were hired for.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your company docs',
    description:
      'Upload your SOPs, HR policies, onboarding guides, product documentation, and any internal FAQs. VocUI indexes everything and makes it searchable by AI.',
  },
  {
    step: '02',
    title: 'Connect to your Slack workspace',
    description:
      'Deploy your trained chatbot to your Slack workspace. It joins as a bot user — team members can @mention it or message it directly to get answers.',
  },
  {
    step: '03',
    title: 'Answer questions instantly',
    description:
      'Team members ask questions in natural language. The chatbot finds the relevant content from your knowledge base and answers immediately — with a source reference.',
  },
];

const features = [
  {
    icon: FileText,
    name: 'Trained on your content',
    description:
      'Upload SOPs, PDFs, Notion exports, Google Docs, URLs, and DOCX files. Your bot answers from your actual documentation — not generic AI guesses.',
  },
  {
    icon: MessageSquare,
    name: 'Natural language questions',
    description:
      'Team members ask questions exactly as they\'d ask a colleague. The bot understands intent and finds the right answer, not just keyword matches.',
  },
  {
    icon: Eye,
    name: 'Source transparency',
    description:
      'Every answer includes a reference to the knowledge source it came from — so team members can verify and dig deeper if needed.',
  },
  {
    icon: RefreshCw,
    name: 'Always up to date',
    description:
      'When your docs change, update your knowledge sources in VocUI. Your Slack bot answers from the latest version immediately.',
  },
  {
    icon: Layers,
    name: 'Multi-channel: Slack + website',
    description:
      'The same knowledge base powers your internal Slack bot AND your external website chatbot. One source of truth, two deployment channels.',
  },
  {
    icon: BarChart2,
    name: 'Usage visibility',
    description:
      'See which questions get asked most frequently — and which ones go unanswered. Use this to identify gaps in your documentation.',
  },
];

const useCases = [
  {
    icon: BookOpen,
    title: 'Internal knowledge base',
    description:
      'Give every team member instant access to HR policies, IT processes, company procedures, and onboarding guides — without the wiki.',
  },
  {
    icon: Code2,
    title: 'Engineering team docs',
    description:
      'Deployment runbooks, architecture docs, API references, incident playbooks — your bot finds the right doc so engineers don\'t have to.',
  },
  {
    icon: TrendingUp,
    title: 'Sales enablement',
    description:
      'Product FAQs, competitive battle cards, pricing guidelines, objection handling — your sales team gets answers mid-call without leaving Slack.',
  },
  {
    icon: Headphones,
    title: 'Customer-facing Slack channels',
    description:
      'For businesses with dedicated customer Slack workspaces, deploy a bot that answers product questions using your own support documentation.',
  },
];

const slackAiComparison = [
  {
    feature: 'What it knows',
    vocui: 'Your external documents — PDFs, SOPs, URLs, policies, product guides',
    slackAi: 'Your Slack messages, threads, and Canvas documents',
  },
  {
    feature: 'Answer quality for doc-based questions',
    vocui: 'Sourced directly from the authoritative document',
    slackAi: 'Summarised from the last time someone discussed it in a message',
  },
  {
    feature: 'Works on free & Pro Slack plans',
    vocui: true,
    slackAi: false,
  },
  {
    feature: 'Deploy to website + Slack from one knowledge base',
    vocui: true,
    slackAi: false,
  },
  {
    feature: 'You control what the bot knows',
    vocui: true,
    slackAi: false,
  },
];

const testimonials = [
  {
    quote:
      'Clients ask us the same eligibility questions every week. VocUI handles that now.',
    author: 'S.C.',
    role: 'Partner, Law Firm',
  },
  {
    quote:
      'Our team used to ping me 10 times a day with the same onboarding questions. Now they ask the bot in Slack and get the answer in seconds.',
    author: 'M.T.',
    role: 'Head of Customer Success, SaaS Company',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SlackChatbotPage() {
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
          <Badge className="mb-6">AI Chatbot for Slack</Badge>

          <H1 className="max-w-4xl mb-6">
            Your Slack workspace has the questions.{' '}
            <span className="text-primary-500">Your knowledge base has the answers. Connect them.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            Train an AI chatbot on your internal docs and deploy it to Slack.
            Your team asks questions in natural language — the chatbot answers instantly, with sources.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Slack Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            No credit card required &middot; Free plan available &middot; Live in under an hour
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
            <Badge variant="outline" className="mb-4">The knowledge problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is asking questions in Slack that your docs already answer
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              The bottleneck isn&apos;t missing information. It&apos;s that your information is too hard
              to find when you need it mid-conversation.
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
                Connect your knowledge base to Slack in three steps
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              {/* Connector line — desktop only */}
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
                  Build Your Slack Chatbot Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Built for Slack</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything your Slack knowledge bot needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not just a bot that guesses. VocUI answers from your documentation — and tells your
              team exactly where the answer came from.
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

        {/* ── vs Slack AI ─────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="mb-4">Already have Slack AI?</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Slack AI and VocUI do different things
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Slack AI summarises your Slack conversations. VocUI answers from your external
                documentation. Most teams benefit from both — they&apos;re solving different problems.
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-secondary-500 dark:text-secondary-400 font-medium w-1/3" />
                    <th className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/50">
                          <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-semibold text-secondary-900 dark:text-secondary-100">VocUI</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-200 dark:bg-secondary-700">
                          <Sparkles className="h-4 w-4 text-secondary-500" />
                        </div>
                        <span className="font-semibold text-secondary-600 dark:text-secondary-400">Slack AI</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slackAiComparison.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-t border-secondary-200 dark:border-secondary-700 ${i % 2 === 0 ? 'bg-white dark:bg-secondary-800/50' : 'bg-secondary-50/50 dark:bg-secondary-800/20'}`}
                    >
                      <td className="py-3.5 px-4 text-secondary-700 dark:text-secondary-300 font-medium">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.vocui === 'boolean' ? (
                          row.vocui
                            ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            : <XCircle className="w-5 h-5 text-secondary-300 dark:text-secondary-600 mx-auto" />
                        ) : (
                          <span className="text-secondary-700 dark:text-secondary-300 text-xs">{row.vocui}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.slackAi === 'boolean' ? (
                          row.slackAi
                            ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                            : <XCircle className="w-5 h-5 text-secondary-300 dark:text-secondary-600 mx-auto" />
                        ) : (
                          <span className="text-secondary-500 dark:text-secondary-400 text-xs">{row.slackAi}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-xs text-secondary-400 dark:text-secondary-500 mt-6 max-w-xl mx-auto">
              Slack AI is available on Business+ and Enterprise Grid plans only ($10/user/month add-on).
              VocUI works with any Slack plan.
            </p>
          </div>
        </section>

        {/* ── Use Cases ───────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Use cases</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                What teams use VocUI for Slack
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                From internal HR policies to customer-facing channels — if your team communicates
                in Slack, your knowledge base should be there too.
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
              Teams that stopped answering the same questions twice
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
              Common questions about VocUI for Slack
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
                Stop being your team&apos;s search engine. Build one.
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Deploy an AI chatbot to Slack trained on your own documentation — and give your team
                instant answers.
              </p>
              <p className="text-sm text-white/60 mb-4">
                Free plan available &middot; No credit card required &middot; Live in your Slack workspace today
              </p>
              <p className="text-xs text-white/40 mb-6">
                <Link href="/solutions" className="text-white/60 hover:text-white/80 underline">Explore all solutions</Link>
                {' '}&middot;{' '}
                <Link href="/vs-intercom" className="text-white/60 hover:text-white/80 underline">VocUI vs Intercom</Link>
                {' '}&middot;{' '}
                <Link href="/vs-tidio" className="text-white/60 hover:text-white/80 underline">VocUI vs Tidio</Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Slack Chatbot Free
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="outline-light"
                  asChild
                >
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
