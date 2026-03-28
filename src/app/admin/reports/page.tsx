"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  Trophy, 
  Download, 
  Calendar, 
  Filter, 
  Loader2,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format } from "date-fns";
import { ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

interface ReportsData {
  monthly_revenue: { month: string; revenue_pence: number; subscriber_count: number }[];
  charity_contributions: { charity_name: string; total_pence: number; supporter_count: number }[];
  draw_statistics: { draw_date: string; total_winners: number; total_distributed_pence: number; jackpot_carried_over: boolean }[];
  score_distribution: { score: number; frequency: number }[];
  subscription_breakdown: { monthly_count: number; yearly_count: number; cancelled_count: number };
}

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("last_6_months");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?range=${timeRange}`);
      const json = await res.json() as ApiResponse<ReportsData>;
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportAllCSV = () => {
    if (!data) return;
    const headers = ["Category", "Metric", "Value"].join(",");
    const rows = [
       ["Revenue", "Total Month", data.monthly_revenue[data.monthly_revenue.length-1].revenue_pence / 100],
       ["Users", "Active Subscribers", data.subscription_breakdown.monthly_count],
       ...data.charity_contributions.map(c => ["Charity", c.charity_name, c.supporter_count])
    ].map(r => r.join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `platform_analytics_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="text-indigo-600 animate-spin" size={48} />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synthesizing platform analytical data...</p>
      </div>
    );
  }

  if (!data) return <div>Failed to load analytics</div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Analytics Header & Control */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                <BarChart3 size={28} />
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight font-outfit uppercase">Reports & Intelligence</h1>
          </div>
          <p className="text-slate-500 font-medium">Deep-dive into platform performance, user behavioral patterns, and charity impact metrics.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-3xl shadow-sm">
           <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
              {[
                { id: 'last_month', label: 'Last 30D' },
                { id: 'last_6_months', label: 'Last 6M' },
                { id: 'year', label: 'Past Year' }
              ].map(r => (
                 <button 
                  key={r.id}
                  onClick={() => setTimeRange(r.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeRange === r.id ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                  )}
                 >
                   {r.label}
                 </button>
              ))}
           </div>
           <button 
            onClick={exportAllCSV}
            className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
           >
              <Download size={18} />
           </button>
        </div>
      </div>

      {/* Grid: Financial & User Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Financial Trajectory</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Revenue Growth (Pence Converted)</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black">
                  <TrendingUp size={12} />
                  +12.4% MoM
               </div>
            </div>
            
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={data.monthly_revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.1} />
                           <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(v) => `$${v/100}`} />
                     <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                             return (
                               <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.month}</p>
                                  <p className="text-lg font-black leading-none">${(Number(payload[0].value) / 100).toLocaleString()}</p>
                               </div>
                             );
                          }
                          return null;
                        }}
                     />
                     <Area type="monotone" dataKey="revenue_pence" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#revenueGradient)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Subscriber Accumulation</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active vs Churned Net Lifecycle</p>
               </div>
            </div>

            <div className="h-[300px] w-full">
               <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={data.monthly_revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                     <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                     <Bar dataKey="subscriber_count" fill="#818cf8" radius={[8, 8, 0, 0]} barSize={24} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Score Histogram Column */}
      <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="relative z-10 space-y-10">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-black tracking-tight leading-none mb-2 font-outfit uppercase">Participant Score Intelligence</h3>
                  <p className="text-sm font-medium text-slate-400">Histogram display of all user golf scores (1 to 45 frequency distribution).</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="flex flex-col text-right">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Total Datapoints</p>
                     <p className="text-xl font-black">12,400</p>
                  </div>
                  <Users className="text-white/20" size={32} />
               </div>
            </div>

            <div className="h-[350px] w-full">
               <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={data.score_distribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                     <XAxis dataKey="score" axisLine={false} tickLine={false} tick={{ fill: '#ffffff50', fontSize: 10, fontWeight: 900 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff50', fontSize: 10, fontWeight: 900 }} />
                     <Tooltip 
                        cursor={{ fill: '#ffffff05' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                             return (
                               <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border border-white">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Value</p>
                                  <div className="flex items-end gap-2 mb-3">
                                     <span className="text-3xl font-black leading-none">{payload[0].payload.score}</span>
                                     <span className="text-xs font-bold text-slate-400 mb-1">Points</span>
                                  </div>
                                  <div className="h-px bg-slate-100 my-2"></div>
                                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Occurrence Count: {payload[0].value}</p>
                               </div>
                             );
                          }
                          return null;
                        }}
                     />
                     <Bar dataKey="frequency" fill="#6366f1" radius={[4, 4, 4, 4]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Bottom Row Tables: Charity Supporter & Draw History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Charity Supporter Matrix</h4>
               <Heart className="text-rose-400" size={24} />
            </div>
            <div className="space-y-4">
               {data.charity_contributions.length > 0 ? (
                  data.charity_contributions.map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-50 rounded-3xl hover:bg-white hover:border-slate-100 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-900 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                              {c.charity_name.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">{c.charity_name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.supporter_count} Active Patrons</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-slate-900">${(c.total_pence / 100).toLocaleString()}</p>
                           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono">Total Fund Value</p>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 rounded-3xl gap-4 italic font-medium">
                     <Heart size={40} strokeWidth={1.5} className="text-slate-300 opacity-50" />
                     <p>No active charity supporters matrix available.</p>
                  </div>
               )}
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Lottery Performance Log</h4>
               <Trophy className="text-amber-500" size={24} />
            </div>
            <div className="space-y-4">
               {data.draw_statistics.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-50 rounded-3xl group transition-all">
                     <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 leading-none mb-1">{format(new Date(d.draw_date), 'PPP')}</span>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                              "w-2 h-2 rounded-full shadow-sm shadow-green-100",
                              d.total_winners > 0 ? "bg-green-500" : "bg-slate-300"
                           )}></span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.total_winners} Distributed Prizes</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-black text-slate-900">${(d.total_distributed_pence / 100).toLocaleString()}</p>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest font-mono">Prize Pool Value</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
