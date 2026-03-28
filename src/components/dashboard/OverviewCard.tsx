'use client';

import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OverviewCardProps {
  title: string;
  value: string | number;
  subText: string;
  icon: LucideIcon;
  color?: 'accent' | 'blue' | 'rose' | 'amber';
  loading?: boolean;
  variant?: 'light' | 'brand';
}

export default function OverviewCard({
  title,
  value,
  subText,
  icon: Icon,
  color = 'accent',
  loading = false,
  variant = 'light' // Default back to light as requested
}: OverviewCardProps) {
  
  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 animate-pulse shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="w-10 h-10 bg-slate-50 rounded-xl" />
           <div className="w-8 h-8 bg-slate-50 rounded-full" />
        </div>
        <div className="h-12 w-24 bg-slate-50 rounded-2xl mb-4" />
        <div className="h-4 w-40 bg-slate-50 rounded-lg" />
      </div>
    );
  }

  const isBrand = variant === 'brand';

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group p-10 rounded-[3rem] border transition-all duration-700 relative overflow-hidden shadow-[0_22px_70px_rgba(0,0,0,0.02)]",
        isBrand 
          ? "bg-slate-900 border-slate-800 text-white" 
          : "bg-white border-slate-100 text-slate-900 hover:bg-slate-900 hover:border-slate-800 hover:shadow-2xl"
      )}
    >
      {/* Brand Accent Overlay */}
      <div className={cn(
        "absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-10 transition-all duration-1000 pointer-events-none group-hover:opacity-25",
        color === 'accent' ? "bg-accent" : 
        color === 'blue' ? "bg-blue-500" :
        color === 'rose' ? "bg-rose-500" : "bg-amber-500"
      )} />

      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className={cn(
          "p-5 rounded-3xl transition-all duration-500 shadow-sm", 
          isBrand 
            ? "bg-white/5 border border-white/10 text-white group-hover:bg-accent group-hover:text-black" 
            : "bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-white group-hover:text-amber-900 group-hover:shadow-inner"
        )}>
          {/* Using custom conditions for icon colors in light mode to match the theme */}
          <Icon className={cn(
            "w-7 h-7",
            !isBrand && "group-hover:text-slate-900"
          )} />
        </div>
        <div className={cn(
           "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-45",
           isBrand ? "border-white/10 text-white/40" : "border-slate-100 text-slate-200 group-hover:text-white group-hover:border-white/20"
        )}>
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className={cn(
           "text-[10px] font-black uppercase tracking-[0.5em] mb-3 italic transition-colors",
           isBrand ? "text-white/30" : "text-slate-400 group-hover:text-white/40"
        )}>
          {title}
        </h3>
        <p className={cn(
           "text-5xl font-serif tabular-nums tracking-tighter italic transition-all duration-700 group-hover:translate-x-1",
           isBrand ? "text-white" : "text-slate-900 group-hover:text-white"
        )}>
          {value}
        </p>
        <div className="flex items-center gap-3 pt-4">
           <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-all",
              isBrand ? "bg-accent" : "bg-slate-200 group-hover:bg-accent"
           )} />
           <p className={cn(
              "text-xs font-bold tracking-tight leading-relaxed transition-colors italic",
              isBrand ? "text-white/20" : "text-slate-400 group-hover:text-white/20"
           )}>
             {subText}
           </p>
        </div>
      </div>
    </motion.div>
  );
}
