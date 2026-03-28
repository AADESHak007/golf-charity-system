'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function CtaSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      
      {/* Immersive background image with high exposure overlay */}
      <div className="absolute inset-0">
         <Image 
           src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=2400"
           alt="Call to Action"
           fill
           sizes="100vw"
           className="object-cover grayscale-[0.5] contrast-[1.2]"
         />
         <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           viewport={{ once: true }}
           className="space-y-8"
        >
          <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase block">Start Your Journey</span>
          <h2 className="text-6xl md:text-[10rem] font-serif text-white tracking-tighter leading-[0.8] italic">
            Become a <br />
            <span className="text-white/40 text-[0.8em]">Digital Hero.</span>
          </h2>
          
          <p className="max-w-xl mx-auto text-xl text-white/70 font-light leading-relaxed">
            Your membership is the catalyst. Your skill is the fuel. Together, we play for something far greater than ourselves.
          </p>

          <div className="pt-8">
            <Link 
              href="/signup" 
              className="btn-premium group transition-all duration-500 hover:scale-110"
            >
              <span className="relative z-10 flex items-center gap-3 px-8 text-xl">
                Ready to Play
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-2 transition-all duration-500">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
