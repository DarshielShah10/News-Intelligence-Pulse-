import React from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  History,
  Layers,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import { NewsEvent } from '../types';
import { getNewsImageForEvent } from '../utils/newsImageProvider';

interface PrintViewModalProps {
  event: NewsEvent | null;
  onClose: () => void;
}

export const PrintViewModal: React.FC<PrintViewModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const newsImage = getNewsImageForEvent(event);

  const handlePrint = () => {
    window.print();
  };

  const formattedPrintDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* CSS Print Styles override to ensure pristine PDF / Paper export */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #111827 !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide all UI elements except printable modal box */
          body > *:not(.print-container) {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            border-radius: 0 !important;
            padding: 24px !important;
          }
          .printable-box {
            background-color: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            color: #111827 !important;
          }
          .printable-text-main {
            color: #111827 !important;
          }
          .printable-text-muted {
            color: #4b5563 !important;
          }
          .printable-accent {
            color: #1d4ed8 !important;
          }
          .printable-badge {
            border: 1px solid #9ca3af !important;
            color: #111827 !important;
            background: #f3f4f6 !important;
          }
          a {
            text-decoration: underline !important;
            color: #1d4ed8 !important;
          }
        }
      `}</style>

      <div className="printable-card print-container bg-[#0F1115] border border-[#1F2937] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-[#D1D5DB] overflow-hidden my-auto">
        {/* Toolbar Header (Hidden in Print) */}
        <div className="no-print p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Clean Print & PDF View</h3>
              <p className="text-xs text-[#9CA3AF]">Formatted for official printing and document archiving</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
              title="Close Print Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed" id="printable-article">
          {/* Article Header Header Branding */}
          <div className="pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-extrabold tracking-wider uppercase text-indigo-400 text-xs printable-accent">
                NEWS INTELLIGENCE REPORT
              </span>
              <p className="text-[#9CA3AF] text-[11px] printable-text-muted">Verified Multi-Source Aggregation</p>
            </div>
            <div className="text-right text-[#9CA3AF] text-[11px] printable-text-muted">
              <div>Document ID: <strong className="text-white printable-text-main">{event.id}</strong></div>
              <div>Printed: {formattedPrintDate}</div>
            </div>
          </div>

          {/* Title & Metadata Pills */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1F2937] text-[#D1D5DB] border border-white/10 printable-badge">
                📍 {event.location}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 printable-badge">
                {event.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 printable-badge flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed ({event.sourceCount} Sources)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 printable-badge">
                Score: {event.importanceScore.toFixed(1)}/10
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white printable-text-main leading-snug">
              {event.eventTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9CA3AF] printable-text-muted pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Published IST: <strong className="text-[#D1D5DB] printable-text-main">{event.publishedAtIST}</strong></span>
              </span>
              <span>Updated IST: <strong className="text-[#D1D5DB] printable-text-main">{event.updatedAtIST}</strong></span>
            </div>
          </div>

          {/* Featured Article Image */}
          <div className="rounded-xl overflow-hidden border border-[#1F2937] printable-box">
            <img
              src={newsImage.url}
              alt={event.eventTitle}
              className="w-full max-h-[300px] object-cover object-center"
            />
            <div className="p-2 text-[11px] text-[#9CA3AF] printable-text-muted italic bg-[#0F1115] border-t border-[#1F2937]">
              📷 {newsImage.caption}
            </div>
          </div>

          {/* Executive Summary Cards */}
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-3 printable-box">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 printable-accent mb-1">
                  1. What Happened
                </h4>
                <p className="text-[#E5E7EB] printable-text-main leading-relaxed">{event.summaryWhatHappened}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] printable-text-muted mb-1">
                  2. Why It Matters
                </h4>
                <p className="text-[#D1D5DB] printable-text-main leading-relaxed">{event.whyItMatters}</p>
              </div>

              {event.whatHappensNext && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 printable-accent mb-1">
                    3. What Happens Next
                  </h4>
                  <p className="text-[#9CA3AF] printable-text-muted leading-relaxed">{event.whatHappensNext}</p>
                </div>
              )}
            </div>

            {/* Exam / GK Key Takeaway Highlight */}
            {event.examKeyTakeaway && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 printable-box flex items-start gap-2 text-xs">
                <span className="font-bold shrink-0">🎓 Exam & GK Key:</span>
                <span>{event.examKeyTakeaway}</span>
              </div>
            )}
          </div>

          {/* Verified Source Outlets */}
          {event.sources && event.sources.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] printable-text-muted flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Verified Outlets & Cross-References ({event.sources.length})</span>
              </h4>
              <div className="space-y-2">
                {event.sources.map((src, idx) => (
                  <div
                    key={src.id || idx}
                    className="p-3 rounded-xl bg-[#111827] border border-[#1F2937] printable-box text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-white printable-text-main">{src.sourceName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 printable-badge">
                        {src.sourceTier === 'tier_1' ? 'Tier 1 Official' : src.sourceTier === 'tier_2' ? 'Tier 2 Mainstream' : 'Tier 3'}
                      </span>
                    </div>
                    {src.snippet && (
                      <p className="text-[#9CA3AF] printable-text-muted text-[11px] italic">"{src.snippet}"</p>
                    )}
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-indigo-400 printable-accent flex items-center gap-1 hover:underline pt-0.5"
                      >
                        <span>{src.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Timeline (if present) */}
          {event.timeline && event.timeline.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] printable-text-muted flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Chronological Event Progression Timeline</span>
              </h4>
              <div className="border-l-2 border-indigo-500/30 pl-4 space-y-3 my-2">
                {event.timeline.map((item, idx) => (
                  <div key={item.id || idx} className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-white printable-text-main">
                      <span className="text-indigo-400 printable-accent">{item.timestampIST || item.timestamp}</span>
                      <span>•</span>
                      <span>{item.headline}</span>
                    </div>
                    <p className="text-[#9CA3AF] printable-text-muted text-[11px]">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Print Footer / Verification Seal */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7280] printable-text-muted">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentic News Intelligence Document • Multi-Source AI Verification Engine</span>
            </div>
            <div>Page 1 of 1</div>
          </div>
        </div>

        {/* Footer Actions (Hidden in Print) */}
        <div className="no-print p-4 border-t border-[#1F2937] bg-[#111827] flex items-center justify-between text-xs">
          <span className="text-[#9CA3AF]">
            Tip: Select <strong>"Save as PDF"</strong> as Destination in the Print Dialog to save a digital copy.
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
