import React from 'react';
import { Volume2, VolumeX, Pause, Play, Skull, Trophy, AlertTriangle, ShieldCheck, Zap, Magnet, Gauge, Crosshair, Bomb, Radio } from 'lucide-react';
import { SupplyDropType } from '../game/types';

interface BuffInfo {
  type: SupplyDropType;
  title: string;
  remaining: number;
  color: string;
}

interface GameHUDProps {
  hp: number;
  maxHp: number;
  currentXp: number;
  maxXp: number;
  level: number;
  wave: number;
  zombiesRemaining: number;
  zombiesTotal: number;
  score: number;
  kills: number;
  isBoss: boolean;
  bossAlert: boolean;
  bossAlertMessage?: string;
  activeBuffs?: BuffInfo[];
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  shieldActive: boolean;
  shieldCooldown: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  hp,
  maxHp,
  currentXp,
  maxXp,
  level,
  wave,
  zombiesRemaining,
  zombiesTotal,
  score,
  kills,
  isBoss,
  bossAlert,
  bossAlertMessage,
  activeBuffs = [],
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
  shieldActive,
  shieldCooldown
}) => {
  const xpPercent = Math.min(100, Math.max(0, (currentXp / maxXp) * 100));
  const hpPercent = Math.min(100, Math.max(0, (hp / maxHp) * 100));

  const getBuffIcon = (type: SupplyDropType) => {
    switch (type) {
      case 'MASSIVE_DAMAGE':
        return <Crosshair className="w-3.5 h-3.5" />;
      case 'SUPER_MAGNET':
        return <Magnet className="w-3.5 h-3.5" />;
      case 'OVERDRIVE_RAPID':
        return <Zap className="w-3.5 h-3.5" />;
      case 'HYPER_SPEED':
        return <Gauge className="w-3.5 h-3.5" />;
      case 'TACTICAL_NUKE':
        return <Bomb className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div id="game-hud" className="pointer-events-none absolute inset-0 p-3 sm:p-5 flex flex-col justify-between select-none">
      {/* Top Header Row */}
      <div className="flex flex-col items-center w-full gap-2">
        {/* Prominent XP / Coin Bar at the top */}
        <div className="w-full max-w-xl flex items-center gap-3 bg-neutral-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-neutral-800 shadow-xl pointer-events-auto">
          {/* Level Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-extrabold text-xs sm:text-sm tracking-wider shadow-inner shrink-0">
            <span className="text-amber-400">♦</span> LVL {level}
          </div>

          {/* Progress Bar Container */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-cyan-300 mb-1 px-1">
              <span>EXP / COIN PROGRESS</span>
              <span>{Math.round(currentXp)} / {maxXp} ({Math.round(xpPercent)}%)</span>
            </div>
            <div className="relative w-full h-3.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-cyan-900/60 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-300 transition-all duration-150 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* High-Pressure Boss Siren Alert Banner & Pulsing Danger Overlay */}
        {bossAlert && (
          <>
            {/* Full-screen danger red strobe vignette */}
            <div className="fixed inset-0 pointer-events-none z-10 border-[6px] border-red-600/80 animate-ping shadow-[inset_0_0_100px_rgba(220,38,38,0.6)]" />

            {/* High-Pressure Alarm Banner */}
            <div className="relative z-20 overflow-hidden flex flex-col items-center px-8 py-3 rounded-2xl bg-gradient-to-r from-red-950 via-rose-900 to-purple-950 border-3 border-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.9)] animate-bounce">
              <div className="flex items-center gap-3 font-black text-sm sm:text-base tracking-widest uppercase text-red-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <AlertTriangle className="w-6 h-6 text-amber-300 animate-spin" />
                <span>⚠️ {bossAlertMessage || 'APEX TITAN BREACHED THE ARENA!'} ⚠️</span>
                <AlertTriangle className="w-6 h-6 text-amber-300 animate-spin" />
              </div>
              <div className="text-[11px] font-mono text-amber-300 tracking-wider mt-1 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                EXTREME THREAT: BULL CHARGES, GROUND SLAMS & MINION SWARMS!
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              </div>
            </div>
          </>
        )}

        {/* Active Supply Drop Temporary Buffs HUD */}
        {activeBuffs.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            {activeBuffs.map((buff) => (
              <div
                key={buff.type}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/90 border backdrop-blur-md shadow-lg font-bold text-xs"
                style={{ borderColor: buff.color, color: buff.color }}
              >
                {getBuffIcon(buff.type)}
                <span>{buff.title}</span>
                <span className="font-mono text-white text-[11px] px-1 py-0.2 rounded bg-white/10 ml-0.5">
                  {buff.remaining}s
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main HUD Row (Player Stats Left, Wave Center, Actions Right) */}
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Left Side: Player HP & Shield */}
        <div className="flex flex-col gap-2 bg-neutral-950/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-neutral-800 shadow-lg min-w-[180px] sm:min-w-[220px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Cute Player Icon */}
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                P
              </div>
              <span className="text-xs font-bold text-neutral-300">HEALTH</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">
              {Math.max(0, Math.ceil(hp))} / {maxHp}
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full h-3.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-700 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : hpPercent > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Shield Status if unlocked */}
          {shieldActive && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{shieldCooldown <= 0 ? 'Shield Ready' : `Recharging (${Math.ceil(shieldCooldown)}s)`}</span>
            </div>
          )}
        </div>

        {/* Center: Wave Counter & Zombies Remaining */}
        <div className="flex flex-col items-center bg-neutral-950/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-neutral-800 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400">
              WAVE {wave}
            </span>
            {isBoss && (
              <span className="px-2 py-0.5 rounded bg-purple-900/80 border border-purple-500 text-[10px] font-bold text-purple-300 animate-pulse">
                BOSS
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1">
            <Skull className="w-3.5 h-3.5 text-red-400" />
            <span className="font-semibold">Zombies:</span>
            <span className="font-mono text-white">{zombiesRemaining}</span>
            <span className="text-neutral-500">/ {zombiesTotal}</span>
          </div>
        </div>

        {/* Right Side: Score, Kills & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 bg-neutral-950/80 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-neutral-800 shadow-lg">
          <div className="hidden sm:flex flex-col items-end pr-2 border-r border-neutral-800 text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>{score.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <Skull className="w-3 h-3 text-red-500" />
              <span>{kills} Kills</span>
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Pause / Resume Button */}
          <button
            id="btn-toggle-pause"
            onClick={onTogglePause}
            title={isPaused ? 'Resume Game' : 'Pause Game'}
            className="p-2 sm:p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4 text-neutral-300" />}
          </button>
        </div>
      </div>
    </div>
  );
};
