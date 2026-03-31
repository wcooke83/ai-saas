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
  title: 'How to Embed a Chatbot in Wix | VocUI',
  description:
    'Embed an AI chatbot on your Wix website in minutes. Use Wix\'s custom code feature to add a single script tag and start answering questions automatically.',
  openGraph: {
    title: 'How to Embed a Chatbot in Wix | VocUI',
    description:
      'Embed an AI chatbot on your Wix website in minutes. Use Wix\'s custom code feature to add a single script tag and start answering questions automatically.',
    url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wix',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Embed a Chatbot in Wix | VocUI',
    description:
      'Embed an AI chatbot on your Wix website in minutes. Use Wix\'s custom code feature to add a single script tag and start answering questions automatically.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-embed-chatbot-in-wix' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Embed a Chatbot in Wix',
      description:
        'Embed an AI chatbot on your Wix website in minutes. Use Wix\'s custom code feature to add a single script tag and start answering questions automatically.',
      url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wix',
      datePublished: '2025-03-31',
      dateModified: '2025-03-31',
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
          url: 'https://vocui.com/logo.png',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the difference between Wix Custom Code and the HTML Embed widget?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wix Custom Code (Settings > Custom Code) adds a script site-wide to every page at once and requires a Premium plan. The HTML Embed widget is a drag-and-drop element you add to individual pages in the editor and works on any Wix plan, including free. For a chatbot, Custom Code is better because you set it once for the entire site. The HTML Embed approach requires adding the widget to each page individually.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot work in Wix Studio (formerly Editor X)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Wix Studio supports custom code injection just like the classic Wix Editor. In Wix Studio, go to Settings > Custom Code > Add Custom Code. The interface looks slightly different, but the functionality is identical. Paste the same VocUI script tag and set placement to Body - end.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use Velo (Wix Code) to control when the chatbot loads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, if you want conditional loading. Instead of using site-wide Custom Code, you can use Velo to dynamically inject the script tag on specific pages or based on user actions. Add the script via $w("#html1").postMessage() in a Velo code file, or use the wix-window API to append the script element to the DOM. This is an advanced approach — the standard Custom Code method works for most sites without any Velo code.',
          },
        },
        {
          '@type': 'Question',
          name: 'I built my Wix site with ADI (Artificial Design Intelligence). Can I still add a chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Wix ADI sites support Custom Code injection the same way as Editor-built sites. Go to Settings > Custom Code, add the VocUI script, and publish. If you later switch from ADI to the Wix Editor for more control, your Custom Code settings carry over automatically.',
          },
        },
        {
          '@type': 'Question',
          name: 'The chatbot does not appear on my Wix mobile site. How do I fix this?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If you used the HTML Embed widget method, check that the embed element is also placed on the mobile version of your page. Wix maintains separate desktop and mobile layouts — elements added in the desktop editor do not always appear on mobile automatically. Switch to the mobile editor view and confirm the HTML embed widget is present. If you used the site-wide Custom Code method, the script loads on both desktop and mobile by default.',
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToEmbedChatbotInWixPage() {
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
                Wix Chatbot
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
                How to Embed a Chatbot in Wix
              </h1>
            </header>

            {/* Featured snippet */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-xl px-6 py-5 mb-10">
              <p className="text-secondary-800 dark:text-secondary-200 text-lg leading-relaxed">
                Adding an AI chatbot to your Wix site takes a single script tag and under five
                minutes. Use Wix&apos;s custom code feature to paste your VocUI embed code, publish
                your site, and your chatbot is live — answering visitor questions automatically
                from the content you&apos;ve trained it on.
              </p>
            </div>

            <div className="space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Add a Chatbot to Wix
                </h2>
                <p>
                  According to <a href="https://www.searchenginejournal.com/cms-market-share/454039/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Search Engine Journal</a>, Wix holds 3.7% of the CMS market and is the fastest-growing major CMS at 32.6% year-over-year growth. Wix powers millions of small business websites — from local service providers
                  to online stores and portfolio sites. These sites get traffic, but converting
                  that traffic into leads or sales depends on answering visitor questions quickly.
                  A contact form with a 24-hour response time doesn&apos;t cut it when your
                  competitor&apos;s site gives answers in seconds.
                </p>
                <p className="mt-4">
                  An AI chatbot bridges this gap. It sits on your Wix site and handles the
                  questions your visitors ask most: pricing inquiries, service details, business
                  hours, booking processes, and product information. The bot pulls answers from
                  your own content, so responses are accurate and specific to your business.
                </p>
                <p className="mt-4">
                  Wix does offer a built-in chat feature, but it requires you or your team to be
                  online to respond. An AI chatbot works around the clock. Visitors who land on
                  your site at 2 AM get the same quality answers as someone visiting during
                  business hours. No missed leads, no delayed responses, no extra staff.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Prerequisites
                </h2>
                <p>
                  Before you start, confirm that you have the following:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    <strong>A VocUI account with a chatbot ready.</strong> Create your chatbot,
                    add your knowledge sources (your site URL, FAQ pages, PDFs), and configure
                    the widget appearance. Follow our{' '}
                    <Link
                      href="/blog/how-to-add-chatbot-to-website"
                      className="text-primary-500 hover:text-primary-600 underline"
                    >
                      chatbot setup guide
                    </Link>{' '}
                    if you haven&apos;t done this yet.
                  </li>
                  <li>
                    <strong>Wix site editor access.</strong> You need to be the site owner or
                    have editor permissions. The custom code method works on both Wix Editor
                    (classic) and Wix Studio.
                  </li>
                  <li>
                    <strong>A Wix Premium plan (recommended).</strong> The site-wide custom code
                    injection feature requires a Premium plan. If you&apos;re on a free Wix plan,
                    you can use the HTML embed widget method described below instead.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step-by-Step: Using Wix Custom Code
                </h2>
                <p>
                  This is the recommended method if you have a Wix Premium plan. It adds the
                  chatbot to every page of your site at once.
                </p>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 1: Site-Wide Custom Code (Premium)
                </h3>
                <ol className="list-decimal list-inside space-y-3 mt-3 ml-4">
                  <li>
                    In your Wix dashboard, go to <strong>Settings</strong> in the left sidebar.
                  </li>
                  <li>
                    Click <strong>Custom Code</strong> (under the Advanced section).
                  </li>
                  <li>
                    Click <strong>Add Custom Code</strong> in the top right.
                  </li>
                  <li>
                    Paste your VocUI embed script into the code field.
                  </li>
                  <li>
                    Name it something like &quot;VocUI Chatbot&quot; for easy identification.
                  </li>
                  <li>
                    Set placement to <strong>Body - end</strong>. This ensures the script loads
                    after your page content, which is best for performance.
                  </li>
                  <li>
                    Under &quot;Add Code to Pages,&quot; select <strong>All pages</strong>.
                  </li>
                  <li>
                    Click <strong>Apply</strong>. Then publish your site.
                  </li>
                </ol>

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 2: HTML Embed Widget (Any Plan)
                </h3>
                <p className="mt-3">
                  If you&apos;re on a free Wix plan or want the chatbot on specific pages only,
                  use the HTML embed approach:
                </p>
                <ol className="list-decimal list-inside space-y-3 mt-3 ml-4">
                  <li>
                    Open your page in the Wix Editor.
                  </li>
                  <li>
                    Click the <strong>+</strong> (Add) button in the left panel.
                  </li>
                  <li>
                    Search for <strong>Embed Code</strong> or navigate to{' '}
                    <strong>Embed &gt; Custom Embeds &gt; Embed a Widget</strong>.
                  </li>
                  <li>
                    Drag the HTML element onto your page (position doesn&apos;t matter since the
                    chatbot uses fixed positioning).
                  </li>
                  <li>
                    Click <strong>Enter Code</strong> and paste your VocUI script tag.
                  </li>
                  <li>
                    Click <strong>Update</strong> and publish your site.
                  </li>
                </ol>
                <p className="mt-4">
                  Note: With Method 2, you&apos;ll need to add the embed widget to each page
                  where you want the chatbot. For a site-wide deployment, Method 1 is more
                  efficient.
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
                  <strong>Wix-specific tip:</strong> Wix maintains separate desktop and mobile
                  layouts. If you used the HTML Embed widget method (not site-wide Custom Code),
                  make sure the embed element is placed on both the desktop and mobile versions
                  of your pages. Switch to the mobile editor view in Wix to verify. With
                  site-wide Custom Code, both layouts are covered automatically.
                </p>
                <p className="mt-4">
                  To find your Wix site&apos;s brand color, open the Wix Editor, click{' '}
                  <strong>Design &gt; Color &amp; Text Themes</strong>, and note the hex values in
                  your active palette. Paste the accent color into VocUI&apos;s widget color
                  picker for a seamless match.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Wix-Specific Troubleshooting
                </h2>
                <p>
                  Most Wix embeds work after a single publish. When they don&apos;t, the cause
                  is almost always one of these Wix-specific issues:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4 ml-4">
                  <li>
                    <strong>Custom Code option missing from Settings.</strong> Site-wide Custom
                    Code requires a Wix Premium plan. Free Wix plans do not show this option. Use
                    the HTML Embed widget method (Method 2) instead, which works on all plans
                    including free.
                  </li>
                  <li>
                    <strong>Chatbot appears on desktop but not mobile.</strong> If you used the
                    HTML Embed widget, Wix manages desktop and mobile layouts separately. Switch
                    to the mobile editor view and confirm the embed element exists on the mobile
                    version of the page. With site-wide Custom Code, this is not an issue — the
                    script loads on both layouts automatically.
                  </li>
                  <li>
                    <strong>Changes not visible after publish.</strong> Wix caches published
                    pages at the CDN level. Hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) or open
                    your site in an incognito window. If the chatbot still does not appear, wait
                    2-3 minutes for Wix&apos;s CDN cache to propagate and try again.
                  </li>
                  <li>
                    <strong>Chatbot overlaps with Wix Chat bubble.</strong> Both widgets try to
                    claim the same bottom-right corner. Either disable Wix Chat (go to your Wix
                    dashboard &gt; <strong>Inbox &gt; Chat Settings</strong> &gt; toggle off) or
                    move the VocUI widget to bottom-left in the VocUI dashboard settings.
                  </li>
                  <li>
                    <strong>HTML Embed widget shows a blank box in the editor.</strong> This is
                    normal. The Wix editor sandboxes embed elements for security. The chatbot
                    will render correctly on your published live site. Always test on the
                    published URL, not the editor preview.
                  </li>
                  <li>
                    <strong>Wix Studio (Editor X) custom code location.</strong> In Wix Studio,
                    the Custom Code setting is in a different location than the classic Editor.
                    Go to <strong>Settings &gt; Custom Code</strong> from the Wix Studio
                    dashboard (not from within the design canvas). The functionality is
                    identical — paste the script, set placement to Body - end, and apply to All
                    pages.
                  </li>
                </ul>
                <p className="mt-4">
                  For other platforms, see our{' '}
                  <Link
                    href="/blog/how-to-embed-chatbot-in-shopify"
                    className="text-primary-500 hover:text-primary-600 underline"
                  >
                    Shopify embed guide
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
                      q: 'What is the difference between Wix Custom Code and the HTML Embed widget?',
                      a: 'Wix Custom Code (Settings > Custom Code) adds a script site-wide to every page at once and requires a Premium plan. The HTML Embed widget is a drag-and-drop element you add to individual pages in the editor and works on any Wix plan, including free. For a chatbot, Custom Code is better because you set it once for the entire site. The HTML Embed approach requires adding the widget to each page individually.',
                    },
                    {
                      q: 'Does the chatbot work in Wix Studio (formerly Editor X)?',
                      a: 'Yes. Wix Studio supports custom code injection just like the classic Wix Editor. In Wix Studio, go to Settings > Custom Code > Add Custom Code. The interface looks slightly different, but the functionality is identical. Paste the same VocUI script tag and set placement to Body - end.',
                    },
                    {
                      q: 'Can I use Velo (Wix Code) to control when the chatbot loads?',
                      a: 'Yes, if you want conditional loading. Instead of using site-wide Custom Code, you can use Velo to dynamically inject the script tag on specific pages or based on user actions. Add the script via $w("#html1").postMessage() in a Velo code file, or use the wix-window API to append the script element to the DOM. This is an advanced approach — the standard Custom Code method works for most sites without any Velo code.',
                    },
                    {
                      q: 'I built my Wix site with ADI. Can I still add a chatbot?',
                      a: 'Yes. Wix ADI sites support Custom Code injection the same way as Editor-built sites. Go to Settings > Custom Code, add the VocUI script, and publish. If you later switch from ADI to the Wix Editor for more control, your Custom Code settings carry over automatically.',
                    },
                    {
                      q: 'The chatbot does not appear on my Wix mobile site. How do I fix this?',
                      a: 'If you used the HTML Embed widget method, check that the embed element is also placed on the mobile version of your page. Wix maintains separate desktop and mobile layouts — elements added in the desktop editor do not always appear on mobile automatically. Switch to the mobile editor view and confirm the HTML embed widget is present. If you used the site-wide Custom Code method, the script loads on both desktop and mobile by default.',
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
            <h2 className="text-2xl font-bold mb-3">Your turn — build it in under 5 minutes</h2>
            <p className="text-white/80 mb-2">
              Follow the steps you just read, but with your own content. Upload your docs, customize the look, and go live.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Free plan included. No code, no developers, no waiting.
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
