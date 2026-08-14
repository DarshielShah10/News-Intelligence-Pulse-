import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { NewsEvent } from '../types';

interface BreakingTickerProps {
  breakingEvents: NewsEvent[];
  onSelectEvent: (eventId: string) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  breakingEvents,
  onSelectEvent,
}) => {
  if (!breakingEvents || breakingEvents.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl bg-[#0F1115] border border-[#1F2937] p-3 flex items-center gap-3 overflow-hidden shadow-lg">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] shrink-0 tracking-widest uppercase animate-pulse">
        <Flame className="w-3.5 h-3.5" />
        <span>BREAKING</span>
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs text-[#D1D5DB]">
        {breakingEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => onSelectEvent(event.id)}
            className="flex items-center gap-2 hover:text-white transition-colors shrink-0 max-w-lg text-left"
          >
            <span className="font-semibold text-[#9CA3AF]">[{event.publishedAtIST}]</span>
            <span className="truncate font-medium text-white">{event.eventTitle}</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#1F2937] text-[#6B7280]">
              {event.location}
            </span>
            <ChevronRight className="w-3 h-3 text-rose-400" />
          </button>
        ))}
      </div>
    </div>
  );
};
