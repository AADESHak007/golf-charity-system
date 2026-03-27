'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'signin' | 'signup';

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'PLAYER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = tab === 'signup' ? '/api/auth/signup' : '/api/auth/signin';
    const body = tab === 'signup'
      ? { name: form.name, email: form.email, password: form.password, role: form.role as 'PLAYER' | 'ADMIN' }
      : { email: form.email, password: form.password };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error || 'Something went wrong');
    } else {
      router.push(tab === 'signup' ? '/auth?tab=signin&registered=true' : '/dashboard');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 page-enter">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">⛳</span>
            <span className="font-extrabold text-2xl gradient-text">GolfCharity</span>
          </Link>
          <p className="text-gray-400 text-sm">
            {tab === 'signup' ? 'Create your account to get started' : 'Welcome back! Sign in to your account'}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-white/4 p-1 mb-8">
            {(['signin', 'signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}>
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="input-field">
                    <option value="PLAYER">Player</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading
                ? (tab === 'signup' ? 'Creating account...' : 'Signing in...')
                : (tab === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {tab === 'signup' ? (
              <>Already have an account?{' '}
                <button onClick={() => setTab('signin')} className="text-green-400 hover:text-green-300 font-medium">Sign in</button>
              </>
            ) : (
              <>No account yet?{' '}
                <button onClick={() => setTab('signup')} className="text-green-400 hover:text-green-300 font-medium">Sign up for free</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
