import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { ChatPreview, IndustryStatBar } from '@/components/blog/industry-visuals';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbots for Nonprofits: Engage Donors and Volunteers | VocUI',
  description:
    'Nonprofits use AI chatbots to answer donor questions, recruit volunteers, and share program info — without stretching limited staff resources.',
  openGraph: {
    title: 'AI Chatbots for Nonprofits: Engage Donors and Volunteers | VocUI',
    description:
      'Nonprofits use AI chatbots to answer donor questions, recruit volunteers, and share program info — without stretching limited staff resources.',
    url: 'https://vocui.com/blog/chatbot-for-nonprofits',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Nonprofits: Engage Donors and Volunteers | VocUI',
    description:
      'Nonprofits use AI chatbots to answer donor questions, recruit volunteers, and share program info — without stretching limited staff resources.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-nonprofits' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Nonprofits: Engage Donors and Volunteers',
      description:
        'Nonprofits use AI chatbots to answer donor questions, recruit volunteers, and share program info — without stretching limited staff resources.',
      url: 'https://vocui.com/blog/chatbot-for-nonprofits',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-nonprofits',
      },
      datePublished: '2025-12-17',
      dateModified: '2025-12-17',
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
          name: 'Can a chatbot on my donation page actually increase giving?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Visitors on your donation page are already considering a gift. If they have a last-minute question — "Is my donation tax-deductible?" "How are funds allocated?" "What do different giving levels include?" — and there is no instant way to get an answer, some will abandon the page rather than search your site or send an email. A chatbot answers these hesitations in real time without the donor navigating away from the donation form. It reduces donation page abandonment by addressing the questions that stall the giving decision at the exact moment they arise.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does it work with Salesforce Nonprofit or Bloomerang?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VocUI does not directly integrate with donor management CRMs like Salesforce Nonprofit Cloud, Bloomerang, Little Green Light, or DonorPerfect. However, you can connect them through workflow automation tools like Zapier or Make. For example, set up a workflow that creates a new contact in Salesforce when a chatbot conversation includes a donor\'s email address, or log engagement data in Bloomerang for follow-up. The chatbot focuses on answering questions and directing visitors to the right next step — your CRM handles the relationship management from there.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is this affordable on a nonprofit budget?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VocUI offers a free plan that includes chatbot creation, knowledge base training, and website embedding. For most small to mid-sized nonprofits, the free tier covers everything needed to get started. If your organization handles higher chat volumes or needs multiple chatbots for different programs, paid plans are available at accessible price points. Many nonprofits start free and only upgrade when engagement exceeds the included limits.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we avoid sharing sensitive donor information through the chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Never train the chatbot on content containing donor names, giving history, contact lists, or internal financial records. The knowledge base should contain only public-facing content: your mission statement, program descriptions, impact reports, volunteer information, and event details. The chatbot has no connection to your donor database, CRM, or accounting system. If a visitor shares personal or financial information in a chat message, your system prompt should instruct the chatbot to redirect them to a secure communication channel.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot help recruit and onboard volunteers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Train it on your volunteer handbook, role descriptions, time commitments, and onboarding process. When someone asks "How can I volunteer?" the chatbot explains what is available, what is expected, and links to your signup form. Volunteers arrive at orientation already informed about the commitment, which reduces no-shows and speeds up onboarding.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does it work during Giving Tuesday or annual campaigns?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update your knowledge base before the campaign with current giving levels, matching gift information, and campaign goals. The chatbot handles the surge of questions that comes with high-traffic fundraising events — "Is there a matching gift?" "How much has been raised so far?" — without your team working overtime. Launch the updated content the same day your campaign goes live.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can we have separate chatbots for different programs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. If your nonprofit runs distinct programs — a food bank, an afterschool program, and a shelter, for example — you can create separate chatbots for each, trained on program-specific content. Deploy each chatbot on its respective program page. This keeps answers focused and prevents a visitor asking about the food bank from getting shelter program information.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForNonprofitsPage() {
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
                Chatbot for Nonprofits
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Use Case
                </span>
                <time dateTime="2025-12-17" className="text-xs text-secondary-400 dark:text-secondary-500">Dec 17, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  12 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbots for Nonprofits: Engage Donors and Volunteers
              </h1>
            </header>

            {/* Featured snippet — story-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A first-time visitor lands on your nonprofit&apos;s website after seeing a
                social media post about your work. They&apos;re moved. They click the
                &quot;Donate&quot; button but pause — &quot;Is this tax-deductible? How much
                goes to overhead?&quot; It&apos;s 11 PM on a Saturday. Nobody&apos;s answering
                emails. They close the tab. A chatbot would have answered both questions in
                ten seconds and kept that donor on the page.
              </p>
            </div>

            <IndustryStatBar
              stats={[
                { value: '83%', label: 'donation form abandonment rate' },
                { value: '19%', label: 'of first-time donors return' },
                { value: '44%', label: 'of public donated online recently' },
              ]}
            />
            <p className="text-xs text-secondary-400 dark:text-secondary-500 -mt-4 mb-8">
              Sources:{' '}
              <a href="https://snowballfundraising.com/donor-abandonment-causes-solutions/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Snowball Fundraising</a>,{' '}
              <a href="https://afpglobal.org/FundraisingEffectivenessProject" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">AFP Fundraising Effectiveness Project</a>,{' '}
              <a href="https://www.nptechforgood.com/101-best-practices/online-fundraising-statistics-for-nonprofits/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Nonprofit Tech for Good</a>
            </p>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 — the missed moment */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Engagement Window Nonprofits Keep Missing
                </h2>
                <p>
                  Nonprofits operate with lean teams and tight budgets, yet the demand for
                  information from donors, volunteers, beneficiaries, and the general public
                  never slows down. According to <a href="https://www.nonprofitpro.com/article/12-revealing-nonprofit-stats-from-2025/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">NonProfit PRO</a>, only 19% of first-time donors return to give again — making every initial engagement critical. A development director fielding the same questions about
                  donation tax receipts, a program coordinator explaining volunteer requirements
                  for the third time that week — this is the reality for most nonprofit staff.
                </p>
                <p className="mt-4">
                  The challenge is not a lack of information. Most nonprofits have detailed
                  websites, annual reports, and program descriptions. The challenge is
                  <em> timing</em>. According to <a href="https://www.nptechforgood.com/101-best-practices/online-fundraising-statistics-for-nonprofits/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Nonprofit Tech for Good</a>, 44% of the public donated online in the past three months — visitors arrive with a specific question during evenings
                  and weekends, precisely when your team is offline. An email to your general
                  inbox might get a response in 24-48 hours, but by then the moment of
                  engagement has passed. A chatbot makes your existing content conversational
                  and available at the exact moment someone is considering supporting your
                  cause.
                </p>
              </section>

              {/* Section 2 — unique: donation page conversion */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Reducing Donation Page Abandonment
                </h2>
                <p>
                  Your donation page is the highest-stakes page on your website. Visitors who
                  reach it are already considering a gift. But donation pages have surprisingly
                  high abandonment rates — according to <a href="https://snowballfundraising.com/donor-abandonment-causes-solutions/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Snowball Fundraising</a>, the nonprofit donation form abandonment rate is 83%. The reason is not that visitors change their mind about your
                  cause, but that last-minute questions go unanswered.
                </p>

                {/* Callout — unique to nonprofit post */}
                <div className="bg-secondary-50 dark:bg-secondary-800/40 rounded-xl p-6 my-6">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                    Questions that stall donation page conversions:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-secondary-600 dark:text-secondary-400">
                    <li>&quot;Is my donation tax-deductible?&quot;</li>
                    <li>&quot;What percentage goes to programs vs. overhead?&quot;</li>
                    <li>&quot;Can I set up a recurring monthly gift?&quot;</li>
                    <li>&quot;What do different giving levels include?&quot;</li>
                    <li>&quot;Will I receive a receipt for my records?&quot;</li>
                  </ul>
                </div>

                <p>
                  A chatbot on the donation page answers every one of these instantly. The
                  visitor never navigates away from the form. When someone asks &quot;How are
                  funds allocated?&quot; the chatbot pulls from your annual report or impact
                  page to share specific percentages. When they ask about tax deductibility,
                  it confirms your 501(c)(3) status and explains what they&apos;ll receive for
                  their records. This turns hesitation into action at the moment it matters most.
                </p>
              </section>

              {/* Section 3 — donor engagement lifecycle — unique to nonprofit post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Donor Engagement Lifecycle: Where Chatbots Intervene
                </h2>
                <p>
                  Donor engagement is not a single event — it is a lifecycle with distinct
                  stages. A chatbot plays a different role at each one:
                </p>

                {/* Lifecycle stages — unique to nonprofit post */}
                <div className="mt-6 mb-6 space-y-4">
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-xl p-4">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">First-time visitors</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Chatbot answers: &quot;What does your organization do?&quot; &quot;Where do donations go?&quot; &quot;How can I help?&quot; The goal is education and trust-building.</p>
                  </div>
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-xl p-4">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">Prospective donors</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Chatbot answers: &quot;Is my donation tax-deductible?&quot; &quot;What giving levels are available?&quot; &quot;Can I donate monthly?&quot; The goal is removing hesitation at the donation page.</p>
                  </div>
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-xl p-4">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">Returning donors</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Chatbot answers: &quot;How were last year&apos;s funds used?&quot; &quot;What&apos;s new this year?&quot; &quot;How do I update my recurring gift?&quot; The goal is stewardship and retention.</p>
                  </div>
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-xl p-4">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">Major gift prospects</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Chatbot answers initial research questions, then directs to your development director for a personal conversation. The goal is warm handoff, not conversion.</p>
                  </div>
                </div>

                <p>
                  Training the chatbot with lifecycle-appropriate content means each visitor
                  gets the right information for where they are in their relationship with your
                  organization. A first-time visitor needs your mission statement. A returning
                  donor needs your latest impact report. The chatbot serves both from the same
                  knowledge base.
                </p>
              </section>

              {/* Section 4 — volunteer coordination — unique to nonprofit post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Volunteer Coordination: From Inquiry to Onboarded
                </h2>
                <p>
                  Volunteers have their own set of questions that differ from donors:
                  &quot;What volunteer opportunities are available?&quot; &quot;How much time
                  do I need to commit?&quot; &quot;Do I need a background check?&quot;
                  &quot;Is training provided?&quot; These questions arrive sporadically
                  throughout the week, and each one represents someone willing to give their
                  time to your cause.
                </p>
                <p className="mt-4">
                  Train the chatbot on your volunteer handbook, role descriptions, scheduling
                  requirements, and onboarding process. When someone asks about volunteering
                  at 11 PM on a weeknight, the chatbot provides a complete picture of what is
                  available and what is expected — then links to your volunteer signup form.
                  The volunteer arrives at your next orientation already informed about the
                  commitment, dress code, and schedule. No phone tag required.
                </p>
                <p className="mt-4">
                  For organizations with seasonal volunteer needs — holiday events, annual
                  fundraisers, disaster response — update the chatbot before each campaign.
                  The surge of volunteer inquiries that follows a social media call-to-action
                  can be handled entirely by the chatbot, freeing your volunteer coordinator
                  to focus on scheduling and training rather than answering the same intake
                  questions dozens of times.
                </p>
              </section>

              {/* Section 5 — donor CRM integration */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Connecting to Salesforce Nonprofit, Bloomerang, and DonorPerfect
                </h2>
                <p>
                  Your donor management CRM is the backbone of your fundraising operation. A
                  VocUI chatbot doesn&apos;t replace it — it feeds it warmer leads. When a
                  visitor engages with the chatbot, asks about your mission, and expresses
                  interest in giving, the chatbot directs them to your donation page or
                  volunteer signup form.
                </p>
                <p className="mt-4">
                  For organizations that want to capture engagement data, connect VocUI to
                  your CRM through Zapier or Make. Create workflows that log chatbot
                  interactions as touchpoints in Salesforce Nonprofit Cloud, create prospect
                  records in Bloomerang, or tag new contacts in Little Green Light. This
                  gives your development team visibility into which website visitors engaged
                  with the chatbot before donating — valuable context for stewardship.
                </p>
                <p className="mt-4">
                  The chatbot can also support your existing donor communications. When your
                  annual appeal or Giving Tuesday campaign drives traffic to your site,
                  the chatbot is ready to answer the surge of questions that come with it
                  — without your team working overtime.
                </p>
              </section>

              {/* Section 7 — budget-conscious setup — unique to nonprofit post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Budget-Conscious Setup: Getting Maximum Impact From a Free Plan
                </h2>
                <p>
                  Nonprofits operate under budget constraints that most businesses do not face.
                  The good news: a chatbot does not require a significant investment. VocUI&apos;s
                  free plan includes chatbot creation, knowledge base training, and website
                  embedding — everything a small to mid-sized nonprofit needs to get started.
                </p>

                {/* Budget tips — unique to nonprofit post */}
                <div className="bg-secondary-50 dark:bg-secondary-800/40 rounded-xl p-6 mt-6 mb-6">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                    Maximize impact on a nonprofit budget
                  </p>
                  <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                    <li><strong>Start with one chatbot.</strong> Deploy on your donation page first — the highest-impact placement for most nonprofits.</li>
                    <li><strong>Use existing content.</strong> Your website, annual report, and volunteer handbook are all you need. No content creation required.</li>
                    <li><strong>Time the launch.</strong> Go live before your next fundraising campaign to capture the traffic surge.</li>
                    <li><strong>Measure before upgrading.</strong> Track donation page abandonment and chatbot conversations for 30 days before deciding whether to upgrade.</li>
                    <li><strong>Internal champion.</strong> Assign one team member to refresh the knowledge base quarterly — it takes 15 minutes.</li>
                  </ul>
                </div>

                <p>
                  Many nonprofits stay on the free tier permanently. Only upgrade when your
                  engagement volume exceeds the included limits or you need multiple chatbots
                  for different programs. The ROI calculation is simple: if the chatbot
                  prevents even one donation page abandonment per month, it has likely paid
                  for itself.
                </p>
              </section>

              {/* Section 8 — training and deployment combined */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Train It On and Where to Deploy It
                </h2>
                <p>
                  Start with what you already have. Your website is the most obvious source:
                  mission statement, program pages, impact statistics, staff bios, and any
                  existing FAQ pages. VocUI scrapes your entire site in minutes. Beyond your
                  website, add annual reports, volunteer handbooks, event guides, giving
                  level descriptions, and newsletter archives.
                </p>
                <p className="mt-4">
                  Deploy strategically. The homepage catches first-time visitors learning about
                  your mission. The donation page addresses giving hesitations. The volunteer
                  page fields questions about commitments and requirements. Each placement
                  serves a different audience at a different stage of engagement. Customize the
                  chatbot&apos;s appearance to match your branding and write a system prompt
                  that reflects your nonprofit&apos;s tone: warm, mission-driven, and
                  informative. For detailed embedding instructions, read our guide on{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    how to add a chatbot to your website
                  </Link>
                  . Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    pricing page
                  </Link>
                  {' '}to find the right plan for your organization.
                </p>
              </section>

              <ChatPreview
                botName="Mission Bot"
                industry="Nonprofit"
                messages={[
                  { role: 'user', text: 'How can I donate?' },
                  { role: 'bot', text: 'Thank you for your interest in supporting our mission! You can make a one-time or recurring donation through our secure donation page. We accept credit cards, PayPal, and bank transfers. Every dollar goes directly to our programs.' },
                  { role: 'user', text: 'Is my donation tax-deductible?' },
                  { role: 'bot', text: "Yes! We are a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law. You'll receive a receipt via email within 24 hours of your gift for your tax records." },
                ]}
              />

              {/* FAQ section */}
              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Can a chatbot on my donation page actually increase giving?',
                      a: "Yes. Visitors on your donation page are already considering a gift. If they have a last-minute question \u2014 \u201CIs my donation tax-deductible?\u201D \u201CHow are funds allocated?\u201D \u201CWhat do different giving levels include?\u201D \u2014 and there is no instant way to get an answer, some will abandon the page rather than search your site or send an email. A chatbot answers these hesitations in real time without the donor navigating away from the donation form. It reduces donation page abandonment by addressing the questions that stall the giving decision at the exact moment they arise.",
                    },
                    {
                      q: 'Does it work with Salesforce Nonprofit or Bloomerang?',
                      a: "VocUI does not directly integrate with donor management CRMs like Salesforce Nonprofit Cloud, Bloomerang, Little Green Light, or DonorPerfect. However, you can connect them through workflow automation tools like Zapier or Make. For example, set up a workflow that creates a new contact in Salesforce when a chatbot conversation includes a donor\u2019s email address, or log engagement data in Bloomerang for follow-up. The chatbot focuses on answering questions and directing visitors to the right next step \u2014 your CRM handles the relationship management from there.",
                    },
                    {
                      q: 'Is this affordable on a nonprofit budget?',
                      a: "VocUI offers a free plan that includes chatbot creation, knowledge base training, and website embedding. For most small to mid-sized nonprofits, the free tier covers everything needed to get started. If your organization handles higher chat volumes or needs multiple chatbots for different programs, paid plans are available at accessible price points. Many nonprofits start free and only upgrade when engagement exceeds the included limits.",
                    },
                    {
                      q: 'How do we avoid sharing sensitive donor information through the chatbot?',
                      a: "Never train the chatbot on content containing donor names, giving history, contact lists, or internal financial records. The knowledge base should contain only public-facing content: your mission statement, program descriptions, impact reports, volunteer information, and event details. The chatbot has no connection to your donor database, CRM, or accounting system. If a visitor shares personal or financial information in a chat message, your system prompt should instruct the chatbot to redirect them to a secure communication channel.",
                    },
                    {
                      q: 'Can the chatbot help recruit and onboard volunteers?',
                      a: "Yes. Train it on your volunteer handbook, role descriptions, time commitments, and onboarding process. When someone asks \u201CHow can I volunteer?\u201D the chatbot explains what is available, what is expected, and links to your signup form. Volunteers arrive at orientation already informed about the commitment, which reduces no-shows and speeds up onboarding.",
                    },
                    {
                      q: 'How does it work during Giving Tuesday or annual campaigns?',
                      a: "Update your knowledge base before the campaign with current giving levels, matching gift information, and campaign goals. The chatbot handles the surge of questions that comes with high-traffic fundraising events \u2014 \u201CIs there a matching gift?\u201D \u201CHow much has been raised so far?\u201D \u2014 without your team working overtime. Launch the updated content the same day your campaign goes live.",
                    },
                    {
                      q: 'Can we have separate chatbots for different programs?',
                      a: "Yes. If your nonprofit runs distinct programs \u2014 a food bank, an afterschool program, and a shelter, for example \u2014 you can create separate chatbots for each, trained on program-specific content. Deploy each chatbot on its respective program page. This keeps answers focused and prevents a visitor asking about the food bank from getting shelter program information.",
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
