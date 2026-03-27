'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { ApiResponse, UserCharity } from '@/types';
import { AllocationSlider } from './AllocationSlider';
import { AllocationSummary } from './AllocationSummary';
import { CharitySelector } from './CharitySelector';
import Link from 'next/link';

interface UserCharityListProps {
  subscriptionPrice: number; // in pence
}

export const UserCharityList = ({ subscriptionPrice }: UserCharityListProps) => {
  const [data, setData] = useState<{
    charities: UserCharity[];
    total_allocation: number;
    remaining_allocation: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/user/charities');
      const result: ApiResponse = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch user charities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this charity spotlight?')) return;
    setRemovingId(id);
    try {
      const response = await fetch(`/api/user/charities/${id}`, {
        method: 'DELETE',
      });
      const result: ApiResponse = await response.json();
      if (result.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to remove charity:', err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-zinc-500 font-medium">Loading your impact dashboard...</p>
      </div>
    );
  }

  if (!data || data.charities.length === 0) {
    return (
      <div className="space-y-8">
        <AllocationSummary 
          totalAllocated={0}
          remainingAllocated={50}
          totalMonthlyPounds={0}
        />
        
        <div className="p-12 md:p-20 text-center bg-zinc-900 border border-white/5 rounded-[4rem] border-dashed space-y-8 shadow-2xl">
           <div className="p-6 bg-zinc-950 rounded-[2rem] w-fit mx-auto shadow-xl group">
              <Heart className="w-16 h-16 text-zinc-900 fill-zinc-900 group-hover:text-rose-500/20 group-hover:fill-rose-500/10 transition-colors duration-700" />
           </div>
           <div className="space-y-3">
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter">You haven't selected a cause yet.</h3>
              <p className="text-sm md:text-base text-zinc-500 max-w-sm mx-auto font-medium">
                Make your golf rounds matter. Choose up to 2 charities to support with your monthly membership.
              </p>
           </div>
           <CharitySelector 
             currentTotalAllocation={0}
             onSuccess={fetchData} 
           />
        </div>
      </div>
    );
  }

  const totalMonthlyPounds = (subscriptionPrice / 100) * (data.total_allocation / 100);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <AllocationSummary 
          totalAllocated={data.total_allocation}
          remainingAllocated={data.remaining_allocation}
          totalMonthlyPounds={totalMonthlyPounds}
        />
        
        {data.charities.length < 2 && (
          <div className="self-end md:self-auto order-first md:order-last">
            <CharitySelector 
              excludeIds={data.charities.map(c => c.charity_id)} 
              currentTotalAllocation={data.total_allocation}
              onSuccess={fetchData} 
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {data.charities.map((userCharity) => (
            <motion.div
              key={userCharity.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: -50 }}
              className="p-6 md:p-8 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[3rem] shadow-xl group hover:border-orange-500/20 transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12">
                {/* Charity Info */}
                <div className="flex items-center gap-6 w-full lg:w-1/3">
                  <div className="relative w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                      src={userCharity.charity?.image_url || ''} 
                      alt={userCharity.charity?.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                    />
                    {userCharity.charity?.is_featured && (
                      <div className="absolute top-1 right-1 p-1 bg-orange-500 text-white rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-xl font-black text-white truncate drop-shadow-sm group-hover:text-orange-400 transition-colors">
                      {userCharity.charity?.name}
                    </h4>
                    <div className="flex items-center gap-3">
                       <Link 
                        href={`/charities/${userCharity.charity?.slug}`}
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1 transition-all"
                       >
                         Profile <ExternalLink className="w-2.5 h-2.5" />
                       </Link>
                    </div>
                  </div>
                </div>

                {/* Allocation Controls */}
                <div className="flex-1 w-full border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-12">
                  <AllocationSlider 
                    userCharityId={userCharity.id}
                    initialAllocation={userCharity.allocation_perc}
                    subscriptionPrice={subscriptionPrice}
                    otherAllocationsTotal={data.total_allocation - userCharity.allocation_perc}
                    onUpdate={(newTotal) => {
                       // Update local state smoothly
                       setData(prev => prev ? {
                         ...prev,
                         total_allocation: newTotal,
                         remaining_allocation: 50 - newTotal,
                         charities: prev.charities.map(c => 
                           c.id === userCharity.id 
                             ? { ...c, allocation_perc: c.allocation_perc + (newTotal - prev.total_allocation) } 
                             : c
                         )
                       } : null);
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="w-full lg:w-auto flex justify-end">
                   <button
                    onClick={() => handleRemove(userCharity.id)}
                    disabled={removingId === userCharity.id}
                    className="p-4 rounded-2xl bg-white/0 hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 transition-all active:scale-95 disabled:opacity-50"
                   >
                     {removingId === userCharity.id ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Trash2 className="w-6 h-6" />
                      )}
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
