import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine, GameOverStats } from './game/engine';
import { GameHUD } from './components/GameHUD';
import { MiniMap } from './components/MiniMap';
import { UpgradeModal } from './components/UpgradeModal';
import { GameOverModal } from './components/GameOverModal';
import { UpgradeOption, GameState } from './game/types';
import { getRandomUpgrades, applyUpgradeToPlayer } from './game/upgrades';
import { sounds } from './game/audio';
import { Play, RotateCcw, Shield, Download, Swords, Info } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // React State for HUD & UI
  const [gameState, setGameState] = useState<GameState>('START');
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [currentXp, setCurrentXp] = useState(0);
  const [maxXp, setMaxXp] = useState(8);
  const [level, setLevel] = useState(1);
  const [wave, setWave] = useState(1);
  const [zombiesRemaining, setZombiesRemaining] = useState(15);
  const [zombiesTotal, setZombiesTotal] = useState(15);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [isBoss, setIsBoss] = useState(false);
  const [bossAlert, setBossAlert] = useState(false);
  const [bossAlertMessage, setBossAlertMessage] = useState('');
  const [activeBuffs, setActiveBuffs] = useState<{ type: any; title: string; remaining: number; color: string }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOption[]>([]);
  const [gameOverStats, setGameOverStats] = useState<GameOverStats | null>(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldCooldown, setShieldCooldown] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Initialize Game Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onXpChange: (curr, max, lvl) => {
        setCurrentXp(curr);
        setMaxXp(max);
        setLevel(lvl);
      },
      onHpChange: (current, max) => {
        setHp(current);
        setMaxHp(max);
      },
      onWaveChange: (w, rem, total, boss) => {
        setWave(w);
        setZombiesRemaining(rem);
        setZombiesTotal(total);
        setIsBoss(boss);
      },
      onScoreChange: (s, k) => {
        setScore(s);
        setKills(k);
      },
      onLevelUp: () => {
        const opts = getRandomUpgrades(3);
        setUpgradeOptions(opts);
        setGameState('UPGRADE');
      },
      onGameOver: (stats) => {
        setGameOverStats(stats);
        setGameState('GAMEOVER');
      },
      onBossAlert: (active, message) => {
        setBossAlert(active);
        if (message) setBossAlertMessage(message);
      },
      onActiveBuffsChange: (buffs) => {
        setActiveBuffs(buffs);
      }
    });

    engineRef.current = engine;

    // Handle container resize
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        engine.resize(clientWidth, clientHeight);
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      engine.destroy();
    };
  }, []);

  // Update shield status on tick
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      if (engineRef.current) {
        setShieldActive(engineRef.current.player.shieldActive);
        setShieldCooldown(engineRef.current.player.shieldCooldown);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleStartGame = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.startGame();
    setGameState('PLAYING');
    setGameOverStats(null);
  }, []);

  const handleSelectUpgrade = useCallback((option: UpgradeOption) => {
    if (!engineRef.current) return;
    applyUpgradeToPlayer(engineRef.current.player, option.id);
    engineRef.current.resume();
    setGameState('PLAYING');
  }, []);

  const handleTogglePause = useCallback(() => {
    if (!engineRef.current) return;
    if (gameState === 'PLAYING') {
      engineRef.current.pause();
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      engineRef.current.resume();
      setGameState('PLAYING');
    }
  }, [gameState]);

  const handleToggleMute = useCallback(() => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  }, []);

  // Download Standalone Single-File HTML
  const handleDownloadStandalone = () => {
    window.open('/standalone_game.html', '_blank');
  };

  return (
    <div id="game-root" className="relative w-screen h-screen overflow-hidden bg-neutral-950 flex flex-col font-sans select-none text-white">
      {/* Game Canvas Container */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair touch-none" />

        {/* In-Game HUD overlay */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'UPGRADE') && (
          <>
            <GameHUD
              hp={hp}
              maxHp={maxHp}
              currentXp={currentXp}
              maxXp={maxXp}
              level={level}
              wave={wave}
              zombiesRemaining={zombiesRemaining}
              zombiesTotal={zombiesTotal}
              score={score}
              kills={kills}
              isBoss={isBoss}
              bossAlert={bossAlert}
              bossAlertMessage={bossAlertMessage}
              activeBuffs={activeBuffs}
              isPaused={gameState === 'PAUSED'}
              isMuted={isMuted}
              onTogglePause={handleTogglePause}
              onToggleMute={handleToggleMute}
              shieldActive={shieldActive}
              shieldCooldown={shieldCooldown}
            />
            {/* Tactical Mini-Map in bottom-left corner */}
            <MiniMap engine={engineRef.current} />
          </>
        )}

        {/* Upgrade Selection Modal */}
        {gameState === 'UPGRADE' && (
          <UpgradeModal
            options={upgradeOptions}
            onSelect={handleSelectUpgrade}
            level={level}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'GAMEOVER' && gameOverStats && (
          <GameOverModal stats={gameOverStats} onRestart={handleStartGame} />
        )}

        {/* Pause Overlay Screen */}
        {gameState === 'PAUSED' && (
          <div id="pause-overlay" className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-2 tracking-wider">GAME PAUSED</h2>
              <p className="text-xs text-neutral-400 mb-6">Take a breather before diving back into the rush</p>

              <button
                id="btn-resume-game"
                onClick={handleTogglePause}
                className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-bold text-sm transition-all mb-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-900/40"
              >
                <Play className="w-4 h-4 fill-white" /> Resume (P / Esc)
              </button>

              <button
                id="btn-restart-from-pause"
                onClick={handleStartGame}
                className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Restart Match
              </button>
            </div>
          </div>
        )}

        {/* Start Game Title Screen */}
        {gameState === 'START' && (
          <div id="start-screen" className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-md p-4">
            <div className="max-w-md w-full bg-neutral-900/95 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl">
              {/* Title Badge */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-red-900/30 mb-4">
                <Swords className="w-8 h-8" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                ZOMBIE RUSH
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                2D Top-Down Survivor Arena with automatic targeting, endless waves, and rogue-lite upgrades!
              </p>

              {/* Action Buttons */}
              <button
                id="btn-start-game"
                onClick={handleStartGame}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 active:scale-95 text-white font-black text-base uppercase tracking-wider transition-all duration-150 shadow-xl shadow-red-900/40 flex items-center justify-center gap-2 mb-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" /> Start Survivor Run
              </button>

              <div className="flex gap-2 w-full">
                <button
                  id="btn-how-to-play"
                  onClick={() => setShowHowToPlay(!showHowToPlay)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" /> How To Play
                </button>

                <button
                  id="btn-download-html"
                  onClick={handleDownloadStandalone}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="View / Download Standalone Single-File HTML"
                >
                  <Download className="w-3.5 h-3.5" /> Single-File HTML
                </button>
              </div>

              {/* Controls & Instructions accordion */}
              {showHowToPlay && (
                <div className="w-full mt-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs text-neutral-300 space-y-2 animate-in fade-in duration-150">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-1">
                    Battle Controls
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">Move:</span>
                    <span className="font-mono text-white font-semibold">WASD / Arrow Keys</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">Shooting:</span>
                    <span className="font-semibold text-emerald-400">Auto-aims nearest zombie</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-neutral-400">Progression:</span>
                    <span>EXP scales with higher waves + Rogue-lite cards</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-900">
                    <span className="text-cyan-400 font-semibold">Supply Drops:</span>
                    <span className="text-cyan-200">Parachutes with Titan Dmg, Vortex Magnet & Nukes</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-purple-400 font-semibold">Boss Battles:</span>
                    <span className="text-rose-300">Pre-attack dialogues, charging & shockwaves</span>
                  </div>
                </div>
              )}

              {/* Quick control chips */}
              {!showHowToPlay && (
                <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
                  <span className="px-2 py-1 rounded bg-neutral-800/80 border border-neutral-700/60">
                    [WASD] Move
                  </span>
                  <span className="px-2 py-1 rounded bg-neutral-800/80 border border-neutral-700/60">
                    [AUTO] Aim & Shoot
                  </span>
                  <span className="px-2 py-1 rounded bg-neutral-800/80 border border-neutral-700/60">
                    [P] Pause
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
