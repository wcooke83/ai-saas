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
  BookOpen, CalendarCheck, Clock, UserCheck, GraduationCap,
  Globe, Users, Building, Star,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Universities | Admissions FAQ & Course Enquiry Support | VocUI',
    description: 'Let an AI chatbot handle admissions FAQs, course enquiries, and application guidance for your university — 24/7. Support prospective students across every time zone.',
    keywords: ['AI chatbot for universities', 'university admissions chatbot', 'course enquiry automation', 'higher education chatbot'],
    openGraph: { title: 'AI Chatbot for Universities | Admissions FAQ & Course Enquiry Support | VocUI', description: 'Let an AI chatbot handle admissions FAQs, course enquiries, and application guidance for your university — 24/7.', url: 'https://vocui.com/chatbot-for-universities', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Universities | Admissions FAQ & Course Enquiry Support | VocUI', description: 'Let an AI chatbot handle admissions FAQs, course enquiries, and application guidance — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-universities' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Universities', applicationCategory: 'EducationApplication', operatingSystem: 'Web', description: 'AI chatbot handling admissions FAQs, course enquiries, and application guidance for universities — 24/7.', url: 'https://vocui.com/chatbot-for-universities', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Admissions FAQ', 'Course enquiry support', 'Application guidance', '24/7 availability', 'Staff escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about specific degree programmes and entry requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your course catalogue, entry requirement guides, and programme FAQs — and the chatbot answers prospective student questions 24/7, including during peak UCAS application periods when enquiry volume spikes."
      }
    },
    {
      "@type": "Question",
      "name": "Will VocUI help with open day booking and campus visit enquiries?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, via Easy!Appointments. Prospective students can register for open days, book campus tours, and schedule department visits directly from the chat."
      }
    },
    {
      "@type": "Question",
      "name": "Can the chatbot answer questions about student accommodation and fees?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Upload your accommodation options, fee schedules, and bursary/scholarship FAQ — and the chatbot answers these high-volume questions automatically."
      }
    },
    {
      "@type": "Question",
      "name": "How does VocUI handle international student enquiries about visas and English language requirements?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your international entry requirements, English language thresholds, and visa guidance FAQ — and the chatbot answers these questions for prospective students in different time zones who can't call during UK office hours."
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
      "name": "AI Chatbot for Universities",
      "item": "https://vocui.com/chatbot-for-universities"
    }
  ]
};


const trustSignals = ['Supports prospective students 24/7', 'Trained only on your institution content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Admissions teams fielding the same application status questions all day', body: 'Have you received my documents? What\'s the deadline for my course? When will I hear back about my application? These questions consume admissions staff time that should be spent on complex cases and student relationship building.' },
  { icon: Globe, title: 'International students asking at times when no one can respond', body: <span>A prospective student in a different time zone has questions about visa requirements and course content. Without 24/7 support, they turn to a competitor institution that has answers waiting at any hour. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all enquiries arrive outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Prospective students lost in a complex course catalogue', body: 'A student who can\'t find their way through your course options, entry requirements, and application process may simply give up. A chatbot that guides them through the right pathway converts more prospects into applicants.' },
];
const steps = [
  { step: '01', title: 'Train on your institution', description: 'Upload course guides, entry requirements, application FAQs, campus information, and scholarship details. Your chatbot becomes a knowledgeable admissions guide.' },
  { step: '02', title: 'Configure enquiry and guidance flows', description: 'Set up course discovery, application guidance, and open day booking flows. Define escalation for complex decisions that need an admissions officer.' },
  { step: '03', title: 'Deploy and support more applicants', description: 'Embed on your admissions pages. Prospective students get instant, accurate guidance — and those ready to apply are supported through every step.' },
];
const features = [
  { icon: BookOpen, name: 'Admissions FAQ', description: 'Answer entry requirements, application timelines, document checklists, and deadline questions automatically — freeing your admissions team for complex cases.' },
  { icon: CalendarCheck, name: 'Open day and tour booking', description: 'Connect to your calendar via Easy!Appointments. Prospective students book campus visits and open days directly from the chat.' },
  { icon: Globe, name: 'International student support', description: 'Answer visa FAQ, language requirements, and international application process questions at any hour, across any time zone.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot supports prospective students at midnight as well as midday — critical for international enquiries and last-minute application questions.' },
  { icon: UserCheck, name: 'Admissions team escalation', description: 'Complex eligibility questions and exceptional circumstances escalate to the right admissions officer with full conversation context.' },
  { icon: Star, name: 'Course discovery guidance', description: 'Help prospective students find the right course, understand entry routes, and compare programme options — reducing drop-off in the decision process.' },
];
const verticals = [
  { icon: GraduationCap, title: 'Undergraduate Admissions', description: 'Guide applicants through UCAS, entry requirements, and course selection with patience and consistency.' },
  { icon: Star, title: 'Postgraduate Enquiries', description: 'Handle research programme, taught masters, and MBA enquiries with the depth that serious postgraduate applicants expect.' },
  { icon: Globe, title: 'International Students', description: 'Support international applicants with visa FAQ, English language requirements, and application process guidance across time zones.' },
  { icon: Building, title: 'Continuing Education', description: 'Answer part-time, professional development, and short course enquiries from working adults who research outside business hours.' },
];

export default function ChatbotForUniversitiesPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Universities</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Universities</Badge>
          <H1 className="max-w-4xl mb-6">Prospective students have questions at every hour. <span className="text-primary-500">Your chatbot can guide them — even across time zones.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your courses, admissions process, and entry requirements — so prospective students get accurate guidance instantly and your admissions team focuses on the enquiries that genuinely need them.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your University Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Supports prospective students 24/7 &middot; Trained only on your institution content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The admissions problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your admissions team is fielding questions a chatbot could answer</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t capable. Because without a system to handle the same prospective student questions at scale, your most experienced staff spend their day on FAQ, not on the students who need them most.</p></div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">{painPoints.map((p) => { const Icon = p.icon; return (<div key={p.title} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 mb-4"><Icon className="h-5 w-5 text-red-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{p.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{p.body}</p></div>); })}</div>
        </section>
        <section id="how-it-works" className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">How it works</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">Live before your next admissions enquiry. No developers needed.</h2></div>
            <div className="grid gap-10 md:grid-cols-3 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-secondary-200 dark:bg-secondary-700" aria-hidden="true" />
              {steps.map((s) => (<div key={s.step} className="relative text-center flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center mb-6 z-10 shadow-lg shadow-primary-500/25">{s.step}</div><h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">{s.title}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xs">{s.description}</p></div>))}
            </div>
            <div className="text-center mt-14"><Button size="xl" asChild><Link href="/signup">Start Building Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a university admissions chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for higher education — not a generic FAQ page. Every feature is aimed at guiding more prospects to application and supporting your admissions team with relevant context.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        {/* ── How Businesses Use VocUI ────────────────────────────────────────── */}
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">How university admissions teams use VocUI</Badge>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  A typical week, before and after VocUI
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { step: 'Before', text: 'Admissions officers spending hours each week answering repeated questions about entry requirements, application deadlines, and course content — at the expense of meaningful one-to-one student support.' },
                  { step: 'Setup', text: 'Uploaded their prospectus, entry requirement guide, application deadline FAQ, and student support overview — configured by the admissions team without IT involvement.' },
                  { step: 'After', text: 'Entry and deadline questions answered automatically, any time. Officers focused on students who need personal guidance. Application enquiry volume handled at scale.' },
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For universities that want their admissions team focused on high-value student interactions</h2><p className="text-secondary-600 dark:text-secondary-400">If your admissions officers are handling FAQ a chatbot could answer, VocUI pays for itself the moment your team gets their first day free of repetitive enquiries.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Tutoring Centers', href: '/chatbot-for-tutoring-centers', description: 'Subject FAQ and enrollment booking for tutoring businesses.' },
                { label: 'Chatbot for Online Course Creators', href: '/chatbot-for-online-courses', description: 'Course FAQ and enrollment lead capture for e-learning creators.' },
                { label: 'Chatbot for Non-Profits', href: '/chatbot-for-nonprofits', description: 'Donation FAQ and volunteer intake for charities and non-profits.' },
                { label: 'Chatbot for Government Agencies', href: '/chatbot-for-government', description: 'Services FAQ and document request guidance for public bodies.' },
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
              <h2 className="text-3xl font-bold mb-4">Your admissions team deserves to focus on students, not FAQ</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give prospective students instant guidance and let your officers focus on the conversations that actually move the needle.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your University Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                <Button size="xl" variant="outline-light" asChild><Link href="/pricing">See Pricing</Link></Button>
              </div>
            </div>
          </div>
        </section>
      
          {/* Related Blog Post */}
          <div className="mt-6 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">Related reading</p>
            <Link href="/blog/chatbot-for-education" className="font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              AI Chatbots for Education: Automate Student FAQs →
            </Link>
          </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
