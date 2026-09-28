import React from 'react';
import { HeroClassId } from '../game/classes';

interface OperativeInsigniaProps {
  classId: HeroClassId;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const OperativeInsignia: React.FC<OperativeInsigniaProps> = ({
  classId,
  size = 'md',
  active = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }[size];

  const iconSizes = {
    sm: 18,
    md: 26,
    lg: 36
  }[size];

  // Specific theme definitions per class
  if (classId === 'commando') {
    return (
      <div
        className={`relative ${sizeClasses} rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 overflow-hidden ${
          active
            ? 'bg-blue-950/70 border-blue-400/90 shadow-[0_0_16px_rgba(59,130,246,0.4)]'
            : 'bg-neutral-900/90 border-blue-500/30'
        }`}
      >
        {/* Subtle tactical corner markers */}
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-blue-400/60" />
        <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-blue-400/60" />

        {/* Tactical Commando SVG Insignia */}
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          {/* Outer Shield Chevrons */}
          <path
            d="M20 4L34 11V22C34 29 27 34 20 37C13 34 6 29 6 22V11L20 4Z"
            stroke="#3b82f6"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />
          {/* Inner ballistic reticle */}
          <circle cx="20" cy="20" r="7" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M20 9V15M20 25V31M9 20H15M25 20H31" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="20" r="2.5" fill="#3b82f6" />
        </svg>

        {/* Unit Code Label */}
        <span className="absolute bottom-0.5 left-1 text-[8px] font-mono font-bold tracking-tighter text-blue-400/80 leading-none">
          VNG
        </span>
      </div>
    );
  }

  if (classId === 'demolitionist') {
    return (
      <div
        className={`relative ${sizeClasses} rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 overflow-hidden ${
          active
            ? 'bg-amber-950/70 border-amber-400/90 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
            : 'bg-neutral-900/90 border-amber-500/30'
        }`}
      >
        {/* Subtle tactical corner markers */}
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-amber-400/60" />
        <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-amber-400/60" />

        {/* Tactical Demolitionist SVG Insignia */}
        <svg
          width={iconSizes}
          height={iconSizes}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          {/* Ordnance Diamond Outer */}
          <path
            d="M20 4L36 20L20 36L4 20L20 4Z"
            stroke="#f97316"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />
          {/* Saw Tooth / Blast Geometry */}
          <circle cx="20" cy="20" r="6" stroke="#fb923c" strokeWidth="1.5" />
          <path
            d="M20 10L23 15M20 30L17 25M30 20L25 23M10 20L15 17"
            stroke="#fde047"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="2.5" fill="#f97316" />
        </svg>

        {/* Unit Code Label */}
        <span className="absolute bottom-0.5 left-1 text-[8px] font-mono font-bold tracking-tighter text-amber-400/80 leading-none">
          ORD
        </span>
      </div>
    );
  }

  // scout
  return (
    <div
      className={`relative ${sizeClasses} rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 overflow-hidden ${
        active
          ? 'bg-cyan-950/70 border-cyan-400/90 shadow-[0_0_16px_rgba(6,182,212,0.4)]'
          : 'bg-neutral-900/90 border-cyan-500/30'
      }`}
    >
      {/* Subtle tactical corner markers */}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-cyan-400/60" />
      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-cyan-400/60" />

      {/* Tactical Scout SVG Insignia */}
      <svg
        width={iconSizes}
        height={iconSizes}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-105"
      >
        {/* Hexagonal Cyber Wing */}
        <path
          d="M20 5L33 12.5V27.5L20 35L7 27.5V12.5L20 5Z"
          stroke="#06b6d4"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        />
        {/* Radar Telemetry Wings & Eye */}
        <path
          d="M12 20C12 16 16 14 20 14C24 14 28 16 28 20C28 24 24 26 20 26C16 26 12 24 12 20Z"
          stroke="#22d3ee"
          strokeWidth="1.5"
        />
        <path d="M7 20H12M28 20H33M20 7V12M20 28V33" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.5" fill="#06b6d4" />
      </svg>

      {/* Unit Code Label */}
      <span className="absolute bottom-0.5 left-1 text-[8px] font-mono font-bold tracking-tighter text-cyan-400/80 leading-none">
        RCN
      </span>
    </div>
  );
};
