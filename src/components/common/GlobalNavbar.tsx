import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView, Lesson, Product } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  ArrowRight,
  Search,
  Command,
  ArrowUpRight
} from 'lucide-react';
import { MegAiLogoIcon } from './MegAiLogo.tsx';
import { CurrencySelector } from './CurrencySelector.tsx';
import { GlobalSearchModal } from './GlobalSearchModal.tsx';
import { PrimaryButton } from './PrimaryButton.tsx';

export interface GlobalNavbarProps {
  currentView?: ActiveView;
  activeView?: ActiveView;
  onNavigate: (view: ActiveView, productId?: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onTriggerBuildMyEa?: () => void;
  products?: Product[];
  lessons?: Lesson[];
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentView,
  activeView,
  onNavigate,
  onOpenAuth,
  onTriggerBuildMyEa,
  products,
  lessons,
}) => {
  const current = currentView || activeView || 'home';
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut: Cmd+K or Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: Array<{ label: string; view: ActiveView; badge?: string; productId?: string }> = [
    { label: 'Home', view: 'home' },
    { label: 'Academy', view: 'academy', badge: 'Free' },
    { label: 'Books', view: 'ebooks' },
    { label: 'Free Tools', view: 'prompt-architect' },
    { label: 'Custom EA', view: 'custom-ea' },
    { label: 'Liquidity Pro EA', view: 'ea-detail', productId: 'prod_ea_adaptive_liquidity' },
    { label: 'About', view: 'about' },
  ];

  const handleNavClick = (item: { label: string; view: ActiveView; productId?: string }) => {
    onNavigate(item.view, item.productId);
    setMobileMenuOpen(false);
  };

  const isItemActive = (item: { label: string; view: ActiveView; productId?: string }) => {
    if (item.view === 'home' && current === 'home') return true;
    if (item.view === 'ea-detail' && (current === 'ea-detail' || current === 'eas')) return true;
    if (item.view === 'eas' && (current === 'eas' || current === 'ea-detail')) return true;
    if (item.view === 'academy' && (current === 'academy' || current === 'level-hub' || current === 'lesson-detail' || current === 'academy-pricing')) return true;
    if (item.view === 'ebooks' && (current === 'ebooks' || current === 'ebook-detail' || current === 'free-ebook' || current === 'ai-prompt-handbook')) return true;
    if (item.view === 'prompt-architect' && current === 'prompt-architect') return true;
    if (item.view === 'custom-ea' && (current === 'custom-ea' || current === 'strategy-builder-coming-soon')) return true;
    if (item.view === 'about' && (current === 'about' || current === 'how-it-works')) return true;
    return current === item.view;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300">
      <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'pt-2.5 sm:pt-3' : 'pt-4 sm:pt-5'
      }`}>
        {/* Floating Pill Container with Futuristic Purple/Magenta Glass Aesthetics */}
        <div className="pointer-events-auto mx-auto max-w-6xl rounded-full bg-[#0c051a]/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.12)] px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo with Purple/Magenta Accent */}
          <div 
            onClick={() => handleNavClick({ label: 'Home', view: 'home' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#1b0a33] via-[#2a1147] to-[#4c1d95] border border-purple-500/40 text-white flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_22px_rgba(217,70,239,0.5)] transition-all group-hover:scale-105">
              <MegAiLogoIcon size={20} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="font-black text-sm sm:text-base tracking-tight text-white font-sans leading-none">
                  MEG<span className="text-fuchsia-400 font-black">.</span>AI
                </span>
                <span className="font-extrabold text-[11px] sm:text-xs tracking-wider ml-1 text-purple-200/80 uppercase">
                  LABS
                </span>
              </div>
              <span className="text-[8px] font-mono tracking-widest uppercase mt-0.5 text-purple-300/60 font-medium leading-none hidden xs:inline">
                AI Trading Technology
              </span>
            </div>
          </div>

          {/* Center Navigation Menu Items - Futuristic Floating Pill Style */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs tracking-tight transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                    active
                      ? 'bg-white text-zinc-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.08] font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold leading-none ${
                      active 
                        ? 'bg-purple-950 text-purple-200' 
                        : 'bg-purple-500/25 text-purple-200 border border-purple-400/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Search, Currency, Login/Portal, and Primary CTA Button */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Quick Global Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400/30 text-zinc-300 hover:text-white transition-all cursor-pointer text-xs select-none shadow-sm active:scale-[0.98]"
              title="Search EAs, lessons, docs, and prompts (Ctrl/Cmd + K)"
            >
              <Search className="w-3.5 h-3.5 text-purple-300 group-hover:text-white transition-colors" />
              <span className="hidden xl:inline text-xs font-medium text-zinc-300 group-hover:text-white">
                Search
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/10 text-purple-200">
                <Command className="w-2.5 h-2.5 inline" />K
              </span>
            </button>

            <CurrencySelector />

            {/* Login or Account Portal */}
            {!user ? (
              <button
                onClick={() => (onOpenAuth ? onOpenAuth('login') : onNavigate('login'))}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
              >
                <UserIcon className="w-3.5 h-3.5 opacity-70" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('portal')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    current === 'portal'
                      ? 'bg-white text-zinc-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                      : 'bg-white/[0.06] border border-white/10 text-zinc-200 hover:text-white font-medium hover:bg-white/[0.12]'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 opacity-70" />
                  <span>Portal</span>
                  {isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/25 text-purple-200 uppercase font-bold border border-purple-400/30">
                      Admin
                    </span>
                  )}
                </button>

                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded-full hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Reference Primary Button: White Pill Button with Dark Text and Glow */}
            <button
              onClick={() => onNavigate('academy')}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:shadow-[0_0_35px_rgba(255,255,255,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full bg-white/[0.06] border border-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <CurrencySelector variant="compact" />

            <button
              onClick={() => onNavigate('academy')}
              className="px-3 py-1.5 rounded-full bg-white text-zinc-950 font-bold text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-[0.98]"
            >
              <span>Start</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/[0.06] border border-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Matching Sleek Violet Glass Design */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto mt-2.5 max-w-6xl mx-auto rounded-3xl bg-[#0e061f]/95 backdrop-blur-2xl border border-purple-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(168,85,247,0.15)] p-4 sm:p-5 space-y-3.5 text-zinc-200"
            >
              {/* Mobile Search Bar inside dropdown */}
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-purple-400/30 cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center gap-2 text-zinc-300">
                  <Search className="w-3.5 h-3.5 text-purple-300" />
                  <span>Search EAs, lessons, docs...</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                  Ctrl+K
                </span>
              </div>

              {/* Navigation Items with Rounded Pill Highlight */}
              <div className="flex flex-col space-y-1.5">
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item)}
                      className={`text-left px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? 'bg-white text-zinc-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.35)]'
                          : 'text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          active
                            ? 'bg-purple-950 text-purple-200'
                            : 'bg-purple-500/25 text-purple-200 border border-purple-400/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Account Section */}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                {!user ? (
                  <button
                    onClick={() => {
                      if (onOpenAuth) onOpenAuth('login');
                      else onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-purple-300" />
                    <span>Login / Account</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="px-4 py-2.5 text-xs font-mono text-zinc-300 flex items-center justify-between bg-white/[0.04] rounded-2xl border border-white/10">
                      <span className="truncate max-w-[200px]">{user.email}</span>
                      <span className="text-purple-300 font-bold uppercase">
                        {isAdmin ? '[Admin]' : '[Portal]'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('portal');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}

                {/* Currency Selector row */}
                <div className="pt-1 flex items-center justify-between bg-white/[0.04] px-4 py-2.5 rounded-2xl border border-white/10">
                  <span className="text-[11px] font-mono text-zinc-400">Currency:</span>
                  <CurrencySelector />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
        products={products}
        lessons={lessons}
      />
    </header>
  );
};

export default GlobalNavbar;
