import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Heart, Globe, ArrowLeft, BadgeCheck, ExternalLink, CalendarDays, MapPin } from 'lucide-react';
import Link from 'next/link';
import { CharityProfileClient } from './CharityProfileClient';
import { CharityEventCard } from '@/components/charities/CharityEventCard';
  
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: charity } = await supabase.from('charities').select('name, description').eq('slug', slug).single();

  return {
    title: `${charity?.name || 'Charity'} | Golf Charity Platform`,
    description: charity?.description || 'Learn more about this impactful cause.',
  };
}

export default async function CharityProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Charity Details
  const { data: charity, error } = await supabase
    .from('charities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !charity) notFound();

  // 2. Fetch Upcoming Events
  const today = new Date().toISOString().split('T')[0];
  const { data: events } = await supabase
    .from('charity_events')
    .select('*')
    .eq('charity_id', charity.id)
    .eq('is_active', true)
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  // 3. Fetch User & Support Status
  const { data: { user } } = await supabase.auth.getUser();
  
  let isSubscribed = false;
  let userCharityData = null;
  let totalAllocated = 0;
  let currentSelectionsCount = 0;

  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    isSubscribed = !!sub;

    const { data: userCharities } = await supabase
      .from('user_charities')
      .select('charity_id, allocation_perc')
      .eq('user_id', user.id);
    
    if (userCharities) {
      userCharityData = userCharities.find(c => c.charity_id === charity.id) || null;
      totalAllocated = userCharities.reduce((acc, curr) => acc + curr.allocation_perc, 0);
      currentSelectionsCount = userCharities.length;
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
           <Link 
             href="/charities" 
             className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
           >
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             Impact Directory
           </Link>
           
           {userCharityData && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                 <BadgeCheck className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    You're supporting this cause ({userCharityData.allocation_perc}%)
                 </span>
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative rounded-[3.5rem] overflow-hidden aspect-video border border-white/5 shadow-2xl group">
              <img 
                src={charity.image_url || ''} 
                alt={charity.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
              
              {charity.is_featured && (
                <div className="absolute top-8 left-8 px-6 py-3 bg-orange-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/20">
                  Featured Partner
                </div>
              )}
            </div>

            <div className="space-y-8">
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none max-w-2xl">
                {charity.name}
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium">
                  {charity.description}
                </p>
                
                <div className="h-px w-full bg-white/5 my-12" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Our Mission</h4>
                      <p className="text-zinc-500 leading-relaxed text-sm">
                        Every monthly membership at Digital Heroes directly fuels the operations of {charity.name}. 
                        Your engagement allows us to provide reliable, scalable funding to programs that need it most.
                      </p>
                   </div>
                   {charity.website_url && (
                     <div className="space-y-4">
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Official Channel</h4>
                        <a 
                          href={charity.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-6 bg-zinc-900/50 border border-white/5 rounded-3xl text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-orange-500/20 transition-all active:scale-95 group/web"
                        >
                          <Globe className="w-5 h-5 text-orange-500" />
                          Visit {charity.name}
                          <ExternalLink className="w-3.5 h-3.5 group-hover/web:translate-x-1 group-hover/web:-translate-y-1 transition-transform" />
                        </a>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="space-y-8 pt-12 border-t border-white/5">
               <div className="flex items-center gap-4">
                  <CalendarDays className="w-8 h-8 text-orange-500" />
                  <h2 className="text-3xl font-black text-white tracking-tight">Upcoming Events</h2>
               </div>
               
               {events && events.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {events.map((event) => (
                      <CharityEventCard key={event.id} event={event} />
                   ))}
                 </div>
               ) : (
                 <div className="p-12 text-center bg-zinc-900/40 border border-white/5 rounded-[2.5rem] border-dashed">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No upcoming events found</p>
                 </div>
               )}
            </div>
          </div>

          {/* Right Column: Support Mechanism */}
          <div className="lg:col-span-5 relative mt-16 lg:mt-0">
             <div className="sticky top-32">
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
