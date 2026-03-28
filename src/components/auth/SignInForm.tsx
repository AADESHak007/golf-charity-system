'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ApiResponse } from '@/types';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        setPassword('');
        
        const data: ApiResponse = await res.json();
      
      if (!data.success) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-12 p-8">
      <div className="space-y-4 text-center lg:text-left">
        <h2 className="text-5xl font-serif tracking-tighter text-white italic">Welcome back.</h2>
        <p className="text-white/50 font-light text-lg">Sign in to continue your journey of impact.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 transition-all font-light"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 transition-all font-light"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/auth/forgot-password" title="Feature coming soon" className="text-xs font-medium text-white/30 hover:text-accent transition-colors tracking-widest uppercase">
            Reset Password
          </Link>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3 text-rose-400/80"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-xs font-medium tracking-wide">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-premium group"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                  <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 3.75L14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </span>
        </button>
      </form>

      <p className="text-center text-white/30 text-xs tracking-widest uppercase font-medium pt-4">
        Don't have an account?{' '}
        <Link href="/signup" className="text-accent hover:text-white transition-colors ml-1">
          Join the Movement
        </Link>
      </p>
    </div>
  );
}
