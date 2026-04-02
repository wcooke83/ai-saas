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
  title: 'AI Chatbot for Ecommerce: Deflecting Support Tickets and Answering Pre-Purchase Questions | VocUI',
  description:
    'How ecommerce stores use AI chatbots to deflect repetitive support tickets, answer product questions before purchase, and handle returns enquiries — without scaling headcount.',
  openGraph: {
    title: 'AI Chatbot for Ecommerce: Deflecting Support Tickets and Answering Pre-Purchase Questions | VocUI',
    description:
      'How ecommerce stores use AI chatbots to deflect repetitive support tickets, answer product questions before purchase, and handle returns enquiries — without scaling headcount.',
    url: 'https://vocui.com/blog/chatbot-for-ecommerce',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for Ecommerce: Deflecting Support Tickets and Answering Pre-Purchase Questions | VocUI',
    description:
      'How ecommerce stores use AI chatbots to deflect repetitive support tickets, answer product questions before purchase, and handle returns enquiries — without scaling headcount.',
  },
  alternates: { canonical: 'https://vocui.com/blog/chatbot-for-ecommerce' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'AI Chatbot for Ecommerce: Deflecting Support Tickets and Answering Pre-Purchase Questions',
      description:
        'How ecommerce stores use AI chatbots to deflect repetitive support tickets, answer product questions before purchase, and handle returns enquiries — without scaling headcount.',
      url: 'https://vocui.com/blog/chatbot-for-ecommerce',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/chatbot-for-ecommerce',
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
          name: 'Can the chatbot check order status or tracking?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A VocUI chatbot does not connect directly to your order management or fulfilment system. However, it can answer the policy-level question — "Your order should arrive within 3-5 working days; you\'ll receive a tracking link by email when it ships" — and direct customers to your order tracking page or carrier portal for real-time status. This handles the majority of "where is my order?" questions, since most customers just want confirmation of expected delivery timing.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do we prevent the chatbot from giving wrong product information?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Keep your product knowledge base current. If you sell products with specific compatibility requirements or technical specifications, upload accurate, detailed product descriptions and explicitly include compatibility information. Use your system prompt to instruct the chatbot to recommend checking the product page for full specifications when the answer depends on specific product variants. Audit chatbot responses regularly and update the knowledge base when you identify gaps or outdated information.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does escalation look like when the chatbot cannot help?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Configure the chatbot to recognise the limits of what it can resolve. When a customer raises a dispute, describes a defective product, or has a situation that requires order-level access, the chatbot should acknowledge the issue clearly and provide the route to human support: a support email, a link to raise a ticket, or a phone number for urgent cases. The chatbot handles the volume; your support team handles the complexity. This division is cleaner and more scalable than trying to automate everything.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does it work on Shopify, WooCommerce, and other platforms?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. VocUI generates an embed code — a single script tag — that you paste into your website theme. For Shopify, add it through the theme editor\'s code section. For WooCommerce, add it to your footer via a plugin or theme editor. For custom-built stores, add it to your base layout template. The chatbot works on any platform that allows you to add custom JavaScript. Setup typically takes under 30 minutes.',
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
          name: 'AI Chatbot for Ecommerce: Deflecting Support Tickets and Answering Pre-Purchase Questions',
          item: 'https://vocui.com/blog/chatbot-for-ecommerce',
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ChatbotForEcommercePage() {
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
                Chatbot for Ecommerce
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
                AI Chatbot for Ecommerce: Deflecting Support Tickets and Answering Pre-Purchase Questions
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Ecommerce support volume scales with sales volume. Hire more staff to
                handle tickets and you erode margin. Let tickets pile up and you damage
                reviews and repeat purchase rates. An AI chatbot breaks this trade-off by
                handling the majority of questions automatically — the ones that have the
                same answer every time — and routing the exceptions to your team.
              </p>
            </div>

            <IndustryStatBar
              stats={[
                { value: '70%', label: 'of support tickets are repetitive' },
                { value: '3x', label: 'more likely to buy with instant answers' },
                { value: '40%', label: 'ticket deflection rate reported by stores' },
              ]}
            />

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  The Support Ticket Volume Problem
                </h2>
                <p>
                  A medium-sized ecommerce store processing 500 orders per week might receive
                  150-200 support contacts per week. Analyse those contacts and a clear
                  pattern emerges: a significant majority ask questions that have identical
                  answers. &quot;Where is my order?&quot; &quot;How do I return something?&quot;
                  &quot;What is your refund policy?&quot; &quot;Do you ship to Ireland?&quot;
                  &quot;Is this available in size M?&quot;
                </p>
                <p className="mt-4">
                  These questions are not complex. They do not require judgment, empathy, or
                  investigation. They require the person asking to receive accurate information
                  quickly. This is exactly what an AI chatbot trained on your store&apos;s
                  knowledge base does well. A customer who asks about your returns policy at
                  9 PM gets an immediate answer. A customer who wants to know if the large
                  fits true to size before checking out gets a response in seconds. Neither
                  interaction requires a human agent.
                </p>
                <p className="mt-4">
                  According to <a href="https://www.gartner.com/en/newsroom/press-releases/2022-07-27-gartner-predicts-chatbots-will-become-a-primary-customer-service-channel-within-five-years" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Gartner</a>, chatbots will become a primary customer service channel for many businesses. Stores that automate routine enquiries are not cutting corners — they are freeing their support teams to handle the cases that genuinely require human attention.
                </p>
              </section>

              {/* Section 2 — pre-purchase */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Pre-Purchase Questions That Block Conversion
                </h2>
                <p>
                  The most commercially important chatbot interactions in ecommerce are
                  pre-purchase questions — the ones a customer asks before deciding to add
                  to cart. These questions represent an active buying intent interrupted by
                  uncertainty. If the uncertainty is resolved quickly, the purchase proceeds.
                  If it is not, the customer leaves.
                </p>

                <div className="mt-6 bg-secondary-50 dark:bg-secondary-800/40 rounded-xl p-6">
                  <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                    Common pre-purchase questions by category
                  </p>
                  <StyledBulletList items={[
                    { title: 'Sizing and fit:', description: '"Does this run small?" "What are the measurements for a size L?" "Is this suitable for wide feet?"' },
                    { title: 'Compatibility:', description: '"Does this work with iPhone 15?" "Is this compatible with 240V?" "Will this fit a standard UK plug socket?"' },
                    { title: 'Delivery:', description: '"Do you ship to Northern Ireland?" "How long does standard delivery take?" "Is next-day delivery available for this item?"' },
                    { title: 'Product details:', description: '"What material is this made from?" "Is this product BPA-free?" "Does it come with a warranty?"' },
                    { title: 'Stock availability:', description: '"Is the navy colourway back in stock?" "When will the XL be available?" "Is this available in stores?"' },
                  ]} />
                </div>

                <p className="mt-4">
                  A chatbot trained on your product FAQ, size guides, and shipping policy
                  answers all of these instantly. The customer stays on the page, gets their
                  question resolved, and completes the purchase. Research consistently shows
                  that customers who engage with live or automated chat are more likely to
                  purchase than those who do not — the interaction itself builds confidence.
                </p>
              </section>

              {/* Section 3 — example conversation */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What an Ecommerce Chatbot Conversation Looks Like
                </h2>

                <ChatPreview
                  botName="Store Bot"
                  industry="Ecommerce"
                  messages={[
                    { role: 'user', text: "I ordered 3 days ago and haven't received a shipping confirmation. What's happening?" },
                    { role: 'bot', text: "Orders typically ship within 2-3 working days, so yours should be dispatched soon if it hasn't been already. You'll receive an email with tracking details as soon as it ships. If you haven't received a shipping confirmation by tomorrow, please contact our support team at support@store.com with your order number and we'll look into it straight away." },
                    { role: 'user', text: "What's your returns policy?" },
                    { role: 'bot', text: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Start a return by emailing returns@store.com with your order number — we'll send a prepaid label within 24 hours. Refunds are processed within 5-7 working days of receiving your return." },
                  ]}
                />
              </section>

              {/* Section 4 — post-purchase */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Post-Purchase: Returns, Exchanges, and Tracking
                </h2>
                <p>
                  Post-purchase contact is the highest volume category in most ecommerce
                  support queues. Customers want to know where their order is, how to
                  return it if it is wrong, and how to exchange for a different size or
                  colour. All of these have policy-level answers that a chatbot handles well.
                </p>
                <p className="mt-4">
                  Train the chatbot on your returns policy (timeframe, condition requirements,
                  process for initiating a return), your exchange process (whether you do
                  direct exchanges or refund-and-reorder), and your delivery timeframes and
                  carrier information. The chatbot answers the process question immediately
                  and directs customers to the correct next step — the returns portal, the
                  support email, or the carrier tracking page.
                </p>
                <p className="mt-4">
                  The exception to automate carefully: damaged or defective goods. These
                  require your support team to investigate and make a judgment call.
                  Configure the chatbot to acknowledge defective product reports empathetically,
                  apologise for the inconvenience, and direct immediately to your support
                  team with a clear process for resolution. Do not have the chatbot attempt
                  to resolve these autonomously.
                </p>
              </section>

              {/* Section 5 — what to upload */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to Upload to Your Ecommerce Chatbot
                </h2>
                <p>
                  Four documents cover the majority of what ecommerce chatbot users ask about:
                </p>

                <div className="mt-4 space-y-3">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Product FAQ</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Sizing guides, material information, compatibility notes, and answers
                      to the most common product questions. If you have category-specific FAQs
                      (clothing vs electronics vs homeware), upload them separately and label
                      clearly.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Shipping and delivery policy</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Delivery timeframes, carriers used, tracking process, international
                      shipping availability and costs, cut-off times for next-day delivery.
                      Include any exceptions — remote areas, oversized items, hazardous
                      materials.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Returns and refunds policy</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Returns window, condition requirements, how to initiate a return,
                      refund timeline, whether you cover return postage, and your process
                      for defective or incorrect items.
                    </p>
                  </div>
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5">
                    <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Contact and escalation information</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Your support email, any phone number, live chat hours if applicable,
                      and your typical response times. Customers need to know there is a
                      human they can reach when the chatbot cannot help.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  For Shopify stores, see our guide on{' '}
                  <Link href="/blog/how-to-embed-chatbot-in-shopify" className="text-primary-600 dark:text-primary-400 hover:underline">
                    embedding a chatbot in Shopify
                  </Link>
                  {' '}for setup instructions. Check our{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    pricing page
                  </Link>
                  {' '}to find a plan that scales with your order volume.
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
                      q: 'Can the chatbot check order status or tracking?',
                      a: "A VocUI chatbot does not connect directly to your order management or fulfilment system. However, it can answer the policy-level question \u2014 \u201CYour order should arrive within 3-5 working days; you\u2019ll receive a tracking link by email when it ships\u201D \u2014 and direct customers to your order tracking page or carrier portal for real-time status. This handles the majority of \u201Cwhere is my order?\u201D questions, since most customers just want confirmation of expected delivery timing.",
                    },
                    {
                      q: 'How do we prevent the chatbot from giving wrong product information?',
                      a: "Keep your product knowledge base current. If you sell products with specific compatibility requirements or technical specifications, upload accurate, detailed product descriptions and explicitly include compatibility information. Use your system prompt to instruct the chatbot to recommend checking the product page for full specifications when the answer depends on specific product variants. Audit chatbot responses regularly and update the knowledge base when you identify gaps or outdated information.",
                    },
                    {
                      q: 'What does escalation look like when the chatbot cannot help?',
                      a: "Configure the chatbot to recognise the limits of what it can resolve. When a customer raises a dispute, describes a defective product, or has a situation that requires order-level access, the chatbot should acknowledge the issue clearly and provide the route to human support: a support email, a link to raise a ticket, or a phone number for urgent cases. The chatbot handles the volume; your support team handles the complexity. This division is cleaner and more scalable than trying to automate everything.",
                    },
                    {
                      q: 'Does it work on Shopify, WooCommerce, and other platforms?',
                      a: "Yes. VocUI generates an embed code \u2014 a single script tag \u2014 that you paste into your website theme. For Shopify, add it through the theme editor\u2019s code section. For WooCommerce, add it to your footer via a plugin or theme editor. For custom-built stores, add it to your base layout template. The chatbot works on any platform that allows you to add custom JavaScript. Setup typically takes under 30 minutes.",
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
                <Link href="/chatbot-for-ecommerce" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  AI Chatbot for Ecommerce Stores →
                </Link>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">Pre-purchase question answering, returns FAQ, and ticket deflection for online stores.</p>
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
