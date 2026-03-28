'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock, CreditCard, Loader2, Sparkles, HeartPulse, Plus, X, Info, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types';
import Link from 'next/link';

interface CharityProfileClientProps {
  charityId: string;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  currentSupport: { allocation_perc: number } | null;
  totalAllocated: number;
  currentCount: number;
}

export const CharityProfileClient = ({ 
  charityId, 
  isLoggedIn, 
  isSubscribed, 
  currentSupport,
  totalAllocated,
  currentCount
}: CharityProfileClientProps) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [allocation, setAllocation] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingMax = 50 - totalAllocated;

  const handleAdd = async () => {
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }
    
    if (!isSubscribed) return;

    if (totalAllocated + allocation > 50) {
      setError('Total allocation across all charities cannot exceed 50%');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId, allocation_perc: allocation }),
      });
      
      const result: ApiResponse = await response.json();
      if (result.success) {
        setIsAdding(false);
        router.refresh();
      } else {
        setError(result.error || 'Failed to add charity');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
       <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] shadow-2xl space-y-8 text-center">
          <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-slate-800 mx-auto flex items-center justify-center shadow-xl">
             <Lock className="w-8 h-8 text-slate-600" />
          </div>
          <div className="space-y-2">
             <h3 className="text-2xl font-serif italic text-white tracking-tighter">Support Locked.</h3>
             <p className="text-[13px] font-medium text-slate-400 leading-relaxed italic">
               Please sign in to your Digital Heroes account to choose your supported causes.
             </p>
          </div>
          <button 
            onClick={() => router.push('/auth')}
            className="w-full py-5 bg-white hover:bg-slate-200 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-[2rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            Sign In to Select
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
       </div>
    );
  }

  if (!isSubscribed) {
    return (
       <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] shadow-2xl space-y-8 text-center">
          <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-slate-800 mx-auto flex items-center justify-center shadow-xl">
             <CreditCard className="w-8 h-8 text-slate-600" />
          </div>
          <div className="space-y-2">
             <h3 className="text-2xl font-serif italic text-white tracking-tighter">Subscription Required.</h3>
             <p className="text-[13px] font-medium text-slate-400 leading-relaxed italic">
                Unlock charitable giving by becoming a Digital Heroes member. 10% to 50% of your fee goes directly to causes.
             </p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full py-5 bg-white hover:bg-slate-200 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-[2rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            Upgrade to Support
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
       </div>
    );
  }

  return (
    <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] pointer-events-none rounded-full" />
       
       <div className="space-y-2 relative z-10">
          <h2 className="text-3xl font-serif italic tracking-tighter text-white leading-none">Impact Support.</h2>
          <p className="text-[13px] text-slate-400 font-medium italic">Choose how much weight you give this mission.</p>
       </div>

       <div className="h-px w-full bg-slate-800" />

       <div className="relative z-10">
          {currentSupport ? (
            <div className="space-y-8">
              <div className="p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20 text-accent space-y-4 text-center shadow-2xl">
                 <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                 <div className="space-y-1">
                    <h3 className="text-2xl font-serif italic tracking-tighter leading-none text-white">Selected Process.</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mt-2">Supporting at {currentSupport.allocation_perc}%</p>
                 </div>
                 <div className="h-px w-1/3 mx-auto bg-accent/20 mt-4" />
                 <p className="text-[10px] text-slate-300 font-bold tracking-widest leading-relaxed uppercase opacity-70">
                    You're contributing to this mission in real-time. Manage your balance in the dashboard.
                 </p>
              </div>
              <Link 
                href="/dashboard" 
                className="w-full py-5 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] border border-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ) : isAdding ? (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-8"
            >
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <span className="text-5xl font-black text-white">{allocation}%</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Allocation</span>
                  </div>
                   <input
                    type="range"
                    min={10}
                    max={Math.min(50, remainingMax)}
                    step={5}
                    value={allocation}
                    onChange={(e) => setAllocation(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Min 10%</span>
                    <span>Max {Math.min(50, remainingMax)}%</span>
                  </div>
               </div>

               {error && (
                 <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
                    <X className="w-4 h-4 text-rose-500" />
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight leading-tight">{error}</p>
                 </div>
               )}

               <div className="flex gap-4">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-shrink-0 p-5 rounded-[1.5rem] bg-slate-950 text-slate-500 hover:text-white border border-slate-800 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="flex-1 py-5 bg-white hover:bg-slate-200 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-xl transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Confirm Selection'}
                  </button>
               </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
               <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4 text-center">
                  <HeartPulse className="w-12 h-12 text-white fill-white/20 mx-auto" />
                  <p className="text-[13px] italic font-medium text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                     {currentCount >= 2 
                       ? "You've already reached your 2-charity limit. Manage your causes in the dashboard."
                       : "Support this charity by allocating part of your monthly contribution fee."}
                  </p>
               </div>
               
               {currentCount < 2 ? (
                 <button
                  onClick={() => setIsAdding(true)}
                  className="w-full h-24 bg-white hover:bg-slate-200 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
                 >
                   <Plus className="w-5 h-5 flex-shrink-0" />
                   Add to My Causes
                 </button>
               ) : (
                 <Link 
                   href="/dashboard" 
                   className="w-full py-5 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] border border-slate-800 transition-all flex items-center justify-center gap-2"
                 >
                   Manage My Causes
                   <ExternalLink className="w-4 h-4" />
                 </Link>
               )}
            </div>
          )}
       </div>

       <div className="pt-8 flex flex-col items-center gap-4 text-center relative z-10">
          <div className="p-5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 shadow-xl">
             <HeartPulse className="w-8 h-8 fill-slate-800 animate-[pulse_3s_infinite]" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-relaxed max-w-[220px]">
             Your choice directly funds this mission every single month.
          </p>
       </div>
    </div>
  );
};
