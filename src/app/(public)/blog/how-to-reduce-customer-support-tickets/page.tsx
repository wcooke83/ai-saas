import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Reduce Customer Support Tickets with AI | VocUI',
  description:
    'Cut support ticket volume by up to 40% with an AI chatbot that answers questions instantly from your knowledge base — no agent intervention needed.',
  openGraph: {
    title: 'How to Reduce Customer Support Tickets with AI | VocUI',
    description:
      'Cut support ticket volume by up to 40% with an AI chatbot that answers questions instantly from your knowledge base — no agent intervention needed.',
    url: 'https://vocui.com/blog/how-to-reduce-customer-support-tickets',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Reduce Customer Support Tickets with AI | VocUI',
    description:
      'Cut support ticket volume by up to 40% with an AI chatbot that answers questions instantly from your knowledge base — no agent intervention needed.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-reduce-customer-support-tickets' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Reduce Customer Support Tickets with AI',
      description:
        'A practical guide to using an AI chatbot to deflect repetitive support tickets and reduce overall support volume.',
      url: 'https://vocui.com/blog/how-to-reduce-customer-support-tickets',
      author: { '@type': 'Organization', name: 'VocUI' },
      publisher: { '@type': 'Organization', name: 'VocUI', url: 'https://vocui.com' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much can an AI chatbot reduce support tickets?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "It depends on how much of your ticket volume is repetitive. Businesses with well-documented products and processes typically see 40–70% deflection rates. The key is coverage — the chatbot can only deflect questions it has been trained to answer.",
          },
        },
        {
          '@type': 'Question',
          name: 'Will customers be frustrated by talking to a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Only if the chatbot gives wrong answers or can't escalate when needed. A well-configured chatbot that answers accurately and hands off gracefully to a human when necessary actually improves customer satisfaction — because they get answers instantly instead of waiting hours.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is ticket deflection rate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Ticket deflection rate is the percentage of incoming support inquiries that are resolved by the chatbot without human intervention. A deflection rate of 50% means half your support volume is being handled automatically.",
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ReduceSupportTicketsPage() {
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
                <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                How to Reduce Customer Support Tickets with AI
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Strategy
                </span>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">9 min read</span>
              </div>
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Reduce Customer Support Tickets with AI
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Support ticket volume tends to grow faster than your team. Every new customer,
                product launch, or policy change generates more questions — and without a system
                to handle the routine, everything lands in someone&apos;s inbox. An AI chatbot trained
                on your knowledge base can deflect 40–70% of that volume automatically.
              </p>
            </header>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why ticket volume keeps growing
                </h2>
                <p>
                  Most support teams aren&apos;t overwhelmed because they&apos;re slow. They&apos;re overwhelmed
                  because the volume of questions scales with your customer base — and the majority
                  of those questions are ones you&apos;ve already answered somewhere. Your docs answer
                  them. Your FAQ page answers them. But customers don&apos;t read those before they
                  contact support.
                </p>
                <p className="mt-4">
                  The result: your team spends a significant portion of every day answering the
                  same 20 questions in slightly different forms. Meanwhile, the issues that actually
                  need human judgment — billing disputes, edge cases, complex technical problems —
                  wait in the same queue.
                </p>
                <p className="mt-4">
                  The goal of an AI chatbot isn&apos;t to replace your support team. It&apos;s to handle
                  the routine so your team can focus on the work that only a human can do.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The 5 most common ticket types you can deflect
                </h2>
                <p>
                  Not every support ticket is automatable. But the ones that are tend to follow
                  predictable patterns. Here are the five categories that most businesses can
                  deflect with a well-configured AI chatbot:
                </p>
                <ol className="list-decimal list-inside space-y-4 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">How-to and feature questions.</strong> &quot;How do I do X?&quot; is the
                    most common category of support ticket for most products. If your docs explain
                    it, a chatbot can explain it too — instantly, at 2am, in any language.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Pricing and plan questions.</strong> &quot;What&apos;s included in the basic plan?&quot;
                    &quot;Do you offer annual billing?&quot; &quot;Is there a free trial?&quot; These are fully
                    answerable from your pricing page.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Policy questions.</strong> Return policy, cancellation policy, privacy
                    policy, shipping times — any question that has a documented answer. These are
                    among the easiest to deflect because the answers don&apos;t change often.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Status and process questions.</strong> &quot;When will my order ship?&quot;
                    &quot;What happens after I sign up?&quot; &quot;How long does onboarding take?&quot; These often
                    have standard answers that cover 90% of cases.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Troubleshooting common errors.</strong> If the same three error
                    messages account for 60% of your tech support tickets, your chatbot can answer
                    them. Add the error code, the cause, and the fix to your knowledge base.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How an AI chatbot handles repetitive questions
                </h2>
                <p>
                  An AI chatbot doesn&apos;t just match keywords the way old-school chatbots did. Modern
                  chatbots use semantic search to find the relevant content in your knowledge base,
                  even when the user asks the question in an unexpected way.
                </p>
                <p className="mt-4">
                  For example, if your knowledge base says &quot;Orders ship within 2 business days,&quot;
                  the chatbot can correctly answer questions like:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>&quot;How fast do you ship?&quot;</li>
                  <li>&quot;When can I expect my package?&quot;</li>
                  <li>&quot;What&apos;s your delivery time?&quot;</li>
                  <li>&quot;I just ordered — when does it arrive?&quot;</li>
                </ul>
                <p className="mt-4">
                  It&apos;s not matching the word &quot;ship&quot; — it&apos;s understanding that all of these questions
                  are asking about the same thing. This is what makes knowledge base chatbots
                  dramatically more useful than FAQ bots that only respond to exact keyword matches.
                </p>
                <p className="mt-4">
                  Check our{' '}
                  <Link href="/chatbot-for-customer-support" className="text-primary-600 dark:text-primary-400 hover:underline">
                    customer support chatbot
                  </Link>{' '}
                  page for more on how VocUI handles high-volume support scenarios.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Setting up a knowledge base that answers support questions
                </h2>
                <p>
                  The quality of your ticket deflection is directly tied to the quality of your
                  knowledge base. Here&apos;s how to build one that actually works:
                </p>
                <p className="mt-6 font-semibold text-secondary-800 dark:text-secondary-200">Start with your top 20 questions</p>
                <p className="mt-2">
                  Go through your last month of support tickets. Find the questions that appear
                  most often. These become your first knowledge base entries — whether that&apos;s URLs
                  from your help center, a dedicated FAQ document, or Q&amp;A pairs you type directly
                  into the chatbot.
                </p>
                <p className="mt-4">
                  Don&apos;t try to add everything at once. The 20 most common questions often cover
                  60–70% of your ticket volume. Starting with those gives you the biggest
                  immediate impact.
                </p>
                <p className="mt-6 font-semibold text-secondary-800 dark:text-secondary-200">Make the answers specific and actionable</p>
                <p className="mt-2">
                  Vague knowledge base content produces vague answers. If your return policy page
                  says &quot;returns are accepted in most cases,&quot; your chatbot will say something equally
                  vague. Rewrite it to say exactly what you mean: &quot;Returns are accepted within 30
                  days of purchase for unused items in original packaging. Contact support at
                  support@example.com to initiate a return.&quot;
                </p>
                <p className="mt-6 font-semibold text-secondary-800 dark:text-secondary-200">Add context the chatbot can use for follow-up questions</p>
                <p className="mt-2">
                  Customers rarely ask just one question. If someone asks about your return policy,
                  they might follow up with &quot;what if I don&apos;t have the original packaging?&quot; or
                  &quot;do I pay for return shipping?&quot; Make sure your knowledge base covers the logical
                  next questions, not just the headline answer.
                </p>
                <p className="mt-4">
                  See our{' '}
                  <Link href="/knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbot guide
                  </Link>{' '}
                  for a deeper dive into structuring your content for retrieval.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Graceful handoff when the bot can&apos;t help
                </h2>
                <p>
                  No chatbot can handle everything. The goal isn&apos;t 100% automation — it&apos;s
                  handling the cases that are safe to automate, and routing the rest to the right
                  human quickly.
                </p>
                <p className="mt-4">
                  A good handoff configuration has three parts:
                </p>
                <ol className="list-decimal list-inside space-y-3 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Honest limits.</strong> When the chatbot doesn&apos;t know the answer,
                    it should say so clearly — not make something up. &quot;I don&apos;t have that
                    information, but I can connect you with our support team&quot; is the right response.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Clear escalation paths.</strong> Give visitors an obvious next step.
                    This might be a &quot;Talk to a human&quot; button, a contact form, a phone number, or
                    a direct handoff to a live agent if you have one available.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Context preservation.</strong> When the chatbot hands off to a
                    human, the human should see the full conversation history. Nothing frustrates
                    customers more than having to re-explain their issue to a live agent who has
                    no context.
                  </li>
                </ol>
                <p className="mt-4">
                  VocUI&apos;s live agent handoff passes the full conversation transcript to the agent
                  console. Agents can take over instantly without asking the customer to start over.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How to measure ticket deflection rate
                </h2>
                <p>
                  Once your chatbot is live, you need to track whether it&apos;s actually reducing your
                  support load. The core metric is ticket deflection rate: the percentage of
                  conversations that the chatbot resolved without human intervention.
                </p>
                <p className="mt-4">
                  To calculate it:
                </p>
                <div className="bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700 rounded-xl p-5 my-4">
                  <p className="font-mono text-sm text-secondary-800 dark:text-secondary-200">
                    Deflection rate = (Chatbot-resolved conversations / Total chatbot conversations) × 100
                  </p>
                </div>
                <p>
                  A &quot;chatbot-resolved&quot; conversation is one where the visitor got their answer and
                  left without clicking &quot;talk to a human&quot; or submitting a ticket. VocUI&apos;s
                  analytics tab shows this automatically.
                </p>
                <p className="mt-4">
                  Other metrics worth tracking:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Handoff rate</strong> — what percentage of conversations get
                    escalated to a human. High handoff rates might mean your knowledge base has
                    gaps.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">No-answer rate</strong> — how often the chatbot says &quot;I don&apos;t know.&quot;
                    These are direct pointers to content you need to add.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Support ticket volume trend</strong> — are your overall tickets
                    going down over time, even as your customer base grows? This is the ultimate
                    measure of success.
                  </li>
                </ul>
                <p className="mt-4">
                  Check your analytics weekly for the first month, then monthly once things are
                  stable. Each round of improvements — adding knowledge sources, refining answers,
                  tightening the system prompt — should push your deflection rate higher. See{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>{' '}
                  to see what&apos;s included in each plan&apos;s analytics.
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'How much can an AI chatbot reduce support tickets?',
                      a: "It depends on how much of your ticket volume is repetitive. Businesses with well-documented products and processes typically see 40–70% deflection rates. The key is coverage — the chatbot can only deflect questions it has been trained to answer.",
                    },
                    {
                      q: 'Will customers be frustrated by talking to a chatbot?',
                      a: "Only if the chatbot gives wrong answers or can't escalate when needed. A well-configured chatbot that answers accurately and hands off gracefully to a human when necessary actually improves customer satisfaction — because they get answers instantly instead of waiting hours.",
                    },
                    {
                      q: 'What is ticket deflection rate?',
                      a: "Ticket deflection rate is the percentage of incoming support inquiries that are resolved by the chatbot without human intervention. A deflection rate of 50% means half your support volume is being handled automatically.",
                    },
                    {
                      q: 'Does an AI chatbot work for technical support?',
                      a: "Yes, for documented issues. If you have troubleshooting guides, error code explanations, and known-issue documentation, the chatbot can handle those. It works best for issues where the resolution is already written down somewhere.",
                    },
                    {
                      q: 'How long does it take to see results?',
                      a: "Most businesses see meaningful deflection from day one — as soon as the chatbot is live and trained on their top-volume questions. Deflection rate typically improves over the first 30 days as you add more knowledge sources based on the conversations you see.",
                    },
                  ].map(({ q, a }) => (
                    <div key={q} className="border-b border-secondary-200 dark:border-secondary-700 pb-6">
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{q}</dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">Ready to build your first chatbot?</h2>
            <p className="text-white/80 mb-2">
              Free plan, no credit card required. Most businesses are live within an hour.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Train on your own docs, embed on your site, start answering questions today.
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
            <p className="text-xs text-white/50 mt-4">Start free — no credit card required</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
