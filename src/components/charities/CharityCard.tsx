'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Globe, ChevronRight, BadgeCheck, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharityCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string | null;
  is_featured?: boolean;
  upcoming_events_count?: number;
  isSupporting?: boolean;
}

export const CharityCard = ({
  name,
  slug,
  description,
  image_url,
  is_featured,
  upcoming_events_count,
  isSupporting,
}: CharityCardProps) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex flex-col h-full bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-orange-500/40 hover:shadow-orange-500/10",
        isSupporting && "border-emerald-500/30 shadow-emerald-500/5 hover:border-emerald-500/50"
      )}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image_url || fallbackImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        {/* Supporting Badge */}
        {isSupporting && (
          <div className="absolute top-6 left-6 flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-pulse">
            <Heart className="w-3.5 h-3.5 fill-white" />
            Active Support
          </div>
        )}

        {/* Featured Badge (if not supporting to avoid overlap) */}
        {is_featured && !isSupporting && (
          <div className="absolute top-6 left-6 flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
            <BadgeCheck className="w-3.5 h-3.5" />
            Spotlight
          </div>
        )}

        {/* Event Count Badge */}
        {upcoming_events_count !== undefined && upcoming_events_count > 0 && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-md text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
            <CalendarDays className="w-3.5 h-3.5" />
            {upcoming_events_count} {upcoming_events_count === 1 ? 'Event' : 'Events'}
          </div>
        )}

        <div className="absolute bottom-6 left-6">
          <div className={cn(
            "p-2.5 rounded-xl border transition-all",
            isSupporting 
              ? "bg-emerald-500/10 border-emerald-500/20" 
              : "bg-orange-500/10 border-orange-500/20"
          )}>
            <Heart className={cn(
              "w-5 h-5",
              isSupporting ? "text-emerald-500 fill-emerald-500" : "text-orange-500 fill-orange-500"
            )} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-8 space-y-4">
        <h3 className="text-2xl font-black text-white leading-tight tracking-tight group-hover:text-orange-400 transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="pt-6 mt-auto flex items-center justify-between border-t border-white/5">
          <Link
            href={`/charities/${slug}`}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-all group/btn"
          >
            Learn More
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
          
          <Globe className="w-5 h-5 text-zinc-700 group-hover:text-orange-500/40 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};
