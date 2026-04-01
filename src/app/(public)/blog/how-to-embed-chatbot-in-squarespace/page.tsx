import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { StyledNumberedList, StyledBulletList } from '@/components/blog/styled-lists';
import { VOCUI_AUTHOR } from '@/lib/seo/jsonld-utils';

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
      datePublished: '2026-02-23',
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
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Embed a Chatbot in Squarespace',
          item: 'https://vocui.com/blog/how-to-embed-chatbot-in-squarespace',
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
                <time dateTime="2026-02-23" className="text-xs text-secondary-400 dark:text-secondary-500">Feb 23, 2026</time>
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
              {/* Plan requirement gate */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-xl px-6 py-5">
                <p className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                  Before you start: check your Squarespace plan
                </p>
                <p>
                  Code Injection requires a Squarespace <strong>Business</strong> or{' '}
                  <strong>Commerce</strong> plan. If you&apos;re on the Personal plan, you&apos;ll
                  need to upgrade before adding any custom code. You can check your current plan
                  under <strong>Settings &gt; Billing &amp; Account</strong>. Upgrading unlocks
                  Code Injection immediately — no need to rebuild your site.
                </p>
              </div>

              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Add a Chatbot to Your Squarespace Site
                </h2>
                <p>
                  Squarespace is the platform of choice for photographers, designers, consultants,
                  and service-based businesses — people who care about presentation and rely on
                  their website to book clients. These sites attract visitors who have specific
                  questions before they commit: &quot;What are your rates?&quot;, &quot;Are you
                  available on the 15th?&quot;, &quot;What does your process look like?&quot; A
                  chatbot trained on your services page and FAQ handles these conversations
                  automatically, even when you&apos;re on a shoot or in a meeting.
                </p>
                <p className="mt-4">
                  Unlike WordPress (which has thousands of chat plugins) or Shopify (which offers
                  Shopify Inbox), Squarespace has no native chatbot feature at all. There is no
                  first-party chat app and no marketplace of chat integrations. The only path is
                  embedding a third-party widget through Code Injection — which is exactly what
                  this guide covers.
                </p>
                <p className="mt-4">
                  If you&apos;ve spent hours getting your Squarespace template just right, you
                  probably care about how a chat widget looks on your site. VocUI&apos;s widget is
                  fully customizable — colors, position, welcome message, avatar — so it blends
                  with your template instead of clashing with it.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Prerequisites
                </h2>
                <p>
                  Confirm these before opening your Squarespace dashboard:
                </p>
                <StyledBulletList items={[
                  { title: 'A Business or Commerce plan.', description: <>This is the hard requirement. Code Injection is locked on the Personal plan — there is no workaround. Check your plan under <strong>Settings &gt; Billing &amp; Account</strong>.</> },
                  { title: 'Access to Code Injection.', description: <>Navigate to <strong>Settings &gt; Advanced &gt; Code Injection</strong> and confirm you can see the Header and Footer text fields. If the Advanced section is missing, your plan does not include it.</> },
                  { title: 'A VocUI chatbot ready to deploy.', description: <>You need a chatbot with at least one knowledge source trained. If you haven&apos;t built yours yet, follow our <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">chatbot setup guide</Link> first — it covers creating the bot, adding content, and copying the embed snippet.</> },
                  { title: 'Note on Squarespace 7.0 vs 7.1.', description: 'Both versions support Code Injection in the same location (Settings > Advanced > Code Injection). The admin UI looks slightly different — 7.0 has a sidebar layout, 7.1 uses a card-based settings page — but the Code Injection fields are identical.' },
                ]} />
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
                <StyledNumberedList items={[
                  { title: 'Open your Squarespace dashboard.', description: <>Go to your site and click on <strong>Settings</strong> in the left sidebar.</> },
                  { title: 'Navigate to Code Injection.', description: <>Under Settings, scroll down to the <strong>Advanced</strong> section and click <strong>Code Injection</strong>. This opens two text areas: Header and Footer. For full details, see <a href="https://support.squarespace.com/hc/en-us/articles/205815908-Using-code-injection" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Squarespace&apos;s Code Injection guide</a>.</> },
                  { title: 'Paste the embed code in the Footer field.', description: <>Copy your VocUI script tag and paste it into the <strong>Footer</strong> text area. Using the footer ensures the script loads after your page content, which is better for performance.</> },
                  { title: 'Click Save.', description: 'That\u2019s it. Visit your live site and you should see the chat widget in the bottom corner of the page.' },
                ]} />
                <p className="mt-4">
                  The chatbot will now appear on every page of your Squarespace site. If you
                  want it on specific pages only, use the per-page Code Injection option instead:
                  edit a page, click the gear icon, go to <strong>Advanced</strong>, and paste the
                  script in the <strong>Page Header Code Injection</strong> field. Squarespace&apos;s{' '}
                  <a href="https://support.squarespace.com/hc/en-us/articles/205815928-Adding-custom-code-to-your-site" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">custom code documentation</a>{' '}
                  covers both site-wide and per-page options.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Matching the Widget to Your Squarespace Design
                </h2>
                <p>
                  Squarespace users invest serious effort into visual design — a chat widget
                  that clashes with your template undermines that work. Start by pulling your
                  exact brand colors from Squarespace: go to{' '}
                  <strong>Design &gt; Site Styles</strong> (7.1) or{' '}
                  <strong>Template &gt; Style Editor</strong> (7.0) and note your accent color
                  hex value. On 7.1 you can also check <strong>Design &gt; Colors</strong> for
                  your full palette. Copy that hex code into VocUI&apos;s widget color picker so
                  the chat bubble matches your site&apos;s buttons and links.
                </p>
                <p className="mt-4">
                  Squarespace templates frequently place footer elements and the built-in cookie
                  consent banner in the bottom-left corner of the screen. If your template does
                  this, keep the chatbot in VocUI&apos;s default bottom-right position to avoid
                  overlap. You can adjust the exact offset in the VocUI dashboard under widget
                  settings if you need fine-grained control.
                </p>
                <p className="mt-4">
                  All widget customization — colors, position, welcome message, avatar, and
                  display rules — is managed from the{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    VocUI dashboard
                  </Link>
                  . No code changes needed in Squarespace after the initial embed.
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
                <StyledBulletList items={[
                  { title: 'Code Injection option missing.', description: <>You are on a Personal plan. Code Injection requires Business or Commerce. Check your plan under <strong>Settings &gt; Billing &amp; Account</strong>. Upgrading to Business unlocks Code Injection immediately \u2014 no need to rebuild your site.</> },
                  { title: 'Script saves but chatbot does not appear.', description: <>Squarespace uses Ajax page loading (also called &quot;page transitions&quot; or &quot;smooth scrolling&quot;) on 7.1 sites. This means navigating between pages does not trigger a full page reload, so scripts injected in the footer may only execute on the first page load. The VocUI script handles this automatically, but if you see issues, try disabling Ajax loading temporarily to confirm: go to <strong>Design &gt; Site Styles &gt; Page Transitions</strong> and set it to &quot;None.&quot;</> },
                  { title: 'Chatbot visible in preview but not on live site.', description: 'Squarespace caches published pages. Open your live URL in an incognito window or hard-refresh (Ctrl+Shift+R / Cmd+Shift+R). If you recently published, wait 60 seconds for the CDN cache to clear.' },
                  { title: 'Code Injection stripping script attributes.', description: 'Squarespace\u2019s Code Injection editor occasionally strips non-standard HTML attributes. If the script tag does not save correctly, try pasting the code as a single line with no line breaks. Ensure you are pasting the exact snippet from VocUI with no extra whitespace or formatting.' },
                  { title: 'Squarespace 7.0 vs 7.1 template differences.', description: 'Code Injection works identically on both versions. However, 7.0 templates use a different style editor (Template > Style Editor) while 7.1 uses Design > Site Styles. The chatbot renders as a fixed-position overlay, so it works the same regardless of template family \u2014 Brine, Bedford, York, or any 7.1 section-based template.' },
                  { title: 'Member area pages.', description: 'If your Squarespace site uses Member Areas (gated content), the site-wide Code Injection script still loads on those pages. The chatbot will be visible to logged-in members. If you do not want the chatbot on member pages, use per-page Code Injection on only the public pages where you want it.' },
                ]} />
                <p className="mt-4">
                  If none of these match your issue, our{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    general chatbot embed guide
                  </Link>
                  {' '}covers cross-platform debugging steps.
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
            <h2 className="text-2xl font-bold mb-3">Your Squarespace site, with instant answers</h2>
            <p className="text-white/80 mb-2">
              Build your chatbot, paste one snippet into Code Injection, and it goes live across every page.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Works with any Squarespace 7.0 or 7.1 template. No apps or extensions needed.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Build your chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">About 3 minutes from signup to live widget on your Squarespace site</p>
          </div>
        </div>
      </main>
      <Footer />
    </PageBackground>
  );
}
