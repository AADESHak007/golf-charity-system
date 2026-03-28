'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  stripe_price_id: string;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Fetch user to conditionally hide login prompt
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
         if (d?.success && d?.data) setUser(d.data);
      })
      .catch(() => null);

    // 2. Fetch plans from your DB
    fetch('/api/plans')
      .then(r => r.json())
      .then(d => {
        if (d.success) setPlans(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCheckout = async (planId: string) => {
    setError('');
    setCheckingOut(planId);

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    setCheckingOut(null);

    if (!data.success) {
      if (res.status === 401) {
        router.push('/auth');
        return;
      }
      setError(data.error || 'Checkout failed');
    } else {
      // Redirect to Stripe Checkout
      window.location.href = data.data.url;
    }
  };

  // Fallback hardcoded plans when DB is not yet seeded
  const isMockMode = plans.length === 0;
  const displayPlans: Plan[] = plans.length > 0 ? plans : [
    {
      id: 'monthly-placeholder',
      name: 'Monthly Plan',
      price: 999,
      duration: 'monthly',
      features: ['Weekly prize draws', 'Basic scoring', 'Charity contributions', 'Member dashboard'],
      stripe_price_id: 'price_mock_monthly',
    },
    {
      id: 'yearly-placeholder',
      name: 'Yearly Plan',
      price: 9999,
      duration: 'yearly',
      features: ['Everything in Monthly', 'Priority scoring', '2 months free', 'Advanced analytics', 'VIP support'],
      stripe_price_id: 'price_mock_yearly',
    },
  ];

  return (
    <main className="min-h-screen pt-40 pb-32 bg-[#050810] font-sans relative z-0">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-24">
           <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter drop-shadow-2xl">
              Impact Memberships.
           </h1>
           <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-medium tracking-tight">
             Support verified missions while unlocking all premium platform features. 
           </p>
        </div>

        {isMockMode && (
          <div className="mb-12 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500/80 text-sm text-center font-medium shadow-2xl">
            💡 Developer Tip: Displaying local mock plans. Seed the database to view live Stripe products.
          </div>
        )}

        {error && (
          <div className="mb-8 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-6 py-4 text-center shadow-xl">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {displayPlans.map((plan) => {
              const isYearly = plan.duration === 'yearly';
              const isDisabled = !plan.stripe_price_id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col bg-slate-900 border rounded-[3rem] p-10 md:p-12 shadow-2xl transition-all duration-500 hover:shadow-emerald-500/5 group ${
                    isYearly ? 'border-emerald-500/30 ring-1 ring-emerald-500/10 hover:border-emerald-500/50' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isYearly && (
                    <div className="absolute top-8 right-8 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg shadow-emerald-500/20">
                      Best Value
                    </div>
                  )}

                  <div className="space-y-4 mb-10 border-b border-slate-800 pb-10">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                      {plan.duration}
                    </div>
                    <h2 className="text-4xl font-serif text-white tracking-tight">{plan.name}</h2>
                    
                    <div className="flex items-baseline gap-1 mt-6">
                      <span className="text-6xl font-medium tracking-tighter text-white">
                        ${(plan.price / 100).toFixed(2)}
                      </span>
                      <span className="text-slate-500 text-lg font-medium">/{plan.duration === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    
                    {isYearly && (
                      <p className="text-emerald-500/80 text-sm font-medium pt-2">
                        ≈ ${((plan.price / 100) / 12).toFixed(2)}/month — save 2 months
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-5 mb-14 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-4 text-sm md:text-base text-slate-300 font-medium">
                        <span className="text-emerald-500 mt-0.5">✓</span> 
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isDisabled ? (
                    <div className="w-full py-4 text-center rounded-2xl text-slate-500 font-bold uppercase tracking-widest text-[10px] bg-slate-800/50">
                      Configuration Pending
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={checkingOut === plan.id}
                      className="w-full text-center text-white font-medium hover:text-emerald-400 transition-colors py-2 flex items-center justify-center gap-2 group/btn"
                    >
                      {checkingOut === plan.id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Get {plan.name} 
                          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Auth Helper */}
        {!user && (
           <p className="text-center text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-16">
             Not signed in?{' '}
             <Link href="/signin" className="text-emerald-500 hover:text-emerald-400 transition-colors">Create a free account</Link>{' '}
             to subscribe.
           </p>
        )}
      </div>
    </main>
  );
}
