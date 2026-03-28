"use client";

import { useState } from "react";
import { 
  Trophy, 
  Settings, 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { DrawMode, DrawSimulationResult } from "@/types";
import { cn } from "@/lib/utils";

const modes: { id: DrawMode; label: string; desc: string; icon: any }[] = [
  { id: 'random', label: 'Pure Random', desc: 'Standard uniform distribution across 1-45. Every number has an equal chance.', icon: Sparkles },
  { id: 'weighted_common', label: 'Market Hot', desc: 'Biased towards the most frequently played numbers in the current pool.', icon: TrendingUp },
  { id: 'weighted_rare', label: 'Market Cold', desc: 'Biased towards numbers rarely played or overdue for a win.', icon: Sparkles },
];

export function DrawSimulator() {
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [drawDate, setDrawDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [drawMode, setDrawMode] = useState<DrawMode>('random');
  const [simulation, setSimulation] = useState<DrawSimulationResult | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
       // Assuming POST /api/admin/draws/simulate
       const res = await fetch('/api/admin/draws/simulate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ draw_date: drawDate, draw_mode: drawMode })
       });
       const json = await res.json();
       if (json.success) {
         setSimulation(json.data);
       }
    } catch (error) {
       console.error(error);
    } finally {
       setLoading(false);
    }
  };

  const publishDraw = async () => {
    if (!simulation) return;
    setPublishing(true);
    try {
       const res = await fetch(`/api/admin/draws/publish`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ draw_id: simulation.draw_id })
       });
       const json = await res.json();
       if (json.success) {
         alert("Draw published successfully! Winners notified.");
         setSimulation(null);
       }
    } catch (error) {
       console.error(error);
    } finally {
       setPublishing(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Simulation Engine Controls */}
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-all duration-700"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row gap-10">
            {/* Main Config */}
            <div className="flex-1 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                     <Settings size={28} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Lottery Generator</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Configure & Run Predictions</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Calendar size={12} />
                        Official Draw Date
                     </label>
                     <input 
                        type="date"
                        className="w-full p-5 bg-slate-50 border-none rounded-3xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                        value={drawDate}
                        onChange={(e) => setDrawDate(e.target.value)}
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Layers size={12} />
                        Engine Logic
                     </label>
                     <div className="flex bg-slate-50 p-1.5 rounded-3xl border border-slate-100">
                        {modes.map(mode => (
                           <button 
                             key={mode.id}
                             onClick={() => setDrawMode(mode.id)}
                             className={cn(
                                "flex-1 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                drawMode === mode.id ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                             )}
                           >
                              {mode.label}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <p className="text-xs text-slate-400 font-medium italic border-l-2 border-indigo-200 pl-4 py-1">
                 {modes.find(m => m.id === drawMode)?.desc}
               </p>

               <button 
                  onClick={runSimulation}
                  disabled={loading}
                  className="w-full py-6 bg-slate-900 hover:bg-indigo-600 text-white text-base font-black rounded-[2rem] transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 group disabled:opacity-50"
               >
                  {loading ? (
                     <Loader2 size={24} className="animate-spin" />
                  ) : (
                     <>
                        <PlayCircle size={24} className="group-hover:translate-x-1 group-hover:rotate-12 transition-transform" />
                        Execute Calculation Engine
                     </>
                  )}
               </button>
            </div>

            {/* Results Preview (Sidebar style or inline) */}
            <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col items-center justify-center bg-indigo-50/50 rounded-[2.5rem] p-10 min-h-[400px] border border-indigo-100/50">
               {!simulation ? (
                  <div className="flex flex-col items-center text-center space-y-6">
                     <div className="w-24 h-24 bg-white/50 backdrop-blur shadow-xl rounded-[2rem] flex items-center justify-center text-slate-200 border border-white">
                        <Sparkles size={40} className="animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1 italic opacity-50 uppercase">Ready For Output</h4>
                        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Start Engine to see data preview</p>
                     </div>
                  </div>
               ) : (
                  <div className="w-full space-y-10 animate-in fade-in zoom-in-95 duration-500">
                     <div className="text-center">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Final Winning Combo</p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                           {simulation.drawn_numbers.map((n, i) => (
                              <div key={i} className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-2xl text-lg font-black shadow-lg shadow-indigo-200 border border-indigo-500 animate-in zoom-in slide-in-from-bottom-2 duration-500 delay-[200ms]">
                                 {n}
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                           <div className="flex items-center gap-3">
                              <Trophy size={18} className="text-amber-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Winners</span>
                           </div>
                           <span className="text-lg font-black text-slate-900">{simulation.winner_counts?.tier1 + simulation.winner_counts?.tier2 + simulation.winner_counts?.tier3}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                           <div className="flex items-center gap-3">
                              <CreditCard size={18} className="text-green-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prize Distributed</span>
                           </div>
                           <span className="text-lg font-black text-slate-900">${(simulation.total_prize_pool_pence / 100).toLocaleString()}</span>
                        </div>
                     </div>

                     <button 
                        disabled={publishing}
                        onClick={publishDraw}
                        className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2 group border-b-4 border-b-green-800 active:border-b-0 active:translate-y-1"
                     >
                        {publishing ? <Loader2 size={24} className="animate-spin" /> : <><CheckCircle2 size={20} /> Commit to Ledger</>}
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Drill-down simulated distribution */}
      {simulation && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm overflow-hidden flex flex-col justify-between">
               <h4 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Tier Distribution</h4>
               <div className="space-y-6">
                  {[
                    { label: 'Tier 1 (Jackpot)', count: simulation.winner_counts?.tier1, pool: simulation.jackpot_pool_pence, color: 'text-amber-500 bg-amber-50' },
                    { label: 'Tier 2 (4 Matches)', count: simulation.winner_counts?.tier2, pool: simulation.tier2_pool_pence, color: 'text-slate-400 bg-slate-50' },
                    { label: 'Tier 3 (3 Matches)', count: simulation.winner_counts?.tier3, pool: simulation.tier3_pool_pence, color: 'text-indigo-400 bg-indigo-50' },
                  ].map((tier, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg", tier.color)}>
                             {i + 1}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{tier.label}</p>
                             <p className="text-base font-black text-slate-900 leading-none">{tier.count} Winners</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-900 leading-none">${(tier.pool / 100).toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Pool Weight</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-10 p-5 bg-slate-900 rounded-3xl text-white">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Users size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Total Pool Potential</span>
                     </div>
                     <span className="text-xl font-black">${(simulation.total_prize_pool_pence / 100).toLocaleString()}</span>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Outcome Winners</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sample List Preview</p>
               </div>
               
               <div className="space-y-3">
                  {simulation.top_winners?.length > 0 ? simulation.top_winners.map((winner, idx) => (
                     <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-xl transition-all rounded-3xl group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                             {winner.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">{winner.name}</p>
                              <div className="flex items-center gap-2">
                                 <Trophy size={10} className="text-amber-500" />
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{winner.match_count} Matches</span>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-slate-900">${(winner.prize_amount_pence / 100).toLocaleString()}</p>
                           <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Potential Prize</p>
                        </div>
                     </div>
                  )) : (
                     <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4 opacity-50 italic">
                        <AlertCircle size={40} />
                        <p>No winners generated for this output combo.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
