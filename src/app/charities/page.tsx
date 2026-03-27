import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CharityDirectoryClient } from './CharityDirectoryClient';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Charity Directory | Golf Charity Platform',
  description: 'Support a cause you care about through every score you enter. Track your charitable impact and choose your mission.',
};

export default async function CharitiesPage() {
  const supabase = await createClient();

  // 1. Fetch Auth User
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch User Supported Charity IDs if logged in
  let supportedIds: string[] = [];
  if (user) {
    const { data: userCharities } = await supabase
      .from('user_charities')
      .select('charity_id')
      .eq('user_id', user.id);
    
    if (userCharities) {
      supportedIds = userCharities.map(c => c.charity_id);
    }
  }

  // 3. Fetch initial charities server side
  const { data: charities, error } = await supabase
    .from('charities')
    .select('id, name, slug, description, image_url, is_featured')
    .eq('is_active', true)
    .order('is_featured', { ascending: false });

  if (error) {
    console.error('Failed to fetch charities server side:', error);
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-zinc-950 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 relative overflow-hidden flex flex-col items-center py-12">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />
           
           <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-white/5 rounded-full px-6 py-2 shadow-2xl relative z-10">
              <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Impact Directory</span>
           </div>

           <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none relative z-10 max-w-4xl drop-shadow-2xl">
              Support a cause you <span className="text-orange-500 italic">actually</span> care about.
           </h1>

           <p className="text-base md:text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed relative z-10">
             Choose from our verified partner charities. Your contribution percentage drives funding to the missions that matter most to you.
           </p>
        </section>

        {/* Directory Content (Client-side interactive part) */}
        <CharityDirectoryClient 
          initialCharities={charities || []} 
          supportedIds={supportedIds}
        />

      </div>
    </main>
  );
}
