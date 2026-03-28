"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Download, 
  Loader2,
  Users,
  CreditCard,
  Target,
  ExternalLink,
  ShieldCheck,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { Draw, ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function DrawDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [draw, setDraw] = useState<any>(null);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch Draw Detail
      const res = await fetch(`/api/admin/draws/${id}`);
      const json = await res.json() as ApiResponse<any>;
      if (json.success && json.data) {
        setDraw(json.data.draw);
        setWinners(json.data.winners);
      }
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportWinnersCSV = () => {
    if (!winners.length) return;
    const headers = ["Winner", "Email", "Match Count", "Prize ($)", "Status"].join(",");
    const rows = winners.map(w => [
       w.user?.name,
       w.user?.email,
       w.match_count,
       (w.prize_amount_pence / 100),
       w.payment_status
    ].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `draw_winners_${draw.draw_date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Analyzing draw results & verified entries...</p>
       </div>
     );
  }

  if (!draw) return <div className="p-10 text-center">Draw not found</div>;

  return (
    <div className="space-y-10 pb-20">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
         <Link 
            href="/admin/draws"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold group transition-all"
         >
            <div className="p-2 border border-slate-200 rounded-xl group-hover:bg-slate-50 transition-colors">
               <ArrowLeft size={18} />
            </div>
            Back to Draw Journal
         </Link>
         <button 
           onClick={exportWinnersCSV}
           className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
         >
            <Download size={18} />
            Export Winners
         </button>
      </div>

      {/* Draw Identity & Numbers Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-transform duration-1000"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="shrink-0 flex flex-col items-center">
               <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] mb-4">
                  <Calendar size={48} className="text-indigo-400" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Official Draw Date</p>
               <h2 className="text-2xl font-black">{format(new Date(draw.draw_date), 'PPP')}</h2>
            </div>

            <div className="h-px md:h-24 w-full md:w-px bg-white/5"></div>

            <div className="flex-1 flex flex-col items-center md:items-start">
               <div className="flex items-center gap-3 mb-6">
                  <Target size={24} className="text-amber-400" />
                  <h3 className="text-3xl font-black tracking-tight uppercase font-outfit">Winning Numbers</h3>
               </div>
               <div className="flex flex-wrap gap-4">
                  {draw.drawn_numbers.map((n: number, i: number) => (
                     <div key={i} className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-900 text-2xl font-black shadow-xl border-4 border-white/10 group-hover:rotate-12 transition-all">
                        {n}
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-4">
               <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
                  <div className="flex flex-col">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Lottery Status</p>
                     <p className="text-sm font-black text-green-400 uppercase leading-none">Published</p>
                  </div>
                  <ShieldCheck size={20} className="text-green-500" />
               </div>
               <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-4">
                  <div className="flex flex-col">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Strategy Mode</p>
                     <p className="text-sm font-black text-indigo-400 uppercase leading-none">{draw.draw_mode.replace('_', ' ')}</p>
                  </div>
                  <Zap size={20} className="text-indigo-400" />
               </div>
            </div>
         </div>
      </div>

      {/* Prize Pool Breakdown & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Prize Pool</p>
               <h4 className="text-3xl font-black text-slate-900 leading-none">${(draw.total_prize_pool_pence / 100).toLocaleString()}</h4>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2 group">
               <CreditCard size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
               <span className="text-xs font-bold text-slate-400">Escrowed Funds</span>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Jackpot Distributed</p>
               <h4 className="text-3xl font-black text-slate-900 leading-none">${(draw.jackpot_pool_pence / 100).toLocaleString()}</h4>
               {draw.jackpot_carried_over && <span className="text-[9px] font-black text-amber-500 uppercase">Rollover Recorded</span>}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2 group">
               <Trophy size={18} className="text-amber-400 group-hover:rotate-12 transition-all" />
               <span className="text-xs font-bold text-slate-400">Top Tier Outcome</span>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Common Tiers (2 & 3)</p>
               <h4 className="text-3xl font-black text-slate-900 leading-none">${((draw.tier2_pool_pence + draw.tier3_pool_pence) / 100).toLocaleString()}</h4>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2 group">
               <Target size={18} className="text-indigo-400" />
               <span className="text-xs font-bold text-slate-400">Aggregated Payouts</span>
            </div>
         </div>
         <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100 text-white flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Total Winners</p>
               <h4 className="text-5xl font-black leading-none">{winners.length}</h4>
            </div>
            <div className="relative z-10 mt-8 pt-8 border-t border-indigo-500 flex items-center gap-2">
               <Users size={18} className="text-indigo-200" />
               <span className="text-xs font-bold text-indigo-100">Participant Matches</span>
            </div>
         </div>
      </div>

      {/* Recipients Table */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic border-l-4 border-l-indigo-600 pl-4">Verified Recipients</h3>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Draw #{draw.id.split('-')[0]} Log</div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
            {winners.length > 0 ? (
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-slate-50 bg-slate-50/50">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Match Accuracy</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Calculated Prize</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Lifecycle</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Reference</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {winners.map((winner: any) => (
                        <tr key={winner.id} className="group hover:bg-slate-50 transition-colors">
                           <td className="px-10 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    {winner.user?.name?.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">{winner.user?.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 opacity-60">{winner.user?.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-900 mb-1">{winner.match_count} Numbers</span>
                                 <div className="flex gap-1">
                                    {winner.matched_numbers.map((n: number) => (
                                       <span key={n} className="w-4 h-4 rounded-md bg-indigo-50 text-indigo-600 text-[8px] flex items-center justify-center font-black">
                                          {n}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <span className="text-base font-black text-slate-900">${(winner.prize_amount_pence / 100).toLocaleString()}</span>
                           </td>
                           <td className="px-8 py-5 text-center">
                              <div className={cn(
                                 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                 winner.payment_status === 'paid' ? "bg-green-50 text-green-700 border-green-100" : 
                                 winner.payment_status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-white text-slate-400 border-slate-200"
                              )}>
                                 {winner.payment_status}
                              </div>
                           </td>
                           <td className="px-10 py-5 text-right">
                              <Link 
                                 href={`/admin/users/${winner.user_id}`}
                                 className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl transition-all inline-flex group"
                              >
                                 <ExternalLink size={18} />
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div className="py-24 flex flex-col items-center justify-center bg-slate-50/50 text-slate-300 gap-4 italic font-medium">
                  <Target size={40} className="opacity-50" />
                  <p>No winners were generated in this draw lifecycle.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
