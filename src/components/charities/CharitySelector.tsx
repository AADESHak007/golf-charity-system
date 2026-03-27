'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X, Heart, HeartOff, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiResponse, Charity } from '@/types';

interface CharitySelectorProps {
  onSuccess?: () => void;
  excludeIds?: string[];
  currentTotalAllocation: number;
}

export const CharitySelector = ({ 
  onSuccess, 
  excludeIds = [],
  currentTotalAllocation
}: CharitySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [allocation, setAllocation] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const fetchCharities = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      const response = await fetch(`/api/charities?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setCharities(result.data.filter((c: Charity) => !excludeIds.includes(c.id)));
      }
    } catch (err) {
      console.error('Failed to fetch charities:', err);
    } finally {
      setLoading(false);
    }
  }, [excludeIds]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchCharities(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, isOpen, fetchCharities]);

  const handleAdd = async () => {
    if (!selectedCharity) return;
    
    if (currentTotalAllocation + allocation > 50) {
      setError('Total allocation cannot exceed 50%');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/user/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          charityId: selectedCharity.id,
          allocation_perc: allocation 
        }),
      });
      
      const result: ApiResponse = await response.json();
      if (result.success) {
        setIsOpen(false);
        setSelectedCharity(null);
        setAllocation(10);
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Failed to add charity');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const remainingMax = 50 - currentTotalAllocation;
  const canAddMore = currentTotalAllocation < 50 && excludeIds.length < 2;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={!canAddMore}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border shadow-xl shadow-zinc-950/20",
          canAddMore 
            ? "bg-orange-500 border-orange-400 text-white hover:bg-orange-400" 
            : "bg-zinc-900 border-white/5 text-zinc-600 cursor-not-allowed"
        )}
      >
        <Plus className="w-3.5 h-3.5" />
        {excludeIds.length >= 2 ? 'Max 2 Charities Reached' : 'Add Charity'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[600px]"
            >
              {/* Left Column: Search & List */}
              <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-white/5">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white tracking-tight">Support a Cause</h3>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search mission or cause..."
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-white focus:border-orange-500/50 outline-hidden transition-all placeholder-zinc-600 appearance-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
                  {loading ? (
                    <div className="py-20 text-center flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                  ) : charities.length > 0 ? (
                    charities.map(charity => (
                      <button
                        key={charity.id}
                        onClick={() => setSelectedCharity(charity)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                          selectedCharity?.id === charity.id 
                            ? "bg-orange-500 border-orange-400 shadow-xl shadow-orange-500/10" 
                            : "bg-zinc-950/50 border-white/5 hover:bg-zinc-800"
                        )}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                          <img src={charity.image_url || ''} alt={charity.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className={cn("text-sm font-bold truncate", selectedCharity?.id === charity.id ? "text-white" : "text-zinc-300 group-hover:text-white")}>
                            {charity.name}
                          </h4>
                          <p className={cn("text-[10px] truncate", selectedCharity?.id === charity.id ? "text-white/70" : "text-zinc-500")}>
                            {charity.description}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-20 text-center opacity-40">
                      <HeartOff className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No matching causes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Allocation Selection */}
              <div className="w-full md:w-72 p-8 bg-zinc-950 border-t md:border-t-0 border-white/5 flex flex-col justify-between">
                <div>
                  <div className="hidden md:flex justify-end mb-8">
                    <button onClick={() => setIsOpen(false)} className="text-zinc-700 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                  </div>

                  {selectedCharity ? (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Your Selection</span>
                        <h4 className="text-xl font-black text-white leading-tight">{selectedCharity.name}</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <span className="text-3xl font-black text-white">{allocation}%</span>
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Allocation</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={Math.min(50, remainingMax)}
                          step={5}
                          value={allocation}
                          onChange={(e) => setAllocation(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">
                          <span>Min 10%</span>
                          <span>Max {Math.min(50, remainingMax)}%</span>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                           <X className="w-4 h-4 text-rose-500" />
                           <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight leading-tight">{error}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                       <Heart className="w-12 h-12 text-zinc-900 fill-zinc-900" />
                       <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                          Select a cause on the left to confirm support
                       </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-8">
                   <button
                    onClick={handleAdd}
                    disabled={!selectedCharity || submitting}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                   >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : (
                      <>
                        Confirm Selection
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                   </button>
                   <p className="text-[8px] font-bold text-center text-zinc-700 uppercase tracking-widest px-4">
                      Total cannot exceed 50% across both charities
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
