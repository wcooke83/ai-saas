import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, Code2, Copy, Zap, Clock } from 'lucide-react';

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'How to Add a Chatbot to Any Website | VocUI',
  description: 'Step-by-step guides for embedding an AI chatbot widget on WordPress, Shopify, Squarespace, Wix, or any site. One script tag — no coding required.',
  openGraph: {
    title: 'How to Add a Chatbot to Any Website | VocUI',
    description: 'Step-by-step guides for embedding an AI chatbot widget on WordPress, Shopify, Squarespace, Wix, or any site. One script tag — no coding required.',
    url: 'https://vocui.com/guides/embed-chatbot',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Add a Chatbot to Any Website | VocUI',
    description: 'Step-by-step guides for embedding an AI chatbot widget on WordPress, Shopify, Squarespace, Wix, or any site. One script tag — no coding required.',
  },
  alternates: { canonical: 'https://vocui.com/guides/embed-chatbot' },
  robots: { index: true, follow: true },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://vocui.com/guides/embed-chatbot',
      name: 'How to Add a Chatbot to Any Website',
      description:
        'Step-by-step guides for embedding an AI chatbot widget on WordPress, Shopify, Squarespace, Wix, or any site. One script tag — no coding required.',
      url: 'https://vocui.com/guides/embed-chatbot',
      dateCreated: '2026-03-08',
      dateModified: '2026-04-03',
      publisher: {
        '@type': 'Organization',
        name: 'VocUI',
        url: 'https://vocui.com',
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: 6,
        itemListElement: [
          { '@type': 'ListItem', position: 1, url: 'https://vocui.com/blog/how-to-add-chatbot-to-website', name: 'How to Add a Chatbot to Your Website (No Coding Required)' },
          { '@type': 'ListItem', position: 2, url: 'https://vocui.com/blog/what-is-a-chatbot-widget', name: 'What Is a Chatbot Widget and How Does It Work?' },
          { '@type': 'ListItem', position: 3, url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wordpress', name: 'How to Embed a Chatbot in WordPress' },
          { '@type': 'ListItem', position: 4, url: 'https://vocui.com/blog/how-to-embed-chatbot-in-shopify', name: 'How to Embed a Chatbot in Shopify' },
          { '@type': 'ListItem', position: 5, url: 'https://vocui.com/blog/how-to-embed-chatbot-in-squarespace', name: 'How to Embed a Chatbot in Squarespace' },
          { '@type': 'ListItem', position: 6, url: 'https://vocui.com/blog/how-to-embed-chatbot-in-wix', name: 'How to Embed a Chatbot in Wix' },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vocui.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://vocui.com/guides' },
        { '@type': 'ListItem', position: 3, name: 'How to Add a Chatbot to Any Website', item: 'https://vocui.com/guides/embed-chatbot' },
      ],
    },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmbedChatbotGuidePage() {
  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <main id="main-content" className="relative z-[2]">

        {/* ─── Hero: full-bleed, waveform bg, display type ────────────────────── */}
        <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
          <div className="relative z-10 flex flex-col flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Main content — anchored bottom-left */}
            <div className="flex flex-col justify-end flex-1 pb-20 lg:pb-28 max-w-4xl">
              {/* Eyebrow */}
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-6">
                Embedding Guide
              </p>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tight text-secondary-900 dark:text-secondary-100 leading-[1.06] mb-8">
                Add a Chatbot to Any{' '}
                <span className="text-primary-500">Website in 5 Minutes</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl leading-relaxed mb-10">
                One embed snippet. No coding required. Platform-specific guides for adding a chatbot widget to WordPress, Shopify, Squarespace, Wix, and more.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Create your chatbot
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium text-lg rounded-sm border border-secondary-300 dark:border-secondary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Scroll line */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center"
              aria-hidden="true"
            >
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-secondary-300 dark:to-secondary-700" />
            </div>
          </div>
        </section>

        {/* ─── How it works: dense 3-step strip, secondary-50 band ────────────── */}
        <section
          id="how-it-works"
          className="w-full bg-secondary-50 dark:bg-secondary-900 border-y border-secondary-200 dark:border-secondary-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-16">
              Embed a chatbot in three steps.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-secondary-200 dark:divide-secondary-700">
              {/* Step 1 */}
              <div className="flex flex-col gap-5 pb-12 md:pb-0 md:pr-12 border-b md:border-b-0 border-secondary-200 dark:border-secondary-700 mb-12 md:mb-0">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary-500/20 dark:text-primary-400/20 leading-none select-none" aria-hidden="true">01</span>
                  <div className="w-10 h-10 rounded-sm bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Build</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    <Link href="/dashboard/chatbots/new" className="underline underline-offset-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Create your chatbot</Link> and train it on your content
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-5 pb-12 md:pb-0 md:px-12 border-b md:border-b-0 border-secondary-200 dark:border-secondary-700 mb-12 md:mb-0">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary-500/20 dark:text-primary-400/20 leading-none select-none" aria-hidden="true">02</span>
                  <div className="w-10 h-10 rounded-sm bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Copy className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Copy</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    Get your unique embed snippet from the dashboard
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-5 md:pl-12">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary-500/20 dark:text-primary-400/20 leading-none select-none" aria-hidden="true">03</span>
                  <div className="w-10 h-10 rounded-sm bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Paste</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    Add one script tag to your site. Done.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Getting Started: white bg, two cards (first emphasized) ────────── */}
        <section className="w-full bg-white dark:bg-secondary-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-3">
                Getting started
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
                New to embedding a chatbot?{' '}
                <span className="text-secondary-500 dark:text-secondary-400 font-normal">Start here.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1 — emphasized "Start here" entry point */}
              <Link
                href="/blog/how-to-add-chatbot-to-website"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="How to Add a Chatbot to Your Website — read the full guide"
              >
                <Card className="h-full border-l-4 transition-shadow group-hover:shadow-md" style={{ borderLeftColor: 'rgb(14 165 233)' }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default">Start here</Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-secondary-400 dark:text-secondary-500">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        7 min read
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      How to Add a Chatbot to Your Website (No Coding Required)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      The universal guide. Learn how to embed a chatbot widget on any website in minutes with a single script tag.
                    </CardDescription>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                      Read the guide
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Card 2 — standard */}
              <Link
                href="/blog/what-is-a-chatbot-widget"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="What Is a Chatbot Widget and How Does It Work — read the explainer"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">Explainer</Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-secondary-400 dark:text-secondary-500">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        6 min read
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      What Is a Chatbot Widget and How Does It Work?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      Understand what a chatbot widget is, how it appears on your site, and what happens when visitors interact with it.
                    </CardDescription>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2.5 transition-all">
                      Read the explainer
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Platform guides: secondary-50 band, 2×2 grid with color accents ── */}
        <section className="w-full bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 mb-3">
                Platform guides
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
                Embed a chatbot widget on your platform.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* WordPress */}
              <Link
                href="/blog/how-to-embed-chatbot-in-wordpress"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="How to Embed a Chatbot in WordPress — read guide"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md overflow-hidden">
                  <div className="h-1 w-full" style={{ backgroundColor: '#2271b1' }} aria-hidden="true" />
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#2271b1' }}>
                      WordPress
                    </p>
                    <CardTitle className="text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      How to Embed a Chatbot in WordPress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      Add a chatbot to WordPress in under 5 minutes. Paste one script tag into your theme or use a plugin.
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Shopify */}
              <Link
                href="/blog/how-to-embed-chatbot-in-shopify"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="How to Embed a Chatbot in Shopify — read guide"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md overflow-hidden">
                  <div className="h-1 w-full" style={{ backgroundColor: '#96bf48' }} aria-hidden="true" />
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#96bf48' }}>
                      Shopify
                    </p>
                    <CardTitle className="text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      How to Embed a Chatbot in Shopify
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      Add a chatbot to your Shopify store to answer product, shipping, and return questions automatically.
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Squarespace */}
              <Link
                href="/blog/how-to-embed-chatbot-in-squarespace"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="How to Embed a Chatbot in Squarespace — read guide"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md overflow-hidden">
                  <div className="h-1 w-full bg-secondary-800 dark:bg-secondary-300" aria-hidden="true" />
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-secondary-700 dark:text-secondary-300 mb-1">
                      Squarespace
                    </p>
                    <CardTitle className="text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      How to Embed a Chatbot in Squarespace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      Use Squarespace code injection to add a chatbot to your site. No plugins, no app installs.
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              {/* Wix */}
              <Link
                href="/blog/how-to-embed-chatbot-in-wix"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
                aria-label="How to Embed a Chatbot in Wix — read guide"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md overflow-hidden">
                  <div className="h-1 w-full" style={{ backgroundColor: '#FAAD4D' }} aria-hidden="true" />
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#FAAD4D' }}>
                      Wix
                    </p>
                    <CardTitle className="text-base leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      How to Embed a Chatbot in Wix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-4">
                      Embed a chatbot on your Wix site using the custom code feature. Works on any Wix plan with custom code access.
                    </CardDescription>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                      Read guide
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

            </div>
          </div>
        </section>

        {/* ─── CTA band: full-bleed dark, primary-950 ─────────────────────────── */}
        <section
          className="w-full"
          style={{ background: 'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(8,47,73) 100%)' }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200/70 mb-6">
                Ready to embed
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Get your embed code in 2 minutes
              </h2>
              <p className="text-lg text-primary-100/80 leading-relaxed mb-10 max-w-lg">
                Build a chatbot, train it on your content, and copy your chatbot widget embed code.
                Paste it into any website that supports custom HTML — WordPress, Shopify, Squarespace, or your own code.
              </p>
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold text-lg rounded-sm hover:bg-primary-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800"
              >
                Create your chatbot
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
