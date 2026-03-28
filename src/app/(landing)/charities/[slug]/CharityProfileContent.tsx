'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Heart, Globe, ArrowLeft, BadgeCheck, ExternalLink, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CharityProfileClient } from './CharityProfileClient';
import { CharityEventCard } from '@/components/charities/CharityEventCard';
import { ApiResponse, User, Subscription, Charity } from '@/types';

interface CharityExtended extends Charity {
  events: any[];
}

interface CharityProfileContentProps {
  slug: string;
}

export default function CharityProfileContent({ slug }: CharityProfileContentProps) {
  const [charity, setCharity] = useState<CharityExtended | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userCharities, setUserCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Fetch Charity Details
        const charRes = await fetch(`/api/charities/${slug}`);
        const charData: ApiResponse = await charRes.json();
        
        if (!charData.success) {
          setError(charData.error || "Charity not found");
          return;
        }
        setCharity(charData.data);

        // 2. Fetch User & Support Status (if logged in)
        const userRes = await fetch('/api/auth/me');
        if (userRes.status === 200) {
          const userData: ApiResponse<User> = await userRes.json();
          if (userData.success && userData.data) {
            setUser(userData.data);
            
            // Sub status check
            const subRes = await fetch('/api/subscriptions/me');
            const subData: ApiResponse<Subscription> = await subRes.json();
            if (subData.success && subData.data?.status === 'active') {
              setIsSubscribed(true);
            }

            // User charities check
            const userCharRes = await fetch('/api/user/charities');
            const userCharData: ApiResponse<any[]> = await userCharRes.json();
            if (userCharData.success && Array.isArray(userCharData.data)) {
              setUserCharities(userCharData.data);
            } else {
              setUserCharities([]);
            }
          }
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 bg-slate-950 min-h-screen">
        <Loader2 className="w-12 h-12 text-slate-800 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Accessing Charity HQ...</p>
      </div>
    );
  }

  if (error || !charity) {
    return (
        <div className="min-h-screen bg-slate-950 pt-40 px-6">
            <div className="max-w-md mx-auto p-12 bg-rose-500/10 border border-rose-500/20 rounded-[3rem] text-center space-y-6 shadow-2xl">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
                <h3 className="text-3xl font-serif italic text-white tracking-tighter">Profile Offline.</h3>
                <p className="text-rose-400 font-medium italic">{error || "Could not load this mission profile."}</p>
                <Link href="/charities" className="block w-full py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-[0.2em] text-[10px]">
                    Back to directory
                </Link>
            </div>
        </div>
    );
  }

  const validUserCharities = Array.isArray(userCharities) ? userCharities : [];
  const userCharityData = validUserCharities.find(c => c.charity_id === charity.id) || null;
  const totalAllocated = validUserCharities.reduce((acc, curr) => acc + curr.allocation_perc, 0);
  const currentSelectionsCount = validUserCharities.length;

  return (
    <main className="pb-32 bg-white relative z-0">
      
      {/* Dynamic Full Width Dark Header */}
      <div className="w-full bg-[#050810] pt-40 pb-48 px-6 rounded-b-[4rem]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link 
              href="/charities" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Impact Directory
            </Link>
            
            {userCharityData && (
               <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-2xl">
                  <BadgeCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-emerald-500">
                     Supporting: {userCharityData.allocation_perc}% Allocation
                  </span>
               </div>
            )}
          </div>

          <h1 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-[0.9] max-w-4xl drop-shadow-2xl">
            {charity.name}
          </h1>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-16">
            <div className="relative rounded-[4rem] overflow-hidden aspect-video border border-slate-800 shadow-[0_30px_100px_rgba(0,0,0,0.4)] group ring-1 ring-white/10 ring-inset bg-slate-900">
              <img 
                src={charity.image_url || ''} 
                alt={charity.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/80 via-transparent to-transparent opacity-80" />
              
              {charity.is_featured && (
                <div className="absolute top-10 left-10 px-8 py-3 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                  Mission-First Partner
                </div>
              )}
            </div>

            <div className="space-y-10">
              <div className="prose prose-slate max-w-none pt-8">
                <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium tracking-tight italic">
                  "{charity.description}"
                </p>
                
                <div className="h-px w-full bg-slate-100 my-16" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Core Mission</h4>
                      <p className="text-slate-500 leading-relaxed text-[13px] font-medium italic">
                        Digital Heroes transforms every golf round into reliable funding for {charity.name}. 
                        By selecting this mission, 10-50% of your registration fee goes straight to their programs.
                      </p>
                   </div>
                   {charity.website_url && (
                     <div className="space-y-6">
                        <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] mb-4 text-center md:text-left">Official Presence</h4>
                        <a 
                          href={charity.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center md:justify-start gap-4 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-100 hover:border-slate-200 transition-all active:scale-95 group/web shadow-sm"
                        >
                          <Globe className="w-5 h-5 text-slate-400 group-hover/web:text-slate-900 transition-colors" />
                          Explore Website
                          <ExternalLink className="w-4 h-4 ml-auto opacity-40 group-hover/web:opacity-100 transition-opacity hidden md:block" />
                        </a>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="space-y-10 pt-16 border-t border-slate-100">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 shadow-sm">
                    <CalendarDays className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-serif italic tracking-tighter text-slate-900">Impact Events.</h2>
               </div>
               
               {charity.events && charity.events.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {charity.events.map((event: any) => (
                      <CharityEventCard key={event.id} event={event} />
                   ))}
                 </div>
               ) : (
                 <div className="p-20 text-center bg-slate-50 border border-slate-100 rounded-[3.5rem] flex flex-col items-center gap-4 shadow-sm">
                    <CalendarDays className="w-12 h-12 text-slate-300" />
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No upcoming events listed</p>
                 </div>
               )}
            </div>
          </div>

          {/* Right Column: Support Mechanism */}
          <div className="lg:col-span-5 relative mt-16 lg:mt-0">
             <div className="sticky top-40">
                <CharityProfileClient 
                   charityId={charity.id}
                   isLoggedIn={!!user}
                   isSubscribed={isSubscribed}
                   currentSupport={userCharityData}
                   totalAllocated={totalAllocated}
                   currentCount={currentSelectionsCount}
                />
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}
