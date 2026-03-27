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
  const router = useRouter();

  useEffect(() => {
    // Fetch plans from your DB
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
    <>
      <Navbar />
      <main className="flex-1 px-6 py-20 page-enter">
        <div className="max-w-4xl mx-auto">
          {/* Mock Mode Warning */}
          {isMockMode && (
            <div className="mb-8 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm text-center">
              💡 <strong>Developer Tip:</strong> You are seeing <strong>mock plans</strong> because your database is empty.
              Run the SQL seeding script to see real plans.
            </div>
          )}
          <div className="text-center mb-14">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
              Flexible Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Both plans include access to all prize draws and charity contributions. Save with our yearly plan.
            </p>
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-center">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {displayPlans.map((plan, idx) => {
                const isYearly = plan.duration === 'yearly';
                const isDisabled = !plan.stripe_price_id;

                return (
                  <div
                    key={plan.id}
                    className={`glass rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-green-500/25 ${isYearly ? 'ring-1 ring-green-500/30' : ''
                      }`}>

                    {isYearly && (
                      <div className="absolute top-5 right-5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        BEST VALUE
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">
                        {plan.duration}
                      </div>
                      <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                      <div className="flex items-end gap-1 mt-3">
                        <span className="text-5xl font-extrabold">
                          £{(plan.price / 100).toFixed(2)}
                        </span>
                        <span className="text-gray-400 mb-1.5">/{plan.duration === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                      {isYearly && (
                        <p className="text-green-400 text-sm mt-1">
                          ≈ £{((plan.price / 100) / 12).toFixed(2)}/month — save 2 months
                        </p>
                      )}
                    </div>

                    <ul className="flex flex-col gap-3 mb-8 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                          <span className="text-green-400 shrink-0">✓</span> {f}
                        </li>
                      ))}
                    </ul>

                    {isDisabled ? (
                      <div className="btn-primary opacity-40 cursor-not-allowed text-center py-3 rounded-xl text-white font-semibold">
                        Add Stripe Price ID to Enable
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckout(plan.id)}
                        disabled={checkingOut === plan.id}
                        className="btn-primary">
                        {checkingOut === plan.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Redirecting...
                          </span>
                        ) : (
                          `Get ${plan.name} →`
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-gray-500 text-sm mt-8">
            Not signed in?{' '}
            <Link href="/auth" className="text-green-400 hover:text-green-300">Create a free account</Link>{' '}
            to subscribe.
          </p>
        </div>
      </main>
    </>
  );
}
