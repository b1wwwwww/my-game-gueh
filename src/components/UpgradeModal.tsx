import React, { useEffect } from 'react';
import { UpgradeOption } from '../game/types';
import { Zap, Sword, Crosshair, Flame, Footprints, Heart, Compass, Bomb, Shield, Wind, Sparkles, Disc, Bot } from 'lucide-react';
import { sounds } from '../game/audio';

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
      if (e.key === '1' && options[0]) {
        sounds.playLevelUp();
        onSelect(options[0]);
      }
      if (e.key === '2' && options[1]) {
        sounds.playLevelUp();
        onSelect(options[1]);
      }
      if (e.key === '3' && options[2]) {
        sounds.playLevelUp();
        onSelect(options[2]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, onSelect]);

  const handleChoose = (opt: UpgradeOption) => {
    sounds.playLevelUp();
    onSelect(opt);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'epic':
        return 'text-purple-400 border-purple-500/40 bg-purple-950/40';
      case 'rare':
        return 'text-blue-400 border-blue-500/40 bg-blue-950/40';
      default:
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    }
  };

  const getTierCardBorder = (tier: string) => {
    switch (tier) {
      case 'epic':
        return 'hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]';
      case 'rare':
        return 'hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]';
      default:
        return 'hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]';
    }
  };

  return (
    <div id="upgrade-modal-backdrop" className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Banner Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-1.5">
            <span className="w-1.5 h-1.5 rounded-xs bg-amber-400" />
            <span>Field Upgrade Protocol · Level {level} Reached</span>
            <span className="w-1.5 h-1.5 rounded-xs bg-amber-400" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wider uppercase">
            Select Tech Enhancement
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
            Choose an upgrade module to augment your survivability against the swarm
          </p>
        </div>

        {/* 3 Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
          {options.map((opt, idx) => {
            const IconComponent = iconMap[opt.icon] || Sparkles;
            return (
              <button
                key={opt.id}
                id={`upgrade-card-${idx + 1}`}
                onClick={() => handleChoose(opt)}
                className={`group relative flex flex-col text-left p-4 sm:p-5 rounded-xl bg-neutral-900/90 border border-neutral-800 transition-all duration-150 hover:-translate-y-1 cursor-pointer ${getTierCardBorder(
                  opt.tier
                )}`}
              >
                {/* Number Key hint */}
                <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-neutral-400 group-hover:text-amber-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                  [{idx + 1}]
                </span>

                {/* Category & Tier */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-xs border ${getTierColor(opt.tier)}`}>
                    {opt.tier}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-neutral-400">
                    {opt.category}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-500/50 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors leading-tight">
                    {opt.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 leading-snug mb-3">
                  {opt.description}
                </p>

                {/* Value Stat indicator */}
                <div className="mt-auto pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">Module Value:</span>
                  <span className="font-bold text-amber-400">{opt.value}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="mt-5 text-[11px] font-mono text-neutral-500">
          Press [1], [2], or [3] on your keyboard to instantly select
        </div>
      </div>
    </div>
  );
};
