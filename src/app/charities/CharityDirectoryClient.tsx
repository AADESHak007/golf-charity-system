'use client';

import { useState, useCallback } from 'react';
import { CharitySearch } from '@/components/charities/CharitySearch';
import { CharityGrid } from '@/components/charities/CharityGrid';
import { motion } from 'framer-motion';

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
  upcoming_events_count?: number;
}

interface CharityDirectoryClientProps {
  initialCharities: Charity[];
  supportedIds: string[];
}

export const CharityDirectoryClient = ({ initialCharities, supportedIds }: CharityDirectoryClientProps) => {
  const [charities, setCharities] = useState<Charity[]>(
    initialCharities.map(c => ({ ...c, isSupporting: supportedIds.includes(c.id) }))
  );
  const [loading, setLoading] = useState(false);

  const handleSearchResults = useCallback((results: Charity[]) => {
    setCharities(results.map(c => ({ ...c, isSupporting: supportedIds.includes(c.id) })));
  }, [supportedIds]);

  const handleLoadingState = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  return (
    <div className="space-y-12 pb-24 relative z-10">
      <CharitySearch 
        onSearch={handleSearchResults} 
        onLoading={handleLoadingState} 
      />

      <motion.div
        initial={false}
        animate={{ opacity: loading ? 0.6 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <CharityGrid 
          charities={charities} 
          loading={loading} 
        />
      </motion.div>
    </div>
  );
};
