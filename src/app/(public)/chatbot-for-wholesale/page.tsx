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
  BookOpen, CalendarCheck, Clock, UserCheck, ShoppingCart,
  Package, Truck, Store, FileText,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Wholesale Suppliers | Product FAQ & Bulk Order Lead Capture | VocUI',
    description: 'Let an AI chatbot handle product FAQs, bulk order lead capture, and MOQ enquiries for your wholesale business — 24/7. Focus on your best buyers, not routine catalogue questions.',
    keywords: ['AI chatbot for wholesale suppliers', 'wholesale chatbot', 'bulk order lead capture', 'MOQ FAQ automation'],
    openGraph: { title: 'AI Chatbot for Wholesale Suppliers | Product FAQ & Bulk Order Lead Capture | VocUI', description: 'Let an AI chatbot handle product FAQs, bulk order lead capture, and MOQ enquiries — 24/7.', url: 'https://vocui.com/chatbot-for-wholesale', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Wholesale Suppliers | Product FAQ & Bulk Order Lead Capture | VocUI', description: 'Let an AI chatbot handle product FAQs, bulk order lead capture, and MOQ enquiries — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-wholesale' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Wholesale Suppliers', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: 'AI chatbot handling product FAQs, bulk order lead capture, and MOQ enquiries for wholesale suppliers — 24/7.', url: 'https://vocui.com/chatbot-for-wholesale', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Product FAQ', 'Bulk order lead capture', 'MOQ FAQ', '24/7 availability', 'Account manager escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about minimum order quantities and trade account terms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your MOQ requirements, payment terms, and trade account application process — and the chatbot answers these questions automatically for prospective stockists and existing accounts."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI handle product specification and availability enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your product catalogue, key specifications, and stock availability guidance — and the chatbot answers product questions without your sales team being involved in every enquiry."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot handle new trade account enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It explains your trade account requirements, how to apply, and what benefits accounts receive — capturing qualified trade enquiries before your sales team follows up."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle questions about lead times and delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your standard lead times and delivery terms, and the chatbot answers these questions automatically — reducing the volume of pre-order enquiries your team fields daily."
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
      "name": "AI Chatbot for Wholesale Suppliers",
      "item": "https://vocui.com/chatbot-for-wholesale"
    }
  ]
};


const trustSignals = ['Answers buyer queries 24/7', 'Trained only on your catalogue content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Account managers fielding the same MOQ and pricing questions from every new prospect', body: 'What\'s the minimum order? Do you offer volume discounts? Can I mix SKUs? These questions arrive before any real business conversation — and they eat up your team\'s time every single week.' },
  { icon: MoonStar, title: 'Bulk order enquiries outside business hours going cold', body: <span>A buyer researching wholesale options at 6pm has questions. Without instant answers, they contact three more suppliers by morning and you're competing for attention you could have captured first. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of B2B meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'A product catalogue too large to navigate without help', body: 'Buyers who can\'t find their way through a large catalogue often don\'t enquire at all. A chatbot that guides buyers to the right products and pricing information converts more browsers into buyers.' },
];
const steps = [
  { step: '01', title: 'Train on your catalogue', description: 'Upload your product range, MOQ tiers, pricing structures, and account FAQ. Your chatbot becomes a 24/7 trade buyer resource.' },
  { step: '02', title: 'Configure lead capture flows', description: 'Define the questions that identify serious bulk buyers — product interest, order volume, region. Collect this before your account managers engage.' },
  { step: '03', title: 'Deploy and qualify trade enquiries', description: 'Embed on your trade portal or website. Buyers get instant product answers; serious bulk buyers enter your pipeline pre-documented.' },
];
const features = [
  { icon: BookOpen, name: 'Product and catalogue FAQ', description: 'Answer questions about your product range, availability, and specifications automatically — helping buyers navigate your catalogue without calling.' },
  { icon: ShoppingCart, name: 'Bulk order lead capture', description: 'Collect product interest, target volume, and timeline from bulk buyers before your account managers take the conversation.' },
  { icon: FileText, name: 'MOQ and pricing FAQ', description: 'Explain your minimum order quantities, volume discount tiers, and pricing structures clearly — removing the most common pre-purchase friction.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot captures bulk buyer enquiries at any hour. Never lose a serious trade enquiry because your office was closed.' },
  { icon: UserCheck, name: 'Account manager escalation', description: 'Serious bulk buyers escalate to the right account manager with full product interest and volume context ready.' },
  { icon: Truck, name: 'Delivery and terms FAQ', description: 'Answer delivery lead times, shipping terms, and payment condition questions automatically — accelerating the path to first order.' },
];
const verticals = [
  { icon: Package, title: 'Food & Beverage', description: 'Handle trade buyer enquiries, MOQ questions, and shelf-life FAQ for food wholesale buyers.' },
  { icon: Store, title: 'Consumer Goods', description: 'Answer retail buyer questions about your product range, pricing, and trade terms automatically.' },
  { icon: Truck, title: 'Industrial Supplies', description: 'Handle trade account enquiries, volume pricing questions, and product specification FAQ.' },
  { icon: ShoppingCart, title: 'Trade & B2B', description: 'Qualify B2B buyers, answer account opening FAQ, and route serious enquiries to the right account manager.' },
];

export default function ChatbotForWholesalePage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Wholesale Suppliers</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Wholesale Suppliers</Badge>
          <H1 className="max-w-4xl mb-6">Trade buyers want answers before they order. <span className="text-primary-500">Your chatbot can provide them instantly, any time of day.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your product catalogue, MOQ tiers, and pricing FAQ — so your account managers focus on buyers who are ready to order, not on fielding the same catalogue questions every week.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Wholesale Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers buyer queries 24/7 &middot; Trained only on your catalogue content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The wholesale problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your team is answering questions a chatbot could handle first</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your account managers aren&apos;t productive. Because without automated first-contact support, the same MOQ and pricing questions consume time that should be spent on accounts that are ready to order.</p></div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">{painPoints.map((p) => { const Icon = p.icon; return (<div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4"><Icon className="h-5 w-5 text-red-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p></div>); })}</div>
        </section>
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Live before your next trade enquiry. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a wholesale chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for wholesale operations — not a generic FAQ page. Every feature reduces pre-sales friction and improves the quality of enquiries your team receives.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How wholesale businesses use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Sales team fielding minimum order, lead time, and product specification questions from new trade customers all day' },
                  { step: 'Setup', text: 'Uploaded product catalogue, minimum order requirements, lead times, and trade account FAQ' },
                  { step: 'After', text: 'New trade enquiries pre-qualified before reaching the sales team. Fewer quotes sent to non-buyers.' },
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For wholesale suppliers who want their team focused on high-value accounts</h2><p className="text-secondary-600 dark:text-secondary-400">If your account managers are answering questions a chatbot could handle from your own catalogue, VocUI pays for itself the moment your team stops fielding MOQ questions and starts closing orders.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Manufacturers', href: '/chatbot-for-manufacturers', description: 'Product spec FAQ and distributor lead capture for manufacturers.' },
                { label: 'Chatbot for Logistics Companies', href: '/chatbot-for-logistics', description: 'Shipment tracking FAQ and quote requests for logistics businesses.' },
                { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
                { label: 'Chatbot for SaaS Companies', href: '/chatbot-for-saas', description: 'Product FAQ and trial lead capture for SaaS businesses.' },
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
              <h2 className="text-3xl font-bold mb-4">Your catalogue knowledge is already there. Make it available 24/7.</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Train your chatbot on your trade pack and give buyers instant answers — so your team focuses on orders, not FAQ.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Wholesale Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
