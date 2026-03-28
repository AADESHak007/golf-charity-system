import { Metadata } from 'next';
import { CharityDirectoryClient } from '@/app/(landing)/charities/CharityDirectoryClient';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Charities | GolfCharity Dashboard',
  description: 'Manage your charitable allocations and discover new missions to support.',
};

export default function CharitiesPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-serif italic text-slate-900 tracking-tighter">
          Select Charities.
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
            Choose up to 2 charities to support with your monthly subscription
        </p>
      </header>

      <div className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex items-start flex-col md:flex-row gap-6 hover:shadow-2xl hover:border-slate-700 hover:-translate-y-1 transition-all duration-500 cursor-default">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white group-hover:bg-white group-hover:text-slate-900 transition-colors shadow-inner shrink-0">
              <Info className="w-6 h-6" />
          </div>
          <div className="space-y-3">
              <p className="font-black text-white/30 uppercase tracking-[0.4em] text-[10px] italic">Rule Book</p>
              <p className="text-sm text-white/60 leading-relaxed font-medium max-w-3xl italic">
                 You can select up to <span className="text-white font-bold tracking-tight">2 charities</span>. Your total allocation must be between <span className="text-white/80">10% and 50%</span> of your subscription price. You can change these at any time before the <span className="bg-white/10 text-white px-2 py-1 rounded-md font-black uppercase tracking-widest text-[9px] border border-white/5 shadow-sm ml-1 group-hover:bg-accent group-hover:border-accent transition-colors">next draw</span>.
              </p>
          </div>
      </div>

      <CharityDirectoryClient />
    </div>
  );
}
