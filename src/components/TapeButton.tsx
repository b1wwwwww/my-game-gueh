import React from 'react';
import { sounds } from '../game/audio';

interface TapeButtonProps {
  label: string;
  onClick: () => void;
  angle?: number;
  isActive?: boolean;
  accent?: 'red' | 'yellow' | 'cyan' | 'white';
  hotkeyBadge?: string;
  className?: string;
  id?: string;
}

export const TapeButton: React.FC<TapeButtonProps> = ({
  label,
  onClick,
  angle = 0,
  isActive = false,
  accent = 'white',
  hotkeyBadge,
  className = '',
  id
}) => {
  const handleMouseEnter = () => {
    sounds.playHit();
  };

  const handleClick = () => {
    sounds.playLevelUp();
    onClick();
  };

  // Color text styles
  const accentClasses = {
    red: 'text-[#ef4444] group-hover:text-[#f87171]',
    yellow: 'text-[#facc15] group-hover:text-[#fef08a]',
    cyan: 'text-[#38bdf8] group-hover:text-[#7dd3fc]',
    white: 'text-neutral-100 group-hover:text-white'
  }[accent];

  return (
    <div
      className={`relative inline-block transition-transform duration-150 group cursor-pointer ${className}`}
      style={{
        transform: `rotate(${angle}deg)`
      }}
    >
      <button
        id={id}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`relative flex items-center justify-between gap-4 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#0e0f13] border-y-2 border-x-4 border-black text-left shadow-[4px_6px_0px_#000000] hover:shadow-[6px_8px_0px_#000000] hover:-translate-y-0.5 active:translate-y-0.5 transition-all select-none min-w-[240px] sm:min-w-[320px] max-w-full cursor-pointer overflow-hidden ${
          isActive ? 'ring-2 ring-rose-500/80' : ''
        }`}
      >
        {/* Ragged tape edge cuts (left and right) */}
        <div
          className="absolute -left-1 top-0 bottom-0 w-2.5 bg-neutral-900 pointer-events-none opacity-40"
          style={{ clipPath: 'polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%)' }}
        />
        <div
          className="absolute -right-1 top-0 bottom-0 w-2.5 bg-neutral-900 pointer-events-none opacity-40"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 30% 50%)' }}
        />

        {/* Subtle tape texture noise highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/40 pointer-events-none" />

        {/* Button Label */}
        <span
          className={`font-display font-black text-base sm:text-lg tracking-widest uppercase transition-colors drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${accentClasses}`}
        >
          {label}
        </span>

        {/* Optional Hotkey / Controller A Badge like in reference */}
        {hotkeyBadge && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-rose-500/90 bg-rose-950/40 text-rose-400 font-display font-black text-xs shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.4)]">
            {hotkeyBadge}
          </div>
        )}
      </button>
    </div>
  );
};
