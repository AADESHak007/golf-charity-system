'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.success) setUser(d.data);
    });
  }, [pathname]);

  const handleSignout = async () => {
    setLoading(true);
    await fetch('/api/auth/signout', { method: 'POST' });
    setUser(null);
    router.push('/');
    setLoading(false);
  };

  return (
    <nav className="navbar px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⛳</span>
          <span className="font-bold text-lg gradient-text">GolfCharity</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard"
                className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Dashboard
              </Link>
              <Link href="/pricing"
                className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Plans
              </Link>
              <button
                onClick={handleSignout}
                disabled={loading}
                className="text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-colors">
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link href="/pricing"
                className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                Pricing
              </Link>
              <Link href="/auth"
                className="text-sm px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors font-medium">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
