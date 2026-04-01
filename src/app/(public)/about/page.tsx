import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { SplashHero } from '@/components/ui/splash-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { AboutIntro } from './about-intro';
import { AboutBeliefs } from './about-beliefs';
import { AboutCta } from './about-cta';

export const metadata: Metadata = {
  title: 'About VocUI | AI Chatbot Builder',
  description:
    'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
  openGraph: {
    title: 'About VocUI | AI Chatbot Builder',
    description:
      'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
    url: 'https://vocui.com/about',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About VocUI | AI Chatbot Builder',
    description:
      'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
  },
  alternates: { canonical: 'https://vocui.com/about' },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About VocUI | AI Chatbot Builder',
            description:
              'VocUI is an AI chatbot platform that lets businesses build, train, and deploy custom chatbots from their own content.',
            url: 'https://vocui.com/about',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        {/* ─── Hero (untouched) ──────────────────────────────────────────────── */}
        <SplashHero
          headline={
            <>
              Great support used to mean a big team.{' '}
              <span className="text-primary-500">It doesn&apos;t anymore.</span>
            </>
          }
          supportingText="Upload your docs, paste a URL, and have a working chatbot live on your site today. No developers, no waiting weeks for IT."
          primaryCta={{ label: 'Start for Free', href: '/signup' }}
          secondaryCta={{ label: 'See How It Works', href: '#content' }}
          breadcrumbs={[{ label: 'About' }]}
        />

        {/* ─── Intro: asymmetric editorial copy ─────────────────────────────── */}
        <AboutIntro />

        {/* ─── Beliefs: full-bleed dark panel with numbered statements ──────── */}
        <AboutBeliefs />

        {/* ─── CTA: edge-to-edge gradient ───────────────────────────────────── */}
        <div className="relative">
          <AboutCta />
        </div>
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
