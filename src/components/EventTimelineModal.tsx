import React from 'react';
import { Clock, ExternalLink, History, X } from 'lucide-react';
import { NewsEvent } from '../types';

interface EventTimelineModalProps {
  event: NewsEvent | null;
  onClose: () => void;
}

export const EventTimelineModal: React.FC<EventTimelineModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1115] border border-[#1F2937] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl text-[#D1D5DB] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#0F1115]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Event Evolution Timeline</h3>
              <p className="text-xs text-[#9CA3AF] truncate max-w-md">{event.eventTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-6">
            {event.timeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0F1115] border-2 border-[#6366F1] group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-1">
                    <span className="font-mono font-semibold text-indigo-400">
                      {item.timestampIST}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#1F2937] text-[#D1D5DB] text-[10px]">
                      {item.sourceName}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">{item.headline}</h4>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1F2937] bg-[#0F1115] flex justify-between items-center text-xs text-[#9CA3AF]">
          <span>{event.timeline.length} Recorded Updates</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#6366F1] text-white font-bold hover:bg-indigo-500 transition-all text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)]"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
