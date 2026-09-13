import React from 'react';

interface CourseBadgeCrestProps {
  levelNumber: number;
  schoolName: string;
  isFree?: boolean;
  hasNewEditionBadge?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CourseBadgeCrest({
  levelNumber,
  schoolName,
  isFree = true,
  hasNewEditionBadge = false,
  className = '',
  size = 'md'
}: CourseBadgeCrestProps) {
  // Dimension settings
  const dimensions = {
    sm: { w: 140, h: 140 },
    md: { w: 200, h: 200 },
    lg: { w: 260, h: 260 }
  }[size];

  const uppercaseName = schoolName.toUpperCase();

  // Color scheme: emerald for free levels (Preschool, Elementary, Middle School),
  // teal/cyan/blue for Masterclass (High School, Undergraduate, etc.)
  const laurelColor = isFree ? '#10B981' : '#06B6D4';
  const laurelGlow = isFree ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.3)';

  // Choose inner shield graphic based on level number
  const renderShieldContent = () => {
    switch (levelNumber) {
      case 1: // Preschool / Kindergarten: 3 Isometric Currency Cubes
        return (
          <g transform="translate(100, 105)">
            {/* Top Cube ($) */}
            <g transform="translate(0, -18)">
              <polygon points="0,-12 12,-5 0,2 -12,-5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <polygon points="-12,-5 0,2 0,16 -12,9" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <polygon points="0,2 12,-5 12,9 0,16" fill="#334155" stroke="#475569" strokeWidth="1" />
              <text x="0" y="8" fill="#10B981" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">$</text>
            </g>
            {/* Bottom Left Cube (¥) */}
            <g transform="translate(-14, 10)">
              <polygon points="0,-10 10,-4 0,2 -10,-4" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <polygon points="-10,-4 0,2 0,14 -10,8" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <polygon points="0,2 10,-4 10,8 0,14" fill="#334155" stroke="#475569" strokeWidth="1" />
              <text x="0" y="7" fill="#38BDF8" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">¥</text>
            </g>
            {/* Bottom Right Cube (€) */}
            <g transform="translate(14, 10)">
              <polygon points="0,-10 10,-4 0,2 -10,-4" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <polygon points="-10,-4 0,2 0,14 -10,8" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <polygon points="0,2 10,-4 10,8 0,14" fill="#334155" stroke="#475569" strokeWidth="1" />
              <text x="0" y="7" fill="#34D399" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">€</text>
            </g>
          </g>
        );

      case 2: // Elementary: Radiating Japanese Candlestick
        return (
          <g transform="translate(100, 102)">
            {/* Radiating background sunburst rays */}
            <g opacity="0.35" stroke="#64748B" strokeWidth="1">
              <line x1="0" y1="-28" x2="0" y2="-18" />
              <line x1="20" y1="-20" x2="13" y2="-13" />
              <line x1="28" y1="0" x2="18" y2="0" />
              <line x1="20" y1="20" x2="13" y2="13" />
              <line x1="0" y1="28" x2="0" y2="18" />
              <line x1="-20" y1="20" x2="-13" y2="13" />
              <line x1="-28" y1="0" x2="-18" y2="0" />
              <line x1="-20" y1="-20" x2="-13" y2="-13" />
            </g>
            {/* Candlestick Upper Wick */}
            <line x1="0" y1="-24" x2="0" y2="-12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            {/* Candlestick Body */}
            <rect x="-7" y="-12" width="14" height="24" rx="2" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
            {/* Candlestick Lower Wick */}
            <line x1="0" y1="12" x2="0" y2="24" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            {/* Inner glow line */}
            <line x1="-3" y1="-8" x2="-3" y2="8" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
          </g>
        );

      case 3: // Middle School: Capital Preservation Vault & Risk Shield
        return (
          <g transform="translate(100, 103)">
            {/* Heavy Shield Vault */}
            <path d="M-18,-16 L18,-16 L18,2 C18,14 0,22 0,22 C0,22 -18,14 -18,2 Z" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
            {/* Padlock loop */}
            <path d="M-7,-4 C-7,-10 7,-10 7,-4" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Padlock body */}
            <rect x="-9" y="-4" width="18" height="14" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            {/* Keyhole */}
            <circle cx="0" cy="1" r="2" fill="#0F172A" />
            <polygon points="-1,1 1,1 1.5,5 -1.5,5" fill="#0F172A" />
          </g>
        );

      case 4: // High School: Institutional Bank Temple Columns
        return (
          <g transform="translate(100, 102)">
            {/* Pediment Roof */}
            <polygon points="0,-22 22,-12 -22,-12" fill="#334155" stroke="#06B6D4" strokeWidth="1.5" />
            <circle cx="0" cy="-15" r="3" fill="#06B6D4" />
            {/* Architrave */}
            <rect x="-22" y="-12" width="44" height="4" fill="#1E293B" stroke="#06B6D4" strokeWidth="1" />
            {/* 4 Classical Columns */}
            <rect x="-18" y="-8" width="6" height="20" rx="1" fill="#0F172A" stroke="#06B6D4" strokeWidth="1" />
            <rect x="-8" y="-8" width="6" height="20" rx="1" fill="#0F172A" stroke="#06B6D4" strokeWidth="1" />
            <rect x="2" y="-8" width="6" height="20" rx="1" fill="#0F172A" stroke="#06B6D4" strokeWidth="1" />
            <rect x="12" y="-8" width="6" height="20" rx="1" fill="#0F172A" stroke="#06B6D4" strokeWidth="1" />
            {/* Base Steps */}
            <rect x="-24" y="12" width="48" height="5" fill="#1E293B" stroke="#06B6D4" strokeWidth="1" />
          </g>
        );

      case 5: // Undergraduate: OOP & Code Brackets
        return (
          <g transform="translate(100, 103)">
            {/* Microchip / Class Box */}
            <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
            <text x="0" y="6" fill="#C4B5FD" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {'{ }'}
            </text>
            {/* Connection nodes */}
            <circle cx="-18" cy="0" r="2" fill="#8B5CF6" />
            <circle cx="18" cy="0" r="2" fill="#8B5CF6" />
            <circle cx="0" cy="-18" r="2" fill="#8B5CF6" />
            <circle cx="0" cy="18" r="2" fill="#8B5CF6" />
          </g>
        );

      case 6: // Graduate: Monte Carlo Bell Curve & Distribution
        return (
          <g transform="translate(100, 104)">
            {/* Baseline */}
            <line x1="-22" y1="14" x2="22" y2="14" stroke="#64748B" strokeWidth="1.5" />
            {/* Gaussian Bell Curve */}
            <path
              d="M-22,14 C-14,14 -10,-18 0,-18 C10,-18 14,14 22,14"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            {/* Shaded Area under curve */}
            <path
              d="M-10,14 C-6,14 -4,-12 0,-18 C4,-12 6,14 10,14 Z"
              fill="rgba(245,158,11,0.25)"
            />
            {/* Peak indicator */}
            <circle cx="0" cy="-18" r="2.5" fill="#F59E0B" />
          </g>
        );

      case 7: // Doctorate: Equinix Server Rack & Fiber Pulses
        return (
          <g transform="translate(100, 103)">
            {/* Server Rack */}
            <rect x="-16" y="-18" width="32" height="10" rx="2" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="-10" cy="-13" r="1.5" fill="#10B981" />
            <circle cx="-5" cy="-13" r="1.5" fill="#3B82F6" />
            <line x1="2" y1="-13" x2="10" y2="-13" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2,2" />

            <rect x="-16" y="-5" width="32" height="10" rx="2" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="-10" cy="0" r="1.5" fill="#10B981" />
            <circle cx="-5" cy="0" r="1.5" fill="#10B981" />
            <line x1="2" y1="0" x2="10" y2="0" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2,2" />

            <rect x="-16" y="8" width="32" height="10" rx="2" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="-10" cy="13" r="1.5" fill="#10B981" />
            <circle cx="-5" cy="13" r="1.5" fill="#EF4444" />
            <line x1="2" y1="13" x2="10" y2="13" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2,2" />
          </g>
        );

      default: // Fellowship: Allocation Trophy
        return (
          <g transform="translate(100, 102)">
            {/* Golden Trophy Cup */}
            <path d="M-12,-16 L12,-16 C12,-4 8,4 0,6 C-8,4 -12,-4 -12,-16 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            {/* Trophy Handles */}
            <path d="M-12,-12 C-18,-12 -18,-2 -10,-2" fill="none" stroke="#D97706" strokeWidth="1.5" />
            <path d="M12,-12 C18,-12 18,-2 10,-2" fill="none" stroke="#D97706" strokeWidth="1.5" />
            {/* Stem & Base */}
            <rect x="-3" y="6" width="6" height="8" fill="#F59E0B" />
            <rect x="-10" y="14" width="20" height="5" rx="1" fill="#B45309" />
            {/* Center Star */}
            <polygon points="0,-12 2,-6 7,-6 3,-2 5,4 0,1 -5,4 -3,-2 -7,-6 -2,-6" fill="#FEF3C7" />
          </g>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Subtle radial glow behind badge */}
          <radialGradient id={`glow-${levelNumber}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={laurelGlow} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Shield Linear Gradients */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Outer Glow */}
        <circle cx="100" cy="100" r="90" fill={`url(#glow-${levelNumber})`} />

        {/* 3 Golden Stars on top */}
        <g id="stars" fill="#F59E0B">
          {/* Left Star */}
          <polygon points="68,26 70,31 75,31 71,34 73,39 68,36 63,39 65,34 61,31 66,31" />
          {/* Center Star (slightly larger) */}
          <polygon points="100,20 102.5,26 108.5,26 103.5,30 105.5,36 100,32.5 94.5,36 96.5,30 91.5,26 97.5,26" />
          {/* Right Star */}
          <polygon points="132,26 134,31 139,31 135,34 137,39 132,36 127,39 129,34 125,31 130,31" />
        </g>

        {/* Top Arc Ribbon: PIPSOLOGY / STRATEGY */}
        <g id="top-ribbon">
          <path
            d="M 65 47 Q 100 40 135 47 L 138 58 Q 100 50 62 58 Z"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1"
          />
          <text
            x="100"
            y="52"
            fill="#94A3B8"
            fontSize="7"
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="2"
          >
            STRATEGY ARCHITECT
          </text>
        </g>

        {/* Left Laurel Wreath (Olive branches) */}
        <g id="left-wreath" fill={laurelColor} stroke={laurelColor} strokeWidth="0.5">
          {/* Branch stem */}
          <path d="M 90 162 C 38 150 34 78 72 58" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx="44" cy="142" rx="7" ry="3.5" transform="rotate(-35 44 142)" />
          <ellipse cx="38" cy="126" rx="7.5" ry="3.5" transform="rotate(-15 38 126)" />
          <ellipse cx="36" cy="108" rx="8" ry="4" transform="rotate(5 36 108)" />
          <ellipse cx="40" cy="90" rx="8" ry="4" transform="rotate(25 40 90)" />
          <ellipse cx="48" cy="74" rx="7.5" ry="3.5" transform="rotate(45 48 74)" />
          <ellipse cx="60" cy="62" rx="7" ry="3.5" transform="rotate(60 60 62)" />
          {/* Inner secondary leaves */}
          <ellipse cx="50" cy="134" rx="6" ry="3" transform="rotate(-10 50 134)" />
          <ellipse cx="48" cy="116" rx="6.5" ry="3" transform="rotate(10 48 116)" />
          <ellipse cx="50" cy="98" rx="6.5" ry="3" transform="rotate(30 50 98)" />
          <ellipse cx="58" cy="82" rx="6" ry="3" transform="rotate(50 58 82)" />
        </g>

        {/* Right Laurel Wreath (Olive branches) */}
        <g id="right-wreath" fill={laurelColor} stroke={laurelColor} strokeWidth="0.5">
          {/* Branch stem */}
          <path d="M 110 162 C 162 150 166 78 128 58" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaves */}
          <ellipse cx="156" cy="142" rx="7" ry="3.5" transform="rotate(35 156 142)" />
          <ellipse cx="162" cy="126" rx="7.5" ry="3.5" transform="rotate(15 162 126)" />
          <ellipse cx="164" cy="108" rx="8" ry="4" transform="rotate(-5 164 108)" />
          <ellipse cx="160" cy="90" rx="8" ry="4" transform="rotate(-25 160 90)" />
          <ellipse cx="152" cy="74" rx="7.5" ry="3.5" transform="rotate(-45 152 74)" />
          <ellipse cx="140" cy="62" rx="7" ry="3.5" transform="rotate(-60 140 62)" />
          {/* Inner secondary leaves */}
          <ellipse cx="150" cy="134" rx="6" ry="3" transform="rotate(10 150 134)" />
          <ellipse cx="152" cy="116" rx="6.5" ry="3" transform="rotate(-10 152 116)" />
          <ellipse cx="150" cy="98" rx="6.5" ry="3" transform="rotate(-30 150 98)" />
          <ellipse cx="142" cy="82" rx="6" ry="3" transform="rotate(-50 142 82)" />
        </g>

        {/* Central Heraldic Shield */}
        <g id="central-shield">
          {/* Outer Shield Rim */}
          <path
            d="M 64 64 L 136 64 C 136 64 138 116 100 142 C 62 116 64 64 64 64 Z"
            fill="url(#shieldGrad)"
            stroke="#475569"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Shield Inset */}
          <path
            d="M 70 70 L 130 70 C 130 70 132 112 100 134 C 68 112 70 70 70 70 Z"
            fill="#090E17"
            stroke={isFree ? '#059669' : '#0891B2'}
            strokeWidth="1.5"
            strokeDasharray={isFree ? 'none' : '4,2'}
          />

          {/* Level Emblem Graphic inside the Shield */}
          {renderShieldContent()}
        </g>

        {/* Bottom Banner Ribbon (Dark charcoal with bold white level name) */}
        <g id="bottom-ribbon">
          {/* Swallowtail Left Wing */}
          <polygon points="34,166 52,154 52,176 34,182 42,174" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          {/* Swallowtail Right Wing */}
          <polygon points="166,166 148,154 148,176 166,182 158,174" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          
          {/* Main Curved Banner Body */}
          <path
            d="M 46 156 L 154 156 L 148 178 L 52 178 Z"
            fill="url(#ribbonGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Level Name Label on Banner */}
          <text
            x="100"
            y="171"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="900"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="1.5"
          >
            {uppercaseName}
          </text>
        </g>

        {/* Optional "NEW EDITION" Circular Seal (as in BabyPips prem.png) */}
        {(hasNewEditionBadge || !isFree) && (
          <g id="new-edition-badge" transform="translate(24, 22)">
            {/* Jagged stamp circle */}
            <circle cx="20" cy="20" r="19" fill="#0891B2" stroke="#67E8F9" strokeWidth="1.5" strokeDasharray="2,2" />
            <circle cx="20" cy="20" r="16" fill="#0E7490" />
            <text x="20" y="14" fill="#E0F2FE" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              ACADEMY
            </text>
            <text x="20" y="21" fill="#FFFFFF" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
              PRO
            </text>
            <text x="20" y="28" fill="#A5F3FC" fontSize="4" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              EDITION
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
