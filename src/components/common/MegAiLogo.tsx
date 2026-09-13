import React from 'react';

interface MegAiLogoIconProps {
  className?: string;
  size?: number;
}

/**
 * Cybernetic Eye-in-Pyramid Emblem matching the MEG.AI LABS brand identity.
 */
export const MegAiLogoIcon: React.FC<MegAiLogoIconProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="MEG.AI LABS Emblem"
    >
      <defs>
        {/* Chrome metallic gradient for pyramid outer edges */}
        <linearGradient id="chromeSheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="75%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Electric cyan neon gradient */}
        <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Eye Iris Glow */}
        <radialGradient id="irisBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="35%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#082F49" />
        </radialGradient>

        {/* Subtle glow filter */}
        <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Triangle Apex (The "A" frame) */}
      {/* Outer Left Leg */}
      <path
        d="M50 8 L18 82 L29 82 L50 32 L71 82 L82 82 Z"
        fill="url(#chromeSheen)"
      />

      {/* Glowing Cyan Inner Chamfer / Light Ridge */}
      <path
        d="M50 16 L25 76 L32 76 L50 34 L68 76 L75 76 Z"
        fill="none"
        stroke="url(#cyanGlow)"
        strokeWidth="1.8"
        filter="url(#neonBlur)"
      />

      {/* Cybernetic Eye Assembly */}
      {/* Outer Eyelid Ring / Metallic Contour */}
      <path
        d="M26 53 C34 40, 66 40, 74 53 C66 66, 34 66, 26 53 Z"
        fill="#040914"
        stroke="url(#chromeSheen)"
        strokeWidth="2.5"
      />

      {/* Cyan Inner Rim */}
      <path
        d="M29 53 C36 43, 64 43, 71 53 C64 63, 36 63, 29 53 Z"
        fill="none"
        stroke="url(#cyanGlow)"
        strokeWidth="1.2"
      />

      {/* Iris Orb */}
      <circle cx="50" cy="53" r="10" fill="url(#irisBlue)" />

      {/* Iris radial techno spokes */}
      <circle cx="50" cy="53" r="10" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

      {/* Dark Pupil */}
      <circle cx="50" cy="53" r="4.5" fill="#030712" />

      {/* Specular White Glint */}
      <circle cx="48" cy="50.5" r="1.5" fill="#FFFFFF" />
      <circle cx="52.5" cy="54.5" r="0.8" fill="#BAE6FD" />

      {/* Vertical Optic Dropper / Lower Stem */}
      <path
        d="M48 64 L50 78 L52 64 Z"
        fill="url(#chromeSheen)"
        stroke="url(#cyanGlow)"
        strokeWidth="0.8"
      />
    </svg>
  );
};

interface MegAiLogoProps {
  className?: string;
  showSubtitle?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  compact?: boolean;
}

/**
 * Full MEG.AI LABS brand identity logo with icon, chrome wordmark, and tagline.
 */
export const MegAiLogo: React.FC<MegAiLogoProps> = ({
  className = '',
  showSubtitle = true,
  theme = 'auto',
  compact = false,
}) => {
  return (
    <div className={`flex flex-col select-none group ${className}`}>
      {/* Top Main Wordmark Row */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Cybernetic Eye Icon */}
        <div className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-b from-slate-900 via-[#0A101D] to-slate-950 border border-slate-700/60 shadow-[0_0_12px_rgba(56,189,248,0.15)] group-hover:border-cyan-500/50 transition-all">
          <MegAiLogoIcon size={compact ? 24 : 30} />
          {/* Subtle glow dot behind */}
          <span className="absolute inset-0 rounded-xl bg-cyan-500/10 blur-xs pointer-events-none" />
        </div>

        {/* Text Wordmark */}
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight font-sans text-base ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            } ${
              theme === 'dark'
                ? 'text-white'
                : theme === 'light'
                ? 'text-slate-900'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            MEG<span className="text-cyan-500 font-black">.</span>AI
          </span>
          <span className="font-extrabold tracking-wider ml-1 text-xs sm:text-sm font-sans text-slate-500 dark:text-slate-400 uppercase">
            LABS
          </span>
          <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 ml-0.5 align-super font-mono">
            ™
          </span>
        </div>
      </div>

      {/* Subtitle Tagline with Laser Flare Lines */}
      {showSubtitle && !compact && (
        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-[1px] w-5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />
          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold whitespace-nowrap">
            AI Trading Technology & Automation
          </span>
          <div className="h-[1px] w-5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />
        </div>
      )}
    </div>
  );
};

export default MegAiLogo;
