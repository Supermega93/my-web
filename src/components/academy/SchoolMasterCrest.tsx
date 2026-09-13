import React from 'react';

interface SchoolMasterCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SchoolMasterCrest({ className = '', size = 'md' }: SchoolMasterCrestProps) {
  const dimensions = {
    sm: { w: 160, h: 160 },
    md: { w: 220, h: 220 },
    lg: { w: 280, h: 280 }
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_25px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-105"
      >
        {/* Definitions */}
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="60%" stopColor="#0B1329" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          <linearGradient id="emeraldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="laurelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <path id="topRibbonArc" d="M 40,48 Q 120,24 200,48" />
          <path id="bottomRibbonArc" d="M 28,198 Q 120,226 212,198" />
        </defs>

        {/* 3 Green Stars at the very top */}
        <g id="top-stars" fill="#10B981">
          {/* Center Star */}
          <polygon points="120,12 122.5,18 129,18 124,22 126,28 120,24 114,28 116,22 111,18 117.5,18" />
          {/* Left Star */}
          <polygon points="102,16 104,21 109.5,21 105,24.5 107,30 102,26.5 97,30 99,24.5 94.5,21 100,21" />
          {/* Right Star */}
          <polygon points="138,16 140,21 145.5,21 141,24.5 143,30 138,26.5 133,30 135,24.5 130.5,21 136,21" />
        </g>

        {/* Outer Laurel Wreath (Left & Right) */}
        <g id="laurel-wreath" fill="url(#laurelGrad)" opacity="0.95">
          {/* Left Laurel Leaves */}
          <path d="M 42,65 C 32,75 36,88 44,92 C 34,98 38,112 48,116 C 36,124 42,140 54,146 C 44,154 52,170 66,176 C 58,182 70,196 86,198 C 84,192 74,182 78,172 C 68,166 64,152 70,142 C 60,134 58,120 66,110 C 58,102 54,88 64,80 C 54,72 50,60 58,52 Z" />
          {/* Right Laurel Leaves */}
          <path d="M 198,65 C 208,75 204,88 196,92 C 206,98 202,112 192,116 C 204,124 198,140 186,146 C 196,154 188,170 174,176 C 182,182 170,196 154,198 C 156,192 166,182 162,172 C 172,166 176,152 170,142 C 180,134 182,120 174,110 C 182,102 186,88 176,80 C 186,72 190,60 182,52 Z" />
        </g>

        {/* Heraldic Shield Body */}
        <path
          d="M 64,52 L 176,52 C 176,52 178,126 120,172 C 62,126 64,52 64,52 Z"
          fill="url(#shieldGrad)"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shield Border */}
        <path
          d="M 72,60 L 168,60 C 168,60 170,120 120,160 C 70,120 72,60 72,60 Z"
          fill="none"
          stroke="#34D399"
          strokeWidth="1.2"
          opacity="0.6"
          strokeDasharray="3 2"
        />

        {/* Inner Shield Graphics: Candlestick + Algorithm Core */}
        <g id="shield-inner-art" transform="translate(120, 102)">
          {/* Radiating sunburst lines */}
          <g stroke="#334155" strokeWidth="1" opacity="0.7">
            <line x1="0" y1="-36" x2="0" y2="-24" />
            <line x1="26" y1="-26" x2="18" y2="-18" />
            <line x1="36" y1="0" x2="24" y2="0" />
            <line x1="26" y1="26" x2="18" y2="18" />
            <line x1="-26" y1="-26" x2="-18" y2="-18" />
            <line x1="-36" y1="0" x2="-24" y2="0" />
            <line x1="-26" y1="26" x2="-18" y2="18" />
          </g>

          {/* Institutional Candlestick */}
          <line x1="0" y1="-30" x2="0" y2="30" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          <rect x="-8" y="-16" width="16" height="32" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
          
          {/* Micro Code / EA icon overlay */}
          <path d="M -4,-4 L -1,0 L -4,4" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 4,-4 L 1,0 L 4,4" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Top Banner Ribbon */}
        <g id="top-ribbon">
          <path
            d="M 44,48 Q 120,26 196,48 L 190,62 Q 120,40 50,62 Z"
            fill="#064E3B"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          <text fill="#FFFFFF" fontSize="9" fontWeight="900" letterSpacing="1.8" textAnchor="middle">
            <textPath href="#topRibbonArc" startOffset="50%">
              STRATEGY ARCHITECT
            </textPath>
          </text>
        </g>

        {/* Bottom Banner Ribbon */}
        <g id="bottom-ribbon">
          <path
            d="M 24,196 Q 120,228 216,196 L 210,214 Q 120,244 30,214 Z"
            fill="#047857"
            stroke="#34D399"
            strokeWidth="1.5"
          />
          <text fill="#FFFFFF" fontSize="9" fontWeight="900" letterSpacing="1.2" textAnchor="middle">
            <textPath href="#bottomRibbonArc" startOffset="50%">
              SCHOOL OF STRATEGY ARCHITECT
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
