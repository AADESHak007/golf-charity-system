"use client";

import { use, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  User as UserIcon, 
  CreditCard, 
  Trophy, 
  Heart, 
  ShieldCheck, 
  Mail, 
  Save,
  Loader2,
  Hash,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { ApiResponse, Role } from "@/types";
import { cn } from "@/lib/utils";
import { AdminScoreEditor } from "./AdminScoreEditor";
import { AdminScoreAdder } from "./AdminScoreAdder";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'scores' | 'draws' | 'charities' | 'prizes'>('scores');
  
  // Edit State
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "" as Role
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const json = await res.json() as ApiResponse<any>;
      if (json.success && json.data) {
        setUser(json.data);
        setEditData({
          name: json.data.name,
          email: json.data.email,
          role: json.data.role
        });
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
       const res = await fetch(`/api/admin/users/${id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(editData)
       });
       if (res.ok) fetchData();
    } catch (error) {
       console.error(error);
    } finally {
       setSaving(false);
    }
  };


  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Retrieving comprehensive user profile...</p>
       </div>
     );
  }

  if (!user) return <div className="p-10 text-center">User not found</div>;

  const activeSub = user.subscriptions?.find((s: any) => s.status === 'active');

  return (
    <div className="space-y-10 pb-20">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
         <Link 
            href="/admin/users"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold group transition-all"
         >
            <div className="p-2 border border-slate-200 rounded-xl group-hover:bg-slate-50 transition-colors">
               <ArrowLeft size={18} />
            </div>
            Back to Directory
         </Link>
         <div className="flex items-center gap-3">
            <div className="px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
               <Hash size={12} />
               ID: {user.id.split('-')[0]}...
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Left Column: Profile Card */}
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-full blur-[60px] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700"></div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-indigo-100 mb-6 border-4 border-white">
                     {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{user.name}</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-6">{user.role}</p>
                  
                  <div className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                     <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className={cn(
                           "text-xs font-black uppercase tracking-widest leading-none",
                           activeSub ? "text-green-600" : "text-red-500"
                        )}>
                           {activeSub ? "Subscribed" : "Unpaid"}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Since</p>
                        <p className="text-xs font-black text-slate-900 leading-none">
                           {format(new Date(user.created_at), 'MM/yyyy')}
                        </p>
                     </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="w-full space-y-4 text-left">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Edit Display Name</label>
                        <div className="relative">
                           <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                           <input 
                              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                        <div className="relative">
                           <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                           <input 
                              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                           />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Role</label>
                        <div className="relative">
                           <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                           <select 
                              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                              value={editData.role}
                              onChange={(e) => setEditData({ ...editData, role: e.target.value as Role })}
                           >
                              <option value="PLAYER">Player Access</option>
                              <option value="ADMIN">System Admin</option>
                           </select>
                        </div>
                     </div>
                     <button 
                        disabled={saving}
                        className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-black rounded-3xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-4"
                     >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                     </button>
                  </form>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 text-white space-y-8">
               <div className="flex items-center gap-3">
                  <Activity className="text-indigo-400" size={24} />
                  <h3 className="text-xl font-black tracking-tight leading-none uppercase">Activity Snapshot</h3>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Participation</p>
                     <p className="text-3xl font-black">{user.draw_entries?.length || 0}</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase">Draw Entries</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Net Payouts</p>
                     <p className="text-3xl font-black text-green-400">$0</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase">Pending Verification</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm flex flex-col h-full min-h-[700px]">
               <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'scores', label: 'Score History', icon: Activity },
                    { id: 'draws', label: 'Draw History', icon: Trophy },
                    { id: 'charities', label: 'Charity Allocations', icon: Heart },
                    { id: 'prizes', label: 'Winnings & Verification', icon: CreditCard }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                            isActive 
                              ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                           <Icon size={16} />
                           {tab.label}
                        </button>
                    );
                  })}
               </div>

               <div className="p-10 flex-1">
                  {activeTab === 'scores' && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Submitted Scores</h4>
                           {(!user.golf_scores || user.golf_scores.length < 5) && (
                              <AdminScoreAdder userId={user.id} onUpdate={fetchData} />
                           )}
                        </div>
                        {user.golf_scores?.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {user.golf_scores.map((score: any) => (
                                 <AdminScoreEditor 
                                   key={score.id} 
                                   scoreData={score} 
                                   onUpdate={fetchData} 
                                 />
                              ))}
                           </div>
                        ) : (
                           <div className="py-20 text-center text-slate-400 italic font-medium">No scores submitted yet.</div>
                        )}
                     </div>
                  )}

                  {activeTab === 'draws' && (
                     <div className="space-y-4">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase mb-8">Participation Log</h4>
                        {user.draw_entries?.length > 0 ? (
                           <div className="space-y-4">
                              {user.draw_entries.map((entry: any) => (
                                 <div key={entry.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                       <div className="flex flex-col">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Draw Date</p>
                                          <p className="text-sm font-black text-slate-900">{format(new Date(entry.draws?.draw_date), 'PPP')}</p>
                                       </div>
                                       <div className="flex flex-col">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Matches</p>
                                          <div className="flex gap-1">
                                             {entry.matched_numbers.map((n: number) => (
                                                <span key={n} className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                                                   {n}
                                                </span>
                                             ))}
                                             {entry.matched_numbers.length === 0 && <span className="text-xs font-bold text-slate-300 italic">None</span>}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Prize Won</p>
                                       <p className={cn(
                                          "text-lg font-black",
                                          entry.prize_amount_pence > 0 ? "text-indigo-600" : "text-slate-300"
                                       )}>
                                          ${(entry.prize_amount_pence / 100).toLocaleString()}
                                       </p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="py-20 text-center text-slate-400 italic font-medium">User has not entered any draws yet.</div>
                        )}
                     </div>
                  )}

                  {activeTab === 'charities' && (
                     <div className="space-y-6">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase mb-8">Charity Support Lifecycle</h4>
                        {user.user_charities?.length > 0 ? (
                           <div className="space-y-6">
                              {user.user_charities.map((uc: any) => (
                                 <div key={uc.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 group">
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                                       {uc.charities?.image_url ? (
                                          <Image src={uc.charities.image_url} alt="Logo" fill className="object-cover" />
                                       ) : (
                                          <Heart className="text-rose-200" size={24} />
                                       )}
                                    </div>
                                    <div className="flex-1">
                                       <h5 className="text-lg font-black text-slate-900 leading-none mb-1">{uc.charities?.name}</h5>
                                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Beneficiary Since {format(new Date(uc.created_at), 'MMM yyyy')}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none mb-1 text-center">Allocation</p>
                                       <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xl font-black text-slate-900 shadow-sm">
                                          {uc.allocation_perc}%
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="bg-rose-50 border border-dashed border-rose-100 rounded-[2.5rem] py-20 flex flex-col items-center text-center">
                              <Heart size={48} className="text-rose-200 mb-4" />
                              <p className="text-rose-900 font-black tracking-tight leading-none uppercase mb-1 italic">No Charity Allocations Found</p>
                              <p className="text-rose-400 text-xs font-bold uppercase tracking-widest">Platform fees will be distributed to defaults.</p>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'prizes' && (
                     <div className="space-y-6">
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase mb-8">Prizes & Verifications</h4>
                        {user.winner_verifications?.length > 0 ? (
                           <div className="space-y-4">
                              {user.winner_verifications.map((v: any) => (
                                 <div key={v.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                       <div className={cn(
                                          "p-4 rounded-2xl border",
                                          v.status === 'paid' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                       )}>
                                          <Trophy size={24} />
                                       </div>
                                       <div>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Status</p>
                                          <h5 className="font-black text-slate-900 uppercase tracking-tight">{v.status.replace('_', ' ')}</h5>
                                       </div>
                                    </div>
                                    <Link 
                                       href={`/admin/winners`}
                                       className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                       View in Queue
                                       <ArrowLeft className="rotate-180" size={14} />
                                    </Link>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="py-20 text-center text-slate-400 italic font-medium">No prize verifications found for this user.</div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
