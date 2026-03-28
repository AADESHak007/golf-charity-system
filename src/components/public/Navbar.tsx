'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User, ApiResponse } from '@/types';

const navLinks = [
  { href: '/how-it-works', label: 'Impact' },
  { href: '/charities', label: 'Charities' },
  { href: '/pricing', label: 'Memberships' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 200) {
          const data: ApiResponse<User> = await res.json();
          setUser(data.data ?? null);
        }
      } catch (err) {
        console.error('Auth check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out",
        isScrolled 
          ? "bg-[#050810]/80 backdrop-blur-2xl border-b border-white/5 py-3" 
          : "bg-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <span className="text-2xl md:text-3xl font-serif text-white tracking-tighter">
            Golf<span className="italic text-accent">Charity</span>
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks
            .filter(link => !(link.href === '/pricing' && user?.role === 'ADMIN'))
            .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-300",
                    isActive 
                      ? "text-accent" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
          })}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="hidden lg:flex items-center gap-8">
          {loading ? (
            <div className="w-20 h-8 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <Link 
              href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
              className="flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              {user.role === 'ADMIN' ? 'Admin Panel' : 'Portal'}
            </Link>
          ) : (
             <Link 
                href="/signin"
                className="text-white/60 hover:text-white text-[13px] font-medium tracking-[0.2em] uppercase transition-colors"
              >
                Sign In
              </Link>
          )}
          
          {!(user?.role === 'ADMIN') && (
            <Link 
              href="/signup"
              className="px-6 py-2.5 rounded-full bg-white text-black text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95"
            >
              Join the Movement
            </Link>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-white relative z-50"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#050810] z-40 lg:hidden flex flex-col justify-center p-12"
          >
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-5xl font-serif text-white italic"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px w-24 bg-white/10 my-4" />
              {user ? (
                 <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif text-accent italic"
                  >
                    Member Portal
                  </Link>
              ) : (
                <Link 
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-white/40 italic"
                >
                  Sign In
                </Link>
              )}
              <Link 
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 text-xl font-bold tracking-[0.2em] uppercase text-white"
              >
                Join the Movement &rarr;
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
