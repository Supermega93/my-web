import React, { useState } from 'react';
import { ActiveView } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { BookOpen, Terminal, Sparkles, LogIn, LogOut, CheckCircle2, User as UserIcon, Download, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { AcademyAuthModal } from './AcademyAuthModal.tsx';
import { MegAiLogoIcon } from '../common/MegAiLogo.tsx';
import { CurrencySelector } from '../common/CurrencySelector.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';

interface AcademyNavProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  activeTab?: 'curriculum' | 'prompt-architect' | 'ebook' | 'pricing';
}

export function AcademyNav({ onNavigate, activeTab }: AcademyNavProps) {
  const { user, logout, isLoggedIn } = useAuth();
  const { formatPrice } = useCurrency();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60 shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Back to Home + Academy Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            title="Return to Main Website Home"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div 
            onClick={() => onNavigate('academy')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-b from-slate-900 via-[#0A101D] to-slate-950 border border-slate-700/70 flex items-center justify-center shadow-md shadow-slate-950/30 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all">
              <MegAiLogoIcon size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-xs sm:text-sm tracking-tight font-sans">
                  MEG<span className="text-cyan-400">.</span>AI LABS
                </span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold tracking-wider">
                  ACADEMY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-full border border-slate-800/70">
          <button
            onClick={() => onNavigate('academy')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'curriculum'
                ? 'text-white bg-slate-800/90 border border-slate-700/80 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Curriculum (Levels 1–8)</span>
          </button>

          <button
            onClick={() => onNavigate('academy-pricing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'pricing'
                ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 shadow-xs font-semibold'
                : 'text-slate-300 hover:text-emerald-300 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Masterclass Pricing</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold uppercase">
              From {formatPrice(159)}
            </span>
          </button>

          <button
            onClick={() => onNavigate('prompt-architect')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'prompt-architect'
                ? 'text-white bg-slate-800/90 border border-cyan-500/30 shadow-xs font-semibold'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Prompt Architect</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono uppercase">
              Free
            </span>
          </button>

          <button
            onClick={() => onNavigate('free-ebook')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free Ebook</span>
          </button>

          <button
            onClick={() => onNavigate('eas')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Terminal className="w-3 h-3 text-slate-500" />
            <span>Trading EAs</span>
          </button>
        </nav>

        {/* Right Auth / Action */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <CurrencySelector variant="dark" />

          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onNavigate('portal')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-800/80 active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <div className="text-xs font-medium text-slate-200 leading-none">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 inline" /> Synced
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-full border-slate-800/80 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 text-xs px-2.5 py-1.5 active:scale-[0.98]"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-850 border border-slate-750 text-white font-medium text-xs transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:border-slate-600 active:scale-[0.98] cursor-pointer"
                title="Sign in to track progress"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AcademyAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
}
