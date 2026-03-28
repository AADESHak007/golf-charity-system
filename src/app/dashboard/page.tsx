'use client';

import { useEffect, useState } from 'react';
import OverviewCard from '@/components/dashboard/OverviewCard';
import SubscriptionBanner from '@/components/dashboard/SubscriptionBanner';
import RecentDrawCard from '@/components/dashboard/RecentDrawCard';
import CharitySummaryCard from '@/components/dashboard/CharitySummaryCard';
import { 
  CreditCard, 
  Trophy, 
  Heart, 
  Ticket, 
  ChevronRight,
  TrendingUp,
  Target,
  Calendar,
  Sparkles,
  Activity,
  History,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    me: null,
    scores: [],
    charities: [],
    draws: [],
    winner: [],
    subscription: null
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [meRes, scoresRes, charitiesRes, drawsRes, winnerRes, subRes] = await Promise.all([
        fetch('/api/auth/me').then(r => r.json()),
        fetch('/api/scores').then(r => r.json()),
        fetch('/api/user/charities').then(r => r.json()),
        fetch('/api/draws').then(r => r.json()),
        fetch('/api/winner').then(r => r.json()),
        fetch('/api/subscriptions/me').then(r => r.json()),
      ]);

      setData({
        me: meRes.success ? meRes.data : null,
        scores: scoresRes.success ? scoresRes.data : [],
        charities: charitiesRes.success ? (charitiesRes.data.charities || []) : [],
        draws: drawsRes.success ? drawsRes.data : [],
        winner: winnerRes.success ? winnerRes.data : [],
        subscription: subRes.success ? subRes.data : null
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScoreAdded = (newScores: any[]) => {
    setData((prev: any) => ({ ...prev, scores: newScores }));
  };

  const totalWonPence = data.winner
    ?.filter((w: any) => w.status === 'PAID')
    ?.reduce((acc: number, curr: any) => acc + (curr.draw_entry?.prize_amount_pence || 0), 0) || 0;
  
  const drawWins = data.winner?.length || 0;
  const drawEntries = data.draws?.length || 0; 
  
  const subAmount = data.subscription?.price_pence || 0;
  const totalCharityAllocation = data.charities?.reduce((acc: number, curr: any) => acc + (curr.allocation_perc || 0), 0) || 0;
  const estimatedCharityContribution = (subAmount * totalCharityAllocation) / 100 / 100;

  const latestDraw = data.draws?.[0];

  return (
    <div className="space-y-12 pb-24 lg:pb-0">
      
      {/* Stat Cards based on image structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <OverviewCard
          loading={loading}
          title="Subscription"
          variant="brand"
          value={data.subscription?.status === 'active' ? 'Active' : 'No Plan'}
          subText={data.subscription?.current_period_end ? `Renews shortly.` : 'Subscribe to win.'}
          icon={CreditCard}
          color={data.subscription?.status === 'active' ? 'accent' : 'rose'}
        />
        <OverviewCard
          loading={loading}
          title="Total Won"
          value={`$${(totalWonPence / 100).toFixed(2)}`}
          subText={`Across ${drawWins} claims.`}
          icon={Trophy}
          color="blue"
        />
        <OverviewCard
          loading={loading}
          title="Impact Summary"
          value={`$${estimatedCharityContribution.toFixed(2)}`}
          subText={`To ${data.charities?.length || 0} missions.`}
          icon={Heart}
          color="rose"
        />
        <OverviewCard
          loading={loading}
          title="Participation"
          value={drawEntries}
          subText={`${drawWins} wins recorded.`}
          icon={Ticket}
          color="amber"
        />
      </div>

      {/* Main Grid: Asymmetrical as seen in image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Banner - taking 8/12 of the space */}
        <div className="lg:col-span-8">
          <SubscriptionBanner 
            loading={loading}
            subscription={data.subscription}
            onRefresh={fetchData}
          />
        </div>
        
        {/* Latest Draw - taking 4/12 */}
        <div className="lg:col-span-4 max-h-[600px]">
          <RecentDrawCard 
            loading={loading}
            draw={latestDraw}
          />
        </div>
        
        {/* Left Column Section: Charities */}
        <div className="lg:col-span-7">
           <CharitySummaryCard 
            loading={loading}
            charities={data.charities}
            subscriptionAmount={subAmount}
          />
        </div>

        {/* Right Column Section: Performance (Light Mode Redesign) */}
        <div className="lg:col-span-5 h-full"> 
            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 lg:p-14 mb-10 transition-all duration-700 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-slate-200/50 h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] pointer-events-none transition-all duration-1000 group-hover:opacity-10" />
                
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <div className="p-5 rounded-[1.5rem] bg-slate-50 text-accent border border-slate-100 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2 leading-none italic">Growth Engine</h3>
                            <h4 className="text-2xl font-serif italic tracking-tighter text-slate-900 leading-none">Recent Round Scores.</h4>
                        </div>
                    </div>
                    <Link 
                        href="/dashboard/scores" 
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group/btn shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </div>

                <div className="space-y-6 flex-1">
                    {data.scores?.length > 0 ? (
                        data.scores.slice(0, 3).map((s: any, i: number) => (
                            <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 flex items-center justify-between hover:bg-white hover:border-slate-200 transition-all duration-500 group/item shadow-sm hover:shadow-xl hover:shadow-slate-100/50">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl font-serif italic text-slate-900 group-hover/item:text-accent transition-colors shadow-sm">
                                        {s.score}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-accent italic">Stableford Points</p>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold leading-none">{new Date(s.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <Sparkles className="w-5 h-5 text-accent opacity-0 group-hover/item:opacity-30 transition-opacity" />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-24 space-y-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-200">
                                <Target className="w-10 h-10" />
                            </div>
                            <div className="space-y-2 px-12">
                               <p className="text-base font-bold text-slate-900">Measure your game.</p>
                               <p className="text-sm font-medium text-slate-400 italic">Submit your first round today to track growth.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {data.scores?.length > 0 && (
                    <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 leading-none italic">Verified Average</p>
                            <p className="text-4xl font-serif italic text-slate-900 tracking-tighter">
                                {(data.scores.reduce((a: any, b: any) => a + b.score, 0) / data.scores.length).toFixed(1)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-accent/10 border border-accent/20 rounded-full shadow-sm">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <span className="text-[10 px] font-black uppercase tracking-widest text-accent italic">Trending</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
