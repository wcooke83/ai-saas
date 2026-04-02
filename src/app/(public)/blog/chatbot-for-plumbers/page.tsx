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
  title: 'AI Chatbot for Plumbers: Handling Emergency Calls and Booking Jobs 24/7 | VocUI',
  description:
    'How plumbing businesses use AI chatbots to handle after-hours emergency enquiries, book routine jobs, and answer common pricing questions — without missing a single call.',
  openGraph: {
    title: 'AI Chatbot for Plumbers: Handling Emergency Calls and Booking Jobs 24/7 | VocUI',
    description:
      'How plumbing businesses use AI chatbots to handle after-hours emergency enquiries, book routine jobs, and answer common pricing questions — without missing a single call.',
    url: 'https://vocui.com/blog/chatbot-for-plumbers',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for Plumbers: Handling Emergency Calls and Booking Jobs 24/7 | VocUI',
    description:
      'How plumbing businesses use AI chatbots to handle after-hours emergency enquiries, book routine jobs, and answer common pricing questions — without missing a single call.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-plumbers' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot for Plumbers: Handling Emergency Calls, Booking Jobs, and Quoting Common Work',
      description:
        'How plumbing businesses use AI chatbots to handle after-hours emergency enquiries, book routine jobs, and answer common pricing questions — without missing a single call.',
      url: 'https://vocui.com/blog/chatbot-for-plumbers',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-plumbers',
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
          name: 'How does the chatbot handle genuine emergencies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Configure the system prompt to recognise emergency keywords — burst pipe, flooding, no hot water, gas smell, boiler failure — and respond with your emergency contact number immediately. The chatbot does not replace you for an emergency; it ensures the person in crisis gets your emergency number within seconds rather than waiting for a callback that might come too late. Include your out-of-hours call-out policy and emergency line prominently in the response.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot give accurate pricing without knowing the exact job?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It can give indicative ranges for common jobs based on what you upload. "A standard tap replacement typically costs £80-£120 including parts and labour for a straightforward job — the final price depends on access and whether any additional work is needed. I can book a visit for a firm quote." This approach sets expectations, avoids the prospect going elsewhere for a number, and gets the booking. Never have the chatbot commit to a fixed price for a job it cannot see.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if someone contacts me through the chatbot while I am on a job?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "That is exactly when the chatbot adds the most value. You're 4 hours into a boiler replacement when three people try to reach you — one is an emergency, two want to book routine work. The chatbot captures all three: gives the emergency caller your emergency number, books the routine jobs into your schedule for next week, and answers their pricing questions. You surface from the job with a full diary and no missed opportunities.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does it work for sole traders as well as larger plumbing businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It works especially well for sole traders. When you are the only person in the business, every missed call is a missed job. A chatbot on your website gives you a 24/7 first response layer that captures leads and books jobs while you are working. The setup cost is low, and even a single additional job per week from a previously-missed after-hours enquiry more than justifies the monthly subscription.',
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
          name: 'AI Chatbot for Plumbers: Handling Emergency Calls, Booking Jobs, and Quoting Common Work',
          item: 'https://vocui.com/blog/chatbot-for-plumbers',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForPlumbersPage() {
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
                Chatbot for Plumbers
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
                  8 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbot for Plumbers: Handling Emergency Calls, Booking Jobs, and Quoting Common Work
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A plumber on a job cannot answer the phone. A plumber driving between jobs
                cannot reply to a website enquiry. A plumber at 11 PM is not going to check
                their email. Trade businesses lose more work to missed communication than to
                pricing or competition — and an AI chatbot solves this by being the first
                point of contact that never misses.
              </p>
            </div>

            <IndustryStatBar
              stats={[
                { value: '62%', label: 'of trade enquiries go unanswered' },
                { value: '24/7', label: 'emergency lead capture' },
                { value: '1 hr', label: 'typical setup time' },
              ]}
            />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Missed Call Problem for Trade Businesses
                </h2>
                <p>
                  Plumbing is a business where the phone call is still the primary way
                  customers make contact — but plumbers are physically unable to answer their
                  phones for most of the working day. They are under a sink, in a loft, or
                  dealing with a customer face-to-face. Voicemail captures some of this, but
                  most customers do not leave messages. They call the next plumber on the
                  list instead.
                </p>
                <p className="mt-4">
                  The evening and weekend problem is compounding. A homeowner discovers a
                  dripping tap at 8 PM on a Friday. They search online, find your website,
                  see you are local and have good reviews, and want to know if you can come
                  next week. Without a chatbot, they email a contact form and wait until
                  Monday. Some will wait. Many will have found someone else and booked them
                  by Monday morning.
                </p>
                <p className="mt-4">
                  A chatbot on your website catches this moment. It answers their question
                  about availability, gives them a rough idea of what the job might cost,
                  and books a slot — all at 8 PM on Friday without you being involved. You
                  wake up Saturday with a job already in the diary.
                </p>
              </section>

              {/* Section 2 — emergency vs routine */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Emergency vs Routine: How to Handle Both with One Chatbot
                </h2>
                <p>
                  Plumbing enquiries split into two fundamentally different categories, and
                  a well-configured chatbot handles both differently.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                    <p className="font-semibold text-red-800 dark:text-red-200 mb-3">Emergency enquiries</p>
                    <StyledBulletList items={[
                      { title: 'Burst pipe or active flooding', description: '' },
                      { title: 'Boiler failure in winter', description: '' },
                      { title: 'No hot water in the home', description: '' },
                      { title: 'Gas smell (refer to Gas Emergency 0800 111 999)', description: '' },
                      { title: 'Sewage backup', description: '' },
                    ]} />
                    <p className="text-sm text-red-700 dark:text-red-300 mt-3">
                      Chatbot response: surface emergency call-out number immediately. Do not route through a booking form.
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                    <p className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Routine enquiries</p>
                    <StyledBulletList items={[
                      { title: 'Dripping tap or slow drain', description: '' },
                      { title: 'Annual boiler service', description: '' },
                      { title: 'New radiator installation', description: '' },
                      { title: 'Bathroom or kitchen refit', description: '' },
                      { title: 'Water pressure issues', description: '' },
                    ]} />
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
                      Chatbot response: answer pricing questions, explain process, offer booking.
                    </p>
                  </div>
                </div>

                <p>
                  The emergency handling is critical. If someone visits your website with a
                  burst pipe, they need your emergency number within seconds — not a booking
                  form. Configure your system prompt with a priority rule: if the query
                  contains emergency keywords, lead with the emergency contact number before
                  anything else.
                </p>
              </section>

              {/* Section 3 — example conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  After-Hours Lead Capture in Practice
                </h2>
                <p>
                  Here is how a chatbot trained on a plumbing business handles two
                  different Friday evening enquiries:
                </p>

                <ChatPreview
                  botName="Plumbing Bot"
                  industry="Plumbing"
                  messages={[
                    { role: 'user', text: "My boiler has stopped working. No heating or hot water." },
                    { role: 'bot', text: "A boiler failure is a priority job — we offer emergency call-outs 7 days a week. Please call us on 07700 900123 for same-day availability. If you'd prefer, I can also take your details and have an engineer call you back within the hour." },
                    { role: 'user', text: "I have a dripping tap in the bathroom. How much would that cost to fix?" },
                    { role: 'bot', text: "A dripping tap is usually a washer or cartridge replacement — for a standard bathroom tap, that's typically £65-£95 all-in, including parts. I can book you in for this week if you'd like. What days work best for you?" },
                  ]}
                />
              </section>

              {/* Section 4 — pricing questions */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Answering Pricing Questions Without Underselling Yourself
                </h2>
                <p>
                  Pricing is the number one question plumbing customers ask before booking.
                  Most plumbers are reluctant to publish firm prices because every job is
                  different — and rightly so. The chatbot handles this well when configured
                  correctly: it gives honest indicative ranges based on common job types,
                  explains what variables affect the final price, and routes to a booking
                  for a firm quote.
                </p>
                <p className="mt-4">
                  Upload a pricing guide document with your indicative rates for common jobs:
                  emergency call-out fee, hourly rate, boiler service, standard tap
                  replacement, toilet cistern repair, radiator bleeding, power flush. Include
                  the variables that affect price — access difficulty, parts cost, whether
                  additional work is discovered on inspection. The chatbot answers with a
                  range and a clear next step.
                </p>
                <p className="mt-4">
                  This approach converts better than refusing to discuss price at all.
                  A prospect who asks &quot;How much for a boiler service?&quot; and gets
                  &quot;We can&apos;t quote without seeing the boiler&quot; may click away.
                  A prospect who gets &quot;A standard boiler service is typically £80-£120
                  — I can book you in for a confirmed quote and service in one visit&quot; is
                  far more likely to book.
                </p>
              </section>

              {/* Section 5 — what to upload */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Upload to Your Plumbing Chatbot
                </h2>
                <p>
                  The knowledge base for a plumbing chatbot does not need to be extensive —
                  it needs to be accurate and practical. Start with:
                </p>

                <div className="mt-4 space-y-3">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Services and pricing guide</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      List your service types and indicative price ranges. Include your
                      emergency call-out fee, hourly rate, and any fixed-price packages
                      (annual boiler service, drain clearance). Make clear that prices are
                      indicative and subject to inspection.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Coverage area and availability</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Which postcodes or towns you cover, your normal working hours, and
                      whether you offer out-of-hours call-outs and at what premium. Include
                      your response time for emergencies vs routine bookings.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Qualifications and accreditations</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Gas Safe registration number, any manufacturer accreditations
                      (Worcester Bosch, Vaillant), membership of trade bodies. Customers
                      ask for this when choosing a tradesperson — the chatbot should be
                      able to provide it.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Booking and payment process</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      How to book, whether you require a deposit, payment methods accepted,
                      and your cancellation policy. Reducing friction in the booking process
                      converts enquiries to confirmed jobs.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  VocUI scrapes your website automatically, so if your services, area, and
                  contact details are already published, you are most of the way there. Add
                  a pricing guide document for the pricing Q&amp;A capability. Setup takes
                  around an hour. Check our{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    pricing page
                  </Link>
                  {' '}or see how{' '}
                  <Link href="/blog/ai-chatbot-for-after-hours-support" className="text-primary-600 dark:text-primary-400 hover:underline">
                    after-hours AI chatbots capture leads
                  </Link>
                  {' '}for more on the after-hours opportunity.
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
                      q: 'How does the chatbot handle genuine emergencies?',
                      a: "Configure the system prompt to recognise emergency keywords \u2014 burst pipe, flooding, no hot water, gas smell, boiler failure \u2014 and respond with your emergency contact number immediately. The chatbot does not replace you for an emergency; it ensures the person in crisis gets your emergency number within seconds rather than waiting for a callback that might come too late. Include your out-of-hours call-out policy and emergency line prominently in the response.",
                    },
                    {
                      q: 'Can the chatbot give accurate pricing without knowing the exact job?',
                      a: "It can give indicative ranges for common jobs based on what you upload. \u201CA standard tap replacement typically costs \u00A380-\u00A3120 including parts and labour for a straightforward job \u2014 the final price depends on access and whether any additional work is needed. I can book a visit for a firm quote.\u201D This approach sets expectations, avoids the prospect going elsewhere for a number, and gets the booking. Never have the chatbot commit to a fixed price for a job it cannot see.",
                    },
                    {
                      q: 'What if someone contacts me through the chatbot while I am on a job?',
                      a: "That is exactly when the chatbot adds the most value. You\u2019re 4 hours into a boiler replacement when three people try to reach you \u2014 one is an emergency, two want to book routine work. The chatbot captures all three: gives the emergency caller your emergency number, books the routine jobs into your schedule for next week, and answers their pricing questions. You surface from the job with a full diary and no missed opportunities.",
                    },
                    {
                      q: 'Does it work for sole traders as well as larger plumbing businesses?',
                      a: "It works especially well for sole traders. When you are the only person in the business, every missed call is a missed job. A chatbot on your website gives you a 24/7 first response layer that captures leads and books jobs while you are working. The setup cost is low, and even a single additional job per week from a previously-missed after-hours enquiry more than justifies the monthly subscription.",
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
                <Link href="/chatbot-for-plumbers" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbot for Plumbers →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Emergency lead capture, job booking, and pricing FAQ for plumbing businesses.</p>
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
