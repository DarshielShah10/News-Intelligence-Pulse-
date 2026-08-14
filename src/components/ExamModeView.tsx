import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import { ExamNotesResponse } from '../types';

interface ExamModeViewProps {
  onClose: () => void;
}

export const ExamModeView: React.FC<ExamModeViewProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<ExamNotesResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news/exam-notes', { method: 'POST' });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Exam notes error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const toggleAnswer = (key: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#0F1115] border border-[#1F2937] p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Competitive Exam & Current Affairs Portal
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                UPSC • TNPSC • CAT • BANK PO
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              High-yield revision flashcards & current events key takeaways synthesized for students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotes}
            disabled={isLoading}
            className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-all"
            title="Refresh Exam Notes"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#9CA3AF]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-xs">Generating study notes & quiz flashcards with Gemini...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notes.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#111827] border border-[#1F2937] p-5 space-y-4 shadow-lg"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <BookOpen className="w-4 h-4" />
                <span>Topic {idx + 1}: {item.topic}</span>
              </div>

              {/* Bullet Points */}
              <div className="p-4 rounded-xl bg-[#0F1115] border border-[#1F2937] space-y-2">
                <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Key Facts to Memorize</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#D1D5DB] leading-relaxed">
                  {item.bulletSummary?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Important Dates & Names */}
              {item.importantDatesAndNames?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.importantDatesAndNames.map((d, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300"
                    >
                      <strong className="text-emerald-400">{d.label}: </strong>
                      <span>{d.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Practice Questions / Quiz Flashcards */}
              {item.potentialQuestions?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#1F2937]">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Practice Revision Question</span>
                  </h4>

                  {item.potentialQuestions.map((q, qIdx) => {
                    const qKey = `q-${idx}-${qIdx}`;
                    const isRevealed = revealedAnswers[qKey];
                    return (
                      <div
                        key={qIdx}
                        className="p-3.5 rounded-xl bg-[#0F1115] border border-[#1F2937] text-xs space-y-2"
                      >
                        <p className="font-semibold text-white">{q.question}</p>

                        <button
                          onClick={() => toggleAnswer(qKey)}
                          className="px-3 py-1 rounded bg-[#1F2937] hover:bg-[#374151] text-emerald-400 font-bold transition-all text-[11px]"
                        >
                          {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                        </button>

                        {isRevealed && (
                          <p className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 leading-relaxed animate-fadeIn">
                            <strong>Answer: </strong>
                            {q.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
