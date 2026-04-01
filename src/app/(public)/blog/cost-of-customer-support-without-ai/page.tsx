import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'The Hidden Cost of Customer Support Without AI | VocUI',
  description:
    'Manual customer support costs more than you think. Calculate the hidden expenses of answering the same questions without AI — and what automation saves.',
  openGraph: {
    title: 'The Hidden Cost of Customer Support Without AI | VocUI',
    description:
      'Manual customer support costs more than you think. Calculate the hidden expenses of answering the same questions without AI — and what automation saves.',
    url: 'https://vocui.com/blog/cost-of-customer-support-without-ai',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Hidden Cost of Customer Support Without AI | VocUI',
    description:
      'Manual customer support costs more than you think. Calculate the hidden expenses of answering the same questions without AI — and what automation saves.',
  },
  alternates: { canonical: 'https://vocui.com/blog/cost-of-customer-support-without-ai' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'The Hidden Cost of Customer Support Without AI',
      description:
        'Manual customer support costs more than you think. Calculate the hidden expenses of answering the same questions without AI — and what automation saves.',
      url: 'https://vocui.com/blog/cost-of-customer-support-without-ai',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/cost-of-customer-support-without-ai',
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
          name: 'How much does a support ticket cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'According to DemandSage, human-agent interactions cost $6\u2013$15 each compared to $0.50\u2013$0.70 for AI chatbot interactions. The exact cost depends on complexity and your team\u2019s fully loaded cost (salary, benefits, tools, management overhead). Simple questions like "what are your hours?" or "how do I reset my password?" sit at the low end, but they still require a human to read, understand, and respond. Complex technical issues or multi-touch conversations cost significantly more per resolution. An AI chatbot handles the low-end tickets for pennies each, freeing your team for the high-value interactions.',
          },
        },
        {
          '@type': 'Question',
          name: 'What percentage of tickets can AI handle?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A well-trained AI chatbot can fully resolve 40\u201370% of incoming support tickets without human involvement. The exact percentage depends on how well your knowledge base covers common questions and how complex your product is. Businesses with well-documented processes and straightforward products see deflection rates at the higher end. Companies with highly customized or technical products may start at 30\u201340% but improve as they add more training data. The remaining tickets get routed to your human team with full conversation context.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does AI replace support staff?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AI does not replace support staff \u2014 it changes what they spend their time on. Instead of answering the same five questions 200 times a month, your team focuses on complex issues that require judgment, empathy, and creative problem-solving. Most businesses that adopt AI support do not reduce headcount; they handle more volume with the same team and improve the quality of support for issues that truly need a human touch. Staff satisfaction typically improves because the repetitive, draining work disappears.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast is the payback?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most businesses see a positive ROI within 30\u201360 days. If you handle 500 tickets per month at an average cost of $15 per ticket, and AI deflects 50% of them, you save $3,750 per month. Even a basic AI chatbot plan costs a fraction of that. The payback is fastest for businesses with high ticket volume and a large percentage of repetitive questions. The calculation is straightforward: (tickets per month \u00d7 deflection rate \u00d7 cost per ticket) minus the chatbot subscription cost equals your monthly savings.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if my volume is low?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Even low-volume businesses benefit from AI support, though the primary benefit shifts from cost savings to responsiveness. If you handle 50 tickets per month, the direct cost savings may be modest, but the ability to answer questions instantly \u2014 including outside business hours \u2014 prevents lost leads and improves customer satisfaction. Low-volume businesses often find that the chatbot\u2019s biggest value is capturing leads and answering questions when no one is available, rather than pure ticket deflection.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CostOfCustomerSupportWithoutAiPage() {
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
                The Hidden Cost of Customer Support Without AI
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Strategy
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  7 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                The Hidden Cost of Customer Support Without AI
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Manual customer support can cost $5&ndash;$35 per ticket when you factor in salaries,
                tools, training, and management overhead. But the real expense is invisible: lost
                leads from slow response times (<a href="https://www.superoffice.com/blog/response-times/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">12+ hours on average<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>), staff burnout from repetitive questions, and
                customer churn from inconsistent answers. An AI chatbot handles a large portion of
                tickets for pennies each &mdash; and your team gets to focus on work that matters.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Visible Costs: Salaries, Tools, and Training
                </h2>
                <p>
                  The costs you can see on a spreadsheet are already significant. According to the <a href="https://www.bls.gov/ooh/office-and-administrative-support/customer-service-representatives.htm" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">U.S. Bureau of Labor Statistics<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, the median customer service representative earns about $43,000 per year in salary.
                  Add benefits, payroll taxes, and management time, and you&apos;re looking at
                  $55,000&ndash;$75,000 fully loaded. According to <a href="https://livechatai.com/blog/customer-support-cost-benchmarks" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">LiveChatAI<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, self-service channels cost just $1.84 per contact compared to $13.50 for assisted channels — a 7x difference. Then layer on the tools: a helpdesk
                  platform ($50&ndash;$150/month per agent), a live chat tool, a knowledge base,
                  and whatever integrations keep everything connected.
                </p>
                <p className="mt-4">
                  Training is another line item most businesses underestimate. A new support agent
                  needs 2&ndash;4 weeks to become productive, during which they are being paid
                  full salary while a senior team member spends time training them. Product
                  updates require ongoing training for the entire team. Documentation needs to be
                  written and maintained. Every new feature or policy change triggers a cascade of
                  training sessions, updated macros, and revised help articles.
                </p>
                <p className="mt-4">
                  For a small team handling 500 tickets per month, the all-in cost of human
                  support easily exceeds $5,000 per month. For larger teams with thousands of
                  monthly tickets, the cost scales linearly &mdash; you need more people, more
                  tools, and more management. This linear scaling is the fundamental problem:
                  as your business grows, your support costs grow at the same rate. There is no
                  efficiency gain from volume.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Hidden Costs: Wait Times, Lost Leads, and Burnout
                </h2>
                <p>
                  The costs you don&apos;t see are often larger than the ones you do. Start with
                  response time. According to <a href="https://www.superoffice.com/blog/response-times/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">SuperOffice<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, the average business takes 12 hours and 10 minutes to respond to a customer
                  inquiry. During those 12 hours, the customer may have already found a
                  competitor, lost interest, or decided the problem isn&apos;t worth solving.
                  Every hour of delay reduces the probability of conversion or retention. According to <a href="https://www.freshworks.com/How-AI-is-unlocking-ROI-in-customer-service/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">Forrester research via Freshworks<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, customers are 2.4x more likely to remain loyal when problems resolve quickly. For
                  sales inquiries, the <a href="https://www.insidesales.com/response-time-matters/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">MIT/InsideSales.com Lead Response Management Study<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a> found that a 5-minute response time qualifies leads 21x better than waiting 30 minutes.
                </p>
                <p className="mt-4">
                  Lost leads are the most expensive hidden cost. When a potential customer visits
                  your website at 9pm with a question about your product and finds no one
                  available to answer, they don&apos;t bookmark the page and come back
                  tomorrow &mdash; they go to a competitor who is available now. Each lost lead
                  has a customer lifetime value attached to it. If your average customer is worth
                  $2,000 over their lifetime and slow support costs you 10 leads per month,
                  that&apos;s $20,000 in lost revenue you never see on any report.
                </p>
                <p className="mt-4">
                  Staff burnout is the third hidden cost. Support agents who spend their day
                  answering the same five questions develop frustration, disengagement, and
                  eventually leave. According to <a href="https://www.nextiva.com/blog/call-center-turnover-rates.html" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">Nextiva<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, turnover in customer support averages 30&ndash;45% per year.
                  Each departure costs thousands in recruiting, hiring, and training a
                  replacement. The cycle repeats because the underlying problem &mdash; repetitive,
                  unrewarding work &mdash; never changes. Read more about reducing repetitive
                  ticket load in our guide to{' '}
                  <Link
                    href="/blog/how-to-reduce-customer-support-tickets"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    reducing customer support tickets
                  </Link>.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Calculating Your True Cost per Ticket
                </h2>
                <p>
                  To understand your real support costs, calculate your fully loaded cost per
                  ticket. Take your total monthly support spend &mdash; salaries, benefits,
                  tools, training, management time &mdash; and divide by the number of tickets
                  resolved per month. According to <a href="https://www.demandsage.com/chatbot-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">DemandSage<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, human-agent interactions cost $6&ndash;$15 each compared to $0.50&ndash;$0.70 for AI chatbot interactions. Most businesses are surprised to find that even
                  &quot;simple&quot; tickets carry significant per-ticket costs when all overhead is included.
                </p>
                <p className="mt-4">
                  Here is a simple framework: if you have two full-time support agents at
                  $50,000 each fully loaded ($8,333/month total), plus $500/month in tools, plus
                  $500/month in management overhead, your total monthly cost is $9,333. If those
                  agents handle 800 tickets per month, your cost per ticket is $11.67. Now
                  consider that 50% of those tickets are simple, repetitive questions an AI could
                  answer. That&apos;s 400 tickets at $11.67 each &mdash; $4,668 per month spent
                  on work a chatbot could handle for under $100.
                </p>
                <p className="mt-4">
                  The cost per ticket also ignores opportunity cost. Every minute your team
                  spends answering &quot;what are your business hours?&quot; is a minute they
                  can&apos;t spend on a complex technical issue, a frustrated customer at risk of
                  churning, or a strategic initiative that could prevent future tickets entirely.
                  The true cost of a repetitive ticket includes the value of the work that
                  didn&apos;t get done because your agent was busy typing the same answer for the
                  200th time.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What AI Chatbots Replace (and What They Don&apos;t)
                </h2>
                <p>
                  AI chatbots excel at handling the predictable, repetitive, and well-documented
                  portion of your support volume. According to <a href="https://livechatai.com/blog/customer-support-response-time-statistics" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">Zendesk research<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a>, AI-assisted agents handle 33% more tickets per hour. Account questions (&quot;how do I reset my
                  password?&quot;), product information (&quot;does your tool integrate with
                  Slack?&quot;), policy questions (&quot;what&apos;s your refund policy?&quot;),
                  and how-to guidance (&quot;how do I set up a webhook?&quot;) are all perfect
                  candidates for automation. <a href="https://www.ibm.com/think/topics/ai-customer-service-chatbots" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">IBM reports<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a> chatbots can handle up to 80% of routine inquiries, and these routine questions typically make up the majority of
                  your total volume.
                </p>
                <p className="mt-4">
                  What AI does not replace is human judgment, empathy, and creative
                  problem-solving. A customer who is angry about a billing error needs a human
                  who can listen, apologize, and make it right. A complex technical issue that
                  requires debugging across multiple systems needs a skilled agent. A prospect
                  evaluating a six-figure contract needs a sales engineer, not a chatbot. The
                  goal of AI support is not to eliminate humans &mdash; it&apos;s to free them
                  for the work where they add the most value.
                </p>
                <p className="mt-4">
                  The handoff between AI and human support matters. A good AI chatbot recognizes
                  when it can&apos;t help and smoothly transitions the conversation to a human
                  agent, including full context from the chat. The customer doesn&apos;t need to
                  repeat themselves. The agent has everything they need to help. This hybrid model
                  combines the speed and availability of AI with the judgment and empathy of
                  human support.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  A Simple ROI Calculation
                </h2>
                <p>
                  Here is the math for deciding whether AI support makes sense for your business.
                  Take your monthly ticket volume, multiply by the percentage of tickets that are
                  repetitive (start conservatively at 40%), then multiply by your cost per
                  ticket. That is your monthly savings potential. Subtract the cost of the AI
                  chatbot tool. The result is your net monthly savings. For more on measuring
                  chatbot return, see our{' '}
                  <Link
                    href="/blog/how-to-measure-chatbot-roi"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    chatbot ROI guide
                  </Link>.
                </p>
                <p className="mt-4">
                  Example: 600 tickets/month &times; 40% repetitive = 240 automatable tickets.
                  240 tickets &times; $12 cost per ticket = $2,880 in monthly savings. A VocUI
                  plan that handles this volume costs a fraction of those savings. Net savings:
                  over $2,500/month, plus the indirect benefits of faster response times, 24/7
                  availability, and happier support staff. Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    pricing
                  </Link>{' '}
                  to run your own numbers.
                </p>
                <p className="mt-4">
                  The ROI calculation also improves over time. As you add more content to your
                  chatbot&apos;s knowledge base and refine its responses based on real
                  conversations, the deflection rate increases. A chatbot that starts at 40%
                  deflection often reaches 60&ndash;70% within three months of active use. The scale of this opportunity is massive: <a href="https://livechatai.com/blog/customer-support-cost-benchmarks" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5">Juniper Research projects<ExternalLink className="w-3 h-3 opacity-60 inline-block" /></a> conversational AI will save $80 billion in contact-center labor costs by 2026. Your
                  savings grow without any additional investment in the tool &mdash; you just keep
                  feeding it better training data.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Making the Case to Your Team
                </h2>
                <p>
                  If you need to convince leadership or your team to adopt AI support, focus on
                  three arguments: cost savings with clear numbers (use the calculation above),
                  response time improvements (from hours to seconds), and team satisfaction
                  (eliminating the most draining part of the job). Lead with the financial
                  argument because it is the most concrete, but don&apos;t underestimate the
                  operational and morale benefits.
                </p>
                <p className="mt-4">
                  Address the common concern head-on: &quot;Will this replace our team?&quot; The
                  answer is no. AI handles the repetitive tickets so your team can handle the
                  important ones. Most support teams actually welcome AI because it removes the
                  part of their job they like least. Position it as a tool that makes them more
                  effective, not a replacement that makes them obsolete.
                </p>
                <p className="mt-4">
                  Start with a pilot. Run the chatbot on one channel or one product line for 30
                  days and measure the results. A pilot reduces risk, generates real data specific
                  to your business, and builds confidence in the approach before a full rollout.
                  Most businesses that run a 30-day pilot expand to full deployment because the
                  numbers speak for themselves.
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
                      q: 'How much does a support ticket cost?',
                      a: "According to DemandSage, human-agent interactions cost $6\u2013$15 each compared to $0.50\u2013$0.70 for AI chatbot interactions. The exact cost depends on complexity and your team\u2019s fully loaded cost (salary, benefits, tools, management overhead). Simple questions like \u201Cwhat are your hours?\u201D or \u201Chow do I reset my password?\u201D sit at the low end, but they still require a human to read, understand, and respond. Complex technical issues or multi-touch conversations cost significantly more per resolution. An AI chatbot handles the low-end tickets for pennies each, freeing your team for the high-value interactions.",
                    },
                    {
                      q: 'What percentage of tickets can AI handle?',
                      a: "A well-trained AI chatbot can fully resolve 40\u201370% of incoming support tickets without human involvement. The exact percentage depends on how well your knowledge base covers common questions and how complex your product is. Businesses with well-documented processes and straightforward products see deflection rates at the higher end. Companies with highly customized or technical products may start at 30\u201340% but improve as they add more training data. The remaining tickets get routed to your human team with full conversation context.",
                    },
                    {
                      q: 'Does AI replace support staff?',
                      a: "AI does not replace support staff \u2014 it changes what they spend their time on. Instead of answering the same five questions 200 times a month, your team focuses on complex issues that require judgment, empathy, and creative problem-solving. Most businesses that adopt AI support do not reduce headcount; they handle more volume with the same team and improve the quality of support for issues that truly need a human touch. Staff satisfaction typically improves because the repetitive, draining work disappears.",
                    },
                    {
                      q: 'How fast is the payback?',
                      a: "Most businesses see a positive ROI within 30\u201360 days. If you handle 500 tickets per month at an average cost of $15 per ticket, and AI deflects 50% of them, you save $3,750 per month. Even a basic AI chatbot plan costs a fraction of that. The payback is fastest for businesses with high ticket volume and a large percentage of repetitive questions. The calculation is straightforward: (tickets per month \u00d7 deflection rate \u00d7 cost per ticket) minus the chatbot subscription cost equals your monthly savings.",
                    },
                    {
                      q: 'What if my volume is low?',
                      a: "Even low-volume businesses benefit from AI support, though the primary benefit shifts from cost savings to responsiveness. If you handle 50 tickets per month, the direct cost savings may be modest, but the ability to answer questions instantly \u2014 including outside business hours \u2014 prevents lost leads and improves customer satisfaction. Low-volume businesses often find that the chatbot\u2019s biggest value is capturing leads and answering questions when no one is available, rather than pure ticket deflection.",
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

          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-8">
            Statistics cited from publicly available reports by the U.S. Bureau of Labor Statistics, IBM, SuperOffice, Freshworks/Forrester, MIT/InsideSales.com, Nextiva, DemandSage, LiveChatAI, and Juniper Research. Links to original sources are provided inline. Last verified April 2026.
          </p>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">Stop paying for answers a chatbot can handle</h2>
            <p className="text-white/80 mb-2">
              Train a chatbot on your docs and start deflecting repetitive questions in under an hour.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan. No developers needed. Measure the impact from day one.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Automate your support
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Start free -- see ROI within your first week</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
