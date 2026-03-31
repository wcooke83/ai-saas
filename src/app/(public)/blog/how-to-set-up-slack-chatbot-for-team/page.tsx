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
      datePublished: '2025-03-31',
      dateModified: '2025-03-31',
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
          url: 'https://vocui.com/logo.png',
        },
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
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
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
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    <strong>A VocUI account.</strong> Sign up at{' '}
                    <Link
                      href="/login?mode=signup"
                      className="text-primary-500 hover:text-primary-600 underline"
                    >
                      vocui.com
                    </Link>{' '}
                    if you haven&apos;t already. The free plan includes Slack integration.
                  </li>
                  <li>
                    <strong>Slack workspace admin access.</strong> You need permission to install
                    apps in your Slack workspace. If you&apos;re not a workspace admin, ask your
                    IT team to approve the VocUI Slack app.
                  </li>
                  <li>
                    <strong>Internal documentation ready to upload.</strong> Gather the docs you
                    want the bot to know — employee handbook, IT runbooks, onboarding checklists,
                    HR policies, process docs. These can be URLs (Notion, Confluence, Google
                    Docs published to web) or PDF/DOCX files.
                  </li>
                </ul>
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
                <ol className="list-decimal list-inside space-y-4 mt-4 ml-4">
                  <li>
                    <strong>Create a chatbot in VocUI.</strong> Log in to your dashboard and
                    click &quot;Create Chatbot.&quot; Give it a name your team will recognize —
                    &quot;Team Assistant&quot; or &quot;HR Bot&quot; works well.
                  </li>
                  <li>
                    <strong>Add your knowledge sources.</strong> Upload your internal docs. You
                    can add URLs (the bot will scrape the content), upload PDFs and DOCX files,
                    or paste text directly. Start with the content that covers your most
                    frequently asked questions.
                  </li>
                  <li>
                    <strong>Configure the system prompt.</strong> Tell the bot its role:
                    &quot;You are an internal knowledge assistant for [Company Name]. Answer
                    questions using only the provided documentation. If you don&apos;t know the
                    answer, direct the person to the appropriate team or contact.&quot;
                  </li>
                  <li>
                    <strong>Connect to Slack.</strong> In your chatbot&apos;s settings, go to the{' '}
                    <strong>Integrations</strong> tab and click <strong>Connect to Slack</strong>.
                    You&apos;ll be redirected to Slack to authorize the VocUI app. Review the
                    permissions and click <strong>Allow</strong>.
                  </li>
                  <li>
                    <strong>Invite the bot to channels.</strong> In Slack, go to the channels
                    where you want the bot available. Type{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      /invite @VocUI
                    </code>{' '}
                    (or whatever you named your bot) to add it.
                  </li>
                  <li>
                    <strong>Test it.</strong> Mention the bot with a question:
                    &quot;@VocUI How do I submit an expense report?&quot; If it answers
                    correctly, you&apos;re live. If not, review your knowledge sources and system
                    prompt.
                  </li>
                </ol>
                <p className="mt-4">
                  For more details on the Slack integration, see our{' '}
                  <Link
                    href="/slack-chatbot"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    Slack chatbot feature page
                  </Link>
                  .
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Training on Internal Content
                </h2>
                <p>
                  The bot&apos;s usefulness depends entirely on what you train it on. Here&apos;s
                  what to prioritize for an internal team chatbot:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 ml-4">
                  <li>
                    <strong>HR policies.</strong> PTO policies, benefits information, expense
                    report procedures, remote work guidelines, and leave request processes. These
                    are among the most-asked questions in any organization.
                  </li>
                  <li>
                    <strong>IT and security procedures.</strong> How to reset passwords, request
                    software access, report security incidents, set up VPN, and connect to
                    printers. IT teams field these questions constantly.
                  </li>
                  <li>
                    <strong>Onboarding documentation.</strong> First-week checklists, tool setup
                    guides, team structure docs, and &quot;who do I ask about X&quot; directories.
                    New hires are the heaviest question-askers, and a bot lets them self-serve
                    without feeling like a burden.
                  </li>
                  <li>
                    <strong>Team SOPs.</strong> Standard operating procedures for recurring tasks
                    — deployment processes, client onboarding steps, content approval workflows,
                    and incident response procedures.
                  </li>
                </ul>
                <p className="mt-4">
                  Start with 10-15 of your most important documents and expand from there. You
                  can always add more knowledge sources later as you identify gaps. For a deeper
                  dive, see our guide on{' '}
                  <Link
                    href="/blog/how-to-build-internal-knowledge-bot"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    building an internal knowledge bot
                  </Link>
                  .
                </p>
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
                <ul className="list-disc list-inside space-y-3 mt-4 ml-4">
                  <li>
                    <strong>Announce it with examples.</strong> Don&apos;t just say &quot;we
                    added a bot.&quot; Post a message in your main Slack channel showing 3-5
                    example questions and the bot&apos;s actual answers. Seeing it work is more
                    convincing than being told it works.
                  </li>
                  <li>
                    <strong>Start with one team.</strong> Roll out to a single team first — HR
                    support or IT help desk are great starting points. Get feedback, refine the
                    knowledge base, then expand to other teams.
                  </li>
                  <li>
                    <strong>Redirect questions to the bot.</strong> When someone asks a question
                    the bot can answer, reply with: &quot;Great question! Try asking @VocUI —
                    it has the latest policy on that.&quot; This trains the habit without being
                    dismissive.
                  </li>
                  <li>
                    <strong>Keep the knowledge base current.</strong> Nothing kills adoption
                    faster than outdated answers. When policies change, update the bot&apos;s
                    knowledge sources immediately. Assign an owner — someone responsible for
                    keeping the content fresh.
                  </li>
                  <li>
                    <strong>Review conversations monthly.</strong> Check the chat logs in VocUI
                    to see what questions are being asked, which ones the bot handles well, and
                    where it falls short. Use this data to continuously improve.
                  </li>
                </ul>
                <p className="mt-4">
                  View{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
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
            <h2 className="text-2xl font-bold mb-3">Your turn — build it in under 5 minutes</h2>
            <p className="text-white/80 mb-2">
              Follow the steps you just read, but with your own content. Upload your docs, customize the look, and go live.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. No code, no developers, no waiting.
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
