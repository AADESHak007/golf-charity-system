"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Trophy, 
  Search, 
  Filter, 
  Download, 
  Loader2, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt
} from "lucide-react";
import { VerificationCard } from "@/components/admin/VerificationCard";
import { StatsCard } from "@/components/admin/StatsCard";
import { WinnerVerification, ApiResponse, VerificationStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusTabs: { id: VerificationStatus | 'all', label: string, icon: any }[] = [
  { id: 'all', label: 'All', icon: Trophy },
  { id: 'awaiting_proof', label: 'Awaiting Proof', icon: Clock },
  { id: 'proof_submitted', label: 'Submitted', icon: AlertCircle },
  { id: 'approved', label: 'Approved', icon: CheckCircle2 },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
  { id: 'paid', label: 'Paid', icon: Receipt },
];

export default function WinnersPage() {
  const [verifications, setVerifications] = useState<WinnerVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<VerificationStatus | 'all'>('all');
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/winners', window.location.origin);
      if (activeTab !== 'all') url.searchParams.set('status', activeTab);
      url.searchParams.set('page', page.toString());
      
      const res = await fetch(url.toString());
      const json = await res.json() as ApiResponse<{ verifications: WinnerVerification[], total: number }>;
      
      if (json.success && json.data) {
        setVerifications(json.data.verifications);
        setTotal(json.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch verifications:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'mark_paid', data?: any) => {
    try {
      const res = await fetch(`/api/admin/winners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data })
      });
      
      const json = await res.json();
      if (json.success) {
        fetchVerifications(); // Refresh queue
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const exportCSV = () => {
    const headers = ["User", "Email", "Prize Amount ($)", "Status", "Date"].join(",");
    const rows = verifications.map(v => {
      const prize = (v.draw_entry?.prize_amount_pence || 0) / 100;
      return [
        v.user?.name,
        v.user?.email,
        prize,
        v.status,
        new Date(v.created_at).toLocaleDateString()
      ].join(",");
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `winners_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVerifications = verifications.filter(v => 
    v.user?.name.toLowerCase().includes(search.toLowerCase()) || 
    v.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Winner Verification</h1>
          <p className="text-slate-500 font-medium">Manage proof submissions and prize payouts for tournament winners.</p>
        </div>
        <button 
          onClick={exportCSV} 
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} />
          Export Queue
        </button>
      </div>

      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatsCard 
           title="Pending Proof" 
           value={verifications.filter(v => v.status === 'awaiting_proof').length} 
           icon={Clock}
           className="border-amber-100 bg-amber-50/20"
         />
         <StatsCard 
           title="Needs Approval" 
           value={verifications.filter(v => v.status === 'proof_submitted').length} 
           icon={AlertCircle}
           className="border-indigo-100 bg-indigo-50/20"
         />
         <StatsCard 
           title="Ready for Payout" 
           value={verifications.filter(v => v.status === 'approved').length} 
           icon={CheckCircle2}
           className="border-green-100 bg-green-50/20"
         />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Status Tabs */}
        <div className="flex-1 flex items-center bg-slate-50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth gap-1 w-full md:w-auto">
           {statusTabs.map(tab => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => { setActiveTab(tab.id); setPage(1); }}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                   isActive 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
                 )}
               >
                 <Icon size={16} />
                 {tab.label}
               </button>
             );
           })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           <input 
             type="text"
             placeholder="Search winners..."
             className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {/* Main Grid List */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-3xl z-10 transition-all">
             <div className="flex flex-col items-center gap-4">
                <Loader2 size={40} className="text-indigo-600 animate-spin" />
                <p className="text-sm font-bold text-slate-500 animate-pulse tracking-widest uppercase">Fetching Records...</p>
             </div>
          </div>
        ) : filteredVerifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredVerifications.map((v) => (
              <VerificationCard 
                key={v.id} 
                verification={v} 
                onAction={handleAction} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center px-6">
             <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                <Filter size={32} />
             </div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No Verification Records Found</h3>
             <p className="text-slate-500 max-w-sm mb-8 font-medium">
               {activeTab === 'all' 
                 ? "There are no winners currently awaiting verification or payment." 
                 : `No records found with status '${activeTab.replace('_', ' ')}'.`}
             </p>
             <button 
                onClick={() => { setActiveTab('all'); setSearch(""); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-200"
             >
               Reset Filters
             </button>
          </div>
        )}
      </div>

      {/* Pagination (Simplified for now) */}
      {!loading && verifications.length > 0 && (
         <div className="flex items-center justify-between pt-8 border-t border-slate-200">
           <p className="text-sm font-bold text-slate-400 tracking-widest uppercase italic">
             Showing {verifications.length} of {total} records
           </p>
           <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <button 
                disabled={verifications.length < 20}
                onClick={() => setPage(page + 1)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
           </div>
         </div>
      )}
    </div>
  );
}
