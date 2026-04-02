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
  title: 'AI Chatbot for Real Estate: Qualifying Buyers and Capturing Vendor Leads | VocUI',
  description:
    'How real estate agencies use AI chatbots to qualify buyer enquiries, book property viewings automatically, and capture vendor valuation leads — 24/7.',
  openGraph: {
    title: 'AI Chatbot for Real Estate: Qualifying Buyers and Capturing Vendor Leads | VocUI',
    description:
      'How real estate agencies use AI chatbots to qualify buyer enquiries, book property viewings automatically, and capture vendor valuation leads — 24/7.',
    url: 'https://vocui.com/blog/chatbot-for-real-estate',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for Real Estate: Qualifying Buyers and Capturing Vendor Leads | VocUI',
    description:
      'How real estate agencies use AI chatbots to qualify buyer enquiries, book property viewings automatically, and capture vendor valuation leads — 24/7.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-real-estate' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot for Real Estate: Qualifying Buyers, Booking Viewings, and Capturing Vendor Leads',
      description:
        'How real estate agencies use AI chatbots to qualify buyer enquiries, book property viewings automatically, and capture vendor valuation leads — 24/7.',
      url: 'https://vocui.com/blog/chatbot-for-real-estate',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-real-estate',
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
          name: 'Can the chatbot qualify buyers before an agent gets involved?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can configure the chatbot to ask budget, timeline, and location preference questions naturally in conversation. When a visitor asks about a specific property, the chatbot can respond with relevant details and ask follow-up questions: "Are you looking to buy in the next three months, or still in early research?" This surfaces intent without the visitor feeling interrogated, and gives your agents context before they make contact.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does it work with Rightmove, Zoopla, or OnTheMarket listings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot does not connect directly to property portals, but it works from content you upload. Export your active listings as a document or upload your property pages as URLs, and the chatbot can answer questions about individual properties — bedrooms, price, location, key features. When someone wants to view a property, it directs them to your booking system or captures their contact details for an agent callback.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we handle vendor valuation requests?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Train the chatbot on your valuation process: what it involves, how long it takes, what the vendor should prepare, and what your agency fees look like. When a visitor asks about selling their property, the chatbot answers their initial questions and then directs them to book a valuation appointment. If you use VocUI with Easy!Appointments, this booking step is automated. If not, the chatbot captures their name, address, and contact number for an agent to follow up.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens to enquiries that come in at midnight?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot captures them. A buyer browsing properties at 11 PM who wants to book a viewing gets your chatbot — it answers their questions about the property, collects their preferred viewing time, and either books it automatically or queues it for your team to confirm in the morning. Without a chatbot, that enquiry sits in a contact form until someone picks it up. By that point, the buyer has often already booked a viewing with a competing agency.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can one chatbot cover multiple office locations or property types?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, provided your knowledge base is organised clearly. Upload content labelled by location or property type — "North Branch residential listings," "Commercial properties," "Lettings FAQ" — and the chatbot can route answers appropriately. For agencies where each office has distinct inventory and staff, separate chatbots per office page give cleaner experiences and avoid cross-location confusion.',
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
          name: 'AI Chatbot for Real Estate: Qualifying Buyers, Booking Viewings, and Capturing Vendor Leads',
          item: 'https://vocui.com/blog/chatbot-for-real-estate',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForRealEstatePage() {
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
                Chatbot for Real Estate
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
                AI Chatbot for Real Estate: Qualifying Buyers, Booking Viewings, and Capturing Vendor Leads
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                A buyer finds your listing at 10 PM on a Tuesday. They have three questions
                about the property and want to book a viewing for Saturday. Your office is
                closed. By Wednesday morning, they have already booked a viewing with the
                agency whose website answered their questions on the spot. An AI chatbot
                is the difference between capturing that enquiry and losing it.
              </p>
            </div>

            <IndustryStatBar
              stats={[

                { value: '72%', label: 'of buyers start their search online' },
                { value: '24/7', label: 'coverage including evenings and weekends' },
                { value: '60%', label: 'of property enquiries arrive out of hours' },
              ]}
            />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why After-Hours Enquiries Are the Highest-Value Leads You Are Missing
                </h2>
                <p>
                  Property browsing follows consumer patterns, not business hours. Rightmove
                  reports that evening and weekend traffic accounts for a significant share of
                  all property views — buyers browse after work, after the kids are in bed,
                  and during weekend downtime. These are not idle browsers. They are people
                  in active buying mode, comparing properties and deciding which agencies to
                  contact.
                </p>
                <p className="mt-4">
                  The problem is structural. Agents work daytime hours. A contact form
                  submission at 9 PM sits unanswered until the next morning. By that point,
                  the buyer has already heard back from an agent at a competing agency who had
                  a chatbot that replied instantly, answered their questions about the property,
                  and booked a viewing slot — all at 9:15 PM. Speed to response is one of the
                  strongest predictors of lead conversion in property, and a chatbot gives you
                  an always-on first response layer that no staffing arrangement can match.
                </p>
              </section>

              {/* Section 2 — example conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What a Buyer Qualification Conversation Looks Like
                </h2>
                <p>
                  Here is a typical interaction between a buyer and a chatbot trained on a
                  residential agency&apos;s listings and process:
                </p>

                <ChatPreview
                  botName="Property Bot"
                  industry="Real Estate"
                  messages={[
                    { role: 'user', text: 'Is the 3-bed on Maple Avenue still available?' },
                    { role: 'bot', text: 'Yes, 14 Maple Avenue is still available. It\'s a three-bedroom semi-detached with a south-facing garden, off-street parking for two cars, and a recently fitted kitchen. Guide price is £385,000. Would you like to book a viewing?' },
                    { role: 'user', text: 'Yes please — are you available this Saturday?' },
                    { role: 'bot', text: 'We have Saturday morning slots available at 10:00 AM and 11:30 AM. You can book directly here: [viewing link]. If neither works, let me know your preferred time and I\'ll have an agent contact you to arrange.' },
                  ]}
                />

                <p className="mt-4">
                  Within 90 seconds, a late-evening visitor has had their availability confirmed,
                  received property details, and booked a viewing — without a single agent
                  involved. The agent arrives the next morning with a confirmed Saturday
                  appointment already in the diary.
                </p>
              </section>

              {/* Section 3 — buyer qualification */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Qualifying Buyers Before Agent Involvement
                </h2>
                <p>
                  Not every enquiry is at the same stage. Some buyers are ready to offer within
                  a month. Others are eighteen months away from being mortgage-ready. Both
                  deserve a response, but they need different follow-up. A chatbot can surface
                  buyer intent naturally, without the visitor feeling interrogated.
                </p>
                <p className="mt-4">
                  Configure your chatbot&apos;s system prompt to gather context when someone
                  shows interest: are they a first-time buyer or looking to move? Do they have
                  a property to sell? Are they mortgage-ready or still exploring? These
                  questions arise naturally in conversation — the chatbot asks them as follow-ups
                  to property enquiries rather than as a form. When an agent picks up the
                  conversation the next morning, they already know whether they are dealing with
                  a motivated cash buyer or someone who needs six months before they can proceed.
                </p>

                <div className="mt-6 bg-secondary-50 dark:bg-secondary-800/40 rounded-xl p-6">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                    Qualification signals a real estate chatbot can surface
                  </p>
                  <StyledBulletList items={[
                    { title: 'Timeline:', description: 'Are they looking to move in 1 month or 12 months?' },
                    { title: 'Chain status:', description: 'Do they have a property to sell, or are they chain-free?' },
                    { title: 'Mortgage status:', description: 'Is a decision in principle already in place?' },
                    { title: 'Budget range:', description: 'Are they searching within a specific price bracket?' },
                    { title: 'Location flexibility:', description: 'Are they fixed on a specific area or open to nearby options?' },
                  ]} />
                </div>
              </section>

              {/* Section 4 — vendor leads */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Capturing Vendor Valuation Requests Before They Go Cold
                </h2>
                <p>
                  Vendor leads are among the most valuable enquiries an estate agency handles.
                  A homeowner thinking about selling visits your website, looks at your sold
                  prices, reads a few testimonials, and then wonders: &quot;What would my house
                  be worth?&quot; If the only option is a contact form, that interest frequently
                  evaporates before it becomes a booked valuation.
                </p>
                <p className="mt-4">
                  A chatbot catches this moment. When a visitor signals selling intent —
                  &quot;How much is my house worth?&quot; or &quot;What are your fees for
                  selling?&quot; — the chatbot answers their questions about your valuation
                  process, explains what makes your agency different, and offers to book a
                  free valuation appointment. Upload your fee structure, your recent sale
                  success stories, and your valuation process to the knowledge base so the
                  chatbot can give informed, persuasive answers before asking for the
                  commitment.
                </p>
                <p className="mt-4">
                  With VocUI connected to Easy!Appointments, the valuation booking is
                  automated: the chatbot offers available slots, the vendor picks one, and the
                  appointment lands directly in your calendar. No callback needed, no back-and-forth.
                </p>
              </section>

              {/* Section 5 — what to upload */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Upload to Your Real Estate Chatbot
                </h2>
                <p>
                  The quality of a chatbot&apos;s answers depends entirely on the quality of
                  its knowledge base. For a real estate agency, the highest-value content to
                  upload is:
                </p>

                <div className="mt-4 space-y-3">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Active listings</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Export your current properties as a document or upload property pages
                      as URLs. Include bedrooms, bathrooms, key features, price, and status.
                      Update whenever listings change — an agent losing a deal because the
                      chatbot confirmed a sold property as &quot;available&quot; is a problem
                      of stale knowledge, not the technology.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Area guides</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Buyers researching a move to an unfamiliar area ask about schools,
                      transport links, amenities, and community feel. An area guide document
                      lets the chatbot answer these questions, positioning your agency as the
                      local expert rather than sending the buyer to Google.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Process FAQ</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      First-time buyers especially have process questions: how long does a
                      purchase take, what is conveyancing, what surveys do you recommend, what
                      happens after an offer is accepted? A thorough process FAQ turns the
                      chatbot into a trusted guide, not just a property search tool.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Selling and fees information</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      What is your commission structure? Do you charge for photography or
                      floor plans? What does your marketing package include? Vendors need
                      this information before committing to a valuation. Giving honest,
                      upfront answers builds trust before any face-to-face meeting.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  For setup, VocUI scrapes your existing website pages automatically.
                  Point it at your homepage, listings pages, and area guides to get started
                  in under an hour. See our guide on{' '}
                  <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">
                    adding a chatbot to your website
                  </Link>
                  {' '}and check our{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    pricing page
                  </Link>
                  {' '}for plan options that fit agency use.
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
                      q: 'Can the chatbot qualify buyers before an agent gets involved?',
                      a: "Yes. You can configure the chatbot to ask budget, timeline, and location preference questions naturally in conversation. When a visitor asks about a specific property, the chatbot can respond with relevant details and ask follow-up questions: \u201CAre you looking to buy in the next three months, or still in early research?\u201D This surfaces intent without the visitor feeling interrogated, and gives your agents context before they make contact.",
                    },
                    {
                      q: 'Does it work with Rightmove, Zoopla, or OnTheMarket listings?',
                      a: "The chatbot does not connect directly to property portals, but it works from content you upload. Export your active listings as a document or upload your property pages as URLs, and the chatbot can answer questions about individual properties \u2014 bedrooms, price, location, key features. When someone wants to view a property, it directs them to your booking system or captures their contact details for an agent callback.",
                    },
                    {
                      q: 'How do we handle vendor valuation requests?',
                      a: "Train the chatbot on your valuation process: what it involves, how long it takes, what the vendor should prepare, and what your agency fees look like. When a visitor asks about selling their property, the chatbot answers their initial questions and then directs them to book a valuation appointment. If you use VocUI with Easy!Appointments, this booking step is automated. If not, the chatbot captures their name, address, and contact number for an agent to follow up.",
                    },
                    {
                      q: 'What happens to enquiries that come in at midnight?',
                      a: "The chatbot captures them. A buyer browsing properties at 11 PM who wants to book a viewing gets your chatbot \u2014 it answers their questions about the property, collects their preferred viewing time, and either books it automatically or queues it for your team to confirm in the morning. Without a chatbot, that enquiry sits in a contact form until someone picks it up. By that point, the buyer has often already booked a viewing with a competing agency.",
                    },
                    {
                      q: 'Can one chatbot cover multiple office locations or property types?',
                      a: "Yes, provided your knowledge base is organised clearly. Upload content labelled by location or property type \u2014 \u201CNorth Branch residential listings,\u201D \u201CCommercial properties,\u201D \u201CLettings FAQ\u201D \u2014 and the chatbot can route answers appropriately. For agencies where each office has distinct inventory and staff, separate chatbots per office page give cleaner experiences and avoid cross-location confusion.",
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
                <Link href="/chatbot-for-real-estate" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbot for Real Estate Agencies →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Buyer qualification, viewing bookings, and vendor lead capture for estate agents.</p>
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
