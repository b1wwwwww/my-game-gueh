import React, { useEffect } from 'react';
import { UpgradeOption } from '../game/types';
import { Zap, Sword, Crosshair, Flame, Footprints, Heart, Compass, Bomb, Shield, Wind, Sparkles, Disc, Bot } from 'lucide-react';

interface UpgradeModalProps {
  options: UpgradeOption[];
  onSelect: (option: UpgradeOption) => void;
  level: number;
}

const iconMap: { [key: string]: React.ElementType } = {
  Zap,
  Sword,
  Crosshair,
  Flame,
  Footprints,
  Heart,
  Compass,
  Bomb,
  Shield,
  Wind,
  Sparkles,
  Disc,
  Bot
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ options, onSelect, level }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1' && options[0]) onSelect(options[0]);
      if (e.key === '2' && options[1]) onSelect(options[1]);
      if (e.key === '3' && options[2]) onSelect(options[2]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, onSelect]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'epic':
        return 'bg-purple-900/80 text-purple-300 border-purple-500/50';
      case 'rare':
        return 'bg-blue-900/80 text-blue-300 border-blue-500/50';
      default:
        return 'bg-emerald-900/80 text-emerald-300 border-emerald-500/50';
    }
  };

  const getTierGlow = (tier: string) => {
    switch (tier) {
      case 'epic':
        return 'hover:border-purple-400 hover:shadow-purple-500/20';
      case 'rare':
        return 'hover:border-blue-400 hover:shadow-blue-500/20';
      default:
        return 'hover:border-emerald-400 hover:shadow-emerald-500/20';
    }
  };

  return (
    <div id="upgrade-modal-backdrop" className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Banner Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Level {level} Achieved
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide drop-shadow-md">
            CHOOSE AN UPGRADE
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Empower your survivor to endure the next onslaught
          </p>
        </div>

        {/* 3 Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {options.map((opt, idx) => {
            const IconComponent = iconMap[opt.icon] || Sparkles;
            return (
              <button
                key={opt.id}
                id={`upgrade-card-${idx + 1}`}
                onClick={() => onSelect(opt)}
                className={`group relative flex flex-col text-left p-5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${getTierGlow(
                  opt.tier
                )}`}
              >
                {/* Number Key hint */}
                <span className="absolute top-3 right-3 text-[11px] font-mono font-bold text-neutral-500 group-hover:text-amber-400 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                  [{idx + 1}]
                </span>

                {/* Category & Tier */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getTierBadge(opt.tier)}`}>
                    {opt.tier}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                    {opt.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-200 border border-neutral-700">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {opt.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-relaxed flex-1">
                  {opt.description}
                </p>

                {/* Select button action */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400/90 group-hover:text-amber-300">
                    Select Upgrade
                  </span>
                  <span className="text-neutral-500 group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-neutral-500 mt-6 font-mono">
          Press 1, 2, or 3 on your keyboard to quick-select
        </p>
      </div>
    </div>
  );
};
