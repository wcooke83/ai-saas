import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { FeaturesHero } from './features-hero';
import { FeaturesFlagship } from './features-flagship';
import { FeaturesStats } from './features-stats';
import { FeaturesPlatform } from './features-platform';
import { FeaturesCta } from './features-cta';

export const metadata: Metadata = {
  title: 'Features | VocUI — AI Chatbot Platform',
  description:
    'In-chat booking, live agent handoff, RAG telemetry, proactive messaging, sentiment scoring, multi-channel deploy, and 6 more features — all in one AI chatbot platform.',
  openGraph: {
    title: 'Features | VocUI — AI Chatbot Platform',
    description:
      'In-chat booking, live agent handoff, RAG telemetry, proactive messaging, sentiment scoring, multi-channel deploy, and 6 more features — all in one AI chatbot platform.',
    url: 'https://vocui.com/features',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features | VocUI — AI Chatbot Platform',
    description:
      'In-chat booking, live agent handoff, RAG telemetry, proactive messaging, sentiment scoring, multi-channel deploy, and 6 more features — all in one AI chatbot platform.',
  },
  alternates: { canonical: 'https://vocui.com/features' },
  robots: { index: true, follow: true },
};

export default function FeaturesPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Features | VocUI',
            description:
              'In-chat booking, live agent handoff, RAG telemetry, proactive messaging, sentiment scoring, multi-channel deploy, and 6 more features — all in one AI chatbot platform.',
            url: 'https://vocui.com/features',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        {/* --- Hero: full viewport, left-aligned display type, breadcrumbs --- */}
        <FeaturesHero />

        {/* --- Flagship: dark bg, 3 deep-dive alternating layouts ------------ */}
        <FeaturesFlagship />

        {/* --- Stats interlude: light bg, 3 display numbers (visual reset) --- */}
        <FeaturesStats />

        {/* --- Platform grid: 6 cards + 3 accent-bar cards (two forms) ------- */}
        <FeaturesPlatform />

        {/* --- CTA: dark, asymmetric, drives to signup ----------------------- */}
        <FeaturesCta />
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
