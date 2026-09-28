import React from 'react';
import { X, Crosshair, Zap, Shield, Trophy, Disc, Skull } from 'lucide-react';
import { sounds } from '../game/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-2xl bg-[#0e1014] border-4 border-black shadow-[12px_16px_0px_#000000] p-6 sm:p-7 text-left flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#facc15] text-black font-display font-black text-xs px-2.5 py-1 uppercase border-2 border-black rotate-[-1deg] shadow-[2px_2px_0px_#000]">
              [MANUAL]
            </div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
              Field Combat Manual & Controls
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onClose();
            }}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Briefing Directives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Directive 1: Movement & Dodge */}
          <div className="p-3.5 bg-black/60 border-2 border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#38bdf8] font-display font-black text-sm uppercase mb-1.5">
                <Zap className="w-4 h-4 text-[#38bdf8]" />
                <span>1. Movement & Dash</span>
              </div>
              <p className="text-neutral-300 leading-relaxed font-mono">
                Use <strong className="text-white font-bold">W, A, S, D</strong> to maneuver. Press <strong className="text-amber-400 font-bold">SPACEBAR</strong> or <strong className="text-amber-400 font-bold">RIGHT-CLICK</strong> to perform an invincible combat roll to escape swarms or evade boss charge attacks.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-400">
              COOLDOWN: 1.5s - 2.8s (CLASS DEPENDENT)
            </div>
          </div>

          {/* Directive 2: Automated Aim */}
          <div className="p-3.5 bg-black/60 border-2 border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#facc15] font-display font-black text-sm uppercase mb-1.5">
                <Crosshair className="w-4 h-4 text-[#facc15]" />
                <span>2. Automated Arsenal</span>
              </div>
              <p className="text-neutral-300 leading-relaxed font-mono">
                Your weapon systems fire <strong className="text-white font-bold">automatically</strong> toward the nearest threatening hostile. Keep moving, control horde distance, and focus on positioning.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-400">
              TARGET PRIORITY: CLOSEST HOSTILE
            </div>
          </div>

          {/* Directive 3: XP & Upgrades */}
          <div className="p-3.5 bg-black/60 border-2 border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#4ade80] font-display font-black text-sm uppercase mb-1.5">
                <Shield className="w-4 h-4 text-[#4ade80]" />
                <span>3. XP & Tech Upgrades</span>
              </div>
              <p className="text-neutral-300 leading-relaxed font-mono">
                Defeated enemies drop blue XP crystals. Fill your meter to level up and choose between Orbiting Plasma Saws, Automated Combat Drones, Tesla Arcs, Piercing Bullets, and Damage Boosts.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-400">
              COLLECT MAGNET DROPS FOR INSTANT VACUUM
            </div>
          </div>

          {/* Directive 4: Apex Titan Bosses */}
          <div className="p-3.5 bg-black/60 border-2 border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#ef4444] font-display font-black text-sm uppercase mb-1.5">
                <Skull className="w-4 h-4 text-[#ef4444]" />
                <span>4. Apex Titan Bosses</span>
              </div>
              <p className="text-neutral-300 leading-relaxed font-mono">
                Survive through Wave 5 to trigger the massive Apex Titan encounter. Watch out for ground shockwaves, charging rushes, and high damage spit attacks.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-400">
              RADAR MAP SHOWS BOSS & SUPPLY DROPS
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t-2 border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onClose();
            }}
            className="py-2.5 px-6 bg-[#facc15] hover:bg-[#fde047] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            Understood [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
