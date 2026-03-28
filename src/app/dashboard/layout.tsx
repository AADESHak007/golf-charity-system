'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { Bell, Search, Plus } from 'lucide-react';
import { User, ApiResponse } from '@/types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data: ApiResponse<User> = await res.json();
        
        if (!data.success) {
          router.push('/signin');
          return;
        }
        
        setUser(data.data ?? null);
      } catch (err) {
        console.error('Session check failed');
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setEditingName(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleUpdateName = async () => {
    if (!newName.trim() || newName.trim() === user?.name) {
      setEditingName(false);
      return;
    }
    setUpdatingProfile(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch (err) {
      console.error('Failed to update name');
    } finally {
      setUpdatingProfile(false);
      setEditingName(false);
    }
  };

  const toggleEditMode = () => {
    setNewName(user?.name || '');
    setEditingName(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
            </div>
            <p className="text-slate-400 text-xs tracking-widest uppercase font-bold tracking-[0.2em] animate-pulse">Preparing Experience...</p>
        </div>
      </div>
    );
  }

  const formattedTitle = pathname.split('/').pop() === 'dashboard' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ');

  return (
    <div className="flex min-h-screen bg-white text-slate-900 selection:bg-accent/20 selection:text-accent font-sans">
      
      {/* Texture Overlay (Very subtle on light) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] z-0" />
      
      {/* Sidebar Navigation */}
      <DashboardNav />

      {/* Main Content Side */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-x-hidden">
        
        {/* Top Header Bar (Light Mode) */}
        <header className="hidden lg:flex items-center justify-between h-24 px-12 bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
           <div className="flex-1 max-w-xl">
              <div className="relative group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-accent transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search entries, charities, or draws... (⌘F)"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent/30 focus:bg-white transition-all font-light"
                 />
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                 <button className="relative p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-accent hover:border-accent/20 transition-all group shadow-sm">
                    <Bell className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                 </button>
              </div>
              
              <div className="h-10 w-px bg-slate-100" />

              {/* Profile Card & Dropdown */}
              <div className="relative" ref={menuRef}>
                <div 
                   onClick={() => setShowProfileMenu(!showProfileMenu)}
                   className="flex items-center gap-4 group cursor-pointer p-1 rounded-2xl transition-all"
                >
                   <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1 group-hover:text-accent transition-colors">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium italic">{user?.role || 'PLAYER'}</p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1 group-hover:border-accent/30 transition-all shadow-sm">
                      <div className="w-full h-full rounded-xl bg-accent/10 flex items-center justify-center text-accent font-serif italic text-xl">
                         {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                   </div>
                </div>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-[0_22px_70px_rgba(0,0,0,0.1)] border border-slate-100 p-6 z-50">
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 font-medium italic">Account Info</p>
                      
                      {/* Name Editing Section */}
                      <div className="space-y-1 mb-4">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Full Name</label>
                        {editingName ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              autoFocus
                              disabled={updatingProfile}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-accent/40"
                            />
                            <button 
                              onClick={handleUpdateName}
                              disabled={updatingProfile}
                              className="p-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors"
                            >
                              {updatingProfile ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4 rotate-45" style={{ display: 'none' }} /> // Hacky save icon visually, we'll just say "Save"
                              )}
                              {!updatingProfile && <span className="text-[10px] font-black uppercase px-2">Save</span>}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/edit">
                            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                            <button onClick={toggleEditMode} className="text-[10px] opacity-0 group-hover/edit:opacity-100 font-bold uppercase tracking-widest text-accent hover:text-emerald-400 transition-all">Edit</button>
                          </div>
                        )}
                      </div>

                      {/* Static Email */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</label>
                        <p className="text-sm font-medium text-slate-600 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-6 lg:p-12 pb-32 lg:pb-12 w-full max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-1000">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
             <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tighter capitalize italic">
                   {formattedTitle}.
                </h1>
                <p className="text-slate-400 font-medium text-sm max-w-sm uppercase tracking-widest leading-loose">
                   A legacy of impact and excellence starts with one swing.
                </p>
             </div>
             
             <div className="flex items-center gap-4">
               <Link 
                 href="/dashboard/scores" 
                 className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 group"
               >
                 <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                 New Score
               </Link>
               <Link 
                 href="/dashboard/charities" 
                 className="flex items-center gap-3 bg-slate-50 border border-slate-200 hover:border-accent/40 text-slate-600 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
               >
                 Manage Mission
               </Link>
             </div>
          </div>

          <AnimatePresence mode="wait">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
             >
                {children}
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
