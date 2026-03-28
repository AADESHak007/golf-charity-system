'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WhatWeDoSection() {
  return (
    <section className="section-padding bg-[#050810] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="asymmetric-grid items-center">
          
          {/* Text Block - Left Column (Large) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.1]">
                Turning every swing <br />
                <span className="italic text-white/60">into a ripple of change.</span>
              </h2>
            </div>
            
            <div className="space-y-8 max-w-xl">
              <p className="text-xl md:text-2xl text-muted leading-relaxed font-light">
                We believe that golf is more than just a game of precision and patience. It's a platform for connection, community, and collective impact.
              </p>
              <p className="text-lg text-muted/80 leading-relaxed">
                Golf Charity was born from a simple idea: what if every round played could directly support the causes that need it most? Through our platform, your Stableford scores become tokens of hope, fueling monthly prize draws while consistently contributing to charities worldwide.
              </p>
            </div>
            
            <div className="pt-8">
              <div className="h-px w-24 bg-accent/30" />
            </div>
          </motion.div>

          {/* Image Block - Right Column (Offset) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-5 lg:mt-24 relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=1200" 
                alt="Community Impact"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/60 to-transparent" />
            </div>
            
            {/* Hanging Caption */}
            <div className="absolute -bottom-12 -left-12 p-8 glass rounded-xl hidden md:block max-w-xs">
              <p className="text-sm italic text-white/80 font-serif">
                "Small acts, when multiplied by millions of people, can transform the world."
              </p>
              <footer className="mt-4 text-xs font-medium tracking-widest uppercase text-accent">
                — Howard Zinn
              </footer>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
