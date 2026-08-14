import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bookmark,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  History,
  Camera,
  ImageIcon,
  Layers,
  Lightbulb,
  Maximize2,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  Tag,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { NewsEvent } from '../types';
import { PrintViewModal } from './PrintViewModal';
import { getNewsImageForEvent } from '../utils/newsImageProvider';

interface NewsEventCardProps {
  event: NewsEvent;
  onExplain: (event: NewsEvent) => void;
  onWhyCare: (event: NewsEvent) => void;
  onViewTimeline: (event: NewsEvent) => void;
  onBookmarkToggle: (event: NewsEvent) => void;
  isBookmarked: boolean;
  onPrint?: (event: NewsEvent) => void;
  textSize?: 'small' | 'medium' | 'large';
}

export const NewsEventCard: React.FC<NewsEventCardProps> = ({
  event,
  onExplain,
  onWhyCare,
  onViewTimeline,
  onBookmarkToggle,
  isBookmarked,
  onPrint,
  textSize = 'medium',
}) => {
  const [showSourcesDropdown, setShowSourcesDropdown] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const newsImage = getNewsImageForEvent(event);

  // Typography scaling helpers
  const titleClass =
    textSize === 'small'
      ? 'text-base sm:text-lg font-semibold'
      : textSize === 'large'
      ? 'text-xl sm:text-2xl font-extrabold'
      : 'text-lg sm:text-xl font-semibold';

  const summaryTextClass =
    textSize === 'small'
      ? 'text-xs leading-snug text-[#D1D5DB]'
      : textSize === 'large'
      ? 'text-base leading-relaxed font-normal text-white'
      : 'text-sm leading-relaxed text-[#D1D5DB]';

  const whyTextClass =
    textSize === 'small'
      ? 'text-xs leading-snug text-[#9CA3AF]'
      : textSize === 'large'
      ? 'text-base leading-relaxed text-[#D1D5DB]'
      : 'text-sm leading-relaxed text-[#9CA3AF]';

  const labelClass =
    textSize === 'small'
      ? 'text-[9px] font-bold uppercase tracking-widest'
      : textSize === 'large'
      ? 'text-xs font-black uppercase tracking-widest'
      : 'text-[10px] font-bold uppercase tracking-widest';

  const nextTextClass =
    textSize === 'small'
      ? 'text-[11px] leading-snug text-[#6B7280]'
      : textSize === 'large'
      ? 'text-sm leading-relaxed text-[#9CA3AF]'
      : 'text-xs leading-relaxed text-[#6B7280]';

  const examKeyClass =
    textSize === 'small'
      ? 'text-[11px]'
      : textSize === 'large'
      ? 'text-sm font-semibold'
      : 'text-xs';

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any current speech in progress
    window.speechSynthesis.cancel();

    const textToRead = `${event.eventTitle}. What happened: ${event.summaryWhatHappened}. Why it matters: ${event.whyItMatters}. ${
      event.whatHappensNext ? `What happens next: ${event.whatHappensNext}` : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint(event);
    } else {
      setShowPrintModal(true);
    }
  };

  const handleShare = async () => {
    const shareContent = `[ID: ${event.id}] ${event.eventTitle}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareContent);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Importance badge color generator
  const getImportanceBadge = (score: number) => {
    if (score >= 9.0)
      return {
        label: `${score.toFixed(1)}/10 Critical`,
        bg: 'bg-red-500/20 text-red-400 border-red-500/40',
      };
    if (score >= 7.5)
      return {
        label: `${score.toFixed(1)}/10 Important`,
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      };
    return {
      label: `${score.toFixed(1)}/10 Moderate`,
      bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    };
  };

  // Source Credibility & Reliability badge generator
  const getCredibilityBadge = (event: NewsEvent) => {
    if (event.verificationStatus === 'conflicting') {
      return {
        scoreLabel: 'Conflicting Sources',
        tierLabel: 'Credibility Review',
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        iconColor: 'text-rose-400',
      };
    }

    const hasTier1 = event.sources?.some((s) => s.sourceTier === 'tier_1');
    const hasTier2 = event.sources?.some((s) => s.sourceTier === 'tier_2');

    if (hasTier1 || event.sourceCount >= 3) {
      return {
        scoreLabel: '98% High Credibility',
        tierLabel: 'Tier 1 Official Wire',
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        iconColor: 'text-emerald-400',
      };
    }

    if (hasTier2 || event.sourceCount >= 2) {
      return {
        scoreLabel: '90% Verified',
        tierLabel: 'Tier 2 Mainstream',
        bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        iconColor: 'text-indigo-400',
      };
    }

    return {
      scoreLabel: '80% Moderate Credibility',
      tierLabel: 'Single Source',
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      iconColor: 'text-amber-400',
    };
  };

  const impBadge = getImportanceBadge(event.importanceScore);
  const credBadge = getCredibilityBadge(event);

  return (
    <article className="rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all shadow-lg p-5 text-[#D1D5DB] relative">
      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {/* Location pill */}
          <span className="px-2.5 py-0.5 rounded-full bg-[#1F2937] text-[#D1D5DB] border border-white/5">
            📍 {event.location}
          </span>

          {/* Category pill */}
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
            {event.category}
          </span>

          {/* Credibility Badge */}
          <span
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${credBadge.bg}`}
            title={`Source Tier: ${credBadge.tierLabel}`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${credBadge.iconColor}`} />
            <span>{credBadge.scoreLabel}</span>
          </span>

          {/* Verification Badge */}
          {event.verificationStatus === 'confirmed' ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmed ({event.sourceCount} sources)</span>
            </span>
          ) : event.verificationStatus === 'conflicting' ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Conflicting Reports</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Single Source</span>
            </span>
          )}

          {/* Claim Type */}
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#1F2937] text-[#6B7280]">
            {event.claimType}
          </span>
        </div>

        {/* Importance Score Pill */}
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${impBadge.bg}`}>
          {impBadge.label}
        </span>
      </div>

      {/* Title */}
      <h3 className={`${titleClass} text-white hover:text-indigo-300 transition-colors leading-snug mb-2`}>
        {event.eventTitle}
      </h3>

      {/* IST Timestamps & Sources Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#9CA3AF] pb-3 mb-4 border-b border-[#1F2937]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Published: <strong className="text-[#D1D5DB]">{event.publishedAtIST}</strong></span>
          </span>
          <span className="text-[#4B5563]">•</span>
          <span>Updated: <strong className="text-[#D1D5DB]">{event.updatedAtIST}</strong></span>
        </div>

        {/* Sources Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
            className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:underline"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{event.sourceCount} Source{event.sourceCount > 1 ? 's' : ''}</span>
          </button>

          {showSourcesDropdown && (
            <div className="absolute right-0 top-6 z-20 w-64 p-2 rounded-xl bg-[#0F1115] border border-[#1F2937] shadow-2xl space-y-1 text-xs">
              <p className="text-[10px] uppercase font-bold text-[#6B7280] tracking-widest px-2 py-1 border-b border-[#1F2937]">
                Verified External Outlets
              </p>
              {event.sources.map((src) => (
                <a
                  key={src.id}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-1.5 rounded hover:bg-[#1F2937] text-[#D1D5DB] transition-colors gap-2"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{src.sourceName}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                        src.sourceTier === 'tier_1'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : src.sourceTier === 'tier_2'
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-[#1F2937] text-[#9CA3AF]'
                      }`}
                    >
                      {src.sourceTier === 'tier_1'
                        ? 'Tier 1'
                        : src.sourceTier === 'tier_2'
                        ? 'Tier 2'
                        : 'Tier 3'}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0" />
                </a>
              ))}

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(event.eventTitle + ' news verification sources')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-[#4285F4]/10 hover:bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/30 font-semibold transition-colors gap-2 mt-2 text-[11px]"
                title="Verify reporting and cross-reference on real Google Search Engine"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Search className="w-3.5 h-3.5 text-[#4285F4] shrink-0" />
                  <span className="truncate">Deep Fact-Check on Google Engine</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#4285F4] shrink-0" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Featured News Image Banner */}
      <div className="mb-4 relative rounded-xl overflow-hidden border border-[#1F2937] bg-[#0F1115] group shadow-inner">
        <div className="relative aspect-[16/9] max-h-[260px] w-full overflow-hidden bg-[#111827]">
          <img
            src={newsImage.url}
            alt={event.eventTitle}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-transparent to-black/20" />

          {/* Top category badge over image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold">
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span>{event.category} Press Photo</span>
          </div>

          {/* Full-screen Lightbox Expand button */}
          <button
            onClick={() => setShowLightbox(true)}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 hover:scale-105 transition-all text-xs"
            title="Expand photo full screen"
          >
            <Maximize2 className="w-4 h-4 text-[#D1D5DB]" />
          </button>

          {/* Caption overlay at bottom */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-[#9CA3AF] backdrop-blur-xs">
            <span className="truncate pr-2 italic font-medium text-slate-200 drop-shadow-sm">
              📷 {newsImage.caption}
            </span>
          </div>
        </div>
      </div>

      {/* AI Structured Summary Box */}
      <div className="space-y-3 mb-4">
        <div className="p-4 rounded-xl bg-[#0F1115] border border-[#1F2937] space-y-2.5">
          <div>
            <span className={`${labelClass} text-indigo-400 block mb-0.5`}>
              What Happened
            </span>
            <p className={summaryTextClass}>{event.summaryWhatHappened}</p>
          </div>

          <div>
            <span className={`${labelClass} text-[#9CA3AF] block mb-0.5`}>
              Why It Matters
            </span>
            <p className={whyTextClass}>{event.whyItMatters}</p>
          </div>

          {event.whatHappensNext && (
            <div>
              <span className={`${labelClass} text-emerald-400 block mb-0.5`}>
                What Happens Next
              </span>
              <p className={nextTextClass}>{event.whatHappensNext}</p>
            </div>
          )}
        </div>

        {/* Exam Key Takeaway Highlight */}
        {event.examKeyTakeaway && (
          <div className={`px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 ${examKeyClass} flex items-center gap-2`}>
            <span className="font-bold shrink-0">🎓 Exam GK Key:</span>
            <span className="truncate">{event.examKeyTakeaway}</span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1F2937] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              isSpeaking
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 animate-pulse'
                : 'bg-[#1F2937]/60 text-[#D1D5DB] border-white/5 hover:bg-[#1F2937] hover:text-white'
            }`}
            title={isSpeaking ? 'Stop reading aloud' : 'Narrate news title and summary aloud'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-indigo-400" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          {/* Explain This Button */}
          <button
            onClick={() => onExplain(event)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all font-semibold shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
            <span>Explain This</span>
          </button>

          {/* Why Care Button */}
          <button
            onClick={() => onWhyCare(event)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F2937]/60 text-[#D1D5DB] border border-white/5 hover:bg-[#1F2937] transition-all font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Why Should I Care?</span>
          </button>

          {/* View Event Timeline */}
          <button
            onClick={() => onViewTimeline(event)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F2937]/60 text-[#D1D5DB] border border-white/5 hover:bg-[#1F2937] transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Timeline ({event.timeline.length})</span>
          </button>

          {/* Google Search Engine Action */}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(event.eventTitle + ' news fact check')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 hover:bg-[#4285F4]/20 transition-all font-semibold shadow-sm hover:scale-[1.02]"
            title="Search Google Engine for real-time live facts, deeper context & authentic sources"
          >
            <Search className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Google Search</span>
            <ExternalLink className="w-3 h-3 text-[#4285F4]/80" />
          </a>
        </div>

        {/* Share, Print & Bookmark Actions */}
        <div className="flex items-center gap-1.5">
          {/* Print / PDF Button */}
          <button
            onClick={handlePrintClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-[#1F2937]/60 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-all text-xs font-semibold"
            title="Open clean print-friendly view or export to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Print / PDF</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#1F2937]/60 text-[#9CA3AF] border-white/5 hover:text-white hover:bg-[#1F2937]'
            }`}
            title="Share article ID and title"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Bookmark Action */}
          <button
            onClick={() => onBookmarkToggle(event)}
            className={`p-2 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-[#6366F1] text-white border-[#6366F1] font-bold shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                : 'bg-[#1F2937]/60 text-[#9CA3AF] border-white/5 hover:text-white hover:bg-[#1F2937]'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Story'}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Print View Modal */}
      {showPrintModal && (
        <PrintViewModal event={event} onClose={() => setShowPrintModal(false)} />
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#0F1115] border border-[#1F2937] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#111827]">
              <div className="flex items-center gap-2 truncate pr-4">
                <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-semibold text-sm text-white truncate">{event.eventTitle}</span>
              </div>
              <button
                onClick={() => setShowLightbox(false)}
                className="p-1.5 rounded-xl hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
                title="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center bg-black overflow-hidden">
              <img
                src={newsImage.url}
                alt={event.eventTitle}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 border-t border-[#1F2937] bg-[#111827] flex flex-wrap items-center justify-between gap-2 text-xs text-[#9CA3AF]">
              <span>📷 {newsImage.caption}</span>
              <span className="text-indigo-400 font-semibold">{event.category} • {event.location}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
