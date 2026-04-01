import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AuthorByline } from '@/components/blog/author-byline';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { MidArticleCta } from '@/components/blog/mid-article-cta';
import { StepFlow, KnowledgeSourceCards, EmbedCodeVisual } from '@/components/blog/process-visuals';
import { TimelineInfographic } from '@/components/blog/infographics';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Add a Chatbot to Your Website | VocUI',
  description:
    'Learn how to add a chatbot to your website in minutes — no coding required. Train it on your content, embed one script tag, and go live today.',
  openGraph: {
    title: 'How to Add a Chatbot to Your Website | VocUI',
    description:
      'Learn how to add a chatbot to your website in minutes — no coding required. Train it on your content, embed one script tag, and go live today.',
    url: 'https://vocui.com/blog/how-to-add-chatbot-to-website',
    siteName: 'VocUI',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Add a Chatbot to Your Website | VocUI',
    description:
      'Learn how to add a chatbot to your website in minutes — no coding required. Train it on your content, embed one script tag, and go live today.',
  },
  alternates: { canonical: 'https://vocui.com/blog/how-to-add-chatbot-to-website' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ───────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      name: 'How to Add a Chatbot to Your Website',
      description:
        'A step-by-step guide to adding an AI chatbot to your website without any coding.',
      url: 'https://vocui.com/blog/how-to-add-chatbot-to-website',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://vocui.com/blog/how-to-add-chatbot-to-website',
      },
      datePublished: '2026-02-09',
      dateModified: '2026-02-09',
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
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Create your chatbot and connect a knowledge source',
          text: 'Sign up for VocUI and create a new chatbot. Add your first knowledge source — paste a URL to scrape, upload a PDF, or write Q&A pairs directly.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Configure the widget',
          text: 'Set your chatbot name, welcome message, colors, and position. Match it to your brand in a few clicks.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Copy the embed code',
          text: 'Go to the Deploy tab in your chatbot dashboard. Copy the one-line JavaScript snippet.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Paste the script into your site',
          text: "Paste the script tag before the closing </body> tag in your site's HTML. Works with WordPress, Webflow, Squarespace, Shopify, and any other platform.",
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Test the live widget',
          text: 'Open your website and chat with the bot. Ask it a question your knowledge base covers and verify the answer.',
        },
      ],
      image: {
        '@type': 'ImageObject',
        url: 'https://vocui.com/blog/how-to-add-chatbot-to-website/opengraph-image',
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need to know how to code to add a chatbot to my website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Adding a VocUI chatbot requires pasting a single script tag into your site. Most website builders have a "custom code" or "header/footer scripts" section where you can paste it without touching any source files.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the chatbot work on WordPress?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can add the embed script through a WordPress plugin like "Insert Headers and Footers," or paste it directly into your theme\'s footer.php file.',
          },
        },
        {
          '@type': 'Question',
          name: 'Will the chatbot slow down my website?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The widget script loads asynchronously and does not block page rendering. The impact on your Core Web Vitals score is negligible.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if the chatbot gives a wrong answer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "The chatbot only answers from your knowledge base. If it gets something wrong, the fix is usually updating the knowledge source — adding clearer content or correcting the document it was trained on.",
          },
        },
      ],
    },
  ],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HowToAddChatbotPage() {
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
                How to Add a Chatbot to Your Website
              </li>
            </ol>
          </nav>

          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  Guide
                </span>
                <time dateTime="2026-02-09" className="text-xs text-secondary-400 dark:text-secondary-500">Feb 9, 2026</time>
                <span className="text-xs text-secondary-400 dark:text-secondary-500">7 min read</span>
              </div>
              <AuthorByline className="mb-4" />
              <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight mb-4">
                How to Add a Chatbot to Your Website (No Coding Required)
              </h1>
              <p className="text-xl text-secondary-600 dark:text-secondary-400 leading-relaxed">
                Adding a chatbot to your website used to mean hiring a developer and spending weeks
                on setup. Today you can train a chatbot on your own content and embed it on any
                website in under an hour — without writing a single line of code yourself.
              </p>
            </header>

            <TableOfContents items={[
              { id: 'what-you-need-before-you-start', label: 'What You Need Before You Start' },
              { id: 'step-1-create-your-chatbot-and-connect-a-knowledge-source', label: 'Step 1: Create Your Chatbot and Connect a Knowledge Source' },
              { id: 'step-2-configure-the-widget', label: 'Step 2: Configure the Widget' },
              { id: 'step-3-copy-the-embed-code', label: 'Step 3: Copy the Embed Code' },
              { id: 'step-4-paste-the-script-into-your-site', label: 'Step 4: Paste the Script into Your Site' },
              { id: 'step-5-test-the-live-widget', label: 'Step 5: Test the Live Widget' },
              { id: 'common-mistakes-to-avoid', label: 'Common Mistakes to Avoid' },
              { id: 'what-to-do-after-launch', label: 'What to Do After Launch' },
              { id: 'faq', label: 'FAQ' },
            ]} />

            <StepFlow
              steps={[
                { number: 1, title: 'Create Chatbot', description: 'Sign up and name your bot' },
                { number: 2, title: 'Add Knowledge', description: 'Upload URLs, PDFs, or Q&A' },
                { number: 3, title: 'Configure Widget', description: 'Set colors and welcome message' },
                { number: 4, title: 'Embed & Go Live', description: 'Paste one script tag' },
              ]}
              caption="The full process from signup to live chatbot"
            />

            <div className="prose prose-secondary dark:prose-invert max-w-none space-y-8 text-secondary-700 dark:text-secondary-300 leading-relaxed">

              <section>
                <h2 id="what-you-need-before-you-start" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What you need before you start
                </h2>
                <p>
                  Before you log in and create your first chatbot, it helps to have a few things
                  ready. None of them are technical — they&apos;re just content decisions.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">A knowledge source</strong> — this could be a URL to your FAQ page, a
                    PDF of your service guide, or a simple list of questions and answers you type
                    in manually.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">A clear purpose</strong> — what do you want the chatbot to do? Answer
                    product questions? Handle customer support? Capture leads? Having one primary
                    goal will make your setup cleaner.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Access to your website</strong> — specifically, the ability to add a
                    script to your site. On most platforms, this takes about 60 seconds.
                  </li>
                </ul>
                <p className="mt-4">
                  That&apos;s genuinely it. You do not need an OpenAI account, a developer, or any
                  experience with AI. VocUI handles all the technical layers — the embeddings, the
                  vector search, the model calls — so you just provide the content.
                </p>
              </section>

              <section>
                <h2 id="step-1-create-your-chatbot-and-connect-a-knowledge-source" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 1: Create your chatbot and connect a knowledge source
                </h2>
                <p>
                  Sign up for a free VocUI account and click &quot;New Chatbot.&quot; Give it a name — this
                  is just for your reference, not what visitors will see.
                </p>
                <p className="mt-4">
                  Next, add a knowledge source. You have a few options:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">URL</strong> — paste a web page address. VocUI will scrape the
                    content automatically. You can add multiple URLs, including your entire help
                    center or blog if you want.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">PDF or DOCX</strong> — upload a document. This works well for
                    product manuals, service guides, or any reference material you already have as
                    a file.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Q&amp;A pairs</strong> — type questions and answers directly. This is
                    the fastest way to get something working if your FAQ exists as a list in a
                    Google Doc or spreadsheet.
                  </li>
                </ul>
                <KnowledgeSourceCards caption="VocUI supports three knowledge source types" />

                <p className="mt-4">
                  Once you add a source, VocUI processes it in the background — chunking the text,
                  creating embeddings, and storing them in a vector database. For a typical help
                  page or short PDF, this takes less than a minute. See our guide to{' '}
                  <Link href="/knowledge-base-chatbot" className="text-primary-600 dark:text-primary-400 hover:underline">
                    knowledge base chatbots
                  </Link>{' '}
                  for more detail on how this works under the hood.
                </p>
              </section>

              <section>
                <h2 id="step-2-configure-the-widget" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 2: Configure the widget
                </h2>
                <p>
                  Go to the Settings tab of your chatbot. Here you can set:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Display name</strong> — what visitors see in the chat header.
                    &quot;Support&quot;, &quot;Ava&quot;, &quot;Ask Us Anything&quot; — whatever fits your brand.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Welcome message</strong> — the first thing the chatbot says when
                    someone opens it. Something like &quot;Hi! I&apos;m here to help. What can I answer for
                    you today?&quot; works well.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Brand color</strong> — pick your primary color and the widget header
                    and button will match it automatically.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Position</strong> — bottom-right or bottom-left. Bottom-right is the
                    convention most visitors expect.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">System prompt</strong> — optional, but useful for defining the
                    chatbot&apos;s personality and boundaries. For example: &quot;You are a helpful assistant
                    for Acme Services. Only answer questions about our services. If someone asks
                    something unrelated, politely let them know.&quot;
                  </li>
                </ul>
              </section>

              <section>
                <h2 id="step-3-copy-the-embed-code" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 3: Copy the embed code
                </h2>
                <p>
                  Go to the Deploy tab in your chatbot dashboard. You&apos;ll see a code snippet that
                  looks something like this:
                </p>
                <div className="bg-secondary-900 dark:bg-secondary-950 rounded-xl p-5 my-4 overflow-x-auto">
                  <code className="text-sm text-green-400 font-mono whitespace-pre">
                    {`<script src="https://vocui.com/widget.js" data-chatbot-id="YOUR_ID" async></script>`}
                  </code>
                </div>
                <p>
                  Copy this snippet. That&apos;s the entire integration. One tag, one attribute with
                  your chatbot ID, and you&apos;re done on the VocUI side.
                </p>

                <EmbedCodeVisual caption="Copy from VocUI, paste into your site" />
              </section>

              <section>
                <h2 id="step-4-paste-the-script-into-your-site" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 4: Paste the script into your site
                </h2>
                <p>
                  Where exactly you paste it depends on your website platform. The rule is the
                  same everywhere: it goes before the closing <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded font-mono">&lt;/body&gt;</code> tag.
                </p>
                <p className="mt-4 font-semibold text-secondary-800 dark:text-secondary-200">WordPress</p>
                <p className="mt-1">
                  Install the free &quot;Insert Headers and Footers&quot; plugin. Go to Settings → Insert
                  Headers and Footers, paste the snippet into the footer section, and save.
                  Alternatively, you can add it to your theme&apos;s <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded font-mono">footer.php</code> file
                  directly.
                </p>
                <p className="mt-4 font-semibold text-secondary-800 dark:text-secondary-200">Webflow</p>
                <p className="mt-1">
                  Go to Project Settings → Custom Code → Footer Code. Paste the script and
                  publish your site.
                </p>
                <p className="mt-4 font-semibold text-secondary-800 dark:text-secondary-200">Squarespace</p>
                <p className="mt-1">
                  Settings → Advanced → Code Injection → Footer. Paste and save.
                </p>
                <p className="mt-4 font-semibold text-secondary-800 dark:text-secondary-200">Shopify</p>
                <p className="mt-1">
                  Online Store → Themes → Edit Code → <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded font-mono">theme.liquid</code>. Find the{' '}
                  <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded font-mono">&lt;/body&gt;</code> tag and paste just before it.
                </p>
                <p className="mt-4 font-semibold text-secondary-800 dark:text-secondary-200">Plain HTML</p>
                <p className="mt-1">
                  Open your HTML file, find <code className="text-sm bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded font-mono">&lt;/body&gt;</code>, and paste the snippet
                  immediately before it. Save and upload.
                </p>
              </section>

              <MidArticleCta message="Following along? Create your chatbot now and try each step live." />

              <TimelineInfographic
                title="Add a Chatbot to Your Website in 15 Minutes"
                steps={[
                  { time: '0 min', title: 'Sign up and create your chatbot', description: 'Name it and choose your purpose (support, leads, internal).' },
                  { time: '2 min', title: 'Add knowledge sources', description: 'Paste URLs, upload PDFs, or type Q&A pairs directly.' },
                  { time: '5 min', title: 'Configure the widget', description: 'Set display name, welcome message, brand color, and position.' },
                  { time: '8 min', title: 'Write your system prompt', description: 'Define personality, boundaries, and fallback behavior.' },
                  { time: '10 min', title: 'Copy and paste the embed code', description: 'One script tag before </body> — works on any platform.' },
                  { time: '12 min', title: 'Test the live widget', description: 'Ask it your top 10 customer questions and verify answers.' },
                  { time: '15 min', title: 'You are live!', description: 'Your chatbot is answering visitor questions 24/7.' },
                ]}
              />

              <section>
                <h2 id="step-5-test-the-live-widget" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Step 5: Test the live widget
                </h2>
                <p>
                  Open your website in a browser — not localhost, the actual live URL. The chat
                  widget should appear in the bottom-right corner. Click it and ask a question that
                  your knowledge base covers.
                </p>
                <p className="mt-4">
                  If the answer looks right, you&apos;re live. If it seems off, go back to your
                  knowledge sources and check the content. The most common issue is that the source
                  content was vague or the relevant information was buried in a long document. Adding
                  a focused Q&amp;A pair for the tricky questions usually fixes it immediately.
                </p>
                <p className="mt-4">
                  VocUI also has a built-in chat tester in the dashboard so you can iterate without
                  having to check your live site every time.
                </p>
              </section>

              <section>
                <h2 id="common-mistakes-to-avoid" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  Common mistakes to avoid
                </h2>
                <ul className="list-disc pl-5 space-y-3 text-secondary-600 dark:text-secondary-400">
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Skipping the system prompt.</strong> Without a system prompt, your
                    chatbot will try to answer anything — including questions completely outside
                    your business. A one-sentence prompt that defines the scope prevents this.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Using only one knowledge source.</strong> A single FAQ page often
                    misses context. Add your pricing page, your &quot;How it works&quot; page, and your
                    top product pages for much better coverage.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Never updating the knowledge base.</strong> If your pricing changes or
                    you launch a new service, the chatbot won&apos;t know until you update its sources.
                    Make it part of your launch checklist.
                  </li>
                  <li>
                    <strong className="text-secondary-800 dark:text-secondary-200">Expecting it to replace your support team entirely.</strong> A well-configured
                    chatbot handles 60–80% of routine questions. But complex issues, billing
                    disputes, and upset customers still need a human. Set up live agent handoff
                    for those cases. See our{' '}
                    <Link href="/chatbot-for-customer-support" className="text-primary-600 dark:text-primary-400 hover:underline">
                      customer support chatbot guide
                    </Link>{' '}
                    for how to configure escalation.
                  </li>
                </ul>
              </section>

              <section>
                <h2 id="what-to-do-after-launch" className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-4">
                  What to do after launch
                </h2>
                <p>
                  Once your chatbot is live, check the conversation history in your dashboard after
                  the first few days. Look for questions that got poor answers or where the visitor
                  immediately asked a follow-up — those are signals that your knowledge base has
                  a gap.
                </p>
                <p className="mt-4">
                  Adding content for those gaps is the main ongoing task. Most businesses find that
                  after two or three rounds of refinement, the chatbot handles the vast majority of
                  incoming questions without any intervention.
                </p>
                <p className="mt-4">
                  If you want to use the chatbot for more than support — like capturing leads or
                  booking appointments — check out our guides on{' '}
                  <Link href="/chatbot-for-lead-capture" className="text-primary-600 dark:text-primary-400 hover:underline">
                    lead capture chatbots
                  </Link>{' '}
                  and{' '}
                  <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
                    VocUI pricing
                  </Link>
                  .
                </p>
              </section>

              <section id="faq">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-10 mb-6">
                  FAQ
                </h2>
                <dl className="space-y-6">
                  {[
                    {
                      q: 'Do I need to know how to code to add a chatbot to my website?',
                      a: "No. Adding a VocUI chatbot requires pasting a single script tag into your site. Most website builders have a \"custom code\" or \"header/footer scripts\" section where you can paste it without touching any source files.",
                    },
                    {
                      q: 'Does the chatbot work on WordPress?',
                      a: "Yes. You can add the embed script through a WordPress plugin like \"Insert Headers and Footers,\" or paste it directly into your theme's footer.php file.",
                    },
                    {
                      q: 'Will the chatbot slow down my website?',
                      a: 'No. The widget script loads asynchronously and does not block page rendering. The impact on your Core Web Vitals score is negligible.',
                    },
                    {
                      q: 'What if the chatbot gives a wrong answer?',
                      a: "The chatbot only answers from your knowledge base. If it gets something wrong, the fix is usually updating the knowledge source — adding clearer content or correcting the document it was trained on.",
                    },
                  ].map(({ q, a }) => (
                    <div key={q} className="border-b border-secondary-200 dark:border-secondary-700 pb-6">
                      <dt className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">{q}</dt>
                      <dd className="text-secondary-600 dark:text-secondary-400">{a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-center text-white shadow-xl shadow-primary-500/20">
            <h2 className="text-2xl font-bold mb-3">You read the guide -- now build it</h2>
            <p className="text-white/80 mb-2">
              Upload your content and follow along with a working chatbot in front of you.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Most people finish setup in under 5 minutes.
            </p>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 font-semibold"
              asChild
            >
              <Link href="/login?mode=signup">
                Create your chatbot
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-xs text-white/50 mt-4">Free plan included -- no credit card needed</p>
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
