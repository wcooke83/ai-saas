import type { Metadata } from 'next';
import type { ReactNode, ElementType } from 'react';
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
  Phone,
  MoonStar,
  AlertCircle,
  BookOpen,
  CalendarCheck,
  Clock,
  UserCheck,
  TrendingUp,
  Megaphone,
  Search,
  BarChart3,
  Target,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Marketing Agencies | Service FAQ & Lead Capture | VocUI',
    description:
      'Let an AI chatbot handle service FAQs, proposal lead capture, and new business intake for your marketing agency — 24/7. Turn website visitors into qualified prospects.',
    keywords: [
      'AI chatbot for marketing agencies',
      'marketing agency chatbot',
      'agency lead capture chatbot',
      'marketing FAQ automation',
      'agency new business chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Marketing Agencies | Service FAQ & Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle service FAQs, proposal lead capture, and new business intake for your marketing agency — 24/7.',
      url: 'https://vocui.com/chatbot-for-marketing-agencies',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Marketing Agencies | Service FAQ & Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle service FAQs, proposal lead capture, and new business intake for your marketing agency — 24/7.',
    },
    alternates: { canonical: 'https://vocui.com/chatbot-for-marketing-agencies' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Marketing Agencies',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles service FAQs, proposal lead capture, and new business intake for marketing agencies — 24/7, trained on your agency content.',
  url: 'https://vocui.com/chatbot-for-marketing-agencies',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' },
  featureList: [
    'Service and pricing FAQ automation',
    'Proposal lead capture',
    'New business intake',
    '24/7 after-hours availability',
    'Account manager escalation',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Marketing Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle service FAQs, proposal lead capture, and new business intake for your marketing agency \u2014 24/7. Turn website visitors into qualified prospects."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Marketing Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Marketing Agencies get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
      }
    },
    {
      "@type": "Question",
      "name": "Does VocUI work outside business hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. VocUI runs 24/7 with no human involvement. Visitors who arrive at night, on weekends, or during holidays get instant, accurate answers and can book, enquire, or leave their contact details without waiting until you open."
      }
    },
    {
      "@type": "Question",
      "name": "Is VocUI GDPR compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. VocUI is GDPR compliant. Conversation data is stored securely, you control what the chatbot knows, and visitor data is never used to train third-party AI models. You can delete data at any time."
      }
    },
    {
      "@type": "Question",
      "name": "How is VocUI different from a generic chatbot for Marketing Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Marketing Agencies business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://vocui.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Industries",
      "item": "https://vocui.com/industries"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "AI Chatbot for Marketing Agencies",
      "item": "https://vocui.com/chatbot-for-marketing-agencies"
    }
  ]
};



const trustSignals = [
  'Captures leads 24/7',
  'Trained only on your agency content',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Initial enquiry calls before a prospect is ready to commit',
    body: 'What services do you offer? How much does a campaign cost? Do you work with companies our size? These questions come before any real business conversation — and they eat up your account managers\' time every single week.',
  },
  {
    icon: MoonStar,
    title: 'Website visitors leave without converting after hours',
    body: <span>A prospect browses your case studies at 9pm, gets excited, and has questions. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours</a> — with no one to engage them, they close the tab and email three agencies in the morning.</span>,
  },
  {
    icon: AlertCircle,
    title: 'Pricing questions creating friction before the relationship starts',
    body: 'Prospects who don\'t know your pricing range leave. Those who do know it self-select. A chatbot that handles ballpark pricing FAQ transparently converts more of the right clients — before any sales call is needed.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your agency',
    description:
      'Upload your service descriptions, case study summaries, pricing FAQs, and process guides. Your chatbot becomes a 24/7 new business development resource.',
  },
  {
    step: '02',
    title: 'Configure lead capture flows',
    description:
      'Define the qualifying questions for new business enquiries — industry, budget range, timeline. The chatbot gathers context before your team takes the call.',
  },
  {
    step: '03',
    title: 'Deploy and capture more leads',
    description:
      'Embed on your website. Prospects get instant answers; qualified new business leads get routed to your team with full intake context ready.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Service and pricing FAQ',
    description:
      'Answer questions about your services, specialisms, and pricing structures instantly — so prospects self-qualify before your team gets involved.',
  },
  {
    icon: Target,
    name: 'New business lead capture',
    description:
      'Collect company name, budget range, goals, and timeline upfront — so every lead that reaches your team is already pre-qualified.',
  },
  {
    icon: CalendarCheck,
    name: 'Discovery call booking',
    description:
      'Connect to your calendar via Easy!Appointments. Qualified prospects book discovery calls directly from the chat, any time of day.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot captures new business leads at midnight as well as midday. Never lose a warm prospect to a competitor who replied first.',
  },
  {
    icon: UserCheck,
    name: 'Seamless account manager handoff',
    description:
      'Qualified leads escalate to the right account manager with full intake context — no cold introductions, no repeated questions.',
  },
  {
    icon: TrendingUp,
    name: 'Case study and portfolio FAQ',
    description:
      'Answer questions about your work, results, and client experience automatically — helping prospects build confidence before they even speak to your team.',
  },
];

const verticals = [
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description:
      'Qualify digital marketing leads and answer service FAQ before your team spends time on initial calls.',
  },
  {
    icon: Search,
    title: 'SEO & Content',
    description:
      'Handle content strategy and SEO FAQ, capture retainer enquiries, and book initial audits automatically.',
  },
  {
    icon: BarChart3,
    title: 'Paid Media',
    description:
      'Answer paid media, PPC, and social advertising questions and pre-qualify budget-ready prospects.',
  },
  {
    icon: Target,
    title: 'Full-Service Agency',
    description:
      'Guide prospects to the right service line, collect project scope details, and route to the right team lead.',
  },
];

export default function ChatbotForMarketingAgenciesPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main id="main-content">
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 pb-2">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/industries" className="hover:text-primary-500 transition-colors">Industries</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Marketing Agencies</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Marketing Agencies</Badge>
          <H1 className="max-w-4xl mb-6">
            Prospects visit your site and leave without converting.{' '}
            <span className="text-primary-500">Your chatbot can change that.</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, case studies, and pricing FAQs — so your team spends less time
            on initial enquiry calls and more time on clients who are already engaged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Agency Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Captures leads 24/7 &middot; Trained only on your agency content &middot; GDPR-compliant
          </p>
        </section>

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

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">The new business problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is handling enquiries a chatbot could filter
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your account managers are slow. Because there&apos;s no system to qualify
              inbound interest before it reaches your team — so every enquiry, good or bad, gets the
              same attention.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {painPoints.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
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

        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                Set up in under an hour. No developers needed.
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (
                <div key={s.step} className="relative text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-14">
              <Button size="xl" asChild>
                <Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything a marketing agency chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for agencies — not a generic widget bolted onto your site. Every feature is aimed at
              capturing more new business and reducing time spent on unqualified enquiries.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors">
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

        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-8">From a marketing agency using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We used to lose leads every weekend because no one was available to respond. VocUI now
                answers the initial questions, qualifies the prospect, and books the discovery call — our
                team arrives Monday with a pipeline already warming.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                R.P. &mdash; Founder, Northbrook Digital
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For marketing agencies that want their team focused on client work
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your account managers are fielding enquiries a chatbot could pre-qualify, VocUI pays for
              itself the moment your team stops wasting time on conversations that go nowhere.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {verticals.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center">
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base leading-snug">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Web Design Agencies', href: '/chatbot-for-web-design-agencies', description: 'Project scoping and quote lead capture for web agencies.' },
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for Recruiters', href: '/chatbot-for-recruiters', description: 'Job FAQ and candidate intake automation for recruitment firms.' },
                { label: 'Chatbot for IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group flex flex-col gap-1 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.label}</span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">Your team&apos;s time is too valuable for unqualified enquiries</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot capture and qualify leads so your account managers focus on the clients who matter.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live in under an hour
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild>
                  <Link href="/signup">Build Your Agency Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
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
