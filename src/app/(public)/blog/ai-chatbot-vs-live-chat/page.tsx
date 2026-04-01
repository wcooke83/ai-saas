import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { ComparisonScorecard } from '@/components/blog/process-visuals';
import { ComparisonInfographic } from '@/components/blog/infographics';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'AI Chatbot vs Live Chat: Which Is Right for Your Business? | VocUI',
  description:
    'Comparing AI chatbots and live chat: cost, availability, scalability, and customer satisfaction. Learn which is right for your business — or when to use both.',
  openGraph: {
    title: 'AI Chatbot vs Live Chat: Which Is Right for Your Business? | VocUI',
    description:
      'Comparing AI chatbots and live chat: cost, availability, scalability, and customer satisfaction. Learn which is right for your business — or when to use both.',
    url: 'https://vocui.com/blog/ai-chatbot-vs-live-chat',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot vs Live Chat: Which Is Right for Your Business? | VocUI',
    description:
      'Comparing AI chatbots and live chat: cost, availability, scalability, and customer satisfaction. Learn which is right for your business — or when to use both.',
  },
  alternates: { canonical: 'https://vocui.com/blog/ai-chatbot-vs-live-chat' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot vs Live Chat: Which Is Right for Your Business?',
      description:
        'Comparing AI chatbots and live chat: cost, availability, scalability, and customer satisfaction. Learn which is right for your business — or when to use both.',
      url: 'https://vocui.com/blog/ai-chatbot-vs-live-chat',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/ai-chatbot-vs-live-chat',
      },
      datePublished: '2026-01-02',
      dateModified: '2026-01-02',
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
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/ai-chatbot-vs-live-chat/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is an AI chatbot cheaper than live chat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In most cases, yes. Live chat requires hiring, training, and managing human agents who work in shifts. A single support agent costs $35,000–$55,000 per year in salary alone, plus benefits, management overhead, and tooling costs. An AI chatbot handles unlimited conversations simultaneously for a fixed monthly fee — typically $0 to $99 per month depending on volume. The cost difference is especially dramatic for businesses that need 24/7 coverage, since that requires multiple shifts of live agents versus a single chatbot that never clocks out.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use both AI chatbot and live chat together?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, and this hybrid approach is often the best strategy. The AI chatbot handles the first line of support — answering common questions, providing product information, and resolving straightforward issues instantly. When a conversation requires human judgment, emotional sensitivity, or access to account-specific data the chatbot cannot reach, it escalates to a live agent with the full conversation context. This reduces the volume of chats your human team handles by 60–80% while ensuring complex cases still get personal attention.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do customers prefer talking to humans?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on the situation. Studies show that 62% of consumers prefer using a chatbot over waiting for a human agent. For simple, informational queries — store hours, return policies, product specs — customers want fast answers, and they do not care whether those answers come from a person or a bot. For complex, emotional, or high-stakes issues — billing disputes, complaints, sensitive account changes — most customers still prefer a human. The key is matching the channel to the conversation type rather than forcing every interaction through one path.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast can I set up an AI chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'With VocUI, you can have a working AI chatbot deployed in under an hour. The setup process involves three steps: create a chatbot, add your knowledge sources (website URLs, documents, or FAQ content), and embed the widget on your site. VocUI automatically scrapes your website, chunks the content, and builds the knowledge base. There is no training data to format, no intents to configure, and no conversation flows to design. The AI understands natural language out of the box and answers based on your content.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if the chatbot cannot answer a question?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A well-configured AI chatbot acknowledges when it does not have enough information to answer confidently. With VocUI, you can customize the system prompt to define fallback behavior — such as suggesting the visitor email your support team, providing a link to schedule a call, or collecting the visitor\'s contact information so your team can follow up. The chatbot does not fabricate answers; it draws only from the knowledge base you provide and clearly indicates when a question falls outside its scope.',
          },
        },
      ],
    },
  ],
};

// ─── Comparison Data ──────────────────────────────────────────────────────────

const comparisonRows = [
  { feature: 'Availability', liveChat: 'Business hours (or expensive 24/7 shifts)', aiChatbot: '24/7/365, instant responses' },
  { feature: 'Cost per month', liveChat: '$3,000–$10,000+ (agents + tools)', aiChatbot: '$0–$99 (fixed SaaS fee)' },
  { feature: 'Scalability', liveChat: 'Linear — more volume = more agents', aiChatbot: 'Handles unlimited concurrent chats' },
  { feature: 'Personalization', liveChat: 'High — human empathy and judgment', aiChatbot: 'Moderate — trained on your content' },
  { feature: 'Setup time', liveChat: 'Weeks (hiring, training, tooling)', aiChatbot: 'Under 1 hour with VocUI' },
  { feature: 'Consistency', liveChat: 'Varies by agent quality and mood', aiChatbot: 'Same accurate answer every time' },
  { feature: 'Complex issues', liveChat: 'Excellent — nuanced problem-solving', aiChatbot: 'Limited — escalates to humans' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AiChatbotVsLiveChatPage() {
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
                AI Chatbot vs Live Chat
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Strategy
                </span>
                <time dateTime="2026-01-02" className="text-xs text-secondary-400 dark:text-secondary-500">Jan 2, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  9 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbot vs Live Chat: Which Is Right for Your Business?
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                AI chatbots and live chat both help customers get answers, but they work
                differently and cost differently. AI chatbots provide instant, 24/7 responses
                at a fixed cost. Live chat offers human empathy but requires staffing. Most
                businesses benefit from starting with an AI chatbot and adding live chat for
                complex cases.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Support Dilemma
                </h2>
                <p>
                  Every growing business faces the same question: how do you give customers fast,
                  helpful support without burning through your budget? Live chat has been the go-to
                  answer for a decade. You put a chat widget on your site, hire some agents, and
                  customers get real-time help from real people. It works — until it doesn&apos;t.
                  And the stakes are higher than you might think: according to <a href="https://www.intercom.com/blog/customer-service-metrics-ai/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Intercom</a>, each additional minute of wait time decreases customer satisfaction by 4.6%.
                </p>
                <p className="mt-4">
                  The problem is scale. When you have 50 visitors a day, one agent handles it. When
                  you have 500, you need a team. When you have 5,000, you need shifts, managers,
                  QA processes, and a significant payroll commitment. Meanwhile, 70–80% of the
                  questions coming in are the same ones your team answered yesterday and the day
                  before that. AI chatbots change this equation entirely, and the question is no
                  longer &quot;should I use one?&quot; but &quot;where does each tool fit?&quot;
                </p>
                <p className="mt-4">
                  This guide breaks down both options honestly — what each does well, where each
                  falls short, and how to decide which is right for your business. For many
                  companies, the answer is both. But understanding the tradeoffs helps you invest
                  in the right order.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How Live Chat Works (and Its Limitations)
                </h2>
                <p>
                  Live chat connects website visitors to a human agent in real time. The visitor
                  types a message, an agent sees it in a dashboard, and a conversation begins.
                  It&apos;s personal, flexible, and great for nuanced problems. A skilled agent
                  can read emotional cues, ask clarifying questions, and handle situations that
                  require judgment — like processing a refund exception or de-escalating a
                  frustrated customer.
                </p>
                <p className="mt-4">
                  But live chat has structural limitations. First, availability: unless you staff
                  24/7, visitors outside business hours hit an offline form. Second, cost: the
                  average customer support agent in the US costs $40,000–$55,000 per year, and
                  you need enough agents to handle peak volume without long wait times. Third,
                  consistency: different agents give different answers, and quality varies with
                  training, experience, and even time of day. Fourth, scalability: every
                  additional conversation requires an additional unit of human attention. You
                  cannot serve 10x more visitors without roughly 10x more agents.
                </p>
                <p className="mt-4">
                  These limitations are not flaws — they&apos;re inherent to any human-powered
                  system. Live chat excels at complex, high-value interactions. The question is
                  whether every interaction on your site needs that level of human involvement,
                  or whether many of them could be handled faster and cheaper by a machine.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How AI Chatbots Work Differently
                </h2>
                <p>
                  An AI chatbot like VocUI doesn&apos;t wait for a human to type a response.
                  It&apos;s trained on your content — your website, documentation, FAQs, and
                  uploaded files — and uses that knowledge base to answer visitor questions
                  instantly. There&apos;s no queue, no wait time, and no shift schedule. The
                  chatbot is available 24 hours a day, 7 days a week, and handles an unlimited
                  number of conversations simultaneously. According to <a href="https://www.chatbot.com/blog/chatbot-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Chatbot.com</a>, 64% of consumers say 24/7 availability is the most helpful chatbot feature — and it&apos;s the one thing live chat can never match affordably.
                </p>
                <p className="mt-4">
                  Modern AI chatbots are not the rigid, rule-based bots of five years ago. They
                  understand natural language, handle follow-up questions, and provide contextual
                  answers that draw from your specific content. When a visitor asks &quot;Do you
                  offer monthly billing?&quot; followed by &quot;What about annual discounts?&quot;
                  the chatbot understands the context and responds appropriately. For more on how
                  knowledge-base chatbots work, see our{' '}
                  <Link
                    href="/blog/what-is-a-knowledge-base-chatbot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    explainer on knowledge base chatbots
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  The tradeoff is depth. An AI chatbot answers based on the content you&apos;ve
                  provided. It cannot access your CRM, look up a specific order, or make
                  judgment calls about exceptions to policy. It excels at informational queries
                  — the questions that make up the bulk of support volume — and gracefully
                  escalates when it reaches its limits.
                </p>
              </section>

              {/* Section 4 – Comparison Table */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Head-to-Head Comparison
                </h2>
                <p>
                  Here&apos;s how AI chatbots and live chat stack up across the factors that
                  matter most to your business:
                </p>

                <div className="overflow-x-auto mt-6 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Comparison of AI chatbot versus live chat across key factors</caption>
                    <thead>
                      <tr className="bg-secondary-50 dark:bg-secondary-800/60">
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Factor</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Live Chat</th>
                        <th scope="col" className="text-left px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">AI Chatbot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                      {comparisonRows.map((row) => (
                        <tr key={row.feature} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30">
                          <th scope="row" className="px-4 py-3 font-medium text-secondary-900 dark:text-secondary-100">{row.feature}</th>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{row.liveChat}</td>
                          <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{row.aiChatbot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <ComparisonScorecard
                  items={[
                    { feature: 'Availability (24/7)', score1: 10, score2: 5, label1: 'AI Chatbot', label2: 'Live Chat' },
                    { feature: 'Cost Efficiency', score1: 9, score2: 4, label1: 'AI Chatbot', label2: 'Live Chat' },
                    { feature: 'Scalability', score1: 10, score2: 4, label1: 'AI Chatbot', label2: 'Live Chat' },
                    { feature: 'Personalization', score1: 6, score2: 9, label1: 'AI Chatbot', label2: 'Live Chat' },
                    { feature: 'Complex Issues', score1: 4, score2: 9, label1: 'AI Chatbot', label2: 'Live Chat' },
                    { feature: 'Setup Speed', score1: 9, score2: 3, label1: 'AI Chatbot', label2: 'Live Chat' },
                    { feature: 'Consistency', score1: 9, score2: 6, label1: 'AI Chatbot', label2: 'Live Chat' },
                  ]}
                  caption="Visual scorecard: AI chatbot vs live chat across key factors"
                />

                <p className="mt-4">
                  The pattern is clear: AI chatbots win on cost, availability, and scalability.
                  Live chat wins on personalization and complex problem-solving. The right choice
                  depends on your support volume, budget, and the complexity of questions your
                  customers typically ask.
                </p>
              </section>

              <ComparisonInfographic
                title="AI Chatbot vs Live Chat"
                leftLabel="AI Chatbot"
                rightLabel="Live Agent"
                items={[
                  { left: '24/7/365 availability', right: 'Business hours only' },
                  { left: '$0-$99/mo fixed cost', right: '$3,000-$10,000+/mo in staffing' },
                  { left: 'Instant response (<5 sec)', right: '1-5 min avg. wait time' },
                  { left: 'Unlimited concurrent chats', right: 'Limited by headcount' },
                  { left: 'Consistent, accurate answers', right: 'Varies by agent and mood' },
                  { left: 'Setup in under 1 hour', right: 'Weeks of hiring and training' },
                ]}
              />

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  When to Use Live Chat
                </h2>
                <p>
                  Live chat is the right choice when conversations require human judgment, emotional
                  intelligence, or access to internal systems. If your customers frequently need
                  help with billing disputes, account-specific troubleshooting, or situations that
                  require exceptions to standard policy, a human agent adds value that a chatbot
                  cannot replicate.
                </p>
                <p className="mt-4">
                  High-value sales conversations also benefit from live chat. If you sell enterprise
                  software with six-figure contracts, a prospect who engages with your chat widget
                  deserves a human who can answer detailed technical questions, discuss custom
                  pricing, and build a relationship. The ROI of closing one deal far exceeds the
                  cost of staffing the chat.
                </p>
                <p className="mt-4">
                  Companies in regulated industries — healthcare, finance, legal — may also need
                  live agents for conversations that require compliance oversight or where
                  giving incorrect information carries legal risk. In these cases, live chat
                  provides the accountability and nuance that automated systems cannot.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  When to Use an AI Chatbot
                </h2>
                <p>
                  An AI chatbot is the right choice when most of your support volume consists of
                  informational questions with known answers. According to <a href="https://www.tidio.com/blog/chatbot-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Tidio</a>, 62% of consumers prefer using a chatbot over waiting for a human agent — and that preference is strongest for exactly these types of questions. Questions like &quot;What are your
                  hours?&quot; &quot;Do you offer X feature?&quot; &quot;How does pricing
                  work?&quot; and &quot;What&apos;s your return policy?&quot; do not require a
                  human. They require access to accurate information and the ability to deliver
                  it quickly. That&apos;s exactly what a chatbot does. To learn more about
                  reducing ticket volume, read our guide on{' '}
                  <Link
                    href="/blog/how-to-reduce-customer-support-tickets"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    how to reduce customer support tickets
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  Chatbots are also the right starting point for businesses that cannot afford
                  to staff live chat. If you are a small team with no dedicated support
                  headcount, an AI chatbot gives you 24/7 coverage for a fraction of the cost
                  of one part-time agent. It handles the repetitive questions so your team can
                  focus on building the product and growing the business.
                </p>
                <p className="mt-4">
                  After-hours coverage is another strong use case. Even if you have live agents
                  during business hours, evenings and weekends represent a coverage gap. An AI
                  chatbot fills that gap without requiring overnight shifts. Visitors who land
                  on your site at 11 PM still get their questions answered, and potential leads
                  do not bounce because nobody was available to help. Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    pricing
                  </Link>
                  {' '}to see how affordable it is to get started.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Hybrid Approach
                </h2>
                <p>
                  For most businesses, the best strategy is not choosing one or the other — it&apos;s
                  using both. The AI chatbot handles the first line of support, answering common
                  questions instantly and resolving 60–80% of conversations without human
                  involvement. When a conversation exceeds the chatbot&apos;s capability — the
                  visitor has a complex problem, expresses frustration, or explicitly asks for a
                  human — it escalates to a live agent with the full conversation context.
                </p>
                <p className="mt-4">
                  This hybrid model gives you the best of both worlds. Customers with simple
                  questions get instant answers. Customers with complex problems get human
                  attention. Your support team&apos;s workload drops dramatically because they
                  only handle the conversations that actually need them. And because the chatbot
                  provides conversation context on handoff, agents do not waste time re-asking
                  questions the visitor already answered. It&apos;s worth noting that a 2024 Gartner survey found 64% of customers would prefer companies didn&apos;t use AI for customer service — which is precisely why the hybrid approach works: you let AI handle the fast, informational queries while keeping humans available for the conversations customers care most about.
                </p>
                <p className="mt-4">
                  Start with the AI chatbot. Deploy it, train it on your content, and let it
                  handle your support volume for a few weeks. Review the conversations it
                  cannot resolve. Those unresolved conversations tell you exactly which types of
                  queries need human agents — and that data helps you staff your live chat
                  efficiently rather than guessing.
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
                      q: 'Is an AI chatbot cheaper than live chat?',
                      a: "In most cases, yes. Live chat requires hiring, training, and managing human agents who work in shifts. A single support agent costs $35,000\u2013$55,000 per year in salary alone, plus benefits, management overhead, and tooling costs. An AI chatbot handles unlimited conversations simultaneously for a fixed monthly fee \u2014 typically $0 to $99 per month depending on volume. The cost difference is especially dramatic for businesses that need 24/7 coverage, since that requires multiple shifts of live agents versus a single chatbot that never clocks out.",
                    },
                    {
                      q: 'Can I use both AI chatbot and live chat together?',
                      a: "Yes, and this hybrid approach is often the best strategy. The AI chatbot handles the first line of support \u2014 answering common questions, providing product information, and resolving straightforward issues instantly. When a conversation requires human judgment, emotional sensitivity, or access to account-specific data the chatbot cannot reach, it escalates to a live agent with the full conversation context. This reduces the volume of chats your human team handles by 60\u201380% while ensuring complex cases still get personal attention.",
                    },
                    {
                      q: 'Do customers prefer talking to humans?',
                      a: "It depends on the situation. According to Tidio, 62% of consumers prefer using a chatbot over waiting for a human agent. For simple, informational queries \u2014 store hours, return policies, product specs \u2014 customers want fast answers, and they do not care whether those answers come from a person or a bot. However, a 2024 Gartner survey found that 64% of customers would prefer companies didn\u2019t use AI for customer service \u2014 the distinction is that people want fast answers regardless of channel, but still value the option of human support for complex issues. The key is matching the channel to the conversation type rather than forcing every interaction through one path.",
                    },
                    {
                      q: 'How fast can I set up an AI chatbot?',
                      a: "With VocUI, you can have a working AI chatbot deployed in under an hour. The setup process involves three steps: create a chatbot, add your knowledge sources (website URLs, documents, or FAQ content), and embed the widget on your site. VocUI automatically scrapes your website, chunks the content, and builds the knowledge base. There is no training data to format, no intents to configure, and no conversation flows to design. The AI understands natural language out of the box and answers based on your content.",
                    },
                    {
                      q: 'What if the chatbot cannot answer a question?',
                      a: "A well-configured AI chatbot acknowledges when it does not have enough information to answer confidently. With VocUI, you can customize the system prompt to define fallback behavior \u2014 such as suggesting the visitor email your support team, providing a link to schedule a call, or collecting the visitor\u2019s contact information so your team can follow up. The chatbot does not fabricate answers; it draws only from the knowledge base you provide and clearly indicates when a question falls outside its scope.",
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
            <h2 className="text-2xl font-bold mb-3">Why choose? Use both.</h2>
            <p className="text-white/80 mb-2">
              VocUI handles the repetitive questions instantly, then hands off to your team when it matters.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan. Set up in minutes, not days.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                See how handoff works
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">No credit card required</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
