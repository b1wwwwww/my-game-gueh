import React, { useEffect } from 'react';
import { GameOverStats } from '../game/engine';
import { RotateCcw, Skull, Trophy, Flame, Clock, Award } from 'lucide-react';

interface GameOverModalProps {
  stats: GameOverStats;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="game-over-modal" className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Skull Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/70 border border-red-800/80 flex items-center justify-center text-red-500 mb-4 shadow-inner">
          <Skull className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-wide mb-1">
          SURVIVOR FALLEN
        </h2>
        <p className="text-xs text-neutral-400 mb-6">
          The zombie horde overwhelmed your defenses
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Score
            </span>
            <span className="text-xl font-black text-amber-300">{stats.score.toLocaleString()}</span>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Waves Cleared
            </span>
            <span className="text-xl font-black text-rose-400">{stats.wave}</span>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Skull className="w-3.5 h-3.5 text-red-400" /> Zombies Slain
            </span>
            <span className="text-xl font-black text-white">{stats.kills}</span>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Survived
            </span>
            <span className="text-xl font-black text-blue-300">{formatTime(stats.timeSurvivedSeconds)}</span>
          </div>
        </div>

        {/* Level badge */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl mb-6 text-xs text-neutral-300">
          <span className="flex items-center gap-2 text-neutral-400">
            <Award className="w-4 h-4 text-emerald-400" /> Final Level
          </span>
          <span className="font-bold text-emerald-400">Level {stats.level}</span>
        </div>

        {/* Restart Button */}
        <button
          id="btn-restart-game"
          onClick={onRestart}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-base transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" /> Play Again (Space / Enter)
        </button>
      </div>
    </div>
  );
};
