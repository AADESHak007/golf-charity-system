"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Calendar as CalendarIcon, 
  PlayCircle, 
  MoreVertical, 
  ExternalLink, 
  Loader2,
  TrendingUp,
  CreditCard,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { format } from "date-fns";
import { DrawSimulator } from "@/components/admin/DrawSimulator";
import { Draw, ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function DrawsManagementPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_lifetime_payouts_pence: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDraws = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/draws?page=${page}`);
      const json = await res.json() as ApiResponse<{ draws: any[], total: number, stats: any }>;
      if (json.success && json.data) {
        setDraws(json.data.draws);
        setTotal(json.data.total);
        if (json.data.stats) setStats(json.data.stats);
      }
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                <Trophy size={28} />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit uppercase">Draw Engine</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-lg">Execute simulations and manage the monthly lottery lifecycle. All results are immutable once published.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
           <div className="flex flex-col text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Lifetime Payouts</p>
              <p className="text-xl font-black text-indigo-600 leading-none">${(stats.total_lifetime_payouts_pence / 100).toLocaleString()}.00</p>
           </div>
           <div className="w-px h-10 bg-slate-100"></div>
           <TrendingUp size={24} className="text-indigo-400" />
        </div>
      </div>

      {/* Simulator Section */}
      <DrawSimulator />

      {/* History List */}
      <div className="space-y-8">
         <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic border-l-4 border-l-indigo-600 pl-4">Historical Journal</h2>
            <div className="flex items-center gap-2">
               <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Search size={18} />
               </button>
               <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <Filter size={18} />
               </button>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm relative">
            {loading ? (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center min-h-[400px]">
                  <Loader2 className="animate-spin text-indigo-600" size={40} />
               </div>
            ) : draws.length > 0 ? (
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-slate-100">
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Winning Numbers</th>
                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Engine</th>
                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Lifecycle</th>
                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Winners & Payout</th>
                        <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Details</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {draws.map((draw) => (
                        <tr key={draw.id} className="group hover:bg-slate-50 transition-colors">
                           <td className="px-10 py-7">
                              <div className="flex gap-2">
                                 {draw.drawn_numbers ? (
                                    draw.drawn_numbers.map((n: number, idx: number) => (
                                       <span key={idx} className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 text-[10px] flex items-center justify-center font-black border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-105 duration-300">
                                          {n}
                                       </span>
                                    ))
                                 ) : (
                                    <span className="text-xs font-bold text-slate-300 italic">No Numbers Generated</span>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-7">
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">{format(new Date(draw.draw_date), 'PPP')}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 italic">
                                    <LayoutDashboard size={10} />
                                    {draw.draw_mode.replace('_', ' ')} logic
                                 </span>
                              </div>
                           </td>
                           <td className="px-8 py-7 text-center">
                              <div className={cn(
                                 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                 draw.status === 'published' ? "bg-green-50 text-green-700 border-green-100 shadow-sm" : 
                                 draw.status === 'simulated' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-white text-slate-400 border-slate-200"
                              )}>
                                 {draw.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                 {draw.status}
                              </div>
                           </td>
                           <td className="px-8 py-7">
                              <div className="flex items-center gap-4">
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900 leading-none">{draw.winner_count?.[0]?.count || 0} Winners</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Participant Tiers</span>
                                 </div>
                                 <div className="w-px h-8 bg-slate-100"></div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black text-indigo-600 leading-none">${(draw.total_prize_pool_pence / 100).toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Total Pool</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-7 text-right">
                              <Link 
                                 href={`/admin/draws/${draw.id}`}
                                 className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl transition-all inline-flex"
                              >
                                 <ExternalLink size={18} />
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-4 opacity-50 italic">
                  <CalendarIcon size={48} strokeWidth={1} />
                  <p>No historical draw data found in the journal.</p>
               </div>
            )}

            {/* Pagination Footer */}
            {!loading && draws.length > 0 && (
               <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-white">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Displaying {draws.length} Historical Records</p>
                  <div className="flex gap-3">
                     <button 
                       disabled={page === 1}
                       onClick={() => setPage(p => p - 1)}
                       className="px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-all disabled:opacity-30"
                     >
                        Previous
                     </button>
                     <button 
                       disabled={draws.length < 20}
                       onClick={() => setPage(p => p + 1)}
                       className="px-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-all disabled:opacity-30"
                     >
                        Next
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
