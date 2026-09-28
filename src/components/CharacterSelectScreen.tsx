import React, { useEffect } from 'react';
import { HeroClassId, HERO_CLASSES } from '../game/classes';
import { OperativeInsignia } from './OperativeInsignia';
import { sounds } from '../game/audio';
import { Play, ArrowLeft, Crosshair, Disc, Bot, Shield, Zap, Check } from 'lucide-react';

interface CharacterSelectScreenProps {
  selectedClass: HeroClassId;
  onSelectClass: (id: HeroClassId) => void;
  onConfirmDeploy: (id: HeroClassId) => void;
  onBackToMenu: () => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  selectedClass,
  onSelectClass,
  onConfirmDeploy,
  onBackToMenu
}) => {
  const classes = Object.values(HERO_CLASSES);
  const currentHero = HERO_CLASSES[selectedClass] || HERO_CLASSES['commando'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playHit();
        onBackToMenu();
      } else if (e.key === 'Enter') {
        sounds.playLevelUp();
        onConfirmDeploy(selectedClass);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClass, onConfirmDeploy, onBackToMenu]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0d0e12] border-4 border-black shadow-[12px_16px_0px_#000000] p-5 sm:p-7 text-left flex flex-col gap-5 my-auto">
        {/* Top Comic Stencil Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black font-display font-black text-xs sm:text-sm px-2.5 py-1 tracking-widest uppercase border-2 border-black rotate-[-1deg] shadow-[2px_2px_0px_#000000]">
              [DOSSIER SELECT]
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wider uppercase">
              Select Your Combat Operative
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onBackToMenu();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border-2 border-black text-neutral-300 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Menu [ESC]</span>
          </button>
        </div>

        {/* 3-Column Operative Roster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const isSelected = cls.id === selectedClass;

            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => {
                  sounds.playHit();
                  onSelectClass(cls.id);
                }}
                className={`relative text-left p-4 border-3 transition-all duration-150 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-[#151720] border-[#facc15] shadow-[6px_8px_0px_#000000] ring-2 ring-[#facc15]/60 -translate-y-1'
                    : 'bg-[#0f1015] border-neutral-800 hover:border-neutral-600 hover:bg-[#14151b] text-neutral-300'
                }`}
              >
                {/* Active check ribbon */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-[#facc15] text-black font-display font-black text-[10px] px-2 py-0.5 tracking-wider uppercase flex items-center gap-1 shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>ASSIGNED</span>
                  </div>
                )}

                {/* Card Top: Insignia + Callsign */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <OperativeInsignia classId={cls.id} size="md" active={isSelected} />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] font-bold text-neutral-400 tracking-wider">
                        [{cls.code}]
                      </div>
                      <h3 className="font-display font-black text-base text-white tracking-wide truncate">
                        {cls.name}
                      </h3>
                      <div className="text-[11px] font-mono font-semibold uppercase text-neutral-400">
                        {cls.callsign}
                      </div>
                    </div>
                  </div>

                  {/* Division Role Tag */}
                  <div className="text-[11px] font-mono text-amber-400/90 uppercase mb-2">
                    {cls.role} · {cls.division}
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    {cls.description}
                  </p>

                  {/* Starting Perk Box */}
                  <div className="p-2.5 bg-black/60 border border-neutral-800 rounded text-xs text-neutral-200 flex items-start gap-2 mb-3">
                    {cls.id === 'commando' && <Crosshair className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                    {cls.id === 'demolitionist' && <Disc className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    {cls.id === 'scout' && <Bot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                    <span className="font-medium text-[11px] leading-snug">{cls.startingPerk}</span>
                  </div>
                </div>

                {/* Card Bottom: Telemetry Stats */}
                <div className="pt-2.5 border-t border-neutral-800 grid grid-cols-4 gap-1.5 text-center font-mono text-xs">
                  <div className="bg-black/50 p-1.5 border border-neutral-800">
                    <div className="text-[9px] text-neutral-500 uppercase">HP</div>
                    <div className="font-bold text-neutral-100">{cls.baseHp}</div>
                  </div>
                  <div className="bg-black/50 p-1.5 border border-neutral-800">
                    <div className="text-[9px] text-neutral-500 uppercase">SPD</div>
                    <div className="font-bold text-neutral-100">{cls.baseSpeed}</div>
                  </div>
                  <div className="bg-black/50 p-1.5 border border-neutral-800">
                    <div className="text-[9px] text-neutral-500 uppercase">ROF</div>
                    <div className="font-bold text-neutral-100">{cls.baseFireRate}/s</div>
                  </div>
                  <div className="bg-black/50 p-1.5 border border-neutral-800">
                    <div className="text-[9px] text-neutral-500 uppercase">DASH</div>
                    <div className="font-bold text-neutral-100">{cls.dashCooldown}s</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Summary & Deploy Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-neutral-800 bg-black/40 p-4 border border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <OperativeInsignia classId={currentHero.id} size="sm" active={true} />
            <div>
              <div className="text-xs font-mono text-neutral-400">
                ACTIVE OPERATIVE: <strong className="text-white font-display font-bold uppercase">{currentHero.name} ({currentHero.callsign})</strong>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {currentHero.tagline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                sounds.playHit();
                onBackToMenu();
              }}
              className="py-3 px-5 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 border-2 border-black font-display font-bold text-xs uppercase tracking-wider text-neutral-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              id="btn-confirm-deploy"
              onClick={() => {
                sounds.playLevelUp();
                onConfirmDeploy(selectedClass);
              }}
              className="flex-1 sm:flex-initial py-3 px-8 bg-[#facc15] hover:bg-[#fde047] active:bg-[#eab308] text-black font-display font-black text-sm tracking-wider uppercase border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>DEPLOY OPERATIVE</span>
              <span className="font-mono text-xs bg-black/15 px-1.5 py-0.5 rounded">↵ ENTER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
