'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2, Sparkles, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types';

interface CharityPercSliderProps {
  initialPerc: number;
  monthlyPlanPrice: number; // in pennies or pounds? instructions say pounds (price * perc/100)
  onSuccess?: (newPerc: number) => void;
}

export const CharityPercSlider = ({ initialPerc, monthlyPlanPrice, onSuccess }: CharityPercSliderProps) => {
  const [perc, setPerc] = useState(initialPerc);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success Toast timeout
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleUpdate = async (value: number) => {
    if (value === initialPerc) return;
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/user/charity-perc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charity_perc: value }),
      });
      
      const result: ApiResponse = await response.json();
      if (result.success) {
        setShowToast(true);
        if (onSuccess) onSuccess(value);
      } else {
        setError(result.error || 'Failed to update contribution');
        // Revert UI to initial if failed? Or just show error
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const calculatedAmount = (monthlyPlanPrice * (perc / 100)).toFixed(2);

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 relative">
      {/* Percentage Display & Calculation */}
      <div className="text-center space-y-4">
        <div className="relative inline-block px-12 py-8 bg-zinc-900 border border-white/5 rounded-[3rem] shadow-2xl backdrop-blur-md overflow-hidden group">
           {/* Background decorative spark */}
           <Sparkles className="absolute -right-4 -top-4 w-16 h-16 text-orange-500/10 rotate-12 transition-transform group-hover:rotate-45" />
           
           <div className="relative z-10 flex flex-col items-center">
             <span className="text-6xl md:text-8xl font-black text-white tracking-widest leading-none drop-shadow-lg">
                {perc}<span className="text-orange-500">%</span>
             </span>
             <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                Charity Contribution
             </p>
           </div>
        </div>

        <div className="flex items-center justify-center gap-2 p-3 bg-zinc-950/50 rounded-2xl border border-white/5 max-w-[340px] mx-auto overflow-hidden">
          <Heart className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
          <p className="text-sm font-bold text-white leading-relaxed">
            You're contributing <span className="text-orange-400 font-black">${calculatedAmount}</span> per month
          </p>
        </div>
      </div>

      {/* Range Slider */}
      <div className="space-y-6">
        <div className="relative h-12 flex items-center group">
          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={perc}
            onChange={(e) => setPerc(parseInt(e.target.value))}
            onMouseUp={(e) => handleUpdate(parseInt((e.target as HTMLInputElement).value))}
            onTouchEnd={(e) => handleUpdate(parseInt((e.target as HTMLInputElement).value))}
            disabled={isUpdating}
            className="w-full h-2.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-orange-500 focus:outline-hidden transition-all group-hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-1 pointer-events-none">
            <span>Min 10%</span>
            <span>Max 50%</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 opacity-60">
           {isUpdating && (
             <motion.p 
               initial={{ opacity: 0, y: 5 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="text-[10px] uppercase font-bold tracking-widest text-orange-500 flex items-center gap-2"
             >
               <Loader2 className="w-3 h-3 animate-spin" /> Saving Changes
             </motion.p>
           )}
           {error && <p className="text-[10px] uppercase font-bold tracking-widest text-rose-500">{error}</p>}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 backdrop-blur-lg z-50 pointer-events-none"
          >
            <TrendingUp className="w-4 h-4" />
            Impact Updated
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] font-bold text-zinc-600 flex items-center justify-center gap-2 uppercase tracking-widest px-8 text-center leading-relaxed">
        <Info className="w-3 h-3 text-zinc-800" />
        Increasing your percentage helps fund more critical mission work
      </p>
    </div>
  );
};
