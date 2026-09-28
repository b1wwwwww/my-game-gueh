import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine, GameOverStats } from './game/engine';
import { GameHUD } from './components/GameHUD';
import { MiniMap } from './components/MiniMap';
import { UpgradeModal } from './components/UpgradeModal';
import { GameOverModal } from './components/GameOverModal';
import { StartScreen } from './components/StartScreen';
import { PauseModal } from './components/PauseModal';
import { UpgradeOption, GameState } from './game/types';
import { HeroClassId } from './game/classes';
import { getRandomUpgrades, applyUpgradeToPlayer } from './game/upgrades';
import { sounds } from './game/audio';
import { Play, RotateCcw } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // React State for HUD & UI
  const [gameState, setGameState] = useState<GameState>('START');
  const [selectedHeroClass, setSelectedHeroClass] = useState<HeroClassId>('commando');
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
  const [dashCooldown, setDashCooldown] = useState(0);
  const [dashCooldownMax, setDashCooldownMax] = useState(2.5);
  const [autoWeapons, setAutoWeapons] = useState({
    orbitingBladesCount: 0,
    droneActive: false,
    teslaActive: false
  });

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

  // Update shield and skill status on tick
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const interval = setInterval(() => {
      if (engineRef.current) {
        setShieldActive(engineRef.current.player.shieldActive);
        setShieldCooldown(engineRef.current.player.shieldCooldown);
        setDashCooldown(engineRef.current.player.dashCooldown);
        setDashCooldownMax(engineRef.current.player.dashCooldownMax);
        setAutoWeapons({
          orbitingBladesCount: engineRef.current.player.orbitingBladesCount,
          droneActive: engineRef.current.player.droneActive,
          teslaActive: engineRef.current.player.teslaActive
        });
      }
    }, 150);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleStartGame = useCallback((heroCls?: HeroClassId) => {
    if (!engineRef.current) return;
    const cls = heroCls || selectedHeroClass;
    engineRef.current.startGame(cls);
    setGameState('PLAYING');
    setGameOverStats(null);
  }, [selectedHeroClass]);

  const handleDash = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.triggerDash();
    }
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

  const handleReturnToMainMenu = useCallback(() => {
    sounds.playHit();
    if (engineRef.current) {
      engineRef.current.pause();
    }
    setGameState('START');
    setGameOverStats(null);
  }, []);

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
              onReturnToMainMenu={handleReturnToMainMenu}
              shieldActive={shieldActive}
              shieldCooldown={shieldCooldown}
              dashCooldown={dashCooldown}
              dashCooldownMax={dashCooldownMax}
              onDash={handleDash}
              heroClass={selectedHeroClass}
              autoWeapons={autoWeapons}
            />
            {/* Tactical Mini-Map in top-right corner (toggleable & collapsible) */}
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
          <GameOverModal
            stats={gameOverStats}
            onRestart={handleStartGame}
            onChangeClass={() => setGameState('START')}
          />
        )}

        {/* Tactical Pause Modal with Resume, Restart, and Return to Main Menu */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleTogglePause}
            onRestart={() => handleStartGame()}
            onReturnToMainMenu={handleReturnToMainMenu}
            wave={wave}
            score={score}
            kills={kills}
            heroClass={selectedHeroClass}
          />
        )}

        {/* Start Game Title Screen */}
        {gameState === 'START' && (
          <StartScreen
            selectedClass={selectedHeroClass}
            onSelectClass={(id) => {
              setSelectedHeroClass(id);
              if (engineRef.current) {
                engineRef.current.setHeroClass(id);
              }
            }}
            onStartGame={handleStartGame}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onDownloadStandalone={handleDownloadStandalone}
          />
        )}
      </div>
    </div>
  );
}
