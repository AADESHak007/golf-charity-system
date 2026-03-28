'use client';

import { motion } from 'framer-motion';
import { Target, Info, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AllocationSummaryProps {
  totalAllocated: number;
  remainingAllocated: number;
  totalMonthlyPounds: number;
}

export const AllocationSummary = ({
  totalAllocated,
  remainingAllocated,
  totalMonthlyPounds,
}: AllocationSummaryProps) => {
  const getProgressColor = (total: number) => {
    if (total <= 25) return 'bg-blue-500 shadow-blue-500/20';
    if (total <= 40) return 'bg-amber-500 shadow-amber-500/20';
    return 'bg-emerald-500 shadow-emerald-500/20';
  };

  const getStatusTextColor = (total: number) => {
    if (total <= 25) return 'text-blue-500';
    if (total <= 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="p-8 md:p-10 rounded-[3rem] bg-zinc-900 border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/20 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-white/5 rounded-full w-fit">
            <Target className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Charity Allocation</span>
          </div>
          <h3 className={cn("text-4xl font-black tracking-tight", getStatusTextColor(totalAllocated))}>
            {totalAllocated}% <span className="text-zinc-600">of 50%</span>
          </h3>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {remainingAllocated}% remaining <span className="text-zinc-800 mx-2">·</span> ${totalMonthlyPounds.toFixed(2)} total monthly contribution
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <div className="p-4 bg-zinc-950/80 rounded-[1.5rem] border border-white/5 shadow-xl group-hover:scale-105 transition-transform duration-500">
               <HeartPulse className={cn("w-10 h-10 drop-shadow-lg", totalAllocated > 0 ? "text-orange-500 animate-[pulse_3s_infinite]" : "text-zinc-800")} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 max-w-[140px] leading-tight">
               Your chosen impact is <span className="text-white italic">real</span>
            </p>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="h-4 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalAllocated / 50) * 100}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className={cn("h-full rounded-full shadow-lg relative", getProgressColor(totalAllocated))}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center px-1">
           <div className="flex items-center gap-1.5 opacity-60">
              <Info className={cn("w-3.5 h-3.5", getStatusTextColor(totalAllocated))} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                {totalAllocated <= 25 ? 'Room to add more' : totalAllocated <= 40 ? 'Nearly maximized' : 'Fully allocated'}
              </p>
           </div>
           <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">Target 50%</span>
        </div>
      </div>
    </div>
  );
};
