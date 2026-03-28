'use client';

import { Trophy, Calendar, Eye, ArrowRight, Ticket, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecentDrawCardProps {
  draw: any;
  loading?: boolean;
}

export default function RecentDrawCard({ draw, loading = false }: RecentDrawCardProps) {
  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 animate-pulse shadow-sm">
        <div className="h-6 w-32 bg-slate-50 rounded-lg mb-8" />
        <div className="flex gap-3 mb-10">
            {[1,2,3,4,5].map(i => <div key={i} className="w-12 h-12 rounded-full bg-slate-50" />)}
        </div>
        <div className="h-14 w-full bg-slate-50 rounded-xl" />
      </div>
    );
  }

  if (!draw) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group transition-all hover:border-slate-200 shadow-sm h-full">
        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500 shadow-sm">
          <Calendar className="w-10 h-10 text-slate-300 group-hover:text-accent transition-colors" />
        </div>
        <h3 className="text-2xl font-serif italic tracking-tighter text-slate-900 mb-2">Patience, Player.</h3>
        <p className="text-sm font-medium text-slate-400 mb-8 max-w-[200px] leading-relaxed">The next grand draw is currently being prepared.</p>
        <Link 
            href="/dashboard/draws" 
            className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-slate-900 transition-colors"
        >
            View Schedule
        </Link>
      </div>
    );
  }

  const drawDate = new Date(draw.draw_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const myEntry = draw.myEntry;
  const matchCount = myEntry?.match_count || 0;
  const prizeAmount = myEntry?.prize_amount_pence / 100 || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group hover:border-slate-700 transition-all duration-700 shadow-2xl flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[120px] pointer-events-none transition-all duration-1000 group-hover:opacity-20" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center text-accent group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
               <Ticket className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 leading-none mb-2 italic">Event Logic</h3>
               <h4 className="text-xl font-serif italic tracking-tighter text-white leading-none">Latest Call.</h4>
            </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{drawDate}</span>
      </div>

      <div className="flex flex-wrap gap-4 mb-12 relative z-10">
        {draw.drawn_numbers.map((num: number, i: number) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
               "w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 flex items-center justify-center text-lg lg:text-xl font-serif italic shadow-sm transition-all duration-500",
               myEntry?.matched_numbers?.includes(num)
                ? 'bg-accent border-accent text-white shadow-xl shadow-accent/30 scale-110'
                : 'bg-white/5 border-white/10 text-white/80 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white'
            )}
          >
            {num}
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 relative z-10">
        {myEntry ? (
            <div className={cn(
               "p-8 rounded-[2rem] border transition-all duration-500",
               matchCount >= 3 ? 'bg-accent/10 border-accent/20 shadow-xl' : 'bg-white/5 border-white/10'
            )}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 leading-none italic">Discovery</p>
                        <p className="text-xl font-serif italic text-white tracking-tighter leading-none">{matchCount} Matches Verified</p>
                    </div>
                    {matchCount >= 3 && (
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 leading-none italic">Settlement</p>
                            <p className="text-3xl font-serif italic tracking-tighter text-accent leading-none">${prizeAmount.toFixed(2)}</p>
                        </div>
                    )}
                </div>
                <p className="text-xs font-bold text-white/20 mt-6 leading-relaxed italic border-t border-white/5 pt-4">
                    {matchCount >= 3 ? "Congratulations! Your claim is being processed." : "Every contribution counts toward the mission."}
                </p>
            </div>
        ) : (
            <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 group-hover:border-white/10 transition-all">
                <Sparkles className="w-6 h-6 text-white/10" />
                <p className="text-xs font-black text-white/30 tracking-widest uppercase italic leading-none">No entry detected.</p>
                <p className="text-[10px] text-white/20 italic font-medium leading-relaxed">Participation requirements not met for this pulse.</p>
            </div>
        )}

        <Link 
          href="/dashboard/draws"
          className="w-full inline-flex items-center justify-center gap-4 bg-white hover:bg-accent text-slate-900 hover:text-white px-8 py-5 rounded-[1.5rem] font-black tracking-[0.2em] text-[10px] uppercase transition-all shadow-2xl shadow-black/20 group/link"
        >
          Explore History
          <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
