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
  title: 'AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations | VocUI',
  description:
    'AI chatbots help restaurants answer questions about menus, hours, reservations, and dietary options — without tying up staff on the phone.',
  openGraph: {
    title: 'AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations | VocUI',
    description:
      'AI chatbots help restaurants answer questions about menus, hours, reservations, and dietary options — without tying up staff on the phone.',
    url: 'https://vocui.com/blog/chatbot-for-restaurants',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations | VocUI',
    description:
      'AI chatbots help restaurants answer questions about menus, hours, reservations, and dietary options — without tying up staff on the phone.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-restaurants' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations',
      description:
        'AI chatbots help restaurants answer questions about menus, hours, reservations, and dietary options — without tying up staff on the phone.',
      url: 'https://vocui.com/blog/chatbot-for-restaurants',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-restaurants',
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
          name: 'Can the chatbot handle allergen questions accurately?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, as long as your training content includes detailed allergen and dietary information for each dish. Include ingredient lists, preparation notes about shared cooking surfaces, and clear labels for gluten-free, nut-free, dairy-free, vegan, and other dietary categories. The chatbot pulls from this content to answer questions like "which entrees are nut-free?" Be thorough with allergen information since accuracy matters for customer safety — treat the chatbot\'s allergen knowledge base with the same care you give your printed allergen disclosure.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does it work with OpenTable or Resy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot does not directly process reservations through OpenTable, Resy, Yelp, or other booking platforms. Instead, it answers pre-booking questions (party size limits, outdoor seating, private dining availability) and then shares a direct link to your reservation page when someone is ready to book. Configure your system prompt to include the booking URL and any policies — for example, "Parties of 8 or more should call directly." This ensures the visitor arrives at your booking page informed and ready to complete the reservation.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens when the menu changes seasonally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Update the knowledge source in VocUI whenever your menu changes. If your menu lives on a webpage, re-scrape that URL to pull in the latest items — it takes about two minutes. For seasonal menus or daily specials in PDF format, upload the new version to replace the old one. Most restaurant owners update their chatbot whenever they reprint menus. The chatbot will immediately start referencing the updated content.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need a developer to set this up?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. VocUI is designed for non-technical users. You create your chatbot, paste in your website URL or upload your menu PDF, customize the widget appearance, and copy a single embed code into your website. If you use Squarespace, Wix, or WordPress, you add the chatbot through their built-in code embed features — no developer needed. Most restaurant owners have their chatbot live in under an hour.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can it handle takeout and delivery questions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Train the chatbot on your takeout and delivery policies: which platforms you use (DoorDash, Uber Eats, your own ordering system), delivery radius, minimum order amounts, packaging fees, and estimated wait times. When a visitor asks "Do you deliver to my area?" the chatbot shares your delivery zone and links to your ordering platform. If you handle orders directly, include your phone number or online ordering URL.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot slow down my website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The VocUI widget loads asynchronously, which means your website content appears first and the chatbot loads in the background without affecting page speed. The widget itself is lightweight — it adds minimal load time. This matters for restaurants because Google uses page speed as a ranking factor, and hungry customers are not going to wait for a slow-loading site.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForRestaurantsPage() {
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
                Chatbot for Restaurants
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
                  10 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations
              </h1>
            </header>

            {/* Featured snippet — story-first opening */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                It&apos;s 9:45 PM on a Friday. A couple is deciding between your restaurant
                and the one across the street. They check your website for the menu — but
                their daughter has a tree nut allergy, and the menu PDF doesn&apos;t list
                allergens. They call, but you&apos;re slammed and nobody picks up. They
                walk across the street. A chatbot on your site would have answered that
                question in five seconds.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 — unique angle: the phone call problem */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Phone Call That Costs You a Table
                </h2>
                <p>
                  Restaurants operate on thin margins and tight staffing. Every minute a host spends
                  answering the phone about parking availability or whether you serve brunch on
                  Sundays is a minute they&apos;re not seating guests or managing the dining room.
                  During peak hours, phone calls go unanswered — and those are often potential
                  customers who end up choosing a competitor that was easier to get information from. According to <a href="https://www.tidio.com/blog/live-chat-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Tidio</a>, 90% of customers consider instant customer service crucial — if you can&apos;t answer fast, they go somewhere that can.
                </p>
                <p className="mt-4">
                  The questions are remarkably repetitive. According to <a href="https://masterofcode.com/blog/chatbot-statistics" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Master of Code</a>, 30% of restaurants have already shifted to chatbots for automated interactions, and 33% of consumers say they want to use chatbots to make reservations at hotels or restaurants. Hours of operation, menu items, dietary
                  accommodations, reservation availability, parking, dress code, private dining
                  — the same ten to fifteen questions account for the vast majority of inbound
                  inquiries. They rarely change, which makes them ideal for automation. An AI
                  chatbot trained on your menu, hours, and policies handles these questions 24/7
                  without adding headcount.
                </p>
              </section>

              {/* Section 2 — unique: example chatbot conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What a Restaurant Chatbot Conversation Looks Like
                </h2>
                <p>
                  Here&apos;s a real example of how a chatbot trained on a restaurant&apos;s
                  menu and policies handles a visitor with dietary concerns:
                </p>

                {/* Example conversation — unique to restaurant post */}
                <div className="mt-6 mb-6 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        My daughter has a tree nut allergy. What can she eat from your dinner menu?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Several dinner entrees are tree nut-free: the grilled salmon, the ribeye
                        steak, the chicken parmesan, and the margherita flatbread. Our pasta
                        dishes are also nut-free, but the pesto contains pine nuts so avoid that
                        sauce. I&apos;d recommend letting your server know about the allergy when
                        you arrive so the kitchen can take extra precautions. Would you like to
                        see our full allergen guide, or would you like to make a reservation?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        Great, can we get a table for 4 on Saturday at 7?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm text-secondary-800 dark:text-secondary-200">
                        You can book a table for 4 directly through our OpenTable page:
                        [reservation link]. Saturday evenings fill up quickly, so I&apos;d
                        recommend booking soon. If you need a party of 8 or more, please call
                        us directly at (555) 123-4567.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  That interaction took 30 seconds. Without the chatbot, it would have been an
                  unanswered phone call during dinner rush, or a next-day email reply that arrives
                  after the family has already eaten somewhere else. The chatbot converted a dietary
                  concern into a reservation.
                </p>
              </section>

              {/* Section 3 — peak hours vs off-hours — unique to restaurant post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Peak Hours vs. Off-Hours: When Chatbots Help Most
                </h2>
                <p>
                  Restaurant chatbot value is not evenly distributed across the day. The
                  highest-impact moments are the ones where your staff physically cannot
                  answer the phone:
                </p>

                {/* Peak/off-hours breakdown — unique element */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                    <p className="font-semibold text-red-800 dark:text-red-200 mb-3">Peak hours (highest chatbot value)</p>
                    <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <li><strong>Friday-Saturday 5-9 PM:</strong> Dinner rush. Staff is on the floor, phones go unanswered.</li>
                      <li><strong>Sunday 10 AM-1 PM:</strong> Brunch volume. &quot;Do you take reservations?&quot; spikes.</li>
                      <li><strong>Holidays:</strong> &quot;Are you open on Christmas Eve?&quot; surges 2-3 weeks before.</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                    <p className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Off-hours (steady chatbot value)</p>
                    <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <li><strong>9 PM-midnight:</strong> Late-night planners researching for tomorrow.</li>
                      <li><strong>Monday-Tuesday:</strong> Lower foot traffic, but website research is active.</li>
                      <li><strong>Between meal services:</strong> Staff prepping, not available for calls.</li>
                    </ul>
                  </div>
                </div>

                <p>
                  The common thread: the people most likely to become your customers are making
                  decisions exactly when you are least available to help them. A chatbot flips
                  this dynamic. Your busiest and your quietest hours both get full coverage.
                </p>
              </section>

              {/* Section 4 — reservation system integration */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Connecting to OpenTable, Resy, and Yelp Reservations
                </h2>
                <p>
                  While a VocUI chatbot doesn&apos;t directly process reservations, it works
                  alongside your existing reservation system by removing the friction that
                  prevents bookings. When someone asks &quot;Can I make a reservation for
                  Friday?&quot; the chatbot responds with your reservation policy and includes
                  a direct link to your OpenTable, Resy, Yelp, or custom booking page.
                </p>
                <p className="mt-4">
                  Configure your chatbot&apos;s personality to include reservation links and
                  policies. For example: &quot;When asked about reservations, share the booking link
                  and mention that parties of 8+ should call directly.&quot; The chatbot also
                  answers the pre-booking questions that often prevent customers from completing a
                  reservation: &quot;Do you have outdoor seating?&quot; &quot;Is there a deposit
                  for large parties?&quot; &quot;Can I bring a cake for a birthday?&quot;
                </p>
                <p className="mt-4">
                  This is more effective than a standalone &quot;Book Now&quot; button because
                  the visitor arrives at your reservation page already informed and confident.
                  They know you have outdoor seating, they know the dress code is casual, they
                  know their daughter can eat safely. The chatbot answered the hesitation before
                  it became an abandonment.
                </p>
              </section>

              {/* Section 5 — multi-location angle — unique to restaurant post */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Multi-Location Restaurants: One Bot or One Per Location?
                </h2>
                <p>
                  If you operate more than one restaurant location, you have two options. A
                  single chatbot trained on all locations works when the menu is identical and
                  hours are the same — it can answer &quot;Which location is closest to
                  downtown?&quot; and share both addresses. Separate chatbots per location work
                  better when menus, hours, or policies differ — the Midtown location has a
                  rooftop bar, the Westside location does not, and a visitor asking about
                  outdoor seating needs the right answer for the location they are considering.
                </p>
                <p className="mt-4">
                  Deploy each location&apos;s chatbot on its respective page. If you have a
                  single website for all locations, a shared chatbot trained on clearly
                  organized content (&quot;Midtown menu,&quot; &quot;Westside hours&quot;) can
                  route accurately. The key is making sure the training content labels which
                  information applies to which location.
                </p>
              </section>

              {/* Section 6 — training and setup */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Getting Your Menu and Allergen Info Into the Chatbot
                </h2>
                <p>
                  The fastest way to get your restaurant chatbot running is to point it at your
                  existing website. If your menu, hours, and location are already published on your
                  site, VocUI can scrape those pages and use them as knowledge sources. Add your
                  homepage URL, your menu page, and your about/contact page — three URLs and your
                  bot has the basics covered.
                </p>
                <p className="mt-4">
                  For menus that exist as PDFs, upload the file directly. VocUI extracts the text
                  and makes it searchable. If your menu includes allergen tags, make sure those
                  are in the PDF or on the webpage — the more detail you include, the more
                  accurately the chatbot can answer dietary questions. A menu that says
                  &quot;Salmon (GF, DF)&quot; lets the chatbot answer gluten-free and dairy-free
                  queries. A menu that just says &quot;Salmon&quot; cannot.
                </p>
                <p className="mt-4">
                  For information not on your website — happy hour specials, private dining
                  packages, holiday hours, catering menus — create a simple text document with the
                  details and upload it. Think of it as writing the answers to every question your
                  host answers on the phone. The chatbot loads asynchronously, so it won&apos;t
                  slow down your website. Embedding takes a single line of code — learn more in
                  our guide on{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    adding a chatbot to your website
                  </Link>
                  . Check our{' '}
                  <Link
                    href="/pricing"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    pricing page
                  </Link>
                  {' '}to find a plan that fits your restaurant.
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
                      q: 'Can the chatbot handle allergen questions accurately?',
                      a: "Yes, as long as your training content includes detailed allergen and dietary information for each dish. Include ingredient lists, preparation notes about shared cooking surfaces, and clear labels for gluten-free, nut-free, dairy-free, vegan, and other dietary categories. The chatbot pulls from this content to answer questions like \u201Cwhich entrees are nut-free?\u201D Be thorough with allergen information since accuracy matters for customer safety \u2014 treat the chatbot\u2019s allergen knowledge base with the same care you give your printed allergen disclosure.",
                    },
                    {
                      q: 'How does it work with OpenTable or Resy?',
                      a: "The chatbot does not directly process reservations through OpenTable, Resy, Yelp, or other booking platforms. Instead, it answers pre-booking questions (party size limits, outdoor seating, private dining availability) and then shares a direct link to your reservation page when someone is ready to book. Configure your system prompt to include the booking URL and any policies \u2014 for example, \u201CParties of 8 or more should call directly.\u201D This ensures the visitor arrives at your booking page informed and ready to complete the reservation.",
                    },
                    {
                      q: 'What happens when the menu changes seasonally?',
                      a: "Update the knowledge source in VocUI whenever your menu changes. If your menu lives on a webpage, re-scrape that URL to pull in the latest items \u2014 it takes about two minutes. For seasonal menus or daily specials in PDF format, upload the new version to replace the old one. Most restaurant owners update their chatbot whenever they reprint menus. The chatbot will immediately start referencing the updated content.",
                    },
                    {
                      q: 'Do I need a developer to set this up?',
                      a: "No. VocUI is designed for non-technical users. You create your chatbot, paste in your website URL or upload your menu PDF, customize the widget appearance, and copy a single embed code into your website. If you use Squarespace, Wix, or WordPress, you add the chatbot through their built-in code embed features \u2014 no developer needed. Most restaurant owners have their chatbot live in under an hour.",
                    },
                    {
                      q: 'Can it handle takeout and delivery questions?',
                      a: "Yes. Train the chatbot on your takeout and delivery policies: which platforms you use (DoorDash, Uber Eats, your own ordering system), delivery radius, minimum order amounts, packaging fees, and estimated wait times. When a visitor asks \u201CDo you deliver to my area?\u201D the chatbot shares your delivery zone and links to your ordering platform. If you handle orders directly, include your phone number or online ordering URL.",
                    },
                    {
                      q: 'Does the chatbot slow down my website?',
                      a: "No. The VocUI widget loads asynchronously, which means your website content appears first and the chatbot loads in the background without affecting page speed. The widget itself is lightweight \u2014 it adds minimal load time. This matters for restaurants because Google uses page speed as a ranking factor, and hungry customers are not going to wait for a slow-loading site.",
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
            <h2 className="text-2xl font-bold mb-3">Stop losing tables to unanswered questions</h2>
            <p className="text-white/80 mb-2">
              Upload your menu and policies, train a chatbot in minutes, and let it handle the questions that cost you reservations.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. Most restaurants are live before dinner service.
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
