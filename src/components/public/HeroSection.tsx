'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Using known reliable Unsplash URLs
const HERO_IMAGE = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=2400';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050810]">
      
      {/* Immersive Background */}
      <div className="absolute inset-0">
        <Image 
          src={HERO_IMAGE}
          alt="Community Impact"
          fill
          sizes="100vw"
          className="object-cover grayscale-[0.2] contrast-[1.1]"
          priority
        />
        <div className="absolute inset-0 hero-gradient-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center py-20">
        
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
        >
          {/* Subtle Label */}
          <motion.span 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5, duration: 1 }}
             className="text-white/60 text-sm font-medium tracking-[0.3em] uppercase block mb-12"
          >
            A Movement in Motion
          </motion.span>

          {/* Large Editorial Headline */}
          <h1 className="text-6xl md:text-[8rem] font-serif text-white tracking-tighter leading-[0.85] flex flex-col items-center mb-12">
            <span className="block italic text-white/90">Play.</span>
            <span className="block ml-0 md:ml-48">Win.</span>
            <span className="block italic text-accent muted-gradient">Give Back.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/70 font-light leading-relaxed mb-16">
            The first subscription platform connecting your game with causes that matter. Enter your scores, win prizes, and change lives.
          </p>

          {/* CTAs - Properly Spaced */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              href="/signup" 
              className="btn-premium group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Movement
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-all duration-300">
                  <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            
            <Link 
              href="/how-it-works" 
              className="btn-premium-outline"
            >
              Explore Impact
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Hero Footer Stats - Positioned lower with absolute bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end border-t border-white/10 pt-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
           <div className="text-xs uppercase tracking-[0.2em] space-y-2">
              <span className="block text-white/50">Current Prize Pool</span>
              <span className="block text-white font-serif text-xl">$145,200.00</span>
           </div>
           <div className="text-xs uppercase tracking-[0.2em] space-y-2 text-center">
              <span className="block text-white/50">Active Users</span>
              <span className="block text-white font-serif text-xl">12k+ Global</span>
           </div>
           <div className="text-xs uppercase tracking-[0.2em] space-y-2 text-right">
              <span className="block text-white/50">Charities Supported</span>
              <span className="block text-white font-serif text-xl">420 Organizations</span>
           </div>
        </div>
      </div>

    </section>
  );
}
