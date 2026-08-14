import React, { useEffect, useState } from 'react';
import {
  Clock,
  Layers,
  Loader2,
  Moon,
  Pause,
  Play,
  Sun,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { DailyBrief } from '../types';

interface BriefingModalProps {
  type: 'five_minute' | 'morning' | 'evening' | null;
  onClose: () => void;
  onSelectEvent: (eventId: string) => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({ type, onClose, onSelectEvent }) => {
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  useEffect(() => {
    if (!type) return;

    const fetchBrief = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/brief/daily?type=${type}`);
        const data = await res.json();
        setBrief(data);
      } catch (err) {
        console.error('Briefing error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrief();
  }, [type]);

  // Audio Text-to-Speech using Browser Speech Synthesis API
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window) || !brief) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const fullText = `${brief.title}. ${brief.overview}. ` +
        brief.topStories.map((s) => `Story ${s.rank}: ${s.headline}. ${s.summary}. Why it matters: ${s.whyItMatters}`).join('. ');

      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    onClose();
  };

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F1115] border border-[#1F2937] rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl text-[#D1D5DB] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#0F1115]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              {type === 'five_minute' ? (
                <Zap className="w-5 h-5" />
              ) : type === 'morning' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {brief?.title || 'Executive News Briefing'}
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                {brief?.dateStr} • Generated at {brief?.generatedAtIST}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {brief && (
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
                }`}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Brief'}</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#9CA3AF]">
              <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
              <p className="text-xs">Synthesizing personalized 5-minute news briefing...</p>
            </div>
          ) : brief ? (
            <>
              {/* Overview */}
              <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] text-sm text-[#D1D5DB] leading-relaxed">
                {brief.overview}
              </div>

              {/* Stories list */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center justify-between">
                  <span>Top Executive Stories</span>
                  <span>Read Time: ~5 Mins</span>
                </h4>

                {brief.topStories.map((story) => (
                  <div
                    key={story.rank}
                    onClick={() => {
                      handleClose();
                      onSelectEvent(story.eventId);
                    }}
                    className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#374151] hover:bg-[#1F2937]/50 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                          {story.rank}
                        </span>
                        <span className="font-semibold text-indigo-400">{story.category}</span>
                      </div>
                      <span className="text-[11px] font-mono">{story.timeIST}</span>
                    </div>

                    <h5 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                      {story.headline}
                    </h5>

                    <p className="text-xs text-[#D1D5DB] leading-relaxed">{story.summary}</p>

                    <div className="pt-2 border-t border-[#1F2937] text-xs text-[#9CA3AF]">
                      <strong className="text-indigo-400">Why it matters: </strong>
                      <span>{story.whyItMatters}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* What Changed Today Section */}
              {brief.whatChangedToday && brief.whatChangedToday.length > 0 && (
                <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    What Changed Today
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#D1D5DB]">
                    {brief.whatChangedToday.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>

        <div className="p-4 border-t border-[#1F2937] bg-[#0F1115] flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-[#6366F1] text-white font-bold hover:bg-indigo-500 transition-all text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)]"
          >
            Finished Reading
          </button>
        </div>
      </div>
    </div>
  );
};
