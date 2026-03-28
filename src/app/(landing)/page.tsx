import { Metadata } from 'next';
import HeroSection from '@/components/public/HeroSection';
import WhatWeDoSection from '@/components/public/WhatWeDoSection';
import HowItWorksSection from '@/components/public/HowItWorksSection';
import ImpactSection from '@/components/public/ImpactSection';
import FeaturedCharities from '@/components/public/FeaturedCharities';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import CtaSection from '@/components/public/CtaSection';

export const metadata: Metadata = {
  title: 'Golf Charity | Play. Win. Give Back.',
  description: 'The first subscription platform connecting your game with causes that matter. Enter your Stableford scores each month to win big while supporting a charity you love.',
  keywords: ['golf', 'charity', 'prize draw', 'stableford', 'lottery', 'subscription'],
};

export default async function HomePage() {
  // We can still fetch data for specific sections if needed, but for the storytelling 
  // landing page, we want it to feel curated and premium.
  
  return (
    <main className="flex flex-col">
      <HeroSection />
      
      <WhatWeDoSection />
      
      <HowItWorksSection />
      
      <ImpactSection />
      
      <FeaturedCharities />
      
      <TestimonialsSection />
      
      <CtaSection />
    </main>
  );
}
