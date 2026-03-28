"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Edit3, 
  User as UserIcon, 
  Calendar, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { User, ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<string>("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('page', page.toString());
      if (search) url.searchParams.set('search', search);
      if (status !== 'all') url.searchParams.set('status', status);
      
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const json = await res.json() as ApiResponse<{ users: any[], total: number }>;
      
      if (json.success && json.data) {
        setUsers(json.data.users);
        setTotal(json.data.total);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Role", "Joined Date"].join(",");
    const rows = users.map(u => [
       u.name,
       u.email,
       u.role,
       new Date(u.created_at).toLocaleDateString()
    ].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_list_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">User Directory</h1>
          <p className="text-slate-500 font-medium">Manage all platform participants, subscription lifecycles, and roles.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={exportCSV}
             className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
           >
              <Download size={18} />
              Export Directory
           </button>
           <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl transition-all shadow-xl hover:bg-indigo-600">
              <Plus size={20} />
              Internal Signup
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
         </div>
         <div className="flex items-center gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl">
               {['all', 'ADMIN', 'PLAYER'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatus(s); setPage(1); }}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      status === s 
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {s}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative">
         {loading ? (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center min-h-[400px]">
               <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
         ) : users.length > 0 ? (
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-100">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Role</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Subscription</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Activity</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Joined Date</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {users.map((user) => {
                     const sub = user.subscriptions?.[0];
                     const scoreCount = user.golf_scores?.[0]?.count || 0;
                     
                     return (
                        <tr key={user.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 font-black shadow-inner">
                                    {user.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-slate-900 truncate leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{user.name}</span>
                                    <span className="text-xs text-slate-400 truncate font-medium">{user.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className={cn(
                                 "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                                 user.role === 'ADMIN' ? "bg-slate-900 text-white border-slate-800 shadow-lg shadow-slate-200" : "bg-white text-slate-500 border-slate-200"
                              )}>
                                 {user.role === 'ADMIN' && <ShieldAlert size={12} className="text-indigo-400" />}
                                 {user.role}
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              {sub ? (
                                 <div className="flex flex-col">
                                    <span className={cn(
                                       "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                                       sub.status === 'active' ? "text-green-600" : "text-red-500"
                                    )}>
                                       {sub.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-900">{sub.subscription_plans?.name}</span>
                                 </div>
                              ) : (
                                 <span className="text-xs font-bold text-slate-300 italic">No Active Plan</span>
                              )}
                           </td>
                           <td className="px-8 py-5 text-center">
                              <div className="flex flex-col items-center">
                                 <span className="text-xs font-black text-slate-900 leading-none mb-1">{scoreCount}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Scores</span>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                 <Calendar size={14} className="opacity-50" />
                                 {format(new Date(user.created_at), 'MMM d, yyyy')}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <Link 
                                 href={`/admin/users/${user.id}`}
                                 className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl transition-all inline-flex"
                              >
                                 <Edit3 size={18} />
                              </Link>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                  <UsersIcon size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">No Matching Users</h3>
               <p className="text-slate-500 max-w-sm mb-8 font-medium italic underline underline-offset-4 decoration-slate-200">Adjust your search parameters or filters to find results.</p>
               <button 
                  onClick={() => { setSearch(""); setStatus("all"); }}
                  className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
               >
                  Reset Records
               </button>
            </div>
         )}

         {/* Pagination Footer */}
         <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Showing {users.length} of {total} Participants</span>
            <div className="flex items-center gap-2">
               <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
               >
                  <ChevronLeft size={20} />
               </button>
               <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 shadow-sm border-b-4 border-b-indigo-500">
                  PAGE {page}
               </div>
               <button 
                  disabled={users.length < 20}
                  onClick={() => setPage(p => p + 1)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
               >
                  <ChevronRight size={20} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
