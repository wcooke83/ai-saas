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
  BookOpen, Clock, UserCheck, Home,
  Building, ShieldCheck, BarChart2, FileText, Layers, ClipboardList,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Mortgage Lenders | Underwriting FAQ & Borrower Pre-Qualification | VocUI',
    description: 'Let an AI chatbot handle underwriting FAQs, loan product questions, and borrower pre-qualification for your mortgage lending business — 24/7. Qualify more borrowers without adding headcount.',
    keywords: ['AI chatbot for mortgage lenders', 'mortgage lender chatbot', 'underwriting FAQ automation', 'borrower pre-qualification chatbot', 'loan product FAQ chatbot'],
    openGraph: { title: 'AI Chatbot for Mortgage Lenders | Underwriting FAQ & Borrower Pre-Qualification | VocUI', description: 'Let an AI chatbot handle underwriting FAQs, loan product questions, and borrower pre-qualification for your mortgage lending business — 24/7. Qualify more borrowers without adding headcount.', url: 'https://vocui.com/chatbot-for-mortgage-lenders', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Mortgage Lenders | Underwriting FAQ & Borrower Pre-Qualification | VocUI', description: 'Let an AI chatbot handle underwriting FAQs, loan product questions, and borrower pre-qualification for your mortgage lending business — 24/7. Qualify more borrowers without adding headcount.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-mortgage-lenders' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Mortgage Lenders', applicationCategory: 'FinanceApplication', operatingSystem: 'Web', description: 'AI chatbot handling underwriting FAQs, loan product questions, and borrower pre-qualification for mortgage lenders — 24/7.', url: 'https://vocui.com/chatbot-for-mortgage-lenders', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Underwriting FAQ (LTV, DTI, credit score)', 'Loan product FAQ (fixed, ARM, jumbo, buy-to-let)', 'Borrower pre-qualification lead capture', '24/7 after-hours availability', 'Loan officer handoff with full context', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot explain your specific loan products — fixed rate, tracker, and offset mortgages?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your product range descriptions and the chatbot explains each option, who it suits, and how it works — without advising on which product a specific borrower should choose."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI pre-qualify borrowers before they reach a loan officer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. It can capture key details — purchase price, deposit, income type — to give your officers context before the first call, reducing time spent on enquiries that cannot proceed."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot explain LTV limits and minimum deposit requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, based on your lending criteria. It answers the threshold questions borrowers ask most — minimum deposit, maximum LTV, credit score requirements — so officers focus on qualified conversations."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle complex income scenarios — self-employed, portfolio landlords, contractors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It captures the enquiry and escalates it to a loan officer with full context. Complex income scenarios require human assessment; the chatbot does not attempt to underwrite them."
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
      "name": "AI Chatbot for Mortgage Lenders",
      "item": "https://vocui.com/chatbot-for-mortgage-lenders"
    }
  ]
};


const trustSignals = ['Pre-qualifies borrowers 24/7', 'Trained only on your lending products', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Loan officers spending time on borrowers who can\'t qualify', body: 'What\'s the minimum credit score? Can I borrow with a 10% deposit? Without a pre-qualification layer, officers field enquiries from everyone before knowing who can actually proceed. The cost is time — and the opportunity cost of cases that could have closed.' },
  { icon: MoonStar, title: 'Loan product confusion at 9pm with no one available', body: 'Borrowers compare fixed vs ARM, try to understand LTV requirements, and ask about jumbo thresholds — in the evening, when no officer is available. Without instant responses, they move to a lender that answered faster.' },
  { icon: AlertCircle, title: 'Complex income enquiries that bottleneck the pipeline', body: 'Self-employed borrowers, multiple income sources, DSCR questions — these take 20 minutes each and your team fields them before knowing if the deal can even be done. A chatbot surfaces the complexity early and routes only viable cases forward.' },
];
const steps = [
  { step: '01', title: 'Train on your products', description: 'Upload your loan products, underwriting criteria, LTV/DTI tables, and application FAQ. Your chatbot becomes a knowledgeable first point of contact trained on your lending standards.' },
  { step: '02', title: 'Configure pre-qualification flows', description: 'Set up borrower profile capture — income type, deposit amount, purchase price — and define escalation rules for complex income scenarios like self-employment or portfolio landlords.' },
  { step: '03', title: 'Deploy and grow your pipeline', description: 'Embed on your website. Borrowers get product clarity and underwriting guidance. Qualified leads reach your officers pre-screened, with their profile already documented.' },
];
const features = [
  { icon: ShieldCheck, name: 'Underwriting FAQ', description: 'Answer LTV limits, DTI thresholds, minimum credit score requirements, and deposit questions automatically — so officers talk to qualified borrowers, not browsers.' },
  { icon: Layers, name: 'Loan product FAQ', description: 'Explain fixed vs ARM rates, jumbo loan thresholds, FHA and buy-to-let criteria clearly — reducing product confusion that stalls the pipeline.' },
  { icon: FileText, name: 'Borrower pre-qualification', description: 'Capture borrower profile details before an officer is involved — income type, deposit amount, purchase price — so every lead arrives partially qualified.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot handles rate and product enquiries at 10pm when borrowers are actively researching. Every captured lead arrives in your pipeline by morning.' },
  { icon: UserCheck, name: 'Loan officer handoff', description: 'Complex scenarios — self-employed income, multiple properties, unusual credit histories — escalate immediately with the full borrower conversation context.' },
  { icon: ClipboardList, name: 'Application FAQ', description: 'Walk borrowers through what documents they need, how long it takes, and what happens after they apply — reducing drop-off between enquiry and application.' },
];
const verticals = [
  { icon: Home, title: 'Residential Mortgages', description: 'Pre-qualify residential purchase and first-time buyer enquiries on LTV, credit, and deposit requirements before your officers spend time on unqualified leads.' },
  { icon: BarChart2, title: 'Buy-to-Let', description: 'Answer buy-to-let LTV requirements, rental yield thresholds, and portfolio landlord criteria — a high-FAQ segment that benefits most from a chatbot first layer.' },
  { icon: Building, title: 'Commercial Lending', description: 'Handle commercial property finance enquiries, DSCR requirements, and loan sizing questions, routing viable cases to specialist officers with context.' },
  { icon: BookOpen, title: 'Specialist & Bridging Finance', description: 'Explain bridging loan criteria, exit strategy requirements, and short-term lending options — complex products where upfront FAQ reduces wasted officer time most.' },
];

export default function ChatbotForMortgageLendersPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Mortgage Lenders</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Mortgage Lenders</Badge>
          <H1 className="max-w-4xl mb-6">Your loan officers should be closing deals, <span className="text-primary-500">not explaining LTV to the wrong borrowers.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI handles borrower pre-qualification, loan product FAQ, and underwriting questions — so your team only talks to borrowers who can actually proceed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Lending Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Pre-qualifies borrowers 24/7 &middot; Trained only on your lending products &middot; GDPR-compliant</p>
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
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Live before your next loan application. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a mortgage lending chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for direct lenders — not a generic contact form. Every feature is aimed at surfacing qualified borrowers and reducing time your officers spend on enquiries that can&apos;t proceed.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How mortgage lenders use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Loan officers spending the first half of every sales call on underwriting basics — LTV limits, credit score thresholds, deposit requirements — before reaching any substantive conversation about a deal that could close.' },
                  { step: 'Setup', text: 'Uploaded their loan product guide, underwriting criteria tables, LTV/DTI FAQ, and application checklist — configured without external development in a single afternoon.' },
                  { step: 'After', text: 'Underwriting basics handled before the first call. Officers receive pre-screened leads with borrower profiles already documented. Pipeline better qualified and faster to close.' },
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For mortgage lenders who want their officers focused on qualified borrowers</h2><p className="text-secondary-600 dark:text-secondary-400">If your team is spending time on enquiries a chatbot could pre-qualify, VocUI pays for itself the moment your officers start their day with a pre-screened pipeline.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Mortgage Brokers', href: '/chatbot-for-mortgage-brokers', description: 'Rate comparison FAQ and application lead capture for mortgage brokers.' },
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
