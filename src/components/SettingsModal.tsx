import React, { useState } from 'react';
import { Volume2, VolumeX, X, Monitor, ShieldAlert, Sparkles, Check, Sliders } from 'lucide-react';
import { sounds } from '../game/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute
}) => {
  const [screenShake, setScreenShake] = useState(true);
  const [damageNumbers, setDamageNumbers] = useState(true);
  const [particleQuality, setParticleQuality] = useState<'normal' | 'high'>('high');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-lg bg-[#0e1014] border-4 border-black shadow-[10px_14px_0px_#000000] p-6 text-left flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#facc15] text-black font-display font-black text-xs px-2 py-0.5 uppercase border border-black shadow-[2px_2px_0px_#000]">
              SYS
            </div>
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              Combat Configuration & Settings
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

        {/* Options List */}
        <div className="space-y-4 text-xs font-mono">
          {/* Audio Master */}
          <div className="p-3 bg-black/60 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              <div>
                <div className="text-white font-bold uppercase font-display text-sm">Master Audio</div>
                <div className="text-neutral-400 text-[11px]">Procedural sound synthesis & SFX</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onToggleMute();
                sounds.playShoot();
              }}
              className={`px-4 py-1.5 font-bold uppercase border-2 border-black font-display text-xs cursor-pointer shadow-[2px_2px_0px_#000] transition-colors ${
                isMuted ? 'bg-neutral-800 text-neutral-400' : 'bg-[#facc15] text-black'
              }`}
            >
              {isMuted ? 'MUTED' : 'ENABLED'}
            </button>
          </div>

          {/* Screen Shake */}
          <div className="p-3 bg-black/60 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-white font-bold uppercase font-display text-sm">Screen Shake & Impact</div>
                <div className="text-neutral-400 text-[11px]">Camera trauma on boss slams & damage taken</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playHit();
                setScreenShake(!screenShake);
              }}
              className={`px-4 py-1.5 font-bold uppercase border-2 border-black font-display text-xs cursor-pointer shadow-[2px_2px_0px_#000] transition-colors ${
                screenShake ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {screenShake ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Floating Damage Numbers */}
          <div className="p-3 bg-black/60 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-white font-bold uppercase font-display text-sm">Damage Numbers</div>
                <div className="text-neutral-400 text-[11px]">Render dynamic floating combat text</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playHit();
                setDamageNumbers(!damageNumbers);
              }}
              className={`px-4 py-1.5 font-bold uppercase border-2 border-black font-display text-xs cursor-pointer shadow-[2px_2px_0px_#000] transition-colors ${
                damageNumbers ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {damageNumbers ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Graphics Particle Density */}
          <div className="p-3 bg-black/60 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-white font-bold uppercase font-display text-sm">FX Particle Density</div>
                <div className="text-neutral-400 text-[11px]">Gore splatter, plasma trails, and smoke</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playHit();
                setParticleQuality(particleQuality === 'normal' ? 'high' : 'normal');
              }}
              className="px-4 py-1.5 bg-[#facc15] text-black font-bold uppercase border-2 border-black font-display text-xs cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              {particleQuality.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sounds.playHit();
              onClose();
            }}
            className="py-2.5 px-6 bg-[#facc15] hover:bg-[#fde047] text-black font-display font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            Save & Return [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
