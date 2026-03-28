'use client';

import { motion } from 'framer-motion';
import { CharityCard } from './CharityCard';
import { HeartOff, Loader2 } from 'lucide-react';

interface CharityGridProps {
  charities: any[];
  loading?: boolean;
}

export const CharityGrid = ({ charities, loading }: CharityGridProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] italic text-[10px] animate-pulse">Finding causes to support...</p>
      </div>
    );
  }

  if (!charities || charities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center bg-white border border-slate-100 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        <div className="p-6 bg-slate-50 rounded-full mb-6 border border-slate-100 shadow-sm">
          <HeartOff className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-2xl font-serif italic tracking-tighter text-slate-900 mb-2">No charities found.</h3>
        <p className="text-slate-500 max-w-md mx-auto italic">
          We couldn't find any charities matching your criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {charities.map((charity) => (
        <motion.div
          key={charity.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <CharityCard {...charity} />
        </motion.div>
      ))}
    </motion.div>
  );
};
