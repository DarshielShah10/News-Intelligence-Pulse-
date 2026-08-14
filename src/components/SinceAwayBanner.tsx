import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Clock, Sparkles, Zap } from 'lucide-react';
import { SinceAwaySummary } from '../types';

interface SinceAwayBannerProps {
  summary: SinceAwaySummary;
  onSelectEvent: (eventId: string) => void;
}

export const SinceAwayBanner: React.FC<SinceAwayBannerProps> = ({ summary, onSelectEvent }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!summary || summary.keyHighlights.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl bg-[#0F1115] border border-[#1F2937] p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-white">
                Since You Were Away ({summary.hoursAway}h {summary.minutesAway}m)
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {summary.topDevelopmentsCount} Major Updates
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[#6B7280] flex items-center gap-1 mt-0.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#4B5563]" />
              <span>Intelligence digest customized for your preferences</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:text-white transition-all shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-[#1F2937]">
          {summary.keyHighlights.map((item, index) => (
            <div
              key={index}
              onClick={() => onSelectEvent(item.eventId)}
              className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#374151] hover:bg-[#1F2937]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1.5">
                  <span className="text-indigo-400">{item.category}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#0F1115] text-[#9CA3AF]">
                    {item.location}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#D1D5DB] group-hover:text-white line-clamp-2 leading-snug mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#9CA3AF] line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#1F2937] flex items-center justify-between text-[10px] text-[#6B7280]">
                <span className="font-semibold text-indigo-400">
                  Impact: {item.importanceScore}/10
                </span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform font-medium">
                  Read Digest <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
