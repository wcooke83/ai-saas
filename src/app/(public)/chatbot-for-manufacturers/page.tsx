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
  BookOpen, CalendarCheck, Clock, UserCheck, Factory,
  Package, Settings, ShoppingCart, FileText,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Manufacturers | Product Spec FAQ & Distributor Lead Capture | VocUI',
    description: 'Let an AI chatbot handle product spec FAQs, distributor lead capture, and compliance enquiries for your manufacturing business — 24/7. Let your sales team focus on qualified buyers.',
    keywords: ['AI chatbot for manufacturers', 'manufacturing chatbot', 'product spec FAQ automation', 'distributor lead capture chatbot'],
    openGraph: { title: 'AI Chatbot for Manufacturers | Product Spec FAQ & Distributor Lead Capture | VocUI', description: 'Let an AI chatbot handle product spec FAQs, distributor lead capture, and compliance enquiries — 24/7.', url: 'https://vocui.com/chatbot-for-manufacturers', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Manufacturers | Product Spec FAQ & Distributor Lead Capture | VocUI', description: 'Let an AI chatbot handle product spec FAQs, distributor lead capture, and compliance enquiries — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-manufacturers' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Manufacturers', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: 'AI chatbot handling product spec FAQs, distributor lead capture, and compliance enquiries for manufacturers — 24/7.', url: 'https://vocui.com/chatbot-for-manufacturers', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Product spec FAQ', 'Distributor lead capture', 'Compliance FAQ', '24/7 availability', 'Sales escalation', 'GDPR-compliant data handling'] };
const trustSignals = ['Answers product queries 24/7', 'Trained only on your product content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Sales team fielding spec sheet questions that should be self-service', body: 'What are the dimensions? What certifications does it carry? What\'s the lead time? These questions come from buyers who should be able to find answers in your documentation — but can\'t navigate it easily enough, so they call instead.' },
  { icon: MoonStar, title: 'Distributor and OEM enquiries lost after business hours', body: <span>A procurement manager identifies your product as a fit at 7pm. Without instant answers about MOQ, lead times, and distributor terms, they add three other suppliers to their evaluation list by morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Compliance and certification questions consuming specialist time', body: 'The same regulatory, safety, and certification questions arrive from every new buyer. Without a way to answer them automatically from your documentation, your specialist team becomes a first-line FAQ service.' },
];
const steps = [
  { step: '01', title: 'Train on your products', description: 'Upload spec sheets, compliance documents, lead time guides, and distributor FAQs. Your chatbot becomes a 24/7 product information resource.' },
  { step: '02', title: 'Configure lead capture flows', description: 'Define the questions that identify serious distributor and OEM enquiries — volume, region, application. Collect this before your sales team engages.' },
  { step: '03', title: 'Deploy and improve lead quality', description: 'Embed on your product pages. Buyers get instant spec answers; serious distributors enter your pipeline with their requirements already documented.' },
];
const features = [
  { icon: BookOpen, name: 'Product spec FAQ', description: 'Answer technical specifications, dimensions, materials, and performance questions directly from your documentation — without sales team involvement.' },
  { icon: ShoppingCart, name: 'Distributor lead capture', description: 'Collect region, volume, application, and timeline details from potential distributors before your sales team takes a single call.' },
  { icon: FileText, name: 'Compliance and certification FAQ', description: 'Answer CE, ISO, and safety certification questions automatically — freeing your compliance team for the enquiries that genuinely need them.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot answers product enquiries at midnight as well as midday. Capture every serious buyer, regardless of time zone.' },
  { icon: UserCheck, name: 'Sales team escalation', description: 'Qualified distributors and OEM enquiries escalate to your sales team with full context — no cold introductions.' },
  { icon: Settings, name: 'Sample request intake', description: 'Collect product, quantity, and application details for sample requests before your team processes them — reducing admin overhead.' },
];
const verticals = [
  { icon: Factory, title: 'Industrial Equipment', description: 'Handle spec, certification, and lead time enquiries for complex industrial products automatically.' },
  { icon: Package, title: 'Consumer Goods', description: 'Answer product FAQ, retailer enquiries, and compliance questions for consumer product lines.' },
  { icon: Settings, title: 'Component Supply', description: 'Handle OEM and engineering enquiries, spec matching requests, and volume lead capture automatically.' },
  { icon: ShoppingCart, title: 'Custom Manufacturing', description: 'Qualify custom project enquiries, collect specifications, and route serious buyers to your engineering team.' },
];

export default function ChatbotForManufacturersPage() {
  return (
    <PageBackground>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main-content">
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Manufacturers</Badge>
          <H1 className="max-w-4xl mb-6">Buyers have spec questions before they commit. <span className="text-primary-500">Your chatbot can answer them — instantly, from your own documentation.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your product specs, compliance documents, and distributor FAQs — so your sales team focuses on qualified buyers, not routine product enquiries.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Manufacturing Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers product queries 24/7 &middot; Trained only on your product content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The sales problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your sales team is handling enquiries a chatbot could answer first</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your sales team isn&apos;t productive. Because without automated spec and compliance FAQ, every enquiry — serious or exploratory — consumes the same amount of time.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a manufacturing chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for manufacturers — not a generic FAQ page. Every feature reduces pre-sales friction and improves distributor lead quality.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a manufacturer using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;Our sales engineers were spending hours every week on spec questions that were already answered in our documentation. VocUI now handles those — our team focuses on applications that need real expertise, and our distributor pipeline is stronger.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">P.J. &mdash; Sales Director, Castleton Industrial</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For manufacturers who want their sales team focused on closing, not fielding spec questions</h2><p className="text-secondary-600 dark:text-secondary-400">If your sales team is answering questions a chatbot could handle from your own documentation, VocUI pays for itself the moment your first qualified distributor enquiry arrives pre-documented.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Logistics Companies', href: '/chatbot-for-logistics', description: 'Shipment tracking FAQ and quote requests for logistics businesses.' },
                { label: 'Chatbot for Wholesale Suppliers', href: '/chatbot-for-wholesale', description: 'Product FAQ and bulk order lead capture for wholesale businesses.' },
                { label: 'Chatbot for E-commerce', href: '/chatbot-for-ecommerce', description: 'Product Q&A and support deflection for online retailers.' },
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
              <h2 className="text-3xl font-bold mb-4">Your product knowledge is already documented. Now make it available 24/7.</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Train your chatbot on your spec sheets and compliance docs — give buyers instant answers and your team better leads.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Manufacturing Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
