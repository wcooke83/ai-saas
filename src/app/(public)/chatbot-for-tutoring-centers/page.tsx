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
  Calculator, FlaskConical, Star, BookMarked,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return {
    title: 'AI Chatbot for Tutoring Centers | Subject FAQ & Enrollment Booking | VocUI',
    description: 'Let an AI chatbot handle subject FAQs, enrollment enquiries, and session booking for your tutoring center — 24/7. Keep tutors focused on teaching, not answering the phone.',
    keywords: ['AI chatbot for tutoring centers', 'tutoring chatbot', 'enrollment booking automation', 'tutoring FAQ chatbot'],
    openGraph: { title: 'AI Chatbot for Tutoring Centers | Subject FAQ & Enrollment Booking | VocUI', description: 'Let an AI chatbot handle subject FAQs, enrollment enquiries, and session booking for your tutoring center — 24/7.', url: 'https://vocui.com/chatbot-for-tutoring-centers', siteName: 'VocUI', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'AI Chatbot for Tutoring Centers | Subject FAQ & Enrollment Booking | VocUI', description: 'Let an AI chatbot handle subject FAQs, enrollment enquiries, and session booking for your tutoring center — 24/7.' },
    alternates: { canonical: 'https://vocui.com/chatbot-for-tutoring-centers' },
    robots: { index: true, follow: true },
  };
}

const jsonLd = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'VocUI — AI Chatbot for Tutoring Centers', applicationCategory: 'EducationApplication', operatingSystem: 'Web', description: 'AI chatbot handling subject FAQs, enrollment enquiries, and session booking for tutoring centers — 24/7.', url: 'https://vocui.com/chatbot-for-tutoring-centers', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan available' }, featureList: ['Subject and tutor FAQ', 'Enrollment booking', 'Pricing FAQ', '24/7 availability', 'Staff escalation', 'GDPR-compliant data handling'] };

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What can VocUI's AI chatbot do for Tutoring Centers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Let an AI chatbot handle subject FAQs, enrollment enquiries, and session booking for your tutoring center \u2014 24/7. Keep tutors focused on teaching, not answering the phone."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to set up VocUI for Tutoring Centers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most Tutoring Centers get set up in under an hour. Upload your existing content -- service descriptions, FAQs, pricing pages, or PDFs -- and VocUI trains the chatbot automatically. Embed it on your website with a single snippet."
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
      "name": "How is VocUI different from a generic chatbot for Tutoring Centers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike generic chatbots, VocUI is trained exclusively on your own content -- your service descriptions, policies, FAQs, and documents. It only answers questions relevant to your Tutoring Centers business and escalates to your team when it cannot help, with full conversation context included."
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
      "name": "AI Chatbot for Tutoring Centers",
      "item": "https://vocui.com/chatbot-for-tutoring-centers"
    }
  ]
};


const trustSignals = ['Answers parent enquiries 24/7', 'Trained only on your center content', 'GDPR-compliant data handling'];
const painPoints: Array<{ icon: ElementType; title: string; body: ReactNode }> = [
  { icon: Phone, title: 'Parents calling during sessions to ask which tutor covers which subject', body: 'Do you cover A-level Chemistry? Is there a tutor who specialises in GCSE Maths? When can my child start? These calls arrive when your tutors are mid-session and your admin team is stretched thin.' },
  { icon: MoonStar, title: 'Enrollment enquiries arriving after hours when no one can respond', body: <span>Parents often research tutoring options in the evenings. Without instant answers about availability and pricing, they contact three centers and go with whoever responds first the next morning. <a href="https://www.salesloft.com/resources/guides/conversational-ai-marketing-trends-report" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary-500 transition-colors">41% of all meetings are booked outside standard business hours.</a></span> },
  { icon: AlertCircle, title: 'Pricing questions blocking sign-ups before they happen', body: 'Parents who aren\'t sure what tutoring costs often don\'t call to ask — they look elsewhere. A chatbot that answers pricing clearly removes that barrier and converts more browsers into enrolled students.' },
];
const steps = [
  { step: '01', title: 'Train on your center', description: 'Upload your subject list, tutor profiles, pricing tiers, and enrollment guides. Your chatbot becomes the first point of contact for every parent enquiry.' },
  { step: '02', title: 'Configure enrollment flows', description: 'Set up enrollment booking and free trial session sign-ups. Define which questions need a tutor\'s personal input.' },
  { step: '03', title: 'Deploy and fill your timetable', description: 'Embed on your website. Parents get instant answers; those ready to enroll book directly into your sessions calendar.' },
];
const features = [
  { icon: BookOpen, name: 'Subject and tutor FAQ', description: 'Answer questions about every subject you cover, which tutors specialise in what, and appropriate age or level recommendations.' },
  { icon: CalendarCheck, name: 'Enrollment and trial booking', description: 'Connect to your calendar via Easy!Appointments. Parents book enrollment sessions and free trials directly from the chat.' },
  { icon: Star, name: 'Pricing FAQ', description: 'Explain your pricing structure clearly — per session, monthly packages, or intensive programmes — removing the friction between interest and sign-up.' },
  { icon: Clock, name: 'After-hours availability', description: 'Your chatbot answers parent enquiries at 11pm as well as 11am. Never lose an enrollment because a parent reached out outside office hours.' },
  { icon: UserCheck, name: 'Staff escalation', description: 'Complex educational assessments and specific learning needs are escalated to the right tutor with full context.' },
  { icon: GraduationCap, name: 'Exam prep FAQ', description: 'Answer questions about exam boards, revision techniques, and intensive preparation programmes — helping parents choose the right support.' },
];
const verticals = [
  { icon: BookMarked, title: 'GCSE & A-Level', description: 'Handle subject enquiries and enrollment for exam-focused students with the urgency parents expect.' },
  { icon: Star, title: 'Primary & Junior', description: 'Answer worried parent questions about learning foundations and book assessment sessions with care.' },
  { icon: GraduationCap, title: 'University Prep', description: 'Handle UCAS guidance, entrance exam prep, and personal statement support enquiries efficiently.' },
  { icon: Calculator, name: 'STEM Specialist', description: 'Answer specialist Maths, Science, and Engineering tutor questions and match students to the right expert.' },
];

export default function ChatbotForTutoringCentersPage() {
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
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">AI Chatbot for Tutoring Centers</li>
          </ol>
        </nav>

        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center">
          <Badge className="mb-6">AI Chatbot for Tutoring Centers</Badge>
          <H1 className="max-w-4xl mb-6">Parents have questions at every hour. <span className="text-primary-500">Your chatbot can answer them so your tutors don&apos;t have to.</span></H1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600 dark:text-secondary-400 mb-10">VocUI trains on your subjects, tutors, and pricing — so parents get instant answers and can enroll their children without waiting for a callback.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild><Link href="/signup">Build Your Tutoring Chatbot Free<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            <Button size="xl" variant="outline" asChild><Link href="/pricing">See Pricing</Link></Button>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">Answers parent enquiries 24/7 &middot; Trained only on your center content &middot; GDPR-compliant</p>
        </section>
        <section className="border-y border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 py-6">
          <div className="container mx-auto px-4"><div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{trustSignals.map((signal) => (<div key={signal} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" /><span>{signal}</span></div>))}</div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">The enrollment problem</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Your tutors are answering questions a chatbot could handle</h2><p className="text-secondary-600 dark:text-secondary-400">Not because your team isn&apos;t responsive. Because without a system to handle parent enquiries automatically, every question interrupts someone who should be teaching.</p></div>
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
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Features</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">Everything a tutoring center chatbot actually needs</h2><p className="text-secondary-600 dark:text-secondary-400">Built for tutoring centers — not a generic FAQ page. Every feature is aimed at converting parent enquiries into enrolled students.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">{features.map((f) => { const Icon = f.icon; return (<div key={f.name} className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl p-6 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/50 mb-4"><Icon className="h-4 w-4 text-primary-500" aria-hidden="true" /></div><h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">{f.name}</h3><p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">{f.description}</p></div>); })}</div>
        </section>
        <section className="bg-secondary-50 dark:bg-secondary-800/30 py-24">
          <div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Badge variant="outline" className="mb-8">From a tutoring center using VocUI</Badge><blockquote className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 leading-snug mb-6">&ldquo;Parents were emailing us in the evening and not getting a reply until the next afternoon. By then they&apos;d already enrolled somewhere else. VocUI answers those evening enquiries instantly — our enrollment numbers have been consistently up since we added it.&rdquo;</blockquote><p className="text-secondary-500 dark:text-secondary-400 text-sm">H.T. &mdash; Principal, Achieve Tutoring Centre</p></div></div>
        </section>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16"><Badge variant="outline" className="mb-4">Who it&apos;s for</Badge><h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">For tutoring centers that want their tutors focused on teaching</h2><p className="text-secondary-600 dark:text-secondary-400">If your tutors and admin team are handling enquiries a chatbot could answer, VocUI pays for itself the moment your first evening enrollment comes in without anyone being there to take the call.</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">{verticals.map((v) => { const Icon = v.icon; return (<Card key={v.title} className="border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 text-center"><CardHeader className="pb-2"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/50 mx-auto mb-3"><Icon className="h-6 w-6 text-primary-500" aria-hidden="true" /></div><CardTitle className="text-base leading-snug">{v.title}</CardTitle></CardHeader><CardContent><p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">{v.description}</p></CardContent></Card>); })}</div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Related industries</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Chatbot for Universities', href: '/chatbot-for-universities', description: 'Admissions FAQ and course inquiry support for higher education.' },
                { label: 'Chatbot for Online Course Creators', href: '/chatbot-for-online-courses', description: 'Course FAQ and enrollment lead capture for e-learning creators.' },
                { label: 'Chatbot for Non-Profits', href: '/chatbot-for-nonprofits', description: 'Donation FAQ and volunteer intake for charities and non-profits.' },
                { label: 'Chatbot for Churches', href: '/chatbot-for-churches', description: 'Service times FAQ and event registration for faith communities.' },
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
              <h2 className="text-3xl font-bold mb-4">Your tutors&apos; time is too valuable for admin enquiries</h2>
              <p className="text-lg text-white/80 mb-2 max-w-xl mx-auto">Give parents instant answers and let your tutors focus on the students already in front of them.</p>
              <p className="text-sm text-white/60 mb-10">Free plan available &middot; No credit card required &middot; Live in under an hour</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50 font-semibold" asChild><Link href="/signup">Build Your Tutoring Chatbot Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
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
