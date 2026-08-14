import React, { useState } from 'react';
import { Check, ExternalLink, MapPin, Save, Search, Sliders, Type, User, X } from 'lucide-react';
import { INDIAN_STATES_LIST } from '../data/rssFeeds';
import { UserPreferences } from '../types';

interface SettingsModalProps {
  preferences: UserPreferences;
  onSave: (updated: UserPreferences) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  onSave,
  onClose,
}) => {
  const [prefs, setPrefs] = useState<UserPreferences>({ ...preferences });

  const allInterests = [
    'Technology',
    'AI',
    'Business',
    'Finance',
    'Startups',
    'Science',
    'Space',
    'Education',
    'Politics',
    'Defence',
    'Sports',
    'Climate',
    'Healthcare',
    'Infrastructure',
    'Careers',
  ];

  const handleToggleInterest = (interest: string) => {
    setPrefs((prev) => {
      const exists = prev.interests.includes(interest);
      const newInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const handleToggleAdditionalState = (st: string) => {
    setPrefs((prev) => {
      const exists = prev.additionalStates.includes(st);
      const newAdd = exists
        ? prev.additionalStates.filter((s) => s !== st)
        : [...prev.additionalStates, st];
      return { ...prev, additionalStates: newAdd };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1115] border border-[#1F2937] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl text-[#D1D5DB] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#0F1115]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Intelligence Personalization</h3>
              <p className="text-xs text-[#9CA3AF]">Configure geographic layers & personal interests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1F2937] text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Role & Context */}
          <div className="space-y-3 p-4 rounded-xl bg-[#111827] border border-[#1F2937]">
            <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">User Profile & Context</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9CA3AF] mb-1 font-semibold">User Role</label>
                <select
                  value={prefs.userRole}
                  onChange={(e) => setPrefs({ ...prefs, userRole: e.target.value as any })}
                  className="w-full p-2 rounded-lg bg-[#0F1115] border border-[#1F2937] text-[#D1D5DB] focus:border-[#6366F1] outline-none"
                >
                  <option value="student">College Student</option>
                  <option value="professional">Working Professional</option>
                  <option value="general">General Reader</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1 font-semibold">Primary Country</label>
                <input
                  type="text"
                  value={prefs.country}
                  onChange={(e) => setPrefs({ ...prefs, country: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#0F1115] border border-[#1F2937] text-[#D1D5DB] focus:border-[#6366F1] outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.collegeHostelStudent}
                onChange={(e) => setPrefs({ ...prefs, collegeHostelStudent: e.target.checked })}
                className="w-4 h-4 accent-[#6366F1] rounded"
              />
              <span className="text-[#D1D5DB] font-medium">
                Living in College Hostel (Optimizes fast 5-minute news & exam notes)
              </span>
            </label>
          </div>

          {/* Location / State Selection */}
          <div className="space-y-3 p-4 rounded-xl bg-[#111827] border border-[#1F2937]">
            <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">State & Location Intelligence</h4>

            <div>
              <label className="block text-[#9CA3AF] mb-1 font-semibold">
                Primary State (Drives "My State" Feed & Local News)
              </label>
              <select
                value={prefs.primaryState}
                onChange={(e) => setPrefs({ ...prefs, primaryState: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-[#0F1115] border border-[#1F2937] text-white font-semibold focus:border-[#6366F1] outline-none"
              >
                {INDIAN_STATES_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#9CA3AF] mb-1.5 font-semibold">Additional Tracked States</label>
              <div className="flex flex-wrap gap-1.5">
                {INDIAN_STATES_LIST.filter((s) => s !== prefs.primaryState).slice(0, 10).map((st) => {
                  const isChecked = prefs.additionalStates.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleToggleAdditionalState(st)}
                      className={`px-2.5 py-1 rounded-md border text-xs transition-all ${
                        isChecked
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                          : 'bg-[#0F1115] text-[#9CA3AF] border-[#1F2937] hover:border-[#374151]'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3 p-4 rounded-xl bg-[#111827] border border-[#1F2937]">
            <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">Topic Interests</h4>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => {
                const isSelected = prefs.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                        : 'bg-[#0F1115] text-[#9CA3AF] border-[#1F2937] hover:border-[#374151]'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Size & Accessibility */}
          <div className="space-y-3 p-4 rounded-xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">
                  Content Text Size & Reading Accessibility
                </h4>
                <p className="text-[#9CA3AF] text-[11px] mt-0.5">
                  Adjust news feed typography for enhanced legibility and comfort
                </p>
              </div>
              <Type className="w-4 h-4 text-indigo-400 shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[
                { id: 'small', label: 'Small', desc: 'Compact view (12px)', icon: 'A⁻' },
                { id: 'medium', label: 'Medium', desc: 'Standard (14px)', icon: 'A' },
                { id: 'large', label: 'Large', desc: 'Enhanced (16px+)', icon: 'A⁺' },
              ].map((size) => {
                const isSelected = (prefs.textSize || 'medium') === size.id;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setPrefs({ ...prefs, textSize: size.id as 'small' | 'medium' | 'large' })}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-500/10'
                        : 'bg-[#0F1115] text-[#9CA3AF] border-[#1F2937] hover:border-[#374151] hover:text-white'
                    }`}
                  >
                    <span className="text-base font-bold font-mono text-indigo-300">{size.icon}</span>
                    <span className="text-xs font-semibold">{size.label}</span>
                    <span className="text-[10px] text-[#6B7280]">{size.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real Google Search Engine Verification Banner */}
          <div className="p-4 rounded-xl bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[#4285F4] font-bold">
                <Search className="w-4 h-4" />
                <span>Google Search Engine Deep Fact Check</span>
              </div>
              <p className="text-[#9CA3AF] text-[11px] leading-relaxed">
                Directly cross-reference news stories with real-time Google Search queries for maximum accuracy and authentic reporting.
              </p>
            </div>
            <a
              href="https://www.google.com/search?q=latest+fact+check+news"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-[#4285F4] text-white font-bold hover:bg-blue-600 transition-all shrink-0 flex items-center gap-1 text-xs shadow-md"
            >
              <span>Launch</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F2937] bg-[#0F1115] flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#111827] hover:bg-[#1F2937] text-[#9CA3AF] font-bold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(prefs);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#6366F1] hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
