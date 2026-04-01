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
  BookOpen, CalendarCheck, Clock, UserCheck, Home,
  RefreshCw, Building, TrendingDown, FileText,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Mortgage Lenders | Loan FAQ & Pre-Qualification Lead Capture | VocUI',
    description: 'Let an AI chatbot handle loan FAQs, pre-qualification lead capture, and rate enquiries for your mortgage lending business — 24/7. Qualify more borrowers without adding headcount.',
    keywords: ['AI chatbot for mortgage lenders', 'mortgage lending chatbot', 'loan FAQ automation', 'mortgage pre-qualification chatbot'],
    openGraph: { title: 'AI Chatbot for Mortgage Lenders | Loan FAQ & Pre-Qualification Lead Capture | VocUI', description: 'Let an AI chatbot handle loan FAQs, pre-qualification lead capture, and rate enquiries — 24/7.', url: 'https://vocui.com/chatbot-for-mortgage-lenders', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Mortgage Lenders | Loan FAQ & Pre-Qualification Lead Capture | VocUI', description: 'Let an AI chatbot handle loan FAQs, pre-qualification lead capture, and rate enquiries — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-mortgage-lenders' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Mortgage Lenders', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', description: 'AI chatbot handling loan FAQs, pre-qualification lead capture, and rate enquiries for mortgage lenders — 24/7.', url: 'https://vocui.com/chatbot-for-mortgage-lenders', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Loan FAQ', 'Pre-qualification lead capture', 'Rate FAQ', '24/7 availability', 'Officer escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Mortgage Lenders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle loan FAQs, pre-qualification lead capture, and rate enquiries for your mortgage lending business \u2014 24/7. Qualify more borrowers without adding headcount."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Mortgage Lenders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Mortgage Lenders get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Mortgage Lenders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Mortgage Lenders business and escalates to your team when it cannot help, with full conversation context included."
      }
    }
  ]
};

const trustSignals = ['Qualifies borrowers 24/7', 'Trained only on your lending content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Loan officers spending time on enquiries that won\'t qualify', body: 'What are your current rates? What\'s the minimum deposit? Can I borrow with a complex income? These questions arrive constantly — and without a pre-qualification layer, your officers talk to everyone before knowing who can actually proceed.' },
  { icon: MoonStar, title: 'Rate and product enquiries after hours with no follow-up', body: <span>Buyers research mortgages in the evening, especially after viewing a property. Without instant responses, they contact multiple lenders and go with whoever follows up fastest in the morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Complex product range confusing applicants before they even call', body: 'A borrower who can\'t identify the right product for their situation often doesn\'t enquire at all. A chatbot that guides them to the right product type reduces drop-off and improves lead quality.' },
];
const steps = [
  { step: '01', title: 'Train on your products', description: 'Upload your product range, eligibility criteria, rate FAQs, and application process guides. Your chatbot becomes a knowledgeable first point of contact.' },
  { step: '02', title: 'Configure pre-qualification flows', description: 'Define the questions that identify serious, qualified borrowers — income type, deposit size, credit history. Collect this before your officers engage.' },
  { step: '03', title: 'Deploy and qualify more efficiently', description: 'Embed on your website. Enquirers get instant guidance; qualified borrowers enter your pipeline with their details already documented.' },
];
const features = [
  { icon: BookOpen, name: 'Loan and product FAQ', description: 'Answer questions about your mortgage products, eligibility criteria, and application process automatically.' },
  { icon: FileText, name: 'Pre-qualification lead capture', description: 'Collect key borrower details — employment type, income range, deposit — before any officer time is spent on the enquiry.' },
  { icon: CalendarCheck, name: 'Appointment booking', description: 'Connect to your calendar via Easy!Appointments. Qualified borrowers book mortgage consultations directly from the chat.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot captures enquiries at midnight as well as midday. Never lose a motivated buyer because they researched outside office hours.' },
  { icon: UserCheck, name: 'Officer escalation', description: 'Complex cases and pre-qualified borrowers escalate to the right officer with full intake context — no wasted introduction calls.' },
  { icon: TrendingDown, name: 'Rate FAQ', description: 'Explain your rate types, fixed vs. variable options, and fee structures clearly — helping borrowers understand their options before the call.' },
];
const verticals = [
  { icon: Home, title: 'Residential Mortgages', description: 'Pre-qualify residential purchase and first-time buyer enquiries before your officers spend time on unqualified leads.' },
  { icon: Building, title: 'Commercial Lending', description: 'Handle commercial property finance enquiries and route qualified commercial borrowers to specialist officers.' },
  { icon: RefreshCw, title: 'Remortgage', description: 'Capture remortgage intent from borrowers nearing the end of their fixed term and guide them to the right product.' },
  { icon: Home, title: 'Buy-to-Let', description: 'Answer buy-to-let product FAQ, rental yield requirements, and portfolio landlord enquiries automatically.' },
];

export default function ChatbotForMortgageLendersPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Mortgage Lenders</Badge>
          <H1 className="max-w-4xl mb-6">Borrowers research at all hours. <span className="text-primary-500">Your chatbot can qualify them before your officers pick up the phone.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your products, eligibility criteria, and rate FAQs — so your officers talk to pre-qualified borrowers, not every enquiry that comes through the door.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Lending Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Qualifies borrowers 24/7 &middot; Trained only on your lending content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The lending problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your officers are fielding questions a chatbot could answer first</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t efficient. Because without a pre-qualification layer, every enquiry — qualified or not — consumes the same amount of officer time.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a mortgage lending chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for lenders — not a generic contact form. Every feature is aimed at improving lead quality and reducing time spent on unqualified enquiries.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a mortgage lender using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;Our officers were spending the first half of every call on eligibility basics. VocUI collects all of that before the call — now our conversations start at the right point and close faster.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">G.F. &mdash; Head of Sales, Cornerstone Mortgage Finance</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For mortgage lenders who want their officers focused on qualified borrowers</h2><p className="text-secondary-600 dark:text-secondary-400">If your team is spending time on enquiries a chatbot could pre-qualify, VocUI pays for itself the moment your officers start their day with a pre-qualified pipeline.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate FAQ and application lead capture for mortgage brokers.' },
                { label: 'Chatbot for Real Estate', href: '/chatbot-for-real-estate', description: '24/7 lead capture and viewing bookings for estate agents.' },
                { label: 'Chatbot for Financial Advisors', href: '/chatbot-for-financial-advisors', description: 'Service FAQ and consultation booking for financial advisers.' },
                { label: 'Chatbot for Insurance Agents', href: '/chatbot-for-insurance-agents', description: 'Policy FAQ and quote lead capture for insurance professionals.' },
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
              <h2 className="text-3xl font-bold mb-4">Your officers&apos; time is too valuable for unqualified enquiries</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Pre-qualify borrowers automatically and let your team focus on the cases that will close.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Lending Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
