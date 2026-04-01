import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { WikiHero } from './wiki-hero';
import { WikiContent } from './wiki-content';

export const metadata: Metadata = {
  title: 'Documentation | VocUI',
  description:
    'Guides and tutorials to help you get the most out of VocUI, chatbots, and integrations.',
  alternates: { canonical: 'https://vocui.com/wiki' },
  robots: { index: true, follow: true },
};

export default function PublicWikiIndexPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <main id="main-content" className="relative z-[2]">
        {/* ─── Hero: full viewport, left-aligned, display type ────────────────── */}
        <WikiHero />

        {/* ─── Content: fetches categories, renders varied section layouts ─────── */}
        <WikiContent />
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
