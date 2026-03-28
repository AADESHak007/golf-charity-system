"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  CreditCard, 
  Trophy, 
  Heart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/admin/StatsCard";
import { RevenueChart, SubscriberChart } from "@/components/admin/Charts";
import { ApiResponse } from "@/types";

interface AdminStats {
  users: {
    total: number;
    active_subscribers: number;
    new_this_month: number;
    churn_this_month: number;
  };
  revenue: {
    total_this_month_pence: number;
    total_all_time_pence: number;
    prize_pool_distributed_pence: number;
    charity_distributed_pence: number;
  };
  draws: {
    total_published: number;
    last_draw_date: string | null;
    next_draw_date: string;
    next_draw_status: string;
    current_jackpot_pence: number;
  };
  winners: {
    pending_verification: number;
    pending_payment: number;
    paid_this_month: number;
  };
  charts: {
    revenue: { month: string; revenue: number }[];
    subscribers: { date: string; subscribers: number }[];
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json() as ApiResponse<AdminStats>;
        if (json.success && json.data) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Countdown clock effect
  useEffect(() => {
    if (!stats?.draws.next_draw_date) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(stats.draws.next_draw_date);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("DRAWING...");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [stats?.draws.next_draw_date]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="text-indigo-600 animate-spin" size={40} />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Powering Up Metrics...</p>
      </div>
    );
  }

  if (!stats) return <div>Failed to load stats</div>;

  const currentRevenuePounds = stats.revenue.total_this_month_pence / 100;
  const jackpotPounds = stats.draws.current_jackpot_pence / 100;
  const charityPounds = stats.revenue.charity_distributed_pence / 100;

  return (
    <div className="space-y-12 pb-24">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 italic tracking-tighter mb-4">Dashboard Overview.</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic">Platform performance at a glance. Updated today.</p>
        </div>
        <div className="flex items-center gap-4 px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm group hover:border-indigo-100 transition-all">
           <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-all shadow-inner">
             <Calendar size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1.5 italic">Next Draw In</p>
              <p className="text-lg font-serif italic text-slate-900 leading-none">{countdown || 'Calculating...'}</p>
           </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          title="Total Subscribers" 
          value={stats.users.active_subscribers} 
          change={`+${stats.users.new_this_month}`}
          changeType="positive"
          icon={Users}
          subtext={`of ${stats.users.total} total`}
          className="border-slate-100 bg-white"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`$${currentRevenuePounds.toLocaleString()}`} 
          change="8.2%"
          changeType="positive"
          icon={CreditCard}
          subtext="Converted to GBP"
          className="border-slate-100 bg-white"
        />
        <StatsCard 
          title="Charity Impact" 
          value={`$${charityPounds.toLocaleString()}`} 
          change="12%"
          changeType="positive"
          icon={Heart}
          subtext="Donated to date"
          className="border-slate-100 bg-white"
        />
        <StatsCard 
          title="Current Jackpot" 
          value={`$${jackpotPounds.toLocaleString()}`} 
          changeType="neutral"
          icon={Trophy}
          subtext="Available next draw"
          className="border-slate-100 bg-white"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)] transition-all duration-1000">
            <div className="flex items-baseline justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-serif italic text-slate-900 flex items-center gap-3 mb-2">
                    Revenue Trend
                    <TrendingUp className="text-indigo-400" size={20} />
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Monthly platform revenue growth.</p>
               </div>
               <select className="bg-slate-50 border-none rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest outline-none px-4 py-2 hover:bg-slate-100 transition-colors cursor-pointer">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
               </select>
            </div>
            {/* Height-stable wrapper for Recharts */}
            <div className="h-[350px] w-full min-h-[350px]">
                <RevenueChart data={stats.charts.revenue} />
            </div>
         </div>

         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.02)] group hover:shadow-[0_40px_80px_rgba(0,0,0,0.04)] transition-all duration-1000">
            <div className="flex items-baseline justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-serif italic text-slate-900 mb-2">User Growth.</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Subscription lifecycle tracking.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic group-hover:text-indigo-500 transition-colors">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                     Subscribers
                  </div>
               </div>
            </div>
            {/* Height-stable wrapper for Recharts */}
            <div className="h-[350px] w-full min-h-[350px]">
                <SubscriberChart data={stats.charts.subscribers} />
            </div>
         </div>
      </div>

      {/* Bottom Section: Verification Queue & Recent Winners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Quick Verification Panel */}
          <div className="lg:col-span-8 bg-[#050810] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl group">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
             
             <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-700">
                        <Trophy size={32} />
                      </div>
                      <h3 className="text-3xl font-serif italic tracking-tight">Winners Queue.</h3>
                   </div>
                   <p className="text-slate-400 text-sm font-medium leading-loose mb-10 max-w-lg italic">
                     Manage the monthly payout pipeline. Currently <span className="text-white font-bold">{stats.winners.pending_verification + stats.winners.pending_payment} entries</span> require administrative verification.
                   </p>
                   
                   <div className="flex flex-wrap gap-6">
                      <div className="bg-white/5 border border-white/5 px-8 py-6 rounded-[2rem] flex-1 min-w-[180px] group/item hover:bg-white/[0.08] transition-all">
                         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 italic">
                            <Clock size={14} className="group-hover/item:text-indigo-400 transition-colors" />
                            Awaiting Proof
                         </div>
                         <p className="text-3xl font-serif italic">{stats.winners.pending_verification}</p>
                      </div>
                      <div className="bg-white/5 border border-white/5 px-8 py-6 rounded-[2rem] flex-1 min-w-[180px] group/item hover:bg-white/[0.08] transition-all">
                         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 italic">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                            Approved
                         </div>
                         <p className="text-3xl font-serif italic text-emerald-400">{stats.winners.pending_payment}</p>
                      </div>
                   </div>
                </div>

                <div className="shrink-0 w-full xl:w-auto">
                  <Link 
                    href="/admin/winners"
                    className="flex items-center justify-center gap-4 bg-white text-slate-900 font-black px-12 py-7 rounded-[2.5rem] text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
                  >
                    Go to Queue
                    <ArrowUpRight className="w-5 h-5 flex-shrink-0" />
                  </Link>
                </div>
             </div>
          </div>

          {/* Quick Actions / Activity Callout */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-[3rem] p-12 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-8 shadow-sm border border-slate-50 group hover:text-indigo-500 transition-colors">
                <ExternalLink size={24} className="group-hover:rotate-12 transition-transform" />
              </div>
              <h3 className="text-2xl font-serif italic text-slate-900 mb-2">Operations.</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic mb-10">Management modules.</p>
              
              <div className="w-full flex flex-col gap-4">
                 <Link href="/admin/users" className="w-full py-5 px-8 bg-white border border-slate-100 hover:border-indigo-100 rounded-2xl text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center justify-between group transition-all shadow-sm">
                    <span>Manage Users</span>
                    <Users size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                 </Link>
                 <Link href="/admin/charities" className="w-full py-5 px-8 bg-white border border-slate-100 hover:border-rose-100 rounded-2xl text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center justify-between group transition-all shadow-sm">
                    <span>Charity Impact</span>
                    <Heart size={18} className="text-slate-300 group-hover:text-rose-600 transition-all" />
                 </Link>
                 <Link href="/admin/draws" className="w-full py-5 px-8 bg-white border border-slate-100 hover:border-amber-100 rounded-2xl text-slate-900 text-xs font-bold uppercase tracking-widest flex items-center justify-between group transition-all shadow-sm">
                    <span>Draw Engine</span>
                    <TrendingUp size={18} className="text-slate-300 group-hover:text-amber-600 transition-all" />
                 </Link>
              </div>
          </div>
      </div>
    </div>
  );
}
