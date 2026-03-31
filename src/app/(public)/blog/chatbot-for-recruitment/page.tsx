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
  title: 'How Recruiters Use AI Chatbots to Screen Candidates Faster | VocUI',
  description:
    'Recruitment teams use AI chatbots to answer candidate questions, pre-screen applicants, and reduce time-to-hire — without adding headcount.',
  openGraph: {
    title: 'How Recruiters Use AI Chatbots to Screen Candidates Faster | VocUI',
    description:
      'Recruitment teams use AI chatbots to answer candidate questions, pre-screen applicants, and reduce time-to-hire — without adding headcount.',
    url: 'https://vocui.com/blog/chatbot-for-recruitment',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Recruiters Use AI Chatbots to Screen Candidates Faster | VocUI',
    description:
      'Recruitment teams use AI chatbots to answer candidate questions, pre-screen applicants, and reduce time-to-hire — without adding headcount.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-recruitment' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How Recruiters Use AI Chatbots to Screen Candidates Faster',
      description:
        'Recruitment teams use AI chatbots to answer candidate questions, pre-screen applicants, and reduce time-to-hire — without adding headcount.',
      url: 'https://vocui.com/blog/chatbot-for-recruitment',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-recruitment',
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
          name: 'Can it connect to Greenhouse, Lever, or Workable?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VocUI does not integrate directly with applicant tracking systems, but you can bridge the gap with workflow automation tools like Zapier or Make. Set up your chatbot to direct candidates to your ATS application page when they express interest. You can also create a Zapier workflow that captures conversation data and creates candidate records in Greenhouse, Lever, or Workable automatically. The chatbot\'s primary role is answering questions and directing qualified candidates to apply through your existing process.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot introduce hiring bias?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, because it does not evaluate or rank candidates. The chatbot answers questions based on the content you provide — it gives every candidate the same accurate information about your roles, requirements, benefits, and application process. It does not screen resumes, score applicants, or decide who to interview. Since it functions as an informational tool rather than a decision-making tool, the algorithmic bias risks associated with AI in hiring do not apply.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does it help with high-volume recruiting?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When you have 50+ open positions, the number of candidate questions scales linearly — but your recruiting team does not. A chatbot handles the informational load by answering the same questions about each role instantly: qualifications, location, salary range, benefits, and interview process. Candidates self-screen against the requirements, which means fewer unqualified applications for your team to review. The chatbot works 24/7, which is critical when you are recruiting across time zones or running job ads that generate traffic outside business hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can candidates ask about compensation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, if you include compensation information in your training content. With pay transparency laws expanding across states and countries, many companies now publish salary ranges in job postings. Add that content to the chatbot and it can answer salary questions directly. If your company prefers not to disclose compensation upfront, configure the chatbot to acknowledge the question and explain when in the process compensation is discussed — transparency about the process builds trust even when the number is not yet shared.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when positions are filled?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update your knowledge base when positions open or close. Remove the job description for filled roles and add new ones as they open. If a candidate asks about a role that has been filled, the chatbot can suggest similar open positions or invite them to sign up for job alerts — keeping them engaged for future openings. Maintain a "general" knowledge source about your company culture, benefits, and interview process that remains relevant regardless of which specific roles are open.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForRecruitmentPage() {
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
                Chatbot for Recruitment
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
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How Recruiters Use AI Chatbots to Screen Candidates Faster
              </h1>
            </header>

            {/* Featured snippet — question-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Can a chatbot really help you hire better, faster? When 80% of a
                recruiter&apos;s week goes to answering the same candidate questions —
                &quot;Is this role remote?&quot; &quot;What&apos;s the salary range?&quot;
                &quot;What does the interview process look like?&quot; — the answer is yes.
                A chatbot on your careers page handles the informational workload so your
                team can focus on evaluating talent and closing offers.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 — the bottleneck */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Recruiter Bottleneck Nobody Talks About
                </h2>
                <p>
                  Every open position generates a predictable wave of candidate inquiries. What
                  are the qualifications? Is the role remote? What&apos;s the salary range? How
                  long is the interview process? According to <a href="https://www.secondtalent.com/resources/ai-in-recruitment-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Second Talent</a>, 73% of organizations now use chatbots for initial candidate screening. Each question takes a recruiter 5-10 minutes to
                  answer individually — and the answers are already written in your job descriptions
                  and company handbook.
                </p>
                <p className="mt-4">
                  Multiply that across dozens of open positions and hundreds of candidates, and
                  recruiters spend the majority of their week on information delivery rather than
                  talent evaluation. According to <a href="https://www.carv.com/blog/ai-recruitment-statistics-for-recruiters-and-staffing-agencies" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Carv</a>, AI-powered screening reduces resume review time by up to 75%, and organizations using recruitment chatbots see 41% higher candidate engagement. The bottleneck creates a worse candidate experience too —
                  candidates who email with a question and wait 48 hours may accept another offer.
                  Top talent expects fast, professional communication. Every hour of delay increases
                  the risk of losing good candidates to faster-moving competitors.
                </p>
              </section>

              {/* Section 2 — unique: example screening flow */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Example: A Chatbot-Assisted Candidate Screening Flow
                </h2>
                <p>
                  Here&apos;s how a recruitment chatbot on a careers page guides a candidate
                  from curiosity to qualified application:
                </p>

                {/* Screening flow — unique to recruitment post */}
                <div className="mt-6 mb-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">1</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Candidate asks about the role</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;What experience do I need for the senior product manager position?&quot;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">2</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Chatbot shares requirements from the job description</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">5+ years product management experience, B2B SaaS background, experience with cross-functional teams...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">3</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Candidate asks follow-up questions</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;Is it fully remote?&quot; &quot;What&apos;s the interview process like?&quot; &quot;What benefits do you offer?&quot;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">4</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Chatbot answers each question from your training content</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Remote-first with quarterly onsites. 4-stage process: screening, hiring manager, case study, team fit. Full benefits details...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-sm font-bold text-primary-700 dark:text-primary-300">5</span>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">Qualified candidate is directed to apply</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;Ready to apply? Here&apos;s the application link. The team reviews applications weekly.&quot;</p>
                    </div>
                  </div>
                </div>

                <p>
                  This entire exchange happens without a recruiter lifting a finger. The candidate
                  who emerges from this conversation is informed, self-qualified, and ready to
                  submit a strong application. The recruiter receives a better candidate instead
                  of fielding five emails.
                </p>
              </section>

              {/* Section 3 — ATS integration */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Working With Greenhouse, Lever, and Workable
                </h2>
                <p>
                  Your applicant tracking system is the system of record for your hiring pipeline.
                  A VocUI chatbot doesn&apos;t replace it — it feeds it better candidates. When
                  a candidate finishes asking questions and is ready to apply, the chatbot links
                  directly to your ATS application page for that role, whether you use Greenhouse,
                  Lever, Workable, Ashby, or any other platform.
                </p>
                <p className="mt-4">
                  For teams that want to capture chatbot interaction data, connect VocUI to your
                  ATS through Zapier or Make. For example, you could create a workflow that tags
                  candidates who engaged with the chatbot before applying, giving your recruiters
                  insight into which candidates did their research. You can also track which
                  questions candidates asked most frequently — valuable data for improving your
                  job postings and careers page content.
                </p>
                <p className="mt-4">
                  Configure your chatbot&apos;s system prompt to include the correct application
                  URL for each role. When you train the chatbot on all your job descriptions, it
                  can match candidates to the right link: &quot;Interested in the senior PM role?
                  Apply here. Looking for engineering positions instead? Here&apos;s the full list
                  of open engineering roles.&quot;
                </p>
              </section>

              {/* Section 4 — training */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Building the Knowledge Base for Recruiting
                </h2>
                <p>
                  Your recruiting chatbot&apos;s knowledge base should cover everything a
                  candidate would ask before, during, and after applying:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong>Job descriptions.</strong> Full text of all open positions including
                    responsibilities, qualifications, location, and compensation ranges.
                  </li>
                  <li>
                    <strong>Company overview.</strong> Mission, values, team size, funding stage,
                    and what makes your company a compelling place to work.
                  </li>
                  <li>
                    <strong>Benefits and perks.</strong> Health insurance, PTO, remote work
                    policies, equity, professional development, and unique perks.
                  </li>
                  <li>
                    <strong>Interview process.</strong> Number of rounds, what each round covers,
                    typical timeline, and how to prepare.
                  </li>
                </ul>
                <p className="mt-4">
                  Pull this content from your careers page, job postings, and employee handbook.
                  Point VocUI at those URLs and it scrapes the content automatically. Update the
                  knowledge base as positions open and close. For tips on embedding the chatbot
                  on your careers page, see our guide on{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    adding a chatbot to your website
                  </Link>
                  . Visit our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>
                  {' '}to get started with a plan that fits your hiring volume.
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
                      q: 'Can it connect to Greenhouse, Lever, or Workable?',
                      a: "VocUI does not integrate directly with applicant tracking systems, but you can bridge the gap with workflow automation tools like Zapier or Make. Set up your chatbot to direct candidates to your ATS application page when they express interest. You can also create a Zapier workflow that captures conversation data and creates candidate records in Greenhouse, Lever, or Workable automatically. The chatbot\u2019s primary role is answering questions and directing qualified candidates to apply through your existing process.",
                    },
                    {
                      q: 'Does the chatbot introduce hiring bias?',
                      a: "No, because it does not evaluate or rank candidates. The chatbot answers questions based on the content you provide \u2014 it gives every candidate the same accurate information about your roles, requirements, benefits, and application process. It does not screen resumes, score applicants, or decide who to interview. Since it functions as an informational tool rather than a decision-making tool, the algorithmic bias risks associated with AI in hiring do not apply.",
                    },
                    {
                      q: 'How does it help with high-volume recruiting?',
                      a: "When you have 50+ open positions, the number of candidate questions scales linearly \u2014 but your recruiting team does not. A chatbot handles the informational load by answering the same questions about each role instantly: qualifications, location, salary range, benefits, and interview process. Candidates self-screen against the requirements, which means fewer unqualified applications for your team to review. The chatbot works 24/7, which is critical when you are recruiting across time zones or running job ads that generate traffic outside business hours.",
                    },
                    {
                      q: 'Can candidates ask about compensation?',
                      a: "Yes, if you include compensation information in your training content. With pay transparency laws expanding across states and countries, many companies now publish salary ranges in job postings. Add that content to the chatbot and it can answer salary questions directly. If your company prefers not to disclose compensation upfront, configure the chatbot to acknowledge the question and explain when in the process compensation is discussed \u2014 transparency about the process builds trust even when the number is not yet shared.",
                    },
                    {
                      q: 'What happens when positions are filled?',
                      a: "Update your knowledge base when positions open or close. Remove the job description for filled roles and add new ones as they open. If a candidate asks about a role that has been filled, the chatbot can suggest similar open positions or invite them to sign up for job alerts \u2014 keeping them engaged for future openings. Maintain a \u201Cgeneral\u201D knowledge source about your company culture, benefits, and interview process that remains relevant regardless of which specific roles are open.",
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
            <h2 className="text-2xl font-bold mb-3">See how recruiting teams use VocUI</h2>
            <p className="text-white/80 mb-2">
              Upload your job descriptions and FAQs, train a chatbot, and let it pre-screen candidates while you focus on hiring.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. Most teams are live in under an hour.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Get started free
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
