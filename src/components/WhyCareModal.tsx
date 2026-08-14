import React, { useEffect, useState } from 'react';
import { ExternalLink, HelpCircle, Loader2, Search, Sparkles, User, X } from 'lucide-react';
import { NewsEvent, UserPreferences, WhyCareResponse } from '../types';

interface WhyCareModalProps {
  event: NewsEvent | null;
  preferences: UserPreferences;
  onClose: () => void;
}

export const WhyCareModal: React.FC<WhyCareModalProps> = ({ event, preferences, onClose }) => {
  const [data, setData] = useState<WhyCareResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!event) return;

    const fetchWhyCare = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/news/why-care', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, preferences }),
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('WhyCare error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhyCare();
  }, [event, preferences]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1115] border border-[#1F2937] rounded-2xl w-full max-w-lg shadow-2xl text-[#D1D5DB] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#0F1115]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Why Should You Care?</h3>
              <p className="text-xs text-[#9CA3AF]">
                Personalized for {preferences.userRole} in {preferences.primaryState}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs font-medium text-[#D1D5DB]">
            <span className="text-indigo-400 font-bold block mb-1">Story Topic</span>
            <p className="text-white font-semibold text-sm">{event.eventTitle}</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-[#9CA3AF]">
              <Loader2 className="w-6 h-6 animate-spin text-[#6366F1]" />
              <p className="text-xs">Computing personal relevance & direct career/life impacts...</p>
            </div>
          ) : data ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-sm">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                  Personal Relevance
                </span>
                <p className="text-[#D1D5DB] leading-relaxed">{data.personalizedExplanation}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937] text-xs space-y-1">
                <span className="text-[#9CA3AF] font-bold block uppercase tracking-wider text-[10px]">Direct Impact</span>
                <p className="text-[#D1D5DB]">{data.relevanceToRole}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                <span className="font-bold block uppercase tracking-wider text-[10px]">Key Takeaway / Action</span>
                <p>{data.keyActionOrInsight}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-[#1F2937] bg-[#0F1115] flex items-center justify-between gap-3">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent((event?.eventTitle || '') + ' impact analysis news')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 hover:bg-[#4285F4]/20 transition-all text-xs font-semibold"
          >
            <Search className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Verify on Google Engine</span>
            <ExternalLink className="w-3 h-3 text-[#4285F4]/80" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#6366F1] text-white font-bold hover:bg-indigo-500 transition-all text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
