import React, { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  Building2,
  ChevronDown,
  ExternalLink,
  Flame,
  Globe,
  GraduationCap,
  Home,
  MapPin,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { BreakingTicker } from './components/BreakingTicker';
import { BriefingModal } from './components/BriefingModal';
import { EventTimelineModal } from './components/EventTimelineModal';
import { ExamModeView } from './components/ExamModeView';
import { ExplainModal } from './components/ExplainModal';
import { Navbar } from './components/Navbar';
import { NewsEventCard } from './components/NewsEventCard';
import { SettingsModal } from './components/SettingsModal';
import { Sidebar } from './components/Sidebar';
import { SinceAwayBanner } from './components/SinceAwayBanner';
import { WhyCareModal } from './components/WhyCareModal';
import { INDIAN_STATES_LIST } from './data/rssFeeds';
import { NewsEvent, SinceAwaySummary, UserPreferences } from './types';

const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'Student User',
  userRole: 'student',
  collegeHostelStudent: true,
  country: 'India',
  primaryState: 'Tamil Nadu',
  additionalStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Delhi'],
  city: 'Chennai',
  interests: ['Technology', 'AI', 'Business', 'Education', 'Defence', 'Space', 'Sports'],
  feedMode: 'standard',
  textSize: 'medium',
  diversityRatios: { world: 20, india: 30, state: 20, tech: 15, business: 10, science: 5, sports: 5 },
  notifications: { breaking: true, india: true, state: true, technology: true, dailyBrief: true },
  lastVisitTimestamp: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
};

export default function App() {
  // State variables
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('pulse_iq_prefs');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [breakingEvents, setBreakingEvents] = useState<NewsEvent[]>([]);
  const [sinceAwaySummary, setSinceAwaySummary] = useState<SinceAwaySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdatedIST, setLastUpdatedIST] = useState<string>('10:00 AM IST');
  const [lastUpdatedISO, setLastUpdatedISO] = useState<string>(new Date().toISOString());
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isStale, setIsStale] = useState<boolean>(false);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<NewsEvent[]>(() => {
    try {
      const saved = localStorage.getItem('pulse_iq_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modes & Modals
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeBriefingType, setActiveBriefingType] = useState<'five_minute' | 'morning' | 'evening' | null>(null);

  // Active Selected Event for Modals
  const [explainEvent, setExplainEvent] = useState<NewsEvent | null>(null);
  const [whyCareEvent, setWhyCareEvent] = useState<NewsEvent | null>(null);
  const [timelineEvent, setTimelineEvent] = useState<NewsEvent | null>(null);

  // Pagination & Infinite Scroll State
  const INITIAL_BATCH_SIZE = 5;
  const BATCH_INCREMENT = 5;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState<boolean>(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination on filter or category changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [activeTab, selectedCategory, searchQuery, preferences.primaryState]);

  // Fetch News Feed
  const fetchNewsFeed = async (showLoading = true, force = false) => {
    if (showLoading && events.length === 0) {
      setIsLoading(true);
    }
    try {
      const queryParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
      const categoryParam = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      const locationParam = activeTab === 'state' ? '&location=state' : activeTab === 'world' ? '&location=world' : activeTab === 'ai' ? '&location=ai' : '';
      const refreshParam = force ? '&refresh=true' : '';

      const res = await fetch(
        `/api/news/latest?state=${encodeURIComponent(preferences.primaryState)}${locationParam}${categoryParam}${queryParam}${refreshParam}`
      );
      const data = await res.json();

      if (data.events && data.events.length > 0) {
        setEvents(data.events);
      }
      if (data.lastUpdatedIST) setLastUpdatedIST(data.lastUpdatedIST);
      if (data.lastUpdatedISO) setLastUpdatedISO(data.lastUpdatedISO);
      if (typeof data.isLive === 'boolean') setIsLive(data.isLive);
      if (typeof data.isStale === 'boolean') setIsStale(data.isStale);

      // Extract breaking in background
      fetch('/api/news/breaking')
        .then((r) => r.json())
        .then((bData) => {
          if (bData.breaking) setBreakingEvents(bData.breaking);
        })
        .catch(() => {});

      // Fetch "Since You Were Away" intelligence in background
      fetch(`/api/news/since?lastVisit=${encodeURIComponent(preferences.lastVisitTimestamp)}`)
        .then((r) => r.json())
        .then((sData) => {
          if (sData) setSinceAwaySummary(sData);
        })
        .catch(() => {});
    } catch (err) {
      console.error('Error loading news feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsFeed(events.length === 0);
  }, [preferences.primaryState, activeTab, selectedCategory]);

  // Auto-refresh feed every 5 minutes in background
  useEffect(() => {
    const timer = setInterval(() => {
      fetchNewsFeed(false, false);
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [preferences.primaryState, activeTab, selectedCategory]);

  // Persist preferences & bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('pulse_iq_prefs', JSON.stringify(preferences));
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem('pulse_iq_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/news/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: preferences.primaryState,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        }),
      });
      await fetchNewsFeed(false, true);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBookmarkToggle = (event: NewsEvent) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === event.id);
      if (exists) return prev.filter((b) => b.id !== event.id);
      return [...prev, event];
    });
  };

  const handleSavePreferences = (updated: UserPreferences) => {
    setPreferences(updated);
  };

  const handleSelectEventFromId = (eventId: string) => {
    const found = events.find((e) => e.id === eventId);
    if (found) {
      setExplainEvent(found);
    }
  };

  // Instant zero-latency Client-Side Filtered Display List
  const getFilteredEvents = (): NewsEvent[] => {
    let filtered = [...events];

    // 1. Tab / Location filtering
    if (activeTab === 'state') {
      const stLower = preferences.primaryState.toLowerCase();
      const stateMatches = filtered.filter(
        (e) =>
          (e.location && e.location.toLowerCase() === stLower) ||
          (e.stateName && e.stateName.toLowerCase() === stLower) ||
          e.category === 'State' ||
          e.eventTitle.toLowerCase().includes(stLower) ||
          e.summaryWhatHappened.toLowerCase().includes(stLower)
      );
      // Strictly isolate state news — do NOT fall back to national or world news
      return stateMatches;
    } else if (activeTab === 'world') {
      const worldMatches = filtered.filter((e) => e.location === 'World' || e.category === 'World');
      filtered = worldMatches.length > 0 ? worldMatches : filtered;
    } else if (activeTab === 'india') {
      const indiaMatches = filtered.filter((e) => e.location === 'India' || e.category === 'India');
      filtered = indiaMatches.length > 0 ? indiaMatches : filtered;
    } else if (activeTab === 'ai') {
      const aiMatches = filtered.filter((e) => {
        const cat = e.category ? e.category.toLowerCase() : '';
        if (cat === 'ai' || cat === 'technology' || cat === 'science') return true;
        const text = `${e.eventTitle} ${e.summaryWhatHappened} ${e.whyItMatters}`.toLowerCase();
        return (
          text.includes('ai') ||
          text.includes('artificial intelligence') ||
          text.includes('model') ||
          text.includes('gemini') ||
          text.includes('openai') ||
          text.includes('gpt') ||
          text.includes('claude') ||
          text.includes('llama') ||
          text.includes('deepseek') ||
          text.includes('robotics') ||
          text.includes('innovation') ||
          text.includes('tech')
        );
      });
      filtered = aiMatches.length > 0 ? aiMatches : filtered;
    } else if (activeTab === 'breaking') {
      return breakingEvents.length > 0
        ? breakingEvents
        : filtered.filter((e) => e.isBreaking || e.importanceScore >= 8.5);
    } else if (activeTab === 'bookmarks') {
      return bookmarks;
    }

    // 2. Category filtering
    if (selectedCategory && selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase();
      const catMatches = filtered.filter(
        (e) =>
          e.category.toLowerCase() === catLower ||
          e.eventTitle.toLowerCase().includes(catLower) ||
          e.summaryWhatHappened.toLowerCase().includes(catLower)
      );
      if (catMatches.length > 0) {
        filtered = catMatches;
      }
    }

    // 3. Search query filtering
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim();
      const searchMatches = filtered.filter(
        (e) =>
          e.eventTitle.toLowerCase().includes(qLower) ||
          e.summaryWhatHappened.toLowerCase().includes(qLower) ||
          e.whyItMatters.toLowerCase().includes(qLower) ||
          e.category.toLowerCase().includes(qLower)
      );
      filtered = searchMatches.length > 0 ? searchMatches : filtered;
    }

    return filtered;
  };

  const displayedEvents = getFilteredEvents();
  const visibleEvents = displayedEvents.slice(0, visibleCount);
  const hasMoreEvents = visibleCount < displayedEvents.length;

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + BATCH_INCREMENT);
      setIsLoadingMore(false);
    }, 250);
  };

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!isInfiniteScrollEnabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          if (visibleCount < displayedEvents.length) {
            handleLoadMore();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [visibleCount, displayedEvents.length, isInfiniteScrollEnabled, isLoadingMore]);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#D1D5DB] font-sans selection:bg-[#6366F1] selection:text-white">
      {/* Header Navbar */}
      <Navbar
        preferences={preferences}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleExamMode={() => setIsExamMode(!isExamMode)}
        isExamMode={isExamMode}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        theme="dark"
        onToggleTheme={() => {}}
        lastUpdatedIST={lastUpdatedIST}
        lastUpdatedISO={lastUpdatedISO}
        isLive={isLive}
        isStale={isStale}
        hoursAway={sinceAwaySummary?.hoursAway || 11}
        minutesAway={sinceAwaySummary?.minutesAway || 15}
        onOpenBriefing={(type) => setActiveBriefingType(type)}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 pt-6 pb-16">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsExamMode(false);
            setIsAdminOpen(false);
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setIsExamMode(false);
            setIsAdminOpen(false);
          }}
          preferences={preferences}
          onOpenBriefing={(type) => setActiveBriefingType(type)}
          onOpenExamMode={() => {
            setIsExamMode(true);
            setIsAdminOpen(false);
          }}
          onOpenAdmin={() => {
            setIsAdminOpen(true);
            setIsExamMode(false);
          }}
          bookmarkedCount={bookmarks.length}
        />

        {/* Main Feed Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Admin Analytics Panel View */}
          {isAdminOpen ? (
            <AdminDashboard />
          ) : isExamMode ? (
            /* Exam & GK Revision View */
            <ExamModeView onClose={() => setIsExamMode(false)} />
          ) : (
            <>
              {/* Breaking News Ticker */}
              <BreakingTicker
                breakingEvents={breakingEvents}
                onSelectEvent={(id) => handleSelectEventFromId(id)}
              />

              {/* "Since You Were Away" Intelligence Banner */}
              {sinceAwaySummary && activeTab === 'all' && !searchQuery && (
                <SinceAwayBanner
                  summary={sinceAwaySummary}
                  onSelectEvent={(id) => handleSelectEventFromId(id)}
                />
              )}

              {/* Feed Header & Active Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeTab === 'all' && '🔥 All Real-Time News Intelligence'}
                    {activeTab === 'breaking' && '🔴 Breaking & Developing Developments'}
                    {activeTab === 'ai' && '🤖 AI & Tech Innovations (Models, Releases & Research)'}
                    {activeTab === 'world' && '🌎 International World News'}
                    {activeTab === 'india' && '🇮🇳 India National Developments'}
                    {activeTab === 'state' && `📍 ${preferences.primaryState} State Feed`}
                    {activeTab === 'bookmarks' && '🔖 Saved Bookmarks'}
                  </h1>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Multi-source verified • Deduplicated • Updated {lastUpdatedIST}
                  </p>
                </div>

                {/* State Quick Switch Dropdown - ONLY shown on My State section */}
                {activeTab === 'state' && (
                  <div className="flex items-center gap-2 bg-[#111827] px-3 py-1.5 rounded-xl border border-[#1F2937]">
                    <span className="text-xs text-[#9CA3AF] font-semibold hidden sm:inline">Select State:</span>
                    <select
                      value={preferences.primaryState}
                      onChange={(e) =>
                        setPreferences({ ...preferences, primaryState: e.target.value })
                      }
                      className="p-1 rounded-lg bg-[#0F1115] border border-[#1F2937] text-xs font-bold text-indigo-400 outline-none cursor-pointer focus:border-[#6366F1]"
                    >
                      {INDIAN_STATES_LIST.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* My State Isolation Banner */}
              {activeTab === 'state' && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Strictly displaying local state governance, district infrastructure, and regional developments for <strong>{preferences.primaryState}</strong>.</span>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-700/50">
                    Remote Access Active
                  </span>
                </div>
              )}

              {/* Search Active Indicator */}
              {searchQuery && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                  <span>Search results for: <strong>"{searchQuery}"</strong></span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="underline text-amber-400 font-bold"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoading ? (
                <div className="space-y-4 py-8">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="rounded-2xl bg-stone-900/60 border border-stone-800 p-6 animate-pulse space-y-3"
                    >
                      <div className="h-4 bg-stone-800 rounded w-1/4" />
                      <div className="h-6 bg-stone-800 rounded w-3/4" />
                      <div className="h-16 bg-stone-800/80 rounded" />
                    </div>
                  ))}
                </div>
              ) : displayedEvents.length === 0 ? (
                <div className="text-center py-16 p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                  <Sparkles className="w-10 h-10 text-stone-600 mx-auto" />
                  <h3 className="font-bold text-stone-200">No Stories Found</h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    No articles match the current tab or topic filter. Try clearing your search query or triggering a manual sync.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Real-Time Feed</span>
                  </button>
                </div>
              ) : (
                /* Cards List & Pagination */
                <div className="space-y-6">
                  <div className="space-y-5">
                    {visibleEvents.map((event) => (
                      <NewsEventCard
                        key={event.id}
                        event={event}
                        onExplain={(ev) => setExplainEvent(ev)}
                        onWhyCare={(ev) => setWhyCareEvent(ev)}
                        onViewTimeline={(ev) => setTimelineEvent(ev)}
                        onBookmarkToggle={(ev) => handleBookmarkToggle(ev)}
                        isBookmarked={bookmarks.some((b) => b.id === event.id)}
                        textSize={preferences.textSize || 'medium'}
                      />
                    ))}
                  </div>

                  {/* Load More & Infinite Scroll Footer Bar */}
                  <div className="pt-4 border-t border-[#1F2937] space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#111827] border border-[#1F2937] text-xs">
                      <div className="text-[#9CA3AF] text-center sm:text-left">
                        Showing <strong className="text-white font-bold">{visibleEvents.length}</strong> of{' '}
                        <strong className="text-white font-bold">{displayedEvents.length}</strong> verified stories
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Auto-Scroll Toggle */}
                        <button
                          onClick={() => setIsInfiniteScrollEnabled(!isInfiniteScrollEnabled)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            isInfiniteScrollEnabled
                              ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                              : 'bg-[#1F2937]/50 text-[#9CA3AF] border-white/5 hover:text-white'
                          }`}
                          title={isInfiniteScrollEnabled ? 'Auto-scroll is active when scrolling to bottom' : 'Click to enable auto infinite scroll'}
                        >
                          {isInfiniteScrollEnabled ? '⚡ Auto-Scroll On' : '⏸ Auto-Scroll Off'}
                        </button>

                        {/* Load More Button */}
                        {hasMoreEvents ? (
                          <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            {isLoadingMore ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Fetching...</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>Load More Stories ({displayedEvents.length - visibleEvents.length} left)</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                            ✓ All Stories Loaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sentinel target for IntersectionObserver */}
                    <div ref={sentinelRef} className="h-4 w-full" />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl p-4 shadow-2xl text-stone-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Search className="w-5 h-5 text-amber-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. ISRO, Chennai Metro, OpenAI, RBI)..."
                autoFocus
                className="w-full bg-transparent text-sm text-stone-100 placeholder-stone-500 outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded hover:bg-stone-800 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 pt-1">
              <span>Press enter or click to search internally</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery || 'latest news India world fact check')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-[#4285F4]/20 hover:bg-[#4285F4]/30 text-[#4285F4] border border-[#4285F4]/40 font-bold flex items-center gap-1.5 transition-all"
                  title="Search query directly on Google Search Engine for deep factual verification"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Google Search Engine</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => {
                    fetchNewsFeed();
                    setIsSearchOpen(false);
                  }}
                  className="px-3 py-1.5 rounded bg-[#6366F1] text-white font-bold hover:bg-indigo-500 transition-all shadow-sm"
                >
                  Search Internal Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ExplainModal event={explainEvent} onClose={() => setExplainEvent(null)} />
      <WhyCareModal
        event={whyCareEvent}
        preferences={preferences}
        onClose={() => setWhyCareEvent(null)}
      />
      <EventTimelineModal event={timelineEvent} onClose={() => setTimelineEvent(null)} />
      <BriefingModal
        type={activeBriefingType}
        onClose={() => setActiveBriefingType(null)}
        onSelectEvent={(id) => handleSelectEventFromId(id)}
      />
      {isSettingsOpen && (
        <SettingsModal
          preferences={preferences}
          onSave={handleSavePreferences}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
