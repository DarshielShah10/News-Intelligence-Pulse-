import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Database,
  Layers,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AdminStats } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Admin stats error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/news/refresh', { method: 'POST' });
      await fetchStats();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 text-[#D1D5DB]">
      {/* Header */}
      <div className="rounded-2xl bg-[#0F1115] border border-[#1F2937] p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System News Intelligence Analytics</h2>
            <p className="text-xs text-[#9CA3AF]">
              Live ingestion pipeline, deduplication rates, and multi-source reliability health
            </p>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1] text-white font-bold hover:bg-indigo-500 transition-all text-xs disabled:opacity-50 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Trigger Ingestion Sync</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-[#9CA3AF] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
          <p className="text-xs">Loading analytics data...</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              Articles Ingested
            </span>
            <p className="text-2xl font-bold text-indigo-400">{stats.totalArticlesIngested}</p>
            <p className="text-[10px] text-[#6B7280]">From 28 RSS & News Wires</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              Clustered News Events
            </span>
            <p className="text-2xl font-bold text-white">{stats.totalEventsClustered}</p>
            <p className="text-[10px] text-[#6B7280]">Unified event cards</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              AI Deduplication Rate
            </span>
            <p className="text-2xl font-bold text-emerald-400">{stats.deduplicationRatePercent}%</p>
            <p className="text-[10px] text-[#6B7280]">Duplicate stories filtered out</p>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-[#1F2937] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              Pipeline Health
            </span>
            <p className="text-2xl font-bold text-emerald-400 capitalize">{stats.systemHealth}</p>
            <p className="text-[10px] text-[#6B7280]">Last sync: {stats.lastIngestionTimeIST}</p>
          </div>

          {/* Tier Breakdown */}
          <div className="md:col-span-2 lg:col-span-4 p-5 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-indigo-400">
              Source Reliability Classification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0F1115] border border-[#1F2937] space-y-1">
                <span className="font-semibold text-emerald-400">Tier 1 — Primary Official</span>
                <p className="text-[#D1D5DB]">PIB, ISRO, Supreme Court, Cabinet Bulletins</p>
                <p className="text-indigo-400 font-bold">{stats.sourcesByTier.tier1} Active Feeds</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F1115] border border-[#1F2937] space-y-1">
                <span className="font-semibold text-indigo-300">Tier 2 — Established Media</span>
                <p className="text-[#D1D5DB]">Reuters, BBC, The Hindu, Indian Express, NDTV</p>
                <p className="text-indigo-400 font-bold">{stats.sourcesByTier.tier2} Active Feeds</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F1115] border border-[#1F2937] space-y-1">
                <span className="font-semibold text-[#9CA3AF]">Tier 3 — Secondary Regional</span>
                <p className="text-[#D1D5DB]">Specialist blogs, regional city press</p>
                <p className="text-indigo-400 font-bold">{stats.sourcesByTier.tier3} Active Feeds</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
