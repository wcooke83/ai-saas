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
  Filter,
  Briefcase,
  Code2,
  Users,
  Star,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Recruiters | Job FAQ & Candidate Intake | VocUI',
    description:
      'Let an AI chatbot handle job FAQs, candidate intake, and interview scheduling for your recruitment firm — 24/7. Reduce manual screening time and focus on the best candidates.',
    keywords: [
      'AI chatbot for recruiters',
      'recruitment chatbot',
      'candidate intake automation',
      'job FAQ chatbot',
      'recruiter automation',
    ],
    openGraph: {
      title: 'AI Chatbot for Recruiters | Job FAQ & Candidate Intake | VocUI',
      description:
        'Let an AI chatbot handle job FAQs, candidate intake, and interview scheduling for your recruitment firm — 24/7.',
      url: 'https://vocui.com/chatbot-for-recruiters',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Recruiters | Job FAQ & Candidate Intake | VocUI',
      description:
        'Let an AI chatbot handle job FAQs, candidate intake, and interview scheduling for your recruitment firm — 24/7.',
    },
    alternates: { canonical: 'https://vocui.com/chatbot-for-recruiters' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Recruiters',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles job FAQs, candidate intake, and application screening for recruitment firms — 24/7, trained on your job listings and process content.',
  url: 'https://vocui.com/chatbot-for-recruiters',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' },
  featureList: [
    'Job description FAQ automation',
    'Candidate intake and pre-screening',
    'Interview scheduling via Easy!Appointments',
    '24/7 after-hours availability',
    'Recruiter handoff with full context',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer candidate questions about specific job roles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload active job descriptions and the chatbot answers questions about the role, the client, the skills required, and the application process — fielding candidate enquiries without a consultant's involvement."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI help screen candidates before they reach a recruiter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It captures key candidate details — experience level, location, availability, salary expectations — giving consultants context before the first conversation and filtering out poor-fit applications early."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot answer employer questions about recruitment fees and processes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, if you upload your service model, fee structure, and how your process works. It handles initial employer enquiries and routes qualified briefs to the right consultant."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle confidential executive search enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You control exactly what the chatbot answers. For sensitive senior roles, you can configure it to capture enquiry details and escalate immediately rather than discussing role specifics — protecting confidentiality while ensuring no lead goes unhandled."
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
      "name": "AI Chatbot for Recruiters",
      "item": "https://vocui.com/chatbot-for-recruiters"
    }
  ]
};



const trustSignals = [
  'Answers candidate questions 24/7',
  'Pre-screens before your team engages',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Recruiters spending hours answering the same job description questions',
    body: 'Is this role remote? What\'s the salary range? Do I need a degree? Every recruiter answers these questions dozens of times per role. That\'s time that could be spent on promising candidates who\'ve already applied.',
  },
  {
    icon: MoonStar,
    title: 'Candidates apply after hours and hear nothing until the next day',
    body: <span>Top candidates often evaluate multiple opportunities simultaneously. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours</a> — when your site can&apos;t answer basic questions at 10pm, the best candidates move on.</span>,
  },
  {
    icon: AlertCircle,
    title: 'Manually screening unqualified applicants before any real work begins',
    body: 'A significant portion of every application pipeline doesn\'t meet basic criteria. Without automated pre-screening, your recruiters spend the first hour of their day filtering noise instead of sourcing talent.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your job listings',
    description:
      'Upload your job descriptions, company FAQs, interview process guides, and candidate requirements. Your chatbot becomes an expert on every open role.',
  },
  {
    step: '02',
    title: 'Configure intake and screening flows',
    description:
      'Define the qualifying questions for each role type. The chatbot collects the right information upfront — your recruiters only engage with pre-qualified candidates.',
  },
  {
    step: '03',
    title: 'Deploy and place faster',
    description:
      'Embed on your jobs page or candidate portal. Applicants get instant answers; qualified candidates get routed into your interview pipeline.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Job FAQ automation',
    description:
      'Answer role-specific questions instantly — salary, location, requirements, process — so candidates get clarity before they apply.',
  },
  {
    icon: Filter,
    name: 'Candidate pre-screening',
    description:
      'Collect qualifying information upfront — right to work, experience level, notice period — before your team spends a minute reviewing.',
  },
  {
    icon: CalendarCheck,
    name: 'Interview scheduling',
    description:
      'Connect to your calendar via Easy!Appointments. Qualified candidates book interview slots directly from the chat.',
  },
  {
    icon: Clock,
    name: 'After-hours availability',
    description:
      'Your chatbot answers candidate questions at midnight as well as midday. Capture every strong application, even outside office hours.',
  },
  {
    icon: UserCheck,
    name: 'Seamless recruiter handoff',
    description:
      'Pre-screened candidates escalate to your team with the full conversation and intake data ready — no cold handoffs.',
  },
  {
    icon: Star,
    name: 'Company and culture FAQ',
    description:
      'Answer questions about your company culture, benefits, and growth opportunities — helping candidates self-select before they apply.',
  },
];

const verticals = [
  {
    icon: Code2,
    title: 'Tech Recruitment',
    description:
      'Handle role-specific technical questions and screen for stack experience before your technical team gets involved.',
  },
  {
    icon: Briefcase,
    title: 'Executive Search',
    description:
      'Qualify senior-level enquiries discreetly and route the right candidates to confidential conversations.',
  },
  {
    icon: Users,
    title: 'Volume Hiring',
    description:
      'Pre-screen large application volumes automatically and shortlist only candidates who meet your basic criteria.',
  },
  {
    icon: Star,
    title: 'Contract & Freelance',
    description:
      'Answer availability, rate, and project FAQ for contract candidates and route matches to your team instantly.',
  },
];

export default function ChatbotForRecruitersPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Recruiters</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Recruitment Firms</Badge>
          <H1 className="max-w-4xl mb-6">
            Every candidate asks the same questions.{' '}
            <span className="text-primary-500">Your chatbot can answer them before your team even logs in.</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your job listings and recruitment process — so your team spends less time on
            repetitive FAQs and more time placing the right candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Recruitment Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Answers candidate questions 24/7 &middot; Pre-screens before your team engages &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The recruiter problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your recruiters are answering questions a chatbot could handle
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Not because your team is slow. Because there&apos;s no system to handle the same candidate
              questions that arrive for every single role — so it all falls on your recruiters.
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
                Live before your next candidate screening. No developers needed.
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
              Everything a recruitment chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for recruiters — not a generic widget bolted onto your jobs page. Every feature is
              aimed at reducing manual screening time and accelerating your placement pipeline.
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

        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How recruitment firms use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Consultants spending the first two hours of each day fielding candidate questions about open roles, salary ranges, and application steps — before any actual placement work began.' },
                  { step: 'Setup', text: 'Uploaded their active roles overview, salary band guide, application FAQ, and candidate process document — configured by the team in an afternoon.' },
                  { step: 'After', text: 'Candidates pre-qualify themselves against role requirements before making contact. Consultants focus on matching and placing. Morning inbox dominated by warm, informed candidates.' },
                ].map((item) => (
                  <div key={item.step} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">{item.step}</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For recruitment firms that want their team focused on placing candidates
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              If your recruiters are fielding questions a chatbot could handle, VocUI pays for itself
              the moment your team gets their first uninterrupted sourcing session.
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
                { label: 'Chatbot for HR Departments', href: '/chatbot-for-hr', description: 'Employee policy FAQ and onboarding support for HR teams.' },
                { label: 'Chatbot for IT Support Teams', href: '/chatbot-for-it-support', description: 'Ticket deflection and troubleshooting FAQ for IT teams.' },
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
                { label: 'Chatbot for Marketing Agencies', href: '/chatbot-for-marketing-agencies', description: 'Service FAQ and proposal lead capture for marketing agencies.' },
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
              <h2 className="text-3xl font-bold mb-4">Your recruiters&apos; time is too valuable for repetitive FAQs</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot handle the screening and give your team more time to place the right candidates.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; Live in under an hour
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild>
                  <Link href="/signup">Build Your Recruitment Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </Button>
                <Button size="xl" variant="outline-light" asChild>
                  <Link href="/pricing">See Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      
          {/* Related Blog Post */}
          <div className="mt-6 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Related reading</p>
            <Link href="/blog/chatbot-for-recruitment" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              How Recruiters Use AI Chatbots to Screen Candidates Faster →
            </Link>
          </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
