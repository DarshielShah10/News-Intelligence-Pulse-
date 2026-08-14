import React, { useEffect, useState } from 'react';
import { BookOpen, Check, ExternalLink, Lightbulb, Loader2, Search, Sparkles, X } from 'lucide-react';
import { ExplanationResponse, NewsEvent } from '../types';

interface ExplainModalProps {
  event: NewsEvent | null;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ event, onClose }) => {
  const [level, setLevel] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!event) return;

    const fetchExplanation = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/news/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, level }),
        });
        const data = await res.json();
        setExplanation(data);
      } catch (err) {
        console.error('Explanation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanation();
  }, [event, level]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1115] border border-[#1F2937] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl text-[#D1D5DB] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#0F1115]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Intelligence Breakdown</h3>
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

        {/* Level Tabs */}
        <div className="flex border-b border-[#1F2937] bg-[#111827]/50 p-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setLevel('quick')}
            className={`flex-1 py-2 rounded-lg border transition-all ${
              level === 'quick'
                ? 'bg-[#6366F1] text-white font-bold border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-[#111827] text-[#9CA3AF] border-[#1F2937] hover:text-white'
            }`}
          >
            ⚡ Quick (30 Sec)
          </button>

          <button
            onClick={() => setLevel('standard')}
            className={`flex-1 py-2 rounded-lg border transition-all ${
              level === 'standard'
                ? 'bg-[#6366F1] text-white font-bold border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-[#111827] text-[#9CA3AF] border-[#1F2937] hover:text-white'
            }`}
          >
            📘 Standard Overview
          </button>

          <button
            onClick={() => setLevel('deep')}
            className={`flex-1 py-2 rounded-lg border transition-all ${
              level === 'deep'
                ? 'bg-[#6366F1] text-white font-bold border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                : 'bg-[#111827] text-[#9CA3AF] border-[#1F2937] hover:text-white'
            }`}
          >
            🔬 Deep Dive Analysis
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#9CA3AF]">
              <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
              <p className="text-xs">Analyzing geopolitical & factual context with Gemini...</p>
            </div>
          ) : explanation ? (
            level === 'quick' ? (
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-[#D1D5DB] space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                  30-Second Executive Summary
                </span>
                <p className="text-sm leading-relaxed">{explanation.quick}</p>
              </div>
            ) : level === 'standard' ? (
              <div className="space-y-4 text-sm">
                <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937]">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-1">Background</h4>
                  <p className="text-[#D1D5DB]">{explanation.standard.background}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937]">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-1">What Happened</h4>
                  <p className="text-white">{explanation.standard.whatHappened}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937]">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-1">Why It Matters</h4>
                  <p className="text-[#9CA3AF]">{explanation.standard.whyItMatters}</p>
                </div>

                {explanation.standard.whoIsInvolved?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937]">
                    <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-1.5">
                      Key Players Involved
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {explanation.standard.whoIsInvolved.map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#1F2937] text-[#D1D5DB] text-xs font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider">Historical Context</h4>
                  <p className="text-[#D1D5DB] leading-relaxed">
                    {explanation.deepDive.historicalContext}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider">Detailed Analysis</h4>
                  <p className="text-white leading-relaxed">
                    {explanation.deepDive.detailedAnalysis}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider">Long Term Impact</h4>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    {explanation.deepDive.longTermImpact}
                  </p>
                </div>
              </div>
            )
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1F2937] bg-[#0F1115] flex items-center justify-between gap-3">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent((event?.eventTitle || '') + ' news fact check analysis')}`}
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
