"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  Receipt,
  User,
  Calendar,
  Trophy
} from "lucide-react";
import { format } from "date-fns";
import { WinnerVerification } from "@/types";
import { cn } from "@/lib/utils";

interface VerificationCardProps {
  verification: WinnerVerification;
  onAction: (id: string, action: 'approve' | 'reject' | 'mark_paid', data?: any) => Promise<void>;
}

export function VerificationCard({ verification, onAction }: VerificationCardProps) {
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showPaidForm, setShowPaidForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [payoutRef, setPayoutRef] = useState("");

  const handleAction = async (action: 'approve' | 'reject' | 'mark_paid') => {
    setLoading(true);
    try {
      const data: any = {};
      if (action === 'reject') data.rejection_reason = rejectionReason;
      if (action === 'mark_paid') data.payout_reference = payoutRef;
      
      await onAction(verification.id, action, data);
      setShowRejectForm(false);
      setShowPaidForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    awaiting_proof: "bg-slate-100 text-slate-600 border-slate-200",
    proof_submitted: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    paid: "bg-green-50 text-green-700 border-green-200",
  };

  const statusIcons = {
    awaiting_proof: Clock,
    proof_submitted: AlertCircle,
    approved: CheckCircle2,
    rejected: XCircle,
    paid: Receipt,
  };

  const StatusIcon = statusIcons[verification.status];
  const prizeInPounds = (verification.draw_entry?.prize_amount_pence || 0) / 100;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6">
        {/* Header: Status & Price */}
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border capitalize",
            statusColors[verification.status]
          )}>
            <StatusIcon size={14} />
            {verification.status.replace('_', ' ')}
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Prize Amount</span>
            <span className="text-2xl font-black text-slate-900">${prizeInPounds.toLocaleString()}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <User size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 truncate">{verification.user?.name || 'Unknown User'}</h4>
            <p className="text-sm text-slate-500 truncate mb-2">{verification.user?.email}</p>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
               <span className="flex items-center gap-1">
                 <Calendar size={12} />
                 {format(new Date(verification.created_at), 'MMM d, yyyy')}
               </span>
               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
               <span className="flex items-center gap-1 uppercase">
                 <Trophy size={12} />
                 {verification.draw_entry?.match_count} Matches
               </span>
            </div>
          </div>
        </div>

        {/* Proof Section */}
        {verification.proof_url ? (
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3 leading-none">Winner Proof</label>
            <div className="relative aspect-[16/9] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden group">
               <Image 
                 src={verification.proof_url} 
                 alt="Winner Proof" 
                 fill 
                 className="object-cover transition-transform duration-500 group-hover:scale-105"
               />
               <a 
                 href={verification.proof_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
               >
                 <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <ExternalLink size={20} />
                 </div>
               </a>
            </div>
            {verification.proof_uploaded_at && (
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                Uploaded {format(new Date(verification.proof_uploaded_at), 'PPp')}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400">
             <Clock size={24} className="mb-2 opacity-50" />
             <p className="text-xs font-bold uppercase tracking-wider">Awaiting Proof Upload</p>
          </div>
        )}

        {/* Rejection / Paid Details */}
        {verification.status === 'rejected' && verification.rejection_reason && (
          <div className="mb-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl">
            <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1">Rejection Reason</label>
            <p className="text-sm text-red-700 font-medium">{verification.rejection_reason}</p>
          </div>
        )}

        {verification.status === 'paid' && verification.payout_reference && (
          <div className="mb-6 p-4 bg-green-50/50 border border-green-100 rounded-2xl">
            <label className="text-[10px] font-bold text-green-400 uppercase tracking-widest block mb-1">Payout Reference</label>
            <p className="text-sm text-green-700 font-mono font-bold">{verification.payout_reference}</p>
            {verification.paid_at && (
               <p className="text-[10px] text-green-600/60 mt-1 font-medium italic">
                 Paid on {format(new Date(verification.paid_at), 'PP')}
               </p>
            )}
          </div>
        )}

        {/* Action Forms */}
        {showRejectForm && (
          <div className="mb-4 animate-in slide-in-from-top-2 duration-300">
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Enter rejection reason..."
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleAction('reject')}
                disabled={loading || !rejectionReason}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-sm transition-all"
              >
                Confirm Reject
              </button>
              <button 
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showPaidForm && (
          <div className="mb-4 animate-in slide-in-from-top-2 duration-300">
            <input
              type="text"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Enter Payout Reference (e.g. Bank Ref #)"
              value={payoutRef}
              onChange={(e) => setPayoutRef(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleAction('mark_paid')}
                disabled={loading || !payoutRef}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-sm transition-all"
              >
                Confirm Paid
              </button>
              <button 
                onClick={() => setShowPaidForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main Actions */}
        {!showRejectForm && !showPaidForm && (
          <div className="grid grid-cols-2 gap-3">
             {verification.status === 'proof_submitted' && (
               <>
                 <button 
                   onClick={() => handleAction('approve')}
                   disabled={loading}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                 >
                   <CheckCircle2 size={18} className="transition-transform group-hover:scale-110" />
                   Approve
                 </button>
                 <button 
                   onClick={() => setShowRejectForm(true)}
                   disabled={loading}
                   className="bg-white border border-red-100 hover:border-red-200 text-red-600 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 group hover:bg-red-50"
                 >
                   <XCircle size={18} className="transition-transform group-hover:rotate-12" />
                   Reject
                 </button>
               </>
             )}
             
             {verification.status === 'approved' && (
               <button 
                 onClick={() => setShowPaidForm(true)}
                 disabled={loading}
                 className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 group"
               >
                 <Receipt size={18} className="transition-transform group-hover:scale-110" />
                 Mark as Paid
               </button>
             )}

             {(verification.status === 'rejected' || verification.status === 'paid') && (
               <div className="col-span-2 py-3 px-4 bg-slate-50 rounded-2xl text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                 No further actions available
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
