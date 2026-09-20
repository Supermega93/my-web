import React from 'react';

interface MegAiLogoIconProps {
  className?: string;
  size?: number;
}

/**
 * Cybernetic Eye-in-Pyramid Emblem matching the MEG.AI LABS brand identity
 * based on the official high-resolution metallic sci-fi insignia.
 */
export const MegAiLogoIcon: React.FC<MegAiLogoIconProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="MEG.AI LABS Emblem"
    >
      <defs>
        {/* Background Cosmic Deep Space Radial Gradient */}
        <radialGradient id="megSpaceBg" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="#0A1C36" />
          <stop offset="40%" stopColor="#050E1E" />
          <stop offset="75%" stopColor="#020610" />
          <stop offset="100%" stopColor="#010308" />
        </radialGradient>

        {/* Chrome Metallic Linear Sheen */}
        <linearGradient id="megChromeMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#E2E8F0" />
          <stop offset="35%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="65%" stopColor="#CBD5E1" />
          <stop offset="85%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Chrome Bevel Highlight Edge */}
        <linearGradient id="megChromeLightEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#CBD5E1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>

        {/* Pyramid Left Leg Sheen */}
        <linearGradient id="megPyrLeftFacet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E2E8F0" />
          <stop offset="60%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Pyramid Right Leg Shadow Facet */}
        <linearGradient id="megPyrRightFacet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="30%" stopColor="#64748B" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Electric Cyan Neon Gradient */}
        <linearGradient id="megElectricCyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="30%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#00D2FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Eye Iris Radial Glow */}
        <radialGradient id="megIrisGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="25%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#00D2FF" />
          <stop offset="80%" stopColor="#0284C7" />
          <stop offset="95%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#082F49" />
        </radialGradient>

        {/* Glowing Blue Orb (The Dot) */}
        <radialGradient id="megBlueOrb" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="20%" stopColor="#BAE6FD" />
          <stop offset="45%" stopColor="#38BDF8" />
          <stop offset="75%" stopColor="#00A6FB" />
          <stop offset="95%" stopColor="#006494" />
          <stop offset="100%" stopColor="#003554" />
        </radialGradient>

        {/* Glow Filters */}
        <filter id="megNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="megSoftCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="megOrbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Background Circular Disk */}
      <circle cx="250" cy="250" r="246" fill="url(#megSpaceBg)" />
      <circle cx="250" cy="250" r="246" stroke="#0F2B48" strokeWidth="1.5" opacity="0.8" />

      {/* 2. Outer Planetary Orbit Rings */}
      <path d="M 110 95 A 220 220 0 0 1 390 95" fill="none" stroke="#38BDF8" strokeWidth="1.2" opacity="0.6" />
      <path d="M 60 180 A 225 225 0 0 1 440 180" fill="none" stroke="#7DD3FC" strokeWidth="1.6" opacity="0.8" />

      {/* Bottom Electric Cyan Arc */}
      <path d="M 82 320 A 228 228 0 0 0 418 320" fill="none" stroke="#00E5FF" strokeWidth="2.6" opacity="0.85" filter="url(#megSoftCyanGlow)" />
      <path d="M 82 320 A 228 228 0 0 0 418 320" fill="none" stroke="#E0F2FE" strokeWidth="1.2" opacity="0.95" />

      {/* 3. TOP WORDMARK: MEG. */}
      <g id="meg-top-wordmark">
        {/* Letter M */}
        <path d="M 44 206 L 44 130 L 76 130 L 102 174 L 128 130 L 160 130 L 160 206 L 136 206 L 136 158 L 112 198 L 92 198 L 68 158 L 68 206 Z" fill="#0F172A" transform="translate(1, 2)" />
        <path d="M 44 205 L 44 130 L 76 130 L 102 174 L 128 130 L 160 130 L 160 205 L 136 205 L 136 158 L 112 198 L 92 198 L 68 158 L 68 205 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <path d="M 44 130 L 56 130 L 56 205 L 44 205 Z" fill="url(#megChromeLightEdge)" opacity="0.7" />
        <polygon points="76,130 102,174 96,174 68,130" fill="#FFFFFF" opacity="0.45" />
        <polygon points="102,174 128,130 122,130 96,174" fill="#334155" opacity="0.6" />
        <polygon points="92,198 102,174 112,198" fill="#1E293B" opacity="0.5" />

        {/* Letter E */}
        <path d="M 174 206 L 174 130 L 254 130 L 254 150 L 200 150 L 200 160 L 244 160 L 244 178 L 200 178 L 200 186 L 254 186 L 254 206 Z" fill="#0F172A" transform="translate(1, 2)" />
        <path d="M 174 205 L 174 130 L 254 130 L 254 149 L 198 149 L 198 159 L 244 159 L 244 177 L 198 177 L 198 186 L 254 186 L 254 205 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <path d="M 174 130 L 184 130 L 184 205 L 174 205 Z" fill="url(#megChromeLightEdge)" opacity="0.8" />
        <path d="M 174 130 L 254 130 L 254 136 L 184 136 L 184 149 L 174 149 Z" fill="#FFFFFF" opacity="0.5" />

        {/* Letter G */}
        <path d="M 346 148 L 346 130 L 272 130 L 272 206 L 350 206 L 350 162 L 312 162 L 312 178 L 328 178 L 328 188 L 294 188 L 294 148 Z" fill="#0F172A" transform="translate(1, 2)" />
        <path d="M 346 148 L 346 130 L 272 130 L 272 205 L 350 205 L 350 162 L 312 162 L 312 178 L 328 178 L 328 188 L 294 188 L 294 148 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <path d="M 272 130 L 346 130 L 346 136 L 282 136 L 282 205 L 272 205 Z" fill="#FFFFFF" opacity="0.6" />
        <path d="M 328 178 L 350 178 L 350 205 L 344 205 L 344 184 L 328 184 Z" fill="url(#megChromeLightEdge)" opacity="0.75" />

        {/* The Dot / Period "." (Glowing Blue 3D Spherical Orb) */}
        <g id="meg-glowing-dot" filter="url(#megOrbGlow)">
          <circle cx="370" cy="190" r="17" fill="#00D2FF" opacity="0.35" filter="url(#megNeonGlow)" />
          <circle cx="370" cy="190" r="14" fill="url(#megBlueOrb)" stroke="#BAE6FD" strokeWidth="0.8" />
          <ellipse cx="365" cy="185" rx="4.5" ry="3.2" transform="rotate(-30 365 185)" fill="#FFFFFF" opacity="0.9" />
          <circle cx="374" cy="194" r="1.5" fill="#E0F2FE" opacity="0.8" />
        </g>
      </g>

      {/* 4. CENTER PYRAMID / DELTA ("A" OF "AI") */}
      <g id="meg-center-pyramid">
        {/* Blue Ambient Backlight */}
        <polygon points="250,174 156,328 344,328" fill="#0284C7" opacity="0.25" filter="url(#megSoftCyanGlow)" />
        <line x1="250" y1="184" x2="164" y2="324" stroke="#00E5FF" strokeWidth="2.5" opacity="0.9" filter="url(#megNeonGlow)" />
        <line x1="250" y1="184" x2="336" y2="324" stroke="#00E5FF" strokeWidth="2.5" opacity="0.9" filter="url(#megNeonGlow)" />

        {/* Pyramid Outer Drop Shadow */}
        <polygon points="250,172 126,330 374,330" fill="#050B14" opacity="0.8" transform="translate(0, 3)" />

        {/* Left Structural Leg */}
        <polygon points="250,172 250,198 164,328 126,328" fill="url(#megPyrLeftFacet)" stroke="#F1F5F9" strokeWidth="1.2" />
        <polygon points="250,172 238,188 138,328 126,328" fill="#FFFFFF" opacity="0.65" />
        <line x1="250" y1="172" x2="145" y2="328" stroke="#FFFFFF" strokeWidth="1.4" opacity="0.9" />

        {/* Right Structural Leg */}
        <polygon points="250,172 374,328 336,328 250,198" fill="url(#megPyrRightFacet)" stroke="#CBD5E1" strokeWidth="1.2" />
        <polygon points="250,172 374,328 360,328 250,188" fill="#1E293B" opacity="0.6" />
        <line x1="336" y1="328" x2="374" y2="328" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />

        {/* Apex Cap */}
        <polygon points="250,172 242,185 258,185" fill="#FFFFFF" opacity="0.95" />
      </g>

      {/* 5. CYBERNETIC EYE & "I" COLUMN */}
      <g id="meg-eye-assembly">
        {/* Eye Almond Contour */}
        <path d="M 202 238 C 220 214, 280 214, 298 238 C 280 262, 220 262, 202 238 Z" fill="#040916" stroke="url(#megChromeMain)" strokeWidth="2.5" />
        <path d="M 200 238 C 220 212, 280 212, 300 238" fill="none" stroke="#F8FAFC" strokeWidth="2" />
        <path d="M 202 238 C 220 264, 280 264, 298 238" fill="none" stroke="#00D2FF" strokeWidth="1.2" opacity="0.8" filter="url(#megNeonGlow)" />

        {/* Iris */}
        <circle cx="250" cy="238" r="21" fill="url(#megIrisGlow)" stroke="#38BDF8" strokeWidth="1" />

        {/* Radial Striations */}
        <g stroke="#BAE6FD" strokeWidth="0.8" opacity="0.65">
          <line x1="250" y1="218" x2="250" y2="228" />
          <line x1="250" y1="248" x2="250" y2="258" />
          <line x1="230" y1="238" x2="240" y2="238" />
          <line x1="260" y1="238" x2="270" y2="238" />
          <line x1="236" y1="224" x2="243" y2="231" />
          <line x1="257" y1="245" x2="264" y2="252" />
          <line x1="264" y1="224" x2="257" y2="231" />
          <line x1="243" y1="245" x2="236" y2="252" />
          <line x1="232" y1="231" x2="241" y2="234" />
          <line x1="259" y1="242" x2="268" y2="245" />
          <line x1="268" y1="231" x2="259" y2="234" />
          <line x1="241" y1="242" x2="232" y2="245" />
        </g>

        {/* Pupil */}
        <circle cx="250" cy="238" r="9" fill="#02060E" />

        {/* Specular White Glints */}
        <ellipse cx="245" cy="233" rx="4.2" ry="2.8" transform="rotate(-30 245 233)" fill="#FFFFFF" opacity="0.95" />
        <circle cx="255.5" cy="242.5" r="1.5" fill="#E0F2FE" opacity="0.85" />

        {/* THE "I" COLUMN */}
        <rect x="231" y="258" width="38" height="5" rx="1.5" fill="#00D2FF" filter="url(#megNeonGlow)" />
        <rect x="232" y="259" width="36" height="3" rx="1" fill="#E0F2FE" />
        <rect x="242" y="263" width="16" height="58" rx="2" fill="url(#megElectricCyan)" filter="url(#megNeonGlow)" />
        <rect x="244" y="263" width="12" height="58" rx="1" fill="#BAE6FD" opacity="0.8" />
        <rect x="228" y="321" width="44" height="6" rx="1.5" fill="#00D2FF" filter="url(#megNeonGlow)" />
        <rect x="230" y="322" width="40" height="4" rx="1" fill="#FFFFFF" />

        {/* Lateral Blue Light Rays */}
        <polygon points="228,324 164,328 174,328 228,326" fill="#00D2FF" opacity="0.4" filter="url(#megNeonGlow)" />
        <polygon points="272,324 336,328 326,328 272,326" fill="#00D2FF" opacity="0.4" filter="url(#megNeonGlow)" />
      </g>

      {/* 6. BOTTOM WORDMARK: L A B S */}
      <g id="meg-wordmark-labs">
        {/* Letter L */}
        <path d="M 126 348 L 126 374 L 158 374 L 158 363 L 139 363 L 139 348 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <path d="M 126 348 L 132 348 L 132 374 L 126 374 Z" fill="#FFFFFF" opacity="0.75" />

        {/* Letter A */}
        <path d="M 194 374 L 204 348 L 222 348 L 232 374 L 219 374 L 216 366 L 210 366 L 207 374 Z M 213 356 L 211 361 L 215 361 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <polygon points="204,348 213,348 222,374 216,374" fill="#FFFFFF" opacity="0.5" />

        {/* Letter B */}
        <path d="M 268 348 L 294 348 C 302 348 306 351 306 355 C 306 358 303 360 300 361 C 304 362 307 365 307 369 C 307 373 303 374 295 374 L 268 374 Z M 280 355 L 292 355 C 295 355 296 354 296 353 C 296 352 295 351 292 351 L 280 351 Z M 280 371 L 293 371 C 296 371 297 370 297 369 C 297 367 296 366 293 366 L 280 366 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <path d="M 268 348 L 275 348 L 275 374 L 268 374 Z" fill="#FFFFFF" opacity="0.75" />

        {/* Letter S */}
        <path d="M 342 368 C 344 372 348 374 355 374 C 363 374 368 371 368 366 C 368 362 365 360 356 359 C 347 358 343 356 343 352 C 343 347 348 348 355 348 C 361 348 366 350 368 354 L 358 357 C 357 355 355 354 352 354 C 348 354 346 355 346 357 C 346 359 348 360 354 361 C 364 362 368 364 368 369 C 368 374 363 377 354 377 C 345 377 340 373 338 367 Z" fill="url(#megChromeMain)" stroke="#CBD5E1" strokeWidth="1.2" />
        <path d="M 342 368 L 348 368 C 349 371 352 374 356 374 L 356 377 C 347 377 343 373 342 368 Z" fill="#FFFFFF" opacity="0.7" />
      </g>

      {/* 7. Fine Glints & Outer Flare */}
      <circle cx="250" cy="250" r="236" fill="none" stroke="#1E3A8A" strokeWidth="1" opacity="0.4" />
      <circle cx="250" cy="172" r="3" fill="#FFFFFF" filter="url(#megNeonGlow)" />
      <circle cx="250" cy="25" r="2" fill="#E0F2FE" opacity="0.8" />
      <circle cx="250" cy="478" r="3" fill="#00E5FF" filter="url(#megNeonGlow)" opacity="0.9" />
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
