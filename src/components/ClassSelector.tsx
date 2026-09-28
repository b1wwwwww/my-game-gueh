import React from 'react';
import { HeroClassId, HERO_CLASSES } from '../game/classes';
import { OperativeInsignia } from './OperativeInsignia';
import { Crosshair, Bot, Disc, Check } from 'lucide-react';
import { sounds } from '../game/audio';

interface ClassSelectorProps {
  selectedClass: HeroClassId;
  onSelectClass: (id: HeroClassId) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  onSelectClass
}) => {
  const classes = Object.values(HERO_CLASSES);

  const handleSelect = (id: HeroClassId) => {
    sounds.playHit();
    onSelectClass(id);
  };

  return (
    <div className="w-full flex flex-col gap-3 my-2 text-left">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-amber-500 rounded-xs inline-block" />
          <h2 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200">
            Select Operative Dossier
          </h2>
        </div>
        <div className="text-[11px] text-neutral-400 font-mono">
          3 Combat Specializations
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClass;

          return (
            <button
              key={cls.id}
              type="button"
              onClick={() => handleSelect(cls.id)}
              className={`group relative text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-neutral-900/95 border-amber-500/80 shadow-[0_0_24px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                  : 'bg-neutral-950/60 border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/40 text-neutral-300'
              }`}
            >
              {/* Corner tactical bracket */}
              <div
                className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors ${
                  isSelected ? 'border-amber-400' : 'border-neutral-700/40 group-hover:border-neutral-500'
                }`}
              />

              {/* Upper Section: Vector Insignia + Operative Profile */}
              <div>
                <div className="flex items-start gap-3 mb-2.5">
                  {/* Clean Vector Tactical Insignia (No AI Portrait) */}
                  <div className="relative">
                    <OperativeInsignia
                      classId={cls.id}
                      size="md"
                      active={isSelected}
                    />
                    {/* Active Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-amber-500 text-neutral-950 rounded-xs shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-display font-bold text-sm text-white tracking-wide truncate">
                        {cls.name}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase">
                        [{cls.code}]
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase ml-auto">
                          Ready
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-medium tracking-wide text-neutral-400 uppercase mt-0.5">
                      {cls.role} · <span className="text-neutral-500 font-mono text-[10px]">{cls.callsign}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-1 mt-1">
                      {cls.tagline}
                    </p>
                  </div>
                </div>

                {/* Tactical Perk info box */}
                <div className="py-1.5 px-2 rounded-md bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-1.5 mb-2.5">
                  {cls.id === 'commando' && <Crosshair className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  {cls.id === 'demolitionist' && <Disc className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  {cls.id === 'scout' && <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  <span className="truncate font-medium">{cls.startingPerk}</span>
                </div>
              </div>

              {/* Lower Section: Telemetry Spec Metrics */}
              <div className="pt-2 border-t border-neutral-800/80 w-full grid grid-cols-4 gap-1 text-[10px] font-mono tabular-nums text-neutral-400">
                <div className="bg-neutral-950/90 rounded px-1.5 py-1 border border-neutral-800/50">
                  <span className="text-[9px] text-neutral-500 block uppercase font-sans">HP</span>
                  <span className="text-neutral-200 font-bold">{cls.baseHp}</span>
                </div>
                <div className="bg-neutral-950/90 rounded px-1.5 py-1 border border-neutral-800/50">
                  <span className="text-[9px] text-neutral-500 block uppercase font-sans">SPD</span>
                  <span className="text-neutral-200 font-bold">{cls.baseSpeed}</span>
                </div>
                <div className="bg-neutral-950/90 rounded px-1.5 py-1 border border-neutral-800/50">
                  <span className="text-[9px] text-neutral-500 block uppercase font-sans">ROF</span>
                  <span className="text-neutral-200 font-bold">{cls.baseFireRate}/s</span>
                </div>
                <div className="bg-neutral-950/90 rounded px-1.5 py-1 border border-neutral-800/50">
                  <span className="text-[9px] text-neutral-500 block uppercase font-sans">DASH</span>
                  <span className="text-neutral-200 font-bold">{cls.dashCooldown}s</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
