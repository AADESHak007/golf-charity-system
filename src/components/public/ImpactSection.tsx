'use client';

import { motion } from 'framer-motion';

export default function ImpactSection() {
  const stats = [
    { label: 'Total Donations', value: '$2.4M+', description: 'Directed to global causes since 2024.' },
    { label: 'Active Members', value: '1,200+', description: 'Golfers competing for more than just trophies.' },
    { label: 'Annual Winnings', value: '$840K', description: 'Awarded to our top performance members.' },
  ];

  return (
    <section className="section-padding bg-[#050810] relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <span className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em] block">
                {stat.label}
              </span>
              <h3 className="text-7xl md:text-9xl font-serif text-white tracking-tighter muted-gradient">
                {stat.value}
              </h3>
              <p className="max-w-[240px] mx-auto text-white/50 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
