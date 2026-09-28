import React, { useEffect } from 'react';
import { GameOverStats } from '../game/engine';
import { RotateCcw, Skull, Trophy, Flame, Clock, Award, ArrowLeft } from 'lucide-react';
import { sounds } from '../game/audio';

interface GameOverModalProps {
  stats: GameOverStats;
  onRestart: () => void;
  onChangeClass?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart, onChangeClass }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        sounds.playLevelUp();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  const handlePlayAgain = () => {
    sounds.playLevelUp();
    onRestart();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="game-over-modal" className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-center flex flex-col items-center">
        {/* Tactical Header */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-rose-500 uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-xs bg-rose-500" />
          <span>Combat Incident Report</span>
          <span className="w-1.5 h-1.5 rounded-xs bg-rose-500" />
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wider uppercase mb-1">
          Operative Neutralized
        </h2>
        <p className="text-xs text-neutral-400 mb-5 max-w-xs">
          Hostile horde density exceeded perimeter defense threshold
        </p>

        {/* 4-Zone Telemetry Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Score
            </span>
            <span className="text-xl font-mono font-black text-amber-300 tabular-nums">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Waves Cleared
            </span>
            <span className="text-xl font-mono font-black text-rose-400 tabular-nums">
              {stats.wave}
            </span>
          </div>

          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 mb-1">
              <Skull className="w-3.5 h-3.5 text-neutral-400" /> Hostiles Slain
            </span>
            <span className="text-xl font-mono font-black text-white tabular-nums">
              {stats.kills}
            </span>
          </div>

          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time Elapsed
            </span>
            <span className="text-xl font-mono font-black text-cyan-300 tabular-nums">
              {formatTime(stats.timeSurvivedSeconds)}
            </span>
          </div>
        </div>

        {/* Level Banner */}
        <div className="w-full flex items-center justify-between px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl mb-5 text-xs text-neutral-300 font-mono">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <Award className="w-4 h-4 text-emerald-400" /> Terminal Level
          </span>
          <span className="font-bold text-emerald-400">LVL {stats.level}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            id="btn-restart-game"
            onClick={handlePlayAgain}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-display font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <RotateCcw className="w-4 h-4" /> Deploy Again [Space / Enter]
          </button>

          {onChangeClass && (
            <button
              id="btn-change-hero-class"
              onClick={onChangeClass}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-display font-semibold text-xs tracking-wider uppercase border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Command Briefing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
