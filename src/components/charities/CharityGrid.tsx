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
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-zinc-500 font-medium animate-pulse">Finding causes to support...</p>
      </div>
    );
  }

  if (!charities || charities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center bg-zinc-900/50 border border-white/5 rounded-[3rem]">
        <div className="p-6 bg-zinc-800 rounded-full mb-6">
          <HeartOff className="w-12 h-12 text-zinc-600" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">No charities found</h3>
        <p className="text-zinc-500 max-w-md mx-auto">
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
