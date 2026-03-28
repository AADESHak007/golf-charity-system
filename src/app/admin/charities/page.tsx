"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { 
  Heart, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Globe, 
  Edit3, 
  Settings, 
  Trash2, 
  Star,
  Search,
  Users,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { CharityForm } from "@/components/admin/CharityForm";
import { Charity, ApiResponse } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CharityManagementPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState<Charity | undefined>();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const fetchCharities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/charities');
      const json = await res.json() as ApiResponse<Charity[]>;
      if (json.success && json.data) {
        setCharities(json.data);
      }
    } catch (error) {
      console.error("Fetch charities error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharities();
  }, [fetchCharities]);

  const handleDeactivate = async (id: string, currentlyActive: boolean) => {
    if (!confirm(`Are you sure you want to ${currentlyActive ? 'deactivate' : 'reactivate'} this charity?`)) return;
    
    try {
      const res = await fetch(`/api/admin/charities/${id}`, {
        method: currentlyActive ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: currentlyActive ? undefined : JSON.stringify({ is_active: true })
      });
      const json = await res.json();
      if (json.success) fetchCharities();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
       const res = await fetch(`/api/admin/charities/${id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ is_featured: !currentFeatured })
       });
       const json = await res.json();
       if (json.success) fetchCharities();
    } catch (error) {
       console.error(error);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Charity Management</h1>
          <p className="text-slate-500 font-medium max-w-lg">Manage platform causes, branding, and visibility logic. All partnerships are visible to users.</p>
        </div>
        <button 
          onClick={() => { setSelectedCharity(undefined); setShowForm(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200"
        >
          <Plus size={20} />
          Register Charity
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search charities by name or slug..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-slate-700 border border-slate-100">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
               {charities.length} Total Registered
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-400">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
               {charities.filter(c => !c.is_active).length} Inactive
            </div>
         </div>
      </div>

      {/* Grid Display */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="text-indigo-600 animate-spin" />
                <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Synchronizing Causes...</p>
             </div>
          </div>
        ) : filteredCharities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCharities.map((charity) => (
              <div 
                key={charity.id}
                className={cn(
                  "bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative",
                  !charity.is_active && "opacity-60 saturate-50"
                )}
              >
                {/* Featured Badge */}
                {charity.is_featured && (
                   <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                      <Star size={12} fill="currentColor" />
                      Featured Cause
                   </div>
                )}

                {/* Cover Image */}
                <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden">
                   {charity.image_url ? (
                     <Image 
                        src={charity.image_url} 
                        alt={charity.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full text-slate-300">
                        <Heart size={48} strokeWidth={1} />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                   <div className="flex items-start justify-between mb-4">
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{charity.name}</h3>
                         <p className="text-sm text-slate-400 font-mono">/{charity.slug}</p>
                      </div>
                      <div className="relative">
                         <button 
                           onClick={() => setMenuOpenId(menuOpenId === charity.id ? null : charity.id)}
                           className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                         >
                            <MoreVertical size={20} />
                         </button>
                         {/* Action Menu */}
                         {menuOpenId === charity.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setMenuOpenId(null)}></div>
                              <div className="absolute right-0 top-12 w-56 bg-white border border-slate-100 shadow-2xl rounded-[1.5rem] p-2 z-30 animate-in fade-in slide-in-from-top-4">
                                <button 
                                  onClick={() => { setSelectedCharity(charity); setShowForm(true); setMenuOpenId(null); }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                                >
                                  <Edit3 size={18} />
                                  Edit Partner
                                </button>
                                <button 
                                  onClick={() => { handleToggleFeatured(charity.id, charity.is_featured); setMenuOpenId(null); }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all"
                                >
                                  <Star size={18} fill={charity.is_featured ? "currentColor" : "none"} />
                                  {charity.is_featured ? "Unfeature" : "Make Featured"}
                                </button>
                                <div className="h-px bg-slate-100 my-2 mx-2"></div>
                                <button 
                                  onClick={() => { handleDeactivate(charity.id, charity.is_active); setMenuOpenId(null); }}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all",
                                    charity.is_active 
                                      ? "text-red-500 hover:bg-red-50" 
                                      : "text-green-600 hover:bg-green-50"
                                  )}
                                >
                                  {charity.is_active ? <Trash2 size={18} /> : <CheckCircle2 size={18} />}
                                  {charity.is_active ? "Deactivate" : "Reactivate"}
                                </button>
                              </div>
                            </>
                         )}
                      </div>
                   </div>

                   <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-8 leading-relaxed h-10">
                     {charity.description}
                   </p>

                   {/* Quick Stats */}
                   <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <Users size={12} />
                            Supporters
                         </div>
                         <p className="text-lg font-black text-slate-900">{charity.supporters?.[0]?.count || 0}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 text-right">
                         <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            Allocation
                            <Heart size={12} className="text-rose-400" />
                         </div>
                         <p className="text-lg font-black text-slate-900">${((charity.supporters?.[0]?.count || 0) * 12.50).toLocaleString()}</p>
                      </div>
                   </div>

                   {/* Footer Info */}
                   <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-2.5 h-2.5 rounded-full shadow-sm",
                           charity.is_active ? "bg-green-500 shadow-green-100" : "bg-slate-300 shadow-slate-100"
                         )}></div>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{charity.is_active ? "Active Partner" : "Inactive"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         {charity.website_url && (
                           <a 
                             href={charity.website_url} 
                             target="_blank" 
                             className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100"
                           >
                              <Globe size={18} />
                           </a>
                         )}
                         <Link 
                            href={`/admin/charities/${charity.id}`}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                         >
                            Events
                            <Calendar size={14} />
                         </Link>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-10">
             <div className="w-24 h-24 bg-white shadow-xl rounded-[2rem] flex items-center justify-center text-indigo-400 mb-8 border border-white">
                <Heart size={40} fill="currentColor" className="opacity-10" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3">No Charities Registered</h3>
             <p className="text-slate-500 max-w-sm mb-10 font-medium">Start by adding your first charitable partner to build the platform's cause directory.</p>
             <button 
                onClick={() => { setSelectedCharity(undefined); setShowForm(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 py-5 rounded-3xl transition-all shadow-xl shadow-indigo-200 flex items-center gap-3"
             >
               <Plus size={20} />
               Register Your First Charity
             </button>
          </div>
        )}
      </div>

      {showForm && (
        <CharityForm 
          charity={selectedCharity} 
          onClose={() => setShowForm(false)} 
          onSuccess={fetchCharities} 
        />
      )}
    </div>
  );
}
