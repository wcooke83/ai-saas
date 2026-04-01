import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { DashboardPath } from '@/components/blog/dashboard-path';
import { StepFlow } from '@/components/blog/process-visuals';
import { StyledNumberedList, StyledBulletList } from '@/components/blog/styled-lists';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Set Up a Slack Chatbot for Your Team | VocUI',
  description:
    'Deploy an AI chatbot in Slack that answers team questions from your internal docs, HR policies, and SOPs. Set up takes under 30 minutes.',
  openGraph: {
    title: 'How to Set Up a Slack Chatbot for Your Team | VocUI',
    description:
      'Deploy an AI chatbot in Slack that answers team questions from your internal docs, HR policies, and SOPs. Set up takes under 30 minutes.',
    url: 'https://vocui.com/blog/how-to-set-up-slack-chatbot-for-team',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Set Up a Slack Chatbot for Your Team | VocUI',
    description:
      'Deploy an AI chatbot in Slack that answers team questions from your internal docs, HR policies, and SOPs. Set up takes under 30 minutes.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-set-up-slack-chatbot-for-team' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Set Up a Slack Chatbot for Your Team',
      description:
        'Deploy an AI chatbot in Slack that answers team questions from your internal docs, HR policies, and SOPs. Set up takes under 30 minutes.',
      url: 'https://vocui.com/blog/how-to-set-up-slack-chatbot-for-team',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-set-up-slack-chatbot-for-team',
      },
      datePublished: '2026-03-05',
      dateModified: '2026-04-01',
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
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/how-to-set-up-slack-chatbot-for-team/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does the chatbot read all Slack messages?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The VocUI Slack bot only responds when directly mentioned (@VocUI) or messaged via DM. It does not read, store, or process messages in channels where it is not mentioned. Your team\'s private conversations remain private.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I restrict which channels the chatbot responds in?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You control which channels the bot is invited to. Only add the bot to channels where you want it available — like #help, #hr-questions, or #engineering-docs. It will not respond in channels where it has not been invited.',
          },
        },
        {
          '@type': 'Question',
          name: 'What content should I train the Slack bot on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with your most-asked internal questions: HR policies (PTO, benefits, expense reports), IT procedures (password resets, software access), onboarding docs, and team SOPs. Upload these as PDFs or paste the URLs if they are hosted on an internal wiki or Notion.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the chatbot secure for internal docs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. VocUI encrypts knowledge sources at rest and in transit. Your content is used only to generate responses for your chatbot — it is never shared with other users or used to train models. The Slack integration uses OAuth with scoped permissions, so the bot only has access to the channels you approve.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can multiple teams use the same bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. A single VocUI chatbot can be added to multiple Slack channels. Each channel gets the same knowledge base. If you need different knowledge bases for different teams (e.g., separate HR and Engineering bots), create separate chatbots in VocUI and install each one in the relevant channels.',
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
          name: 'How to Set Up a Slack Chatbot for Your Team',
          item: 'https://vocui.com/blog/how-to-set-up-slack-chatbot-for-team',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToSetUpSlackChatbotForTeamPage() {
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
                Slack Chatbot
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2026-03-05" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 5, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  7 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Set Up a Slack Chatbot for Your Team
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A Slack chatbot trained on your internal docs gives your team instant answers to
                common questions — HR policies, IT procedures, onboarding steps, and company
                SOPs. Set it up in under 30 minutes with VocUI, add it to the channels that need
                it, and stop answering the same questions over and over.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Put a Chatbot in Slack
                </h2>
                <p>
                  Your team already lives in Slack. When someone has a question — &quot;How many
                  PTO days do I have?&quot; &quot;What&apos;s the process for requesting a
                  software license?&quot; &quot;Where&apos;s the brand guidelines doc?&quot; —
                  they ask in Slack. And someone on your team has to stop what they&apos;re doing
                  to answer.
                </p>
                <p className="mt-4">
                  These interruptions add up. HR teams, IT departments, and team leads spend
                  hours every week answering the same questions. The answers exist somewhere — in
                  a Google Doc, a Notion page, a PDF handbook — but finding them takes effort.
                  People default to asking a colleague because it&apos;s faster.
                </p>
                <p className="mt-4">
                  A Slack chatbot changes this dynamic. Instead of pinging a colleague, team
                  members mention the bot and get an instant answer pulled from your actual
                  documentation. The person who used to field those questions gets their time
                  back. New hires can self-serve instead of feeling like they&apos;re bothering
                  everyone. And the answers are consistent every time — no more conflicting
                  responses from different people.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What You Need
                </h2>
                <p>
                  Before starting, make sure you have the following ready:
                </p>
                <StyledBulletList items={[
                  { title: 'A VocUI account.', description: <><Link href="/login?mode=signup" className="text-primary-600 dark:text-primary-400 hover:underline">Sign up at vocui.com</Link>{' '}if you haven&apos;t already. The free plan includes Slack integration.</> },
                  { title: 'Slack workspace admin access.', description: 'You need permission to install apps in your Slack workspace. If you\u2019re not a workspace admin, ask your IT team to approve the VocUI Slack app.' },
                  { title: 'Internal documentation ready to upload.', description: 'Gather the docs you want the bot to know \u2014 employee handbook, IT runbooks, onboarding checklists, HR policies, process docs. These can be URLs (Notion, Confluence, Google Docs published to web) or PDF/DOCX files.' },
                ]} />
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step Setup
                </h2>
                <p>
                  The full setup takes about 20-30 minutes, with most of that time spent
                  uploading your knowledge sources. The Slack connection itself is a few clicks.
                </p>

                <StepFlow
                  steps={[
                    { number: 1, title: 'Create Chatbot', description: 'Name it for your team' },
                    { number: 2, title: 'Add Knowledge', description: 'Upload internal docs' },
                    { number: 3, title: 'System Prompt', description: 'Set role and scope' },
                    { number: 4, title: 'Connect Slack', description: 'Authorize in one click' },
                    { number: 5, title: 'Invite to Channels', description: 'Add bot where needed' },
                    { number: 6, title: 'Test', description: 'Mention and verify' },
                  ]}
                  caption="Six steps to a working Slack chatbot"
                />

                <StyledNumberedList items={[
                  { title: 'Create a chatbot in VocUI.', description: 'Log in to your dashboard and click \u201CCreate Chatbot.\u201D Give it a name your team will recognize \u2014 \u201CTeam Assistant\u201D or \u201CHR Bot\u201D works well.' },
                  { title: 'Add your knowledge sources.', description: 'Upload your internal docs. You can add URLs (the bot will scrape the content), upload PDFs and DOCX files, or paste text directly. Start with the content that covers your most frequently asked questions.' },
                  { title: 'Configure the system prompt.', description: 'Tell the bot its role: \u201CYou are an internal knowledge assistant for [Company Name]. Answer questions using only the provided documentation. If you don\u2019t know the answer, direct the person to the appropriate team or contact.\u201D' },
                  { title: 'Connect to Slack.', description: <>In your chatbot&apos;s settings, go to the <strong>Integrations</strong> tab and click <strong>Connect to Slack</strong>. You&apos;ll be redirected to Slack to authorize the VocUI app. Review the permissions and click <strong>Allow</strong>.<DashboardPath steps={['Chatbots', 'Your chatbot', 'Deploy', 'Slack']} tip="Click Connect to authorize your Slack workspace." /></> },
                  { title: 'Invite the bot to channels.', description: <>In Slack, go to the channels where you want the bot available. Type <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">/invite @VocUI</code> (or whatever you named your bot) to add it.</> },
                  { title: 'Test it.', description: 'Mention the bot with a question: \u201C@VocUI How do I submit an expense report?\u201D If it answers correctly, you\u2019re live. If not, review your knowledge sources and system prompt.' },
                ]} />
                <p className="mt-4">
                  For more details on the Slack integration, see our{' '}
                  <Link
                    href="/slack-chatbot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Slack chatbot feature page
                  </Link>
                  .
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Choosing Content for a Slack Bot
                </h2>
                <p>
                  For detailed guidance on what knowledge sources to include, see our{' '}
                  <Link
                    href="/blog/how-to-build-internal-knowledge-bot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    internal knowledge bot guide
                  </Link>
                  . When deploying via Slack specifically, keep these considerations in mind:
                </p>
                <StyledBulletList items={[
                  { title: 'Keep answers chat-sized.', description: 'Slack responses appear in conversation threads. Knowledge chunks that produce concise, 2-3 paragraph answers work best. If a source document is very long, the bot may produce wall-of-text replies that are hard to read in a chat context \u2014 consider breaking those docs into shorter, topic-specific sections before uploading.' },
                  { title: 'Match content to your channels.', description: 'If you\u2019re adding the bot to #ask-hr, prioritize HR docs. If it\u2019s going into #engineering-help, load up your runbooks and architecture docs. You can create multiple bots in VocUI with different knowledge bases and deploy each to the relevant channel.' },
                  { title: 'Include quick-reference material.', description: 'Slack users expect fast answers. Content that works well: policy summaries, step-by-step procedures, contact directories, and FAQ-style docs. Content that works less well: 50-page strategy documents or dense legal agreements.' },
                  { title: 'Account for Slack search overlap.', description: 'Your team already uses Slack\u2019s built-in search. The bot adds the most value for content that lives outside Slack \u2014 PDFs, Notion pages, Google Docs, and intranet sites that Slack search cannot reach.' },
                ]} />
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Best Practices for Team Adoption
                </h2>
                <p>
                  Getting the bot set up is half the battle. Getting your team to actually use it
                  is the other half. Here&apos;s how to drive adoption:
                </p>
                <StyledBulletList items={[
                  { title: 'Announce it with examples.', description: 'Don\u2019t just say \u201Cwe added a bot.\u201D Post a message in your main Slack channel showing 3-5 example questions and the bot\u2019s actual answers. Seeing it work is more convincing than being told it works.' },
                  { title: 'Start with one team.', description: 'Roll out to a single team first \u2014 HR support or IT help desk are great starting points. Get feedback, refine the knowledge base, then expand to other teams.' },
                  { title: 'Redirect questions to the bot.', description: 'When someone asks a question the bot can answer, reply with: \u201CGreat question! Try asking @VocUI \u2014 it has the latest policy on that.\u201D This trains the habit without being dismissive.' },
                  { title: 'Keep the knowledge base current.', description: 'Nothing kills adoption faster than outdated answers. When policies change, update the bot\u2019s knowledge sources immediately. Assign an owner \u2014 someone responsible for keeping the content fresh.' },
                  { title: 'Review conversations monthly.', description: 'Check the chat logs in VocUI to see what questions are being asked, which ones the bot handles well, and where it falls short. Use this data to continuously improve.' },
                ]} />
                <p className="mt-4">
                  View{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    our pricing plans
                  </Link>{' '}
                  to find the right fit for your team size.
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
                      q: 'Does the chatbot read all Slack messages?',
                      a: "No. The VocUI Slack bot only responds when directly mentioned (@VocUI) or messaged via DM. It does not read, store, or process messages in channels where it is not mentioned. Your team's private conversations remain private.",
                    },
                    {
                      q: 'Can I restrict which channels the chatbot responds in?',
                      a: 'Yes. You control which channels the bot is invited to. Only add the bot to channels where you want it available — like #help, #hr-questions, or #engineering-docs. It will not respond in channels where it has not been invited.',
                    },
                    {
                      q: 'What content should I train the Slack bot on?',
                      a: 'Start with your most-asked internal questions: HR policies (PTO, benefits, expense reports), IT procedures (password resets, software access), onboarding docs, and team SOPs. Upload these as PDFs or paste the URLs if they are hosted on an internal wiki or Notion.',
                    },
                    {
                      q: 'Is the chatbot secure for internal docs?',
                      a: 'Yes. VocUI encrypts knowledge sources at rest and in transit. Your content is used only to generate responses for your chatbot — it is never shared with other users or used to train models. The Slack integration uses OAuth with scoped permissions, so the bot only has access to the channels you approve.',
                    },
                    {
                      q: 'Can multiple teams use the same bot?',
                      a: 'Yes. A single VocUI chatbot can be added to multiple Slack channels. Each channel gets the same knowledge base. If you need different knowledge bases for different teams (e.g., separate HR and Engineering bots), create separate chatbots in VocUI and install each one in the relevant channels.',
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
            <h2 className="text-2xl font-bold mb-3">You read the guide -- now build it</h2>
            <p className="text-white/80 mb-2">
              Upload your content and follow along with a working chatbot in front of you.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Most people finish setup in under 5 minutes.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Create your chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Free plan included -- no credit card needed</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
