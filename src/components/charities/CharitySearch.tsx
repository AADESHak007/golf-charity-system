'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Sparkles, X, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharitySearchProps {
  onSearch: (results: any[]) => void;
  onLoading: (isLoading: boolean) => void;
}

export const CharitySearch = ({ onSearch, onLoading }: CharitySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const isFirstRender = useRef(true);

  // Debounced search logic
  const performSearch = useCallback(async () => {
    onLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (featuredOnly) params.append('featured', 'true');

      const response = await fetch(`/api/charities?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        onSearch(result.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      onLoading(false);
    }
  }, [searchTerm, featuredOnly, onSearch, onLoading]);

  // Handle debouncing
  useEffect(() => {
    // Skip searching on mount as initial data is fetched server-side
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto mb-12">
      {/* Search Input */}
      <div className="relative w-full group shadow-[0_30px_100px_rgba(0,0,0,0.4)] rounded-full">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by mission or cause..."
          className="w-full bg-slate-900 border border-slate-800 rounded-full py-4.5 pl-14 pr-12 text-lg font-medium text-white placeholder-slate-500 outline-none focus:border-slate-700 focus:shadow-2xl transition-all"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Featured Toggle */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0 w-full md:w-auto shadow-2xl">
        <button
          onClick={() => setFeaturedOnly(false)}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex-1 md:flex-none",
            !featuredOnly ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-white"
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          All Causes
        </button>
        <button
          onClick={() => setFeaturedOnly(true)}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex-1 md:flex-none",
            featuredOnly ? "bg-white text-slate-900 shadow-xl" : "text-slate-500 hover:text-white"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Featured
        </button>
      </div>
    </div>
  );
};
