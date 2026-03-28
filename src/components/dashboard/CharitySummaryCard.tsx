'use client';

import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CharitySummaryCardProps {
  charities: any[];
  subscriptionAmount: number; // in pence
  loading?: boolean;
}

export default function CharitySummaryCard({
  charities,
  subscriptionAmount,
  loading = false,
}: CharitySummaryCardProps) {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 animate-pulse shadow-sm">
        <div className="h-6 w-48 bg-white/5 rounded-lg mb-6" />
        <div className="space-y-4 mb-10">
            {[1,2].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-14 w-full bg-white/5 rounded-xl" />
      </div>
    );
  }

  const hasCharities = charities && charities.length > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-14 transition-all duration-700 relative overflow-hidden group shadow-2xl h-full flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[120px] pointer-events-none transition-all duration-1000 group-hover:opacity-20" />
      
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner text-rose-500 group-hover:bg-white group-hover:text-rose-600 transition-all duration-500">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 leading-none italic">Impact Summary</h3>
            <h4 className="text-2xl font-serif italic tracking-tighter text-white leading-none">Your Missions.</h4>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 mb-12 relative z-10">
        {hasCharities ? (
          charities.map((item, i) => {
            const amount = (subscriptionAmount * item.allocation_perc) / 100 / 100;
            return (
              <div key={i} className="bg-white/5 border border-white/10 hover:bg-white hover:border-white rounded-[2rem] p-6 lg:p-8 flex items-center justify-between group/item transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-black/20">
                <div className="flex items-center gap-6">
                  <div className="w-2 h-10 bg-rose-500/20 rounded-full group-hover/item:h-12 group-hover/item:bg-rose-500 transition-all duration-500" />
                  <div>
                    <h5 className="text-base font-bold text-white mb-1 group-hover/item:text-slate-900 transition-colors uppercase tracking-tight line-clamp-1 italic">{item.charity?.name || 'Assigned Charity'}</h5>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic group-hover/item:text-slate-500">Allocation: {item.allocation_perc}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-serif italic text-rose-500 tracking-tighter group-hover/item:text-rose-600">${amount.toFixed(2)}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20 leading-none group-hover/item:text-slate-400">Monthly</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 space-y-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] group-hover:border-white/10 transition-colors">
            <div className="w-20 h-20 rounded-full bg-white/5 shadow-2xl flex items-center justify-center text-white/10 border border-white/5">
                <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2 px-12">
               <p className="text-base font-bold text-white tracking-tight">Choose your purpose.</p>
               <p className="text-sm font-medium text-white/20 italic leading-relaxed">You haven't selected any charities to support yet.</p>
            </div>
          </div>
        )}
      </div>

      <Link 
        href="/dashboard/charities"
        className="mt-auto w-full inline-flex items-center justify-center gap-4 bg-white hover:bg-accent text-slate-900 hover:text-white px-8 py-5 rounded-[1.5rem] font-black tracking-[0.2em] text-[10px] uppercase transition-all shadow-2xl shadow-black/20 group/link"
      >
        {hasCharities ? 'Manage Allocations' : 'Select Charities'}
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
