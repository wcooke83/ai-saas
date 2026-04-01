import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { EmbedCodeVisual } from '@/components/blog/process-visuals';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Embed a Chatbot in WordPress | VocUI',
  description:
    'Add an AI chatbot to your WordPress site in under 5 minutes. Copy one script tag, paste it into your theme, and start answering visitor questions automatically.',
  openGraph: {
    title: 'How to Embed a Chatbot in WordPress | VocUI',
    description:
      'Add an AI chatbot to your WordPress site in under 5 minutes. Copy one script tag, paste it into your theme, and start answering visitor questions automatically.',
    url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Embed a Chatbot in WordPress | VocUI',
    description:
      'Add an AI chatbot to your WordPress site in under 5 minutes. Copy one script tag, paste it into your theme, and start answering visitor questions automatically.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Embed a Chatbot in WordPress',
      description:
        'Add an AI chatbot to your WordPress site in under 5 minutes. Copy one script tag, paste it into your theme, and start answering visitor questions automatically.',
      url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress',
      },
      datePublished: '2026-01-06',
      dateModified: '2026-01-06',
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
        url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Script tag vs. plugin: which approach is better for WordPress chatbots?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A script tag is lighter and more reliable. WordPress plugins add database queries, admin menu entries, and update checks that consume server resources. A single script tag loads from an external CDN, requires zero server-side processing, and cannot conflict with other plugins. The only advantage of a plugin is if you need WordPress-specific hooks like conditional loading based on user roles — which VocUI handles via its own dashboard settings instead.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot work with page builders like Elementor or Divi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Since the script tag is placed in your theme header or footer (not inside the page builder content area), it loads independently of Elementor, Divi, Beaver Builder, WPBakery, Bricks, or any other builder. The chatbot renders as a fixed-position overlay, so it never interferes with your builder layout or drag-and-drop editing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the chatbot compatible with WooCommerce?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The chatbot runs on product pages, cart, checkout, and account pages. WooCommerce store owners commonly train the bot on product catalogs, shipping rate tables, and return policies. For variable products, add your product pages as knowledge sources so the bot can answer questions about specific sizes, colors, and variants.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does this work on WordPress Multisite installations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Add the script tag to the parent theme or a must-use plugin (mu-plugin) to deploy the chatbot network-wide. If different subsites need different chatbots, use separate embed codes with different chatbot IDs and add them per-site via each site theme or a header/footer plugin on each subsite.',
          },
        },
        {
          '@type': 'Question',
          name: 'My caching plugin is serving the old page without the chatbot. How do I fix this?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Purge your full page cache after adding the script. In WP Rocket, go to WP Rocket > Dashboard > Clear Cache. In W3 Total Cache, click Performance > Dashboard > Empty All Caches. In LiteSpeed Cache, go to LiteSpeed Cache > Toolbox > Purge All. If you use Cloudflare, also purge the Cloudflare cache from your Cloudflare dashboard or the Cloudflare WordPress plugin.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToEmbedChatbotInWordpressPage() {
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
                WordPress Chatbot
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2026-01-06" className="text-xs text-secondary-400 dark:text-secondary-500">Jan 6, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">
                  6 min read
                </span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Embed a Chatbot in WordPress
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Adding a chatbot to WordPress takes one script tag and under five minutes. No
                plugins to install, no PHP to edit, no conflicts to debug. Copy the embed code
                from your VocUI dashboard, paste it into your WordPress theme, and your AI
                chatbot is live on every page.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Add a Chatbot to WordPress
                </h2>
                <p>
                  According to <a href="https://wordpress.com/blog/2025/04/17/wordpress-market-share/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">WordPress.com</a>, WordPress powers 43.4% of all websites — from small business sites to major
                  ecommerce stores. But most WordPress sites still rely on static FAQ pages,
                  contact forms, or third-party live chat tools that require someone to be online
                  to respond.
                </p>
                <p className="mt-4">
                  An AI chatbot changes this. It answers visitor questions instantly, 24/7, using
                  the content you&apos;ve trained it on — your product pages, help articles,
                  return policies, or any other documentation. Visitors get immediate answers
                  instead of waiting for an email response. You get fewer support tickets and
                  higher conversion rates.
                </p>
                <p className="mt-4">
                  Unlike traditional WordPress chat plugins that require monthly subscriptions
                  and live agents, an AI chatbot works autonomously. Train it once, deploy it,
                  and it handles the repetitive questions that consume most of your support time.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Prerequisites
                </h2>
                <p>
                  Before you start, make sure you have these two things ready:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li>
                    <strong>A VocUI account with a chatbot created.</strong> If you haven&apos;t
                    built your chatbot yet, follow our{' '}
                    <Link
                      href="/blog/how-to-add-chatbot-to-website"
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      guide to adding a chatbot to your website
                    </Link>{' '}
                    — it covers creating the chatbot, adding knowledge sources, and configuring the
                    widget.
                  </li>
                  <li>
                    <strong>WordPress admin access.</strong> You&apos;ll need to be able to edit
                    your theme&apos;s header or footer. If you&apos;re using a managed WordPress
                    host, make sure you have access to Appearance &gt; Theme Editor or a header/footer
                    injection tool.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step: Embedding the Widget
                </h2>
                <p>
                  There are three methods to add the VocUI script to WordPress. Choose the one
                  that fits your setup.
                </p>

                <EmbedCodeVisual caption="Copy from VocUI Dashboard, paste into WordPress" />

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 1: Using a Header/Footer Plugin (Easiest)
                </h3>
                <ol className="list-decimal pl-5 space-y-3 mt-3">
                  <li>
                    Install the free &quot;WPCode&quot; plugin (formerly Insert Headers and
                    Footers) from the WordPress plugin directory.
                  </li>
                  <li>
                    Go to <strong>Code Snippets &gt; Header &amp; Footer</strong> in your WordPress
                    admin.
                  </li>
                  <li>
                    Paste your VocUI embed code into the <strong>Footer</strong> section.
                  </li>
                  <li>Click Save. The chatbot will appear on your site immediately.</li>
                </ol>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 2: Editing Your Theme (No Plugin Required)
                </h3>
                <ol className="list-decimal pl-5 space-y-3 mt-3">
                  <li>
                    In your WordPress admin, go to <strong>Appearance &gt; Theme File Editor</strong>.
                  </li>
                  <li>
                    Open the <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">footer.php</code> file
                    (or <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">header.php</code> if
                    you prefer). See the{' '}
                    <a href="https://wordpress.org/documentation/article/custom-html/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">WordPress Custom HTML documentation</a>{' '}
                    for details on editing theme files.
                  </li>
                  <li>
                    Paste the VocUI embed code just before the
                    closing <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">&lt;/body&gt;</code> tag.
                  </li>
                  <li>Click Update File.</li>
                </ol>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 3: Using Your Theme&apos;s Built-in Options
                </h3>
                <p className="mt-3">
                  Many premium WordPress themes (Astra, GeneratePress, Kadence, etc.) include a
                  custom code injection area in the theme settings.
                  WordPress.com users can also add code via their{' '}
                  <a href="https://wordpress.com/support/code/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">built-in code injection feature</a>. Look for
                  &quot;Custom JavaScript&quot; or &quot;Footer Scripts&quot; in your theme&apos;s
                  options panel and paste the embed code there.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Widget Customization
                </h2>
                <p>
                  Customize colors, position, welcome message, and avatar from the VocUI
                  dashboard — no theme file edits required. For the full list of widget
                  options, see our{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    full chatbot setup guide
                  </Link>
                  .
                </p>
                <p className="mt-4">
                  <strong>WordPress-specific tip:</strong> If your theme uses a sticky header or
                  floating menu bar, check that the chat bubble does not overlap with it on
                  mobile. You can adjust the widget&apos;s vertical offset in VocUI settings, or
                  add a small CSS rule in <strong>Appearance &gt; Customize &gt; Additional CSS</strong> to
                  nudge the bubble up — for example:{' '}
                  <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                    .vocui-widget {'{'} bottom: 80px !important; {'}'}
                  </code>
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  WordPress-Specific Troubleshooting
                </h2>
                <p>
                  Most WordPress embeds work on the first try. When they don&apos;t, the cause
                  is almost always one of these WordPress-specific issues:
                </p>
                <ul className="list-disc pl-5 space-y-3 mt-4">
                  <li>
                    <strong>Caching plugin serving stale pages.</strong> This is the number one
                    issue on WordPress. After adding the script, purge your cache: WP Rocket
                    (Settings &gt; WP Rocket &gt; Clear Cache), W3 Total Cache (Performance &gt;
                    Dashboard &gt; Empty All Caches), LiteSpeed Cache (LiteSpeed Cache &gt;
                    Toolbox &gt; Purge All), WP Super Cache (Settings &gt; WP Super Cache &gt;
                    Delete Cache). If you use a CDN like Cloudflare or Sucuri, purge that cache
                    too.
                  </li>
                  <li>
                    <strong>Theme conflict blocking external scripts.</strong> Some security-hardened
                    themes block inline scripts or third-party JavaScript. Check your browser&apos;s
                    developer console (F12 &gt; Console tab) for errors mentioning
                    &quot;Content-Security-Policy&quot; or &quot;refused to load script.&quot; Fix
                    this by adding{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      vocui.com
                    </code>{' '}
                    to your CSP whitelist, typically in your security plugin (Wordfence, Sucuri,
                    iThemes Security) or your hosting panel&apos;s HTTP headers configuration.
                  </li>
                  <li>
                    <strong>Child theme overriding footer.php.</strong> If you edited the parent
                    theme&apos;s footer.php but your site uses a child theme, the child theme&apos;s
                    footer.php takes precedence. Edit the child theme&apos;s file instead, or use
                    a header/footer plugin (WPCode) which injects code regardless of theme hierarchy.
                  </li>
                  <li>
                    <strong>Chatbot appears on homepage only.</strong> You likely added the script
                    to a page-specific template (like{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      front-page.php
                    </code>
                    ) instead of the global{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      footer.php
                    </code>
                    . Move the script to footer.php, or use WPCode&apos;s site-wide footer injection.
                  </li>
                  <li>
                    <strong>Optimization plugins deferring the script incorrectly.</strong> Plugins
                    like Autoptimize, WP Rocket&apos;s JS delay, or Perfmatters may try to defer,
                    combine, or minify the VocUI script. Exclude{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                      vocui.com/widget.js
                    </code>{' '}
                    from JavaScript optimization in your performance plugin&apos;s settings. The
                    script already loads asynchronously, so additional deferral can break it.
                  </li>
                </ul>
                <p className="mt-4">
                  For other platforms, see our{' '}
                  <Link
                    href="/blog/how-to-embed-chatbot-in-shopify"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Shopify embed guide
                  </Link>
                  ,{' '}
                  <Link
                    href="/blog/how-to-embed-chatbot-in-squarespace"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Squarespace embed guide
                  </Link>
                  , or the general{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
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
                      q: 'Script tag vs. plugin: which approach is better for WordPress chatbots?',
                      a: 'A script tag is lighter and more reliable. WordPress plugins add database queries, admin menu entries, and update checks that consume server resources. A single script tag loads from an external CDN, requires zero server-side processing, and cannot conflict with other plugins. The only advantage of a plugin is if you need WordPress-specific hooks like conditional loading based on user roles — which VocUI handles via its own dashboard settings instead.',
                    },
                    {
                      q: 'Does the chatbot work with page builders like Elementor or Divi?',
                      a: 'Yes. Since the script tag is placed in your theme header or footer (not inside the page builder content area), it loads independently of Elementor, Divi, Beaver Builder, WPBakery, Bricks, or any other builder. The chatbot renders as a fixed-position overlay, so it never interferes with your builder layout or drag-and-drop editing.',
                    },
                    {
                      q: 'Is the chatbot compatible with WooCommerce?',
                      a: 'Yes. The chatbot runs on product pages, cart, checkout, and account pages. WooCommerce store owners commonly train the bot on product catalogs, shipping rate tables, and return policies. For variable products, add your product pages as knowledge sources so the bot can answer questions about specific sizes, colors, and variants.',
                    },
                    {
                      q: 'Does this work on WordPress Multisite installations?',
                      a: 'Yes. Add the script tag to the parent theme or a must-use plugin (mu-plugin) to deploy the chatbot network-wide. If different subsites need different chatbots, use separate embed codes with different chatbot IDs and add them per-site via each site theme or a header/footer plugin on each subsite.',
                    },
                    {
                      q: 'My caching plugin is serving the old page without the chatbot. How do I fix this?',
                      a: 'Purge your full page cache after adding the script. In WP Rocket, go to WP Rocket > Dashboard > Clear Cache. In W3 Total Cache, click Performance > Dashboard > Empty All Caches. In LiteSpeed Cache, go to LiteSpeed Cache > Toolbox > Purge All. If you use Cloudflare, also purge the Cloudflare cache from your Cloudflare dashboard or the Cloudflare WordPress plugin.',
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
