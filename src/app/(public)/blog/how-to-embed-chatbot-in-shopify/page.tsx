import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { EmbedCodeVisual } from '@/components/blog/process-visuals';
import { StyledNumberedList, StyledBulletList } from '@/components/blog/styled-lists';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

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
      datePublished: '2026-02-20',
      dateModified: '2026-04-01',
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
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Embed a Chatbot in Shopify',
          item: 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify',
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
                <time dateTime="2026-02-20" className="text-xs text-secondary-400 dark:text-secondary-500">Feb 20, 2026</time>
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
              {/* Section 1: Embed Steps (lead with the action) */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step: Adding the Embed Code to Shopify
                </h2>
                <p>
                  Follow these steps to add the VocUI chatbot to your Shopify store. The entire
                  process takes about three minutes.
                </p>

                <EmbedCodeVisual caption="Copy from VocUI Dashboard, paste into theme.liquid" />
                <StyledNumberedList items={[
                  { title: 'Copy your embed code.', description: 'Log in to your VocUI dashboard, open your chatbot, and go to the Deploy tab. Copy the JavaScript embed snippet.' },
                  { title: 'Open your Shopify theme editor.', description: <>In your Shopify admin, go to <strong>Online Store &gt; Themes</strong>. Click the three-dot menu on your active theme and select <strong>Edit code</strong>. For advanced customization, Shopify&apos;s <a href="https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Theme App Extensions documentation</a> covers the full theme architecture.</> },
                  { title: 'Find the theme.liquid file.', description: <>In the Layout folder on the left sidebar, click on <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">theme.liquid</code>. This is the master template that wraps every page in your store. For more on how Shopify handles scripts, see the <a href="https://shopify.dev/docs/storefronts/themes/best-practices/javascript-and-stylesheet-tags" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Shopify JavaScript and Stylesheet Tags documentation</a>.</> },
                  { title: 'Paste the embed code.', description: <>Scroll to the bottom of the file and paste the VocUI script tag just before the closing <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">&lt;/body&gt;</code> tag. This ensures the chatbot loads on every page of your store.</> },
                  { title: 'Save.', description: 'Click Save in the top right corner. Visit your store and you should see the chat widget in the bottom corner.' },
                ]} />
                <p className="mt-4">
                  That&apos;s it. No app to install, no monthly app subscription, and no risk of
                  plugin conflicts. The script tag approach is the cleanest way to add third-party
                  tools to Shopify.
                </p>
              </section>

              {/* Section 2: Why — ecommerce-specific */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Shopify Stores Need a Chatbot
                </h2>
                <p>
                  Cart abandonment is the single biggest revenue leak in ecommerce. A shopper
                  hesitating on a product page — wondering about sizing, return windows, or
                  shipping speed — will close the tab if they cannot get an answer in seconds.
                  An AI chatbot trained on your product catalog and store policies answers those
                  questions at the exact moment of hesitation, keeping the shopper moving toward
                  checkout instead of bouncing.
                </p>
                <p className="mt-4">
                  Shopify includes Shopify Inbox for live chat, but it requires a human on the
                  other end. Outside business hours — evenings, weekends, holidays — messages go
                  unanswered. An AI chatbot fills that gap completely. It handles &quot;What
                  material is this made of?&quot; and &quot;Can I exchange for a different
                  size?&quot; at 2 AM the same way it does at 2 PM, with no staffing cost.
                </p>
                <p className="mt-4">
                  Product pages also have limited real estate. You cannot fit every detail about
                  shipping zones, care instructions, and compatibility into the description
                  without creating a wall of text that nobody reads. A chatbot lets shoppers ask
                  the specific question they have and get a direct answer — no scrolling, no
                  searching, no navigating to a separate FAQ page.
                </p>
              </section>

              {/* Section 3: Prerequisites — Shopify-specific */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What You Need Before Starting
                </h2>
                <StyledBulletList items={[
                  { title: 'Shopify admin access with theme editing permission.', description: <>You need the <strong>Owner</strong> role or a <strong>Staff</strong> account with &quot;Themes&quot; permission enabled. Check under <strong>Settings &gt; Users and permissions</strong> in your Shopify admin.</> },
                  { title: 'Know where theme.liquid lives.', description: <>Go to <strong>Online Store &gt; Themes &gt; Actions &gt; Edit code</strong>. In the Layout folder, you&apos;ll see <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">theme.liquid</code> — this is where your embed code goes.</> },
                  { title: 'A VocUI chatbot trained on your store content.', description: <>Create a chatbot in VocUI and add your store URL as a knowledge source so it can learn your products, shipping policy, and return policy. Our <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">chatbot setup guide</Link> walks through the full process.</> },
                ]} />
                <p className="mt-4">
                  This works on every Shopify plan — Basic, Shopify, Advanced, and Plus. The one
                  exception: embedding on checkout pages requires Shopify Plus, which gives access
                  to <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">checkout.liquid</code>. On
                  standard plans, the chatbot covers every other storefront page.
                </p>
              </section>

              {/* Section 4: Training */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Training the Chatbot on Your Store Content
                </h2>
                <p>
                  A chatbot is only as good as the content it&apos;s trained on. For a Shopify
                  store, you&apos;ll want to cover the topics shoppers ask about most:
                </p>
                <StyledBulletList items={[
                  { title: 'Product details.', description: 'Add your store\u2019s URL as a knowledge source and VocUI will crawl your product pages. The bot can then answer questions about sizing, materials, features, and availability.' },
                  { title: 'Shipping information.', description: 'Upload or link to your shipping policy page. Shoppers constantly ask about delivery times, shipping costs, and international availability.' },
                  { title: 'Return and refund policies.', description: 'These are among the most-asked questions in ecommerce. Make sure your bot can explain the process clearly.' },
                  { title: 'Store FAQ.', description: 'If you have an existing FAQ page, add it as a knowledge source. The bot will pull answers directly from your existing content.' },
                ]} />
                <p className="mt-4">
                  For more advanced training strategies, check out our guide on{' '}
                  <Link
                    href="/chatbot-for-ecommerce"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    chatbots for ecommerce
                  </Link>
                  .
                </p>
              </section>

              {/* Section 5: Widget Customization — Shopify-specific */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Matching the Widget to Your Shopify Theme
                </h2>
                <p>
                  Your chat widget should look like it belongs in your store, not like a
                  third-party add-on. Start by grabbing your theme&apos;s accent color: go to{' '}
                  <strong>Online Store &gt; Themes &gt; Customize</strong>, then open{' '}
                  <strong>Theme settings &gt; Colors</strong>. Copy the hex value for your primary
                  or accent color and paste it into the VocUI widget color picker in your{' '}
                  <Link
                    href="/login"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    dashboard
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  Widget position matters on ecommerce storefronts. Bottom-right is the standard
                  placement, but if your Shopify theme uses a cart drawer that slides in from the
                  right side of the screen (common in Dawn, Refresh, and many custom themes),
                  switch the widget to bottom-left to prevent the chat bubble from overlapping
                  the cart panel. You can change this in one click from the VocUI widget settings.
                </p>
                <p className="mt-4">
                  Welcome message, avatar, and all other appearance options are configured in
                  the VocUI dashboard under your chatbot&apos;s Deploy tab — no code changes
                  needed after the initial embed.
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
                <StyledBulletList items={[
                  { title: 'Script not loading on Online Store 2.0 themes.', description: <>Newer Shopify themes use sections and blocks architecture, but theme.liquid still exists and still wraps every page. If you cannot find theme.liquid, check under the <strong>Layout</strong> folder in the code editor, not Sections or Templates.</> },
                  { title: 'Liquid syntax error after pasting.', description: <>Make sure you paste the VocUI script tag as raw HTML, not inside a Liquid <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">{'{{'}...{'}}'}</code> or <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">{'{%'}...{'%}'}</code> block. The script tag should be plain HTML placed before the closing <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">&lt;/body&gt;</code> tag.</> },
                  { title: 'Chatbot not visible in theme preview.', description: 'Shopify\u2019s theme preview sometimes does not execute third-party scripts. Publish the theme and check your live storefront URL instead.' },
                  { title: 'Shopify speed report flags the script.', description: 'The Shopify speed report lists all third-party scripts. VocUI will appear in the list but will not reduce your score because it loads asynchronously and does not block rendering. You can safely ignore this line item.' },
                  { title: 'Password-protected storefront blocking the widget.', description: 'If your store is password-protected (common during development), the chatbot script still loads behind the password wall but is not visible to public visitors. Remove the password to test the live experience.' },
                ]} />
                <p className="mt-4">
                  If you also run a site on another platform, our{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    general embed guide
                  </Link>{' '}
                  covers the process for any website.
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
            <h2 className="text-2xl font-bold mb-3">Add AI to your Shopify store</h2>
            <p className="text-white/80 mb-2">
              Train a chatbot on your products and policies, then paste one script tag
              into theme.liquid — your store has 24/7 AI support.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Works with any Shopify theme — Dawn, Debut, custom builds. No app install required.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Build your store&apos;s chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">About 3 minutes from signup to live widget on your storefront</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
