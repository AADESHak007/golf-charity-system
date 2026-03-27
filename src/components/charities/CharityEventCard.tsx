'use client';

import { Calendar, MapPin, ExternalLink, MessageCircle } from 'lucide-react';
import { CharityEvent } from '@/types';
import { format } from 'date-fns';

interface CharityEventCardProps {
  event: CharityEvent;
}

export const CharityEventCard = ({ event }: CharityEventCardProps) => {
  const formattedDate = format(new Date(event.event_date), 'dd MMMM yyyy');

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'golf_day':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'fundraiser':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'tournament':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="group relative flex flex-col bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all duration-300">
      <div className="p-6 flex flex-col h-full space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyles(event.event_type)}`}>
            {getTypeLabel(event.event_type)}
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-orange-500 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
            {event.title}
          </h4>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-zinc-500">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs truncate">{event.location}</span>
        </div>

        <div className="pt-4 mt-auto border-t border-white/5">
          {event.registration_url ? (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              Register
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-xl cursor-default border border-white/5">
              <MessageCircle className="w-3.5 h-3.5" />
              Contact charity to register
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
