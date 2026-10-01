import React, { useState, useEffect } from 'react';
import { ActiveView } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { BookOpen, Terminal, Sparkles, LogIn, LogOut, CheckCircle2, User as UserIcon, Download, Home, ArrowLeft, Search, Command } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { AcademyAuthModal } from './AcademyAuthModal.tsx';
import { MegAiLogoIcon } from '../common/MegAiLogo.tsx';
import { CurrencySelector } from '../common/CurrencySelector.tsx';
import { useCurrency } from '../../context/CurrencyContext.tsx';
import { GlobalSearchModal } from '../common/GlobalSearchModal.tsx';
import { 
  getActiveStudentTier, 
  getStoredCompletedLessonIds, 
  isPracticalExerciseUnlocked, 
  subscribeToTierChanges,
  StudentTier
} from '../../services/academyAccess.ts';

export interface AcademyNavProps {
  onNavigate: (view: ActiveView, extraId?: string) => void;
  activeTab?: 'curriculum' | 'prompt-architect' | 'ebook' | 'pricing';
  currentLevel?: number;
}

export function AcademyNav({ onNavigate, activeTab, currentLevel }: AcademyNavProps) {
  const { user, logout, isLoggedIn } = useAuth();
  const { formatPrice } = useCurrency();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => getStoredCompletedLessonIds());
  const [studentTier, setStudentTier] = useState<StudentTier>(() => 
    getActiveStudentTier(user, user?.role === 'admin' || user?.role === 'developer')
  );

  useEffect(() => {
    setStudentTier(getActiveStudentTier(user, user?.role === 'admin' || user?.role === 'developer'));
    const unsubscribe = subscribeToTierChanges((newTier) => {
      setStudentTier(newTier);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const handleProgressChange = () => {
      setCompletedLessonIds(getStoredCompletedLessonIds());
    };
    window.addEventListener('academy-progress-change', handleProgressChange);
    window.addEventListener('storage', handleProgressChange);
    return () => {
      window.removeEventListener('academy-progress-change', handleProgressChange);
      window.removeEventListener('storage', handleProgressChange);
    };
  }, []);

  // Determine if viewing Level 1 (Preschool)
  const isLevel1 = currentLevel === 1 || (typeof window !== 'undefined' && (
    window.location.pathname.includes('/level/1') ||
    window.location.pathname.includes('/lesson/lesson-1-')
  ));

  // Determine if free tier (Levels 1-3) is completed
  const isFreeTierDone = isPracticalExerciseUnlocked(
    completedLessonIds,
    studentTier,
    user?.role === 'admin' || user?.role === 'developer'
  );

  // The button should be removed from Level 1, and only seen after completing the free tier (or when on paid levels/tier or pricing page)
  const isHigherPaidLevel = currentLevel !== undefined && currentLevel > 3;
  const showPricingButton = !isLevel1 && (activeTab === 'pricing' || studentTier !== 'free' || isFreeTierDone || isHigherPaidLevel);

  // Global keyboard shortcut: Cmd+K or Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#1A2234] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Back to Home + Academy Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141B28] hover:bg-[#1A2334] border border-[#222E42] text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            title="Return to Main Website Home"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div 
            onClick={() => onNavigate('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('home');
              }
            }}
            title="Return to Home"
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141B28] border border-[#222E42] flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
              <MegAiLogoIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm tracking-tight">
                  MEGA AI LABS
                </span>
                <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
                  Academy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101623] p-1 rounded-lg border border-[#1A2234]">
          <button
            onClick={() => onNavigate('academy')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'curriculum'
                ? 'text-white bg-[#1A2334] border border-[#243148] shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Curriculum</span>
          </button>

          {showPricingButton && (
            <button
              onClick={() => onNavigate('academy-pricing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'pricing'
                  ? 'text-white bg-[#1A2334] border border-[#243148] shadow-xs'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Masterclass</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-mono">
                {formatPrice(99)}
              </span>
            </button>
          )}

          <button
            onClick={() => onNavigate('prompt-architect')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'prompt-architect'
                ? 'text-white bg-[#1A2334] border border-[#243148] shadow-xs'
                : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Prompt Architect</span>
          </button>

          <button
            onClick={() => onNavigate('free-ebook')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free Ebook</span>
          </button>

          <button
            onClick={() => onNavigate('eas')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Trading EAs</span>
          </button>
        </nav>

        {/* Right Auth / Action */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Academy Global Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141B28] hover:bg-[#1A2334] border border-[#222E42] text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            title="Search curriculum, EAs & docs (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <span className="hidden md:inline">Search</span>
            <span className="hidden md:inline text-[10px] font-mono px-1 py-0.2 rounded bg-[#0B0E14] text-slate-400 border border-[#222E42]">
              ⌘K
            </span>
          </button>

          <CurrencySelector variant="compact" />

          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onNavigate('portal')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141B28] border border-[#222E42] hover:border-slate-600 cursor-pointer transition-colors active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
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

              <button
                onClick={logout}
                className="rounded-lg border border-[#222E42] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 text-xs p-2 transition-colors active:scale-[0.98] cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-xs hover:shadow-sm active:scale-[0.98] cursor-pointer"
                title="Sign in to track progress"
              >
                <LogIn className="w-3.5 h-3.5" />
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

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
}
