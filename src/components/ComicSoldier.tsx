import React from 'react';

interface ComicSoldierProps {
  className?: string;
}

export const ComicSoldier: React.FC<ComicSoldierProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        filter:
          'drop-shadow(3px 0 0 #ffffff) drop-shadow(-3px 0 0 #ffffff) drop-shadow(0 3px 0 #ffffff) drop-shadow(0 -3px 0 #ffffff) drop-shadow(4px 6px 12px rgba(0,0,0,0.85))'
      }}
    >
      <svg
        viewBox="0 0 420 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-[85vh] object-contain"
      >
        <defs>
          {/* Halftone Dot Pattern for comic shading */}
          <pattern id="halftone" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.5" fill="#0077b6" opacity="0.6" />
          </pattern>
          <pattern id="dense-dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.8" fill="#03045e" opacity="0.75" />
          </pattern>

          {/* Visor Gradient */}
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#48cae4" />
            <stop offset="45%" stopColor="#0096c7" />
            <stop offset="100%" stopColor="#023e8a" />
          </linearGradient>

          {/* Armor Cyan Gradient */}
          <linearGradient id="armorCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00b4d8" />
            <stop offset="60%" stopColor="#0077b6" />
            <stop offset="100%" stopColor="#03045e" />
          </linearGradient>
        </defs>

        {/* --- BASE BODY SILHOUETTE --- */}
        {/* Legs / Lower Torso */}
        <path
          d="M120 540L100 680H220L210 570L260 680H350L310 520L280 430L120 540Z"
          fill="#0077b6"
          stroke="#050505"
          strokeWidth="7"
          strokeLinejoin="round"
        />

        {/* Heavy Black Inking on Lower Body */}
        <path
          d="M100 680H160L150 590L135 680Z"
          fill="#050505"
        />
        <path
          d="M260 680H320L295 560L280 680Z"
          fill="#050505"
        />

        {/* Tactical Belt & Pouches */}
        <rect
          x="110"
          y="485"
          width="170"
          height="32"
          rx="4"
          fill="#090a0f"
          stroke="#050505"
          strokeWidth="6"
        />
        <rect x="125" y="492" width="28" height="26" rx="3" fill="#0096c7" stroke="#000" strokeWidth="4" />
        <rect x="165" y="490" width="34" height="30" rx="3" fill="#090a0f" stroke="#000" strokeWidth="4" />
        <rect x="210" y="492" width="28" height="26" rx="3" fill="#0096c7" stroke="#000" strokeWidth="4" />

        {/* Main Chest Armor & Vest */}
        <path
          d="M120 280L100 440L140 495H250L285 430L265 275L210 240H160L120 280Z"
          fill="url(#armorCyan)"
          stroke="#050505"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* Halftone overlay on Torso */}
        <path
          d="M125 320L110 430L145 480H190L170 300Z"
          fill="url(#halftone)"
        />

        {/* Comic Shadow Blocks on Torso */}
        <path
          d="M200 270L190 485H245L275 425L255 275Z"
          fill="#050505"
        />
        <path
          d="M130 380L180 395L175 460L120 445Z"
          fill="#03045e"
        />

        {/* Back Rig / Gear Carrier Tubes */}
        <path
          d="M60 210L75 140H100L90 240L60 210Z"
          fill="#0096c7"
          stroke="#050505"
          strokeWidth="6"
        />
        <rect x="70" y="150" width="20" height="70" fill="#050505" />
        <path
          d="M80 140L80 110H95L95 140Z"
          fill="#090a0f"
          stroke="#050505"
          strokeWidth="4"
        />

        {/* Left Arm / Shoulder Pad */}
        <path
          d="M90 280L60 360L110 420L145 350L130 275Z"
          fill="url(#armorCyan)"
          stroke="#050505"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* Pauldron Comic Shadow */}
        <path
          d="M65 350L110 415L120 370L75 320Z"
          fill="#050505"
        />
        {/* Shoulder plate highlight */}
        <ellipse cx="105" cy="305" rx="20" ry="12" fill="#48cae4" opacity="0.8" />

        {/* --- TACTICAL CARBINE RIFLE --- */}
        {/* Rifle Stock and Body held across chest */}
        <g id="carbine-rifle">
          {/* Stock */}
          <path
            d="M165 370L195 400L220 385L200 350Z"
            fill="#050505"
            stroke="#050505"
            strokeWidth="5"
          />
          {/* Main Receiver */}
          <path
            d="M190 355L315 200L350 220L225 380Z"
            fill="#0f172a"
            stroke="#050505"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Barrel & Muzzle Shroud */}
          <path
            d="M310 205L370 135L390 150L335 220Z"
            fill="#0096c7"
            stroke="#050505"
            strokeWidth="6"
          />
          {/* Muzzle tip */}
          <path
            d="M365 140L385 115L398 125L380 150Z"
            fill="#050505"
            stroke="#050505"
            strokeWidth="4"
          />
          {/* Top Tactical Rail / Optic Sight */}
          <path
            d="M260 230L340 135L360 148L280 245Z"
            fill="#0077b6"
            stroke="#050505"
            strokeWidth="6"
          />
          {/* Sight Lens */}
          <ellipse cx="348" cy="142" rx="7" ry="5" fill="#48cae4" />
          {/* Foregrip & Mag */}
          <path
            d="M245 285L270 340L290 330L265 275Z"
            fill="#050505"
            stroke="#050505"
            strokeWidth="5"
          />
          {/* Magazine */}
          <path
            d="M225 330L235 390L255 385L245 320Z"
            fill="#023e8a"
            stroke="#050505"
            strokeWidth="5"
          />
          {/* Barrel vents */}
          <line x1="330" y1="185" x2="340" y2="192" stroke="#050505" strokeWidth="4" />
          <line x1="345" y1="165" x2="355" y2="172" stroke="#050505" strokeWidth="4" />
        </g>

        {/* Arms & Tactical Gloves */}
        {/* Right Arm grasping grip */}
        <path
          d="M240 280L275 255L310 300L275 320Z"
          fill="#0096c7"
          stroke="#050505"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="M270 290L295 270L305 285L280 305Z"
          fill="#050505"
        />
        {/* Left Hand on Barrel Foregrip */}
        <path
          d="M275 240L300 210L320 225L295 255Z"
          fill="#00b4d8"
          stroke="#050505"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M285 230L310 215L315 225L290 240Z"
          fill="#050505"
        />

        {/* --- HELMET & VISOR --- */}
        {/* Helmet Base Dome */}
        <path
          d="M130 180C120 110 160 55 220 55C275 55 310 100 310 170L295 220L260 240H160L130 180Z"
          fill="#0077b6"
          stroke="#050505"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {/* Helmet Crown Ridge */}
        <path
          d="M165 75C190 62 235 62 265 75L270 95C240 82 195 82 165 95Z"
          fill="#050505"
        />
        {/* Visor Cutout Frame */}
        <path
          d="M145 135C140 120 160 105 210 105C260 105 280 120 280 140L275 205C270 215 245 225 210 225C170 225 150 215 145 200Z"
          fill="url(#visorGrad)"
          stroke="#050505"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* Visor Glare / High-gloss Reflection */}
        <path
          d="M155 125L200 115L190 215L150 195Z"
          fill="#caf0f8"
          opacity="0.35"
        />
        <line x1="162" y1="130" x2="162" y2="195" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <line x1="172" y1="125" x2="172" y2="175" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

        {/* Helmet Cheek Guard & Comm Mic */}
        <path
          d="M135 185L155 220L190 235L170 245L130 205Z"
          fill="#050505"
        />
        <circle cx="140" cy="195" r="7" fill="#00b4d8" stroke="#050505" strokeWidth="3" />
        <path d="M140 202L155 225" stroke="#050505" strokeWidth="4" strokeLinecap="round" />

        {/* Tactical Crosshatching & Ink Marks */}
        <line x1="115" y1="310" x2="135" y2="330" stroke="#050505" strokeWidth="3" />
        <line x1="110" y1="325" x2="130" y2="345" stroke="#050505" strokeWidth="3" />
        <line x1="105" y1="340" x2="125" y2="360" stroke="#050505" strokeWidth="3" />
        <line x1="150" y1="410" x2="170" y2="430" stroke="#050505" strokeWidth="3" />
        <line x1="145" y1="425" x2="165" y2="445" stroke="#050505" strokeWidth="3" />
      </svg>
    </div>
  );
};
