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
  BookOpen, CalendarCheck, Clock, UserCheck, Truck,
  Package, Globe, Warehouse, FileText,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Logistics Companies | Shipment FAQ & Quote Requests | VocUI',
    description: 'Let an AI chatbot handle shipment tracking FAQs, quote requests, and customer service enquiries for your logistics business — 24/7. Reduce call volume and focus on moving cargo.',
    keywords: ['AI chatbot for logistics', 'logistics chatbot', 'shipment tracking FAQ automation', 'freight quote chatbot'],
    openGraph: { title: 'AI Chatbot for Logistics Companies | Shipment FAQ & Quote Requests | VocUI', description: 'Let an AI chatbot handle shipment FAQs, quote requests, and customer service enquiries for your logistics business — 24/7.', url: 'https://vocui.com/chatbot-for-logistics', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Logistics Companies | Shipment FAQ & Quote Requests | VocUI', description: 'Let an AI chatbot handle shipment FAQs, quote requests, and customer service enquiries — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-logistics' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Logistics Companies', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: 'AI chatbot handling shipment FAQs, quote requests, and customer service for logistics companies — 24/7.', url: 'https://vocui.com/chatbot-for-logistics', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Shipment FAQ', 'Quote request intake', 'Tracking guidance', '24/7 availability', 'Ops team escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Logistics Companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle shipment tracking FAQs, quote requests, and customer service enquiries for your logistics business \u2014 24/7. Reduce call volume and focus on moving cargo."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Logistics Companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Logistics Companies get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Logistics Companies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Logistics Companies business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Logistics Companies",
      "item": "https://vocui.com/chatbot-for-logistics"
    }
  ]
};


const trustSignals = ['Answers customer queries 24/7', 'Trained only on your operations content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Customer service buried in tracking update calls', body: 'Where is my shipment? Why is it delayed? What time will it arrive? These calls arrive all day and eat up the time your customer service team should be spending on exceptions and relationships.' },
  { icon: MoonStar, title: 'Quote requests from new clients sitting in email overnight', body: <span>A logistics manager at a potential new client submits a quote request at 5pm. Without an instant acknowledgement and initial information, they've sent the same request to three competitors by the time you open in the morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'After-hours shipment queries with no self-service option', body: 'Cargo moves around the clock. When customers have questions outside your business hours and can\'t get answers, it erodes confidence in your service — even when the operation itself is running smoothly.' },
];
const steps = [
  { step: '01', title: 'Train on your operations', description: 'Upload your service descriptions, transit times, coverage areas, and process FAQs. Your chatbot becomes a knowledgeable first point of customer contact.' },
  { step: '02', title: 'Configure quote and enquiry flows', description: 'Set up quote request intake and service enquiry flows. Define escalation for complex routing and exception cases your ops team needs to handle.' },
  { step: '03', title: 'Deploy and reduce support volume', description: 'Embed on your website. Customers get instant answers; new client leads arrive with shipment details already documented.' },
];
const features = [
  { icon: BookOpen, name: 'Shipment and service FAQ', description: 'Answer questions about transit times, coverage areas, tracking processes, and service tiers automatically — reducing inbound call volume.' },
  { icon: FileText, name: 'Quote request intake', description: 'Collect origin, destination, cargo type, and volume details upfront — so every quote request your team sees is already half-complete.' },
  { icon: Package, name: 'Tracking guidance', description: 'Guide customers through your tracking portal and provide process updates automatically — without your customer service team being tied up on calls.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot answers queries at midnight as well as midday. Provide service around the clock, even when your office is closed.' },
  { icon: UserCheck, name: 'Ops team escalation', description: 'Exceptions, delays, and complex routing questions escalate to the right person with full context — ensuring fast resolution when it matters most.' },
  { icon: Globe, name: 'Service area FAQ', description: 'Answer coverage, customs, and international shipping questions automatically — helping customers understand your capabilities before they enquire.' },
];
const verticals = [
  { icon: Truck, title: 'Freight & Haulage', description: 'Handle freight enquiries, quote requests, and transit FAQ without tying up your customer service team.' },
  { icon: Package, title: 'Last-Mile Delivery', description: 'Answer delivery window questions, failed attempt queries, and redelivery requests automatically.' },
  { icon: Warehouse, title: 'Warehousing', description: 'Handle storage enquiry, capacity FAQ, and inbound/outbound process questions from clients automatically.' },
  { icon: Globe, title: 'International Shipping', description: 'Answer customs documentation, duty FAQ, and international transit questions that arrive across time zones.' },
];

export default function ChatbotForLogisticsPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Logistics Companies</Badge>
          <H1 className="max-w-4xl mb-6">Cargo moves around the clock. <span className="text-primary-500">Your customer service chatbot should too.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your services, routes, and process FAQs — so your customer service team handles exceptions, not the same tracking questions that arrive every single day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Logistics Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers customer queries 24/7 &middot; Trained only on your operations content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The logistics problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your team is answering questions a chatbot could handle</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your customer service is poor. Because without automated first-contact support, your team handles the same routine questions instead of the exceptions that actually need them.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a logistics chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for logistics operations — not a generic FAQ page. Every feature reduces routine customer service volume so your team handles what matters.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a logistics company using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;Our customer service team was spending half their day on tracking questions that could easily be self-served. VocUI handles those automatically — our team now focuses on the exceptions that actually need human judgement.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">B.O. &mdash; Operations Director, Meridian Freight Services</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For logistics companies that want their team focused on moving cargo, not answering phones</h2><p className="text-secondary-600 dark:text-secondary-400">If your customer service team is fielding questions a chatbot could answer, VocUI pays for itself the moment your team handles their first exception-only workday.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
                { label: 'Chatbot for Manufacturers', href: '/chatbot-for-manufacturers', description: 'Product spec FAQ and distributor lead capture for manufacturers.' },
                { label: 'Chatbot for Wholesale Suppliers', href: '/chatbot-for-wholesale', description: 'Product FAQ and bulk order lead capture for wholesale businesses.' },
                { label: 'Chatbot for Auto Repair', href: '/chatbot-for-auto-repair', description: 'Service booking and repair FAQ for auto repair shops.' },
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
              <h2 className="text-3xl font-bold mb-4">Your customer service team is too valuable for routine tracking calls</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Let your chatbot handle the FAQ so your team focuses on the exceptions that need real expertise.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Logistics Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
