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
  title: 'How to Embed a Chatbot in Squarespace | VocUI',
  description:
    'Add an AI chatbot to your Squarespace website using a simple code injection. No plugins needed — just paste one script and go live.',
  openGraph: {
    title: 'How to Embed a Chatbot in Squarespace | VocUI',
    description:
      'Add an AI chatbot to your Squarespace website using a simple code injection. No plugins needed — just paste one script and go live.',
    url: 'https://vocui.com/blog/how-to-embed-chatbot-in-squarespace',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Embed a Chatbot in Squarespace | VocUI',
    description:
      'Add an AI chatbot to your Squarespace website using a simple code injection. No plugins needed — just paste one script and go live.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-embed-chatbot-in-squarespace' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Embed a Chatbot in Squarespace',
      description:
        'Add an AI chatbot to your Squarespace website using a simple code injection. No plugins needed — just paste one script and go live.',
      url: 'https://vocui.com/blog/how-to-embed-chatbot-in-squarespace',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-embed-chatbot-in-squarespace',
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
          name: 'Which Squarespace plans support Code Injection?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Business, Basic Commerce, and Advanced Commerce plans include Code Injection. The Personal plan does not. If you are on a Personal plan, you will need to upgrade to at least Business to add the VocUI chatbot script via site-wide Code Injection. There is no workaround for adding custom scripts on the Personal plan.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Header and Footer Code Injection in Squarespace?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Header Code Injection loads scripts before the page content renders (inside the <head> tag). Footer Code Injection loads scripts after the page content (before the closing </body> tag). For chatbot scripts, Footer is the better choice — it ensures your page content loads first, and the chatbot appears once the page is ready. This avoids any perceived slowdown.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot work on Squarespace 7.0 and 7.1?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Code Injection is available on both Squarespace 7.0 and 7.1 (provided you are on a Business or Commerce plan). The location of the Code Injection setting is the same: Settings > Advanced > Code Injection. The chatbot renders as a fixed-position overlay, so it works identically regardless of which Squarespace version or template family you use.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I add the chatbot to specific Squarespace pages instead of site-wide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Edit the page where you want the chatbot, click the gear icon to open Page Settings, go to the Advanced tab, and paste the VocUI script in the Page Header Code Injection field. This is useful if you only want the chatbot on your contact page, booking page, or product pages. Note: per-page injection uses the Header field only (there is no per-page Footer field).',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot work with Squarespace Commerce product pages?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The chatbot appears on all pages including product detail pages, category pages, and the cart page. For Squarespace Commerce stores, train the bot on your product pages, shipping policy, and return policy so it can answer pre-purchase questions. This is especially effective for stores with complex product options or custom ordering processes.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToEmbedChatbotInSquarespacePage() {
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
                Squarespace Chatbot
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
                How to Embed a Chatbot in Squarespace
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Squarespace makes it easy to add an AI chatbot using its built-in Code Injection
                feature. Paste one script tag into your site-wide footer, and your chatbot goes
                live on every page — no extensions, no third-party apps, and no coding beyond a
                simple copy-paste.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Add a Chatbot to Squarespace
                </h2>
                <p>
                  Squarespace is a popular choice for small businesses, creatives, and service
                  providers who want a polished website without managing hosting or code. According to <a href="https://www.searchenginejournal.com/cms-market-share/454039/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Search Engine Journal</a>, Squarespace holds 2.3% of the overall CMS market with 9.7% year-over-year growth — a sign that more businesses are choosing the platform every year. But a
                  beautiful site only gets you so far. Visitors still have questions — about your
                  services, your pricing, your availability, your process — and if they can&apos;t
                  get answers quickly, they leave.
                </p>
                <p className="mt-4">
                  Contact forms create friction. Visitors have to write a message, wait for a
                  response, and often forget about your site by the time you reply. An AI chatbot
                  removes that delay entirely. It answers common questions in seconds, using the
                  content you&apos;ve trained it on — your service descriptions, FAQ page, pricing
                  information, or any other documentation you provide.
                </p>
                <p className="mt-4">
                  For Squarespace businesses specifically, a chatbot fills a gap the platform
                  doesn&apos;t solve natively. Squarespace doesn&apos;t have a robust built-in
                  chatbot feature, and most third-party integrations require complex workarounds.
                  VocUI works differently: one script tag, added through Code Injection, and your
                  chatbot is live across your entire site.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What You Need
                </h2>
                <p>
                  Before you start, make sure you have these ready:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    <strong>A Squarespace Business or Commerce plan.</strong> Code Injection is
                    not available on Personal plans. You need at least a Business plan to add
                    custom scripts to your site.
                  </li>
                  <li>
                    <strong>A VocUI account with a chatbot created.</strong> If you haven&apos;t
                    built one yet, follow our{' '}
                    <Link
                      href="/blog/how-to-add-chatbot-to-website"
                      className="text-primary-500 hover:text-primary-600 underline"
                    >
                      guide to adding a chatbot to your website
                    </Link>{' '}
                    — it walks through creating the chatbot, adding knowledge sources, and getting
                    your embed code.
                  </li>
                  <li>
                    <strong>Your embed code copied.</strong> Log in to your VocUI dashboard, open
                    your chatbot settings, and go to the Deploy tab. You&apos;ll see a script
                    snippet ready to copy.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step: Code Injection Method
                </h2>
                <p>
                  Squarespace&apos;s Code Injection feature is the cleanest way to add a chatbot.
                  It takes about two minutes from start to finish.
                </p>
                <ol className="list-decimal list-inside space-y-4 mt-4 ml-4">
                  <li>
                    <strong>Open your Squarespace dashboard.</strong> Go to your site and click
                    on <strong>Settings</strong> in the left sidebar.
                  </li>
                  <li>
                    <strong>Navigate to Code Injection.</strong> Under Settings, scroll down to
                    the <strong>Advanced</strong> section and click{' '}
                    <strong>Code Injection</strong>. This opens two text areas: Header and Footer.
                  </li>
                  <li>
                    <strong>Paste the embed code in the Footer field.</strong> Copy your VocUI
                    script tag and paste it into the <strong>Footer</strong> text area. Using the
                    footer ensures the script loads after your page content, which is better for
                    performance.
                  </li>
                  <li>
                    <strong>Click Save.</strong> That&apos;s it. Visit your live site and you
                    should see the chat widget in the bottom corner of the page.
                  </li>
                </ol>
                <p className="mt-4">
                  The chatbot will now appear on every page of your Squarespace site. If you
                  want it on specific pages only, use the per-page Code Injection option instead:
                  edit a page, click the gear icon, go to <strong>Advanced</strong>, and paste the
                  script in the <strong>Page Header Code Injection</strong> field.
                </p>
              </section>

              {/* Section 4 */}
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
                  <strong>Squarespace-specific tip:</strong> To find your exact brand color, go
                  to <strong>Design &gt; Site Styles</strong> and look for your theme&apos;s
                  accent color hex value. On Squarespace 7.1, you can also check{' '}
                  <strong>Design &gt; Colors</strong> for palette swatches. Copy the hex code and
                  paste it into VocUI&apos;s widget color picker so the chat bubble matches your
                  site&apos;s buttons and links exactly.
                </p>
                <p className="mt-4">
                  Squarespace templates often place footer elements and cookie consent banners in
                  the bottom-left corner. If your template does this, keep the chatbot in the
                  default bottom-right position to avoid overlap.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Squarespace-Specific Troubleshooting
                </h2>
                <p>
                  Most Squarespace embeds work on the first paste. When something goes wrong,
                  it&apos;s usually one of these Squarespace-specific issues:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 ml-4">
                  <li>
                    <strong>Code Injection option missing.</strong> You are on a Personal plan.
                    Code Injection requires Business or Commerce. Check your plan
                    under <strong>Settings &gt; Billing &amp; Account</strong>. Upgrading to
                    Business unlocks Code Injection immediately — no need to rebuild your site.
                  </li>
                  <li>
                    <strong>Script saves but chatbot does not appear.</strong> Squarespace uses
                    Ajax page loading (also called &quot;page transitions&quot; or
                    &quot;smooth scrolling&quot;) on 7.1 sites. This means navigating between
                    pages does not trigger a full page reload, so scripts injected in the footer
                    may only execute on the first page load. The VocUI script handles this
                    automatically, but if you see issues, try disabling Ajax loading temporarily
                    to confirm: go to <strong>Design &gt; Site Styles &gt; Page Transitions</strong>{' '}
                    and set it to &quot;None.&quot;
                  </li>
                  <li>
                    <strong>Chatbot visible in preview but not on live site.</strong> Squarespace
                    caches published pages. Open your live URL in an incognito window or
                    hard-refresh (Ctrl+Shift+R / Cmd+Shift+R). If you recently published, wait
                    60 seconds for the CDN cache to clear.
                  </li>
                  <li>
                    <strong>Code Injection stripping script attributes.</strong> Squarespace&apos;s
                    Code Injection editor occasionally strips non-standard HTML attributes. If the
                    script tag does not save correctly, try pasting the code as a single line with
                    no line breaks. Ensure you are pasting the exact snippet from VocUI with no
                    extra whitespace or formatting.
                  </li>
                  <li>
                    <strong>Squarespace 7.0 vs 7.1 template differences.</strong> Code Injection
                    works identically on both versions. However, 7.0 templates use a different
                    style editor (Template &gt; Style Editor) while 7.1 uses Design &gt; Site
                    Styles. The chatbot renders as a fixed-position overlay, so it works the same
                    regardless of template family — Brine, Bedford, York, or any 7.1 section-based
                    template.
                  </li>
                  <li>
                    <strong>Member area pages.</strong> If your Squarespace site uses Member Areas
                    (gated content), the site-wide Code Injection script still loads on those
                    pages. The chatbot will be visible to logged-in members. If you do not want
                    the chatbot on member pages, use per-page Code Injection on only the public
                    pages where you want it.
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
                    href="/blog/how-to-embed-chatbot-in-wix"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    Wix embed guide
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
                      q: 'Which Squarespace plans support Code Injection?',
                      a: 'Business, Basic Commerce, and Advanced Commerce plans include Code Injection. The Personal plan does not. If you are on a Personal plan, you will need to upgrade to at least Business to add the VocUI chatbot script via site-wide Code Injection. There is no workaround for adding custom scripts on the Personal plan.',
                    },
                    {
                      q: 'What is the difference between Header and Footer Code Injection in Squarespace?',
                      a: 'Header Code Injection loads scripts before the page content renders (inside the <head> tag). Footer Code Injection loads scripts after the page content (before the closing </body> tag). For chatbot scripts, Footer is the better choice — it ensures your page content loads first, and the chatbot appears once the page is ready. This avoids any perceived slowdown.',
                    },
                    {
                      q: 'Does the chatbot work on Squarespace 7.0 and 7.1?',
                      a: 'Yes. Code Injection is available on both Squarespace 7.0 and 7.1 (provided you are on a Business or Commerce plan). The location of the Code Injection setting is the same: Settings > Advanced > Code Injection. The chatbot renders as a fixed-position overlay, so it works identically regardless of which Squarespace version or template family you use.',
                    },
                    {
                      q: 'Can I add the chatbot to specific Squarespace pages instead of site-wide?',
                      a: 'Yes. Edit the page where you want the chatbot, click the gear icon to open Page Settings, go to the Advanced tab, and paste the VocUI script in the Page Header Code Injection field. This is useful if you only want the chatbot on your contact page, booking page, or product pages. Note: per-page injection uses the Header field only (there is no per-page Footer field).',
                    },
                    {
                      q: 'Does the chatbot work with Squarespace Commerce product pages?',
                      a: 'Yes. The chatbot appears on all pages including product detail pages, category pages, and the cart page. For Squarespace Commerce stores, train the bot on your product pages, shipping policy, and return policy so it can answer pre-purchase questions. This is especially effective for stores with complex product options or custom ordering processes.',
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
