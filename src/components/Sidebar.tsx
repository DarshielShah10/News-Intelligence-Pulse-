import React from 'react';
import {
  Activity,
  Bookmark,
  BookOpen,
  Building2,
  Cpu,
  Flame,
  Globe,
  GraduationCap,
  Home,
  MapPin,
  Moon,
  Shield,
  Sliders,
  Sparkles,
  Sun,
  Trophy,
  Zap,
} from 'lucide-react';
import { Category, UserPreferences } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  preferences: UserPreferences;
  onOpenBriefing: (type: 'five_minute' | 'morning' | 'evening') => void;
  onOpenExamMode: () => void;
  onOpenAdmin: () => void;
  bookmarkedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  preferences,
  onOpenBriefing,
  onOpenExamMode,
  onOpenAdmin,
  bookmarkedCount,
}) => {
  const geoNavItems = [
    { id: 'all', label: 'Home Feed', icon: Home },
    { id: 'breaking', label: 'Breaking News', icon: Flame, badge: 'LIVE' },
    { id: 'ai', label: 'AI & Innovations', icon: Sparkles, badge: 'AI' },
    { id: 'world', label: 'World News', icon: Globe },
    { id: 'india', label: 'India National', icon: Building2 },
    { id: 'state', label: `My State (${preferences.primaryState})`, icon: MapPin },
  ];

  const briefItems = [
    { type: 'five_minute', label: '5-Minute Brief', icon: Zap, desc: 'Top 5 essential highlights' },
    { type: 'morning', label: 'Morning Intelligence', icon: Sun, desc: 'Daily start briefing' },
    { type: 'evening', label: 'Day in Review', icon: Moon, desc: 'Evening recap & changes' },
  ];

  const categories: Category[] = [
    'Technology',
    'AI',
    'Startups',
    'Business',
    'Economy',
    'Politics',
    'Science',
    'Space',
    'Defence',
    'Education',
    'Sports',
    'Entertainment',
    'Health',
    'Environment',
    'Infrastructure',
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-[#1F2937] bg-[#0F1115] min-h-[calc(100vh-4rem)] p-4 text-[#D1D5DB]">
      <div className="space-y-6">
        {/* Main Feed Geographic Navigation */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#4B5563] mb-3 px-2">
            Geographic Coverage
          </h3>
          <nav className="space-y-1">
            {geoNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1F2937]/80 text-white font-semibold border border-white/10 shadow-sm'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#6366F1]' : 'text-[#6B7280]'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Executive Briefings */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#4B5563] mb-3 px-2">
            Smart Briefings
          </h3>
          <div className="space-y-1.5">
            {briefItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => onOpenBriefing(item.type as any)}
                  className="w-full text-left p-2.5 rounded-xl border border-[#1F2937] bg-[#111827]/60 hover:border-[#374151] hover:bg-[#111827] transition-all group"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className="w-4 h-4 text-[#6366F1] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-white">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] pl-6 leading-tight">{item.desc}</p>
                </button>
              );
            })}

            <button
              onClick={onOpenExamMode}
              className="w-full text-left p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all group mt-2"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <GraduationCap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-emerald-300">Exam & GK Revision</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 pl-6 leading-tight">
                Bullet summaries & UPSC/CAT quiz cards
              </p>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#4B5563]">
              Topics & Sectors
            </h3>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => onSelectCategory('All')}
                className="text-[10px] text-[#6366F1] font-bold hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(isSelected ? 'All' : cat)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    isSelected
                      ? 'bg-[#6366F1] text-white font-bold border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                      : 'bg-[#111827] text-[#9CA3AF] border-[#1F2937] hover:text-white hover:border-[#374151]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookmarks & System Tools */}
        <div className="pt-3 border-t border-[#1F2937] space-y-1">
          <button
            onClick={() => onSelectTab('bookmarks')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-[#1F2937]/80 text-white border border-white/10'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]/40'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#6366F1]" />
            <span>Saved Bookmarks</span>
            {bookmarkedCount > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]/40 transition-all"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>System Analytics</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
