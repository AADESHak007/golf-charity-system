import { Metadata } from 'next';
import { Target, Trophy, Heart, ShieldCheck, ChevronRight, Zap, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'How It Works | Golf Charity Platform',
  description: 'Understand the mechanics of our monthly prize draws, how Stableford scores are matched, and how your subscription supports real charity impact.',
};

export default function HowItWorksPage() {
  return (
    <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6">
            
            {/* Page Hero */}
            <div className="text-center space-y-8 mb-32 flex flex-col items-center">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100/50 rounded-full text-indigo-600 text-xs font-black uppercase tracking-widest">
                   <Target className="w-4 h-4" />
                   Platform Mechanics
                 </div>
                 <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
                   How we turn your game into <span className="text-indigo-600 italic">real impact.</span>
                 </h1>
                 <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                   Understand every detail of the monthly draw, from score entry to winner verification and charitable contribution.
                 </p>
            </div>

            {/* Section 1: The Draw Mechanics */}
            <section className="bg-gray-50 border border-gray-100 rounded-[4rem] p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-16 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
                     <span className="text-[200px] font-black leading-none">01</span>
                 </div>
                 
                 <div className="space-y-10 relative z-10">
                    <div className="p-4 bg-indigo-600 text-white rounded-3xl w-16 h-16 flex items-center justify-center shadow-2xl">
                        <Zap className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-6">The Draw Mechanics</h2>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed mb-6">
                            Every month, our engine generates 5 unique winning numbers using a combination of random distribution and market weighted modes.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">1</div>
                                <p className="text-sm font-medium text-gray-600"><span className="font-black text-gray-900">Score Range:</span> We use your Stableford points (0-45). Your entries are based on your last 5 verified scores.</p>
                            </div>
                            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">2</div>
                                <p className="text-sm font-medium text-gray-600"><span className="font-black text-gray-900">The Matching:</span> If your scores match 3, 4, or all 5 of the drawn numbers, you win. Order doesn't matter.</p>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Visual Example: The Matching */}
                 <div className="bg-indigo-600 text-white p-12 rounded-[3.5rem] shadow-2xl space-y-10 group hover:scale-[1.02] transition-transform duration-500">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-4">Live Example</p>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest mb-3">Drawn Numbers</p>
                                <div className="flex gap-2">
                                    {[12, 18, 24, 31, 38].map(n => <span key={n} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black text-sm border border-white/10">{n}</span>)}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-indigo-200/50 uppercase tracking-widest mb-3">Your Scores</p>
                                <div className="flex gap-2">
                                    {[12, 18, 24, "XX", "XX"].map((n, i) => (
                                        <span key={i} className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border transition-all", typeof n === 'number' ? "bg-emerald-500 border-white/20" : "bg-white/5 border-white/5 opacity-30")}>
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black uppercase tracking-widest text-indigo-200">Result</span>
                            <span className="text-2xl font-black text-emerald-400">3 MATCH WINNER!</span>
                        </div>
                    </div>
                 </div>
            </section>

            {/* Section 2: Prize Pool Explained */}
            <section className="bg-[#0f172a] rounded-[4rem] p-12 md:p-20 text-white grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-16 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
                     <span className="text-[200px] font-black leading-none text-white">02</span>
                 </div>
                 
                 <div className="space-y-10 relative z-10">
                    <div className="p-4 bg-emerald-600 text-white rounded-3xl w-16 h-16 flex items-center justify-center shadow-2xl shadow-emerald-600/20">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter leading-none mb-6">Prize Pool & Rollovers</h2>
                        <p className="text-lg text-gray-400 font-medium leading-relaxed mb-8">
                            We use a tiered distribution system. If the jackpot isn't won, the pool grows through rollovers.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                                <h4 className="text-blue-400 font-black tracking-widest text-[10px] uppercase">Tier Splits</h4>
                                <ul className="text-sm space-y-1 font-bold text-gray-300">
                                    <li>40% Jackpot (5 match)</li>
                                    <li>35% Tier 2 (4 match)</li>
                                    <li>25% Tier 3 (3 match)</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                                <h4 className="text-emerald-400 font-black tracking-widest text-[10px] uppercase">Rollover Dynamics</h4>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">If no winner hits a tier, the entire pool is carried forward to the following month's same-tier pool.</p>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Visual Example: Rollover Cycle */}
                 <div className="space-y-10">
                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center lg:text-left">Rollover Timeline Illustration</p>
                        <div className="flex flex-col gap-6">
                            {[
                                { month: 'JANUARY', amount: '$200', text: 'No winner, rolling over...', color: 'text-indigo-400 border-indigo-400/20' },
                                { month: 'FEBRUARY', amount: '$400', text: 'Accumulating jackpot...', color: 'text-sky-400 border-sky-400/20' },
                                { month: 'MARCH', amount: '$600', text: 'JACKPOT WON!', color: 'text-emerald-400 border-emerald-400/20 bg-emerald-500/10 shadow-2xl shadow-emerald-500/10' },
                            ].map((item, i) => (
                                <div key={i} className={cn("p-6 border rounded-[2.5rem] flex items-center justify-between group transition-all duration-500 hover:scale-[1.05]", item.color)}>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{item.month}</p>
                                        <p className="text-2xl font-black">{item.amount}</p>
                                    </div>
                                    <p className="text-xs font-bold italic opacity-60 uppercase tracking-tight">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </section>

             {/* Section 3 & 4 Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                 {/* Charity Support */}
                 <div className="bg-white border border-gray-100 rounded-[4rem] p-12 md:p-16 space-y-10">
                     <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl w-14 h-14 flex items-center justify-center">
                         <Heart className="w-6 h-6 fill-rose-600" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-6">Charity Support</h3>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8">
                            A portion of your subscription (starting at 10%) goes to your selected charcoal cause.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-start">
                                <div className="p-1 bg-rose-50 rounded-lg text-rose-600 shrink-0 mt-1"><ChevronRight size={12}/></div>
                                <p className="text-sm font-medium text-gray-600">You select exactly where your money goes from our verified directory.</p>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="p-1 bg-rose-50 rounded-lg text-rose-600 shrink-0 mt-1"><ChevronRight size={12}/></div>
                                <p className="text-sm font-medium text-gray-600">Adjust your contribution up to 50% directly from your dashboard.</p>
                            </li>
                        </ul>
                     </div>
                 </div>

                 {/* Verification */}
                 <div className="bg-white border border-gray-100 rounded-[4rem] p-12 md:p-16 space-y-10">
                     <div className="p-4 bg-sky-100 text-sky-600 rounded-2xl w-14 h-14 flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-6">Winner Verification</h3>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8">
                            We take platform integrity seriously. All winners must verify their Stableford scores.
                        </p>
                        <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                             <div className="flex items-center gap-3 mb-3">
                                <Info className="w-4 h-4 text-sky-600" />
                                <span className="text-xs font-black uppercase text-gray-400">Process</span>
                             </div>
                             <p className="text-xs text-gray-500 font-medium leading-relaxed">Simply upload a screenshot from your official golf platform showing the scores and date. Our admin team verifies all 3+ match winners before payouts.</p>
                        </div>
                     </div>
                 </div>
             </div>

             {/* Bottom CTA */}
             <div className="text-center pt-12">
                <Link 
                    href="/signup" 
                    className="inline-flex items-center justify-center px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 group gap-3"
                >
                    Start your subscription
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>

        </div>
    </main>
  );
}
