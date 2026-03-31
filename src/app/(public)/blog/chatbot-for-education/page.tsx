import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbots for Education: Automate Student FAQs | VocUI',
  description:
    'Universities and online course platforms use AI chatbots to answer student questions about enrollment, deadlines, and course content around the clock.',
  openGraph: {
    title: 'AI Chatbots for Education: Automate Student FAQs | VocUI',
    description:
      'Universities and online course platforms use AI chatbots to answer student questions about enrollment, deadlines, and course content around the clock.',
    url: 'https://vocui.com/blog/chatbot-for-education',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Education: Automate Student FAQs | VocUI',
    description:
      'Universities and online course platforms use AI chatbots to answer student questions about enrollment, deadlines, and course content around the clock.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-education' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Education: Automate Student FAQs',
      description:
        'Universities and online course platforms use AI chatbots to answer student questions about enrollment, deadlines, and course content around the clock.',
      url: 'https://vocui.com/blog/chatbot-for-education',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-education',
      },
      datePublished: '2026-04-01',
      dateModified: '2026-04-01',
      author: {
        '@type': 'Person',
        name: 'Will Cooke',
        url: 'https://vocui.com/about',
      },
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
          name: 'Does this comply with FERPA requirements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. A VocUI chatbot does not access, store, or process student education records as defined by FERPA. It answers questions based on publicly available institutional content — course catalogs, academic calendars, tuition pages, and policy documents. It has no connection to your Student Information System (SIS) or any system containing personally identifiable student data. When a student asks about their specific grades, enrollment status, or financial aid package, the chatbot directs them to the appropriate self-service portal where they can authenticate securely.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can it integrate with Canvas, Blackboard, or other LMS platforms?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot does not directly integrate with LMS platforms, but it works alongside them effectively. Train the chatbot on your LMS help documentation, login instructions, and common troubleshooting steps. When a student asks "How do I submit an assignment in Canvas?" the chatbot provides step-by-step instructions from your training content. For tasks that require authentication (checking grades, viewing course materials), the chatbot links directly to the LMS login page.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does it work for K-12 schools or just higher education?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both. K-12 schools primarily use chatbots for parent-facing communication — answering questions about enrollment, school schedules, transportation routes, lunch menus, and after-school programs. Higher education institutions use them for student-facing support across admissions, academic advising, financial aid, and campus services. The training content differs, but the setup process is the same: point the chatbot at your existing website and documentation.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we keep answers accurate when information changes every semester?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Build a semester refresh into your academic calendar. At the start of each term, re-scrape your website URLs to pull in updated course catalogs, academic calendars, and policy changes. Upload new syllabi and replace outdated documents. The entire refresh typically takes 15-30 minutes. For institutions with frequently changing content, linking to live web pages (rather than uploading static PDFs) ensures the chatbot always references the current version when you trigger a knowledge base refresh.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can prospective students use it during the admissions process?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This is one of the highest-impact use cases. Deploy the chatbot on your admissions and program pages to answer questions about application requirements, deadlines, campus visits, financial aid, and program offerings. Prospective students research schools at all hours — evenings, weekends, holidays. A chatbot that answers their questions instantly keeps your institution in the running when the admissions office is closed. Some schools run separate chatbots for prospects and enrolled students with different knowledge bases and tones.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can staff use the chatbot for internal HR and IT questions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Create a separate chatbot trained on your staff handbook, HR policies, benefits guides, and IT documentation. Deploy it on your internal staff portal. Faculty and staff ask repetitive questions about benefits enrollment, leave policies, room scheduling, and technology requests — the same questions that consume administrative time. An internal chatbot handles these without diverting student-facing support resources.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we handle multi-campus or multi-school deployments?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For multi-campus institutions, you can run a single chatbot with campus-specific content clearly labeled in the knowledge base, or deploy separate chatbots per campus with targeted content. Separate bots work best when campuses have different programs, schedules, or policies. A shared bot works when the content is mostly the same and the chatbot can route based on campus-specific questions. For K-12 districts with multiple schools, separate bots per school keeps answers accurate for each community.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForEducationPage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
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
                Chatbot for Education
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Use Case
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  13 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbots for Education: Automate Student FAQs
              </h1>
            </header>

            {/* Featured snippet — problem-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Every September, admissions offices drown in the same 200 questions asked 10,000
                times. &quot;When is the add/drop deadline?&quot; &quot;What GPA do I need to
                transfer?&quot; &quot;Does this course count toward my major?&quot; An AI chatbot
                trained on your institution&apos;s catalog and policies answers these instantly —
                at 2 AM on a Sunday, during enrollment week peak, or from any time zone.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 — problem-first */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Enrollment Week Meltdown
                </h2>
                <p>
                  Universities, colleges, and online learning platforms share a common problem:
                  student-facing staff are overwhelmed by the same questions asked thousands of
                  times each semester. According to <a href="https://www.insidehighered.com/news/student-success/academic-life/2025/06/11/65-percent-students-use-gen-ai-chat-bot-weekly" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Inside Higher Ed</a>, 65% of students already use generative AI chatbots weekly — they expect conversational interfaces for finding information. The volume spikes at predictable times — enrollment periods,
                  the start of each term, midterms, and graduation — and during these peaks,
                  admissions offices, registrars, and academic advising centers face wait times
                  that frustrate students and burn out staff.
                </p>
                <p className="mt-4">
                  Phone lines queue up. Email response times stretch to days. Walk-in offices have
                  lines out the door. And the questions driving all this volume have clear,
                  documented answers that already exist on your website, in your catalog, and in
                  your student handbook. Students either can&apos;t find them or prefer to ask
                  someone directly.
                </p>
                <p className="mt-4">
                  Online course platforms face a different version of the same problem. Students
                  across time zones need help with enrollment, platform navigation, and course
                  content at all hours. A support team that operates 9-5 Eastern leaves
                  international students and working professionals without help during their
                  most active learning hours — driving lower completion rates and higher churn.
                </p>
              </section>

              {/* Section 2 — what it handles, with different structure */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What Questions an Education Chatbot Answers
                </h2>
                <p>
                  Education chatbots handle the informational queries that make up the bulk of
                  student inquiries. According to <a href="https://springsapps.com/knowledge/how-universities-use-chatbots-in-2024" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Springs Apps</a>, 58% of institutions that adopted chatbots report improved services. These aren&apos;t complex academic advising conversations —
                  they&apos;re factual questions with documented answers:
                </p>

                {/* Numbered list instead of bullets — structural variation */}
                <ol className="list-decimal list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong>Enrollment and admissions.</strong> Application deadlines, required
                    documents, acceptance criteria, transfer credit policies, and how to submit
                    applications.
                  </li>
                  <li>
                    <strong>Course information.</strong> Prerequisites, schedules, credit hours,
                    instructor details, and course descriptions from the catalog.
                  </li>
                  <li>
                    <strong>Financial aid and tuition.</strong> FAFSA deadlines, scholarship
                    availability, payment plans, tuition rates by program, and refund policies.
                  </li>
                  <li>
                    <strong>Academic policies.</strong> Drop/add deadlines, grading scales,
                    academic probation rules, graduation requirements, and GPA calculation.
                  </li>
                  <li>
                    <strong>Campus services.</strong> Library hours, IT help desk, health services,
                    parking, dining, and student organizations.
                  </li>
                  <li>
                    <strong>LMS and technology.</strong> How to log into Canvas or Blackboard,
                    submit assignments, access recorded lectures, and reset passwords.
                  </li>
                </ol>
                <p className="mt-4">
                  For a deeper look at building a chatbot focused on frequently asked questions,
                  see our guide on{' '}
                  <Link
                    href="/blog/what-is-a-knowledge-base-chatbot"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    knowledge base chatbots
                  </Link>
                  .
                </p>
              </section>

              {/* Section 3 — FERPA compliance deep dive — unique to education */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  FERPA Compliance: What You Need to Know
                </h2>

                {/* Callout box — unique element */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-6 py-5 mb-6">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Key distinction
                  </p>
                  <p className="text-secondary-700 dark:text-secondary-300">
                    A VocUI chatbot answers questions from <em>publicly available institutional
                    content</em>. It does not access student education records, which means it
                    operates outside the scope of FERPA-protected data entirely.
                  </p>
                </div>

                <p>
                  The Family Educational Rights and Privacy Act (FERPA) protects student education
                  records — grades, enrollment status, financial aid details, disciplinary records,
                  and other personally identifiable information. Any tool that accesses these
                  records must comply with strict disclosure and consent requirements.
                </p>
                <p className="mt-4">
                  A VocUI chatbot does not require access to any of this data. As <a href="https://www.the74million.org/article/50-years-after-ferpas-passage-ed-privacy-law-needs-an-update-for-the-ai-era/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">The 74</a> notes, FERPA does not explicitly cover student data generated in AI chatbot interactions — but it is still best practice to keep the chatbot limited to publicly available content. It is trained on
                  publicly available content: course catalogs, academic calendars, tuition pages,
                  policy documents, and FAQ pages. It has no connection to your Student Information
                  System (SIS), Learning Management System (LMS) backend, or any database
                  containing student records. When a student asks a question that requires
                  accessing their personal records — &quot;What&apos;s my GPA?&quot; or
                  &quot;Did my financial aid come through?&quot; — the chatbot directs them to
                  the appropriate self-service portal where they authenticate securely.
                </p>
                <p className="mt-4">
                  To maintain this boundary, never train the chatbot on content containing
                  student names, IDs, grades, or academic records. Stick to policy documents,
                  catalogs, and public information. Conversation data is stored in your VocUI
                  account and can be reviewed or deleted at any time. If your institution
                  requires a data processing agreement, review{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    our plans
                  </Link>
                  {' '}to understand data handling for your tier.
                </p>

                {/* FERPA compliance checklist — unique to education post */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-6 py-5 mt-6">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3">
                    FERPA compliance checklist for chatbot deployment
                  </p>
                  <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">1.</span>
                      <span>Train only on publicly available institutional content (catalogs, calendars, policy pages).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">2.</span>
                      <span>Never upload documents containing student names, IDs, grades, or enrollment data.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">3.</span>
                      <span>Configure the chatbot personality to redirect personal record requests to authenticated portals.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">4.</span>
                      <span>Confirm no SIS, LMS backend, or financial aid system connections exist.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">5.</span>
                      <span>Review conversation logs periodically; delete any that inadvertently contain student PII.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">6.</span>
                      <span>Document your chatbot&apos;s data scope in your institution&apos;s FERPA compliance records.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 4 — LMS integration — unique to education */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Working Alongside Canvas, Blackboard, and Moodle
                </h2>
                <p>
                  Students don&apos;t just have questions about enrollment and policies — they
                  also struggle with the technology they use every day. &quot;How do I submit an
                  assignment in Canvas?&quot; &quot;Where do I find recorded lectures in
                  Blackboard?&quot; &quot;Why can&apos;t I see my grades in Moodle?&quot; These
                  LMS support questions flood IT help desks and faculty inboxes, especially in the
                  first weeks of each semester.
                </p>
                <p className="mt-4">
                  Train your chatbot on your institution&apos;s LMS help documentation: login
                  instructions, assignment submission guides, discussion board tutorials, grade
                  access walkthroughs, and common troubleshooting steps. The chatbot becomes a
                  first line of support for LMS issues, resolving the simple questions instantly
                  and reserving IT staff time for complex technical problems.
                </p>
                <p className="mt-4">
                  For tasks that require authentication — viewing grades, accessing course
                  materials, checking enrollment status — the chatbot provides the answer to
                  &quot;how&quot; while linking directly to the login page where students can
                  complete the action. This combination of instructional guidance and smart
                  routing handles the majority of LMS-related inquiries without exposing any
                  protected data.
                </p>
              </section>

              {/* Section 5 — Student vs Staff Use Cases — unique to education post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Student-Facing vs. Staff-Facing Chatbot Use Cases
                </h2>
                <p>
                  An education chatbot does not only serve students. Faculty and staff have
                  their own set of repetitive questions — HR policies, IT procedures, facility
                  requests — that consume administrative time. Some institutions deploy
                  separate chatbots for each audience.
                </p>

                {/* Comparison table — unique to education post */}
                <div className="overflow-x-auto mt-6 mb-6">
                  <table className="w-full text-left text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
                    <thead className="bg-secondary-50 dark:bg-secondary-800/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Audience</th>
                        <th className="px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Common Questions</th>
                        <th className="px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Best Placement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                      <tr>
                        <td className="px-4 py-3 font-medium">Prospective students</td>
                        <td className="px-4 py-3">Application deadlines, program requirements, campus visits, financial aid</td>
                        <td className="px-4 py-3">Admissions and program pages</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Enrolled students</td>
                        <td className="px-4 py-3">Registration, drop/add, LMS help, campus services, graduation</td>
                        <td className="px-4 py-3">Student portal or intranet</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Parents (K-12)</td>
                        <td className="px-4 py-3">School calendar, transportation, lunch menus, after-school programs</td>
                        <td className="px-4 py-3">School homepage</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Faculty &amp; staff</td>
                        <td className="px-4 py-3">HR policies, benefits enrollment, IT requests, room scheduling</td>
                        <td className="px-4 py-3">Internal staff portal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  A student-facing chatbot trained on course catalogs and a staff-facing chatbot
                  trained on HR handbooks serve completely different purposes. Deploying them
                  separately means each audience gets relevant answers without content
                  cross-contamination — a student should never see answers about faculty
                  benefits, and a staff member looking up PTO policy should not get course
                  registration instructions.
                </p>
              </section>

              {/* Section 6 — prospective vs enrolled */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  One Bot or Two? Prospective vs. Enrolled Students
                </h2>
                <p>
                  Prospective and enrolled students have fundamentally different needs. Prospects
                  want to know about application requirements, campus visits, program offerings,
                  and tuition. Enrolled students ask about registration, academic policies, campus
                  services, and degree requirements. The tone differs too — a prospective-student
                  bot should be warmer and more encouraging, while an enrolled-student bot can be
                  more direct and procedural.
                </p>
                <p className="mt-4">
                  A single chatbot can serve both audiences if your knowledge base is comprehensive
                  enough, but running two separate chatbots gives you more control over content
                  scope and system prompts. Deploy the admissions bot on your program and
                  application pages. Deploy the student services bot on your student portal or
                  intranet. Each one trained on the content its audience actually needs.
                </p>
              </section>

              {/* Section 6 — training on catalogs */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Building the Knowledge Base From What You Already Have
                </h2>
                <p>
                  Most educational institutions already publish everything the chatbot needs.
                  Start with your website — VocUI scrapes and indexes course catalogs, academic
                  calendars, tuition pages, and policy documents automatically. Three to five
                  URL sources typically cover the core content.
                </p>
                <p className="mt-4">
                  For content in PDFs — student handbooks, financial aid guides, program
                  brochures, orientation materials — upload them directly. These are excellent
                  training sources because they&apos;re already written in student-friendly
                  language. The key to accuracy is completeness: for each common question
                  category, make sure the answer exists somewhere in your knowledge base.
                  Learn more about building effective knowledge bases in our{' '}
                  <Link
                    href="/blog/how-to-build-internal-knowledge-bot"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    internal knowledge bot guide
                  </Link>
                  .
                </p>
              </section>

              {/* Section 7 — semester refresh workflow */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Semester Refresh: Keeping Answers Current
                </h2>
                <p>
                  Unlike businesses where content changes gradually, educational institutions
                  have hard resets every semester. Course offerings change, calendars shift,
                  policies update, and tuition may adjust. Build a chatbot refresh into your
                  academic calendar — treat it like updating the course catalog or printing
                  new orientation packets.
                </p>
                <p className="mt-4">
                  The process takes 15-30 minutes: re-scrape your website URLs to pull in
                  updated pages, upload new syllabi and policy documents, remove outdated
                  content for discontinued programs, and test the chatbot with the most common
                  questions for the upcoming term. Set a calendar reminder for the first week of
                  each semester. A chatbot that references last semester&apos;s drop deadline
                  erodes trust quickly.
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
                      q: 'Does this comply with FERPA requirements?',
                      a: "Yes. A VocUI chatbot does not access, store, or process student education records as defined by FERPA. It answers questions based on publicly available institutional content \u2014 course catalogs, academic calendars, tuition pages, and policy documents. It has no connection to your Student Information System (SIS) or any system containing personally identifiable student data. When a student asks about their specific grades, enrollment status, or financial aid package, the chatbot directs them to the appropriate self-service portal where they can authenticate securely.",
                    },
                    {
                      q: 'Can it integrate with Canvas, Blackboard, or other LMS platforms?',
                      a: "The chatbot does not directly integrate with LMS platforms, but it works alongside them effectively. Train the chatbot on your LMS help documentation, login instructions, and common troubleshooting steps. When a student asks \u201CHow do I submit an assignment in Canvas?\u201D the chatbot provides step-by-step instructions from your training content. For tasks that require authentication (checking grades, viewing course materials), the chatbot links directly to the LMS login page.",
                    },
                    {
                      q: 'Does it work for K-12 schools or just higher education?',
                      a: "Both. K-12 schools primarily use chatbots for parent-facing communication \u2014 answering questions about enrollment, school schedules, transportation routes, lunch menus, and after-school programs. Higher education institutions use them for student-facing support across admissions, academic advising, financial aid, and campus services. The training content differs, but the setup process is the same: point the chatbot at your existing website and documentation.",
                    },
                    {
                      q: 'How do we keep answers accurate when information changes every semester?',
                      a: "Build a semester refresh into your academic calendar. At the start of each term, re-scrape your website URLs to pull in updated course catalogs, academic calendars, and policy changes. Upload new syllabi and replace outdated documents. The entire refresh typically takes 15-30 minutes. For institutions with frequently changing content, linking to live web pages (rather than uploading static PDFs) ensures the chatbot always references the current version when you trigger a knowledge base refresh.",
                    },
                    {
                      q: 'Can prospective students use it during the admissions process?',
                      a: "This is one of the highest-impact use cases. Deploy the chatbot on your admissions and program pages to answer questions about application requirements, deadlines, campus visits, financial aid, and program offerings. Prospective students research schools at all hours \u2014 evenings, weekends, holidays. A chatbot that answers their questions instantly keeps your institution in the running when the admissions office is closed. Some schools run separate chatbots for prospects and enrolled students with different knowledge bases and tones.",
                    },
                    {
                      q: 'Can staff use the chatbot for internal HR and IT questions?',
                      a: "Yes. Create a separate chatbot trained on your staff handbook, HR policies, benefits guides, and IT documentation. Deploy it on your internal staff portal. Faculty and staff ask repetitive questions about benefits enrollment, leave policies, room scheduling, and technology requests \u2014 the same questions that consume administrative time. An internal chatbot handles these without diverting student-facing support resources.",
                    },
                    {
                      q: 'How do we handle multi-campus or multi-school deployments?',
                      a: "For multi-campus institutions, you can run a single chatbot with campus-specific content clearly labeled in the knowledge base, or deploy separate chatbots per campus with targeted content. Separate bots work best when campuses have different programs, schedules, or policies. A shared bot works when the content is mostly the same and the chatbot can route based on campus-specific questions. For K-12 districts with multiple schools, separate bots per school keeps answers accurate for each community.",
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
