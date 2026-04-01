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
  Palette,
  ShoppingCart,
  Code2,
  Globe,
  DollarSign,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Web Design Agencies | Project Scoping & Quote Lead Capture | VocUI',
    description:
      'Let an AI chatbot handle project scoping, quote lead capture, and portfolio FAQ for your web design agency — 24/7. Stop wasting time on unqualified enquiries.',
    keywords: [
      'AI chatbot for web design agencies',
      'web agency chatbot',
      'project scoping chatbot',
      'web design lead capture',
      'agency quote automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Web Design Agencies | Project Scoping & Quote Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle project scoping, quote lead capture, and portfolio FAQ for your web design agency — 24/7.',
      url: 'https://vocui.com/chatbot-for-web-design-agencies',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Web Design Agencies | Project Scoping & Quote Lead Capture | VocUI',
      description:
        'Let an AI chatbot handle project scoping, quote lead capture, and portfolio FAQ for your web design agency — 24/7.',
    },
    alternates: { canonical: 'https://vocui.com/chatbot-for-web-design-agencies' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Web Design Agencies',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles project scoping, quote lead capture, and portfolio FAQ for web design agencies — 24/7.',
  url: 'https://vocui.com/chatbot-for-web-design-agencies',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' },
  featureList: [
    'Project scoping intake',
    'Quote lead capture with budget qualifier',
    'Portfolio and case study FAQ',
    '24/7 after-hours availability',
    'Designer escalation with full context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Web Design Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle project scoping, quote lead capture, and portfolio FAQ for your web design agency \u2014 24/7. Stop wasting time on unqualified enquiries."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Web Design Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Web Design Agencies get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Web Design Agencies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Web Design Agencies business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Web Design Agencies",
      "item": "https://vocui.com/chatbot-for-web-design-agencies"
    }
  ]
};



const trustSignals = [
  'Captures qualified leads 24/7',
  'Pre-qualifies budget before you engage',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: DollarSign,
    title: '"How much does a website cost?" — answered a thousand times',
    body: 'It\'s the most common question web agencies get and the hardest to answer quickly. A chatbot that explains your pricing approach, typical ranges, and what affects cost filters out tyre-kickers before they ever reach your team.',
  },
  {
    icon: MoonStar,
    title: 'Leads browse your portfolio after hours and go cold',
    body: <span>A prospect reviews your work at 10pm, gets excited, and has questions about process and timeline. With no one to engage them, they submit contact forms to three agencies and go with whoever responds first in the morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span>,
  },
  {
    icon: AlertCircle,
    title: 'Scoping calls with prospects who aren\'t budget-ready',
    body: 'Every web agency has wasted hours on discovery calls with people who wanted a £500 website. A chatbot that asks the right questions upfront stops those calls from ever being scheduled.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your agency',
    description:
      'Upload your service descriptions, process guides, portfolio summaries, and pricing FAQs. Your chatbot becomes a 24/7 new business development resource.',
  },
  {
    step: '02',
    title: 'Configure scoping and qualification flows',
    description:
      'Define the questions that separate serious prospects from tyre-kickers — project type, budget range, timeline, existing site. The chatbot collects this before your team is involved.',
  },
  {
    step: '03',
    title: 'Deploy and quote faster',
    description:
      'Embed on your website. Prospects get instant answers; qualified leads arrive in your inbox with project scope already documented.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Portfolio and services FAQ',
    description:
      'Answer questions about your work, technologies, and process automatically — so prospects build confidence before speaking to your team.',
  },
  {
    icon: DollarSign,
    name: 'Budget qualifier',
    description:
      'Collect budget range upfront so every conversation your team has is with a prospect who can actually afford your services.',
  },
  {
    icon: CalendarCheck,
    name: 'Discovery call booking',
    description:
      'Connect to your calendar via Easy!Appointments. Pre-qualified prospects book discovery calls directly from the chat.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot captures leads at midnight as well as midday. Never lose a warm prospect to a competitor who happened to reply first.',
  },
  {
    icon: UserCheck,
    name: 'Seamless designer handoff',
    description:
      'Qualified leads arrive with full project scope and budget context — no cold introductions, no scoping calls from scratch.',
  },
  {
    icon: Globe,
    name: 'Project scoping intake',
    description:
      'Collect project type, timeline, must-have features, and existing site details before your first conversation — saving hours of back-and-forth.',
  },
];

const verticals = [
  {
    icon: Palette,
    title: 'Branding & Identity',
    description:
      'Qualify branding projects, explain your process, and book brand strategy calls without consuming designer time.',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Builds',
    description:
      'Pre-qualify e-commerce prospects, answer platform questions, and collect project requirements before your first call.',
  },
  {
    icon: Globe,
    title: 'WordPress & CMS',
    description:
      'Handle CMS comparisons, maintenance FAQ, and quote enquiries for standard website projects automatically.',
  },
  {
    icon: Code2,
    title: 'Custom Development',
    description:
      'Scope complex custom projects with structured intake questions before your senior developers get involved.',
  },
];

export default function ChatbotForWebDesignAgenciesPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Web Design Agencies</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Web Design Agencies</Badge>
          <H1 className="max-w-4xl mb-6">
            Stop wasting time on prospects who aren&apos;t ready to buy.{' '}
            <span className="text-primary-500">Your chatbot qualifies them first.</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your services, portfolio, and pricing FAQs — so your team only talks to
            prospects who have the budget, the timeline, and the right project for your agency.
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
            Captures qualified leads 24/7 &middot; Pre-qualifies budget before you engage &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The agency problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your team is fielding enquiries that should never have reached them
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your process is broken. Because without automated pre-qualification, every
              inbound enquiry — good or bad — gets the same attention from your best people.
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
              Everything a web design agency chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for agencies — not a generic contact form replacement. Every feature is aimed at
              reducing wasted scoping time and filling your pipeline with qualified prospects.
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
              <Badge variant="outline" className="mb-8">From a web design agency using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We used to spend half our Mondays on discovery calls that went nowhere. VocUI asks
                the budget question for us — now every call we take is with someone who can actually afford
                what we build.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                L.H. &mdash; Director, Pixel & Stone Studio
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For web agencies that want their team focused on building, not fielding calls
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your designers and developers are fielding enquiries a chatbot could filter, VocUI pays
              for itself the moment your team reclaims their first uninterrupted project day.
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
                { label: 'Chatbot for Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
                { label: 'Chatbot for Recruiters', href: '/chatbot-for-recruiters', description: 'Job FAQ and candidate intake automation for recruitment firms.' },
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
              <h2 className="text-3xl font-bold mb-4">Your agency&apos;s time is too valuable for scoping dead ends</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot qualify and scope prospects so your team only talks to clients worth building for.
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
