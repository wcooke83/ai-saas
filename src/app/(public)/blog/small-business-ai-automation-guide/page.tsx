import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { MidArticleCta } from '@/components/blog/mid-article-cta';
import { TimelineInfographic } from '@/components/blog/infographics';
import { StyledBulletList } from '@/components/blog/styled-lists';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'The Small Business Guide to AI Automation in 2026 | VocUI',
  description:
    'A practical guide to AI automation for small businesses — what to automate first, which tools to use, and how to start without technical skills or a big budget.',
  openGraph: {
    title: 'The Small Business Guide to AI Automation in 2026 | VocUI',
    description:
      'A practical guide to AI automation for small businesses — what to automate first, which tools to use, and how to start without technical skills or a big budget.',
    url: 'https://vocui.com/blog/small-business-ai-automation-guide',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Small Business Guide to AI Automation in 2026 | VocUI',
    description:
      'A practical guide to AI automation for small businesses — what to automate first, which tools to use, and how to start without technical skills or a big budget.',
  },
  alternates: { canonical: 'https://vocui.com/blog/small-business-ai-automation-guide' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'The Small Business Guide to AI Automation in 2026',
      description:
        'A practical guide to AI automation for small businesses — what to automate first, which tools to use, and how to start without technical skills or a big budget.',
      url: 'https://vocui.com/blog/small-business-ai-automation-guide',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/small-business-ai-automation-guide',
      },
      datePublished: '2026-02-17',
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
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/small-business-ai-automation-guide/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need technical skills to use AI automation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The current generation of AI automation tools is designed for non-technical users. Platforms like VocUI let you build and deploy an AI chatbot without writing code — you add your content, configure the behavior, and embed the widget on your site. Similarly, tools like Zapier, Make, and n8n provide visual automation builders that connect your existing tools without programming. If you can use a spreadsheet, you can set up most AI automations. Technical skills become relevant only for advanced customizations, API integrations, or building custom workflows — and even those are becoming more accessible.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does AI automation cost for a small business?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most AI automation tools for small businesses cost $0–$100 per month. VocUI offers a free plan for chatbot deployment, with paid plans starting at $29/month for higher usage. Zapier starts at $0/month for basic automations. Email marketing AI features are typically included in platforms you already pay for (Mailchimp, ConvertKit, etc.). The total cost for a meaningful AI automation stack — chatbot, workflow automation, and AI-assisted email — is typically under $200/month. Compare this to the cost of the manual labor these tools replace, and the ROI is usually obvious within the first month.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I automate first?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start with customer support. It is the highest-volume, most repetitive area for most small businesses, and it has the fastest time to ROI. Deploy an AI chatbot trained on your website content and FAQs. This handles the 60–80% of customer questions that have known answers, freeing your time for the questions that actually need your attention. After support, move to lead capture (chatbot on your sales pages) and then internal knowledge management (documenting processes so your team can self-serve).',
          },
        },
        {
          '@type': 'Question',
          name: 'Is AI automation safe for my business data?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Reputable AI automation tools follow standard security practices — data encryption in transit and at rest, access controls, and compliance with relevant regulations. With VocUI, the chatbot only accesses the content you explicitly provide in the knowledge base. It does not scrape private data, access your other business tools, or store customer conversations beyond what you configure. Review the security and privacy policies of any tool before connecting it to sensitive business data, and avoid uploading confidential information (financial records, customer PII, trade secrets) to any AI training dataset.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long until I see results from AI automation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most small businesses see measurable results within the first week. A chatbot deployed on your website starts answering customer questions immediately — day one. Within a week, you can measure how many questions it handles, how much time your team saves, and whether customers are getting the information they need. Workflow automations (email sequences, lead routing, etc.) typically show impact within 2–4 weeks as enough data flows through the system. Full ROI measurement, including cost savings and productivity gains, is usually clear within 30–60 days.',
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
          name: 'The Small Business Guide to AI Automation in 2026',
          item: 'https://vocui.com/blog/small-business-ai-automation-guide',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SmallBusinessAiAutomationGuidePage() {
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
                Small Business AI Automation Guide
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Strategy
                </span>
                <time dateTime="2026-02-17" className="text-xs text-secondary-400 dark:text-secondary-500">Feb 17, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  10 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                The Small Business Guide to AI Automation in 2026
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                AI automation is no longer reserved for enterprises with dedicated engineering
                teams. Small businesses can now automate customer support, lead capture, and
                internal operations using no-code tools that cost under $100/month. This guide
                shows you where to start, what to automate first, and how to avoid common
                mistakes.
              </p>
            </div>

            <TableOfContents items={[
              { id: 'what-ai-automation-means-for-small-business', label: 'What AI Automation Means for Small Business' },
              { id: 'the-easiest-wins-where-to-start', label: 'The Easiest Wins: Where to Start' },
              { id: 'customer-support-automation-with-chatbots', label: 'Customer Support Automation with Chatbots' },
              { id: 'sales-and-lead-capture-automation', label: 'Sales and Lead Capture Automation' },
              { id: 'internal-knowledge-and-operations', label: 'Internal Knowledge and Operations' },
              { id: 'common-mistakes-to-avoid', label: 'Common Mistakes to Avoid' },
              { id: 'getting-started-today', label: 'Getting Started Today' },
              { id: 'faq', label: 'FAQ' },
            ]} />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 id="what-ai-automation-means-for-small-business" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What AI Automation Means for Small Business
                </h2>
                <p>
                  AI automation for small business is not about replacing your team with robots.
                  It&apos;s about eliminating the repetitive, time-consuming tasks that prevent
                  you and your team from doing your best work. Every small business has them:
                  answering the same customer questions for the hundredth time, manually sorting
                  leads, copying data between tools, and writing the same follow-up emails.
                </p>
                <p className="mt-4">
                  These tasks are necessary but not valuable. They do not require creativity,
                  judgment, or expertise — they require time. And time is the scarcest resource
                  in a small business. AI automation reclaims that time by handling predictable,
                  rule-based work automatically, so you can focus on the work that actually
                  grows your business: building relationships, improving your product, and
                  making strategic decisions.
                </p>
                <p className="mt-4">
                  The tools have reached a tipping point in 2026. According to <a href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">McKinsey</a>, 78% of companies now use AI in at least one business function — up from 55% in 2023. Five years ago, meaningful AI
                  automation required custom development. Today, you can deploy an AI chatbot in
                  under an hour, connect your tools with visual workflow builders, and set up
                  automated email sequences with AI-generated content — all without writing a
                  single line of code. The barrier is no longer technology or cost. It&apos;s
                  knowing where to start.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 id="the-easiest-wins-where-to-start" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Easiest Wins: Where to Start
                </h2>
                <p>
                  Not all automation is created equal. Some projects deliver immediate ROI with
                  minimal setup. Others require significant configuration for marginal gains.
                  As a small business, you want to start with high-impact, low-effort
                  automations — the ones that save the most time for the least investment.
                </p>
                <p className="mt-4">
                  The top three starting points, ranked by impact per hour of setup:
                </p>
                <StyledBulletList items={[
                  { title: 'Customer support chatbot.', description: 'Train an AI chatbot on your website content and FAQs. Deploy it in under an hour. It handles 60\u201380% of customer questions instantly, 24/7.' },
                  { title: 'Lead capture and qualification.', description: 'Add conversational lead capture to your website. The chatbot engages visitors, answers their questions, and collects contact information \u2014 replacing static forms.' },
                  { title: 'Internal knowledge management.', description: 'Build a knowledge bot trained on your processes and policies. Deploy it in Slack so your team can get instant answers without interrupting colleagues.' },
                ]} />
                <p className="mt-4">
                  Each of these can be set up in a single afternoon and starts delivering value
                  the same day. Start with whichever one addresses your biggest pain point,
                  then add the others over the following weeks.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 id="customer-support-automation-with-chatbots" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Customer Support Automation with Chatbots
                </h2>
                <p>
                  Customer support is the highest-impact automation for most small businesses
                  because it&apos;s where you spend the most time on repetitive work. According to <a href="https://www.demandsage.com/chatbot-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">IBM via DemandSage</a>, chatbots can handle up to 80% of routine inquiries. Every
                  business gets the same questions over and over: &quot;What are your
                  hours?&quot; &quot;Do you offer X?&quot; &quot;How does pricing work?&quot;
                  &quot;What&apos;s your return policy?&quot; These questions have known
                  answers, and an AI chatbot delivers those answers instantly.
                </p>
                <p className="mt-4">
                  With VocUI, the setup takes three steps. First, create a chatbot and add your
                  knowledge sources — your website URLs, FAQ documents, and any other content
                  that contains the answers to common questions. Second, configure the system
                  prompt to match your brand voice and define how the chatbot should handle
                  questions it cannot answer. Third, embed the widget on your website with a
                  single line of code.
                </p>
                <p className="mt-4">
                  The result: visitors get instant answers at any hour, your inbox sees fewer
                  support emails, and you reclaim hours that were previously spent typing the
                  same responses. For a detailed look at reducing support volume, read our
                  guide on{' '}
                  <Link
                    href="/blog/how-to-reduce-customer-support-tickets"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    how to reduce customer support tickets
                  </Link>
                  .
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 id="sales-and-lead-capture-automation" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Sales and Lead Capture Automation
                </h2>
                <p>
                  Your website gets visitors, but how many of them become leads? If you rely on
                  a static &quot;Contact Us&quot; form, the answer is probably 2–5%. An AI
                  chatbot on your sales pages can double or triple that conversion rate by
                  engaging visitors in conversation rather than presenting a form. <a href="https://www.grandviewresearch.com/industry-analysis/chatbot-market" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Grand View Research</a> notes that small and mid-sized businesses are the fastest-growing chatbot adopters, with a 25.1% compound annual growth rate.
                </p>
                <p className="mt-4">
                  The chatbot answers product questions, addresses objections, and naturally
                  transitions to collecting contact information when the visitor shows interest.
                  &quot;I can send you a detailed breakdown — what&apos;s the best email to
                  reach you?&quot; This exchange feels helpful rather than demanding, and it
                  captures leads that a static form would miss entirely.
                </p>
                <p className="mt-4">
                  Beyond capture, the chatbot qualifies leads by asking contextual questions
                  during conversation: company size, budget range, timeline, specific needs.
                  This information helps you prioritize follow-up and personalize your outreach.
                  For specific strategies, see our guide on{' '}
                  <Link
                    href="/blog/chatbot-lead-generation-strategies"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    chatbot lead generation strategies
                  </Link>
                  .
                </p>
              </section>

              <MidArticleCta message="Ready to see these numbers for yourself? Build a chatbot and track the impact." />

              {/* Section 5 */}
              <section>
                <h2 id="internal-knowledge-and-operations" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Internal Knowledge and Operations
                </h2>
                <p>
                  Small business teams waste significant time searching for internal information.
                  &quot;What&apos;s our process for X?&quot; &quot;Where is the template
                  for Y?&quot; &quot;How do I set up Z?&quot; These questions bounce between
                  team members, interrupt deep work, and often result in inconsistent answers
                  because different people remember the process differently.
                </p>
                <p className="mt-4">
                  An internal knowledge bot solves this by centralizing your documented processes,
                  policies, and how-to guides into a single, searchable AI interface. Deploy it
                  in Slack and your team can get instant answers without interrupting colleagues.
                  This is especially valuable for onboarding new team members, who have the most
                  questions and the least institutional knowledge. For a deeper dive, read our
                  guide on{' '}
                  <Link
                    href="/blog/how-to-build-internal-knowledge-bot"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    building an internal knowledge bot
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  Start by documenting your most frequently asked internal questions. Upload
                  your employee handbook, process documents, and tool guides. The knowledge bot
                  pays for itself the first time a new hire gets an instant answer instead of
                  waiting an hour for someone to respond to their Slack message.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 id="common-mistakes-to-avoid" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Common Mistakes to Avoid
                </h2>
                <p>
                  Small businesses make predictable mistakes when adopting AI automation. Knowing
                  these in advance saves you time and frustration:
                </p>
                <StyledBulletList items={[
                  { title: 'Automating too much too fast.', description: 'Start with one use case, get it working well, then expand. Trying to automate everything at once leads to half-finished projects and no measurable results.' },
                  { title: 'Poor knowledge base content.', description: 'An AI chatbot is only as good as the content it\u2019s trained on. If your website has outdated FAQ answers or your documentation is incomplete, the chatbot will reflect that. Invest time in your content before deploying.' },
                  { title: 'No human fallback.', description: 'Every automation should have a clear path to a human when it reaches its limits. A chatbot that cannot escalate frustrated customers to a real person will damage your brand.' },
                  { title: 'Ignoring the data.', description: 'AI tools generate valuable data about what customers ask, where they get stuck, and what content is missing. Review this data weekly and use it to improve your automation continuously.' },
                  { title: 'Choosing complexity over simplicity.', description: 'You do not need enterprise-grade AI infrastructure. A well-configured chatbot on a platform like VocUI delivers 90% of the value at 10% of the complexity.' },
                ]} />
              </section>

              {/* Section 7 */}
              <section>
                <h2 id="getting-started-today" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Getting Started Today
                </h2>
                <p>
                  Here is a concrete plan for your first week with AI automation:
                </p>
                <StyledBulletList items={[
                  { title: 'Day 1:', description: 'Sign up for VocUI (free plan). Create your first chatbot and add your website as a knowledge source.' },
                  { title: 'Day 2:', description: 'Configure the system prompt. Add any additional documents \u2014 FAQ lists, product guides, pricing information \u2014 that cover common customer questions.' },
                  { title: 'Day 3:', description: 'Embed the chatbot widget on your website. Test it with the 10 most common questions you receive.' },
                  { title: 'Day 4\u20135:', description: 'Monitor conversations. Identify questions the chatbot struggles with and add content to address those gaps.' },
                  { title: 'Week 2:', description: 'Review the data. Measure how many questions the chatbot resolved, how much time your team saved, and where to improve.' },
                ]} />
                <p className="mt-4">
                  By the end of week one, you will have a working AI chatbot handling customer
                  questions 24/7. By the end of month one, you will have data showing exactly
                  how much time and money it saves. Visit our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    pricing page
                  </Link>
                  {' '}to see the plan options, or sign up free and start building today.
                </p>
              </section>

              <TimelineInfographic
                title="Your AI Automation Roadmap"
                steps={[
                  { time: 'Day 1', title: 'Deploy a customer support chatbot', description: 'Sign up, add your website as a knowledge source, and go live.' },
                  { time: 'Day 2-3', title: 'Configure and test', description: 'Write your system prompt, add FAQ docs, and test with your top 10 questions.' },
                  { time: 'Week 1', title: 'Monitor and fill gaps', description: 'Review conversation logs. Add content for unanswered questions.' },
                  { time: 'Week 2', title: 'Add lead capture', description: 'Deploy the chatbot on sales pages to engage visitors and collect contacts.' },
                  { time: 'Month 1', title: 'Measure ROI', description: 'Track tickets deflected, time saved, and cost reduction.' },
                  { time: 'Month 2', title: 'Expand to internal knowledge', description: 'Build a Slack bot for your team trained on processes and policies.' },
                  { time: 'Month 3+', title: 'Optimize and scale', description: 'Refine knowledge base, improve resolution rate, add new channels.' },
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
                      q: 'Do I need technical skills to use AI automation?',
                      a: "No. The current generation of AI automation tools is designed for non-technical users. Platforms like VocUI let you build and deploy an AI chatbot without writing code \u2014 you add your content, configure the behavior, and embed the widget on your site. Similarly, tools like Zapier, Make, and n8n provide visual automation builders that connect your existing tools without programming. If you can use a spreadsheet, you can set up most AI automations.",
                    },
                    {
                      q: 'How much does AI automation cost for a small business?',
                      a: "Most AI automation tools for small businesses cost $0\u2013$100 per month. VocUI offers a free plan for chatbot deployment, with paid plans starting at $29/month for higher usage. The total cost for a meaningful AI automation stack \u2014 chatbot, workflow automation, and AI-assisted email \u2014 is typically under $200/month. Compare this to the cost of the manual labor these tools replace, and the ROI is usually obvious within the first month.",
                    },
                    {
                      q: 'What should I automate first?',
                      a: "Start with customer support. It is the highest-volume, most repetitive area for most small businesses, and it has the fastest time to ROI. Deploy an AI chatbot trained on your website content and FAQs. This handles the 60\u201380% of customer questions that have known answers, freeing your time for the questions that actually need your attention. After support, move to lead capture and then internal knowledge management.",
                    },
                    {
                      q: 'Is AI automation safe for my business data?',
                      a: "Reputable AI automation tools follow standard security practices \u2014 data encryption in transit and at rest, access controls, and compliance with relevant regulations. With VocUI, the chatbot only accesses the content you explicitly provide in the knowledge base. It does not scrape private data, access your other business tools, or store customer conversations beyond what you configure. Review the security and privacy policies of any tool before connecting it to sensitive business data.",
                    },
                    {
                      q: 'How long until I see results from AI automation?',
                      a: "Most small businesses see measurable results within the first week. A chatbot deployed on your website starts answering customer questions immediately \u2014 day one. Within a week, you can measure how many questions it handles, how much time your team saves, and whether customers are getting the information they need. Full ROI measurement, including cost savings and productivity gains, is usually clear within 30\u201360 days.",
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
                <Link href="/guides/chatbot-for-business" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbots for Business: All 12 Industry Guides →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">The complete hub — strategy, best practices, and guides for 10 industries.</p>
              </li>
              <li>
                <Link href="/industries" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  VocUI by Industry — All 56 Verticals →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Purpose-built chatbot solutions for over 56 industries — same platform, industry-specific results.</p>
              </li>
            </ul>
          </div>
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
