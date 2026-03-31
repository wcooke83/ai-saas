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
  title: 'AI Chatbots for Travel Agencies: Answer Booking Questions 24/7 | VocUI',
  description:
    'Travel agencies use AI chatbots to answer destination questions, explain packages, and capture leads around the clock — even outside business hours.',
  openGraph: {
    title: 'AI Chatbots for Travel Agencies: Answer Booking Questions 24/7 | VocUI',
    description:
      'Travel agencies use AI chatbots to answer destination questions, explain packages, and capture leads around the clock — even outside business hours.',
    url: 'https://vocui.com/blog/chatbot-for-travel-agencies',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Travel Agencies: Answer Booking Questions 24/7 | VocUI',
    description:
      'Travel agencies use AI chatbots to answer destination questions, explain packages, and capture leads around the clock — even outside business hours.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-travel-agencies' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Travel Agencies: Answer Booking Questions 24/7',
      description:
        'Travel agencies use AI chatbots to answer destination questions, explain packages, and capture leads around the clock — even outside business hours.',
      url: 'https://vocui.com/blog/chatbot-for-travel-agencies',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-travel-agencies',
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
          name: 'Can it handle questions about visa requirements and travel documents?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, as long as you train it on current visa and travel document information for the destinations you serve. Include country-specific entry requirements, passport validity rules, visa processing timelines, and any destination-specific advisories. Update this content regularly since entry requirements change frequently. The chatbot can answer "Do I need a visa for Thailand?" or "How long does my passport need to be valid for the EU?" — saving your agents from answering these same questions dozens of times per week.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does it connect to GDS systems or booking engines?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The chatbot does not integrate with Global Distribution Systems (Amadeus, Sabre, Travelport) or booking engines. It cannot check live availability, pricing, or process reservations. What it does is answer the pre-booking questions that precede a sales conversation: destination information, package inclusions, cancellation policies, and travel tips. When a prospect is ready to book, the chatbot links them to your booking request form or suggests scheduling a consultation with an agent who can access the GDS and build their itinerary.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I handle seasonal promotions and expired offers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update your knowledge base when promotions launch and remove them when they expire. A chatbot that recommends a package you discontinued three months ago erodes trust immediately. Build seasonal content updates into your promotional calendar — when you launch a summer campaign, add the content to the chatbot at the same time. For time-sensitive offers, include the valid dates in the training content so the chatbot can mention them: "Our early-bird Mediterranean cruise discount is available through March 15."',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot replace a travel agent?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. It handles the informational questions that precede a booking conversation — destination research, package comparisons, logistics questions, and travel document requirements. These are the questions that fill your inbox and voicemail. The chatbot answers them instantly so that when a prospect is ready to book, they are already informed and your agents can focus on customizing itineraries, negotiating rates, and closing the sale. It is a lead-warming tool, not a replacement for human expertise in complex trip planning.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot answer in other languages?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The AI behind VocUI chatbots supports dozens of languages natively. When a visitor writes in Spanish, French, German, Japanese, or another supported language, the chatbot responds in that language automatically. Your training content can stay in English — the chatbot translates its responses. This is particularly valuable for agencies serving international travelers or operating in multilingual markets.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I handle travel advisories and safety alerts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Add current travel advisories to your knowledge base for the destinations you serve. When conditions change — a natural disaster, political instability, health advisory — update the chatbot\'s content immediately. Include links to official sources (State Department, CDC, embassy websites) so travelers can verify information. The chatbot can answer "Is it safe to travel to [country]?" with your agency\'s most current assessment and official references.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use the chatbot for group travel and corporate bookings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Train the chatbot on your group travel policies, corporate travel programs, and large-party logistics. Group travel prospects ask specific questions: minimum group size, group discounts, dedicated coordinator availability, and custom itinerary options. The chatbot answers these and directs qualified group inquiries to your corporate or group travel desk for personalized planning.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForTravelAgenciesPage() {
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
                Chatbot for Travel Agencies
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
                AI Chatbots for Travel Agencies: Answer Booking Questions 24/7
              </h1>
            </header>

            {/* Featured snippet — story-first */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                It&apos;s 9 PM on a Sunday. A couple is researching their anniversary trip,
                excited about a potential cruise through the Greek islands. They visit your
                agency&apos;s site, find a package that looks perfect, but have three
                questions: Is the flight included? What&apos;s the cancellation policy? Do
                they need a visa for Greece? They submit a contact form. By Tuesday, they
                have booked with a competitor who answered faster.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 — the timing problem */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Sunday Night Problem: When Travelers Research, Agencies Sleep
                </h2>
                <p>
                  Travel planning is inherently research-heavy. According to <a href="https://www.stratosjets.com/blog/online-travel-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Stratos Jet Charters</a>, travelers visit an average of 38 websites before booking a trip. Before a customer commits, they spend hours comparing destinations, checking prices, and asking
                  questions. This research peaks in the evenings and on weekends — precisely
                  when most agencies are closed. The window of engagement is narrow: a prospect
                  browsing at 9 PM is excited now, but by Monday morning they&apos;ve visited
                  three other agency sites.
                </p>
                <p className="mt-4">
                  According to <a href="https://www.mindfulecotourism.com/chatgpt-and-ai-chatbots-travel-booking-statistics-and-trends/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Mindful Ecotourism</a>, 60% of travelers are open to using chatbots for booking, and the opportunity is growing — <a href="https://www.perk.com/blog/online-travel-booking-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Perk</a> reports the AI in tourism market was valued at $3.37 billion in 2024 and is projected to reach $13.9 billion by 2030. A chatbot on your website engages these visitors in real time. It answers
                  questions about destinations, explains what&apos;s included in packages,
                  compares options, and provides the kind of helpful information that builds
                  confidence in your agency. The visitor who arrived at 9 PM with a vague interest
                  in Greece leaves with specific knowledge about your island-hopping package
                  and a link to request a consultation. That&apos;s the difference between a
                  bounce and a lead.
                </p>
              </section>

              {/* Section 2 — unique: seasonal demand patterns */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Seasonal Demand Patterns and Content Planning
                </h2>

                {/* Seasonal table — unique to travel post */}
                <div className="overflow-x-auto mt-6 mb-6">
                  <table className="w-full text-left text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
                    <thead className="bg-secondary-50 dark:bg-secondary-800/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Season</th>
                        <th className="px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Peak Destinations</th>
                        <th className="px-4 py-3 font-semibold text-secondary-900 dark:text-secondary-100">Chatbot Content to Prioritize</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                      <tr>
                        <td className="px-4 py-3 font-medium">Jan-Mar</td>
                        <td className="px-4 py-3">Caribbean, Mexico, ski resorts</td>
                        <td className="px-4 py-3">All-inclusive packages, winter getaway deals, spring break offers</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Apr-Jun</td>
                        <td className="px-4 py-3">Europe, Mediterranean cruises</td>
                        <td className="px-4 py-3">Shoulder season pricing, visa requirements, tour itineraries</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Jul-Sep</td>
                        <td className="px-4 py-3">Family resorts, national parks, Alaska</td>
                        <td className="px-4 py-3">Family-friendly packages, adventure travel, group tours</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Oct-Dec</td>
                        <td className="px-4 py-3">Southeast Asia, holiday cruises, tropical escapes</td>
                        <td className="px-4 py-3">Holiday travel, gift certificates, early-bird deals for next year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  Travel demand is seasonal, and your chatbot&apos;s knowledge base should
                  reflect that. Update content before each season: add new promotions when
                  they launch, remove expired offers, and refresh destination content when
                  conditions change (new resort openings, visa requirement changes, seasonal
                  pricing updates). A chatbot that recommends a summer package in January
                  builds anticipation. One that recommends a discontinued winter deal in
                  March erodes trust.
                </p>
              </section>

              {/* Section 3 — multi-language support — unique to travel post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Serving International Travelers in Their Language
                </h2>
                <p>
                  Travel agencies serve a global audience. A prospect in Germany researching
                  your Italy package should be able to ask questions in German. A family in
                  Brazil planning a Disney World trip may prefer Portuguese. The AI behind
                  VocUI chatbots supports dozens of languages natively — it responds in
                  whatever language the visitor uses, without any additional configuration.
                </p>
                <p className="mt-4">
                  This is a significant competitive advantage for agencies that serve
                  international travelers or operate in multilingual markets. Your training
                  content can be in English, and the chatbot will translate its responses
                  automatically when a visitor writes in another language. The translation
                  quality is strong for major languages (Spanish, French, German, Portuguese,
                  Japanese, Mandarin, and others) — the chatbot draws from your content and
                  presents it in the visitor&apos;s language.
                </p>
                <p className="mt-4">
                  For agencies that specialize in inbound tourism — bringing international
                  visitors to your region — this removes a major barrier. A Japanese tourist
                  researching your Napa Valley wine tour can interact with the chatbot in
                  Japanese, get answers about the itinerary, and request a booking — all
                  without your team needing to hire multilingual staff.
                </p>
              </section>

              {/* Section 4 — booking flow integration — unique to travel post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Where the Chatbot Fits in Your Booking Flow
                </h2>
                <p>
                  Travel bookings are rarely impulsive. The typical path from interest to
                  booking involves multiple research sessions, comparison shopping, and
                  questions that need answers before the traveler commits. Here is where the
                  chatbot adds value at each stage:
                </p>

                {/* Booking flow — unique to travel post */}
                <div className="mt-6 mb-6 relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200 dark:bg-primary-800" />
                  <div className="space-y-6 pl-12">
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-secondary-900" />
                      <p className="font-semibold text-secondary-900 dark:text-secondary-100">Dreaming</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;What destinations do you specialize in?&quot; &quot;When is the best time to visit Thailand?&quot; Chatbot shares destination expertise.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-secondary-900" />
                      <p className="font-semibold text-secondary-900 dark:text-secondary-100">Planning</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;What&apos;s included in the Mediterranean cruise package?&quot; &quot;Do I need travel insurance?&quot; Chatbot provides package details and logistics.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-secondary-900" />
                      <p className="font-semibold text-secondary-900 dark:text-secondary-100">Comparing</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">&quot;What&apos;s the difference between your Tuscany and Amalfi Coast packages?&quot; Chatbot highlights distinctions from your content.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-secondary-900" />
                      <p className="font-semibold text-secondary-900 dark:text-secondary-100">Ready to book</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Chatbot provides your consultation booking link or trip request form. Prospect arrives informed and ready to finalize details with an agent.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 top-1 w-4 h-4 rounded-full bg-secondary-300 dark:bg-secondary-600 border-2 border-white dark:border-secondary-900" />
                      <p className="font-semibold text-secondary-900 dark:text-secondary-100">Post-booking (human-led)</p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Agent builds itinerary, negotiates rates, handles changes. Chatbot can still answer logistics: &quot;Do I need a visa?&quot; &quot;What&apos;s the cancellation policy?&quot;</p>
                    </div>
                  </div>
                </div>

                <p>
                  The chatbot handles the first four stages entirely and supports post-booking
                  logistics. Your agents focus on the itinerary building and booking that
                  requires GDS access and human expertise.
                </p>
              </section>

              {/* Section 5 — GDS and booking systems */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  How the Chatbot Works Alongside Your Booking Systems
                </h2>
                <p>
                  Travel agencies typically rely on Global Distribution Systems (Amadeus, Sabre,
                  Travelport) for air, hotel, and car inventory, plus specialized booking engines
                  for cruise lines and tour operators. A VocUI chatbot does not connect to these
                  systems — it cannot check live availability, pull real-time pricing, or process
                  reservations.
                </p>
                <p className="mt-4">
                  Instead, it handles the conversation layer that happens <em>before</em> a
                  booking. When a prospect asks &quot;What&apos;s included in your Tuscany
                  package?&quot; or &quot;Do I need travel insurance for Southeast Asia?&quot;
                  the chatbot provides detailed answers from your training content. When they&apos;re
                  ready to book, it links them to your booking request form, suggests calling
                  your office, or directs them to schedule a consultation with an agent who
                  can access the GDS and build their itinerary.
                </p>
                <p className="mt-4">
                  This division of labor works well: the chatbot handles the high-volume,
                  repetitive information questions at any hour, while your agents handle the
                  complex, personalized booking work that requires system access and human
                  expertise. The result is better-informed prospects who require shorter,
                  more productive sales conversations.
                </p>
              </section>

              {/* Section 4 — lead capture */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Capturing Warm Leads While You Sleep
                </h2>
                <p>
                  The most valuable function of a travel agency chatbot is lead capture during
                  off-hours. When a prospect engages at 11 PM, asks about your Amalfi Coast
                  tour, and gets a detailed, enthusiastic response, they&apos;re primed to
                  take the next step. The chatbot can prompt them to leave their email, fill
                  out a trip request form, or book a call with an agent.
                </p>
                <p className="mt-4">
                  Review your conversation logs to understand what prospects are asking about
                  most. If five people this week asked about Japan and you don&apos;t have a
                  Japan package, that&apos;s market intelligence. If prospects consistently ask
                  about payment plans, add that information to your content. The chatbot is
                  both a sales tool and a research tool — it tells you what your market wants.
                </p>
              </section>

              {/* Section 5 — setup */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Training on Destinations and Getting Live in an Hour
                </h2>
                <p>
                  Start with your website content: destination pages, package descriptions,
                  itinerary outlines, FAQ sections, and travel tips. VocUI scrapes and indexes
                  your site automatically. Add PDF brochures, destination guides, and seasonal
                  promotion flyers for deeper content.
                </p>
                <p className="mt-4">
                  Write a system prompt that captures your agency&apos;s personality. If your
                  brand is adventurous and fun, the chatbot should match. If you specialize in
                  luxury travel, it should sound polished and knowledgeable. The system prompt
                  sets the tone for every interaction. For a detailed walkthrough, see our guide
                  on{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    adding a chatbot to your website
                  </Link>
                  , and check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>
                  {' '}for plan options.
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
                      q: 'Can it handle questions about visa requirements and travel documents?',
                      a: "Yes, as long as you train it on current visa and travel document information for the destinations you serve. Include country-specific entry requirements, passport validity rules, visa processing timelines, and any destination-specific advisories. Update this content regularly since entry requirements change frequently. The chatbot can answer \u201CDo I need a visa for Thailand?\u201D or \u201CHow long does my passport need to be valid for the EU?\u201D \u2014 saving your agents from answering these same questions dozens of times per week.",
                    },
                    {
                      q: 'Does it connect to GDS systems or booking engines?',
                      a: "No. The chatbot does not integrate with Global Distribution Systems (Amadeus, Sabre, Travelport) or booking engines. It cannot check live availability, pricing, or process reservations. What it does is answer the pre-booking questions that precede a sales conversation: destination information, package inclusions, cancellation policies, and travel tips. When a prospect is ready to book, the chatbot links them to your booking request form or suggests scheduling a consultation with an agent who can access the GDS and build their itinerary.",
                    },
                    {
                      q: 'How do I handle seasonal promotions and expired offers?',
                      a: "Update your knowledge base when promotions launch and remove them when they expire. A chatbot that recommends a package you discontinued three months ago erodes trust immediately. Build seasonal content updates into your promotional calendar \u2014 when you launch a summer campaign, add the content to the chatbot at the same time. For time-sensitive offers, include the valid dates in the training content so the chatbot can mention them: \u201COur early-bird Mediterranean cruise discount is available through March 15.\u201D",
                    },
                    {
                      q: 'Does the chatbot replace a travel agent?',
                      a: "No. It handles the informational questions that precede a booking conversation \u2014 destination research, package comparisons, logistics questions, and travel document requirements. These are the questions that fill your inbox and voicemail. The chatbot answers them instantly so that when a prospect is ready to book, they are already informed and your agents can focus on customizing itineraries, negotiating rates, and closing the sale. It is a lead-warming tool, not a replacement for human expertise in complex trip planning.",
                    },
                    {
                      q: 'Can the chatbot answer in other languages?',
                      a: "Yes. The AI behind VocUI chatbots supports dozens of languages natively. When a visitor writes in Spanish, French, German, Japanese, or another supported language, the chatbot responds in that language automatically. Your training content can stay in English \u2014 the chatbot translates its responses. This is particularly valuable for agencies serving international travelers or operating in multilingual markets.",
                    },
                    {
                      q: 'How do I handle travel advisories and safety alerts?',
                      a: "Add current travel advisories to your knowledge base for the destinations you serve. When conditions change \u2014 a natural disaster, political instability, health advisory \u2014 update the chatbot\u2019s content immediately. Include links to official sources (State Department, CDC, embassy websites) so travelers can verify information. The chatbot can answer \u201CIs it safe to travel to [country]?\u201D with your agency\u2019s most current assessment and official references.",
                    },
                    {
                      q: 'Can I use the chatbot for group travel and corporate bookings?',
                      a: "Yes. Train the chatbot on your group travel policies, corporate travel programs, and large-party logistics. Group travel prospects ask specific questions: minimum group size, group discounts, dedicated coordinator availability, and custom itinerary options. The chatbot answers these and directs qualified group inquiries to your corporate or group travel desk for personalized planning.",
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
