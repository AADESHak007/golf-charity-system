'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { UserCharityList } from '@/components/charities/UserCharityList';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');
  const [totalAllocation, setTotalAllocation] = useState(10); // Initial fallback
  const router = useRouter();
  const params = useSearchParams();
  const isSuccess = params.get('success') === 'true';

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/subscriptions/me').then(r => r.json()),
      fetch('/api/user/charities').then(r => r.json()),
    ]).then(([me, sub, charities]) => {
      if (!me.success) { router.push('/auth'); return; }
      setUser(me.data);
      if (sub.success) setSubscription(sub.data);
      if (charities.success) setTotalAllocation(charities.data.total_allocation);
      setLoading(false);
    });
  }, []);

  const handleCancel = async () => {
    if (!confirm('Are you sure? You\'ll keep access until the end of your billing period.')) return;
    setCancelling(true);
    const res = await fetch('/api/stripe/cancel-subscription', { method: 'POST' });
    const data = await res.json();
    setCancelling(false);
    if (data.success) {
      setCancelMsg('✅ Your subscription will cancel at the end of the billing period.');
      setSubscription((s: any) => s ? { ...s, cancel_at_period_end: true } : s);
    } else {
      setCancelMsg('❌ Could not cancel: ' + data.error);
    }
  };

  const getBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'badge-active',
      past_due: 'badge-past_due',
      cancelled: 'badge-cancelled',
      trialing: 'badge-trialing',
    };
    return <span className={map[status] || 'badge-cancelled'}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 px-6 py-12 page-enter">
        <div className="max-w-4xl mx-auto">

          {/* Success Banner */}
          {isSuccess && (
            <div className="mb-8 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-6 py-4">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-400">Subscription activated!</p>
                <p className="text-sm text-gray-400">Welcome aboard. Your first draw entry is confirmed.</p>
              </div>
            </div>
          )}

          {/* Cancel Message */}
          {cancelMsg && (
            <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm">
              {cancelMsg}
            </div>
          )}

          <h1 className="text-3xl font-extrabold mb-8">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Player'}</span> 👋
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Profile Card */}
            <div className="glass rounded-[2rem] p-8 md:col-span-2 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none" />
              <h2 className="text-xs font-black text-gray-450 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Player Profile
              </h2>
              <dl className="flex flex-col gap-4">
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Registered Email', value: user?.email },
                  { label: 'Platform Role', value: user?.role },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group/row">
                    <dt className="text-sm font-medium text-gray-500 group-hover:text-gray-400 pb-1 transition-colors">{label}</dt>
                    <dd className="text-sm font-bold text-gray-100">{value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Charity Impact Ring */}
            <div className="glass rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative bg-zinc-900 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl pointer-events-none" />
              <div className="relative mb-4 group">
                <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke="url(#emerald-grad)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - (totalAllocation || 0) / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#10b981" />
                       <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-emerald-400 tracking-tight">{totalAllocation || 0}%</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/50">Total Impact</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Charity Contribution</p>
                <p className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">Combined Allocation</p>
              </div>
            </div>
          </div>

          {/* Detailed Charity Impact Section */}
          <section className="mb-12">
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-white tracking-tight">Your Impact Snapshot</h3>
                   <p className="text-xs text-zinc-500 font-medium">Manage your currently supported missions and allocations.</p>
                </div>
             </div>
             
             <UserCharityList 
                subscriptionPrice={subscription?.price_pence || 2000} 
             />
          </section>

          {/* Subscription Card */}
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Subscription</h2>
              {subscription && getBadge(subscription.status)}
            </div>

            {subscription ? (
              <>
                <dl className="flex flex-col gap-3 mb-6">
                  {[
                    { label: 'Subscription ID', value: subscription.stripe_subscription_id },
                    { label: 'Period Start', value: subscription.current_period_start ? new Date(subscription.current_period_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                    { label: 'Period End', value: subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <dt className="text-sm text-gray-500">{label}</dt>
                      <dd className="text-sm font-medium text-gray-200 text-right max-w-xs truncate">{value}</dd>
                    </div>
                  ))}
                </dl>

                {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                  <button onClick={handleCancel} disabled={cancelling} className="btn-danger">
                    {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                )}
                {subscription.cancel_at_period_end && (
                  <p className="text-sm text-yellow-400">⚡ Cancels at end of period</p>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You don't have an active subscription yet.</p>
                <Link href="/pricing" className="btn-primary inline-block max-w-xs">
                  View Plans →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 flex-wrap">
            <Link href="/pricing" className="glass px-5 py-3 rounded-xl text-sm font-medium hover:border-green-500/25 transition-colors">
              🏷️ View Plans
            </Link>
            <Link href="/" className="glass px-5 py-3 rounded-xl text-sm font-medium hover:border-white/15 transition-colors">
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
