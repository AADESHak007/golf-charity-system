"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  User as UserIcon, 
  Calendar, 
  AlertCircle, 
  Slash, 
  Trash2, 
  Loader2,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Activity,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function SubscriptionsManagementPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/subscriptions?page=${page}&status=${statusFilter}`);
      const json = await res.json() as ApiResponse<{ subscriptions: any[], total: number }>;
      if (json.success && json.data) {
        setSubs(json.data.subscriptions);
        setTotal(json.data.total);
      }
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const handleUpdateStatus = async (subId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    try {
       const res = await fetch('/api/admin/subscriptions', {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ subscription_id: subId, status: newStatus })
       });
       if (res.ok) fetchSubs();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Stats Dashboard Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-xl shadow-slate-200 border border-slate-800">
                <CreditCard size={28} />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit uppercase">Subscribers</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage financial lifecycles, active recurring plans, and platform revenue continuity.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="flex flex-col text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Monthly Burn</p>
                 <p className="text-xl font-black text-green-600 leading-none">$8,240.00</p>
              </div>
              <div className="w-px h-10 bg-slate-100"></div>
              <Activity size={24} className="text-green-400" />
           </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="Filter by customer identity..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400 font-outfit"
            />
         </div>
         <div className="flex items-center gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
               {['all', 'active', 'cancelled', 'past_due'].map(s => (
                  <button 
                    key={s}
                    onClick={() => { setStatusFilter(s); setPage(1); }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      statusFilter === s ? "bg-white text-indigo-600 shadow-sm border border-slate-100 font-black" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {s.split('_')[0]}
                  </button>
               ))}
            </div>
            <button className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
               <Download size={20} />
            </button>
         </div>
      </div>

      {/* Subscriptions Ledger */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative">
         {loading ? (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center min-h-[400px]">
               <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
         ) : subs.length > 0 ? (
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-100">
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Identity</th>
                     <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recurring Strategy</th>
                     <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lifecycle</th>
                     <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next Ledger Event</th>
                     <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {subs.map((sub) => (
                     <tr key={sub.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform duration-300">
                                 {sub.users?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">{sub.users?.name}</span>
                                 <span className="text-[10px] font-bold text-slate-400 opacity-60 italic">{sub.users?.email}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{sub.subscription_plans?.name}</span>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                 <DollarSign size={10} className="text-green-500" />
                                 ${(sub.subscription_plans?.price_pence / 100).toLocaleString()} / {sub.subscription_plans?.interval}
                              </p>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                              sub.status === 'active' ? "bg-green-50 text-green-700 border-green-100" : 
                              sub.status === 'past_due' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-red-50 text-red-600 border-red-100"
                           )}>
                              {sub.status === 'active' ? <Lock size={12} className="opacity-50" /> : <TrendingDown size={12} />}
                              {sub.status.split('_').join(' ')}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900 leading-none mb-1 italic">{sub.current_period_end ? format(new Date(sub.current_period_end), 'MMM d, yyyy') : 'N/A'}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billing Cycle Renewal</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              {sub.status === 'active' && (
                                 <button 
                                   onClick={() => handleUpdateStatus(sub.stripe_subscription_id, 'cancelled')}
                                   className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-slate-100"
                                 >
                                    <Slash size={18} />
                                 </button>
                              )}
                              <Link 
                                 href={`/admin/users/${sub.user_id}`}
                                 className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl transition-all shadow-sm"
                              >
                                 <ExternalLink size={18} />
                              </Link>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-4 italic font-medium">
               <Activity size={48} strokeWidth={1} />
               <p>No financial subscription records found for this registry.</p>
            </div>
         )}

         {/* Pagination Ledger Control */}
         {!loading && subs.length > 0 && (
            <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-white/50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Displaying {subs.length} Financial Records</p>
               <div className="flex gap-2">
                  <button 
                     disabled={page === 1}
                     onClick={() => setPage(p => p - 1)}
                     className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button 
                     disabled={subs.length < 20}
                     onClick={() => setPage(p => p + 1)}
                     className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
