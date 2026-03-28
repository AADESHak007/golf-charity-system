'use client';

import { useState, useEffect, useCallback } from 'react';
import { CharitySearch } from '@/components/charities/CharitySearch';
import { CharityGrid } from '@/components/charities/CharityGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart } from 'lucide-react';
import { ApiResponse } from '@/types';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
  upcoming_events_count?: number;
}

export const CharityDirectoryClient = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [supportedIds, setSupportedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function initFetch() {
      try {
        setLoading(true);
        // 1. Fetch Charities
        const charRes = await fetch('/api/charities').catch(() => null);
        let charData = { success: false, data: [] };
        if (charRes?.ok) {
           charData = await charRes.json().catch(() => ({ success: false, data: [] }));
        }
        
        // 2. Fetch User Supported Charities (if logged in)
        const userCharRes = await fetch('/api/user/charities').catch(() => null);
        let userCharData = { success: false, data: [] };
        if (userCharRes?.ok) {
            userCharData = await userCharRes.json().catch(() => ({ success: false, data: [] }));
        }

        if (userCharData.success && Array.isArray(userCharData.data)) {
            setSupportedIds(userCharData.data.map((c: any) => c.charity_id));
        } else {
            setSupportedIds([]);
        }

        if (charData.success) {
            setCharities(charData.data || []);
        }
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoading(false);
      }
    }
    initFetch();
  }, []);

  const handleSearchResults = useCallback((results: Charity[]) => {
    setCharities(results);
  }, []);

  const handleLoadingState = useCallback((isLoading: boolean) => {
    setSearchLoading(isLoading);
  }, []);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] italic text-[10px]">Discovering Missions...</p>
          </div>
      );
  }

  const enhancedCharities = charities.map(c => ({
      ...c,
      isSupporting: supportedIds.includes(c.id)
  }));

  return (
    <div className="space-y-12 pb-24 relative z-10">
      <CharitySearch 
        onSearch={handleSearchResults} 
        onLoading={handleLoadingState} 
      />

      <motion.div
        initial={false}
        animate={{ opacity: searchLoading ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {enhancedCharities.length > 0 ? (
            <CharityGrid 
                charities={enhancedCharities} 
                loading={searchLoading} 
            />
        ) : (
            <div className="text-center py-20 space-y-6">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto shadow-2xl">
                   <Heart className="w-8 h-8 text-slate-500" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-serif italic tracking-tighter text-white">Search exhausted.</h3>
                   <p className="text-slate-400 max-w-sm mx-auto italic">No charities found matching your criteria. Try adjusting your filters.</p>
                </div>
            </div>
        )}
      </motion.div>
    </div>
  );
};
