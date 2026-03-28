'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthBranding() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#050810] p-16 text-white relative overflow-hidden h-screen sticky top-0">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 opacity-40">
        <Image 
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200"
          alt="Golf Impact"
          fill
          sizes="50vw"
          className="object-cover grayscale-[0.5] contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/40" />
      </div>

      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-serif text-white tracking-tighter">
            Golf<span className="italic text-accent">Charity</span>
          </span>
        </Link>

        <div className="mt-32 max-w-md space-y-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl font-serif tracking-tighter leading-[0.8] italic text-white/90"
          >
            Play. Win. <br />
            <span className="text-accent text-8xl muted-gradient">Give.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl text-white/60 font-light leading-relaxed"
          >
            The premium platform where your passion for golf fuels charitable impact and enters you into life-changing prize draws.
          </motion.p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {[
          "Curated monthly prize pools.",
          "Direct impact to global charities.",
          "Professional score tracking."
        ].map((text, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="flex items-center gap-4 text-xs font-medium tracking-[0.2em] uppercase text-white/40"
          >
            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
            {text}
          </motion.div>
        ))}
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-16 right-16 h-px bg-white/5" />
    </div>
  );
}
