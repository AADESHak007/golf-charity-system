'use client';

import { motion } from 'framer-motion';
import { CreditCard, Target, Trophy } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Subscribe to Play',
    description: 'Join our community with a monthly or yearly membership. Your contribution starts here.',
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    number: '02',
    title: 'Log Your Scores',
    description: 'Record your Stableford scores each month to enter the draw. Your skill fuels the rewards.',
    icon: <Target className="w-6 h-6" />,
  },
  {
    number: '03',
    title: 'Win. Gift. Impact.',
    description: 'Win premium prizes while a portion of every membership fee goes directly to world-class charities.',
    icon: <Trophy className="w-6 h-6" />,
  }
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding bg-white text-black relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="grid grid-cols-12 gap-8 mb-32 items-end">
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <span className="text-black/40 text-sm font-medium tracking-[0.2em] uppercase block">The Mechanics</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-[1.1]">
              Simple steps to <br />
              <span className="italic text-black/50">meaningful change.</span>
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p className="text-xl text-black/60 font-light leading-relaxed">
              We've refined the intersection of competitive golf and philanthropy into a seamless, elegant experience.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8 group"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-8">
                <span className="text-6xl font-serif text-black/10 group-hover:text-black/20 transition-colors duration-500">
                  {step.number}
                </span>
                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/80">
                  {step.icon}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="text-black/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
