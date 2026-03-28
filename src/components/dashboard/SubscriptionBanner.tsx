import { CheckCircle2, ShieldCheck, Calendar, CreditCard, ChevronRight, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SubscriptionBannerProps {
  subscription: any;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function SubscriptionBanner({
  subscription,
  loading = false,
  onRefresh
}: SubscriptionBannerProps) {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (loading) {
      return (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 lg:p-14 animate-pulse shadow-sm min-h-[400px]">
              <div className="h-10 w-64 bg-slate-50 rounded-xl mb-6" />
              <div className="h-32 bg-slate-50 rounded-2xl" />
          </div>
      );
  }

  const isActive = subscription?.status === 'active';
  const isPastDue = subscription?.status === 'past_due';
  const isCancelling = subscription?.cancel_at_period_end;
  const renewalDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const res = await fetch('/api/stripe/cancel-subscription', { method: 'POST' });
      if (res.ok) {
        onRefresh?.();
        setShowConfirm(false);
      }
    } catch (err) {
      console.error('Failed to cancel', err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group shadow-[0_22px_70px_rgba(0,0,0,0.03)] transition-all duration-1000 h-full flex flex-col justify-center min-h-[380px]">
      
      {/* Decorative Accent Glow */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] opacity-[0.05] pointer-events-none transition-all duration-1000 ${isActive ? 'bg-accent' : 'bg-rose-500'}`} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none transition-all duration-1000" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,0,0,0.1) 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={cn(
               "p-5 rounded-3xl border transition-all duration-700 shadow-sm flex-shrink-0",
               isActive && !isCancelling ? 'bg-accent/10 border-accent/20 text-accent group-hover:bg-accent group-hover:text-white' : 
               isCancelling ? 'bg-slate-50 border-slate-200 text-slate-400' :
               'bg-rose-50/50 border-rose-100 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'
            )}>
              {isActive && !isCancelling ? <CheckCircle2 className="w-8 h-8" /> : isCancelling ? <X className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-3xl md:text-5xl font-serif text-slate-900 italic tracking-tighter leading-none mb-4 truncate">
                {isActive ? (isCancelling ? 'Cancellation Pending.' : 'Membership Status.') : 'Enrollment Step.'}
              </h2>
              <p className={cn(
                "text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] leading-none italic transition-all group-hover:text-slate-900 truncate",
                isCancelling ? "text-rose-500" : "text-slate-400"
              )}>
                {isActive 
                  ? (isCancelling ? `Ending ${renewalDate}` : `Active until ${renewalDate}`)
                  : isPastDue ? 'Payment failed' : 'Join the next draw'
                }
              </p>
            </div>
          </div>
        </div>

        {!isActive ? (
          <div className="space-y-6 max-w-lg">
            <p className="text-slate-500 font-medium leading-[1.6] text-lg italic">
              Secure your entry into monthly elite draws and support your causes.
            </p>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-3xl font-black tracking-[0.2em] text-[10px] uppercase transition-all shadow-xl shadow-slate-200/50 hover:scale-105"
            >
              Join Now
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-6 bg-slate-50/50 border border-slate-100 rounded-3xl px-6 py-6 shadow-sm hover:bg-white hover:border-slate-200 transition-all group/item">
                    <div className="flex-shrink-0 p-4 rounded-2xl bg-white shadow-sm text-slate-300 group-hover/item:text-accent transition-colors">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none italic group-hover/item:text-slate-500">Tier Status</p>
                        <p className="text-xl font-serif italic text-slate-900 tracking-tighter truncate">Elite Monthly</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-slate-50/50 border border-slate-100 rounded-3xl px-6 py-6 shadow-sm hover:bg-white hover:border-slate-200 transition-all group/item">
                    <div className="flex-shrink-0 p-4 rounded-2xl bg-white shadow-sm text-slate-300 group-hover/item:text-accent transition-colors">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none italic group-hover/item:text-slate-500">Security</p>
                        <p className="text-xl font-serif italic text-slate-900 tracking-tighter truncate">Auto-Payment</p>
                    </div>
                </div>
            </div>

            {isActive && !isCancelling && !showConfirm && (
              <div className="flex justify-center md:justify-start">
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-rose-500 border border-transparent hover:border-rose-100 px-5 py-3 rounded-full transition-all italic whitespace-nowrap"
                >
                  Cancel Membership
                </button>
              </div>
            )}

            {showConfirm && (
              <div className="flex items-center justify-between bg-rose-50/50 p-4 rounded-3xl border border-rose-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 ml-4">confirm cancellation?</p>
                <div className="flex gap-3">
                    <button 
                      disabled={cancelling}
                      onClick={handleCancel}
                      className="bg-rose-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                      {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel'}
                    </button>
                    <button 
                      onClick={() => setShowConfirm(false)}
                      className="bg-white text-slate-500 border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                    >
                      No, Keep
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
