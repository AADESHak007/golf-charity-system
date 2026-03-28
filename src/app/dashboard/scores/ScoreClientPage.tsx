'use client';

import { useState, useEffect } from 'react';
import { ScoreForm } from '@/components/scores/ScoreForm';
import { ScoreList } from '@/components/scores/ScoreList';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ApiResponse, Subscription } from '@/types';

interface Score {
  id: string;
  score: number;
  played_at: string;
  created_at: string;
}

export const ScoreClientPage = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch scores
        const scoresRes = await fetch('/api/scores');
        const scoresData: ApiResponse<Score[]> = await scoresRes.json();
        
        // 2. Fetch subscription
        const subRes = await fetch('/api/subscriptions/me');
        const subData: ApiResponse<Subscription> = await subRes.json();

        if (scoresData.success) {
            setScores(scoresData.data || []);
        }
        
        if (subData.success && subData.data?.status === 'active') {
            setIsSubscribed(true);
        }

      } catch (err) {
        setError("Failed to synchronize score data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleScoreUpdate = (updatedList: Score[]) => {
    setScores(updatedList);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/scores/${id}`, {
        method: 'DELETE',
      });
      const result: ApiResponse = await response.json();
      if (result.success) {
        setScores((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(result.error || 'Failed to delete score');
      }
    } catch (err) {
      console.error('Delete score error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] italic">Syncing scoreboard...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-[3rem] text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Connection Error</h3>
            <p className="text-rose-400 font-medium">{error}</p>
        </div>
    );
  }

  if (!isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-12 p-12 bg-slate-900 border border-slate-800 shadow-2xl rounded-[3rem] text-center space-y-8"
      >
        <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white shadow-inner">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-serif italic text-white tracking-tighter leading-tight">Subscriber Exclusive.</h2>
          <p className="text-white/40 text-[13px] max-w-sm mx-auto font-medium leading-relaxed italic">
            Only active subscribers can track and manage their rolling-5 golf score history.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-4 w-full max-w-sm px-10 py-5 bg-white hover:bg-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-[1.5rem] transition-all shadow-xl shadow-black/20 group"
        >
          <CreditCard className="w-5 h-5 flex-shrink-0" />
          <span>Subscribe Now</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col items-center gap-4">
          <div className="h-1 lg:w-32 bg-slate-100 rounded-full overflow-hidden">
             <div 
                className="h-full bg-slate-900 transition-all duration-1000" 
                style={{ width: `${(scores.length / 5) * 100}%` }}
             />
          </div>
          <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
            {scores.length} of 5 scores entered
          </h3>
      </div>

      <div className="space-y-20">
        <section>
          <ScoreForm currentCount={scores.length} onSuccess={handleScoreUpdate} />
        </section>

        <section>
          <ScoreList scores={scores} onDelete={handleDelete} />
        </section>
      </div>
    </div>
  );
};
