'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const charities = [
  {
    name: "Save the Children",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
    tag: "Education",
    impact: "Impacted 12M+ Children"
  },
  {
    name: "Red Cross",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200",
    tag: "Humanitarian",
    impact: "Active in 192 Countries"
  },
  {
    name: "WWF",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
    tag: "Environment",
    impact: "60+ Years of Conservation"
  },
  {
    name: "Greenpeace",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1200",
    tag: "Climate",
    impact: "Fighting for our Planet"
  }
];

export default function FeaturedCharities() {
  return (
    <section className="section-padding bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
          <div className="space-y-6">
            <span className="text-black/40 text-sm font-medium tracking-[0.2em] uppercase block">Causes We Support</span>
            <h2 className="text-5xl md:text-7xl font-serif max-w-2xl leading-[1.1]">
              Connecting players to <br />
              <span className="italic text-black/50">global movements.</span>
            </h2>
          </div>
          <p className="max-w-xs text-black/60 font-light leading-relaxed">
            Choose from a curated list of vetted charities and see exactly where your contributions go.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {charities.map((charity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6">
                <Image 
                  src={charity.image}
                  alt={charity.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="glass p-4 rounded-xl backdrop-blur-md">
                      <p className="text-xs text-white uppercase tracking-widest font-medium">{charity.impact}</p>
                   </div>
                </div>
              </div>
              
              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-medium tracking-tight text-black">{charity.name}</h3>
                   <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 border border-black/10 px-2 py-1 rounded-full">
                      {charity.tag}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
