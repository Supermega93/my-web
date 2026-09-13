import React from 'react';
import { Lock, CheckCircle2, ArrowRight, Sparkles, User, LogIn } from 'lucide-react';

interface SpeedometerProgressCardProps {
  isLoggedIn: boolean;
  completedCount: number;
  totalCount: number;
  userName?: string;
  onSignInClick: () => void;
  onContinueClick?: () => void;
}

export function SpeedometerProgressCard({
  isLoggedIn,
  completedCount,
  totalCount,
  userName,
  onSignInClick,
  onContinueClick
}: SpeedometerProgressCardProps) {
  const percentage = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

  // Needle angle for 180 degree semi-circle:
  // 0% => -90 deg (pointing west / left)
  // 50% => 0 deg (pointing north / up)
  // 100% => +90 deg (pointing east / right)
  const needleRotation = -90 + (percentage / 100) * 180;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-6 sm:p-10 transition-all hover:border-slate-700/80">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left: Speedometer / Tachometer Gauge (Cols 1-5) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-56 h-32 sm:w-64 sm:h-36 flex items-end justify-center overflow-hidden">
            {/* Semicircular SVG Gauge Arc */}
            <svg
              viewBox="0 0 200 110"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="60%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>

                <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>

              {/* Background Track Arc (180 degrees from 15,100 to 185,100 with radius 85) */}
              <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="url(#gaugeTrack)"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Active Progress Arc */}
              {percentage > 0 && (
                <path
                  d="M 15 100 A 85 85 0 0 1 185 100"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="267"
                  strokeDashoffset={267 - (267 * percentage) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              )}

              {/* Gauge Tick Marks */}
              <g stroke="#64748B" strokeWidth="1.5" opacity="0.6">
                <line x1="22" y1="100" x2="30" y2="100" />
                <line x1="32" y1="65" x2="39" y2="70" />
                <line x1="60" y1="36" x2="65" y2="43" />
                <line x1="100" y1="20" x2="100" y2="28" />
                <line x1="140" y1="36" x2="135" y2="43" />
                <line x1="168" y1="65" x2="161" y2="70" />
                <line x1="178" y1="100" x2="170" y2="100" />
              </g>

              {/* Logged-in Needle */}
              {isLoggedIn ? (
                <g transform="translate(100, 100)">
                  <g transform={`rotate(${needleRotation})`} className="transition-transform duration-700 ease-out">
                    <polygon points="-3,0 0,-78 3,0" fill="#F8FAFC" />
                    <circle cx="0" cy="-78" r="3" fill="#10B981" />
                  </g>
                  {/* Pivot Center */}
                  <circle cx="0" cy="0" r="10" fill="#0F172A" stroke="#10B981" strokeWidth="3" />
                  <circle cx="0" cy="0" r="4" fill="#34D399" />
                </g>
              ) : null}
            </svg>

            {/* If Logged Out: Blue Seal Padlock in the Center (matching BabyPips n.png) */}
            {!isLoggedIn && (
              <div 
                onClick={onSignInClick}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer group"
                title="Click to sign in and unlock progress tracking"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Lock className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div className="text-[9px] font-mono font-bold tracking-tight text-sky-400 mt-1 uppercase max-w-[120px] text-center leading-tight">
                  Sign in to unlock progress tracking
                </div>
              </div>
            )}
          </div>

          {/* Lessons Completed Counter (matching n.png) */}
          <div className="mt-3 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {completedCount} of {totalCount}
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-[11px] font-mono tracking-wide">
              Lessons Completed {percentage > 0 ? `(${percentage}%)` : ''}
            </div>
          </div>
        </div>

        {/* Right: Copy & CTA Button (Cols 6-12, matching BabyPips n.png) */}
        <div className="md:col-span-7 space-y-4 text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Track Your Progress!
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Wish there was a way to keep track of lessons you've completed? <span className="text-emerald-400 italic font-semibold">Wish granted!</span> Just sign in to unlock this feature and we'll display helpful markers &amp; meters along the way showing just how much you've accomplished!
          </p>

          <div className="pt-2">
            {!isLoggedIn ? (
              <button
                onClick={onSignInClick}
                className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:scale-[1.02] flex items-center gap-2.5 cursor-pointer"
              >
                <span>Unlock Tracking, Sign In</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onContinueClick}
                  className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tracking Active for {userName || 'Trader'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
