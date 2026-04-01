import type { Metadata } from 'next';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { ContactHero } from './contact-hero';
import { ContactFormSection } from './contact-form-section';
import { ContactSelfService } from './contact-self-service';

export const metadata: Metadata = {
  title: 'Contact VocUI | Get in Touch',
  description:
    'Contact the VocUI team for support, sales inquiries, or general questions about our AI chatbot platform.',
  openGraph: {
    title: 'Contact VocUI | Get in Touch',
    description:
      'Contact the VocUI team for support, sales inquiries, or general questions about our AI chatbot platform.',
    url: 'https://vocui.com/contact',
    siteName: 'VocUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact VocUI | Get in Touch',
    description:
      'Contact the VocUI team for support, sales inquiries, or general questions about our AI chatbot platform.',
  },
  alternates: { canonical: 'https://vocui.com/contact' },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact VocUI | Get in Touch',
            description:
              'Contact the VocUI team for support, sales inquiries, or general questions about our AI chatbot platform.',
            url: 'https://vocui.com/contact',
            publisher: {
              '@type': 'Organization',
              name: 'VocUI',
              url: 'https://vocui.com',
            },
          }),
        }}
      />

      <main id="main-content" className="relative z-[2]">
        <ContactHero />
        <ContactFormSection />
        <ContactSelfService />
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
