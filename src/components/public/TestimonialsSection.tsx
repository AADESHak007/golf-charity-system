'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    quote: "Golf Charity has turned my weekend rounds into something much more meaningful. I've won twice, but knowing my contributions help children's education is the real victory.",
    author: "James Peterson",
    role: "Member since 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
  },
  {
    quote: "An elegant platform that genuinely delivers on its promise. The transparency of the charity impact reports is what really sets them apart from anything else in the sport.",
    author: "Sarah West",
    role: "Gold Subscription",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
  },
  {
    quote: "The thrill of the monthly draw combined with a deep sense of purpose. It's rare to find a platform that feels this premium while doing this much good.",
    author: "Michael Chen",
    role: "Impact Partner",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-[#050810] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-32 space-y-6">
          <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase block">Testimonials</span>
          <h2 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-none italic">
            Voices of Impact.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="text-2xl md:text-3xl text-white/80 font-serif leading-relaxed italic muted-gradient">
                "{t.quote}"
              </div>
              
              <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden grayscale active:grayscale-0 transition-all duration-700">
                  <Image 
                    src={t.image} 
                    alt={t.author} 
                    fill 
                    sizes="64px"
                    className="object-cover" 
                  />
                </div>
                <div>
                   <h4 className="text-lg font-medium tracking-tight text-white">{t.author}</h4>
                   <p className="text-xs uppercase tracking-widest text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
