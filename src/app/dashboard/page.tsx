'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const isSuccess = params.get('success') === 'true';

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/subscriptions/me').then(r => r.json()),
    ]).then(([me, sub]) => {
      if (!me.success) { router.push('/auth'); return; }
      setUser(me.data);
      if (sub.success) setSubscription(sub.data);
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
      <>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
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

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Profile Card */}
            <div className="glass rounded-2xl p-6 md:col-span-2">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile</h2>
              <dl className="flex flex-col gap-3">
                {[
                  { label: 'Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Role', value: user?.role },
                  { label: 'Charity Contribution', value: `${user?.charity_perc ?? 10}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <dt className="text-sm text-gray-500">{label}</dt>
                    <dd className="text-sm font-medium text-gray-200">{value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Charity % Ring */}
            <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="relative mb-3">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="45" cy="45" r="38" fill="none" stroke="#22c55e" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - (user?.charity_perc ?? 10) / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 45 45)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-400">{user?.charity_perc ?? 10}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-tight">Charity<br />Contribution</p>
            </div>
          </div>

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
