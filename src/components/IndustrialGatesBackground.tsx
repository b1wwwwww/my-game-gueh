import React from 'react';

export const IndustrialGatesBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#181a1f] select-none">
      {/* Gritty Comic Halftone Texture Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '16px 16px'
        }}
      />

      {/* Industrial Warehouse Concrete Walls and Crossbeams */}
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        <defs>
          {/* Yellow Grunge Texture Pattern */}
          <pattern id="hazardStripe" width="30" height="30" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="30" stroke="#000000" strokeWidth="12" />
          </pattern>
        </defs>

        {/* Back Wall Charcoal Panels */}
        <rect width="1920" height="1080" fill="#222429" />
        <path d="M0 0H1920V240L1400 320L0 280Z" fill="#1b1c20" />
        <path d="M0 820L500 800L1920 860V1080H0Z" fill="#151619" />

        {/* Overhead Gantry Silhouettes */}
        <path d="M200 0V200H320V0" fill="#0f1013" stroke="#000000" strokeWidth="6" />
        <path d="M850 0V160H970V0" fill="#0f1013" stroke="#000000" strokeWidth="6" />
        <path d="M1500 0V220H1640V0" fill="#0f1013" stroke="#000000" strokeWidth="6" />
        <line x1="0" y1="120" x2="1920" y2="120" stroke="#0f1013" strokeWidth="16" />
        <line x1="0" y1="140" x2="1920" y2="140" stroke="#000000" strokeWidth="4" />

        {/* Heavy Industrial Machinery Silhouettes (Right Side) */}
        <g id="right-machinery" className="opacity-90">
          <rect x="1350" y="260" width="380" height="420" rx="8" fill="#151619" stroke="#000" strokeWidth="8" />
          <rect x="1390" y="300" width="130" height="180" rx="6" fill="#facc15" stroke="#000" strokeWidth="8" />
          <rect x="1410" y="320" width="90" height="140" rx="4" fill="#121316" />
          <circle cx="1455" cy="390" r="28" fill="#facc15" stroke="#000" strokeWidth="5" />
          {/* Warning stripes on machinery */}
          <rect x="1560" y="340" width="140" height="35" fill="url(#hazardStripe)" stroke="#000" strokeWidth="4" />
          {/* Pipes & Conduits */}
          <path d="M1730 300H1850V520H1730" stroke="#0a0a0d" strokeWidth="22" strokeLinecap="square" />
          <path d="M1730 300H1850V520H1730" stroke="#33363f" strokeWidth="8" strokeLinecap="square" />
        </g>

        {/* --- CENTER-LOWER INDUSTRIAL YELLOW SECURITY GATES (The Signature Feature) --- */}
        <g id="yellow-security-gates" transform="translate(620, 520)">
          {/* Main Gate Yellow Enclosure Backing */}
          <rect
            x="0"
            y="0"
            width="620"
            height="360"
            rx="6"
            fill="#facc15"
            stroke="#050505"
            strokeWidth="10"
          />

          {/* Heavy Yellow Gate Frames & Segments */}
          {/* Gate 1 */}
          <rect x="18" y="20" width="170" height="315" rx="8" fill="#eab308" stroke="#050505" strokeWidth="8" />
          {/* Inner cutout panel */}
          <rect x="35" y="40" width="136" height="275" fill="#121316" stroke="#050505" strokeWidth="6" />
          {/* Vertical Security Bars Gate 1 */}
          <line x1="58" y1="40" x2="58" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="82" y1="40" x2="82" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="106" y1="40" x2="106" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="130" y1="40" x2="130" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="150" y1="40" x2="150" y2="315" stroke="#facc15" strokeWidth="10" />

          {/* Gate 2 (Center double doors) */}
          <rect x="220" y="20" width="170" height="315" rx="8" fill="#eab308" stroke="#050505" strokeWidth="8" />
          <rect x="237" y="40" width="136" height="275" fill="#121316" stroke="#050505" strokeWidth="6" />
          {/* Vertical Security Bars Gate 2 */}
          <line x1="260" y1="40" x2="260" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="284" y1="40" x2="284" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="308" y1="40" x2="308" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="332" y1="40" x2="332" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="352" y1="40" x2="352" y2="315" stroke="#facc15" strokeWidth="10" />

          {/* Gate 3 */}
          <rect x="425" y="20" width="175" height="315" rx="8" fill="#eab308" stroke="#050505" strokeWidth="8" />
          <rect x="442" y="40" width="141" height="275" fill="#121316" stroke="#050505" strokeWidth="6" />
          {/* Vertical Security Bars Gate 3 */}
          <line x1="465" y1="40" x2="465" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="489" y1="40" x2="489" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="513" y1="40" x2="513" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="537" y1="40" x2="537" y2="315" stroke="#facc15" strokeWidth="10" />
          <line x1="560" y1="40" x2="560" y2="315" stroke="#facc15" strokeWidth="10" />

          {/* Horizontal Reinforcement Plates & Locks */}
          <rect x="18" y="160" width="582" height="22" fill="#050505" />
          <rect x="35" y="164" width="548" height="14" fill="#eab308" />
          <rect x="195" y="145" width="20" height="50" rx="3" fill="#000000" />
          <rect x="400" y="145" width="20" height="50" rx="3" fill="#000000" />
        </g>

        {/* Industrial Floor / Concrete Ground with Grid lines */}
        <path d="M0 880L1920 880V1080H0Z" fill="#111215" stroke="#000" strokeWidth="6" />
        <line x1="0" y1="910" x2="1920" y2="910" stroke="#000000" strokeWidth="6" />
        <line x1="0" y1="960" x2="1920" y2="960" stroke="#000000" strokeWidth="6" />
        {/* Floor perspective hatch lines */}
        <line x1="600" y1="880" x2="500" y2="1080" stroke="#050508" strokeWidth="8" />
        <line x1="850" y1="880" x2="800" y2="1080" stroke="#050508" strokeWidth="8" />
        <line x1="1100" y1="880" x2="1120" y2="1080" stroke="#050508" strokeWidth="8" />
        <line x1="1350" y1="880" x2="1420" y2="1080" stroke="#050508" strokeWidth="8" />

        {/* Subtle Vignette Shadows */}
        <rect width="1920" height="1080" fill="url(#screenVignette)" opacity="0.6" />
      </svg>

      {/* Atmospheric grunge overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
