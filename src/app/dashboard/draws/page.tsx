'use client';

import { useEffect, useState } from 'react';
import { Trophy, Calendar, Target, Ticket, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DrawsPage() {
  const [data, setData] = useState<any>({
    draws: [],
    subscription: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            const [drawsRes, subRes] = await Promise.all([
                fetch('/api/draws').then(r => r.json()),
                fetch('/api/subscriptions/me').then(r => r.json())
            ]);
            setData({
                draws: drawsRes.success ? drawsRes.data : [],
                subscription: subRes.success ? subRes.data : null
            });
        } catch (err) {
            console.error('Failed to fetch draws', err);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1,2,3].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 animate-pulse h-64" />
        ))}
      </div>
    );
  }

  const isSubscribed = data.subscription?.status === 'active';

  if (!isSubscribed) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-2xl mx-auto space-y-8">
            <div className="w-24 h-24 rounded-[2rem] bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400 rotate-12">
                <Ticket className="w-12 h-12" />
            </div>
            <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-white">Draw History Locked</h2>
                <p className="text-gray-400 text-lg font-medium">To see published draw results and your performance across different months, you must have an active subscription.</p>
            </div>
            <Link 
                href="/pricing"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
                Get Subscription Access
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-2">
          <div>
              <h2 className="text-3xl font-black tracking-tight text-white mb-2">Monthly Draw History</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Showing results for all published draws
              </p>
          </div>
      </div>

      <div className="space-y-6">
        {data.draws.length > 0 ? (
            data.draws.map((draw: any, idx: number) => {
                const myEntry = draw.myEntry;
                const matchCount = myEntry?.match_count || 0;
                const prizeAmount = myEntry?.prize_amount_pence / 100 || 0;
                
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={draw.id} 
                        className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[120px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Left: Draw Info */}
                            <div className="lg:w-1/3 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Draw Date</p>
                                    <h3 className="text-3xl font-black text-white">{new Date(draw.draw_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
                                    <p className="text-xs font-bold text-gray-500">Ref: #{draw.id.slice(0,8).toUpperCase()}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Official Result</p>
                                    <div className="flex flex-wrap gap-2 text-white">
                                        {draw.drawn_numbers.map((num: number, i: number) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black">
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Center: My Result */}
                            <div className="lg:w-1/3 flex flex-col justify-center gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Your Entries</p>
                                    <div className="flex flex-wrap gap-2">
                                        {myEntry?.scores_snapshot?.map((score: number, i: number) => {
                                            const isMatch = draw.drawn_numbers.includes(score);
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black transition-all ${
                                                        isMatch 
                                                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                                                        : 'bg-white/5 border-white/10 text-gray-400'
                                                    }`}
                                                >
                                                    {score}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`px-4 py-2 rounded-full border font-black text-xs uppercase tracking-widest flex items-center gap-1.5 ${
                                        matchCount >= 3 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-500 border-white/10'
                                    }`}>
                                        {matchCount} Match {matchCount >= 3 && <Trophy className="w-3 h-3" />}
                                    </div>
                                    {matchCount >= 3 && (
                                        <div className="text-emerald-400 font-black tracking-tight">
                                            ${prizeAmount.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Payment Status */}
                            <div className="lg:w-1/3 flex flex-col justify-center items-lg-end lg:text-right gap-4">
                                {matchCount >= 3 ? (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Prize Status</p>
                                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl font-bold text-sm">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Verified & Paid
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Outcome</p>
                                        <div className="inline-flex items-center gap-2 bg-white/5 text-gray-500 border border-white/10 px-4 py-2 rounded-xl font-bold text-sm">
                                            <XCircle className="w-4 h-4" />
                                            No Match
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })
        ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                    <Trophy className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">No history yet</h3>
                    <p className="text-gray-500 font-medium">Draw results will appear here once they are published.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
