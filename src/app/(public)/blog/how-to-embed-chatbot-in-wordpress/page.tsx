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
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Embed a Chatbot in WordPress',
          item: 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress',
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
              {/* Section 1 — Method comparison overview */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Three Ways to Add a Chatbot to WordPress
                </h2>
                <p>
                  WordPress gives you more control over how you embed third-party scripts than
                  any other CMS. You can use a lightweight plugin like WPCode to inject the code
                  without touching theme files, edit your theme&apos;s <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">footer.php</code> directly
                  for a zero-plugin approach, or use your theme&apos;s built-in custom code
                  panel if it has one. Pick the method that matches your comfort level — all
                  three produce the same result.
                </p>
              </section>

              {/* Section 2 — Why, WordPress-specific */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why WordPress Sites Benefit Most From an AI Chatbot
                </h2>
                <p>
                  The typical WordPress site accumulates plugins for every visitor interaction:
                  a contact form plugin, a live chat plugin, an FAQ accordion plugin, maybe a
                  helpdesk or ticketing plugin on top of that. Each one adds database queries,
                  admin pages, and update cycles. A single AI chatbot widget can replace several
                  of these — it answers questions from your own content, captures leads, and
                  works 24/7 without any of the server-side overhead.
                </p>
                <p className="mt-4">
                  Most WordPress sites run on shared hosting where every PHP process counts. The
                  VocUI embed is a single external script tag — no PHP execution, no database
                  load, no plugin conflicts. It loads asynchronously from a CDN, so your server
                  does zero extra work regardless of how many visitors interact with the chatbot.
                </p>
                <p className="mt-4">
                  WordPress&apos;s flexibility also means every site is different: block themes,
                  classic themes, page builders, caching layers, security plugins. The embed
                  approach works across all of them because it operates outside your WordPress
                  stack entirely — it is just a script tag that renders a fixed-position overlay,
                  independent of your theme, your builder, or your hosting environment.
                </p>
              </section>

              {/* Section 3 — Prerequisites */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Prerequisites
                </h2>
                <p>
                  Three things to confirm before you start:
                </p>
                <StyledBulletList items={[
                  { title: 'WordPress admin access (wp-admin).', description: 'You need access to install plugins or edit theme files. On managed hosts like WP Engine, Kinsta, or Flywheel, confirm you can reach Appearance > Theme File Editor or install plugins from the directory.' },
                  { title: 'WordPress 5.0 or newer.', description: 'The block editor shipped in 5.0 and most modern themes and plugins target it. Classic editor setups work fine too \u2014 the embed method is the same either way.' },
                  { title: 'A VocUI chatbot ready to deploy.', description: <>If you haven&apos;t created your chatbot yet, <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">follow our setup guide</Link> to create one, add your knowledge sources, and grab the embed code from the Deploy tab.</> },
                ]} />
              </section>

              {/* Section 4 — Step-by-step */}
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
                <StyledNumberedList items={[
                  'Install the free \u201cWPCode\u201d plugin (formerly Insert Headers and Footers) from the WordPress plugin directory.',
                  <>Go to <strong>Code Snippets &gt; Header &amp; Footer</strong> in your WordPress admin.</>,
                  <>Paste your VocUI embed code into the <strong>Footer</strong> section.</>,
                  'Click Save. The chatbot will appear on your site immediately.',
                ]} />

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 2: Editing Your Theme (No Plugin Required)
                </h3>
                <StyledNumberedList items={[
                  <>In your WordPress admin, go to <strong>Appearance &gt; Theme File Editor</strong>.</>,
                  <>Open the <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">footer.php</code> file (or <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">header.php</code> if you prefer). See the <a href="https://wordpress.org/documentation/article/custom-html/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">WordPress Custom HTML documentation</a> for details on editing theme files.</>,
                  <>Paste the VocUI embed code just before the closing <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">&lt;/body&gt;</code> tag.</>,
                  'Click Update File.',
                ]} />

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

              {/* Section 5 — Widget Customization */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Widget Customization
                </h2>
                <p>
                  The VocUI dashboard handles colors, position, welcome message, and avatar.
                  But WordPress gives you an extra layer of control: you can add custom CSS
                  rules via <strong>Appearance &gt; Customize &gt; Additional CSS</strong> (or
                  your theme&apos;s custom CSS panel, if it has one) to fine-tune the widget&apos;s
                  appearance beyond what the dashboard offers.
                </p>
                <p className="mt-4">
                  <strong>Sticky header tip:</strong> If your theme uses a sticky header or
                  floating menu bar, the chat bubble may overlap with it on mobile. Adjust
                  the widget&apos;s vertical offset in VocUI settings, or add a CSS rule in
                  Additional CSS to nudge it — for example:{' '}
                  <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">
                    .vocui-widget {'{'} bottom: 80px !important; {'}'}
                  </code>
                </p>
              </section>

              {/* Section 6 — Troubleshooting */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  WordPress-Specific Troubleshooting
                </h2>
                <p>
                  Most WordPress embeds work on the first try. When they don&apos;t, the cause
                  is almost always one of these WordPress-specific issues:
                </p>
                <StyledBulletList items={[
                  { title: 'Caching plugin serving stale pages.', description: 'This is the number one issue on WordPress. After adding the script, purge your cache: WP Rocket (Settings > WP Rocket > Clear Cache), W3 Total Cache (Performance > Dashboard > Empty All Caches), LiteSpeed Cache (LiteSpeed Cache > Toolbox > Purge All), WP Super Cache (Settings > WP Super Cache > Delete Cache). If you use a CDN like Cloudflare or Sucuri, purge that cache too.' },
                  { title: 'Theme conflict blocking external scripts.', description: <>Some security-hardened themes block inline scripts or third-party JavaScript. Check your browser&apos;s developer console (F12 &gt; Console tab) for errors mentioning &quot;Content-Security-Policy&quot; or &quot;refused to load script.&quot; Fix this by adding <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">vocui.com</code> to your CSP whitelist, typically in your security plugin (Wordfence, Sucuri, iThemes Security) or your hosting panel&apos;s HTTP headers configuration.</> },
                  { title: 'Child theme overriding footer.php.', description: 'If you edited the parent theme\u2019s footer.php but your site uses a child theme, the child theme\u2019s footer.php takes precedence. Edit the child theme\u2019s file instead, or use a header/footer plugin (WPCode) which injects code regardless of theme hierarchy.' },
                  { title: 'Chatbot appears on homepage only.', description: <>You likely added the script to a page-specific template (like <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">front-page.php</code>) instead of the global <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">footer.php</code>. Move the script to footer.php, or use WPCode&apos;s site-wide footer injection.</> },
                  { title: 'Optimization plugins deferring the script incorrectly.', description: <>Plugins like Autoptimize, WP Rocket&apos;s JS delay, or Perfmatters may try to defer, combine, or minify the VocUI script. Exclude <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm">vocui.com/widget.js</code> from JavaScript optimization in your performance plugin&apos;s settings. The script already loads asynchronously, so additional deferral can break it.</> },
                ]} />
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
            <h2 className="text-2xl font-bold mb-3">Add an AI chatbot to your WordPress site</h2>
            <p className="text-white/80 mb-2">
              Create your chatbot, copy one script tag, and paste it into WordPress. Works
              with Elementor, Divi, Beaver Builder, WPBakery, Bricks, GeneratePress,
              Kadence, and the block editor.
            </p>
            <p className="text-white/60 text-sm mb-8">
              No plugins required — though WPCode works too if you prefer it.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Build your WordPress chatbot
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
