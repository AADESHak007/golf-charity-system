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
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="p-6 flex flex-col h-full space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${getBadgeStyles(event.event_type)}`}>
            {getTypeLabel(event.event_type)}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-white transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium italic">{formattedDate}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-serif italic text-white group-hover:text-white transition-colors leading-snug tracking-tighter">
            {event.title}
          </h4>
          <p className="text-[13px] text-slate-400 line-clamp-2 leading-relaxed italic">
            {event.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs truncate italic">{event.location}</span>
        </div>

        <div className="pt-4 mt-auto border-t border-slate-800">
          {event.registration_url ? (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl active:scale-95 group/btn"
            >
              Register
              <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
            </a>
          ) : (
             <div className="flex items-center justify-center gap-2 w-full py-3 bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl cursor-default border border-slate-800">
              <MessageCircle className="w-3.5 h-3.5" />
              Contact charity to register
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
