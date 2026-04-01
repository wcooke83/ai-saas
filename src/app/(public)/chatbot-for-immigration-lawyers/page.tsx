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
  ArrowRight, CheckCircle2, Phone, MoonStar, AlertCircle,
  BookOpen, CalendarCheck, Clock, UserCheck, Briefcase,
  Globe, Users, Home, FileText,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Immigration Lawyers | Case FAQ & Consultation Booking | VocUI',
    description: 'Let an AI chatbot handle visa category FAQs, consultation booking, and document checklists for your immigration law firm — 24/7. Let your attorneys focus on cases, not intake.',
    keywords: ['AI chatbot for immigration lawyers', 'immigration law chatbot', 'visa FAQ automation', 'immigration consultation booking chatbot'],
    openGraph: { title: 'AI Chatbot for Immigration Lawyers | Case FAQ & Consultation Booking | VocUI', description: 'Let an AI chatbot handle visa category FAQs, consultation booking, and document checklists — 24/7.', url: 'https://vocui.com/chatbot-for-immigration-lawyers', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Immigration Lawyers | Case FAQ & Consultation Booking | VocUI', description: 'Let an AI chatbot handle visa category FAQs, consultation booking, and document checklists — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-immigration-lawyers' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Immigration Lawyers', applicationCategory: 'LegalApplication', operatingSystem: 'Web', description: 'AI chatbot handling visa FAQs, consultation booking, and document checklists for immigration law firms — 24/7. No legal advice given.', url: 'https://vocui.com/chatbot-for-immigration-lawyers', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Visa category FAQ (non-advice)', 'Consultation booking', 'Document checklist delivery', '24/7 availability', 'Attorney escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Immigration Lawyers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle visa category FAQs, consultation booking, and document checklists for your immigration law firm \u2014 24/7. Let your attorneys focus on cases, not intake."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Immigration Lawyers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Immigration Lawyers get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Immigration Lawyers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Immigration Lawyers business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Immigration Lawyers",
      "item": "https://vocui.com/chatbot-for-immigration-lawyers"
    }
  ]
};


const trustSignals = [
  'Answers visa process questions 24/7',
  'Never gives legal advice — routes complex matters to your attorneys',
  'GDPR-compliant data handling',
];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'The same visa category questions consuming your intake team\'s time', body: 'What visa do I need to bring my spouse here? Can I switch from a student visa to a work visa? What\'s the difference between a skilled worker visa and a sponsor licence? Your intake team answers these questions dozens of times a week — time that could be spent on active cases.' },
  { icon: MoonStar, title: 'Prospects researching immigration options after hours with no guidance', body: <span>Immigration decisions are often made in the evenings after conversations at home. Without a way to guide prospects through the right visa category and explain your process at 10pm, they move to the firm that responds first the next morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Unqualified enquiries consuming attorney time before any value is created', body: 'Not every immigration enquiry is a viable case. Without automated pre-screening on visa eligibility and case type, your attorneys spend the first part of every consultation on basics that could have been filtered before they picked up the phone.' },
];
const steps = [
  { step: '01', title: 'Train on your practice', description: 'Upload your visa category guides, process FAQs, document checklists, and eligibility information. Your chatbot becomes a knowledgeable first point of contact — without ever giving legal advice.' },
  { step: '02', title: 'Configure intake and booking flows', description: 'Set up consultation booking and pre-intake questions. Define which matters need immediate attorney involvement and which can be routed through standard intake.' },
  { step: '03', title: 'Deploy and focus on casework', description: 'Embed on your website. Prospects get accurate process guidance; those ready to instruct book consultations with their case details already documented.' },
];
const features = [
  { icon: BookOpen, name: 'Visa category FAQ (non-advice)', description: 'Guide prospects through the right visa category based on their situation — without giving legal advice. Your attorneys handle strategy; the chatbot handles navigation.' },
  { icon: CalendarCheck, name: 'Consultation booking', description: 'Connect to your calendar via Easy!Appointments. Prospective clients book consultations directly from the chat, with their visa category and situation pre-documented.' },
  { icon: FileText, name: 'Document checklist delivery', description: 'Provide the right document checklist for each visa type automatically — so clients arrive at their first consultation prepared and your attorneys can move faster.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot guides prospective clients at midnight as well as midday — critical for international clients across time zones who can\'t wait until your office opens.' },
  { icon: UserCheck, name: 'Attorney escalation', description: 'Complex case matters and urgent questions escalate to the right attorney with full context — so no client falls through the cracks.' },
  { icon: Globe, name: 'Multi-pathway guidance', description: 'Help prospects understand the difference between visa pathways — work, family, study, asylum — before they book, so consultations start in the right place.' },
];
const verticals = [
  { icon: Briefcase, title: 'Work Visas', description: 'Guide skilled worker, intra-company transfer, and sponsor licence enquiries to the right pathway before consultation.' },
  { icon: Home, title: 'Family Reunification', description: 'Handle spouse visa, dependent, and family settlement enquiries with sensitivity and clear process guidance.' },
  { icon: Users, title: 'Asylum & Refugee', description: 'Provide process guidance and direct urgent matters to your team immediately with full context.' },
  { icon: Globe, title: 'Citizenship & Naturalisation', description: 'Answer eligibility, timeline, and document FAQ for citizenship applications and naturalisation enquiries.' },
];

export default function ChatbotForImmigrationLawyersPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Immigration Law Firms</Badge>
          <H1 className="max-w-4xl mb-6">Prospective clients research immigration options at every hour.{' '}
            <span className="text-primary-500">Your chatbot can guide them — without giving legal advice.</span>
          </H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your visa categories, process guides, and document checklists — so your intake team spends less time on routine FAQ and your attorneys focus on the cases that need them.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Immigration Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers visa process questions 24/7 &middot; Never gives legal advice &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The intake problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your intake team is fielding questions a chatbot could handle first</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t knowledgeable. Because without automated first-contact guidance, every prospect — viable or not — consumes the same intake team time from the very first question.</p></div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">{painPoints.map((p) => { const Icon = p.icon; return (<div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4"><Icon className="h-5 w-5 text-red-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p></div>); })}</div>
        </section>
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Set up in under an hour. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything an immigration law chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for immigration practices — not a generic FAQ page. Every feature guides prospects to the right pathway and prepares them for their first consultation without overstepping legal boundaries.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From an immigration law firm using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;Our intake team was spending hours on the same visa category questions. VocUI now handles the initial guidance and books the consultation — by the time our attorneys sit down with a new client, the basics are already covered and we can focus on strategy.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">C.N. &mdash; Managing Partner, Atlas Immigration Law</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For immigration law firms that want their attorneys focused on casework, not intake FAQ</h2><p className="text-secondary-600 dark:text-secondary-400">If your intake team is fielding questions a chatbot could guide, VocUI pays for itself the moment your attorneys arrive at their first consultation with a client who already understands their own situation.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Law Firms', href: '/chatbot-for-lawyers', description: 'Client intake, practice area FAQ, and consultation booking.' },
                { label: 'Chatbot for Accountants', href: '/chatbot-for-accountants', description: 'Tax FAQ and client intake automation.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for HR Departments', href: '/chatbot-for-hr', description: 'Employee policy FAQ and onboarding support for HR teams.' },
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
              <h2 className="text-3xl font-bold mb-4">Your attorneys&apos; time is too valuable for intake FAQ</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Let your chatbot guide prospects through visa categories and book consultations — so every client arrives prepared.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Immigration Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                <Button size="xl" variant="outline-light" asChild><Link href="/pricing">See Pricing</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageBackground>
  );
}
