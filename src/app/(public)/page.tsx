import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { HeroWaveform } from '@/components/ui/hero-waveform';
import { HomeHero } from './home-hero';
import { HomeFeatures } from './home-features';
import { HomeTestimonials } from './home-testimonials';
import { HomeHowItWorks } from './home-how-it-works';
import { HomeAllFeatures } from './home-all-features';
import { HomeCta } from './home-cta';

export default function HomePage() {
  return (
    <PageBackground>
      <HeroWaveform className="fixed inset-0 z-[1] pointer-events-none" />
      <Header />

      <main id="main-content" className="relative z-[2]">
        <HomeHero />
        <HomeFeatures />
        <HomeTestimonials />
        <HomeHowItWorks />
        <HomeAllFeatures />
        <HomeCta />
      </main>

      <div className="relative z-[2]">
        <Footer />
      </div>
    </PageBackground>
  );
}
