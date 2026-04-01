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
  Clock,
  Phone,
  CreditCard,
  BookOpen,
  CalendarCheck,
  ShieldCheck,
  UserCheck,
  Search,
  Star,
  Users,
  Activity,
  MessageSquare,
} from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Optometrists | Eye Exam Booking & Eyewear FAQ | VocUI',
    description:
      'Automate eyewear stock questions, eye exam booking, and insurance coverage FAQs with an AI chatbot trained on your optical practice. Available 24/7, no staff required.',
    keywords: [
      'AI chatbot for optometrists',
      'optical practice chatbot',
      'eye exam booking chatbot',
      'eyewear FAQ chatbot',
      'optometry chatbot',
    ],
    openGraph: {
      title: 'AI Chatbot for Optometrists | Eye Exam Booking & Eyewear FAQ | VocUI',
      description:
        'Automate eyewear stock questions, eye exam booking, and insurance coverage FAQs with an AI chatbot trained on your optical practice. Available 24/7, no staff required.',
      url: 'https://vocui.com/chatbot-for-optometrists',
      siteName: 'VocUI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI Chatbot for Optometrists | Eye Exam Booking & Eyewear FAQ | VocUI',
      description:
        'Automate eyewear stock questions, eye exam booking, and insurance coverage FAQs with an AI chatbot trained on your optical practice. Available 24/7, no staff required.',
    },
    alternates: {
      canonical: 'https://vocui.com/chatbot-for-optometrists',
    },
    robots: { index: true, follow: true },
  };
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'VocUI — AI Chatbot for Optometrists & Optical Practices',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  description:
    'AI chatbot that handles eyewear stock FAQs, eye exam booking, and insurance coverage questions for optometrists and optical practices.',
  url: 'https://vocui.com/chatbot-for-optometrists',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan available',
  },
  featureList: [
    'Practice-specific eyewear and services knowledge',
    '24/7 eye exam booking',
    'Insurance and coverage FAQs',
    'Frame and lens product questions',
    'Staff handoff for clinical queries',
    'GDPR-compliant data handling',
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Optometrists & Optical Practices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Automate eyewear stock questions, eye exam booking, and insurance coverage FAQs with an AI chatbot trained on your optical practice. Available 24/7, no staff required."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Optometrists & Optical Practices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Optometrists & Optical Practices get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Optometrists & Optical Practices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Optometrists & Optical Practices business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};


// ─── Data ──────────────────────────────────────────────────────────────────────

const trustSignals = [
  'Handles stock and product questions 24/7',
  'Books eye exams directly from chat',
  'GDPR-compliant data handling',
];

const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  {
    icon: Phone,
    title: 'Staff are spending hours answering frame and stock questions',
    body: <span>Do you carry Oakley? What are your lens upgrade options? Can I get progressive lenses in that frame? <a href="https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">Small businesses miss 62% of inbound calls</a> — these questions are repeatable, predictable, and easy to automate.</span>,
  },
  {
    icon: Clock,
    title: 'After-hours exam booking requests go unanswered until morning',
    body: <span>A patient decides to book their annual eye check at 7pm. <a href="https://www.dentaleconomics.com/practice/systems/article/14204628/why-online-scheduling-should-be-the-new-normal" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">43% of patients look for healthcare providers outside business hours</a> — if you can&apos;t capture that intent immediately, they search again the next day and your competitor may be first.</span>,
  },
  {
    icon: CreditCard,
    title: 'Insurance coverage questions arrive on repeat',
    body: 'Which health funds do you accept? Does my extras cover contact lens fittings? Is the eye exam bulk billed? Your chatbot can answer all of these from your approved content — instantly.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Train on your practice and product content',
    description:
      'Upload your services page, frame brands stocked, lens options, insurance partners, and exam types. Your chatbot learns your specific practice — not generic optometry information.',
  },
  {
    step: '02',
    title: 'Connect your booking calendar',
    description:
      'Integrate with Easy!Appointments so patients can check availability and book an eye exam directly from the chat window — at any hour of the day.',
  },
  {
    step: '03',
    title: 'Go live on your website',
    description:
      'One embed snippet. Your optical practice chatbot handles product FAQs, insurance queries, and appointment booking — freeing your dispensing staff for in-store service.',
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Practice-specific knowledge',
    description:
      'Trained on your frame brands, lens options, exam types, and policies — not generic optical information.',
  },
  {
    icon: CalendarCheck,
    name: '24/7 eye exam booking',
    description:
      'Let patients check availability and book eye exams or contact lens fittings directly from chat, any time.',
  },
  {
    icon: CreditCard,
    name: 'Insurance and health fund FAQs',
    description:
      'Answer questions about accepted health funds, extras coverage, and bulk billing from your practice content.',
  },
  {
    icon: Search,
    name: 'Frame and lens product questions',
    description:
      'Handle questions about your frame brands, lens coatings, progressive options, and contact lens ranges automatically.',
  },
  {
    icon: UserCheck,
    name: 'Clinical handoff built in',
    description:
      'Questions about prescriptions, eye health, or conditions are escalated to your optometrist. Your chatbot handles retail; your team handles clinical care.',
  },
  {
    icon: ShieldCheck,
    name: 'GDPR-compliant',
    description:
      'Visitor data is handled per GDPR. Conversation data is never used to train AI models.',
  },
];

const verticals = [
  {
    icon: Star,
    title: 'Independent Opticians',
    description:
      'Compete with chain optical stores by giving customers instant product and service information — and booking capability — around the clock.',
  },
  {
    icon: Activity,
    title: 'Contact Lens Specialists',
    description:
      'Handle brand comparison questions, refill queries, and fitting appointment bookings from chat.',
  },
  {
    icon: Users,
    title: 'Children\'s Vision',
    description:
      'Answer parent questions about children\'s eye exams, vision therapy, and frame suitability for kids.',
  },
  {
    icon: MessageSquare,
    title: 'Low Vision Clinics',
    description:
      'Explain specialist services, referral requirements, and funding eligibility to patients and carers at any hour.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForOptometristsPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <Header />

      <main id="main-content">

        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Optometrists &amp; Optical Practices</Badge>

          <H1 className="max-w-4xl mb-6">
            Stop answering the same frame and insurance questions.{' '}
            <span className="text-primary-500">Your chatbot has them covered.</span>
          </H1>

          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">
            VocUI trains on your stock, services, and accepted health funds — so patients get
            accurate answers and can book eye exams around the clock without staff involvement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link href="/signup">
                Build Your Optical Practice Chatbot Free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Product and stock FAQs answered 24/7 &middot; Books eye exams direct &middot; GDPR-compliant
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
            <Badge variant="outline" className="mb-4">The dispensing desk problem</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Your optical team spends hours on questions that should not need a person
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Dispensing staff are trained to help patients find the right eyewear — not to answer
              the same stock and insurance questions over and over. Automation fixes this.
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
                From your practice content to a live patient chatbot in under an hour
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
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Everything an optical practice chatbot actually needs
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              Built for optical retail and clinical environments — not a generic chatbot. Every
              feature is designed to reduce routine queries and convert visitors into booked patients.
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

        {/* ── Testimonial ─────────────────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-8">From an optical practice using VocUI</Badge>
              <blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">
                &ldquo;We used to lose after-hours exam bookings every single week. Now the chatbot
                captures them overnight and we start each morning with a full appointment schedule.&rdquo;
              </blockquote>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">
                P.N. &mdash; Practice Owner, Independent Optical Clinic
              </p>
            </div>
          </div>
        </section>

        {/* ── Who It's For ────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              For every optical practice that wants to convert more website visitors into patients
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              From independent opticians to specialist vision clinics, VocUI gives every visitor
              immediate answers and a direct path to booking — any time of day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {verticals.map((v) => {
              const Icon = v.icon;
              return (
                <Card
                  key={v.title}
                  className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"
                >
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary-500" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base leading-snug">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
                      {v.description}
                    </p>
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
                { label: 'Chatbot for Dentists', href: '/chatbot-for-dentists', description: 'Appointment booking, insurance FAQ, and patient preparation guides.' },
                { label: 'Chatbot for Chiropractors', href: '/chatbot-for-chiropractors', description: 'New patient intake, treatment FAQ, and appointment booking.' },
                { label: 'Chatbot for Pharmacies', href: '/chatbot-for-pharmacies', description: 'Prescription FAQ and refill support for pharmacy customers.' },
                { label: 'Chatbot for Healthcare', href: '/chatbot-for-healthcare', description: 'Patient FAQ, insurance questions, and appointment booking — 24/7.' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group flex flex-col gap-1 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.label}</span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-center text-white shadow-xl shadow-primary-500/20">
              <h2 className="text-3xl font-bold mb-4">
                Your dispensing team should be helping patients choose frames — not answering the phone
              </h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">
                Let your chatbot handle product questions, insurance FAQs, and exam booking — while
                your team focuses on the in-store experience that builds loyalty.
              </p>
              <p className="text-sm text-white/60 mb-10">
                Free plan available &middot; No credit card required &middot; GDPR-compliant
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
                  asChild
                >
                  <Link href="/signup">
                    Build Your Optical Practice Chatbot Free
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
