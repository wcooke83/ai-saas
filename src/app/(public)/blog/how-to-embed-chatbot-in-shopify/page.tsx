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
  title: 'How to Embed a Chatbot in Shopify | VocUI',
  description:
    'Add an AI chatbot to your Shopify store to answer product questions, shipping inquiries, and return policies — no app install required.',
  openGraph: {
    title: 'How to Embed a Chatbot in Shopify | VocUI',
    description:
      'Add an AI chatbot to your Shopify store to answer product questions, shipping inquiries, and return policies — no app install required.',
    url: 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Embed a Chatbot in Shopify | VocUI',
    description:
      'Add an AI chatbot to your Shopify store to answer product questions, shipping inquiries, and return policies — no app install required.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Embed a Chatbot in Shopify',
      description:
        'Add an AI chatbot to your Shopify store to answer product questions, shipping inquiries, and return policies — no app install required.',
      url: 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify',
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
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Should I use a Shopify app or a script tag to add a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A script tag is simpler and avoids the overhead of Shopify apps. Apps require granting store permissions, add monthly subscription fees, and can conflict with other apps. A script tag in theme.liquid loads independently, has no app-level permissions, and cannot be affected by Shopify app updates or compatibility issues.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I add the chatbot using Shopify Theme App Blocks instead of editing theme.liquid?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Theme App Blocks are designed for Shopify apps distributed through the App Store and require a published app listing. For a direct script tag embed like VocUI, editing theme.liquid is the correct approach. It takes 30 seconds and works on every Shopify theme, including Online Store 2.0 themes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will the chatbot affect my Shopify Speed Score?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No measurable impact. The VocUI script loads asynchronously and does not block rendering, so it does not affect Largest Contentful Paint (LCP) or Total Blocking Time (TBT). Shopify speed reports may show the external request, but it will not reduce your score because async scripts are not render-blocking.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can the chatbot appear on checkout pages?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'On standard Shopify plans, checkout pages use a restricted template that does not load theme.liquid, so the chatbot will not appear there. On Shopify Plus, you can add the script to checkout.liquid to enable the chatbot on checkout and thank-you pages. For non-Plus stores, the chatbot covers product, cart, collection, and all other storefront pages.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the chatbot work with Shopify Markets and multi-language stores?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The chatbot embed code is the same across all Shopify Markets. The VocUI widget responds in the language of the visitor query regardless of which market subdomain they are on. To ensure accurate answers in each language, add your translated product pages and policy pages as separate knowledge sources in VocUI.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToEmbedChatbotInShopifyPage() {
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
                Shopify Chatbot
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2025-03-31" className="text-xs text-secondary-400 dark:text-secondary-500">Mar 31, 2025</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  6 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Embed a Chatbot in Shopify
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Adding a chatbot to your Shopify store lets you answer product questions,
                shipping inquiries, and return policy questions automatically — 24 hours a day.
                No Shopify app required. Just one script tag pasted into your theme, and your AI
                assistant is live.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Shopify Stores Need a Chatbot
                </h2>
                <p>
                  According to <a href="https://www.searchenginejournal.com/cms-market-share/454039/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Search Engine Journal</a>, Shopify holds 4.8% of the CMS market share, making it one of the most popular ecommerce platforms in the world. Shopify stores face a unique support challenge: shoppers have questions at
                  all hours, and unanswered questions directly translate to abandoned carts. A
                  visitor wondering &quot;Does this come in blue?&quot; or &quot;How long does
                  shipping take to the UK?&quot; will leave your store if they can&apos;t get an
                  answer quickly.
                </p>
                <p className="mt-4">
                  Traditional live chat requires someone to be online to respond. Email support
                  means hours or days of delay. An AI chatbot trained on your store content
                  answers these questions instantly, keeping shoppers engaged and moving toward
                  checkout.
                </p>
                <p className="mt-4">
                  The numbers back this up. Ecommerce stores with chatbots consistently report
                  15-30% fewer support tickets, faster average response times, and measurable
                  improvements in conversion rates — especially on product and checkout pages
                  where purchase decisions happen.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What You Need Before Starting
                </h2>
                <p>
                  The setup process is straightforward, but make sure you have these ready:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    <strong>A VocUI account with a chatbot created.</strong> If you haven&apos;t
                    set one up yet, start with our{' '}
                    <Link
                      href="/blog/how-to-add-chatbot-to-website"
                      className="text-primary-500 hover:text-primary-600 underline"
                    >
                      general chatbot setup guide
                    </Link>
                    .
                  </li>
                  <li>
                    <strong>Shopify admin access.</strong> You need to be able to edit your
                    theme code. This works on all Shopify plans — Basic, Shopify, Advanced, and
                    Plus.
                  </li>
                  <li>
                    <strong>Your store content ready as a knowledge source.</strong> The best
                    approach is to add your store&apos;s URL so VocUI can scrape your product
                    pages, FAQ page, shipping policy, and return policy automatically.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step: Adding the Embed Code to Shopify
                </h2>
                <p>
                  Follow these steps to add the VocUI chatbot to your Shopify store. The entire
                  process takes about three minutes.
                </p>
                <ol className="list-decimal list-inside space-y-4 mt-4 ml-4">
                  <li>
                    <strong>Copy your embed code.</strong> Log in to your VocUI dashboard, open
                    your chatbot, and go to the Deploy tab. Copy the JavaScript embed snippet.
                  </li>
                  <li>
                    <strong>Open your Shopify theme editor.</strong> In your Shopify admin, go
                    to <strong>Online Store &gt; Themes</strong>. Click the three-dot menu on your
                    active theme and select <strong>Edit code</strong>.
                  </li>
                  <li>
                    <strong>Find the theme.liquid file.</strong> In the Layout folder on the
                    left sidebar, click on{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      theme.liquid
                    </code>
                    . This is the master template that wraps every page in your store.
                  </li>
                  <li>
                    <strong>Paste the embed code.</strong> Scroll to the bottom of the file and
                    paste the VocUI script tag just before the
                    closing{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      &lt;/body&gt;
                    </code>{' '}
                    tag. This ensures the chatbot loads on every page of your store.
                  </li>
                  <li>
                    <strong>Save.</strong> Click Save in the top right corner. Visit your store
                    and you should see the chat widget in the bottom corner.
                  </li>
                </ol>
                <p className="mt-4">
                  That&apos;s it. No app to install, no monthly app subscription, and no risk of
                  plugin conflicts. The script tag approach is the cleanest way to add third-party
                  tools to Shopify.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Training the Chatbot on Your Store Content
                </h2>
                <p>
                  A chatbot is only as good as the content it&apos;s trained on. For a Shopify
                  store, you&apos;ll want to cover the topics shoppers ask about most:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    <strong>Product details.</strong> Add your store&apos;s URL as a knowledge
                    source and VocUI will crawl your product pages. The bot can then answer
                    questions about sizing, materials, features, and availability.
                  </li>
                  <li>
                    <strong>Shipping information.</strong> Upload or link to your shipping policy
                    page. Shoppers constantly ask about delivery times, shipping costs, and
                    international availability.
                  </li>
                  <li>
                    <strong>Return and refund policies.</strong> These are among the most-asked
                    questions in ecommerce. Make sure your bot can explain the process clearly.
                  </li>
                  <li>
                    <strong>Store FAQ.</strong> If you have an existing FAQ page, add it as a
                    knowledge source. The bot will pull answers directly from your existing
                    content.
                  </li>
                </ul>
                <p className="mt-4">
                  For more advanced training strategies, check out our guide on{' '}
                  <Link
                    href="/chatbot-for-ecommerce"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    chatbots for ecommerce
                  </Link>
                  .
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Widget Customization
                </h2>
                <p>
                  Customize colors, position, welcome message, and avatar from the VocUI
                  dashboard. For the full list of widget options, see our{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    full chatbot setup guide
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  <strong>Shopify-specific tip:</strong> To find your store&apos;s exact brand
                  color, go to <strong>Online Store &gt; Themes &gt; Customize</strong>, then open{' '}
                  <strong>Theme settings &gt; Colors</strong>. Copy the hex value for your accent
                  or primary color and paste it into VocUI&apos;s widget color picker. This
                  ensures the chat bubble blends seamlessly with your storefront buttons and
                  navigation.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Shopify-Specific Troubleshooting
                </h2>
                <p>
                  Most Shopify embeds work immediately. When they don&apos;t, these are the
                  Shopify-specific causes:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 ml-4">
                  <li>
                    <strong>Script not loading on Online Store 2.0 themes.</strong> Newer Shopify
                    themes use sections and blocks architecture, but theme.liquid still exists and
                    still wraps every page. If you cannot find theme.liquid, check under the{' '}
                    <strong>Layout</strong> folder in the code editor, not Sections or Templates.
                  </li>
                  <li>
                    <strong>Liquid syntax error after pasting.</strong> Make sure you paste the
                    VocUI script tag as raw HTML, not inside a Liquid{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      {'{{'}...{'}}'}
                    </code>{' '}
                    or{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      {'{%'}...{'%}'}
                    </code>{' '}
                    block. The script tag should be plain HTML placed before the
                    closing{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      &lt;/body&gt;
                    </code>{' '}
                    tag.
                  </li>
                  <li>
                    <strong>Chatbot not visible in theme preview.</strong> Shopify&apos;s theme
                    preview sometimes does not execute third-party scripts. Publish the theme and
                    check your live storefront URL instead.
                  </li>
                  <li>
                    <strong>Shopify speed report flags the script.</strong> The Shopify speed
                    report lists all third-party scripts. VocUI will appear in the list but will
                    not reduce your score because it loads asynchronously and does not block
                    rendering. You can safely ignore this line item.
                  </li>
                  <li>
                    <strong>Password-protected storefront blocking the widget.</strong> If your
                    store is password-protected (common during development), the chatbot script
                    still loads behind the password wall but is not visible to public visitors.
                    Remove the password to test the live experience.
                  </li>
                </ul>
                <p className="mt-4">
                  For other platforms, see our{' '}
                  <Link
                    href="/blog/how-to-embed-chatbot-in-wordpress"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    WordPress embed guide
                  </Link>
                  ,{' '}
                  <Link
                    href="/blog/how-to-embed-chatbot-in-squarespace"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    Squarespace embed guide
                  </Link>
                  , or the general{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    chatbot website embed guide
                  </Link>
                  .
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
                      q: 'Should I use a Shopify app or a script tag to add a chatbot?',
                      a: 'A script tag is simpler and avoids the overhead of Shopify apps. Apps require granting store permissions, add monthly subscription fees, and can conflict with other apps. A script tag in theme.liquid loads independently, has no app-level permissions, and cannot be affected by Shopify app updates or compatibility issues.',
                    },
                    {
                      q: 'Can I add the chatbot using Shopify Theme App Blocks instead of editing theme.liquid?',
                      a: 'Theme App Blocks are designed for Shopify apps distributed through the App Store and require a published app listing. For a direct script tag embed like VocUI, editing theme.liquid is the correct approach. It takes 30 seconds and works on every Shopify theme, including Online Store 2.0 themes.',
                    },
                    {
                      q: 'Will the chatbot affect my Shopify Speed Score?',
                      a: 'No measurable impact. The VocUI script loads asynchronously and does not block rendering, so it does not affect Largest Contentful Paint (LCP) or Total Blocking Time (TBT). Shopify speed reports may show the external request, but it will not reduce your score because async scripts are not render-blocking.',
                    },
                    {
                      q: 'Can the chatbot appear on checkout pages?',
                      a: 'On standard Shopify plans, checkout pages use a restricted template that does not load theme.liquid, so the chatbot will not appear there. On Shopify Plus, you can add the script to checkout.liquid to enable the chatbot on checkout and thank-you pages. For non-Plus stores, the chatbot covers product, cart, collection, and all other storefront pages.',
                    },
                    {
                      q: 'How does the chatbot work with Shopify Markets and multi-language stores?',
                      a: 'The chatbot embed code is the same across all Shopify Markets. The VocUI widget responds in the language of the visitor query regardless of which market subdomain they are on. To ensure accurate answers in each language, add your translated product pages and policy pages as separate knowledge sources in VocUI.',
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
            <h2 className="text-2xl font-bold mb-3">Ready to add it to your site?</h2>
            <p className="text-white/80 mb-2">
              Create your chatbot, copy one line of code, and paste it into your site -- done.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Works with any theme or page builder. No plugins required.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Build and embed yours
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Takes about 3 minutes from signup to live widget</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
