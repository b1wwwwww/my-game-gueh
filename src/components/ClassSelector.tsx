import React from 'react';
import { HeroClassId, HERO_CLASSES, HeroClassConfig } from '../game/classes';
import { Shield, Zap, Flame, Crosshair, Bot, Disc } from 'lucide-react';

interface ClassSelectorProps {
  selectedClass: HeroClassId;
  onSelectClass: (id: HeroClassId) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  onSelectClass
}) => {
  const classes = Object.values(HERO_CLASSES);

  return (
    <div className="w-full flex flex-col gap-3 my-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          SELECT SURVIVOR CLASS
        </span>
        <span className="text-[11px] text-neutral-400">
          Unique Base Stats & Weapon Loadouts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClass;
          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => onSelectClass(cls.id)}
              className={`relative text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-900 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-[1.02]'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Active selection indicator badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-cyan-500 text-neutral-950 text-[9px] font-black uppercase tracking-wider">
                  Active
                </div>
              )}

              {/* Class Header */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-md shrink-0"
                    style={{ backgroundColor: cls.color }}
                  >
                    <span>{cls.badge}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white leading-tight">
                      {cls.name}
                    </h3>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: cls.accentColor }}
                    >
                      {cls.role}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 leading-snug mb-3">
                  {cls.tagline}
                </p>
              </div>

              {/* Unique Starting Perk Pill */}
              <div className="mt-auto pt-2 border-t border-neutral-800/80">
                <div className="text-[10px] text-neutral-300 font-medium flex items-center gap-1.5 bg-neutral-950/70 p-1.5 rounded-lg border border-neutral-800">
                  {cls.id === 'commando' && <Crosshair className="w-3 h-3 text-blue-400 shrink-0" />}
                  {cls.id === 'demolitionist' && <Disc className="w-3 h-3 text-orange-400 shrink-0" />}
                  {cls.id === 'scout' && <Bot className="w-3 h-3 text-cyan-400 shrink-0" />}
                  <span className="truncate">{cls.startingPerk}</span>
                </div>

                {/* Micro Stat Indicators */}
                <div className="grid grid-cols-4 gap-1 mt-2 text-[9px] text-neutral-400 text-center font-mono">
                  <div className="bg-neutral-900/90 rounded px-1 py-0.5">
                    <span className="text-neutral-500 block text-[8px]">HP</span>
                    <span className="text-white font-bold">{cls.baseHp}</span>
                  </div>
                  <div className="bg-neutral-900/90 rounded px-1 py-0.5">
                    <span className="text-neutral-500 block text-[8px]">SPD</span>
                    <span className="text-white font-bold">{cls.baseSpeed}</span>
                  </div>
                  <div className="bg-neutral-900/90 rounded px-1 py-0.5">
                    <span className="text-neutral-500 block text-[8px]">RATE</span>
                    <span className="text-white font-bold">{cls.baseFireRate}</span>
                  </div>
                  <div className="bg-neutral-900/90 rounded px-1 py-0.5">
                    <span className="text-neutral-500 block text-[8px]">DASH</span>
                    <span className="text-white font-bold">{cls.dashCooldown}s</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
