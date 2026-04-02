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
  title: 'AI Chatbot for Hotels: Answering Guest Questions and Handling Booking Enquiries 24/7 | VocUI',
  description:
    'How hotels use AI chatbots to answer pre-arrival questions, handle group booking enquiries, and surface amenity information — freeing front desk staff for in-house guests.',
  openGraph: {
    title: 'AI Chatbot for Hotels: Answering Guest Questions and Handling Booking Enquiries 24/7 | VocUI',
    description:
      'How hotels use AI chatbots to answer pre-arrival questions, handle group booking enquiries, and surface amenity information — freeing front desk staff for in-house guests.',
    url: 'https://vocui.com/blog/chatbot-for-hotels',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for Hotels: Answering Guest Questions and Handling Booking Enquiries 24/7 | VocUI',
    description:
      'How hotels use AI chatbots to answer pre-arrival questions, handle group booking enquiries, and surface amenity information — freeing front desk staff for in-house guests.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-hotels' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot for Hotels: Answering Guest Questions and Handling Booking Enquiries 24/7',
      description:
        'How hotels use AI chatbots to answer pre-arrival questions, handle group booking enquiries, and surface amenity information — freeing front desk staff for in-house guests.',
      url: 'https://vocui.com/blog/chatbot-for-hotels',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-hotels',
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
          name: 'Can the chatbot handle bookings directly?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For room bookings through platforms like Booking.com or your direct booking engine, the chatbot does not process the reservation itself. Instead, it answers pre-booking questions — room types, rates, availability windows, cancellation policy — and directs the guest to your booking page or direct reservation line. For event and group enquiries, VocUI\'s Easy!Appointments integration allows the chatbot to book a consultation call with your events team directly. This is often the highest-value automation for hotels handling function room and wedding enquiries.',
          },
        },
        {
          '@type': 'Question',
          name: 'What about international guests in different time zones?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This is one of the strongest use cases for a hotel chatbot. A guest in the US planning a trip to the UK wants to ask about breakfast included rates at 2 PM their time — which is 7 PM or 10 PM in the UK. Without a chatbot, they email and wait until the next morning for a reply. With a chatbot, they get their question answered immediately, check the room rate, and book. Hotels with international guest profiles typically see chatbot interactions distributed across a much wider time window than domestic-only properties.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we keep amenity and facility information up to date?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update the knowledge base whenever facilities change: spa hours, restaurant opening times, pool availability, parking rates. If this information lives on your website, re-scrape those pages in VocUI when content changes — it takes about two minutes. For seasonal changes (outdoor pool closed in winter, summer terrace open from May), update the knowledge base at the start of each season. An outdated chatbot that tells guests the pool is open when it is closed for maintenance creates exactly the kind of arrival disappointment you want to avoid.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot replace our telephone reservations line?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, and it should not try to. The chatbot handles the volume of straightforward pre-arrival questions and directs complex enquiries — accessible room requests, large group bookings, specific dietary requirements for events — to your reservations team. Guests with complex needs or preferences deserve human attention. The chatbot frees your team to give that attention by handling the hundreds of routine questions that do not require it.',
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
          name: 'AI Chatbot for Hotels: Answering Guest Questions and Handling Booking Enquiries 24/7',
          item: 'https://vocui.com/blog/chatbot-for-hotels',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForHotelsPage() {
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
                Chatbot for Hotels
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
                  9 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbot for Hotels: Answering Guest Questions and Handling Booking Enquiries 24/7
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A hotel&apos;s front desk team is at its most valuable when it is focused on
                guests who are physically present — checking in, handling requests, solving
                problems in person. Every call or email from a prospective guest asking about
                check-in time or parking distracts from that. An AI chatbot handles the
                pre-arrival conversation so your team can focus on the arrival experience.
              </p>
            </div>

            <IndustryStatBar
              stats={[
                { value: '67%', label: 'of travellers research hotels online before booking' },
                { value: '24/7', label: 'coverage across all time zones' },
                { value: '40%', label: 'of hotel enquiries are pre-arrival FAQs' },
              ]}
            />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Pre-Arrival Enquiry Problem
                </h2>
                <p>
                  Hotel front desks handle two very different types of communication
                  simultaneously. In-person guests need immediate, face-to-face attention —
                  they are standing at the desk with a question or a problem. Pre-arrival
                  enquiries — phone calls and emails from guests who have not yet checked in
                  — compete for the same staff time. During peak periods, this creates a
                  choice between serving the guest in front of you and answering the phone
                  from someone who wants to know if there is parking on site.
                </p>
                <p className="mt-4">
                  The questions that drive this enquiry volume are highly predictable.
                  Check-in and check-out times. Parking availability and cost. Whether
                  breakfast is included. Pet policy. Spa booking process. Early check-in
                  request. Accessibility information. Transfer options from the nearest
                  station. These questions have fixed answers that do not require staff
                  judgment — they require the right information delivered promptly.
                </p>
                <p className="mt-4">
                  An AI chatbot trained on your hotel&apos;s facilities guide, policies, and
                  FAQ answers all of these without involving your team. A guest planning their
                  trip checks your website at 10 PM, asks three questions about their stay,
                  and goes to bed satisfied. Your front desk team handles the 7 AM check-in
                  rush with their full attention on the guests walking through the door.
                </p>
              </section>

              {/* Section 2 — example conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  A Pre-Arrival Conversation in Practice
                </h2>
                <p>
                  Here is how a chatbot trained on a hotel&apos;s facilities and policies
                  handles a typical pre-arrival enquiry:
                </p>

                <ChatPreview
                  botName="Hotel Bot"
                  industry="Hotel"
                  messages={[
                    { role: 'user', text: "What time is check-in and can I request an early check-in?" },
                    { role: 'bot', text: "Standard check-in is from 3 PM. Early check-in from 12 PM can be requested — it's subject to availability on the day and there's a £20 supplement. If you'd like to guarantee early access to your room from 10 AM, you can book the night before. Just mention it when you arrive and we'll do our best. Is there anything else I can help with?" },
                    { role: 'user', text: "Is there parking and do you take dogs?" },
                    { role: 'bot', text: "Yes to both! We have on-site parking at £15 per night — no need to book in advance, just let reception know on arrival. We're also a dog-friendly hotel: well-behaved dogs are welcome in bedrooms and our garden restaurant. There's a £25 per stay cleaning supplement for dog rooms. We ask that dogs are kept on leads in public areas." },
                  ]}
                />

                <p className="mt-4">
                  Two questions answered in under a minute that would typically have been
                  a phone call or email requiring staff time. The guest now knows exactly
                  what to expect and can plan accordingly — and they arrived at this
                  information at 10 PM when no one was available to answer the phone.
                </p>
              </section>

              {/* Section 3 — international guests */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  International Guests Across Time Zones
                </h2>
                <p>
                  Hotels with international guest profiles face a structural availability
                  problem that no staffing arrangement fully solves. A guest in New York
                  planning a trip to Edinburgh is researching at noon their time — which
                  is 5 PM or later in the UK. By the time your reservations team opens
                  the next morning, that guest has either found their answers elsewhere
                  or moved on to another property.
                </p>
                <p className="mt-4">
                  A chatbot is timezone-agnostic. It answers the same question at 3 AM as
                  it does at 3 PM. For hotels that attract US, Australian, or Asian guests,
                  this is particularly valuable — these guests are doing most of their
                  research during their daytime, which maps to your nighttime. A chatbot
                  that answers accurately and helpfully at any hour removes this barrier
                  to booking.
                </p>
                <p className="mt-4">
                  For multi-language needs, your chatbot&apos;s underlying AI understands
                  and responds in the visitor&apos;s language automatically. A guest writing
                  in German or French receives a response in the same language without any
                  additional configuration. This is particularly useful for properties in
                  popular international tourist destinations.
                </p>
              </section>

              {/* Section 4 — group bookings */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Group Bookings and Event Enquiries
                </h2>
                <p>
                  Group bookings and event enquiries are among the highest-value leads a hotel
                  receives, but they frequently go cold in the gap between initial interest
                  and first contact. Someone planning a wedding researches venues over a
                  weekend, fills in a contact form on Sunday afternoon, and has moved on
                  to three other venues before your events team calls on Monday morning.
                </p>
                <p className="mt-4">
                  A chatbot captures this initial interest and moves it forward. Configure
                  it with your function room capacities, minimum spends, catering options,
                  and a summary of your wedding and event packages. When someone asks about
                  hosting a wedding or a corporate away day, the chatbot provides enough
                  information to hold their interest and then offers to book a consultation
                  call with your events team.
                </p>
                <p className="mt-4">
                  With VocUI&apos;s Easy!Appointments integration, this consultation booking
                  is automated. The enquiring party selects a time slot, and the appointment
                  lands in your events team&apos;s calendar before anyone has had to pick up
                  the phone. Group leads that previously went cold are now scheduled calls
                  with an already-interested prospect.
                </p>
              </section>

              {/* Section 5 — what to upload */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Upload to Your Hotel Chatbot
                </h2>
                <p>
                  Build the knowledge base around the documents your front desk and reservations
                  team consult most often when handling enquiries:
                </p>

                <div className="mt-4 space-y-3">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Room types and rate FAQ</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      What each room type includes (size, view, bed configuration), which
                      rooms have baths vs showers, accessible room details, whether rates
                      include breakfast, your cancellation policy for direct vs OTA bookings.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Facilities guide</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Spa, pool, gym, restaurant, bar — opening hours, booking requirements,
                      pricing, age restrictions. Include the questions guests most commonly
                      ask about each facility: &quot;Is the pool heated?&quot; &quot;Do I
                      need to book the spa in advance?&quot; &quot;Is breakfast served on
                      weekends?&quot;
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Arrival and access information</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Parking (on-site, nearby alternatives, cost), directions from key
                      transport hubs, taxi services, public transport options. This is
                      often the most-asked category in the week before arrival.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Policies</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Check-in and check-out times, early check-in and late check-out options,
                      pet policy, smoking policy, age restrictions (adult-only properties
                      especially need this answered clearly), group booking minimum spend.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  For setup, VocUI scrapes your website automatically. Point it at your
                  rooms page, facilities page, and FAQ to start. Add a policies document
                  for anything not published on your site. Most hotels are live within an
                  afternoon. See how{' '}
                  <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">
                    to add a chatbot to your website
                  </Link>
                  {' '}and check our{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    pricing page
                  </Link>
                  {' '}for plan options.
                </p>
              </section>

              {/* Section 6 — booking automation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Booking Automation with Easy!Appointments
                </h2>
                <p>
                  For hotels using VocUI&apos;s Easy!Appointments integration, the chatbot
                  can automate appointment booking for services that require scheduled slots:
                  spa treatments, restaurant reservations, event consultation calls, and
                  tours of wedding venues. When a guest asks about booking a spa treatment,
                  the chatbot surfaces available times and completes the booking in
                  conversation.
                </p>
                <p className="mt-4">
                  This is particularly valuable for event and wedding enquiries, where
                  the gap between initial contact and first human interaction is the most
                  common point of lead drop-off. An automated consultation booking means
                  the interest is captured and committed to a time slot before it can go cold.
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
                      q: 'Can the chatbot handle bookings directly?',
                      a: "For room bookings through platforms like Booking.com or your direct booking engine, the chatbot does not process the reservation itself. Instead, it answers pre-booking questions \u2014 room types, rates, availability windows, cancellation policy \u2014 and directs the guest to your booking page or direct reservation line. For event and group enquiries, VocUI\u2019s Easy!Appointments integration allows the chatbot to book a consultation call with your events team directly. This is often the highest-value automation for hotels handling function room and wedding enquiries.",
                    },
                    {
                      q: 'What about international guests in different time zones?',
                      a: "This is one of the strongest use cases for a hotel chatbot. A guest in the US planning a trip to the UK wants to ask about breakfast included rates at 2 PM their time \u2014 which is 7 PM or 10 PM in the UK. Without a chatbot, they email and wait until the next morning for a reply. With a chatbot, they get their question answered immediately, check the room rate, and book. Hotels with international guest profiles typically see chatbot interactions distributed across a much wider time window than domestic-only properties.",
                    },
                    {
                      q: 'How do we keep amenity and facility information up to date?',
                      a: "Update the knowledge base whenever facilities change: spa hours, restaurant opening times, pool availability, parking rates. If this information lives on your website, re-scrape those pages in VocUI when content changes \u2014 it takes about two minutes. For seasonal changes (outdoor pool closed in winter, summer terrace open from May), update the knowledge base at the start of each season. An outdated chatbot that tells guests the pool is open when it is closed for maintenance creates exactly the kind of arrival disappointment you want to avoid.",
                    },
                    {
                      q: 'Can the chatbot replace our telephone reservations line?',
                      a: "No, and it should not try to. The chatbot handles the volume of straightforward pre-arrival questions and directs complex enquiries \u2014 accessible room requests, large group bookings, specific dietary requirements for events \u2014 to your reservations team. Guests with complex needs or preferences deserve human attention. The chatbot frees your team to give that attention by handling the hundreds of routine questions that do not require it.",
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
                <Link href="/chatbot-for-hotels" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbot for Hotels →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Pre-arrival FAQ, group booking capture, and facilities information for hotels and hospitality.</p>
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
