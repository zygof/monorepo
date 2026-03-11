import type { JSX } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { TrustBadgesSection } from '@/components/sections/trust-badges-section';
import { ServicesSection } from '@/components/sections/services-section';
import { CtaBanner } from '@/components/sections/cta-banner';

export default function HomePage(): JSX.Element {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <TrustBadgesSection />
        <ServicesSection />
        <CtaBanner />
        {/* TODO: Section Équipe */}
        {/* TODO: Section Galerie */}
        {/* TODO: Section Avis Google */}
      </main>
      <Footer />
    </>
  );
}
