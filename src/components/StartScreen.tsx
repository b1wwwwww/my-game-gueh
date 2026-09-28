import React, { useState, useEffect } from 'react';
import { HeroClassId } from '../game/classes';
import { ComicSoldier } from './ComicSoldier';
import { IndustrialGatesBackground } from './IndustrialGatesBackground';
import { TapeButton } from './TapeButton';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { SettingsModal } from './SettingsModal';
import { HowToPlayModal } from './HowToPlayModal';
import { ExitModal } from './ExitModal';
import { Volume2, VolumeX, Download, RotateCcw } from 'lucide-react';
import { sounds } from '../game/audio';

interface StartScreenProps {
  selectedClass: HeroClassId;
  onSelectClass: (id: HeroClassId) => void;
  onStartGame: (cls?: HeroClassId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onDownloadStandalone: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedClass,
  onSelectClass,
  onStartGame,
  isMuted,
  onToggleMute,
  onDownloadStandalone
}) => {
  // Modal / subview state
  const [showCharSelect, setShowCharSelect] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isStandby, setIsStandby] = useState(false);

  // Keyboard shortcut listener on main menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If no submodal is open
      if (!showCharSelect && !showSettings && !showHowToPlay && !showExitModal && !isStandby) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'a' || e.key === 'A') {
          sounds.playLevelUp();
          setShowCharSelect(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCharSelect, showSettings, showHowToPlay, showExitModal, isStandby]);

  const handleStartClick = () => {
    setShowCharSelect(true);
  };

  const handleConfirmDeploy = (cls: HeroClassId) => {
    setShowCharSelect(false);
    onStartGame(cls);
  };

  if (isStandby) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 select-none font-mono">
        <div className="max-w-md text-center space-y-4">
          <div className="text-rose-500 text-sm tracking-widest uppercase">
            [PROTOCOL DISENGAGED // SYSTEM IN STANDBY]
          </div>
          <h1 className="font-display font-black text-3xl uppercase tracking-wider text-neutral-300">
            Session Terminated
          </h1>
          <p className="text-xs text-neutral-500">
            Perimeter surveillance offline. Operative telemetry stored.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                sounds.playLevelUp();
                setIsStandby(false);
              }}
              className="py-3 px-8 bg-[#facc15] hover:bg-[#fde047] text-black font-display font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#ffffff] cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Re-Initialize Protocol</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="start-screen"
      className="absolute inset-0 z-50 flex flex-col justify-between bg-[#121316] text-white overflow-hidden select-none"
    >
      {/* Gritty Comic Industrial Background (with prominent yellow security gates) */}
      <IndustrialGatesBackground />

      {/* Top Utility Controls (Quiet, discrete in corners) */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pointer-events-auto">
          <span className="w-2 h-2 bg-[#facc15] border border-black" />
          <span className="font-bold tracking-wider uppercase text-neutral-300">SECTOR 04 // PROTOCOL</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e0f13] hover:bg-neutral-800 border-2 border-black text-xs font-mono font-bold text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadStandalone}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e0f13] hover:bg-neutral-800 border-2 border-black text-xs font-mono font-bold text-amber-400 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
            title="Download Standalone HTML"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HTML Build</span>
          </button>
        </div>
      </header>

      {/* Main Screen Layout Matching Reference Image */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-8 pb-4">
        {/* Top Center-Right: Bold [ZOMBIE RUSH] Stencil Box (Styled exactly like [REDACTED]) */}
        <div className="w-full flex justify-end md:justify-center md:pl-48 pt-1 sm:pt-4">
          <div
            className="relative bg-white text-black border-4 border-black px-8 sm:px-14 py-2 sm:py-3.5 shadow-[8px_10px_0px_#000000] select-none"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {/* Corner brackets */}
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tighter uppercase leading-none drop-shadow-sm">
              [ZOMBIE RUSH]
            </h1>
          </div>
        </div>

        {/* Center Arena Area: Left Comic Soldier + Center Stacked Angled Tape Buttons */}
        <div className="relative w-full flex-1 flex items-center justify-between">
          {/* Left Character: Comic Book Cyan Soldier with White Sticker Cutout */}
          <div className="absolute left-[-20px] sm:left-4 md:left-8 bottom-[-20px] sm:bottom-0 w-[240px] sm:w-[340px] md:w-[420px] lg:w-[480px] pointer-events-none z-10">
            <ComicSoldier />
            {/* eddcoates style tag badge at bottom left of character */}
            <div className="absolute bottom-6 left-6 bg-[#0e0f13] text-neutral-300 font-mono font-bold text-[10px] tracking-wider px-2 py-1 border border-black shadow-[2px_2px_0px_#000]">
              protocol // v1.2
            </div>
          </div>

          {/* Center-Left: Layered Angled Duct-Tape Slats (Exact layout from reference) */}
          <div className="relative z-20 ml-auto md:ml-[340px] lg:ml-[420px] mr-auto flex flex-col gap-2.5 sm:gap-3 py-6">
            {/* Button 1: START (Red accent with A badge) */}
            <TapeButton
              id="btn-main-start"
              label="START"
              angle={-1.8}
              accent="red"
              hotkeyBadge="A"
              isActive={true}
              onClick={handleStartClick}
            />

            {/* Button 2: SETTINGS */}
            <TapeButton
              id="btn-main-settings"
              label="SETTINGS"
              angle={1.2}
              accent="white"
              onClick={() => setShowSettings(true)}
            />

            {/* Button 3: HOW TO PLAY */}
            <TapeButton
              id="btn-main-how-to-play"
              label="HOW TO PLAY"
              angle={-0.8}
              accent="white"
              onClick={() => setShowHowToPlay(true)}
            />

            {/* Spacer before Exit */}
            <div className="h-4 sm:h-6" />

            {/* Button 4: EXIT */}
            <TapeButton
              id="btn-main-exit"
              label="EXIT"
              angle={1.5}
              accent="white"
              onClick={() => setShowExitModal(true)}
            />
          </div>
        </div>

        {/* Bottom Banner: Controller / Keyboard Recommendation Tag (matching bottom right of reference) */}
        <div className="relative z-20 w-full flex items-center justify-between pt-2">
          <div className="hidden sm:block text-[11px] font-mono text-neutral-500 uppercase">
            Horde Surge Engine · Sector Outpost 04
          </div>

          <div
            className="ml-auto bg-[#0e0f13] text-neutral-200 border-2 border-black font-display font-bold text-xs sm:text-sm px-4 py-1.5 shadow-[4px_4px_0px_#000000]"
            style={{ transform: 'rotate(-0.5deg)' }}
          >
            Playing with a keyboard & mouse is recommended.
          </div>
        </div>
      </div>

      {/* --- SUBMODALS / VIEWS --- */}
      {/* 1. Character Selection Screen (Triggered by START button) */}
      {showCharSelect && (
        <CharacterSelectScreen
          selectedClass={selectedClass}
          onSelectClass={onSelectClass}
          onConfirmDeploy={handleConfirmDeploy}
          onBackToMenu={() => setShowCharSelect(false)}
        />
      )}

      {/* 2. Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />

      {/* 3. How To Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* 4. Exit Confirmation Modal */}
      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={() => {
          setShowExitModal(false);
          setIsStandby(true);
        }}
      />
    </div>
  );
};
