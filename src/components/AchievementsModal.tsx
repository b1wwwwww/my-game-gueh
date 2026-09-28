import React, { useState } from 'react';
import { achievementManager, Achievement, AchievementCategory } from '../game/achievements';
import { Trophy, X, CheckCircle2, Lock, Flame, Skull, Shield, Award, Sparkles } from 'lucide-react';

interface AchievementsModalProps {
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const achievements = achievementManager.getAllAchievements();
  const lifetimeStats = achievementManager.getLifetimeStats();
  const { unlocked, total } = achievementManager.getUnlockedCount();
  const unlockPercent = Math.round((unlocked / total) * 100);

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);

  const categories: { id: AchievementCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Milestones' },
    { id: 'combat', label: 'Combat' },
    { id: 'survival', label: 'Survival' },
    { id: 'progression', label: 'Progression' },
    { id: 'tactics', label: 'Tactics' }
  ];

  return (
    <div
      id="achievements-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                ACHIEVEMENTS & MILESTONES
              </h2>
              <p className="text-xs text-neutral-400">
                Track your career survivor records and unlock glory badges
              </p>
            </div>
          </div>

          <button
            id="btn-close-achievements"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar & Lifetime Stats Summary Banner */}
        <div className="my-4 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Overall Completion: <span className="text-amber-400 font-mono font-black">{unlocked} / {total}</span>
            </span>
            <span className="font-mono font-bold text-amber-400">{unlockPercent}%</span>
          </div>

          <div className="relative w-full h-3 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-amber-900/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{ width: `${unlockPercent}%` }}
            />
          </div>

          {/* Quick Stats Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
            <div className="bg-neutral-900/90 rounded-xl p-2 border border-neutral-800/80">
              <span className="text-neutral-500 block text-[9px] uppercase font-sans">Lifetime Kills</span>
              <span className="text-white font-black text-sm">{lifetimeStats.lifetimeKills.toLocaleString()}</span>
            </div>
            <div className="bg-neutral-900/90 rounded-xl p-2 border border-neutral-800/80">
              <span className="text-neutral-500 block text-[9px] uppercase font-sans">Highest Wave</span>
              <span className="text-amber-400 font-black text-sm">Wave {lifetimeStats.highestWave}</span>
            </div>
            <div className="bg-neutral-900/90 rounded-xl p-2 border border-neutral-800/80">
              <span className="text-neutral-500 block text-[9px] uppercase font-sans">Dodge Rolls</span>
              <span className="text-cyan-400 font-black text-sm">{lifetimeStats.totalDashes}</span>
            </div>
            <div className="bg-neutral-900/90 rounded-xl p-2 border border-neutral-800/80">
              <span className="text-neutral-500 block text-[9px] uppercase font-sans">Crates Claimed</span>
              <span className="text-purple-400 font-black text-sm">{lifetimeStats.totalSupplyDrops}</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievements Scrollable Grid */}
        <div className="flex-1 overflow-y-auto pr-1 mt-2 space-y-2.5 max-h-[420px]">
          {filteredAchievements.map((item) => {
            const isUnlocked = item.unlocked;
            const progress = Math.min(item.target, item.current);
            const percent = Math.min(100, Math.round((progress / item.target) * 100));

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'bg-neutral-950/90 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.12)]'
                    : 'bg-neutral-950/60 border-neutral-800/80 opacity-75'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-300 text-white shadow-md'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-600 grayscale'
                  }`}
                >
                  <span>{item.badge}</span>
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <h4 className={`font-extrabold text-sm truncate ${isUnlocked ? 'text-white' : 'text-neutral-300'}`}>
                        {item.title}
                      </h4>
                      {isUnlocked && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Done
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono font-bold text-neutral-400 shrink-0">
                      {progress.toLocaleString()} / {item.target.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-snug mt-0.5 mb-2">
                    {item.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                          : 'bg-neutral-700'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
