export type VerificationStatus = 'confirmed' | 'single_source' | 'conflicting' | 'developing';

export type ClaimType = 'FACT' | 'ANALYSIS' | 'OPINION' | 'DEVELOPING';

export type ImportanceTier = 'critical' | 'important' | 'moderate' | 'low';

export type Category =
  | 'World'
  | 'India'
  | 'State'
  | 'Politics'
  | 'Technology'
  | 'AI'
  | 'Startups'
  | 'Business'
  | 'Economy'
  | 'Science'
  | 'Space'
  | 'Defence'
  | 'Education'
  | 'Sports'
  | 'Entertainment'
  | 'Health'
  | 'Environment'
  | 'Climate'
  | 'Infrastructure'
  | 'Careers'
  | 'Healthcare';

export type SourceTier = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';

export interface SourceArticle {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  sourceTier: SourceTier;
  publishedAt: string; // ISO string
  publishedAtIST: string; // Formatted IST
  snippet: string;
  category?: Category;
  location?: string;
}

export interface NewsEvent {
  id: string;
  eventTitle: string;
  summaryWhatHappened: string;
  whyItMatters: string;
  whatHappensNext?: string;
  verificationStatus: VerificationStatus;
  claimType: ClaimType;
  importanceScore: number; // 0.0 - 10.0
  relevanceScore: number; // 0 - 100%
  category: Category;
  subCategories?: string[];
  location: string; // World, India, or State Name (e.g. Tamil Nadu)
  stateName?: string;
  sources: SourceArticle[];
  sourceCount: number;
  publishedAt: string;
  publishedAtIST: string;
  updatedAt: string;
  updatedAtIST: string;
  timeline: TimelineItem[];
  isBreaking: boolean;
  isDeveloping: boolean;
  examKeyTakeaway?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface TimelineItem {
  id: string;
  timestamp: string;
  timestampIST: string;
  headline: string;
  summary: string;
  sourceName: string;
  sourceUrl?: string;
}

export interface SinceAwaySummary {
  hoursAway: number;
  minutesAway: number;
  lastVisitTimestamp: string;
  topDevelopmentsCount: number;
  keyHighlights: {
    title: string;
    category: string;
    location: string;
    summary: string;
    importanceScore: number;
    eventId: string;
  }[];
}

export interface DailyBrief {
  type: 'morning' | 'evening' | 'five_minute';
  dateStr: string;
  generatedAtIST: string;
  title: string;
  overview: string;
  topStories: {
    rank: number;
    headline: string;
    category: string;
    summary: string;
    whyItMatters: string;
    eventId: string;
    sourcesCount: number;
    timeIST: string;
  }[];
  whatChangedToday?: string[];
}

export interface NewsFeedResponse {
  events: NewsEvent[];
  lastUpdatedISO: string;
  lastUpdatedIST: string;
  currentTimeIST: string;
  currentDateIST: string;
  isLive: boolean;
  isStale: boolean;
  staleReason?: string;
  totalCount: number;
  hasMore: boolean;
  page: number;
}

export interface UserPreferences {
  userName: string;
  userRole: 'student' | 'professional' | 'general';
  collegeHostelStudent: boolean;
  country: string;
  primaryState: string;
  additionalStates: string[];
  city: string;
  interests: string[];
  feedMode: 'quick' | 'standard' | 'deep' | 'live';
  textSize?: 'small' | 'medium' | 'large';
  autoRefreshIntervalMinutes?: number;
  diversityRatios: {
    world: number;
    india: number;
    state: number;
    tech: number;
    business: number;
    science: number;
    sports: number;
  };
  notifications: {
    breaking: boolean;
    india: boolean;
    state: boolean;
    technology: boolean;
    dailyBrief: boolean;
  };
  lastVisitTimestamp: string;
}

export interface ExplanationResponse {
  quick: string;
  standard: {
    background: string;
    whatHappened: string;
    whyItMatters: string;
    whoIsInvolved: string[];
    possibleConsequences: string;
    whatToWatchNext: string;
  };
  deepDive: {
    historicalContext: string;
    detailedAnalysis: string;
    keyStakeholders: string[];
    longTermImpact: string;
  };
}

export interface WhyCareResponse {
  personalizedExplanation: string;
  relevanceToRole: string;
  keyActionOrInsight: string;
}

export interface ExamNotesResponse {
  topic: string;
  bulletSummary: string[];
  importantDatesAndNames: { label: string; detail: string }[];
  potentialQuestions: { question: string; answer: string }[];
}

export interface AdminStats {
  totalArticlesIngested: number;
  totalEventsClustered: number;
  deduplicationRatePercent: number;
  lastIngestionTimeIST: string;
  activeSourcesCount: number;
  sourcesByTier: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  geminiCallSuccessRate: number;
  systemHealth: 'healthy' | 'degraded' | 'syncing';
}
