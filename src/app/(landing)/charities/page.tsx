import { Metadata } from 'next';
import { CharityDirectoryClient } from './CharityDirectoryClient';
import { Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Charity Directory | Golf Charity Platform',
  description: 'Support a cause you care about through every score you enter. Track your charitable impact and choose your mission.',
};

export default function CharitiesPage() {
  return (
    <main className="min-h-screen pt-40 pb-24 bg-[#050810] font-sans relative z-0">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 relative overflow-hidden flex flex-col items-center py-12">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] pointer-events-none rounded-full -z-10" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-900/50 blur-[150px] pointer-events-none rounded-full -z-10" />
           
           <div className="flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-full px-6 py-3 shadow-2xl relative z-10">
              <Heart className="w-4 h-4 text-slate-400 fill-slate-800 animate-pulse" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Impact Directory</span>
           </div>

           <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-[0.85] relative z-10 max-w-5xl drop-shadow-2xl">
              Support a cause you <span className="text-slate-500 italic">actually</span> care about.
           </h1>

           <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed relative z-10">
             Choose from our verified partner charities. Your contribution percentage drives funding to the missions that matter most to you.
           </p>
        </section>

        {/* Directory Content (Client-side interactive part) */}
        <CharityDirectoryClient />

      </div>
    </main>
  );
}
