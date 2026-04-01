import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { SecurityHero } from './security-hero';
import { SecurityCommitments } from './security-commitments';
import { SecurityCompliance } from './security-compliance';
import { SecurityAI } from './security-ai';
import { SecurityCta } from './security-cta';

export const metadata: Metadata = {
  title: 'Security & Data Privacy | VocUI',
  description:
    'How VocUI protects your data: encryption, access controls, GDPR compliance, and data handling practices for AI chatbot deployments.',
  alternates: { canonical: 'https://vocui.com/security' },
};

export default function SecurityPage() {
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
            name: 'Security & Data Privacy | VocUI',
            description:
              'How VocUI protects your data: encryption, access controls, GDPR compliance, and data handling practices for AI chatbot deployments.',
            url: 'https://vocui.com/security',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        {/* ─── Hero: full viewport, lower-left anchored, display type ─────────── */}
        <SecurityHero />

        {/* ─── Commitments: dark panel, data + infrastructure rows ─────────────── */}
        <SecurityCommitments />

        {/* ─── Compliance: dark manifesto, GDPR + CCPA horizontal strip rows ───── */}
        <SecurityCompliance />

        {/* ─── Responsible AI: light section, 2-principle stat layout ──────────── */}
        <SecurityAI />

        {/* ─── CTA: dark, asymmetric with decorative monogram ──────────────────── */}
        <div className="relative">
          <SecurityCta />
        </div>
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
