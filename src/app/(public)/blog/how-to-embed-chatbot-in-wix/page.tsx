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
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-embed-chatbot-in-wix',
      },
      datePublished: '2026-02-25',
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
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vocui.com/blog' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Embed a Chatbot in Wix',
          item: 'https://vocui.com/blog/how-to-embed-chatbot-in-wix',
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
                <time dateTime="2026-02-25" className="text-xs text-secondary-400 dark:text-secondary-500">Feb 25, 2026</time>
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
              {/* Section 1 — Choose your embed method */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Two Embed Methods: Pick the One That Fits Your Wix Plan
                </h2>
                <p>
                  Wix gives you two ways to embed a chatbot, and which one you use depends on
                  your plan:
                </p>
                <StyledBulletList items={[
                  { title: 'Custom Code (Premium plans).', description: 'A site-wide setting under Settings > Custom Code. Paste the script once and it loads on every page automatically. This is the faster, set-and-forget option \u2014 but it requires a Wix Premium, Combo, or higher plan.' },
                  { title: 'HTML Embed widget (any plan, including free).', description: 'A drag-and-drop element you add to individual pages in the Wix Editor. No paid plan required. You\u2019ll need to add the widget to each page where you want the chatbot, but it works on every Wix plan \u2014 even free sites.' },
                ]} />
                <p className="mt-4">
                  Both methods use the same one-line script from your VocUI dashboard. The
                  difference is where you paste it. Read on to decide which fits your
                  situation, then skip to the matching step-by-step section.
                </p>
              </section>

              {/* Section 2 — Why, Wix-specific */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Why Wix Sites Need an AI Chatbot
                </h2>
                <p>
                  Wix has a built-in live chat feature called Wix Chat, but it is strictly
                  live-agent — someone on your team has to be on the other end typing responses
                  in real time. For the solo freelancer, local bakery, or two-person consulting
                  firm that makes up most of Wix&apos;s user base, that means chat goes dead the
                  moment you step away from your computer. Visitors see an empty chat window with
                  no one to answer, which is worse than having no chat at all. An AI chatbot
                  trained on your own content handles those conversations around the clock without
                  needing anyone online.
                </p>
                <p className="mt-4">
                  Cost matters too. Many Wix users run on free or low-tier plans because they are
                  bootstrapping a side project or testing a business idea. The HTML Embed widget
                  method works on any Wix plan, including free, so AI-powered support is
                  accessible even before you upgrade. You do not need to buy a Premium plan just
                  to add a chatbot.
                </p>
                <p className="mt-4">
                  Wix users are builders, not developers. The drag-and-drop editor is the whole
                  point. Both embed methods reflect that: Custom Code is a single paste into a
                  settings panel (no code files to find or edit), and the HTML Embed widget is a
                  visual element you drag onto the page like any other Wix block. Neither method
                  requires you to write, read, or debug code.
                </p>
              </section>

              {/* Section 3 — Prerequisites */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What You Need Before You Start
                </h2>
                <p>
                  Pick your method first, then confirm you have everything lined up:
                </p>
                <StyledBulletList items={[
                  { title: 'Decide: Custom Code or HTML Embed.', description: 'Custom Code is site-wide and requires a paid Wix plan. HTML Embed works per-page and works on any plan, including free. If you are not sure which plan you have, check Account > Subscriptions in your Wix dashboard.' },
                  { title: 'Wix dashboard access.', description: 'You need to be the site owner or a team member with editor permissions. Both Wix Editor (classic) and Wix Studio work.' },
                  { title: 'A VocUI chatbot ready to deploy.', description: <>Create your chatbot in VocUI, add your knowledge sources (your site URL, FAQ pages, PDFs), and grab the embed code from the Deploy tab. Our <Link href="/blog/how-to-add-chatbot-to-website" className="text-primary-600 dark:text-primary-400 hover:underline">chatbot setup guide</Link> walks through this step by step.</> },
                  { title: 'Premium, Combo, or higher (Custom Code only).', description: 'The Settings > Custom Code panel only appears on paid Wix plans. If you see the option, you\u2019re set. If not, use the HTML Embed widget method instead \u2014 no upgrade needed.' },
                ]} />
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
                <StyledNumberedList items={[
                  <>In your Wix dashboard, go to <strong>Settings</strong> in the left sidebar.</>,
                  <>Click <strong>Custom Code</strong> (under the Advanced section). See <a href="https://support.wix.com/en/article/wix-editor-embedding-custom-code-on-your-site" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Wix&apos;s custom code documentation</a> for the full walkthrough.</>,
                  <>Click <strong>Add Custom Code</strong> in the top right.</>,
                  'Paste your VocUI embed script into the code field.',
                  'Name it something like \u201cVocUI Chatbot\u201d for easy identification.',
                  <>Set placement to <strong>Body - end</strong>. This ensures the script loads after your page content, which is best for performance.</>,
                  <>Under \u201cAdd Code to Pages,\u201d select <strong>All pages</strong>.</>,
                  <>Click <strong>Apply</strong>. Then publish your site.</>,
                ]} />

                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mt-6 mb-3">
                  Method 2: HTML Embed Widget (Any Plan)
                </h3>
                <p className="mt-3">
                  If you&apos;re on a free Wix plan or want the chatbot on specific pages only,
                  use the HTML embed approach:
                </p>
                <StyledNumberedList items={[
                  'Open your page in the Wix Editor.',
                  <>Click the <strong>+</strong> (Add) button in the left panel.</>,
                  <>Search for <strong>Embed Code</strong> or navigate to <strong>Embed &gt; Custom Embeds &gt; Embed a Widget</strong>.</>,
                  'Drag the HTML element onto your page (position doesn\u2019t matter since the chatbot uses fixed positioning).',
                  <>Click <strong>Enter Code</strong> and paste your VocUI script tag.</>,
                  <>Click <strong>Update</strong> and publish your site.</>,
                ]} />
                <p className="mt-4">
                  Note: With Method 2, you&apos;ll need to add the embed widget to each page
                  where you want the chatbot. For a site-wide deployment, Method 1 is more
                  efficient.
                </p>
              </section>

              {/* Section 5 — Widget Customization */}
              <section>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Making the Widget Look Native to Your Wix Site
                </h2>
                <p>
                  Wix separates desktop and mobile into two independent layouts, which means your
                  chatbot widget may need attention in both views. If you used the HTML Embed
                  method, switch to the Wix Editor&apos;s mobile preview to confirm the embed
                  element is present on the mobile layout — elements added on desktop do not
                  always carry over. With site-wide Custom Code this is handled automatically.
                </p>
                <p className="mt-4">
                  To match the widget to your site&apos;s color palette, open the Wix Editor and
                  go to <strong>Design &gt; Color &amp; Text Themes</strong>. Copy the hex value
                  of your accent color and paste it into VocUI&apos;s widget color picker in
                  the dashboard. This keeps the chat bubble visually consistent with your buttons,
                  links, and headings.
                </p>
                <p className="mt-4">
                  If you used the HTML Embed method, think about which pages actually need the
                  chatbot. A pricing page, contact page, and product pages are high-value
                  placements where visitors are most likely to have questions. A portfolio gallery
                  or photo page may not need it. With Custom Code, the widget loads everywhere by
                  default — you can restrict it to specific pages from the VocUI dashboard
                  instead.
                </p>
                <p className="mt-4">
                  All other widget settings — position, welcome message, avatar, response tone —
                  are controlled from the{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    VocUI dashboard
                  </Link>
                  . No need to touch Wix again after the initial embed.
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
                <StyledBulletList items={[
                  { title: 'Custom Code option missing from Settings.', description: 'Site-wide Custom Code requires a Wix Premium plan. Free Wix plans do not show this option. Use the HTML Embed widget method (Method 2) instead, which works on all plans including free.' },
                  { title: 'Chatbot appears on desktop but not mobile.', description: 'If you used the HTML Embed widget, Wix manages desktop and mobile layouts separately. Switch to the mobile editor view and confirm the embed element exists on the mobile version of the page. With site-wide Custom Code, this is not an issue \u2014 the script loads on both layouts automatically.' },
                  { title: 'Changes not visible after publish.', description: 'Wix caches published pages at the CDN level. Hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) or open your site in an incognito window. If the chatbot still does not appear, wait 2-3 minutes for Wix\u2019s CDN cache to propagate and try again.' },
                  { title: 'Chatbot overlaps with Wix Chat bubble.', description: <>Both widgets try to claim the same bottom-right corner. Either disable Wix Chat (go to your Wix dashboard &gt; <strong>Inbox &gt; Chat Settings</strong> &gt; toggle off) or move the VocUI widget to bottom-left in the VocUI dashboard settings.</> },
                  { title: 'HTML Embed widget shows a blank box in the editor.', description: 'This is normal. The Wix editor sandboxes embed elements for security. The chatbot will render correctly on your published live site. Always test on the published URL, not the editor preview.' },
                  { title: 'Wix Studio (Editor X) custom code location.', description: <>In Wix Studio, the Custom Code setting is in a different location than the classic Editor. Go to <strong>Settings &gt; Custom Code</strong> from the Wix Studio dashboard (not from within the design canvas). The functionality is identical \u2014 paste the script, set placement to Body - end, and apply to All pages.</> },
                ]} />
                <p className="mt-4">
                  If none of the above resolves your issue, our{' '}
                  <Link
                    href="/blog/how-to-add-chatbot-to-website"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    general chatbot embed guide
                  </Link>
                  {' '}covers platform-independent debugging steps.
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
            <h2 className="text-2xl font-bold mb-3">Give your Wix site an AI assistant</h2>
            <p className="text-white/80 mb-2">
              Build your chatbot, grab the embed code, and paste it into Wix — Custom Code or
              HTML Embed, your choice.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Works on any Wix plan, including free. No app install needed.
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
