import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { HelpHero } from './help-hero';
import { HelpChannels } from './help-channels';
import { HelpQuickLinks } from './help-quick-links';
import { HelpContact } from './help-contact';

export const metadata: Metadata = {
  title: 'Help & Support | VocUI',
  description:
    'Get help with VocUI. Contact support, browse documentation, or submit a request.',
  alternates: { canonical: 'https://vocui.com/help' },
  robots: { index: true, follow: true },
};

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const params = await searchParams;
  const prefilledSubject = params.subject || '';

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
            name: 'Help & Support | VocUI',
            description:
              'Get help with VocUI. Contact support, browse documentation, or submit a request.',
            url: 'https://vocui.com/help',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        {/* ─── Hero: full viewport, left-aligned, display type ────────────────── */}
        <HelpHero />

        {/* ─── Channels: dark panel, horizontal strip rows with CTAs ───────────── */}
        <HelpChannels />

        {/* ─── Quick links: light panel, asymmetric split with stat anchor ─────── */}
        <HelpQuickLinks />

        {/* ─── Contact: deep ocean, asymmetric with form + decorative element ──── */}
        <div className="relative">
          <HelpContact prefilledSubject={prefilledSubject} />
        </div>
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
