import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';
import { ChatPreview, IndustryStatBar } from '@/components/blog/industry-visuals';
import { StyledBulletList } from '@/components/blog/styled-lists';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbot for Healthcare: Answering Patient Questions Without Medical Advice | VocUI',
  description:
    'How healthcare providers use AI chatbots to reduce administrative phone volume, answer patient FAQs, and book appointments — while keeping clinical questions with clinical staff.',
  openGraph: {
    title: 'AI Chatbot for Healthcare: Answering Patient Questions Without Medical Advice | VocUI',
    description:
      'How healthcare providers use AI chatbots to reduce administrative phone volume, answer patient FAQs, and book appointments — while keeping clinical questions with clinical staff.',
    url: 'https://vocui.com/blog/chatbot-for-healthcare',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for Healthcare: Answering Patient Questions Without Medical Advice | VocUI',
    description:
      'How healthcare providers use AI chatbots to reduce administrative phone volume, answer patient FAQs, and book appointments — while keeping clinical questions with clinical staff.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-healthcare' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot for Healthcare: Answering Patient Questions Without Giving Medical Advice',
      description:
        'How healthcare providers use AI chatbots to reduce administrative phone volume, answer patient FAQs, and book appointments — while keeping clinical questions with clinical staff.',
      url: 'https://vocui.com/blog/chatbot-for-healthcare',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-healthcare',
      },
      datePublished: '2026-04-02',
      dateModified: '2026-04-02',
      author: VOCUI_AUTHOR,
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vocui.com/icon.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do we stop the chatbot from giving medical advice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This is controlled through the system prompt. You write clear instructions that the chatbot must follow: "Do not diagnose conditions, recommend treatments, or interpret symptoms. If a patient asks clinical questions, always direct them to contact a clinician or call the practice." When paired with a knowledge base that covers only administrative and logistical content, the chatbot naturally answers what it knows and defers what it does not. Test it regularly with clinical questions to verify it redirects appropriately.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is patient data safe with an AI chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Do not configure your chatbot to collect sensitive patient health information in chat. Keep it to administrative data: name, preferred contact number, appointment request, and general enquiry category. VocUI stores conversation data securely and does not use it to train AI models. For practices subject to GDPR, review your privacy notice and consider whether your chatbot interactions need to be mentioned. Avoid asking for NHS numbers, date of birth, or clinical details through the chat interface.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can it handle appointment booking directly?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, if you integrate with a booking system. VocUI connects with Easy!Appointments, which allows patients to select appointment types and available slots directly through the chatbot conversation. For practices using other systems, the chatbot can explain the booking process, share the relevant link, or capture appointment request details for reception staff to confirm. Either approach significantly reduces inbound call volume for routine booking requests.',
          },
        },
        {
          '@type': 'Question',
          name: 'What about patients who are not confident using chat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Include your phone number and contact options prominently in your chatbot responses. Configure the chatbot to offer the phone number unprompted when answering questions from older patients or those with complex needs. The chatbot supplements your phone line rather than replacing it — patients who prefer to call still can, and those comfortable with chat get faster service. This typically reduces total phone volume by handling the simpler enquiries digitally.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'AI Chatbot for Healthcare: Answering Patient Questions Without Giving Medical Advice',
          item: 'https://vocui.com/blog/chatbot-for-healthcare',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHealthcarePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 flex-wrap">
              <li>
                <Link href="/" className="hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                Chatbot for Healthcare
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Use Case
                </span>
                <time dateTime="2026-04-02" className="text-xs text-secondary-400 dark:text-secondary-500">Apr 2, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  9 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbot for Healthcare: Answering Patient Questions Without Giving Medical Advice
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Reception teams at GP practices, clinics, and allied health providers handle
                hundreds of calls per week. Roughly half of them are questions that have
                nothing to do with clinical care: what time do you open, how do I book a
                blood test, what should I bring to my appointment? An AI chatbot handles
                these questions instantly, freeing reception staff to focus on patients
                who genuinely need human attention.
              </p>
            </div>

            <IndustryStatBar
              stats={[
                { value: '30%', label: 'of calls are admin queries only' },
                { value: '24/7', label: 'availability for FAQ and booking' },
                { value: '60%', label: 'of patients prefer digital self-service' },
              ]}
            />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Admin vs Clinical Question Split
                </h2>
                <p>
                  The most important principle for a healthcare chatbot is also the simplest:
                  know what the chatbot can answer, and know what it must never try to answer.
                  Getting this boundary right makes the chatbot genuinely useful and clinically
                  safe. Getting it wrong creates liability.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                    <p className="font-semibold text-green-800 dark:text-green-200 mb-3">Chatbot handles safely</p>
                    <StyledBulletList items={[
                      { title: 'Opening hours and location', description: '' },
                      { title: 'How to book or cancel appointments', description: '' },
                      { title: 'What to bring or prepare for appointments', description: '' },
                      { title: 'Repeat prescription request process', description: '' },
                      { title: 'Contact numbers for specific departments', description: '' },
                      { title: 'General service descriptions', description: '' },
                    ]} />
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                    <p className="font-semibold text-red-800 dark:text-red-200 mb-3">Must go to clinical staff</p>
                    <StyledBulletList items={[
                      { title: 'Symptom questions', description: '' },
                      { title: 'Medication dosage or interaction queries', description: '' },
                      { title: 'Triage or urgency assessment', description: '' },
                      { title: 'Test result enquiries', description: '' },
                      { title: 'Diagnosis or treatment questions', description: '' },
                      { title: 'Mental health crisis support', description: '' },
                    ]} />
                  </div>
                </div>

                <p>
                  A well-configured healthcare chatbot is not a clinical tool — it is an
                  administrative assistant. It relieves pressure on reception staff by
                  handling the straightforward enquiries that do not require clinical
                  judgment. Every call that the chatbot intercepts is one fewer call tying
                  up a member of staff who could be checking in a patient or processing a
                  referral.
                </p>
              </section>

              {/* Section 2 — example conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What a Patient Conversation Looks Like in Practice
                </h2>
                <p>
                  Here is how a chatbot trained on a GP practice&apos;s administrative
                  information handles a typical patient interaction:
                </p>

                <ChatPreview
                  botName="Practice Bot"
                  industry="Healthcare"
                  messages={[
                    { role: 'user', text: 'I need to book a blood test. How do I do that?' },
                    { role: 'bot', text: 'Blood tests at our practice are booked through our online patient portal or by calling reception on 01234 567890. The phlebotomy clinic runs Monday to Friday from 8 AM to 12 PM — no appointment needed for routine blood tests, just arrive during those hours with your blood test form. Do you have any other questions?' },
                    { role: 'user', text: "I got my results but I don't understand them" },
                    { role: 'bot', text: "For questions about your test results, please contact reception to arrange a call or appointment with your GP — they're best placed to explain what your results mean for you. You can call us on 01234 567890 or use the patient portal to request a callback." },
                  ]}
                />

                <p className="mt-4">
                  The chatbot handled the administrative question instantly and correctly
                  deflected the clinical question to a clinician — exactly the behaviour
                  you want. The patient got useful information on both counts without tying
                  up reception staff on either.
                </p>
              </section>

              {/* Section 3 — appointment booking */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Appointment Booking Automation
                </h2>
                <p>
                  Appointment booking is the highest-volume administrative task in most
                  healthcare settings. Patients call to book routine appointments, cancel
                  and reschedule, request specific clinicians, or ask about waiting times.
                  Automating this through a chatbot does not replace reception — it handles
                  the straightforward bookings so reception staff can focus on complex or
                  urgent needs.
                </p>
                <p className="mt-4">
                  VocUI integrates with Easy!Appointments, which means patients can select
                  appointment types and available times directly through the chat conversation.
                  For practices using other booking systems, the chatbot can explain the booking
                  process, share the relevant patient portal link, or capture the patient&apos;s
                  name, date of birth, and preferred times for reception to confirm. In either
                  case, inbound call volume for routine bookings falls significantly.
                </p>
                <p className="mt-4">
                  For practices offering online booking via their website or patient portal,
                  the chatbot serves as a conversation layer that gets the patient to the right
                  booking pathway faster. Instead of a patient navigating a complex website to
                  find the physiotherapy booking form, they ask the chatbot and receive a direct
                  link with instructions.
                </p>
              </section>

              {/* Section 4 — data handling */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Patient Data, GDPR, and What Not to Collect
                </h2>
                <p>
                  Healthcare chatbots require a conservative approach to data collection.
                  The rule is straightforward: do not ask for health information through the
                  chat interface. A chatbot configured to answer administrative questions does
                  not need to know a patient&apos;s medical history, diagnosis, or the reason
                  for their appointment in any clinical detail.
                </p>
                <p className="mt-4">
                  For appointment requests, the chatbot can collect: name, contact number,
                  preferred appointment date, and whether it is a routine or urgent request.
                  It should not collect: date of birth, NHS number, symptoms, or any
                  information that constitutes health data under GDPR. Keep the data
                  collection minimal and ensure your practice&apos;s privacy notice mentions
                  that an AI chat tool is used on your website.
                </p>
                <p className="mt-4">
                  The system prompt is your primary control mechanism. Write explicit
                  instructions that prohibit the chatbot from soliciting clinical information,
                  provide the phone number for urgent queries, and include a prompt to call
                  999 or go to A&amp;E for emergencies. Test these boundaries before going live.
                </p>
              </section>

              {/* Section 5 — what to upload */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Upload to a Healthcare Chatbot
                </h2>
                <p>
                  Start with your website: opening hours, contact details, services offered,
                  location and parking, and your appointment booking process. Add a document
                  covering your most-asked patient questions: how to register as a new patient,
                  how to request a repeat prescription, what the different appointment types
                  are, and what to bring to specific clinic types (blood test, smear, travel
                  vaccinations).
                </p>
                <p className="mt-4">
                  For practices with specialist services — physiotherapy, podiatry,
                  phlebotomy — upload service descriptions that explain who the service is
                  for, how to access it, and any preparation required. Keep clinical detail
                  out of these descriptions; stick to logistics.
                </p>
                <p className="mt-4">
                  Review the knowledge base quarterly. Changes to opening hours, service
                  availability, or booking processes happen regularly and an outdated chatbot
                  that gives wrong information about appointment availability erodes patient
                  trust faster than no chatbot at all. See our guide on{' '}
                  <Link href="/blog/knowledge-base-content-best-practices" className="text-primary-600 dark:text-primary-400 hover:underline">
                    organising your knowledge base for better chatbot answers
                  </Link>
                  {' '}for more on keeping content accurate and current.
                </p>
              </section>

              {/* FAQ section */}
              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'How do we stop the chatbot from giving medical advice?',
                      a: "This is controlled through the system prompt. You write clear instructions that the chatbot must follow: \u201CDo not diagnose conditions, recommend treatments, or interpret symptoms. If a patient asks clinical questions, always direct them to contact a clinician or call the practice.\u201D When paired with a knowledge base that covers only administrative and logistical content, the chatbot naturally answers what it knows and defers what it does not. Test it regularly with clinical questions to verify it redirects appropriately.",
                    },
                    {
                      q: 'Is patient data safe with an AI chatbot?',
                      a: "Do not configure your chatbot to collect sensitive patient health information in chat. Keep it to administrative data: name, preferred contact number, appointment request, and general enquiry category. VocUI stores conversation data securely and does not use it to train AI models. For practices subject to GDPR, review your privacy notice and consider whether your chatbot interactions need to be mentioned. Avoid asking for NHS numbers, date of birth, or clinical details through the chat interface.",
                    },
                    {
                      q: 'Can it handle appointment booking directly?',
                      a: "Yes, if you integrate with a booking system. VocUI connects with Easy!Appointments, which allows patients to select appointment types and available slots directly through the chatbot conversation. For practices using other systems, the chatbot can explain the booking process, share the relevant link, or capture appointment request details for reception staff to confirm. Either approach significantly reduces inbound call volume for routine booking requests.",
                    },
                    {
                      q: 'What about patients who are not confident using chat?',
                      a: "Include your phone number and contact options prominently in your chatbot responses. Configure the chatbot to offer the phone number unprompted when answering questions from older patients or those with complex needs. The chatbot supplements your phone line rather than replacing it \u2014 patients who prefer to call still can, and those comfortable with chat get faster service. This typically reduces total phone volume by handling the simpler enquiries digitally.",
                    },
                  ].map(({ q, a }) => (
                    <div
                      key={q}
                      className="border-b border-secondary-200 dark:border-secondary-700 pb-6"
                    >
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        {q}
                      </dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* Related Industry Pages */}
          <div className="mt-10 mb-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Related industry guides</p>
            <ul className="space-y-3">
              <li>
                <Link href="/chatbot-for-healthcare" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbot for Healthcare Providers →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Patient FAQ, appointment booking, and administrative automation for clinics and practices.</p>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">Build a chatbot trained on your business</h2>
            <p className="text-white/80 mb-2">
              Upload your FAQs, policies, and product info -- your chatbot answers from your knowledge, not generic scripts.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan. Live in under an hour.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Start with your content
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Join 1,000+ businesses already using VocUI</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
