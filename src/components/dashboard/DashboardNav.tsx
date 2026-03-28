'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Target, 
  Heart, 
  Trophy, 
  Wallet, 
  LogOut, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'My Scores', icon: Target, href: '/dashboard/scores' },
  { label: 'Charities', icon: Heart, href: '/dashboard/charities' },
  { label: 'Draws', icon: Trophy, href: '/dashboard/draws' },
  { label: 'Winnings', icon: Wallet, href: '/dashboard/winnings' },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    async function checkWinner() {
      try {
        const res = await fetch('/api/winner');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const pending = data.data.some((v: any) => v.status === 'awaiting_proof' || v.status === 'rejected');
          setHasPending(pending);
        }
      } catch (err) {
        console.error('Failed to check winner notifications');
      }
    }
    checkWinner();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/signin');
      router.refresh();
    } catch (err) {
      console.error('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar (Light Mode) */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 py-10 px-6 font-sans">
        <div className="mb-12 px-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-serif text-slate-900 tracking-tighter">
              Golf<span className="italic text-accent">Charity</span>
            </span>
          </Link>
        </div>

        <div className="mb-8 px-4">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900/40 mb-6 font-medium italic">General Menu</p>
           <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const showDot = item.label === 'Winnings' && hasPending;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="relative">
                      <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "group-hover:text-accent")} />
                      {showDot && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />}
                  </div>
                  <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-1 px-4 border-t border-slate-100 pt-8">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900/40 mb-6 font-medium italic">Preferences</p>

           <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50/50 transition-colors text-[13px] font-bold tracking-tight"
          >
            <LogOut className="w-5 h-5 shadow-sm" />
            <span>{loading ? 'Sign Out...' : 'Log Out'}</span>
          </button>
        </div>

        {/* Branding Promo Card (Navy Mode) */}
        <div className="mt-8 pb-12">
           <Link 
             href="/pricing" 
             className="block p-5 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all cursor-pointer"
           >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 blur-2xl rounded-full translate-x-8 -translate-y-8 opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 relative z-10 mb-3">
                 <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                 </div>
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">
                    Elite Access
                 </p>
              </div>
              
              <p className="text-[11px] text-slate-400 font-medium italic relative z-10 leading-relaxed mb-4 pl-1">
                 Elevate your impact and participation speed.
              </p>

              <div className="w-full py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest text-center rounded-xl transition-all relative z-10 shadow-md group-hover:bg-accent group-hover:text-white">
                 Upgrade Now
              </div>
           </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Light Mode) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 bg-white/90 backdrop-blur-2xl border border-slate-100 px-4 py-4 rounded-[2.5rem] shadow-2xl">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300",
                  isActive ? "text-accent scale-110" : "text-slate-300"
                )}
              >
                <item.icon className={cn("w-5 h-5")} />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
