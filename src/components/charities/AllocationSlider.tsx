'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiResponse } from '@/types';

interface AllocationSliderProps {
  userCharityId: string;
  initialAllocation: number;
  subscriptionPrice: number; // in pence
  otherAllocationsTotal: number;
  onUpdate: (newTotal: number) => void;
}

export const AllocationSlider = ({
  userCharityId,
  initialAllocation,
  subscriptionPrice,
  otherAllocationsTotal,
  onUpdate,
}: AllocationSliderProps) => {
  const [allocation, setAllocation] = useState(initialAllocation);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setAllocation(initialAllocation);
  }, [initialAllocation]);

  const poundsAmount = ((subscriptionPrice / 100) * (allocation / 100)).toFixed(2);
  const totalWithChange = otherAllocationsTotal + allocation;

  const handleUpdate = async (value: number) => {
    if (value === initialAllocation) return;
    
    // Client-side validation
    if (otherAllocationsTotal + value > 50) {
      setError('Total allocation cannot exceed 50%');
      setAllocation(initialAllocation);
      return;
    }

    setIsUpdating(true);
    setError(null);
    setShowSuccess(false);

    try {
      const response = await fetch(`/api/user/charities/${userCharityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocation_perc: value }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setShowSuccess(true);
        onUpdate(result.data.total_allocation);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        setError(result.error || 'Failed to update allocation');
        setAllocation(initialAllocation);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setAllocation(initialAllocation);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{allocation}%</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Allocation</span>
          </div>
          <p className="text-sm font-medium text-orange-500/80">
            £{poundsAmount} <span className="text-zinc-600">/ month</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isUpdating && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving
              </motion.div>
            )}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500"
              >
                <CheckCircle2 className="w-3 h-3" />
                Updated
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-500"
              >
                <AlertCircle className="w-3 h-3" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative group py-2">
        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={allocation}
          disabled={isUpdating}
          onChange={(e) => {
            setAllocation(parseInt(e.target.value));
            setError(null);
          }}
          onMouseUp={(e) => handleUpdate(parseInt((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => handleUpdate(parseInt((e.target as HTMLInputElement).value))}
          className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Min 10%</span>
          <div className="flex gap-4">
             {totalWithChange > 50 && (
               <span className="text-[10px] font-bold text-rose-500/60 uppercase tracking-tighter">Exceeds 50% Total</span>
             )}
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Max 50%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
