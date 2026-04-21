'use client';

import Header from './Landing/Header';
import Hero from './Landing/Hero';

import Footer from './Landing/Footer';
import { SectionStats } from './Landing/sections/SectionStats';
import { SectionSeguros } from './Landing/sections/SectionSeguros';
import { SectionBeneficios } from './Landing/sections/SectionBeneficios';
import { SectionPromos } from './Landing/sections/SectionPromos';
import { SectionSiniestros } from './Landing/sections/SectionSiniestros';
import { SectionTestimonios } from './Landing/sections/SectionTestimonios';
import { SectionAppCTA } from './Landing/sections/ectionAppCTA';
import { SectionContactoCTA } from './Landing/sections/SectionContactoCTA';

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-text bg-white antialiased">
      <Header />

      <main>
        <Hero />
        <SectionStats />
        <SectionSeguros />
        <SectionBeneficios />
        <SectionPromos />
        <SectionSiniestros />
        <SectionTestimonios />
        <SectionAppCTA />
        <SectionContactoCTA />
      </main>

      <Footer />
    </div>
  );
}
