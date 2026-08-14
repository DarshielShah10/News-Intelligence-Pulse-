import React, { useEffect, useState } from 'react';
import {
  Bell,
  Clock,
  Compass,
  ExternalLink,
  GraduationCap,
  Moon,
  RefreshCw,
  Search,
  Sliders,
  Sun,
  Zap,
} from 'lucide-react';
import { UserPreferences } from '../types';

interface NavbarProps {
  preferences: UserPreferences;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onToggleExamMode: () => void;
  isExamMode: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  lastUpdatedIST: string;
  lastUpdatedISO?: string;
  isLive?: boolean;
  isStale?: boolean;
  hoursAway: number;
  minutesAway: number;
  onOpenBriefing: (type: 'five_minute' | 'morning' | 'evening') => void;
}

function getRelativeTime(isoString?: string): string {
  if (!isoString) return 'just now';
  const diffMs = Date.now() - new Date(isoString).getTime();
  if (diffMs < 0 || isNaN(diffMs)) return 'just now';
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 45) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export const Navbar: React.FC<NavbarProps> = ({
  preferences,
  onOpenSettings,
  onOpenSearch,
  onToggleExamMode,
  isExamMode,
  onRefresh,
  isRefreshing,
  theme,
  onToggleTheme,
  lastUpdatedIST,
  lastUpdatedISO,
  isLive = true,
  isStale = false,
  hoursAway,
  minutesAway,
  onOpenBriefing,
}) => {
  const [timeIST, setTimeIST] = useState<string>('');
  const [relativeUpdated, setRelativeUpdated] = useState<string>('just now');

  useEffect(() => {
    const updateIST = () => {
      const now = new Date();
      setTimeIST(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
      setRelativeUpdated(getRelativeTime(lastUpdatedISO));
    };
    updateIST();
    const interval = setInterval(updateIST, 1000);
    return () => clearInterval(interval);
  }, [lastUpdatedISO]);

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-[#0A0B0D]/95 border-[#1F2937] text-[#D1D5DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                PULSE<span className="text-[#6366F1]">IQ</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Intelligence
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold hidden sm:block">
              Real-Time Daily News • {preferences.primaryState}
            </p>
          </div>
        </div>

        {/* Search Bar & Mode Switches */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[#0F1115] border border-[#1F2937] text-[#9CA3AF] hover:text-white hover:border-[#374151] transition-all text-left"
          >
            <Search className="w-4 h-4 text-[#6B7280]" />
            <span>Search topics, companies, states...</span>
            <kbd className="ml-auto text-[10px] bg-[#1F2937] px-1.5 py-0.5 rounded text-[#9CA3AF]">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Status & IST Time */}
          <div className="hidden lg:flex flex-col items-end text-right text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[11px] tracking-wider">
              {isRefreshing ? (
                <span className="flex items-center gap-1 text-amber-400">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>UPDATING...</span>
                </span>
              ) : isStale ? (
                <span className="flex items-center gap-1 text-orange-400">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                  <span>CACHED FEED</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>LIVE FEED</span>
                  <span className="text-[#6B7280] font-normal text-[10px]">• {relativeUpdated}</span>
                </span>
              )}
            </div>
            <div className="text-[#6B7280] text-[10px] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#4B5563]" />
              <span>{timeIST || '10:00:00 AM IST'}</span>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title={`Refresh News (Last updated: ${lastUpdatedIST || 'just now'})`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F1115] border border-[#1F2937] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-all disabled:opacity-50 text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#6366F1]' : ''}`} />
            <span className="hidden xl:inline">{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>

          {/* Google Search Engine Verification Link */}
          <a
            href="https://www.google.com/search?q=latest+news+India+world+verification"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 hover:bg-[#4285F4]/20 transition-all shadow-sm"
            title="Launch Google Search Engine for deep factual verification and authentic source checking"
          >
            <Search className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Google Search</span>
            <ExternalLink className="w-3 h-3 text-[#4285F4]/80" />
          </a>

          {/* 5-Min Brief Shortcut */}
          <button
            onClick={() => onOpenBriefing('five_minute')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all shadow-[0_0_10px_rgba(99,102,241,0.15)]"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>5-Min Brief</span>
          </button>

          {/* Exam Mode Toggle */}
          <button
            onClick={onToggleExamMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isExamMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-[#0F1115] text-[#9CA3AF] border-[#1F2937] hover:bg-[#1F2937] hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exam Mode</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-[#0F1115] border border-[#1F2937] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] transition-all"
            title="Personalization Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

