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
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-colors text-slate-900">
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
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="60%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>

                <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>
              </defs>

              {/* Background Track Arc (180 degrees from 15,100 to 185,100 with radius 85) */}
              <path
                d="M 15 100 A 85 85 0 0 1 185 100"
                fill="none"
                stroke="url(#gaugeTrack)"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Active Progress Arc */}
              {percentage > 0 && (
                <path
                  d="M 15 100 A 85 85 0 0 1 185 100"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="267"
                  strokeDashoffset={267 - (267 * percentage) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              )}

              {/* Gauge Tick Marks */}
              <g stroke="#94A3B8" strokeWidth="1.5" opacity="0.9">
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
                    <polygon points="-3,0 0,-78 3,0" fill="#0F172A" />
                    <circle cx="0" cy="-78" r="3" fill="#059669" />
                  </g>
                  {/* Pivot Center */}
                  <circle cx="0" cy="0" r="9" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="3.5" fill="#10B981" />
                </g>
              ) : null}
            </svg>

            {/* If Logged Out: Seal Padlock in the Center */}
            {!isLoggedIn && (
              <div 
                onClick={onSignInClick}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer group"
                title="Click to sign in and unlock progress tracking"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-semibold tracking-tight text-slate-500 mt-1 uppercase max-w-[120px] text-center leading-tight">
                  Sign in to track
                </div>
              </div>
            )}
          </div>

          {/* Lessons Completed Counter */}
          <div className="mt-3 space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {completedCount} <span className="text-slate-400 font-normal text-lg">/ {totalCount}</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Lessons Completed {percentage > 0 ? `(${percentage}%)` : ''}
            </div>
          </div>
        </div>

        {/* Right: Copy & CTA Button (Cols 6-12) */}
        <div className="md:col-span-7 space-y-4 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Curriculum Progress &amp; Milestones
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Track completed lessons, quizzes passed, and algorithmic capstone unlocks. Sign in with your registered account to automatically sync curriculum progress across all trading terminals.
          </p>

          <div className="pt-2">
            {!isLoggedIn ? (
              <button
                onClick={onSignInClick}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Unlock Tracking — Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onContinueClick}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tracking active for {userName || 'Trader'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
