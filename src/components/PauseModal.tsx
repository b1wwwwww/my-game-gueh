import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, Home, AlertTriangle, Shield, Trophy, Skull } from 'lucide-react';
import { sounds } from '../game/audio';
import { HeroClassId, HERO_CLASSES } from '../game/classes';
import { OperativeInsignia } from './OperativeInsignia';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onReturnToMainMenu: () => void;
  wave: number;
  score: number;
  kills: number;
  heroClass: HeroClassId;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onReturnToMainMenu,
  wave,
  score,
  kills,
  heroClass
}) => {
  const [confirmExit, setConfirmExit] = useState(false);
  const heroConfig = HERO_CLASSES[heroClass] || HERO_CLASSES['commando'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (confirmExit) {
          setConfirmExit(false);
        } else {
          sounds.playHit();
          onResume();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume, confirmExit]);

  return (
    <div
      id="pause-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none"
    >
      <div className="relative w-full max-w-md bg-[#0e1014] border-4 border-black shadow-[12px_16px_0px_#000000] p-6 text-center flex flex-col items-center gap-5">
        {/* Top Comic Stencil Header */}
        <div className="flex items-center gap-2.5">
          <div
            className="bg-[#facc15] text-black font-display font-black text-sm px-3 py-1 uppercase border-2 border-black shadow-[3px_3px_0px_#000]"
            style={{ transform: 'rotate(-1deg)' }}
          >
            [TACTICAL PAUSE]
          </div>
        </div>

        <div>
          <h2 className="font-display font-black text-2xl text-white uppercase tracking-wider mb-1">
            Operation Suspended
          </h2>
          <p className="text-xs font-mono text-neutral-400">
            Sector perimeter telemetry frozen. Take a breather.
          </p>
        </div>

        {/* Active Operative & Match Progress Summary */}
        <div className="w-full bg-black/60 border-2 border-neutral-800 p-3 flex flex-col gap-2.5 text-left">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
            <div className="flex items-center gap-2">
              <OperativeInsignia classId={heroClass} size="sm" active={true} />
              <div>
                <div className="font-display font-bold text-xs text-white uppercase">
                  {heroConfig.name} <span className="font-mono text-neutral-400">[{heroConfig.code}]</span>
                </div>
                <div className="text-[10px] font-mono text-amber-400/90 uppercase">
                  {heroConfig.callsign} · {heroConfig.role}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Wave</span>
              <span className="font-mono font-black text-sm text-[#facc15]">WAVE {wave}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#121318] p-2 border border-neutral-800 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[9px] text-neutral-500 uppercase">Score</div>
                <div className="font-bold text-neutral-200 tabular-nums">{score.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-[#121318] p-2 border border-neutral-800 flex items-center gap-2">
              <Skull className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <div>
                <div className="text-[9px] text-neutral-500 uppercase">Kills</div>
                <div className="font-bold text-neutral-200 tabular-nums">{kills} Hostiles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons State: Normal vs Confirm Exit */}
        {!confirmExit ? (
          <div className="flex flex-col gap-2.5 w-full">
            {/* 1. Resume Game */}
            <button
              id="btn-resume-game"
              type="button"
              onClick={() => {
                sounds.playLevelUp();
                onResume();
              }}
              className="w-full py-3.5 px-4 bg-[#facc15] hover:bg-[#fde047] active:bg-[#eab308] text-black font-display font-black text-sm tracking-wider uppercase border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Resume Game</span>
              <span className="font-mono text-xs bg-black/15 px-1.5 py-0.5 rounded ml-1">[P / ESC]</span>
            </button>

            {/* 2. Restart Match */}
            <button
              id="btn-restart-from-pause"
              type="button"
              onClick={() => {
                sounds.playHit();
                onRestart();
              }}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 border-2 border-black text-neutral-200 font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Restart Match</span>
            </button>

            {/* 3. Return to Main Menu Button */}
            <button
              id="btn-return-main-menu-pause"
              type="button"
              onClick={() => {
                sounds.playHit();
                setConfirmExit(true);
              }}
              className="w-full py-3 px-4 bg-[#14151b] hover:bg-rose-950/60 active:bg-rose-900 border-2 border-neutral-700 hover:border-rose-600 text-neutral-300 hover:text-rose-200 font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
            >
              <Home className="w-4 h-4 text-rose-400" />
              <span>Return to Main Menu</span>
            </button>
          </div>
        ) : (
          /* Confirmation Prompt Before Abandoning Game */
          <div className="w-full bg-rose-950/30 border-2 border-rose-500/80 p-4 text-left flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-xs uppercase">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Abandon Current Operation?</span>
            </div>
            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              Returning to the Main Menu will end this run. Current wave progress and active loadout will be reset.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playHit();
                  setConfirmExit(false);
                }}
                className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border-2 border-black text-neutral-300 font-display font-bold text-xs uppercase cursor-pointer"
              >
                Cancel [Stay]
              </button>

              <button
                type="button"
                id="btn-confirm-return-main-menu"
                onClick={() => {
                  sounds.playHit();
                  onReturnToMainMenu();
                }}
                className="flex-1 py-2.5 px-3 bg-[#ef4444] hover:bg-[#dc2626] border-2 border-black text-white font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                Quit to Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
