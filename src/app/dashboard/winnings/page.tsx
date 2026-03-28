'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { WinnerBanner } from "@/components/winner/WinnerBanner";
import { WinningsHistory } from "@/components/winner/WinningsHistory";
import { ProofUploadForm } from "@/components/winner/ProofUploadForm";
import { WinnerVerification, ApiResponse } from "@/types";
import { Loader2, AlertCircle } from 'lucide-react';

export default function WinningsPage() {
  const [verifications, setVerifications] = useState<WinnerVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/winner');
        const data: ApiResponse<WinnerVerification[]> = await res.json();
        
        if (!data.success) {
          setError(data.error || "Failed to load winnings");
        } else {
          setVerifications(data.data || []);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading prize data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-[3rem] text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Connection Error</h3>
          <p className="text-rose-400 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-rose-500 text-white font-black rounded-2xl"
          >
            Retry
          </button>
      </div>
    );
  }

  // Calculate total winnings (already approved or paid)
  const totalWinnings = verifications
    .filter(v => v.status === 'approved' || v.status === 'paid')
    .reduce((sum, v) => sum + (v.draw_entry?.prize_amount_pence || 0), 0);

  // Find if any proof is needed
  const activeProofRequest = verifications.find(v => 
    v.status === 'awaiting_proof' || v.status === 'rejected'
  );

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-serif text-slate-900 italic tracking-tighter capitalize mb-4">
          Prize Winnings.
        </h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic mb-12 transition-all">
          Claim and track your monthly draw prizes
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {totalWinnings > 0 && (
            <WinnerBanner totalAmount={totalWinnings} />
          )}

          <WinningsHistory verifications={verifications} />
        </div>

        <aside className="lg:col-span-4 space-y-8">
          {activeProofRequest ? (
            <ProofUploadForm 
              verificationId={activeProofRequest.id}
              drawDate={(activeProofRequest.draw_entry as any)?.draws?.draw_date || 'N/A'}
              prizeAmount={activeProofRequest.draw_entry?.prize_amount_pence || 0}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden group shadow-2xl shadow-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none" />
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-white/10 group-hover:scale-110 transition-transform duration-700">
                <SearchIcon className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-serif italic text-white tracking-tighter leading-tight">All Settled.</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">Verify your scores after each draw to claim potential prizes.</p>
              </div>
            </div>
          )}

          {/* Tips / Info Sidebar Extra */}
          <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] space-y-8 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-700">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm">
                   <AlertCircle className="w-5 h-5" />
                </div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">Verification Tips</h5>
             </div>
             <ul className="space-y-6">
                <li className="flex gap-4 group">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                   <span className="text-xs font-medium text-slate-500 leading-relaxed italic group-hover:text-slate-900 transition-all">Ensure your scorecard screenshot clearly shows the course name, date, and verified signature.</span>
                </li>
                <li className="flex gap-4 group">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                   <span className="text-xs font-medium text-slate-500 leading-relaxed italic group-hover:text-slate-900 transition-all">Payouts are typically processed within 5 business days after verification approval.</span>
                </li>
             </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      strokeWidth="2.5" 
      stroke="currentColor" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </svg>
  );
}
